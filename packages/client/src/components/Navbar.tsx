import React, { useState, useRef, useEffect } from 'react';
import {
  Activity, MessageSquare, History, ShieldAlert, Calendar, HeartPulse, CreditCard,
  Pill, Settings as SettingsIcon, UserCheck, CheckCircle, FileText, ChevronRight, Menu, X, Search, User, FlaskConical, Stethoscope
} from 'lucide-react';
import { Patient } from '../types';
import { ThemeSelectorDropdown } from './ThemeSelector';
import { useTheme } from '../context/ThemeContext';

export type ActiveTab =
  | 'whatsapp'
  | 'overview'
  | 'replay'
  | 'receipt'
  | 'history'
  | 'safety'
  | 'timeline'
  | 'adherence'
  | 'emergency'
  | 'generics'
  | 'governance'
  | 'digest'
  | 'settings'
  | 'patient'
  | 'interactions'
  | 'predictive_risk';

interface Props {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isPatientMode: boolean;
  setIsPatientMode: (val: boolean) => void;
  openSafetyCount: number;
  onOpenAddPatient: () => void;
  onOpenManagePatients?: () => void;
  onOpenAIChat?: () => void;
  patientsList?: Patient[];
  selectedPatientId?: string;
  onSelectPatient?: (patientId: string) => void;
  isSidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  isPatientMode,
  setIsPatientMode,
  openSafetyCount,
  onOpenAddPatient,
  onOpenManagePatients,
  onOpenAIChat,
  patientsList,
  selectedPatientId,
  onSelectPatient,
  isSidebarCollapsed = false,
  onToggleSidebar,
}) => {
  const { config } = useTheme();

  return (
    <header className={`${config.headerBg} ${config.headerText} sticky top-0 z-50 shadow-md border-b border-white/10 py-2 px-3 sm:px-6 transition-colors duration-300`}>
      <div className="w-full max-w-[1600px] mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
          {/* Sidebar Toggle & Logo */}
          <div className="flex items-center gap-3 shrink-0">
            {!isPatientMode && onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                title="Toggle Sidebar Navigation"
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition flex items-center justify-center border border-white/20"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('overview')}>
              <div className="w-9 h-9 rounded-2xl bg-white/15 flex items-center justify-center font-black text-base border border-white/20 text-white shadow-inner">
                MC
              </div>
              <div className="leading-tight">
                <span className="font-extrabold text-lg tracking-tight block text-white">Mr.CareTaker</span>
                <span className="text-[9px] text-emerald-200 font-bold tracking-wider uppercase block">CARE CONTINUITY ASSISTANT</span>
              </div>
            </div>
          </div>

          {/* Patient Search Bar & Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap lg:flex-nowrap">
            {/* Patient Search Input */}
            {patientsList && patientsList.length > 0 && (
              <PatientSearchBar
                patientsList={patientsList}
                selectedPatientId={selectedPatientId}
                onSelectPatient={onSelectPatient}
              />
            )}

            {/* AI Action Cluster */}
            <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
              <button
                onClick={onOpenAIChat}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 shadow-md transition transform hover:scale-105 active:scale-95 shrink-0"
              >
                <span>✨ Ask AI Assistant</span>
              </button>

              <button
                onClick={() => onOpenAIChat && onOpenAIChat()}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-extrabold bg-emerald-500/25 hover:bg-emerald-500/40 text-emerald-200 border border-emerald-400/40 shadow-xs transition shrink-0"
              >
                <span>⚡ Vitals</span>
              </button>

              <button
                onClick={() => onOpenAIChat && onOpenAIChat()}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-extrabold bg-teal-500/25 hover:bg-teal-500/40 text-teal-200 border border-teal-400/40 shadow-xs transition shrink-0"
              >
                <span>🌿 Ayush</span>
              </button>
            </div>

            {/* Theme Selector, Unified Patient Management & Mode Switch */}
            <div className="flex items-center gap-1.5 shrink-0">
              <ThemeSelectorDropdown />

              {/* Single Unified Patient Management Button */}
              <button
                onClick={onOpenManagePatients || onOpenAddPatient}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-white/15 hover:bg-white/25 text-white border border-white/20 shadow-sm transition shrink-0 active:scale-95"
                title="Add New Patient with Full History or Delete Patient Records"
              >
                <span>⚙️ Manage Patients</span>
              </button>

              <button
                onClick={() => {
                  const next = !isPatientMode;
                  setIsPatientMode(next);
                  if (next) setActiveTab('patient');
                  else setActiveTab('overview');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                  isPatientMode
                    ? 'bg-amber-400 text-slate-950 shadow-md ring-2 ring-amber-300'
                    : 'bg-white/15 text-white hover:bg-white/25 border border-white/20'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>{isPatientMode ? 'Patient Mode ON' : 'Patient Mode'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export const LeftSidebarNav: React.FC<{
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  openSafetyCount: number;
  selectedPatientId?: string;
  patientsList?: Patient[];
  isCollapsed?: boolean;
}> = ({ activeTab, setActiveTab, openSafetyCount, selectedPatientId, patientsList, isCollapsed = false }) => {
  const { config } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const effectiveCollapsed = isCollapsed && !isHovered;

  const activePatient = patientsList?.find(p => p.patient_id === selectedPatientId) || patientsList?.[0] || {
    name: 'Ramesh Kumar',
    age: 72,
    blood_group: 'B+',
    primary_conditions: ['Hypertension', 'Diabetes']
  };

  const navGroups = [
    {
      title: '⚡ CARE CONTINUITY',
      items: [
        { id: 'whatsapp', label: 'WhatsApp Bot', icon: MessageSquare, badgeText: 'LIVE' },
        { id: 'overview', label: 'Case Overview', icon: Activity },
        { id: 'replay', label: 'Extraction Replay ★', icon: Activity, highlight: true },
        { id: 'receipt', label: 'Trust Receipt', icon: CheckCircle },
      ]
    },
    {
      title: '🩺 CLINICAL & SAFETY',
      items: [
        { id: 'predictive_risk', label: 'Future Risk Predictor', icon: Stethoscope, badgeText: 'AI 4.0' },
        { id: 'history', label: 'Medication History', icon: History },
        { id: 'safety', label: 'Safety Flags', icon: ShieldAlert, alertBadge: openSafetyCount > 0 ? openSafetyCount : null },
        { id: 'interactions', label: 'Drug Interactions', icon: FlaskConical, badgeText: 'NEW' },
        { id: 'timeline', label: 'Visual Timeline', icon: Calendar },
        { id: 'adherence', label: 'Adherence Tracker', icon: HeartPulse },
      ]
    },
    {
      title: '🏥 CARE MANAGEMENT',
      items: [
        { id: 'emergency', label: 'Emergency Card', icon: CreditCard },
        { id: 'generics', label: 'Jan Aushadhi Generics', icon: Pill },
        { id: 'governance', label: 'Governance & Access', icon: UserCheck },
        { id: 'digest', label: 'Weekly Digest', icon: FileText },
        { id: 'settings', label: 'Settings', icon: SettingsIcon },
      ]
    }
  ];

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`${config.sidebarBg} ${config.sidebarText} border-r border-slate-200 dark:border-slate-800 h-full p-3 flex flex-col justify-between shrink-0 shadow-lg overflow-y-auto hidden md:flex select-none transition-all ${
        effectiveCollapsed ? 'w-20 duration-500 delay-150 ease-in-out' : 'w-72 duration-300 ease-out'
      }`}
    >
      <div className="space-y-5">
        {/* Patient Quick Summary Widget */}
        {!effectiveCollapsed ? (
          <div className="bg-gradient-to-r from-teal-50 to-emerald-50/60 border border-teal-200/80 p-3.5 rounded-2xl flex items-center gap-3 shadow-sm">
            <div className="w-11 h-11 rounded-2xl bg-brand-teal text-white font-extrabold flex items-center justify-center text-sm shadow-md shrink-0">
              {activePatient.name.split(' ').map((n: string) => n[0]).join('')}
            </div>
            <div className="overflow-hidden">
              <div className="flex items-center gap-2">
                <h4 className="font-extrabold text-sm text-slate-900 truncate">{activePatient.name}</h4>
                <span className="bg-brand-teal text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full shadow-xs shrink-0">
                  {activePatient.blood_group || 'B+'}
                </span>
              </div>
              <p className="text-[11px] text-teal-800 font-bold truncate mt-0.5">
                {activePatient.age} yrs • {activePatient.primary_conditions?.[0] || 'Care Active'}
              </p>
            </div>
          </div>
        ) : (
          <div className="w-12 h-12 mx-auto rounded-2xl bg-brand-teal text-white font-extrabold flex items-center justify-center text-sm shadow-md" title={`${activePatient.name} (${activePatient.blood_group})`}>
            {activePatient.name.split(' ').map((n: string) => n[0]).join('')}
          </div>
        )}

        {/* Navigation Categories */}
        {navGroups.map((group, idx) => (
          <div key={idx} className="space-y-1.5">
            {!effectiveCollapsed && (
              <span className="text-[10px] font-black tracking-widest text-teal-800 uppercase px-3 block">
                {group.title}
              </span>
            )}
            <div className="space-y-1">
              {group.items.map((item: any) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as ActiveTab)}
                    title={effectiveCollapsed ? item.label : undefined}
                    className={`w-full flex items-center ${effectiveCollapsed ? 'justify-center p-2.5' : 'justify-between px-3.5 py-2.5'} rounded-xl font-extrabold text-xs transition-all border ${
                      isActive
                        ? 'bg-brand-teal text-white border-l-4 border-l-teal-900 border-teal-600 shadow-md'
                        : item.highlight
                        ? 'bg-amber-100/90 text-amber-900 hover:bg-amber-200/90 border-amber-300 shadow-xs'
                        : 'text-slate-700 hover:bg-slate-200/70 hover:text-brand-teal border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-600'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      {!effectiveCollapsed && <span className="tracking-tight">{item.label}</span>}
                    </div>

                    {!effectiveCollapsed && (
                      <div className="flex items-center gap-1.5">
                        {item.badgeText && (
                          <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border tracking-wider ${
                            isActive ? 'bg-white/20 text-white border-white/30' : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          }`}>
                            {item.badgeText}
                          </span>
                        )}
                        {item.alertBadge && (
                          <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-rose-500 text-white shadow-sm">
                            {item.alertBadge}
                          </span>
                        )}
                        {isActive && !item.alertBadge && (
                          <ChevronRight className="w-4 h-4 text-emerald-200" />
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Professional Footer Status Widget */}
      {!effectiveCollapsed ? (
        <div className="bg-white border border-slate-200 p-3 rounded-2xl text-[11px] text-slate-600 space-y-1 mt-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
              AI Clinical Engine
            </span>
            <span className="text-[10px] font-mono text-emerald-700 font-extrabold">ONLINE</span>
          </div>
          <p className="text-[10px] text-slate-500 font-medium">Groq Llama 3.3 70B & Gemini Flash</p>
        </div>
      ) : (
        <div className="w-3 h-3 mx-auto rounded-full bg-emerald-500 animate-ping" title="AI Engine Online" />
      )}
    </aside>
  );
};

export const PatientSearchBar: React.FC<{
  patientsList: Patient[];
  selectedPatientId?: string;
  onSelectPatient?: (patientId: string) => void;
}> = ({ patientsList, selectedPatientId, onSelectPatient }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activePatient = patientsList.find(p => p.patient_id === selectedPatientId) || patientsList[0];

  const filteredPatients = patientsList.filter(p => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return (
      p.name.toLowerCase().includes(term) ||
      (p.blood_group || '').toLowerCase().includes(term) ||
      String(p.age).includes(term) ||
      p.primary_conditions?.some(c => c.toLowerCase().includes(term))
    );
  });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative z-50">
      <div className="flex items-center gap-2 bg-white/15 border border-white/25 hover:border-white/40 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/40 px-3.5 py-1.5 rounded-full text-xs text-white transition-all shadow-sm w-48 sm:w-64">
        <Search className="w-3.5 h-3.5 text-emerald-200 shrink-0" />
        <input
          type="text"
          value={searchTerm}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          placeholder={`Search patient (${activePatient?.name || 'Ramesh Kumar'})...`}
          className="bg-transparent text-white font-bold placeholder-emerald-200/70 outline-none w-full text-xs"
        />
        {searchTerm && (
          <button onClick={() => setSearchTerm('')} className="text-emerald-200 hover:text-white font-bold">
            ×
          </button>
        )}
      </div>

      {/* Auto-Complete Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 sm:w-80 bg-slate-900 border border-slate-700 text-slate-100 rounded-2xl shadow-2xl p-2 space-y-1 overflow-hidden z-50">
          <div className="px-3 py-1.5 text-[10px] font-black uppercase text-amber-300 tracking-wider border-b border-slate-800 flex justify-between items-center">
            <span>Patient Search Results ({filteredPatients.length})</span>
            <span className="text-slate-400 font-normal">Click to switch</span>
          </div>

          <div className="max-h-60 overflow-y-auto divide-y divide-slate-800/60">
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => {
                const isSelected = patient.patient_id === selectedPatientId;
                return (
                  <div
                    key={patient.patient_id}
                    onClick={() => {
                      if (onSelectPatient) onSelectPatient(patient.patient_id);
                      setIsOpen(false);
                    }}
                    className={`p-2.5 rounded-xl cursor-pointer transition flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-brand-teal text-white font-extrabold shadow-sm'
                        : 'hover:bg-slate-800 text-slate-200 font-semibold'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                        isSelected ? 'bg-white text-brand-teal' : 'bg-slate-800 text-amber-400 border border-slate-700'
                      }`}>
                        {patient.name[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold">{patient.name}</span>
                          <span className="bg-emerald-500/20 text-emerald-300 text-[9px] px-1.5 py-0.2 rounded font-black border border-emerald-500/30">
                            {patient.blood_group}
                          </span>
                        </div>
                        <span className="text-[10px] opacity-75 block">
                          {patient.age} yrs • {patient.primary_conditions?.[0] || 'Care Active'}
                        </span>
                      </div>
                    </div>

                    {isSelected && (
                      <span className="text-[10px] font-black uppercase bg-emerald-400 text-slate-950 px-2 py-0.5 rounded-full shadow-xs">
                        ACTIVE
                      </span>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="p-4 text-center text-xs text-slate-400">
                No matching patients found for "{searchTerm}".
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

