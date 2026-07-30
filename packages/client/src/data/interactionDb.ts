export interface NextStep {
  priority: 'urgent' | 'soon' | 'routine';
  action: string;
  who: string;
  icon: string;
}

export interface InteractionRecord {
  drugA: string;
  drugB: string;
  severity: 'critical' | 'moderate' | 'mild' | 'safe';
  type: string;
  mechanism: string;
  clinicalEffect: string;
  consequences: string[];
  suggestions: string[];
  monitoring: string[];
  nextSteps: NextStep[];
}

export const ICON_EMOJI: Record<string, string> = {
  PHONE: 'phone_call', BP: 'stethoscope', DOC: 'doc', PILL: 'pill', LAB: 'lab',
  CAL: 'cal', ALERT: 'alert', TIME: 'time', EYE: 'eye', OK: 'ok', SUGAR: 'sugar', BRAIN: 'brain',
};

export const STEP_ICON: Record<string, string> = {
  PHONE: '\u{1F4DE}', BP: '\u{1FA7A}', DOC: '\u{1F4CB}', PILL: '\u{1F48A}', LAB: '\u{1F9EA}',
  CAL: '\u{1F4C5}', ALERT: '\u{1F6A8}', TIME: '\u23F1', EYE: '\u{1F441}', OK: '\u2705', SUGAR: '\u{1F36C}', BRAIN: '\u{1F9E0}',
};

// Common Brand to Generic Drug Name Mappings (focused on Indian & Global Formulations)
export const BRAND_TO_GENERIC: Record<string, string> = {
  // Aspirin / Antiplatelets
  'ecosprin': 'Aspirin',
  'disprin': 'Aspirin',
  'delisprin': 'Aspirin',
  'aspenter': 'Aspirin',
  'clopivas': 'Clopidogrel',
  'plavix': 'Clopidogrel',
  'deplatt': 'Clopidogrel',

  // NSAIDs / Painkillers
  'brufen': 'Ibuprofen',
  'combiflam': 'Ibuprofen',
  'ibugesic': 'Ibuprofen',
  'voveran': 'Diclofenac',
  'voltaren': 'Diclofenac',
  'dolo': 'Paracetamol',
  'dolo650': 'Paracetamol',
  'dolo 650': 'Paracetamol',
  'crocin': 'Paracetamol',
  'calpol': 'Paracetamol',
  'pacimol': 'Paracetamol',
  'ultracet': 'Tramadol',
  'tramazac': 'Tramadol',

  // Anti-diabetics
  'glycomet': 'Metformin',
  'glucophage': 'Metformin',
  'gluconorm': 'Metformin',
  'obimet': 'Metformin',
  'glimisave': 'Glimepiride',
  'amaryl': 'Glimepiride',
  'januvia': 'Sitagliptin',
  'istamet': 'Sitagliptin',
  'forxiga': 'Dapagliflozin',

  // Antihypertensives / Cardiac / Beta-Blockers
  'amlokind': 'Amlodipine',
  'amlong': 'Amlodipine',
  'stamlo': 'Amlodipine',
  'norvasc': 'Amlodipine',
  'telma': 'Telmisartan',
  'telmikind': 'Telmisartan',
  'telista': 'Telmisartan',
  'telpres': 'Telmisartan',
  'aten': 'Atenolol',
  'tenormin': 'Atenolol',
  'metolar': 'Metoprolol',
  'seloken': 'Metoprolol',
  'seloken xl': 'Metoprolol',
  'betaloc': 'Metoprolol',
  'cardace': 'Ramipril',
  'ramistar': 'Ramipril',
  'losium': 'Losartan',
  'repace': 'Losartan',
  'enam': 'Enalapril',
  'envas': 'Enalapril',
  'lasix': 'Furosemide',

  // Statins
  'atorva': 'Atorvastatin',
  'lipitor': 'Atorvastatin',
  'storvas': 'Atorvastatin',
  'rozavel': 'Rosuvastatin',
  'crestor': 'Rosuvastatin',

  // Gastrointestinal / PPIs
  'pan': 'Pantoprazole',
  'pan d': 'Pantoprazole',
  'pand': 'Pantoprazole',
  'pantocid': 'Pantoprazole',
  'pantop': 'Pantoprazole',
  'pantodac': 'Pantoprazole',
  'omez': 'Omeprazole',
  'prilosec': 'Omeprazole',
  'razo': 'Rabeprazole',
  'rablet': 'Rabeprazole',

  // Antibiotics & Antimicrobials
  'ciplox': 'Ciprofloxacin',
  'cifran': 'Ciprofloxacin',
  'cipro': 'Ciprofloxacin',
  'azithral': 'Azithromycin',
  'zithromax': 'Azithromycin',
  'mox': 'Amoxicillin',
  'trimox': 'Amoxicillin',
  'taxim-o': 'Cefixime',
  'zifi': 'Cefixime',
  'diflucan': 'Fluconazole',

  // Thyroid & Respiratory
  'thyronorm': 'Levothyroxine',
  'eltroxin': 'Levothyroxine',
  'coumadin': 'Warfarin',
  'montek': 'Montelukast',
  'montek-lc': 'Montelukast',
  'montair': 'Montelukast',

  // Sedatives & Psychiatric
  'alprax': 'Alprazolam',
  'restyl': 'Alprazolam',
  'zapiz': 'Clonazepam',
  'ativan': 'Lorazepam',
  'zosert': 'Sertraline',
  'nexito': 'Escitalopram',
};

