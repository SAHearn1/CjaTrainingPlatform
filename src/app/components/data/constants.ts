// Auto-generated from data.ts split (issue #27)

export const ROLES = [
  { id: "law_enforcement", label: "Law Enforcement", icon: "Shield" },
  { id: "cpi", label: "Child Protective Investigator", icon: "Heart" },
  { id: "prosecutor", label: "Prosecutor", icon: "Scale" },
  { id: "judge", label: "Judge", icon: "Gavel" },
  { id: "medical", label: "Medical Professional", icon: "Stethoscope" },
  { id: "school", label: "School Personnel", icon: "GraduationCap" },
  { id: "advocate", label: "Victim Advocate", icon: "HandHeart" },
  { id: "forensic", label: "Forensic Interviewer", icon: "Mic" },
  { id: "mandated_reporter", label: "Mandated Reporter", icon: "FileWarning" },
  { id: "instructor", label: "Training Instructor", icon: "GraduationCap" },
] as const;

export type RoleId = (typeof ROLES)[number]["id"];

/** Single canonical map of role IDs → human-readable labels (issue #37). */
export const ROLE_LABELS: Record<string, string> = {
  law_enforcement: "Law Enforcement Officer",
  cpi: "Child Protective Investigator",
  prosecutor: "Prosecuting Attorney",
  judge: "Judicial Officer",
  medical: "Medical Professional",
  school: "School Personnel",
  advocate: "Victim Advocate",
  forensic: "Forensic Interviewer",
  mandated_reporter: "Mandated Reporter",
  instructor: "Training Instructor",
  supervisor: "Supervisor",
  admin: "Administrator",
  superadmin: "Super Administrator",
};

export const MODULE_IMAGES = [
  "https://images.unsplash.com/photo-1620302044935-444961a5d028?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZCUyMHBzeWNob2xvZ3klMjB0aGVyYXB5JTIwc2Vzc2lvbnxlbnwxfHx8fDE3NzI3ODg2NTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1549925245-f20a1bac6454?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmFpbiUyMG5ldXJvc2NpZW5jZSUyMGlsbHVzdHJhdGlvbnxlbnwxfHx8fDE3NzI4MjA3NDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1764745222833-a67f88ab0960?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXNhYmlsaXR5JTIwYWNjZXNzaWJpbGl0eSUyMGluY2x1c2lvbnxlbnwxfHx8fDE3NzI4MjA3NDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1758541213979-fe8c9996e197?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3VydHJvb20lMjBsZWdhbCUyMGp1c3RpY2V8ZW58MXx8fHwxNzcyODIwNzQxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1758518731468-98e90ffd7430?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwY29sbGFib3JhdGlvbiUyMG1lZXRpbmclMjBkaXZlcnNlJTIwcHJvZmVzc2lvbmFsc3xlbnwxfHx8fDE3NzI4MjA3NDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1772419130717-e0630e3e4f28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2hvb2wlMjBjb3Vuc2Vsb3IlMjBlZHVjYXRvciUyMGNhcmluZ3xlbnwxfHx8fDE3NzI4MjA3NDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1629326329861-995081617bc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5kYXRlZCUyMHJlcG9ydGVyJTIwdHJhaW5pbmclMjBjb21tdW5pdHklMjB3b3JrZXJ8ZW58MXx8fHwxNzcyODMwNTA1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
];
