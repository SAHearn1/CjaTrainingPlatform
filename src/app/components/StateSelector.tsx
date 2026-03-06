import { useState } from "react";
import { ChevronDown, MapPin, AlertTriangle, CheckCircle2, Info, ExternalLink, Phone } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

/* ─── State mandated reporting data ─── */

export interface StateReportingInfo {
  abbrev: string;
  name: string;
  isUniversal: boolean;
  hotline: string;
  hotlineDisplay: string;
  statute: string;
  reportingStandard: string;
  timeFrame: string;
  failurePenalty: string;
  immunityProvision: string;
  notes: string;
  /** Key differences from the Georgia baseline */
  gaComparison: string[];
}

export const STATE_DATA: StateReportingInfo[] = [
  {
    abbrev: "GA",
    name: "Georgia",
    isUniversal: false,
    hotline: "1-855-422-4453",
    hotlineDisplay: "1-855-GACHILD",
    statute: "O.C.G.A. \u00A7 19-7-5",
    reportingStandard: "Reasonable cause to believe",
    timeFrame: "Within 24 hours",
    failurePenalty: "Misdemeanor; professional license sanctions; civil liability",
    immunityProvision: "O.C.G.A. \u00A7 19-7-5(g) \u2014 civil and criminal immunity for good-faith reports",
    notes: "Georgia is the baseline state for this training. DFCS screens reports within 24 hours (emergency) or 5 business days (standard). Reporter identity protected under O.C.G.A. \u00A7 49-5-41.",
    gaComparison: [],
  },
  {
    abbrev: "AL",
    name: "Alabama",
    isUniversal: false,
    hotline: "1-334-242-9500",
    hotlineDisplay: "1-334-242-9500",
    statute: "Ala. Code \u00A7 26-14-3",
    reportingStandard: "Reasonable cause to suspect or believe",
    timeFrame: "Immediately (as soon as practicable)",
    failurePenalty: "Misdemeanor (up to 6 months jail, $500 fine)",
    immunityProvision: "Good-faith immunity under Ala. Code \u00A7 26-14-9",
    notes: "Alabama\u2019s mandated reporter list is similar to Georgia\u2019s. Reports go to the Department of Human Resources (DHR).",
    gaComparison: [
      "Similar category-based (not universal) reporter model",
      "Reporting standard is nearly identical (\u2018reasonable cause to suspect\u2019)",
      "Time frame says \u2018immediately\u2019 vs. Georgia\u2019s explicit 24-hour window",
    ],
  },
  {
    abbrev: "FL",
    name: "Florida",
    isUniversal: true,
    hotline: "1-800-962-2873",
    hotlineDisplay: "1-800-96-ABUSE",
    statute: "Fla. Stat. \u00A7 39.201",
    reportingStandard: "Knows, or has reasonable cause to suspect",
    timeFrame: "Immediately",
    failurePenalty: "Third-degree felony for known or suspected sexual abuse; misdemeanor for other abuse",
    immunityProvision: "Good-faith immunity under Fla. Stat. \u00A7 39.203",
    notes: "Florida is a UNIVERSAL reporter state. Any person who knows or suspects child abuse must report. Florida also has an online reporting option.",
    gaComparison: [
      "UNIVERSAL reporter state \u2014 ALL adults must report, not just designated professionals",
      "Failure to report known/suspected sexual abuse is a felony (vs. misdemeanor in GA)",
      "Online reporting available in addition to phone",
    ],
  },
  {
    abbrev: "TX",
    name: "Texas",
    isUniversal: true,
    hotline: "1-800-252-5400",
    hotlineDisplay: "1-800-252-5400",
    statute: "Tex. Fam. Code \u00A7 261.101",
    reportingStandard: "Cause to believe",
    timeFrame: "Within 48 hours",
    failurePenalty: "Class A misdemeanor (up to 1 year jail, $4,000 fine); felony if intent to conceal",
    immunityProvision: "Good-faith immunity under Tex. Fam. Code \u00A7 261.106",
    notes: "Texas is a UNIVERSAL reporter state. All adults must report. Texas also accepts online reports and has specific provisions for professionals who work with children.",
    gaComparison: [
      "UNIVERSAL reporter state",
      "48-hour window (vs. 24 hours in GA)",
      "Intent to conceal abuse elevates to a felony (GA does not have this escalation)",
      "Online reporting available",
    ],
  },
  {
    abbrev: "CA",
    name: "California",
    isUniversal: false,
    hotline: "Varies by county",
    hotlineDisplay: "County-specific hotlines",
    statute: "Cal. Penal Code \u00A7\u00A7 11164\u201311174.3",
    reportingStandard: "Reasonable suspicion",
    timeFrame: "Immediately by phone; written report within 36 hours",
    failurePenalty: "Misdemeanor (up to 6 months jail, $1,000 fine); up to 1 year if death/GBI results",
    immunityProvision: "Good-faith immunity under Cal. Penal Code \u00A7 11172",
    notes: "California requires both an immediate phone report AND a written follow-up (Form SS 8572) within 36 hours. California\u2019s mandated reporter list is one of the longest in the nation.",
    gaComparison: [
      "Category-based (not universal) like Georgia, but with a much longer list of designated reporters",
      "Requires BOTH phone AND written follow-up report (GA has no mandated written follow-up)",
      "County-specific hotlines (vs. GA\u2019s single statewide number)",
      "Enhanced penalty if failure to report results in death or great bodily injury",
    ],
  },
  {
    abbrev: "NY",
    name: "New York",
    isUniversal: false,
    hotline: "1-800-342-3720",
    hotlineDisplay: "1-800-342-3720",
    statute: "N.Y. Soc. Serv. Law \u00A7 413",
    reportingStandard: "Reasonable cause to suspect",
    timeFrame: "Immediately by phone; written report within 48 hours",
    failurePenalty: "Class A misdemeanor; civil liability for damages caused by failure to report",
    immunityProvision: "Good-faith immunity under N.Y. Soc. Serv. Law \u00A7 419",
    notes: "New York requires oral report followed by a written report within 48 hours on Form LDSS-2221A. New York\u2019s State Central Register (SCR) handles all intake.",
    gaComparison: [
      "Category-based (not universal) like Georgia",
      "Requires written follow-up within 48 hours (GA does not mandate written report)",
      "Centralized State Central Register similar to GA\u2019s DFCS intake",
      "Explicit civil liability provision for failure to report",
    ],
  },
  {
    abbrev: "NJ",
    name: "New Jersey",
    isUniversal: true,
    hotline: "1-877-652-2873",
    hotlineDisplay: "1-877-NJ-ABUSE",
    statute: "N.J. Stat. \u00A7 9:6-8.10",
    reportingStandard: "Reasonable cause to believe",
    timeFrame: "Immediately",
    failurePenalty: "Disorderly persons offense (misdemeanor equivalent)",
    immunityProvision: "Good-faith immunity under N.J. Stat. \u00A7 9:6-8.13",
    notes: "New Jersey is a UNIVERSAL reporter state. Any person having reasonable cause to believe a child has been abused must report immediately.",
    gaComparison: [
      "UNIVERSAL reporter state",
      "Nearly identical reporting standard (\u2018reasonable cause to believe\u2019)",
      "Penalty is classified as \u2018disorderly persons offense\u2019 (equivalent to misdemeanor)",
    ],
  },
  {
    abbrev: "IN",
    name: "Indiana",
    isUniversal: true,
    hotline: "1-800-800-5556",
    hotlineDisplay: "1-800-800-5556",
    statute: "Ind. Code \u00A7 31-33-5-1",
    reportingStandard: "Reason to believe",
    timeFrame: "Immediately",
    failurePenalty: "Class B misdemeanor",
    immunityProvision: "Good-faith immunity under Ind. Code \u00A7 31-33-6-1",
    notes: "Indiana is a UNIVERSAL reporter state. Any individual who has reason to believe a child is a victim of abuse or neglect must report.",
    gaComparison: [
      "UNIVERSAL reporter state",
      "Slightly lower standard (\u2018reason to believe\u2019 vs. \u2018reasonable cause to believe\u2019)",
      "Immediate reporting required (no specific hour window)",
    ],
  },
  {
    abbrev: "OH",
    name: "Ohio",
    isUniversal: false,
    hotline: "Varies by county",
    hotlineDisplay: "County-specific hotlines",
    statute: "Ohio Rev. Code \u00A7 2151.421",
    reportingStandard: "Knows or suspects",
    timeFrame: "Immediately",
    failurePenalty: "Fourth-degree misdemeanor (first offense); first-degree misdemeanor (repeat)",
    immunityProvision: "Good-faith immunity under Ohio Rev. Code \u00A7 2151.421(G)",
    notes: "Ohio uses a category-based system like Georgia. Reports go to the county children services agency or law enforcement.",
    gaComparison: [
      "Category-based like Georgia",
      "Escalating penalties for repeat failures to report (GA does not escalate)",
      "County-specific intake (vs. GA\u2019s statewide hotline)",
    ],
  },
  {
    abbrev: "IL",
    name: "Illinois",
    isUniversal: false,
    hotline: "1-800-252-2873",
    hotlineDisplay: "1-800-25-ABUSE",
    statute: "325 ILCS 5/4",
    reportingStandard: "Reasonable cause to believe",
    timeFrame: "Immediately",
    failurePenalty: "Class A misdemeanor; Class 4 felony for repeat offenses or if child dies",
    immunityProvision: "Good-faith immunity under 325 ILCS 5/9",
    notes: "Illinois requires mandated reporters to complete online training. Enhanced penalties if a child dies or is seriously injured due to failure to report.",
    gaComparison: [
      "Category-based like Georgia",
      "Identical reporting standard",
      "REQUIRES mandated reporter training (GA recommends but does not mandate specific training hours)",
      "Felony escalation if failure to report results in death",
    ],
  },
  {
    abbrev: "PA",
    name: "Pennsylvania",
    isUniversal: false,
    hotline: "1-800-932-0313",
    hotlineDisplay: "1-800-932-0313 (ChildLine)",
    statute: "23 Pa.C.S. \u00A7 6311",
    reportingStandard: "Reasonable cause to suspect",
    timeFrame: "Immediately",
    failurePenalty: "Misdemeanor of the third degree (first offense); felony of the third degree (subsequent offenses or if child suffers serious bodily injury/death)",
    immunityProvision: "Good-faith immunity under 23 Pa.C.S. \u00A7 6318",
    notes: "Pennsylvania significantly strengthened its mandated reporting law after the Penn State scandal. All mandated reporters must complete approved training. Online reporting available.",
    gaComparison: [
      "Category-based like Georgia",
      "Post-Penn State reforms made PA one of the strictest states",
      "REQUIRES approved mandated reporter training",
      "Felony for subsequent failures or if child suffers serious injury/death",
    ],
  },
  {
    abbrev: "DE",
    name: "Delaware",
    isUniversal: true,
    hotline: "1-800-292-9582",
    hotlineDisplay: "1-800-292-9582",
    statute: "Del. Code tit. 16, \u00A7 903",
    reportingStandard: "Knows or in good faith suspects",
    timeFrame: "Immediately",
    failurePenalty: "Class A misdemeanor (up to 1 year jail, $2,300 fine); civil liability",
    immunityProvision: "Good-faith immunity under Del. Code tit. 16, \u00A7 908",
    notes: "Delaware is a UNIVERSAL reporter state. Any person who knows or in good faith suspects child abuse or neglect must report.",
    gaComparison: [
      "UNIVERSAL reporter state",
      "Explicit civil liability for failure to report (in addition to criminal penalty)",
      "Uses \u2018in good faith suspects\u2019 language (slightly different phrasing)",
    ],
  },
  {
    abbrev: "SC",
    name: "South Carolina",
    isUniversal: false,
    hotline: "1-888-227-3487",
    hotlineDisplay: "1-888-CARE-4-US",
    statute: "S.C. Code \u00A7 63-7-310",
    reportingStandard: "Reason to believe",
    timeFrame: "Immediately",
    failurePenalty: "Misdemeanor (up to 6 months jail, $500 fine)",
    immunityProvision: "Good-faith immunity under S.C. Code \u00A7 63-7-390",
    notes: "South Carolina has a category-based system. Reports go to the Department of Social Services (DSS).",
    gaComparison: [
      "Category-based like Georgia",
      "Very similar reporting standard and penalties",
      "State-specific DSS intake (similar structure to GA DFCS)",
    ],
  },
  {
    abbrev: "NC",
    name: "North Carolina",
    isUniversal: true,
    hotline: "Varies by county",
    hotlineDisplay: "County-specific DSS offices",
    statute: "N.C. Gen. Stat. \u00A7 7B-301",
    reportingStandard: "Cause to suspect",
    timeFrame: "Immediately",
    failurePenalty: "Class 1 misdemeanor",
    immunityProvision: "Good-faith immunity under N.C. Gen. Stat. \u00A7 7B-309",
    notes: "North Carolina is a UNIVERSAL reporter state. Any person or institution who has cause to suspect child abuse, neglect, or dependency must report.",
    gaComparison: [
      "UNIVERSAL reporter state",
      "County-level intake (no statewide hotline like GA)",
      "Includes \u2018dependency\u2019 as a reportable condition (broader than GA)",
    ],
  },
  {
    abbrev: "VA",
    name: "Virginia",
    isUniversal: false,
    hotline: "1-800-552-7096",
    hotlineDisplay: "1-800-552-7096",
    statute: "Va. Code \u00A7 63.2-1509",
    reportingStandard: "Reason to suspect",
    timeFrame: "Immediately; written report within 48 hours if requested",
    failurePenalty: "Fine for first offense; Class 1 misdemeanor for subsequent offenses",
    immunityProvision: "Good-faith immunity under Va. Code \u00A7 63.2-1512",
    notes: "Virginia has a category-based system with escalating penalties. Reports go to the local Department of Social Services or the state hotline.",
    gaComparison: [
      "Category-based like Georgia",
      "Escalating penalty structure (first offense is fine only; subsequent is misdemeanor)",
      "Written follow-up required if requested (GA does not mandate written follow-up)",
    ],
  },
  {
    abbrev: "TN",
    name: "Tennessee",
    isUniversal: true,
    hotline: "1-877-237-0004",
    hotlineDisplay: "1-877-237-0004",
    statute: "Tenn. Code \u00A7 37-1-403",
    reportingStandard: "Knows or has reasonable cause to suspect",
    timeFrame: "Immediately",
    failurePenalty: "Class A misdemeanor",
    immunityProvision: "Good-faith immunity under Tenn. Code \u00A7 37-1-410",
    notes: "Tennessee is a UNIVERSAL reporter state. Any person who knows or has reasonable cause to suspect that a child has been abused or neglected must report.",
    gaComparison: [
      "UNIVERSAL reporter state",
      "Slightly broader standard (\u2018knows or has reasonable cause to suspect\u2019)",
      "Neighboring state with different mandate scope",
    ],
  },
  {
    abbrev: "MD",
    name: "Maryland",
    isUniversal: false,
    hotline: "Varies by county",
    hotlineDisplay: "County-specific hotlines",
    statute: "Md. Code, Fam. Law \u00A7 5-704",
    reportingStandard: "Reason to believe",
    timeFrame: "Immediately by phone or in person; written report as soon as possible",
    failurePenalty: "Misdemeanor (up to 5 years prison and/or $10,000 fine for first offense)",
    immunityProvision: "Good-faith immunity under Md. Code, Fam. Law \u00A7 5-708",
    notes: "Maryland has one of the strictest penalties for failure to report. Written follow-up report is required after the oral report.",
    gaComparison: [
      "Category-based like Georgia",
      "Significantly harsher penalties (up to 5 years/$10,000 vs. GA misdemeanor)",
      "Both oral AND written reports required",
      "County-level intake system",
    ],
  },
  {
    abbrev: "MA",
    name: "Massachusetts",
    isUniversal: false,
    hotline: "1-800-792-5200",
    hotlineDisplay: "1-800-792-5200",
    statute: "Mass. Gen. Laws ch. 119, \u00A7 51A",
    reportingStandard: "Reasonable cause to believe",
    timeFrame: "Immediately by phone; written report within 48 hours",
    failurePenalty: "Fine up to $1,000",
    immunityProvision: "Good-faith immunity under Mass. Gen. Laws ch. 119, \u00A7 51A",
    notes: "Massachusetts requires mandated reporters to complete training. Reports go to the Department of Children and Families (DCF).",
    gaComparison: [
      "Category-based like Georgia with identical reporting standard",
      "Written follow-up required within 48 hours",
      "Lower penalty ceiling ($1,000 fine only vs. GA misdemeanor with possible jail)",
      "Mandatory reporter training required",
    ],
  },
  {
    abbrev: "WA",
    name: "Washington",
    isUniversal: false,
    hotline: "1-866-363-4276",
    hotlineDisplay: "1-866-END-HARM",
    statute: "RCW 26.44.030",
    reportingStandard: "Reasonable cause to believe",
    timeFrame: "Within 48 hours",
    failurePenalty: "Gross misdemeanor",
    immunityProvision: "Good-faith immunity under RCW 26.44.060",
    notes: "Washington has a 48-hour reporting window and classifies failure to report as a gross misdemeanor (more serious than a simple misdemeanor).",
    gaComparison: [
      "Category-based like Georgia",
      "48-hour window (vs. GA\u2019s 24 hours)",
      "Failure classified as gross misdemeanor (higher than GA\u2019s simple misdemeanor)",
    ],
  },
  {
    abbrev: "CO",
    name: "Colorado",
    isUniversal: false,
    hotline: "1-844-264-5437",
    hotlineDisplay: "1-844-CO-4-KIDS",
    statute: "C.R.S. \u00A7 19-3-304",
    reportingStandard: "Reasonable cause to know or suspect",
    timeFrame: "Within 24 hours",
    failurePenalty: "Class 3 misdemeanor (first offense); Class 2 misdemeanor (subsequent)",
    immunityProvision: "Good-faith immunity under C.R.S. \u00A7 19-3-309",
    notes: "Colorado has escalating penalties and includes clergy with no exception for clergy-penitent privilege for child abuse reporting.",
    gaComparison: [
      "Category-based like Georgia",
      "Same 24-hour reporting window",
      "Escalating penalty structure",
      "No clergy-penitent privilege exception (broader than GA)",
    ],
  },
  {
    abbrev: "AZ",
    name: "Arizona",
    isUniversal: false,
    hotline: "1-888-767-2445",
    hotlineDisplay: "1-888-SOS-CHILD",
    statute: "A.R.S. \u00A7 13-3620",
    reportingStandard: "Reasonably believes",
    timeFrame: "Immediately",
    failurePenalty: "Class 6 felony (for known/suspected physical abuse or neglect); Class 5 felony (for sexual abuse)",
    immunityProvision: "Good-faith immunity under A.R.S. \u00A7 13-3620(J)",
    notes: "Arizona is notable for classifying failure to report as a FELONY \u2014 one of the strictest penalties in the nation.",
    gaComparison: [
      "Category-based like Georgia",
      "FELONY for failure to report (vs. GA\u2019s misdemeanor \u2014 dramatically stricter)",
      "Higher felony class for failure to report sexual abuse",
    ],
  },
  {
    abbrev: "MI",
    name: "Michigan",
    isUniversal: false,
    hotline: "1-855-444-3911",
    hotlineDisplay: "1-855-444-3911",
    statute: "MCL 722.623",
    reportingStandard: "Reasonable cause to suspect",
    timeFrame: "Immediately by phone; written report within 72 hours",
    failurePenalty: "Misdemeanor (up to 93 days jail, $500 fine); felony if child suffers further abuse",
    immunityProvision: "Good-faith immunity under MCL 722.625",
    notes: "Michigan requires both oral and written reports and has felony escalation if failure to report results in further harm to the child.",
    gaComparison: [
      "Category-based like Georgia",
      "Written follow-up required within 72 hours",
      "Felony escalation if child suffers further harm due to failure to report",
    ],
  },
  {
    abbrev: "WI",
    name: "Wisconsin",
    isUniversal: false,
    hotline: "Varies by county",
    hotlineDisplay: "County-specific hotlines",
    statute: "Wis. Stat. \u00A7 48.981",
    reportingStandard: "Reasonable cause to suspect",
    timeFrame: "Immediately",
    failurePenalty: "Fine up to $1,000 and/or up to 6 months imprisonment",
    immunityProvision: "Good-faith immunity under Wis. Stat. \u00A7 48.981(4)",
    notes: "Wisconsin uses county-level intake through Child Protective Services agencies. The state also has specific provisions for tribal nations.",
    gaComparison: [
      "Category-based like Georgia",
      "County-level intake (vs. GA\u2019s statewide hotline)",
      "Includes tribal nation provisions",
    ],
  },
  {
    abbrev: "MN",
    name: "Minnesota",
    isUniversal: false,
    hotline: "Varies by county",
    hotlineDisplay: "County-specific hotlines",
    statute: "Minn. Stat. \u00A7 626.556",
    reportingStandard: "Knows or has reason to believe",
    timeFrame: "Within 24 hours",
    failurePenalty: "Misdemeanor; gross misdemeanor for failure to report sexual abuse",
    immunityProvision: "Good-faith immunity under Minn. Stat. \u00A7 626.556, subd. 4",
    notes: "Minnesota has a 24-hour reporting window matching Georgia's. Enhanced penalty for failing to report sexual abuse specifically.",
    gaComparison: [
      "Category-based like Georgia",
      "Same 24-hour reporting window",
      "Enhanced penalty tier for failure to report sexual abuse",
      "County-level intake system",
    ],
  },
];

