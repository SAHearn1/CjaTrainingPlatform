// Auto-generated from data.ts split (issue #27) — Module 5
import type { Module } from './types';
import { MODULE_IMAGES } from './constants';

export const module5: Module =   {
    id: 5,
    title: "Multidisciplinary Investigation Coordination",
    description:
      "Training on effective collaboration between law enforcement, child welfare, prosecution, medical, and advocacy professionals in child abuse investigations.",
    duration: "3.5 hours",
    image: MODULE_IMAGES[4],
    sections: [
      { id: "m5-root", videoId: "LEC-M5-01", phase: "Root", title: "MDT Framework and Models", description: "Understanding multidisciplinary team structures", content: ["Children's Advocacy Center model and its evidence base.", "Joint investigation protocols between law enforcement and CPS.", "Prosecution-led vs. investigation-led MDT models.", "Federal and state mandates for multidisciplinary coordination."] },
      { id: "m5-regulate", videoId: "LEC-M5-02", phase: "Regulate", title: "Managing Interagency Dynamics", description: "Navigating professional tensions in collaborative investigations", content: ["Role clarity and boundary management in MDT settings.", "Addressing conflicting agency priorities and mandates.", "Managing disagreements about case direction professionally.", "Supporting team members experiencing secondary traumatic stress."] },
      { id: "m5-reflect", videoId: "LEC-M5-03", phase: "Reflect", title: "MDT Case Review", description: "Analyzing multidisciplinary case outcomes", content: ["Review cases where MDT coordination succeeded or failed.", "Identify communication breakdowns and their consequences.", "Examine information-sharing protocols and confidentiality balance.", "Assess cultural competency in team approaches."] },
      { id: "m5-restore", videoId: "LEC-M5-04", phase: "Restore", title: "Effective MDT Protocols", description: "Building strong multidisciplinary processes", content: ["Case tracking and information management systems.", "Structured case conferencing models.", "Outcome measurement for MDT effectiveness.", "Quality assurance and continuous improvement processes."] },
      { id: "m5-reconnect", videoId: "LEC-M5-05", phase: "Reconnect", title: "Victim-Centered MDT Practice", description: "Keeping the child at the center of all coordination", content: ["Reducing the number of interviews through coordinated planning.", "Ensuring continuity of advocacy throughout the process.", "Coordinating services for child and non-offending family members.", "Long-term outcome tracking and follow-up protocols."] },
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
        videoId: "SIM-M5-S1",
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
  };
