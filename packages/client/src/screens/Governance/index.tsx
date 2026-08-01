import React, { useState } from 'react';
import { ShieldCheck, Lock, Trash2, Users, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { DisclaimerBanner } from '../../components/DisclaimerBanner';
import { getApiUrl } from '../../apiConfig';

interface Props {
  data?: any;
}

export const GovernanceScreen: React.FC<Props> = ({ data }) => {
  const [deleteInput, setDeleteInput] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deletedSuccess, setDeletedSuccess] = useState(false);

  const patientName = data?.patient?.name || 'Patient Owner';
  const patientPhone = data?.patient?.phone_number || '+91 98765 43210';
  const caregiverName = data?.caregivers?.[0]?.name || 'Primary Caregiver';
  const caregiverPhone = data?.caregivers?.[0]?.phone_number || '+91 98765 00001';

  const accessList = data?.governance || [
    { role: 'Patient (Owner)', name: patientName, phone: patientPhone, accessLevel: 'Full Access', addedAt: 'Onboarding (2026-07-20)' },
    { role: 'Primary Caregiver', name: `${caregiverName} (${data?.caregivers?.[0]?.relationship_to_patient || 'Caregiver'})`, phone: caregiverPhone, accessLevel: 'Linked Caregiver', addedAt: 'Invite Confirmed (2026-07-21)' },
  ];

  const handleConfirmDelete = async () => {
    if (deleteInput !== 'DELETE') return;
    setDeleting(true);
    try {
      const res = await fetch(getApiUrl('/api/cases/case-001/delete'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.success) {
        setDeletedSuccess(true);
        setShowDeleteModal(false);
      }
    } catch (e: any) {
      alert('Deletion failed: ' + e.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Governance & Privacy Layer</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Consent & Access Control</h1>
          <p className="text-sm text-slate-500 mt-1">
            Explicit access boundaries, plain-language onboarding consent audit, and non-recoverable case deletion.
          </p>
        </div>

        {deletedSuccess && (
          <div className="bg-emerald-100 text-emerald-900 border border-emerald-300 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Case data permanently purged per governance request.</span>
          </div>
        )}
      </div>

      <DisclaimerBanner />

      {/* Access Matrix ("Who can see this") */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
        <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Who Can See This Case ("Who can see this")
        </h2>
        <p className="text-xs text-slate-500">
          Strict data boundary: Data belongs strictly to the patient and explicitly linked caregivers. No cross-case pooling or third-party access.
        </p>

        <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
          {accessList.map((user: any, idx: number) => (
            <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary block">{user.role}</span>
                <span className="font-bold text-slate-900 text-base">{user.name}</span>
                <span className="text-xs text-slate-500 block">{user.phone} • {user.addedAt}</span>
              </div>
              <span className="bg-primary-light text-primary border border-primary/20 text-xs font-bold px-3 py-1 rounded-full self-start sm:self-center">
                {user.accessLevel}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Onboarding Consent Audit */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
        <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
          <Lock className="w-5 h-5 text-emerald-600" />
          Onboarding Consent Audit Log
        </h2>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
          <div className="flex items-center justify-between font-semibold text-slate-700">
            <span>WhatsApp Plain-Language Onboarding Consent</span>
            <span className="text-emerald-600 font-bold bg-emerald-100 px-2 py-0.5 rounded">AFFIRMATIVE YES</span>
          </div>
          <p className="text-slate-600 font-mono bg-white p-3 rounded border border-slate-200 leading-relaxed">
            "Your prescription photos and health notes are stored securely to organize your care record. They are never used to train shared models and can be erased anytime by messaging DELETE."
          </p>
          <span className="text-[11px] text-slate-400 block">Captured at: 2026-07-20T10:14:02Z • Version 1.0 (Plain Language)</span>
        </div>
      </div>

      {/* Hard Case Erasure (DELETE command) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-rose-200 space-y-4">
        <h2 className="font-bold text-base text-rose-900 flex items-center gap-2">
          <Trash2 className="w-5 h-5 text-rose-600" />
          Permanent Data Erasure (Hard DELETE)
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          Executing a DELETE command purges all Firestore/database documents, medicine logs, timeline events, safety flags, and uploaded storage images permanently. Reminders are canceled immediately.
        </p>

        <button
          onClick={() => setShowDeleteModal(true)}
          className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow transition flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          <span>Erase All Case Data (DELETE)</span>
        </button>
      </div>

      {/* DELETE Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertTriangle className="w-6 h-6 flex-shrink-0" />
              <h3 className="text-lg font-extrabold text-slate-900">Confirm Case Deletion</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              This action is permanent and non-recoverable. Type <strong className="text-slate-900 font-mono">DELETE</strong> below to confirm hard erasure of patient files, logs, and scheduled reminders.
            </p>

            <input
              type="text"
              value={deleteInput}
              onChange={(e) => setDeleteInput(e.target.value)}
              placeholder="Type DELETE to confirm"
              className="w-full border border-slate-300 rounded-xl p-3 text-sm font-mono focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleteInput !== 'DELETE' || deleting}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white disabled:opacity-50 shadow transition"
              >
                {deleting ? 'Erasing...' : 'Confirm Hard Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
