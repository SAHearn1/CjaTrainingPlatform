/**
 * LegalPages.tsx — Privacy Policy, Terms of Service, Security, Accessibility
 *
 * These are public pages (no auth required) linked from the platform footer.
 * Content is owner-reviewed placeholder text; replace with counsel-approved
 * language before public launch. (#130)
 */

import { Link } from "react-router";
import { motion } from "motion/react";
import { Shield, FileText, Lock, Eye, ArrowLeft, TreePine } from "lucide-react";

function LegalLayout({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="border-b border-border bg-card">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <div className="flex items-center gap-2">
            <TreePine className="w-4 h-4" style={{ color: "#C9A84C" }} />
            <span className="text-sm" style={{ color: "#C9A84C", fontFamily: "'Playfair Display', Georgia, serif" }}>RootWork</span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(201,168,76,0.12)" }}>
              <Icon className="w-5 h-5" style={{ color: "#C9A84C" }} />
            </div>
            <h1 className="text-2xl" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{title}</h1>
          </div>
          <p className="text-xs text-muted-foreground mb-8">
            Last updated: March 2026 · RootWork Training Platform · GALS × RWFW
          </p>
          <div className="prose prose-sm max-w-none space-y-6 text-sm text-foreground/80 leading-relaxed">
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-base font-semibold text-foreground mb-2">{title}</h2>
      {children}
    </section>
  );
}

// ── Privacy Policy ─────────────────────────────────────────────────────────

export function PrivacyPolicy() {
  return (
    <LegalLayout title="Privacy Policy" icon={Eye}>
      <p>
        RootWork Training Platform is operated by GALS × RWFW (collectively, "we," "us," or "our"). This Privacy
        Policy describes how we collect, use, and protect information in connection with the platform.
      </p>

      <Section title="Information We Collect">
        <p>
          We collect information you provide directly: your name, professional email address, and occupational role
          when you register. We also collect training progress data — module completion status, assessment scores,
          and simulation results — solely to power your learning experience and generate completion certificates.
        </p>
        <p className="mt-2">
          We do not collect case data, personally identifiable information about third parties, or sensitive criminal
          justice information. This platform is a <strong>training environment</strong>, not a case management system.
        </p>
      </Section>

      <Section title="CJIS Compliance">
        <p>
          This platform operates in accordance with the FBI Criminal Justice Information Services (CJIS) Security
          Policy v5.9.5. All data is encrypted at rest using AES-256-GCM. Access is controlled by role-based
          access controls (RBAC) and all significant system events are written to a tamper-evident audit log.
        </p>
      </Section>

      <Section title="Data Retention">
        <p>
          Training records and certificates are retained for the duration of your active account. You may request
          deletion of your account and all associated training data by contacting your agency administrator or
          platform support.
        </p>
      </Section>

      <Section title="Data Sharing">
        <p>
          We do not sell your data. Training completion data may be visible to your agency supervisor if your
          organization has enabled supervisor-tier reporting. We share data with service providers (Supabase for
          data storage, Vercel for hosting) only as necessary to operate the platform under data processing agreements.
        </p>
      </Section>

      <Section title="Contact">
        <p>
          For privacy questions or data requests, contact your agency administrator or reach us at the address
          listed in your agency's platform service agreement.
        </p>
      </Section>

      <p className="text-xs text-muted-foreground border-t border-border pt-4">
        This policy is a working draft pending final legal review. It will be replaced with counsel-approved language
        before general availability.
      </p>
    </LegalLayout>
  );
}

// ── Terms of Service ────────────────────────────────────────────────────────

export function TermsOfService() {
  return (
    <LegalLayout title="Terms of Service" icon={FileText}>
      <p>
        By accessing the RootWork Training Platform, you agree to these Terms of Service. If you do not agree,
        do not use the platform.
      </p>

      <Section title="Authorized Use">
        <p>
          This platform is authorized for use by criminal justice professionals, child protective investigators,
          medical professionals, educators, and other mandated reporters who have been granted access by their
          agency or organization. Access credentials are personal and non-transferable.
        </p>
      </Section>

      <Section title="Training Purpose Only">
        <p>
          Content on this platform — including modules, assessments, simulations, and scenario materials — is
          provided for <strong>professional development and training purposes only</strong>. It does not constitute
          legal advice. Consult applicable statutes, departmental policy, and legal counsel for authoritative guidance.
        </p>
      </Section>

      <Section title="Acceptable Use">
        <p>
          You agree not to: share login credentials, attempt to access data of other users, use the platform
          to process live case data, reverse-engineer any portion of the platform, or use training content outside
          of your authorized professional context.
        </p>
      </Section>

      <Section title="Intellectual Property">
        <p>
          The RootWork 5Rs framework, TRACE cognitive cycle, course content, scenario narratives, and platform
          design are proprietary to GALS × RWFW. All rights reserved. Training materials may not be reproduced,
          distributed, or adapted without written authorization.
        </p>
      </Section>

      <Section title="Limitation of Liability">
        <p>
          The platform is provided "as is" for training purposes. We make no warranty regarding completeness or
          fitness for any specific operational purpose. In no event shall GALS × RWFW be liable for decisions
          made in the field based on platform training content.
        </p>
      </Section>

      <p className="text-xs text-muted-foreground border-t border-border pt-4">
        This is a working draft pending final legal review.
      </p>
    </LegalLayout>
  );
}

