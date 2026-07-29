import React, { useState } from 'react';
import { UserPlus, X, CheckCircle2, ShieldCheck, Heart, Scale } from 'lucide-react';
import { Patient } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSavePatient: (newPatient: Patient, caregiverName: string, caregiverPhone: string) => void;
}

export const AddPatientModal: React.FC<Props> = ({ isOpen, onClose, onSavePatient }) => {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const name = formData.get('name') as string;
    const age = Number(formData.get('age')) || 65;
    const gender = (formData.get('gender') as any) || 'Male';
    const blood_group = (formData.get('blood_group') as string) || 'B+';
    const abha_id = (formData.get('abha_id') as string) || `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const phone_number = (formData.get('phone_number') as string) || '+91 98765 43210';
    const address = (formData.get('address') as string) || 'Bengaluru, Karnataka';

    const conditionsRaw = (formData.get('primary_conditions') as string) || '';
    const allergiesRaw = (formData.get('known_allergies') as string) || '';

    const primary_conditions = conditionsRaw.split(',').map(s => s.trim()).filter(Boolean);
    const known_allergies = allergiesRaw.split(',').map(s => s.trim()).filter(Boolean);

    const caregiverName = (formData.get('caregiver_name') as string) || 'Family Caregiver';
    const caregiverPhone = (formData.get('caregiver_phone') as string) || '+91 98765 00001';

    const height_cm = Number(formData.get('height_cm')) || 170;
    const weight_kg = Number(formData.get('weight_kg')) || 68;
    const bp_baseline = (formData.get('bp_baseline') as string) || '120/80 mmHg';
    const blood_sugar_fasting = (formData.get('blood_sugar_fasting') as string) || '110 mg/dL';

    const newPatient: Patient = {
      patient_id: `pat-${Date.now()}`,
      name,
      age,
      gender,
      blood_group,
      abha_id,
      phone_number,
      address,
      known_allergies,
      primary_conditions,
      vitals: {
        height_cm,
        weight_kg,
        bmi: Number((weight_kg / Math.pow(height_cm / 100, 2)).toFixed(1)),
        bp_baseline,
        blood_sugar_fasting,
      },
      emergency_contact: {
        name: caregiverName,
        relationship: 'Caregiver',
        phone: caregiverPhone,
      }
    };

    onSavePatient(newPatient, caregiverName, caregiverPhone);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-4 border border-slate-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2 text-primary font-bold">
            <UserPlus className="w-5 h-5" />
            <h3 className="text-xl font-extrabold text-slate-900">Add New Patient Profile</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 font-bold">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Patient Basic Information */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <span className="font-bold text-slate-900 text-xs block">1. Patient Basic Profile</span>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Full Patient Name *</label>
              <input name="name" required placeholder="e.g. Ramesh Kumar / Sunita Devi" className="w-full border border-slate-300 rounded-xl p-2.5 font-bold focus:ring-2 focus:ring-primary outline-none" />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Age *</label>
                <input name="age" type="number" required defaultValue={68} className="w-full border border-slate-300 rounded-xl p-2.5 font-bold outline-none" />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Gender *</label>
                <select name="gender" defaultValue="Male" className="w-full border border-slate-300 rounded-xl p-2.5 font-bold bg-white outline-none">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Blood Group</label>
                <input name="blood_group" defaultValue="B+" placeholder="e.g. B+, O+, A+" className="w-full border border-slate-300 rounded-xl p-2.5 font-bold outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">ABHA Health ID Number</label>
                <input name="abha_id" placeholder="91-4829-1029-4821" className="w-full border border-slate-300 rounded-xl p-2.5 font-mono font-bold outline-none" />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Patient Phone Number *</label>
                <input name="phone_number" required defaultValue="+91 98765 43210" className="w-full border border-slate-300 rounded-xl p-2.5 font-bold outline-none" />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Residential Address</label>
              <input name="address" placeholder="e.g. Indiranagar, Bengaluru, Karnataka" className="w-full border border-slate-300 rounded-xl p-2.5 font-medium outline-none" />
            </div>
          </div>

          {/* Clinical Conditions & Allergies */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <span className="font-bold text-slate-900 text-xs block">2. Medical Conditions & Allergies</span>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Primary Medical Conditions (comma separated)</label>
              <input name="primary_conditions" placeholder="e.g. Type 2 Diabetes, Hypertension, Asthma" className="w-full border border-slate-300 rounded-xl p-2.5 font-medium outline-none" />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Known Drug Allergies (comma separated)</label>
              <input name="known_allergies" placeholder="e.g. Penicillin, Sulfa drugs, Aspirin" className="w-full border border-slate-300 rounded-xl p-2.5 font-medium outline-none" />
            </div>
          </div>

          {/* Caregiver Details */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <span className="font-bold text-slate-900 text-xs block">3. Linked Family Caregiver</span>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Caregiver Name *</label>
                <input name="caregiver_name" required defaultValue="Priya Kumar" placeholder="e.g. Priya Kumar (Daughter)" className="w-full border border-slate-300 rounded-xl p-2.5 font-bold outline-none" />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Caregiver Phone *</label>
                <input name="caregiver_phone" required defaultValue="+91 98765 00001" className="w-full border border-slate-300 rounded-xl p-2.5 font-bold outline-none" />
              </div>
            </div>
          </div>

          {/* Baseline Vitals */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <span className="font-bold text-slate-900 text-xs block">4. Baseline Vitals & Physical Metrics</span>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Height (cm)</label>
                <input name="height_cm" type="number" defaultValue={168} className="w-full border border-slate-300 rounded-xl p-2.5 font-bold outline-none" />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Weight (kg)</label>
                <input name="weight_kg" type="number" defaultValue={70} className="w-full border border-slate-300 rounded-xl p-2.5 font-bold outline-none" />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Baseline BP (mmHg)</label>
                <input name="bp_baseline" defaultValue="130/84 mmHg" className="w-full border border-slate-300 rounded-xl p-2.5 font-bold outline-none" />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Fasting Blood Sugar (mg/dL)</label>
                <input name="blood_sugar_fasting" defaultValue="118 mg/dL" className="w-full border border-slate-300 rounded-xl p-2.5 font-bold outline-none" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl text-slate-600 font-bold hover:bg-slate-100">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-extrabold shadow-md flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Save & Add Patient Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
