import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useAuth } from "./AuthContext";
import * as api from "./api";
import { motion, AnimatePresence } from "motion/react";
import {
  Building2,
  Users,
  MapPin,
  Landmark,
  Check,
  ArrowRight,
  Shield,
  Loader2,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  Clock,
  Star,
  Sparkles,
  ChevronDown,
} from "lucide-react";

interface LicensePlan {
  id: string;
  name: string;
  description: string;
  unitLabel: string;
  priceRange: string;
  defaultPrice: number;
  minSeats?: number;
  maxSeats?: number;
  allowQuantity: boolean;
}

interface License {
  planId: string;
  planName: string;
  quantity: number;
  orgName: string;
  amountPaid: number;
  status: string;
  purchasedAt: string;
  expiresAt: string;
}

const PLAN_ICONS: Record<string, React.ReactNode> = {
  org_seat: <Users className="w-7 h-7" />,
  department: <Building2 className="w-7 h-7" />,
  judicial_circuit: <MapPin className="w-7 h-7" />,
  statewide: <Landmark className="w-7 h-7" />,
};

const PLAN_FEATURES: Record<string, string[]> = {
  org_seat: [
    "Per-seat flexible pricing",
    "Organization admin dashboard",
    "Progress tracking per user",
    "Certificate generation",
    "Annual renewal",
  ],
  department: [
    "Unlimited users in one agency",
    "Centralized admin panel",
    "Bulk enrollment & reporting",
    "All 6 training modules",
    "Priority support",
  ],
  judicial_circuit: [
    "All circuit professionals covered",
    "Cross-agency coordination tools",
    "Circuit-wide analytics",
    "Customizable role assignments",
    "Dedicated onboarding",
  ],
  statewide: [
    "All regional offices included",
    "Enterprise admin dashboard",
    "Statewide compliance reporting",
    "Custom content integration",
    "Dedicated account manager",
  ],
};

const PLAN_BADGES: Record<string, string> = {
  org_seat: "Flexible",
  department: "Popular",
  judicial_circuit: "Best Value",
  statewide: "Enterprise",
};

