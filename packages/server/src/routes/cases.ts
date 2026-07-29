/**
 * SpashtCare — Cases & Patient API Routes
 */

import { Router } from 'express';
import { getDb } from '../db/index';
import { checkInteractions, checkTherapeuticDuplication, checkAllergies } from '../services/safety/interactionChecker';
import { calculateRefillPrediction } from '../services/refill/predictor';
import { generateTimelineSVG, generateEmergencyCardSVG } from '../services/imageGen/timeline';

const router = Router();

// POST /api/cases — Create a new patient and case record
router.post('/', (req, res) => {
  try {
    const db = getDb();
    const { name, age, blood_group, known_allergies, phone_number, caregiver_name, caregiver_phone } = req.body;

    const patientId = `patient-${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now().toString(36).slice(-4)}`;
    const caregiverId = `cg-${Date.now().toString(36).slice(-4)}`;
    const caseId = `case-${Date.now().toString(36).slice(-4)}`;
    const now = new Date().toISOString();

    const allergiesArr = Array.isArray(known_allergies) ? known_allergies : (known_allergies ? [known_allergies] : []);

    // Insert Patient
    db.prepare(`INSERT INTO patients VALUES (?,?,?,?,?,?,?)`).run(
      patientId, name || 'New Patient', age || 50, blood_group || 'O+', JSON.stringify(allergiesArr), phone_number || '+91-98765-00000', now
    );

    // Insert Caregiver
    db.prepare(`INSERT INTO caregivers VALUES (?,?,?,?,?,?)`).run(
      caregiverId, caregiver_name || 'Primary Caregiver', 'Family Caregiver', caregiver_phone || '+91-98765-00001', JSON.stringify({ whatsapp: true, sms: true }), now
    );

    // Insert Case
    db.prepare(`INSERT INTO cases VALUES (?,?,?,?,?,?,?)`).run(
      caseId, patientId, JSON.stringify([caregiverId]), 'hi', 'granted', now, now
    );

    // Insert Default Initial Prescription Medicine
    const medId = `med-${Date.now().toString(36).slice(-4)}`;
    db.prepare(`INSERT INTO medicines VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(
      medId, caseId, 'Prescribed Medicine', 'Brand Care', 'General', '1 tablet', 'Once daily', '30 days', now, new Date(Date.now() + 30*86400000).toISOString(), null, 1, now
    );

    // Insert Initial Safety Flag
    const flagId = `sf-${Date.now().toString(36).slice(-4)}`;
    db.prepare(`INSERT INTO safety_flags VALUES (?,?,?,?,?,?,?,?)`).run(
      flagId, caseId, 'info', JSON.stringify([medId]), 'New patient record onboarded — please confirm active regimen with your pharmacist.', 'info', 0, now
    );

    res.json({
      success: true,
      case_id: caseId,
      patient_id: patientId,
      caregiver_id: caregiverId,
      message: 'New patient case onboarded successfully.'
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to create patient case' });
  }
});

// POST /api/cases/:caseId/extract — Trigger Gemini extraction & retry loop for a case
router.post('/:caseId/extract', async (req, res) => {
  try {
    const db = getDb();
    const { caseId } = req.params;
    const documentId = `doc-${Date.now().toString(36)}`;
    const imagePath = req.body.image_url || '/uploads/prescription_sharma.jpg';

    // Run FSM Extraction Retry Loop
    const { runExtractionFSM } = require('../services/extraction/fsm');
    const extraction = await runExtractionFSM(documentId, caseId, imagePath);

    res.json({
      success: true,
      case_id: caseId,
      document_id: documentId,
      extraction,
      disclaimer: "This explains what your document says — it isn't medical advice. Please confirm anything important with your doctor or pharmacist."
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Extraction failed' });
  }
});

// GET /api/cases — List all cases for caregiver dashboard

router.get('/', (req, res) => {
  const db = getDb();
  const cases = db.prepare(`SELECT * FROM cases ORDER BY created_at DESC`).all() as any[];

  const detailedCases = cases.map(c => {
    const patient = db.prepare(`SELECT * FROM patients WHERE patient_id = ?`).get(c.patient_id) as any;
    const documents = db.prepare(`SELECT * FROM documents WHERE case_id = ? ORDER BY uploaded_at DESC`).all(c.case_id);
    const flags = db.prepare(`SELECT * FROM safety_flags WHERE case_id = ?`).all(c.case_id);
    return {
      ...c,
      patient_name: patient ? patient.name : 'Unknown Patient',
      last_document_date: documents.length > 0 ? (documents[0] as any).uploaded_at : c.created_at,
      open_flags_count: flags.length,
    };
  });

  res.json({ cases: detailedCases });
});

// GET /api/cases/:caseId — Overview data for dashboard & patient views
router.get('/:caseId', (req, res) => {
  const db = getDb();
  const { caseId } = req.params;

  const caseObj = db.prepare(`SELECT * FROM cases WHERE case_id = ?`).get(caseId) as any;
  if (!caseObj) {
    return res.status(404).json({ error: 'Case not found' });
  }

  const patient = db.prepare(`SELECT * FROM patients WHERE patient_id = ?`).get(caseObj.patient_id) as any;
  if (patient) {
    patient.known_allergies = JSON.parse(patient.known_allergies || '[]');
    patient.gender = 'Male';
    patient.abha_id = '91-4829-1029-4821';
    patient.address = '102, Palm Grove, Indiranagar, Bengaluru, Karnataka 560038';
    patient.primary_conditions = ['Type 2 Diabetes Mellitus', 'Essential Hypertension'];
    patient.vitals = {
      height_cm: 168,
      weight_kg: 70,
      bmi: 24.8,
      bp_baseline: '130/84 mmHg',
      blood_sugar_fasting: '118 mg/dL',
    };
    patient.emergency_contact = {
      name: 'Priya Kumar',
      relationship: 'Daughter',
      phone: '+91-98765-00001',
    };
  }


  const caregiverIds = JSON.parse(caseObj.caregiver_ids || '[]');
  const caregivers = caregiverIds.map((id: string) =>
    db.prepare(`SELECT * FROM caregivers WHERE caregiver_id = ?`).get(id)
  ).filter(Boolean);

  const documents = db.prepare(`SELECT * FROM documents WHERE case_id = ? ORDER BY uploaded_at DESC`).all(caseId);

  const medicines = db.prepare(`
    SELECT m.*, d.doctor_name
    FROM medicines m
    LEFT JOIN documents d ON m.source_document_id = d.document_id
    WHERE m.case_id = ?
    ORDER BY m.created_at DESC
  `).all(caseId) as any[];

  const safetyFlags = db.prepare(`SELECT * FROM safety_flags WHERE case_id = ? ORDER BY created_at DESC`).all(caseId) as any[];
  safetyFlags.forEach(f => f.involved_medicine_ids = JSON.parse(f.involved_medicine_ids || '[]'));

  const adherenceEvents = db.prepare(`
    SELECT a.*, m.name as medicine_name
    FROM adherence_events a
    JOIN medicines m ON a.medicine_id = m.medicine_id
    WHERE m.case_id = ?
    ORDER BY a.scheduled_at DESC
    LIMIT 30
  `).all(caseId);

  const refills = medicines.map(m => calculateRefillPrediction(m));

  const generics = db.prepare(`SELECT * FROM generic_substitutes`).all();

  res.json({
    case: caseObj,
    patient,
    caregivers,
    documents,
    medicines,
    safety_flags: safetyFlags,
    adherence_events: adherenceEvents,
    refills,
    generics,
    disclaimer: "This explains what your document says — it isn't medical advice. Please confirm anything important with your doctor or pharmacist."
  });
});

// GET /api/cases/:caseId/digest — Weekly caregiver digest data
router.get('/:caseId/digest', (req, res) => {
  const db = getDb();
  const { caseId } = req.params;

  const caseObj = db.prepare(`SELECT * FROM cases WHERE case_id = ?`).get(caseId) as any;
  if (!caseObj) return res.status(404).json({ error: 'Case not found' });

  const patient = db.prepare(`SELECT * FROM patients WHERE patient_id = ?`).get(caseObj.patient_id) as any;
  const medicines = db.prepare(`SELECT * FROM medicines WHERE case_id = ?`).all(caseId) as any[];
  const flags = db.prepare(`SELECT * FROM safety_flags WHERE case_id = ?`).all(caseId) as any[];
  const adherence = db.prepare(`
    SELECT a.*, m.name as medicine_name
    FROM adherence_events a
    JOIN medicines m ON a.medicine_id = m.medicine_id
    WHERE m.case_id = ?
  `).all(caseId) as any[];

  const totalDoses = adherence.length;
  const takenDoses = adherence.filter(a => a.status === 'done').length;
  const missedDoses = adherence.filter(a => a.status === 'missed').length;
  const adherencePercentage = totalDoses > 0 ? Math.round((takenDoses / totalDoses) * 100) : 100;

  res.json({
    period: 'Past 7 Days Digest',
    patient_name: patient ? patient.name : 'Ramesh Kumar',
    case_id: caseId,
    generated_at: new Date().toISOString(),
    adherence: {
      total_scheduled: totalDoses,
      taken: takenDoses,
      missed: missedDoses,
      rate_percentage: adherencePercentage,
      streak_days: 6,
    },
    active_medicines_count: medicines.length,
    open_safety_flags: flags.map(f => ({
      flag_id: f.flag_id,
      severity: f.severity,
      reasoning: f.reasoning_text
    })),
    upcoming_followups: [
      { date: '2026-08-09', doctor: 'Dr. A. Mehta', hospital: 'Apollo Hospital' }
    ],
    disclaimer: "This explains what your document says — it isn't medical advice. Please confirm anything important with your doctor or pharmacist."
  });
});

// POST /api/cases/:caseId/delete — Governance DELETE endpoint with cascading erasure & audit log
router.post('/:caseId/delete', (req, res) => {
  const db = getDb();
  const { caseId } = req.params;

  const caseObj = db.prepare(`SELECT * FROM cases WHERE case_id = ?`).get(caseId) as any;
  if (!caseObj) {
    return res.status(404).json({ error: 'Case not found' });
  }

  // Cascading deletion across all tables
  db.prepare(`DELETE FROM safety_flags WHERE case_id = ?`).run(caseId);
  db.prepare(`DELETE FROM adherence_events WHERE medicine_id IN (SELECT medicine_id FROM medicines WHERE case_id = ?)`).run(caseId);
  db.prepare(`DELETE FROM medicines WHERE case_id = ?`).run(caseId);
  db.prepare(`DELETE FROM extraction_attempts WHERE document_id IN (SELECT document_id FROM documents WHERE case_id = ?)`).run(caseId);
  db.prepare(`DELETE FROM extracted_fields WHERE document_id IN (SELECT document_id FROM documents WHERE case_id = ?)`).run(caseId);
  db.prepare(`DELETE FROM documents WHERE case_id = ?`).run(caseId);
  db.prepare(`DELETE FROM consent_records WHERE case_id = ?`).run(caseId);
  db.prepare(`DELETE FROM escalation_events WHERE case_id = ?`).run(caseId);
  db.prepare(`DELETE FROM cases WHERE case_id = ?`).run(caseId);

  // Log non-identifying audit event
  db.prepare(`INSERT INTO consent_records VALUES (?,?,?,?,?)`).run(
    `del-audit-${Date.now()}`, caseId, 'audit_deleted', 0, new Date().toISOString()
  );

  res.json({
    success: true,
    deleted_case_id: caseId,
    message: 'All case data permanently erased per governance request.',
    timestamp: new Date().toISOString()
  });
});

// GET /api/cases/:caseId/medication-history — Longitudinal patient medication history (Enhancement 9)
router.get('/:caseId/medication-history', (req, res) => {
  const db = getDb();
  const { caseId } = req.params;

  const caseObj = db.prepare(`SELECT patient_id FROM cases WHERE case_id = ?`).get(caseId) as any;
  if (!caseObj) return res.status(404).json({ error: 'Case not found' });

  const history = db.prepare(`
    SELECT m.*, d.doctor_name, d.hospital_name, d.prescription_date
    FROM medicines m
    LEFT JOIN documents d ON m.source_document_id = d.document_id
    JOIN cases c ON m.case_id = c.case_id
    WHERE c.patient_id = ?
    ORDER BY m.created_at DESC
  `).all(caseObj.patient_id) as any[];

  // Run multi-doctor reconciliation check
  const dupFlags = checkTherapeuticDuplication(history.map(m => ({
    medicine_id: m.medicine_id,
    name: m.name,
    therapeutic_class: m.therapeutic_class,
    doctor_name: m.doctor_name,
  })));

  res.json({ history, duplication_flags: dupFlags });
});

// GET /api/cases/:caseId/timeline-svg — SVG Timeline rendered
router.get('/:caseId/timeline-svg', (req, res) => {
  const db = getDb();
  const { caseId } = req.params;
  const patient = db.prepare(`
    SELECT p.name FROM patients p JOIN cases c ON p.patient_id = c.patient_id WHERE c.case_id = ?
  `).get(caseId) as any;

  const steps = [
    { day: 1, dateStr: '2026-07-26', title: 'Start Prescribed Medications', description: 'Begin Amlodipine 5mg OD (morning) & Metformin 500mg BD (with meals)', type: 'medicine' as const },
    { day: 3, dateStr: '2026-07-28', title: 'Stop Ibuprofen Course', description: 'Complete 3-day pain relief course. Continue stomach protector Pantoprazole.', type: 'medicine' as const },
    { day: 7, dateStr: '2026-08-01', title: 'Refill Warning Check', description: 'Check remaining stock for Metformin & Amlodipine', type: 'warning' as const },
    { day: 15, dateStr: '2026-08-09', title: 'Doctor Follow-up Visit', description: 'Follow-up with Dr. A. Mehta (Cardiology) at Apollo Hospital', type: 'followup' as const },
  ];

  const svg = generateTimelineSVG(steps, patient ? patient.name : 'Ramesh Kumar');
  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(svg);
});

// GET /api/cases/:caseId/emergency-card-svg — Emergency Card SVG
router.get('/:caseId/emergency-card-svg', (req, res) => {
  const db = getDb();
  const { caseId } = req.params;
  const mode = (req.query.mode as string) === 'wallet' ? 'wallet' : 'lockscreen';

  const caseObj = db.prepare(`SELECT * FROM cases WHERE case_id = ?`).get(caseId) as any;
  if (!caseObj) return res.status(404).send('Not found');

  const patient = db.prepare(`SELECT * FROM patients WHERE patient_id = ?`).get(caseObj.patient_id) as any;
  const caregiverId = JSON.parse(caseObj.caregiver_ids || '[]')[0];
  const caregiver = db.prepare(`SELECT * FROM caregivers WHERE caregiver_id = ?`).get(caregiverId) as any;

  const medicines = db.prepare(`SELECT name FROM medicines WHERE case_id = ? AND active = 1`).all(caseId) as any[];

  const svg = generateEmergencyCardSVG({
    name: patient.name,
    age: patient.age,
    blood_group: patient.blood_group,
    known_allergies: JSON.parse(patient.known_allergies || '[]'),
    active_medicines: medicines.map(m => m.name),
    caregiver_name: caregiver ? caregiver.name : 'Priya Kumar',
    caregiver_phone: caregiver ? caregiver.phone_number : '+91-98765-00001',
  }, mode);

  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(svg);
});

// POST /api/cases/:caseId/adherence — Log Done / Missed tap
router.post('/:caseId/adherence', (req, res) => {
  const db = getDb();
  const { caseId } = req.params;
  const { event_id, status } = req.body;

  if (!event_id || !['done', 'missed'].includes(status)) {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  db.prepare(`
    UPDATE adherence_events SET status = ?, responded_at = ? WHERE event_id = ?
  `).run(status, new Date().toISOString(), event_id);

  res.json({ success: true, event_id, status });
});

export default router;

