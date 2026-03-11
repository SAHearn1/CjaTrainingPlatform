import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { type Session, type User } from "@supabase/supabase-js";
import { supabase } from "./supabaseClient";
import * as api from "./api";

export interface UserProfile {
  userId: string;
  name: string;
  email: string;
  role: string;
  joinedAt?: string;
  selectedState?: string;
}

export interface ModuleProgress {
  moduleId: number;
  preAssessmentScore: number | null;
  postAssessmentScore: number | null;
  sectionsCompleted: string[];
  scenariosCompleted: string[];
  timeSpent: number;
  status: "not_started" | "in_progress" | "completed";
  completedDate: string | null;
}

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  accessToken: string | null;
  loading: boolean;
  progress: ModuleProgress[];
  watchedVignettes: string[];
  licenseActive: boolean;

  signUp: (email: string, password: string, name: string) => Promise<{ needsConfirmation?: boolean }>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;

  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  updateModuleProgress: (moduleId: number, data: Partial<ModuleProgress>) => Promise<void>;
  markVignetteWatched: (key: string) => Promise<void>;
  unmarkVignetteWatched: (key: string) => Promise<void>;
  saveSimulationResult: (data: Record<string, any>) => Promise<void>;
  refreshProgress: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<ModuleProgress[]>([]);
  const [watchedVignettes, setWatchedVignettes] = useState<string[]>([]);
  const [licenseActive, setLicenseActive] = useState(false);

  // Guard: prevent onAuthStateChange from calling loadUserData with a stale
  // token before initSession has had a chance to refresh it.
  const initCompleteRef = useRef(false);
  // Guard: prevent concurrent/re-entrant loadUserData calls
  const loadingUserDataRef = useRef(false);

  // Load session on mount
  useEffect(() => {
    let isMounted = true;

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;

        if (session) {
          setUser(session.user);
          setAccessToken(session.access_token);

          // Only load data for user-initiated sign-ins or token refreshes
          // AFTER the initial session bootstrap is complete.
          // During the first page load, initSession handles everything with
          // a force-refreshed token so we don't use a stale JWT here.
          // Only reload user data on explicit sign-in; token refreshes just
          // update the stored token (already set above) without re-fetching data.
          if (initCompleteRef.current && event === "SIGNED_IN") {
            loadUserData(session.access_token);
          }
        } else {
          setUser(null);
          setProfile(null);
          setAccessToken(null);
          setProgress([]);
          setWatchedVignettes([]);
          setLicenseActive(false);
          if (isMounted) setLoading(false);
        }
      }
    );

    // On mount, force-refresh the session so we always get a valid JWT
    const initSession = async () => {
      try {
        // First check if there's any session at all
        const { data: current } = await supabase.auth.getSession();
        if (!current?.session) {
          initCompleteRef.current = true;
          if (isMounted) setLoading(false);
          return;
        }

        // Force refresh to get a non-expired access token
        const { data: refreshed, error } = await supabase.auth.refreshSession();
        if (error || !refreshed?.session) {
          console.warn("Session refresh failed, signing out:", error?.message);
          await supabase.auth.signOut();
          initCompleteRef.current = true;
          if (isMounted) setLoading(false);
          return;
        }

        // Use the freshly refreshed token
        const freshToken = refreshed.session.access_token;
        if (isMounted) {
          setUser(refreshed.session.user);
          setAccessToken(freshToken);
          await loadUserData(freshToken);
          initCompleteRef.current = true;
          if (isMounted) setLoading(false);
        }
      } catch (e) {
        console.error("Auth init error:", e);
        initCompleteRef.current = true;
        if (isMounted) setLoading(false);
      }
    };

    initSession();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const loadUserData = async (token: string) => {
    // Prevent concurrent/re-entrant calls (avoids 401 → refreshSession → TOKEN_REFRESHED loop)
    if (loadingUserDataRef.current) return;
    // Validate token looks like a JWT (3 dot-separated parts) before making requests
    if (!token || token.split(".").length !== 3) {
      console.warn("loadUserData called with invalid token, skipping");
      return;
    }
    loadingUserDataRef.current = true;
    try {
      // Fetch profile, progress, vignettes, and license status in parallel
      const [profileRes, progressRes, vignettesRes, licenseRes] = await Promise.allSettled([
        api.getProfile(token),
        api.getProgress(token),
        api.getVignettes(token),
        api.getLicenseStatus(token),
      ]);

      if (profileRes.status === "fulfilled" && profileRes.value?.profile) {
        setProfile(profileRes.value.profile);
      }
      if (progressRes.status === "fulfilled") {
        setProgress(progressRes.value?.progress || []);
      }
      if (vignettesRes.status === "fulfilled") {
        setWatchedVignettes(vignettesRes.value?.watched || []);
      }
      if (licenseRes.status === "fulfilled") {
        const lic = licenseRes.value?.license;
        const active = lic?.status === "active" &&
          (!lic?.expiresAt || new Date(lic.expiresAt) > new Date());
        setLicenseActive(active);
      }

      // If all failed, try refreshing the session once
      const allFailed = [profileRes, progressRes, vignettesRes].every(
        (r) => r.status === "rejected"
      );
      if (allFailed) {
        console.warn("All user data requests failed, attempting session refresh...");
        const { data, error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError || !data?.session) {
          // Refresh failed — session is unrecoverable, sign out
          console.warn("Session refresh failed, signing out:", refreshError?.message);
          await supabase.auth.signOut();
          return;
        }
        const retryToken = data.session.access_token;
        setAccessToken(retryToken);
        const [p2, pr2, v2] = await Promise.allSettled([
          api.getProfile(retryToken),
          api.getProgress(retryToken),
          api.getVignettes(retryToken),
        ]);
        if (p2.status === "fulfilled" && p2.value?.profile) setProfile(p2.value.profile);
        if (pr2.status === "fulfilled") setProgress(pr2.value?.progress || []);
        if (v2.status === "fulfilled") setWatchedVignettes(v2.value?.watched || []);
        // If still failing after refresh, sign out to prevent an infinite loop
        const stillFailed = [p2, pr2, v2].every((r) => r.status === "rejected");
        if (stillFailed) {
          console.warn("User data still unavailable after refresh, signing out");
          await supabase.auth.signOut();
        }
      }
    } catch (e) {
      console.error("Error loading user data:", e);
    } finally {
      loadingUserDataRef.current = false;
    }
  };

  const handleSession = async (session: Session) => {
    setUser(session.user);
    setAccessToken(session.access_token);
    await loadUserData(session.access_token);
  };

  const signUp = useCallback(async (email: string, password: string, name: string): Promise<{ needsConfirmation?: boolean }> => {
    // Create user via server (uses admin API) — if user already exists, fall back to sign-in
    let userAlreadyExisted = false;
    try {
      await api.signUp(email, password, name);
    } catch (e: any) {
      const msg = e?.message || "";
      // If user already exists, that's fine — we'll just sign in below
      if (!msg.includes("already") && !msg.includes("Already")) {
        throw e;
      }
      userAlreadyExisted = true;
      console.log("User already exists, falling back to sign-in");
    }

    // Attempt to sign in immediately. For new users with email confirmation enabled,
    // this will fail with "Email not confirmed" — surface that as needsConfirmation.
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      const msg = error.message?.toLowerCase() || "";
      // Email not yet confirmed — tell the UI to show the "check your email" screen
      if (msg.includes("email not confirmed") || msg.includes("email_not_confirmed")) {
        return { needsConfirmation: true };
      }
      throw new Error(`Sign-in after signup failed: ${error.message}`);
    }

    if (data?.session) {
      await handleSession(data.session);
      // Ensure profile exists (for existing users or auto-confirmed accounts)
      try {
        const { profile: existingProfile } = await api.getProfile(data.session.access_token);
        if (existingProfile) {
          setProfile(existingProfile);
        } else {
          await api.updateProfile(data.session.access_token, { name, email });
          const { profile: p } = await api.getProfile(data.session.access_token);
          if (p) setProfile(p);
        }
      } catch {
        await api.updateProfile(data.session.access_token, { name, email });
        const { profile: p } = await api.getProfile(data.session.access_token);
        if (p) setProfile(p);
      }
    }

    return {};
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(`Sign-in failed: ${error.message}`);
    if (data?.session) {
      await handleSession(data.session);
    }
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setAccessToken(null);
    setProgress([]);
    setWatchedVignettes([]);
    setLicenseActive(false);
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw new Error(error.message);
  }, []);

  const updateProfileFn = useCallback(async (data: Partial<UserProfile>) => {
    if (!accessToken) return;
    const { profile: p } = await api.updateProfile(accessToken, data);
    if (p) setProfile(p);
  }, [accessToken]);

  const updateModuleProgress = useCallback(async (moduleId: number, data: Partial<ModuleProgress>) => {
    if (!accessToken) return;
    const { progress: p } = await api.updateProgress(accessToken, moduleId, data);
    setProgress((prev) => {
      const filtered = prev.filter((pr) => pr.moduleId !== moduleId);
      return [...filtered, p];
    });
  }, [accessToken]);

  const markVignetteWatched = useCallback(async (key: string) => {
    const updated = [...new Set([...watchedVignettes, key])];
    setWatchedVignettes(updated);
    if (accessToken) {
      try {
        await api.updateVignettes(accessToken, updated);
      } catch (e) {
        console.error("Failed to persist vignette watch state:", e);
      }
    }
  }, [accessToken, watchedVignettes]);

  const unmarkVignetteWatched = useCallback(async (key: string) => {
    const updated = watchedVignettes.filter((k) => k !== key);
    setWatchedVignettes(updated);
    if (accessToken) {
      try {
        await api.updateVignettes(accessToken, updated);
      } catch (e) {
        console.error("Failed to persist vignette unwatch state:", e);
      }
    }
  }, [accessToken, watchedVignettes]);

  const saveSimulationResult = useCallback(async (data: Record<string, any>) => {
    if (!accessToken) return;
    await api.saveSimulation(accessToken, data);
  }, [accessToken]);

  const refreshProgress = useCallback(async () => {
    if (!accessToken) return;
    try {
      const { progress: prog } = await api.getProgress(accessToken);
      setProgress(prog || []);
    } catch (e) {
      console.error("Failed to refresh progress:", e);
    }
  }, [accessToken]);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        accessToken,
        loading,
        progress,
        watchedVignettes,
        licenseActive,
        signUp,
        signIn,
        signOut,
        resetPassword,
        updateProfile: updateProfileFn,
        updateModuleProgress,
        markVignetteWatched,
        unmarkVignetteWatched,
        saveSimulationResult,
        refreshProgress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}