/**
 * Additional pre-assessment questions to expand each module to 10 questions.
 * These are merged into MODULES in data.ts.
 */
import type { Question } from "./data";

export const EXTRA_PRE_QUESTIONS: Record<number, Question[]> = {
  // ─── Module 1: needs 5 more (currently has 5) ───
  1: [
    {
      id: "m1-pre-6",
      text: "How many Adverse Childhood Experiences (ACEs) categories were identified in the original Felitti & Anda study?",
      options: ["5", "7", "10", "15"],
      correctIndex: 2,
      explanation:
        "The original CDC-Kaiser Permanente ACE Study identified 10 categories of adverse childhood experiences across three domains: abuse (physical, emotional, sexual), neglect (physical, emotional), and household dysfunction (domestic violence, substance abuse, mental illness, parental separation/divorce, incarcerated household member).",
      citations: [
        "Felitti, V. J., Anda, R. F., Nordenberg, D., et al. (1998). Relationship of childhood abuse and household dysfunction to many of the leading causes of death in adults. American Journal of Preventive Medicine, 14(4), 245\u2013258. https://doi.org/10.1016/S0749-3797(98)00017-8",
      ],
    },
    {
      id: "m1-pre-7",
      text: "In attachment theory, a child who avoids the caregiver upon reunion and shows little distress during separation most likely exhibits which attachment style?",
      options: ["Secure attachment", "Anxious-ambivalent attachment", "Avoidant attachment", "Disorganized attachment"],
      correctIndex: 2,
      explanation:
        "Avoidant attachment (Type A in Ainsworth\u2019s classification) is characterized by the child\u2019s apparent indifference to the caregiver\u2019s departure and avoidance of the caregiver upon reunion. These children have learned that expressing distress does not reliably elicit a supportive response.",
      citations: [
        "Ainsworth, M. D. S., Blehar, M. C., Waters, E., & Wall, S. (1978). Patterns of attachment: A psychological study of the Strange Situation. Lawrence Erlbaum Associates.",
      ],
    },
    {
      id: "m1-pre-8",
      text: "Which brain region is most responsible for the 'fight-or-flight' response and is highly reactive in traumatized children?",
      options: ["Prefrontal cortex", "Cerebellum", "Amygdala", "Hippocampus"],
      correctIndex: 2,
      explanation:
        "The amygdala is the brain\u2019s threat detection center and drives the fight-or-flight response. In children who have experienced chronic trauma, the amygdala often becomes hyperreactive, leading to exaggerated startle responses and difficulty distinguishing safe from unsafe situations.",
      citations: [
        "Perry, B. D. (2009). Examining child maltreatment through a neurodevelopmental lens: Clinical applications of the neurosequential model of therapeutics. Journal of Loss and Trauma, 14(4), 240\u2013255. https://doi.org/10.1080/15325020903004350",
        "van der Kolk, B. A. (2014). The body keeps the score: Brain, mind, and body in the healing of trauma. Viking.",
      ],
    },
    {
      id: "m1-pre-9",
      text: "What does the 'window of tolerance' concept describe in trauma-informed practice?",
      options: [
        "The maximum duration of a forensic interview",
        "The optimal zone of arousal in which a person can function effectively and process information",
        "The time frame within which a report must be filed",
        "The age range during which children are most vulnerable to trauma",
      ],
      correctIndex: 1,
      explanation:
        "Siegel\u2019s 'window of tolerance' describes the zone of optimal arousal where a person can process information, think clearly, and regulate emotions. Trauma often narrows this window, causing individuals to rapidly shift into hyperarousal (fight/flight) or hypoarousal (freeze/shutdown).",
      citations: [
        "Siegel, D. J. (1999). The developing mind: How relationships and the brain interact to shape who we are. Guilford Press.",
        "Ogden, P., Minton, K., & Pain, C. (2006). Trauma and the body: A sensorimotor approach to psychotherapy. W. W. Norton & Company.",
      ],
    },
    {
      id: "m1-pre-10",
      text: "Which of the following best describes 'toxic stress' as defined by the National Scientific Council on the Developing Child?",
      options: [
        "Any stressful experience in childhood",
        "Prolonged activation of the stress response without adequate adult support, which disrupts brain architecture",
        "A one-time traumatic event that causes PTSD",
        "Stress caused by academic pressure in school",
      ],
      correctIndex: 1,
      explanation:
        "Toxic stress refers to strong, frequent, or prolonged activation of the body\u2019s stress management system in the absence of the buffering protection of supportive adult relationships. Unlike tolerable stress, toxic stress disrupts brain architecture and increases the risk of stress-related disease and cognitive impairment.",
      citations: [
        "National Scientific Council on the Developing Child. (2005/2014). Excessive stress disrupts the architecture of the developing brain (Working Paper 3, Updated Edition). Harvard University Center on the Developing Child.",
        "Shonkoff, J. P., Garner, A. S., et al. (2012). The lifelong effects of early childhood adversity and toxic stress. Pediatrics, 129(1), e232\u2013e246. https://doi.org/10.1542/peds.2011-2663",
      ],
    },
  ],

  // ─── Module 2: needs 7 more (currently has 3) ───
  2: [
    {
      id: "m2-pre-4",
      text: "What is the NICHD Protocol primarily designed for?",
      options: [
        "Administering psychological tests to children",
        "Conducting structured, evidence-based forensic interviews with children",
        "Training parents on child development",
        "Screening children for developmental delays",
      ],
      correctIndex: 1,
      explanation:
        "The National Institute of Child Health and Human Development (NICHD) Investigative Interview Protocol is a structured, evidence-based protocol for conducting forensic interviews with children suspected of being abuse victims. It emphasizes open-ended questioning, narrative practice, and developmentally appropriate language.",
      citations: [
        "Lamb, M. E., Orbach, Y., Hershkowitz, I., Esplin, P. W., & Horowitz, D. (2007). A structured forensic interview protocol improves the quality and informativeness of investigative interviews with children. Child Abuse & Neglect, 31(11\u201312), 1201\u20131231. https://doi.org/10.1016/j.chiabu.2007.03.021",
      ],
    },
    {
      id: "m2-pre-5",
      text: "Why should investigators avoid asking leading questions during interviews with children?",
      options: [
        "Leading questions take too long",
        "Children may acquiesce to the perceived 'correct' answer, contaminating the account",
        "Leading questions are illegal in all jurisdictions",
        "Children do not understand leading questions",
      ],
      correctIndex: 1,
      explanation:
        "Children are particularly susceptible to suggestion. Leading questions communicate the interviewer\u2019s expectations and children may acquiesce (say 'yes') to please the adult or because they believe the adult knows the answer. This can contaminate the child\u2019s account and undermine its forensic value.",
      citations: [
        "Ceci, S. J., & Bruck, M. (1995). Jeopardy in the courtroom: A scientific analysis of children\u2019s testimony. American Psychological Association.",
        "Lyon, T. D. (2014). Interviewing children. Annual Review of Law and Social Science, 10, 73\u201389. https://doi.org/10.1146/annurev-lawsocsci-110413-030913",
      ],
    },
    {
      id: "m2-pre-6",
      text: "What is 'rapport building' in the context of a forensic interview?",
      options: [
        "Bribing the child with toys to get them to talk",
        "Establishing a comfortable, trusting relationship so the child feels safe providing information",
        "Telling the child what you already know about the case",
        "Having the child\u2019s parent present during the interview",
      ],
      correctIndex: 1,
      explanation:
        "Rapport building is the initial phase of a forensic interview where the interviewer establishes a comfortable, non-threatening relationship with the child. It includes ground rules (e.g., 'It\u2019s okay to say I don\u2019t know'), narrative practice with neutral topics, and assessing the child\u2019s developmental level.",
      citations: [
        "Hershkowitz, I. (2011). Rapport building in investigative interviews of children. In M. E. Lamb, D. J. La Rooy, L. C. Malloy, & C. Katz (Eds.), Children\u2019s testimony: A handbook of psychological research and forensic practice (2nd ed., pp. 109\u2013128). Wiley.",
      ],
    },
    {
      id: "m2-pre-7",
      text: "At approximately what age can most children reliably distinguish between truth and falsehood in a forensic interview context?",
      options: ["2\u20133 years", "4\u20135 years", "7\u20138 years", "10\u201312 years"],
      correctIndex: 1,
      explanation:
        "Research indicates that most children can reliably distinguish between truth and lies by age 4\u20135, though their understanding becomes more sophisticated with age. Forensic interview protocols typically include a truth-lie discussion to establish that the child understands the importance of telling the truth.",
      citations: [
        "Lyon, T. D., & Saywitz, K. J. (1999). Young maltreated children\u2019s competence to take the oath. Applied Developmental Science, 3(1), 16\u201327. https://doi.org/10.1207/s1532480xads0301_3",
      ],
    },
    {
      id: "m2-pre-8",
      text: "What is 'developmentally appropriate language' in the context of interviewing children?",
      options: [
        "Using baby talk regardless of the child\u2019s age",
        "Adjusting vocabulary, sentence complexity, and concepts to match the child\u2019s cognitive and linguistic level",
        "Speaking very slowly and loudly",
        "Only using yes/no questions",
      ],
      correctIndex: 1,
      explanation:
        "Developmentally appropriate language means adjusting the interviewer\u2019s vocabulary, sentence structure, and conceptual complexity to match the child\u2019s developmental level. This includes avoiding double negatives, complex temporal concepts, and legal jargon that children cannot process.",
      citations: [
        "Saywitz, K. J., & Camparo, L. (1998). Interviewing child witnesses: A developmental perspective. Child Abuse & Neglect, 22(8), 825\u2013843. https://doi.org/10.1016/S0145-2134(98)00054-4",
      ],
    },
    {
      id: "m2-pre-9",
      text: "What is the primary risk of interviewing a child multiple times about the same alleged abuse?",
      options: [
        "The child may become bored",
        "Repeated interviews may introduce suggestion, contaminate memories, and re-traumatize the child",
        "Multiple interviews always produce more accurate information",
        "It is legally prohibited in all states",
      ],
      correctIndex: 1,
      explanation:
        "Multiple interviews create risks of suggestion (each interviewer may introduce different cues), memory contamination (the child may incorporate post-event information into their account), and re-traumatization (repeatedly recounting traumatic events). This is why the CAC model emphasizes a single, well-conducted forensic interview.",
      citations: [
        "La Rooy, D., Lamb, M. E., & Pipe, M. E. (2009). Repeated interviewing: A critical evaluation of the risks and potential benefits. In K. Kuehnle & M. Connell (Eds.), The evaluation of child sexual abuse allegations (pp. 327\u2013361). Wiley.",
      ],
    },
    {
      id: "m2-pre-10",
      text: "What role does 'active listening' play in trauma-informed communication with children?",
      options: [
        "It helps the interviewer formulate their next question faster",
        "It demonstrates genuine engagement, validates the child\u2019s experience, and encourages continued disclosure",
        "It replaces the need for formal interview protocols",
        "It is only relevant for therapists, not investigators",
      ],
      correctIndex: 1,
      explanation:
        "Active listening \u2014 reflecting, summarizing, using minimal encouragers, and maintaining attentive body language \u2014 signals to the child that they are heard and believed. This validation encourages continued disclosure and reduces the child\u2019s anxiety about sharing difficult information.",
      citations: [
        "Saywitz, K. J., Lyon, T. D., & Goodman, G. S. (2018). When interviewing children: A review and update. In J. Conte & B. Klika (Eds.), The APSAC handbook on child maltreatment (4th ed.). Sage.",
      ],
    },
  ],

  // ─── Module 3: needs 7 more (currently has 3) ───
  3: [
    {
      id: "m3-pre-4",
      text: "What does IDEA stand for?",
      options: [
        "Individual Development and Education Act",
        "Individuals with Disabilities Education Act",
        "Integrated Disability Evaluation Assessment",
        "Internal Disability Enforcement Authority",
      ],
      correctIndex: 1,
      explanation:
        "The Individuals with Disabilities Education Act (IDEA) is a federal law that ensures students with disabilities receive a Free Appropriate Public Education (FAPE) tailored to their individual needs through an Individualized Education Program (IEP).",
      citations: [
        "Individuals with Disabilities Education Act, 20 U.S.C. \u00A7\u00A7 1400\u20131482 (2004).",
        "Yell, M. L. (2019). The law and special education (5th ed.). Pearson.",
      ],
    },
    {
      id: "m3-pre-5",
      text: "What is Section 504 of the Rehabilitation Act?",
      options: [
        "A criminal statute about disability fraud",
        "A civil rights law prohibiting discrimination based on disability in programs receiving federal funding",
        "A section of CAPTA about disabled children",
        "A medical billing code for disability services",
      ],
      correctIndex: 1,
      explanation:
        "Section 504 of the Rehabilitation Act of 1973 is a civil rights law that prohibits discrimination against individuals with disabilities in any program or activity receiving federal financial assistance. It requires reasonable accommodations and is broader in scope than IDEA.",
      citations: [
        "Section 504 of the Rehabilitation Act of 1973, 29 U.S.C. \u00A7 794.",
        "Zirkel, P. A. (2009). Section 504: Student eligibility update. The Clearing House, 82(5), 209\u2013211.",
      ],
    },
    {
      id: "m3-pre-6",
      text: "Why might a child with a communication disability be at higher risk for undetected abuse?",
      options: [
        "Children with communication disabilities are never abused",
        "They may lack the verbal ability to disclose abuse, and behavioral indicators may be misattributed to their disability",
        "Mandatory reporting laws do not apply to children with disabilities",
        "Communication disabilities only affect adults",
      ],
      correctIndex: 1,
      explanation:
        "Children with communication disabilities face a 'double jeopardy': they may be unable to verbally disclose abuse and their behavioral changes (aggression, withdrawal, regression) may be dismissed as symptoms of their disability rather than recognized as potential indicators of abuse.",
      citations: [
        "Sullivan, P. M., & Knutson, J. F. (2000). Maltreatment and disabilities: A population-based epidemiological study. Child Abuse & Neglect, 24(10), 1257\u20131273. https://doi.org/10.1016/S0145-2134(00)00190-3",
        "Hershkowitz, I., Lamb, M. E., & Horowitz, D. (2007). Victimization of children with disabilities. American Journal of Orthopsychiatry, 77(4), 629\u2013635.",
      ],
    },
    {
      id: "m3-pre-7",
      text: "What is an Individualized Education Program (IEP)?",
      options: [
        "A standardized test given to all students",
        "A legally binding document that outlines a disabled student\u2019s specific educational goals, services, and accommodations",
        "A parent\u2019s request for homeschooling",
        "A teacher\u2019s personal lesson plan",
      ],
      correctIndex: 1,
      explanation:
        "An IEP is a legally binding document developed by a team (including parents, teachers, and specialists) that outlines the specific educational goals, services, accommodations, and modifications for a student with a disability who qualifies under IDEA.",
      citations: [
        "Individuals with Disabilities Education Act, 20 U.S.C. \u00A7 1414(d).",
        "Bateman, B. D., & Linden, M. A. (2012). Better IEPs: How to develop legally correct and educationally useful programs (5th ed.). Attainment Company.",
      ],
    },
    {
      id: "m3-pre-8",
      text: "What is 'diagnostic overshadowing' in the context of children with disabilities?",
      options: [
        "A medical imaging technique",
        "When symptoms of abuse are incorrectly attributed to the child\u2019s disability, causing abuse to go undetected",
        "A type of educational assessment",
        "When a child\u2019s disability diagnosis changes over time",
      ],
      correctIndex: 1,
      explanation:
        "Diagnostic overshadowing occurs when clinicians or professionals attribute behavioral signs of abuse (e.g., aggression, regression, fear responses) to the child\u2019s pre-existing disability rather than recognizing them as potential indicators of maltreatment. This is a significant barrier to detection.",
      citations: [
        "Reiss, S., Levitan, G. W., & Szyszko, J. (1982). Emotional disturbance and mental retardation: Diagnostic overshadowing. American Journal of Mental Deficiency, 86(6), 567\u2013574.",
        "Westcott, H. L., & Jones, D. P. H. (1999). Annotation: The abuse of disabled children. Journal of Child Psychology and Psychiatry, 40(4), 497\u2013506.",
      ],
    },
    {
      id: "m3-pre-9",
      text: "What does the ADA require regarding access to child welfare proceedings for participants with disabilities?",
      options: [
        "Nothing \u2014 the ADA does not apply to courts",
        "Reasonable accommodations to ensure effective communication and participation (e.g., interpreters, assistive technology, modified procedures)",
        "That all proceedings be conducted in sign language",
        "That individuals with disabilities be excluded from proceedings",
      ],
      correctIndex: 1,
      explanation:
        "The Americans with Disabilities Act (Title II) requires state and local government entities, including courts and child welfare agencies, to provide reasonable accommodations to individuals with disabilities. This includes sign language interpreters, assistive listening devices, accessible facilities, and modified procedures.",
      citations: [
        "Americans with Disabilities Act of 1990, 42 U.S.C. \u00A7\u00A7 12101\u201312213.",
        "National Council on Disability. (2012). Rocking the cradle: Ensuring the rights of parents with disabilities and their children.",
      ],
    },
    {
      id: "m3-pre-10",
      text: "Research indicates that children with disabilities are how much more likely to experience abuse compared to children without disabilities?",
      options: [
        "About the same rate",
        "1.5 times more likely",
        "3 to 4 times more likely",
        "10 times more likely",
      ],
      correctIndex: 2,
      explanation:
        "The World Health Organization and multiple studies have found that children with disabilities are 3 to 4 times more likely to experience violence and abuse compared to their non-disabled peers. Contributing factors include dependency on caregivers, communication barriers, social isolation, and institutional settings.",
      citations: [
        "World Health Organization. (2011). World report on disability. Geneva: WHO.",
        "Jones, L., Bellis, M. A., Wood, S., et al. (2012). Prevalence and risk of violence against children with disabilities: A systematic review and meta-analysis. The Lancet, 380(9845), 899\u2013907. https://doi.org/10.1016/S0140-6736(12)60692-8",
      ],
    },
  ],

  // ─── Module 4: needs 9 more (currently has 1) ───
  4: [
    {
      id: "m4-pre-2",
      text: "What is 'chain of custody' in forensic evidence handling?",
      options: [
        "The legal guardianship of a child during an investigation",
        "A documented, unbroken record of who handled evidence, when, and under what conditions",
        "The order in which witnesses testify",
        "The sequence of court hearings in a case",
      ],
      correctIndex: 1,
      explanation:
        "Chain of custody is the chronological documentation showing the seizure, custody, control, transfer, analysis, and disposition of evidence. Any break in the chain can lead to questions about evidence integrity and may result in the evidence being deemed inadmissible.",
      citations: [
        "Saferstein, R. (2018). Criminalistics: An introduction to forensic science (12th ed.). Pearson.",
      ],
    },
    {
      id: "m4-pre-3",
      text: "What is the primary goal of a forensic medical examination in a child abuse case?",
      options: [
        "To punish the suspected abuser",
        "To document injuries, collect biological evidence, and address the child\u2019s medical needs",
        "To determine whether the child is lying",
        "To obtain a confession from the child",
      ],
      correctIndex: 1,
      explanation:
        "A forensic medical examination serves the dual purpose of documenting injuries and collecting biological evidence (for potential legal proceedings) while also addressing the child\u2019s immediate medical needs and providing reassurance about their physical well-being.",
      citations: [
        "Adams, J. A., Kellogg, N. D., Farst, K. J., et al. (2016). Updated guidelines for the medical assessment and care of children who may have been sexually abused. Journal of Pediatric and Adolescent Gynecology, 29(2), 81\u201387.",
      ],
    },
    {
      id: "m4-pre-4",
      text: "Why is it critical to document the child\u2019s exact words (verbatim) when they disclose abuse?",
      options: [
        "It makes the report longer and more impressive",
        "Verbatim quotes preserve the child\u2019s language and are more credible and admissible than paraphrased summaries",
        "Children\u2019s exact words are not important in legal proceedings",
        "It is only necessary for children under age 5",
      ],
      correctIndex: 1,
      explanation:
        "Recording the child\u2019s exact words (rather than paraphrasing or interpreting) preserves the original language, which is more credible in court. Paraphrasing introduces the adult\u2019s interpretation and vocabulary, which can alter the meaning and raise questions about suggestibility.",
      citations: [
        "Myers, J. E. B. (2005). Myers on evidence in child, domestic, and elder abuse cases. Aspen Publishers.",
      ],
    },
    {
      id: "m4-pre-5",
      text: "What is the difference between an 'outcry witness' and a 'forensic interviewer'?",
      options: [
        "There is no difference \u2014 they are the same role",
        "An outcry witness is the first person the child tells about the abuse; a forensic interviewer is a trained professional who conducts a structured, recorded interview",
        "An outcry witness is always a police officer",
        "A forensic interviewer is the child\u2019s therapist",
      ],
      correctIndex: 1,
      explanation:
        "An outcry witness is the first person to whom the child discloses abuse \u2014 often a teacher, parent, or other trusted adult. A forensic interviewer is a specially trained professional who conducts a structured, recorded interview using an evidence-based protocol. The outcry witness\u2019s testimony about the child\u2019s initial disclosure is often admissible as an exception to hearsay rules.",
      citations: [
        "Lyon, T. D. (2014). Interviewing children. Annual Review of Law and Social Science, 10, 73\u201389.",
      ],
    },
    {
      id: "m4-pre-6",
      text: "What type of photographic documentation is recommended when documenting physical injuries on a child?",
      options: [
        "A single photo of the child\u2019s face",
        "Multiple photos showing: overall body context, mid-range framing, and close-up detail of each injury with a measurement scale",
        "Photos are not necessary if a written description exists",
        "Only photos taken by the child\u2019s parent are admissible",
      ],
      correctIndex: 1,
      explanation:
        "Best practice for injury documentation follows a three-shot protocol: (1) an overview shot showing the injury in context of the body, (2) a mid-range shot framing the injury area, and (3) a close-up with a forensic ruler or scale for measurement. This provides comprehensive documentation for medical and legal purposes.",
      citations: [
        "Baker, A. M. (2007). Forensic photography in the emergency department. Journal of Emergency Nursing, 33(5), 468\u2013470.",
      ],
    },
    {
      id: "m4-pre-7",
      text: "What is a 'disclosure' in the context of child abuse investigation?",
      options: [
        "A legal document filed with the court",
        "When a child communicates \u2014 verbally or through behavior, drawings, or play \u2014 that they have experienced abuse",
        "The investigator revealing case details to the media",
        "A parent admitting to abuse",
      ],
      correctIndex: 1,
      explanation:
        "A disclosure occurs when a child communicates their abuse experience. Disclosures may be direct ('My uncle touched me'), indirect ('I don\u2019t like going to Uncle\u2019s house'), behavioral (sexualized play, regression), or accidental (discovered through medical examination or third-party observation). Research shows most disclosures are delayed and incremental.",
      citations: [
        "Alaggia, R. (2004). Many ways of telling: Expanding conceptualizations of child sexual abuse disclosure. Child Abuse & Neglect, 28(11), 1213\u20131227. https://doi.org/10.1016/j.chiabu.2004.03.016",
      ],
    },
    {
      id: "m4-pre-8",
      text: "What is the Daubert standard and why is it relevant to forensic evidence in child abuse cases?",
      options: [
        "A standard for measuring children\u2019s height and weight",
        "A legal standard governing the admissibility of expert testimony and scientific evidence in federal courts",
        "A protocol for child protective services home visits",
        "A rating scale for severity of abuse",
      ],
      correctIndex: 1,
      explanation:
        "The Daubert standard (from Daubert v. Merrell Dow Pharmaceuticals, 1993) requires that expert testimony and scientific evidence be based on sufficient facts/data, reliable principles and methods, and reliably applied to the facts of the case. This affects how forensic interview evidence and medical findings are presented in court.",
      citations: [
        "Daubert v. Merrell Dow Pharmaceuticals, Inc., 509 U.S. 579 (1993).",
      ],
    },
    {
      id: "m4-pre-9",
      text: "Why should physical evidence in a child abuse case be collected as soon as possible?",
      options: [
        "To save time in the investigation",
        "Because biological evidence degrades over time, injuries heal, and environmental evidence may be altered or destroyed",
        "Because courts require evidence within 24 hours",
        "Physical evidence is not important in child abuse cases",
      ],
      correctIndex: 1,
      explanation:
        "Time is critical in evidence collection: biological evidence (DNA, bodily fluids) degrades; injuries heal and bruise patterns change; crime scenes may be cleaned or altered; and digital evidence may be deleted. Prompt collection preserves the integrity and probative value of the evidence.",
      citations: [
        "Christian, C. W., & Committee on Child Abuse and Neglect. (2015). The evaluation of suspected child physical abuse. Pediatrics, 135(5), e1337\u2013e1354.",
      ],
    },
    {
      id: "m4-pre-10",
      text: "What role does body mapping play in documenting child abuse?",
      options: [
        "It is a type of GPS tracking",
        "A systematic method of recording the location, size, shape, and color of all injuries on a diagram of the human body",
        "A psychological assessment technique",
        "A method of teaching children about body safety",
      ],
      correctIndex: 1,
      explanation:
        "Body mapping involves systematically recording all injuries on a standardized diagram of the human body, noting the location, size, shape, color, and stage of healing for each injury. This creates a visual record that complements photographs and written descriptions, and helps identify patterns (e.g., injuries in various stages of healing suggesting repeated abuse).",
      citations: [
        "Giardino, A. P., Lyn, M. A., & Giardino, E. R. (2010). A practical guide to the evaluation of child physical abuse and neglect (2nd ed.). Springer.",
      ],
    },
  ],

  // ─── Module 5: needs 9 more (currently has 1) ───
  5: [
    {
      id: "m5-pre-2",
      text: "What does MDT stand for in the context of child abuse investigations?",
      options: [
        "Medical Diagnostic Team",
        "Multidisciplinary Team",
        "Mandatory Duty Training",
        "Municipal Detective Taskforce",
      ],
      correctIndex: 1,
      explanation:
        "MDT stands for Multidisciplinary Team \u2014 a coordinated group of professionals from different agencies (law enforcement, CPS, prosecution, medical, mental health, victim advocacy) who collaborate on child abuse investigations to improve outcomes and reduce trauma to the child.",
      citations: [
        "Cross, T. P., Jones, L. M., Walsh, W. A., Simone, M., & Kolko, D. (2007). Child forensic interviewing in Children\u2019s Advocacy Centers: Empirical data on a practice model. Child Abuse & Neglect, 31(10), 1031\u20131052.",
      ],
    },
    {
      id: "m5-pre-3",
      text: "What is the primary advantage of conducting child abuse investigations through a CAC/MDT model versus parallel, uncoordinated investigations?",
      options: [
        "It is cheaper",
        "It reduces the number of times a child must be interviewed, improves information sharing, and coordinates services",
        "It eliminates the need for court proceedings",
        "It allows families to avoid investigations entirely",
      ],
      correctIndex: 1,
      explanation:
        "The CAC/MDT model\u2019s primary advantage is coordination: the child is interviewed once by a trained forensic interviewer (observed by team members), reducing re-traumatization and inconsistencies. Team members share information in real-time, coordinate protective and legal actions, and ensure the child receives needed services.",
      citations: [
        "Herbert, J. L., & Bromfield, L. (2016). Evidence for the efficacy of the Child Advocacy Center model: A systematic review. Trauma, Violence, & Abuse, 17(3), 341\u2013357.",
      ],
    },
    {
      id: "m5-pre-4",
      text: "Which of the following professionals is typically NOT part of a standard MDT?",
      options: [
        "Law enforcement detective",
        "Child protective services investigator",
        "Victim advocate",
        "Real estate agent",
      ],
      correctIndex: 3,
      explanation:
        "A standard MDT typically includes law enforcement, CPS/DFCS investigators, prosecutors, forensic interviewers, medical professionals, mental health professionals, victim advocates, and sometimes school personnel. Real estate agents have no role in child abuse investigations.",
      citations: [
        "National Children\u2019s Alliance. (2017). Standards for accredited members. Washington, DC: NCA.",
      ],
    },
    {
      id: "m5-pre-5",
      text: "What is a case review in the MDT process?",
      options: [
        "A public trial",
        "A confidential meeting where team members discuss case progress, share information, and coordinate next steps",
        "An online survey about case outcomes",
        "A meeting between the suspect and the victim",
      ],
      correctIndex: 1,
      explanation:
        "MDT case reviews are confidential meetings where team members share investigation findings, discuss the child\u2019s safety and needs, coordinate interventions, and plan next steps. Regular case reviews ensure that no information falls through the cracks and that the child\u2019s needs are being addressed across all systems.",
      citations: [
        "Cross, T. P., et al. (2007). Child forensic interviewing in Children\u2019s Advocacy Centers. Child Abuse & Neglect, 31(10), 1031\u20131052.",
      ],
    },
    {
      id: "m5-pre-6",
      text: "What role does a victim advocate play on the MDT?",
      options: [
        "They prosecute the case in court",
        "They provide emotional support, information about the process, and connect the child/family with services",
        "They conduct the forensic interview",
        "They make the final decision about whether to press charges",
      ],
      correctIndex: 1,
      explanation:
        "Victim advocates provide non-clinical emotional support to the child and non-offending family members, explain the investigation and legal process, connect families with community resources (counseling, financial assistance, safety planning), and accompany families through court proceedings.",
      citations: [
        "National Children\u2019s Alliance. (2017). Standards for accredited members. Washington, DC: NCA.",
      ],
    },
    {
      id: "m5-pre-7",
      text: "What is the concept of 'parallel investigations' in child abuse cases?",
      options: [
        "Two separate investigations of different cases",
        "The simultaneous but coordinated criminal (law enforcement) and civil (CPS) investigations into the same allegations",
        "An appeal process",
        "A backup investigation in case the first one fails",
      ],
      correctIndex: 1,
      explanation:
        "Parallel investigations refer to the simultaneous criminal investigation (led by law enforcement, focused on prosecution) and civil investigation (led by CPS, focused on child protection) of the same abuse allegations. The MDT model coordinates these parallel tracks to avoid conflicts, share information appropriately, and serve both the child protection and justice goals.",
      citations: [
        "Cross, T. P., Finkelhor, D., & Ormrod, R. (2005). Police involvement in child protective services investigations. Child Maltreatment, 10(3), 224\u2013244.",
      ],
    },
    {
      id: "m5-pre-8",
      text: "What is an information-sharing protocol (ISP) and why is it important for MDTs?",
      options: [
        "A social media policy for investigators",
        "A formal agreement governing what information team members can share, with whom, and under what circumstances",
        "A computer software program",
        "A standardized interview questionnaire",
      ],
      correctIndex: 1,
      explanation:
        "An ISP is a formal, often written agreement among MDT member agencies that specifies what case information can be shared, with whom, under what circumstances, and what confidentiality protections apply. ISPs are essential because team members from different agencies operate under different confidentiality laws and regulations.",
      citations: [
        "National Children\u2019s Alliance. (2017). Standards for accredited members. Washington, DC: NCA.",
      ],
    },
    {
      id: "m5-pre-9",
      text: "How does interagency conflict most commonly undermine child abuse investigations?",
      options: [
        "By making investigations more expensive",
        "By creating information silos, conflicting actions, and gaps in child protection that a perpetrator can exploit",
        "By generating too much paperwork",
        "Interagency conflict never affects investigations",
      ],
      correctIndex: 1,
      explanation:
        "When agencies do not coordinate \u2014 or actively conflict \u2014 information silos develop (one agency has critical information another doesn\u2019t), conflicting actions may occur (CPS contacts the family before law enforcement can interview the suspect), and gaps in protection emerge. These failures can be exploited by perpetrators and endanger children.",
      citations: [
        "Lalayants, M., & Epstein, I. (2005). Exploring CPS decision making with assisted qualitative content analysis. Child Welfare, 84(5), 765\u2013790.",
      ],
    },
    {
      id: "m5-pre-10",
      text: "What is the National Children\u2019s Alliance (NCA)?",
      options: [
        "A federal law enforcement agency",
        "The national membership and accrediting body for Children\u2019s Advocacy Centers in the United States",
        "A children\u2019s hospital network",
        "A political advocacy organization for children\u2019s rights legislation",
      ],
      correctIndex: 1,
      explanation:
        "The National Children\u2019s Alliance is the national association and accrediting body for over 900 Children\u2019s Advocacy Centers in the United States. NCA sets accreditation standards for CACs covering forensic interviews, victim advocacy, medical evaluation, mental health services, case review, and MDT coordination.",
      citations: [
        "National Children\u2019s Alliance. (2017). Standards for accredited members. Washington, DC: NCA.",
      ],
    },
  ],

  // ─── Module 6: needs 9 more (currently has 1) ───
  6: [
    {
      id: "m6-pre-2",
      text: "What is the difference between 'compassion fatigue' and 'burnout'?",
      options: [
        "They are identical concepts",
        "Compassion fatigue is caused by exposure to others\u2019 trauma; burnout results from chronic workplace stressors like workload, bureaucracy, and lack of control",
        "Burnout only affects managers",
        "Compassion fatigue only affects medical professionals",
      ],
      correctIndex: 1,
      explanation:
        "While often used interchangeably, compassion fatigue (including secondary traumatic stress) is specifically caused by exposure to the suffering and trauma of others. Burnout is a broader occupational phenomenon resulting from chronic workplace stressors. A professional can experience both simultaneously.",
      citations: [
        "Figley, C. R. (1995). Compassion fatigue: Coping with secondary traumatic stress disorder in those who treat the traumatized. Brunner/Mazel.",
        "Maslach, C., & Leiter, M. P. (2016). Understanding the burnout experience: Recent research and its implications for psychiatry. World Psychiatry, 15(2), 103\u2013111.",
      ],
    },
    {
      id: "m6-pre-3",
      text: "What is the Professional Quality of Life (ProQOL) scale?",
      options: [
        "A salary ranking system for child welfare workers",
        "A validated self-assessment tool measuring compassion satisfaction, burnout, and secondary traumatic stress",
        "A workplace safety checklist",
        "A client satisfaction survey",
      ],
      correctIndex: 1,
      explanation:
        "The ProQOL (developed by Beth Hudnall Stamm) is the most commonly used measure of the positive and negative aspects of helping. It has three subscales: Compassion Satisfaction (positive), Burnout (negative), and Secondary Traumatic Stress (negative). It is widely used in child welfare, healthcare, and emergency services.",
      citations: [
        "Stamm, B. H. (2010). The Concise ProQOL Manual (2nd ed.). Pocatello, ID: ProQOL.org.",
      ],
    },
    {
      id: "m6-pre-4",
      text: "Which of the following is a common physical symptom of secondary traumatic stress?",
      options: [
        "Increased appetite and weight gain only",
        "Sleep disturbances, headaches, gastrointestinal problems, and increased startle response",
        "Improved physical fitness",
        "No physical symptoms \u2014 STS only affects emotions",
      ],
      correctIndex: 1,
      explanation:
        "Secondary traumatic stress produces physiological symptoms similar to PTSD: sleep disturbances (insomnia, nightmares), hyperarousal (increased startle response, hypervigilance), somatic complaints (headaches, GI problems, muscle tension), and fatigue. The body responds to vicarious exposure much as it responds to direct exposure.",
      citations: [
        "Bride, B. E. (2007). Prevalence of secondary traumatic stress among social workers. Social Work, 52(1), 63\u201370.",
      ],
    },
    {
      id: "m6-pre-5",
      text: "What is 'compassion satisfaction'?",
      options: [
        "A bonus paid to social workers",
        "The pleasure and fulfillment derived from doing one\u2019s work well and helping others",
        "A legal protection for mandated reporters",
        "A type of employee benefit",
      ],
      correctIndex: 1,
      explanation:
        "Compassion satisfaction is the positive dimension of professional quality of life \u2014 the sense of pleasure, fulfillment, and meaning derived from helping others. Research shows that compassion satisfaction can serve as a protective factor against burnout and secondary traumatic stress.",
      citations: [
        "Stamm, B. H. (2010). The Concise ProQOL Manual (2nd ed.). Pocatello, ID: ProQOL.org.",
        "Conrad, D., & Kellar-Guenther, Y. (2006). Compassion fatigue, burnout, and compassion satisfaction among Colorado child protection workers. Child Abuse & Neglect, 30(10), 1071\u20131080.",
      ],
    },
    {
      id: "m6-pre-6",
      text: "What organizational factor has been shown to be the strongest predictor of secondary trauma resilience in child welfare workers?",
      options: [
        "Higher salary",
        "Shorter work weeks",
        "Supportive supervision and organizational culture that acknowledges the emotional impact of the work",
        "Working alone without team interactions",
      ],
      correctIndex: 2,
      explanation:
        "Research consistently identifies supportive supervision \u2014 where supervisors acknowledge the emotional impact of the work, provide reflective space, and model healthy coping \u2014 as the strongest organizational predictor of resilience. Organizational culture that normalizes the emotional toll and provides structural supports (debriefing, manageable caseloads) is protective.",
      citations: [
        "Bride, B. E., Jones, J. L., & MacMaster, S. A. (2007). Correlates of secondary traumatic stress in child protective services workers. Journal of Evidence-Based Social Work, 4(3\u20134), 69\u201380.",
        "Salloum, A., Kondrat, D. C., Johnco, C., & Olson, K. R. (2015). The role of self-care on compassion satisfaction, burnout, and secondary trauma among child welfare workers. Children and Youth Services Review, 49, 54\u201361.",
      ],
    },
    {
      id: "m6-pre-7",
      text: "What is 'vicarious post-traumatic growth'?",
      options: [
        "A negative outcome of trauma exposure",
        "Positive psychological change experienced by professionals as a result of working with trauma survivors",
        "Physical growth caused by stress hormones",
        "A type of performance evaluation",
      ],
      correctIndex: 1,
      explanation:
        "Vicarious post-traumatic growth refers to the positive psychological changes that can emerge from working with trauma survivors \u2014 including greater appreciation for life, enhanced personal relationships, increased sense of personal strength, recognition of new possibilities, and spiritual/existential development.",
      citations: [
        "Arnold, D., Calhoun, L. G., Tedeschi, R., & Cann, A. (2005). Vicarious posttraumatic growth in psychotherapy. Journal of Humanistic Psychology, 45(2), 239\u2013263.",
      ],
    },
    {
      id: "m6-pre-8",
      text: "Which self-care strategy is most evidence-based for preventing secondary traumatic stress?",
      options: [
        "Avoiding all contact with clients",
        "A comprehensive approach combining personal self-care, professional boundaries, peer support, and organizational practices",
        "Working more hours to feel productive",
        "Compartmentalizing emotions completely",
      ],
      correctIndex: 1,
      explanation:
        "Research supports a multi-level approach to STS prevention: personal self-care (exercise, sleep, mindfulness), professional strategies (case variety, boundaries, reflective practice), peer support (debriefing, consultation), and organizational practices (manageable caseloads, supportive supervision, access to EAP). No single strategy is sufficient alone.",
      citations: [
        "Newell, J. M., & MacNeil, G. A. (2010). Professional burnout, vicarious trauma, secondary traumatic stress, and compassion fatigue: A review of theoretical terms, risk factors, and preventive methods for clinicians and researchers. Best Practices in Mental Health, 6(2), 57\u201368.",
      ],
    },
    {
      id: "m6-pre-9",
      text: "What is a 'critical incident stress debriefing' (CISD)?",
      options: [
        "A criminal investigation review",
        "A structured group discussion conducted after a particularly distressing case or event to process emotional reactions",
        "A performance improvement plan",
        "A legal proceeding",
      ],
      correctIndex: 1,
      explanation:
        "CISD is a structured group intervention typically conducted 24\u201372 hours after a critical incident (such as a child fatality or particularly disturbing case). It provides a facilitated space for professionals to process their emotional reactions, normalize their responses, and identify individuals who may need additional support.",
      citations: [
        "Mitchell, J. T. (1983). When disaster strikes: The critical incident stress debriefing process. Journal of Emergency Medical Services, 8(1), 36\u201339.",
      ],
    },
    {
      id: "m6-pre-10",
      text: "What does the concept of 'trauma stewardship' emphasize for professionals in child welfare?",
      options: [
        "Maximizing the number of cases handled per month",
        "A daily practice of mindful awareness about how trauma exposure affects you, and making intentional choices to sustain your capacity to serve",
        "Delegating all difficult cases to newer employees",
        "Avoiding emotional connection with clients",
      ],
      correctIndex: 1,
      explanation:
        "Trauma stewardship (coined by Laura van Dernoot Lipsky) emphasizes ongoing, mindful awareness of how bearing witness to suffering affects you \u2014 and making intentional, daily choices to sustain your health, perspective, and capacity to contribute. It reframes self-care not as selfish but as an ethical obligation to clients and colleagues.",
      citations: [
        "van Dernoot Lipsky, L., & Burk, C. (2009). Trauma stewardship: An everyday guide for caring for self while caring for others. Berrett-Koehler Publishers.",
      ],
    },
  ],

  // ─── Module 7: needs 7 more (currently has 3) ───
  7: [
    {
      id: "m7-pre-4",
      text: "Under Georgia law, does the therapist-patient privilege excuse a psychologist from reporting suspected child abuse?",
      options: [
        "Yes \u2014 all therapy communications are privileged",
        "No \u2014 O.C.G.A. \u00A7 19-7-5 explicitly overrides privileged communication for mandated reporters",
        "Only if the therapist believes the report would harm the therapeutic relationship",
        "Only if the child is over 16 years old",
      ],
      correctIndex: 1,
      explanation:
        "Georgia law (O.C.G.A. \u00A7 19-7-5) explicitly states that the mandated reporting obligation overrides privileged communications for most designated reporter categories. Psychologists, counselors, and social workers cannot rely on therapist-patient privilege to avoid reporting suspected child abuse. The protection of the child takes precedence.",
      citations: [
        "O.C.G.A. \u00A7 19-7-5 (Georgia Mandated Reporting Statute)",
        "Kalichman, S. C. (1999). Mandated reporting of suspected child abuse: Ethics, law, & policy (2nd ed.). American Psychological Association.",
      ],
    },
    {
      id: "m7-pre-5",
      text: "What is the time frame for reporting suspected child abuse in Georgia?",
      options: [
        "Within 30 days",
        "Within 7 business days",
        "Within 24 hours of developing reasonable cause to believe",
        "There is no specific time frame",
      ],
      correctIndex: 2,
      explanation:
        "Georgia law requires mandated reporters to make a report within 24 hours of having reasonable cause to believe that a child has been abused. The report should be made to DFCS (1-855-GACHILD) or local law enforcement. Many organizations also require a written follow-up report.",
      citations: [
        "O.C.G.A. \u00A7 19-7-5",
        "Georgia Division of Family and Children Services (DFCS) reporting procedures",
      ],
    },
    {
      id: "m7-pre-6",
      text: "A mandated reporter tells their supervisor about suspected abuse, and the supervisor says they will handle the report. Has the mandated reporter fulfilled their legal obligation?",
      options: [
        "Yes \u2014 telling your supervisor is sufficient",
        "No \u2014 unless the reporter confirms that a report was actually made to DFCS or law enforcement, their personal legal obligation is not satisfied",
        "Only if the supervisor is also a mandated reporter",
        "Yes \u2014 as long as it is documented in an internal memo",
      ],
      correctIndex: 1,
      explanation:
        "The mandated reporting obligation under O.C.G.A. \u00A7 19-7-5 is personal to the individual reporter. While informing a supervisor is good organizational practice, the reporter must ensure that an actual report is made to DFCS or law enforcement. If the supervisor fails to follow through, the original reporter remains legally liable.",
      citations: [
        "O.C.G.A. \u00A7 19-7-5",
        "Alvarez, K. M., Kenny, M. C., Donohue, B., & Carpin, K. M. (2004). Why are professionals failing to initiate mandated reports of child maltreatment, and are there any empirically based training programs to assist professionals in the reporting process? Aggression and Violent Behavior, 9(5), 563\u2013578.",
      ],
    },
    {
      id: "m7-pre-7",
      text: "Which of the following is NOT a recognized category of child abuse under Georgia law (O.C.G.A. \u00A7 19-15-1)?",
      options: [
        "Physical abuse",
        "Sexual abuse",
        "Emotional abuse",
        "Academic underperformance",
      ],
      correctIndex: 3,
      explanation:
        "Georgia law (O.C.G.A. \u00A7 19-15-1) defines child abuse to include physical injury or death, neglect (including failure to provide adequate care), sexual abuse and exploitation, and emotional abuse. Academic underperformance is NOT a category of abuse, though it may be a behavioral indicator of underlying issues that warrant attention.",
      citations: [
        "O.C.G.A. \u00A7 19-15-1(3) (Georgia definition of child abuse)",
      ],
    },
    {
      id: "m7-pre-8",
      text: "What does 'good-faith immunity' mean for mandated reporters in Georgia?",
      options: [
        "Reporters can never be wrong about their reports",
        "Reporters who act on genuine concern are protected from civil and criminal liability, even if the investigation does not substantiate abuse",
        "Reporters are immune from all laws while on duty",
        "Only government employees receive immunity",
      ],
      correctIndex: 1,
      explanation:
        "Good-faith immunity under O.C.G.A. \u00A7 19-7-5(g) means that a mandated reporter who makes a report based on genuine concern for a child\u2019s welfare is protected from civil lawsuits and criminal charges, even if the subsequent investigation does not find evidence of abuse. The protection requires that the report was not made maliciously or with reckless disregard for the truth.",
      citations: [
        "O.C.G.A. \u00A7 19-7-5(g)",
        "Kalichman, S. C. (1999). Mandated reporting of suspected child abuse: Ethics, law, & policy. American Psychological Association.",
      ],
    },
    {
      id: "m7-pre-9",
      text: "In Georgia, what is the DFCS response timeframe for an emergency report of child abuse?",
      options: [
        "Within 72 hours",
        "Within 24 hours",
        "Within 5 business days",
        "Within 30 days",
      ],
      correctIndex: 1,
      explanation:
        "Georgia DFCS must screen and begin responding to emergency reports within 24 hours. Standard (non-emergency) investigations must begin within 5 business days. The classification as emergency vs. standard depends on the level of immediate danger to the child as assessed during the intake screening.",
      citations: [
        "Georgia Division of Family and Children Services (DFCS) Policy Manual",
        "O.C.G.A. \u00A7 49-5-41",
      ],
    },
    {
      id: "m7-pre-10",
      text: "A teacher notices a pattern of suspicious injuries on a student but hesitates to report because she is 'not 100% sure it\u2019s abuse.' Under Georgia law, what should she do?",
      options: [
        "Wait until she is certain before reporting",
        "Conduct her own investigation to gather more evidence",
        "Report to DFCS based on reasonable cause to believe \u2014 certainty is not required",
        "Ask the child\u2019s parents for an explanation before deciding",
      ],
      correctIndex: 2,
      explanation:
        "The legal standard under O.C.G.A. \u00A7 19-7-5 is \u2018reasonable cause to believe,\u2019 not certainty. A pattern of suspicious injuries is sufficient to meet this threshold. The mandated reporter\u2019s role is to report, not to investigate or substantiate. Waiting for certainty may leave a child in danger. Asking parents may alert a potential abuser.",
      citations: [
        "O.C.G.A. \u00A7 19-7-5",
        "Levi, B. H., & Crowell, K. (2011). Child abuse experts disagree about the threshold for mandated reporting. Clinical Pediatrics, 50(4), 321\u2013329.",
      ],
    },
  ],
};
