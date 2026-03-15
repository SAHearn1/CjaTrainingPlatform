import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { Loader2, AlertCircle, CheckCircle2, KeyRound, Eye, EyeOff } from "lucide-react";
import { PasswordStrengthMeter } from "./SecurityBadge";
import { validatePassword } from "./security";
import { supabase } from "./supabaseClient";

const REDIRECT_DELAY_MS = 2500;
// If no PASSWORD_RECOVERY event fires within this window, show an expired-link
// message rather than spinning forever.
const TOKEN_TIMEOUT_MS = 12000;

export function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [tokenExpired, setTokenExpired] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Supabase appends the recovery token as a hash fragment; onAuthStateChange
  // fires with event "PASSWORD_RECOVERY" when it detects the token.
  useEffect(() => {
    // Start a timeout — if the event never fires the link is expired/invalid
    timeoutRef.current = setTimeout(() => setTokenExpired(true), TOKEN_TIMEOUT_MS);

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setSessionReady(true);
      }
    });
    return () => {
      subscription.unsubscribe();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleSubmit = async () => {
    setError(null);
    if (!password) { setError("Please enter a new password"); return; }
    if (password !== confirm) { setError("Passwords do not match"); return; }
    const validation = validatePassword(password);
    if (!validation.valid) {
      setError(validation.errors[0] || "Password does not meet requirements");
      return;
    }
    setSubmitting(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw new Error(updateError.message);
      setSuccess(true);
      setTimeout(() => navigate("/dashboard"), REDIRECT_DELAY_MS);
    } catch (e: any) {
      setError(e.message || "Failed to update password. Please request a new reset link.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-xl border border-border p-8">
        <div className="flex justify-center mb-5">
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "rgba(8,42,25,0.08)" }}>
            <KeyRound className="w-6 h-6" style={{ color: "#082A19" }} />
          </div>
        </div>
        <h2 className="text-center mb-2">Set New Password</h2>
        <p className="text-sm text-muted-foreground text-center mb-6">
          Choose a strong password for your account
        </p>

        {success ? (
          <div className="flex flex-col items-center gap-3 py-4">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
            <p className="text-sm font-medium text-green-800">Password updated successfully!</p>
            <p className="text-xs text-muted-foreground">Redirecting to your dashboard…</p>
          </div>
        ) : tokenExpired ? (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <AlertCircle className="w-10 h-10 text-red-500" />
            <p className="text-sm font-medium text-red-700">Reset link expired or invalid</p>
            <p className="text-xs text-muted-foreground">
              Password reset links expire after 1 hour and can only be used once.
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-2 px-4 py-2 rounded-lg text-sm bg-primary text-primary-foreground hover:opacity-90"
            >
              Request a new reset link
            </button>
          </div>
        ) : !sessionReady ? (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Verifying your reset link…</p>
          </div>
        ) : (
          <div className="space-y-4">
            {error && (
              <div role="alert" className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            <div>
              <label htmlFor="reset-new-password" className="block text-sm mb-1.5">New Password</label>
              <div className="relative">
                <input
                  id="reset-new-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a secure password"
                  className="w-full px-4 py-2.5 pr-10 rounded-lg bg-input-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <PasswordStrengthMeter password={password} />
            </div>
            <div>
              <label htmlFor="reset-confirm-password" className="block text-sm mb-1.5">Confirm Password</label>
              <div className="relative">
                <input
                  id="reset-confirm-password"
                  type={showConfirm ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Repeat your new password"
                  className="w-full px-4 py-2.5 pr-10 rounded-lg bg-input-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update Password"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