// Drug Class Definitions for Dynamic Class-Based Interaction Detection
export const DRUG_CLASSES: Record<string, string[]> = {
  'Beta Blocker': ['metoprolol', 'atenolol', 'propranolol', 'bisoprolol', 'carvedilol', 'labetalol'],
  'Fluoroquinolone': ['ciprofloxacin', 'levofloxacin', 'ofloxacin', 'moxifloxacin', 'norfloxacin'],
  'NSAID': ['ibuprofen', 'diclofenac', 'naproxen', 'nimesulide', 'mefenamic acid', 'indomethacin', 'piroxicam'],
  'ARB Antihypertensive': ['telmisartan', 'losartan', 'olmesartan', 'valsartan', 'irbesartan', 'candesartan'],
  'ACE Inhibitor': ['ramipril', 'enalapril', 'lisinopril', 'perindopril', 'captopril'],
  'Calcium Channel Blocker': ['amlodipine', 'cilnidipine', 'nifedipine', 'diltiazem', 'verapamil'],
  'Statin': ['atorvastatin', 'rosuvastatin', 'simvastatin', 'pravastatin'],
  'PPI': ['pantoprazole', 'omeprazole', 'rabeprazole', 'esomeprazole', 'lansoprazole'],
  'Sulfonylurea': ['glimepiride', 'gliclazide', 'glipizide', 'glibenclamide'],
  'DPP-4 Inhibitor': ['teneligliptin', 'sitagliptin', 'vildagliptin', 'linagliptin'],
  'Biguanide Antidiabetic': ['metformin'],
  'Antiplatelet': ['aspirin', 'clopidogrel', 'ticagrelor', 'prasugrel'],
  'Anticoagulant': ['warfarin', 'heparin', 'enoxaparin', 'rivaroxaban', 'apixaban', 'dabigatran'],
  'Benzodiazepine': ['alprazolam', 'clonazepam', 'lorazepam', 'diazepam', 'nitrazepam'],
  'SSRI': ['escitalopram', 'sertraline', 'fluoxetine', 'paroxetine', 'citalopram'],
  'Opioid': ['tramadol', 'codeine', 'morphine', 'fentanyl', 'tapentadol'],
  'Nitrate': ['nitroglycerin', 'isosorbide mononitrate', 'isosorbide dinitrate', 'sorbitrate'],
  'PDE5 Inhibitor': ['sildenafil', 'tadalafil', 'vardenafil'],
  'Antacid / Mineral': ['calcium', 'magnesium', 'aluminum hydroxide', 'gelusil', 'shelcal'],
};

