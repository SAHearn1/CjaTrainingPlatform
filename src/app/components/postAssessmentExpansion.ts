/**
 * Additional post-assessment (competency evaluation) questions to expand each module to 10 questions.
 * These are merged into MODULES in data.ts.
 * Post-assessment questions are APPLICATION-LEVEL — they test the learner's ability to apply concepts,
 * not just recall definitions (higher on Bloom's taxonomy than the pre-assessment).
 */
import type { Question } from "./data";

export const EXTRA_POST_QUESTIONS: Record<number, Question[]> = {
  // ─── Module 1: needs 5 more (currently has 5) ───
  1: [
    {
      id: "m1-post-6",
      text: "A 6-year-old in a forensic interview sits rigidly, avoids eye contact, and gives monosyllabic answers. Using the window of tolerance framework, what is the most appropriate interpretation and response?",
      options: [
        "The child is being defiant and needs firmer questioning",
        "The child is likely in hypoarousal (below the window of tolerance) and needs grounding, safety cues, and a pause before continuing",
        "The child has nothing to disclose and the interview should end immediately",
        "The child is manipulating the interviewer to avoid answering",
      ],
      correctIndex: 1,
      explanation:
        "Rigid posture, gaze avoidance, and monosyllabic responses are hallmarks of hypoarousal — a freeze/shutdown state below the window of tolerance. The child's nervous system has moved into a protective mode. The appropriate trauma-informed response is to pause, provide grounding (sensory anchors, calm voice), establish safety, and allow the child to return to their window of tolerance before continuing.",
      citations: [
        "Siegel, D. J. (1999). The developing mind: How relationships and the brain interact to shape who we are. Guilford Press.",
        "Ogden, P., Minton, K., & Pain, C. (2006). Trauma and the body: A sensorimotor approach to psychotherapy. W. W. Norton.",
      ],
    },
    {
      id: "m1-post-7",
      text: "A CPS investigator with an ACE score of 6 recognizes that reviewing a case involving parental substance abuse triggers intense personal memories. Using the TRACE cycle, what is the optimal professional response?",
      options: [
        "Immediately recuse themselves from all substance abuse cases permanently",
        "Use the Appraisal phase to evaluate whether their emotional response is impairing their professional judgment, implement a regulation strategy, and make a conscious Choice about how to proceed — seeking supervision if needed",
        "Suppress the memories and continue working as though nothing happened",
        "File a complaint about being assigned triggering cases",
      ],
      correctIndex: 1,
      explanation:
        "The TRACE cycle provides a structured path: the investigator has already recognized the Trigger and their emotional Response. The Appraisal phase asks: 'Is my judgment being affected?' From this conscious appraisal, they make a Choice — which may include using a regulation technique (breathing, grounding), seeking supervisory consultation, or requesting case transfer if the impairment is significant. The key is conscious, reflective decision-making rather than avoidance or suppression.",
      citations: [
        "Lazarus, R. S., & Folkman, S. (1984). Stress, appraisal, and coping. Springer.",
        "Bride, B. E., Radey, M., & Figley, C. R. (2007). Measuring compassion fatigue. Clinical Social Work Journal, 35(3), 155–163.",
      ],
    },
    {
      id: "m1-post-8",
      text: "Research by Felitti & Anda demonstrated a dose-response relationship between ACEs and adult health outcomes. What does this mean for child abuse investigators assessing a family?",
      options: [
        "Families with higher ACE scores should automatically lose custody",
        "Understanding that caregivers with high ACE histories may themselves be operating from a trauma response — informing how investigators approach the family while still prioritizing child safety",
        "ACE scores should be used as evidence in court proceedings",
        "Only families with zero ACEs are safe for children",
      ],
      correctIndex: 1,
      explanation:
        "The dose-response relationship means more ACE categories = higher risk of negative outcomes (substance abuse, mental health challenges, impaired parenting). For investigators, this means understanding that a parent's harmful behavior may itself be rooted in unresolved trauma — which informs HOW the investigator approaches the family (with empathy and connection to services) while never compromising the primary duty to protect the child.",
      citations: [
        "Felitti, V. J., et al. (1998). Relationship of childhood abuse and household dysfunction to many of the leading causes of death in adults. American Journal of Preventive Medicine, 14(4), 245–258.",
      ],
    },
    {
      id: "m1-post-9",
      text: "A toddler in foster care shows indiscriminate friendliness toward strangers, approaching and hugging unfamiliar adults. Which attachment pattern does this most likely reflect, and what does it suggest?",
      options: [
        "Secure attachment — the child is naturally sociable",
        "Disinhibited social engagement consistent with disrupted attachment, often seen in children who experienced early neglect or multiple caregiver changes",
        "Avoidant attachment — the child is avoiding their primary caregiver",
        "The child is simply well-adjusted to new environments",
      ],
      correctIndex: 1,
      explanation:
        "Indiscriminate friendliness / disinhibited social engagement is a recognized pattern in children who have experienced early neglect, institutional care, or multiple placement changes. The child has learned that no single caregiver is reliably available, so they approach all adults equally. This is NOT a sign of good adjustment — it reflects disrupted attachment and is classified as Disinhibited Social Engagement Disorder in the DSM-5.",
      citations: [
        "Zeanah, C. H., & Gleason, M. M. (2015). Annual research review: Attachment disorders in early childhood. Journal of Child Psychology and Psychiatry, 56(3), 207–222.",
        "American Psychiatric Association. (2013). Diagnostic and statistical manual of mental disorders (5th ed.).",
      ],
    },
    {
      id: "m1-post-10",
      text: "How does toxic stress differ from tolerable stress in its impact on a child's developing brain, and why is this distinction important for investigators?",
      options: [
        "There is no meaningful difference — all stress is harmful to children",
        "Toxic stress (prolonged, without buffering adult support) disrupts brain architecture and stress response systems, while tolerable stress (time-limited, with adult support) can actually strengthen coping. Investigators must assess whether the child has ANY supportive adult relationships as a protective factor.",
        "Tolerable stress only occurs in school settings",
        "Toxic stress only occurs in cases of physical abuse, not neglect",
      ],
      correctIndex: 1,
      explanation:
        "The distinction is critical for case assessment. Tolerable stress (e.g., a parental divorce with a supportive grandparent present) activates the stress response but is buffered by a caring adult, allowing recovery. Toxic stress (chronic abuse without any protective relationship) causes sustained cortisol elevation, disrupts neural pathways, and impairs brain development. Investigators assessing risk must evaluate not just the abuse itself but the presence or absence of buffering relationships.",
      citations: [
        "National Scientific Council on the Developing Child. (2005/2014). Excessive stress disrupts the architecture of the developing brain. Harvard University Center on the Developing Child.",
        "Shonkoff, J. P., et al. (2012). The lifelong effects of early childhood adversity and toxic stress. Pediatrics, 129(1), e232–e246.",
      ],
    },
  ],

  // ─── Module 2: needs 7 more (currently has 3) ───
  2: [
    {
      id: "m2-post-4",
      text: "During a forensic interview, a 5-year-old says, 'Daddy does bad things at nighttime.' What is the most appropriate follow-up question?",
      options: [
        "'Does Daddy hit you at night?'",
        "'Tell me more about what happens at nighttime.'",
        "'Did Daddy touch you in a bad way?'",
        "'Does Daddy drink alcohol at night?'",
      ],
      correctIndex: 1,
      explanation:
        "The open-ended prompt 'Tell me more about what happens at nighttime' follows the NICHD Protocol's hierarchy: always start with invitations before moving to more focused questions. The other options are leading — they introduce specific concepts (hitting, touching, alcohol) that the child did not mention, potentially contaminating the account.",
      citations: [
        "Lamb, M. E., et al. (2007). A structured forensic interview protocol improves the quality and informativeness of investigative interviews with children. Child Abuse & Neglect, 31(11–12), 1201–1231.",
      ],
    },
    {
      id: "m2-post-5",
      text: "An 8-year-old begins to disclose sexual abuse but then stops and says, 'Never mind, I made it up.' Research on disclosure patterns suggests this most likely represents:",
      options: [
        "Proof that the child was lying and no abuse occurred",
        "Recantation — a well-documented phase of the disclosure process often driven by fear, loyalty, or pressure, which does NOT necessarily mean the original disclosure was false",
        "The child testing the interviewer's reaction",
        "A sign that the interview was conducted improperly",
      ],
      correctIndex: 1,
      explanation:
        "Recantation is a well-documented phenomenon in child abuse disclosure research. Summit's Child Sexual Abuse Accommodation Syndrome (CSAAS) identified recantation as a common phase, and subsequent research has confirmed that children often retract genuine disclosures due to fear of consequences, family pressure, guilt, or the desire to restore normalcy. Recantation alone should NOT be treated as proof that abuse did not occur.",
      citations: [
        "Summit, R. C. (1983). The child sexual abuse accommodation syndrome. Child Abuse & Neglect, 7(2), 177–193.",
        "Malloy, L. C., Lyon, T. D., & Quas, J. A. (2007). Filial dependency and recantation of child sexual abuse allegations. Journal of the American Academy of Child & Adolescent Psychiatry, 46(2), 162–170.",
      ],
    },
    {
      id: "m2-post-6",
      text: "You are interviewing a 4-year-old who cannot tell you what day of the week the abuse happened. Why is this expected, and how should you handle it?",
      options: [
        "The child is being evasive and should be pressed for specifics",
        "Young children lack mature temporal concepts; use developmental anchors like 'Was it a school day or a stay-home day?' or 'Was it light outside or dark?'",
        "The inability to provide dates means the testimony is unreliable",
        "You should suggest specific dates to help the child remember",
      ],
      correctIndex: 1,
      explanation:
        "Children under 7-8 typically cannot reliably use calendar concepts (days of the week, dates, months). This is a normal developmental limitation, not evidence of fabrication. Evidence-based practice uses developmental anchors — linking events to the child's routine (before/after school, before/after dinner, light/dark outside) — to help locate events in time without suggesting specific answers.",
      citations: [
        "Saywitz, K. J., & Camparo, L. (1998). Interviewing child witnesses: A developmental perspective. Child Abuse & Neglect, 22(8), 825–843.",
        "Friedman, W. J. (2000). The development of children's knowledge of the times of future events. Child Development, 71(4), 913–932.",
      ],
    },
    {
      id: "m2-post-7",
      text: "An interviewer asks a 6-year-old, 'Your teacher told me that something bad happened to you. Can you tell me about that?' What is wrong with this approach?",
      options: [
        "Nothing — it provides helpful context",
        "It is a source attribution statement that communicates the interviewer already has information and expects a particular narrative, potentially biasing the child's response",
        "The child is too young to understand references to their teacher",
        "It should have been phrased as a yes/no question instead",
      ],
      correctIndex: 1,
      explanation:
        "This question commits multiple protocol violations: it attributes information to an authority figure (the teacher), introduces the label 'something bad' (presupposing a negative event), and communicates that the interviewer already has expectations. This creates demand characteristics — the child may feel compelled to confirm or elaborate on what they believe the interviewer already knows, rather than providing their own free narrative.",
      citations: [
        "Ceci, S. J., & Bruck, M. (1995). Jeopardy in the courtroom: A scientific analysis of children's testimony. APA.",
        "Lyon, T. D. (2014). Interviewing children. Annual Review of Law and Social Science, 10, 73–89.",
      ],
    },
    {
      id: "m2-post-8",
      text: "A detective interviews a child at the scene, then CPS interviews the child at the office, then a forensic interviewer conducts a third interview at the CAC. What problem does this create?",
      options: [
        "Three interviews always produce more accurate testimony than one",
        "Multiple interviews increase the risk of suggestion, memory contamination, inconsistencies that defense attorneys can exploit, and re-traumatization of the child",
        "Multiple interviews are required by federal law",
        "Each additional interview improves the child's confidence in testifying",
      ],
      correctIndex: 1,
      explanation:
        "Multiple interviews create compounding risks: each interview may introduce different suggestive cues; the child may incorporate post-event information from earlier interviewers; inconsistencies across interviews become ammunition for defense attorneys; and repeatedly recounting trauma re-traumatizes the child. The CAC/MDT model was specifically designed to reduce this problem through a single, well-conducted forensic interview observed by all team members.",
      citations: [
        "La Rooy, D., Lamb, M. E., & Pipe, M. E. (2009). Repeated interviewing: A critical evaluation of the risks and potential benefits. In K. Kuehnle & M. Connell (Eds.), The evaluation of child sexual abuse allegations. Wiley.",
      ],
    },
    {
      id: "m2-post-9",
      text: "During the rapport-building phase, you ask a child to tell you about their last birthday party. What is the purpose of this narrative practice exercise?",
      options: [
        "To gather intelligence about the family",
        "To assess the child's narrative ability, establish the expectation of providing detailed accounts, and create comfort with the interview format before addressing substantive topics",
        "To evaluate whether the child is truthful",
        "To fill time while equipment is set up",
      ],
      correctIndex: 1,
      explanation:
        "Narrative practice with a neutral topic (birthday party, favorite game, recent event) serves multiple evidence-based purposes: it assesses the child's developmental level and narrative capacity; it establishes the expectation that the child should provide detailed, elaborative responses (not just yes/no); it creates comfort with the conversational format; and it gives the interviewer data about the child's vocabulary and temporal understanding.",
      citations: [
        "Hershkowitz, I. (2011). Rapport building in investigative interviews of children. In M. E. Lamb et al. (Eds.), Children's testimony (2nd ed., pp. 109–128). Wiley.",
        "Roberts, K. P., Brubacher, S. P., Powell, M. B., & Price, H. L. (2011). Practice narratives. In M. E. Lamb et al. (Eds.), Children's testimony (2nd ed.). Wiley.",
      ],
    },
    {
      id: "m2-post-10",
      text: "A forensic interviewer notices that a 10-year-old uses the word 'inappropriate' multiple times when describing what happened. What should the interviewer consider?",
      options: [
        "The child is well-spoken and should be praised",
        "The word 'inappropriate' is an adult-sourced label that may indicate coaching or that someone has already characterized the events for the child; the interviewer should ask the child to explain what they mean using their own words",
        "'Inappropriate' is a normal word for a 10-year-old",
        "The interviewer should also use the word 'inappropriate' to build rapport",
      ],
      correctIndex: 1,
      explanation:
        "When a child uses adult-sourced language (e.g., 'inappropriate,' 'molested,' 'violated'), it may indicate that another adult has already characterized the events for the child, potentially through coaching or well-intentioned but contaminating conversations. The interviewer should note the language and ask the child to explain in their own words: 'You said inappropriate — tell me what you mean by that.' This clarifies whether the child understands the term and can describe the actual events in their own language.",
      citations: [
        "Lamb, M. E., et al. (2007). A structured forensic interview protocol. Child Abuse & Neglect, 31(11–12), 1201–1231.",
        "Myers, J. E. B. (2005). Myers on evidence in child, domestic, and elder abuse cases. Aspen.",
      ],
    },
  ],

  // ─── Module 3: needs 7 more (currently has 3) ───
  3: [
    {
      id: "m3-post-4",
      text: "During a forensic interview, you discover that the child has an IEP for a speech-language impairment. How should this affect your interview approach?",
      options: [
        "Cancel the interview — children with speech impairments cannot provide reliable testimony",
        "Consult the child's SLP or IEP team (without revealing case details) to understand the child's communication profile, adjust your language complexity, allow extra processing time, and consider whether assistive communication tools are needed",
        "Conduct the interview exactly as you would with any other child",
        "Have the child's parent interpret for them during the interview",
      ],
      correctIndex: 1,
      explanation:
        "An IEP for speech-language impairment requires interview adaptations but does NOT disqualify the child as a witness. Best practice includes consulting the SLP (without revealing case specifics) to understand receptive vs. expressive language levels, using simpler sentence structures, allowing longer response times, potentially using visual supports or AAC devices, and documenting the accommodations provided.",
      citations: [
        "Hershkowitz, I., Lamb, M. E., & Horowitz, D. (2007). Victimization of children with disabilities. American Journal of Orthopsychiatry, 77(4), 629–635.",
        "Cederborg, A.-C., & Lamb, M. E. (2008). Interviewing alleged victims with intellectual disabilities. Journal of Intellectual Disability Research, 52(1), 49–58.",
      ],
    },
    {
      id: "m3-post-5",
      text: "A judge notices that a child witness with autism spectrum disorder avoids eye contact and gives flat, monotone responses during testimony. How should the judge interpret this?",
      options: [
        "The child is lying because they won't make eye contact",
        "The child's flat affect and gaze avoidance are characteristic of ASD and should NOT be interpreted as indicators of dishonesty or lack of credibility",
        "The child is too impaired to testify and should be dismissed",
        "The judge should require the child to make eye contact",
      ],
      correctIndex: 1,
      explanation:
        "Gaze avoidance and flat affect are core features of autism spectrum disorder, not indicators of dishonesty. Interpreting these behaviors as signs of lying reflects diagnostic overshadowing. Courts must be educated about how disability-related behaviors differ from deception indicators. The ADA requires reasonable accommodations — which may include allowing the child to testify without eye contact expectations.",
      citations: [
        "Westcott, H. L., & Jones, D. P. H. (1999). Annotation: The abuse of disabled children. Journal of Child Psychology and Psychiatry, 40(4), 497–506.",
        "Americans with Disabilities Act of 1990, Title II.",
      ],
    },
    {
      id: "m3-post-6",
      text: "A child protective investigator is assessing a family where the mother has an intellectual disability. The mother loves her children but struggles with safety routines. What is the most appropriate approach?",
      options: [
        "Immediately remove the children — parents with intellectual disabilities cannot safely parent",
        "Assess the specific parenting capacity (not just IQ), connect the family with parenting support services adapted for parents with cognitive disabilities, and monitor while preserving the family unit when safe to do so",
        "Lower the standard of care expected for this family",
        "Only assess the father's parenting capacity instead",
      ],
      correctIndex: 1,
      explanation:
        "The National Council on Disability (2012) found that parents with disabilities are disproportionately subject to child removal despite evidence that with appropriate supports, many can parent safely. Assessment must focus on specific, observable parenting behaviors — not IQ scores or disability labels. Services should be adapted to the parent's learning style (visual aids, hands-on coaching, simplified materials).",
      citations: [
        "National Council on Disability. (2012). Rocking the cradle: Ensuring the rights of parents with disabilities and their children.",
        "Lightfoot, E., & DeZelar, S. (2016). The experiences and outcomes of children in foster care who were removed because of a parent's disability. Children and Youth Services Review, 62, 22–28.",
      ],
    },
    {
      id: "m3-post-7",
      text: "An investigator interviews a Deaf child using a sign language interpreter. Which of the following is a critical requirement for this interview?",
      options: [
        "Any family member who knows sign language can serve as interpreter",
        "The interpreter must be certified, impartial, and skilled in the child's specific sign language modality; family members must NEVER serve as interpreters in forensic settings",
        "The investigator should write questions on paper instead",
        "The interview should be shortened to 10 minutes due to the communication barrier",
      ],
      correctIndex: 1,
      explanation:
        "A certified, impartial interpreter is legally required under the ADA and essential for forensic integrity. Family members must never interpret because they may have conflicts of interest (especially if a family member is the alleged perpetrator), may filter or modify content, and their presence may inhibit the child's disclosure. The interpreter must be skilled in the child's specific modality (ASL, SEE, etc.) and ideally experienced in forensic/legal interpreting.",
      citations: [
        "Americans with Disabilities Act of 1990, Title II.",
        "National Association of the Deaf. (2018). Position statement on forensic interpreting.",
      ],
    },
    {
      id: "m3-post-8",
      text: "A school reports that a student with EBD (Emotional Behavioral Disorder) has been increasingly aggressive and has started refusing to go home. Staff attributes this to his disability. What risk does this interpretation create?",
      options: [
        "No risk — the behavior is clearly disability-related",
        "Diagnostic overshadowing: by attributing behavioral changes solely to the disability, signs of possible abuse (aggression as a trauma response, refusal to go home as avoidance of an unsafe environment) may be missed entirely",
        "The school should increase behavioral consequences",
        "The student should be placed in a more restrictive educational setting",
      ],
      correctIndex: 1,
      explanation:
        "This is a textbook example of diagnostic overshadowing. While the student's EBD may contribute to aggressive behavior, a sudden INCREASE in aggression combined with refusal to go home are potential abuse indicators that should trigger a mandated report. Attributing all behavioral changes to the pre-existing disability without considering abuse as a possibility can leave a child in danger.",
      citations: [
        "Reiss, S., Levitan, G. W., & Szyszko, J. (1982). Emotional disturbance and mental retardation: Diagnostic overshadowing. American Journal of Mental Deficiency, 86(6), 567–574.",
        "Sullivan, P. M., & Knutson, J. F. (2000). Maltreatment and disabilities: A population-based epidemiological study. Child Abuse & Neglect, 24(10), 1257–1273.",
      ],
    },
    {
      id: "m3-post-9",
      text: "During a dependency hearing, the child's attorney requests that the courtroom lighting be dimmed and the child be allowed to use noise-canceling headphones during breaks. The child has a sensory processing disorder. Should the judge grant these accommodations?",
      options: [
        "No — courtroom procedures cannot be modified for individual needs",
        "Yes — these are reasonable ADA accommodations for a child with sensory processing disorder that enable meaningful participation without altering the substantive proceedings",
        "Only if the opposing counsel agrees",
        "Only if a doctor provides a letter each time the child enters the courtroom",
      ],
      correctIndex: 1,
      explanation:
        "Title II of the ADA requires courts to provide reasonable accommodations to individuals with disabilities. Dimming lights and allowing noise-canceling headphones during breaks are low-burden accommodations that address the child's documented sensory needs and enable meaningful participation. Denying such accommodations could constitute disability discrimination and undermine the child's ability to participate in proceedings affecting their welfare.",
      citations: [
        "Americans with Disabilities Act of 1990, 42 U.S.C. §§ 12131–12165 (Title II).",
        "Department of Justice. (2010). ADA Title II Technical Assistance Manual.",
      ],
    },
    {
      id: "m3-post-10",
      text: "Research shows children with disabilities are 3-4x more likely to experience abuse. Which of the following is NOT a contributing factor to this elevated risk?",
      options: [
        "Greater dependency on caregivers for daily needs",
        "Communication barriers that limit disclosure ability",
        "Social isolation and fewer peer relationships",
        "Higher pain tolerance that makes abuse acceptable",
      ],
      correctIndex: 3,
      explanation:
        "Higher pain tolerance does NOT make abuse acceptable — this is a harmful myth. The actual contributing factors to elevated abuse risk include: dependency on caregivers (creating power imbalances), communication barriers (limiting disclosure), social isolation (reducing oversight), institutional settings (reduced individual supervision), and societal devaluation of people with disabilities. No physiological characteristic of any disability makes abuse more acceptable.",
      citations: [
        "Jones, L., et al. (2012). Prevalence and risk of violence against children with disabilities. The Lancet, 380(9845), 899–907.",
        "World Health Organization. (2011). World report on disability.",
      ],
    },
  ],

  // ─── Module 4: needs 9 more (currently has 1) ───
  4: [
    {
      id: "m4-post-2",
      text: "A detective collects a bedsheet with potential biological evidence from a child abuse scene. She places it in a sealed plastic bag. What error has she made?",
      options: [
        "She should have used a paper bag — plastic retains moisture and promotes bacterial degradation of biological evidence",
        "She should have photographed the sheet first, but the bag type is correct",
        "Plastic bags are the correct choice for all evidence types",
        "She should have cut out only the stained areas",
      ],
      correctIndex: 0,
      explanation:
        "Biological evidence (blood, semen, saliva) must be air-dried and packaged in paper bags or breathable containers. Plastic bags trap moisture, creating a warm, humid environment that accelerates bacterial degradation of DNA evidence. This is a fundamental evidence handling principle that can mean the difference between a viable DNA profile and a destroyed sample.",
      citations: [
        "Saferstein, R. (2018). Criminalistics: An introduction to forensic science (12th ed.). Pearson.",
        "National Institute of Justice. (2000). The future of forensic DNA testing: Predictions of the Research and Development Working Group.",
      ],
    },
    {
      id: "m4-post-3",
      text: "A nurse documents a child's injuries as 'bruising consistent with abuse.' Why is this documentation problematic?",
      options: [
        "The documentation is perfectly appropriate",
        "It states a conclusion ('consistent with abuse') rather than objectively describing the injury (location, size, shape, color, pattern) and leaving interpretation to the forensic assessment",
        "Nurses are not qualified to document injuries",
        "The word 'bruising' is too technical",
      ],
      correctIndex: 1,
      explanation:
        "Forensic documentation must describe objective findings: 'Three circular ecchymoses, each approximately 1.5cm diameter, on the left lateral thorax at the 4th-6th rib spaces, in linear alignment, consistent with fingertip pressure marks.' The phrase 'consistent with abuse' is a legal conclusion that exceeds the scope of physical documentation and can be challenged on cross-examination. The physical description should be so precise that any qualified expert reading it can form their own opinion.",
      citations: [
        "Baker, A. M. (2007). Forensic photography in the emergency department. Journal of Emergency Nursing, 33(5), 468–470.",
        "Giardino, A. P., et al. (2010). A practical guide to the evaluation of child physical abuse and neglect. Springer.",
      ],
    },
    {
      id: "m4-post-4",
      text: "A child tells her teacher, 'Uncle Mike put his hand under my shirt.' The teacher then asks, 'Did Uncle Mike touch your private parts? Did it happen more than once? Where were your parents?' What has the teacher done wrong?",
      options: [
        "Nothing — teachers should gather as much information as possible",
        "The teacher has introduced specific concepts not mentioned by the child (private parts, frequency, parent location) through leading questions, potentially contaminating the outcry and complicating the forensic investigation",
        "The teacher should have asked even more questions",
        "The teacher should have confronted Uncle Mike directly",
      ],
      correctIndex: 1,
      explanation:
        "The child's original statement was 'put his hand under my shirt.' The teacher introduced new concepts: 'private parts' (the child didn't say that), frequency ('more than once'), and parent location. Each of these leading questions plants ideas that may become incorporated into the child's account. As the outcry witness, the teacher should document the child's exact words, provide comfort, and report — NOT conduct an investigation.",
      citations: [
        "Lyon, T. D. (2014). Interviewing children. Annual Review of Law and Social Science, 10, 73–89.",
        "Crosson-Tower, C. (2013). A teacher's guide to recognizing and reporting child abuse. NEA.",
      ],
    },
    {
      id: "m4-post-5",
      text: "A forensic medical examination of a 9-year-old reveals no physical findings. Does this mean abuse did not occur?",
      options: [
        "Yes — if there are no physical findings, there was no abuse",
        "No — the majority of child sexual abuse cases have normal or nonspecific physical findings; absence of physical evidence does not rule out abuse",
        "It depends entirely on the child's age",
        "Only if the exam was conducted within 24 hours of the alleged incident",
      ],
      correctIndex: 1,
      explanation:
        "Research consistently shows that the majority of sexually abused children (often cited as 90%+) have normal or nonspecific physical examination findings. Many forms of sexual abuse leave no physical trace. Mucosal tissues heal rapidly. The absence of physical findings does NOT mean abuse did not occur — the child's disclosure and behavioral evidence remain critically important.",
      citations: [
        "Adams, J. A., et al. (2016). Updated guidelines for the medical assessment and care of children who may have been sexually abused. Journal of Pediatric and Adolescent Gynecology, 29(2), 81–87.",
        "Heger, A., Ticson, L., Velasquez, O., & Bernier, R. (2002). Children referred for possible sexual abuse: Medical findings in 2384 children. Child Abuse & Neglect, 26(6–7), 645–659.",
      ],
    },
    {
      id: "m4-post-6",
      text: "In applying the Daubert standard, a judge must evaluate expert testimony on child abuse. Which of the following would likely NOT meet the Daubert criteria?",
      options: [
        "Testimony based on the NICHD Protocol for forensic interviewing",
        "Expert opinion based solely on personal experience and intuition without reference to any empirical research or validated methodology",
        "Testimony citing peer-reviewed research on disclosure patterns",
        "Expert analysis using validated body mapping procedures",
      ],
      correctIndex: 1,
      explanation:
        "The Daubert standard requires that expert testimony be based on: (1) sufficient facts or data, (2) reliable principles and methods, and (3) reliable application of those methods to the case facts. Pure personal opinion or 'clinical intuition' without any grounding in empirical research, peer-reviewed literature, or validated methodology would not meet this standard. The NICHD Protocol, peer-reviewed disclosure research, and validated body mapping all have empirical foundations.",
      citations: [
        "Daubert v. Merrell Dow Pharmaceuticals, Inc., 509 U.S. 579 (1993).",
      ],
    },
    {
      id: "m4-post-7",
      text: "During evidence documentation, an investigator photographs a child's bruises but forgets to include a measurement scale. Why is this a significant error?",
      options: [
        "It is a minor oversight with no real consequence",
        "Without a measurement scale, the size of injuries cannot be accurately determined from photographs, weakening their evidentiary value and allowing defense challenges to size comparisons with alleged implements",
        "Measurement scales are only required for bite mark evidence",
        "Digital photos automatically include measurement data",
      ],
      correctIndex: 1,
      explanation:
        "Without a forensic ruler or measurement scale in the photograph, the actual size of injuries cannot be determined — cameras distort dimensions depending on distance, angle, and lens. This matters critically when comparing injury patterns to potential implements (belt buckle width, hand span, etc.). Defense attorneys will challenge size-based conclusions if no scale was present in the original documentation.",
      citations: [
        "Baker, A. M. (2007). Forensic photography in the emergency department. Journal of Emergency Nursing, 33(5), 468–470.",
        "Saferstein, R. (2018). Criminalistics (12th ed.). Pearson.",
      ],
    },
    {
      id: "m4-post-8",
      text: "A child makes an excited utterance to a first responder: 'Mommy's boyfriend hit me with the belt!' This statement may be admissible under which hearsay exception?",
      options: [
        "Business records exception",
        "The excited utterance (res gestae) exception — statements made under the stress of a startling event before the declarant has time to fabricate",
        "The dying declaration exception",
        "Hearsay exceptions do not apply to children's statements",
      ],
      correctIndex: 1,
      explanation:
        "Excited utterances are admissible under Federal Rule of Evidence 803(2) and equivalent state rules because they are considered inherently reliable — the declarant is speaking under the stress of a startling event before they have had the opportunity to reflect and fabricate. The first responder should document the child's exact words, the child's emotional state, the elapsed time since the event, and the circumstances of the statement.",
      citations: [
        "Federal Rules of Evidence, Rule 803(2).",
        "Myers, J. E. B. (2005). Myers on evidence in child, domestic, and elder abuse cases. Aspen.",
      ],
    },
    {
      id: "m4-post-9",
      text: "Body mapping of a 3-year-old reveals bruises in varying stages of healing on the upper arms, back, and buttocks. What does this pattern suggest?",
      options: [
        "Normal childhood bruising from play",
        "A pattern of repeated, inflicted injury — bruises in varying stages of healing indicate multiple episodes, and the locations (upper arms, back, buttocks) are atypical for accidental injuries in a 3-year-old",
        "The child has a bleeding disorder",
        "The documentation must be incorrect",
      ],
      correctIndex: 1,
      explanation:
        "Bruises in varying stages of healing indicate injuries occurred at different times — consistent with repeated, non-accidental injury. The TEN-4 clinical decision rule identifies torso, ears, and neck as sentinel locations for abuse in children under 4. Upper arms (grab marks), back, and buttocks are also highly concerning locations because accidental bruising in toddlers typically occurs on bony prominences (shins, forehead, knees), not on trunk or protected areas.",
      citations: [
        "Pierce, M. C., et al. (2010). Bruising characteristics discriminating physical child abuse from accidental trauma. Pediatrics, 125(1), 67–74.",
        "Christian, C. W., & Committee on Child Abuse and Neglect. (2015). The evaluation of suspected child physical abuse. Pediatrics, 135(5), e1337–e1354.",
      ],
    },
    {
      id: "m4-post-10",
      text: "A forensic interviewer notices that the recording equipment malfunctioned during the first 10 minutes of a forensic interview. What is the appropriate course of action?",
      options: [
        "Ignore it — the rest of the recording is sufficient",
        "Document the malfunction in writing immediately, note what was discussed during the unrecorded portion from memory, fix the equipment, and continue the interview — the documentation of the gap and its contents will be critical for legal proceedings",
        "Start the entire interview over from the beginning",
        "Destroy the partial recording and pretend the interview never happened",
      ],
      correctIndex: 1,
      explanation:
        "Equipment malfunctions must be documented contemporaneously and thoroughly. The interviewer should note the malfunction time, what was discussed during the gap (including any disclosures), repair the equipment, and continue. Starting over risks re-traumatization and introduces repetition concerns. The written documentation of the unrecorded portion, while not as strong as video, preserves the information for legal proceedings. Transparency about the gap is essential — concealing it would undermine the investigation's integrity.",
      citations: [
        "National Children's Alliance. (2017). Standards for accredited members.",
        "Lamb, M. E., et al. (2007). A structured forensic interview protocol. Child Abuse & Neglect, 31(11–12), 1201–1231.",
      ],
    },
  ],

  // ─── Module 5: needs 9 more (currently has 1) ───
  5: [
    {
      id: "m5-post-2",
      text: "During an MDT case review, the CPS investigator and the detective disagree about whether to confront the suspect immediately. How should this be resolved?",
      options: [
        "The detective outranks CPS and should make the final decision",
        "CPS outranks law enforcement in child abuse cases",
        "The team should discuss each agency's concerns, weigh child safety against investigation needs, and reach a consensus decision that prioritizes the child's immediate safety while preserving the criminal case",
        "The conflict should be escalated to a judge for resolution",
      ],
      correctIndex: 2,
      explanation:
        "No single agency 'outranks' another on the MDT — the model is built on collaborative decision-making. When agencies disagree, the team discusses each perspective (CPS may want to ensure child safety immediately; law enforcement may want to preserve the element of surprise for a suspect interview). The resolution should prioritize the child's immediate safety while, when possible, also preserving the integrity of the criminal investigation. If the child is in imminent danger, safety always takes precedence.",
      citations: [
        "Cross, T. P., et al. (2005). Police involvement in child protective services investigations. Child Maltreatment, 10(3), 224–244.",
      ],
    },
    {
      id: "m5-post-3",
      text: "A victim advocate notices that the non-offending mother is becoming increasingly hostile toward CPS, threatening to stop cooperating. What is the advocate's role?",
      options: [
        "Report the mother's behavior to the judge as obstruction",
        "Provide emotional support, help the mother understand the investigation process, address her fears, and facilitate communication between the mother and CPS — while maintaining professional boundaries",
        "Tell the mother she must cooperate or lose her children",
        "The advocate should stop working with the family if the mother is hostile",
      ],
      correctIndex: 1,
      explanation:
        "Hostility from non-offending parents is often driven by fear, confusion, stigma, and feeling blamed. The victim advocate's role is to bridge the gap — providing emotional support, explaining the process (why certain steps are necessary), addressing specific fears, and facilitating productive communication. Threatening or abandoning the family would be counterproductive and could compromise the child's safety by pushing the family underground.",
      citations: [
        "National Children's Alliance. (2017). Standards for accredited members.",
      ],
    },
    {
      id: "m5-post-4",
      text: "A CAC forensic interview reveals that the alleged perpetrator is a member of law enforcement. How should the MDT handle this conflict of interest?",
      options: [
        "Allow the perpetrator's department to investigate internally",
        "The team should implement conflict-of-interest protocols: recuse the perpetrator's agency from the investigation, bring in an outside law enforcement agency, ensure information barriers prevent leaks, and document all steps taken to maintain investigation integrity",
        "Drop the case due to the conflict",
        "Have CPS handle the entire investigation alone",
      ],
      correctIndex: 1,
      explanation:
        "When the alleged perpetrator is affiliated with a member agency of the MDT, immediate conflict-of-interest protocols must be implemented. The perpetrator's agency must be completely recused, an independent law enforcement agency must be brought in, information barriers must prevent case details from reaching the perpetrator's colleagues, and all steps must be documented. This protects the investigation's integrity and the child's safety.",
      citations: [
        "National Children's Alliance. (2017). Standards for accredited members.",
        "International Association of Chiefs of Police. (2003). Investigating sexual offenses committed by law enforcement officers.",
      ],
    },
    {
      id: "m5-post-5",
      text: "Which of the following best describes the difference between CPS's and law enforcement's goals in a parallel child abuse investigation?",
      options: [
        "They have identical goals",
        "CPS focuses on child safety, family assessment, and service provision (civil standard); law enforcement focuses on evidence collection, suspect accountability, and prosecution (criminal standard — beyond reasonable doubt)",
        "CPS investigates physical abuse; law enforcement investigates sexual abuse",
        "Law enforcement focuses on the child; CPS focuses on the perpetrator",
      ],
      correctIndex: 1,
      explanation:
        "The parallel tracks have complementary but different goals: CPS/DFCS operates under civil standards (preponderance of evidence), focusing on the child's immediate safety, ongoing risk assessment, and connecting the family with services. Law enforcement operates under criminal standards (beyond reasonable doubt), focusing on evidence collection, suspect identification, and building a prosecutable case. The MDT model coordinates these parallel efforts to serve both goals simultaneously.",
      citations: [
        "Cross, T. P., Finkelhor, D., & Ormrod, R. (2005). Police involvement in child protective services investigations. Child Maltreatment, 10(3), 224–244.",
      ],
    },
    {
      id: "m5-post-6",
      text: "A prosecutor declines to file criminal charges despite a strong forensic interview disclosure. The CPS investigator is frustrated. What should the MDT understand about this decision?",
      options: [
        "The prosecutor doesn't care about child abuse",
        "Prosecution decisions are based on whether the available evidence meets the 'beyond reasonable doubt' standard; a CPS substantiation (preponderance of evidence) does not automatically mean criminal prosecution is viable — the child can still be protected through the civil system",
        "The case should be dropped entirely since charges weren't filed",
        "The CPS investigator should take the case to a different prosecutor",
      ],
      correctIndex: 1,
      explanation:
        "The criminal standard (beyond reasonable doubt) is significantly higher than the civil standard (preponderance of evidence). A case may be substantiated by CPS — meaning the evidence supports that abuse more likely than not occurred — but still lack sufficient evidence for criminal prosecution. This does NOT mean the child is unprotected: civil protective measures (safety plans, supervised visitation, custody changes, required services) can still be implemented. Understanding these different standards reduces interagency frustration.",
      citations: [
        "Cross, T. P., et al. (2005). Police involvement in child protective services investigations. Child Maltreatment, 10(3), 224–244.",
      ],
    },
    {
      id: "m5-post-7",
      text: "An MDT member accidentally discusses case details with a colleague who is not on the team. What is the appropriate response?",
      options: [
        "It's fine — all professionals should know about these cases",
        "The breach must be documented, the team lead notified, the information-sharing protocol reviewed, and corrective action taken — unauthorized disclosure of confidential case information can jeopardize the investigation and violate the child's and family's privacy rights",
        "The colleague should just be asked to keep it confidential",
        "Nothing — confidentiality rules only apply to medical professionals",
      ],
      correctIndex: 1,
      explanation:
        "Unauthorized disclosure of case information is a serious breach of the Information Sharing Protocol (ISP) and potentially violates federal and state confidentiality laws. The appropriate response includes: (1) documenting the breach, (2) notifying the team lead and affected agencies, (3) assessing whether the breach compromised the investigation or endangered anyone, (4) reviewing ISP protocols with the team, and (5) implementing corrective action. Minimizing the breach ('just keep it quiet') is insufficient.",
      citations: [
        "National Children's Alliance. (2017). Standards for accredited members.",
      ],
    },
    {
      id: "m5-post-8",
      text: "A medical professional on the MDT identifies injuries consistent with non-accidental trauma, but the child did not disclose abuse during the forensic interview. What should happen?",
      options: [
        "The medical findings should be ignored since the child didn't disclose",
        "The medical findings are independent evidence that should be shared with the MDT, documented in the medical report, and considered alongside the interview results — many abused children do not disclose during their first interview",
        "The child should be re-interviewed immediately to match the medical findings",
        "The medical professional probably made an error",
      ],
      correctIndex: 1,
      explanation:
        "Medical findings and forensic interview results are independent streams of evidence. Research shows that many children do not disclose abuse during their first forensic interview (delayed and incremental disclosure is common). The medical professional's findings should be shared with the full MDT during case review, documented in the medical report, and integrated into the overall assessment. The team may consider whether a follow-up interview is appropriate after a waiting period.",
      citations: [
        "Adams, J. A., et al. (2016). Updated guidelines for the medical assessment of children who may have been sexually abused.",
        "Alaggia, R. (2004). Many ways of telling: Expanding conceptualizations of child sexual abuse disclosure. Child Abuse & Neglect, 28(11), 1213–1227.",
      ],
    },
    {
      id: "m5-post-9",
      text: "What is the most important thing to include in MDT case tracking to prevent cases from 'falling through the cracks'?",
      options: [
        "The total cost of the investigation",
        "Clear assignment of action items to specific team members with deadlines, follow-up accountability, and regular status updates during case reviews",
        "The number of hours each team member has worked",
        "Media coverage of the case",
      ],
      correctIndex: 1,
      explanation:
        "Cases fall through the cracks when action items are discussed but not assigned, deadlines are not set, and follow-up is not tracked. Effective MDT case management requires: clear assignment of specific tasks to specific individuals, defined deadlines, follow-up at each case review meeting, and documentation of completed and pending items. This accountability structure ensures that referrals are made, evidence is processed, and children receive needed services.",
      citations: [
        "Cross, T. P., et al. (2007). Child forensic interviewing in Children's Advocacy Centers. Child Abuse & Neglect, 31(10), 1031–1052.",
      ],
    },
    {
      id: "m5-post-10",
      text: "A newly formed MDT is struggling with agencies withholding information from each other. What is the most effective structural solution?",
      options: [
        "Have a judge order all agencies to share everything",
        "Develop and sign a formal Information Sharing Protocol (ISP) / Memorandum of Understanding (MOU) that specifies what information can be shared, with whom, under what circumstances, and what legal authorities permit the sharing",
        "Assign one person to be the sole keeper of all information",
        "Eliminate agencies that won't share from the team",
      ],
      correctIndex: 1,
      explanation:
        "The most effective solution is a formal ISP/MOU — a written agreement negotiated by all member agencies that addresses each agency's confidentiality requirements and identifies the specific legal authorities (federal, state, and local) that permit information sharing in child abuse cases. This document provides legal cover for sharing, reduces individual anxiety about violating confidentiality laws, and creates clear expectations. NCA accreditation requires such agreements.",
      citations: [
        "National Children's Alliance. (2017). Standards for accredited members.",
      ],
    },
  ],

  // ─── Module 6: needs 9 more (currently has 1) ───
  6: [
    {
      id: "m6-post-2",
      text: "A supervisor notices that a previously excellent CPS investigator has begun making sarcastic comments about clients, submitting incomplete reports, and calling in sick frequently. Using the ProQOL framework, what should the supervisor do?",
      options: [
        "Issue a written warning for poor performance",
        "Recognize these as potential signs of burnout and/or secondary traumatic stress, initiate a supportive supervisory conversation (not punitive), assess the worker's ProQOL indicators, and collaboratively develop a plan that may include caseload adjustment, debriefing, and EAP referral",
        "Transfer the investigator to a different unit without discussion",
        "Wait to see if the behavior improves on its own",
      ],
      correctIndex: 1,
      explanation:
        "The described behaviors — cynicism (depersonalization), reduced performance, absenteeism — map directly to Maslach's burnout dimensions and may also reflect STS. A trauma-informed supervisor recognizes these as occupational injuries, not character flaws. The response should be supportive: a private conversation that normalizes the emotional impact of the work, assessment of specific stressors, and a collaborative plan (caseload adjustment, time for reflective practice, EAP referral). Punitive responses typically worsen the situation and increase turnover.",
      citations: [
        "Maslach, C., & Leiter, M. P. (2016). Understanding the burnout experience. World Psychiatry, 15(2), 103–111.",
        "Stamm, B. H. (2010). The Concise ProQOL Manual (2nd ed.). ProQOL.org.",
      ],
    },
    {
      id: "m6-post-3",
      text: "After a child fatality case, several team members report intrusive images, difficulty sleeping, and hypervigilance at home. What organizational response is most appropriate?",
      options: [
        "Tell team members to 'toughen up' — this is part of the job",
        "Offer a Critical Incident Stress Debriefing (CISD) facilitated by a trained professional within 24-72 hours, follow up with individual check-ins, ensure access to EAP services, and normalize the emotional response",
        "Give everyone a day off and never mention the case again",
        "Assign more cases to keep everyone busy and distracted",
      ],
      correctIndex: 1,
      explanation:
        "A child fatality is a critical incident that can produce acute stress reactions in even the most experienced professionals. The organizational response should include: a structured CISD within 24-72 hours (facilitated by a trained professional, not a team member), individual follow-up check-ins in the days and weeks following, guaranteed access to EAP services, normalization of the emotional response, and ongoing monitoring for persistent symptoms that may indicate developing PTSD or complicated grief.",
      citations: [
        "Mitchell, J. T. (1983). When disaster strikes: The critical incident stress debriefing process. JEMS, 8(1), 36–39.",
        "Figley, C. R. (1995). Compassion fatigue. Brunner/Mazel.",
      ],
    },
    {
      id: "m6-post-4",
      text: "A forensic interviewer who has been doing excellent work for 8 years suddenly finds herself becoming emotionally detached during interviews — going through the motions without connecting to the child. Using the concept of trauma stewardship, what is happening?",
      options: [
        "She has simply become more efficient and professional",
        "She is experiencing emotional numbing, a common manifestation of cumulative secondary trauma exposure that signals her capacity for empathic engagement has been depleted without adequate replenishment",
        "She no longer cares about children",
        "She has outgrown the position and needs a promotion",
      ],
      correctIndex: 1,
      explanation:
        "Emotional numbing/detachment after years of trauma exposure is a well-documented manifestation of cumulative STS and vicarious traumatization. Van Dernoot Lipsky describes this as 'the inability to feel' — the helper's empathic capacity has been depleted by sustained exposure without adequate replenishment. This is NOT indifference — it is a protective response. Trauma stewardship principles call for honest self-assessment, intentional replenishment practices, and potentially a temporary shift in role to allow recovery.",
      citations: [
        "van Dernoot Lipsky, L., & Burk, C. (2009). Trauma stewardship: An everyday guide for caring for self while caring for others. Berrett-Koehler.",
        "McCann, I. L., & Pearlman, L. A. (1990). Vicarious traumatization. Journal of Traumatic Stress, 3(1), 131–149.",
      ],
    },
    {
      id: "m6-post-5",
      text: "Which of the following supervisor behaviors is most protective against secondary traumatic stress in child welfare workers?",
      options: [
        "Conducting frequent performance evaluations",
        "Providing reflective supervision that acknowledges the emotional impact of the work, creates space for processing, and models healthy coping strategies",
        "Maintaining strict professional distance from supervisees",
        "Assigning only low-risk cases to prevent exposure",
      ],
      correctIndex: 1,
      explanation:
        "Research consistently identifies reflective, emotionally attuned supervision as the single strongest organizational protective factor against STS. This supervision style goes beyond task management: it explicitly acknowledges the emotional toll, creates regular space for processing difficult cases, models healthy coping, normalizes emotional responses, and supports the worker's professional development. Strict distance, avoidance of difficult cases, and pure performance evaluation do not address the emotional dimension.",
      citations: [
        "Bride, B. E., et al. (2007). Correlates of secondary traumatic stress in child protective services workers. Journal of Evidence-Based Social Work, 4(3–4), 69–80.",
        "Salloum, A., et al. (2015). The role of self-care on compassion satisfaction, burnout, and secondary trauma among child welfare workers. Children and Youth Services Review, 49, 54–61.",
      ],
    },
    {
      id: "m6-post-6",
      text: "An investigator reports that they have been having nightmares about cases, startling easily at home, and feeling that 'nowhere is safe.' These symptoms most closely match which condition?",
      options: [
        "Normal work stress",
        "Secondary Traumatic Stress — symptoms that mirror PTSD (intrusive re-experiencing, hyperarousal, avoidance) but result from indirect exposure to others' trauma rather than direct personal trauma",
        "Clinical depression",
        "Attention deficit disorder",
      ],
      correctIndex: 1,
      explanation:
        "Nightmares about cases (intrusive re-experiencing), exaggerated startle response (hyperarousal), and the belief that 'nowhere is safe' (altered worldview/hypervigilance) are hallmark STS symptoms that mirror the DSM-5 criteria for PTSD. The key distinction is that these symptoms arise from INDIRECT exposure to others' trauma (working with abuse cases) rather than direct personal traumatic experience. STS can develop rapidly (even after a single exposure to a particularly disturbing case) and requires professional intervention.",
      citations: [
        "Bride, B. E. (2007). Prevalence of secondary traumatic stress among social workers. Social Work, 52(1), 63–70.",
        "Figley, C. R. (1995). Compassion fatigue. Brunner/Mazel.",
      ],
    },
    {
      id: "m6-post-7",
      text: "A veteran detective says, 'I've been doing this for 20 years and it doesn't affect me at all. I leave it at the office.' From a trauma stewardship perspective, what concern does this raise?",
      options: [
        "None — he has developed effective coping mechanisms",
        "Complete emotional compartmentalization after 20 years of trauma exposure may indicate suppression or dissociation rather than healthy coping — true resilience includes ACKNOWLEDGING the emotional impact while managing it effectively",
        "He should be promoted for his resilience",
        "He needs to work harder cases to stay challenged",
      ],
      correctIndex: 1,
      explanation:
        "Van Dernoot Lipsky identifies 'minimizing or denying the impact' as a key warning sign in trauma stewardship. While some compartmentalization is healthy and necessary, claiming that 20 years of child abuse investigation has had 'no effect at all' raises concern about suppression, emotional numbing, or dissociative coping. True resilience involves acknowledging the impact while developing effective strategies to manage it — not denying the impact exists. This detective may benefit from a compassionate, non-judgmental conversation about the cumulative effects of the work.",
      citations: [
        "van Dernoot Lipsky, L., & Burk, C. (2009). Trauma stewardship. Berrett-Koehler.",
      ],
    },
    {
      id: "m6-post-8",
      text: "An agency implements the following: mandatory weekly peer support groups, a caseload cap, quarterly ProQOL assessments, and a 'no-fault' debrief policy after critical incidents. Which self-care level does this primarily address?",
      options: [
        "Personal/individual self-care",
        "Organizational/systemic self-care — structural changes that create a supportive environment, which research shows is more impactful than asking individuals to 'self-care' within a toxic system",
        "Spiritual self-care",
        "Physical self-care",
      ],
      correctIndex: 1,
      explanation:
        "These are all organizational-level interventions — structural changes that create a supportive work environment. Research consistently shows that organizational factors (manageable caseloads, supportive culture, peer support structures, assessment/monitoring) have a greater impact on preventing STS and burnout than individual self-care practices alone. Telling workers to 'practice self-care' while maintaining unmanageable caseloads and punitive cultures is ineffective. Systemic change creates the conditions within which individual self-care becomes meaningful.",
      citations: [
        "Newell, J. M., & MacNeil, G. A. (2010). Professional burnout, vicarious trauma, secondary traumatic stress, and compassion fatigue. Best Practices in Mental Health, 6(2), 57–68.",
        "Stamm, B. H. (2010). The Concise ProQOL Manual. ProQOL.org.",
      ],
    },
    {
      id: "m6-post-9",
      text: "Despite experiencing secondary traumatic stress from her work in child welfare, a social worker reports that she feels a deeper sense of purpose, greater empathy, and stronger relationships than before entering the field. This experience is best described as:",
      options: [
        "Denial of her symptoms",
        "Vicarious post-traumatic growth — positive psychological changes that can co-exist alongside the negative effects of trauma exposure",
        "An indication that her STS is not real",
        "Stockholm syndrome",
      ],
      correctIndex: 1,
      explanation:
        "Vicarious post-traumatic growth (VPTG) describes positive psychological changes that emerge from working with trauma survivors — including enhanced appreciation for life, deeper relationships, increased personal strength, recognition of new possibilities, and spiritual development. Critically, VPTG can CO-EXIST with STS — a person can simultaneously experience growth AND distress. Acknowledging this complexity helps professionals integrate their experiences without minimizing either the pain or the meaning.",
      citations: [
        "Arnold, D., et al. (2005). Vicarious posttraumatic growth in psychotherapy. Journal of Humanistic Psychology, 45(2), 239–263.",
        "Tedeschi, R. G., & Calhoun, L. G. (2004). Posttraumatic growth: Conceptual foundations and empirical evidence. Psychological Inquiry, 15(1), 1–18.",
      ],
    },
    {
      id: "m6-post-10",
      text: "An agency asks you to design a comprehensive wellness program for child abuse investigators. Which of the following is the LEAST effective component?",
      options: [
        "Mandatory annual wellness day with no work-related activities",
        "Regular reflective supervision with trauma-aware supervisors",
        "A one-time 'resilience training' workshop with no follow-up, offered as the sole organizational response to staff burnout",
        "Peer support groups with structured debriefing protocols",
      ],
      correctIndex: 2,
      explanation:
        "A one-time resilience workshop offered as the SOLE response to burnout is the least effective approach. Research shows that single-session interventions without ongoing structural support have minimal lasting impact. Effective wellness programs require sustained, multi-level intervention: regular reflective supervision (structural), peer support (relational), wellness activities (personal), AND ongoing assessment/monitoring. The key word is 'sole' — a resilience workshop CAN be a useful component of a comprehensive program, but alone it is insufficient and may even signal organizational avoidance of deeper systemic issues.",
      citations: [
        "Newell, J. M., & MacNeil, G. A. (2010). Professional burnout, vicarious trauma, secondary traumatic stress, and compassion fatigue. Best Practices in Mental Health, 6(2), 57–68.",
      ],
    },
  ],

  // ─── Module 7: needs 7 more (currently has 3) ───
  7: [
    {
      id: "m7-post-4",
      text: "A Georgia school nurse notices that a 5-year-old has flinched when she touched his arm during a routine health check. She lifts his sleeve and sees three small, circular burns. The child says, 'I was playing with matches.' What should the nurse do?",
      options: [
        "Accept the child's explanation — children do play with matches",
        "Document the injuries (location, size, shape, pattern), note the child's exact words, recognize that circular burns are inconsistent with accidental match play (but consistent with cigarette burns), and call 1-855-GACHILD immediately",
        "Ask the child more detailed questions about how the burns happened",
        "Call the parents for an explanation before deciding whether to report",
      ],
      correctIndex: 1,
      explanation:
        "Circular burns are a well-known indicator of intentional injury (particularly cigarette burns). A 5-year-old's explanation of 'playing with matches' is inconsistent with the burn pattern (matches create irregular, linear burns — not circular ones). The nurse should: (1) document objective findings (three circular burns, approximately X diameter, on the anterior left forearm), (2) record the child's verbatim statement, (3) call 1-855-GACHILD. She should NOT investigate further, question the child, or alert the parents.",
      citations: [
        "O.C.G.A. § 19-7-5",
        "Christian, C. W., & Committee on Child Abuse and Neglect. (2015). The evaluation of suspected child physical abuse. Pediatrics, 135(5), e1337–e1354.",
      ],
    },
    {
      id: "m7-post-5",
      text: "You are a mandated reporter in Georgia who made a good-faith report about a colleague's child. The investigation did not substantiate abuse. Now the colleague is threatening to sue you. What legal protection do you have?",
      options: [
        "None — if the report was unsubstantiated, you can be sued",
        "O.C.G.A. § 19-7-5(g) provides civil and criminal immunity for good-faith reports — the fact that the investigation did not substantiate abuse does NOT remove your immunity, as long as the report was made without malice",
        "You are only protected if you are a government employee",
        "You must prove the abuse occurred to maintain your immunity",
      ],
      correctIndex: 1,
      explanation:
        "Good-faith immunity under O.C.G.A. § 19-7-5(g) protects reporters who act based on genuine concern, regardless of the investigation outcome. 'Unsubstantiated' does NOT mean 'false' — it means the investigation did not find sufficient evidence to confirm abuse at that time. Your immunity stands as long as: (1) you are a mandated reporter, (2) you had reasonable cause to believe, and (3) you acted without malice or reckless disregard for the truth. The colleague's lawsuit would likely be dismissed.",
      citations: [
        "O.C.G.A. § 19-7-5(g)",
        "Kalichman, S. C. (1999). Mandated reporting of suspected child abuse. APA.",
      ],
    },
    {
      id: "m7-post-6",
      text: "After making a report to DFCS, you learn that DFCS has not yet contacted the family after 3 business days. The report was classified as non-emergency. Should you be concerned?",
      options: [
        "Yes — you should make a second report",
        "No — Georgia DFCS has 5 business days to initiate a non-emergency investigation; the timeline is within the standard response window",
        "You should contact the family yourself to check on the child",
        "You should call the police instead",
      ],
      correctIndex: 1,
      explanation:
        "Georgia DFCS classifies reports as emergency (24-hour response) or standard/non-emergency (5-business-day response). If 3 business days have passed on a non-emergency report, DFCS is still within their standard response window. If you have NEW concerns or the situation escalates, you should make an additional report with the new information. You should NOT contact the family or investigate on your own. If the child is in immediate danger, call 911 or local law enforcement.",
      citations: [
        "Georgia Division of Family and Children Services (DFCS) Policy Manual",
        "O.C.G.A. § 49-5-41",
      ],
    },
    {
      id: "m7-post-7",
      text: "A daycare worker in Georgia suspects that a toddler is being neglected based on chronic diaper rash, malnutrition, and the child being dropped off in dirty clothes with no food. The worker thinks, 'This isn't really abuse, it's just neglect.' Is she still required to report?",
      options: [
        "No — Georgia's mandated reporting law only covers physical and sexual abuse",
        "Yes — Georgia law (O.C.G.A. § 19-15-1) defines child abuse to include neglect; failure to provide adequate care, nourishment, and hygiene falls within the reporting mandate",
        "Only if the child is under age 2",
        "Only if the parents are intentionally withholding care",
      ],
      correctIndex: 1,
      explanation:
        "Georgia's definition of child abuse under O.C.G.A. § 19-15-1(3) explicitly includes neglect — the failure to provide adequate food, clothing, shelter, medical care, or supervision. The daycare worker's observations (chronic diaper rash, malnutrition, dirty clothes, no food) constitute reasonable cause to believe the child is being neglected. Intent is not required — whether the parents are 'trying their best' or not, the child's needs are not being met, and a report is required.",
      citations: [
        "O.C.G.A. § 19-15-1(3)",
        "O.C.G.A. § 19-7-5",
      ],
    },
    {
      id: "m7-post-8",
      text: "Scenario: Your principal says, 'I'll take care of reporting this.' You know the principal has a personal relationship with the student's family. What should you do?",
      options: [
        "Trust the principal — they are your supervisor",
        "Ensure a report is actually made by following up. If you have any doubt that the principal will report, make the report yourself — your personal legal obligation under O.C.G.A. § 19-7-5 cannot be delegated to a supervisor",
        "File an anonymous complaint against the principal",
        "Wait 30 days and then check",
      ],
      correctIndex: 1,
      explanation:
        "This is the 'gatekeeper' problem in mandated reporting. The personal legal obligation under O.C.G.A. § 19-7-5 rests with YOU as the individual who has reasonable cause to believe. While organizational procedures may involve notifying a supervisor, the legal duty is personal and non-delegable. If the principal's personal relationship with the family creates a conflict of interest that might prevent reporting, you must ensure a report is made — either by confirming the principal followed through or by making the report yourself.",
      citations: [
        "O.C.G.A. § 19-7-5",
        "Alvarez, K. M., et al. (2004). Why are professionals failing to initiate mandated reports of child maltreatment? Aggression and Violent Behavior, 9(5), 563–578.",
      ],
    },
    {
      id: "m7-post-9",
      text: "After reporting suspected abuse of a student, you want to support the child but aren't sure what's appropriate. Which of the following is the MOST appropriate post-report behavior for a mandated reporter?",
      options: [
        "Tell the child you made a report and that everything will be okay now",
        "Maintain your normal professional role, provide a consistent and safe presence, avoid re-interviewing the child about the abuse, cooperate with investigators if contacted, and maintain confidentiality about the report",
        "Follow up with DFCS daily for investigation updates",
        "Discuss the case with other teachers so they can also watch for signs",
      ],
      correctIndex: 1,
      explanation:
        "Post-report, the mandated reporter's role is to: (1) maintain their normal relationship with the child (teacher, coach, nurse), (2) provide a consistent, safe, supportive presence, (3) NOT re-interview the child about the abuse (this could contaminate the investigation), (4) cooperate with investigators if contacted, and (5) maintain confidentiality about the report. You should NOT tell the child you made a report, discuss the case with uninvolved colleagues, or demand updates from DFCS.",
      citations: [
        "O.C.G.A. § 19-7-5",
        "Crosson-Tower, C. (2013). A teacher's guide to recognizing and reporting child abuse. NEA.",
      ],
    },
    {
      id: "m7-post-10",
      text: "Compare Georgia's mandated reporting framework with a universal reporter state like Texas. What is the most significant practical difference for professionals?",
      options: [
        "There is no practical difference",
        "In Georgia, only designated professional categories bear the legal duty to report; in Texas, ALL adults bear this duty regardless of profession — meaning in Texas, a bystander at a grocery store who witnesses abuse has the same legal obligation as a teacher or doctor",
        "Texas does not have penalties for failure to report",
        "Georgia's reporting standard is higher than Texas's",
      ],
      correctIndex: 1,
      explanation:
        "The most significant practical difference is the scope of the mandate. In Georgia's category-based system, the legal duty applies only to specific professional categories designated by O.C.G.A. § 19-7-5. In Texas (a universal reporter state under Tex. Fam. Code § 261.101), EVERY adult has the legal obligation to report — regardless of whether they have any professional role involving children. Both states encourage all citizens to report, but only universal reporter states create a legal mandate for every adult.",
      citations: [
        "O.C.G.A. § 19-7-5",
        "Tex. Fam. Code § 261.101",
        "Child Welfare Information Gateway. (2019). Mandatory reporters of child abuse and neglect.",
      ],
    },
  ],
};
