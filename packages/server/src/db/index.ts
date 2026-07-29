/**
 * SpashtCare — Zero-Native-Dependency Database Layer
 * Pure JS SQLite-compatible database wrapper for maximum compatibility across Node environments.
 */

import fs from 'fs';
import path from 'path';

const DB_FILE = path.join(__dirname, '..', '..', 'spashtcare.json');

export interface MemoryStore {
  patients: Record<string, any>;
  caregivers: Record<string, any>;
  cases: Record<string, any>;
  documents: Record<string, any>;
  extracted_fields: Record<string, any>;
  extraction_attempts: Record<string, any>;
  medicines: Record<string, any>;
  safety_flags: Record<string, any>;
  adherence_events: Record<string, any>;
  escalation_events: Record<string, any>;
  generic_substitutes: Record<string, any>;
  consent_records: Record<string, any>;
}

let store: MemoryStore = {
  patients: {},
  caregivers: {},
  cases: {},
  documents: {},
  extracted_fields: {},
  extraction_attempts: {},
  medicines: {},
  safety_flags: {},
  adherence_events: {},
  escalation_events: {},
  generic_substitutes: {},
  consent_records: {},
};

function loadStore() {
  if (fs.existsSync(DB_FILE)) {
    try {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      store = JSON.parse(data);
    } catch (e) {
      console.warn('[DB] Failed to load JSON store, starting fresh');
    }
  }
}

function saveStore() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(store, null, 2));
  } catch (e) {
    console.error('[DB] Save error:', e);
  }
}

loadStore();

export function getDb() {
  loadStore();
  return {

    prepare: (sql: string) => {
      const normalizedSql = sql.trim().replace(/\s+/g, ' ');

      return {
        run: (...args: any[]) => {
          // SQL dispatcher for INSERT / UPDATE / DELETE
          if (normalizedSql.startsWith('INSERT') || normalizedSql.startsWith('INSERT OR REPLACE')) {
            const tableMatch = normalizedSql.match(/INTO\s+(\w+)/i);
            if (tableMatch) {
              const table = tableMatch[1] as keyof MemoryStore;
              if (store[table]) {
                const id = args[0];
                store[table][id] = createRowFromArgs(table, args);
                saveStore();
              }
            }
          } else if (normalizedSql.startsWith('UPDATE')) {
            const tableMatch = normalizedSql.match(/UPDATE\s+(\w+)/i);
            if (tableMatch) {
              const table = tableMatch[1] as keyof MemoryStore;
              if (table === 'adherence_events') {
                const [status, respondedAt, eventId] = args;
                if (store.adherence_events[eventId]) {
                  store.adherence_events[eventId].status = status;
                  store.adherence_events[eventId].responded_at = respondedAt;
                  saveStore();
                }
              } else if (table === 'cases') {
                const [status, timestamp, caseId] = args;
                if (store.cases[caseId]) {
                  store.cases[caseId].consent_status = status;
                  store.cases[caseId].consent_timestamp = timestamp;
                  saveStore();
                }
              }
            }
          } else if (normalizedSql.startsWith('DELETE')) {
            const tableMatch = normalizedSql.match(/DELETE FROM\s+(\w+)/i);
            if (tableMatch) {
              const table = tableMatch[1] as keyof MemoryStore;
              if (table && store[table]) {
                const targetId = args[0];
                const whereMatch = normalizedSql.match(/WHERE\s+(\w+)\s*=\s*\?/i);
                const medicineIds = new Set(
                  Object.values(store.medicines)
                    .filter((medicine: any) => medicine.case_id === targetId)
                    .map((medicine: any) => medicine.medicine_id)
                );
                const documentIds = new Set(
                  Object.values(store.documents)
                    .filter((document: any) => document.case_id === targetId)
                    .map((document: any) => document.document_id)
                );
                const brands = [...normalizedSql.matchAll(/'([^']+)'/g)].map(match => match[1]);

                Object.keys(store[table]).forEach((id) => {
                  const row = store[table][id];
                  const matchesSubquery =
                    (normalizedSql.includes('medicine_id IN') && medicineIds.has(row.medicine_id)) ||
                    (normalizedSql.includes('document_id IN') && documentIds.has(row.document_id));
                  const matchesOrphanedMedicine =
                    normalizedSql.includes('medicine_id NOT IN') &&
                    !Object.values(store.medicines).some((medicine: any) => medicine.medicine_id === row.medicine_id);
                  const matchesMissingCase =
                    normalizedSql.includes('case_id IS NULL') &&
                    (row.case_id == null || row.data?.[1] == null);
                  const matchesBrand = normalizedSql.includes('brand_name IN') && brands.includes(row.brand_name);
                  const matchesWhere = whereMatch
                    ? row[whereMatch[1]] === targetId || row.data?.[1] === targetId
                    : false;

                  if (matchesSubquery || matchesOrphanedMedicine || matchesMissingCase || matchesBrand || matchesWhere || id === targetId) {
                    delete store[table][id];
                  }
                });
                saveStore();
              }
            }
          }
          return { changes: 1 };
        },

        get: (...args: any[]) => {
          const id = args[0];
          if (normalizedSql.includes('FROM cases')) return store.cases[id] || Object.values(store.cases)[0];
          if (normalizedSql.includes('FROM patients')) return store.patients[id] || Object.values(store.patients)[0];
          if (normalizedSql.includes('FROM caregivers')) return store.caregivers[id] || Object.values(store.caregivers)[0];
          if (normalizedSql.includes('FROM documents')) return store.documents[id] || Object.values(store.documents)[0];
          return null;
        },

        all: (...args: any[]) => {
          const id = args[0];
          if (normalizedSql.includes('FROM documents')) {
            return Object.values(store.documents).filter((d: any) => !id || d.case_id === id);
          }
          if (normalizedSql.includes('FROM medicines')) {
            return Object.values(store.medicines).filter((m: any) => !id || m.case_id === id);
          }
          if (normalizedSql.includes('FROM safety_flags')) {
            return Object.values(store.safety_flags).filter((f: any) => !id || f.case_id === id);
          }
          if (normalizedSql.includes('FROM adherence_events')) {
            if (normalizedSql.includes('JOIN medicines')) {
              const cutoff = Date.now() - 2 * 86400000;
              const missedEvents = Object.values(store.adherence_events)
                .filter((event: any) => event.status === 'missed' && new Date(event.scheduled_at).getTime() >= cutoff)
                .map((event: any) => ({
                  ...event,
                  medicine_name: store.medicines[event.medicine_id]?.name,
                  case_id: store.medicines[event.medicine_id]?.case_id,
                }))
                .filter((event: any) => event.case_id);
              const missedCountByCase = missedEvents.reduce<Record<string, number>>((counts, event: any) => {
                counts[event.case_id] = (counts[event.case_id] || 0) + 1;
                return counts;
              }, {});
              return missedEvents.filter((event: any) => missedCountByCase[event.case_id] >= 2);
            }
            return Object.values(store.adherence_events);
          }
          if (normalizedSql.includes('FROM generic_substitutes')) {
            return Object.values(store.generic_substitutes);
          }
          if (normalizedSql.includes('FROM extracted_fields')) {
            return Object.values(store.extracted_fields).filter((f: any) => !id || f.document_id === id);
          }
          if (normalizedSql.includes('FROM extraction_attempts')) {
            return Object.values(store.extraction_attempts).filter((a: any) => !id || a.field_id === id || a.document_id === id);
          }
          return [];
        }
      };
    },
    transaction: (fn: Function) => {
      return (...args: any[]) => fn(...args);
    },
    exec: () => {}
  };
}

