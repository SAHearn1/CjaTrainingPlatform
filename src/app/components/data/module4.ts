// Auto-generated from data.ts split (issue #27) — Module 4
import type { Module } from './types';
import { MODULE_IMAGES } from './constants';

export const module4: Module =   {
    id: 4,
    title: "Forensic Interviewing and Evidence Preservation",
    description:
      "In-depth training on forensic interview techniques, evidence collection, documentation, and preservation of testimony for legal proceedings.",
    duration: "5 hours",
    image: MODULE_IMAGES[3],
    sections: [
      { id: "m4-root", videoId: "LEC-M4-01", phase: "Root", title: "Legal Foundations of Forensic Evidence", description: "Rules of evidence and admissibility standards", content: ["Understanding hearsay exceptions for child statements.", "Crawford v. Washington and confrontation clause implications.", "Documentation standards that meet evidentiary requirements.", "Digital evidence collection and preservation in child exploitation cases."] },
      { id: "m4-regulate", videoId: "LEC-M4-02", phase: "Regulate", title: "Interviewer Neutrality", description: "Maintaining objectivity during forensic interviews", content: ["Techniques for maintaining neutral affect during disturbing disclosures.", "Avoiding verbal and non-verbal reinforcement of specific responses.", "Managing personal reactions to graphic disclosures.", "Post-interview self-care and debriefing protocols."] },
      { id: "m4-reflect", videoId: "LEC-M4-03", phase: "Reflect", title: "Interview Critique Workshop", description: "Analyzing forensic interview recordings", content: ["Identify interviewer behaviors that strengthened or weakened testimony.", "Evaluate use of props, drawings, and other interview aids.", "Assess developmental appropriateness of questions.", "Review court challenges to forensic interview procedures."] },
      { id: "m4-restore", videoId: "LEC-M4-04", phase: "Restore", title: "Evidence Preservation Protocols", description: "Chain of custody and documentation standards", content: ["Physical evidence collection in child abuse cases.", "Photographic documentation standards.", "Medical evidence coordination with SANE nurses.", "Digital forensics in exploitation cases."] },
      { id: "m4-reconnect", videoId: "LEC-M4-05", phase: "Reconnect", title: "Court Preparation and Testimony", description: "Preparing evidence and testimony for legal proceedings", content: ["Preparing forensic interview recordings for court.", "Expert witness testimony preparation.", "Working with prosecutors on case presentation.", "Supporting child witnesses through the court process."] },
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
        videoId: "SIM-M4-S1",
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
  };
