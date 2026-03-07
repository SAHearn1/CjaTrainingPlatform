import { EXTRA_PRE_QUESTIONS } from "./preAssessmentExpansion";
import { EXTRA_POST_QUESTIONS } from "./postAssessmentExpansion";

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
  supervisor: "Supervisor",
  admin: "Administrator",
  superadmin: "Super Administrator",
};

export interface Module {
  id: number;
  title: string;
  description: string;
  duration: string;
  image: string;
  sections: Section[];
  preAssessment: Assessment;
  postAssessment: Assessment;
  scenarios: Scenario[];
}

export interface Section {
  id: string;
  phase: string;
  title: string;
  description: string;
  content: string[];
  keyTerms?: KeyTerm[];
  videoUrl?: string;
}

export interface KeyTerm {
  term: string;
  definition: string;
}

export interface Assessment {
  id: string;
  title: string;
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  citations: string[];
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  steps: ScenarioStep[];
}

export interface ScenarioStep {
  id: string;
  narrative: string;
  choices: ScenarioChoice[];
  vignette?: VignetteScene[];
  /** Branch-specific vignettes keyed by the previous choice's branchKey */
  branchVignettes?: Record<string, VignetteScene[]>;
  /** Branch-specific narrative overrides keyed by previous choice's branchKey */
  branchNarratives?: Record<string, string>;
}

export interface VignetteScene {
  id: string;
  duration: number;
  setting: string;
  mood: "tense" | "calm" | "urgent" | "emotional" | "neutral" | "hopeful";
  characters: VignetteCharacter[];
  narration: string;
  ambientDetail?: string;
  soundCue?: string;
}

export interface VignetteCharacter {
  name: string;
  role: string;
  avatar: string;
  position: "left" | "center" | "right";
  emotion: "neutral" | "distressed" | "angry" | "calm" | "anxious" | "hopeful" | "withdrawn" | "defensive" | "focused" | "caring";
  dialogue?: string;
  action?: string;
}

export interface ScenarioChoice {
  text: string;
  outcome: string;
  isOptimal: boolean;
  tracePhase: string;
  citation?: string;
  /** Key that selects which branch vignette/narrative the next step should use */
  branchKey?: string;
}

export const MODULE_IMAGES = [
  "https://images.unsplash.com/photo-1620302044935-444961a5d028?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZCUyMHBzeWNob2xvZ3klMjB0aGVyYXB5JTIwc2Vzc2lvbnxlbnwxfHx8fDE3NzI3ODg2NTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1549925245-f20a1bac6454?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmFpbiUyMG5ldXJvc2NpZW5jZSUyMGlsbHVzdHJhdGlvbnxlbnwxfHx8fDE3NzI4MjA3NDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1764745222833-a67f88ab0960?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXNhYmlsaXR5JTIwYWNjZXNzaWJpbGl0eSUyMGluY2x1c2lvbnxlbnwxfHx8fDE3NzI4MjA3NDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1758541213979-fe8c9996e197?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3VydHJvb20lMjBsZWdhbCUyMGp1c3RpY2V8ZW58MXx8fHwxNzcyODIwNzQxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1758518731468-98e90ffd7430?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwY29sbGFib3JhdGlvbiUyMG1lZXRpbmclMjBkaXZlcnNlJTIwcHJvZmVzc2lvbmFsc3xlbnwxfHx8fDE3NzI4MjA3NDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1772419130717-e0630e3e4f28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2hvb2wlMjBjb3Vuc2Vsb3IlMjBlZHVjYXRvciUyMGNhcmluZ3xlbnwxfHx8fDE3NzI4MjA3NDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1629326329861-995081617bc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5kYXRlZCUyMHJlcG9ydGVyJTIwdHJhaW5pbmclMjBjb21tdW5pdHklMjB3b3JrZXJ8ZW58MXx8fHwxNzcyODMwNTA1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
];

