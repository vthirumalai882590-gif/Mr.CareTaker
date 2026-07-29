import React, { useState, useMemo } from 'react';
import { CheckCircle2, Activity, BookOpen, Stethoscope, FlaskConical, ShieldAlert, Zap, ChevronDown, ChevronUp, Pill, Info } from 'lucide-react';
import { PatientCaseFullData } from '../../patientDataMap';
import { lookupInteraction, SEVERITY_CONFIG, PRIORITY_CONFIG, InteractionRecord, STEP_ICON } from '../../data/interactionDb';
import { DrugInteractionMiniChecker } from '../../components/DrugInteractionMiniChecker';

interface Props {
  data: PatientCaseFullData;
}

const PRIORITY_CONFIG_C = {
  urgent:  { label: 'URGENT',  classes: 'bg-rose-100 border border-rose-300 text-rose-800' },
  soon:    { label: 'SOON',    classes: 'bg-amber-100 border border-amber-300 text-amber-800' },
  routine: { label: 'ROUTINE', classes: 'bg-teal-100 border border-teal-300 text-teal-800' },
};

const SICON: Record<string, string> = {
  PHONE: 'PH', BP: 'BP', DOC: 'DOC', PILL: 'RX', LAB: 'LAB', CAL: 'CAL', ALERT: 'ALRT', TIME: 'TIME', EYE: 'EYE', OK: 'OK', SUGAR: 'SUGAR', BRAIN: 'MIND',
};