export const INTERACTION_DB: InteractionRecord[] = [
  {
    drugA: 'Metoprolol',
    drugB: 'Ciprofloxacin',
    severity: 'moderate',
    type: 'Pharmacokinetic - CYP1A2 Inhibition',
    mechanism: 'Ciprofloxacin is a potent CYP1A2 inhibitor and moderate inhibitor of hepatic enzymes responsible for Metoprolol clearance. Concurrent administration increases plasma concentration of Metoprolol.',
    clinicalEffect: 'Increased beta-blocker exposure leading to exaggerated blood pressure lowering, severe bradycardia (slow heart rate), dizziness, and fatigue.',
    consequences: [
      'Sinus bradycardia (resting heart rate dropping below 50 bpm)',
      'Orthostatic hypotension and dizziness upon standing',
      'Increased tiredness or exercise intolerance during antibiotic course'
    ],
    suggestions: [
      'Monitor resting pulse daily while taking Ciprofloxacin',
      'If pulse drops below 50-55 bpm or severe dizziness occurs, consult your doctor immediately',
      'Ensure adequate hydration and avoid sudden standing from sitting or lying position'
    ],
    monitoring: [
      'Daily home pulse rate and morning blood pressure checks',
      'Watch for lightheadedness, weakness, or fainting feelings'
    ],
    nextSteps: [
      { priority: 'soon', action: 'Measure and log resting pulse rate before taking morning Metoprolol / Seloken dose', who: 'Patient', icon: 'BP' },
      { priority: 'routine', action: 'Inform doctor if pulse remains consistently below 55 bpm', who: 'Patient / Caregiver', icon: 'PHONE' }
    ]
  },
  { drugA: 'Amlodipine', drugB: 'Telmisartan', severity: 'moderate', type: 'Pharmacodynamic - Additive Hypotension', mechanism: 'Both drugs lower blood pressure via different mechanisms. Concurrent use results in additive vasodilatory effect.', clinicalEffect: 'Excessive blood pressure lowering, dizziness, syncope risk especially on standing.', consequences: ['Risk of falls in elderly patients', 'Fainting episodes when rising from sitting/lying', 'Reduced cerebral perfusion if BP drops'], suggestions: ['Confirm with prescribing cardiologist if combination is intentional', 'Monitor morning BP before dosing', 'Space doses if possible (Amlodipine AM, Telmisartan PM)'], monitoring: ['Daily home BP readings morning and evening', 'Watch for dizziness, light-headedness, sudden weakness'], nextSteps: [{ priority: 'urgent', action: 'Confirm with cardiologist that both BP meds are intentionally prescribed together', who: 'Caregiver / Family', icon: 'PHONE' }, { priority: 'soon', action: 'Buy a home BP monitor and log readings daily for 2 weeks', who: 'Patient', icon: 'BP' }, { priority: 'routine', action: 'Bring a printed medication list to every doctor visit', who: 'Patient', icon: 'DOC' }] },
  { drugA: 'Amlodipine', drugB: 'Metformin', severity: 'safe', type: 'No Clinically Significant Interaction', mechanism: 'Amlodipine and Metformin act on entirely different physiologic targets with no known overlap.', clinicalEffect: 'No adverse interaction expected. Routinely co-prescribed in diabetic hypertension.', consequences: ['None documented in clinical practice'], suggestions: ['Continue as prescribed', 'Routine monitoring of BP and fasting blood glucose is sufficient'], monitoring: ['Standard quarterly HbA1c and BP checks'], nextSteps: [{ priority: 'routine', action: 'Maintain regular quarterly follow-up with diabetologist', who: 'Patient', icon: 'CAL' }] },
  { drugA: 'Metformin', drugB: 'Ibuprofen', severity: 'moderate', type: 'Pharmacokinetic - Renal Clearance Reduction', mechanism: 'Ibuprofen (NSAID) inhibits prostaglandin synthesis in the kidney, reducing renal blood flow and GFR. Metformin is primarily renally excreted; reduced GFR leads to Metformin accumulation.', clinicalEffect: 'Risk of Metformin accumulation leading to lactic acidosis. Short courses (3 days max) are relatively low-risk.', consequences: ['Metformin accumulation with extended NSAID use', 'Rare but life-threatening lactic acidosis', 'Worsening of renal function in susceptible patients'], suggestions: ['Use Paracetamol as first-line pain relief instead of Ibuprofen', 'If Ibuprofen is necessary: limit to 3 days maximum', 'Ensure adequate hydration while taking both drugs'], monitoring: ['Monitor for nausea, vomiting, muscle pain', 'Renal function (serum creatinine) before and after NSAID course'], nextSteps: [{ priority: 'urgent', action: 'Discuss with doctor: can Paracetamol replace Ibuprofen for pain?', who: 'Caregiver', icon: 'PILL' }, { priority: 'soon', action: 'Check eGFR / kidney function at next lab visit', who: 'Patient', icon: 'LAB' }, { priority: 'routine', action: 'Always mention Metformin when any doctor prescribes a painkiller', who: 'Patient', icon: 'DOC' }] },
  { drugA: 'Aspirin', drugB: 'Ibuprofen', severity: 'critical', type: 'Pharmacodynamic - Competitive COX-1 Inhibition + Bleeding Risk', mechanism: 'Ibuprofen competes with Aspirin for the COX-1 active site, blocking Aspirin irreversible platelet inhibition and negating its cardioprotective effect.', clinicalEffect: 'Loss of Aspirin cardioprotective effect when Ibuprofen is taken first. Significantly increased risk of GI bleeding.', consequences: ['Breakthrough cardiovascular events (MI, stroke)', 'Upper GI ulcer / bleeding especially dangerous in elderly', 'Increased bruising and bleeding time'], suggestions: ['CRITICAL: Take Aspirin at least 2 hours BEFORE Ibuprofen', 'Avoid concurrent use whenever possible', 'Consider Paracetamol as NSAID-free alternative for pain'], monitoring: ['Monitor for black/tarry stools, vomiting blood', 'Any chest pain or neurological symptoms - Emergency'], nextSteps: [{ priority: 'urgent', action: 'Alert prescribing doctors about Aspirin + Ibuprofen combination immediately', who: 'Family / Caregiver', icon: 'ALERT' }, { priority: 'urgent', action: 'Strict dosing order: Aspirin FIRST, Ibuprofen at least 2 hours later', who: 'Patient', icon: 'TIME' }, { priority: 'soon', action: 'Ask orthopedic doctor if Paracetamol can replace Ibuprofen', who: 'Caregiver', icon: 'PHONE' }] },
  { drugA: 'Aspirin', drugB: 'Telmisartan', severity: 'mild', type: 'Pharmacodynamic - Mild RAAS Antagonism Reduction', mechanism: 'At high Aspirin doses, salicylates can modestly attenuate the BP-lowering effect of ARBs like Telmisartan. At low cardioprotective Aspirin dose (75mg) this is not clinically relevant.', clinicalEffect: 'At 75mg Aspirin dose: no clinically significant interaction. Safe to continue as prescribed.', consequences: ['At 75mg: minimal - continue as prescribed'], suggestions: ['No change needed at current 75mg cardioprotective Aspirin dose', 'Avoid escalating Aspirin dose without cardiologist guidance'], monitoring: ['Routine BP monitoring as advised'], nextSteps: [{ priority: 'routine', action: 'Maintain 75mg Aspirin dose; do not self-increase for pain relief', who: 'Patient', icon: 'OK' }] },
  { drugA: 'Levothyroxine', drugB: 'Methotrexate', severity: 'mild', type: 'Pharmacokinetic - Minor Absorption Influence', mechanism: 'Methotrexate does not directly interact with Levothyroxine. However, chronic GI inflammation from RA may alter absorption. Both require consistent timing.', clinicalEffect: 'Minimal direct interaction; ensure strict timing - Levothyroxine must be on empty stomach.', consequences: ['Inconsistent Levothyroxine absorption if timing is poor'], suggestions: ['Levothyroxine: always on empty stomach 30-60 min before food', 'Methotrexate: weekly dose on fixed day (Sunday) with folic acid on other days'], monitoring: ['TSH levels every 6-8 weeks', 'CBC, LFT quarterly for Methotrexate monitoring'], nextSteps: [{ priority: 'routine', action: 'TSH blood test at next follow-up to confirm thyroid control', who: 'Patient', icon: 'LAB' }] },
  { drugA: 'Atorvastatin', drugB: 'Clopidogrel', severity: 'mild', type: 'Pharmacokinetic - Minor CYP3A4 Overlap', mechanism: 'Both are metabolized via CYP3A4. Atorvastatin may theoretically reduce Clopidogrel activation, but clinical evidence shows no clinically significant interaction with Atorvastatin specifically.', clinicalEffect: 'No clinically meaningful interaction. Standard of care post-MI and in CAD.', consequences: ['No significant adverse interaction - expected dual therapy'], suggestions: ['Continue Atorvastatin + Clopidogrel as prescribed', 'Atorvastatin at bedtime', 'Avoid grapefruit juice which increases Atorvastatin levels'], monitoring: ['LFTs at baseline and after 3 months', 'Watch for unexplained muscle pain/weakness'], nextSteps: [{ priority: 'routine', action: 'Liver function test and lipid panel at next quarterly review', who: 'Patient', icon: 'LAB' }] },
  { drugA: 'Teneligliptin', drugB: 'Glimepiride', severity: 'moderate', type: 'Pharmacodynamic - Additive Hypoglycemia Risk', mechanism: 'Teneligliptin (DPP-4 inhibitor) enhances insulin secretion glucose-dependently. Glimepiride (sulfonylurea) stimulates insulin release regardless of glucose levels. Combined, hypoglycemia risk is amplified.', clinicalEffect: 'Increased risk of hypoglycemia (low blood sugar below 70 mg/dL), especially if a meal is skipped or delayed.', consequences: ['Hypoglycemic episodes - shakiness, sweating, confusion, loss of consciousness', 'Dangerous if patient is alone or driving'], suggestions: ['Patient MUST eat breakfast within 15 min of taking morning doses', 'Always carry glucose tablets or sugary drink', 'Do not skip meals on days when both medications are taken'], monitoring: ['Self-monitoring of blood glucose before breakfast and 2 hours post-meal', 'HbA1c every 3 months'], nextSteps: [{ priority: 'urgent', action: 'Always carry glucose tablets or a small pack of sugar when stepping out', who: 'Patient', icon: 'SUGAR' }, { priority: 'soon', action: 'Get a glucometer and check fasting blood glucose 3 days per week', who: 'Patient', icon: 'LAB' }] },
  { drugA: 'Escitalopram', drugB: 'Rabeprazole', severity: 'mild', type: 'Pharmacokinetic - CYP2C19 Competition', mechanism: 'Both Rabeprazole and Escitalopram utilize CYP2C19 for metabolism. Rabeprazole may slightly increase Escitalopram plasma levels by competing for the same enzyme.', clinicalEffect: 'Slightly increased Escitalopram exposure possible; unlikely to cause problems at standard doses.', consequences: ['Theoretical QTc prolongation at very high Escitalopram levels - not expected at 10mg'], suggestions: ['Continue as prescribed at current doses', 'No dose adjustment needed'], monitoring: ['Routine - ECG only if Escitalopram dose is ever increased above 20mg'], nextSteps: [{ priority: 'routine', action: 'Routine psychiatric review at 6-week intervals for Escitalopram efficacy', who: 'Patient', icon: 'BRAIN' }] },
  { drugA: 'Warfarin', drugB: 'Aspirin', severity: 'critical', type: 'Pharmacodynamic - Synergistic Bleeding Risk', mechanism: 'Warfarin inhibits vitamin K-dependent clotting factors. Aspirin inhibits platelet aggregation via COX-1. Together, both anticoagulant and antiplatelet pathways are blocked.', clinicalEffect: 'Severe, potentially life-threatening bleeding risk. Intracranial hemorrhage, GI bleeding significantly increased.', consequences: ['Major bleeding events - intracranial hemorrhage, GI bleed', 'Spontaneous bruising, prolonged bleeding'], suggestions: ['CRITICAL COMBINATION - requires specialist oversight only', 'Never self-prescribe Aspirin while on Warfarin', 'Avoid all NSAIDs and herbal blood thinners'], monitoring: ['Weekly INR checks when combination is initiated', 'Monitor for unusual bruising, dark stools'], nextSteps: [{ priority: 'urgent', action: 'Inform prescribing doctor immediately if starting Aspirin alongside Warfarin', who: 'Patient / Caregiver', icon: 'ALERT' }, { priority: 'urgent', action: 'Schedule INR blood test within 3-4 days of starting combination', who: 'Patient', icon: 'LAB' }] },
  { drugA: 'Pantoprazole', drugB: 'Clopidogrel', severity: 'moderate', type: 'Pharmacokinetic - CYP2C19 Inhibition Reduces Clopidogrel Activation', mechanism: 'Pantoprazole (PPI) inhibits CYP2C19, the enzyme that converts Clopidogrel (prodrug) to its active antiplatelet metabolite.', clinicalEffect: 'Reduced antiplatelet effect of Clopidogrel, potentially increasing cardiovascular event risk in post-stent patients.', consequences: ['Reduced platelet inhibition - increased stent thrombosis risk', 'Potential for breakthrough cardiovascular events'], suggestions: ['Consider switching to Rabeprazole or Omeprazole (weaker CYP2C19 inhibitors)', 'Discuss with cardiologist if GI protection is strictly necessary'], monitoring: ['Monitor for any chest pain or cardiac symptoms'], nextSteps: [{ priority: 'urgent', action: 'Discuss with cardiologist about switching PPI from Pantoprazole to an alternative', who: 'Caregiver', icon: 'PHONE' }] },
  { drugA: 'Metoprolol', drugB: 'Amlodipine', severity: 'mild', type: 'Pharmacodynamic - Additive Rate and BP Lowering', mechanism: 'Metoprolol (beta-blocker) reduces heart rate and cardiac output. Amlodipine (CCB) reduces peripheral vascular resistance. Combination enhances BP lowering.', clinicalEffect: 'Generally safe and beneficial in hypertension/angina management. Additive bradycardia risk if overdose occurs.', consequences: ['Excessive bradycardia at high doses', 'Synergistic hypotension generally well-tolerated at standard doses'], suggestions: ['This combination is a recognized standard hypertension regimen', 'Monitor pulse rate - should stay above 55 bpm at rest'], monitoring: ['Resting heart rate monitoring', 'BP checks twice weekly during dose changes'], nextSteps: [{ priority: 'routine', action: 'Monitor resting pulse with home BP readings', who: 'Patient', icon: 'BP' }] },
  { drugA: 'Lisinopril', drugB: 'Potassium', severity: 'moderate', type: 'Pharmacodynamic - Hyperkalemia Risk', mechanism: 'Lisinopril (ACE inhibitor) reduces aldosterone secretion, causing potassium retention. Co-administration of potassium supplements significantly increases the risk of hyperkalemia.', clinicalEffect: 'Elevated serum potassium levels (hyperkalemia) - can cause cardiac arrhythmias.', consequences: ['Hyperkalemia - muscle weakness, irregular heartbeat, cardiac arrest in severe cases'], suggestions: ['Avoid potassium supplements unless specifically prescribed', 'Low-potassium diet if taking ACE inhibitors'], monitoring: ['Serum potassium levels every 4-6 weeks', 'ECG if potassium above 5.5 mEq/L'], nextSteps: [{ priority: 'soon', action: 'Serum electrolyte check (K+, Na+, Cr) at next blood test', who: 'Patient', icon: 'LAB' }] },
  { drugA: 'Amlodipine', drugB: 'Atorvastatin', severity: 'mild', type: 'Pharmacokinetic - CYP3A4 Inhibition', mechanism: 'Amlodipine is a weak inhibitor of CYP3A4, the enzyme responsible for Atorvastatin metabolism. This can slightly increase Atorvastatin plasma levels.', clinicalEffect: 'Marginally elevated Atorvastatin levels possible; no dose adjustment typically required at standard doses.', consequences: ['Theoretical slight increase in statin-related myopathy risk at very high Atorvastatin doses'], suggestions: ['No change needed at standard doses (Atorvastatin up to 40mg)', 'Report unexplained muscle aches to your doctor', 'Avoid grapefruit juice'], monitoring: ['CK (creatine kinase) if muscle symptoms develop', 'LFTs as per standard statin monitoring'], nextSteps: [{ priority: 'routine', action: 'Routine lipid panel and LFT at next follow-up', who: 'Patient', icon: 'LAB' }] },
  { drugA: 'Ramipril', drugB: 'Telmisartan', severity: 'critical', type: 'Pharmacodynamic - Dual RAAS Blockade Toxicity', mechanism: 'Combining an ACE inhibitor (Ramipril) with an ARB (Telmisartan) dual-blocks the renin-angiotensin-aldosterone axis without added cardiovascular benefit.', clinicalEffect: 'Significantly elevated risk of acute kidney injury, severe hypotension, and hyperkalemia.', consequences: ['Acute decline in renal function', 'Severe symptomatic hypotension', 'Dangerous hyperkalemia'], suggestions: ['Avoid dual RAAS blockade; consult cardiologist to discontinue one agent', 'Monitor renal panel and potassium urgently'], monitoring: ['Serum creatinine and potassium levels', 'Daily BP checks'], nextSteps: [{ priority: 'urgent', action: 'Contact prescribing doctor immediately to review dual ACEi/ARB therapy', who: 'Caregiver / Family', icon: 'ALERT' }] },
  { drugA: 'Aspirin', drugB: 'Diclofenac', severity: 'critical', type: 'Pharmacodynamic - Dual NSAID Bleeding Risk', mechanism: 'Co-administration of two NSAIDs (Aspirin and Diclofenac) produces additive gastric mucosal damage and platelet dysfunction.', clinicalEffect: 'Markedly elevated risk of upper gastrointestinal ulceration, bleeding, and renal dysfunction.', consequences: ['GI bleeding / peptic ulcer disease', 'Loss of Aspirin cardioprotection', 'Renal impairment'], suggestions: ['Avoid dual NSAID therapy. Use Paracetamol for pain relief', 'Take gastroprotection (PPI) if NSAID is essential'], monitoring: ['Watch for dark/tarry stools or epigastric pain'], nextSteps: [{ priority: 'urgent', action: 'Switch Diclofenac to Paracetamol after consulting physician', who: 'Caregiver', icon: 'PILL' }] },
  { drugA: 'Clopidogrel', drugB: 'Omeprazole', severity: 'moderate', type: 'Pharmacokinetic - CYP2C19 Inhibition', mechanism: 'Omeprazole potently inhibits CYP2C19, preventing bioactivation of Clopidogrel into its active antiplatelet form.', clinicalEffect: 'Subtherapeutic Clopidogrel levels, increasing risk of stent thrombosis or recurrent ischemic events.', consequences: ['Reduced antiplatelet protection', 'Increased cardiovascular risk'], suggestions: ['Switch Omeprazole to Rabeprazole or Pantoprazole which have lesser CYP2C19 inhibition'], monitoring: ['Monitor for ischemic chest pain symptoms'], nextSteps: [{ priority: 'soon', action: 'Discuss PPI switch with cardiologist', who: 'Patient', icon: 'PHONE' }] },
  { drugA: 'Methotrexate', drugB: 'Ibuprofen', severity: 'critical', type: 'Pharmacokinetic - Methotrexate Toxicity', mechanism: 'NSAIDs like Ibuprofen decrease renal perfusion and competitively inhibit tubular secretion of Methotrexate.', clinicalEffect: 'Marked increase in serum Methotrexate levels leading to bone marrow suppression and GI toxicity.', consequences: ['Pancytopenia / severe leukopenia', 'Mucositis and renal failure'], suggestions: ['Avoid NSAIDs during high-dose Methotrexate therapy; use Paracetamol with caution'], monitoring: ['CBC and LFTs regularly'], nextSteps: [{ priority: 'urgent', action: 'Alert oncologist / rheumatologist before taking Ibuprofen', who: 'Caregiver', icon: 'ALERT' }] },
  {
    drugA: 'Ciprofloxacin',
    drugB: 'Calcium',
    severity: 'moderate',
    type: 'Pharmacokinetic - Chelation & Absorption Reduction',
    mechanism: 'Calcium ions bind Ciprofloxacin in the stomach forming insoluble chelate complexes, reducing antibiotic absorption by up to 75%.',
    clinicalEffect: 'Reduced antibacterial efficacy and potential treatment failure for serious infections.',
    consequences: ['Failure of infection resolution', 'Risk of bacterial resistance development'],
    suggestions: ['Separate Ciprofloxacin and Calcium/Antacid doses by at least 2 hours BEFORE or 6 hours AFTER'],
    monitoring: ['Infection symptom improvement'],
    nextSteps: [{ priority: 'urgent', action: 'Space Calcium / Antacids at least 2 hours away from Ciprofloxacin (Ciplox)', who: 'Patient', icon: 'TIME' }]
  },
  {
    drugA: 'Sildenafil',
    drugB: 'Nitroglycerin',
    severity: 'critical',
    type: 'Pharmacodynamic - Severe Synergistic Hypotension',
    mechanism: 'Both nitrates and PDE-5 inhibitors increase intracellular cGMP in vascular smooth muscle cells, causing massive systemic vasodilation.',
    clinicalEffect: 'Severe, life-threatening drop in blood pressure, cardiogenic shock, or fatal myocardial infarction.',
    consequences: ['Severe refractory hypotension', 'Myocardial infarction or sudden cardiac death'],
    suggestions: ['ABSOLUTE CONTRAINDICATION: Never take Sildenafil within 24 hours of Nitroglycerin / Sorbitrate'],
    monitoring: ['Immediate emergency response if accidental combination occurs'],
    nextSteps: [{ priority: 'urgent', action: 'Do NOT administer Nitroglycerin if patient took Sildenafil in past 24-48 hours', who: 'Caregiver / Patient', icon: 'ALERT' }]
  },
  {
    drugA: 'Alprazolam',
    drugB: 'Alcohol',
    severity: 'critical',
    type: 'Pharmacodynamic - Severe Respiratory & CNS Depression',
    mechanism: 'Synergistic potentiation of GABA-A receptor inhibition in the brainstem respiratory center.',
    clinicalEffect: 'Profound sedation, respiratory arrest, loss of consciousness, and fatal overdose.',
    consequences: ['Respiratory failure', 'Accidental injury, coma, or death'],
    suggestions: ['Strictly avoid alcohol while taking any benzodiazepine (Alprazolam / Alprax, Clonazepam)'],
    monitoring: ['Respiratory rate and mental alertness'],
    nextSteps: [{ priority: 'urgent', action: 'Avoid alcohol completely while taking sedative medications', who: 'Patient', icon: 'ALERT' }]
  }
];

