/**
 * SpashtCare — Demo Seed Data
 * Patient: Ramesh Kumar (72, hypertensive diabetic)
 * Two prescriptions from two different doctors demonstrating:
 *  - multi-doctor reconciliation (therapeutic duplication: two BP meds)
 *  - drug interaction flag (metformin + ibuprofen)
 *  - low-confidence field on Doc 2 (illegible handwriting simulation)
 */

import { getDb } from './index';
import { v4 as uuid } from 'uuid';

const db = getDb();

function seed() {
  // ──────────── PATIENTS ────────────
  const patientId = 'patient-ramesh-kumar';
  const caregiverId = 'caregiver-priya-kumar';
  const caseId = 'case-001';

  // Make the demo seed repeatable. UUID-based child rows cannot be replaced
  // by a second seed run, so clear only the previous demo case first.
  db.transaction(() => {
    db.prepare(`DELETE FROM safety_flags WHERE case_id = ?`).run(caseId);
    db.prepare(`DELETE FROM adherence_events WHERE medicine_id NOT IN (SELECT medicine_id FROM medicines)`).run();
    db.prepare(`DELETE FROM adherence_events WHERE medicine_id IN (SELECT medicine_id FROM medicines WHERE case_id = ?)`).run(caseId);
    db.prepare(`DELETE FROM medicines WHERE case_id = ?`).run(caseId);
    db.prepare(`DELETE FROM extraction_attempts WHERE document_id IN (SELECT document_id FROM documents WHERE case_id = ?)`).run(caseId);
    db.prepare(`DELETE FROM extracted_fields WHERE document_id IN (SELECT document_id FROM documents WHERE case_id = ?)`).run(caseId);
    db.prepare(`DELETE FROM documents WHERE case_id = ?`).run(caseId);
    db.prepare(`DELETE FROM consent_records WHERE case_id = ?`).run(caseId);
    db.prepare(`DELETE FROM escalation_events WHERE case_id IS NULL`).run();
    db.prepare(`DELETE FROM escalation_events WHERE case_id = ?`).run(caseId);
    db.prepare(`DELETE FROM cases WHERE case_id = ?`).run(caseId);
    db.prepare(`DELETE FROM generic_substitutes WHERE brand_name IN ('Amlokind', 'Glycomet', 'Ecosprin', 'Telma', 'Brufen', 'Pan-D')`).run();
  })();

  db.prepare(`INSERT OR REPLACE INTO patients VALUES (?,?,?,?,?,?,?)`).run(
    patientId,
    'Ramesh Kumar',
    72,
    'B+',
    JSON.stringify(['Penicillin', 'Sulfa drugs']),
    '+91-98765-43210',
    new Date().toISOString()
  );

  // ──────────── CAREGIVER ────────────
  db.prepare(`INSERT OR REPLACE INTO caregivers VALUES (?,?,?,?,?,?)`).run(
    caregiverId,
    'Priya Kumar',
    'Daughter',
    '+91-98765-00001',
    JSON.stringify({ whatsapp: true, sms: false }),
    new Date().toISOString()
  );

  // ──────────── CASE ────────────
  db.prepare(`INSERT OR REPLACE INTO cases VALUES (?,?,?,?,?,?,?)`).run(
    caseId,
    patientId,
    JSON.stringify([caregiverId]),
    'hi',   // preferred language: Hindi
    'granted',
    new Date(Date.now() - 7 * 86400000).toISOString(),
    new Date(Date.now() - 7 * 86400000).toISOString()
  );

  // ──────────── CONSENT RECORD ────────────
  db.prepare(`INSERT OR REPLACE INTO consent_records VALUES (?,?,?,?,?)`).run(
    uuid(),
    caseId,
    'hi',
    1,
    new Date(Date.now() - 7 * 86400000).toISOString()
  );

  // ──────────── DOCUMENT 1 — Dr. Mehta (Cardiologist) ────────────
  const doc1Id = 'doc-001-mehta';
  db.prepare(`INSERT OR REPLACE INTO documents VALUES (?,?,?,?,?,?,?,?,?)`).run(
    doc1Id,
    caseId,
    '/uploads/prescription_mehta.jpg',
    'prescription',
    'Tablet Amlodipine 5mg OD\nTablet Metformin 500mg BD\nTablet Aspirin 75mg OD\nFollow up: 15 days\nDr. A. Mehta, Cardiologist',
    'Dr. A. Mehta',
    'Apollo Hospital, Bengaluru',
    new Date(Date.now() - 7 * 86400000).toISOString(),
    new Date(Date.now() - 7 * 86400000).toISOString()
  );

  // ──────────── DOCUMENT 2 — Dr. Sharma (Orthopedic, new prescription) ────────────
  const doc2Id = 'doc-002-sharma';
  db.prepare(`INSERT OR REPLACE INTO documents VALUES (?,?,?,?,?,?,?,?,?)`).run(
    doc2Id,
    caseId,
    '/uploads/prescription_sharma.jpg',
    'prescription',
    'Tab Telmisartan 40mg OD\nTab Ibuprofen 400mg TDS (7 days)\nTab Pantoprazole 40mg OD',
    'Dr. R. Sharma',
    'Manipal Hospital, Bengaluru',
    new Date().toISOString(),
    new Date().toISOString()
  );

  // ──────────── EXTRACTED FIELDS — Doc 1 ────────────
  const fields1 = [
    { type: 'drug_name', raw: 'Amlodipine 5mg', norm: 'Amlodipine', conf: 95, status: 'auto_resolved' },
    { type: 'dosage',    raw: '5mg',             norm: '5 mg',        conf: 97, status: 'auto_resolved' },
    { type: 'frequency', raw: 'OD',              norm: 'Once daily',  conf: 92, status: 'verified_against_db' },
    { type: 'drug_name', raw: 'Metformin 500mg', norm: 'Metformin',   conf: 93, status: 'auto_resolved' },
    { type: 'dosage',    raw: '500mg',           norm: '500 mg',      conf: 91, status: 'auto_resolved' },
    { type: 'frequency', raw: 'BD',              norm: 'Twice daily', conf: 88, status: 'auto_resolved' },
    { type: 'drug_name', raw: 'Aspirin 75mg',    norm: 'Aspirin',     conf: 94, status: 'auto_resolved' },
    { type: 'follow_up_date', raw: '15 days',    norm: new Date(Date.now() + 8 * 86400000).toISOString().split('T')[0], conf: 82, status: 'auto_resolved' },
  ];

  for (const f of fields1) {
    const fid = uuid();
    db.prepare(`INSERT OR REPLACE INTO extracted_fields VALUES (?,?,?,?,?,?,?,?,?)`).run(
      fid, doc1Id, f.type, f.raw, f.norm, f.conf, 0, f.status, new Date().toISOString()
    );
    // Create initial extraction attempt log
    db.prepare(`INSERT OR REPLACE INTO extraction_attempts VALUES (?,?,?,?,?,?,?,?,?,?,?)`).run(
      uuid(), fid, doc1Id,
      'INITIAL_EXTRACTION',
      JSON.stringify({ image: doc1Id }),
      JSON.stringify({ value: f.raw, confidence: f.conf }),
      null, f.conf, null,
      'Initial Gemini multimodal extraction',
      new Date().toISOString()
    );
  }

  // ──────────── EXTRACTED FIELDS — Doc 2 (with LOW CONFIDENCE on Telmisartan — simulate illegible) ────────────
  const telmField1Id = uuid();
  const telmField2Id = uuid();
  const ibuprofenFieldId = uuid();

  const fields2 = [
    { id: telmField1Id,  type: 'drug_name', raw: 'Telm???tan 40mg', norm: 'Telmisartan', conf: 42, retries: 2, status: 'auto_resolved' },
    { id: telmField2Id,  type: 'dosage',    raw: '40mg',            norm: '40 mg',        conf: 88, retries: 0, status: 'auto_resolved' },
    { id: uuid(),        type: 'frequency', raw: 'OD',              norm: 'Once daily',   conf: 85, retries: 0, status: 'auto_resolved' },
    { id: ibuprofenFieldId, type: 'drug_name', raw: 'Ibuprofen 400mg', norm: 'Ibuprofen', conf: 91, retries: 0, status: 'auto_resolved' },
    { id: uuid(),        type: 'dosage',    raw: '400mg',           norm: '400 mg',       conf: 89, retries: 0, status: 'auto_resolved' },
    { id: uuid(),        type: 'frequency', raw: 'TDS',             norm: 'Three times daily', conf: 78, retries: 1, status: 'verified_against_db' },
    { id: uuid(),        type: 'duration',  raw: '7 days',          norm: '7 days',       conf: 90, retries: 0, status: 'auto_resolved' },
    { id: uuid(),        type: 'drug_name', raw: 'Pantoprazole 40mg', norm: 'Pantoprazole', conf: 88, retries: 0, status: 'auto_resolved' },
  ];

  for (const f of fields2) {
    db.prepare(`INSERT OR REPLACE INTO extracted_fields VALUES (?,?,?,?,?,?,?,?,?)`).run(
      f.id, doc2Id, f.type, f.raw, f.norm, f.conf, f.retries, f.status, new Date().toISOString()
    );
  }

  // ──────────── EXTRACTION ATTEMPT LOG — Telmisartan (full retry loop demo) ────────────
  const baseTime = Date.now() - 5000;

  db.prepare(`INSERT OR REPLACE INTO extraction_attempts VALUES (?,?,?,?,?,?,?,?,?,?,?)`).run(
    uuid(), telmField1Id, doc2Id,
    'INITIAL_EXTRACTION',
    JSON.stringify({ image: doc2Id, field_hint: 'drug_name' }),
    JSON.stringify({ raw_value: 'Telm???tan 40mg', normalized: 'Unknown', confidence: 42 }),
    null, 42, null,
    'Initial extraction — handwriting partially illegible. Confidence 42% (below 80% threshold).',
    new Date(baseTime).toISOString()
  );

  db.prepare(`INSERT OR REPLACE INTO extraction_attempts VALUES (?,?,?,?,?,?,?,?,?,?,?)`).run(
    uuid(), telmField1Id, doc2Id,
    'LOW_CONFIDENCE_ROUTING',
    JSON.stringify({ confidence: 42, threshold: 80 }),
    JSON.stringify({ action: 'route_to_cross_check', field: 'Telm???tan 40mg' }),
    42, 42,
    JSON.stringify(['Telmisartan', 'Telmiride', 'Telmikind']),
    'Confidence 42% < threshold 80%. Routing to cross-check against drug DB and patient history.',
    new Date(baseTime + 500).toISOString()
  );

  db.prepare(`INSERT OR REPLACE INTO extraction_attempts VALUES (?,?,?,?,?,?,?,?,?,?,?)`).run(
    uuid(), telmField1Id, doc2Id,
    'CROSS_CHECK',
    JSON.stringify({ candidates: ['Telmisartan', 'Telmiride', 'Telmikind'], patient_history: ['Amlodipine', 'Metformin', 'Aspirin'] }),
    JSON.stringify({ best_match: 'Telmisartan', match_score: 0.71, source: 'drug_db_fuzzy' }),
    42, 58,
    JSON.stringify(['Telmisartan (score:0.71)', 'Telmiride (score:0.41)', 'Telmikind (score:0.38)']),
    'Fuzzy match against drug name DB: best candidate is Telmisartan (score 0.71). Confidence improved to 58% but still below threshold. Proceeding to retry extraction.',
    new Date(baseTime + 1200).toISOString()
  );

  db.prepare(`INSERT OR REPLACE INTO extraction_attempts VALUES (?,?,?,?,?,?,?,?,?,?,?)`).run(
    uuid(), telmField1Id, doc2Id,
    'RETRY_EXTRACTION',
    JSON.stringify({ image: doc2Id, region: 'line_1', candidates: ['Telmisartan', 'Telmiride'], context: 'Does this look more like Telmisartan or Telmiride?' }),
    JSON.stringify({ raw_value: 'Telmisartan 40mg', normalized: 'Telmisartan', confidence: 87 }),
    58, 87,
    JSON.stringify(['Telmisartan']),
    'Re-prompted Gemini with candidate context: "Does this look more like Telmisartan or Telmiride?" — model now reads Telmisartan with confidence 87%. Threshold passed.',
    new Date(baseTime + 2100).toISOString()
  );

  // ──────────── MEDICINES — from both documents ────────────
  const med1Id = uuid(); // Amlodipine (Dr Mehta)
  const med2Id = uuid(); // Metformin
  const med3Id = uuid(); // Aspirin
  const med4Id = uuid(); // Telmisartan (Dr Sharma) — THERAPEUTIC DUPLICATION with Amlodipine
  const med5Id = uuid(); // Ibuprofen — INTERACTION with Metformin
  const med6Id = uuid(); // Pantoprazole

  const meds = [
    { id: med1Id, name: 'Amlodipine',   brand: 'Amlokind',      tc: 'Calcium Channel Blocker',  dose: '5 mg',  freq: 'Once daily',     dur: '30 days', doc: doc1Id },
    { id: med2Id, name: 'Metformin',    brand: 'Glycomet',      tc: 'Biguanide Antidiabetic',   dose: '500 mg', freq: 'Twice daily',    dur: '30 days', doc: doc1Id },
    { id: med3Id, name: 'Aspirin',      brand: 'Ecosprin',      tc: 'Antiplatelet / NSAID',     dose: '75 mg', freq: 'Once daily',     dur: '30 days', doc: doc1Id },
    { id: med4Id, name: 'Telmisartan',  brand: 'Telma',         tc: 'ARB Antihypertensive',     dose: '40 mg', freq: 'Once daily',     dur: '30 days', doc: doc2Id },
    { id: med5Id, name: 'Ibuprofen',    brand: 'Brufen',        tc: 'NSAID',                    dose: '400 mg', freq: 'Three times daily', dur: '7 days', doc: doc2Id },
    { id: med6Id, name: 'Pantoprazole', brand: 'Pan-D',         tc: 'Proton Pump Inhibitor',    dose: '40 mg', freq: 'Once daily',     dur: '7 days', doc: doc2Id },
  ];

  const startDate = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
  const endDate30 = new Date(Date.now() + 23 * 86400000).toISOString().split('T')[0];
  const endDate7 = new Date(Date.now() + 0 * 86400000).toISOString().split('T')[0];

  for (const m of meds) {
    const endDate = m.dur === '7 days' ? endDate7 : endDate30;
    db.prepare(`INSERT OR REPLACE INTO medicines VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(
      m.id, caseId, m.name, m.brand, m.tc, m.dose, m.freq, m.dur,
      startDate, endDate, m.doc, 1, new Date().toISOString()
    );
  }

  // ──────────── SAFETY FLAGS ────────────

  // 1. Therapeutic duplication: Amlodipine (CCB) + Telmisartan (ARB) — two BP medications from two doctors
  db.prepare(`INSERT OR REPLACE INTO safety_flags VALUES (?,?,?,?,?,?,?,?)`).run(
    uuid(), caseId,
    'therapeutic_duplication',
    JSON.stringify([med1Id, med4Id]),
    'Amlodipine (prescribed by Dr. Mehta) and Telmisartan (prescribed by Dr. Sharma) are both blood-pressure medications from different drug classes. Taking two antihypertensives together without coordination between your doctors may cause your blood pressure to drop too low. Please ask your pharmacist or doctor before taking both.',
    'caution',
    0,
    new Date().toISOString()
  );

  // 2. Drug interaction: Metformin + Ibuprofen — NSAIDs can affect kidney function and metformin clearance
  db.prepare(`INSERT OR REPLACE INTO safety_flags VALUES (?,?,?,?,?,?,?,?)`).run(
    uuid(), caseId,
    'drug_interaction',
    JSON.stringify([med2Id, med5Id]),
    'Ibuprofen (an NSAID) can reduce kidney function, which may slow the clearance of Metformin and increase its concentration in the blood. This combination should be used cautiously and only for the prescribed 7-day course. Please ask your pharmacist or doctor if you have any kidney concerns.',
    'caution',
    0,
    new Date().toISOString()
  );

  // 3. Allergy — Ibuprofen cross-reacts with aspirin sensitivity in some patients (flagged for safety)
  db.prepare(`INSERT OR REPLACE INTO safety_flags VALUES (?,?,?,?,?,?,?,?)`).run(
    uuid(), caseId,
    'drug_interaction',
    JSON.stringify([med3Id, med5Id]),
    'Both Aspirin and Ibuprofen belong to the NSAID class. Taking both together increases the risk of stomach bleeding and can reduce the antiplatelet effect of Aspirin. Please confirm this combination with your pharmacist or doctor.',
    'caution',
    0,
    new Date().toISOString()
  );

  // 4. Low confidence field flag
  db.prepare(`INSERT OR REPLACE INTO safety_flags VALUES (?,?,?,?,?,?,?,?)`).run(
    uuid(), caseId,
    'low_confidence_field',
    JSON.stringify([med4Id]),
    'The drug name "Telmisartan" on Dr. Sharma\'s prescription was initially unclear (confidence 42%). The agent resolved it through a retry loop — please confirm this reading with your pharmacist.',
    'info',
    0,
    new Date().toISOString()
  );

  // ──────────── ADHERENCE EVENTS (past 7 days for Amlodipine — demo streak with 1 missed) ────────────
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const scheduledDate = new Date(today);
    scheduledDate.setDate(today.getDate() - i);
    scheduledDate.setHours(8, 0, 0, 0);

    const status = i === 2 || i === 1 ? 'missed' : 'done';
    const respondedAt = status === 'done' ? new Date(scheduledDate.getTime() + 900000).toISOString() : null;

    db.prepare(`INSERT OR REPLACE INTO adherence_events VALUES (?,?,?,?,?,?)`).run(
      uuid(), med1Id, scheduledDate.toISOString(), status, respondedAt, new Date().toISOString()
    );
  }

  // ──────────── GENERIC SUBSTITUTES ────────────
  const generics = [
    { brand: 'Amlokind',     generic: 'Amlodipine 5mg',     jan: 1 },
    { brand: 'Glycomet',     generic: 'Metformin 500mg',    jan: 1 },
    { brand: 'Ecosprin',     generic: 'Aspirin 75mg',       jan: 1 },
    { brand: 'Telma',        generic: 'Telmisartan 40mg',   jan: 1 },
    { brand: 'Brufen',       generic: 'Ibuprofen 400mg',    jan: 1 },
    { brand: 'Pan-D',        generic: 'Pantoprazole 40mg',  jan: 1 },
  ];
  for (const g of generics) {
    db.prepare(`INSERT OR REPLACE INTO generic_substitutes VALUES (?,?,?,?,?)`).run(
      uuid(), g.brand, g.generic, g.jan,
      'Available at Jan Aushadhi Kendra. Ask your pharmacist to confirm availability.'
    );
  }

  // ──────────── ESCALATION EVENT (1 missed dose → caregiver notified) ────────────
  db.prepare(`INSERT OR REPLACE INTO escalation_events VALUES (?,?,?,?,?,?)`).run(
    uuid(), caseId,
    'repeated_missed_doses',
    new Date(Date.now() - 2 * 86400000).toISOString(),
    1,
    new Date(Date.now() - 2 * 86400000).toISOString()
  );

  console.log('✅ SpashtCare demo seed data loaded successfully');
  console.log('   Patient: Ramesh Kumar (72, B+)');
  console.log('   Caregiver: Priya Kumar (Daughter)');
  console.log('   Documents: 2 (Dr. Mehta + Dr. Sharma)');
  console.log('   Medicines: 6 (with therapeutic duplication + drug interaction flags)');
  console.log('   Safety Flags: 4 (1 therapeutic duplication, 2 drug interactions, 1 low-confidence)');
  console.log('   Adherence Events: 7 days (1 missed dose → escalation)');
}

seed();
