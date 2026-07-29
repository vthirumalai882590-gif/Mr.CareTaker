import React from 'react';
import { ShieldAlert } from 'lucide-react';

interface Props {
  compact?: boolean;
}

export const DisclaimerBanner: React.FC<Props> = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="bg-white dark:bg-slate-900 border-2 border-teal-300/80 dark:border-emerald-800 rounded-2xl p-3 text-xs text-slate-900 dark:text-slate-100 flex items-start gap-2.5 font-medium shadow-2xs">
        <ShieldAlert className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
        <span className="text-slate-800 dark:text-slate-200 font-bold">
          This explains what your document says — it isn't medical advice. Please confirm anything important with your doctor or pharmacist.
        </span>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border-2 border-teal-300/90 dark:border-slate-800 rounded-3xl p-5 text-sm text-slate-900 dark:text-slate-100 flex items-start gap-3.5 my-3 shadow-2xs">
      <div className="w-9 h-9 rounded-2xl bg-teal-50 dark:bg-teal-950 border border-teal-200 dark:border-teal-800 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
        <ShieldAlert className="w-5 h-5" />
      </div>
      <div>
        <span className="font-black text-teal-900 dark:text-teal-300 block mb-0.5 text-xs uppercase tracking-wider">Clinical Safety Boundary</span>
        <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-bold text-xs md:text-sm">
          "This explains what your document says — it isn't medical advice. Please confirm anything important with your doctor or pharmacist."
        </p>
      </div>
    </div>
  );
};

export default DisclaimerBanner;