// ── Security ────────────────────────────────────────────────────────────────

export function SecurityPage() {
  return (
    <LegalLayout title="Security" icon={Lock}>
      <p>
        The RootWork Training Platform is designed and operated in accordance with the FBI Criminal Justice
        Information Services (CJIS) Security Policy v5.9.5. Below is a summary of our security posture.
      </p>

      <Section title="Encryption">
        <p>
          All sensitive data at rest is encrypted using <strong>AES-256-GCM</strong> with keys derived via
          PBKDF2 (100,000 iterations, SHA-256). Data in transit is protected by TLS 1.2+. Source maps are
          generated but not publicly exposed (Sentry-only access for stack trace de-minification).
        </p>
      </Section>

      <Section title="Authentication & Access Control">
        <p>
          Authentication is handled by Supabase Auth. The platform enforces a four-tier RBAC model:
          learner → supervisor → admin → superadmin. All routes and API endpoints verify role permissions
          before serving data. Sessions are subject to CJIS 5.5.5 inactivity timeout (30 minutes) and
          absolute session limits.
        </p>
      </Section>

      <Section title="Audit Logging">
        <p>
          All significant system events (login, profile updates, certificate generation, admin actions,
          password changes) are written to an immutable audit log. Each entry carries an HMAC-SHA256
          integrity fingerprint for tamper detection, per CJIS 5.4.1.1.
        </p>
      </Section>

      <Section title="Password Policy">
        <p>
          Passwords must be at least 8 characters and contain uppercase, lowercase, numeric, and special
          characters per CJIS 5.6.2.1. Common passwords are rejected. Passwords may be changed in-app
          via Settings after verifying the current credential.
        </p>
      </Section>

      <Section title="Vulnerability Disclosure">
        <p>
          To report a security vulnerability, contact your agency's platform administrator or the platform
          security team via the address in your service agreement. Please do not disclose security issues
          publicly before coordinated remediation.
        </p>
      </Section>
    </LegalLayout>
  );
}

// ── Accessibility ────────────────────────────────────────────────────────────

export function AccessibilityStatement() {
  return (
    <LegalLayout title="Accessibility Statement" icon={Shield}>
      <p>
        GALS × RWFW is committed to ensuring the RootWork Training Platform is accessible to all professionals,
        including those with disabilities. We target conformance with <strong>WCAG 2.1 Level AA</strong>.
      </p>

      <Section title="Current Accessibility Features">
        <ul className="list-disc pl-5 space-y-1">
          <li>Skip-to-main-content link on all authenticated pages (WCAG 2.4.1)</li>
          <li>Focus management on route transitions (WCAG 2.4.3)</li>
          <li>All interactive controls have accessible labels via <code>aria-label</code> or associated <code>htmlFor</code></li>
          <li>Keyboard navigation support for modals, sidebars, and form controls</li>
          <li>Text-to-speech (TTS) controls on all module content, assessments, and key terms</li>
          <li>Adjustable playback speed (0.5×–2×) for audio content</li>
          <li>High-contrast color palette; dark mode available</li>
          <li>Semantic heading hierarchy throughout</li>
        </ul>
      </Section>

      <Section title="Known Limitations">
        <p>
          Some complex data visualizations (admin analytics charts) rely on color differentiation without
          sufficient text alternatives. This is tracked and scheduled for remediation in a future release.
          Scenario simulation animations may not be fully usable with screen readers; a text-only simulation
          mode is planned.
        </p>
      </Section>

      <Section title="Feedback & Accommodation Requests">
        <p>
          If you encounter an accessibility barrier or need an accommodation to access training content,
          contact your agency administrator or reach us via your service agreement. We aim to respond to
          accessibility requests within 5 business days.
        </p>
      </Section>

      <Section title="Standards Reference">
        <p>
          This statement references WCAG 2.1 (ISO/IEC 40500:2012), Section 508 of the Rehabilitation Act,
          and ADA Title II requirements applicable to government-adjacent training platforms.
        </p>
      </Section>
    </LegalLayout>
  );
}
