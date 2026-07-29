import React from 'react';
import { ShieldAlert, Share2, AlertTriangle, Info, CheckCircle2, HelpCircle } from 'lucide-react';
import { DisclaimerBanner } from '../../components/DisclaimerBanner';

interface Props {
  data?: any;
  flags?: any[];
}

export const SafetyFlagsScreen: React.FC<Props> = ({ data, flags: propsFlags }) => {
  const activeFlags = data?.safety_flags || propsFlags;
  const defaultFlags = [

    {
      id: 'f1',
      type: 'therapeutic_duplication',
      severity: 'caution',
      title: 'Therapeutic Class Duplication (Blood Pressure)',
      medicines: ['Amlodipine 5mg (Dr. Mehta)', 'Telmisartan 40mg (Dr. Sharma)'],
      reasoning: 'Amlodipine and Telmisartan are both blood-pressure medications from different drug classes. Taking two antihypertensives together without coordination between your doctors may cause your blood pressure to drop too low — ask your pharmacist if this combination is safe for you.',
    },
    {
      id: 'f2',
      type: 'drug_interaction',
      severity: 'caution',
      title: 'Drug-Drug Interaction: Metformin + Ibuprofen',
      medicines: ['Metformin 500mg', 'Ibuprofen 400mg'],
      reasoning: 'Ibuprofen (an NSAID) can reduce kidney function, which may slow the clearance of Metformin and increase its blood concentration — ask your pharmacist or doctor if this combination is safe for you.',
    },
    {
      id: 'f3',
      type: 'drug_interaction',
      severity: 'caution',
      title: 'Class Interaction: Aspirin + Ibuprofen',
      medicines: ['Aspirin 75mg', 'Ibuprofen 400mg'],
      reasoning: 'Both Aspirin and Ibuprofen belong to the NSAID class. Taking both together increases the risk of stomach bleeding — ask your pharmacist or doctor before taking both.',
    },
    {
      id: 'f4',
      type: 'low_confidence_field',
      severity: 'info',
      title: 'Low Confidence OCR Verification',
      medicines: ['Telmisartan 40mg'],
      reasoning: 'We couldn\'t confidently read one item on your prescription — please confirm the medicine name with your pharmacist.',
    }
  ];

  const flags = activeFlags || defaultFlags;


  const shareWithPharmacist = (flag: any) => {
    const patientName = data?.patient?.name || 'Patient';
    const text = `Hello Pharmacist, please review patient ${patientName}'s safety flag:\n\n${flag.title}\nMedicines: ${flag.medicines.join(', ')}\nReasoning: ${flag.reasoning}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-2 text-warning font-bold text-xs uppercase tracking-wider mb-1">
          <ShieldAlert className="w-4 h-4" />
          <span>Section 3.4 & 4.4 Safety Flags Panel</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">Safety Flags & Pharmacist Inquiry</h1>
        <p className="text-sm text-slate-500 mt-1">
          Cross-referenced against open drug interaction data. Every flag is framed as an inquiry to bring to your pharmacist or doctor.
        </p>
      </div>

      <DisclaimerBanner />

      <div className="space-y-4">
        {flags.map((flag: any) => (
          <div
            key={flag.id}
            className={`p-6 rounded-2xl border shadow-sm space-y-4 transition ${
              flag.severity === 'caution'
                ? 'bg-warning-light/80 border-warning/40'
                : 'bg-primary-light/60 border-primary/30'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                {flag.severity === 'caution' ? (
                  <AlertTriangle className="w-6 h-6 text-warning flex-shrink-0 mt-0.5" />
                ) : (
                  <Info className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900">{flag.title}</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {flag.medicines.map((m: string, idx: number) => (

                      <span key={idx} className="bg-white border border-slate-200 text-xs font-mono font-bold px-2.5 py-0.5 rounded-md text-slate-800">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => shareWithPharmacist(flag)}
                className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 font-bold text-xs px-3.5 py-2.5 rounded-xl shadow-sm transition whitespace-nowrap self-start sm:self-auto"
              >
                <Share2 className="w-3.5 h-3.5 text-primary" />
                <span>Ask Your Pharmacist (WhatsApp Share)</span>
              </button>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 text-sm text-slate-800 leading-relaxed font-sans space-y-1">
              <span className="font-bold text-primary flex items-center gap-1.5 text-xs">
                <HelpCircle className="w-3.5 h-3.5" />
                Plain-Language Inquiry Reason:
              </span>
              <p className="text-slate-700 font-medium">{flag.reasoning}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

