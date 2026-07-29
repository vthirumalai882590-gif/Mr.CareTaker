import React, { useState, useEffect } from 'react';
import { Volume2, CheckCircle2, XCircle, HeartPulse, PhoneCall, AlertCircle, Calendar, Flame, ShieldAlert, Sparkles, Globe } from 'lucide-react';
import { DisclaimerBanner } from '../../components/DisclaimerBanner';
import { SUPPORTED_LANGUAGES, TRANSLATIONS, LanguageCode } from '../../translations';

interface Props {
  data?: any;
}

export const PatientSimpleModeScreen: React.FC<Props> = ({ data }) => {
  const patientName = data?.patient?.name || 'Ramesh Kumar';
  const patientAge = data?.patient?.age || 72;
  const caregiverName = data?.caregivers?.[0]?.name || data?.patient?.emergency_contact?.name || 'Family Caregiver';
  const caregiverPhone = data?.caregivers?.[0]?.phone_number || data?.patient?.emergency_contact?.phone || '+91 98765 00001';

  const [selectedLang, setSelectedLang] = useState<LanguageCode>('hi');
  const [reportedSideEffect, setReportedSideEffect] = useState<boolean>(false);
  const [sosTriggered, setSosTriggered] = useState<boolean>(false);

  const t = TRANSLATIONS[selectedLang] || TRANSLATIONS.hi;

  const defaultMeds = [
    {
      id: 'm1',
      name: 'Amlodipine 5mg',
      translatedName: 'एम्लोडिपाइन 5 मिलीग्राम',
      time: 'Morning (8:00 AM)',
      mealTiming: t.afterFood,
      pillColor: 'bg-amber-100 border-amber-400 text-amber-900',
      pillShape: '🟡 Round Yellow Tablet',
      doctor: 'Dr. A. Mehta',
      status: 'done',
      icon: '☀️'
    },
    {
      id: 'm2',
      name: 'Metformin 500mg',
      translatedName: 'मेटफॉर्मिन 500 मिलीग्राम',
      time: 'Afternoon (1:30 PM)',
      mealTiming: t.withFood,
      pillColor: 'bg-blue-100 border-blue-400 text-blue-900',
      pillShape: '⚪ White Oblong Tablet',
      doctor: 'Dr. A. Mehta',
      status: 'pending',
      icon: '🌤️'
    }
  ];

  const getMappedMeds = () => data?.medicines?.map((m: any, idx: number) => ({
    id: m.medicine_id || `m-${idx}`,
    name: `${m.name} ${m.dosage || ''}`,
    translatedName: `${m.name} ${m.dosage || ''}`,
    time: m.frequency || 'Daily',
    mealTiming: idx % 2 === 0 ? t.afterFood : t.withFood,
    pillColor: idx % 3 === 0 ? 'bg-amber-100 border-amber-400 text-amber-900' : idx % 3 === 1 ? 'bg-blue-100 border-blue-400 text-blue-900' : 'bg-emerald-100 border-emerald-400 text-emerald-900',
    pillShape: idx % 2 === 0 ? '🟡 Round Tablet' : '⚪ Capsule',
    doctor: m.doctor_name || 'Dr. Primary Practitioner',
    status: idx === 0 ? 'done' : 'pending',
    icon: idx % 2 === 0 ? '☀️' : '🌙'
  })) || defaultMeds;

  const [meds, setMeds] = useState(getMappedMeds);

  useEffect(() => {
    setMeds(getMappedMeds());
  }, [data]);

  const toggleStatus = (id: string, status: 'done' | 'missed') => {
    setMeds((prev: any[]) => prev.map((m: any) => m.id === id ? { ...m, status } : m));
  };

  const playVoice = () => {
    const langObj = SUPPORTED_LANGUAGES.find(l => l.code === selectedLang);
    const customVoiceText = `Hello ${patientName}. Today you have ${meds.length} scheduled doses. Please follow instructions from your doctor ${meds[0]?.doctor || ''}.`;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(customVoiceText);
      u.lang = langObj?.script || 'hi-IN';
      u.rate = 0.9;
      window.speechSynthesis.speak(u);
    } else {
      alert(`Voice Summary (${langObj?.name}): ${customVoiceText}`);
    }
  };

  const triggerSOS = () => {
    setSosTriggered(true);
    alert(`🚨 Emergency SOS Triggered for ${patientName}!\nCalling Caregiver: ${caregiverName} (${caregiverPhone})\nLocation and active medication list sent via SMS/WhatsApp.`);
  };

  const reportDizziness = () => {
    setReportedSideEffect(true);
    alert(`⚠️ Side-effect Alert Reported for ${patientName}: Caregiver ${caregiverName} notified.`);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      {/* Top Banner: Language Selector & Mode Header */}
      <div className="bg-gradient-to-r from-teal-900 via-brand-teal to-emerald-800 text-white p-6 md:p-8 rounded-3xl shadow-xl border border-teal-700 relative overflow-hidden">
        {/* Subtle Background Glow Accent */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                {t.patientModeTitle}
              </span>
              <span className="bg-white/10 text-emerald-200 text-xs font-semibold px-3 py-1 rounded-full border border-white/15">
                {patientName} ({patientAge} yrs)
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              {t.todaysMedicines}
            </h1>
            <p className="text-sm text-emerald-100/90 mt-1 font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-300" />
              <span>{t.doctorVisitCountdown}</span>
            </p>
          </div>

          {/* Regional Language Switcher Dropdown */}
          <div className="flex flex-col gap-2 items-start md:items-end">
            <label className="text-xs font-bold text-emerald-200 uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-amber-300" />
              <span>Select Patient Language:</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setSelectedLang(lang.code)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all shadow-sm ${
                    selectedLang === lang.code
                      ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300 scale-105'
                      : 'bg-white/15 text-white hover:bg-white/25 border border-white/20'
                  }`}
                >
                  <span>{lang.flag}</span> <span className="ml-1">{lang.nativeName}</span>
                </button>
              ))}
            </div>

            {/* Voice Readout Button */}
            <button
              onClick={playVoice}
              className="mt-2 w-full md:w-auto bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold px-5 py-3 rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              <Volume2 className="w-6 h-6 text-slate-950 animate-pulse" />
              <span className="text-sm">{t.voiceReadout}</span>
            </button>
          </div>
        </div>
      </div>

      <DisclaimerBanner />

      {/* Patient Feature Bar 1: Streak Counter & Emergency SOS Call */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Streak Celebration Card */}
        <div className="md:col-span-6 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-300/80 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-md">
              <Flame className="w-7 h-7" />
            </div>
            <div>
              <span className="font-extrabold text-slate-900 text-base block">{t.streakTitle}</span>
              <span className="text-xs text-amber-800 font-medium">Auto-escalations sent to caregiver {caregiverName}</span>
            </div>
          </div>
          <span className="text-2xl font-black text-amber-600 font-mono">5 🔥</span>
        </div>

        {/* Emergency SOS Button */}
        <div className="md:col-span-6">
          <button
            onClick={triggerSOS}
            className={`w-full h-full p-5 rounded-2xl border-2 font-black text-base flex items-center justify-between shadow-md transition-all ${
              sosTriggered
                ? 'bg-rose-700 text-white border-rose-800 ring-4 ring-rose-300'
                : 'bg-rose-600 hover:bg-rose-700 text-white border-rose-500'
            }`}
          >
            <div className="flex items-center gap-3">
              <PhoneCall className="w-7 h-7 text-white animate-bounce" />
              <span className="text-left">{t.sosButton}</span>
            </div>
            <span className="text-xs font-mono font-bold bg-white/20 px-3 py-1 rounded-full text-white">
              {sosTriggered ? 'CALLING…' : '1-TAP CALL'}
            </span>
          </button>
        </div>
      </div>

      {/* Big Button Medicine Cards List */}
      <div className="space-y-4">
        <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-brand-teal" />
          <span>Scheduled Doses for Today</span>
        </h2>

        {meds.map((m: any) => (
          <div
            key={m.id}
            className={`p-6 rounded-3xl border-2 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 transition-all ${
              m.status === 'done'
                ? 'bg-emerald-50/80 border-emerald-400 shadow-emerald-100'
                : m.status === 'missed'
                ? 'bg-rose-50/80 border-rose-400 shadow-rose-100'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            {/* Left: Icon, Medicine Name, Pill Visual Shape, Timing */}
            <div className="flex items-start gap-4">
              <span className="text-4xl p-2 bg-slate-100 rounded-2xl shadow-inner">{m.icon}</span>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-2xl font-extrabold text-slate-900 leading-tight">{m.name}</span>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border">
                    {m.pillShape}
                  </span>
                </div>

                <p className="text-base font-bold text-brand-teal">{m.time}</p>

                {/* Meal & Time Instructions */}
                <div className="flex items-center gap-2 flex-wrap text-xs font-bold text-slate-700">
                  <span className="bg-amber-100 text-amber-900 px-3 py-1 rounded-xl border border-amber-200">
                    {m.mealTiming}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-500 font-mono">{m.doctor}</span>
                </div>
              </div>
            </div>

            {/* Right: Huge Action Buttons for Elderly Legibility & Easy Taps */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleStatus(m.id, 'done')}
                className={`flex-1 lg:flex-none px-7 py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2 shadow-md transition-all ${
                  m.status === 'done'
                    ? 'bg-emerald-600 text-white ring-4 ring-emerald-200 scale-105'
                    : 'bg-slate-100 hover:bg-emerald-100 text-slate-800 border border-slate-300'
                }`}
              >
                <CheckCircle2 className="w-7 h-7" />
                <span>{t.taken}</span>
              </button>

              <button
                onClick={() => toggleStatus(m.id, 'missed')}
                className={`flex-1 lg:flex-none px-7 py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2 shadow-md transition-all ${
                  m.status === 'missed'
                    ? 'bg-rose-600 text-white ring-4 ring-rose-200 scale-105'
                    : 'bg-slate-100 hover:bg-rose-100 text-slate-800 border border-slate-300'
                }`}
              >
                <XCircle className="w-7 h-7" />
                <span>{t.missed}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Patient Feature Bar 2: Quick Side-Effect / Discomfort Reporter */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0" />
          <span className="text-sm font-bold text-slate-800">{t.sideEffectReport}</span>
        </div>
        <button
          onClick={reportDizziness}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition shadow-sm ${
            reportedSideEffect
              ? 'bg-emerald-600 text-white'
              : 'bg-amber-500 hover:bg-amber-600 text-slate-950'
          }`}
        >
          {reportedSideEffect ? `✓ ${t.reportDizziness}` : '⚠️ Report Dizziness to Caregiver'}
        </button>
      </div>
    </div>
  );
};
