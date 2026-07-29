-- SpashtCare Database Schema
-- All entities from Section 3 of the product spec + ExtractionAttempt log

PRAGMA journal_mode=WAL;
PRAGMA foreign_keys=ON;

-- ─────────────────────────────────────────────
-- CORE IDENTITY
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS patients (
  patient_id        TEXT PRIMARY KEY,
  name              TEXT NOT NULL,
  age               INTEGER,
  blood_group       TEXT,
  known_allergies   TEXT NOT NULL DEFAULT '[]',  -- JSON array of strings
  phone_number      TEXT NOT NULL,
  created_at        TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS caregivers (
  caregiver_id              TEXT PRIMARY KEY,
  name                      TEXT NOT NULL,
  relationship_to_patient   TEXT NOT NULL,
  phone_number              TEXT NOT NULL,
  notification_preferences  TEXT NOT NULL DEFAULT '{}',  -- JSON
  created_at                TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS cases (
  case_id             TEXT PRIMARY KEY,
  patient_id          TEXT NOT NULL REFERENCES patients(patient_id),
  caregiver_ids       TEXT NOT NULL DEFAULT '[]',   -- JSON array of caregiver_id strings
  preferred_language  TEXT NOT NULL DEFAULT 'en',
  consent_status      TEXT NOT NULL DEFAULT 'pending',  -- pending | granted | revoked
  consent_timestamp   TEXT,
  created_at          TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ─────────────────────────────────────────────
-- CONSENT
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS consent_records (
  record_id       TEXT PRIMARY KEY,
  case_id         TEXT NOT NULL REFERENCES cases(case_id),
  language        TEXT NOT NULL,
  consent_given   INTEGER NOT NULL DEFAULT 0,  -- 0=false, 1=true
  timestamp       TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ─────────────────────────────────────────────
-- DOCUMENTS
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS documents (
  document_id     TEXT PRIMARY KEY,
  case_id         TEXT NOT NULL REFERENCES cases(case_id),
  source_image_url TEXT NOT NULL,
  document_type   TEXT NOT NULL DEFAULT 'prescription',  -- prescription | discharge_summary
  raw_ocr_text    TEXT,
  doctor_name     TEXT,
  hospital_name   TEXT,
  prescription_date TEXT,
  uploaded_at     TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS extracted_fields (
  field_id            TEXT PRIMARY KEY,
  document_id         TEXT NOT NULL REFERENCES documents(document_id),
  field_type          TEXT NOT NULL,  -- drug_name | dosage | frequency | duration | follow_up_date | instruction
  raw_value           TEXT,
  normalized_value    TEXT,
  confidence_score    INTEGER NOT NULL DEFAULT 0,  -- 0–100
  retry_count         INTEGER NOT NULL DEFAULT 0,
  resolution_status   TEXT NOT NULL DEFAULT 'pending',
  -- auto_resolved | verified_against_db | user_confirmed | escalated_to_pharmacist | pending
  created_at          TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ─────────────────────────────────────────────
-- EXTRACTION RETRY LOOP AUDIT LOG
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS extraction_attempts (
  attempt_id          TEXT PRIMARY KEY,
  field_id            TEXT NOT NULL REFERENCES extracted_fields(field_id),
  document_id         TEXT NOT NULL,
  step_name           TEXT NOT NULL,
  -- INITIAL_EXTRACTION | LOW_CONFIDENCE_ROUTING | CROSS_CHECK | RETRY_EXTRACTION | FALLBACK
  input_snapshot      TEXT,   -- JSON snapshot of input to this step
  output_snapshot     TEXT,   -- JSON snapshot of output from this step
  confidence_before   INTEGER,
  confidence_after    INTEGER,
  candidate_matches   TEXT,   -- JSON array of candidate strings from cross-check
  reasoning           TEXT,
  timestamp           TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ─────────────────────────────────────────────
-- MEDICINES
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS medicines (
  medicine_id         TEXT PRIMARY KEY,
  case_id             TEXT NOT NULL REFERENCES cases(case_id),
  name                TEXT NOT NULL,
  brand_name          TEXT,
  therapeutic_class   TEXT,
  dosage              TEXT,
  frequency           TEXT,
  duration            TEXT,
  start_date          TEXT,
  computed_end_date   TEXT,
  source_document_id  TEXT REFERENCES documents(document_id),
  active              INTEGER NOT NULL DEFAULT 1,  -- 0=false, 1=true
  created_at          TEXT NOT NULL DEFAULT (datetime('now'))
);

-- MedicationHistory is a VIEW over medicines scoped per patient across all cases
CREATE VIEW IF NOT EXISTS medication_history AS
  SELECT
    m.*,
    c.patient_id,
    p.name AS patient_name
  FROM medicines m
  JOIN cases c ON m.case_id = c.case_id
  JOIN patients p ON c.patient_id = p.patient_id;

-- ─────────────────────────────────────────────
-- SAFETY FLAGS
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS safety_flags (
  flag_id             TEXT PRIMARY KEY,
  case_id             TEXT NOT NULL REFERENCES cases(case_id),
  flag_type           TEXT NOT NULL,
  -- drug_interaction | allergy | therapeutic_duplication | low_confidence_field
  involved_medicine_ids TEXT NOT NULL DEFAULT '[]',   -- JSON array
  reasoning_text      TEXT NOT NULL,  -- always ends with "ask your pharmacist"
  severity            TEXT NOT NULL DEFAULT 'info',   -- info | caution | serious
  acknowledged        INTEGER NOT NULL DEFAULT 0,
  created_at          TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ─────────────────────────────────────────────
-- ADHERENCE
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS adherence_events (
  event_id      TEXT PRIMARY KEY,
  medicine_id   TEXT NOT NULL REFERENCES medicines(medicine_id),
  scheduled_at  TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'pending',  -- pending | done | missed
  responded_at  TEXT,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ─────────────────────────────────────────────
-- ESCALATION
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS escalation_events (
  escalation_id                   TEXT PRIMARY KEY,
  case_id                         TEXT NOT NULL REFERENCES cases(case_id),
  trigger_type                    TEXT NOT NULL,  -- serious_flag | repeated_missed_doses
  caregiver_notified_at           TEXT,
  pharmacist_share_link_generated INTEGER NOT NULL DEFAULT 0,
  created_at                      TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ─────────────────────────────────────────────
-- GENERIC SUBSTITUTES (bundled reference data)
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS generic_substitutes (
  id              TEXT PRIMARY KEY,
  brand_name      TEXT NOT NULL,
  generic_name    TEXT NOT NULL,
  jan_aushadhi    INTEGER NOT NULL DEFAULT 0,  -- available at Jan Aushadhi
  notes           TEXT
);

-- ─────────────────────────────────────────────
-- INDEXES
-- ─────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_medicines_case ON medicines(case_id);
CREATE INDEX IF NOT EXISTS idx_cases_patient ON cases(patient_id);
CREATE INDEX IF NOT EXISTS idx_extracted_fields_doc ON extracted_fields(document_id);
CREATE INDEX IF NOT EXISTS idx_extraction_attempts_field ON extraction_attempts(field_id);
CREATE INDEX IF NOT EXISTS idx_safety_flags_case ON safety_flags(case_id);
CREATE INDEX IF NOT EXISTS idx_adherence_medicine ON adherence_events(medicine_id);
CREATE INDEX IF NOT EXISTS idx_documents_case ON documents(case_id);
