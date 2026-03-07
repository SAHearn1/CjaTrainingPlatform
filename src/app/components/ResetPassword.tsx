import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { createClient } from "@supabase/supabase-js";
import { Loader2, AlertCircle, CheckCircle2, KeyRound } from "lucide-react";
import { PasswordStrengthMeter } from "./SecurityBadge";
import { validatePassword } from "./security";
import { projectId, publicAnonKey } from "/utils/supabase/info";

const supabase = createClient(`https://${projectId}.supabase.co`, publicAnonKey);

const REDIRECT_DELAY_MS = 2500;

export function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);

  // Supabase appends the recovery token as a hash fragment; onAuthStateChange
  // fires with event "PASSWORD_RECOVERY" when it detects the token.
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setSessionReady(true);
      }
    });
    return () => subscription.unsubscribe();
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
        ) : !sessionReady ? (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Verifying your reset link…</p>
            <p className="text-xs text-muted-foreground mt-2">
              If this takes too long,{" "}
              <button onClick={() => navigate("/")} className="text-primary hover:underline">
                request a new reset link
              </button>
              .
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            <div>
              <label className="block text-sm mb-1.5">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a secure password"
                className="w-full px-4 py-2.5 rounded-lg bg-input-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <PasswordStrengthMeter password={password} />
            </div>
            <div>
              <label className="block text-sm mb-1.5">Confirm Password</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repeat your new password"
                className="w-full px-4 py-2.5 rounded-lg bg-input-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
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
