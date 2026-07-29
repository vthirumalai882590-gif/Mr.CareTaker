/**
 * SpashtCare — Agentic Extraction Retry Loop (Section 4 of product spec)
 *
 * 5-step explicit state machine:
 *   STEP 1 — INITIAL_EXTRACTION
 *   STEP 2 — LOW_CONFIDENCE_ROUTING
 *   STEP 3 — CROSS_CHECK
 *   STEP 4 — RETRY_EXTRACTION (max 2 retries)
 *   STEP 5 — FALLBACK
 *
 * Every state transition is logged to extraction_attempts table
 * for the Extraction Replay screen.
 */

import { v4 as uuid } from 'uuid';
import { getDb } from '../../db/index';
import { extractFromImage, retryFieldExtraction, ExtractedFieldRaw } from './geminiClient';
import { fuzzyMatchDrug, getTherapeuticClass } from './drugDB';

const CONFIDENCE_THRESHOLD = 80;
const MAX_RETRIES = 2;

export type FSMStep =
  | 'INITIAL_EXTRACTION'
  | 'LOW_CONFIDENCE_ROUTING'
  | 'CROSS_CHECK'
  | 'RETRY_EXTRACTION'
  | 'FALLBACK';

export type ResolutionStatus =
  | 'auto_resolved'
  | 'verified_against_db'
  | 'user_confirmed'
  | 'escalated_to_pharmacist'
  | 'needs_confirmation'
  | 'pending';


export interface FieldProcessingResult {
  field_id: string;
  field_type: string;
  raw_value: string;
  normalized_value: string;
  confidence_score: number;
  retry_count: number;
  resolution_status: ResolutionStatus;
  attempts: ExtractionAttemptLog[];
}

export interface ExtractionAttemptLog {
  attempt_id: string;
  step_name: FSMStep;
  confidence_before: number | null;
  confidence_after: number;
  reasoning: string;
  candidate_matches?: string[];
  timestamp: string;
}

export interface DocumentExtractionResult {
  document_id: string;
  raw_ocr_text: string;
  doctor_name?: string;
  hospital_name?: string;
  prescription_date?: string;
  overall_legibility: number;
  fields: FieldProcessingResult[];
  medicines: ExtractedMedicine[];
}

export interface ExtractedMedicine {
  name: string;
  brand_name?: string;
  therapeutic_class?: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
}

// ─────────────────────────────────────────────────────
// MAIN ENTRY POINT
// ─────────────────────────────────────────────────────

export async function runExtractionFSM(
  documentId: string,
  caseId: string,
  imagePath: string
): Promise<DocumentExtractionResult> {
  const db = getDb();

  // ── STEP 1: INITIAL EXTRACTION ──────────────────────
  console.log(`[FSM] Step 1 — Initial extraction for document ${documentId}`);
  const extractionResult = await extractFromImage(imagePath);

  // Update document with raw OCR text
  db.prepare(`
    UPDATE documents SET raw_ocr_text=?, doctor_name=?, hospital_name=?, prescription_date=?
    WHERE document_id=?
  `).run(
    extractionResult.raw_text,
    extractionResult.doctor_name ?? null,
    extractionResult.hospital_name ?? null,
    extractionResult.prescription_date ?? null,
    documentId
  );

  const processedFields: FieldProcessingResult[] = [];

  // ── Process each extracted field through the FSM ──────
  for (const field of extractionResult.fields) {
    const result = await processField(field, documentId, imagePath, db);
    processedFields.push(result);
  }

  // ── Group fields into medicines ───────────────────────
  const medicines = groupFieldsIntoMedicines(processedFields);

  return {
    document_id: documentId,
    raw_ocr_text: extractionResult.raw_text,
    doctor_name: extractionResult.doctor_name,
    hospital_name: extractionResult.hospital_name,
    prescription_date: extractionResult.prescription_date,
    overall_legibility: extractionResult.overall_legibility,
    fields: processedFields,
    medicines,
  };
}

