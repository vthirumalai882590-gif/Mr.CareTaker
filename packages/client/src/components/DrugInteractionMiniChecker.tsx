import React, { useState, useRef, useEffect } from "react";
import { FlaskConical, Search, X, CheckCircle2, ArrowLeftRight, Zap, ChevronDown, ChevronUp, Pill, Plus, Info } from "lucide-react";
import { INTERACTION_DB, lookupInteraction, SEVERITY_CONFIG, PRIORITY_CONFIG, InteractionRecord, BRAND_TO_GENERIC, getBrandMapping } from "../data/interactionDb";

interface Props {
  currentMedicines: string[];
}

const GENERIC_DRUGS = Array.from(new Set(INTERACTION_DB.flatMap(r => [r.drugA, r.drugB])));
const BRAND_SUGGESTIONS = Object.entries(BRAND_TO_GENERIC).map(([brand, generic]) => `${brand.charAt(0).toUpperCase() + brand.slice(1)} (${generic})`);
const KNOWN_DRUGS = Array.from(new Set([...GENERIC_DRUGS, ...BRAND_SUGGESTIONS])).sort();

const SICON: Record<string, string> = {
  PHONE: "PH", BP: "BP", DOC: "DOC", PILL: "RX", LAB: "LAB", CAL: "CAL",
  ALERT: "ALRT", TIME: "TIME", EYE: "EYE", OK: "OK", SUGAR: "GLU", BRAIN: "MIND",
};

