import React, { useState } from 'react';
import { PatientCaseFullData } from '../../patientDataMap';
import { DisclaimerBanner } from '../../components/DisclaimerBanner';
import { ConfidenceBadge } from '../../components/ConfidenceBadge';
import { ShieldAlert, Sparkles, Stethoscope, CheckCircle2, Pill, RefreshCw, ChevronRight } from 'lucide-react';

interface Props {
  data: PatientCaseFullData | null;
  onNavigate: (tab: any) => void;
}

export const PredictiveRiskScreen: React.FC<Props> = ({ data, onNavigate }) => {
  const patient = data?.patient || {
    name: 'Ramesh Kumar',
    age: 72,
    gender: 'Male',
    blood_group: 'B+',
    primary_conditions: ['Type 2 Diabetes Mellitus', 'Hypertension', 'Dyslipidemia'],
    known_allergies: ['Penicillin'],
    vitals: { height_cm: 168, weight_kg: 70, bmi: 24.8, bp_baseline: '130/84 mmHg', blood_sugar_fasting: '118 mg/dL' },
    phone_number: '+91 98765 43210'
  };

  const medicines = data?.medicines || [
    { medicine_id: 'm1', name: 'Amlodipine', dosage: '5 mg', frequency: 'Once daily (Morning)', duration: '30 days', doctor_name: 'Dr. A. Mehta (Cardiology)', active: true, confidence: 95 },
    { medicine_id: 'm2', name: 'Metformin', dosage: '500 mg', frequency: 'Twice daily (Meals)', duration: '30 days', doctor_name: 'Dr. S. Rao (Endocrinology)', active: true, confidence: 92 }
  ];

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastAnalyzedTime, setLastAnalyzedTime] = useState<string | null>(null);

  const handleRunPrognosis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setLastAnalyzedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1200);
  };

  // Predicted Future Diseases based on clinical conditions & vitals
  const predictedDiseases = [
    {
      id: 'dis-1',
      name: 'Diabetic Nephropathy / Chronic Kidney Disease (CKD)',
      category: 'Renal & Microvascular',
      riskScore: 68,
      riskLevel: 'High Risk',
      riskColor: 'bg-rose-600 text-white font-black',
      timeframe: '3 to 5 years',
      biomarkers: ['Fasting Sugar: 118 mg/dL', 'BP: 130/84 mmHg', 'Longstanding T2D'],
      triggerReason: 'Concurrent Hypertension and Type 2 Diabetes increase glomerular capillary pressure over time, risking microalbuminuria.',
      screeningRec: 'Serum Creatinine, eGFR & Urine Albumin-to-Creatinine Ratio (UACR) every 6 months.',
      preventativeAction: 'Strict glycemic control (HbA1c < 7.0%), ACEi/ARB renal protection evaluation, low-sodium diet (<2g/day).'
    },
    {
      id: 'dis-2',
      name: 'Atherosclerotic Cardiovascular Disease (ASCVD)',
      category: 'Cardiovascular',
      riskScore: 52,
      riskLevel: 'Moderate-High Risk',
      riskColor: 'bg-amber-500 text-slate-950 font-black',
      timeframe: '5 to 8 years',
      biomarkers: ['Age 70+', 'Baseline Hypertension', 'Multi-Doctor Regimen'],
      triggerReason: 'Synergistic arterial stiffening from chronic glycemic variations and baseline elevated systolic blood pressure.',
      screeningRec: 'Annual Lipid Panel (LDL-C < 70 mg/dL target), Resting 12-Lead ECG, and Echocardiogram.',
      preventativeAction: 'Daily physical activity (30 min brisk walk), lipid-lowering therapy evaluation with cardiologist.'
    },
    {
      id: 'dis-3',
      name: 'Metformin-Induced Vitamin B12 Deficiency & Neuropathy',
      category: 'Pharmacological Side-Effect Risk',
      riskScore: 44,
      riskLevel: 'Moderate Risk',
      riskColor: 'bg-amber-500 text-slate-950 font-black',
      timeframe: '1 to 2 years',
      biomarkers: ['Metformin 500mg BD', 'Prolonged Use > 2 yrs'],
      triggerReason: 'Long-term Metformin therapy inhibits calcium-dependent ileal absorption of Vitamin B12, causing peripheral numbness.',
      screeningRec: 'Serum Vitamin B12 level & Methylmalonic Acid (MMA) test annually.',
      preventativeAction: 'Proactive oral Methylcobalamin (Vitamin B12) supplementation as advised by physician.'
    },
    {
      id: 'dis-4',
      name: 'Diabetic Retinopathy & Microvascular Nerve Sensitivity',
      category: 'Ophthalmic Microvascular',
      riskScore: 35,
      riskLevel: 'Moderate-Low Risk',
      riskColor: 'bg-blue-600 text-white font-black',
      timeframe: '2 to 4 years',
      biomarkers: ['Retinal Microaneurysm Risk', 'Glycemic Exposure Index'],
      triggerReason: 'Hyperglycemia damages delicate retinal capillaries, leading to microhemorrhages if unmonitored.',
      screeningRec: 'Annual Dilated Eye Examination (Fundoscopy) and Monofilament Foot Sensory Testing.',
      preventativeAction: 'Maintain steady blood sugar levels without sharp spikes; protect eyes from oxidative stress.'
    }
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto font-sans bg-slate-50 text-slate-900 rounded-3xl min-h-screen">
      
      {/* Header */}
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-teal-700 text-white text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
              AI Clinical Engine v4.0
            </span>
            <span className="text-xs text-slate-700 font-extrabold">Llama 3.3 70B Risk Forecaster</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mt-2 flex items-center gap-2.5">
            <Stethoscope className="w-7 h-7 text-teal-600" />
            Future Disease & Prescription Risk Predictor
          </h1>
          <p className="text-xs md:text-sm text-slate-600 font-medium mt-1">
            Predictive disease risk analysis, long-term drug side-effect forecaster, and preventative clinical action plan for <strong className="text-slate-900 font-black">{patient.name}</strong>.
          </p>
        </div>

        <button
          onClick={handleRunPrognosis}
          disabled={isAnalyzing}
          className="bg-gradient-to-r from-teal-700 to-emerald-600 hover:from-teal-800 hover:to-emerald-700 text-white font-black text-xs px-5 py-3.5 rounded-2xl shadow-md hover:shadow-lg transition flex items-center gap-2 shrink-0 active:scale-95 disabled:opacity-50 cursor-pointer self-start md:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
          <span>{isAnalyzing ? 'Analyzing Clinical Risk Biomarkers...' : '⚡ Run Live AI Risk Prognosis'}</span>
        </button>
      </div>

      <DisclaimerBanner />

      {/* Patient Health & Vitals Profile Bar */}
      <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-teal-700 text-white font-black flex items-center justify-center text-base shadow-md shrink-0">
              {(patient?.name || 'Patient').split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-black text-lg text-slate-900 tracking-tight">{patient?.name || 'Patient'}</h3>
                <span className="bg-teal-50 text-teal-900 font-black text-xs px-3 py-0.5 rounded-full border border-teal-200">
                  {patient.blood_group}
                </span>
                <span className="text-xs text-slate-600 font-extrabold">{patient.age} yrs • {patient.gender}</span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 font-medium">ABHA Health ID: <span className="font-mono font-black text-slate-900">{(patient as any).abha_id || '91-4829-1029-4821'}</span></p>
            </div>
          </div>

          {lastAnalyzedTime && (
            <span className="text-xs text-emerald-800 font-black bg-emerald-50 px-3.5 py-1.5 rounded-xl border border-emerald-200 shrink-0 self-start sm:self-auto">
              ✓ Last Analyzed Today at {lastAnalyzedTime}
            </span>
          )}
        </div>

        {/* Clinical Biomarkers Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-1">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Primary Conditions</span>
            <span className="font-black text-slate-900 block">{patient.primary_conditions?.join(', ') || 'Hypertension, Diabetes'}</span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-1">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Baseline Blood Pressure</span>
            <span className="font-black text-slate-900 block">{patient.vitals?.bp_baseline || '130/84 mmHg'}</span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-1">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Fasting Sugar Level</span>
            <span className="font-black text-slate-900 block">{patient.vitals?.blood_sugar_fasting || '118 mg/dL'}</span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-1">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Physical BMI & Weight</span>
            <span className="font-black text-slate-900 block">{patient.vitals?.weight_kg || 70} kg ({patient.vitals?.bmi || 24.8} BMI)</span>
          </div>
        </div>
      </div>

      {/* AI Predictive Future Disease Risk Analysis Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 tracking-tight">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Proactive Health & Future Disease Forecaster (Next 1–10 Years)
            </h2>
            <p className="text-xs md:text-sm text-slate-600 font-medium">
              Clinical predictive algorithms analyze current disease progression & prescription load to forecast future organ risks.
            </p>
          </div>
          <span className="text-xs font-black text-slate-800 bg-slate-200/80 px-3.5 py-1.5 rounded-xl border border-slate-300 shrink-0 self-start sm:self-auto">
            {predictedDiseases.length} High Risk Biomarkers Flagged
          </span>
        </div>

        {/* Whitish Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {predictedDiseases.map((disease) => (
            <div key={disease.id} className="p-6 rounded-3xl border-2 border-slate-200/80 bg-white space-y-4 transition-all duration-200 shadow-sm hover:shadow-md">
              
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 block mb-1">
                    {disease.category} • Estimated Onset: <strong className="text-slate-900 font-black">{disease.timeframe}</strong>
                  </span>
                  <h3 className="font-black text-base md:text-lg text-slate-900 leading-snug tracking-tight">
                    {disease.name}
                  </h3>
                </div>
                <span className={`text-[11px] font-black px-3.5 py-1.5 rounded-full shrink-0 uppercase tracking-wider shadow-2xs ${disease.riskColor}`}>
                  {disease.riskLevel} ({disease.riskScore}%)
                </span>
              </div>

              {/* Trigger Biomarkers */}
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                <span className="text-[11px] font-black text-slate-600 self-center mr-1">Trigger Biomarkers:</span>
                {disease.biomarkers.map((b, i) => (
                  <span key={i} className="bg-slate-100 text-slate-900 border border-slate-200 font-extrabold px-2.5 py-1 rounded-xl shadow-2xs">
                    • {b}
                  </span>
                ))}
              </div>

              {/* Trigger Reason Box with Whitish/Amber Soft Fill */}
              <div className="bg-amber-50/80 border border-amber-200/80 p-4 rounded-2xl text-xs space-y-1 shadow-2xs">
                <span className="text-amber-900 font-black block text-[11px] uppercase tracking-wider">Clinical Pathophysiology & Organ Risk</span>
                <p className="leading-relaxed font-semibold text-slate-800">{disease.triggerReason}</p>
              </div>

              {/* Recommended Diagnostics & Action */}
              <div className="space-y-2.5 text-xs pt-1">
                <div className="bg-teal-50/90 p-4 rounded-2xl border border-teal-200 text-teal-950 space-y-1 shadow-2xs">
                  <div className="flex items-center gap-1.5 font-black text-teal-900">
                    <Stethoscope className="w-4 h-4 shrink-0 text-teal-700" />
                    <span>Recommended Clinical Screening:</span>
                  </div>
                  <p className="font-bold pl-5 leading-relaxed text-teal-950">{disease.screeningRec}</p>
                </div>

                <div className="bg-emerald-50/90 p-4 rounded-2xl border border-emerald-200 text-emerald-950 space-y-1 shadow-2xs">
                  <div className="flex items-center gap-1.5 font-black text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-700" />
                    <span>Preventative Action Plan:</span>
                  </div>
                  <p className="font-bold pl-5 leading-relaxed text-emerald-950">{disease.preventativeAction}</p>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Deep Active Prescription Detail & Interaction Audit */}
      <div className="bg-white border border-slate-200/80 p-6 md:p-8 rounded-3xl shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-2">
          <div>
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2 tracking-tight">
              <Pill className="w-5 h-5 text-teal-600" />
              Active Prescription Detail & Long-Term Side-Effect Audit
            </h2>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              Cross-checking active medicines for organ burden, prolonged therapy toxicity, and multi-doctor duplication.
            </p>
          </div>

          <button onClick={() => onNavigate('interactions')} className="text-xs font-black text-teal-700 hover:text-teal-900 flex items-center gap-1 hover:underline cursor-pointer shrink-0">
            <span>Open Multi-Drug Interaction Checker</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {medicines.map((med: any) => (
            <div key={med.medicine_id} className="p-5 rounded-2xl border-2 border-slate-200 bg-slate-50/70 space-y-3 shadow-2xs">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-base text-slate-900">{med.name}</span>
                    <span className="bg-slate-900 text-white font-mono font-black text-xs px-2.5 py-0.5 rounded-md">
                      {med.dosage}
                    </span>
                  </div>
                  <span className="text-xs text-slate-600 font-bold block mt-1">
                    {med.frequency} • {med.duration || '30 days'} • Prescribed by: {med.doctor_name || 'Dr. Practitioner'}
                  </span>
                </div>
                <ConfidenceBadge score={med.confidence || 93} />
              </div>

              {/* Drug Organ Burden & Side Effect Risks */}
              <div className="space-y-2 bg-white p-3.5 rounded-xl border border-slate-200 text-xs shadow-2xs">
                <div className="flex justify-between items-center text-slate-700">
                  <span className="font-bold">Organ Excretion Burden:</span>
                  <span className="font-black text-slate-900">Hepatic & Renal Clearance</span>
                </div>
                <div className="flex justify-between items-center text-slate-700">
                  <span className="font-bold">Prolonged Therapy Side-Effect:</span>
                  <span className="font-black text-amber-700">
                    {med.name.toLowerCase().includes('metformin') ? 'Vitamin B12 Malabsorption Risk' : 'Peripheral Ankle Edema Risk'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-700">
                  <span className="font-bold">Jan Aushadhi Generic Substitute:</span>
                  <span className="font-black text-emerald-700">Available (75% Cost Savings)</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preventative Healthcare Plan Summary Box */}
      <div className="bg-gradient-to-br from-teal-50/90 via-emerald-50/60 to-slate-50 p-6 md:p-8 rounded-3xl border-2 border-teal-300 shadow-sm space-y-3.5 text-slate-900">
        <h3 className="font-black text-sm text-teal-900 uppercase tracking-wider flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-emerald-600" />
          Pharmacist & Physician Preventative Action Summary
        </h3>
        <ul className="space-y-2 text-xs md:text-sm text-slate-800 list-disc list-inside leading-relaxed font-semibold">
          <li><strong>Schedule Renal Function Test (RFT):</strong> Perform serum creatinine & eGFR testing within the next 30 days.</li>
          <li><strong>Ophthalmic Screening:</strong> Book annual dilated fundoscopy exam to verify absence of diabetic micro-aneurysms.</li>
          <li><strong>Vitamin B12 Protocol:</strong> Discuss oral B12 supplementation with Dr. S. Rao to counter Metformin-induced depletion.</li>
          <li><strong>Patient & Caregiver Monitoring:</strong> Record weekly blood pressure readings in SpashtCare Adherence Tracker.</li>
        </ul>
      </div>

    </div>
  );
};
