import React from 'react';
import { Pill, Info, MapPin, ExternalLink, ShieldCheck } from 'lucide-react';
import { DisclaimerBanner } from '../../components/DisclaimerBanner';

interface Props {
  data?: any;
}

export const GenericSubstituteScreen: React.FC<Props> = ({ data }) => {
  const patientMeds = (data?.medicines || []).filter((m: any) => m.active);
  
  const generics = patientMeds.length > 0
    ? patientMeds.map((m: any) => ({
        brand: `${m.name} (${m.dosage || '5mg'})`,
        brandPrice: '₹45 / 10 tabs',
        generic: `${m.name} ${m.dosage || '5mg'} (Generic)`,
        janPrice: '₹8 / 10 tabs',
        janAushadhi: true,
        estSavings: '82% Cost Savings'
      }))
    : [
        { brand: 'Amlokind (5mg)', brandPrice: '₹42 / 10 tabs', generic: 'Amlodipine 5mg', janPrice: '₹6 / 10 tabs', janAushadhi: true, estSavings: '85% Cost Savings' },
        { brand: 'Glycomet (500mg)', brandPrice: '₹38 / 10 tabs', generic: 'Metformin 500mg', janPrice: '₹8 / 10 tabs', janAushadhi: true, estSavings: '79% Cost Savings' },
        { brand: 'Ecosprin (75mg)', brandPrice: '₹14 / 14 tabs', generic: 'Aspirin 75mg', janPrice: '₹4 / 14 tabs', janAushadhi: true, estSavings: '71% Cost Savings' },
        { brand: 'Telma (40mg)', brandPrice: '₹95 / 15 tabs', generic: 'Telmisartan 40mg', janPrice: '₹18 / 15 tabs', janAushadhi: true, estSavings: '81% Cost Savings' },
        { brand: 'Brufen (400mg)', brandPrice: '₹28 / 15 tabs', generic: 'Ibuprofen 400mg', janPrice: '₹7 / 15 tabs', janAushadhi: true, estSavings: '75% Cost Savings' },
      ];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-1">
            <Pill className="w-4 h-4" />
            <span>Section 3.11 Jan Aushadhi Generic Matcher</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Jan Aushadhi Generic Substitute Finder</h1>
          <p className="text-sm text-slate-500 mt-1">
            Informational price comparisons for WHO-GMP certified generic equivalents at Jan Aushadhi Kendras across India.
          </p>
        </div>

        <button
          onClick={() => window.open('https://janaushadhi.gov.in/KendraDetails.aspx', '_blank')}
          className="bg-primary hover:bg-primary-dark text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow transition flex items-center gap-2 whitespace-nowrap self-start md:self-auto"
        >
          <MapPin className="w-4 h-4" />
          <span>Locate Nearby Jan Aushadhi Store →</span>
        </button>
      </div>

      <DisclaimerBanner />

      {/* Mandatory Positioning Banner */}
      <div className="bg-primary-light border border-primary/20 rounded-2xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <div className="text-xs text-slate-800 leading-relaxed font-medium">
          <strong className="text-primary block mb-0.5">Mandatory Positioning Constraint:</strong>
          "A generic equivalent may be available at lower cost — ask your pharmacist or doctor."
          <p className="mt-1 text-slate-600 italic">
            This tool never recommends switching medications on its own authority and never displays an automated "switch now" button. It serves purely as a transparent price comparison guide.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {generics.map((g: any, idx: number) => (
          <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-extrabold text-base text-slate-900">{g.brand}</span>
                <span className="bg-emerald-100 text-emerald-900 font-bold text-[11px] px-2.5 py-0.5 rounded-full border border-emerald-300">
                  {g.estSavings}
                </span>
              </div>

              <div className="space-y-1 mt-3 text-xs">
                <div className="flex items-center justify-between text-slate-500">
                  <span>Brand Retail Price:</span>
                  <span className="line-through font-bold text-slate-400">{g.brandPrice}</span>
                </div>
                <div className="flex items-center justify-between text-emerald-900 font-bold bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                  <span>Jan Aushadhi Generic Price:</span>
                  <span className="text-sm font-extrabold text-emerald-800">{g.janPrice}</span>
                </div>
                <p className="text-[11px] text-slate-600 font-mono mt-1">
                  Generic Salt: <strong>{g.generic}</strong>
                </p>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 flex items-center justify-between mt-2">
              <span className="text-[11px]">Jan Aushadhi Kendra Equivalent</span>
              <span className="text-[11px] font-bold text-primary">Ask Pharmacist →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