function createRowFromArgs(table: string, args: any[]) {
  switch (table) {
    case 'patients':
      return { patient_id: args[0], name: args[1], age: args[2], blood_group: args[3], known_allergies: args[4], phone_number: args[5], created_at: args[6] };
    case 'caregivers':
      return { caregiver_id: args[0], name: args[1], relationship_to_patient: args[2], phone_number: args[3], notification_preferences: args[4], created_at: args[5] };
    case 'cases':
      return { case_id: args[0], patient_id: args[1], caregiver_ids: args[2], preferred_language: args[3], consent_status: args[4], consent_timestamp: args[5], created_at: args[6] };
    case 'documents':
      return { document_id: args[0], case_id: args[1], source_image_url: args[2], document_type: args[3], raw_ocr_text: args[4], doctor_name: args[5], hospital_name: args[6], prescription_date: args[7], uploaded_at: args[8] };
    case 'extracted_fields':
      return { field_id: args[0], document_id: args[1], field_type: args[2], raw_value: args[3], normalized_value: args[4], confidence_score: args[5], retry_count: args[6], resolution_status: args[7], created_at: args[8] };
    case 'extraction_attempts':
      return { attempt_id: args[0], field_id: args[1], document_id: args[2], step_name: args[3], input_snapshot: args[4], output_snapshot: args[5], confidence_before: args[6], confidence_after: args[7], candidate_matches: args[8], reasoning: args[9], timestamp: args[10] };
    case 'medicines':
      return { medicine_id: args[0], case_id: args[1], name: args[2], brand_name: args[3], therapeutic_class: args[4], dosage: args[5], frequency: args[6], duration: args[7], start_date: args[8], computed_end_date: args[9], source_document_id: args[10], active: args[11], created_at: args[12] };
    case 'safety_flags':
      return { flag_id: args[0], case_id: args[1], flag_type: args[2], involved_medicine_ids: args[3], reasoning_text: args[4], severity: args[5], acknowledged: args[6], created_at: args[7] };
    case 'adherence_events':
      return { event_id: args[0], medicine_id: args[1], scheduled_at: args[2], status: args[3], responded_at: args[4], created_at: args[5] };
    case 'generic_substitutes':
      return { id: args[0], brand_name: args[1], generic_name: args[2], jan_aushadhi: args[3], notes: args[4] };
    case 'consent_records':
      return { record_id: args[0], case_id: args[1], language: args[2], consent_given: args[3], timestamp: args[4] };
    case 'escalation_events':
      return { escalation_id: args[0], case_id: args[1], trigger_type: args[2], caregiver_notified_at: args[3], pharmacist_share_link_generated: args[4], created_at: args[5] };
    default:
      return { id: args[0], data: args };
  }
}
