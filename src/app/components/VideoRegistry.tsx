import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { getVideoRegistry } from "./api";

// ── Video metadata (stable — describes every known video slot) ──

export type VideoType = "lecture" | "vignette" | "simulation";
export type VideoStatus = "not_started" | "in_review" | "ready" | "active";

export interface VideoMeta {
  title: string;
  type: VideoType;
  module: number | null;
  phase: string | null;
  sectionTitle: string | null;
}

export interface VideoEntry {
  url: string;
  status: VideoStatus;
  updatedAt: string;
  updatedBy: string;
  reviewNotes?: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

/** All 48 known video slots — titles/types never change, only URLs do. */
export const VIDEO_REGISTRY_META: Record<string, VideoMeta> = {
  // ── Phase Intro Vignettes ──
  "VIG-01": { title: "Root: Establishing the Foundation", type: "vignette", module: null, phase: "Root", sectionTitle: "Phase Introduction" },
  "VIG-02": { title: "Regulate: Managing the Internal Response", type: "vignette", module: null, phase: "Regulate", sectionTitle: "Phase Introduction" },
  "VIG-03": { title: "Reflect: The Critical Thinking Pause", type: "vignette", module: null, phase: "Reflect", sectionTitle: "Phase Introduction" },
  "VIG-04": { title: "Restore: Correcting the Course", type: "vignette", module: null, phase: "Restore", sectionTitle: "Phase Introduction" },
  "VIG-05": { title: "Reconnect: The Collaborative Network", type: "vignette", module: null, phase: "Reconnect", sectionTitle: "Phase Introduction" },

  // ── Module 1 Lectures ──
  "LEC-M1-01": { title: "ACEs, Trauma Neuroscience & Child Behavior", type: "lecture", module: 1, phase: "Root", sectionTitle: "Understanding Childhood Trauma" },
  "LEC-M1-02": { title: "Managing Your Own Trauma Responses", type: "lecture", module: 1, phase: "Regulate", sectionTitle: "Professional Self-Regulation" },
  "LEC-M1-03": { title: "Applying TRACE to Real Investigations", type: "lecture", module: 1, phase: "Reflect", sectionTitle: "Case Analysis Workshop" },
  "LEC-M1-04": { title: "Trauma-Informed Protocols & Documentation", type: "lecture", module: 1, phase: "Restore", sectionTitle: "Corrective Investigation Procedures" },
  "LEC-M1-05": { title: "MDT Structures & Communication Protocols", type: "lecture", module: 1, phase: "Reconnect", sectionTitle: "MDT Collaboration Framework" },

  // ── Module 2 Lectures ──
  "LEC-M2-01": { title: "Forensic Communication Principles", type: "lecture", module: 2, phase: "Root", sectionTitle: "Principles of Forensic Communication" },
  "LEC-M2-02": { title: "Staying Neutral When It's Hard", type: "lecture", module: 2, phase: "Regulate", sectionTitle: "Emotional Regulation in High-Stress Interviews" },
  "LEC-M2-03": { title: "Strong vs. Weak Forensic Interviews", type: "lecture", module: 2, phase: "Reflect", sectionTitle: "Interview Analysis Lab" },
  "LEC-M2-04": { title: "NICHD Protocol, RATAC & Structured Models", type: "lecture", module: 2, phase: "Restore", sectionTitle: "Advanced Interview Protocols" },
  "LEC-M2-05": { title: "Information Sharing, MDT Communication & Confidentiality", type: "lecture", module: 2, phase: "Reconnect", sectionTitle: "Collaborative Communication Networks" },

  // ── Module 3 Lectures ──
  "LEC-M3-01": { title: "ADA, IDEA, Section 504 & Child Welfare", type: "lecture", module: 3, phase: "Root", sectionTitle: "Disability Law Foundations" },
  "LEC-M3-02": { title: "Recognizing & Managing Ableist Bias", type: "lecture", module: 3, phase: "Regulate", sectionTitle: "Bias Awareness in Disability Cases" },
  "LEC-M3-03": { title: "Disability Case Studies in Outcomes", type: "lecture", module: 3, phase: "Reflect", sectionTitle: "Disability Case Analysis" },
  "LEC-M3-04": { title: "Reasonable Accommodations & Modified Techniques", type: "lecture", module: 3, phase: "Restore", sectionTitle: "Accommodation Protocols" },
  "LEC-M3-05": { title: "Disability Specialists in MDT & Advocacy", type: "lecture", module: 3, phase: "Reconnect", sectionTitle: "Disability-Informed MDT Practice" },

  // ── Module 4 Lectures ──
  "LEC-M4-01": { title: "Rules of Evidence, Hearsay & Crawford v. Washington", type: "lecture", module: 4, phase: "Root", sectionTitle: "Legal Foundations of Forensic Evidence" },
  "LEC-M4-02": { title: "Maintaining Neutral Affect", type: "lecture", module: 4, phase: "Regulate", sectionTitle: "Interviewer Neutrality" },
  "LEC-M4-03": { title: "Court Challenges to Forensic Interviews", type: "lecture", module: 4, phase: "Reflect", sectionTitle: "Interview Critique Workshop" },
  "LEC-M4-04": { title: "Chain of Custody, Digital Forensics & SANE Coordination", type: "lecture", module: 4, phase: "Restore", sectionTitle: "Evidence Preservation Protocols" },
  "LEC-M4-05": { title: "Expert Witness Prep & Supporting Child Witnesses", type: "lecture", module: 4, phase: "Reconnect", sectionTitle: "Court Preparation and Testimony" },

  // ── Module 5 Lectures ──
  "LEC-M5-01": { title: "CAC Model, Joint Protocols & Legal Mandates", type: "lecture", module: 5, phase: "Root", sectionTitle: "MDT Framework and Models" },
  "LEC-M5-02": { title: "Role Clarity, Conflict Resolution & Team Support", type: "lecture", module: 5, phase: "Regulate", sectionTitle: "Managing Interagency Dynamics" },
  "LEC-M5-03": { title: "When MDT Coordination Succeeds and Fails", type: "lecture", module: 5, phase: "Reflect", sectionTitle: "MDT Case Review" },
  "LEC-M5-04": { title: "Case Tracking, Conferencing Models & QA Processes", type: "lecture", module: 5, phase: "Restore", sectionTitle: "Effective MDT Protocols" },
  "LEC-M5-05": { title: "Reducing Child Interviews & Coordinating Services", type: "lecture", module: 5, phase: "Reconnect", sectionTitle: "Victim-Centered MDT Practice" },

  // ── Module 6 Lectures ──
  "LEC-M6-01": { title: "STS, Vicarious Trauma, Compassion Fatigue & Burnout", type: "lecture", module: 6, phase: "Root", sectionTitle: "Understanding Secondary Trauma" },
  "LEC-M6-02": { title: "Evidence-Based Self-Care for Trauma-Exposed Professionals", type: "lecture", module: 6, phase: "Regulate", sectionTitle: "Personal Resilience Strategies" },
  "LEC-M6-03": { title: "ProQOL Assessment Walkthrough & Warning Signs", type: "lecture", module: 6, phase: "Reflect", sectionTitle: "Self-Assessment and Awareness" },
  "LEC-M6-04": { title: "Trauma-Informed Workplaces & CISM Protocols", type: "lecture", module: 6, phase: "Restore", sectionTitle: "Organizational Support Systems" },
  "LEC-M6-05": { title: "Career Sustainability & Meaning in Trauma Work", type: "lecture", module: 6, phase: "Reconnect", sectionTitle: "Sustainable Practice" },

  // ── Module 7 Lectures ──
  "LEC-M7-01": { title: "Georgia Mandated Reporter Law & Federal Baseline", type: "lecture", module: 7, phase: "Root", sectionTitle: "Who Is a Mandated Reporter?" },
  "LEC-M7-02": { title: "Child Disclosure Reactions & Professional Emotional Management", type: "lecture", module: 7, phase: "Regulate", sectionTitle: "Managing the Emotional Weight of Disclosure" },
  "LEC-M7-03": { title: "Physical & Behavioral Indicators by Abuse Type", type: "lecture", module: 7, phase: "Reflect", sectionTitle: "Recognizing Indicators of Abuse & Neglect" },
  "LEC-M7-04": { title: "Calling 1-855-GACHILD & Documentation Walkthrough", type: "lecture", module: 7, phase: "Restore", sectionTitle: "The Georgia Reporting Process: Step by Step" },
  "LEC-M7-05": { title: "What Happens After a Report & Building Reporting Culture", type: "lecture", module: 7, phase: "Reconnect", sectionTitle: "Supporting the Child After a Report" },

  // ── Scenario Simulations ──
  "SIM-M1-S1": { title: "First Response: Initial Contact with a Distressed Child", type: "simulation", module: 1, phase: null, sectionTitle: null },
  "SIM-M2-S1": { title: "De-escalating a Defensive Caregiver", type: "simulation", module: 2, phase: null, sectionTitle: null },
  "SIM-M3-S1": { title: "Interviewing a Child with ASD", type: "simulation", module: 3, phase: null, sectionTitle: null },
  "SIM-M4-S1": { title: "Preserving Testimony Under Pressure", type: "simulation", module: 4, phase: null, sectionTitle: null },
  "SIM-M5-S1": { title: "MDT Case Conference: Conflicting Priorities", type: "simulation", module: 5, phase: null, sectionTitle: null },
  "SIM-M6-S1": { title: "Recognizing Secondary Trauma in Yourself", type: "simulation", module: 6, phase: null, sectionTitle: null },
  "SIM-M7-S1": { title: "A Child's Drawing Tells a Story", type: "simulation", module: 7, phase: null, sectionTitle: null },
  "SIM-M7-S2": { title: "The Principal Says 'Let Me Handle It'", type: "simulation", module: 7, phase: null, sectionTitle: null },
};

// ── Context ──

interface VideoRegistryState {
  registry: Record<string, VideoEntry>;
  loading: boolean;
  refresh: () => Promise<void>;
}

const VideoRegistryContext = createContext<VideoRegistryState | null>(null);

export function VideoRegistryProvider({ children }: { children: ReactNode }) {
  const [registry, setRegistry] = useState<Record<string, VideoEntry>>({});
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const data = await getVideoRegistry();
      setRegistry(data ?? {});
    } catch {
      // Non-fatal — platform works without registry (falls back to static videoUrl)
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return (
    <VideoRegistryContext.Provider value={{ registry, loading, refresh }}>
      {children}
    </VideoRegistryContext.Provider>
  );
}

export function useVideoRegistry() {
  const ctx = useContext(VideoRegistryContext);
  if (!ctx) throw new Error("useVideoRegistry must be used inside VideoRegistryProvider");
  return ctx;
}

/**
 * Returns the live URL for a videoId from the registry.
 * Returns undefined when the video has not been uploaded yet.
 */
export function useVideoUrl(videoId: string | undefined): string | undefined {
  const { registry } = useVideoRegistry();
  if (!videoId) return undefined;
  const entry = registry[videoId];
  return entry?.url || undefined;
}

// ── Content Overrides ──

export interface ContentOverride {
  content?: string[];
  keyTerms?: Array<{ term: string; definition: string }>;
  updatedAt?: string;
  updatedBy?: string;
}

interface ContentOverridesState {
  overrides: Record<string, ContentOverride>;
  loading: boolean;
  refresh: () => Promise<void>;
}

const ContentOverridesContext = createContext<ContentOverridesState | null>(null);

export function ContentOverridesProvider({ children }: { children: ReactNode }) {
  const [overrides, setOverrides] = useState<Record<string, ContentOverride>>({});
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const data = await import("./api").then(m => m.getContentOverrides());
      setOverrides(data ?? {});
    } catch {
      // Non-fatal — platform renders static content if overrides unavailable
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return (
    <ContentOverridesContext.Provider value={{ overrides, loading, refresh }}>
      {children}
    </ContentOverridesContext.Provider>
  );
}

export function useContentOverrides() {
  const ctx = useContext(ContentOverridesContext);
  if (!ctx) throw new Error("useContentOverrides must be used inside ContentOverridesProvider");
  return ctx;
}

export function useContentOverride(videoId: string | undefined): ContentOverride | undefined {
  const { overrides } = useContentOverrides();
  if (!videoId) return undefined;
  return overrides[videoId];
}
