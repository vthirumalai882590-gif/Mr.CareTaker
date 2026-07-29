import React from 'react';
import { CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';

interface Props {
  score: number;
  showScore?: boolean;
}

export const ConfidenceBadge: React.FC<Props> = ({ score, showScore = false }) => {
  if (score >= 85) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        <span>Clear</span>
        {showScore && <span className="font-mono text-[10px] opacity-75">({score}%)</span>}
      </span>
    );
  } else if (score >= 70) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
        <span>Mostly Clear</span>
        {showScore && <span className="font-mono text-[10px] opacity-75">({score}%)</span>}
      </span>
    );
  } else {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-800 border border-rose-200">
        <HelpCircle className="w-3.5 h-3.5 text-rose-600" />
        <span>Please Confirm</span>
        {showScore && <span className="font-mono text-[10px] opacity-75">({score}%)</span>}
      </span>
    );
  }
};