/* ─── Utility to find a state ─── */
export function getStateInfo(abbrev: string): StateReportingInfo | undefined {
  return STATE_DATA.find((s) => s.abbrev === abbrev);
}

/* ─── Component ─── */

interface StateSelectorProps {
  /** Currently selected state abbreviation */
  selectedState: string;
  /** Callback when user picks a state */
  onSelect: (abbrev: string) => void;
  /** Compact mode for embedding in module header */
  compact?: boolean;
}

export function StateSelector({ selectedState, onSelect, compact = false }: StateSelectorProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const current = STATE_DATA.find((s) => s.abbrev === selectedState) || STATE_DATA[0];

  return (
    <div className={compact ? "" : "mb-6"}>
      {/* Selector */}
      <div className="relative inline-block">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card text-sm font-medium hover:border-primary/40 transition-colors"
        >
          <MapPin className="w-4 h-4" style={{ color: "#C9A84C" }} />
          <span>{current.abbrev} \u2014 {current.name}</span>
          {current.isUniversal && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold">Universal</span>
          )}
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
        </button>

        <AnimatePresence>
          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="absolute z-50 mt-1 w-[320px] max-h-[360px] overflow-y-auto rounded-xl border border-border bg-card shadow-xl"
            >
              <div className="p-2 border-b border-border">
                <p className="text-[10px] text-muted-foreground px-2 py-1">
                  Select a state to compare its mandated reporting law against the Georgia baseline
                </p>
              </div>
              {STATE_DATA.map((s) => (
                <button
                  key={s.abbrev}
                  onClick={() => { onSelect(s.abbrev); setDropdownOpen(false); }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-left text-sm hover:bg-secondary/60 transition-colors ${
                    s.abbrev === selectedState ? "bg-secondary font-semibold" : ""
                  }`}
                >
                  <span className="w-8 text-xs font-mono text-muted-foreground">{s.abbrev}</span>
                  <span className="flex-1">{s.name}</span>
                  {s.isUniversal && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold">Universal</span>
                  )}
                  {s.abbrev === "GA" && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: "#082A19", color: "#C9A84C" }}>Baseline</span>
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─── State Comparison Card ─── */

interface StateComparisonCardProps {
  stateAbbrev: string;
}

export function StateComparisonCard({ stateAbbrev }: StateComparisonCardProps) {
  const info = STATE_DATA.find((s) => s.abbrev === stateAbbrev);
  if (!info) return null;
  const isGA = info.abbrev === "GA";

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 flex items-center gap-3" style={{ background: isGA ? "#082A19" : "var(--secondary)" }}>
        <MapPin className="w-5 h-5" style={{ color: isGA ? "#C9A84C" : "var(--foreground)" }} />
        <div>
          <h3 className={`font-semibold text-sm ${isGA ? "text-white" : ""}`}>{info.name} Mandated Reporting Law</h3>
          <p className={`text-xs ${isGA ? "text-white/70" : "text-muted-foreground"}`}>{info.statute}</p>
        </div>
        {info.isUniversal && (
          <span className="ml-auto text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-800 font-bold">Universal Reporter State</span>
        )}
        {isGA && (
          <span className="ml-auto text-xs px-2 py-1 rounded-full font-bold" style={{ background: "#C9A84C", color: "#082A19" }}>Training Baseline</span>
        )}
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
        <DetailCell icon={<Phone className="w-3.5 h-3.5" />} label="Reporting Hotline" value={info.hotlineDisplay} highlight />
        <DetailCell icon={<AlertTriangle className="w-3.5 h-3.5" />} label="Reporting Standard" value={info.reportingStandard} />
        <DetailCell icon={<Info className="w-3.5 h-3.5" />} label="Time Frame" value={info.timeFrame} />
        <DetailCell icon={<AlertTriangle className="w-3.5 h-3.5" />} label="Failure to Report Penalty" value={info.failurePenalty} />
        <div className="md:col-span-2 bg-card px-4 py-3">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: "#0D3B22" }} />
            <div>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">Immunity Provision</p>
              <p className="text-xs mt-0.5">{info.immunityProvision}</p>
            </div>
          </div>
        </div>
        <div className="md:col-span-2 bg-card px-4 py-3">
          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide mb-1">Notes</p>
          <p className="text-xs text-muted-foreground">{info.notes}</p>
        </div>
      </div>

      {/* GA comparison */}
      {!isGA && info.gaComparison.length > 0 && (
        <div className="px-4 py-3 border-t border-border" style={{ background: "rgba(8,42,25,0.03)" }}>
          <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: "#082A19" }}>
            Differences from Georgia Baseline
          </p>
          <ul className="space-y-1.5">
            {info.gaComparison.map((diff, i) => (
              <li key={i} className="flex items-start gap-2 text-xs">
                <span className="mt-1 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#C9A84C" }} />
                {diff}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Disclaimer */}
      <div className="px-4 py-2 border-t border-border bg-amber-50/50">
        <p className="text-[10px] text-amber-800 flex items-start gap-1.5">
          <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />
          This summary is for training purposes only. Always verify your state's current statute, hotline, and procedures. This is not legal advice.
        </p>
      </div>
    </div>
  );
}

function DetailCell({ icon, label, value, highlight }: { icon: React.ReactNode; label: string; value: string; highlight?: boolean }) {
  return (
    <div className="bg-card px-4 py-3">
      <div className="flex items-start gap-2">
        <span className="mt-0.5 shrink-0 text-muted-foreground">{icon}</span>
        <div>
          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">{label}</p>
          <p className={`text-xs mt-0.5 ${highlight ? "font-bold" : ""}`} style={highlight ? { color: "#082A19" } : undefined}>{value}</p>
        </div>
      </div>
    </div>
  );
}