// ─────────────────────────────────────────────────────
// FIELD-LEVEL FSM
// ─────────────────────────────────────────────────────

async function processField(
  field: ExtractedFieldRaw,
  documentId: string,
  imagePath: string,
  db: ReturnType<typeof getDb>
): Promise<FieldProcessingResult> {
  const fieldId = uuid();
  const attempts: ExtractionAttemptLog[] = [];
  let currentConfidence = field.confidence_score;
  let currentValue = field.normalized_value;
  let retryCount = 0;
  let resolutionStatus: ResolutionStatus = 'pending';

  // ── STEP 1: Log initial extraction ──────────────────
  const step1Attempt: ExtractionAttemptLog = {
    attempt_id: uuid(),
    step_name: 'INITIAL_EXTRACTION',
    confidence_before: null,
    confidence_after: currentConfidence,
    reasoning: field.reasoning || `Initial Gemini extraction — confidence ${currentConfidence}%`,
    timestamp: new Date().toISOString(),
  };
  attempts.push(step1Attempt);
  persistAttempt(step1Attempt, fieldId, documentId, db, {
    input: { image: imagePath, field_type: field.field_type },
    output: { raw_value: field.raw_value, normalized_value: field.normalized_value, confidence: currentConfidence },
  });

  // ── STEP 2: LOW CONFIDENCE ROUTING ─────────────────
  if (currentConfidence >= CONFIDENCE_THRESHOLD) {
    // High confidence — auto-resolve immediately
    resolutionStatus = 'auto_resolved';
  } else {
    const step2Attempt: ExtractionAttemptLog = {
      attempt_id: uuid(),
      step_name: 'LOW_CONFIDENCE_ROUTING',
      confidence_before: currentConfidence,
      confidence_after: currentConfidence,
      reasoning: `Confidence ${currentConfidence}% is below threshold ${CONFIDENCE_THRESHOLD}%. Routing to cross-check.`,
      timestamp: new Date().toISOString(),
    };
    attempts.push(step2Attempt);
    persistAttempt(step2Attempt, fieldId, documentId, db, {
      input: { confidence: currentConfidence, threshold: CONFIDENCE_THRESHOLD },
      output: { action: 'route_to_cross_check', field: field.raw_value },
    });

    // ── STEP 3: CROSS-CHECK ─────────────────────────
    const crossCheckResult = await crossCheck(field, documentId, fieldId, currentConfidence, attempts, db);
    currentValue = crossCheckResult.resolvedValue ?? currentValue;
    currentConfidence = crossCheckResult.confidence;

    if (crossCheckResult.resolved) {
      resolutionStatus = 'verified_against_db';
    } else {
      // ── STEP 4: RETRY EXTRACTION ────────────────────
      while (retryCount < MAX_RETRIES && currentConfidence < CONFIDENCE_THRESHOLD) {
        retryCount++;
        const retryResult = await retryExtraction(
          field, imagePath, crossCheckResult.candidates, fieldId, documentId,
          currentConfidence, retryCount, attempts, db
        );
        currentValue = retryResult.resolvedValue ?? currentValue;
        currentConfidence = retryResult.confidence;

        if (currentConfidence >= CONFIDENCE_THRESHOLD) {
          resolutionStatus = 'auto_resolved';
          break;
        }

        if (retryCount < MAX_RETRIES) {
          // Loop back to STEP 3 with new candidate
          const recheck = await crossCheck(field, documentId, fieldId, currentConfidence, attempts, db, retryCount);
          currentValue = recheck.resolvedValue ?? currentValue;
          currentConfidence = recheck.confidence;
          if (recheck.resolved) {
            resolutionStatus = 'verified_against_db';
            break;
          }
        }
      }

      // ── STEP 5: FALLBACK ────────────────────────────
      if (currentConfidence < CONFIDENCE_THRESHOLD && resolutionStatus === 'pending') {
        const step5Attempt: ExtractionAttemptLog = {
          attempt_id: uuid(),
          step_name: 'FALLBACK',
          confidence_before: currentConfidence,
          confidence_after: currentConfidence,
          reasoning: `We couldn't confidently read one item on your prescription — please confirm the medicine name with your pharmacist. (Confidence ${currentConfidence}% below ${CONFIDENCE_THRESHOLD}%)`,
          timestamp: new Date().toISOString(),
        };
        attempts.push(step5Attempt);
        persistAttempt(step5Attempt, fieldId, documentId, db, {
          input: { retry_count: retryCount, final_confidence: currentConfidence },
          output: { action: 'needs_confirmation', best_guess: currentValue, user_message: "We couldn't confidently read one item on your prescription — please confirm the medicine name with your pharmacist." },
        });
        resolutionStatus = 'needs_confirmation';
      }

    }
  }

  // ── Persist the final extracted field ───────────────
  db.prepare(`INSERT OR REPLACE INTO extracted_fields VALUES (?,?,?,?,?,?,?,?,?)`).run(
    fieldId, documentId, field.field_type, field.raw_value, currentValue,
    currentConfidence, retryCount, resolutionStatus, new Date().toISOString()
  );

  return {
    field_id: fieldId,
    field_type: field.field_type,
    raw_value: field.raw_value,
    normalized_value: currentValue,
    confidence_score: currentConfidence,
    retry_count: retryCount,
    resolution_status: resolutionStatus,
    attempts,
  };
}

