/**
 * SpashtCare — Consent API Routes
 * Implements Section 2 Item 14 consent capture and DPDP "Delete My Data" functionality
 */

import { Router } from 'express';
import { getDb } from '../db/index';
import { v4 as uuid } from 'uuid';

const router = Router();

// POST /api/consent — Record user consent before extraction
router.post('/', (req, res) => {
  const db = getDb();
  const { case_id, language, consent_given } = req.body;

  if (!case_id) return res.status(400).json({ error: 'case_id required' });

  const recordId = uuid();
  const now = new Date().toISOString();
  const isGiven = consent_given ? 1 : 0;

  db.prepare(`INSERT INTO consent_records VALUES (?,?,?,?,?)`).run(
    recordId, case_id, language || 'en', isGiven, now
  );

  db.prepare(`UPDATE cases SET consent_status = ?, consent_timestamp = ? WHERE case_id = ?`).run(
    isGiven ? 'granted' : 'revoked', now, case_id
  );

  res.json({
    success: true,
    consent_status: isGiven ? 'granted' : 'revoked',
    timestamp: now
  });
});

// DELETE /api/consent/delete-data — One-tap "Delete My Data" for DPDP compliance
router.delete('/delete-data', (req, res) => {
  const db = getDb();
  const { case_id } = req.body;

  if (!case_id) return res.status(400).json({ error: 'case_id required' });

  // Delete all records linked to case_id
  db.prepare(`DELETE FROM safety_flags WHERE case_id = ?`).run(case_id);
  db.prepare(`DELETE FROM adherence_events WHERE medicine_id IN (SELECT medicine_id FROM medicines WHERE case_id = ?)`).run(case_id);
  db.prepare(`DELETE FROM medicines WHERE case_id = ?`).run(case_id);
  db.prepare(`DELETE FROM extraction_attempts WHERE document_id IN (SELECT document_id FROM documents WHERE case_id = ?)`).run(case_id);
  db.prepare(`DELETE FROM extracted_fields WHERE document_id IN (SELECT document_id FROM documents WHERE case_id = ?)`).run(case_id);
  db.prepare(`DELETE FROM documents WHERE case_id = ?`).run(case_id);
  db.prepare(`DELETE FROM consent_records WHERE case_id = ?`).run(case_id);
  db.prepare(`DELETE FROM escalation_events WHERE case_id = ?`).run(case_id);
  db.prepare(`UPDATE cases SET consent_status = 'revoked' WHERE case_id = ?`).run(case_id);

  res.json({ success: true, message: 'All personal health data deleted per DPDP Act request.' });
});

export default router;