/**
 * Clean & normalize a drug string to extract core substance name.
 * Removes prefixes like "Tab", "Cap", "Inj", "Syp", dosages, and punctuation.
 */
export function normalizeDrugName(raw: string): string {
  if (!raw) return '';

  let cleaned = raw.toLowerCase().trim();

  // Strip leading form prefixes (e.g., "tab.", "tablet", "cap", "capsule", "inj", "syrup", "t.", "c.")
  cleaned = cleaned.replace(/^(tab\b\.?|tablet\b|cap\b\.?|capsule\b|inj\b\.?|injection\b|syp\b\.?|syrup\b|t\b\.?|c\b\.?|dr\b\.?)\s+/gi, '');

  // Strip strength and dosage patterns (e.g. "500mg", "1000 mg", "40mg", "5 mg/ml", "75 mg", "od", "bd", "tds", "hs")
  cleaned = cleaned.replace(/\b\d+(\.\d+)?\s*(mg|mcg|g|gm|ml|iu|units?)\b/gi, '');
  cleaned = cleaned.replace(/\b(od|bd|tds|hs|qid|tid|once daily|twice daily)\b/gi, '');

  // Clean trailing/leading non-alpha chars
  cleaned = cleaned.replace(/[^a-z0-9\s]/gi, ' ').trim();

  // Split into tokens
  const tokens = cleaned.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return raw.trim();

  // Check full string or first token against brand mapping
  const fullKey = tokens.join(' ');
  if (BRAND_TO_GENERIC[fullKey]) {
    return BRAND_TO_GENERIC[fullKey];
  }

  // Check individual tokens against brand mapping
  for (const token of tokens) {
    if (BRAND_TO_GENERIC[token]) {
      return BRAND_TO_GENERIC[token];
    }
  }

  // Return the main token (capitalized for consistency)
  const primaryToken = tokens[0];
  return primaryToken.charAt(0).toUpperCase() + primaryToken.slice(1);
}