export const MODULES: Module[] = [
  {
    id: 1,
    title: "Trauma-Informed Foundations of Child Abuse Investigation",
    description:
      "Foundational training in trauma-informed approaches to investigating suspected child abuse and neglect. Learn the RootWork 5Rs framework and TRACE cognitive cycle.",
    duration: "4 hours",
    image: MODULE_IMAGES[0],
    sections: [
      {
        id: "m1-root",
        phase: "Root",
        title: "Understanding Childhood Trauma",
        description: "Core concepts of childhood trauma and its impact on development",
        content: [
          "Childhood trauma fundamentally alters brain development, affecting how children process information, form relationships, and respond to stress.",
          "ACEs (Adverse Childhood Experiences) research demonstrates the long-term health and social consequences of childhood abuse and neglect.",
          "Key legal framework: Federal Child Abuse Prevention and Treatment Act (CAPTA) defines child abuse and neglect and establishes federal funding requirements for state programs.",
          "Understanding the neurobiology of trauma is essential for investigators to recognize trauma responses vs. behavioral disorders.",
        ],
        keyTerms: [
          { term: "ACEs", definition: "Adverse Childhood Experiences — potentially traumatic events occurring in childhood (0-17 years)" },
          { term: "CAPTA", definition: "Child Abuse Prevention and Treatment Act — federal legislation providing funding and guidance for child protective services" },
          { term: "Neurobiology of Trauma", definition: "The study of how traumatic experiences affect brain structure, chemistry, and function" },
        ],
      },
      {
        id: "m1-regulate",
        phase: "Regulate",
        title: "Professional Self-Regulation",
        description: "Managing personal responses during investigations",
        content: [
          "Investigators must recognize their own trauma responses when exposed to disturbing case material.",
          "The TRACE cycle helps identify: Trigger (case details) → Response (emotional reaction) → Appraisal (professional assessment) → Choice (informed action) → Effect (outcome).",
          "Vicarious trauma and secondary traumatic stress are occupational hazards requiring proactive management strategies.",
          "Regulation techniques include grounding exercises, peer support protocols, and structured debriefing processes.",
        ],
        keyTerms: [
          { term: "Vicarious Trauma", definition: "Cumulative transformation in the helper's inner experience resulting from empathic engagement with clients' trauma material" },
          { term: "TRACE Cycle", definition: "Trigger, Response, Appraisal, Choice, Effect — cognitive cycle for professional decision-making" },
        ],
      },
      {
        id: "m1-reflect",
        phase: "Reflect",
        title: "Case Analysis Workshop",
        description: "Interactive scenario analysis using the TRACE framework",
        content: [
          "Analyze case studies through the lens of trauma-informed practice.",
          "Identify moments where investigative decisions either supported or undermined child safety.",
          "Examine how investigator bias can influence case outcomes.",
          "Practice applying the TRACE cognitive cycle to real-world investigation scenarios.",
        ],
      },
      {
        id: "m1-restore",
        phase: "Restore",
        title: "Corrective Investigation Procedures",
        description: "Evidence-based investigation protocols",
        content: [
          "Structured investigation protocols that minimize re-traumatization.",
          "Documentation standards that preserve evidence while protecting child dignity.",
          "Interview scheduling and environmental considerations for child witnesses.",
          "Chain of custody procedures specific to child abuse evidence.",
        ],
      },
      {
        id: "m1-reconnect",
        phase: "Reconnect",
        title: "MDT Collaboration Framework",
        description: "Building effective multidisciplinary team responses",
        content: [
          "Roles and responsibilities within the MDT: law enforcement, CPS, prosecution, medical, mental health, and advocacy.",
          "Information-sharing protocols that comply with HIPAA, FERPA, and state confidentiality laws.",
          "Coordinated investigation models: Children's Advocacy Centers and joint investigation protocols.",
          "Victim support pathways from investigation through prosecution and beyond.",
        ],
      },
    ],
    preAssessment: {
      id: "m1-pre",
      title: "Module 1 Pre-Assessment",
      questions: [
        {
          id: "m1-pre-1",
          text: "What is the primary purpose of a trauma-informed investigation approach?",
          options: [
            "To speed up the investigation process",
            "To minimize additional trauma while gathering accurate information",
            "To reduce paperwork requirements",
            "To limit the number of interviews conducted",
          ],
          correctIndex: 1,
          explanation:
            "Trauma-informed investigation aims to minimize additional trauma to the child while still gathering accurate and complete information necessary for the investigation. SAMHSA's framework emphasizes that trauma-informed approaches realize the widespread impact of trauma and integrate knowledge into policies and practices.",
          citations: [
            "Substance Abuse and Mental Health Services Administration. (2014). SAMHSA's concept of trauma and guidance for a trauma-informed approach (HHS Publication No. SMA 14-4884). U.S. Department of Health and Human Services.",
            "Ko, S. J., Ford, J. D., Kassam-Adams, N., Berkowitz, S. J., Wilson, C., Wong, M., Brymer, M. J., & Layne, C. M. (2008). Creating trauma-informed systems: Child welfare, education, first responders, health care, juvenile justice. Professional Psychology: Research and Practice, 39(4), 396–404. https://doi.org/10.1037/0735-7028.39.4.396",
          ],
        },
        {
          id: "m1-pre-2",
          text: "What does TRACE stand for in the RootWork Framework?",
          options: [
            "Track, Record, Analyze, Conclude, Evaluate",
            "Trigger, Response, Appraisal, Choice, Effect",
            "Trust, Respect, Accountability, Communication, Empathy",
            "Trauma, Recovery, Assessment, Care, Education",
          ],
          correctIndex: 1,
          explanation:
            "TRACE stands for Trigger, Response, Appraisal, Choice, Effect — a cognitive cycle designed within the RootWork Framework to help professionals understand how their investigative behavior influences case outcomes. This model draws from cognitive appraisal theory in stress and emotion research.",
          citations: [
            "Lazarus, R. S., & Folkman, S. (1984). Stress, appraisal, and coping. Springer Publishing Company.",
            "Bride, B. E., Radey, M., & Figley, C. R. (2007). Measuring compassion fatigue. Clinical Social Work Journal, 35(3), 155–163. https://doi.org/10.1007/s10615-007-0091-7",
          ],
        },
        {
          id: "m1-pre-3",
          text: "Which federal law establishes the minimum standards for defining child abuse and neglect?",
          options: [
            "Americans with Disabilities Act",
            "IDEA",
            "Child Abuse Prevention and Treatment Act (CAPTA)",
            "Family Educational Rights and Privacy Act",
          ],
          correctIndex: 2,
          explanation:
            "CAPTA, originally enacted in 1974 and most recently reauthorized as the CAPTA Reauthorization Act of 2010, provides minimum standards for defining child physical abuse and neglect and sexual abuse and establishes requirements for state child protective service programs.",
          citations: [
            "Child Abuse Prevention and Treatment Act, 42 U.S.C. §§ 5101–5119 (2010).",
            "U.S. Department of Health and Human Services, Children's Bureau. (2019). Child maltreatment 2019. https://www.acf.hhs.gov/cb/report/child-maltreatment-2019",
          ],
        },
        {
          id: "m1-pre-4",
          text: "What is vicarious trauma?",
          options: [
            "Trauma experienced directly by the investigator",
            "A cumulative effect of working with traumatized individuals",
            "The trauma a child experiences during an interview",
            "Trauma caused by administrative stress",
          ],
          correctIndex: 1,
          explanation:
            "Vicarious trauma refers to the cumulative transformative effect on professionals who work with trauma survivors, fundamentally affecting their worldview, spirituality, and psychological well-being. McCann and Pearlman first described vicarious traumatization as disruptions in the helper's cognitive schemas.",
          citations: [
            "McCann, I. L., & Pearlman, L. A. (1990). Vicarious traumatization: A framework for understanding the psychological effects of working with victims. Journal of Traumatic Stress, 3(1), 131–149. https://doi.org/10.1007/BF00975140",
            "Pearlman, L. A., & Saakvitne, K. W. (1995). Trauma and the therapist: Countertransference and vicarious traumatization in psychotherapy with incest survivors. W. W. Norton & Company.",
          ],
        },
        {
          id: "m1-pre-5",
          text: "What is the first phase of the RootWork 5Rs framework?",
          options: ["Regulate", "Reflect", "Root", "Restore"],
          correctIndex: 2,
          explanation:
            "Root is the first phase of the 5Rs framework, focused on establishing the foundational understanding of core concepts and relevant legal context. This grounding phase parallels Bloom's trauma-informed organizational model, which emphasizes that understanding the 'roots' of behavior is prerequisite to intervention.",
          citations: [
            "Bloom, S. L. (2013). Creating sanctuary: Toward the evolution of sane societies (2nd ed.). Routledge.",
            "Harris, M., & Fallot, R. D. (2001). Using trauma theory to design service systems. Jossey-Bass.",
          ],
        },
      ],
    },
    postAssessment: {
      id: "m1-post",
      title: "Module 1 Competency Evaluation",
      questions: [
        {
          id: "m1-post-1",
          text: "An investigator notices their heart racing and feeling angry when reviewing graphic case photos. Using the TRACE cycle, what should be their next step after recognizing this Trigger and Response?",
          options: [
            "Immediately leave the room",
            "Conduct an Appraisal — consciously evaluate whether their emotional response will impact their professional judgment",
            "Continue working and ignore the feelings",
            "Transfer the case to another investigator",
          ],
          correctIndex: 1,
          explanation:
            "After recognizing the Trigger and Response, the professional Appraisal step involves consciously evaluating whether the emotional response might impact professional judgment and case decisions. This mirrors Gross's process model of emotion regulation, where cognitive reappraisal is the most effective strategy for managing emotional responses in professional contexts.",
          citations: [
            "Gross, J. J. (1998). The emerging field of emotion regulation: An integrative review. Review of General Psychology, 2(3), 271–299. https://doi.org/10.1037/1089-2680.2.3.271",
            "Figley, C. R. (Ed.). (2002). Treating compassion fatigue. Brunner-Routledge.",
            "Lazarus, R. S. (1991). Emotion and adaptation. Oxford University Press.",
          ],
        },
        {
          id: "m1-post-2",
          text: "Which of the following best describes a trauma-informed interview environment?",
          options: [
            "A sterile interrogation room with recording equipment visible",
            "A child-friendly, comfortable space that promotes psychological safety",
            "Any available office space",
            "The child's home regardless of circumstances",
          ],
          correctIndex: 1,
          explanation:
            "A trauma-informed interview environment should be child-friendly, comfortable, and specifically designed to promote psychological safety while still meeting forensic requirements. The National Children's Alliance standards specify physical environment requirements for Children's Advocacy Centers.",
          citations: [
            "National Children's Alliance. (2017). Standards for accredited members (2017 edition). https://www.nationalchildrensalliance.org",
            "Saywitz, K. J., Lyon, T. D., & Goodman, G. S. (2018). When interviewing children: A review and update. In J. Conte & B. Klika (Eds.), The APSAC handbook on child maltreatment (4th ed., pp. 310–329). Sage Publications.",
          ],
        },
        {
          id: "m1-post-3",
          text: "In a multidisciplinary team (MDT) response, what is the primary role of the victim advocate?",
          options: [
            "To conduct the forensic interview",
            "To make prosecutorial decisions",
            "To provide emotional support and ensure the child's needs are centered throughout the process",
            "To complete the medical examination",
          ],
          correctIndex: 2,
          explanation:
            "The victim advocate's primary role is to provide emotional support to the child and family, ensure their needs are centered, and connect them with appropriate services. This role is defined in the Victims of Crime Act (VOCA) and further elaborated in CAC standards.",
          citations: [
            "Victims of Crime Act of 1984, 34 U.S.C. §§ 20101–20111 (1984).",
            "Cross, T. P., Jones, L. M., Walsh, W. A., Simone, M., & Kolko, D. (2007). Child forensic interviewing in Children's Advocacy Centers: Empirical data on a practice model. Child Abuse & Neglect, 31(10), 1031–1052. https://doi.org/10.1016/j.chiabu.2007.04.007",
          ],
        },
        {
          id: "m1-post-4",
          text: "How does the 'Reconnect' phase of the 5Rs framework apply to child abuse investigations?",
          options: [
            "Reconnecting evidence to suspects",
            "Re-interviewing the child",
            "Building multidisciplinary collaboration and ensuring victim support pathways",
            "Reconnecting the child with the alleged abuser",
          ],
          correctIndex: 2,
          explanation:
            "The Reconnect phase focuses on multidisciplinary collaboration and establishing victim support pathways from investigation through prosecution and beyond. This aligns with the ecological systems approach to child protection advocated by Bronfenbrenner.",
          citations: [
            "Bronfenbrenner, U. (1979). The ecology of human development: Experiments by nature and design. Harvard University Press.",
            "Herbert, J. L., & Bromfield, L. (2016). Evidence for the efficacy of the Child Advocacy Center model: A systematic review. Trauma, Violence, & Abuse, 17(3), 341–357. https://doi.org/10.1177/1524838015585319",
          ],
        },
        {
          id: "m1-post-5",
          text: "Which of the following is NOT a recommended strategy for managing secondary traumatic stress?",
          options: [
            "Regular peer debriefing sessions",
            "Grounding exercises between difficult cases",
            "Working longer hours to process more cases quickly",
            "Structured supervision with trauma-aware supervisors",
          ],
          correctIndex: 2,
          explanation:
            "Working longer hours is not a recommended strategy and can actually worsen secondary traumatic stress. Evidence-based strategies include peer support, grounding exercises, and structured supervision. Stamm's Professional Quality of Life model distinguishes between compassion satisfaction and compassion fatigue.",
          citations: [
            "Stamm, B. H. (2010). The concise ProQOL manual (2nd ed.). ProQOL.org.",
            "Salloum, A., Kondrat, D. C., Johnco, C., & Olson, K. R. (2015). The role of self-care on compassion satisfaction, burnout and secondary trauma among child welfare workers. Children and Youth Services Review, 49, 54–61. https://doi.org/10.1016/j.childyouth.2014.12.024",
            "Sprang, G., Craig, C., & Clark, J. (2011). Secondary traumatic stress and burnout in child welfare workers: A comparative analysis of occupational distress across professional groups. Child Welfare, 90(6), 149–168.",
          ],
        },
      ],
    },
    scenarios: [
      {
        id: "m1-s1",
        title: "First Response: Initial Contact with a Distressed Child",
        description:
          "You are a law enforcement officer responding to a school where a 7-year-old has disclosed physical abuse to their teacher.",
        steps: [
          {
            id: "m1-s1-step1",
            narrative:
              "You arrive at the school and are directed to the counselor's office. The child, Maya, is sitting in a chair, visibly upset and not making eye contact. The school counselor tells you Maya showed bruising on her arms during PE class.",
            vignette: [
              {
                id: "m1-v1-s1",
                duration: 5,
                setting: "School parking lot — midday, overcast sky",
                mood: "tense",
                characters: [
                  { name: "You", role: "Investigator", avatar: "🔍", position: "center", emotion: "focused", action: "Walking toward the main entrance, badge visible" },
                ],
                narration: "You pull into the school lot and take a steadying breath. A referral came in 40 minutes ago — possible physical abuse, a 7-year-old girl. You know the next few minutes will set the tone for everything that follows.",
                ambientDetail: "Children's laughter drifts from the distant playground. The school flag snaps in the wind.",
                soundCue: "Car door closing, footsteps on pavement",
              },
              {
                id: "m1-v1-s2",
                duration: 6,
                setting: "School hallway — fluorescent lights, children's artwork on walls",
                mood: "neutral",
                characters: [
                  { name: "You", role: "Investigator", avatar: "🔍", position: "left", emotion: "focused", action: "Following the principal down the corridor" },
                  { name: "Principal Torres", role: "School Principal", avatar: "👩‍💼", position: "right", emotion: "anxious", dialogue: "The counselor is with her. She hasn't said much since PE. The teacher saw bruises on both arms when Maya changed for gym class." },
                ],
                narration: "Principal Torres walks quickly, keeping her voice low. Other students pass by, oblivious. You note the details: bruising on both arms, noticed during PE, child has been quiet.",
                ambientDetail: "Lockers line the hallway. A distant bell rings.",
              },
              {
                id: "m1-v1-s3",
                duration: 7,
                setting: "School counselor's office — small, warm lighting, posters about feelings on the walls",
                mood: "emotional",
                characters: [
                  { name: "Maya", role: "Child (age 7)", avatar: "👧", position: "right", emotion: "withdrawn", action: "Sitting in an oversized chair, knees pulled up, not making eye contact" },
                  { name: "Ms. Chen", role: "School Counselor", avatar: "👩‍🏫", position: "center", emotion: "caring", dialogue: "Maya, this is someone who helps keep kids safe. Is it okay if they come in?" },
                  { name: "You", role: "Investigator", avatar: "🔍", position: "left", emotion: "calm", action: "Standing in the doorway, observing before entering" },
                ],
                narration: "Maya is curled into the chair, making herself small. Her sleeves are pulled down over her hands. She glances up briefly — her eyes are red from crying — then looks away. The counselor sits nearby, a box of crayons on the table between them.",
                ambientDetail: "A poster reads 'It's okay to have big feelings.' Maya's backpack, covered in butterfly stickers, sits on the floor.",
                soundCue: "Soft ambient room tone, occasional sniffle from Maya",
              },
            ],
            choices: [
              {
                text: "Immediately ask Maya to show you the bruises and tell you what happened",
                outcome:
                  "Maya becomes more withdrawn and begins crying. Your direct approach triggered a fear response. The investigation starts with the child feeling unsafe.",
                isOptimal: false,
                tracePhase: "Trigger → Unregulated Response",
                citation: "Saywitz, K. J., & Camparo, L. B. (2014). Interviewing children: A primer. In G. B. Melton et al. (Eds.), The SAGE handbook of child research (pp. 371–390). Sage.",
                branchKey: "direct_approach",
              },
              {
                text: "Kneel to Maya's eye level, introduce yourself calmly, and ask if she'd like to draw or play while you talk",
                outcome:
                  "Maya begins to relax slightly. Your calm, child-appropriate approach establishes initial psychological safety. She picks up a crayon.",
                isOptimal: true,
                tracePhase: "Trigger → Regulated Response → Informed Choice",
                citation: "Lamb, M. E., Orbach, Y., Hershkowitz, I., Esplin, P. W., & Horowitz, D. (2007). A structured forensic interview protocol improves the quality and informativeness of investigative interviews with children. Child Abuse & Neglect, 31(11–12), 1201–1231. https://doi.org/10.1016/j.chiabu.2007.03.021",
                branchKey: "calm_approach",
              },
              {
                text: "Ask the school counselor to leave so you can interview Maya alone",
                outcome:
                  "Maya becomes anxious when the familiar adult leaves. Without a support person, the child feels more vulnerable in the investigation setting.",
                isOptimal: false,
                tracePhase: "Trigger → Response without Appraisal",
                citation: "Bottoms, B. L., Quas, J. A., & Davis, S. L. (2007). The influence of the interviewer-provided social support on children's suggestibility, memory, and disclosures. In M.-E. Pipe et al. (Eds.), Child sexual abuse (pp. 135–157). Lawrence Erlbaum Associates.",
                branchKey: "isolate_child",
              },
            ],
          },
          {
            id: "m1-s1-step2",
            narrative:
              "Maya has become slightly more comfortable. She mentions that 'mommy's boyfriend gets really mad sometimes.' She looks at you nervously after saying this.",
            branchNarratives: {
              direct_approach: "Maya is still crying from your earlier direct approach. After several long minutes of silence and the counselor's gentle reassurance, she has calmed slightly — but she flinches when you shift in your seat. Then, almost inaudibly, she whispers: 'Mommy's boyfriend gets really mad sometimes.' She immediately looks terrified, as if she shouldn't have said it.",
              calm_approach: "Maya has become noticeably more comfortable since you joined her on the floor with crayons. She's drawn a house, a sun, and what looks like a small figure standing alone. Unprompted, she says quietly: 'Mommy's boyfriend... he gets really mad sometimes.' She looks at you — not with fear, but with cautious hope.",
              isolate_child: "Without Ms. Chen in the room, Maya has been nearly silent, gripping her backpack straps. You've tried to engage her gently, but trust hasn't formed. Then, in a voice barely above a whisper: 'Mommy's boyfriend gets really mad sometimes.' She says it to the floor, not to you.",
            },
            branchVignettes: {
              direct_approach: [
                {
                  id: "m1-v2-branch-direct-s1",
                  duration: 5,
                  setting: "School counselor's office — tense atmosphere, several minutes after your direct approach",
                  mood: "tense",
                  characters: [
                    { name: "Maya", role: "Child (age 7)", avatar: "👧", position: "right", emotion: "distressed", action: "Hugging her knees, tear tracks on her cheeks, occasionally hiccupping" },
                    { name: "Ms. Chen", role: "School Counselor", avatar: "👩‍🏫", position: "center", emotion: "caring", action: "Sitting close to Maya, offering tissues" },
                    { name: "You", role: "Investigator", avatar: "🔍", position: "left", emotion: "anxious", action: "Sitting back, giving space, realizing the impact of your approach" },
                  ],
                  narration: "The room feels heavy. Your direct question about the bruises triggered exactly what the training warned about — a fear response that shut Maya down. The counselor has spent the last few minutes gently reassuring her. You recognize your mistake: you let urgency override regulation.",
                  ambientDetail: "Maya's untouched crayon box sits on the table. The clock ticks loudly in the silence.",
                  soundCue: "Soft crying, tissue sounds",
                },
                {
                  id: "m1-v2-branch-direct-s2",
                  duration: 5,
                  setting: "School counselor's office — a fragile moment",
                  mood: "emotional",
                  characters: [
                    { name: "Maya", role: "Child (age 7)", avatar: "👧", position: "center", emotion: "withdrawn", dialogue: "Mommy's boyfriend... he gets really mad sometimes.", action: "Whispers without looking up, then immediately covers her mouth" },
                  ],
                  narration: "Despite your earlier misstep, Maya's need to tell someone is stronger than her fear. The words slip out — barely audible, directed at no one. But she immediately looks terrified, as if the words themselves were dangerous. This moment is more fragile than it would have been. You have a second chance, but the margin for error is razor-thin.",
                  ambientDetail: "Maya pulls her sleeves down further, covering her hands completely.",
                },
              ],
              calm_approach: [
                {
                  id: "m1-v2-branch-calm-s1",
                  duration: 5,
                  setting: "School counselor's office — warmer atmosphere, crayons scattered on the floor",
                  mood: "calm",
                  characters: [
                    { name: "Maya", role: "Child (age 7)", avatar: "👧", position: "right", emotion: "anxious", action: "Drawing a house with dark windows, occasionally glancing at you with curiosity rather than fear" },
                    { name: "You", role: "Investigator", avatar: "🔍", position: "left", emotion: "calm", action: "Sitting cross-legged on the floor, drawing alongside Maya" },
                  ],
                  narration: "Your calm approach worked. By meeting Maya at her level — literally and emotionally — you created enough safety for her to pick up a crayon. You've been drawing side by side for a few minutes. She drew a house. One window is colored in dark. She keeps looking at that window.",
                  ambientDetail: "Crayons scattered between you. Maya's drawing shows a small figure standing alone near the dark window.",
                  soundCue: "Crayon on paper, soft breathing",
                },
                {
                  id: "m1-v2-branch-calm-s2",
                  duration: 5,
                  setting: "School counselor's office — the disclosure moment",
                  mood: "emotional",
                  characters: [
                    { name: "Maya", role: "Child (age 7)", avatar: "👧", position: "center", emotion: "hopeful", dialogue: "Mommy's boyfriend... he gets really mad sometimes.", action: "Puts down the crayon, looks directly at you for the first time" },
                  ],
                  narration: "Maya stops drawing. She looks at you — really looks at you — for the first time. Her voice is quiet but steady. She chose to tell you. The safety you built gave her the courage to open that door herself. This is what regulated, trauma-informed practice makes possible.",
                  ambientDetail: "Maya's drawing of the house lies between you, the dark window a silent testament.",
                },
              ],
              isolate_child: [
                {
                  id: "m1-v2-branch-isolate-s1",
                  duration: 5,
                  setting: "School counselor's office — empty feeling, Ms. Chen absent",
                  mood: "tense",
                  characters: [
                    { name: "Maya", role: "Child (age 7)", avatar: "👧", position: "right", emotion: "anxious", action: "Gripping backpack straps, feet not touching the floor, looking at the door" },
                    { name: "You", role: "Investigator", avatar: "🔍", position: "left", emotion: "focused", action: "Trying to engage gently, but aware of the distance between you" },
                  ],
                  narration: "Without the counselor — the one adult Maya trusted in this building — the room feels empty despite two people in it. Maya keeps looking at the door, as if waiting for Ms. Chen to return. Your attempts at conversation have been met with silence or one-word answers. The trust you need hasn't formed.",
                  ambientDetail: "The empty chair where Ms. Chen sat. Maya's eyes keep returning to it.",
                  soundCue: "Clock ticking, hallway sounds through the closed door",
                },
                {
                  id: "m1-v2-branch-isolate-s2",
                  duration: 5,
                  setting: "School counselor's office — an unexpected whisper",
                  mood: "emotional",
                  characters: [
                    { name: "Maya", role: "Child (age 7)", avatar: "👧", position: "center", emotion: "withdrawn", dialogue: "Mommy's boyfriend gets really mad sometimes.", action: "Says it to the floor, not making eye contact, voice barely audible" },
                  ],
                  narration: "Maya whispers it to the floor — not to you. Without a trusted support person present, this disclosure feels less like a choice and more like a pressure valve releasing. She doesn't look to you for comfort afterward. She just stares at her shoes. The information is the same, but the therapeutic relationship that should carry it forward is missing.",
                  ambientDetail: "Maya curls tighter into herself after speaking.",
                },
              ],
            },
            vignette: [
              {
                id: "m1-v2-s1",
                duration: 5,
                setting: "School counselor's office — same room, a few minutes later",
                mood: "calm",
                characters: [
                  { name: "Maya", role: "Child (age 7)", avatar: "👧", position: "right", emotion: "anxious", action: "Drawing with a blue crayon, occasionally looking up" },
                  { name: "You", role: "Investigator", avatar: "🔍", position: "left", emotion: "calm", action: "Sitting on the floor nearby, at Maya's level" },
                ],
                narration: "Some time has passed. Maya has started drawing — a house with a big sun. You've been sitting quietly, letting her lead. The tension in her shoulders has eased slightly.",
                ambientDetail: "The sound of crayon on paper. Maya's drawing shows a house with one window dark.",
              },
              {
                id: "m1-v2-s2",
                duration: 6,
                setting: "School counselor's office — close-up on Maya",
                mood: "emotional",
                characters: [
                  { name: "Maya", role: "Child (age 7)", avatar: "👧", position: "center", emotion: "anxious", dialogue: "Mommy's boyfriend... he gets really mad sometimes.", action: "Stops drawing, grips the crayon tightly, glances at you with wide eyes" },
                ],
                narration: "Maya stops mid-stroke. Her voice is barely above a whisper. She says it quickly, like she's testing whether it's safe to let the words out. Then she freezes, watching your face for any reaction.",
                ambientDetail: "The clock on the wall ticks. Maya's hand trembles slightly.",
                soundCue: "Silence, then a quiet sniffle",
              },
              {
                id: "m1-v2-s3",
                duration: 4,
                setting: "School counselor's office — your perspective",
                mood: "tense",
                characters: [
                  { name: "You", role: "Investigator", avatar: "🔍", position: "center", emotion: "focused", action: "Maintaining calm expression, leaning slightly forward" },
                  { name: "Maya", role: "Child (age 7)", avatar: "👧", position: "right", emotion: "withdrawn", action: "Looking down, waiting" },
                ],
                narration: "This is the critical moment. Maya has opened a door. How you respond in the next few seconds will determine whether she walks through it or shuts it forever. Your training, your regulation, your next words — they all matter right now.",
                ambientDetail: "Your heartbeat. The weight of responsibility.",
              },
            ],
            choices: [
              {
                text: "Say: 'Did mommy's boyfriend hit you? Is that how you got those bruises?'",
                outcome:
                  "This leading question could compromise the forensic integrity of the disclosure. Maya nods but the response may not be reliable for court purposes.",
                isOptimal: false,
                tracePhase: "Response without proper Appraisal",
                citation: "Ceci, S. J., & Bruck, M. (1995). Jeopardy in the courtroom: A scientific analysis of children's testimony. American Psychological Association.",
              },
              {
                text: "Say: 'Thank you for telling me that, Maya. You're being very brave. Can you tell me more about what happens when he gets mad?'",
                outcome:
                  "Maya feels validated and continues her narrative. Your open-ended, supportive approach produces more detailed and forensically sound information.",
                isOptimal: true,
                tracePhase: "Regulated Response → Careful Appraisal → Optimal Choice",
                citation: "Lamb, M. E., Orbach, Y., Hershkowitz, I., Esplin, P. W., & Horowitz, D. (2007). A structured forensic interview protocol improves the quality and informativeness of investigative interviews with children. Child Abuse & Neglect, 31(11–12), 1201–1231.",
              },
              {
                text: "Start writing detailed notes and ask rapid follow-up questions about frequency and severity",
                outcome:
                  "Maya notices you writing and becomes guarded. The investigative pressure overwhelms her ability to provide a coherent narrative.",
                isOptimal: false,
                tracePhase: "Trigger → Procedural Response without Regulation",
                citation: "Poole, D. A., & Lamb, M. E. (1998). Investigative interviews of children: A guide for helping professionals. American Psychological Association.",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Communication and Interviewing in Sensitive Investigations",
    description:
      "Advanced training in forensic interviewing techniques, de-escalation strategies, and trauma-informed communication with children, families, and collateral contacts.",
    duration: "5 hours",
    image: MODULE_IMAGES[1],
    sections: [
      {
        id: "m2-root",
        phase: "Root",
        title: "Principles of Forensic Communication",
        description: "Evidence-based communication frameworks for sensitive investigations",
        content: [
          "Forensic interviewing requires balancing therapeutic rapport with investigative accuracy.",
          "Developmentally appropriate language is critical �� vocabulary, syntax, and conceptual complexity must match the child's developmental stage.",
          "Non-leading, open-ended questions produce the most reliable and admissible testimony.",
          "Cultural competency in communication extends beyond language translation to understanding family dynamics, discipline norms, and help-seeking behaviors.",
        ],
        keyTerms: [
          { term: "Forensic Interview", definition: "A structured conversation designed to obtain accurate and detailed information for investigation and potential legal proceedings" },
          { term: "Rapport Building", definition: "The process of establishing a comfortable, trusting relationship prior to substantive questioning" },
          { term: "Developmentally Appropriate", definition: "Communication adapted to match the child's cognitive, linguistic, and emotional developmental level" },
        ],
      },
      {
        id: "m2-regulate",
        phase: "Regulate",
        title: "Emotional Regulation in High-Stress Interviews",
        description: "Managing emotional responses during difficult disclosures",
        content: [
          "Maintaining neutral affect during disturbing disclosures while remaining empathetic.",
          "De-escalation techniques for working with hostile or defensive caregivers.",
          "Recognizing and managing countertransference during interviews.",
          "Self-care protocols before, during, and after difficult interviews.",
        ],
      },
      {
        id: "m2-reflect",
        phase: "Reflect",
        title: "Interview Analysis Lab",
        description: "Review and analyze interview techniques through case examples",
        content: [
          "Video-based analysis of interview techniques — identify strengths and areas for improvement.",
          "Compare leading vs. non-leading questioning strategies and their impact on testimony.",
          "Evaluate rapport-building approaches across different child age groups.",
          "Assess cultural considerations in interview approaches.",
        ],
      },
      {
        id: "m2-restore",
        phase: "Restore",
        title: "Advanced Interview Protocols",
        description: "Structured interview methodologies",
        content: [
          "NICHD Protocol and its evidence base for forensic interviews.",
          "Extended forensic interview models for complex cases.",
          "Documentation and recording requirements for forensic interviews.",
          "Handling recantation and inconsistent disclosures.",
        ],
      },
      {
        id: "m2-reconnect",
        phase: "Reconnect",
        title: "Collaborative Communication Networks",
        description: "Building communication pathways across disciplines",
        content: [
          "Coordinating pre-interview information sharing without contaminating the child's narrative.",
          "Post-interview MDT case conferencing protocols.",
          "Family engagement strategies that maintain investigative integrity.",
          "Connecting families with support services during active investigations.",
        ],
      },
    ],
    preAssessment: {
      id: "m2-pre",
      title: "Module 2 Pre-Assessment",
      questions: [
        {
          id: "m2-pre-1",
          text: "What type of interview question is most likely to produce reliable testimony from a child?",
          options: [
            "Yes/No questions",
            "Leading questions",
            "Open-ended, non-leading questions",
            "Multiple choice questions",
          ],
          correctIndex: 2,
          explanation:
            "Open-ended, non-leading questions allow children to provide information in their own words, producing the most reliable and forensically sound testimony. Research consistently demonstrates that free-recall prompts yield more accurate information than focused or suggestive questions.",
          citations: [
            "Lamb, M. E., Hershkowitz, I., Orbach, Y., & Esplin, P. W. (2008). Tell me what happened: Structured investigative interviews of child victims and witnesses. Wiley-Blackwell.",
            "Lyon, T. D. (2014). Interviewing children. Annual Review of Law and Social Science, 10, 73–89. https://doi.org/10.1146/annurev-lawsocsci-110413-030913",
          ],
        },
        {
          id: "m2-pre-2",
          text: "What is the NICHD Protocol?",
          options: [
            "A medical examination protocol",
            "A structured forensic interview protocol based on research",
            "A law enforcement report writing standard",
            "A child welfare assessment tool",
          ],
          correctIndex: 1,
          explanation:
            "The NICHD (National Institute of Child Health and Human Development) Protocol is a structured, evidence-based forensic interview protocol developed through extensive field research, designed to maximize the amount of information obtained from child witnesses through open-ended prompts.",
          citations: [
            "Lamb, M. E., Orbach, Y., Hershkowitz, I., Esplin, P. W., & Horowitz, D. (2007). A structured forensic interview protocol improves the quality and informativeness of investigative interviews with children. Child Abuse & Neglect, 31(11–12), 1201–1231. https://doi.org/10.1016/j.chiabu.2007.03.021",
            "Orbach, Y., Hershkowitz, I., Lamb, M. E., Sternberg, K. J., Esplin, P. W., & Horowitz, D. (2000). Assessing the value of structured protocols for forensic interviews of alleged child abuse victims. Child Abuse & Neglect, 24(6), 733–752.",
          ],
        },
        {
          id: "m2-pre-3",
          text: "During a forensic interview, a child becomes silent and withdrawn. What is the trauma-informed response?",
          options: [
            "Repeat the question more firmly",
            "End the interview immediately",
            "Acknowledge the difficulty and offer a break while maintaining a supportive presence",
            "Ask the parent to encourage the child to talk",
          ],
          correctIndex: 2,
          explanation:
            "Acknowledging difficulty and offering a break maintains the child's psychological safety while allowing them to regulate before potentially continuing. This reflects the principle of pacing the interview according to the child's emotional state.",
          citations: [
            "Hershkowitz, I., Lamb, M. E., & Katz, C. (2014). Allegation rates in forensic child abuse investigations: Comparing the revised and standard NICHD protocols. Psychology, Public Policy, and Law, 20(3), 336–344. https://doi.org/10.1037/a0037391",
            "Saywitz, K. J., Lyon, T. D., & Goodman, G. S. (2018). When interviewing children: A review and update. In J. Conte & B. Klika (Eds.), The APSAC handbook on child maltreatment (4th ed., pp. 310–329). Sage.",
          ],
        },
      ],
    },
    postAssessment: {
      id: "m2-post",
      title: "Module 2 Competency Evaluation",
      questions: [
        {
          id: "m2-post-1",
          text: "Which of the following demonstrates developmentally appropriate communication with a 4-year-old?",
          options: [
            "Using simple, concrete language and allowing physical demonstration with anatomical aids",
            "Asking the child to write down what happened",
            "Using adult terminology and expecting verbal responses",
            "Showing the child photos and asking them to identify the perpetrator",
          ],
          correctIndex: 0,
          explanation:
            "Four-year-olds communicate best with simple, concrete language and may benefit from non-verbal aids to express their experiences. Piaget's preoperational stage (ages 2-7) indicates that children at this age think concretely and may struggle with abstract or complex verbal questions.",
          citations: [
            "Piaget, J. (1952). The origins of intelligence in children (M. Cook, Trans.). International Universities Press.",
            "Faller, K. C. (2007). Interviewing children about sexual abuse: Controversies and best practice. Oxford University Press.",
            "Anderson, G. D., Anderson, J. N., & Gilgun, J. F. (2014). The influence of narrative practice techniques on child behaviors in forensic interviews. Journal of Child Sexual Abuse, 23(6), 615–634.",
          ],
        },
        {
          id: "m2-post-2",
          text: "A caregiver becomes hostile during an investigation interview. What is the recommended de-escalation approach?",
          options: [
            "Match their energy to establish authority",
            "Threaten legal consequences if they don't cooperate",
            "Acknowledge their emotions, maintain calm, and redirect to the shared concern for the child's safety",
            "End the interview and return with law enforcement backup",
          ],
          correctIndex: 2,
          explanation:
            "De-escalation involves acknowledging emotions, maintaining professional calm, and redirecting focus to shared goals — the child's safety and well-being. Motivational interviewing principles emphasize rolling with resistance rather than confronting it.",
          citations: [
            "Miller, W. R., & Rollnick, S. (2013). Motivational interviewing: Helping people change (3rd ed.). Guilford Press.",
            "Turnell, A., & Edwards, S. (1999). Signs of safety: A safety and solution oriented approach to child protection casework. W. W. Norton & Company.",
          ],
        },
        {
          id: "m2-post-3",
          text: "What is the forensic significance of avoiding leading questions?",
          options: [
            "It makes interviews shorter",
            "Leading questions can implant false memories and render testimony inadmissible",
            "It reduces paperwork",
            "It makes the interview less stressful for the interviewer",
          ],
          correctIndex: 1,
          explanation:
            "Leading questions can implant false information, contaminate memories, and render testimony unreliable and potentially inadmissible in court. Loftus's research on the misinformation effect demonstrates how post-event information can alter memory.",
          citations: [
            "Loftus, E. F. (2005). Planting misinformation in the human mind: A 30-year investigation of the malleability of memory. Learning & Memory, 12(4), 361–366. https://doi.org/10.1101/lm.94705",
            "Ceci, S. J., & Bruck, M. (1995). Jeopardy in the courtroom: A scientific analysis of children's testimony. American Psychological Association.",
            "Bruck, M., Ceci, S. J., & Hembrooke, H. (2002). The nature of children's true and false narratives. Developmental Review, 22(3), 520–554.",
          ],
        },
      ],
    },
    scenarios: [
      {
        id: "m2-s1",
        title: "De-escalating a Defensive Caregiver",
        description:
          "You must interview a parent who has been accused of neglect and is hostile toward the investigation.",
        steps: [
          {
            id: "m2-s1-step1",
            narrative:
              "You arrive at the family home for a scheduled interview. The mother opens the door and immediately says, 'I know why you're here. Someone is lying about me. My kids are fine. You have no right to be here.'",
            vignette: [
              {
                id: "m2-v1-s1",
                duration: 5,
                setting: "Residential neighborhood — late afternoon, warm light",
                mood: "neutral",
                characters: [
                  { name: "You", role: "CPS Investigator", avatar: "📋", position: "center", emotion: "focused", action: "Walking up a cracked concrete path to the front door" },
                ],
                narration: "The house is a modest ranch-style home. Toys are scattered in the yard — a good sign of children present, but also a signal of normalcy. You review your notes: neglect allegations, two children ages 4 and 6, anonymous referral.",
                ambientDetail: "A dog barks from a neighbor's yard. TV sounds drift through the screen door.",
                soundCue: "Doorbell, then approaching footsteps",
              },
              {
                id: "m2-v1-s2",
                duration: 6,
                setting: "Front doorway — the mother blocks the entrance",
                mood: "tense",
                characters: [
                  { name: "Sandra", role: "Mother", avatar: "👩", position: "right", emotion: "angry", dialogue: "I know why you're here. Someone is lying about me. My kids are fine. You have no right to be here.", action: "Arms crossed, jaw clenched, standing in the doorway" },
                  { name: "You", role: "CPS Investigator", avatar: "📋", position: "left", emotion: "calm", action: "Standing on the porch, maintaining a non-threatening posture" },
                ],
                narration: "Sandra's face hardens the moment she sees your ID. Her voice rises, and you can see the fear beneath the anger. Behind her, a small face appears briefly at the hallway corner, then disappears.",
                ambientDetail: "A child peeks from behind the hallway wall, then retreats. Sandra's hands are shaking.",
                soundCue: "Raised voice, TV volume in the background",
              },
              {
                id: "m2-v1-s3",
                duration: 5,
                setting: "Front porch — tension at the threshold",
                mood: "tense",
                characters: [
                  { name: "Sandra", role: "Mother", avatar: "👩", position: "right", emotion: "defensive", dialogue: "I'm calling my lawyer. You people always assume the worst.", action: "Reaching for her phone" },
                  { name: "You", role: "CPS Investigator", avatar: "📋", position: "left", emotion: "calm", action: "Taking a small step back, palms visible" },
                ],
                narration: "You notice the signs: Sandra's defensiveness could be protective parenting instinct, or it could be concealment. Either way, escalating will not get you inside this house, will not let you see those children, and will not resolve the safety question. How you de-escalate this moment matters more than being right.",
                ambientDetail: "The child's shadow lingers in the hallway.",
              },
            ],
            choices: [
              {
                text: "State firmly that you have legal authority to investigate and she must cooperate",
                outcome:
                  "The mother becomes more defensive, threatens to call a lawyer, and refuses entry. The investigation stalls and the children remain in a potentially unsafe environment.",
                isOptimal: false,
                tracePhase: "Trigger → Authoritative Response without Regulation",
                citation: "Miller, W. R., & Rollnick, S. (2013). Motivational interviewing: Helping people change (3rd ed.). Guilford Press.",
              },
              {
                text: "Acknowledge her frustration, explain you're there because the system is required to follow up on all concerns, and ask if there's a comfortable place to talk",
                outcome:
                  "While still guarded, the mother's hostility decreases. She allows you inside and begins to engage, recognizing you're approaching with respect rather than accusation.",
                isOptimal: true,
                tracePhase: "Trigger → Regulated Response → Empathetic Choice",
                citation: "Turnell, A., & Edwards, S. (1999). Signs of safety: A safety and solution oriented approach to child protection casework. W. W. Norton & Company.",
              },
              {
                text: "Apologize for the inconvenience and suggest coming back at another time",
                outcome:
                  "Delaying the investigation may put the children at continued risk and gives the caregiver time to prepare or coach the children.",
                isOptimal: false,
                tracePhase: "Trigger → Avoidant Response",
                citation: "Munro, E. (2008). Effective child protection (2nd ed.). Sage Publications.",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 3,
    title: "Disability Law and Rights in Child Welfare Proceedings",
    description:
      "Comprehensive training on IDEA, Section 504, ADA, and accommodations for children with disabilities in abuse/neglect investigations and dependency proceedings.",
    duration: "4.5 hours",
    image: MODULE_IMAGES[2],
    sections: [
      {
        id: "m3-root",
        phase: "Root",
        title: "Disability Law Foundations",
        description: "Key federal disability laws and their application to child welfare",
        content: [
          "IDEA (Individuals with Disabilities Education Act): Ensures free appropriate public education for children with disabilities.",
          "Section 504 of the Rehabilitation Act: Prohibits discrimination based on disability in federally funded programs.",
          "Americans with Disabilities Act (ADA): Broad civil rights protections for individuals with disabilities.",
          "Children with disabilities are disproportionately represented in child welfare systems and face higher rates of abuse and neglect.",
        ],
        keyTerms: [
          { term: "IDEA", definition: "Individuals with Disabilities Education Act — ensures FAPE for children with disabilities from birth through age 21" },
          { term: "Section 504", definition: "Section 504 of the Rehabilitation Act of 1973 — prohibits disability discrimination in federally funded programs" },
          { term: "FAPE", definition: "Free Appropriate Public Education — education that is provided at public expense and meets state standards" },
          { term: "IEP", definition: "Individualized Education Program — a legal document specifying special education services for a child" },
        ],
      },
      {
        id: "m3-regulate",
        phase: "Regulate",
        title: "Bias Awareness in Disability Cases",
        description: "Recognizing and managing bias when investigating cases involving children with disabilities",
        content: [
          "Implicit bias: Investigators may attribute abuse injuries to the child's disability or medical condition.",
          "Confirmation bias: Pre-existing beliefs about families of children with disabilities can skew investigations.",
          "Communication barriers can be misinterpreted as non-cooperation or evidence of cognitive limitations.",
          "Self-regulation requires ongoing awareness of assumptions about disability, parenting, and capacity.",
        ],
      },
      {
        id: "m3-reflect",
        phase: "Reflect",
        title: "Disability Case Analysis",
        description: "Examining real-world cases involving children with disabilities",
        content: [
          "Case studies: Misidentified abuse in children with Osteogenesis Imperfecta and other medical conditions.",
          "Analysis: How disability stereotypes affected investigation outcomes.",
          "Review of accommodation failures during forensic interviews with children who have ASD.",
          "Examination of dependency proceedings where disability rights were not properly protected.",
        ],
      },
      {
        id: "m3-restore",
        phase: "Restore",
        title: "Accommodation Protocols",
        description: "Implementing proper accommodations in investigations",
        content: [
          "Modifying forensic interview protocols for children with communication disorders.",
          "Using augmentative and alternative communication (AAC) devices during interviews.",
          "Adapting investigation environments for sensory sensitivities (ASD, SPD).",
          "Procedural safeguards during dependency proceedings: Right to FAPE, transition planning, educational stability.",
        ],
        keyTerms: [
          { term: "AAC", definition: "Augmentative and Alternative Communication — methods used to supplement or replace speech for individuals with communication impairments" },
          { term: "ASD", definition: "Autism Spectrum Disorder — a neurodevelopmental condition affecting social communication and behavior" },
          { term: "SPD", definition: "Sensory Processing Disorder — difficulty organizing and responding to sensory information" },
        ],
      },
      {
        id: "m3-reconnect",
        phase: "Reconnect",
        title: "Disability-Informed MDT Practice",
        description: "Building disability-competent multidisciplinary responses",
        content: [
          "Including disability specialists in MDT case reviews.",
          "Coordinating with IEP/504 teams during active investigations.",
          "Connecting families with disability-specific advocacy and support services.",
          "Ensuring educational continuity when children with disabilities enter foster care.",
        ],
      },
    ],
    preAssessment: {
      id: "m3-pre",
      title: "Module 3 Pre-Assessment",
      questions: [
        {
          id: "m3-pre-1",
          text: "Which federal law ensures free appropriate public education for children with disabilities?",
          options: ["ADA", "CAPTA", "IDEA", "FERPA"],
          correctIndex: 2,
          explanation:
            "IDEA (Individuals with Disabilities Education Act) ensures FAPE for children with disabilities from birth through age 21. Originally enacted as the Education for All Handicapped Children Act of 1975, IDEA was most recently reauthorized in 2004.",
          citations: [
            "Individuals with Disabilities Education Improvement Act of 2004, 20 U.S.C. §§ 1400–1482 (2004).",
            "Yell, M. L., Katsiyannis, A., & Hazelkorn, M. (2007). Reflections on the 25th anniversary of the U.S. Supreme Court's decision in Board of Education v. Rowley. Focus on Exceptional Children, 39(9), 1–12.",
          ],
        },
        {
          id: "m3-pre-2",
          text: "Why are children with disabilities at higher risk for abuse and neglect?",
          options: [
            "They are not at higher risk",
            "Communication barriers, dependency on caregivers, social isolation, and systemic failures in protection",
            "Because their parents are more likely to be abusive",
            "Because disability causes behavioral problems",
          ],
          correctIndex: 1,
          explanation:
            "Multiple factors increase vulnerability: communication barriers that prevent disclosure, increased dependency on caregivers, social isolation, and systemic failures in protective services. Research indicates children with disabilities are 3.4 times more likely to experience abuse.",
          citations: [
            "Sullivan, P. M., & Knutson, J. F. (2000). Maltreatment and disabilities: A population-based epidemiological study. Child Abuse & Neglect, 24(10), 1257–1273. https://doi.org/10.1016/S0145-2134(00)00190-3",
            "Stalker, K., & McArthur, K. (2012). Child abuse, child protection and disabled children: A review of recent research. Child Abuse Review, 21(1), 24–40. https://doi.org/10.1002/car.1154",
            "World Health Organization. (2011). World report on disability. WHO Press.",
          ],
        },
        {
          id: "m3-pre-3",
          text: "What accommodation might be needed when forensically interviewing a child with ASD?",
          options: [
            "No accommodations are needed",
            "Simply speaking louder",
            "Modified environment (reduced sensory stimuli), visual supports, flexible timing, and adapted questioning techniques",
            "Having a parent present to translate",
          ],
          correctIndex: 2,
          explanation:
            "Children with ASD may need sensory accommodations, visual supports, additional time, breaks, and questioning techniques adapted to their communication style. Research by Maras and Bowler demonstrates specific memory and communication profiles in individuals with ASD that affect interview performance.",
          citations: [
            "Maras, K. L., & Bowler, D. M. (2014). Eyewitness testimony in autism spectrum disorder: A review. Journal of Autism and Developmental Disorders, 44(11), 2682–2697. https://doi.org/10.1007/s10803-012-1502-3",
            "Agnew, S. E., Powell, M. B., & Snow, P. C. (2006). An examination of the questioning styles of police officers and caregivers when interviewing children with intellectual disabilities. Legal and Criminological Psychology, 11(1), 35–53.",
          ],
        },
      ],
    },
    postAssessment: {
      id: "m3-post",
      title: "Module 3 Competency Evaluation",
      questions: [
        {
          id: "m3-post-1",
          text: "A child in foster care has an IEP. The foster family lives in a different school district. What is the child's educational right?",
          options: [
            "The child must enroll in the new district's school immediately",
            "The child has the right to remain in their school of origin or immediately enroll in the new district with comparable services",
            "The IEP is voided when the child enters foster care",
            "Educational services are suspended during foster placement",
          ],
          correctIndex: 1,
          explanation:
            "Under IDEA and the Every Student Succeeds Act (ESSA), children in foster care have the right to educational stability, including remaining in their school of origin or immediate enrollment with comparable services. The Fostering Connections to Success Act further strengthened these protections.",
          citations: [
            "Every Student Succeeds Act of 2015, 20 U.S.C. § 6301 (2015).",
            "Fostering Connections to Success and Increasing Adoptions Act of 2008, Pub. L. No. 110-351, 122 Stat. 3949 (2008).",
            "Zetlin, A. (2006). The experiences of foster children and youth in special education. Journal of Intellectual & Developmental Disability, 31(3), 161–165.",
          ],
        },
        {
          id: "m3-post-2",
          text: "During a dependency hearing, a child with EBD (Emotional Behavioral Disorder) has an outburst. How should this be handled?",
          options: [
            "Remove the child from the courtroom permanently",
            "Hold the child in contempt",
            "Recognize the behavior as potentially disability-related, provide appropriate accommodations, and ensure the child's procedural rights are protected",
            "Medicate the child before the next hearing",
          ],
          correctIndex: 2,
          explanation:
            "Courts must recognize disability-related behaviors and provide accommodations under the ADA. Punitive responses to disability-related behaviors violate ADA protections and may further traumatize the child.",
          citations: [
            "Americans with Disabilities Act of 1990, 42 U.S.C. §§ 12101–12213 (1990).",
            "National Council of Juvenile and Family Court Judges. (2016). Enhanced resource guidelines: Improving court practice in child abuse and neglect cases. NCJFCJ.",
            "Kempner, S. G. (2014). Children's representation in dependency proceedings: The role of disability. Family Court Review, 52(3), 468–481.",
          ],
        },
        {
          id: "m3-post-3",
          text: "An investigator suspects abuse but the child's bruising may be related to their medical condition. What is the appropriate next step?",
          options: [
            "Close the case since the bruising could be medical",
            "Immediately remove the child from the home",
            "Consult with medical specialists who understand both the child's condition and abuse indicators before making a determination",
            "Ask the parents to explain and accept their answer",
          ],
          correctIndex: 2,
          explanation:
            "Medical consultation with specialists who understand both the child's specific condition and abuse indicators is essential to making an informed determination. The AAP recommends medical evaluation by child abuse pediatricians in cases involving children with medical conditions that may mimic abuse.",
          citations: [
            "Christian, C. W., & Committee on Child Abuse and Neglect. (2015). The evaluation of suspected child physical abuse. Pediatrics, 135(5), e1337–e1354. https://doi.org/10.1542/peds.2015-0356",
            "Jenny, C. (Ed.). (2011). Child abuse and neglect: Diagnosis, treatment, and evidence. Saunders/Elsevier.",
          ],
        },
      ],
    },
    scenarios: [
      {
        id: "m3-s1",
        title: "Interviewing a Child with ASD",
        description:
          "You need to conduct a forensic interview with a 10-year-old diagnosed with Autism Spectrum Disorder who has disclosed sexual abuse to a teacher.",
        steps: [
          {
            id: "m3-s1-step1",
            narrative:
              "You're preparing the interview room at the Children's Advocacy Center. The child's teacher reports that Marcus is verbal but has difficulty with open-ended questions, prefers routine, and is sensitive to fluorescent lighting.",
            vignette: [
              {
                id: "m3-v1-s1",
                duration: 5,
                setting: "Children's Advocacy Center — preparation room",
                mood: "calm",
                characters: [
                  { name: "You", role: "Forensic Interviewer", avatar: "🎤", position: "left", emotion: "focused", action: "Reviewing case file and accommodation checklist" },
                  { name: "Dr. Patel", role: "ASD Specialist", avatar: "👨‍⚕️", position: "right", emotion: "calm", dialogue: "Marcus is verbal and articulate about his special interests, but he struggles with open-ended prompts. He'll need more structured cues — not leading, but specific. And the lighting matters a lot." },
                ],
                narration: "You're at the CAC 30 minutes early, reviewing the accommodation plan. Dr. Patel from the school's autism support team called ahead with critical details. Every detail about Marcus's sensory profile and communication style will shape your approach.",
                ambientDetail: "The standard interview room is visible through the observation window — bright fluorescent lights, plain walls.",
              },
              {
                id: "m3-v1-s2",
                duration: 6,
                setting: "CAC lobby — Marcus arrives with his grandmother",
                mood: "emotional",
                characters: [
                  { name: "Marcus", role: "Child (age 10, ASD)", avatar: "👦", position: "right", emotion: "anxious", action: "Holding a small toy dinosaur, rocking slightly, eyes scanning the room" },
                  { name: "Grandmother", role: "Guardian", avatar: "👵", position: "center", emotion: "anxious", dialogue: "He didn't sleep last night. He keeps asking if he has to go to a 'talking room.' Changes in routine are very hard for him." },
                  { name: "You", role: "Forensic Interviewer", avatar: "🎤", position: "left", emotion: "caring", action: "Observing from a distance, noting Marcus's comfort items" },
                ],
                narration: "Marcus walks in clutching a small plastic dinosaur — a self-soothing object. He's already overstimulated: his eyes dart across the unfamiliar space, the waiting room TV is too loud, and he begins to rock. His grandmother looks exhausted and worried.",
                ambientDetail: "Marcus covers one ear. The fluorescent lights buzz faintly.",
                soundCue: "Buzzing fluorescent lights, distant TV, Marcus humming softly",
              },
              {
                id: "m3-v1-s3",
                duration: 5,
                setting: "CAC — standing outside the interview room",
                mood: "tense",
                characters: [
                  { name: "You", role: "Forensic Interviewer", avatar: "🎤", position: "center", emotion: "focused", action: "Looking at the standard interview room, then at Marcus" },
                ],
                narration: "You glance at the standard interview room: bright overhead fluorescents, a bare table, two chairs facing each other. Then you look at Marcus, rocking by the door, dinosaur pressed to his chest. This room — designed for neurotypical children — could shut Marcus down completely before you ask a single question. What you decide to do with this environment will determine whether Marcus can tell you what happened.",
                ambientDetail: "The observation team watches through the one-way mirror.",
              },
            ],
            choices: [
              {
                text: "Use the standard interview room and protocol — consistency is more important than individual accommodations",
                outcome:
                  "Marcus enters the brightly lit room and immediately covers his ears and begins rocking. He is unable to engage in the interview. Critical evidence may be lost.",
                isOptimal: false,
                tracePhase: "Response without Appraisal of disability needs",
                citation: "Maras, K. L., & Bowler, D. M. (2014). Eyewitness testimony in autism spectrum disorder. Journal of Autism and Developmental Disorders, 44(11), 2682–2697.",
              },
              {
                text: "Modify the environment: dim lighting, remove distracting items, prepare visual supports, and plan for a modified questioning approach with more specific (but non-leading) prompts",
                outcome:
                  "Marcus enters a calmer environment and begins to settle. The visual supports help him communicate, and the adapted questioning approach yields reliable information while respecting his needs.",
                isOptimal: true,
                tracePhase: "Careful Appraisal → Accommodated Choice → Positive Effect",
                citation: "Agnew, S. E., Powell, M. B., & Snow, P. C. (2006). An examination of the questioning styles of police officers and caregivers when interviewing children with intellectual disabilities. Legal and Criminological Psychology, 11(1), 35–53.",
              },
              {
                text: "Ask Marcus's parent to sit in the interview to help him communicate",
                outcome:
                  "Having a potentially involved adult present during a forensic interview compromises the process and may influence the child's statements.",
                isOptimal: false,
                tracePhase: "Response without full Appraisal of forensic integrity",
                citation: "Lamb, M. E., et al. (2008). Tell me what happened: Structured investigative interviews of child victims and witnesses. Wiley-Blackwell.",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 4,
    title: "Forensic Interviewing and Evidence Preservation",
    description:
      "In-depth training on forensic interview techniques, evidence collection, documentation, and preservation of testimony for legal proceedings.",
    duration: "5 hours",
    image: MODULE_IMAGES[3],
    sections: [
      { id: "m4-root", phase: "Root", title: "Legal Foundations of Forensic Evidence", description: "Rules of evidence and admissibility standards", content: ["Understanding hearsay exceptions for child statements.", "Crawford v. Washington and confrontation clause implications.", "Documentation standards that meet evidentiary requirements.", "Digital evidence collection and preservation in child exploitation cases."] },
      { id: "m4-regulate", phase: "Regulate", title: "Interviewer Neutrality", description: "Maintaining objectivity during forensic interviews", content: ["Techniques for maintaining neutral affect during disturbing disclosures.", "Avoiding verbal and non-verbal reinforcement of specific responses.", "Managing personal reactions to graphic disclosures.", "Post-interview self-care and debriefing protocols."] },
      { id: "m4-reflect", phase: "Reflect", title: "Interview Critique Workshop", description: "Analyzing forensic interview recordings", content: ["Identify interviewer behaviors that strengthened or weakened testimony.", "Evaluate use of props, drawings, and other interview aids.", "Assess developmental appropriateness of questions.", "Review court challenges to forensic interview procedures."] },
      { id: "m4-restore", phase: "Restore", title: "Evidence Preservation Protocols", description: "Chain of custody and documentation standards", content: ["Physical evidence collection in child abuse cases.", "Photographic documentation standards.", "Medical evidence coordination with SANE nurses.", "Digital forensics in exploitation cases."] },
      { id: "m4-reconnect", phase: "Reconnect", title: "Court Preparation and Testimony", description: "Preparing evidence and testimony for legal proceedings", content: ["Preparing forensic interview recordings for court.", "Expert witness testimony preparation.", "Working with prosecutors on case presentation.", "Supporting child witnesses through the court process."] },
    ],
    preAssessment: { id: "m4-pre", title: "Module 4 Pre-Assessment", questions: [
      { id: "m4-pre-1", text: "What is the primary purpose of a forensic interview?", options: ["Therapeutic intervention", "Gathering legally defensible information in a developmentally sensitive manner", "Determining guilt or innocence", "Teaching the child about the legal process"], correctIndex: 1, explanation: "Forensic interviews are designed to gather information that is both developmentally sensitive and legally defensible. The dual purpose of child protection and evidence gathering requires a careful balance.", citations: ["Faller, K. C. (2015). Forty years of forensic interviewing of children suspected of sexual abuse, 1974–2014: Historical benchmarks. Social Sciences, 4(1), 34–65. https://doi.org/10.3390/socsci4010034", "Saywitz, K. J., Lyon, T. D., & Goodman, G. S. (2018). When interviewing children: A review and update. In J. Conte & B. Klika (Eds.), The APSAC handbook on child maltreatment (4th ed.). Sage."] },
    ] },
    postAssessment: { id: "m4-post", title: "Module 4 Competency Evaluation", questions: [
      { id: "m4-post-1", text: "Under Crawford v. Washington, what type of child statements may be excluded from trial?", options: ["All child statements", "Testimonial statements where the child is unavailable for cross-examination", "Statements made to parents", "Excited utterances"], correctIndex: 1, explanation: "Crawford v. Washington (2004) held that testimonial statements of witnesses absent from trial are admissible only when the declarant is unavailable and the defendant had a prior opportunity for cross-examination, fundamentally changing the admissibility of forensic interview recordings.", citations: ["Crawford v. Washington, 541 U.S. 36 (2004).", "Myers, J. E. B. (2005). Myers on evidence in child, domestic, and elder abuse cases. Aspen Publishers."] },
    ] },
    scenarios: [
      {
        id: "m4-s1",
        title: "Preserving Testimony Under Pressure",
        description: "A child's disclosure is at risk of being compromised by a well-meaning but untrained teacher. You must navigate the forensic interview while managing contamination concerns.",
        steps: [
          {
            id: "m4-s1-step1",
            narrative: "You arrive at the CAC to conduct a forensic interview with 8-year-old Aiden. The MDT coordinator informs you that Aiden's teacher, upon hearing a partial disclosure, asked multiple leading questions and wrote down 'what happened' in her own words before calling the hotline.",
            vignette: [
              {
                id: "m4-v1-s1",
                duration: 5,
                setting: "Children's Advocacy Center — MDT briefing room",
                mood: "urgent",
                characters: [
                  { name: "You", role: "Forensic Interviewer", avatar: "🎤", position: "left", emotion: "focused", action: "Reading the intake report" },
                  { name: "Det. Morales", role: "Detective", avatar: "🔍", position: "right", emotion: "anxious", dialogue: "The teacher wrote a two-page summary of what Aiden 'told her.' She asked him to repeat things multiple times. Defense counsel will have a field day with this." },
                ],
                narration: "The intake report paints a complicated picture. The teacher cared — that's clear — but her untrained response may have contaminated the one piece of evidence that matters most: Aiden's own words, in his own sequence, unprompted.",
                ambientDetail: "The teacher's handwritten notes are photocopied on the table. Multiple leading phrases are highlighted.",
              },
              {
                id: "m4-v1-s2",
                duration: 6,
                setting: "CAC observation room — watching Aiden through the mirror",
                mood: "emotional",
                characters: [
                  { name: "Aiden", role: "Child (age 8)", avatar: "👦", position: "center", emotion: "anxious", action: "Sitting in the interview room, swinging his legs nervously, picking at his shoelaces" },
                  { name: "You", role: "Forensic Interviewer", avatar: "🎤", position: "left", emotion: "calm", action: "Observing through one-way mirror, preparing mentally" },
                ],
                narration: "Through the mirror, Aiden looks small in the interview chair. He's already told this story to his teacher — possibly multiple times, with her words mixed in. Your job now is to separate Aiden's authentic memory from the teacher's well-intentioned contamination. The forensic integrity of this entire case rests on how you structure the next 45 minutes.",
                ambientDetail: "The recording equipment hums. A red light indicates the cameras are live.",
                soundCue: "Quiet hum of equipment, Aiden's feet tapping against the chair",
              },
            ],
            choices: [
              {
                text: "Begin with standard NICHD protocol and rely on Aiden's free recall to override any contamination from the teacher's questioning",
                outcome: "Your structured, open-ended approach allows Aiden to provide his own narrative. By focusing on free recall and avoiding the teacher's specific language, you obtain a forensically clean account that can be differentiated from the contaminated statements.",
                isOptimal: true,
                tracePhase: "Careful Appraisal → Evidence-Informed Choice",
                citation: "Lamb, M. E., Orbach, Y., Hershkowitz, I., Esplin, P. W., & Horowitz, D. (2007). A structured forensic interview protocol improves the quality and informativeness of investigative interviews with children. Child Abuse & Neglect, 31(11–12), 1201–1231.",
              },
              {
                text: "Ask Aiden specifically about what his teacher wrote down to verify whether her notes are accurate",
                outcome: "By referencing the teacher's notes, you've further reinforced potentially contaminated information. The defense can now argue that both the teacher and the forensic interviewer led the child to the same narrative.",
                isOptimal: false,
                tracePhase: "Trigger → Response without Appraisal of contamination risk",
                citation: "Ceci, S. J., & Bruck, M. (1995). Jeopardy in the courtroom: A scientific analysis of children's testimony. American Psychological Association.",
              },
              {
                text: "Refuse to conduct the interview until the teacher's contamination is fully investigated",
                outcome: "While contamination is a concern, delaying the interview further may allow additional memory decay. The NICHD protocol is designed to elicit authentic recall even after prior conversations.",
                isOptimal: false,
                tracePhase: "Trigger → Avoidant Response without full Appraisal",
                citation: "Poole, D. A., & Lamb, M. E. (1998). Investigative interviews of children: A guide for helping professionals. American Psychological Association.",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 5,
    title: "Multidisciplinary Investigation Coordination",
    description:
      "Training on effective collaboration between law enforcement, child welfare, prosecution, medical, and advocacy professionals in child abuse investigations.",
    duration: "3.5 hours",
    image: MODULE_IMAGES[4],
    sections: [
      { id: "m5-root", phase: "Root", title: "MDT Framework and Models", description: "Understanding multidisciplinary team structures", content: ["Children's Advocacy Center model and its evidence base.", "Joint investigation protocols between law enforcement and CPS.", "Prosecution-led vs. investigation-led MDT models.", "Federal and state mandates for multidisciplinary coordination."] },
      { id: "m5-regulate", phase: "Regulate", title: "Managing Interagency Dynamics", description: "Navigating professional tensions in collaborative investigations", content: ["Role clarity and boundary management in MDT settings.", "Addressing conflicting agency priorities and mandates.", "Managing disagreements about case direction professionally.", "Supporting team members experiencing secondary traumatic stress."] },
      { id: "m5-reflect", phase: "Reflect", title: "MDT Case Review", description: "Analyzing multidisciplinary case outcomes", content: ["Review cases where MDT coordination succeeded or failed.", "Identify communication breakdowns and their consequences.", "Examine information-sharing protocols and confidentiality balance.", "Assess cultural competency in team approaches."] },
      { id: "m5-restore", phase: "Restore", title: "Effective MDT Protocols", description: "Building strong multidisciplinary processes", content: ["Case tracking and information management systems.", "Structured case conferencing models.", "Outcome measurement for MDT effectiveness.", "Quality assurance and continuous improvement processes."] },
      { id: "m5-reconnect", phase: "Reconnect", title: "Victim-Centered MDT Practice", description: "Keeping the child at the center of all coordination", content: ["Reducing the number of interviews through coordinated planning.", "Ensuring continuity of advocacy throughout the process.", "Coordinating services for child and non-offending family members.", "Long-term outcome tracking and follow-up protocols."] },
    ],
    preAssessment: { id: "m5-pre", title: "Module 5 Pre-Assessment", questions: [
      { id: "m5-pre-1", text: "What is a Children's Advocacy Center?", options: ["A legal aid office for children", "A child-focused facility where MDT members coordinate investigations, forensic interviews, and victim services", "A foster care placement agency", "A juvenile court"], correctIndex: 1, explanation: "CACs provide a child-focused setting where MDT members work together to investigate, intervene in, and support child abuse victims. The model has demonstrated improved investigation outcomes and reduced trauma to children.", citations: ["Cross, T. P., Jones, L. M., Walsh, W. A., Simone, M., & Kolko, D. (2007). Child forensic interviewing in Children's Advocacy Centers: Empirical data on a practice model. Child Abuse & Neglect, 31(10), 1031–1052. https://doi.org/10.1016/j.chiabu.2007.04.007", "Herbert, J. L., & Bromfield, L. (2016). Evidence for the efficacy of the Child Advocacy Center model: A systematic review. Trauma, Violence, & Abuse, 17(3), 341–357. https://doi.org/10.1177/1524838015585319"] },
    ] },
    postAssessment: { id: "m5-post", title: "Module 5 Competency Evaluation", questions: [
      { id: "m5-post-1", text: "What is the primary benefit of a coordinated MDT investigation?", options: ["Faster case closure", "Reduced number of child interviews and more comprehensive investigation with less re-traumatization", "Lower investigation costs", "Simplified reporting requirements"], correctIndex: 1, explanation: "Coordinated MDT investigations reduce the number of times a child must be interviewed, provide more comprehensive investigation outcomes, and result in less re-traumatization. Meta-analyses confirm that MDT approaches improve both prosecution rates and child well-being.", citations: ["Walsh, W. A., Cross, T. P., Jones, L. M., Simone, M., & Kolko, D. J. (2007). Which sexual abuse victims receive a forensic medical examination? The impact of Children's Advocacy Centers. Child Abuse & Neglect, 31(10), 1053–1068.", "Smith, D. W., Witte, T. H., & Fricker-Elhai, A. E. (2006). Service outcomes in physical and sexual abuse cases: A comparison of child advocacy center-based and standard services. Child Maltreatment, 11(4), 354–360."] },
    ] },
    scenarios: [
      {
        id: "m5-s1",
        title: "MDT Case Conference: Conflicting Priorities",
        description: "A complex case requires coordination between agencies with different mandates. You must navigate competing priorities while keeping the child's safety central.",
        steps: [
          {
            id: "m5-s1-step1",
            narrative: "During an MDT case conference about 5-year-old Lily, the detective wants to delay CPS contact with the family to preserve the criminal investigation, while the CPS supervisor insists on an immediate safety assessment. The prosecutor is concerned about evidence preservation. The victim advocate is worried about Lily's current safety in the home.",
            vignette: [
              {
                id: "m5-v1-s1",
                duration: 5,
                setting: "CAC conference room — large table, case files spread out",
                mood: "tense",
                characters: [
                  { name: "Det. Williams", role: "Lead Detective", avatar: "🔍", position: "left", emotion: "focused", dialogue: "If CPS goes to the house now, the suspect will destroy evidence. We need 48 hours to get the warrant." },
                  { name: "Ms. Rivera", role: "CPS Supervisor", avatar: "📋", position: "right", emotion: "anxious", dialogue: "We have a 24-hour mandate. There's a 5-year-old in that house right now. I can't wait 48 hours." },
                ],
                narration: "The conference room is thick with tension. Both professionals are right within their own mandates — and both are wrong if the other's concern isn't addressed. The detective needs evidence preservation. CPS needs child safety. These goals aren't inherently incompatible, but right now they feel that way.",
                ambientDetail: "Lily's photo — a school portrait with a gap-toothed smile — sits at the center of the table.",
              },
              {
                id: "m5-v1-s2",
                duration: 6,
                setting: "CAC conference room — the tension escalates",
                mood: "urgent",
                characters: [
                  { name: "ADA Chen", role: "Prosecutor", avatar: "⚖️", position: "left", emotion: "focused", dialogue: "If the forensic interview is contaminated by a CPS contact, I may not be able to prosecute. But if the child is harmed while we wait, none of this matters." },
                  { name: "Sarah", role: "Victim Advocate", avatar: "💜", position: "right", emotion: "anxious", dialogue: "Has anyone asked what Lily needs right now? She told her teacher she's scared to go home tonight." },
                  { name: "You", role: "MDT Coordinator", avatar: "🤝", position: "center", emotion: "calm", action: "Listening to each perspective, looking at Lily's photo" },
                ],
                narration: "The advocate's words cut through the procedural debate. Lily is scared to go home tonight. That's not a 48-hour problem — it's a tonight problem. You realize that your role as coordinator isn't to pick a side. It's to find the path where child safety and investigative integrity coexist.",
                ambientDetail: "The clock reads 3:45 PM. School lets out at 3:30. Lily may already be going home.",
                soundCue: "Heated cross-talk, papers shuffling",
              },
            ],
            choices: [
              {
                text: "Propose a coordinated plan: CPS conducts a joint safety assessment with law enforcement present, preserving both the safety mandate and evidence integrity",
                outcome: "The joint approach satisfies both mandates. Law enforcement observes and documents while CPS assesses safety. The suspect is contacted in a controlled manner, and Lily is assessed that evening. Evidence is preserved and the child is protected.",
                isOptimal: true,
                tracePhase: "Regulated Response → Collaborative Appraisal → Optimal Choice",
                citation: "Cross, T. P., Jones, L. M., Walsh, W. A., Simone, M., & Kolko, D. (2007). Child forensic interviewing in Children's Advocacy Centers: Empirical data on a practice model. Child Abuse & Neglect, 31(10), 1031–1052.",
              },
              {
                text: "Side with the detective — the criminal case is the priority, and CPS can wait until the warrant is served",
                outcome: "Lily spends two more nights in a home where she's afraid. During that time, additional harm occurs. The criminal case proceeds but at the cost of the child's immediate safety — the very thing the investigation was meant to protect.",
                isOptimal: false,
                tracePhase: "Trigger → Single-mandate Response without full Appraisal",
                citation: "Munro, E. (2008). Effective child protection (2nd ed.). Sage Publications.",
              },
              {
                text: "Side with CPS — child safety is always the top priority, regardless of the criminal investigation",
                outcome: "CPS goes alone to the home. The suspect, alerted, destroys digital evidence on his phone before the warrant is served. Lily is safe, but the prosecution case is severely weakened. A coordinated approach could have achieved both goals.",
                isOptimal: false,
                tracePhase: "Trigger → Single-mandate Response → Uncoordinated Effect",
                citation: "Herbert, J. L., & Bromfield, L. (2016). Evidence for the efficacy of the Child Advocacy Center model. Trauma, Violence, & Abuse, 17(3), 341–357.",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 6,
    title: "Preventing Secondary Trauma During Investigations",
    description:
      "Essential training on recognizing, preventing, and addressing secondary traumatic stress, vicarious trauma, and burnout among child abuse investigation professionals.",
    duration: "3 hours",
    image: MODULE_IMAGES[5],
    sections: [
      { id: "m6-root", phase: "Root", title: "Understanding Secondary Trauma", description: "The science of professional trauma exposure", content: ["Differentiating secondary traumatic stress, vicarious trauma, compassion fatigue, and burnout.", "Neurobiology of secondary trauma: how the brain responds to others' trauma narratives.", "Risk factors for developing secondary traumatic stress.", "Organizational factors that contribute to or protect against professional trauma."] },
      { id: "m6-regulate", phase: "Regulate", title: "Personal Resilience Strategies", description: "Building individual capacity for trauma work", content: ["Evidence-based self-care practices for trauma-exposed professionals.", "Somatic regulation techniques for managing acute stress responses.", "Cognitive reframing strategies for maintaining professional perspective.", "Work-life boundary setting and transition rituals."] },
      { id: "m6-reflect", phase: "Reflect", title: "Self-Assessment and Awareness", description: "Recognizing signs of secondary trauma in yourself and colleagues", content: ["Professional quality of life assessment tools.", "Warning signs inventory: behavioral, emotional, cognitive, and physical indicators.", "Peer support and check-in protocols.", "Reflective practice journaling and structured supervision."] },
      { id: "m6-restore", phase: "Restore", title: "Organizational Support Systems", description: "Building trauma-informed workplaces", content: ["Organizational policies that support trauma-exposed workers.", "Critical incident stress management protocols.", "Employee assistance program optimization for first responders.", "Trauma-informed supervision models."] },
      { id: "m6-reconnect", phase: "Reconnect", title: "Sustainable Practice", description: "Long-term strategies for career sustainability", content: ["Building professional support networks.", "Mentorship and peer consultation models.", "Career development and role rotation strategies.", "Finding meaning and purpose in trauma-focused work."] },
    ],
    preAssessment: { id: "m6-pre", title: "Module 6 Pre-Assessment", questions: [
      { id: "m6-pre-1", text: "What is secondary traumatic stress?", options: ["Stress from administrative workload", "Emotional distress from hearing about others' traumatic experiences", "Physical exhaustion from long hours", "Stress from performance evaluations"], correctIndex: 1, explanation: "Secondary traumatic stress (STS) is the emotional distress that results from hearing about or being exposed to the firsthand trauma experiences of others. Figley described STS as the 'cost of caring' for professionals who work with traumatized populations.", citations: ["Figley, C. R. (1995). Compassion fatigue: Coping with secondary traumatic stress disorder in those who treat the traumatized. Brunner/Mazel.", "Bride, B. E. (2007). Prevalence of secondary traumatic stress among social workers. Social Work, 52(1), 63–70. https://doi.org/10.1093/sw/52.1.63"] },
    ] },
    postAssessment: { id: "m6-post", title: "Module 6 Competency Evaluation", questions: [
      { id: "m6-post-1", text: "An experienced investigator who was previously passionate about their work has become increasingly cynical, is calling in sick frequently, and has started making dismissive comments about cases. What is this most likely indicating?", options: ["Normal professional development", "Need for a vacation", "Secondary traumatic stress or burnout requiring intervention", "Insubordination requiring disciplinary action"], correctIndex: 2, explanation: "Cynicism, absenteeism, and dismissiveness are classic signs of secondary traumatic stress or burnout and require supportive intervention, not punitive response. Maslach's burnout model identifies emotional exhaustion, depersonalization, and reduced personal accomplishment as the three dimensions of professional burnout.", citations: ["Maslach, C., & Leiter, M. P. (2016). Understanding the burnout experience: Recent research and its implications for psychiatry. World Psychiatry, 15(2), 103–111. https://doi.org/10.1002/wps.20311", "Stamm, B. H. (2010). The concise ProQOL manual (2nd ed.). ProQOL.org.", "Sprang, G., Craig, C., & Clark, J. (2011). Secondary traumatic stress and burnout in child welfare workers: A comparative analysis of occupational distress across professional groups. Child Welfare, 90(6), 149–168."] },
    ] },
    scenarios: [
      {
        id: "m6-s1",
        title: "Recognizing Secondary Trauma in Yourself",
        description: "After months of handling severe cases, you notice changes in your own behavior and well-being. A critical self-awareness scenario using the TRACE framework on yourself.",
        steps: [
          {
            id: "m6-s1-step1",
            narrative: "It's Friday evening. You've handled three severe abuse cases this week. You're sitting in your car in the parking lot, unable to motivate yourself to go home. You realize you've been snapping at your partner, having nightmares about case details, and drinking more than usual to fall asleep. A colleague texts asking if you want to grab dinner — you haven't socialized outside work in weeks.",
            vignette: [
              {
                id: "m6-v1-s1",
                duration: 6,
                setting: "Office parking lot — dusk, most cars are gone",
                mood: "emotional",
                characters: [
                  { name: "You", role: "Investigator", avatar: "🔍", position: "center", emotion: "withdrawn", action: "Sitting in the driver's seat, engine off, staring at the steering wheel" },
                ],
                narration: "The parking lot is almost empty. Your shift ended two hours ago, but you haven't moved. The case files are in your bag. You know you shouldn't take them home — again — but the images from today's medical exam are already in your head. They'll be there tonight when you try to sleep, just like last night, and the night before.",
                ambientDetail: "The dashboard clock reads 7:14 PM. Three missed calls from your partner. An empty coffee cup in the holder — your fourth today.",
                soundCue: "Distant traffic, phone buzzing with a text notification",
              },
              {
                id: "m6-v1-s2",
                duration: 6,
                setting: "Inside the car — phone screen illuminated",
                mood: "emotional",
                characters: [
                  { name: "You", role: "Investigator", avatar: "🔍", position: "left", emotion: "withdrawn", action: "Reading your colleague's text, thumb hovering over the keyboard" },
                  { name: "Jamie", role: "Colleague", avatar: "👤", position: "right", emotion: "caring", dialogue: "[TEXT] Hey, haven't seen you at lunch in a while. Dinner tonight? Thai place? 🍜" },
                ],
                narration: "Jamie's text feels like it's from another world — a normal world where people eat dinner and laugh and don't carry photographs of children's injuries in their minds. You want to type 'sure' but instead you type 'can't tonight, swamped.' It's the third time this month you've declined.",
                ambientDetail: "Your reflection in the dark car window looks tired. You notice you've lost weight.",
              },
              {
                id: "m6-v1-s3",
                duration: 5,
                setting: "Car — internal reflection",
                mood: "tense",
                characters: [
                  { name: "You", role: "Investigator", avatar: "🔍", position: "center", emotion: "anxious", action: "Gripping the steering wheel, a moment of self-awareness breaking through" },
                ],
                narration: "Something shifts. You recognize this moment — you've trained on this. The isolation, the nightmares, the irritability, the substance use. You're describing the textbook symptoms of secondary traumatic stress. The TRACE cycle turns inward: the cases are the Trigger, your withdrawal is the Response. Now comes the Appraisal. What do you do with this recognition?",
                ambientDetail: "The RootWork training manual is visible in your bag. The chapter on secondary trauma.",
              },
            ],
            choices: [
              {
                text: "Call your supervisor Monday morning, honestly describe what you're experiencing, and ask about accessing the Employee Assistance Program and potentially adjusting your caseload",
                outcome: "Your supervisor responds with understanding and immediately connects you with the EAP. You begin counseling and your caseload is temporarily reduced. Over the following weeks, the nightmares decrease and you begin re-engaging with your personal life. Your honest self-assessment may have saved your career — and your health.",
                isOptimal: true,
                tracePhase: "Trigger → Self-aware Response → Honest Appraisal → Help-seeking Choice → Recovery Effect",
                citation: "Stamm, B. H. (2010). The concise ProQOL manual (2nd ed.). ProQOL.org.",
              },
              {
                text: "Push through it — this is part of the job, and asking for help would be seen as weakness",
                outcome: "Over the next month, your symptoms worsen. You make an error on a critical case report because you can't concentrate. Your relationship at home deteriorates further. Eventually, you're placed on administrative leave after a supervisor notices signs of impairment. The cost of not seeking help early is far greater than asking for it.",
                isOptimal: false,
                tracePhase: "Trigger → Unregulated Response → Denial as Appraisal → Harmful Choice",
                citation: "Figley, C. R. (1995). Compassion fatigue: Coping with secondary traumatic stress disorder in those who treat the traumatized. Brunner/Mazel.",
              },
              {
                text: "Take a personal day on Monday and try to rest, then see how you feel",
                outcome: "A day off provides temporary relief, but without addressing the underlying secondary traumatic stress, symptoms return by Wednesday. Individual rest without systemic support and professional intervention is insufficient for established STS patterns.",
                isOptimal: false,
                tracePhase: "Trigger → Partial Appraisal → Insufficient Choice",
                citation: "Salloum, A., Kondrat, D. C., Johnco, C., & Olson, K. R. (2015). The role of self-care on compassion satisfaction, burnout and secondary trauma among child welfare workers. Children and Youth Services Review, 49, 54–61.",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 7,
    title: "Mandated Reporter Essentials: Recognizing, Reporting & Responding",
    description:
      "Bonus module designed for teachers, community center employees, coaches, clergy, childcare workers, and other mandated reporters. Covers legal obligations, recognition of abuse indicators, reporting procedures, and trauma-informed response — distinct from investigative roles.",
    duration: "4 hours",
    image: MODULE_IMAGES[6],
    sections: [
      {
        id: "m7-root", phase: "Root", title: "Who Is a Mandated Reporter? Georgia Law & Federal Baseline",
        description: "Legal definitions under O.C.G.A. § 19-7-5, CAPTA, and cross-state comparison",
        content: [
          "Under Georgia law (O.C.G.A. § 19-7-5), specific categories of professionals are mandated reporters of suspected child abuse. Georgia is NOT a universal reporting state — only designated professionals are legally required to report.",
          "Georgia mandated reporters include: physicians, nurses, dentists, podiatrists, medical examiners, coroners, hospital and medical personnel, psychologists, marriage and family therapists, professional counselors, social workers, teachers, school administrators, school counselors, child welfare agency personnel, child-caring institution employees, law enforcement officers, and reproductive health care facility employees.",
          "Clergy in Georgia have limited reporting obligations — the clergy-penitent privilege may apply in some circumstances, but does NOT apply when the clergy member has independent knowledge of abuse outside the confessional context.",
          "Federal baseline: CAPTA (42 U.S.C. § 5106a) and the Victims of Child Abuse Act Reauthorization establish minimum standards that states must meet. Georgia exceeds these minimums in several categories, including the breadth of designated reporters and the definition of reportable abuse.",
          "Georgia defines 'child abuse' broadly under O.C.G.A. § 19-15-1(3) to include: physical injury or death, neglect or exploitation, sexual abuse or sexual exploitation, and emotional abuse. 'Neglect' includes both acts and omissions — failure to provide adequate food, clothing, shelter, medical care, or supervision.",
          "Cross-state comparison: Some states (Texas, Indiana, New Jersey, Delaware, Florida, Kentucky, Maryland, and others) are 'universal reporter' states where ALL adults — not just designated professionals — are mandated reporters. Georgia's category-specific model is more common but narrower.",
          "The legal standard across nearly all jurisdictions, including Georgia, is 'reasonable cause to believe' — not proof, not certainty, not 'beyond a reasonable doubt.' This threshold is deliberately low because the purpose of a report is to initiate an investigation, not to conclude one.",
          "Key distinction that applies universally: mandated reporters are required to REPORT suspected abuse. They are NOT investigators. The duty is to report, not to substantiate, prove, or determine whether abuse occurred.",
        ],
        keyTerms: [
          { term: "O.C.G.A. § 19-7-5", definition: "Georgia's mandated reporting statute — Official Code of Georgia Annotated, Title 19 (Domestic Relations), Chapter 7 (Parent and Child), Section 5 (Reporting of child abuse)" },
          { term: "CAPTA", definition: "Child Abuse Prevention and Treatment Act (42 U.S.C. § 5106a) — federal legislation establishing baseline reporting requirements and funding for state child protective services" },
          { term: "Reasonable Cause to Believe", definition: "The legal standard for mandated reporting — information sufficient to lead a reasonable person to suspect that a child has been abused or neglected. Lower than 'preponderance of evidence' or 'beyond reasonable doubt'" },
          { term: "Universal Reporter State", definition: "A state where ALL adults (not just designated professionals) are mandated reporters. Georgia is NOT a universal reporter state." },
        ],
      },
      {
        id: "m7-regulate", phase: "Regulate", title: "Managing the Emotional Weight of Disclosure",
        description: "Regulating yourself when a child discloses — the reporter's TRACE cycle",
        content: [
          "When a child discloses abuse, the Trigger in your TRACE cycle is immediate: shock, anger, sadness, disbelief. Your visible emotional Response directly affects whether the child continues speaking or shuts down. The child is reading your face, your body, your tone — and deciding whether you are safe.",
          "Somatic regulation techniques for the moment of disclosure: controlled breathing (4-7-8 pattern), grounding posture (feet flat on floor, hands relaxed), maintaining a calm and open facial expression while internally processing distressing information.",
          "What NOT to say: 'That's terrible!' (adds your distress to theirs), 'Are you sure?' (implies doubt), 'Why didn't you tell someone sooner?' (implies blame). What TO say: 'Thank you for telling me,' 'That took courage,' 'I'm glad you feel safe enough to share this with me,' 'I'm going to make sure the right people know so we can help.'",
          "Vicarious traumatization risk: mandated reporters — teachers, coaches, childcare workers — are not trained investigators, yet they encounter disclosures in settings (classrooms, playgrounds, after-school programs) where they have no clinical supervision or debriefing structure. This makes them uniquely vulnerable.",
          "The reporter's own history matters: if you have personal trauma history, a child's disclosure may activate your own memories. Recognizing this activation is the Appraisal step in your TRACE cycle — acknowledging it without letting it drive your professional response.",
          "Post-report emotional management: making a report to DFCS can be emotionally taxing. You may feel guilt ('Did I do the right thing?'), fear ('What if the family finds out it was me?'), or helplessness ('Will anything actually happen?'). These are normal responses. Georgia law (O.C.G.A. § 19-7-5(g)) protects your identity and provides good-faith immunity.",
          "Self-care protocols: debrief with a trusted colleague (without sharing identifying details of the child), use your EAP if available, recognize that making a report IS the compassionate act — silence is not protection, it is complicity.",
        ],
      },
      {
        id: "m7-reflect", phase: "Reflect", title: "Recognizing Indicators of Abuse & Neglect",
        description: "Physical, behavioral, and environmental red flags — Georgia definitions and standards",
        content: [
          "Physical indicators of abuse: unexplained injuries (especially patterned bruising — loop marks, hand prints, belt marks), burns in unusual locations (immersion burns with clear demarcation lines, cigarette burns), fractures inconsistent with developmental stage (spiral fractures in non-ambulatory infants), failure to thrive without medical explanation.",
          "Behavioral indicators: age-inappropriate sexual knowledge or behavior, sudden behavioral regression (bedwetting in previously toilet-trained children), extreme fearfulness of a specific person or place, withdrawal from peers, dramatic changes in school performance, reluctance or refusal to go home, self-harm behaviors, running away.",
          "Indicators of neglect (Georgia O.C.G.A. § 19-15-1(3) includes neglect): consistently dirty or weather-inappropriate clothing, chronic hunger, untreated medical or dental conditions, lack of supervision inappropriate to age, frequent absences from school, exhaustion and falling asleep in class.",
          "Environmental indicators: observable during home visits, field trips, or parent interactions — unsafe living conditions, evidence of substance abuse in the home, domestic violence (child witnessing intimate partner violence is a recognized form of child maltreatment in many jurisdictions), caregiver instability.",
          "Indicators of sexual abuse: disclosures (direct or indirect), sexually explicit drawings or play, genital pain or irritation, STIs in prepubescent children, fear of specific adults, nightmares, clingy behavior, sexualized interactions with peers.",
          "Critical principle: No single indicator confirms abuse. However, patterns of indicators combined with contextual knowledge create the 'reasonable cause to believe' standard required under O.C.G.A. § 19-7-5. You are not diagnosing — you are recognizing patterns that warrant professional investigation.",
          "Cultural sensitivity: some indicators may have culturally specific explanations (e.g., cupping or coining practices may leave marks). However, the mandated reporter's obligation is to report when there is reasonable suspicion — the investigator determines whether the explanation is sufficient. When in doubt, report.",
          "Georgia-specific: Georgia's definition of abuse under O.C.G.A. § 19-15-1(3) explicitly includes emotional abuse and exploitation, not just physical and sexual abuse. Emotional abuse — chronic belittling, terrorizing, isolating — is reportable even without physical marks.",
        ],
        keyTerms: [
          { term: "Patterned Bruising", definition: "Bruises that bear the shape of an object (belt, cord, hand) — highly suggestive of non-accidental injury" },
          { term: "Failure to Thrive (FTT)", definition: "A child's weight or growth rate significantly below the expected norms without medical explanation — may indicate neglect" },
          { term: "Disclosure (Direct vs. Indirect)", definition: "Direct: the child states what happened. Indirect: the child hints ('My uncle plays bad games'), uses third-person narratives, or uses drawings/play to communicate" },
        ],
      },
      {
        id: "m7-restore", phase: "Restore", title: "The Georgia Reporting Process: Step by Step",
        description: "How to report under O.C.G.A. § 19-7-5, what happens next, and your legal protections",
        content: [
          "Step 1 — Document your observations BEFORE calling: write down what you saw (specific injuries, statements the child made using their exact words, behavioral patterns, dates and times). Do not interpret — record facts. This documentation may be requested by DFCS or law enforcement.",
          "Step 2 — Call Georgia's centralized DFCS intake line: 1-855-GACHILD (1-855-422-4453). This line is available 24 hours a day, 7 days a week. You can also report to local law enforcement if you believe the child is in immediate danger.",
          "Step 3 — Provide the intake worker with: child's name, age, address (if known), parent/guardian information, description of observed indicators, child's statements (verbatim if possible), your relationship to the child, and your contact information. You ARE required to identify yourself as the reporter to DFCS — but your identity is protected from disclosure to the family.",
          "Step 4 — Follow up in writing if required by your organization. Many school districts and childcare organizations require a written report within 24 hours of the oral report. Check your employer's policy.",
          "What happens after your report: Georgia DFCS screens the report within 24 hours. Reports are classified as: (1) screened in for investigation (meets criteria for suspected abuse/neglect), (2) screened in for Family Support Services (risk factors present but no immediate abuse), or (3) screened out (does not meet criteria). Emergency situations receive a response within 24 hours; standard investigations begin within 5 business days.",
          "Legal protections under Georgia law: O.C.G.A. § 19-7-5(g) provides absolute immunity from civil and criminal liability for mandated reporters who make reports in good faith. 'Good faith' means you reported based on genuine concern — even if the investigation ultimately does not substantiate abuse, you are protected.",
          "Penalty for failure to report: under Georgia law, a mandated reporter who knowingly and willfully fails to report suspected child abuse is guilty of a misdemeanor. Additionally, professional licensing boards (for teachers, counselors, medical professionals) may impose sanctions including license suspension or revocation. Civil liability is also possible if a child is further harmed after a mandated reporter failed to report.",
          "Common fears that prevent reporting — and why Georgia law addresses them: (1) 'What if I'm wrong?' — Good-faith immunity protects you. (2) 'The family will know it was me.' — Georgia law protects reporter identity. (3) 'CPS won't do anything.' — Your legal obligation is to report, not to control the outcome. (4) 'I'll damage my relationship with the family.' — Your primary obligation is to the child's safety, not the adult's comfort.",
          "Reporter identity protection: Under O.C.G.A. § 49-5-41, the identity of the reporter is confidential and may only be disclosed by court order. The family does NOT have a right to know who made the report.",
        ],
        keyTerms: [
          { term: "1-855-GACHILD", definition: "Georgia's 24/7 centralized DFCS child abuse reporting hotline (1-855-422-4453)" },
          { term: "Good-Faith Immunity", definition: "Under O.C.G.A. § 19-7-5(g), mandated reporters who report suspected abuse in good faith are immune from civil and criminal liability, even if the investigation does not substantiate abuse" },
          { term: "Screened In", definition: "A DFCS determination that a report meets criteria for investigation or family support services" },
          { term: "O.C.G.A. § 49-5-41", definition: "Georgia statute protecting the confidentiality of the mandated reporter's identity" },
        ],
      },
      {
        id: "m7-reconnect", phase: "Reconnect", title: "Supporting the Child After a Report & Building Reporting Culture",
        description: "Maintaining trust, collaborating with investigators, and organizational readiness",
        content: [
          "After making a report, your role does not change. You are not an investigator — you are a teacher, coach, counselor, or childcare worker. Your job is to continue being a safe, stable, predictable presence in the child's life.",
          "Do NOT question the child about details after your report. If the child volunteers information, listen calmly, document their exact words, and share the documentation with DFCS. But do not ask leading questions, probe for details, or ask the child to repeat their disclosure — this can contaminate potential forensic interview evidence.",
          "Maintain normal routines. The child needs consistency. Avoid treating the child differently (with either excessive attention or avoidance). Other children will notice changes in your behavior toward a peer.",
          "If a DFCS investigator or law enforcement officer contacts you for follow-up information, cooperate fully. You may share: your direct observations, the child's statements (as documented), behavioral changes you've noticed, and relevant academic or attendance records. You should NOT share: speculation about who the abuser is, opinions about the family's character, or information from other staff who have not made their own reports.",
          "Confidentiality boundaries: you may need to inform your direct supervisor that a report was made (check your organization's policy), but you should NOT discuss the details of the case with other staff members, parents of other children, or community members. The child's privacy is paramount.",
          "Building a culture of reporting in your organization: train all staff on mandated reporting obligations annually. Normalize reporting as a professional responsibility, not a personal judgment. Create clear internal procedures for documentation and notification. Post the DFCS hotline number (1-855-GACHILD) in staff areas. Designate a reporting liaison who can support colleagues through the process.",
          "Addressing the aftermath: some mandated reporters experience guilt, anxiety, or social consequences after making a report — especially in small communities where families know each other. Peer support, debriefing with supervisors, and organizational backing are essential. Remember: the law exists because children cannot protect themselves. Your report may be the only intervention between a child and continued harm.",
          "Cross-state note: while this module uses Georgia law as its baseline, the core principles — report based on reasonable suspicion, do not investigate, maintain confidentiality, support the child — are consistent across all U.S. jurisdictions. Trainees outside Georgia should verify their state's specific hotline number, reporting timelines, and designated reporter categories.",
        ],
      },
    ],
    preAssessment: { id: "m7-pre", title: "Module 7 Pre-Assessment: Mandated Reporting Knowledge", questions: [
      { id: "m7-pre-1", text: "As a mandated reporter in Georgia, when are you legally required to make a report under O.C.G.A. § 19-7-5?", options: ["Only when you have proof that abuse occurred", "When you have reasonable cause to believe that a child has been abused or neglected", "Only when a child directly tells you they were abused", "Only when you witness the abuse firsthand"], correctIndex: 1, explanation: "Georgia law (O.C.G.A. § 19-7-5) requires mandated reporters to report when they have 'reasonable cause to believe' a child has been abused. This standard is deliberately low — lower than 'preponderance of evidence' or 'beyond reasonable doubt' — because the purpose of a report is to initiate an investigation, not to conclude one. You do not need proof, direct disclosure, or firsthand witness.", citations: ["O.C.G.A. § 19-7-5 (Georgia Mandated Reporting Statute)", "Child Abuse Prevention and Treatment Act (CAPTA), 42 U.S.C. §5106a", "U.S. Department of Health and Human Services, Children's Bureau. (2019). Mandatory reporters of child abuse and neglect. Child Welfare Information Gateway."] },
      { id: "m7-pre-2", text: "Is Georgia a 'universal reporter' state?", options: ["Yes — all adults in Georgia are mandated reporters", "No — only specific categories of professionals designated by O.C.G.A. § 19-7-5 are mandated reporters", "Yes — but only for sexual abuse", "No — Georgia has no mandated reporting law"], correctIndex: 1, explanation: "Georgia is NOT a universal reporter state. Under O.C.G.A. § 19-7-5, only specific categories of professionals — including teachers, medical personnel, social workers, law enforcement, childcare workers, and others — are designated as mandated reporters. This contrasts with states like Texas, Indiana, and New Jersey where all adults are mandated reporters regardless of profession.", citations: ["O.C.G.A. § 19-7-5", "Child Welfare Information Gateway. (2019). Mandatory reporters of child abuse and neglect. Washington, DC: U.S. Department of Health and Human Services."] },
      { id: "m7-pre-3", text: "Where do you call to report suspected child abuse in Georgia?", options: ["Your local police department only", "DFCS centralized intake at 1-855-GACHILD (1-855-422-4453)", "The school principal, who decides whether to report", "Your attorney, who will file the report for you"], correctIndex: 1, explanation: "Georgia's centralized DFCS intake line is 1-855-GACHILD (1-855-422-4453), available 24/7. You may also report to local law enforcement, especially if the child is in immediate danger. Reporting to your principal or supervisor does NOT satisfy your personal legal obligation as a mandated reporter — you must ensure a report is made directly to DFCS or law enforcement.", citations: ["O.C.G.A. § 19-7-5", "Georgia Division of Family and Children Services (DFCS) reporting procedures"] },
    ] },
    postAssessment: { id: "m7-post", title: "Module 7 Competency Evaluation", questions: [
      { id: "m7-post-1", text: "A 7-year-old student in your Georgia classroom has been coming to school in dirty clothes, falling asleep in class, and recently drew a picture showing an adult hitting a child. When you gently asked if everything was okay at home, she said 'I'm not supposed to talk about it.' What should you do?", options: ["Question the child further to get specific details about what's happening at home", "Wait to see if the behavior continues before taking action — it could be a phase", "Document your observations and call 1-855-GACHILD to make a report based on the pattern of indicators and the child's statement", "Tell the child's parents what she said and ask them to explain"], correctIndex: 2, explanation: "The combination of physical indicators (dirty clothes, fatigue), behavioral indicators (the drawing, the guarded statement), and the child's explicit 'I'm not supposed to talk about it' creates clear reasonable cause to believe under O.C.G.A. § 19-7-5. Document your observations with specific facts and dates, then call 1-855-GACHILD. Do NOT investigate further, question the child for details, or alert the parents — all of these could compromise a potential investigation and potentially endanger the child.", citations: ["O.C.G.A. § 19-7-5", "Crosson-Tower, C. (2013). A teacher's guide to recognizing and reporting child abuse. National Education Association.", "Kenny, M. C. (2001). Child abuse reporting: Teachers' perceived deterrents. Child Abuse & Neglect, 25(1), 81–92. https://doi.org/10.1016/S0145-2134(00)00218-0"] },
      { id: "m7-post-2", text: "You are a coach at a Georgia community center. A parent approaches you and says, 'I heard you reported my family to DFCS. Was that you?' Under Georgia law, what is your obligation regarding your identity as the reporter?", options: ["You must admit it — Georgia law requires honesty", "You should deny it even if you did make the report", "You are not required to confirm or deny. Georgia law (O.C.G.A. § 49-5-41) protects the confidentiality of the reporter's identity", "You should explain that you had no choice because you are a mandated reporter"], correctIndex: 2, explanation: "Under O.C.G.A. § 49-5-41, the identity of the reporter is confidential and may only be disclosed by court order. You are NOT required to confirm or deny that you made the report. You should calmly decline to discuss the matter and, if needed, refer the parent to DFCS. If you feel threatened, contact your supervisor and/or law enforcement.", citations: ["O.C.G.A. § 49-5-41 (Confidentiality of reporter identity)", "O.C.G.A. § 19-7-5(g) (Good-faith immunity)"] },
      { id: "m7-post-3", text: "A mandated reporter in Georgia suspects abuse but decides not to report because they are not '100% sure.' What are the potential legal consequences?", options: ["None — the law only requires reporting when you are certain", "A misdemeanor charge, potential professional license sanctions, and possible civil liability if the child is further harmed", "A verbal warning from their employer", "They can be charged with a felony"], correctIndex: 1, explanation: "Under Georgia law, a mandated reporter who knowingly and willfully fails to report suspected child abuse is guilty of a misdemeanor. The standard is 'reasonable cause to believe,' not certainty. Additionally, professional licensing boards may impose sanctions (including license suspension or revocation), and civil liability is possible if the child suffers further harm that could have been prevented by timely reporting. The law is designed to encourage reporting, not to punish uncertainty.", citations: ["O.C.G.A. § 19-7-5(h) (Penalty for failure to report)", "Besharov, D. J. (1990). Recognizing child abuse: A guide for the concerned. Free Press.", "Levi, B. H., & Crowell, K. (2011). Child abuse experts disagree about the threshold for mandated reporting. Clinical Pediatrics, 50(4), 321–329."] },
    ] },
    scenarios: [
      {
        id: "m7-s1",
        title: "A Child's Drawing Tells a Story",
        description: "A student in your after-school program draws something concerning. You must decide how to respond in the moment and what steps to take next.",
        steps: [
          {
            id: "m7-s1-step1",
            narrative: "You're supervising the art table at your community center's after-school program. Marcus, age 8, has been quieter than usual for the past two weeks. Today he drew a picture of a large figure standing over a small figure on the ground, with red marks on the small figure. When you sit next to him, he quickly covers the drawing and says, 'It's nothing.' You notice what appears to be a faded bruise on his forearm, partially covered by his sleeve.",
            vignette: [
              {
                id: "m7-v1-s1",
                duration: 6,
                setting: "Community center art room — colorful tables, children drawing and painting",
                mood: "tense",
                characters: [
                  { name: "Marcus", role: "Child (age 8)", avatar: "👦", position: "left", emotion: "withdrawn", action: "Quickly covering his drawing with both arms, avoiding eye contact" },
                  { name: "You", role: "Program Staff", avatar: "📋", position: "right", emotion: "calm", action: "Sitting down at the table beside Marcus, speaking softly" },
                ],
                narration: "The art room is noisy with after-school energy, but Marcus is in his own world. His drawing — before he covered it — showed clear distress. The bruise on his arm could be from playing, but combined with two weeks of behavioral change and the drawing, your training is telling you to pay attention. This is not about certainty. This is about reasonable suspicion.",
                ambientDetail: "Other children are laughing and painting nearby. Marcus's backpack is packed tightly — he always keeps it close, as if ready to leave at any moment.",
                soundCue: "Children's chatter, markers squeaking on paper",
              },
            ],
            choices: [
              {
                text: "Gently tell Marcus his drawing is interesting and you'd like to hear about it, without pushing. Then document what you observed and call the child abuse hotline after the session to make a report",
                outcome: "You maintain Marcus's trust by not interrogating him. Your report to the hotline includes specific, documented observations: the drawing's content, the behavioral changes over two weeks, the bruise, and his guarded response. CPS screens the report in and assigns an investigator. Your detailed documentation proves invaluable to the investigation. Marcus continues attending the program, and your calm response showed him that adults can be safe.",
                isOptimal: true,
                tracePhase: "Trigger (drawing + bruise) → Regulated Response (calm, non-intrusive) → Careful Appraisal (pattern recognition) → Appropriate Choice (report, don't investigate) → Protective Effect",
                citation: "Crosson-Tower, C. (2013). A teacher's guide to recognizing and reporting child abuse. National Education Association.",
              },
              {
                text: "Ask Marcus directly: 'Is someone hurting you at home?' and try to get details before deciding whether to report",
                outcome: "Marcus becomes visibly distressed and shuts down completely. He says 'No' and won't speak for the rest of the session. Your direct questioning — though well-intentioned — may have contaminated potential forensic interview evidence and caused Marcus to rehearse a denial that he may now repeat to investigators. A mandated reporter's job is to report, not to interview.",
                isOptimal: false,
                tracePhase: "Trigger → Unregulated Response (role confusion) → Premature Choice (investigating instead of reporting)",
                citation: "Kenny, M. C. (2001). Child abuse reporting: Teachers' perceived deterrents. Child Abuse & Neglect, 25(1), 81–92.",
              },
              {
                text: "Mention what you saw to Marcus's parent at pickup and see how they react before deciding what to do",
                outcome: "Marcus's father picks him up. When you mention the drawing and the bruise, his expression hardens. He says Marcus 'fell at the playground' and leaves quickly with Marcus. That night, Marcus is punished for 'telling.' The next day, Marcus doesn't come to the program. By alerting a potential abuser, you may have increased the danger to the child. Mandated reporters should NEVER alert the suspected abuser — report directly to CPS or the hotline.",
                isOptimal: false,
                tracePhase: "Trigger → Unregulated Response → Dangerous Choice (alerting potential perpetrator) → Harmful Effect",
                citation: "U.S. Department of Health and Human Services, Children's Bureau. (2019). What is child abuse and neglect? Recognizing the signs and symptoms. Child Welfare Information Gateway.",
              },
            ],
          },
        ],
      },
      {
        id: "m7-s2",
        title: "The Principal Says 'Let Me Handle It'",
        description: "You suspect abuse and your school principal tells you not to report directly. Navigate institutional pressure against your personal legal obligation under O.C.G.A. \u00A7 19-7-5.",
        steps: [
          {
            id: "m7-s2-step1",
            narrative: "You're a third-grade teacher at a Georgia elementary school. Over the past month, 8-year-old Aisha has become increasingly withdrawn. Today, she flinched violently when you placed a hand on her shoulder during reading circle. She whispered, 'Daddy gets really mad sometimes.' You go to your principal, Dr. Patterson, who says, 'I know Aisha's family. Her dad is on the PTA board. Let's not jump to conclusions \u2014 I'll talk to the family first. Don't call DFCS yet.'",
            vignette: [
              {
                id: "m7-v2-s1",
                duration: 6,
                setting: "School principal's office \u2014 afternoon, door closed",
                mood: "tense",
                characters: [
                  { name: "You", role: "Teacher", avatar: "\uD83D\uDCDA", position: "left", emotion: "anxious", action: "Standing in front of the principal's desk, holding documentation notes" },
                  { name: "Dr. Patterson", role: "School Principal", avatar: "\uD83C\uDFEB", position: "right", emotion: "calm", dialogue: "I appreciate your concern, but I know this family. The father is very involved. Let me handle this \u2014 I'll schedule a parent conference." },
                ],
                narration: "Dr. Patterson genuinely believes she's protecting the family from an unnecessary investigation. But Georgia law is clear: your obligation as a mandated reporter is personal. It cannot be delegated to your supervisor, and your principal cannot override it.",
                ambientDetail: "A 'Georgia Teacher of the Year' plaque on the wall. On her desk: a photo of Aisha's father shaking hands with the superintendent at a PTA fundraiser.",
                soundCue: "The school bell rings. Dismissal is in 30 minutes. Aisha will be going home.",
              },
            ],
            choices: [
              {
                text: "Respectfully explain that under O.C.G.A. \u00A7 19-7-5 your reporting obligation is personal and cannot be delegated, then call 1-855-GACHILD yourself",
                outcome: "You make the report to DFCS as required by law. A caseworker visits within 48 hours. The investigation reveals a pattern of physical discipline crossing into abuse. Aisha receives safety planning and the family is connected to services. Dr. Patterson later acknowledges you followed the law correctly.",
                isOptimal: true,
                tracePhase: "Trigger (flinch + disclosure) \u2192 Regulated Response (calm documentation) \u2192 Accurate Appraisal (legal obligation is personal) \u2192 Correct Choice (report directly) \u2192 Protective Effect",
                citation: "O.C.G.A. \u00A7 19-7-5 \u2014 the reporting obligation is placed on the individual mandated reporter, not the institution.",
              },
              {
                text: "Defer to Dr. Patterson \u2014 she knows the family better and she's your supervisor",
                outcome: "Dr. Patterson holds a parent conference. The father is charming and persuasive. No report is made. Aisha's attendance becomes sporadic. You have violated O.C.G.A. \u00A7 19-7-5 by failing to report, and your delay may have allowed continued harm.",
                isOptimal: false,
                tracePhase: "Trigger \u2192 Unregulated Response (deference to authority) \u2192 Failed Appraisal (institutional loyalty over legal duty) \u2192 Harmful Choice",
                citation: "Kenny, M. C. (2001). Child abuse reporting: Teachers' perceived deterrents. Child Abuse & Neglect, 25(1), 81\u201392.",
              },
              {
                text: "Tell Dr. Patterson you'll wait, but secretly call DFCS without telling her",
                outcome: "You make the report \u2014 satisfying your legal obligation \u2014 but the secrecy creates institutional distrust. A better approach: be transparent about your legal obligation. You can respectfully disagree with your supervisor AND fulfill your duty openly. Georgia law protects you from retaliation.",
                isOptimal: false,
                tracePhase: "Trigger \u2192 Partially Regulated Response \u2192 Correct Choice, Suboptimal Execution (secrecy undermines professional relationships)",
                citation: "O.C.G.A. \u00A7 19-7-5(g) \u2014 good-faith immunity protects reporters from retaliation and liability.",
              },
            ],
          },
        ],
      },
    ],
  },
];

// Merge additional pre/post-assessment questions into each module (expand to 10 per module)
MODULES.forEach((mod) => {
  const extraPre = EXTRA_PRE_QUESTIONS[mod.id];
  if (extraPre) {
    mod.preAssessment.questions.push(...extraPre);
  }
  const extraPost = EXTRA_POST_QUESTIONS[mod.id];
  if (extraPost) {
    mod.postAssessment.questions.push(...extraPost);
  }
});

export interface UserProgress {
  moduleId: number;
  preAssessmentScore: number | null;
  postAssessmentScore: number | null;
  sectionsCompleted: string[];
  scenariosCompleted: string[];
  timeSpent: number;
  status: "not_started" | "in_progress" | "completed";
  completedDate?: string;
}

export const MOCK_PROGRESS: UserProgress[] = [
  {
    moduleId: 1,
    preAssessmentScore: 80,
    postAssessmentScore: 92,
    sectionsCompleted: ["m1-root", "m1-regulate", "m1-reflect", "m1-restore", "m1-reconnect"],
    scenariosCompleted: ["m1-s1"],
    timeSpent: 245,
    status: "completed",
    completedDate: "2026-02-15",
  },
  {
    moduleId: 2,
    preAssessmentScore: 67,
    postAssessmentScore: null,
    sectionsCompleted: ["m2-root", "m2-regulate", "m2-reflect"],
    scenariosCompleted: [],
    timeSpent: 180,
    status: "in_progress",
  },
  { moduleId: 3, preAssessmentScore: null, postAssessmentScore: null, sectionsCompleted: [], scenariosCompleted: [], timeSpent: 0, status: "not_started" },
  { moduleId: 4, preAssessmentScore: null, postAssessmentScore: null, sectionsCompleted: [], scenariosCompleted: [], timeSpent: 0, status: "not_started" },
  { moduleId: 5, preAssessmentScore: null, postAssessmentScore: null, sectionsCompleted: [], scenariosCompleted: [], timeSpent: 0, status: "not_started" },
  { moduleId: 6, preAssessmentScore: null, postAssessmentScore: null, sectionsCompleted: [], scenariosCompleted: [], timeSpent: 0, status: "not_started" },
  { moduleId: 7, preAssessmentScore: null, postAssessmentScore: null, sectionsCompleted: [], scenariosCompleted: [], timeSpent: 0, status: "not_started" },
];

// DEV ONLY — placeholder mock data for local development. Never use in production code paths.
export const ADMIN_STATS = {
  totalLearners: 342,
  activeLearners: 187,
  completionRate: 68,
  avgScore: 84,
  roleBreakdown: [
    { name: "law_enforcement", learners: 45, completion: 72 },
    { name: "cpi", learners: 68, completion: 65 },
    { name: "prosecutor", learners: 32, completion: 81 },
    { name: "judge", learners: 28, completion: 75 },
    { name: "medical", learners: 41, completion: 62 },
    { name: "school", learners: 56, completion: 58 },
    { name: "advocate", learners: 38, completion: 79 },
    { name: "forensic", learners: 34, completion: 88 },
  ],
  moduleCompletion: [
    { module: "Module 1", completed: 234, inProgress: 58, notStarted: 50 },
    { module: "Module 2", completed: 189, inProgress: 72, notStarted: 81 },
    { module: "Module 3", completed: 156, inProgress: 64, notStarted: 122 },
    { module: "Module 4", completed: 142, inProgress: 55, notStarted: 145 },
    { module: "Module 5", completed: 128, inProgress: 48, notStarted: 166 },
    { module: "Module 6", completed: 112, inProgress: 62, notStarted: 168 },
  ],
  monthlyEnrollment: [
    { month: "Sep", enrolled: 45 },
    { month: "Oct", enrolled: 62 },
    { month: "Nov", enrolled: 38 },
    { month: "Dec", enrolled: 28 },
    { month: "Jan", enrolled: 72 },
    { month: "Feb", enrolled: 55 },
    { month: "Mar", enrolled: 42 },
  ],
  assessmentDistribution: [
    { range: "90-100%", count: 89 },
    { range: "80-89%", count: 112 },
    { range: "70-79%", count: 78 },
    { range: "60-69%", count: 42 },
    { range: "Below 60%", count: 21 },
  ],
};

/** Phase intro vignettes for learning sections — short animated introductions for each 5Rs phase */
export const PHASE_VIGNETTES: Record<string, VignetteScene[]> = {
  Root: [
    {
      id: "phase-root-1",
      duration: 5,
      setting: "A quiet study — books and case files on the desk",
      mood: "calm",
      characters: [
        { name: "Mentor", role: "Senior Investigator", avatar: "📚", position: "left", emotion: "calm", dialogue: "Before you can respond to trauma, you have to understand it. That starts here — at the root." },
        { name: "You", role: "Trainee", avatar: "🎓", position: "right", emotion: "focused", action: "Opening a case study binder" },
      ],
      narration: "Every investigation begins long before you arrive at a scene. It begins with knowledge — the legal frameworks, the neurobiology, the research. The Root phase grounds you in the foundational understanding that every decision you make will rest upon.",
      ambientDetail: "Research articles are spread across the desk. A diagram of the brain's stress response system is pinned to the wall.",
    },
    {
      id: "phase-root-2",
      duration: 4,
      setting: "The same study — a key concept emerging",
      mood: "neutral",
      characters: [
        { name: "Mentor", role: "Senior Investigator", avatar: "📚", position: "center", emotion: "focused", dialogue: "When you understand why a child responds the way they do, you stop mistaking survival for defiance." },
      ],
      narration: "Understanding changes everything. A child who won't make eye contact isn't being uncooperative — they're protecting themselves. A parent who becomes hostile may be terrified, not guilty. Root knowledge transforms how you see every person in every case.",
      soundCue: "Pages turning, pen scratching on paper",
    },
  ],
  Regulate: [
    {
      id: "phase-regulate-1",
      duration: 5,
      setting: "Outside a home — before knocking on the door",
      mood: "tense",
      characters: [
        { name: "You", role: "Investigator", avatar: "🔍", position: "center", emotion: "anxious", action: "Standing at the door, hand raised, pausing before knocking" },
      ],
      narration: "Your heart is racing. The referral described severe injuries. You know what you might see on the other side of this door. The Regulate phase teaches you to notice this moment — the moment between trigger and response — and use it.",
      ambientDetail: "Your hand hovers over the door. You take one deliberate breath.",
      soundCue: "Heartbeat, a steadying exhale",
    },
    {
      id: "phase-regulate-2",
      duration: 4,
      setting: "Same doorstep — after a breath",
      mood: "calm",
      characters: [
        { name: "You", role: "Investigator", avatar: "🔍", position: "center", emotion: "calm", action: "Lowering shoulders, centering posture, then knocking steadily" },
      ],
      narration: "One breath. That's sometimes all you get. But in that breath, you can shift from reactive to regulated. The child behind this door needs you to be present, not overwhelmed. Regulation isn't about suppressing emotion — it's about choosing your professional response.",
    },
  ],
  Reflect: [
    {
      id: "phase-reflect-1",
      duration: 5,
      setting: "Case review room — after an investigation",
      mood: "emotional",
      characters: [
        { name: "You", role: "Investigator", avatar: "🔍", position: "left", emotion: "focused", action: "Reviewing case notes, pausing at a critical decision point" },
        { name: "Supervisor", role: "Team Lead", avatar: "👤", position: "right", emotion: "calm", dialogue: "Walk me through what happened when the child recanted. What were you feeling in that moment?" },
      ],
      narration: "Reflection isn't hindsight — it's a professional skill. The Reflect phase asks you to examine your decisions, your assumptions, and your emotional responses with the same rigor you apply to evidence. What did you see? What did you miss? What would you do differently?",
      ambientDetail: "Case photographs are face-down on the table. A timeline is drawn on the whiteboard.",
    },
  ],
  Restore: [
    {
      id: "phase-restore-1",
      duration: 5,
      setting: "Training room — practicing a protocol",
      mood: "hopeful",
      characters: [
        { name: "Instructor", role: "Protocol Specialist", avatar: "📋", position: "left", emotion: "focused", dialogue: "The protocol exists to protect both the child and the integrity of your investigation. When in doubt, return to the structure." },
        { name: "You", role: "Investigator", avatar: "🔍", position: "right", emotion: "focused", action: "Practicing documentation procedures with a standardized form" },
      ],
      narration: "Restore is about correction — replacing harmful or ineffective practices with evidence-based protocols. It's where knowledge becomes procedure, where understanding becomes action. Every checklist, every interview protocol, every documentation standard exists because someone learned from a case that went wrong.",
      ambientDetail: "A laminated NICHD protocol card sits on the desk. Practice interview recordings play on a screen.",
      soundCue: "Training video audio, pen clicking",
    },
  ],
  Reconnect: [
    {
      id: "phase-reconnect-1",
      duration: 5,
      setting: "MDT conference room — professionals gathered around a table",
      mood: "hopeful",
      characters: [
        { name: "Detective", role: "Law Enforcement", avatar: "🔍", position: "left", emotion: "focused", dialogue: "We can't do this alone." },
        { name: "Social Worker", role: "CPS", avatar: "📋", position: "center", emotion: "caring", dialogue: "The family needs services that extend beyond our investigation." },
        { name: "Advocate", role: "Victim Services", avatar: "💜", position: "right", emotion: "hopeful", dialogue: "And the child needs to know that the adults in the room are working together — for them." },
      ],
      narration: "No single professional can protect a child alone. The Reconnect phase brings the multidisciplinary team together — law enforcement, child welfare, prosecution, medical, education, and advocacy — united by a shared commitment to the child's safety and healing.",
      ambientDetail: "A child's drawing is taped to the whiteboard — a sun, a house, and stick figures holding hands.",
      soundCue: "Collaborative discussion, papers shuffling",
    },
  ],
};
