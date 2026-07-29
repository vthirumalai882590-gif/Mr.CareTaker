export interface Patient {
  patient_id: string;
  name: string;
  age: number;
  gender?: 'Male' | 'Female' | 'Other';
  blood_group?: string;
  abha_id?: string;
  address?: string;
  known_allergies: string[];
  primary_conditions?: string[];
  phone_number: string;
  vitals?: {
    height_cm?: number;
    weight_kg?: number;
    bmi?: number;
    bp_baseline?: string;
    blood_sugar_fasting?: string;
    spo2_baseline?: string;
    heart_rate_baseline?: string;
  };
  lifestyle?: {
    diet_preference?: string;
    smoking_status?: string;
    alcohol_status?: string;
    activity_level?: string;
  };
  insurance?: {
    provider_name?: string;
    policy_number?: string;
    cashless_enabled?: boolean;
  };
  care_team?: {
    primary_doctor?: string;
    secondary_specialist?: string;
    preferred_pharmacy?: string;
  };
  medical_history?: {
    past_surgeries?: string[];
    past_hospitalizations?: string[];
  };
  communication_preference?: {
    preferred_language?: string;
    reminder_channel?: 'whatsapp' | 'sms' | 'both';
  };
  emergency_contact?: {
    name: string;
    relationship: string;
    phone: string;
  };
}



export interface Caregiver {
  caregiver_id: string;
  name: string;
  relationship_to_patient: string;
  phone_number: string;
}

export interface Case {
  case_id: string;
  patient_id: string;
  caregiver_ids: string[];
  preferred_language: string;
  consent_status: 'pending' | 'granted' | 'revoked';
  consent_timestamp?: string;
}

export interface Document {
  document_id: string;
  case_id: string;
  source_image_url: string;
  document_type: 'prescription' | 'discharge_summary';
  raw_ocr_text?: string;
  doctor_name?: string;
  hospital_name?: string;
  prescription_date?: string;
  uploaded_at: string;
}

export interface ExtractedField {
  field_id: string;
  document_id: string;
  field_type: 'drug_name' | 'dosage' | 'frequency' | 'duration' | 'follow_up_date' | 'instruction';
  raw_value: string;
  normalized_value: string;
  confidence_score: number;
  retry_count: number;
  resolution_status: 'auto_resolved' | 'verified_against_db' | 'user_confirmed' | 'escalated_to_pharmacist' | 'pending';
}

export interface ExtractionAttempt {
  attempt_id: string;
  field_id: string;
  document_id: string;
  step_name: 'INITIAL_EXTRACTION' | 'LOW_CONFIDENCE_ROUTING' | 'CROSS_CHECK' | 'RETRY_EXTRACTION' | 'FALLBACK';
  input_snapshot: any;
  output_snapshot: any;
  confidence_before: number | null;
  confidence_after: number;
  candidate_matches?: string[];
  reasoning: string;
  timestamp: string;
}

export interface Medicine {
  medicine_id: string;
  case_id: string;
  name: string;
  brand_name?: string;
  therapeutic_class?: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
  start_date?: string;
  computed_end_date?: string;
  doctor_name?: string;
  source_document_id?: string;
  active: boolean;
}

export interface SafetyFlag {
  flag_id: string;
  case_id: string;
  flag_type: 'drug_interaction' | 'allergy' | 'therapeutic_duplication' | 'low_confidence_field';
  involved_medicine_ids: string[];
  reasoning_text: string;
  severity: 'info' | 'caution' | 'serious';
}

export interface AdherenceEvent {
  event_id: string;
  medicine_id: string;
  medicine_name: string;
  scheduled_at: string;
  status: 'pending' | 'done' | 'missed';
  responded_at?: string;
}

export interface RefillInfo {
  medicine_id: string;
  medicine_name: string;
  dosage: string;
  frequency: string;
  duration: string;
  start_date: string;
  computed_end_date: string;
  days_remaining: number;
  refill_reminder_date: string;
  needs_refill_soon: boolean;
}

export interface GenericSubstitute {
  id: string;
  brand_name: string;
  generic_name: string;
  jan_aushadhi: boolean;
  notes?: string;
}

export interface TimelineEvent {
  eventId: string;
  caseId: string;
  dayOffset: number;
  label: string;
  type: 'medicine_stop' | 'followup' | 'procedure';
}

export interface SymptomNote {
  noteId: string;
  caseId: string;
  transcript: string;
  audioUrl?: string;
  createdAt: string;
}

export interface EscalationEvent {
  escalationId: string;
  caseId: string;
  trigger: 'flag' | 'missed_doses';
  notifiedCaregiverId?: string;
  notifiedAt?: string;
  sharedWithPharmacist: boolean;
}

export interface ConsentEvent {
  eventId: string;
  patientId: string;
  action: 'consent_given' | 'case_deleted';
  timestamp: string;
}