// ─────────────────────────────────────────────────────
// STEP 3 — CROSS-CHECK IMPLEMENTATION
// ─────────────────────────────────────────────────────

async function crossCheck(
  field: ExtractedFieldRaw,
  documentId: string,
  fieldId: string,
  confidenceBefore: number,
  attempts: ExtractionAttemptLog[],
  db: ReturnType<typeof getDb>,
  retryPass: number = 0
) {
  const candidates: string[] = [];
  let resolvedValue: string | null = null;
  let resolved = false;
  let confidenceAfter = confidenceBefore;

  if (field.field_type === 'drug_name') {
    // a) Fuzzy match against drug DB
    const dbMatches = fuzzyMatchDrug(field.raw_value);
    if (dbMatches.length > 0) {
      candidates.push(...dbMatches.slice(0, 3).map(m => `${m.name} (score:${m.score.toFixed(2)})`));
    }

    // b) Check patient medication history in DB
    const patientDoc = db.prepare(`SELECT case_id FROM documents WHERE document_id=?`).get(documentId) as any;
    if (patientDoc) {
      const historyMeds = db.prepare(
        `SELECT DISTINCT name FROM medicines WHERE case_id=? ORDER BY created_at DESC`
      ).all(patientDoc.case_id) as Array<{ name: string }>;
      const histMatch = historyMeds.find(m =>
        m.name.toLowerCase().includes(field.raw_value.toLowerCase().slice(0, 4))
      );
      if (histMatch) {
        candidates.push(`${histMatch.name} (patient history)`);
      }
    }

    // If a high-confidence DB match found, mark resolved
    if (dbMatches.length > 0 && dbMatches[0].score < 0.35) {
      resolvedValue = dbMatches[0].name;
      confidenceAfter = Math.min(95, confidenceBefore + Math.round((1 - dbMatches[0].score) * 30));
      resolved = confidenceAfter >= CONFIDENCE_THRESHOLD;
    } else {
      confidenceAfter = Math.min(confidenceBefore + 15, 75);
    }
  }

  const step3Attempt: ExtractionAttemptLog = {
    attempt_id: uuid(),
    step_name: 'CROSS_CHECK',
    confidence_before: confidenceBefore,
    confidence_after: confidenceAfter,
    reasoning: resolved
      ? `Drug database match found: "${resolvedValue}" (confidence improved to ${confidenceAfter}%). Threshold passed.`
      : `Candidates found in drug DB: ${candidates.slice(0, 2).join(', ')}. Confidence improved to ${confidenceAfter}% — still below threshold. Proceeding to retry.`,
    candidate_matches: candidates.map(c => c.split(' (')[0]),
    timestamp: new Date().toISOString(),
  };
  attempts.push(step3Attempt);
  persistAttempt(step3Attempt, fieldId, documentId, db, {
    input: { raw_value: field.raw_value, retry_pass: retryPass },
    output: { candidates, resolved, best_match: resolvedValue, confidence: confidenceAfter },
  });

  return { resolved, resolvedValue, candidates: candidates.map(c => c.split(' (')[0]), confidence: confidenceAfter };
}

