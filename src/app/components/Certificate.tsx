import { MODULES, ROLE_LABELS } from "./data";
import {
  Award,
  Download,
  ExternalLink,
  CheckCircle2,
  Lock,
  Calendar,
  Clock,
  Hash,
} from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "./AuthContext";
import { useState, useEffect, useRef } from "react";
import { generateCertificate } from "./api";

export function Certificate() {
  const { profile, progress: userProgress, accessToken } = useAuth();
  const displayName = profile?.name || "Learner";
  const displayRole = profile?.role || "cpi";

  const completedModules = userProgress.filter((p) => p.status === "completed");
  const allCompleted = completedModules.length === MODULES.length;

  const [certId, setCertId] = useState<string | null>(null);
  const [certIssuedAt, setCertIssuedAt] = useState<string | null>(null);
  const certRef = useRef<HTMLDivElement>(null);

  function handleDownloadPDF() {
    const styleId = "rootwork-print-style";
    let style = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!style) {
      style = document.createElement("style");
      style.id = styleId;
      document.head.appendChild(style);
    }
    style.textContent = `
      @media print {
        body * { visibility: hidden !important; }
        #certificate-printable, #certificate-printable * { visibility: visible !important; }
        #certificate-printable { position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; background: white; z-index: 9999; }
        @page { size: landscape; margin: 1cm; }
      }
    `;
    window.print();
  }

  useEffect(() => {
    if (completedModules.length === 0 || !accessToken || certId) return;
    generateCertificate(accessToken)
      .then((data) => {
        setCertId(data.certificate?.certId ?? null);
        setCertIssuedAt(data.certificate?.issuedAt ?? null);
      })
      .catch((err) => console.error("Failed to load certificate:", err));
  }, [completedModules.length, accessToken]);

  const formattedDate = certIssuedAt
    ? new Date(certIssuedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "—";

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="mb-1">Certificates</h1>
        <p className="text-muted-foreground text-sm mb-8">
          Complete all 7 modules and pass final assessments to earn your certification
        </p>
      </motion.div>

      {/* Progress Overview */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-xl border border-border p-6 mb-8"
        style={{ borderLeft: "4px solid #C9A84C" }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3>Certification Progress</h3>
          <span className="text-sm text-muted-foreground">
            {completedModules.length}/{MODULES.length} modules completed
          </span>
        </div>
        <div className="grid grid-cols-6 gap-2 mb-4">
          {MODULES.map((mod) => {
            const prog = userProgress.find((p) => p.moduleId === mod.id);
            return (
              <div
                key={mod.id}
                className={`p-3 rounded-lg text-center ${!prog?.status || prog.status === "not_started" ? "bg-muted" : ""}`}
                style={prog?.status && prog.status !== "not_started" ? {
                  background: prog.status === "completed" ? "rgba(13,59,34,0.08)" : "rgba(28,77,54,0.08)",
                  border: prog.status === "completed" ? "1px solid rgba(13,59,34,0.15)" : "1px solid rgba(28,77,54,0.15)",
                } : undefined}
              >
                {prog?.status === "completed" ? (
                  <CheckCircle2 className="w-5 h-5 mx-auto mb-1" style={{ color: "#0D3B22" }} />
                ) : prog?.status === "in_progress" ? (
                  <Clock className="w-5 h-5 mx-auto mb-1" style={{ color: "#1C4D36" }} />
                ) : (
                  <Lock className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
                )}
                <p className="text-xs">M{mod.id}</p>
              </div>
            );
          })}
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${(completedModules.length / MODULES.length) * 100}%`, background: "#0D3B22" }}
          />
        </div>
      </motion.div>

      {/* Certificate Preview */}
      {completedModules.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="mb-4">
            {allCompleted ? "Your Certificate" : "Module Completion Certificates"}
          </h2>

          {/* Main Certificate — Evergreen + Gold design */}
          <div className="bg-card rounded-2xl overflow-hidden mb-6" style={{ border: "2px solid rgba(201,168,76,0.3)" }}>
            <div className="p-8 sm:p-12 text-center" style={{ background: "rgba(8,42,25,0.03)" }}>
              <div className="max-w-lg mx-auto">
                <div id="certificate-printable" ref={certRef} className="rounded-xl p-8 bg-white" style={{ border: "2px solid rgba(201,168,76,0.3)" }}>
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "rgba(201,168,76,0.12)" }}>
                      <Award className="w-8 h-8" style={{ color: "#C9A84C" }} />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground tracking-widest uppercase mb-2" style={{ letterSpacing: "0.14em", color: "#C9A84C" }}>
                    Certificate of Completion
                  </p>
                  <h2 className="mb-1" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                    RootWork Training Series
                  </h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Trauma-Informed Investigation Training
                  </p>

                  <p className="text-xs text-muted-foreground mb-1">This certifies that</p>
                  <p className="text-xl text-foreground mb-1" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{displayName}</p>
                  <p className="text-sm text-muted-foreground mb-6">
                    {ROLE_LABELS[displayRole] || displayRole}
                  </p>

                  <p className="text-xs text-muted-foreground mb-4">
                    has successfully completed {completedModules.length} of {MODULES.length} training modules
                    in the RootWork Trauma-Informed Investigation Training Series
                  </p>

                  <div className="pt-4 grid grid-cols-3 gap-4 text-center" style={{ borderTop: "1px solid rgba(201,168,76,0.2)" }}>
                    <div>
                      <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
                        <Calendar className="w-3 h-3" /> Date
                      </div>
                      <p className="text-xs">{formattedDate}</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
                        <Hash className="w-3 h-3" /> Certificate ID
                      </div>
                      <p className="text-xs font-mono">{certId ?? "—"}</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
                        <Clock className="w-3 h-3" /> CE Hours
                      </div>
                      <p className="text-xs">
                        {completedModules.length * 4} hours
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 flex justify-center gap-3 border-t border-border">
              <button onClick={handleDownloadPDF} className="px-5 py-2.5 bg-primary text-primary-foreground rounded-full text-sm hover:opacity-90 flex items-center gap-2">
                <Download className="w-4 h-4" /> Download PDF
              </button>
              <button className="px-5 py-2.5 border border-border rounded-full text-sm hover:bg-secondary flex items-center gap-2">
                <ExternalLink className="w-4 h-4" /> Verification Link
              </button>
            </div>
          </div>

          {/* Individual Module Certificates */}
          <h3 className="mb-3 text-sm">Individual Module Completions</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {MODULES.map((mod) => {
              const prog = userProgress.find((p) => p.moduleId === mod.id);
              const isCompleted = prog?.status === "completed";

              return (
                <div
                  key={mod.id}
                  className="p-4 rounded-xl border"
                  style={{
                    background: isCompleted ? "rgba(13,59,34,0.04)" : undefined,
                    borderColor: isCompleted ? "rgba(13,59,34,0.15)" : "var(--border)",
                  }}
                >
                  <div className="flex items-start gap-3">
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" style={{ color: "#0D3B22" }} />
                    ) : (
                      <Lock className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">Module {mod.id}</p>
                      <p className="text-sm truncate">{mod.title}</p>
                      {isCompleted && (
                        <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                          <span>Score: {prog?.postAssessmentScore}%</span>
                          <span>Completed: {prog?.completedDate}</span>
                        </div>
                      )}
                      {!isCompleted && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {prog?.status === "in_progress" ? "In progress" : "Not started"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}