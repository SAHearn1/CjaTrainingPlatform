// Auto-generated from data.ts split (issue #27) — Module 1
import type { Module } from './types';
import { MODULE_IMAGES } from './constants';

export const module1: Module =   {
    id: 1,
    title: "Trauma-Informed Foundations of Child Abuse Investigation",
    description:
      "Foundational training in trauma-informed approaches to investigating suspected child abuse and neglect. Learn the RootWork 5Rs framework and TRACE cognitive cycle.",
    duration: "4 hours",
    image: MODULE_IMAGES[0],
    sections: [
      {
        id: "m1-root",
        videoId: "LEC-M1-01",
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
        // TODO: Replace with licensed training video URL before production deployment
        videoUrl: "https://www.youtube.com/watch?v=X7dRe0Xs6IE",
      },
      {
        id: "m1-regulate",
        videoId: "LEC-M1-02",
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
        videoId: "LEC-M1-03",
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
        videoId: "LEC-M1-04",
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
        videoId: "LEC-M1-05",
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
        videoId: "SIM-M1-S1",
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
  };
