import React, { useState, useEffect } from 'react';
import { CreditCard, Download, Share2 } from 'lucide-react';
import { DisclaimerBanner } from '../../components/DisclaimerBanner';
import { PatientCaseFullData } from '../../patientDataMap';
import { getApiUrl } from '../../apiConfig';

interface Props {
  data?: PatientCaseFullData;
  patient?: any;
}

export const EmergencyCardScreen: React.FC<Props> = ({ data, patient }) => {
  const [mode, setMode] = useState<'lockscreen' | 'wallet'>('lockscreen');
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const activePatient = data?.patient || patient;
  const patientId = activePatient?.patient_id || 'patient-ramesh-kumar';
  const pName = activePatient?.name || 'Patient';

  useEffect(() => {
    setImageLoading(true);
    setImageError(false);
  }, [mode, patientId]);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6 font-sans text-slate-900 dark:text-slate-100">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950 px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wider mb-2 border border-teal-200 dark:border-teal-800">
            <CreditCard className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>Emergency Contact Card</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Emergency Medical Card Generator for {pName}</h1>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
            Auto-generated shareable lock-screen image (1080×1920) & printable wallet card layout.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-start md:self-auto">
          <button
            onClick={() => setMode('lockscreen')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
              mode === 'lockscreen' ? 'bg-teal-700 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Lock Screen (1080×1920)
          </button>
          <button
            onClick={() => setMode('wallet')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
              mode === 'wallet' ? 'bg-teal-700 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Wallet Card Layout
          </button>
        </div>
      </div>

      <DisclaimerBanner />

      {/* Preview Frame */}
      <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border-2 border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center space-y-4">
        <div className="text-xs font-mono font-black text-teal-800 dark:text-teal-300 uppercase tracking-widest bg-teal-50 dark:bg-teal-950 px-4 py-1.5 rounded-full border border-teal-200 dark:border-teal-800">
          SVG RENDERING PREVIEW ({mode.toUpperCase()}) — {pName}
        </div>

        <div className="relative bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl shadow-xl overflow-hidden max-w-md w-full border border-slate-300 dark:border-slate-700 min-h-[300px] flex items-center justify-center">
          {imageLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/90 dark:bg-slate-950/90 z-10 space-y-2">
              <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-[10px] text-slate-500 font-bold">Generating SVG Medical Card...</span>
            </div>
          )}
          {imageError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-slate-50 dark:bg-slate-950 z-10 space-y-2">
              <span className="text-xl">⚠️</span>
              <span className="text-xs text-rose-500 font-extrabold">Failed to load Emergency Card SVG.</span>
              <span className="text-[10px] text-slate-400">The server may be waking up from a cold start. Click below to download or retry.</span>
            </div>
          )}
          <img
            src={getApiUrl(`/api/cases/${patientId}/emergency-card-svg?mode=${mode}`)}
            alt={`Emergency Card for ${pName}`}
            onLoad={() => {
              setImageLoading(false);
              setImageError(false);
            }}
            onError={() => {
              setImageLoading(false);
              setImageError(true);
            }}
            key={`${mode}-${patientId}`}
            className={`w-full h-auto rounded-xl shadow-xs transition-opacity duration-300 ${imageLoading || imageError ? 'opacity-0' : 'opacity-100'}`}
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <a
            href={getApiUrl(`/api/cases/${patientId}/emergency-card-svg?mode=${mode}`)}
            download={`Emergency_Card_${pName.replace(/\s+/g, '_')}_${mode}.svg`}
            className="bg-gradient-to-r from-teal-700 to-emerald-600 hover:from-teal-800 hover:to-emerald-700 text-white font-black text-xs px-5 py-3 rounded-xl shadow-md flex items-center gap-2 transition active:scale-95 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Image</span>
          </a>
          <button
            onClick={() => alert('Emergency Card link generated for WhatsApp sharing.')}
            className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 flex items-center gap-2 transition cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>Share via WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
