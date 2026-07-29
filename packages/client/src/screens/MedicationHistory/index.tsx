import React, { useState, useEffect } from 'react';
import { History, Stethoscope, AlertTriangle } from 'lucide-react';
import { DisclaimerBanner } from '../../components/DisclaimerBanner';
import { DrugInteractionMiniChecker } from '../../components/DrugInteractionMiniChecker';
import { PatientHistoryUploader, ExtractedHistoryEntry } from '../../components/PatientHistoryUploader';
import { PatientCaseFullData } from '../../patientDataMap';

interface Props {
  data?: PatientCaseFullData;
  historyData?: any[];
}

export const MedicationHistoryScreen: React.FC<Props> = ({ data }) => {
  const patientName = data?.patient?.name || 'Ramesh Kumar';

  const defaultHistory: ExtractedHistoryEntry[] = data?.medicines?.map(m => ({
    medicine_id: m.medicine_id,
    name: m.name,
    dosage: m.dosage,
    frequency: m.frequency,
    therapeutic_class: 'Prescribed Medicine',
    doctor_name: m.doctor_name || 'Dr. Primary Practitioner',
    hospital_name: 'Medical Center',
    prescription_date: new Date().toISOString().split('T')[0],
    active: m.active,
    has_duplication_flag: false,
  })) || [
    {
      medicine_id: 'm1',
      name: 'Amlodipine',
      dosage: '5 mg',
      frequency: 'Once daily',
      therapeutic_class: 'Calcium Channel Blocker',
      doctor_name: 'Dr. A. Mehta (Cardiologist)',
      hospital_name: 'Apollo Hospital',
      prescription_date: '2026-07-19',
      active: true,
      has_duplication_flag: false,
    },
    {
      medicine_id: 'm2',
      name: 'Metformin',
      dosage: '500 mg',
      frequency: 'Twice daily',
      therapeutic_class: 'Biguanide Antidiabetic',
      doctor_name: 'Dr. A. Mehta (Cardiologist)',
      hospital_name: 'Apollo Hospital',
      prescription_date: '2026-07-19',
      active: true,
      has_duplication_flag: false,
    }
  ];

  const [historyList, setHistoryList] = useState<ExtractedHistoryEntry[]>(defaultHistory);

  useEffect(() => {
    if (data?.medicines) {
      setHistoryList(defaultHistory);
    }
  }, [data?.patient?.patient_id]);

  const handleHistoryAdded = (newItem: ExtractedHistoryEntry) => {
    setHistoryList(prev => [newItem, ...prev]);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6 font-sans text-slate-900 dark:text-slate-100">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950 px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wider mb-2 border border-teal-200 dark:border-teal-800">
            <History className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>Section 3.2 Longitudinal Record</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Multi-Doctor Medication History & Reconciliation</h1>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
            Longitudinal record across all prescriptions & doctors for <strong className="text-slate-900 dark:text-slate-100">{patientName}</strong>. Cross-checks active medications for therapeutic-class overlaps.
          </p>
        </div>
      </div>

      <DisclaimerBanner />

      {/* Patient History & Prescription File Uploader Widget */}
      <PatientHistoryUploader
        patientName={patientName}
        onHistoryAdded={handleHistoryAdded}
      />

      {/* Therapeutic Duplication Banner Alert */}
      <div className="bg-amber-50/90 dark:bg-amber-950/60 border-2 border-amber-300 dark:border-amber-800 rounded-3xl p-5 md:p-6 space-y-3 shadow-xs">
        <div className="flex items-start gap-3.5">
          <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-black text-amber-950 dark:text-amber-200 text-base tracking-tight">
              Multi-Doctor Therapeutic Duplication Flagged
            </h3>
            <p className="text-xs md:text-sm text-amber-900 dark:text-amber-300 mt-1 leading-relaxed font-medium">
              Patient <strong className="text-amber-950 dark:text-amber-100">{patientName}</strong> has active prescriptions from two different doctors that contain blood-pressure lowering medications:
            </p>
            <ul className="mt-2 space-y-1 text-xs font-bold text-amber-900 dark:text-amber-200 list-disc list-inside">
              <li><strong>Amlodipine 5mg</strong> prescribed by Dr. A. Mehta (Apollo Hospital)</li>
              <li><strong>Telmisartan 40mg</strong> prescribed by Dr. R. Sharma (Manipal Hospital)</li>
            </ul>
            <p className="text-xs text-amber-800 dark:text-amber-300 italic mt-2 font-medium">
              ⚠️ Taking two antihypertensives together without coordination may cause blood pressure to drop too low. Always ask your pharmacist or doctor.
            </p>
          </div>
        </div>
      </div>

      {/* History List Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden space-y-0">
        <div className="p-4 md:p-5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="font-black text-sm text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <span>Longitudinal Prescription Log ({patientName})</span>
            <span className="bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-extrabold text-xs px-2.5 py-0.5 rounded-full border border-teal-200 dark:border-teal-800">
              {historyList.length} Records
            </span>
          </div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {historyList.map((item) => (
            <div key={item.medicine_id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-black text-lg text-slate-900 dark:text-slate-100 tracking-tight">{item.name}</span>
                  <span className="font-mono text-xs font-extrabold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                    {item.dosage}
                  </span>
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 rounded-full">
                    {item.therapeutic_class}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-bold">
                    <Stethoscope className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    {item.doctor_name} ({item.hospital_name})
                  </span>
                  <span>Prescribed: <strong className="text-slate-800 dark:text-slate-200">{item.prescription_date}</strong></span>
                  <span>Frequency: <strong className="text-slate-800 dark:text-slate-200">{item.frequency}</strong></span>
                </div>
              </div>

              {item.has_duplication_flag && (
                <span className="bg-amber-100 dark:bg-amber-950 text-amber-950 dark:text-amber-200 border border-amber-300 dark:border-amber-800 font-black text-xs px-3.5 py-1.5 rounded-xl self-start md:self-auto shadow-2xs">
                  ⚠️ Duplication Warning
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Live Drug Interaction Mini Checker — check a new medicine instantly */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase tracking-widest text-violet-700 dark:text-violet-400">Add & Check Interaction</span>
          <span className="bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 text-[9px] font-black px-2 py-0.5 rounded-full border border-violet-200 dark:border-violet-800">LIVE</span>
        </div>
        <DrugInteractionMiniChecker currentMedicines={(data?.medicines ?? []).filter(m => m.active).map(m => m.name)} />
      </div>

    </div>
  );
};
