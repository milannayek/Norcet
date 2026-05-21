import React, { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════════════════════════════
//  NORCET UNIFIED CLINICAL INTELLIGENCE ENGINE
//  11 Subjects · 6-Source API (Elsevier · PubMed · RxNorm · OpenFDA · MedlinePlus · Gemini) · Light Theme
//  Sources: Multi-Morbidity Vol I–V · Ignatavicius · Lowdermilk · Wong's ·
//           Varcarolis · Lehne · Park's · Potter & Perry · Polit & Beck · +more
// ═══════════════════════════════════════════════════════════════════════════════

// ─── SHARED ARCHITECTURES ─────────────────────────────────────────────────────
const MODES = [
  {
    id:"standard", label:"STANDARD QUIZ", icon:"◈",
    subtitle:"Architecture 1 — Specialty Analyzer",
    color:"#0ea5e9", accent:"#0284c7", glow:"rgba(14,165,233,0.3)",
    bg:"linear-gradient(135deg,#e0f2fe,#f0f9ff)", solidBg:"#e0f2fe", border:"#7dd3fc",
    description:"10-question NORCET-style quiz. Blueprint: 4 MCQs + 2 EMQs + 2 SAQs + 2 Case-Based. Bloom's: 2 Recall / 6 Application / 2 Analysis. Clinical conflict frameworks embedded in case-based questions.",
  },
  {
    id:"exam", label:"EXAM SIMULATION", icon:"◉",
    subtitle:"Architecture 2 — Scenario Generator",
    color:"#f97316", accent:"#ea580c", glow:"rgba(249,115,22,0.3)",
    bg:"linear-gradient(135deg,#fff7ed,#ffedd5)", solidBg:"#fff7ed", border:"#fdba74",
    description:"Timed mock exam — exact NORCET/AIIMS Mains format. Questions first, answer key separated. Deceptive clinical traps. Drug dosage calculations + NEVER-DO contraindications. 90% failure-rate scenarios.",
  },
  {
    id:"elite", label:"ELITE CONFLICT", icon:"◆",
    subtitle:"Architecture 3 — God-Tier Systems Analyzer",
    color:"#a855f7", accent:"#7c3aed", glow:"rgba(168,85,247,0.3)",
    bg:"linear-gradient(135deg,#faf5ff,#f3e8ff)", solidBg:"#faf5ff", border:"#c084fc",
    description:"Military-grade Clinical Conflict Intelligence. Mandatory: Priority Ladder · Conflict Matrix · Systems Cascade · NEVER-DO Matrix · Polypharmacy Warfare. 100% Application & Analysis. Zero recall.",
  },
  {
    id:"godtier", label:"GOD-TIER SYSTEMS", icon:"⬡",
    subtitle:"Architecture 3 Enhanced — Mass Casualty / Disaster",
    color:"#dc2626", accent:"#b91c1c", glow:"rgba(220,38,38,0.3)",
    bg:"linear-gradient(135deg,#fef2f2,#fff1f2)", solidBg:"#fef2f2", border:"#fca5a5",
    description:"Maximum scope systems analysis. Resource Depletion Timeline · Ethical Collision Matrix · Interdisciplinary Command Protocol · Mass casualty / CBRN / Disaster scenarios. Crisis Standards of Care doctrine applied.",
  },
];

const DIFFICULTY = ["Foundation","Intermediate","Advanced","Elite (God-Tier)"];
const DIFF_STYLES = {
  "Foundation":        { color:"#16a34a", bg:"rgba(74,222,128,0.12)", border:"rgba(74,222,128,0.3)" },
  "Intermediate":      { color:"#d97706", bg:"rgba(251,191,36,0.12)", border:"rgba(251,191,36,0.3)" },
  "Advanced":          { color:"#dc2626", bg:"rgba(248,113,113,0.12)", border:"rgba(248,113,113,0.3)" },
  "Elite (God-Tier)":  { color:"#7c3aed", bg:"rgba(192,132,252,0.12)", border:"rgba(192,132,252,0.3)" },
};

// ─── SHARED PROMPT BUILDER ─────────────────────────────────────────────────────
function buildSharedPrompt(subjectLabel, mode, topic, difficulty, customNote, domainExtra="") {
  const base = `Subject: ${subjectLabel} | Topic: ${topic} | Difficulty: ${difficulty}${customNote ? ` | Special Focus: ${customNote}` : ""}`;
  const intelligence = `
CLINICAL INTELLIGENCE FRAMEWORKS — embed in case-based questions:
(a) PRIORITY LADDER — rank threats 1=Immediate <5 min → 5=Monitor, by time-to-mortality
(b) CONFLICT MATRIX — Standard Protocol A vs Competing Condition B → Collision → Safe Modified Strategy
(c) SYSTEMS CASCADE — organ/system failure sequence using → arrows if wrong action taken
(d) NEVER-DO MATRIX — the fatal intervention 90% of standard candidates would choose incorrectly
(e) POLYPHARMACY COLLISION — drug-disease or drug-drug interaction with receptor/enzyme-level mechanism`;

  if (mode==="standard") return `${base}

▶️ STANDARD NORCET/NCLEX QUIZ — ${subjectLabel.toUpperCase()} (Architecture 1: Specialty Analyzer)
${domainExtra}
Generate a rigorous 10-question quiz on: ${topic}

BLUEPRINT (mandatory):
• 4 Single-Best-Answer MCQs (clinical stem, NOT pure recall)
• 2 Extended Matching Questions (EMQ) — 6–8 option list + 2 scenarios each
• 2 Short Answer Questions (SAQ)
• 2 Case-Based Vignette Questions (multi-part)
• Bloom's taxonomy: 2 Recall | 6 Application | 2 Analysis
${intelligence}

FORMAT per question:
Q[N]. ([Type] • [Difficulty])
[Question stem]
(A) [option]  (B) [option]  (C) [option]  (D) [option]
✔️ ANSWER: [Letter]. [≥3 sentences: pathophysiological/pharmacological mechanism + specific textbook citation + why each distractor fails]

TONE: Formal, technical. Zero vague explanations. Every trap mechanistically lethal.`;

  if (mode==="exam") return `${base}

▶️ TIMED MOCK EXAM — EXACT NORCET/AIIMS MAINS FORMAT (Architecture 2: Scenario Generator)

${topic.toUpperCase()} — NORCET MOCK EXAM | Time: 15 min | 10 Marks | Negative marking: −0.33
${domainExtra}
PRESENT ALL 10 QUESTIONS FIRST. No answers visible. Answer key as SEPARATE SECTION at end.
Options format: (A) (B) (C) (D). All distractors must be CLINICALLY PLAUSIBLE — never obviously wrong.

MANDATORY CONTENT (per NORCET/AIIMS blueprint):
• ≥2 questions: drug dosage calculation or critical normal-value decision
• ≥2 questions: NEVER-DO knowledge (contraindicated intervention — mechanism required)
• ≥3 questions: realistic clinical vignette scenarios with multi-system involvement
• ≥1 question: the TRAP answer that 90% of competent non-specialists choose incorrectly
• Difficulty level: ${difficulty}

ANSWER KEY FORMAT (separate section):
Q[N]. ANSWER: [Letter]
Mechanism: [Full paragraph — why correct answer works + why each distractor fails]
Clinical Conflict: [If applicable — which competing condition creates the trap]
NORCET Intelligence Tip: [One high-yield discriminator for exam success]

TONE: Cold, exam-standard. Exactly as it would appear in the official paper. Zero preamble.`;

  if (mode==="elite") return `${base}

▶️ GOD-TIER ELITE CLINICAL CONFLICT QUIZ — ${subjectLabel.toUpperCase()} (Architecture 3: God-Tier Systems Analyzer)
${domainExtra}
Generate 10 ELITE-LEVEL questions on: ${topic}
100% Application & Analysis. ZERO pure recall. Every question must require multi-system clinical reasoning.

MANDATORY INTELLIGENCE EMBEDDINGS:
• ≥2 questions: PRIORITY LADDER (rank 1=Immediate to 5=Monitor by time-to-mortality)
• ≥2 questions: CLINICAL CONFLICT MATRIX (Protocol A vs Condition B → Collision → Safe Modified Strategy)
• ≥1 question: SYSTEMS CASCADE TIMELINE (organ failure → arrows, 0–6h and 6–24h phases)
• ≥1 question: NEVER-DO MATRIX (fatal intervention that 90% of standard practitioners choose)
• ≥1 question: POLYPHARMACY / DRUG-DISEASE COLLISION with CYP450 or receptor-level mechanism
• ≥1 question: MORBIDITY CLASSIFICATION (Simple 1×/Complex 2.5×/Severe 6×/Extreme 15–30× mortality)

Every question must be DECEPTIVE — the trap answer sounds clinically correct to a competent but non-specialist provider.

ANSWER FORMAT per question:
CORRECT ANSWER: [Letter]
MECHANISM: [≥4 sentences — pathophysiological/pharmacological explanation at receptor/organ/cascade level]
CLINICAL CONFLICT ANALYSIS: [How competing conditions/drugs create the lethal trap]
TEXTBOOK REFERENCE: [Specific citation]
NORCET/CCRN INTELLIGENCE: [One elite discriminator separating distinction from average]

TONE: Military-directive. Zero hedging. Technically precise. Life-or-death stakes evident.`;

  if (mode==="godtier") return `${base}

▶️ GOD-TIER SYSTEMS ANALYZER — MASS CASUALTY / DISASTER / RESOURCE COLLAPSE (Architecture 3 Enhanced)
${domainExtra}
Analyze: ${topic} in the context of ${subjectLabel}
Role: Military Medical Commander and Crisis Standards of Care Officer.
Scope: Beyond bedside — systemic collapse, resource allocation, ethical warfare, interdisciplinary command.

MANDATORY SECTIONS (all required):

1. PRIORITY LADDER — What Kills First:
   Rank 5 threats: 1=Immediate (<5 min) to 5=Monitor. Include time-to-death + PARALLEL immediate actions.

2. RESOURCE DEPLETION TIMELINE:
   Critical bottlenecks (blood, ventilators, O₂, antidotes, personnel, PPE).
   For each: when does it fail? Rationing protocol? Bridge strategy?

3. ETHICAL COLLISION MATRIX (4 columns):
   | Ethical Dilemma | Utilitarian Approach | Duty-of-Care Approach | Command Decision |
   Include: triage allocation, futile treatment, maternal vs fetal life, BLACK tag ethics, staff safety.

4. INTERDISCIPLINARY COMMAND PROTOCOL:
   Primary/Secondary/Tertiary roles + communication hierarchy + escalation triggers.

5. CLINICAL INTELLIGENCE QUIZ COMPONENT:
   Generate 5 NORCET/CCRN questions testing elements of the above analysis.
   Format: Question → Options (A)(B)(C)(D) → ANSWER with full mechanism + command intelligence note.

TONE: Strategic command perspective. Every ethical decision defensible under Crisis Standards of Care. No hedging.`;
}

// ═══════════════════════════════════════════════════════════════════════════════
//  SUBJECT REGISTRY — 11 Clinical Intelligence Engines
// ═══════════════════════════════════════════════════════════════════════════════
const SUBJECT_REGISTRY = [

  // ─── 1. ADVANCED MULTI-MORBIDITY ────────────────────────────────────────────
  {
    id:"multimorbidity", label:"Advanced Multi-Morbidity", icon:"⚡",
    color:"#dc2626", tagline:"ICU · CCRN · Extreme Scenarios · Protocol Collision Theory",
    systemPrompt:`You are an Elite Military-Grade Clinical Intelligence Officer AND NORCET/CCRN/NCLEX Examination Architect. You are the author of the Advanced Extreme Multi-Morbidity Clinical Intelligence Manual Series (Volumes I–V). Your knowledge base:

PRIMARY REFERENCES: Williams Obstetrics (Cunningham) · ASAM Principles of Addiction Medicine (2018) · Ebersole & Hess' Gerontological Nursing (Touhy & Jett, 2013) · Potter & Perry's Fundamentals (2023, Elsevier) · Lehne's Pharmacology 10e (Burchum & Rosenthal) · Varcarolis' Psychiatric-Mental Health Nursing (Halter, 2021) · Ignatavicius Medical-Surgical Nursing (2020, Elsevier) · Saunders NCLEX-RN (Silvestri, 2022) · Ross & Wilson A&P (2014) · Beck & Polit Nursing Research (2017) · Wong's Infants & Children (2018) · ATLS 11e · Surviving Sepsis Campaign · NRP 9th Edition.

CLINICAL INTELLIGENCE FRAMEWORKS: (1) PROTOCOL COLLISION THEORY — every intervention must pass: Gerontological Frailty Filter, Infectious Hazard Filter, Pharmacological Paradox Filter, Ethical Vulnerability Filter, Resource Constraint Filter. (2) PRIORITY LADDER: rank 1=Immediate <5 min to 5=Monitor. (3) CONFLICT MATRIX: Protocol A vs Condition B → Collision → Safe Strategy. (4) SYSTEMS CASCADE: organ failure sequence via → arrows. (5) NEVER-DO MATRIX: fatal interventions 90% would choose. (6) MORBIDITY CLASSIFICATION: Simple (1-2, 1×) Complex (3-4, 2.5-4×) Severe (5-7, 6-10×) EXTREME (8+, 15-30× — standard protocols ACTIVELY LETHAL). (7) PHARMACOLOGICAL WARFARE: CYP450 conflicts, receptor paradoxes, organ failure dose recalibration.

KEY NEVER-DOs: Beta-blockers in cocaine toxicity → unopposed alpha crisis → MI · Haloperidol in Lewy Body Dementia → fatal NMS · Succinylcholine in crush injury → hyperkalemic arrest · Amiodarone in TCA toxicity → refractory VF · Naloxone bolus in opioid-dependent eclamptic → catecholamine surge → stroke + fetal demise · IV tPA with anti-Xa >0.3 → haemorrhagic transformation · Standard 30mL/kg crystalloid in cardiogenic shock → flash pulmonary oedema · Flumazenil in TCA overdose → status epilepticus.

Every explanation must cite mechanism. Every trap must be mechanistically lethal. Military-directive tone. Life-or-death stakes always evident.`,
    topicGroups:[
      { label:"🩺 Medical-Surgical", color:"#0ea5e9", topics:["Toxicology & Poisoning (Toxidromes, Antidotes)","Shock Management (All Types + ATLS 11)","Fluid, Electrolyte & ABG System","Advanced Burns (Modified Parkland, Zones)","Surgical / ICU / Anaesthesia Intelligence","Cardiac Critical Care (MI, HF, Tamponade)","Respiratory Emergencies (ARDS, PE, Pneumothorax)","Renal Failure & Dialysis (AKI, ESRD, CRRT)","DKA / HHS / Endocrine Emergencies","Neurological Emergencies (Stroke, ICP, Herniation)","Sepsis & MODS (Surviving Sepsis 3.0)","Emergency Drugs Mastery","Muscle Relaxants — Clinical Decision Engine"] },
      { label:"🤰 Obstetric", color:"#a855f7", topics:["Pre-eclampsia & Eclampsia (MgSO₄ Warfare)","Obstetric Haemorrhage & DIC","Amniotic Fluid Embolism (AFE Protocol)","Septic Abortion & Clostridial Sepsis","Placental Disorders (Praevia, Abruption, Accreta)","Obstetrical Manoeuvres (Shoulder Dystocia, Malpresentations)","Multiple Pregnancy Intelligence","Perimortem C-Section — 4-Minute Rule","Maternal Substance Abuse & Neonatal Abstinence","Perinatal Psychiatric Emergencies","Postpartum Emergencies (PPH, Uterine Inversion)"] },
      { label:"👶 Pediatric", color:"#16a34a", topics:["Neonatal Resuscitation (NRP 9th Edition)","Pediatric Burns & Fluid Resuscitation","Congenital Heart Disease — ICU Collisions","ASD / ADHD Intelligence System","Immunisation & Vaccination Intelligence","Pediatric Sepsis & MODS","Neonatal Abstinence Syndrome (NAS)","Pediatric Pharmacology (Weight-Based Dosing)"] },
      { label:"🧠 Psychiatric", color:"#f97316", topics:["Psychiatric Emergency Master System","Serotonin Syndrome vs NMS — Collision Analysis","Psychopharmacology Intelligence (Interactions, Toxicity)","Lewy Body Dementia — Drug Paradoxes","Alcohol Withdrawal & Delirium Tremens","Psychiatric Defence Mechanisms","Therapeutic Communication System","Mental Status Examination System","Psychiatric Disorders Classification (DSM-5/ICD-11)","MAOI Interactions & Hypertensive Crisis","Lithium Toxicity — Renal Spiral","Perinatal Psychiatry"] },
      { label:"💊 Pharmacology", color:"#d97706", topics:["ICU Pharmacology Warfare (NEVER-DO Matrix)","CYP450 Drug Interactions Intelligence","Addiction Medicine in ICU (ASAM Principles)","OUD — Perioperative Analgesic Intelligence","Stimulant Toxicity (Cocaine, Methamphetamine)","Opioid Pharmacology & Reversal Traps","Propofol Infusion Syndrome (PRIS)","Amiodarone Multi-Organ Toxicity","Transplant Pharmacology (Tacrolimus, Azoles)","Geriatric Polypharmacy Cascade (Ebersole & Hess)"] },
      { label:"👴 Geriatric", color:"#0891b2", topics:["Geriatric ICU Collapse Intelligence","Frailty Scoring & Protocol Modification","DOAC Management in Frail Elderly","Geriatric Polypharmacy & Orthostatic Syncope","ICU Delirium — Atypical Presentation Intelligence","Cardiac-Renal Frailty Spiral","Extreme Multi-Morbidity (8+ Conditions)"] },
      { label:"🌍 Community & Ethics", color:"#7c3aed", topics:["Advanced Epidemiology Intelligence","Nursing Legal & Ethics Intelligence","Nursing Research & Evidence-Based Practice","Disaster Medicine Ethics (Utilitarian Shift)","Crisis Standards of Care — Legal Framework","Triage Systems (START, SALT, SORT, CBRN)","Moral Injury Protocol for Nursing Staff"] },
      { label:"⚡ Extreme Scenarios", color:"#dc2626", topics:["Scenario Alpha — Obstetric-Toxicology-Trauma Collision","Scenario Bravo — Geriatric-Biohazard-Burns Paradox","Scenario Charlie — Crush-Renal-Psychiatric-Cyber","Scenario Delta — Oncology-Sepsis-Geriatric-ICU Collapse","Scenario Echo — Amniotic Fluid Embolism Collapse","Scenario Foxtrot — Clostridial Septic Abortion","Scenario India — TCA-Cocaine-Anticholinergic Triple Toxidrome","Scenario Juliet — Stroke-Anticoagulation-Haemorrhagic Transformation","Scenario Kilo — Sepsis-Haemorrhage-ESRD Lethal Triad","Scenario Lima — Transplant-Rejection-Aspergillosis","Scenario Mike — CBRN Organophosphate Mass Casualty","Custom Extreme Multi-Morbidity Scenario"] },
    ],
    sourceBooks:[
      {label:"Williams Obstetrics",color:"#a855f7"},{label:"ASAM Addiction",color:"#f97316"},
      {label:"Lehne Pharmacology",color:"#0ea5e9"},{label:"Ebersole Gerontology",color:"#d97706"},
      {label:"Potter & Perry",color:"#16a34a"},{label:"Ignatavicius MSN",color:"#0891b2"},
      {label:"Varcarolis Psych",color:"#6366f1"},{label:"Saunders NCLEX",color:"#dc2626"},
      {label:"Wong's Pediatrics",color:"#16a34a"},{label:"Beck & Polit Research",color:"#7c3aed"},
      {label:"ATLS 11e",color:"#dc2626"},{label:"NRP 9th Ed.",color:"#16a34a"},
    ],
    buildPrompt(mode,topic,difficulty,customNote){
      const base=`Topic: ${topic} | Difficulty: ${difficulty}${customNote?` | Special Focus: ${customNote}`:""}`;
      if(mode==="standard") return `${base}\n\n▶️ STANDARD NORCET/CCRN QUIZ — SPECIALTY ANALYZER (Architecture 1)\n\nGenerate a rigorous 10-question Clinical Intelligence quiz on: ${topic}\n\nBLUEPRINT (mandatory):\n• 4 Single-Best-Answer MCQs\n• 2 Extended Matching Questions (EMQ) — 6–8 option list + 2 scenarios each\n• 2 Short Answer Questions (SAQ)\n• 2 Case-Based Vignette Questions (multi-part)\n• Difficulty distribution: 2 Recall, 6 Application, 2 Analysis (Bloom's taxonomy)\n\nCLINICAL INTELLIGENCE FRAMEWORKS — embed in case-based questions:\n(a) PRIORITY LADDER — rank threats by time-to-mortality (1=Immediate <5 min → 5=Monitor)\n(b) CONFLICT MATRIX — Standard Protocol A vs Competing Condition B → Collision Mechanism → Safe Modified Strategy\n(c) SYSTEMS CASCADE — organ failure sequence using → arrows if wrong action taken\n\nFORMAT:\nQ[N]. ([Type] • [Difficulty])\n[Question stem]\n(A) [option]  (B) [option]  (C) [option]  (D) [option]\n✔️ ANSWER: [Letter]. [≥3 sentences citing pathophysiological mechanism and specific textbook]\n\nCITE at least one named textbook per explanation. TONE: Formal, technical. Zero vague explanations.`;
      if(mode==="exam") return `${base}\n\n▶️ TIMED MOCK EXAM — EXACT NORCET/AIIMS MAINS FORMAT (Architecture 2)\n\n${topic.toUpperCase()} — NORCET MOCK QUIZ | Time: 15 min | 10 Marks | Negative: −0.33\n\nPRESENT ALL 10 QUESTIONS FIRST. Answer key as SEPARATE SECTION at end.\n• ≥2 questions: drug dosage calculation or critical normal values\n• ≥2 questions: NEVER-DO knowledge (contraindicated intervention — mechanism required)\n• ≥3 questions: realistic clinical vignette scenarios\n• ≥1 question: TRAP answer 90% of competent non-specialists choose incorrectly\nDifficulty: ${difficulty}\n\nANSWER KEY FORMAT:\nQ[N]. ANSWER: [Letter]\nMechanism: [Full paragraph — correct + why distractors fail]\nClinical Conflict: [Competing condition creating trap]\nNORCET Intelligence Tip: [One high-yield discriminator]\n\nTONE: Cold, exam-standard. Zero preamble.`;
      if(mode==="elite") return `${base}\n\n▶️ GOD-TIER ELITE CONFLICT QUIZ (Architecture 3)\n\n10 ELITE questions on: ${topic}. 100% Application & Analysis. ZERO recall.\n\nMANDATORY EMBEDDINGS:\n• ≥2: PRIORITY LADDER (1=Immediate to 5=Monitor by time-to-mortality)\n• ≥2: CONFLICT MATRIX (Protocol A vs Condition B → Collision → Safe Modified Strategy)\n• ≥1: SYSTEMS CASCADE TIMELINE (organ failure → arrows, 0–6h and 6–24h phases)\n• ≥1: NEVER-DO MATRIX (fatal intervention 90% choose)\n• ≥1: POLYPHARMACY COLLISION with CYP450 or receptor-level mechanism\n• ≥1: MORBIDITY LEVEL CLASSIFICATION (Simple/Complex/Severe/Extreme — 15–30× mortality)\n\nEvery question DECEPTIVE — trap sounds correct to competent but non-specialist provider.\n\nANSWER FORMAT:\nCORRECT ANSWER: [Letter]\nMECHANISM: [≥4 sentences at receptor/organ/cascade level]\nCLINICAL CONFLICT ANALYSIS: [Competing conditions creating lethal trap]\nTEXTBOOK REFERENCE: [Specific citation]\nNORCET/CCRN INTELLIGENCE: [Elite discriminator]\n\nTONE: Military-directive. Zero hedging. Life-or-death stakes.`;
      if(mode==="godtier") return `${base}\n\n▶️ GOD-TIER SYSTEMS ANALYZER — MASS CASUALTY / DISASTER (Architecture 3 Enhanced)\n\nAnalyze: ${topic}\nRole: Military Medical Commander and Crisis Standards of Care Officer.\n\nMANDATORY SECTIONS:\n1. PRIORITY LADDER — 5 threats ranked 1=Immediate (<5 min) to 5=Monitor. Time-to-death + PARALLEL actions.\n2. RESOURCE DEPLETION TIMELINE — blood/ventilators/O₂/antidotes/personnel/PPE: when fails, rationing protocol, bridge strategy.\n3. ETHICAL COLLISION MATRIX (4 columns): Dilemma | Utilitarian | Duty-of-Care | Command Decision\n   Include: triage allocation, futile treatment, maternal vs fetal life, BLACK tag ethics, staff safety.\n4. INTERDISCIPLINARY COMMAND PROTOCOL — Primary/Secondary/Tertiary roles + escalation triggers.\n5. CLINICAL INTELLIGENCE QUIZ — 5 NORCET/CCRN questions with full mechanism + command intelligence note.\n\nTONE: Strategic command perspective. Decisions unambiguous and defensible under Crisis Standards of Care.`;
    },
  },

  // ─── 2. MEDICAL-SURGICAL NURSING ────────────────────────────────────────────
  {
    id:"msn", label:"Medical-Surgical Nursing", icon:"🏥",
    color:"#0d9488", tagline:"Ignatavicius · Lewis's MSN · Saunders · Davis's Med-Surg",
    systemPrompt:`You are an Elite Military-Grade Clinical Intelligence Officer AND NORCET/NCLEX Medical-Surgical Nursing Examination Architect. Author of the Clinical Intelligence Manual series (Volumes I–III — Medical-Surgical Edition).

PRIMARY TEXTBOOKS: Ignatavicius — Medical-Surgical Nursing: Concepts for Interprofessional Collaborative Care (2020, Elsevier) · Lewis's Medical-Surgical Nursing: Assessment and Management of Clinical Problems (Harding, Kwong, Hagler, 2023) · Saunders Comprehensive Review for NCLEX-RN (Silvestri, 2022) · Davis's Med-Surg Success, 3rd Edition · Potter & Perry's Fundamentals of Nursing (2023, Elsevier).

CLINICAL DOMAINS: Cardiovascular · Respiratory · Renal · Neurological · Endocrine · Gastrointestinal · Musculoskeletal · Oncology · Integumentary · Haematology · Infectious Disease · Perioperative · Critical Care · Fluid & Electrolytes · Acid-Base Balance.

NEVER-DO PRINCIPLE: Every trap embedded must be mechanistically lethal — haemodynamic collapse, respiratory failure, renal shutdown, or neurological herniation. Name it precisely. Every explanation MUST cite: (a) pathophysiological/pharmacological mechanism (b) textbook source (Ignatavicius/Lewis/Saunders/Davis's) (c) NORCET exam-specific discriminator.

CLINICAL CONFLICT FRAMEWORKS (embed in case-based questions): PRIORITY LADDER — rank 1=Immediate death to 5=Monitor by time-to-mortality · CONFLICT MATRIX — Standard Protocol A vs Competing Condition B → Collision → Safe Modified Strategy · SYSTEMS CASCADE — organ failure sequence → arrows if wrong action · NEVER-DO MATRIX — fatal intervention 90% of competent nurses would choose · POLYPHARMACY COLLISION — drug-disease/drug-drug interaction with hidden lethal trap.

TONE: Military-directive. Zero hedging. Technically precise. Life-or-death stakes. Zero vague responses.`,
    topicGroups:[
      { label:"❤️ Cardiovascular", color:"#dc2626", topics:["Cardiovascular System — Heart Failure & Cardiomyopathy","Acute Coronary Syndromes (STEMI, NSTEMI, Unstable Angina)","Cardiac Arrhythmias & Pacemakers","Hypertension & Hypertensive Crisis","Vascular Disorders — DVT, PAD, Aneurysm"] },
      { label:"🫁 Respiratory", color:"#0891b2", topics:["Respiratory System — COPD & Asthma","Pneumonia, TB & Atypical Pneumonias","ARDS & Mechanical Ventilation","Pulmonary Embolism & Pneumothorax","Respiratory Failure & Weaning"] },
      { label:"🫘 Renal", color:"#7c3aed", topics:["Renal System — AKI & CKD","Dialysis — Haemodialysis & Peritoneal","Urinary Tract Disorders & Infections","Fluid, Electrolyte & Acid-Base Balance"] },
      { label:"🧠 Neurological", color:"#6366f1", topics:["Neurological System — Stroke & TIA","Increased Intracranial Pressure & Herniation","Seizure Disorders & Status Epilepticus","Spinal Cord Injury & Neuromuscular Disorders","Meningitis, Encephalitis & CNS Infections"] },
      { label:"🍬 Endocrine & GI", color:"#d97706", topics:["Endocrine System — Diabetes & DKA/HHS","Thyroid & Adrenal Disorders","Gastrointestinal System — GI Bleeding","Hepatic Failure & Cirrhosis","Pancreatitis — Acute & Chronic"] },
      { label:"🔬 Multi-System", color:"#0d9488", topics:["Musculoskeletal System & Orthopaedic Nursing","Oncology & Cancer Nursing","Integumentary & Burns Nursing","Haematological Disorders","Infectious Diseases & Immunology","Perioperative Nursing Intelligence","Emergency & Critical Care","Mixed / Full MSN Syllabus"] },
    ],
    sourceBooks:[
      {label:"Ignatavicius MSN",color:"#0d9488"},{label:"Lewis's MSN 2023",color:"#0891b2"},
      {label:"Saunders NCLEX",color:"#dc2626"},{label:"Davis's Med-Surg",color:"#d97706"},
      {label:"Potter & Perry",color:"#16a34a"},
    ],
    buildPrompt(mode,topic,difficulty,customNote){
      return buildSharedPrompt("Medical-Surgical Nursing",mode,topic,difficulty,customNote,
        `\nDomain authority: Ignatavicius (2020, Elsevier) · Lewis's MSN (2023) · Saunders NCLEX-RN (2022) · Davis's Med-Surg Success (3e)\n`);
    },
  },

  // ─── 3. OBSTETRICS & GYNAECOLOGY ────────────────────────────────────────────
  {
    id:"obsgyn", label:"Obstetrics & Gynaecology", icon:"🤰",
    color:"#ec4899", tagline:"Lowdermilk · Williams Obstetrics · NRP 9th Ed. · ACOG 2024",
    systemPrompt:`You are an Elite Military-Grade Clinical Intelligence Officer AND NORCET/NCLEX Examination Architect specialising in Obstetrics, Gynaecology, Midwifery, and Neonatal Nursing. Author of the Clinical Intelligence Manual series (Volumes I–III).

PRIMARY SOURCES: Lowdermilk, Cashion, Alden et al. — Maternity & Women's Health Care, 13th Ed. (2023, Elsevier) [PRIMARY OBS/GYN AUTHORITY] · Cunningham et al. — Williams Obstetrics, 24th Ed. (McGraw-Hill) [OBSTETRIC EMERGENCIES] · Silvestri — Saunders Comprehensive Review NCLEX-RN (2022) · Potter & Perry's Fundamentals (2023, Elsevier) · Ignatavicius MSN (2020, Elsevier) · NRP 9th Edition (2025 AAP Updates) [NEONATAL RESUSCITATION AUTHORITY] · ACOG Guidelines 2024 (PPH, Preeclampsia, PPROM).

EXAMINATION INTELLIGENCE RULES: (1) Every question tests PRIORITY, SEQUENCING, or CONTRAINDICATION — never bare recall. (2) Every drug pharmacology answer MUST cite mechanism + contraindication + why the trap drug is lethal. (3) Every FHR question MUST use VEAL CHOP logic + cite Lowdermilk Ch.18 or Williams. (4) Every emergency: identify FIRST action vs DEFINITIVE action vs WHAT NOT TO DO. (5) Distractors must be clinically plausible — trap sounds correct to 80% of standard candidates. (6) Case-based: include vitals, gestational age, ≥1 pharmacological or delegation component. (7) NRP questions: 9th Edition — routine meconium suctioning ELIMINATED; PPV before compressions NON-NEGOTIABLE.

CLINICAL CONFLICT FRAMEWORKS: PRIORITY LADDER (1=Immediate death → 5=Monitor) · CONFLICT MATRIX (Protocol A vs Competing Condition B → Collision → Safe Modified Strategy) · SYSTEMS CASCADE (organ failure sequence → arrows) · NEVER-DO MATRIX (intervention 90% of average candidates choose — why it kills) · POLYPHARMACY COLLISION.

KEY NEVER-DOs: Methergine if BP ≥140/90 → haemorrhagic stroke · Carboprost in Asthma → fatal bronchospasm · NRP: PPV BEFORE compressions — ALWAYS · Late Decels: LION protocol (Left lateral, IV, O₂, Notify) · Turtle Sign: McRoberts + Suprapubic — NO fundal pressure · Cord Prolapse: elevate presenting part — DO NOT reinsert cord · Previa: NEVER digital vaginal exam · MgSO₄ toxicity: STOP infusion, Calcium Gluconate.

TONE: Military-directive. Zero hedging. Technically precise. Cite textbook + chapter with every rationale.`,
    topicGroups:[
      { label:"🤰 Antenatal", color:"#ec4899", topics:["Normal Pregnancy & Physiology","Antepartum Haemorrhage (Previa vs Abruption)","Hypertensive Disorders (Preeclampsia / Eclampsia / HELLP)","Gestational Diabetes & IDM Complications","Preterm Labour & Tocolysis","PPROM & Chorioamnionitis","High-Risk Pregnancy (IUGR, Multiple Gestation, Cardiac, Anaemia)","Ectopic Pregnancy & Early Pregnancy Loss"] },
      { label:"🏥 Intrapartum", color:"#f97316", topics:["Normal Labour & Fetal Heart Rate Monitoring","Cord Prolapse & Shoulder Dystocia","Uterine Rupture & VBAC Emergencies","Amniotic Fluid Embolism & Obstetric Emergencies","Oxytocin / Induction Pharmacology","Labour Analgesia & Anaesthesia"] },
      { label:"🌸 Postpartum", color:"#a855f7", topics:["Postpartum Haemorrhage & Uterotonic Pharmacology","Postpartum Infections & Thromboembolic Disease","Postpartum Mood Disorders (Blues / Depression / Psychosis)"] },
      { label:"👶 Neonatal", color:"#16a34a", topics:["Neonatal Resuscitation (NRP 9th Ed.)","Neonatal Jaundice & Birth Trauma","Neonatal Hypoglycaemia & IDM","Neonatal Respiratory Distress & Sepsis"] },
      { label:"💜 Gynaecology", color:"#7c3aed", topics:["Gynaecological Cancers & Screening","Menstrual Disorders & PCOS","Reproductive Tract Infections & STIs","Family Planning & Contraception","Infertility & ART"] },
      { label:"⚡ Mixed Drills", color:"#6366f1", topics:["Mixed / Full OBS + GYN Syllabus","NORCET Previous-Year Pattern Drill"] },
    ],
    sourceBooks:[
      {label:"Lowdermilk 13e",color:"#ec4899"},{label:"Williams Obstetrics",color:"#a855f7"},
      {label:"Saunders NCLEX",color:"#f97316"},{label:"Potter & Perry",color:"#0ea5e9"},
      {label:"NRP 9th Ed.",color:"#16a34a"},{label:"ACOG 2024",color:"#dc2626"},
      {label:"Ignatavicius MSN",color:"#d97706"},
    ],
    buildPrompt(mode,topic,difficulty,customNote){
      return buildSharedPrompt("Obstetrics & Gynaecology",mode,topic,difficulty,customNote,
        `\nDomain authority: Lowdermilk 13e (2023, Elsevier) · Williams Obstetrics 24e · NRP 9th Edition · ACOG Guidelines 2024\nFHR monitoring: VEAL CHOP logic. NRP: PPV before compressions NON-NEGOTIABLE. Uterotonic traps: cite Lowdermilk Ch. or Williams chapter.\n`);
    },
  },

  // ─── 4. PEDIATRIC NURSING ───────────────────────────────────────────────────
  {
    id:"pediatric", label:"Pediatric Nursing", icon:"👶",
    color:"#10b981", tagline:"Wong's · Nelson's 22e · Davis's Peds · Developmental Frameworks",
    systemPrompt:`You are an Elite Military-Grade Clinical Intelligence Officer AND NORCET/NCLEX Examination Architect specialising in Pediatric & Child Health Nursing. Author of the Clinical Intelligence Manual series (Volumes I–III).

PRIMARY SOURCES: Wong's Nursing Care of Infants and Children (Hockenberry & Wilson, 2018, Mosby) · Nelson Textbook of Pediatrics, 22nd Ed. (Kliegman et al., 2024, Elsevier) · Davis's Pediatric Success, 3rd Edition · Saunders Comprehensive Review NCLEX-RN (Silvestri, 2022) · Potter & Perry's Fundamentals (2023, Elsevier) · Varcarolis' Psychiatric-Mental Health Nursing (Halter, 2021) · INC B.Sc Nursing Curriculum — Pediatric/Child Health Nursing Syllabus.

OPERATIONAL MANDATE: Every explanation MUST: cite exact pathophysiological or pharmacological mechanism · reference specific textbook (Wong's/Nelson's/Davis Peds/Saunders) · name developmental framework for growth/development questions (Piaget/Erikson/Freud/Kohlberg) · embed Clinical Intelligence frameworks (Priority Ladder, Conflict Matrix, Systems Cascade, NEVER-DO Matrix) in case-based and elite questions · use NORCET exam-style language: Single-Best-Answer, scenario-based, clinical priority decisions.

PEDIATRIC-SPECIFIC TRAPS: Aspirin in viral illness → Reye's syndrome · Oxygen >40% in premature neonate → retinopathy of prematurity · Isotonic fluid bolus in DKA → cerebral oedema cascade · Digoxin toxicity: check apical pulse <1 min, withhold if <60 children / <90 infants · Intussusception: NEVER enema if peritonitis signs · Meningitis: lumbar puncture AFTER CT if papilloedema present.

TONE: Military-directive. Zero vague responses. Every trap mechanistically lethal. Developmental stages cited where relevant.`,
    topicGroups:[
      { label:"📏 Growth & Development", color:"#10b981", topics:["Growth & Development (Milestones, Erikson, Piaget)","Neonatal Nursing & Care","Immunisation & Preventive Pediatrics","Nutrition & Malnutrition in Children","Behavioural & Developmental Disorders (ADHD, Autism, ID)"] },
      { label:"🫁 Respiratory & CVS", color:"#0ea5e9", topics:["Respiratory Disorders in Children (Croup, Epiglottitis, Asthma)","Cardiovascular Disorders (CHD & Rheumatic Heart Disease)","Pediatric Emergencies & Critical Care"] },
      { label:"🍽️ GI & Renal", color:"#d97706", topics:["Gastrointestinal & Hepatic Disorders (Intussusception, Pyloric Stenosis)","Renal & Urological Disorders (Nephrotic, Wilm's Tumour)","Nutritional Deficiencies & Fluid Management"] },
      { label:"🧠 Neuro & Haem", color:"#7c3aed", topics:["Neurological Disorders in Children (Seizures, Meningitis, Hydrocephalus)","Haematological Disorders (Anaemia, Thalassaemia, Haemophilia, Leukaemia)","Endocrine & Metabolic Disorders","Musculoskeletal & Congenital Anomalies"] },
      { label:"🦠 Communicable", color:"#dc2626", topics:["Communicable Diseases in Children (Measles, Mumps, Chickenpox, Diphtheria)","Pediatric Sepsis & MODS","Mixed / Full Pediatric Syllabus"] },
    ],
    sourceBooks:[
      {label:"Wong's Pediatrics",color:"#10b981"},{label:"Nelson's 22e",color:"#0ea5e9"},
      {label:"Davis's Peds",color:"#d97706"},{label:"Saunders NCLEX",color:"#dc2626"},
      {label:"Potter & Perry",color:"#16a34a"},
    ],
    buildPrompt(mode,topic,difficulty,customNote){
      return buildSharedPrompt("Pediatric Nursing",mode,topic,difficulty,customNote,
        `\nDomain authority: Wong's Nursing Care (2018) · Nelson's Pediatrics 22e (2024, Elsevier) · Davis's Pediatric Success 3e\nDevelopmental frameworks: Piaget (cognitive) · Erikson (psychosocial) · Kohlberg (moral) — cite applicable stage.\nPediatric dosing: weight-based (mg/kg) mandatory in pharmacology questions.\n`);
    },
  },

  // ─── 5. PSYCHIATRIC & MENTAL HEALTH ─────────────────────────────────────────
  {
    id:"mentalhealth", label:"Psychiatric & Mental Health", icon:"🧠",
    color:"#8b5cf6", tagline:"Varcarolis · Townsend · ASAM · DSM-5 · MHA 2017",
    systemPrompt:`You are an Elite Military-Grade Psychiatric Intelligence Officer AND NORCET/NCLEX Mental Health Nursing Examination Architect. Author of the Clinical Psychiatric Intelligence Manual series (Volumes I–III).

PRIMARY SOURCES: Varcarolis' Foundations of Psychiatric-Mental Health Nursing: A Clinical Approach (Halter, 2021, Saunders Elsevier) · Psychiatric Mental Health Nursing: Concepts of Care in Evidence-Based Practice (Townsend & Morgan, 2017, F.A. Davis) · Psychiatric Mental Health Nursing Success (Davis) · Lehne's Pharmacology for Nursing Care, 10th Edition (Burchum & Rosenthal) · Davis's Pharmacology Success, 3rd Edition · Saunders Comprehensive Review NCLEX-RN (Silvestri, 2022) · ASAM Principles of Addiction Medicine (Miller & Peary, 2018, Wolters Kluwer) · Potter & Perry's Fundamentals (2023, Elsevier) · Mental Healthcare Act, 2017 (India) — NMHP, DMHP, legal framework.

PSYCHIATRIC CLINICAL INTELLIGENCE MANDATE: Every question grounded in DSM-5/ICD-10 diagnostic criteria and NORCET syllabus. Pharmacological questions must cite: mechanism of action · therapeutic window · drug-drug interactions · side effect profiles including EPS, NMS, serotonin syndrome, tardive dyskinesia, lithium toxicity. Legal/ethical questions cite MHA 2017 sections.

CLINICAL CONFLICT FRAMEWORKS FOR MENTAL HEALTH: PSYCHIATRIC PRIORITY LADDER (Safety > Airway > Circulation > Psychiatric stability > Therapeutic milieu) · PHARMACOLOGICAL CONFLICT MATRIX (lithium + NSAIDs, clozapine + benzodiazepines, MAOIs + SSRIs → Collision → Safe strategy) · PSYCHOPATHOLOGY CASCADE (untreated mania → psychosis → violence risk) · NEVER-DO MATRIX IN PSYCHIATRY (leaving suicidal patient alone, giving haloperidol to NMS patient, abrupt benzodiazepine withdrawal) · THERAPEUTIC COMMUNICATION TRAPS (non-therapeutic responses that sound therapeutic) · LEGAL-ETHICAL COLLISION (patient autonomy vs duty to protect — Tarasoff principle vs MHA 2017 sections).

TONE: Military-directive. Zero vague responses. Every trap mechanistically catastrophic. Cite DSM-5, pharmacodynamics, or legal doctrine per question.`,
    topicGroups:[
      { label:"🧬 Psychotic & Mood", color:"#8b5cf6", topics:["Schizophrenia Spectrum & Psychotic Disorders","Mood Disorders — Depression & Mania","Bipolar Disorder & Mood Stabilizers"] },
      { label:"😰 Anxiety & Personality", color:"#06b6d4", topics:["Anxiety, OCD & Trauma-Related Disorders (PTSD)","Personality Disorders","Eating, Sleep & Somatic Disorders"] },
      { label:"🍺 Addiction & Organic", color:"#f59e0b", topics:["Substance Use & Addiction Disorders","Dementia, Delirium & Organic Disorders","Child & Adolescent Psychiatry (ADHD, Autism, ID)"] },
      { label:"💊 Psychopharmacology", color:"#a855f7", topics:["Psychopharmacology — Antipsychotics & EPS/NMS/TD","Psychopharmacology — Antidepressants & Mood Stabilizers","ECT, Therapeutic Modalities & Milieu Therapy","MAOI Interactions & Hypertensive Crisis","Lithium Toxicity — Renal Spiral"] },
      { label:"⚖️ Communication & Legal", color:"#dc2626", topics:["Therapeutic Communication & Nurse-Patient Relationship","Crisis Intervention & Suicide Risk Management","Legal & Ethical Framework — MHA 2017 / NMHP / DMHP","Mental Status Examination & Psychiatric Assessment","Mixed / Full Mental Health Syllabus"] },
    ],
    sourceBooks:[
      {label:"Varcarolis 2021",color:"#8b5cf6"},{label:"Townsend & Morgan",color:"#06b6d4"},
      {label:"Lehne's Pharmacology",color:"#a855f7"},{label:"ASAM 2018",color:"#f59e0b"},
      {label:"Saunders NCLEX",color:"#dc2626"},{label:"MHA 2017",color:"#16a34a"},
    ],
    buildPrompt(mode,topic,difficulty,customNote){
      return buildSharedPrompt("Psychiatric & Mental Health Nursing",mode,topic,difficulty,customNote,
        `\nDomain authority: Varcarolis (Halter, 2021) · Townsend & Morgan (2017) · ASAM Principles (2018) · DSM-5 / ICD-10 · MHA 2017 (India)\nTherapeutic communication traps: non-therapeutic responses that sound therapeutic.\nPharmacology: EPS / NMS / Serotonin Syndrome / TD — distinguish mechanism-level.\nLegal: cite MHA 2017 sections for voluntary/involuntary admission, ECT consent, rights.\n`);
    },
  },

  // ─── 6. PHARMACOLOGY & ADDICTION ────────────────────────────────────────────
  {
    id:"pharmacology", label:"Pharmacology & Addiction", icon:"💊",
    color:"#00d4aa", tagline:"Lehne's · Davis's Pharma · ASAM · ISMP · AHA ACLS 2025",
    systemPrompt:`You are an Elite Military-Grade Clinical Pharmacology Intelligence Officer AND NORCET/NCLEX Examination Architect. Author of the Elite Pharmacology Master Engine.

PRIMARY SOURCES: Lehne's Pharmacology for Nursing Care, 10th Edition (Burchum & Rosenthal) · Davis's Pharmacology Success, 3rd Edition · ASAM Principles of Addiction Medicine (Miller & Peary, 2018, 4th Ed.) · 2025 AHA ACLS Guidelines (Defib BEFORE Epi is the new standard) · ISMP High-Alert Medication Directives (2024–2025 updates) · Saunders Comprehensive Review NCLEX-RN (Silvestri, 2022).

PHARMACOLOGICAL INTELLIGENCE MANDATE: Every explanation MUST cite: (a) pharmacokinetic/pharmacodynamic mechanism (b) receptor/enzyme/channel level action (c) CYP450 interactions where applicable (d) antidote specificity matrix (e) dose recalibration in organ failure. Emphasise: "Normal value in a toxic context" and "Antidote Specificity."

FATAL PHARMA TRAPS: Beta-blockers in cocaine/sympathomimetic toxicity → unopposed alpha → MI · Haloperidol in Lewy Body Dementia → fatal NMS · Succinylcholine in crush/rhabdomyolysis → hyperkalemic arrest · Amiodarone in TCA toxicity → additive Na+/K+ blockade → refractory VF · Flumazenil in TCA overdose → seizures · Physostigmine in TCA → seizures + asystole · Digoxin in AF + WPW → VF · Voriconazole + tacrolimus without 50-70% dose reduction → PRES · MAOI + serotonergic agents → serotonin syndrome · Clopidogrel + PPI (omeprazole) → CYP2C19 → reduced antiplatelet effect · NSAIDs + septic AKI → worsens renal failure + inhibits platelets · Phenytoin in D5W → precipitation → IV occlusion.

NEVER-DO MATRIX PRINCIPLE: Every trap must be mechanistically lethal — receptor collision, haemodynamic cascade, or organ failure pathway. Not merely inconvenient.

CLINICAL CONFLICT FRAMEWORKS: PRIORITY LADDER · CONFLICT MATRIX · POLYPHARMACY COLLISION (CYP450 level) · ANTIDOTE SPECIFICITY MATRIX (wrong antidote = second kill).

TONE: Military-directive. Zero hedging. Pharmacokinetically precise. Life-or-death stakes always evident.`,
    topicGroups:[
      { label:"⚗️ General & ANS", color:"#00d4aa", topics:["Pharmacokinetics (ADME) & Pharmacodynamics","Drug-Receptor Interactions & Routes of Administration","Autonomic Nervous System — Cholinergic & Adrenergic","Organophosphate Poisoning (SLUDGE) & Atropine/Pralidoxime","High-Alert Medications & Medication Calculations"] },
      { label:"❤️ Cardiovascular", color:"#ff4757", topics:["Digoxin Toxicity & Digibind Protocol","Antiarrhythmics (Class I–IV) & AHA ACLS 2025","Antihypertensives & Hypertensive Crisis Drugs","Nitrates & Cyanide Toxicity","Diuretics (Loop/Thiazide/K-sparing) & Electrolyte Traps","Anticoagulants — Heparin/LMWH/Warfarin/DOACs/Antidotes","Thrombolytics (tPA) — Window & Contraindications","Antiplatelets — Pre-op Hold Protocol"] },
      { label:"🧠 CNS & Psychiatric", color:"#5352ed", topics:["Antiepileptics — Phenytoin/D5W Trap","Status Epilepticus Protocol","Antipsychotics — EPS, NMS vs Serotonin Syndrome","Clozapine — Agranulocytosis & Myocarditis Monitoring","SSRIs & Serotonin Syndrome","TCAs — Sodium Bicarbonate for QRS Widening","MAOIs — Tyramine Crisis","Lithium Toxicity & Monitoring","Benzodiazepines & Flumazenil Trap"] },
      { label:"🦠 Anti-infective", color:"#2ed573", topics:["Aminoglycosides — Nephrotoxicity & Ototoxicity","Vancomycin — Red Man Syndrome","Fluoroquinolones — QT Prolongation & Tendon Rupture","Metronidazole — Disulfiram Reaction","Antitubercular (RIPE) — Pyridoxine for INH","Antifungals — Amphotericin B Toxicity","Antivirals — Acyclovir/HAART Interactions","Antimalarials — G6PD Haemolysis Trap"] },
      { label:"🔬 Endocrine & ICU", color:"#eccc68", topics:["Insulin Types — Glargine NEVER Mix Protocol","DKA Protocol — Anion Gap & Potassium Logic","Oral Hypoglycaemics — Metformin/Contrast Trap","Corticosteroids — Never Abrupt Stop","Thyroid Drugs — Levothyroxine Administration","IV KCl Safety Rules — Never IV Push","MgSO₄ Monitoring — DTR & Respiratory Rate","Addiction Medicine (ASAM) — OUD/AUD in ICU"] },
      { label:"⚡ Emergency & Mixed", color:"#ff6b6b", topics:["ICU Pharmacology Warfare (NEVER-DO Matrix)","CYP450 Drug Interactions Intelligence","Opioid Pharmacology & Naloxone Reversal Traps","Toxicology & Antidotes Master Table","Obstetric Emergency Drugs","Oncology & Chemotherapy Toxicity","Mixed / Full Pharmacology Syllabus"] },
    ],
    sourceBooks:[
      {label:"Lehne's 10e",color:"#00d4aa"},{label:"Davis's Pharma",color:"#2ed573"},
      {label:"ASAM 4th Ed.",color:"#f97316"},{label:"ISMP Directives",color:"#dc2626"},
      {label:"AHA ACLS 2025",color:"#ff4757"},{label:"Saunders NCLEX",color:"#0ea5e9"},
    ],
    buildPrompt(mode,topic,difficulty,customNote){
      return buildSharedPrompt("Pharmacology & Addiction Medicine",mode,topic,difficulty,customNote,
        `\nDomain authority: Lehne's 10e · Davis's Pharma 3e · ASAM 4th Ed. · ISMP 2024-2025 · AHA ACLS 2025\nEvery pharmacology answer: mechanism at receptor/enzyme/channel level + CYP450 interaction if relevant + antidote specificity.\nFatal traps: cite which receptor collision or cascade causes lethality — not just 'it is contraindicated'.\n`);
    },
  },

  // ─── 7. COMMUNITY HEALTH NURSING ────────────────────────────────────────────
  {
    id:"chn", label:"Community Health Nursing", icon:"🌍",
    color:"#0d9488", tagline:"Park's 23e · Stanhope & Lancaster · NHM · NTEP · RMNCH+A",
    systemPrompt:`You are an Elite Military-Grade Community Health Intelligence Officer AND NORCET/NCLEX Examination Architect. Author of the Clinical Intelligence Manual series (Volumes I–III).

FOREIGN / INTERNATIONAL SOURCES: Stanhope & Lancaster: Foundations of Nursing in the Community: Community-Oriented Practice, 4th ed. · Nies & McEwen: Community/Public Health Nursing (Saunders, 2014) · Potter & Perry's Fundamentals (2023, Elsevier) · Saunders NCLEX-RN (Silvestri, 2022) · Williams Obstetrics · Wong's Nursing Care of Infants and Children (2018) · Nelson Textbook of Pediatrics 22e (Kliegman, 2024) · Varcarolis' Psychiatric-Mental Health Nursing (Halter, 2021) · Lehne's Pharmacology (2022).

INDIAN / NORCET-SPECIFIC SOURCES: K. Park: Park's Textbook of Preventive & Social Medicine, 23rd ed. · B.T. Basavanthappa: A Textbook of Community Health Nursing · Annamma Jacob: MCQs in Community Health Nursing.

SCOPE: Community Health Nursing for NORCET Mains — Epidemiology · National Health Programs (NTEP, RMNCH+A, NVBDCP, NPCDCS, NHM) · Immunisation schedules (UIP, Mission Indradhanush) · Environmental health · MCH services · School health · Occupational health · Disaster management · PHC structure · MLHP/CHO · Health education · Nutrition programs · Family health nursing · Disease surveillance.

TRAP ENGINEERING: Use Park's data for Indian statistics. Use Stanhope/Nies for global public health frameworks. Every explanation MUST: cite epidemiological/programmatic mechanism · reference governing text or national program guideline · identify the NORCET trap: why the wrong option sounds correct.

TONE: Military-directive. Zero vague responses. Every trap mechanistically lethal to exam performance.`,
    topicGroups:[
      { label:"📊 Epidemiology", color:"#0d9488", topics:["Epidemiology & Disease Surveillance","Epidemiological Triad & Disease Causation","Screening Tests — Sensitivity, Specificity, PPV, NPV","Outbreak Investigation & Control"] },
      { label:"🏥 National Programs", color:"#dc2626", topics:["National Health Programs (NTEP / RMNCH+A / NVBDCP)","NPCDCS & Non-Communicable Disease Programs","National Health Mission (NHM) & NRHM","Mission Indradhanush & Intensified Immunisation","Universal Immunisation Programme (UIP) — Full Schedule","National Nutrition Programs (POSHAN, ICDS, Mid-Day Meal)"] },
      { label:"👶 MCH & School", color:"#16a34a", topics:["Maternal & Child Health (MCH) Services","Antenatal, Intranatal & Postnatal Care in Community","School Health Services","Adolescent Health — RKSK Program","Family Health Nursing & Home Visiting"] },
      { label:"🌿 Environment & Occupational", color:"#d97706", topics:["Environmental Health & Water Sanitation","Solid Waste & Biomedical Waste Management","Occupational Health — Common Occupational Diseases","Air Pollution & Environmental Hazards","PHC Structure, MLHP & CHO Roles"] },
      { label:"🎓 Health Education", color:"#7c3aed", topics:["Health Education, BCC & IEC Strategies","Community Mental Health","Disaster Management & Mass Casualty","Mixed / Full CHN Syllabus"] },
    ],
    sourceBooks:[
      {label:"Park's 23e",color:"#0d9488"},{label:"Stanhope & Lancaster",color:"#16a34a"},
      {label:"Nies & McEwen",color:"#0ea5e9"},{label:"Basavanthappa",color:"#d97706"},
      {label:"Saunders NCLEX",color:"#dc2626"},{label:"NHM Guidelines",color:"#7c3aed"},
    ],
    buildPrompt(mode,topic,difficulty,customNote){
      return buildSharedPrompt("Community Health Nursing",mode,topic,difficulty,customNote,
        `\nDomain authority: Park's Preventive & Social Medicine 23e · Stanhope & Lancaster 4e · Nies & McEwen (Saunders, 2014)\nIndian statistics: cite Park's for incidence/prevalence/targets. National programs: cite specific scheme, year, beneficiary criteria.\nImmunisation schedule: cite UIP cold chain requirements, vaccine intervals, contraindications — these are NORCET traps.\n`);
    },
  },

  // ─── 8. FUNDAMENTALS OF NURSING ─────────────────────────────────────────────
  {
    id:"fon", label:"Fundamentals of Nursing", icon:"📋",
    color:"#0891b2", tagline:"Potter & Perry 2023 · Saunders · Fundamentals Success · AHA BLS 2020",
    systemPrompt:`You are an Elite Military-Grade Clinical Intelligence Officer AND NORCET/NCLEX Examination Architect specializing in Fundamentals of Nursing. Author of the Clinical Intelligence Manual series (Volumes I–III).

PRIMARY SOURCES: Potter and Perry's Canadian Fundamentals of Nursing (Astle, Duggleby, Potter, Perry, Stockert, Hall — 2023, Elsevier) · Saunders Comprehensive Review NCLEX-RN (Silvestri, 2022) · Fundamentals Success: NCLEX-Style Q&A Review, 5th Edition · Ebersole and Hess' Gerontological Nursing & Healthy Aging (Touhy & Jett, 2013) · Ross & Wilson Anatomy and Physiology (Waugh & Grant, 2014).

DOMAIN EXPERTISE — FUNDAMENTALS: (1) Introduction to Nursing: history, theories, Nightingale philosophy, INC/SNC, ethics, code of conduct. (2) Nursing Process (ADPIE): assessment, NANDA diagnosis, care planning, implementation, evaluation, documentation. (3) Communication: therapeutic communication, barriers, SBAR, Kardex. (4) Infection Control: medical/surgical asepsis, sterilization, disinfection, standard precautions, HAIs, WHO 5 moments. (5) Basic Procedures: vital signs (normal values + deviations), bed-making, personal hygiene, patient positioning, body mechanics, restraints, pressure ulcer staging (NPUAP). (6) Nutrition & Diet Therapy: therapeutic diets, NGT/Ryle's tube, TPN, IV solutions (isotonic/hypertonic/hypotonic). (7) Medication Administration: all routes, injection landmarks (Z-track, VL, DG, VG), 10 Rights, IV therapy, blood transfusion reactions. (8) Wound Care: classification, healing phases (haemostasis/inflammation/proliferation/remodelling), pressure ulcer stages I–IV, dressing types. (9) Elimination: Foley catheterization, enema types (Fleet, tap water, soap suds, oil retention). (10) Oxygen Therapy: O₂ delivery devices with FiO₂ percentages, suction techniques. (11) Pre/Post-Operative Care: informed consent, anaesthesia types, post-op complications (atelectasis, DVT, dehiscence). (12) Patient Safety & Legal: patient rights, negligence vs malpractice, HIPAA equivalents, Morse fall scale, RACE/PASS. (13) First Aid & Emergency: BLS/CPR 2020 AHA protocols, Heimlich, Burns (Rule of Nines, Parkland formula), triage. (14) Death & Dying: Kübler-Ross 5 stages, palliative care, advance directives, DNR.

CLINICAL INTELLIGENCE FRAMEWORKS: PRIORITY LADDER: rank 1 (Immediate/Airway) → 5 (Monitor) using ABC+D framework · CONFLICT MATRIX: Standard Protocol A vs Competing Condition B → Collision → Safe Modified Strategy · SYSTEMS CASCADE: deterioration sequence → arrows if wrong nursing action · NEVER-DO MATRIX: lethal/harmful intervention 90% of nursing students would choose.

TONE: Military-directive. Formally precise. Technically uncompromising.`,
    topicGroups:[
      { label:"📖 Theory & Process", color:"#0891b2", topics:["Introduction to Nursing & Nursing Theories","Nursing Process (ADPIE) & Documentation","Therapeutic Communication & Nurse-Patient Relationship","Patient Safety, Legal & Ethical Aspects"] },
      { label:"🦠 Infection & Safety", color:"#dc2626", topics:["Infection Control, Asepsis & Sterilization","Vital Signs & Physical Assessment","Patient Positioning, Body Mechanics & Mobility","Personal Hygiene & Skin Integrity","Pressure Ulcers — Staging & Prevention"] },
      { label:"💉 Medication & Nutrition", color:"#d97706", topics:["Medication Administration & Drug Calculations","Nutrition, NGT/Ryle's Tube & TPN","Fluid, Electrolyte & IV Therapy","Wound Care, Dressings & Healing Phases"] },
      { label:"🏥 Procedures", color:"#7c3aed", topics:["Urinary Catheterization & Elimination","Oxygen Therapy & Respiratory Nursing","Pre-Operative & Post-Operative Nursing","BLS/CPR, First Aid & Emergency Nursing","Death, Dying & Palliative Care","Mixed / Full Fundamentals Syllabus"] },
    ],
    sourceBooks:[
      {label:"Potter & Perry 2023",color:"#0891b2"},{label:"Saunders NCLEX",color:"#dc2626"},
      {label:"Fundamentals Success",color:"#d97706"},{label:"Ebersole & Hess",color:"#7c3aed"},
      {label:"AHA BLS 2020",color:"#dc2626"},{label:"Ross & Wilson",color:"#16a34a"},
    ],
    buildPrompt(mode,topic,difficulty,customNote){
      return buildSharedPrompt("Fundamentals of Nursing",mode,topic,difficulty,customNote,
        `\nDomain authority: Potter & Perry's Fundamentals (2023, Elsevier) · Saunders NCLEX-RN (2022) · Fundamentals Success 5e\nProcedure questions: cite specific injection landmarks, WHO 5 moments steps, O₂ device FiO₂ values — these are NORCET traps.\nLegal questions: distinguish negligence vs malpractice vs assault vs battery. Cite Patient Bill of Rights.\n`);
    },
  },

  // ─── 9. NUTRITION, BIOCHEMISTRY & MICROBIOLOGY ───────────────────────────────
  {
    id:"nbm", label:"Nutrition, Biochemistry & Microbiology", icon:"🧬",
    color:"#6366f1", tagline:"NBM for Nurses · Timberlake · Burton's Microbiology 11e · Saunders",
    systemPrompt:`You are an Elite Military-Grade Clinical Intelligence Officer AND NORCET/NCLEX Examination Architect. Author of the Clinical Intelligence Manual series (Volumes I–III).

NUTRITION SOURCES: Nutrition and Biochemistry for Nurses (comprehensive nursing nutrition reference) · Timberlake & Orgill — Chemistry: General, Organic, and Biological (2019) · Saunders NCLEX-RN (Silvestri, 2022) · Potter & Perry's Fundamentals (2023, Elsevier) · Ebersole & Hess' Gerontological Nursing (Touhy & Jett) · Wong's Nursing Care of Infants and Children (2018) · Williams Obstetrics.

BIOCHEMISTRY SOURCES: Nutrition and Biochemistry for Nurses (biochemistry sections) · Timberlake & Orgill (2019) · Saunders NCLEX-RN (2022) · Potter & Perry (2023, Elsevier).

MICROBIOLOGY SOURCES: Burton's Microbiology for the Health Sciences, Enhanced 11th Edition (Engelkirk, Duben-Engelkirk, Fader) · Saunders NCLEX-RN (2022) · Potter & Perry (2023, Elsevier) · Williams Obstetrics · Wong's (2018).

CORE DIRECTIVE: Every explanation MUST cite pathophysiological or biochemical mechanisms from the above texts. Zero vague responses. Every distractor must be clinically plausible. Every trap must be mechanistically lethal — not merely inconvenient.

CLINICAL INTELLIGENCE FRAMEWORKS: PRIORITY LADDER · CONFLICT MATRIX · SYSTEMS CASCADE · NEVER-DO MATRIX.

TONE: Military-directive. Technically uncompromising. Life-or-death stakes where applicable.`,
    topicGroups:[
      { label:"🥗 Nutrition", color:"#16a34a", topics:["Macronutrients (Carbohydrates, Proteins, Fats)","Vitamins — Fat-Soluble (A, D, E, K)","Vitamins — Water-Soluble (B-Complex, C)","Minerals — Ca, Fe, I, Zn, P","Nutritional Deficiency Diseases","Nutritional Assessment (ABCD Method)","Therapeutic Nutrition (Diabetes, Renal, Cardiac)","Dietary Requirements & RDA","Enteral & Parenteral Nutrition (TPN)","Special Diets — Pregnancy, Infants, Elderly","Food Safety & Food-Borne Illnesses","Mixed / Full Nutrition Syllabus"] },
      { label:"🧬 Biochemistry", color:"#6366f1", topics:["Biomolecules — Carbohydrates, Proteins, Lipids","Enzymes — Kinetics, Inhibition, Cofactors","Carbohydrate Metabolism — Glycolysis, TCA, HMP","Lipid Metabolism — Beta-Oxidation, Ketone Bodies","Protein Metabolism — Urea Cycle, Transamination","Nucleic Acids & Protein Synthesis","Vitamins & Coenzymes (Biochemical Roles)","Hormones — Classification & Mechanism","Acid-Base Balance & Blood Buffers","Clinical Biochemistry — LFT, KFT, Normal Values","Inborn Errors of Metabolism","Mixed / Full Biochemistry Syllabus"] },
      { label:"🧫 Microbiology", color:"#f97316", topics:["General Microbiology & Classification","Bacteriology — Gram Staining, Culture, Morphology","Important Pathogens — Staph, Strep, TB, Salmonella","Virology — HIV, Hepatitis, Influenza, Rabies","Mycology — Candida, Aspergillus, Cryptococcus","Parasitology — Malaria, Amoeba, Helminths","Sterilization & Disinfection Methods","Immunity & Immunology — Innate vs Adaptive","Vaccines & Immunisation (National Schedule)","Hospital-Acquired Infections (HAI) & Isolation","Diagnostic Microbiology — Specimen & Sensitivity","Mixed / Full Microbiology Syllabus"] },
    ],
    sourceBooks:[
      {label:"NBM for Nurses",color:"#6366f1"},{label:"Burton's Micro 11e",color:"#f97316"},
      {label:"Timberlake & Orgill",color:"#16a34a"},{label:"Saunders NCLEX",color:"#dc2626"},
      {label:"Potter & Perry",color:"#0ea5e9"},
    ],
    buildPrompt(mode,topic,difficulty,customNote){
      // Detect sub-subject for domain-specific instruction
      const domain = topic.toLowerCase().includes("vitamin")||topic.toLowerCase().includes("macronutr")||topic.toLowerCase().includes("nutrit")||topic.toLowerCase().includes("diet")||topic.toLowerCase().includes("enteral")||topic.toLowerCase().includes("food") ? "Nutrition"
        : topic.toLowerCase().includes("enzyme")||topic.toLowerCase().includes("metaboli")||topic.toLowerCase().includes("biomolecul")||topic.toLowerCase().includes("biochem")||topic.toLowerCase().includes("lipid")||topic.toLowerCase().includes("protein metabol")||topic.toLowerCase().includes("nucleic")||topic.toLowerCase().includes("urea")||topic.toLowerCase().includes("inborn") ? "Biochemistry"
        : "Microbiology";
      return buildSharedPrompt(`${domain} (NORCET)`,mode,topic,difficulty,customNote,
        `\nDomain authority: ${domain==="Nutrition"?"Nutrition and Biochemistry for Nurses · Timberlake & Orgill (2019)":domain==="Biochemistry"?"Nutrition and Biochemistry for Nurses · Timberlake & Orgill (2019)":"Burton's Microbiology for the Health Sciences, Enhanced 11e"} · Saunders NCLEX-RN (2022)\n`);
    },
  },

  // ─── 10. RESEARCH & NURSING MANAGEMENT ──────────────────────────────────────
  {
    id:"research", label:"Research & Nursing Management", icon:"📊",
    color:"#0ea5e9", tagline:"Polit & Beck · Gray & Grove · Houser · POSDCORB · Donabedian",
    systemPrompt:`You are simultaneously: An Elite Military-Grade Nursing Research Intelligence Officer AND NORCET/NCLEX Examination Architect · An Expert Biostatistics Commander · An Elite Nursing Research Methodologist trained on AIIMS examination standards · A Nursing Management & Administration Command Officer. Author of the Clinical-Research Intelligence Manual.

PRIMARY REFERENCES: [P] Polit & Beck — Nursing Research: Generating and Assessing Evidence for Nursing Practice (2017 & 2022) · [G] Gray & Grove — Burns and Grove's The Practice of Nursing Research · [H] Houser — Nursing Research: Reading, Using, and Creating Evidence · [R] Rentala — Basics in Nursing Research and Biostatistics · [S] Saunders NCLEX-RN (Silvestri, 2022) · [NI] Nursing Research Society of India Textbook.

DOMAIN MASTERY:
NURSING RESEARCH: Research types (quantitative vs qualitative) · Designs (RCT, cohort, case-control, cross-sectional, longitudinal) · Hypothesis (H₀/H₁, Type I & II errors, power) · Sampling (probability vs non-probability) · Data collection (validity, reliability, Cronbach α) · Statistics: descriptive (mean/median/mode/SD/skewness) and inferential (t-test, ANOVA, chi-square, Pearson r, regression) · Scales of measurement (Nominal/Ordinal/Interval/Ratio) · Biostatistics (sensitivity, specificity, PPV, NPV, RR, OR, NNT, p-value, CI) · EBP (PICO, hierarchy of evidence I–VII, Iowa/Stetler/ACE Star models) · Research ethics (Belmont Report, IRB, anonymity vs confidentiality, scientific misconduct FFP).

NURSING MANAGEMENT: Leadership theories (transformational, transactional, situational, servant, laissez-faire) · POSDCORB management functions · Staffing & scheduling (nurse-patient ratios, workload calculation) · Quality management (TQM, CQI, Donabedian model structure-process-outcome, sentinel event, root cause analysis) · Budgeting (zero-based, incremental, FTEs, cost containment) · Legal & ethical (nursing acts, scope of practice, malpractice vs negligence, NPC, NABH) · Communication (SBAR, ISBAR, delegation, interdisciplinary team) · Disaster management (START, SALT triage, ICS, mass casualty) · Infection control administration (HICC, HAI surveillance, biomedical waste).

EXAM TRAP ENGINEERING: Statistical test selection by variable type is the #1 NORCET trap. Research design identification traps: cohort vs cross-sectional vs quasi-experimental vs RCT. Management traps: delegation vs assignment. No vague explanations — every statement cites a principle, mechanism, or source code [P/G/H/R/S/NI].`,
    topicGroups:[
      { label:"🔬 Research Design", color:"#0ea5e9", topics:["Research Types & Designs (RCT, Cohort, Case-Control, Cross-Sectional)","Hypothesis, Variables & Types of Error (H₀, H₁, Type I & II, Power)","Sampling Techniques (Probability vs Non-Probability)","Data Collection, Validity & Reliability (Cronbach α, Pilot Study)","Qualitative Research (Phenomenology, Grounded Theory, Ethnography)"] },
      { label:"📈 Statistics", color:"#7c3aed", topics:["Descriptive Statistics (Mean, Median, Mode, SD, Skewness)","Inferential Statistics & Test Selection (t-test, ANOVA, Chi-Square, Regression)","Scales of Measurement (Nominal, Ordinal, Interval, Ratio)","Biostatistics & Epidemiology (RR, OR, NNT, Sensitivity, Specificity)","Evidence-Based Practice & Research Utilisation (PICO, Hierarchy of Evidence)","Research Ethics (Belmont Report, Consent, IRB, Scientific Misconduct)"] },
      { label:"🏢 Management", color:"#16a34a", topics:["Nursing Management Functions (POSDCORB, Planning, Organising)","Leadership Theories & Styles (Transformational, Situational, Servant)","Staffing, Scheduling & Workforce Management","Quality Assurance & Patient Safety (TQM, CQI, Donabedian, Sentinel Event)","Budgeting, Finance & Resource Management","Legal, Ethical & Professional Issues (Malpractice, Delegation, Scope)","Communication & Coordination (SBAR, Interdisciplinary Team, Delegation)","Disaster Management & Mass Casualty (START Triage, ICS, Hospital Plan)","Infection Control Administration (HICC, HAI, Biomedical Waste)","Mixed — Research & Management Integration"] },
    ],
    sourceBooks:[
      {label:"Polit & Beck 2022",color:"#0ea5e9"},{label:"Gray & Grove",color:"#7c3aed"},
      {label:"Houser",color:"#16a34a"},{label:"Rentala",color:"#d97706"},
      {label:"Saunders NCLEX",color:"#dc2626"},{label:"NRSI Textbook",color:"#6366f1"},
    ],
    buildPrompt(mode,topic,difficulty,customNote){
      return buildSharedPrompt("Research & Nursing Management",mode,topic,difficulty,customNote,
        `\nDomain authority: [P] Polit & Beck (2017/2022) · [G] Gray & Grove · [H] Houser · [R] Rentala · [S] Saunders NCLEX-RN (2022) · [NI] NRSI Textbook\nCite source codes [P/G/H/R/S/NI] in every rationale.\nStatistical test selection questions: identify variable type (Nominal/Ordinal/Interval/Ratio) + group structure as the decision factor.\nManagement questions: cite delegation principles, POSDCORB, or Donabedian model where applicable.\n`);
    },
  },

  // ─── 11. ANATOMY & PHYSIOLOGY ────────────────────────────────────────────────
  {
    id:"anatomy", label:"Anatomy & Physiology", icon:"🫀",
    color:"#f59e0b", tagline:"Ross & Wilson · Ashalatha · Inderbir Singh · Saunders",
    systemPrompt:`You are an Elite Military-Grade Clinical Intelligence Officer AND NORCET/NCLEX Examination Architect specializing in Anatomy & Physiology for Nursing. Author of the Clinical Intelligence Manual series (Volumes I–III).

PRIMARY SOURCES: Ross & Wilson Anatomy and Physiology in Health and Illness (Waugh & Grant, 2014, Churchill Livingstone) · PR Ashalatha's Textbook of Anatomy & Physiology for Nurses · Inderbir Singh's Anatomy for Nurses · Saunders Comprehensive Review NCLEX-RN (Silvestri, 2022) · Ebersole and Hess' Gerontological Nursing & Healthy Aging (Touhy & Jett) · Wong's Nursing Care of Infants and Children (2018) · Potter & Perry's Fundamentals (2023, Elsevier) · Williams Obstetrics.

OPERATIONAL MANDATE: You generate rigorous, clinically precise Q&A for NORCET and NCLEX examinations on Anatomy & Physiology. Every explanation MUST: cite exact pathophysiological mechanism · reference specific textbook (Ross & Wilson / Ashalatha / Saunders) · embed Clinical Intelligence frameworks (Priority Ladder, Conflict Matrix, Systems Cascade, NEVER-DO Matrix) in case-based and elite questions · use NORCET exam-style language: Single-Best-Answer, scenario-based, clinical priority decisions.

CLINICAL INTELLIGENCE FRAMEWORKS: PRIORITY LADDER · CONFLICT MATRIX · SYSTEMS CASCADE · NEVER-DO MATRIX.

TONE: Military-directive. Zero vague responses. Every trap mechanistically lethal. Applied physiology — not just descriptive anatomy.`,
    topicGroups:[
      { label:"❤️ Cardiovascular & Respiratory", color:"#dc2626", topics:["Cardiovascular System — Heart Structure, Conduction, Cardiac Cycle","Cardiovascular Physiology — Haemodynamics, Blood Pressure","Respiratory System — Structure & Mechanics of Breathing","Respiratory Physiology — Gas Exchange, O₂ and CO₂ Transport","Blood & Haematology"] },
      { label:"🧠 Nervous & Endocrine", color:"#7c3aed", topics:["Nervous System — Central & Peripheral Anatomy","Nervous System Physiology — Action Potentials, Reflexes","Endocrine System — Glands, Hormones, Feedback Loops","Sensory Organs — Eye, Ear, Skin Receptors"] },
      { label:"🍽️ GI & Renal", color:"#d97706", topics:["Digestive System — Structure & Alimentary Physiology","Hepatic & Pancreatic Physiology","Renal System — Nephron Structure & Urine Formation","Renal Physiology — GFR, Tubular Reabsorption, Acid-Base"] },
      { label:"🦴 Musculoskeletal & Reproductive", color:"#10b981", topics:["Musculoskeletal System — Bones, Joints, Muscle Physiology","Reproductive System — Male & Female Anatomy","Reproductive Physiology — Menstrual Cycle, Fertilisation","Cell Biology & Homeostasis","Mixed / Full A&P Syllabus"] },
    ],
    sourceBooks:[
      {label:"Ross & Wilson",color:"#f59e0b"},{label:"Ashalatha A&P",color:"#d97706"},
      {label:"Inderbir Singh",color:"#dc2626"},{label:"Saunders NCLEX",color:"#0ea5e9"},
      {label:"Potter & Perry",color:"#16a34a"},
    ],
    buildPrompt(mode,topic,difficulty,customNote){
      return buildSharedPrompt("Anatomy & Physiology",mode,topic,difficulty,customNote,
        `\nDomain authority: Ross & Wilson A&P (2014, Churchill Livingstone) · Ashalatha's A&P for Nurses · Inderbir Singh's Anatomy for Nurses · Saunders NCLEX-RN (2022)\nApplied physiology focus — not purely descriptive anatomy. Explain how structural abnormality drives clinical presentation.\n`);
    },
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
//  UI COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════
function formatText(text) {
  let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" style="color:#7c3aed;text-decoration:underline;font-weight:bold;">$1</a>');
  return <div dangerouslySetInnerHTML={{ __html: formatted }} />;
}

function MessageBubble({ msg }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 40); return () => clearTimeout(t); }, []);
  const isUser = msg.role === "user";
  return (
    <div style={{ display:"flex", justifyContent: isUser ? "flex-end" : "flex-start", marginBottom:18, opacity:visible?1:0, transform:visible?"translateY(0)":"translateY(10px)", transition:"opacity 0.35s ease, transform 0.35s ease" }}>
      {!isUser && (
        <div style={{ width:38, height:38, borderRadius:"50%", flexShrink:0, marginRight:10, marginTop:4, background:"linear-gradient(135deg,#7c3aed,#dc2626,#0ea5e9)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:900, color:"#fff", letterSpacing:0.5, boxShadow:"0 4px 16px rgba(124,58,237,0.45)" }}>AI</div>
      )}
      <div style={{ maxWidth:"82%", background: isUser ? "linear-gradient(135deg,#ede9fe,#dbeafe,#e0f2fe)" : "#ffffff", border: isUser ? "1px solid rgba(124,58,237,0.2)" : "1px solid #e5e7eb", borderRadius: isUser ? "20px 4px 20px 20px" : "4px 20px 20px 20px", padding:"14px 18px", color: isUser ? "#3730a3" : "#1e293b", fontSize:13.5, lineHeight:1.8, fontFamily:"'Courier New','Consolas',monospace", whiteSpace:"pre-wrap", wordBreak:"break-word", boxShadow: isUser ? "0 2px 12px rgba(124,58,237,0.15)" : "0 2px 16px rgba(0,0,0,0.07)" }}>
        {isUser ? msg.content : formatText(msg.content)}
      </div>
    </div>
  );
}

function TypingIndicator({ statusText }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
      <div style={{ width:38, height:38, borderRadius:"50%", flexShrink:0, background:"linear-gradient(135deg,#7c3aed,#dc2626,#0ea5e9)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:900, color:"#fff", boxShadow:"0 4px 16px rgba(124,58,237,0.45)" }}>AI</div>
      <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:"4px 20px 20px 20px", padding:"14px 20px", display:"flex", gap:7, alignItems:"center", boxShadow:"0 2px 16px rgba(0,0,0,0.07)" }}>
        {[0,1,2].map(i => (
          <div key={i} style={{ width:8, height:8, borderRadius:"50%", background:`hsl(${250+i*35},75%,55%)`, animation:`bounce 1.3s ease-in-out ${i*0.18}s infinite` }}/>
        ))}
        <span style={{ fontSize:11, color:"#7c3aed", marginLeft:6, fontFamily:"'Courier New',monospace" }}>{statusText}</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  MAIN APP
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedMode, setSelectedMode]       = useState(null);
  const [selectedGroup, setSelectedGroup]     = useState(0);
  const [selectedTopic, setSelectedTopic]     = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState(DIFFICULTY[1]);
  const [customNote, setCustomNote]           = useState("");
  const [messages, setMessages]               = useState([]);
  const [input, setInput]                     = useState("");
  const [loadingText, setLoadingText]         = useState("");
  const [phase, setPhase]                     = useState("home"); // "home" | "config" | "chat"
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages, loadingText]);

  // When subject changes, reset group and topic to subject's first group/topic
  function selectSubject(subj) {
    setSelectedSubject(subj);
    setSelectedGroup(0);
    setSelectedTopic(subj.topicGroups[0].topics[0]);
    setSelectedMode(null);
    setPhase("config");
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  MULTI-SOURCE CLINICAL INTELLIGENCE API ORCHESTRATOR
  //  Priority cascade: Elsevier → PubMed → RxNorm → OpenFDA → MedlinePlus
  //  All sources are free / open-access. Results are merged into a unified
  //  literature context block that enriches every Gemini generation call.
  // ═══════════════════════════════════════════════════════════════════════════

  // ── 1. ELSEVIER SCOPUS (primary — may fail due to CORS / key limits) ─────────
  async function callElsevierAPI(searchQuery) {
    const ELSEVIER_API_KEY = "a7841bae1d570c6983fc2863c14a2432";
    try {
      const sanitizedQuery = searchQuery.replace(/[()&|]/g, ' ').trim();
      const params = new URLSearchParams({
        query: `TITLE-ABS-KEY(${sanitizedQuery})`,
        count: "5",
        apiKey: ELSEVIER_API_KEY,
        httpAccept: "application/json",
      });
      const res = await fetch(`https://api.elsevier.com/content/search/scopus?${params.toString()}`, { method:"GET" });
      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
      const data = await res.json();
      const entries = data['search-results']?.entry || [];
      if (!entries.length) return null;
      let text = `📚 **Elsevier Scopus Literature:**\n`;
      entries.slice(0,4).forEach((e, i) => {
        const title   = e['dc:title'] || "Untitled";
        const journal = e['prism:publicationName'] || "Unknown Journal";
        const date    = e['prism:coverDate'] || "N/A";
        const link    = e['link']?.find(l => l['@ref']==='scopus')?.['@href'] || "#";
        text += `${i+1}. **${title}** — *${journal} (${date})* [View](${link})\n`;
      });
      return text;
    } catch (err) {
      console.warn("[Elsevier]", err.message);
      return null;
    }
  }

  // ── 2. PUBMED / NCBI E-UTILITIES (free, no key needed) ───────────────────────
  async function callPubMedAPI(searchQuery) {
    try {
      const q = encodeURIComponent(searchQuery + " nursing");
      // Step A: get IDs
      const searchRes = await fetch(
        `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${q}&retmax=5&retmode=json&sort=relevance`,
        { signal: AbortSignal.timeout(8000) }
      );
      if (!searchRes.ok) throw new Error(`PubMed search HTTP ${searchRes.status}`);
      const searchData = await searchRes.json();
      const ids = searchData?.esearchresult?.idlist || [];
      if (!ids.length) return null;

      // Step B: fetch summaries
      const summaryRes = await fetch(
        `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${ids.join(",")}&retmode=json`,
        { signal: AbortSignal.timeout(8000) }
      );
      if (!summaryRes.ok) throw new Error(`PubMed summary HTTP ${summaryRes.status}`);
      const summaryData = await summaryRes.json();
      const result = summaryData?.result || {};

      let text = `🔬 **PubMed / NCBI Evidence Base (${searchData.esearchresult.count} records found):**\n`;
      ids.slice(0,4).forEach((id, i) => {
        const art = result[id];
        if (!art) return;
        const title   = art.title || "Untitled";
        const journal = art.fulljournalname || art.source || "Unknown Journal";
        const year    = art.pubdate?.split(" ")[0] || "N/A";
        const authors = art.authors?.slice(0,2).map(a=>a.name).join(", ") || "Unknown";
        text += `${i+1}. **${title.replace(/<[^>]+>/g,"")}**\n   ${authors} — *${journal} (${year})* [PubMed](https://pubmed.ncbi.nlm.nih.gov/${id}/)\n`;
      });
      return text;
    } catch (err) {
      console.warn("[PubMed]", err.message);
      return null;
    }
  }

  // ── 3. NLM RXNORM / RXNAV (free, for pharmacology topics) ───────────────────
  async function callRxNormAPI(topic) {
    // Only fire for pharmacology/drug-related topics
    const pharmaKeywords = ["drug","pharmacol","medication","rx","antibiotic","antihypertensive","analgesic","opioid","anticoagulant","diuretic","beta-blocker","insulin","steroid","antiemetic","sedative","antipsychotic","antidepressant","antifungal","antiviral","vaccine","dose","toxicity","overdose","cyp450","interaction","pharmacokine"];
    const topicLower = topic.toLowerCase();
    const isPharmaTopic = pharmaKeywords.some(k => topicLower.includes(k));
    if (!isPharmaTopic) return null;

    try {
      // Extract likely drug name keywords
      const words = topic.split(/\s+/).filter(w => w.length > 4).slice(0,2).join(" ");
      const searchRes = await fetch(
        `https://rxnav.nlm.nih.gov/REST/drugs.json?name=${encodeURIComponent(words)}`,
        { signal: AbortSignal.timeout(6000) }
      );
      if (!searchRes.ok) throw new Error(`RxNorm HTTP ${searchRes.status}`);
      const data = await searchRes.json();
      const groups = data?.drugGroup?.conceptGroup || [];
      const drugs = groups.flatMap(g => g.conceptProperties || []).filter(Boolean).slice(0,6);
      if (!drugs.length) return null;

      let text = `💊 **NLM RxNorm Drug Intelligence (Pharmacology Context):**\n`;
      drugs.forEach((d,i) => {
        text += `${i+1}. **${d.name}** (RxCUI: ${d.rxcui}) — Class: ${d.tty || "N/A"}\n`;
      });
      text += `   *(Source: NLM RxNav — https://rxnav.nlm.nih.gov/)*\n`;
      return text;
    } catch (err) {
      console.warn("[RxNorm]", err.message);
      return null;
    }
  }

  // ── 4. OPENFDA (free, adverse events + drug labels) ──────────────────────────
  async function callOpenFDAAPI(topic) {
    const pharmaKeywords = ["drug","pharmacol","medication","adverse","toxicity","overdose","recall","label","interaction","antibiotic","antihypertensive","analgesic","opioid","anticoagulant","diuretic","beta-blocker","insulin","steroid"];
    const topicLower = topic.toLowerCase();
    if (!pharmaKeywords.some(k => topicLower.includes(k))) return null;

    try {
      // Search drug labels for relevant indications
      const query = encodeURIComponent(topic.replace(/[^a-zA-Z0-9 ]/g,'').trim().split(' ').slice(0,3).join(' '));
      const res = await fetch(
        `https://api.fda.gov/drug/label.json?search=indications_and_usage:"${query}"&limit=3`,
        { signal: AbortSignal.timeout(7000) }
      );
      if (!res.ok) throw new Error(`OpenFDA HTTP ${res.status}`);
      const data = await res.json();
      const results = data?.results || [];
      if (!results.length) return null;

      let text = `⚠️ **OpenFDA Drug Safety Intelligence:**\n`;
      results.slice(0,3).forEach((r, i) => {
        const brand  = r.openfda?.brand_name?.[0] || "N/A";
        const generic= r.openfda?.generic_name?.[0] || "N/A";
        const warnings = r.warnings_and_cautions?.[0]?.replace(/<[^>]+>/g,'').substring(0,160) || r.warnings?.[0]?.replace(/<[^>]+>/g,'').substring(0,160) || "See label";
        text += `${i+1}. **${brand}** (${generic})\n   ⚡ Warnings: ${warnings}...\n`;
      });
      text += `   *(Source: OpenFDA — https://api.fda.gov/)*\n`;
      return text;
    } catch (err) {
      console.warn("[OpenFDA]", err.message);
      return null;
    }
  }

  // ── 5. MEDLINEPLUS CONNECT (free, patient/condition education) ────────────────
  async function callMedlinePlusAPI(topic) {
    try {
      const query = encodeURIComponent(topic.replace(/[^a-zA-Z0-9 ]/g,'').trim());
      const res = await fetch(
        `https://connect.medlineplus.gov/application?mainSearchCriteria.v.cs=2.16.840.1.113883.6.90&mainSearchCriteria.v.dn=${query}&knowledgeResponseType=application/json&informationRecipient.languageCode.c=en`,
        { signal: AbortSignal.timeout(7000) }
      );
      if (!res.ok) throw new Error(`MedlinePlus HTTP ${res.status}`);
      const data = await res.json();
      const entries = data?.feed?.entry || [];
      if (!entries.length) return null;

      let text = `📖 **MedlinePlus Patient Education Links (NLM):**\n`;
      entries.slice(0,3).forEach((e, i) => {
        const title   = e.title?._value || "Untitled";
        const summary = e.summary?._value?.replace(/<[^>]+>/g,'').substring(0,120) || "";
        const link    = e.link?.[0]?.href || "#";
        text += `${i+1}. **${title}**: ${summary}... [Read](${link})\n`;
      });
      text += `   *(Source: MedlinePlus — https://medlineplus.gov/)*\n`;
      return text;
    } catch (err) {
      console.warn("[MedlinePlus]", err.message);
      return null;
    }
  }

  // ── MASTER ORCHESTRATOR — runs all APIs in parallel, merges results ──────────
  async function fetchAllClinicalSources(topic, onStatus) {
    onStatus("🔍 Querying Elsevier Scopus + PubMed + RxNorm + OpenFDA...");

    // Run all in parallel for speed
    const [elsevierResult, pubmedResult, rxnormResult, fdaResult, medlineResult] = await Promise.allSettled([
      callElsevierAPI(topic + " clinical nursing"),
      callPubMedAPI(topic),
      callRxNormAPI(topic),
      callOpenFDAAPI(topic),
      callMedlinePlusAPI(topic),
    ]);

    const getValue = r => (r.status === "fulfilled" ? r.value : null);

    const elsevier = getValue(elsevierResult);
    const pubmed   = getValue(pubmedResult);
    const rxnorm   = getValue(rxnormResult);
    const fda      = getValue(fdaResult);
    const medline  = getValue(medlineResult);

    // Build source status summary
    const sourceStatus = [
      elsevier ? "✅ Elsevier Scopus" : "⚠️ Elsevier (unavailable)",
      pubmed   ? "✅ PubMed/NCBI"     : "⚠️ PubMed (no results)",
      rxnorm   ? "✅ NLM RxNorm"      : null,
      fda      ? "✅ OpenFDA"         : null,
      medline  ? "✅ MedlinePlus"     : null,
    ].filter(Boolean).join(" · ");

    const sections = [elsevier, pubmed, rxnorm, fda, medline].filter(Boolean);

    if (!sections.length) {
      return {
        displayText: `⚠️ All external APIs unavailable. Proceeding with embedded clinical intelligence databanks.\n*(Sources: Potter & Perry · Ignatavicius · Saunders · Lehne's · Ross & Wilson)*`,
        contextText: "No external API data available. Use embedded clinical knowledge only.",
        sourceStatus,
      };
    }

    const displayText = `🌐 **CLINICAL INTELLIGENCE SOURCES LOADED** [${sourceStatus}]\n\n` + sections.join("\n");
    const contextText = sections.join("\n");

    return { displayText, contextText, sourceStatus };
  }

  // ── GEMINI API ───────────────────────────────────────────────────────────────
  async function callGemini(history, systemPrompt) {
    const apiKey = ""; // API key is provided by the execution environment at runtime
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
    
    // Map existing history format to Gemini format
    const contents = history.map(msg => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }]
    }));

    const payload = {
      contents,
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      }
    };
    
    let retries = 0; 
    const maxRetries = 5; 
    const delays = [1000, 2000, 4000, 8000, 16000];
    let responseText = "⚠️ No response received.";
    
    while (retries <= maxRetries) {
      try {
        const res = await fetch(url, { 
          method:"POST", 
          headers:{"Content-Type":"application/json"}, 
          body:JSON.stringify(payload) 
        });
        
        if (!res.ok) {
           throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "⚠️ Empty response.";
        break;
      } catch (error) {
        if (retries === maxRetries) { 
          responseText = "⚠️ Connection error. Please check your connection and retry."; 
          break; 
        }
        await new Promise(r => setTimeout(r, delays[retries]));
        retries++;
      }
    }
    setMessages(prev => [...prev, { role:"assistant", content:responseText }]);
  }

  // ── LAUNCH SESSION ───────────────────────────────────────────────────────────
  async function handleLaunch() {
    if (!selectedMode || !selectedSubject) return;
    const prompt = selectedSubject.buildPrompt(selectedMode.id, selectedTopic, selectedDifficulty, customNote);

    setMessages([{ role:"user", content:`🎯 MODE: ${selectedMode.label}\n📚 TOPIC: ${selectedTopic}\n⚡ DIFFICULTY: ${selectedDifficulty}${customNote ? `\n📝 FOCUS: ${customNote}` : ""}` }]);
    setPhase("chat");

    // Fetch all clinical sources in parallel
    const { displayText, contextText, sourceStatus } = await fetchAllClinicalSources(
      `${selectedTopic} ${customNote || "clinical nursing"}`,
      (msg) => setLoadingText(msg)
    );

    setMessages(prev => [...prev, { role:"assistant", content:displayText }]);

    setLoadingText("⚡ Synthesizing Clinical Intelligence Engine...");

    const finalPrompt = `${prompt}

MULTI-SOURCE CLINICAL LITERATURE CONTEXT [${sourceStatus}]:
The following evidence was retrieved from peer-reviewed and regulatory databases. 
Integrate relevant data points, drug names, safety warnings, or clinical themes into your question vignettes, traps, and rationales where clinically appropriate:

${contextText}

Now generate the full quiz/analysis as specified above.`;

    await callGemini([{ role:"user", content:finalPrompt }], selectedSubject.systemPrompt);
    setLoadingText("");
  }

  // ── FOLLOW-UP SEND ───────────────────────────────────────────────────────────
  async function handleSend() {
    if (!input.trim() || loadingText) return;
    const userMsg = input.trim();
    setInput("");
    const newMessages = [...messages, { role:"user", content:userMsg }];
    setMessages(newMessages);
    setLoadingText("Formulating response...");
    const prompt = selectedSubject.buildPrompt(selectedMode.id, selectedTopic, selectedDifficulty, customNote);
    const apiHistory = [{ role:"user", content:prompt }];
    for (let i = 1; i < newMessages.length; i++) {
      apiHistory.push({ role:newMessages[i].role, content:newMessages[i].content });
    }
    await callGemini(apiHistory, selectedSubject.systemPrompt);
    setLoadingText("");
  }

  // ── RESET ────────────────────────────────────────────────────────────────────
  function handleReset() {
    setPhase("home");
    setSelectedSubject(null);
    setSelectedMode(null);
    setMessages([]);
    setInput("");
    setCustomNote("");
    setSelectedGroup(0);
  }

  function handleBackToConfig() {
    setPhase("config");
    setMessages([]);
    setLoadingText("");
    setInput("");
  }

  const currentGroup   = selectedSubject ? selectedSubject.topicGroups[selectedGroup] : null;
  const diffStyle      = DIFF_STYLES[selectedDifficulty] || DIFF_STYLES["Intermediate"];

  const QUICK_PROMPTS = [
    "Generate 5 more questions on this topic",
    "Explain the Conflict Matrix for this scenario",
    "Show the full Systems Cascade",
    "Give the NEVER-DO list with mechanisms",
    "Generate a God-Tier mass casualty version",
    "Compare NORCET vs NCLEX approach to this topic",
    "Show the Priority Ladder for this case",
    "Identify pharmacological warfare traps here",
  ];

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#f8f6ff 0%,#f0f4ff 25%,#f0f8ff 55%,#f0fff8 80%,#fff8f0 100%)", color:"#1e293b", fontFamily:"'Trebuchet MS','Segoe UI',system-ui,sans-serif", display:"flex", flexDirection:"column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;500;600;700&display=swap');
        *{box-sizing:border-box;}
        ::-webkit-scrollbar{width:4px;}
        ::-webkit-scrollbar-track{background:rgba(0,0,0,0.04);}
        ::-webkit-scrollbar-thumb{background:rgba(124,58,237,0.35);border-radius:2px;}
        @keyframes bounce{0%,100%{transform:translateY(0);opacity:0.4}50%{transform:translateY(-5px);opacity:1}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shimmer{0%{background-position:0% 50%}100%{background-position:200% 50%}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        button{cursor:pointer;font-family:'Rajdhani','Trebuchet MS',sans-serif;}
        textarea,input{font-family:'Rajdhani','Trebuchet MS',sans-serif;}
        textarea:focus,input:focus{outline:none;}
        .subj-card:hover{transform:translateY(-3px);box-shadow:0 8px 28px rgba(0,0,0,0.12)!important;}
        .mode-btn:hover{transform:translateY(-2px);}
        .topic-pill:hover{background:rgba(0,0,0,0.07)!important;transform:scale(1.02);}
        .quick-btn:hover{background:rgba(124,58,237,0.1)!important;border-color:rgba(124,58,237,0.35)!important;color:#6d28d9!important;}
        input::placeholder,textarea::placeholder{color:#94a3b8;opacity:1;}
      `}</style>

      {/* ══════════ HEADER ══════════ */}
      <div style={{ padding:"12px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", background:"rgba(255,255,255,0.92)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(124,58,237,0.15)", position:"sticky", top:0, zIndex:100, boxShadow:"0 2px 20px rgba(0,0,0,0.08)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <div style={{ width:46, height:46, borderRadius:12, background:"linear-gradient(135deg,#7c3aed,#dc2626,#0ea5e9)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, animation:"float 3.5s ease-in-out infinite", boxShadow:"0 0 20px rgba(124,58,237,0.6)" }}>⚕</div>
          <div>
            <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:16, fontWeight:900, letterSpacing:4, lineHeight:1, background:"linear-gradient(90deg,#c084fc,#f87171,#38bdf8,#86efac)", backgroundSize:"300% 100%", animation:"shimmer 5s linear infinite", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>NORCET UNIFIED</div>
            <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:9, letterSpacing:5, color:"#64748b", marginTop:2 }}>CLINICAL INTELLIGENCE ENGINE · 11 SUBJECTS</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          {phase==="chat" && selectedMode && (
            <>
              {selectedSubject && <div style={{ padding:"3px 12px", borderRadius:20, background:`${selectedSubject.color}15`, border:`1px solid ${selectedSubject.color}40`, color:selectedSubject.color, fontSize:10, fontWeight:700, letterSpacing:1, fontFamily:"'Orbitron',sans-serif" }}>{selectedSubject.icon} {selectedSubject.label}</div>}
              <div style={{ padding:"3px 12px", borderRadius:20, background:`${selectedMode.color}15`, border:`1px solid ${selectedMode.color}40`, color:selectedMode.color, fontSize:10, fontWeight:700, letterSpacing:1, fontFamily:"'Orbitron',sans-serif" }}>{selectedMode.label}</div>
              <button onClick={handleBackToConfig} style={{ padding:"5px 14px", borderRadius:8, background:"rgba(14,165,233,0.07)", border:"1px solid rgba(14,165,233,0.25)", color:"#0284c7", fontSize:11, fontWeight:600, letterSpacing:1, transition:"all 0.2s" }}>⚙ CONFIG</button>
              <button onClick={handleReset} style={{ padding:"5px 14px", borderRadius:8, background:"rgba(220,38,38,0.07)", border:"1px solid rgba(220,38,38,0.25)", color:"#dc2626", fontSize:11, fontWeight:600, letterSpacing:1, transition:"all 0.2s" }}>↩ RESET</button>
            </>
          )}
          {phase==="config" && (
            <button onClick={handleReset} style={{ padding:"5px 14px", borderRadius:8, background:"rgba(100,116,139,0.07)", border:"1px solid rgba(100,116,139,0.2)", color:"#64748b", fontSize:11, fontWeight:600, letterSpacing:1 }}>← SUBJECTS</button>
          )}
        </div>
      </div>

      {/* ══════════ HOME — SUBJECT SELECTOR ══════════ */}
      {phase==="home" && (
        <div style={{ flex:1, padding:"40px 20px 60px", maxWidth:1100, margin:"0 auto", width:"100%", animation:"fadeUp 0.5s ease" }}>
          <div style={{ textAlign:"center", marginBottom:48 }}>
            <div style={{ fontSize:11, letterSpacing:6, color:"#64748b", marginBottom:14, fontFamily:"'Orbitron',sans-serif" }}>AIIMS NORCET · NCLEX-RN · CCRN · ADVANCED CLINICAL SERIES</div>
            <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:38, fontWeight:900, letterSpacing:4, lineHeight:1.05, background:"linear-gradient(135deg,#c084fc 0%,#f87171 30%,#fbbf24 55%,#38bdf8 80%,#86efac 100%)", backgroundSize:"300% 100%", animation:"shimmer 6s linear infinite", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", marginBottom:8 }}>MASTER Q&A SYSTEM</div>
            <div style={{ color:"#64748b", fontSize:12, letterSpacing:4, fontFamily:"'Orbitron',sans-serif", marginBottom:8 }}>DUAL API · ELSEVIER SCOPUS + GEMINI AI · 11 SUBJECTS</div>
            <div style={{ color:"#94a3b8", fontSize:11 }}>Select a subject to begin your clinical intelligence session</div>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:16 }}>
            {SUBJECT_REGISTRY.map(subj => (
              <button key={subj.id} className="subj-card" onClick={() => selectSubject(subj)} style={{
                padding:"20px 22px", borderRadius:16, textAlign:"left",
                background:"#ffffff", border:`1.5px solid ${subj.color}25`,
                transition:"all 0.22s",
                boxShadow:`0 2px 12px rgba(0,0,0,0.06), 0 0 0 0 ${subj.color}00`,
              }}>
                <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
                  <div style={{ width:44, height:44, borderRadius:12, background:`${subj.color}15`, border:`1.5px solid ${subj.color}35`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>{subj.icon}</div>
                  <div>
                    <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:12, fontWeight:700, letterSpacing:1.5, color:subj.color, lineHeight:1.2 }}>{subj.label}</div>
                    <div style={{ fontSize:9.5, color:"#94a3b8", marginTop:3, fontFamily:"'Rajdhani',sans-serif", fontWeight:500 }}>{subj.topicGroups.reduce((a,g)=>a+g.topics.length,0)} topics</div>
                  </div>
                </div>
                <div style={{ fontSize:11, color:"#64748b", lineHeight:1.5, fontFamily:"'Rajdhani',sans-serif", fontWeight:500 }}>{subj.tagline}</div>
                <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginTop:10 }}>
                  {subj.topicGroups.slice(0,4).map(g => (
                    <span key={g.label} style={{ fontSize:9, color:g.color, background:`${g.color}12`, border:`1px solid ${g.color}30`, borderRadius:10, padding:"2px 8px", fontFamily:"'Rajdhani',sans-serif", fontWeight:600 }}>{g.label}</span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ══════════ CONFIG SCREEN ══════════ */}
      {phase==="config" && selectedSubject && (
        <div style={{ flex:1, padding:"28px 20px 60px", maxWidth:960, margin:"0 auto", width:"100%", animation:"fadeUp 0.4s ease" }}>

          {/* Subject banner */}
          <div style={{ display:"flex", alignItems:"center", gap:16, padding:"16px 22px", borderRadius:16, background:"#ffffff", border:`1.5px solid ${selectedSubject.color}25`, boxShadow:"0 2px 12px rgba(0,0,0,0.06)", marginBottom:32 }}>
            <div style={{ width:52, height:52, borderRadius:14, background:`${selectedSubject.color}15`, border:`2px solid ${selectedSubject.color}40`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26 }}>{selectedSubject.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:16, fontWeight:700, letterSpacing:2, color:selectedSubject.color }}>{selectedSubject.label.toUpperCase()}</div>
              <div style={{ fontSize:11, color:"#64748b", marginTop:3, fontFamily:"'Rajdhani',sans-serif" }}>{selectedSubject.tagline}</div>
            </div>
            <div style={{ display:"flex", gap:5, flexWrap:"wrap", justifyContent:"flex-end" }}>
              {selectedSubject.sourceBooks.map(b => (
                <span key={b.label} style={{ fontSize:9, color:b.color, background:`${b.color}12`, border:`1px solid ${b.color}30`, borderRadius:12, padding:"2px 8px", fontFamily:"'Rajdhani',sans-serif", fontWeight:600 }}>{b.label}</span>
              ))}
            </div>
          </div>

          {/* STEP 1 — Architecture */}
          <div style={{ marginBottom:28 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
              <div style={{ width:26, height:26, borderRadius:"50%", background:"linear-gradient(135deg,#7c3aed,#c084fc)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:12, fontWeight:700, boxShadow:"0 2px 8px rgba(124,58,237,0.4)" }}>1</div>
              <div style={{ fontSize:11, fontWeight:700, color:"#6d28d9", letterSpacing:3, fontFamily:"'Orbitron',sans-serif" }}>SELECT PROMPT ARCHITECTURE</div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              {MODES.map(mode => {
                const active = selectedMode?.id === mode.id;
                return (
                  <button key={mode.id} className="mode-btn" onClick={() => setSelectedMode(mode)} style={{ background: active ? `linear-gradient(135deg,${mode.color}14,${mode.accent}09)` : "#ffffff", border:`1.5px solid ${active ? mode.color : "rgba(0,0,0,0.09)"}`, borderRadius:14, padding:"14px 16px", textAlign:"left", transition:"all 0.22s", position:"relative", overflow:"hidden", boxShadow: active ? `0 0 22px ${mode.glow},0 2px 10px rgba(0,0,0,0.06)` : "0 1px 4px rgba(0,0,0,0.06)" }}>
                    {active && <div style={{ position:"absolute", top:0, left:0, width:3, height:"100%", background:`linear-gradient(to bottom,${mode.color},${mode.accent})` }}/>}
                    <div style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
                      <div style={{ width:38, height:38, borderRadius:10, flexShrink:0, background:`${mode.color}14`, border:`1.5px solid ${active ? mode.color : mode.color+"40"}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, color:mode.color }}>{mode.icon}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:4, flexWrap:"wrap" }}>
                          <span style={{ fontFamily:"'Orbitron',sans-serif", fontSize:12, fontWeight:700, letterSpacing:1.5, color:mode.color }}>{mode.label}</span>
                          <span style={{ fontSize:8, color:mode.color, letterSpacing:0.5, fontWeight:700, background:`${mode.color}14`, border:`1px solid ${mode.color}40`, borderRadius:4, padding:"1px 6px", fontFamily:"'Rajdhani',sans-serif" }}>{mode.subtitle}</span>
                        </div>
                        <div style={{ fontSize:11, color:"#475569", lineHeight:1.55, fontFamily:"'Rajdhani',sans-serif", fontWeight:500 }}>{mode.description}</div>
                      </div>
                      <div style={{ width:20, height:20, borderRadius:"50%", flexShrink:0, background: active ? mode.color : "rgba(0,0,0,0.04)", border:`1.5px solid ${active ? mode.color : "rgba(0,0,0,0.1)"}`, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:10, fontWeight:900, transition:"all 0.2s" }}>{active ? "✓" : ""}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2 — Subject Groups & Topics */}
          <div style={{ marginBottom:24 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
              <div style={{ width:26, height:26, borderRadius:"50%", background:"linear-gradient(135deg,#0ea5e9,#38bdf8)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:12, fontWeight:700 }}>2</div>
              <div style={{ fontSize:11, fontWeight:700, color:"#0284c7", letterSpacing:3, fontFamily:"'Orbitron',sans-serif" }}>SELECT SUBJECT & TOPIC</div>
            </div>
            {/* Group tabs */}
            <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:12, padding:"10px", background:"rgba(0,0,0,0.03)", borderRadius:12, border:"1px solid rgba(0,0,0,0.07)" }}>
              {selectedSubject.topicGroups.map((g, i) => (
                <button key={i} onClick={() => { setSelectedGroup(i); setSelectedTopic(g.topics[0]); }} style={{ padding:"5px 12px", borderRadius:18, background: selectedGroup===i ? `${g.color}18` : "transparent", border:`1px solid ${selectedGroup===i ? g.color : "rgba(0,0,0,0.1)"}`, color: selectedGroup===i ? g.color : "#64748b", fontSize:10.5, fontWeight:600, transition:"all 0.18s", fontFamily:"'Rajdhani',sans-serif", letterSpacing:0.5 }}>{g.label}</button>
              ))}
            </div>
            {/* Topic pills */}
            {currentGroup && (
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {currentGroup.topics.map(t => (
                  <button key={t} className="topic-pill" onClick={() => setSelectedTopic(t)} style={{ padding:"6px 13px", borderRadius:18, background: selectedTopic===t ? `${currentGroup.color}16` : "#ffffff", border:`1px solid ${selectedTopic===t ? currentGroup.color : "rgba(0,0,0,0.09)"}`, color: selectedTopic===t ? currentGroup.color : "#475569", fontSize:11, fontWeight: selectedTopic===t ? 700 : 500, transition:"all 0.18s", fontFamily:"'Rajdhani',sans-serif", boxShadow: selectedTopic===t ? `0 0 12px ${currentGroup.color}22` : "0 1px 3px rgba(0,0,0,0.05)" }}>{t}</button>
                ))}
              </div>
            )}
          </div>

          {/* STEP 3 — Difficulty */}
          <div style={{ marginBottom:24 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
              <div style={{ width:26, height:26, borderRadius:"50%", background:"linear-gradient(135deg,#f59e0b,#fbbf24)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:12, fontWeight:700 }}>3</div>
              <div style={{ fontSize:11, fontWeight:700, color:"#b45309", letterSpacing:3, fontFamily:"'Orbitron',sans-serif" }}>DIFFICULTY LEVEL</div>
            </div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {DIFFICULTY.map(d => {
                const ds = DIFF_STYLES[d]; const active = selectedDifficulty===d;
                return (
                  <button key={d} onClick={() => setSelectedDifficulty(d)} style={{ padding:"8px 18px", borderRadius:10, background: active ? `${ds.color}16` : "#ffffff", border:`1.5px solid ${active ? ds.color : "rgba(0,0,0,0.09)"}`, color: active ? ds.color : "#475569", fontSize:12, fontWeight: active ? 700 : 500, transition:"all 0.2s", fontFamily:"'Rajdhani',sans-serif", letterSpacing:0.5, boxShadow: active ? `0 0 14px ${ds.color}22` : "0 1px 3px rgba(0,0,0,0.05)" }}>{d}</button>
                );
              })}
            </div>
          </div>

          {/* STEP 4 — Special Focus */}
          <div style={{ marginBottom:28 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
              <div style={{ width:26, height:26, borderRadius:"50%", background:"linear-gradient(135deg,#a855f7,#c084fc)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:12, fontWeight:700 }}>4</div>
              <div style={{ fontSize:11, fontWeight:700, color:"#6d28d9", letterSpacing:3, fontFamily:"'Orbitron',sans-serif" }}>SPECIAL FOCUS <span style={{ color:"#94a3b8", fontWeight:400, letterSpacing:0, textTransform:"none", fontFamily:"'Rajdhani',sans-serif", fontSize:11 }}>(optional)</span></div>
            </div>
            <input value={customNote} onChange={e => setCustomNote(e.target.value)}
              placeholder="e.g. 'Emphasise CYP450 drug interactions' or 'Focus on geriatric frailty angle' or 'Include CBRN mass casualty'"
              style={{ width:"100%", padding:"11px 15px", background:"#ffffff", border:"1.5px solid rgba(0,0,0,0.12)", borderRadius:11, color:"#1e293b", fontSize:13, fontFamily:"'Rajdhani',sans-serif", transition:"border-color 0.2s" }}
              onFocus={e => e.target.style.borderColor="rgba(124,58,237,0.5)"}
              onBlur={e => e.target.style.borderColor="rgba(0,0,0,0.12)"}
            />
          </div>

          {/* Selected topic display */}
          <div style={{ padding:"10px 16px", background:"rgba(0,0,0,0.03)", borderRadius:10, border:"1px solid rgba(0,0,0,0.07)", display:"flex", gap:10, alignItems:"center", marginBottom:20 }}>
            <span style={{ fontSize:10, color:"#6d28d9", fontFamily:"'Orbitron',sans-serif", letterSpacing:2 }}>SELECTED TOPIC:</span>
            <span style={{ fontSize:12, color:currentGroup?.color || "#6d28d9", fontWeight:700, fontFamily:"'Rajdhani',sans-serif" }}>{selectedTopic}</span>
          </div>

          {/* LAUNCH BUTTON */}
          <button onClick={handleLaunch} disabled={!selectedMode} style={{
            width:"100%", padding:"18px",
            background: selectedMode ? `linear-gradient(135deg,${selectedMode.color},${selectedMode.accent})` : "rgba(0,0,0,0.05)",
            border: selectedMode ? "none" : "1px solid rgba(0,0,0,0.1)",
            borderRadius:14, color: selectedMode ? "#fff" : "#94a3b8",
            fontFamily:"'Orbitron',sans-serif", fontSize:15, fontWeight:900, letterSpacing:4,
            transition:"all 0.25s", cursor: selectedMode ? "pointer" : "not-allowed",
            boxShadow: selectedMode ? `0 8px 28px ${selectedMode?.glow || "rgba(0,0,0,0.2)"}` : "none",
          }}>
            {selectedMode ? `⚡ DEPLOY ${selectedMode.label}` : "SELECT AN ARCHITECTURE TO PROCEED"}
          </button>

          {/* Morbidity scale reference */}
          <div style={{ marginTop:24, padding:"14px 18px", background:"rgba(220,38,38,0.04)", borderRadius:12, border:"1px solid rgba(220,38,38,0.12)" }}>
            <div style={{ fontSize:10, color:"#dc2626", fontWeight:700, letterSpacing:3, fontFamily:"'Orbitron',sans-serif", marginBottom:10 }}>⚠ MULTI-MORBIDITY MORTALITY SCALE</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:8 }}>
              {[["SIMPLE 1-2 conditions","1.0× mortality","#16a34a"],["COMPLEX 3-4 conditions","2.5-4× mortality","#d97706"],["SEVERE 5-7 conditions","6-10× mortality","#dc2626"],["EXTREME 8+ conditions","15-30× — protocols LETHAL","#7c3aed"]].map(([label,val,col])=>(
                <div key={label} style={{ padding:"9px 12px", borderRadius:10, background:`${col}08`, border:`1px solid ${col}25` }}>
                  <div style={{ fontSize:10, color:col, fontWeight:700, fontFamily:"'Orbitron',sans-serif", marginBottom:4 }}>{label}</div>
                  <div style={{ fontSize:12, color:col, fontWeight:600, fontFamily:"'Rajdhani',sans-serif" }}>{val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════ CHAT SCREEN ══════════ */}
      {phase==="chat" && selectedSubject && selectedMode && (
        <div style={{ flex:1, display:"flex", flexDirection:"column", maxWidth:920, margin:"0 auto", width:"100%" }}>

          {/* Session bar */}
          <div style={{ padding:"8px 20px", background:"rgba(255,255,255,0.95)", borderBottom:"1px solid rgba(0,0,0,0.08)", display:"flex", gap:8, alignItems:"center", flexWrap:"wrap", boxShadow:"0 1px 8px rgba(0,0,0,0.04)" }}>
            <span style={{ fontSize:11, fontWeight:700, color:selectedSubject.color, background:`${selectedSubject.color}12`, border:`1.5px solid ${selectedSubject.color}30`, borderRadius:20, padding:"2px 11px" }}>{selectedSubject.icon} {selectedSubject.label}</span>
            <span style={{ fontSize:11, fontWeight:700, color:selectedMode.color, background:`${selectedMode.color}12`, border:`1.5px solid ${selectedMode.color}30`, borderRadius:20, padding:"2px 11px" }}>{selectedMode.label}</span>
            <span style={{ fontSize:11, color:diffStyle.color, background:diffStyle.bg, border:`1px solid ${diffStyle.border}`, borderRadius:20, padding:"2px 11px", fontWeight:700 }}>{selectedDifficulty}</span>
            <span style={{ fontSize:10, color:"#94a3b8" }}>·</span>
            <span style={{ fontSize:11, color:"#64748b", maxWidth:380, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", fontFamily:"'Rajdhani',sans-serif" }}>{selectedTopic}</span>
          </div>

          {/* Messages */}
          <div style={{ flex:1, overflowY:"auto", padding:"24px 20px 8px", background:"#f8fafc" }}>
            {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}
            {loadingText && <TypingIndicator statusText={loadingText} />}
            <div ref={bottomRef} />
          </div>

          {/* Quick prompts */}
          {!loadingText && messages.length > 0 && (
            <div style={{ padding:"8px 20px", borderTop:"1px solid rgba(0,0,0,0.07)", background:"rgba(248,250,252,0.95)", display:"flex", gap:6, flexWrap:"wrap" }}>
              {QUICK_PROMPTS.map(q => (
                <button key={q} className="quick-btn" onClick={() => setInput(q)} style={{ background:"rgba(0,0,0,0.04)", border:"1px solid rgba(0,0,0,0.09)", borderRadius:20, padding:"5px 12px", color:"#475569", fontSize:10.5, fontWeight:500, transition:"all 0.18s", fontFamily:"'Rajdhani',sans-serif" }}>{q}</button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ padding:"14px 20px 20px", background:"rgba(255,255,255,0.98)", borderTop:"1px solid rgba(124,58,237,0.15)", boxShadow:"0 -4px 20px rgba(0,0,0,0.06)" }}>
            <div style={{ display:"flex", gap:10, alignItems:"flex-end", background:"#f8fafc", border:"1.5px solid rgba(0,0,0,0.1)", borderRadius:14, padding:"10px 14px", transition:"border-color 0.2s" }}
              onFocus={e => { e.currentTarget.style.borderColor="rgba(124,58,237,0.4)"; }}
              onBlur={e => { e.currentTarget.style.borderColor="rgba(0,0,0,0.1)"; }}>
              <textarea value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();handleSend();} }}
                placeholder="Continue the clinical intelligence session — more questions, conflict analysis, cascade mapping, NEVER-DO list..."
                rows={2} style={{ flex:1, background:"transparent", border:"none", color:"#1e293b", fontSize:13, resize:"none", lineHeight:1.7, fontFamily:"'Rajdhani',sans-serif" }}
              />
              <button onClick={handleSend} disabled={!!loadingText || !input.trim()} style={{ width:44, height:44, borderRadius:11, border:"none", background: loadingText||!input.trim() ? "rgba(0,0,0,0.07)" : `linear-gradient(135deg,${selectedMode.color},${selectedMode.accent})`, color: loadingText||!input.trim() ? "#94a3b8" : "#fff", fontSize:16, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", boxShadow: loadingText||!input.trim() ? "none" : `0 4px 16px ${selectedMode.glow}`, transition:"all 0.2s" }}>▶</button>
            </div>
            <div style={{ fontSize:10, color:"#94a3b8", marginTop:6, textAlign:"center", letterSpacing:2, fontFamily:"'Orbitron',sans-serif" }}>
              ENTER to send · SHIFT+ENTER new line · Elsevier · PubMed · RxNorm · OpenFDA · MedlinePlus · Gemini AI
            </div>
          </div>
        </div>
      )}
    </div>
  );
}