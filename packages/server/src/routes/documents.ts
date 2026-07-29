/**
 * SpashtCare — Documents & Extraction Replay API Routes
 */

import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuid } from 'uuid';
import { getDb } from '../db/index';
import { runExtractionFSM } from '../services/extraction/fsm';
import { checkInteractions, checkTherapeuticDuplication, checkAllergies } from '../services/safety/interactionChecker';

const router = Router();

// Setup Multer for upload
const uploadDir = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// POST /api/documents/upload — Process document through extraction FSM
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const db = getDb();
    const caseId = req.body.case_id || 'case-001';
    const documentType = req.body.document_type || 'prescription';

    const documentId = `doc-${uuid().slice(0, 8)}`;
    const imagePath = req.file ? req.file.path : '/uploads/prescription_sharma.jpg';

    // Insert Document row
    db.prepare(`INSERT INTO documents VALUES (?,?,?,?,?,?,?,?,?)`).run(
      documentId,
      caseId,
      imagePath,
      documentType,
      null, null, null, null,
      new Date().toISOString()
    );

    // Run FSM Extraction Retry Loop
    const extraction = await runExtractionFSM(documentId, caseId, imagePath);

    // Insert extracted medicines into DB
    const insertedMedIds: string[] = [];
    for (const med of extraction.medicines) {
      const medId = uuid();
      insertedMedIds.push(medId);
      db.prepare(`INSERT INTO medicines VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(
        medId, caseId, med.name, med.brand_name || null, med.therapeutic_class || null,
        med.dosage || 'As prescribed', med.frequency || 'Once daily', med.duration || '30 days',
        new Date().toISOString().split('T')[0], null, documentId, 1, new Date().toISOString()
      );
    }

    // Run Safety Checks & generate flags
    const patientCase = db.prepare(`SELECT patient_id FROM cases WHERE case_id=?`).get(caseId) as any;
    const patient = patientCase ? db.prepare(`SELECT * FROM patients WHERE patient_id=?`).get(patientCase.patient_id) as any : null;
    const allMeds = db.prepare(`SELECT * FROM medicines WHERE case_id=?`).all(caseId) as any[];

    const interactionFlags = checkInteractions(allMeds);
    const dupFlags = checkTherapeuticDuplication(allMeds);
    const allergyFlags = patient ? checkAllergies(allMeds, JSON.parse(patient.known_allergies || '[]')) : [];

    const allNewFlags = [...interactionFlags, ...dupFlags, ...allergyFlags];
    for (const flag of allNewFlags) {
      db.prepare(`INSERT INTO safety_flags VALUES (?,?,?,?,?,?,?,?)`).run(
        uuid(), caseId, flag.flag_type, JSON.stringify(flag.involved_medicine_ids),
        flag.reasoning_text, flag.severity, 0, new Date().toISOString()
      );
    }

    res.json({
      success: true,
      document_id: documentId,
      extraction,
      flags_generated: allNewFlags.length,
      disclaimer: "SpashtCare reads and organizes what your doctor already prescribed. It does not diagnose, does not recommend treatment, and does not change any dosage. Always confirm with your pharmacist or doctor before acting on any flag."
    });
  } catch (err: any) {
    console.error('[Document Upload Error]', err);
    res.status(500).json({ error: err.message || 'Extraction failed' });
  }
});

// GET /api/documents/:documentId/replay — Fetch complete step-by-step extraction audit log for Screen 11 (Extraction Replay)
router.get('/:documentId/replay', (req, res) => {
  const db = getDb();
  const { documentId } = req.params;

  const doc = db.prepare(`SELECT * FROM documents WHERE document_id = ?`).get(documentId);
  if (!doc) return res.status(404).json({ error: 'Document not found' });

  const fields = db.prepare(`SELECT * FROM extracted_fields WHERE document_id = ?`).all(documentId) as any[];

  const attemptsByField: Record<string, any[]> = {};
  for (const f of fields) {
    const attempts = db.prepare(`
      SELECT * FROM extraction_attempts WHERE field_id = ? ORDER BY timestamp ASC
    `).all(f.field_id) as any[];

    attempts.forEach(a => {
      a.input_snapshot = a.input_snapshot ? JSON.parse(a.input_snapshot) : null;
      a.output_snapshot = a.output_snapshot ? JSON.parse(a.output_snapshot) : null;
      a.candidate_matches = a.candidate_matches ? JSON.parse(a.candidate_matches) : [];
    });
    attemptsByField[f.field_id] = attempts;
  }

  res.json({
    document: doc,
    fields,
    attemptsByField,
    disclaimer: "SpashtCare reads and organizes what your doctor already prescribed. It does not diagnose, does not recommend treatment, and does not change any dosage."
  });
});

export default router;
