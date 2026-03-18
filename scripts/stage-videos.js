/**
 * stage-videos.js
 * ---------------
 * Browser console script to bulk-stage InVideo draft URLs into the platform
 * video registry with status "in_review" so they appear in /admin/review.
 *
 * HOW TO USE:
 * 1. Log in to the platform as SuperAdmin
 * 2. Open DevTools → Console
 * 3. Paste this entire script and press Enter
 * 4. The script will auto-extract your session token from Supabase localStorage
 * 5. Check the /admin/review queue — all entries should appear as "in_review"
 *
 * ANON KEY:
 * Get yours from: Supabase Dashboard → Project Settings → API → "anon public"
 * It is safe to paste here — it is a public key by design.
 */

(async () => {
  // ── CONFIG ──────────────────────────────────────────────────────────────────
  const SUPABASE_URL = "https://rchiljcopergqtozylik.supabase.co";
  const FUNCTION_NAME = "make-server-39a35780";
  const ANON_KEY = "YOUR_ANON_KEY_HERE"; // ← replace with your Supabase anon/public key

  // ── VIDEO REGISTRY — 48 InVideo draft URLs (complete set) ──────────────────
  const entries = {
    // Phase Vignettes
    "VIG-01": {
      url: "https://ai.invideo.io/ai-mcp-video?video=root-phase-establishing-the-foundation-childhood-trauma-aces-research-and-legal-framework-for-child-abuse-investigation-nkgvdj",
      status: "in_review",
      title: "Root: Establishing the Foundation",
      type: "vignette",
    },
    "VIG-02": {
      url: "https://ai.invideo.io/ai-mcp-video?video=regulate-phase-managing-the-internal-response-professional-self-regulation-and-the-trace-cognitive-cycle-in-child-abuse-investigations-wviemy",
      status: "in_review",
      title: "Regulate: Managing the Internal Response",
      type: "vignette",
    },
    "VIG-03": {
      url: "https://ai.invideo.io/ai-mcp-video?video=reflect-phase-the-critical-thinking-pause-appraisal-bias-awareness-and-the-trace-cycle-in-child-welfare-investigation-gumhna",
      status: "in_review",
      title: "Reflect: The Critical Thinking Pause",
      type: "vignette",
    },
    "VIG-04": {
      url: "https://ai.invideo.io/ai-mcp-video?video=restore-phase-correcting-the-course-evidence-based-investigation-protocols-and-professional-recovery-in-child-abuse-cases-saeytd",
      status: "in_review",
      title: "Restore: Correcting the Course",
      type: "vignette",
    },
    "VIG-05": {
      url: "https://ai.invideo.io/ai-mcp-video?video=reconnect-phase-the-collaborative-network-multidisciplinary-teams-childrens-advocacy-centers-and-victim-centered-investigation-uaqaoy",
      status: "in_review",
      title: "Reconnect: The Collaborative Network",
      type: "vignette",
    },

    // Module 1 — Trauma-Informed Foundations
    "LEC-M1-01": {
      url: "https://ai.invideo.io/ai-mcp-video?video=module-1-understanding-childhood-trauma-aces-research-brain-development-and-the-legal-framework-for-child-protection-thcozu",
      status: "in_review",
      title: "Understanding Childhood Trauma",
      type: "lecture",
    },
    "LEC-M1-02": {
      url: "https://ai.invideo.io/ai-mcp-video?video=module-1-professional-self-regulation-the-trace-cognitive-cycle-and-managing-vicarious-trauma-in-child-abuse-investigations-dipuof",
      status: "in_review",
      title: "Professional Self-Regulation",
      type: "lecture",
    },
    "LEC-M1-03": {
      url: "https://ai.invideo.io/ai-mcp-video?video=module-1-case-analysis-workshop-applying-the-trace-framework-to-real-investigation-decisions-adudev",
      status: "in_review",
      title: "Case Analysis Workshop",
      type: "lecture",
    },
    "LEC-M1-04": {
      url: "https://ai.invideo.io/ai-mcp-video?video=module-1-corrective-investigation-procedures-evidence-based-protocols-that-protect-children-and-preserve-case-integrity-snruqu",
      status: "in_review",
      title: "Corrective Investigation Procedures",
      type: "lecture",
    },
    "LEC-M1-05": {
      url: "https://ai.invideo.io/ai-mcp-video?video=module-1-mdt-collaboration-framework-building-effective-multidisciplinary-teams-for-child-abuse-investigation-vjdjxy",
      status: "in_review",
      title: "MDT Collaboration Framework",
      type: "lecture",
    },
    "SIM-M1-S1": {
      url: "https://ai.invideo.io/ai-mcp-video?video=module-1-simulation-first-response-initial-contact-with-a-distressed-child-scenario-introduction-gvsedg",
      status: "in_review",
      title: "First Response: Initial Contact with a Distressed Child",
      type: "simulation",
    },

    // Module 2 — Communication and Interviewing
    "LEC-M2-01": {
      url: "https://ai.invideo.io/ai-mcp-video?video=module-2-principles-of-forensic-communication-developmentally-appropriate-questioning-and-cultural-competency-in-child-interviews-icmplv",
      status: "in_review",
      title: "Principles of Forensic Communication",
      type: "lecture",
    },
    "LEC-M2-02": {
      url: "https://ai.invideo.io/ai-mcp-video?video=module-2-emotional-regulation-in-high-stress-interviews-managing-countertransference-and-de-escalating-hostile-caregivers-ldgctb",
      status: "in_review",
      title: "Emotional Regulation in High-Stress Interviews",
      type: "lecture",
    },
    "LEC-M2-03": {
      url: "https://ai.invideo.io/ai-mcp-video?video=module-2-interview-analysis-lab-evaluating-forensic-interview-technique-through-video-review-and-case-study-txlcod",
      status: "in_review",
      title: "Interview Analysis Lab",
      type: "lecture",
    },
    "LEC-M2-04": {
      url: "https://ai.invideo.io/ai-mcp-video?video=module-2-advanced-interview-protocols-the-nichd-protocol-extended-forensic-interviews-and-handling-recantation-gqhqoa",
      status: "in_review",
      title: "Advanced Interview Protocols",
      type: "lecture",
    },
    "LEC-M2-05": {
      url: "https://ai.invideo.io/ai-mcp-video?video=module-2-collaborative-communication-networks-pre-interview-coordination-mdt-case-conferencing-and-family-engagement-ukflnu",
      status: "in_review",
      title: "Collaborative Communication Networks",
      type: "lecture",
    },

    // Module 3 — Disability Law and Rights
    "LEC-M3-01": {
      url: "https://ai.invideo.io/ai-mcp-video?video=module-3-disability-law-foundations-idea-section-504-ada-and-children-with-disabilities-in-child-welfare-bypuep",
      status: "in_review",
      title: "Disability Law Foundations",
      type: "lecture",
    },
    "LEC-M3-02": {
      url: "https://ai.invideo.io/ai-mcp-video?video=module-3-bias-awareness-in-disability-cases-recognizing-implicit-bias-confirmation-bias-and-communication-misinterpretation-nsdddv",
      status: "in_review",
      title: "Bias Awareness in Disability Cases",
      type: "lecture",
    },
    "LEC-M3-03": {
      url: "https://ai.invideo.io/ai-mcp-video?video=module-3-disability-case-analysis-examining-real-cases-where-investigation-failures-affected-children-with-disabilities-bdnwms",
      status: "in_review",
      title: "Disability Case Analysis",
      type: "lecture",
    },
    "LEC-M3-04": {
      url: "https://ai.invideo.io/ai-mcp-video?video=module-3-accommodation-protocols-adapting-forensic-interviews-and-investigation-environments-for-children-with-disabilities-svsvjw",
      status: "in_review",
      title: "Accommodation Protocols",
      type: "lecture",
    },
    "LEC-M3-05": {
      url: "https://ai.invideo.io/ai-mcp-video?video=module-3-disability-informed-mdt-practice-including-disability-specialists-iep-coordination-and-educational-continuity-in-foster-care-xclzrv",
      status: "in_review",
      title: "Disability-Informed MDT Practice",
      type: "lecture",
    },

    // Simulations — Modules 2 & 3
    "SIM-M2-S1": {
      url: "https://ai.invideo.io/ai-mcp-video?video=simulation-de-escalating-a-defensive-caregiver-during-a-forensic-interview-while-maintaining-interview-integrity-vcqbcx",
      status: "in_review",
      title: "De-escalating a Defensive Caregiver",
      type: "simulation",
    },
    "SIM-M3-S1": {
      url: "https://ai.invideo.io/ai-mcp-video?video=simulation-conducting-forensic-interviews-with-children-with-autism-spectrum-disorder-while-maintaining-forensic-integrity-ujlyzr",
      status: "in_review",
      title: "Interviewing a Child with ASD",
      type: "simulation",
    },

    // Module 4 — Forensic Interviewing and Evidence Preservation
    "LEC-M4-01": {
      url: "https://ai.invideo.io/ai-mcp-video?video=legal-foundations-of-forensic-evidence-in-child-abuse-investigations-hearsay-exceptions-crawford-v-washington-documentation-standards-hqtwua",
      status: "in_review",
      title: "Legal Foundations of Forensic Evidence",
      type: "lecture",
    },
    "LEC-M4-02": {
      url: "https://ai.invideo.io/ai-mcp-video?video=interviewer-neutrality-and-emotional-regulation-during-forensic-interviews-with-children-nhaqpz",
      status: "in_review",
      title: "Interviewer Neutrality",
      type: "lecture",
    },
    "LEC-M4-03": {
      url: "https://ai.invideo.io/ai-mcp-video?video=forensic-interview-critique-and-analysis-identifying-strengths-and-weaknesses-in-recorded-child-interviews-azxhkf",
      status: "in_review",
      title: "Interview Critique Workshop",
      type: "lecture",
    },
    "LEC-M4-04": {
      url: "https://ai.invideo.io/ai-mcp-video?video=evidence-preservation-protocols-in-child-abuse-investigations-chain-of-custody-sane-coordination-digital-forensics-ppfsph",
      status: "in_review",
      title: "Evidence Preservation Protocols",
      type: "lecture",
    },
    "LEC-M4-05": {
      url: "https://ai.invideo.io/ai-mcp-video?video=court-preparation-expert-witness-testimony-and-supporting-child-witnesses-through-legal-proceedings-xwujkc",
      status: "in_review",
      title: "Court Preparation and Testimony",
      type: "lecture",
    },
    "SIM-M4-S1": {
      url: "https://ai.invideo.io/ai-mcp-video?video=forensic-interview-simulation-preserving-testimony-integrity-after-prior-contamination-by-an-untrained-adult-fauacj",
      status: "in_review",
      title: "Preserving Testimony Under Pressure",
      type: "simulation",
    },

    // Module 5 — Multidisciplinary Investigation Coordination
    "LEC-M5-01": {
      url: "https://ai.invideo.io/ai-mcp-video?video=multidisciplinary-team-frameworks-childrens-advocacy-center-model-and-joint-investigation-protocols-jxserx",
      status: "in_review",
      title: "MDT Framework and Models",
      type: "lecture",
    },
    "LEC-M5-02": {
      url: "https://ai.invideo.io/ai-mcp-video?video=managing-interagency-dynamics-and-professional-tensions-in-multidisciplinary-child-abuse-investigation-teams-jjwozs",
      status: "in_review",
      title: "Managing Interagency Dynamics",
      type: "lecture",
    },
    "LEC-M5-03": {
      url: "https://ai.invideo.io/ai-mcp-video?video=mdt-case-review-analyzing-multidisciplinary-coordination-successes-and-failures-in-child-abuse-investigations-pmoanj",
      status: "in_review",
      title: "MDT Case Review",
      type: "lecture",
    },
    "LEC-M5-04": {
      url: "https://ai.invideo.io/ai-mcp-video?video=effective-mdt-protocols-case-tracking-structured-conferencing-and-quality-assurance-in-multidisciplinary-child-investigations-ocahos",
      status: "in_review",
      title: "Effective MDT Protocols",
      type: "lecture",
    },
    "LEC-M5-05": {
      url: "https://ai.invideo.io/ai-mcp-video?video=victim-centered-multidisciplinary-practice-reducing-child-re-traumatization-through-coordinated-investigation-and-services-tkshgv",
      status: "in_review",
      title: "Victim-Centered MDT Practice",
      type: "lecture",
    },
    "SIM-M5-S1": {
      url: "https://ai.invideo.io/ai-mcp-video?video=mdt-simulation-navigating-conflicting-agency-priorities-to-achieve-both-child-safety-and-criminal-investigation-integrity-zwukca",
      status: "in_review",
      title: "MDT Case Conference: Conflicting Priorities",
      type: "simulation",
    },

    // Module 6 — Preventing Secondary Trauma
    "LEC-M6-01": {
      url: "https://ai.invideo.io/ai-mcp-video?video=secondary-traumatic-stress-vicarious-trauma-and-compassion-fatigue-in-child-abuse-investigation-professionals-lzlnzg",
      status: "in_review",
      title: "Understanding Secondary Trauma",
      type: "lecture",
    },
    "LEC-M6-02": {
      url: "https://ai.invideo.io/ai-mcp-video?video=personal-resilience-strategies-and-evidence-based-self-care-for-trauma-exposed-child-welfare-professionals-eeukkj",
      status: "in_review",
      title: "Personal Resilience Strategies",
      type: "lecture",
    },
    "LEC-M6-03": {
      url: "https://ai.invideo.io/ai-mcp-video?video=self-assessment-tools-and-warning-signs-for-secondary-traumatic-stress-in-child-welfare-professionals-anfpgk",
      status: "in_review",
      title: "Self-Assessment and Awareness",
      type: "lecture",
    },
    "LEC-M6-04": {
      url: "https://ai.invideo.io/ai-mcp-video?video=organizational-support-systems-for-trauma-exposed-workers-cism-eap-and-trauma-informed-supervision-hqwsbk",
      status: "in_review",
      title: "Organizational Support Systems",
      type: "lecture",
    },
    "LEC-M6-05": {
      url: "https://ai.invideo.io/ai-mcp-video?video=career-sustainability-professional-support-networks-and-finding-meaning-in-long-term-trauma-focused-work-mzgksv",
      status: "in_review",
      title: "Sustainable Practice",
      type: "lecture",
    },
    "SIM-M6-S1": {
      url: "https://ai.invideo.io/ai-mcp-video?video=secondary-trauma-simulation-recognizing-and-responding-to-secondary-traumatic-stress-in-yourself-as-a-child-welfare-professional-pzaerp",
      status: "in_review",
      title: "Recognizing Secondary Trauma in Yourself",
      type: "simulation",
    },

    // Module 7 — Mandated Reporter Essentials
    "LEC-M7-01": {
      url: "https://ai.invideo.io/ai-mcp-video?video=georgia-mandated-reporting-law-ocga-19-7-5-designated-reporters-reasonable-cause-standard-and-capta-federal-baseline-zqwtnm",
      status: "in_review",
      title: "Who Is a Mandated Reporter?",
      type: "lecture",
    },
    "LEC-M7-02": {
      url: "https://ai.invideo.io/ai-mcp-video?video=managing-emotional-responses-when-a-child-discloses-abuse-trauma-informed-communication-for-mandated-reporters-bzqpcx",
      status: "in_review",
      title: "Managing the Emotional Weight of Disclosure",
      type: "lecture",
    },
    "LEC-M7-03": {
      url: "https://ai.invideo.io/ai-mcp-video?video=physical-behavioral-and-environmental-indicators-of-child-abuse-and-neglect-recognition-for-georgia-mandated-reporters-yopqqe",
      status: "in_review",
      title: "Recognizing Indicators of Abuse & Neglect",
      type: "lecture",
    },
    "LEC-M7-04": {
      url: "https://ai.invideo.io/ai-mcp-video?video=step-by-step-georgia-child-abuse-reporting-process-1-855-gachild-documentation-legal-protections-and-consequences-of-failure-to-report-fjqson",
      status: "in_review",
      title: "The Georgia Reporting Process: Step by Step",
      type: "lecture",
    },
    "LEC-M7-05": {
      url: "https://ai.invideo.io/ai-mcp-video?video=supporting-children-after-making-a-mandated-report-and-building-organizational-reporting-culture-in-georgia-tsuxkw",
      status: "in_review",
      title: "Supporting the Child After a Report",
      type: "lecture",
    },
    "SIM-M7-S1": {
      url: "https://ai.invideo.io/ai-mcp-video?video=mandated-reporter-simulation-recognizing-and-responding-to-concerning-indicators-in-a-child-at-an-after-school-program-lzjeru",
      status: "in_review",
      title: "A Child's Drawing Tells a Story",
      type: "simulation",
    },
    "SIM-M7-S2": {
      url: "https://ai.invideo.io/ai-mcp-video?video=mandated-reporter-simulation-navigating-institutional-pressure-and-supervisor-interference-with-the-personal-legal-obligation-to-report-child-abuse-xdtjrf",
      status: "in_review",
      title: "The Principal Says 'Let Me Handle It'",
      type: "simulation",
    },
  };

  // ── NOTES: items to fix in InVideo editor before approving ─────────────────
  const REVIEW_NOTES = {
    "VIG-01": "Tone: adjust toward warmer/community-centered in InVideo editor (currently skews documentary)",
    "VIG-01": "Tone: adjust toward warmer/community-centered in InVideo editor (currently skews documentary)",
  };

  // ── EXTRACT SESSION TOKEN ───────────────────────────────────────────────────
  const sessionKey = Object.keys(localStorage).find(
    (k) => k.startsWith("sb-") && k.endsWith("-auth-token")
  );
  if (!sessionKey) {
    console.error("❌ No Supabase session found. Make sure you are logged in as SuperAdmin.");
    return;
  }
  const session = JSON.parse(localStorage.getItem(sessionKey));
  const token = session?.access_token;
  if (!token) {
    console.error("❌ Could not extract access token from session.");
    return;
  }
  console.log("✅ Session token extracted.");

  if (ANON_KEY === "YOUR_ANON_KEY_HERE") {
    console.error(
      "❌ Replace ANON_KEY at the top of this script with your Supabase anon/public key.\n" +
      "   Find it at: Supabase Dashboard → Project Settings → API → anon public"
    );
    return;
  }

  // ── CALL BULK ENDPOINT ──────────────────────────────────────────────────────
  const url = `${SUPABASE_URL}/functions/v1/${FUNCTION_NAME}/admin/videos/bulk`;
  console.log(`📡 Staging ${Object.keys(entries).length} videos to registry...`);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": ANON_KEY,
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ entries }),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("❌ Bulk stage failed:", data);
    return;
  }

  console.log(`✅ Staged ${data.updated} videos successfully.`);
  console.log("📋 Review notes for the /admin/review queue:");
  Object.entries(REVIEW_NOTES).forEach(([id, note]) => {
    console.warn(`  [${id}] ${note}`);
  });
  console.log("👉 Navigate to /admin/review to begin your review.");
})();
