import React, { useState } from 'react';
import { UserPlus, X, CheckCircle2, ShieldCheck, Heart, Scale, Trash2, AlertTriangle, Pill, Stethoscope, User, Phone, FileText } from 'lucide-react';
import { Patient } from '../types';
import { PatientCaseFullData } from '../patientDataMap';

export interface InitialMedEntry {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  doctor_name: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  patientsList: Patient[];
  selectedPatientId: string;
  onSelectPatient: (id: string) => void;
  onSavePatientFull: (
    newPatient: Patient,
    caregiverName: string,
    caregiverPhone: string,
    caregiverRel: string,
    medList: InitialMedEntry[],
    historyNotes: string,
    followupData: { date: string; doctor: string; facility: string },
    safetyFlagData: { title: string; reasoning: string; severity: string },
    adherenceData: { rate: number; streak: number }
  ) => void;
  onDeletePatient: (patientId: string) => void;
  onDeleteAllPatients: () => void;
}

export const ManagePatientsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  patientsList,
  selectedPatientId,
  onSelectPatient,
  onSavePatientFull,
  onDeletePatient,
  onDeleteAllPatients,
}) => {
  const [tab, setTab] = useState<'add' | 'delete'>('add');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const [medList, setMedList] = useState<InitialMedEntry[]>([
    { id: '1', name: 'Amlodipine', dosage: '5 mg', frequency: 'Once daily (Morning)', duration: '30 days', doctor_name: 'Dr. Primary Practitioner' }
  ]);

  if (!isOpen) return null;

  const handleAddMed = () => {
    setMedList(prev => [
      ...prev,
      {
        id: `med-${Date.now()}-${prev.length + 1}`,
        name: '',
        dosage: '500 mg',
        frequency: 'Twice daily (Meals)',
        duration: '30 days',
        doctor_name: 'Dr. Primary Practitioner'
      }
    ]);
  };

  const handleRemoveMed = (id: string) => {
    if (medList.length <= 1) return;
    setMedList(prev => prev.filter(m => m.id !== id));
  };

  const handleMedChange = (id: string, field: keyof InitialMedEntry, value: string) => {
    setMedList(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const name = (formData.get('name') as string) || 'New Patient';
    const age = Number(formData.get('age')) || 65;
    const gender = (formData.get('gender') as any) || 'Male';
    const blood_group = (formData.get('blood_group') as string) || 'B+';
    const abha_id = (formData.get('abha_id') as string) || `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const phone_number = (formData.get('phone_number') as string) || '+91 98765 43210';
    const address = (formData.get('address') as string) || 'Bengaluru, Karnataka';

    const conditionsRaw = (formData.get('primary_conditions') as string) || '';
    const allergiesRaw = (formData.get('known_allergies') as string) || '';
    const historyNotes = (formData.get('history_notes') as string) || 'No prior surgeries or chronic complications.';

    const primary_conditions = conditionsRaw.split(',').map(s => s.trim()).filter(Boolean);
    const known_allergies = allergiesRaw.split(',').map(s => s.trim()).filter(Boolean);

    const caregiverName = (formData.get('caregiver_name') as string) || 'Family Caregiver';
    const caregiverPhone = (formData.get('caregiver_phone') as string) || '+91 98765 00001';
    const caregiverRel = (formData.get('caregiver_relationship') as string) || 'Caregiver';

    const height_cm = Number(formData.get('height_cm')) || 168;
    const weight_kg = Number(formData.get('weight_kg')) || 70;
    const bp_baseline = (formData.get('bp_baseline') as string) || '130/84 mmHg';
    const blood_sugar_fasting = (formData.get('blood_sugar_fasting') as string) || '118 mg/dL';

    // Follow-up
    const followup_date = (formData.get('followup_date') as string) || 'Aug 15, 2026';
    const followup_doctor = (formData.get('followup_doctor') as string) || 'Dr. A. Mehta (Cardiology)';
    const followup_facility = (formData.get('followup_facility') as string) || 'Apollo Hospital, Bengaluru';

    // Safety Flag
    const safety_title = (formData.get('safety_title') as string) || 'Multi-Doctor Therapeutic Duplication Flagged';
    const safety_reasoning = (formData.get('safety_reasoning') as string) || 'Cross-checked active prescriptions for overlaps. Always confirm with your pharmacist.';
    const safety_severity = (formData.get('safety_severity') as string) || 'caution';

    // Adherence
    const adherence_rate = Number(formData.get('adherence_rate')) || 92;
    const streak_days = Number(formData.get('streak_days')) || 7;

    // Clean up empty medication entries
    const validMeds = medList.map(m => ({
      ...m,
      name: m.name.trim() || 'Prescribed Medication'
    }));

    const newPatient: Patient = {
      patient_id: `pat-${Date.now()}`,
      name,
      age,
      gender,
      blood_group,
      abha_id,
      phone_number,
      address,
      known_allergies: known_allergies.length > 0 ? known_allergies : ['None reported'],
      primary_conditions: primary_conditions.length > 0 ? primary_conditions : ['General Wellness'],
      vitals: {
        height_cm,
        weight_kg,
        bmi: Number((weight_kg / Math.pow(height_cm / 100, 2)).toFixed(1)),
        bp_baseline,
        blood_sugar_fasting,
      },
      emergency_contact: {
        name: caregiverName,
        relationship: caregiverRel,
        phone: caregiverPhone,
      }
    };

    onSavePatientFull(
      newPatient,
      caregiverName,
      caregiverPhone,
      caregiverRel,
      validMeds,
      historyNotes,
      { date: followup_date, doctor: followup_doctor, facility: followup_facility },
      { title: safety_title, reasoning: safety_reasoning, severity: safety_severity },
      { rate: adherence_rate, streak: streak_days }
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-4 border border-slate-200 dark:border-slate-800 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              Patient Record Management
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Add new patients with full history & details or delete patient records under DPDP rules.
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl">
          <button
            onClick={() => setTab('add')}
            className={`flex-1 py-2 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition ${
              tab === 'add' ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Patient (Full Details & History)</span>
          </button>
          <button
            onClick={() => setTab('delete')}
            className={`flex-1 py-2 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition ${
              tab === 'delete' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-rose-600'
            }`}
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Patient Records ({patientsList.length})</span>
          </button>
        </div>

        {/* ─── TAB 1: ADD PATIENT WITH FULL DETAILS ─── */}
        {tab === 'add' && (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* 1. Patient Profile */}
            <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
              <span className="font-extrabold text-slate-900 dark:text-slate-100 text-xs block uppercase tracking-wider text-teal-700 dark:text-teal-400">
                1. Patient Profile & Contact Details
              </span>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Full Patient Name *</label>
                <input name="name" required placeholder="e.g. Ramesh Kumar / Sunita Devi" className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 rounded-xl p-2.5 font-bold outline-none focus:ring-2 focus:ring-teal-500" />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Age *</label>
                  <input name="age" type="number" required defaultValue={68} className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 rounded-xl p-2.5 font-bold outline-none" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Gender *</label>
                  <select name="gender" required defaultValue="Male" className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 rounded-xl p-2.5 font-bold outline-none">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Blood Group *</label>
                  <input name="blood_group" required defaultValue="B+" placeholder="e.g. B+, O+, A+" className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 rounded-xl p-2.5 font-bold outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">ABHA Health ID Number *</label>
                  <input name="abha_id" required defaultValue="91-4829-1029-4821" placeholder="91-4829-1029-4821" className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 rounded-xl p-2.5 font-mono font-bold outline-none" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Patient Phone Number *</label>
                  <input name="phone_number" required defaultValue="+91 98765 43210" className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 rounded-xl p-2.5 font-bold outline-none" />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Residential Address *</label>
                <input name="address" required defaultValue="Indiranagar, Bengaluru, Karnataka" placeholder="e.g. Indiranagar, Bengaluru, Karnataka" className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 rounded-xl p-2.5 font-medium outline-none" />
              </div>
            </div>

            {/* 2. Full Medical History & Conditions */}
            <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
              <span className="font-extrabold text-slate-900 dark:text-slate-100 text-xs block uppercase tracking-wider text-teal-700 dark:text-teal-400">
                2. Full Medical History & Diagnostics
              </span>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Primary Medical Conditions (comma separated) *</label>
                <input name="primary_conditions" required defaultValue="Type 2 Diabetes, Hypertension" placeholder="e.g. Type 2 Diabetes, Hypertension, Asthma" className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 rounded-xl p-2.5 font-semibold outline-none" />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Known Drug Allergies (comma separated) *</label>
                <input name="known_allergies" required defaultValue="Penicillin" placeholder="e.g. Penicillin, Sulfa drugs, Aspirin" className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 rounded-xl p-2.5 font-semibold outline-none" />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Full Clinical History & Doctor Notes *</label>
                <textarea name="history_notes" required rows={2} defaultValue="History of mild hypertension for 5 years. Regular HbA1c monitoring every 3 months." placeholder="e.g. History of mild hypertension for 5 years. Regular HbA1c monitoring every 3 months." className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 rounded-xl p-2.5 font-medium outline-none" />
              </div>
            </div>

            {/* 3. Linked Caregiver */}
            <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
              <span className="font-extrabold text-slate-900 dark:text-slate-100 text-xs block uppercase tracking-wider text-teal-700 dark:text-teal-400">
                3. Linked Family Caregiver Details
              </span>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Caregiver Name *</label>
                  <input name="caregiver_name" required defaultValue="Priya Kumar" className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 rounded-xl p-2.5 font-bold outline-none" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Relationship *</label>
                  <input name="caregiver_relationship" required defaultValue="Daughter" className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 rounded-xl p-2.5 font-bold outline-none" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Caregiver Phone *</label>
                  <input name="caregiver_phone" required defaultValue="+91 98765 00001" className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 rounded-xl p-2.5 font-bold outline-none" />
                </div>
              </div>
            </div>

            {/* 4. Baseline Vitals */}
            <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
              <span className="font-extrabold text-slate-900 dark:text-slate-100 text-xs block uppercase tracking-wider text-teal-700 dark:text-teal-400">
                4. Baseline Vitals & Physical Metrics
              </span>

              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Height (cm) *</label>
                  <input name="height_cm" type="number" required defaultValue={168} className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 rounded-xl p-2 font-bold outline-none" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Weight (kg) *</label>
                  <input name="weight_kg" type="number" required defaultValue={70} className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 rounded-xl p-2 font-bold outline-none" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Baseline BP *</label>
                  <input name="bp_baseline" required defaultValue="130/84 mmHg" className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 rounded-xl p-2 font-bold outline-none" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Fasting Sugar *</label>
                  <input name="blood_sugar_fasting" required defaultValue="118 mg/dL" className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 rounded-xl p-2 font-bold outline-none" />
                </div>
              </div>
            </div>

            {/* 5. Prescribed Initial Medication Regimen (Dynamic Multi-Medication List) */}
            <div className="space-y-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                <div>
                  <span className="font-extrabold text-slate-900 dark:text-slate-100 text-xs block uppercase tracking-wider text-teal-700 dark:text-teal-400">
                    5. Prescribed Initial Medication Regimen ({medList.length})
                  </span>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Add one or multiple medications prescribed for this patient.</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddMed}
                  className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs shadow-sm flex items-center gap-1.5 transition shrink-0 active:scale-95"
                >
                  <Pill className="w-3.5 h-3.5" />
                  <span>➕ Add Another Medication</span>
                </button>
              </div>

              <div className="space-y-3">
                {medList.map((m, idx) => (
                  <div key={m.id} className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 relative shadow-xs">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5">
                      <span className="font-extrabold text-xs text-teal-800 dark:text-teal-300 flex items-center gap-1.5">
                        <Pill className="w-3.5 h-3.5" />
                        Medication #{idx + 1}
                      </span>
                      {medList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMed(m.id)}
                          className="text-rose-500 hover:text-rose-700 dark:hover:text-rose-400 text-xs font-extrabold flex items-center gap-1 hover:bg-rose-50 dark:hover:bg-rose-950 px-2 py-0.5 rounded-lg transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Medicine Name *</label>
                        <input
                          required
                          value={m.name}
                          onChange={e => handleMedChange(m.id, 'name', e.target.value)}
                          placeholder="e.g. Amlodipine / Metformin"
                          className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded-xl p-2.5 font-bold outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Dosage *</label>
                        <input
                          value={m.dosage}
                          onChange={e => handleMedChange(m.id, 'dosage', e.target.value)}
                          placeholder="e.g. 5 mg / 500 mg"
                          className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded-xl p-2.5 font-bold outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Frequency *</label>
                        <input
                          required
                          value={m.frequency}
                          onChange={e => handleMedChange(m.id, 'frequency', e.target.value)}
                          placeholder="e.g. Once daily (Morning)"
                          className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded-xl p-2 font-bold outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Duration *</label>
                        <input
                          required
                          value={m.duration}
                          onChange={e => handleMedChange(m.id, 'duration', e.target.value)}
                          placeholder="e.g. 30 days"
                          className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded-xl p-2 font-bold outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Prescribing Doctor *</label>
                        <input
                          required
                          value={m.doctor_name}
                          onChange={e => handleMedChange(m.id, 'doctor_name', e.target.value)}
                          placeholder="e.g. Dr. A. Mehta"
                          className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded-xl p-2 font-bold outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. Upcoming Doctor Follow-Up Consultation */}
            <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
              <span className="font-extrabold text-slate-900 dark:text-slate-100 text-xs block uppercase tracking-wider text-teal-700 dark:text-teal-400">
                6. Upcoming Doctor Follow-Up Consultation
              </span>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Follow-Up Date *</label>
                  <input name="followup_date" required defaultValue="Aug 15, 2026" placeholder="e.g. Aug 15, 2026" className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 rounded-xl p-2.5 font-bold outline-none" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Doctor Name & Speciality *</label>
                  <input name="followup_doctor" required defaultValue="Dr. A. Mehta (Cardiology)" placeholder="e.g. Dr. A. Mehta (Cardiology)" className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 rounded-xl p-2.5 font-bold outline-none" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Hospital / Clinic Facility *</label>
                  <input name="followup_facility" required defaultValue="Apollo Hospital, Bengaluru" placeholder="e.g. Apollo Hospital, Bengaluru" className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 rounded-xl p-2.5 font-bold outline-none" />
                </div>
              </div>
            </div>

            {/* 7. Safety Flags & Clinical Warnings */}
            <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
              <span className="font-extrabold text-slate-900 dark:text-slate-100 text-xs block uppercase tracking-wider text-teal-700 dark:text-teal-400">
                7. Custom Safety Flags & Clinical Warnings
              </span>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Safety Warning Title *</label>
                  <input name="safety_title" required defaultValue="Multi-Doctor Therapeutic Duplication Flagged" placeholder="e.g. Therapeutic Class Duplication" className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 rounded-xl p-2.5 font-bold outline-none" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Severity Level *</label>
                  <select name="safety_severity" required defaultValue="caution" className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 rounded-xl p-2.5 font-bold outline-none">
                    <option value="caution">Caution (Orange Alert)</option>
                    <option value="serious">Serious (Red Alert)</option>
                    <option value="info">Info (Green Verified)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Clinical Safety Reasoning & Pharmacist Notes *</label>
                <textarea name="safety_reasoning" required rows={2} defaultValue="Cross-checked active prescriptions for therapeutic-class overlaps. Always confirm with your doctor or pharmacist." placeholder="Clinical explanation for patient or pharmacist..." className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 rounded-xl p-2.5 font-medium outline-none" />
              </div>
            </div>

            {/* 8. Adherence Rate & Logging Setup */}
            <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
              <span className="font-extrabold text-slate-900 dark:text-slate-100 text-xs block uppercase tracking-wider text-teal-700 dark:text-teal-400">
                8. Adherence Rate & Logging Setup
              </span>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Initial Adherence Rate (%) *</label>
                  <input name="adherence_rate" type="number" required defaultValue={92} min={0} max={100} className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 rounded-xl p-2.5 font-bold outline-none" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Adherence Streak Days *</label>
                  <input name="streak_days" type="number" required defaultValue={7} min={0} className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 rounded-xl p-2.5 font-bold outline-none" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800">
                Cancel
              </button>
              <button type="submit" className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold shadow-md flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Save Full Patient Profile & History</span>
              </button>
            </div>
          </form>
        )}

        {/* ─── TAB 2: DELETE PATIENT RECORDS ─── */}
        {tab === 'delete' && (
          <div className="space-y-4 text-xs">
            <div className="bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 p-4 rounded-2xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-extrabold text-rose-900 dark:text-rose-200 text-sm">India DPDP Act Permanent Data Erasure</h4>
                <p className="text-rose-800 dark:text-rose-300 mt-1 leading-relaxed">
                  Deleting a patient permanently purges all associated prescription records, safety flags, adherence logs, timelines, and caregiver links from local storage and backend databases.
                </p>
              </div>
            </div>

            {/* List of Patients to Delete */}
            <div className="space-y-2 max-h-72 overflow-y-auto">
              <span className="font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">Registered Patients List ({patientsList.length})</span>

              {patientsList.map(p => {
                const isSelected = p.patient_id === selectedPatientId;
                const isConfirming = confirmDeleteId === p.patient_id;

                return (
                  <div
                    key={p.patient_id}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition ${
                      isSelected
                        ? 'bg-teal-50/50 dark:bg-slate-800 border-teal-300 dark:border-teal-700'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-800 text-white font-extrabold flex items-center justify-center text-xs">
                        {p.name[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900 dark:text-slate-100 text-xs">{p.name}</span>
                          <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono text-[9px] px-1.5 py-0.5 rounded font-bold">{p.blood_group}</span>
                          {isSelected && <span className="bg-emerald-500 text-white text-[9px] font-black px-2 py-0.2 rounded-full">ACTIVE</span>}
                        </div>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block">{p.age} yrs • Phone: {p.phone_number}</span>
                      </div>
                    </div>

                    {!isConfirming ? (
                      <button
                        onClick={() => setConfirmDeleteId(p.patient_id)}
                        className="px-3 py-1.5 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 hover:bg-rose-600 hover:text-white text-xs font-bold transition flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            onDeletePatient(p.patient_id);
                            setConfirmDeleteId(null);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-extrabold text-xs shadow hover:bg-rose-700"
                        >
                          Confirm Delete
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-2 py-1.5 rounded-xl bg-slate-200 text-slate-700 text-xs font-bold"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Delete ALL Patients Action */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400 font-bold text-xs">Purge all registered patients & cases</span>
              <button
                onClick={() => {
                  if (confirm('🚨 DANGER: Are you sure you want to DELETE ALL PATIENTS and clear all database records?')) {
                    onDeleteAllPatients();
                    onClose();
                  }
                }}
                className="px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-extrabold text-xs shadow flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete ALL Patients (Reset Database)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagePatientsModal;