// Auto-generated from data.ts split (issue #27) — Module 6
import type { Module } from './types';
import { MODULE_IMAGES } from './constants';

export const module6: Module =   {
    id: 6,
    title: "Preventing Secondary Trauma During Investigations",
    description:
      "Essential training on recognizing, preventing, and addressing secondary traumatic stress, vicarious trauma, and burnout among child abuse investigation professionals.",
    duration: "3 hours",
    image: MODULE_IMAGES[5],
    sections: [
      { id: "m6-root", videoId: "LEC-M6-01", phase: "Root", title: "Understanding Secondary Trauma", description: "The science of professional trauma exposure", content: ["Differentiating secondary traumatic stress, vicarious trauma, compassion fatigue, and burnout.", "Neurobiology of secondary trauma: how the brain responds to others' trauma narratives.", "Risk factors for developing secondary traumatic stress.", "Organizational factors that contribute to or protect against professional trauma."] },
      { id: "m6-regulate", videoId: "LEC-M6-02", phase: "Regulate", title: "Personal Resilience Strategies", description: "Building individual capacity for trauma work", content: ["Evidence-based self-care practices for trauma-exposed professionals.", "Somatic regulation techniques for managing acute stress responses.", "Cognitive reframing strategies for maintaining professional perspective.", "Work-life boundary setting and transition rituals."] },
      { id: "m6-reflect", videoId: "LEC-M6-03", phase: "Reflect", title: "Self-Assessment and Awareness", description: "Recognizing signs of secondary trauma in yourself and colleagues", content: ["Professional quality of life assessment tools.", "Warning signs inventory: behavioral, emotional, cognitive, and physical indicators.", "Peer support and check-in protocols.", "Reflective practice journaling and structured supervision."] },
      { id: "m6-restore", videoId: "LEC-M6-04", phase: "Restore", title: "Organizational Support Systems", description: "Building trauma-informed workplaces", content: ["Organizational policies that support trauma-exposed workers.", "Critical incident stress management protocols.", "Employee assistance program optimization for first responders.", "Trauma-informed supervision models."] },
      { id: "m6-reconnect", videoId: "LEC-M6-05", phase: "Reconnect", title: "Sustainable Practice", description: "Long-term strategies for career sustainability", content: ["Building professional support networks.", "Mentorship and peer consultation models.", "Career development and role rotation strategies.", "Finding meaning and purpose in trauma-focused work."] },
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
        videoId: "SIM-M6-S1",
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
  };
