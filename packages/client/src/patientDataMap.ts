import { Patient } from './types';

export interface PatientCaseFullData {
  patient: Patient;
  caregivers: Array<{ caregiver_id: string; name: string; relationship_to_patient: string; phone_number: string }>;
  medicines: Array<{ medicine_id: string; name: string; dosage: string; frequency: string; duration: string; doctor_name: string; active: boolean; confidence: number }>;
  safety_flags: Array<{ id: string; type: string; severity: 'caution' | 'info'; title: string; medicines: string[]; reasoning: string }>;
  adherence: { ratePercentage: number; streakDays: number; days: Array<{ eventId: string; date: string; status: 'done' | 'missed' | 'pending'; med: string }> };
  refills: Array<{ name: string; daysLeft: number; endDate: string; status: string }>;
  timelineEvents: Array<{ id: string; day: string; title: string; desc: string; type: 'start' | 'refill' | 'stop' | 'followup' }>;
  upcomingFollowups: Array<{ date: string; doctor: string; facility: string }>;
  digest: { period: string; adherenceRate: number; streakDays: number; openFlagsCount: number };
  governance: Array<{ role: string; name: string; phone: string; accessLevel: string; addedAt: string }>;
}

export const PATIENT_DATA_MAP: Record<string, PatientCaseFullData> = {
  'patient-ramesh-kumar': {
    patient: {
      patient_id: 'patient-ramesh-kumar',
      name: 'Ramesh Kumar',
      age: 72,
      gender: 'Male',
      blood_group: 'B+',
      abha_id: '91-4829-1029-4821',
      address: '102, Palm Grove, Indiranagar, Bengaluru, Karnataka 560038',
      known_allergies: ['Penicillin', 'Sulfa drugs'],
      primary_conditions: ['Type 2 Diabetes Mellitus', 'Essential Hypertension'],
      phone_number: '+91 98765 43210',
      vitals: { height_cm: 168, weight_kg: 70, bmi: 24.8, bp_baseline: '130/84 mmHg', blood_sugar_fasting: '118 mg/dL' },
      emergency_contact: { name: 'Priya Kumar', relationship: 'Daughter', phone: '+91 98765 00001' }
    },
    caregivers: [
      { caregiver_id: 'cg-01', name: 'Priya Kumar', relationship_to_patient: 'Daughter', phone_number: '+91 98765 00001' }
    ],
    medicines: [
      { medicine_id: 'med-01', name: 'Amlodipine', dosage: '5 mg', frequency: 'Once daily (Morning)', duration: '30 days', doctor_name: 'Dr. A. Mehta (Cardiology)', active: true, confidence: 95 },
      { medicine_id: 'med-02', name: 'Metformin', dosage: '500 mg', frequency: 'Twice daily (Meals)', duration: '30 days', doctor_name: 'Dr. A. Mehta (Cardiology)', active: true, confidence: 93 },
      { medicine_id: 'med-03', name: 'Telmisartan', dosage: '40 mg', frequency: 'Once daily (Morning)', duration: '30 days', doctor_name: 'Dr. R. Sharma (Orthopedics)', active: true, confidence: 42 },
      { medicine_id: 'med-04', name: 'Ibuprofen', dosage: '400 mg', frequency: 'Three times daily', duration: '7 days', doctor_name: 'Dr. R. Sharma (Orthopedics)', active: true, confidence: 91 },
      { medicine_id: 'med-05', name: 'Pantoprazole', dosage: '40 mg', frequency: 'Once daily (Before breakfast)', duration: '7 days', doctor_name: 'Dr. R. Sharma (Orthopedics)', active: true, confidence: 88 },
      { medicine_id: 'med-06', name: 'Aspirin', dosage: '75 mg', frequency: 'Once daily (After dinner)', duration: '30 days', doctor_name: 'Dr. A. Mehta (Cardiology)', active: true, confidence: 94 }
    ],
    safety_flags: [
      { id: 'f1', type: 'therapeutic_duplication', severity: 'caution', title: 'Therapeutic Class Duplication (Blood Pressure)', medicines: ['Amlodipine 5mg (Dr. Mehta)', 'Telmisartan 40mg (Dr. Sharma)'], reasoning: 'Amlodipine and Telmisartan are both blood-pressure medications. Taking both together without doctor coordination may cause blood pressure to drop too low.' },
      { id: 'f2', type: 'drug_interaction', severity: 'caution', title: 'Drug Interaction: Metformin + Ibuprofen', medicines: ['Metformin 500mg', 'Ibuprofen 400mg'], reasoning: 'Ibuprofen may reduce kidney clearance of Metformin.' }
    ],
    adherence: {
      ratePercentage: 86,
      streakDays: 6,
      days: [
        { eventId: 'e-1', date: 'Jul 21', status: 'done', med: 'Amlodipine 5mg' },
        { eventId: 'e-2', date: 'Jul 22', status: 'done', med: 'Amlodipine 5mg' },
        { eventId: 'e-3', date: 'Jul 23', status: 'done', med: 'Amlodipine 5mg' },
        { eventId: 'e-4', date: 'Jul 24', status: 'done', med: 'Amlodipine 5mg' },
        { eventId: 'e-5', date: 'Jul 25', status: 'missed', med: 'Amlodipine 5mg' },
        { eventId: 'e-6', date: 'Jul 26', status: 'done', med: 'Amlodipine 5mg' },
        { eventId: 'e-7', date: 'Jul 27 (Today)', status: 'pending', med: 'Amlodipine 5mg' }
      ]
    },
    refills: [
      { name: 'Metformin 500mg', daysLeft: 3, endDate: '2026-08-01', status: 'Refill Warning (3 days)' },
      { name: 'Amlodipine 5mg', daysLeft: 12, endDate: '2026-08-10', status: 'Stock OK' }
    ],
    timelineEvents: [
      { id: 't1', day: 'Day 1', title: 'Regimen Start Date', desc: 'Started Amlodipine 5mg & Metformin 500mg per Dr. Mehta prescription.', type: 'start' }
    ],
    upcomingFollowups: [
      { date: 'Aug 09, 2026', doctor: 'Dr. A. Mehta (Cardiology)', facility: 'Apollo Hospital, Bengaluru' }
    ],
    digest: { period: 'July 21 – July 27, 2026', adherenceRate: 86, streakDays: 6, openFlagsCount: 2 },
    governance: [
      { role: 'Patient (Owner)', name: 'Ramesh Kumar', phone: '+91 98765 43210', accessLevel: 'Full Access', addedAt: 'Onboarding (2026-07-20)' },
      { role: 'Primary Caregiver', name: 'Priya Kumar (Daughter)', phone: '+91 98765 00001', accessLevel: 'Linked Caregiver', addedAt: 'Invite Confirmed' }
    ]
  },

  'patient-sunita-devi': {
    patient: {
      patient_id: 'patient-sunita-devi',
      name: 'Sunita Devi',
      age: 65,
      gender: 'Female',
      blood_group: 'O+',
      abha_id: '91-8821-3094-1102',
      address: '405, Rosewood Apts, Koramangala, Bengaluru, Karnataka 560034',
      known_allergies: ['Aspirin'],
      primary_conditions: ['Hypothyroidism', 'Rheumatoid Arthritis', 'Bronchial Asthma'],
      phone_number: '+91 98123 45678',
      vitals: { height_cm: 158, weight_kg: 62, bmi: 24.8, bp_baseline: '122/78 mmHg', blood_sugar_fasting: '98 mg/dL' },
      emergency_contact: { name: 'Amit Devi', relationship: 'Son', phone: '+91 98123 00002' }
    },
    caregivers: [
      { caregiver_id: 'cg-02', name: 'Amit Devi', relationship_to_patient: 'Son', phone_number: '+91 98123 00002' }
    ],
    medicines: [
      { medicine_id: 'med-10', name: 'Foracort Inhaler 200', dosage: '2 puffs', frequency: 'Twice daily', duration: '60 days', doctor_name: 'Dr. V. Kulkarni (Pulmonology)', active: true, confidence: 96 },
      { medicine_id: 'med-11', name: 'Levothyroxine', dosage: '50 mcg', frequency: 'Once daily (Empty stomach)', duration: '90 days', doctor_name: 'Dr. S. Nambiar (Endocrinology)', active: true, confidence: 98 },
      { medicine_id: 'med-12', name: 'Methotrexate', dosage: '7.5 mg', frequency: 'Once weekly (Sundays)', duration: '30 days', doctor_name: 'Dr. M. Rao (Rheumatology)', active: true, confidence: 92 },
      { medicine_id: 'med-13', name: 'Folic Acid', dosage: '5 mg', frequency: 'Once daily (Except Sunday)', duration: '30 days', doctor_name: 'Dr. M. Rao (Rheumatology)', active: true, confidence: 95 }
    ],
    safety_flags: [
      { id: 'sf-s1', type: 'allergy_warning', severity: 'caution', title: 'Known Drug Allergy Alert: Aspirin Avoidance', medicines: ['Aspirin'], reasoning: 'Patient has documented severe allergy to Aspirin/NSAIDs. Ensure no combination cold/flu meds contain Aspirin.' }
    ],
    adherence: {
      ratePercentage: 95,
      streakDays: 14,
      days: [
        { eventId: 'e-10', date: 'Jul 21', status: 'done', med: 'Levothyroxine 50mcg' },
        { eventId: 'e-11', date: 'Jul 22', status: 'done', med: 'Levothyroxine 50mcg' },
        { eventId: 'e-12', date: 'Jul 23', status: 'done', med: 'Levothyroxine 50mcg' },
        { eventId: 'e-13', date: 'Jul 24', status: 'done', med: 'Levothyroxine 50mcg' },
        { eventId: 'e-14', date: 'Jul 25', status: 'done', med: 'Levothyroxine 50mcg' },
        { eventId: 'e-15', date: 'Jul 26', status: 'done', med: 'Levothyroxine 50mcg' },
        { eventId: 'e-16', date: 'Jul 27 (Today)', status: 'done', med: 'Levothyroxine 50mcg' }
      ]
    },
    refills: [
      { name: 'Foracort Inhaler 200', daysLeft: 18, endDate: '2026-08-16', status: 'Stock OK' },
      { name: 'Levothyroxine 50mcg', daysLeft: 45, endDate: '2026-09-12', status: 'Stock OK' }
    ],
    timelineEvents: [
      { id: 'ts1', day: 'Day 1', title: 'Thyroid & Asthma Follow-up', desc: 'Prescription renewed by Dr. Nambiar.', type: 'start' }
    ],
    upcomingFollowups: [
      { date: 'Aug 22, 2026', doctor: 'Dr. M. Rao (Rheumatology)', facility: 'Manipal Hospital, Bengaluru' }
    ],
    digest: { period: 'July 21 – July 27, 2026', adherenceRate: 95, streakDays: 14, openFlagsCount: 1 },
    governance: [
      { role: 'Patient (Owner)', name: 'Sunita Devi', phone: '+91 98123 45678', accessLevel: 'Full Access', addedAt: 'Onboarding (2026-07-15)' },
      { role: 'Primary Caregiver', name: 'Amit Devi (Son)', phone: '+91 98123 00002', accessLevel: 'Linked Caregiver', addedAt: 'Invite Confirmed' }
    ]
  },

  'patient-gurpreet-singh': {
    patient: {
      patient_id: 'patient-gurpreet-singh',
      name: 'Gurpreet Singh',
      age: 69,
      gender: 'Male',
      blood_group: 'A+',
      abha_id: '91-5510-9283-4412',
      address: '22, Sector 15, Chandigarh / Indiranagar, Bengaluru',
      known_allergies: ['Codeine'],
      primary_conditions: ['Post-MI Coronary Artery Disease', 'Hyperlipidemia', 'Hyperuricemia'],
      phone_number: '+91 98345 67890',
      vitals: { height_cm: 174, weight_kg: 78, bmi: 25.8, bp_baseline: '126/80 mmHg', blood_sugar_fasting: '105 mg/dL' },
      emergency_contact: { name: 'Harpreet Kaur', relationship: 'Wife', phone: '+91 98345 00003' }
    },
    caregivers: [
      { caregiver_id: 'cg-03', name: 'Harpreet Kaur', relationship_to_patient: 'Wife', phone_number: '+91 98345 00003' }
    ],
    medicines: [
      { medicine_id: 'med-20', name: 'Atorvastatin', dosage: '40 mg', frequency: 'Once daily (Bedtime)', duration: '90 days', doctor_name: 'Dr. K. Gill (Cardiology)', active: true, confidence: 97 },
      { medicine_id: 'med-21', name: 'Clopidogrel', dosage: '75 mg', frequency: 'Once daily (Morning)', duration: '90 days', doctor_name: 'Dr. K. Gill (Cardiology)', active: true, confidence: 94 },
      { medicine_id: 'med-22', name: 'Metoprolol Succinate', dosage: '25 mg', frequency: 'Once daily (Morning)', duration: '90 days', doctor_name: 'Dr. K. Gill (Cardiology)', active: true, confidence: 96 },
      { medicine_id: 'med-23', name: 'Allopurinol', dosage: '100 mg', frequency: 'Once daily (After lunch)', duration: '30 days', doctor_name: 'Dr. P. Deshmukh (Nephrology)', active: true, confidence: 90 }
    ],
    safety_flags: [
      { id: 'sf-g1', type: 'info', severity: 'info', title: 'Post-Stent Dual Antiplatelet Monitoring', medicines: ['Clopidogrel 75mg'], reasoning: 'Clopidogrel requires consistent daily dosing — do not skip doses without consulting cardiologist.' }
    ],
    adherence: {
      ratePercentage: 100,
      streakDays: 21,
      days: [
        { eventId: 'e-20', date: 'Jul 21', status: 'done', med: 'Clopidogrel 75mg' },
        { eventId: 'e-21', date: 'Jul 22', status: 'done', med: 'Clopidogrel 75mg' },
        { eventId: 'e-22', date: 'Jul 23', status: 'done', med: 'Clopidogrel 75mg' },
        { eventId: 'e-23', date: 'Jul 24', status: 'done', med: 'Clopidogrel 75mg' },
        { eventId: 'e-24', date: 'Jul 25', status: 'done', med: 'Clopidogrel 75mg' },
        { eventId: 'e-25', date: 'Jul 26', status: 'done', med: 'Clopidogrel 75mg' },
        { eventId: 'e-26', date: 'Jul 27 (Today)', status: 'done', med: 'Clopidogrel 75mg' }
      ]
    },
    refills: [
      { name: 'Clopidogrel 75mg', daysLeft: 25, endDate: '2026-08-22', status: 'Stock OK' },
      { name: 'Atorvastatin 40mg', daysLeft: 25, endDate: '2026-08-22', status: 'Stock OK' }
    ],
    timelineEvents: [
      { id: 'tg1', day: 'Day 1', title: 'Post-MI Lipid Target Re-evaluation', desc: 'Atorvastatin dosage set to 40mg HS.', type: 'start' }
    ],
    upcomingFollowups: [
      { date: 'Sep 05, 2026', doctor: 'Dr. K. Gill (Cardiology)', facility: 'Fortis Heart Institute' }
    ],
    digest: { period: 'July 21 – July 27, 2026', adherenceRate: 100, streakDays: 21, openFlagsCount: 1 },
    governance: [
      { role: 'Patient (Owner)', name: 'Gurpreet Singh', phone: '+91 98345 67890', accessLevel: 'Full Access', addedAt: 'Onboarding (2026-06-10)' },
      { role: 'Primary Caregiver', name: 'Harpreet Kaur (Wife)', phone: '+91 98345 00003', accessLevel: 'Linked Caregiver', addedAt: 'Invite Confirmed' }
    ]
  },

  'patient-lakshmi-narayanan': {
    patient: {
      patient_id: 'patient-lakshmi-narayanan',
      name: 'Lakshmi Narayanan',
      age: 78,
      gender: 'Female',
      blood_group: 'AB+',
      abha_id: '91-3329-8812-9011',
      address: '701, Temple View Apts, Mylapore, Chennai / Jayanagar, Bengaluru',
      known_allergies: ['NSAIDs', 'Ibuprofen', 'Diclofenac'],
      primary_conditions: ['Chronic Kidney Disease (Stage 3)', 'Osteoarthritis', 'Hypertension'],
      phone_number: '+91 98450 11223',
      vitals: { height_cm: 152, weight_kg: 56, bmi: 24.2, bp_baseline: '134/82 mmHg', blood_sugar_fasting: '102 mg/dL' },
      emergency_contact: { name: 'Venkat Narayanan', relationship: 'Son', phone: '+91 98450 00004' }
    },
    caregivers: [
      { caregiver_id: 'cg-04', name: 'Venkat Narayanan', relationship_to_patient: 'Son', phone_number: '+91 98450 00004' }
    ],
    medicines: [
      { medicine_id: 'med-30', name: 'Cilnidipine', dosage: '10 mg', frequency: 'Once daily (Morning)', duration: '30 days', doctor_name: 'Dr. T. Ramanathan (Nephrology)', active: true, confidence: 97 },
      { medicine_id: 'med-31', name: 'Paracetamol', dosage: '650 mg', frequency: 'As needed for joint pain (Max 2g/day)', duration: '30 days', doctor_name: 'Dr. R. Swaminathan (Rheumatology)', active: true, confidence: 93 },
      { medicine_id: 'med-32', name: 'Alpha Ketoanalogues', dosage: '1 tablet', frequency: 'Three times daily (With meals)', duration: '30 days', doctor_name: 'Dr. T. Ramanathan (Nephrology)', active: true, confidence: 91 },
      { medicine_id: 'med-33', name: 'Calcium Carbonate + D3', dosage: '500 mg', frequency: 'Once daily (After lunch)', duration: '60 days', doctor_name: 'Dr. R. Swaminathan (Rheumatology)', active: true, confidence: 96 }
    ],
    safety_flags: [
      { id: 'sf-l1', type: 'renal_warning', severity: 'caution', title: 'CKD Renal Safety Boundary: Strict NSAID Avoidance', medicines: ['Ibuprofen', 'Diclofenac', 'Naproxen'], reasoning: 'Patient has Stage 3 CKD. Avoid over-the-counter painkiller NSAIDs to protect renal function — use Paracetamol only.' }
    ],
    adherence: {
      ratePercentage: 90,
      streakDays: 8,
      days: [
        { eventId: 'e-30', date: 'Jul 21', status: 'done', med: 'Cilnidipine 10mg' },
        { eventId: 'e-31', date: 'Jul 22', status: 'done', med: 'Cilnidipine 10mg' },
        { eventId: 'e-32', date: 'Jul 23', status: 'done', med: 'Cilnidipine 10mg' },
        { eventId: 'e-33', date: 'Jul 24', status: 'done', med: 'Cilnidipine 10mg' },
        { eventId: 'e-34', date: 'Jul 25', status: 'missed', med: 'Cilnidipine 10mg' },
        { eventId: 'e-35', date: 'Jul 26', status: 'done', med: 'Cilnidipine 10mg' },
        { eventId: 'e-36', date: 'Jul 27 (Today)', status: 'done', med: 'Cilnidipine 10mg' }
      ]
    },
    refills: [
      { name: 'Cilnidipine 10mg', daysLeft: 8, endDate: '2026-08-05', status: 'Refill Soon' },
      { name: 'Alpha Ketoanalogues', daysLeft: 14, endDate: '2026-08-11', status: 'Stock OK' }
    ],
    timelineEvents: [
      { id: 'tl1', day: 'Day 1', title: 'Renal Regimen Verification', desc: 'Cilnidipine selected for renal protection in CKD Stage 3.', type: 'start' }
    ],
    upcomingFollowups: [
      { date: 'Aug 14, 2026', doctor: 'Dr. T. Ramanathan (Nephrology)', facility: 'Apollo Hospitals, Chennai' }
    ],
    digest: { period: 'July 21 – July 27, 2026', adherenceRate: 90, streakDays: 8, openFlagsCount: 1 },
    governance: [
      { role: 'Patient (Owner)', name: 'Lakshmi Narayanan', phone: '+91 98450 11223', accessLevel: 'Full Access', addedAt: 'Onboarding (2026-05-18)' },
      { role: 'Primary Caregiver', name: 'Venkat Narayanan (Son)', phone: '+91 98450 00004', accessLevel: 'Linked Caregiver', addedAt: 'Invite Confirmed' }
    ]
  },

  'patient-ananya-banerjee': {
    patient: {
      patient_id: 'patient-ananya-banerjee',
      name: 'Ananya Banerjee',
      age: 58,
      gender: 'Female',
      blood_group: 'A-',
      abha_id: '91-7712-4019-3388',
      address: '304, Lake View, Salt Lake, Kolkata / Whitefield, Bengaluru',
      known_allergies: ['Shellfish'],
      primary_conditions: ['Type 2 Diabetes Mellitus', 'Generalized Anxiety Disorder', 'GERD'],
      phone_number: '+91 98711 22334',
      vitals: { height_cm: 162, weight_kg: 64, bmi: 24.4, bp_baseline: '118/76 mmHg', blood_sugar_fasting: '124 mg/dL' },
      emergency_contact: { name: 'Sourav Banerjee', relationship: 'Husband', phone: '+91 98711 00005' }
    },
    caregivers: [
      { caregiver_id: 'cg-05', name: 'Sourav Banerjee', relationship_to_patient: 'Husband', phone_number: '+91 98711 00005' }
    ],
    medicines: [
      { medicine_id: 'med-40', name: 'Teneligliptin', dosage: '20 mg', frequency: 'Once daily (Before breakfast)', duration: '30 days', doctor_name: 'Dr. B. Mukhopadhyay (Diabetology)', active: true, confidence: 96 },
      { medicine_id: 'med-41', name: 'Escitalopram', dosage: '10 mg', frequency: 'Once daily (Bedtime)', duration: '60 days', doctor_name: 'Dr. A. Sen (Psychiatry)', active: true, confidence: 95 },
      { medicine_id: 'med-42', name: 'Rabeprazole', dosage: '20 mg', frequency: 'Once daily (Empty stomach)', duration: '30 days', doctor_name: 'Dr. B. Mukhopadhyay (Diabetology)', active: true, confidence: 94 },
      { medicine_id: 'med-43', name: 'Glimepiride', dosage: '1 mg', frequency: 'Once daily (Before breakfast)', duration: '30 days', doctor_name: 'Dr. B. Mukhopadhyay (Diabetology)', active: true, confidence: 92 }
    ],
    safety_flags: [
      { id: 'sf-a1', type: 'hypoglycemia_warning', severity: 'caution', title: 'Hypoglycemia Meal Coordination Notice', medicines: ['Glimepiride 1mg'], reasoning: 'Glimepiride stimulates insulin secretion. Ensure breakfast is taken within 15 minutes of dosing to prevent low blood sugar.' }
    ],
    adherence: {
      ratePercentage: 92,
      streakDays: 11,
      days: [
        { eventId: 'e-40', date: 'Jul 21', status: 'done', med: 'Teneligliptin 20mg' },
        { eventId: 'e-41', date: 'Jul 22', status: 'done', med: 'Teneligliptin 20mg' },
        { eventId: 'e-42', date: 'Jul 23', status: 'done', med: 'Teneligliptin 20mg' },
        { eventId: 'e-43', date: 'Jul 24', status: 'done', med: 'Teneligliptin 20mg' },
        { eventId: 'e-44', date: 'Jul 25', status: 'done', med: 'Teneligliptin 20mg' },
        { eventId: 'e-45', date: 'Jul 26', status: 'missed', med: 'Teneligliptin 20mg' },
        { eventId: 'e-46', date: 'Jul 27 (Today)', status: 'done', med: 'Teneligliptin 20mg' }
      ]
    },
    refills: [
      { name: 'Teneligliptin 20mg', daysLeft: 12, endDate: '2026-08-09', status: 'Stock OK' },
      { name: 'Escitalopram 10mg', daysLeft: 38, endDate: '2026-09-04', status: 'Stock OK' }
    ],
    timelineEvents: [
      { id: 'ta1', day: 'Day 1', title: 'Anxiety & Glycemic Control Review', desc: 'Teneligliptin 20mg + Glimepiride 1mg combination prescribed.', type: 'start' }
    ],
    upcomingFollowups: [
      { date: 'Aug 18, 2026', doctor: 'Dr. B. Mukhopadhyay (Diabetology)', facility: 'AMRI Hospital, Kolkata' }
    ],
    digest: { period: 'July 21 – July 27, 2026', adherenceRate: 92, streakDays: 11, openFlagsCount: 1 },
    governance: [
      { role: 'Patient (Owner)', name: 'Ananya Banerjee', phone: '+91 98711 22334', accessLevel: 'Full Access', addedAt: 'Onboarding (2026-07-01)' },
      { role: 'Primary Caregiver', name: 'Sourav Banerjee (Husband)', phone: '+91 98711 00005', accessLevel: 'Linked Caregiver', addedAt: 'Invite Confirmed' }
    ]
  }
};