// ─────────────────────────────────────────────────────
// STEP 4 — RETRY EXTRACTION IMPLEMENTATION
// ─────────────────────────────────────────────────────

async function retryExtraction(
  field: ExtractedFieldRaw,
  imagePath: string,
  candidates: string[],
  fieldId: string,
  documentId: string,
  confidenceBefore: number,
  retryCount: number,
  attempts: ExtractionAttemptLog[],
  db: ReturnType<typeof getDb>
) {
  const retryResult = await retryFieldExtraction(
    imagePath, field.raw_value, field.field_type, candidates
  );

  const step4Attempt: ExtractionAttemptLog = {
    attempt_id: uuid(),
    step_name: 'RETRY_EXTRACTION',
    confidence_before: confidenceBefore,
    confidence_after: retryResult.confidence_score,
    reasoning: `Retry ${retryCount}: ${retryResult.reasoning}`,
    candidate_matches: candidates,
    timestamp: new Date().toISOString(),
  };
  attempts.push(step4Attempt);
  persistAttempt(step4Attempt, fieldId, documentId, db, {
    input: { raw_value: field.raw_value, candidates, retry_number: retryCount },
    output: { best_match: retryResult.best_match, confidence: retryResult.confidence_score, alternative: retryResult.alternative },
  });

  return { resolvedValue: retryResult.best_match, confidence: retryResult.confidence_score };
}

// ─────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────

function persistAttempt(
  attempt: ExtractionAttemptLog,
  fieldId: string,
  documentId: string,
  db: ReturnType<typeof getDb>,
  snapshots: { input: object; output: object }
) {
  db.prepare(`INSERT OR REPLACE INTO extraction_attempts VALUES (?,?,?,?,?,?,?,?,?,?,?)`).run(
    attempt.attempt_id,
    fieldId,
    documentId,
    attempt.step_name,
    JSON.stringify(snapshots.input),
    JSON.stringify(snapshots.output),
    attempt.confidence_before ?? null,
    attempt.confidence_after,
    attempt.candidate_matches ? JSON.stringify(attempt.candidate_matches) : null,
    attempt.reasoning,
    attempt.timestamp
  );
}

function groupFieldsIntoMedicines(fields: FieldProcessingResult[]): ExtractedMedicine[] {
  const medicines: ExtractedMedicine[] = [];
  let current: Partial<ExtractedMedicine> = {};

  for (const field of fields) {
    if (field.field_type === 'drug_name') {
      if (current.name) {
        medicines.push(current as ExtractedMedicine);
      }
      const tc = getTherapeuticClass(field.normalized_value);
      current = {
        name: field.normalized_value,
        therapeutic_class: tc ?? undefined,
      };
    } else if (current.name) {
      if (field.field_type === 'dosage') current.dosage = field.normalized_value;
      if (field.field_type === 'frequency') current.frequency = field.normalized_value;
      if (field.field_type === 'duration') current.duration = field.normalized_value;
    }
  }
  if (current.name) medicines.push(current as ExtractedMedicine);

  return medicines;
}