export function Licensing() {
  const { user, accessToken } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [plans, setPlans] = useState<LicensePlan[]>([]);
  const [license, setLicense] = useState<License | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Per-seat plan state
  const [seatCount, setSeatCount] = useState(10);
  const [orgName, setOrgName] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  // FAQ accordion
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const canceled = searchParams.get("canceled") === "true";

  useEffect(() => {
    loadData();
  }, [accessToken]);

  async function loadData() {
    setLoading(true);
    try {
      const [plansRes, licenseRes] = await Promise.all([
        api.getLicensePlans(),
        accessToken ? api.getLicenseStatus(accessToken) : Promise.resolve({ license: null }),
      ]);
      setPlans(plansRes.plans || []);
      setLicense(licenseRes.license || null);
    } catch (e: any) {
      console.error("Failed to load licensing data:", e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCheckout(planId: string) {
    if (!user || !accessToken) {
      navigate("/");
      return;
    }
    setCheckoutLoading(planId);
    setError(null);
    try {
      const currentOrigin = window.location.origin;
      const res = await api.createCheckoutSession(accessToken, {
        planId,
        quantity: planId === "org_seat" ? seatCount : 1,
        orgName,
        successUrl: `${currentOrigin}/licensing/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${currentOrigin}/licensing?canceled=true`,
      });
      if (res.url) {
        window.location.href = res.url;
      } else {
        setError("No checkout URL returned from server");
      }
    } catch (e: any) {
      console.error("Checkout error:", e);
      setError(e.message);
    } finally {
      setCheckoutLoading(null);
    }
  }

  function formatCents(cents: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(cents / 100);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--gold-leaf)" }} />
      </div>
    );
  }

  // If user has active license, show status
  if (license && license.status === "active") {
    return <LicenseActive license={license} formatCents={formatCents} />;
  }

  const faqs = [
    {
      q: "What happens after my annual license expires?",
      a: "You'll receive renewal reminders 60 and 30 days before expiration. Access continues uninterrupted if you renew within the grace period. Training progress and certificates are preserved regardless of license status.",
    },
    {
      q: "Can I upgrade my license tier mid-year?",
      a: "Yes. Contact our team and we'll prorate the difference between your current plan and the upgraded tier for the remaining term.",
    },
    {
      q: "How does the seat license work for organizations?",
      a: "Each seat allows one named user to access the full training platform. An organization admin can manage seat assignments, add/remove users, and track progress across all seats from the admin dashboard.",
    },
    {
      q: "Is there a free trial available?",
      a: "We offer a 14-day trial with access to Module 1 for evaluation purposes. Contact us for enterprise pilot programs covering the full curriculum.",
    },
    {
      q: "What payment methods are accepted?",
      a: "We accept all major credit/debit cards via our secure Stripe payment processing. For statewide and judicial circuit licenses, we also accept purchase orders and wire transfers.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-4"
          style={{ backgroundColor: "rgba(201,168,76,0.12)", color: "var(--gold-text)" }}
        >
          <Shield className="w-4 h-4" />
          Secure Stripe Payment Processing
        </div>
        <h1
          className="text-3xl sm:text-4xl font-bold mb-3"
          style={{ fontFamily: "var(--font-display)", color: "var(--evergreen)" }}
        >
          Training License Plans
        </h1>
        <p className="text-lg max-w-2xl mx-auto" style={{ color: "var(--muted-foreground)" }}>
          Choose the licensing model that fits your organization. All plans include full access
          to the RootWork Trauma-Informed Investigation curriculum.
        </p>
      </motion.div>

      {/* Canceled notice */}
      <AnimatePresence>
        {canceled && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-8 p-4 rounded-lg border flex items-center gap-3"
            style={{
              borderColor: "var(--gold-leaf)",
              backgroundColor: "rgba(201,168,76,0.08)",
            }}
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: "var(--gold-leaf)" }} />
            <p style={{ color: "var(--foreground)" }}>
              Checkout was canceled. Feel free to select a plan when you're ready.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      {error && (
        <div
          className="mb-8 p-4 rounded-lg border flex items-center gap-3"
          style={{
            borderColor: "var(--destructive)",
            backgroundColor: "rgba(220,38,38,0.06)",
          }}
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: "var(--destructive)" }} />
          <p style={{ color: "var(--destructive)" }}>{error}</p>
        </div>
      )}

      {/* Organization name input */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-md mx-auto mb-10"
      >
        <label
          htmlFor="licensing-org-name"
          className="block text-sm font-medium mb-2"
          style={{ color: "var(--foreground)" }}
        >
          Organization / Agency Name
        </label>
        <input
          id="licensing-org-name"
          type="text"
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
          placeholder="e.g. Fulton County DFCS"
          className="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 transition-colors"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--input-background)",
            color: "var(--foreground)",
            // @ts-ignore
            "--tw-ring-color": "var(--gold-leaf)",
          }}
        />
      </motion.div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-16">
        {plans.map((plan, idx) => {
          const isPopular = plan.id === "department";
          const isSelected = selectedPlan === plan.id;
          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + idx * 0.08 }}
              onClick={() => setSelectedPlan(plan.id)}
              className={`relative rounded-xl border-2 p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                isSelected ? "shadow-lg" : ""
              }`}
              style={{
                borderColor: isSelected
                  ? "var(--gold-leaf)"
                  : isPopular
                  ? "var(--mid-green)"
                  : "var(--border)",
                backgroundColor: isSelected
                  ? "rgba(201,168,76,0.04)"
                  : "var(--card)",
              }}
            >
              {/* Badge */}
              <div
                className="absolute -top-3 left-4 px-3 py-0.5 rounded-full text-xs font-bold tracking-wide uppercase"
                style={{
                  backgroundColor: isPopular ? "var(--gold-leaf)" : "var(--evergreen)",
                  color: isPopular ? "var(--evergreen)" : "var(--gold-leaf)",
                }}
              >
                {PLAN_BADGES[plan.id]}
              </div>

              {/* Icon */}
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 mt-2"
                style={{
                  backgroundColor: "rgba(8,42,25,0.08)",
                  color: "var(--evergreen)",
                }}
              >
                {PLAN_ICONS[plan.id]}
              </div>

              {/* Plan name */}
              <h3
                className="text-lg font-bold mb-1"
                style={{ fontFamily: "var(--font-display)", color: "var(--evergreen)" }}
              >
                {plan.name}
              </h3>

              {/* Price range */}
              <div className="mb-3">
                <span
                  className="text-2xl font-bold"
                  style={{ color: "var(--gold-leaf)", fontFamily: "var(--font-display)" }}
                >
                  {formatCents(plan.defaultPrice)}
                </span>
                <span className="text-sm ml-1" style={{ color: "var(--muted-foreground)" }}>
                  /{plan.allowQuantity ? "seat/" : ""}year
                </span>
              </div>

              <p className="text-sm mb-2" style={{ color: "var(--muted-foreground)" }}>
                Range: {plan.priceRange}
              </p>

              <p className="text-sm mb-5" style={{ color: "var(--foreground)" }}>
                {plan.description}
              </p>

              {/* Seat selector for org_seat */}
              {plan.allowQuantity && isSelected && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mb-5"
                >
                  <label
                    htmlFor="licensing-seat-count"
                    className="block text-xs font-medium mb-1.5"
                    style={{ color: "var(--foreground)" }}
                  >
                    Number of Seats
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      id="licensing-seat-count"
                      type="range"
                      min={1}
                      max={100}
                      value={seatCount}
                      onChange={(e) => setSeatCount(Number(e.target.value))}
                      className="flex-1 accent-[var(--gold-leaf)]"
                    />
                    <input
                      type="number"
                      min={1}
                      max={500}
                      value={seatCount}
                      onChange={(e) => setSeatCount(Math.max(1, Number(e.target.value)))}
                      className="w-16 px-2 py-1 rounded border text-center text-sm"
                      style={{
                        borderColor: "var(--border)",
                        backgroundColor: "var(--input-background)",
                        color: "var(--foreground)",
                      }}
                    />
                  </div>
                  <p className="text-xs mt-1.5 font-medium" style={{ color: "var(--gold-leaf)" }}>
                    Total: {formatCents(plan.defaultPrice * seatCount)}/year
                  </p>
                </motion.div>
              )}

              {/* Features */}
              <ul className="space-y-2 mb-6">
                {(PLAN_FEATURES[plan.id] || []).map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check
                      className="w-4 h-4 flex-shrink-0 mt-0.5"
                      style={{ color: "var(--mid-green)" }}
                    />
                    <span style={{ color: "var(--foreground)" }}>{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCheckout(plan.id);
                }}
                disabled={checkoutLoading !== null}
                className="w-full py-3 px-4 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 hover:opacity-90 disabled:opacity-50"
                style={{
                  backgroundColor: isSelected ? "var(--gold-leaf)" : "var(--evergreen)",
                  color: isSelected ? "var(--evergreen)" : "var(--primary-foreground)",
                }}
              >
                {checkoutLoading === plan.id ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Preparing Checkout...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    Purchase License
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Trust signals */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16"
      >
        {[
          {
            icon: <Shield className="w-6 h-6" />,
            title: "Secure Payments",
            desc: "256-bit SSL encryption via Stripe. PCI DSS Level 1 compliant.",
          },
          {
            icon: <Star className="w-6 h-6" />,
            title: "Satisfaction Guarantee",
            desc: "30-day money-back guarantee on all license tiers.",
          },
          {
            icon: <Sparkles className="w-6 h-6" />,
            title: "Instant Access",
            desc: "Full platform access activated immediately upon payment.",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="flex items-start gap-4 p-5 rounded-xl"
            style={{ backgroundColor: "rgba(8,42,25,0.04)" }}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "rgba(201,168,76,0.15)", color: "var(--gold-text)" }}
            >
              {item.icon}
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-1" style={{ color: "var(--evergreen)" }}>
                {item.title}
              </h4>
              <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* FAQ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="max-w-3xl mx-auto mb-12"
      >
        <h2
          className="text-2xl font-bold text-center mb-8"
          style={{ fontFamily: "var(--font-display)", color: "var(--evergreen)" }}
        >
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-lg border overflow-hidden"
              style={{ borderColor: "var(--border)" }}
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left text-sm font-medium hover:bg-[rgba(0,0,0,0.02)] transition-colors"
                style={{ color: "var(--foreground)" }}
              >
                {faq.q}
                <ChevronDown
                  className={`w-4 h-4 flex-shrink-0 ml-2 transition-transform ${
                    openFaq === i ? "rotate-180" : ""
                  }`}
                  style={{ color: "var(--muted-foreground)" }}
                />
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div
                      className="px-4 pb-4 text-sm"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Contact CTA */}
      <div
        className="text-center p-8 rounded-xl"
        style={{ backgroundColor: "var(--evergreen)" }}
      >
        <h3
          className="text-xl font-bold mb-2"
          style={{ fontFamily: "var(--font-display)", color: "var(--gold-leaf)" }}
        >
          Need a Custom Arrangement?
        </h3>
        <p className="text-sm mb-4" style={{ color: "rgba(242,244,202,0.75)" }}>
          For multi-circuit bundles, multi-year contracts, or custom pricing, reach out to our
          partnerships team.
        </p>
        <a
          href="mailto:licensing@rootworkfw.org"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-sm transition-opacity hover:opacity-90"
          style={{ backgroundColor: "var(--gold-leaf)", color: "var(--evergreen)" }}
        >
          Contact Partnerships
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}