/**
 * Returns generic mapping info if raw name is a known brand.
 */
export function getBrandMapping(raw: string): { isBrand: boolean; genericName: string } {
  const normKey = raw.toLowerCase().replace(/^(tab\b\.?|tablet\b|cap\b\.?|capsule\b|inj\b\.?|syrup\b|t\b\.?)\s+/gi, '').replace(/[^a-z]/gi, '');
  for (const [brand, generic] of Object.entries(BRAND_TO_GENERIC)) {
    if (brand.replace(/[^a-z]/gi, '') === normKey || normKey.includes(brand.replace(/[^a-z]/gi, ''))) {
      return { isBrand: true, genericName: generic };
    }
  }
  return { isBrand: false, genericName: raw };
}

/**
 * Helper to identify drug class for dynamic interaction generation
 */
function getDrugClass(normName: string): string | null {
  const q = normName.toLowerCase();
  for (const [cls, members] of Object.entries(DRUG_CLASSES)) {
    if (members.some(m => q.includes(m) || m.includes(q))) {
      return cls;
    }
  }
  return null;
}

export function lookupInteraction(medA: string, medB: string): InteractionRecord | null {
  if (!medA || !medB) return null;

  const normA = normalizeDrugName(medA).toLowerCase();
  const normB = normalizeDrugName(medB).toLowerCase();

  // 1. Direct match on normalized names
  const directMatch = INTERACTION_DB.find(r => {
    const rA = r.drugA.toLowerCase();
    const rB = r.drugB.toLowerCase();
    return (rA === normA && rB === normB) || (rA === normB && rB === normA);
  });
  if (directMatch) return directMatch;

  // 2. Substring match (e.g., "Metformin Hydrochloride" vs "Metformin")
  const subMatch = INTERACTION_DB.find(r => {
    const rA = r.drugA.toLowerCase();
    const rB = r.drugB.toLowerCase();
    const aMatchesRA = normA.includes(rA) || rA.includes(normA);
    const bMatchesRB = normB.includes(rB) || rB.includes(normB);
    const aMatchesRB = normA.includes(rB) || rB.includes(normA);
    const bMatchesRA = normB.includes(rA) || rA.includes(normB);

    return (aMatchesRA && bMatchesRB) || (aMatchesRB && bMatchesRA);
  });
  if (subMatch) return subMatch;

  // 3. Dynamic Class-Level Interaction Detection
  const classA = getDrugClass(normA);
  const classB = getDrugClass(normB);

  if (classA && classB) {
    // Beta-Blocker + Fluoroquinolone (e.g. Seloken/Metoprolol + Ciplox/Ciprofloxacin)
    if ((classA === 'Beta Blocker' && classB === 'Fluoroquinolone') || (classB === 'Beta Blocker' && classA === 'Fluoroquinolone')) {
      const beta = classA === 'Beta Blocker' ? medA : medB;
      const quin = classA === 'Fluoroquinolone' ? medA : medB;
      return {
        drugA: beta,
        drugB: quin,
        severity: 'moderate',
        type: 'Pharmacokinetic - CYP1A2 Inhibition & Bradycardia Risk',
        mechanism: `${quin} (a Fluoroquinolone antibiotic) inhibits hepatic CYP1A2 enzymes responsible for metabolizing ${beta} (a Beta-Blocker), leading to elevated ${beta} blood levels.`,
        clinicalEffect: `Increased beta-blocker concentration causing exaggerated blood pressure reduction, resting bradycardia (slow heart rate), dizziness, and fatigue.`,
        consequences: [
          'Unusual drop in resting heart rate below 55 bpm',
          'Dizziness or feeling faint upon standing up (orthostatic hypotension)',
          'Increased fatigue during antibiotic course'
        ],
        suggestions: [
          `Monitor resting pulse daily while taking ${quin}`,
          'Avoid sudden posture changes from lying/sitting to standing',
          'Consult doctor if pulse drops consistently below 50 bpm'
        ],
        monitoring: ['Daily home pulse rate and BP checks'],
        nextSteps: [
          { priority: 'soon', action: `Check resting pulse before morning ${beta} dose`, who: 'Patient', icon: 'BP' },
          { priority: 'routine', action: 'Notify doctor if experiencing weakness or severe bradycardia', who: 'Caregiver', icon: 'PHONE' }
        ]
      };
    }

    // NSAID + NSAID Duplication
    if (classA === 'NSAID' && classB === 'NSAID') {
      return {
        drugA: medA,
        drugB: medB,
        severity: 'critical',
        type: 'Therapeutic Class Duplication - Dual NSAID Bleeding Risk',
        mechanism: `Both ${medA} and ${medB} belong to the NSAID drug class. Co-prescribing two NSAIDs offers no additional pain relief but doubles gastric mucosal irritation and COX-1 inhibition.`,
        clinicalEffect: 'Severe risk of gastrointestinal ulceration, upper GI bleeding, and acute renal impairment.',
        consequences: ['GI bleeding (black stools, stomach pain)', 'Renal strain / acute kidney injury'],
        suggestions: ['Avoid dual NSAID therapy. Discontinue one and use Paracetamol for breakthrough pain.'],
        monitoring: ['Stomach pain, black tarry stools, kidney function'],
        nextSteps: [{ priority: 'urgent', action: 'Consult doctor to discontinue duplicate NSAID', who: 'Caregiver', icon: 'ALERT' }]
      };
    }

    // ACEi + ARB Dual RAAS Blockade
    if ((classA === 'ACE Inhibitor' && classB === 'ARB Antihypertensive') || (classB === 'ACE Inhibitor' && classA === 'ARB Antihypertensive')) {
      return {
        drugA: medA,
        drugB: medB,
        severity: 'critical',
        type: 'Pharmacodynamic - Dual RAAS Blockade Toxicity',
        mechanism: `Combining an ACE Inhibitor (${classA === 'ACE Inhibitor' ? medA : medB}) with an ARB (${classA === 'ARB Antihypertensive' ? medA : medB}) dual-inhibits the renin-angiotensin system without extra benefit.`,
        clinicalEffect: 'High risk of acute kidney injury, severe hypotension, and hyperkalemia.',
        consequences: ['Acute kidney dysfunction', 'Severe hypotension', 'Dangerous hyperkalemia'],
        suggestions: ['Consult doctor to review and select a single RAAS agent.'],
        monitoring: ['Renal function and serum potassium'],
        nextSteps: [{ priority: 'urgent', action: 'Inform prescribing physician immediately', who: 'Caregiver', icon: 'ALERT' }]
      };
    }

    // PPI + PPI Duplication
    if (classA === 'PPI' && classB === 'PPI') {
      return {
        drugA: medA,
        drugB: medB,
        severity: 'mild',
        type: 'Therapeutic Class Duplication - Dual PPI',
        mechanism: `Both ${medA} and ${medB} are Proton Pump Inhibitors (stomach acid reducers). Taking two PPIs together provides no extra acid suppression.`,
        clinicalEffect: 'Therapeutic redundancy with unnecessary medication load.',
        consequences: ['Unnecessary cost and potential long-term PPI side effects'],
        suggestions: ['Ask pharmacist which single PPI formulation to retain.'],
        monitoring: ['Acid reflux symptoms'],
        nextSteps: [{ priority: 'routine', action: 'Confirm preferred PPI with pharmacist', who: 'Patient', icon: 'PILL' }]
      };
    }
  }

  return null;
}

