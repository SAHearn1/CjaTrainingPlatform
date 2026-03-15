import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { useAuth } from "./AuthContext";
import * as api from "./api";
import { motion } from "motion/react";
import {
  CheckCircle2,
  Loader2,
  AlertCircle,
  ArrowRight,
  PartyPopper,
} from "lucide-react";

export function LicensingSuccess() {
  const { accessToken } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<"confirming" | "success" | "error">("confirming");
  const [license, setLicense] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId || !accessToken) return;
    let isMounted = true;
    async function runConfirm() {
      try {
        const res = await api.confirmLicense(accessToken!, sessionId!);
        if (isMounted) { setLicense(res.license); setStatus("success"); }
      } catch (e: any) {
        console.error("License confirmation failed:", e);
        if (isMounted) { setError(e.message); setStatus("error"); }
      }
    }
    runConfirm();
    return () => { isMounted = false; };
  }, [sessionId, accessToken]);

  if (!sessionId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <AlertCircle className="w-12 h-12 mb-4" style={{ color: "var(--destructive)" }} />
        <h2 className="text-xl font-bold mb-2" style={{ color: "var(--foreground)" }}>
          Invalid Session
        </h2>
        <p className="text-sm mb-6" style={{ color: "var(--muted-foreground)" }}>
          No checkout session ID found. Please try purchasing again.
        </p>
        <button
          onClick={() => navigate("/licensing")}
          className="px-6 py-2.5 rounded-lg font-semibold text-sm"
          style={{ backgroundColor: "var(--evergreen)", color: "var(--gold-leaf)" }}
        >
          Back to Licensing
        </button>
      </div>
    );
  }

  if (status === "confirming") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2
            className="w-12 h-12 animate-spin mx-auto mb-4"
            style={{ color: "var(--gold-leaf)" }}
          />
          <h2
            className="text-xl font-bold mb-2"
            style={{ fontFamily: "var(--font-display)", color: "var(--evergreen)" }}
          >
            Confirming Your Payment
          </h2>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
            Please wait while we activate your license...
          </p>
        </motion.div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <AlertCircle className="w-12 h-12 mb-4" style={{ color: "var(--destructive)" }} />
        <h2 className="text-xl font-bold mb-2" style={{ color: "var(--foreground)" }}>
          Confirmation Error
        </h2>
        <p className="text-sm mb-2" style={{ color: "var(--muted-foreground)" }}>
          {error || "Something went wrong confirming your payment."}
        </p>
        <p className="text-xs mb-6" style={{ color: "var(--muted-foreground)" }}>
          If you were charged, please contact support with session ID: {sessionId}
        </p>
        <button
          onClick={() => navigate("/licensing")}
          className="px-6 py-2.5 rounded-lg font-semibold text-sm"
          style={{ backgroundColor: "var(--evergreen)", color: "var(--gold-leaf)" }}
        >
          Back to Licensing
        </button>
      </div>
    );
  }

  // Success
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="text-center max-w-lg"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
          className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
          style={{ backgroundColor: "rgba(8,42,25,0.1)" }}
        >
          <CheckCircle2 className="w-10 h-10" style={{ color: "var(--mid-green)" }} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <PartyPopper className="w-5 h-5" style={{ color: "var(--gold-leaf)" }} />
            <span className="text-sm font-medium" style={{ color: "var(--gold-leaf)" }}>
              Payment Successful
            </span>
          </div>

          <h1
            className="text-2xl sm:text-3xl font-bold mb-3"
            style={{ fontFamily: "var(--font-display)", color: "var(--evergreen)" }}
          >
            License Activated!
          </h1>

          <p className="text-sm mb-6" style={{ color: "var(--muted-foreground)" }}>
            Your <strong>{license?.planName}</strong> has been activated
            {license?.orgName ? ` for ${license.orgName}` : ""}.
            {license?.quantity > 1 && ` (${license.quantity} seats)`}
          </p>

          <div
            className="p-4 rounded-lg mb-6 text-left"
            style={{ backgroundColor: "rgba(8,42,25,0.04)", border: "1px solid var(--border)" }}
          >
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                  Plan
                </p>
                <p className="font-medium" style={{ color: "var(--foreground)" }}>
                  {license?.planName}
                </p>
              </div>
              <div>
                <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                  Valid Until
                </p>
                <p className="font-medium" style={{ color: "var(--foreground)" }}>
                  {license?.expiresAt
                    ? new Date(license.expiresAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "—"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate("/dashboard")}
              className="px-6 py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
              style={{ backgroundColor: "var(--evergreen)", color: "var(--gold-leaf)" }}
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate("/modules")}
              className="px-6 py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-opacity hover:opacity-90 border"
              style={{
                borderColor: "var(--border)",
                color: "var(--foreground)",
                backgroundColor: "var(--card)",
              }}
            >
              Start Training
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