/* ---------- Active License Status Card ---------- */

function LicenseActive({
  license,
  formatCents,
}: {
  license: License;
  formatCents: (c: number) => string;
}) {
  const [now] = useState<number>(() => Date.now());
  const purchasedDate = new Date(license.purchasedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const expiresDate = new Date(license.expiresAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const daysRemaining = Math.max(
    0,
    Math.ceil((new Date(license.expiresAt).getTime() - now) / (1000 * 60 * 60 * 24))
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-xl border-2 overflow-hidden"
        style={{ borderColor: "var(--gold-leaf)" }}
      >
        {/* Header */}
        <div className="p-6" style={{ backgroundColor: "var(--evergreen)" }}>
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 className="w-7 h-7" style={{ color: "var(--gold-leaf)" }} />
            <h2
              className="text-xl font-bold"
              style={{ fontFamily: "var(--font-display)", color: "var(--gold-leaf)" }}
            >
              Active License
            </h2>
          </div>
          <p className="text-sm" style={{ color: "rgba(242,244,202,0.75)" }}>
            Your training platform access is fully activated.
          </p>
        </div>

        {/* Details */}
        <div className="p-6 space-y-4" style={{ backgroundColor: "var(--card)" }}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium mb-1" style={{ color: "var(--muted-foreground)" }}>
                License Type
              </p>
              <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                {license.planName}
              </p>
            </div>
            {license.orgName && (
              <div>
                <p className="text-xs font-medium mb-1" style={{ color: "var(--muted-foreground)" }}>
                  Organization
                </p>
                <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                  {license.orgName}
                </p>
              </div>
            )}
            {license.quantity > 1 && (
              <div>
                <p className="text-xs font-medium mb-1" style={{ color: "var(--muted-foreground)" }}>
                  Seats
                </p>
                <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                  {license.quantity}
                </p>
              </div>
            )}
            <div>
              <p className="text-xs font-medium mb-1" style={{ color: "var(--muted-foreground)" }}>
                Amount Paid
              </p>
              <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                {formatCents(license.amountPaid)}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium mb-1" style={{ color: "var(--muted-foreground)" }}>
                Purchased
              </p>
              <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                {purchasedDate}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium mb-1" style={{ color: "var(--muted-foreground)" }}>
                Expires
              </p>
              <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                {expiresDate}
              </p>
            </div>
          </div>

          {/* Days remaining bar */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--muted-foreground)" }}>
                <Clock className="w-3.5 h-3.5" />
                {daysRemaining} days remaining
              </div>
              <span className="text-xs font-medium" style={{ color: "var(--mid-green)" }}>
                {Math.round((daysRemaining / 365) * 100)}%
              </span>
            </div>
            <div
              className="h-2 rounded-full overflow-hidden"
              style={{ backgroundColor: "var(--muted)" }}
            >
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${Math.round((daysRemaining / 365) * 100)}%`,
                  backgroundColor: daysRemaining > 60 ? "var(--mid-green)" : "var(--gold-leaf)",
                }}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