const InteractionCard: React.FC<{ pair: [string,string]; record: InteractionRecord | null; index: number }> = ({ pair, record, index }) => {
  const [expanded, setExpanded] = useState(index < 2);
  const severity = record?.severity ?? 'safe';
  const cfg = SEVERITY_CONFIG[severity];

  return (
    <div className={`rounded-2xl border-2 ${cfg.border} shadow-sm overflow-hidden`}>
      <button
        onClick={() => setExpanded(e => !e)}
        className={`w-full text-left p-4 flex items-center justify-between gap-3 ${cfg.card} hover:opacity-95 transition-opacity`}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={`text-[10px] font-black tracking-widest px-2 py-0.5 rounded-full ${cfg.badge}`}>{cfg.label}</span>
              {record && <span className="text-[10px] font-semibold text-slate-500 truncate max-w-xs">{record.type}</span>}
            </div>
            <p className="font-extrabold text-slate-800 text-sm">
              <span className="text-violet-700">{pair[0]}</span>
              <span className="mx-2 text-slate-400 font-light">+</span>
              <span className="text-teal-700">{pair[1]}</span>
            </p>
            {record && (
              <p className={`text-[11px] font-semibold mt-0.5 truncate ${cfg.text}`}>
                {record.clinicalEffect.length > 90 ? record.clinicalEffect.slice(0, 90) + '...' : record.clinicalEffect}
              </p>
            )}
          </div>
        </div>
        <span className="shrink-0 text-slate-400">{expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}</span>
      </button>

      {expanded && record && (
        <div className="bg-white border-t border-slate-200 p-5 space-y-5">
          <section>
            <div className="flex items-center gap-2 mb-2">
              <FlaskConical className="w-4 h-4 text-violet-500" />
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-violet-700">Mechanism</h4>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed bg-violet-50 border border-violet-200 rounded-xl p-3">{record.mechanism}</p>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-rose-500" />
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-rose-700">Clinical Effect</h4>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed bg-rose-50 border border-rose-200 rounded-xl p-3">{record.clinicalEffect}</p>
          </section>

          {record.consequences.length > 0 && record.consequences[0] !== 'None documented in clinical practice' && record.consequences[0] !== 'No significant adverse interaction - expected dual therapy' && (
            <section>
              <div className="flex items-center gap-2 mb-2">
                <ShieldAlert className="w-4 h-4 text-amber-500" />
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-amber-700">Potential Consequences</h4>
              </div>
              <ul className="space-y-1.5">
                {record.consequences.map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="mt-0.5 w-5 h-5 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-[10px] font-black text-amber-700 shrink-0">{i + 1}</span>
                    {c}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section>
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-teal-600" />
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-teal-700">Clinical Suggestions</h4>
            </div>
            <ul className="space-y-2">
              {record.suggestions.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-teal-500 mt-0.5 shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-2">
              <Stethoscope className="w-4 h-4 text-blue-500" />
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-blue-700">What to Monitor</h4>
            </div>
            <ul className="space-y-1.5">
              {record.monitoring.map((m, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="text-blue-400 mt-0.5 font-bold">-&gt;</span>
                  {m}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-amber-500" />
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-amber-700">Recommended Next Steps</h4>
            </div>
            <div className="space-y-2">
              {record.nextSteps.map((ns, i) => {
                const pc = PRIORITY_CONFIG_C[ns.priority];
                return (
                  <div key={i} className={`flex items-start gap-3 p-3 rounded-xl ${pc.classes}`}>
                    <span className="font-black text-xs px-2 py-0.5 rounded bg-white/60 shrink-0 border">{SICON[ns.icon] ?? 'ACT'}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[9px] font-black uppercase tracking-widest opacity-70">{pc.label} | {ns.who}</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-800">{ns.action}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}

      {expanded && !record && (
        <div className="bg-emerald-50 border-t border-emerald-200 p-4 flex items-center gap-2 text-sm text-emerald-800">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          No known clinically significant interaction between these two medicines in our database.
        </div>
      )}
    </div>
  );
};

export const DrugInteractionScreen: React.FC<Props> = ({ data }) => {
  const medicines = (data?.medicines ?? []).filter(m => m.active);
  const medNames = medicines.map(m => m.name);

  const pairs = useMemo<[string, string][]>(() => {
    const r: [string, string][] = [];
    for (let i = 0; i < medNames.length; i++)
      for (let j = i + 1; j < medNames.length; j++)
        r.push([medNames[i], medNames[j]]);
    return r;
  }, [medNames]);

  const records = pairs.map(p => ({ pair: p, record: lookupInteraction(p[0], p[1]) }));

  const criticalCount = records.filter(r => r.record?.severity === 'critical').length;
  const moderateCount = records.filter(r => r.record?.severity === 'moderate').length;
  const mildCount     = records.filter(r => r.record?.severity === 'mild').length;
  const safeCount     = records.filter(r => !r.record || r.record.severity === 'safe').length;

  const [filter, setFilter] = useState<'all' | 'critical' | 'moderate' | 'mild' | 'safe'>('all');
  const [activeTab, setActiveTab] = useState<'current' | 'check'>('current');

  const filtered = records.filter(r => {
    if (filter === 'all') return true;
    if (filter === 'safe') return !r.record || r.record.severity === 'safe';
    return r.record?.severity === filter;
  });

  const summaryCards = [
    { key: 'critical' as const, label: 'Critical',       count: criticalCount, cfg: SEVERITY_CONFIG.critical },
    { key: 'moderate' as const, label: 'Moderate',       count: moderateCount, cfg: SEVERITY_CONFIG.moderate },
    { key: 'mild'     as const, label: 'Mild',           count: mildCount,     cfg: SEVERITY_CONFIG.mild     },
    { key: 'safe'     as const, label: 'Safe / No Data', count: safeCount,     cfg: SEVERITY_CONFIG.safe     },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-700 rounded-3xl p-6 text-white shadow-lg">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
            <FlaskConical className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">Drug Interaction Checker</h1>
            <p className="text-violet-200 text-sm mt-1 max-w-xl">
              AI-powered pairwise analysis of all active medications for{' '}
              <span className="font-extrabold text-white">{data?.patient?.name ?? 'Patient'}</span>.
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className="text-xs bg-white/15 border border-white/25 px-3 py-1 rounded-full font-bold">{medicines.length} Active Medicines</span>
              <span className="text-xs bg-white/15 border border-white/25 px-3 py-1 rounded-full font-bold">{pairs.length} Pairs Analysed</span>
              <span className="text-xs italic text-violet-300">Confirm all changes with your doctor or pharmacist</span>
            </div>
          </div>
        </div>
      </div>

      {/* TABS: Current Regimen | Check New Medicine */}
      <div className="flex items-center gap-1 bg-slate-100 rounded-2xl p-1.5">
        <button
          onClick={() => setActiveTab('current')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-extrabold transition-all ${
            activeTab === 'current'
              ? 'bg-white text-violet-700 shadow-sm border border-violet-100'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Pill className="w-4 h-4" />
          Current Regimen Analysis
          {criticalCount > 0 && <span className="bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full ml-1">{criticalCount}</span>}
        </button>
        <button
          onClick={() => setActiveTab('check')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-extrabold transition-all ${
            activeTab === 'check'
              ? 'bg-white text-violet-700 shadow-sm border border-violet-100'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Zap className="w-4 h-4" />
          Check New Medicine
          <span className="bg-violet-100 text-violet-700 text-[9px] font-black px-1.5 py-0.5 rounded-full border border-violet-200 ml-1">LIVE</span>
        </button>
      </div>

      {/* ─── TAB: Current Regimen ─── */}
      {activeTab === 'current' && (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {summaryCards.map(s => (
              <button
                key={s.key}
                onClick={() => setFilter(filter === s.key ? 'all' : s.key)}
                className={`rounded-2xl p-4 text-center border-2 transition-all hover:shadow-md ${
                  filter === s.key
                    ? `${s.cfg.card} ${s.cfg.border} ring-2 ring-offset-1 ${s.cfg.ring}`
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className={`text-2xl font-black ${s.cfg.text}`}>{s.count}</div>
                <div className={`text-[10px] font-black uppercase tracking-widest mt-1 ${filter === s.key ? s.cfg.text : 'text-slate-500'}`}>{s.label}</div>
              </button>
            ))}
          </div>

          {/* Medicine List Widget */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Pill className="w-4 h-4 text-teal-600" />
              <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider">Active Medicines in This Analysis</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {medicines.map((m, i) => (
                <span key={i} className="bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold px-3 py-1.5 rounded-full">
                  {m.name} <span className="text-teal-500 font-normal">{m.dosage}</span>
                </span>
              ))}
              {medicines.length === 0 && <span className="text-xs text-slate-400 italic">No active medicines found.</span>}
            </div>
          </div>

          {/* Filter indicator */}
          {filter !== 'all' && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Info className="w-4 h-4 text-blue-500" />
              Showing <span className="font-bold capitalize mx-1">{filter}</span> interactions only.
              <button onClick={() => setFilter('all')} className="text-teal-600 font-bold hover:underline ml-1">Show all</button>
            </div>
          )}

          {/* Interaction Cards */}
          <div className="space-y-4">
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-sm">No interactions match the selected filter.</div>
            ) : (
              filtered.map(({ pair, record }, i) => (
                <InteractionCard key={`${pair[0]}-${pair[1]}`} pair={pair} record={record} index={i} />
              ))
            )}
          </div>
        </>
      )}

      {/* ─── TAB: Check New Medicine ─── */}
      {activeTab === 'check' && (
        <DrugInteractionMiniChecker currentMedicines={medNames} />
      )}

      {/* Disclaimer */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-500 leading-relaxed">
        <span className="font-extrabold text-slate-700">Important Disclaimer: </span>
        This tool provides educational clinical information to support care conversations. It is not a substitute for professional medical advice.
        All medication decisions must be confirmed with the prescribing physician or a licensed pharmacist.
        In case of emergency, call <span className="font-bold">112</span> (India) or visit the nearest hospital immediately.
      </div>
    </div>
  );
};

export default DrugInteractionScreen;