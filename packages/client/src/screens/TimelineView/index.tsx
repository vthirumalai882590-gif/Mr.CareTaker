import React, { useState } from 'react';
import { Calendar, Download, Volume2, Play, CheckCircle2, Globe } from 'lucide-react';
import { DisclaimerBanner } from '../../components/DisclaimerBanner';
import { SUPPORTED_LANGUAGES, TRANSLATIONS, LanguageCode } from '../../translations';

interface Props {
  data?: any;
}

export const TimelineViewScreen: React.FC<Props> = ({ data }) => {
  const [selectedLang, setSelectedLang] = useState<LanguageCode>('en');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const t = TRANSLATIONS[selectedLang] || TRANSLATIONS.en;

  const steps = [
    { day: 1, date: 'Jul 26, 2026', title: 'Start Prescribed Medication Regimen', desc: 'Begin Amlodipine 5mg OD (morning) & Metformin 500mg BD (with meals)', type: 'medicine' },
    { day: 3, date: 'Jul 28, 2026', title: 'Stop Ibuprofen Course', desc: 'Complete 3-day short course for pain. Continue Pantoprazole stomach protector.', type: 'medicine' },
    { day: 7, date: 'Aug 01, 2026', title: 'Refill Warning Check', desc: 'Check stock levels for Metformin & Amlodipine. 3 days remaining.', type: 'warning' },
    { day: 15, date: 'Aug 09, 2026', title: 'Follow-up Consultation', desc: 'Dr. A. Mehta (Cardiology) at Apollo Hospital, Bengaluru', type: 'followup' },
  ];

  const handlePlayVoiceNote = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(t.voiceSummaryText);
      const langOption = SUPPORTED_LANGUAGES.find(l => l.code === selectedLang);
      if (langOption) utterance.lang = langOption.script;
      setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Speech synthesis audio note: ' + t.voiceSummaryText);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-1">
            <Calendar className="w-4 h-4" />
            <span>Section 3.3 & 3.5 Visual Timeline & Translation</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Visual Care Timeline & Translation</h1>
          <p className="text-sm text-slate-500 mt-1">
            Plain-language translation & visual milestones ("Day 3 stop antibiotic", "Day 15 follow-up").
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Language Selector */}
          <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
            <Globe className="w-4 h-4 text-slate-500 ml-1" />
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value as LanguageCode)}
              className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer pr-1"
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.flag} {l.nativeName} ({l.name})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handlePlayVoiceNote}
            className={`font-bold text-xs px-4 py-2.5 rounded-xl shadow transition flex items-center gap-2 ${
              isPlayingAudio ? 'bg-rose-500 text-white animate-pulse' : 'bg-accent text-slate-950 hover:bg-amber-500'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>{isPlayingAudio ? 'Playing Voice Note...' : t.voiceReadout}</span>
          </button>

          <a
            href="/api/cases/case-001/timeline-svg"
            download="SpashtCare_Timeline.svg"
            className="bg-primary hover:bg-primary-dark text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow transition flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Export SVG Timeline</span>
          </a>
        </div>
      </div>

      <DisclaimerBanner />

      {/* Horizontal Scrollable Timeline on Mobile / Stepper View */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
        <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Discharge & Care Milestones ({SUPPORTED_LANGUAGES.find(l => l.code === selectedLang)?.nativeName})
        </h2>

        {/* Mobile Horizontal Scroll Bar */}
        <div className="flex overflow-x-auto gap-4 pb-4 md:grid md:grid-cols-4 no-scrollbar">
          {steps.map((s, idx) => (
            <div
              key={idx}
              className="min-w-[240px] flex-1 bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 shadow-sm relative flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-full bg-primary text-white font-bold text-xs flex items-center justify-center shadow">
                  D{s.day}
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">{s.date}</span>
              </div>

              <div>
                <h3 className="font-extrabold text-sm text-slate-900 leading-snug">{s.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-1">{s.desc}</p>
              </div>

              <div className="pt-2 border-t border-slate-200/60 text-[11px] font-bold text-primary flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                <span>Day {s.day} Milestone</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

