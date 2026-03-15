import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { Award, CheckCircle2, AlertTriangle, Loader2, Calendar, Hash, Clock, Shield } from "lucide-react";
import { getCertificate } from "./api";

export function CertificateVerify() {
  const { certId } = useParams<{ certId: string }>();
  const [cert, setCert] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      if (!certId) {
        if (isMounted) { setError("No certificate ID provided"); setLoading(false); }
        return;
      }
      try {
        const data = await getCertificate(certId);
        if (!isMounted) return;
        if (data?.certificate) {
          setCert(data.certificate);
        } else {
          setError("Certificate not found");
        }
      } catch (e: any) {
        if (isMounted) setError(e.message || "Failed to look up certificate");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, [certId]);

  const formattedDate = cert?.issuedAt
    ? new Date(cert.issuedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "—";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "rgba(201,168,76,0.12)" }}>
            <Award className="w-8 h-8" style={{ color: "#C9A84C" }} />
          </div>
        </div>
        <h1 className="text-center text-2xl mb-1" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#082A19" }}>
          Certificate Verification
        </h1>
        <p className="text-center text-sm text-muted-foreground mb-8">
          RootWork Trauma-Informed Investigation Training
        </p>

        {loading && (
          <div className="flex items-center justify-center gap-3 py-12">
            <Loader2 className="w-6 h-6 animate-spin" style={{ color: "#C9A84C" }} />
            <span className="text-sm text-muted-foreground">Verifying certificate…</span>
          </div>
        )}

        {error && !loading && (
          <div className="bg-card rounded-2xl border border-border p-8 text-center">
            <AlertTriangle className="w-10 h-10 mx-auto mb-3 text-red-500" />
            <p className="font-medium mb-1">Certificate Not Found</p>
            <p className="text-sm text-muted-foreground mb-6">{error}</p>
            <Link to="/" className="text-sm text-primary hover:underline">Return to homepage</Link>
          </div>
        )}

        {cert && !loading && (
          <div className="bg-card rounded-2xl border-2 overflow-hidden" style={{ borderColor: "rgba(201,168,76,0.3)" }}>
            {/* Verified badge */}
            <div className="px-6 py-3 flex items-center gap-2" style={{ background: "rgba(13,59,34,0.06)", borderBottom: "1px solid rgba(201,168,76,0.15)" }}>
              <CheckCircle2 className="w-4 h-4" style={{ color: "#0D3B22" }} />
              <span className="text-sm font-medium" style={{ color: "#0D3B22" }}>Verified — This certificate is authentic</span>
            </div>

            <div className="p-8 text-center">
              <p className="text-xs tracking-widest uppercase mb-2" style={{ color: "#C9A84C", letterSpacing: "0.14em" }}>
                Certificate of Completion
              </p>
              <p className="text-xs text-muted-foreground mb-2">This certifies that</p>
              <p className="text-xl mb-1" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                {cert.learnerName || "—"}
              </p>
              <p className="text-sm text-muted-foreground mb-6">{cert.role || "Professional"}</p>
              <p className="text-xs text-muted-foreground mb-6">
                has successfully completed {cert.modulesCompleted} of {cert.totalModules} training modules
                in the RootWork Trauma-Informed Investigation Training Series
              </p>

              <div className="grid grid-cols-3 gap-4 pt-4 text-center" style={{ borderTop: "1px solid rgba(201,168,76,0.2)" }}>
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
                  <p className="text-xs font-mono break-all">{cert.certId}</p>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
                    <Clock className="w-3 h-3" /> CE Hours
                  </div>
                  <p className="text-xs">{(cert.modulesCompleted || 0) * 4} hours</p>
                </div>
              </div>
            </div>

            <div className="px-6 pb-5 flex items-start gap-2">
              <Shield className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#0D3B22" }} />
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                This certificate was issued by the GALS × RootWork Framework training platform and verified
                against our secure certificate registry. For questions contact your training coordinator.
              </p>
            </div>
          </div>
        )}

        <p className="text-center text-xs text-muted-foreground mt-6">
          <Link to="/" className="hover:underline">Return to RootWork Training Platform</Link>
        </p>
      </div>
    </div>
  );
}