/* ─── Autocomplete Input ─────────────────────────────── */
const DrugInput: React.FC<{
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  color: "violet" | "teal";
  label: string;
  onEnter?: () => void;
}> = ({ value, onChange, placeholder, color, label, onEnter }) => {
  const [sugg, setSugg] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const handleChange = (v: string) => {
    onChange(v);
    if (v.length >= 1) {
      const q = v.toLowerCase();
      const f = KNOWN_DRUGS.filter(d => d.toLowerCase().includes(q));
      setSugg(f.slice(0, 8));
      setOpen(f.length > 0);
    } else { setSugg([]); setOpen(false); }
  };

  const handleSelectSuggestion = (s: string) => {
    // If format is "Ecosprin (Aspirin)", extract "Ecosprin"
    const cleaned = s.includes("(") ? s.split(" (")[0] : s;
    onChange(cleaned);
    setSugg([]);
    setOpen(false);
  };

  const brandInfo = getBrandMapping(value);

  const ringColor = color === "violet" ? "focus:border-violet-400 focus:ring-violet-100" : "focus:border-teal-400 focus:ring-teal-100";
  const iconColor = color === "violet" ? "text-violet-400" : "text-teal-400";
  const labelColor = color === "violet" ? "text-violet-700 bg-violet-50 border-violet-200" : "text-teal-700 bg-teal-50 border-teal-200";

  return (
    <div className="flex-1 min-w-0" ref={ref}>
      <div className="flex items-center justify-between mb-1.5">
        <div className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border inline-block ${labelColor}`}>{label}</div>
        {brandInfo.isBrand && (
          <span className="text-[10px] font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full border border-violet-200 flex items-center gap-1">
            <Info className="w-3 h-3 text-violet-500 shrink-0" />
            Mapped to {brandInfo.genericName}
          </span>
        )}
      </div>
      <div className="relative">
        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${iconColor} pointer-events-none`} />
        <input
          type="text" value={value}
          onChange={e => handleChange(e.target.value)}
          onFocus={() => { if (value.length >= 1) handleChange(value); }}
          onKeyDown={e => { if (e.key === "Enter" && onEnter) onEnter(); if (e.key === "Escape") setOpen(false); }}
          placeholder={placeholder}
          className={`w-full pl-9 pr-8 py-3 text-sm rounded-xl border-2 border-slate-200 outline-none font-semibold transition focus:ring-2 ${ringColor} placeholder-slate-400`}
        />
        {value && (
          <button onClick={() => { onChange(""); setSugg([]); setOpen(false); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500">
            <X className="w-4 h-4" />
          </button>
        )}
        {open && sugg.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden max-h-60 overflow-y-auto">
            {sugg.map(s => (
              <button key={s} onMouseDown={() => handleSelectSuggestion(s)}
                className={`w-full text-left px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-between gap-2 border-b border-slate-100 last:border-0 transition`}>
                <div className="flex items-center gap-2 truncate">
                  <Pill className={`w-3.5 h-3.5 ${iconColor} shrink-0`} />
                  <span className="truncate">{s}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── Full Interaction Detail ────────────────────────── */
const FullInteractionDetail: React.FC<{ record: InteractionRecord; drugA: string; drugB: string }> = ({ record, drugA, drugB }) => {
  const [sections, setSections] = useState({ mechanism: true, effect: true, consequences: true, suggestions: true, monitoring: false, steps: true });
  const toggle = (k: keyof typeof sections) => setSections(p => ({ ...p, [k]: !p[k] }));
  const cfg = SEVERITY_CONFIG[record.severity];

  return (
    <div className="space-y-3 animate-fadeIn">
      {/* Result Banner */}
      <div className={`rounded-2xl border-2 ${cfg.border} ${cfg.card} p-4 flex items-start gap-4`}>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 font-black text-lg ${
          record.severity === "critical" ? "bg-rose-600 text-white" :
          record.severity === "moderate" ? "bg-amber-500 text-white" :
          record.severity === "mild"     ? "bg-blue-500 text-white" :
          "bg-emerald-500 text-white"
        }`}>
          {record.severity === "critical" ? "🚨" : record.severity === "moderate" ? "⚠️" : record.severity === "mild" ? "ℹ️" : "✅"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`text-[10px] font-black tracking-widest px-2.5 py-0.5 rounded-full ${cfg.badge}`}>{cfg.label} INTERACTION</span>
            <span className="text-[10px] text-slate-500 font-semibold">{record.type}</span>
          </div>
          <p className="font-extrabold text-slate-800 text-sm">
            <span className="text-violet-700">{drugA}</span>
            <span className="mx-2 text-slate-400">+</span>
            <span className="text-teal-700">{drugB}</span>
          </p>
          <p className={`text-xs font-semibold mt-1 leading-relaxed ${cfg.text}`}>{record.clinicalEffect}</p>
        </div>
      </div>

      {/* Collapsible Sections */}
      {[
        { key: "mechanism" as const, title: "Mechanism of Interaction", content: record.mechanism, bg: "bg-violet-50 border-violet-200", headerColor: "text-violet-700", text: "text-slate-700" },
        { key: "effect" as const, title: "Clinical Effect", content: record.clinicalEffect, bg: "bg-rose-50 border-rose-200", headerColor: "text-rose-700", text: "text-slate-700" },
      ].map(sec => (
        <div key={sec.key} className="rounded-xl border border-slate-200 overflow-hidden">
          <button onClick={() => toggle(sec.key)} className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-50 hover:bg-slate-100 transition">
            <span className={`text-[11px] font-black uppercase tracking-wider ${sec.headerColor}`}>{sec.title}</span>
            {sections[sec.key] ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>
          {sections[sec.key] && (
            <div className={`px-4 py-3 ${sec.bg} border-t border-slate-200`}>
              <p className={`text-xs leading-relaxed ${sec.text}`}>{sec.content}</p>
            </div>
          )}
        </div>
      ))}

      {/* Consequences */}
      {record.consequences.length > 0 && record.consequences[0] !== "None documented in clinical practice" && record.consequences[0] !== "No significant adverse interaction - expected dual therapy" && (
        <div className="rounded-xl border border-slate-200 overflow-hidden">
          <button onClick={() => toggle("consequences")} className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-50 hover:bg-slate-100 transition">
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-700">Potential Consequences</span>
            {sections.consequences ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>
          {sections.consequences && (
            <div className="px-4 py-3 bg-amber-50 border-t border-slate-200 space-y-2">
              {record.consequences.map((c, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-200 border border-amber-300 flex items-center justify-center text-[10px] font-black text-amber-800 shrink-0 mt-0.5">{i + 1}</span>
                  <p className="text-xs text-slate-700">{c}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Suggestions */}
      <div className="rounded-xl border border-slate-200 overflow-hidden">
        <button onClick={() => toggle("suggestions")} className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-50 hover:bg-slate-100 transition">
          <span className="text-[11px] font-black uppercase tracking-wider text-teal-700">Clinical Suggestions</span>
          {sections.suggestions ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>
        {sections.suggestions && (
          <div className="px-4 py-3 bg-teal-50 border-t border-slate-200 space-y-2">
            {record.suggestions.map((s, i) => (
              <div key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-700">{s}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Monitoring */}
      <div className="rounded-xl border border-slate-200 overflow-hidden">
        <button onClick={() => toggle("monitoring")} className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-50 hover:bg-slate-100 transition">
          <span className="text-[11px] font-black uppercase tracking-wider text-blue-700">What to Monitor</span>
          {sections.monitoring ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>
        {sections.monitoring && (
          <div className="px-4 py-3 bg-blue-50 border-t border-slate-200 space-y-1.5">
            {record.monitoring.map((m, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-blue-400 font-bold text-xs mt-0.5">→</span>
                <p className="text-xs text-slate-600">{m}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Next Steps */}
      <div className="rounded-xl border border-slate-200 overflow-hidden">
        <button onClick={() => toggle("steps")} className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-50 hover:bg-slate-100 transition">
          <span className="text-[11px] font-black uppercase tracking-wider text-amber-700">Recommended Next Steps</span>
          {sections.steps ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>
        {sections.steps && (
          <div className="px-4 py-3 space-y-2 bg-white border-t border-slate-200">
            {record.nextSteps.map((ns, i) => {
              const pc = PRIORITY_CONFIG[ns.priority];
              return (
                <div key={i} className={`flex items-start gap-3 p-2.5 rounded-xl ${pc.classes}`}>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded bg-white/60 border border-current opacity-70 shrink-0 mt-0.5">{SICON[ns.icon] ?? "ACT"}</span>
                  <div className="min-w-0">
                    <p className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-0.5">{pc.label} · {ns.who}</p>
                    <p className="text-xs font-semibold">{ns.action}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── Mini Checker (exported) ────────────────────────── */
export const DrugInteractionMiniChecker: React.FC<Props> = ({ currentMedicines }) => {
  const [mode, setMode] = useState<"two" | "one">("two");

  /* Two-medicine mode */
  const [drugA, setDrugA] = useState("");
  const [drugB, setDrugB] = useState("");
  const [twoResult, setTwoResult] = useState<{ record: InteractionRecord | null; checked: boolean; a: string; b: string } | null>(null);

  /* One-vs-regimen mode */
  const [oneDrug, setOneDrug] = useState("");
  const [oneResults, setOneResults] = useState<{ pair: string; record: InteractionRecord | null }[]>([]);
  const [oneChecked, setOneChecked] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const checkTwo = () => {
    if (!drugA.trim() || !drugB.trim()) return;
    setTwoResult({ record: lookupInteraction(drugA, drugB), checked: true, a: drugA, b: drugB });
  };

  const checkOne = () => {
    if (!oneDrug.trim()) return;
    const r = currentMedicines
      .filter(m => m.toLowerCase() !== oneDrug.toLowerCase())
      .map(m => ({ pair: m, record: lookupInteraction(oneDrug, m) }));
    setOneResults(r);
    setOneChecked(true);
    setExpanded(null);
  };

  const critOne = oneResults.filter(r => r.record?.severity === "critical").length;
  const modOne  = oneResults.filter(r => r.record?.severity === "moderate").length;
  const mildOne = oneResults.filter(r => r.record?.severity === "mild").length;
  const safeOne = oneResults.filter(r => !r.record || r.record.severity === "safe").length;

  const getBannerGrad = (crit: number, mod: number, mild: number) =>
    crit > 0 ? "from-rose-600 to-rose-700" : mod > 0 ? "from-amber-500 to-amber-600" : mild > 0 ? "from-blue-500 to-blue-600" : "from-emerald-500 to-emerald-600";

  const getBannerLabel = (crit: number, mod: number, mild: number) =>
    crit > 0 ? "CRITICAL interaction detected" : mod > 0 ? "Moderate interaction — review needed" : mild > 0 ? "Mild interaction — monitor" : "No significant interactions found";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center shrink-0">
          <FlaskConical className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-extrabold text-white text-sm tracking-tight">Live Drug Interaction Checker</h3>
          <p className="text-violet-200 text-[11px] font-medium mt-0.5">Instant interaction result with full clinical explanation</p>
        </div>
      </div>

      {/* Mode Switch Tabs */}
      <div className="flex items-center gap-1 p-3 bg-slate-50 border-b border-slate-200">
        <button
          onClick={() => setMode("two")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-extrabold transition-all ${
            mode === "two" ? "bg-white text-violet-700 shadow-sm border border-violet-100" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
          Check Any Two Medicines
        </button>
        <button
          onClick={() => setMode("one")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-extrabold transition-all ${
            mode === "one" ? "bg-white text-teal-700 shadow-sm border border-teal-100" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          Add & Check vs Regimen
        </button>
      </div>

      {/* ─── MODE: Two Medicines ─── */}
      {mode === "two" && (
        <div className="p-4 space-y-4">
          <div className="flex items-end gap-3">
            <DrugInput value={drugA} onChange={setDrugA} placeholder="e.g. Aspirin" color="violet" label="Medicine A" onEnter={drugB ? checkTwo : undefined} />
            <div className="shrink-0 pb-1">
              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
                <ArrowLeftRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>
            <DrugInput value={drugB} onChange={setDrugB} placeholder="e.g. Ibuprofen" color="teal" label="Medicine B" onEnter={drugA ? checkTwo : undefined} />
          </div>

          <button
            onClick={checkTwo}
            disabled={!drugA.trim() || !drugB.trim()}
            className="w-full py-3 bg-violet-600 hover:bg-violet-700 disabled:bg-slate-100 disabled:text-slate-400 text-white text-sm font-extrabold rounded-xl transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4" />
            Check Interaction
          </button>

          {/* Result */}
          {twoResult?.checked && (
            <div className="space-y-3">
              {twoResult.record ? (
                <FullInteractionDetail record={twoResult.record} drugA={twoResult.a} drugB={twoResult.b} />
              ) : (
                <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-5 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center shrink-0 text-xl text-white font-black">✅</div>
                  <div>
                    <p className="font-extrabold text-emerald-800 text-sm">No Known Significant Interaction</p>
                    <p className="text-xs text-emerald-700 mt-1 leading-relaxed">
                      <span className="font-bold">{twoResult.a}</span> and <span className="font-bold">{twoResult.b}</span> have no documented clinically significant interaction in our database. This does not mean the combination is entirely risk-free — always confirm with your doctor or pharmacist.
                    </p>
                  </div>
                </div>
              )}
              <p className="text-[10px] text-slate-400 leading-relaxed border-t border-slate-100 pt-2">
                Confirm all medication changes with your prescribing doctor or pharmacist before proceeding.
              </p>
            </div>
          )}

          {!twoResult?.checked && (
            <div className="py-8 text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-violet-50 border border-violet-100 flex items-center justify-center mb-3">
                <ArrowLeftRight className="w-6 h-6 text-violet-300" />
              </div>
              <p className="text-sm font-bold text-slate-400">Enter two medicine names above</p>
              <p className="text-[11px] text-slate-300 mt-1">Full interaction analysis will appear instantly</p>
            </div>
          )}
        </div>
      )}

      {/* ─── MODE: One vs Regimen ─── */}
      {mode === "one" && (
        <div className="p-4 space-y-4">
          <div>
            <div className="flex gap-2">
              <DrugInput value={oneDrug} onChange={v => { setOneDrug(v); setOneChecked(false); setOneResults([]); }} placeholder="Type a new medicine name..." color="violet" label="New Medicine to Add" onEnter={checkOne} />
              <div className="flex items-end pb-0.5">
                <button onClick={checkOne} disabled={!oneDrug.trim()} className="px-5 py-3 bg-violet-600 hover:bg-violet-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-sm font-extrabold rounded-xl transition-all shadow-sm active:scale-95">Check</button>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Checking against current medicines:</p>
              <div className="flex flex-wrap gap-1.5">
                {currentMedicines.map((m, i) => (
                  <span key={i} className="bg-slate-100 text-slate-600 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-slate-200">{m}</span>
                ))}
                {currentMedicines.length === 0 && <span className="text-xs text-slate-400 italic">No active medicines in this patient record.</span>}
              </div>
            </div>
          </div>

          {oneChecked && (
            <div className="space-y-3">
              <div className={`bg-gradient-to-r ${getBannerGrad(critOne, modOne, mildOne)} rounded-xl p-3.5 text-white flex items-center justify-between gap-3 shadow-sm`}>
                <div>
                  <p className="font-extrabold text-sm">{getBannerLabel(critOne, modOne, mildOne)}</p>
                  <p className="text-[11px] text-white/75 font-medium">{oneDrug} checked against {oneResults.length} current medicine{oneResults.length !== 1 ? "s" : ""}</p>
                </div>
                <div className="flex gap-1.5 shrink-0 flex-wrap justify-end">
                  {critOne > 0 && <span className="bg-white/20 border border-white/30 text-[10px] font-black px-2 py-0.5 rounded-full">{critOne} CRIT</span>}
                  {modOne  > 0 && <span className="bg-white/20 border border-white/30 text-[10px] font-black px-2 py-0.5 rounded-full">{modOne} MOD</span>}
                  {mildOne > 0 && <span className="bg-white/20 border border-white/30 text-[10px] font-black px-2 py-0.5 rounded-full">{mildOne} MILD</span>}
                  {safeOne > 0 && <span className="bg-white/20 border border-white/30 text-[10px] font-black px-2 py-0.5 rounded-full">{safeOne} SAFE</span>}
                </div>
              </div>

              <div className="space-y-2">
                {oneResults.map(({ pair, record }) => {
                  const sev = record?.severity ?? "safe";
                  const cfg = SEVERITY_CONFIG[sev];
                  const key = `${pair}-${oneDrug}`;
                  const isOpen = expanded === key;
                  return (
                    <div key={key} className={`border-2 ${cfg.border} rounded-xl overflow-hidden`}>
                      <button onClick={() => setExpanded(isOpen ? null : key)} className={`w-full text-left px-4 py-3 flex items-center justify-between gap-3 ${cfg.card} hover:opacity-90 transition`}>
                        <div className="flex items-center gap-3 min-w-0">
                          <span className={`text-[10px] font-black px-2.5 py-1 rounded-full shrink-0 ${cfg.badge}`}>{cfg.label}</span>
                          <p className="font-extrabold text-sm text-slate-800 truncate">
                            <span className="text-violet-700">{oneDrug}</span>
                            <span className="mx-1.5 text-slate-400">+</span>
                            <span className="text-teal-700">{pair}</span>
                          </p>
                        </div>
                        {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                      </button>
                      {isOpen && record && <div className="bg-white border-t border-slate-100 p-4"><FullInteractionDetail record={record} drugA={oneDrug} drugB={pair} /></div>}
                      {isOpen && !record && (
                        <div className="bg-emerald-50 border-t border-emerald-100 px-4 py-3 flex items-center gap-2 text-xs text-emerald-800">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          No known clinically significant interaction found in our database.
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed pt-1 border-t border-slate-100">Confirm all medication changes with your prescribing doctor or pharmacist before proceeding.</p>
            </div>
          )}

          {!oneChecked && (
            <div className="py-8 text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center mb-3">
                <Plus className="w-6 h-6 text-teal-300" />
              </div>
              <p className="text-sm font-bold text-slate-400">Type a medicine name above</p>
              <p className="text-[11px] text-slate-300 mt-1">Interactions against current regimen appear instantly</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DrugInteractionMiniChecker;