export const SEVERITY_CONFIG = {
  critical: { label: 'CRITICAL', badge: 'bg-rose-600 text-white', border: 'border-rose-400', card: 'bg-rose-50', text: 'text-rose-700', icon: 'CRIT', ring: 'ring-rose-400' },
  moderate: { label: 'MODERATE', badge: 'bg-amber-500 text-white', border: 'border-amber-400', card: 'bg-amber-50', text: 'text-amber-700', icon: 'MOD', ring: 'ring-amber-400' },
  mild:     { label: 'MILD',     badge: 'bg-blue-500 text-white',   border: 'border-blue-400',  card: 'bg-blue-50',  text: 'text-blue-700',  icon: 'MILD', ring: 'ring-blue-400' },
  safe:     { label: 'SAFE',     badge: 'bg-emerald-500 text-white', border: 'border-emerald-400', card: 'bg-emerald-50', text: 'text-emerald-700', icon: 'SAFE', ring: 'ring-emerald-400' },
};

export const PRIORITY_CONFIG = {
  urgent:  { label: 'URGENT',  classes: 'bg-rose-100 border border-rose-300 text-rose-800' },
  soon:    { label: 'SOON',    classes: 'bg-amber-100 border border-amber-300 text-amber-800' },
  routine: { label: 'ROUTINE', classes: 'bg-teal-100 border border-teal-300 text-teal-800' },
};