import React, { useState } from 'react';
import { Settings as SettingsIcon, ShieldCheck, Trash2, Globe, Bell, Lock, Palette, Check } from 'lucide-react';
import { DisclaimerBanner } from '../../components/DisclaimerBanner';
import { useTheme, THEMES, ThemeName } from '../../context/ThemeContext';

interface Props {
  data?: any;
}

export const SettingsScreen: React.FC<Props> = ({ data }) => {
  const { theme, setTheme, config } = useTheme();
  const [consentGranted, setConsentGranted] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteData = async () => {
    if (!confirm('Are you sure you want to delete all personal health data under India\'s DPDP Act? This action cannot be undone.')) {
      return;
    }
    setDeleting(true);
    try {
      const res = await fetch('/api/consent/delete-data', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ case_id: 'case-001' })
      });
      const resData = await res.json();
      alert(resData.message || 'All patient data deleted.');
      setConsentGranted(false);
    } catch (e: any) {
      alert('Delete failed: ' + e.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 text-brand-teal font-bold text-xs uppercase tracking-wider mb-1">
          <SettingsIcon className="w-4 h-4" />
          <span>App Preferences & Governance</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Settings & Theme Customization</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Personalize your app look and feel across 5 curated themes, and manage DPDP data compliance.
        </p>
      </div>

      <DisclaimerBanner />

      {/* Theme Selector Section */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Palette className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            UI Theme & Palette Switcher
          </h2>
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500">Active: {config.name}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.values(THEMES).map((t) => {
            const isSelected = t.id === theme;
            return (
              <button
                key={t.id}
                onClick={() => setTheme(t.id as ThemeName)}
                className={`p-4 rounded-2xl border-2 text-left transition-all relative overflow-hidden flex flex-col justify-between h-36 ${
                  isSelected
                    ? 'border-teal-500 dark:border-teal-400 ring-2 ring-teal-500/20 bg-teal-50/30 dark:bg-slate-800 shadow-md'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50'
                }`}
              >
                {/* Theme Header Mini Bar Preview */}
                <div className="w-full h-7 rounded-lg overflow-hidden flex items-center justify-between px-3 text-xs font-extrabold shadow-inner" style={{ background: t.id === 'teal' ? '#2F6F5E' : t.id === 'dark' ? '#0F172A' : t.id === 'blue' ? '#1E3A8A' : t.id === 'violet' ? '#4C1D95' : '#92400E', color: '#FFF' }}>
                  <span>{t.icon} {t.name.split(' ')[0]}</span>
                  {t.isDark && <span className="bg-white/20 text-[9px] px-1.5 py-0.2 rounded font-mono">DARK</span>}
                </div>

                <div>
                  <h3 className="font-bold text-xs text-slate-900 dark:text-slate-100 mt-2">{t.name}</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{t.description}</p>
                </div>

                {isSelected && (
                  <div className="absolute top-2 right-2 bg-teal-500 text-white rounded-full p-1 shadow-sm">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Consent & Data Privacy Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
        <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-brand-teal" />
          Consent Status & Spoken Consent Log
        </h2>

        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 flex items-center justify-between">
          <div>
            <span className="font-bold text-sm text-emerald-950 block">Spoken Language Consent Captured</span>
            <span className="text-xs text-emerald-800">Captured in Hindi (hi) • Timestamp: 2026-07-19T11:20:00Z</span>
          </div>
          <span className="bg-emerald-600 text-white font-bold text-xs px-3 py-1 rounded-full">
            {consentGranted ? 'Consent ACTIVE' : 'REVOKED'}
          </span>
        </div>
      </div>

      {/* DPDP Act Explainer */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
        <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
          <Lock className="w-5 h-5 text-blue-600" />
          India DPDP Act Compliance & Data Rights
        </h2>
        <div className="text-xs text-slate-600 space-y-2 leading-relaxed font-sans">
          <p>
            Under the Digital Personal Data Protection (DPDP) Act 2023:
          </p>
          <ul className="list-disc list-inside space-y-1 font-medium text-slate-700">
            <li>Your prescription photos and extraction logs are stored securely in encrypted storage.</li>
            <li>Data is accessible strictly by patient ({data?.patient?.name || 'Patient Owner'}) and linked caregiver ({data?.caregivers?.[0]?.name || 'Linked Caregiver'}).</li>
            <li>No data is used for diagnostic purposes or sold to third parties.</li>
            <li>You hold the right to erase all your records at any time with a single tap below.</li>
          </ul>
        </div>

        <button
          onClick={handleDeleteData}
          disabled={deleting}
          className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow transition flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          <span>{deleting ? 'Deleting Data...' : 'Delete My Data (DPDP One-Tap Erasure)'}</span>
        </button>
      </div>
    </div>
  );
};
