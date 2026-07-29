import React, { useState, useRef, useEffect } from 'react';
import { Send, CheckCheck, Play, Pause, Volume2, Phone, Video, Search, MoreVertical, ShieldCheck, Sparkles, AlertTriangle, Paperclip, Mic, ArrowRight, MessageSquare, Plus, Smile, Camera, Check, CheckCircle2, Sun, Moon, Palette, UserPlus, X, Stethoscope } from 'lucide-react';
import { ConfidenceBadge } from '../../components/ConfidenceBadge';
import { DisclaimerBanner } from '../../components/DisclaimerBanner';
import { SUPPORTED_LANGUAGES, TRANSLATIONS, LanguageCode } from '../../translations';
import { PatientCaseFullData } from '../../patientDataMap';

interface Props {
  onOpenDashboard: (screen: string) => void;
  data?: PatientCaseFullData;
}

export interface Message {
  id: string;
  sender: 'bot' | 'user';
  text?: string;
  image?: string;
  voiceNote?: { transcript: string; duration: string; langCode?: string };
  quickReplies?: Array<{ id: string; label: string; action: string }>;
  structuredOutput?: any;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
}

export interface ChatContact {
  id: string;
  name: string;
  role: 'bot' | 'doctor' | 'caregiver' | 'pharmacy';
  subtitle: string;
  avatar: string;
  avatarBg: string;
  phone?: string;
  lastMsgTime: string;
  isVerified?: boolean;
  messages: Message[];
}

export type ThemePreset = 'warm_beige' | 'dark_oled' | 'mint_green' | 'sky_blue' | 'lavender';

export interface ThemeConfig {
  id: ThemePreset;
  name: string;
  icon: string;
  chatBg: string;
  headerBg: string;
  headerText: string;
  sidebarBg: string;
  sidebarText: string;
  sidebarSubtext: string;
  sidebarActiveBg: string;
  incomingBubble: string;
  incomingText: string;
  outgoingBubble: string;
  outgoingText: string;
  inputBg: string;
  inputText: string;
  accentGreen: string;
}

export const THEME_CONFIGS: Record<ThemePreset, ThemeConfig> = {
  warm_beige: {
    id: 'warm_beige',
    name: 'Warm Beige Doodle (Original)',
    icon: '🎨',
    chatBg: '#efeae2',
    headerBg: '#008069',
    headerText: '#ffffff',
    sidebarBg: '#ffffff',
    sidebarText: '#111b21',
    sidebarSubtext: '#475569',
    sidebarActiveBg: '#f1f5f9',
    incomingBubble: '#ffffff',
    incomingText: '#111b21',
    outgoingBubble: '#dcf8c6',
    outgoingText: '#111b21',
    inputBg: '#ffffff',
    inputText: '#111b21',
    accentGreen: '#008069'
  },
  dark_oled: {
    id: 'dark_oled',
    name: 'WhatsApp Dark OLED',
    icon: '🌙',
    chatBg: '#0b141a',
    headerBg: '#202c33',
    headerText: '#e9edef',
    sidebarBg: '#111b21',
    sidebarText: '#e9edef',
    sidebarSubtext: '#8696a0',
    sidebarActiveBg: '#2a3942',
    incomingBubble: '#202c33',
    incomingText: '#e9edef',
    outgoingBubble: '#005c4b',
    outgoingText: '#e9edef',
    inputBg: '#2a3942',
    inputText: '#e9edef',
    accentGreen: '#00a884'
  },
  mint_green: {
    id: 'mint_green',
    name: 'Mint Herbal Green',
    icon: '🌿',
    chatBg: '#e8f5e9',
    headerBg: '#1b5e20',
    headerText: '#ffffff',
    sidebarBg: '#ffffff',
    sidebarText: '#0f3811',
    sidebarSubtext: '#2e7d32',
    sidebarActiveBg: '#dcfce7',
    incomingBubble: '#ffffff',
    incomingText: '#1b5e20',
    outgoingBubble: '#c8e6c9',
    outgoingText: '#0f3811',
    inputBg: '#ffffff',
    inputText: '#1b5e20',
    accentGreen: '#2e7d32'
  },
  sky_blue: {
    id: 'sky_blue',
    name: 'Clinical Sky Blue',
    icon: '💙',
    chatBg: '#e1f5fe',
    headerBg: '#0277bd',
    headerText: '#ffffff',
    sidebarBg: '#ffffff',
    sidebarText: '#01579b',
    sidebarSubtext: '#0288d1',
    sidebarActiveBg: '#e0f2fe',
    incomingBubble: '#ffffff',
    incomingText: '#01579b',
    outgoingBubble: '#b3e5fc',
    outgoingText: '#01579b',
    inputBg: '#ffffff',
    inputText: '#01579b',
    accentGreen: '#0288d1'
  },
  lavender: {
    id: 'lavender',
    name: 'Lavender Serenity',
    icon: '🌸',
    chatBg: '#f3e5f5',
    headerBg: '#6a1b9a',
    headerText: '#ffffff',
    sidebarBg: '#ffffff',
    sidebarText: '#4a148c',
    sidebarSubtext: '#7b1fa2',
    sidebarActiveBg: '#f3e8ff',
    incomingBubble: '#ffffff',
    incomingText: '#4a148c',
    outgoingBubble: '#e1bee7',
    outgoingText: '#4a148c',
    inputBg: '#ffffff',
    inputText: '#4a148c',
    accentGreen: '#8e24aa'
  }
};

export const WhatsAppSimScreen: React.FC<Props> = ({ onOpenDashboard, data }) => {
  const [currentLang, setCurrentLang] = useState<LanguageCode>('hi');
  const [selectedThemeId, setSelectedThemeId] = useState<ThemePreset>('warm_beige');

  const activeTheme = THEME_CONFIGS[selectedThemeId] || THEME_CONFIGS.warm_beige;

  const patientName = data?.patient?.name || 'Ramesh Kumar';
  const patientAge = data?.patient?.age || 72;
  const mainMed = data?.medicines?.[0] || { name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily (OD)' };

  // Initial Contacts List with Doctor Chats
  const [contacts, setContacts] = useState<ChatContact[]>([
    {
      id: 'spashtcare',
      name: 'SpashtCare Official Bot',
      role: 'bot',
      subtitle: `Online • Active Case: ${patientName} (${patientAge}y)`,
      avatar: 'SC',
      avatarBg: 'bg-teal-700 text-white',
      lastMsgTime: '11:20 AM',
      isVerified: true,
      messages: []
    },
    {
      id: 'dr_mehta',
      name: 'Dr. A. Mehta (Cardiology)',
      role: 'doctor',
      subtitle: 'Senior Cardiologist • Apollo Hospital',
      avatar: 'AM',
      avatarBg: 'bg-blue-800 text-blue-100',
      phone: '+91 98765 11111',
      lastMsgTime: 'Yesterday',
      isVerified: true,
      messages: [
        {
          id: 'dr-m1',
          sender: 'bot',
          text: `Namaste. I have reviewed ${patientName}'s BP logs. Please ensure Amlodipine 5mg is taken regularly every morning after food. Call if SBP exceeds 160 mmHg.`,
          timestamp: '10:15 AM',
          status: 'read'
        }
      ]
    },
    {
      id: 'dr_rao',
      name: 'Dr. Sunita Rao (Diabetologist)',
      role: 'doctor',
      subtitle: 'Endocrinology & Diabetes • Manipal Hospital',
      avatar: 'SR',
      avatarBg: 'bg-purple-800 text-purple-100',
      phone: '+91 98765 22222',
      lastMsgTime: 'Monday',
      isVerified: true,
      messages: [
        {
          id: 'dr-r1',
          sender: 'bot',
          text: `Hello! HbA1c target for ${patientName} is < 7.0%. Keep tracking fasting blood glucose levels and continue Metformin 500mg BD.`,
          timestamp: '04:30 PM',
          status: 'read'
        }
      ]
    },
    {
      id: 'dr_sharma',
      name: 'Dr. R. Sharma (General Physician)',
      role: 'doctor',
      subtitle: 'Internal Medicine • Fortis Hospital',
      avatar: 'RS',
      avatarBg: 'bg-emerald-800 text-emerald-100',
      phone: '+91 98765 33333',
      lastMsgTime: 'Jul 24',
      isVerified: true,
      messages: [
        {
          id: 'dr-s1',
          sender: 'bot',
          text: `Prescription notes uploaded for ${patientName}. All kidney function markers (eGFR & Creatinine) are stable.`,
          timestamp: '11:00 AM',
          status: 'read'
        }
      ]
    },
    {
      id: 'caregiver',
      name: 'Priya Kumar (Caregiver)',
      role: 'caregiver',
      subtitle: 'Daughter & Primary Caregiver',
      avatar: 'PK',
      avatarBg: 'bg-slate-700 text-amber-300',
      phone: '+91 98765 00001',
      lastMsgTime: '10:45 AM',
      messages: [
        {
          id: 'cg-1',
          sender: 'bot',
          text: `Appa took his morning Amlodipine dose on time today. I will record the evening Metformin dose as well.`,
          timestamp: '10:45 AM',
          status: 'read'
        }
      ]
    },
    {
      id: 'pharmacy',
      name: 'Apollo Pharmacy Refill Bot',
      role: 'pharmacy',
      subtitle: 'Jan Aushadhi Generic Partner',
      avatar: 'AP',
      avatarBg: 'bg-teal-900 text-teal-200',
      phone: '+91 98765 55555',
      lastMsgTime: 'Jul 21',
      messages: [
        {
          id: 'ph-1',
          sender: 'bot',
          text: `Jan Aushadhi refill stock reserved for ${patientName}. 30 days supply ready for home delivery.`,
          timestamp: '02:15 PM',
          status: 'read'
        }
      ]
    }
  ]);

  const [activeChatId, setActiveChatId] = useState<string>('spashtcare');

  // Active Contact Data with safe fallback
  const fallbackContact: ChatContact = {
    id: 'spashtcare',
    name: 'SpashtCare Official Bot',
    role: 'bot',
    subtitle: `Online • Active Case: ${patientName} (${patientAge}y)`,
    avatar: 'SC',
    avatarBg: 'bg-teal-700 text-[#111b21]',
    lastMsgTime: '11:20 AM',
    isVerified: true,
    messages: []
  };

  const activeContact = contacts.find(c => c.id === activeChatId) || contacts[0] || fallbackContact;

  // Function to build translated welcome greeting
  const getTranslatedInitialMessage = (langCode: LanguageCode) => {
    const dict = TRANSLATIONS[langCode] || TRANSLATIONS.hi;
    const pName = data?.patient?.name || 'Ramesh Kumar';
    const pAge = data?.patient?.age || 72;
    const pConditions = data?.patient?.primary_conditions?.join(', ') || 'Hypertension, Type 2 Diabetes';
    const pMeds = data?.medicines || [{ name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily (OD)' }];
    const caregiverName = data?.caregivers?.[0]?.name || 'Priya Kumar';

    return {
      text: `${dict.welcomeGreeting}\n\n• ${dict.patientModeTitle}: *${pName}* (${pAge}y)\n• Diagnosis: *${pConditions}*\n• Active Regimen: ${pMeds.map(m => `💊 *${m.name} ${m.dosage}*`).join(', ')}\n• Linked Caregiver: *${caregiverName}*\n\n${dict.consentMessage}`,
      consentYes: `✅ ${dict.consentYes} (${pName})`,
      consentNo: `❌ ${dict.consentNo}`
    };
  };

  // Sync SpashtCare Bot initial message on lang/patient change
  useEffect(() => {
    const info = getTranslatedInitialMessage(currentLang);
    setContacts(prev => prev.map(c => {
      if (c.id === 'spashtcare') {
        return {
          ...c,
          subtitle: `Online • Active Case: ${patientName} (${patientAge}y)`,
          messages: [
            {
              id: `msg-init-${data?.patient?.patient_id || 'default'}-${currentLang}`,
              sender: 'bot',
              text: info.text,
              quickReplies: [
                { id: 'c-yes', label: info.consentYes, action: 'consent_yes' },
                { id: 'c-no', label: info.consentNo, action: 'consent_no' }
              ],
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              status: 'read'
            }
          ]
        };
      }
      return c;
    }));
  }, [currentLang, data?.patient?.patient_id, data?.patient?.name]);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>('');
  const [isPlayingAudio, setIsPlayingAudio] = useState<string | null>(null);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState<boolean>(false);
  const chatBodyRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    } else if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeChatId, isProcessing, activeContact.messages]);

  const playVoiceSynth = (id: string, transcript: string, langCode: string) => {
    const langObj = SUPPORTED_LANGUAGES.find(l => l.code === langCode);
    if ('speechSynthesis' in window) {
      if (isPlayingAudio === id) {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(null);
        return;
      }
      window.speechSynthesis.cancel();
      setIsPlayingAudio(id);
      const utterance = new SpeechSynthesisUtterance(transcript);
      utterance.lang = langObj?.script || 'hi-IN';
      utterance.rate = 0.9;
      utterance.onend = () => setIsPlayingAudio(null);
      utterance.onerror = () => setIsPlayingAudio(null);
      window.speechSynthesis.speak(utterance);
    } else {
      alert(`Voice synth (${langObj?.name}): "${transcript}"`);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const msgText = textToSend || inputText;
    if (!msgText.trim()) return;

    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: msgText,
      timestamp: timeNow,
      status: 'read'
    };

    // Append to current contact's messages
    setContacts(prev => prev.map(c => c.id === activeChatId ? { ...c, lastMsgTime: timeNow, messages: [...c.messages, userMsg] } : c));
    if (!textToSend) setInputText('');
    setIsProcessing(true);

    try {
      const response = await fetch('/api/whatsapp/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ case_id: 'case-001', message: msgText, phone: activeContact.phone || '916385808165' })
      });
      const dataRes = await response.json();

      setIsProcessing(false);
      const botReplyText = activeContact.role === 'doctor'
        ? `👨‍⚕️ ${activeContact.name}: Thank you for updating. Verified message received regarding ${patientName}. Please continue prescribed dosage.`
        : dataRes.reply || `Verified: ${msgText}. Active patient record for ${patientName} updated in SpashtCare database.`;

      setContacts(prev => prev.map(c => c.id === activeChatId ? {
        ...c,
        messages: [
          ...c.messages,
          {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            text: botReplyText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'read'
          }
        ]
      } : c));
    } catch {
      setIsProcessing(false);
      setContacts(prev => prev.map(c => c.id === activeChatId ? {
        ...c,
        messages: [
          ...c.messages,
          {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            text: `✅ Verified message received by ${activeContact.name} for patient ${patientName}.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'read'
          }
        ]
      } : c));
    }
  };

  const handleQuickReplyClick = async (action: string) => {
    const dict = TRANSLATIONS[currentLang] || TRANSLATIONS.hi;

    if (action === 'consent_yes') {
      const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const userMsg: Message = { id: `u-${Date.now()}`, sender: 'user', text: `✅ ${dict.consentYes}`, timestamp: timeNow, status: 'read' };

      setContacts(prev => prev.map(c => c.id === 'spashtcare' ? { ...c, messages: [...c.messages, userMsg] } : c));
      setIsProcessing(true);

      setTimeout(() => {
        setIsProcessing(false);
        const botMsg: Message = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `✅ Consent Confirmed for ${patientName}!\n\nSelect an option below:`,
          quickReplies: [
            { id: 'opt-1', label: `📸 ${dict.uploadDrSharma}`, action: 'sample_upload' },
            { id: 'opt-2', label: `💊 ${dict.dosageReminder}`, action: 'check_adherence' },
            { id: 'opt-3', label: `🔊 ${dict.voiceReadout}`, action: 'voice_summary' }
          ],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'read'
        };
        setContacts(prev => prev.map(c => c.id === 'spashtcare' ? { ...c, messages: [...c.messages, botMsg] } : c));
      }, 600);
    } else if (action === 'sample_upload') {
      const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const userMsg: Message = { id: `u-${Date.now()}`, sender: 'user', text: `📸 ${dict.uploadDrSharma}`, timestamp: timeNow, status: 'read' };

      setContacts(prev => prev.map(c => c.id === 'spashtcare' ? { ...c, messages: [...c.messages, userMsg] } : c));
      setIsProcessing(true);

      setTimeout(() => {
        setIsProcessing(false);
        const botMsg: Message = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `📄 Multimodal Gemini Vision OCR Scan Complete for ${patientName}:\n\nDoctor: Dr. R. Sharma (Manipal Hospital)\nExtracted 2 active prescriptions:`,
          structuredOutput: {
            doctor: 'Dr. R. Sharma (Manipal Hospital)',
            hospital: 'Manipal Hospital, Bengaluru',
            medicines: [
              { name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily (OD)', duration: '30 days', confidence: 95 },
              { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily (BD)', duration: '30 days', confidence: 92 }
            ]
          },
          quickReplies: [
            { id: 'act-1', label: `🔍 ${dict.inspectRetryLoop}`, action: 'view_replay' },
            { id: 'act-2', label: `📅 ${dict.viewVisualTimeline}`, action: 'view_timeline' }
          ],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'read'
        };
        setContacts(prev => prev.map(c => c.id === 'spashtcare' ? { ...c, messages: [...c.messages, botMsg] } : c));
      }, 800);
    } else if (action === 'view_replay') {
      onOpenDashboard('replay');
    } else if (action === 'view_timeline') {
      onOpenDashboard('timeline');
    }
  };

  const handleCreateNewChatSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const name = (formData.get('name') as string) || 'New Contact';
    const role = (formData.get('role') as 'doctor' | 'caregiver' | 'pharmacy') || 'doctor';
    const subtitle = (formData.get('subtitle') as string) || 'Healthcare Contact';
    const phone = (formData.get('phone') as string) || '+91 98765 99999';
    const initialMessage = (formData.get('initialMessage') as string) || 'Hello! I am linked to your SpashtCare patient record.';

    const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    const newId = `c-${Date.now()}`;

    const newContact: ChatContact = {
      id: newId,
      name,
      role,
      subtitle,
      phone,
      avatar: initials,
      avatarBg: role === 'doctor' ? 'bg-[#0288d1] text-white' : 'bg-slate-700 text-white',
      lastMsgTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isVerified: true,
      messages: [
        {
          id: `init-${newId}`,
          sender: 'bot',
          text: `🙏 Hello! This is ${name}. ${initialMessage}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'read'
        }
      ]
    };

    setContacts(prev => [newContact, ...prev]);
    setActiveChatId(newId);
    setIsNewChatModalOpen(false);
  };

  const sendReminderDemo = () => {
    const dict = TRANSLATIONS[currentLang] || TRANSLATIONS.hi;
    const reminderText = `⏰ *${dict.dosageReminder}* (${patientName}):\n\n💊 *${mainMed.name} ${mainMed.dosage}* (${mainMed.frequency})\n\nPlease reply after taking your dose:`;

    setContacts(prev => prev.map(c => c.id === 'spashtcare' ? {
      ...c,
      messages: [
        ...c.messages,
        {
          id: `reminder-${Date.now()}`,
          sender: 'bot',
          text: reminderText,
          quickReplies: [
            { id: 'rem-done', label: `✅ ${dict.taken}`, action: 'rem_done' },
            { id: 'rem-missed', label: `❌ ${dict.missed}`, action: 'rem_missed' }
          ],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'read'
        }
      ]
    } : c));
  };

  const whatsappWarmDoodleSVG = `data:image/svg+xml,%3Csvg width='240' height='240' viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23857564' stroke-width='1.2' stroke-opacity='0.22' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='30' cy='30' r='10'/%3E%3Cpath d='M30 14v-4M30 46v-4M14 30h-4M46 30h-4M19 19l-3-3M41 41l-3-3M19 41l-3 3M41 19l-3 3'/%3E%3Cpath d='M80 35h20v15a10 10 0 0 1 -10 10h0a10 10 0 0 1 -10 -10v-15zM100 40h4a4 4 0 0 1 0 8h-4'/%3E%3Cpath d='M84 25q3-4 0-8M92 25q3-4 0-8'/%3E%3Cpath d='M160 25l3 6 6 1-4 4 1 6-6-3-6 3 1-6-4-4 6-1z'/%3E%3Cpath d='M200 30a5 5 0 0 1 7 0a5 5 0 0 1 0 7l-7 7l-7-7a5 5 0 0 1 0-7a5 5 0 0 1 7 0z'/%3E%3Crect x='25' y='95' width='25' height='12' rx='6' transform='rotate(-30 37 101)'/%3E%3Ccircle cx='100' cy='100' r='12'/%3E%3Cpath d='M100 92v8h6'/%3E%3Cpath d='M165 90c0-12 10-20 10-20s10 8 10 20v10h-20zM160 100l5-5M190 100l-5-5'/%3E%3Ccircle cx='30' cy='175' r='12'/%3E%3Cpath d='M24 172v2M36 172v2M24 180q6 6 12 0'/%3E%3Cpath d='M80 175q-5-8-12-3q-8-3-12 3q-5 5 0 10h24q5-5 0-10z'/%3E%3Cpath d='M150 170l30 10-15 10-5 10-3-12-7-8z'/%3E%3C/g%3E%3C/svg%3E`;

  return (
    <div className="max-w-7xl mx-auto p-2 sm:p-4 space-y-4 font-sans">
      
      {/* Top Controls & Multi-Lingual Switcher Bar */}
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-3xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-lg">
            💬
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-black text-base text-slate-900 dark:text-slate-100">WhatsApp Web Multi-Doctor Studio</h2>
              <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                Meta Cloud API Active
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Interactive Doctor Conversations, Contact Creator, & Theme Studio</p>
          </div>
        </div>

        {/* 🌐 Live Multi-Lingual Language Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 overflow-x-auto max-w-full">
          {SUPPORTED_LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => setCurrentLang(l.code)}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                currentLang === l.code
                  ? 'bg-emerald-600 text-white font-black shadow-md scale-105 ring-2 ring-emerald-300'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <span>{l.flag}</span>
              <span>{l.nativeName}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsNewChatModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-md transition flex items-center gap-1.5 active:scale-95 whitespace-nowrap"
          >
            <UserPlus className="w-4 h-4" />
            <span>➕ Create New WhatsApp Chat</span>
          </button>

          <button
            onClick={sendReminderDemo}
            className="text-xs bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-4 py-2.5 rounded-xl shadow-md transition transform active:scale-95 whitespace-nowrap"
          >
            📲 Trigger Reminder
          </button>
        </div>
      </div>

      {/* 🎨 INTERACTIVE WHATSAPP THEME SELECTOR CAROUSEL BAR */}
      <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border-2 border-slate-300 dark:border-slate-800 shadow-sm flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center gap-2 shrink-0">
          <Palette className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="text-xs font-black text-slate-900 dark:text-slate-100">WhatsApp Chat Themes:</span>
        </div>

        <div className="flex items-center gap-2">
          {Object.values(THEME_CONFIGS).map((th) => (
            <button
              key={th.id}
              onClick={() => setSelectedThemeId(th.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 border ${
                selectedThemeId === th.id
                  ? 'bg-emerald-600 text-white border-emerald-500 ring-2 ring-emerald-300 shadow-md scale-105'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>{th.icon}</span>
              <span>{th.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 🟢 AUTHENTIC WHATSAPP WEB CONTAINER (APPLYING SELECTED THEME & HIGH-CONTRAST SIDEBAR TEXT) */}
      <div
        className="rounded-3xl shadow-2xl overflow-hidden border-2 max-w-6xl mx-auto flex flex-col sm:flex-row h-[720px] transition-all duration-300"
        style={{ borderColor: activeTheme.headerBg }}
      >
        {/* ──────── LEFT COLUMN: WHATSAPP CHATS SIDEBAR ──────── */}
        <div
          className="w-full sm:w-80 md:w-96 border-b sm:border-b-0 sm:border-r flex flex-col shrink-0 select-none transition-colors duration-300"
          style={{ backgroundColor: activeTheme.sidebarBg, borderColor: 'rgba(0,0,0,0.1)' }}
        >
          {/* Sidebar Top Header Bar */}
          <div
            className="px-4 py-3 flex items-center justify-between shadow-xs transition-colors duration-300"
            style={{ backgroundColor: activeTheme.headerBg, color: activeTheme.headerText }}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 text-white font-black flex items-center justify-center text-xs shadow-sm border border-white/40">
                SC
              </div>
              <span className="font-extrabold text-sm">WhatsApp Web</span>
            </div>

            <div className="flex items-center gap-3 opacity-90">
              <button onClick={() => setIsNewChatModalOpen(true)} title="Create New Chat" className="p-1 hover:bg-white/20 rounded-lg transition flex items-center gap-1 font-bold text-xs bg-white/10 px-2">
                <Plus className="w-4 h-4" />
                <span>New Chat</span>
              </button>
              <button title="Menu" className="hover:opacity-100 transition"><MoreVertical className="w-5 h-5" /></button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="p-2 border-b border-slate-200/60 dark:border-slate-800">
            <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 px-3.5 py-1.5 rounded-xl text-xs">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search doctors, caregivers, pharmacy..."
                className="bg-transparent font-medium outline-none w-full text-xs text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          {/* Chats Thread List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-200/40 dark:divide-slate-800/40">
            {contacts.map((contact) => {
              const isActive = contact.id === activeChatId;
              const lastMsg = contact.messages[contact.messages.length - 1];

              return (
                <div
                  key={contact.id}
                  onClick={() => setActiveChatId(contact.id)}
                  className={`p-3 flex items-center gap-3 cursor-pointer transition ${
                    isActive ? 'border-l-4 border-emerald-600 font-extrabold' : 'hover:bg-slate-100 dark:hover:bg-slate-800/50'
                  }`}
                  style={{
                    backgroundColor: isActive ? activeTheme.sidebarActiveBg : 'transparent'
                  }}
                >
                  <div className="relative shrink-0">
                    <div className={`w-12 h-12 rounded-full ${contact.avatarBg} font-black flex items-center justify-center text-sm shadow-sm border border-slate-400/30`}>
                      {contact.avatar}
                    </div>
                    {contact.role === 'doctor' && (
                      <span className="absolute -bottom-1 -right-1 bg-blue-600 text-white rounded-full p-0.5 border-2 border-white shadow">
                        <Stethoscope className="w-3 h-3" />
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <div className="flex items-center gap-1 min-w-0">
                        <h4
                          className="font-black text-sm truncate"
                          style={{ color: activeTheme.sidebarText }}
                        >
                          {contact.name}
                        </h4>
                        {contact.isVerified && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />}
                      </div>
                      <span className="text-[11px] font-bold" style={{ color: activeTheme.sidebarSubtext }}>
                        {contact.lastMsgTime}
                      </span>
                    </div>
                    <p
                      className="text-xs truncate font-semibold"
                      style={{ color: activeTheme.sidebarSubtext }}
                    >
                      {lastMsg?.text?.slice(0, 38) || contact.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ──────── RIGHT COLUMN: AUTHENTIC WHATSAPP CHAT THREAD ──────── */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Header Bar */}
          <div
            className="px-4 py-3 flex items-center justify-between shadow-md shrink-0 transition-colors duration-300"
            style={{ backgroundColor: activeTheme.headerBg, color: activeTheme.headerText }}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className={`w-10 h-10 rounded-full ${activeContact.avatarBg} font-black flex items-center justify-center text-sm shadow-md border border-white/40`}>
                  {activeContact.avatar}
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full"></span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-black text-sm">{activeContact.name}</h3>
                  {activeContact.isVerified && <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />}
                </div>
                <p className="text-[11px] opacity-90 font-bold">
                  {activeContact.subtitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 opacity-90">
              <button title="Video Call" className="hover:opacity-100 transition"><Video className="w-5 h-5" /></button>
              <button title="Voice Call" className="hover:opacity-100 transition"><Phone className="w-5 h-5" /></button>
              <button title="Search" className="hover:opacity-100 transition"><Search className="w-5 h-5" /></button>
              <button title="Menu" className="hover:opacity-100 transition"><MoreVertical className="w-5 h-5" /></button>
            </div>
          </div>

          {/* 🖼️ AUTHENTIC WHATSAPP DOODLE WALLPAPER BODY */}
          <div
            ref={chatBodyRef}
            className="flex-1 p-4 md:p-6 overflow-y-auto space-y-3.5 font-sans text-sm relative transition-all duration-300"
            style={{
              backgroundImage: `url("${whatsappWarmDoodleSVG}")`,
              backgroundColor: activeTheme.chatBg
            }}
          >
            {/* FLOATING DATE BADGE ("Today") */}
            <div className="text-center my-2">
              <span className="bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 text-xs font-bold px-4 py-1 rounded-xl shadow-sm border border-slate-300 dark:border-slate-700 inline-block">
                Today
              </span>
            </div>

            {/* Encryption Security Banner */}
            <div className="text-center my-2">
              <span className="bg-amber-100/90 dark:bg-amber-950/90 text-amber-950 dark:text-amber-200 text-[11px] font-bold px-4 py-1.5 rounded-xl border border-amber-300 dark:border-amber-800 inline-block max-w-md shadow-sm">
                🔒 End-to-End Encrypted Medical Chat • Patient: <strong>{patientName}</strong>
              </span>
            </div>

            {(activeContact?.messages || []).map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                {/* Message Bubble */}
                <div
                  className="max-w-[88%] sm:max-w-[78%] rounded-2xl px-4 py-3 shadow-md leading-relaxed relative text-sm font-medium transition-all duration-300"
                  style={{
                    backgroundColor: msg.sender === 'user' ? activeTheme.outgoingBubble : activeTheme.incomingBubble,
                    color: msg.sender === 'user' ? activeTheme.outgoingText : activeTheme.incomingText
                  }}
                >
                  {msg.text && <p className="whitespace-pre-line leading-relaxed font-bold">{msg.text}</p>}

                  {/* Structured Extraction Card */}
                  {msg.structuredOutput && (
                    <div className="bg-slate-900 text-white rounded-xl p-3 my-2.5 space-y-2 shadow-inner">
                      <div className="flex items-center justify-between text-xs font-bold border-b border-slate-700 pb-2">
                        <span className="font-black text-amber-300">{msg.structuredOutput.doctor}</span>
                        <span className="text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-md border border-emerald-500 font-bold">{msg.structuredOutput.hospital}</span>
                      </div>

                      <div className="space-y-1.5">
                        {msg.structuredOutput.medicines.map((med: any, idx: number) => (
                          <div key={idx} className="bg-slate-800 p-2.5 rounded-xl border border-slate-700 flex items-center justify-between text-xs">
                            <div>
                              <span className="font-extrabold text-white text-sm">{med.name}</span>
                              <span className="text-emerald-400 font-mono ml-2 font-black">{med.dosage}</span>
                              <div className="text-[11px] text-slate-300 font-medium mt-0.5">{med.frequency} • {med.duration}</div>
                            </div>
                            <ConfidenceBadge score={med.confidence} showScore />
                          </div>
                        ))}
                      </div>

                      <DisclaimerBanner compact />
                    </div>
                  )}

                  {/* Voice Note Audio Component */}
                  {msg.voiceNote && (
                    <div className="bg-slate-900 text-white border border-amber-500/30 rounded-xl p-3 my-2 flex items-center gap-3">
                      <button
                        onClick={() => playVoiceSynth(msg.id, msg.voiceNote?.transcript || '', msg.voiceNote?.langCode || currentLang)}
                        className="w-10 h-10 rounded-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 flex items-center justify-center shadow-lg transition transform active:scale-95 shrink-0"
                      >
                        {isPlayingAudio === msg.id ? (
                          <Pause className="w-5 h-5 fill-slate-950" />
                        ) : (
                          <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-xs text-amber-300 flex items-center gap-1.5">
                          <Volume2 className="w-4 h-4 text-amber-400 animate-pulse" />
                          <span>Voice Summary ({SUPPORTED_LANGUAGES.find(l => l.code === (msg.voiceNote?.langCode || currentLang))?.nativeName})</span>
                        </div>
                        <p className="text-[11px] text-slate-300 truncate mt-0.5 font-medium">{msg.voiceNote.transcript}</p>
                      </div>
                    </div>
                  )}

                  {/* Timestamp & Double Blue Checkmarks */}
                  <div className="flex items-center justify-end gap-1 text-[10px] opacity-75 mt-1 font-mono font-bold">
                    <span>{msg.timestamp}</span>
                    <CheckCheck className="w-4 h-4 text-[#34b7f1]" />
                  </div>
                </div>

                {/* Interactive Quick Reply Buttons */}
                {msg.quickReplies && (
                  <div className="flex flex-wrap gap-2 mt-2 max-w-[88%] sm:max-w-[78%]">
                    {msg.quickReplies.map((qr) => (
                      <button
                        key={qr.id}
                        onClick={() => handleQuickReplyClick(qr.action)}
                        className="bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 font-extrabold text-xs px-3.5 py-2 rounded-xl border-2 border-emerald-500/50 shadow-md transition active:scale-95 flex items-center gap-1.5 hover:bg-emerald-50"
                      >
                        <span>{qr.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isProcessing && (
              <div className="bg-white text-slate-900 rounded-2xl rounded-tl-none px-4 py-2.5 shadow-md flex items-center gap-2.5 max-w-xs text-xs font-bold animate-pulse">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                <span>{activeContact.name} is typing...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* ────── AUTHENTIC WHATSAPP WEB INPUT FOOTER BAR ────── */}
          <div
            className="px-4 py-3 flex items-center gap-3 border-t shrink-0 transition-colors duration-300"
            style={{ backgroundColor: activeTheme.headerBg }}
          >
            <button title="Emoji" className="text-white opacity-90 hover:opacity-100 transition"><Smile className="w-6 h-6" /></button>
            <button title="Attach" className="text-white opacity-90 hover:opacity-100 transition"><Paperclip className="w-6 h-6" /></button>
            <button title="Camera" className="text-white opacity-90 hover:opacity-100 transition"><Camera className="w-6 h-6" /></button>

            <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex-1 flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Message ${activeContact.name}...`}
                className="w-full rounded-xl px-4 py-2.5 text-xs font-bold outline-none border transition bg-white text-slate-900 border-slate-300 focus:ring-2 focus:ring-amber-300"
              />
              <button
                type="submit"
                className="w-10 h-10 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md transition active:scale-95 shrink-0"
              >
                <Send className="w-4 h-4 fill-slate-950" />
              </button>
            </form>
          </div>

        </div>

      </div>

      {/* ─── MODAL: CREATE NEW WHATSAPP CHAT ─── */}
      {isNewChatModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full shadow-2xl border-2 border-slate-300 dark:border-slate-800 space-y-4 font-sans">
            
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                Create New WhatsApp Medical Chat
              </h3>
              <button onClick={() => setIsNewChatModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewChatSubmit} className="space-y-3.5 text-xs font-bold">
              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1">Contact Name *</label>
                <input name="name" required placeholder="e.g. Dr. S. Nair (Neurologist) / Caregiver" className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded-xl p-2.5 font-bold outline-none" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 dark:text-slate-300 block mb-1">Role / Category *</label>
                  <select name="role" defaultValue="doctor" className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded-xl p-2.5 font-bold outline-none">
                    <option value="doctor">👨‍⚕️ Doctor / Specialist</option>
                    <option value="caregiver">👤 Caregiver / Family</option>
                    <option value="pharmacy">💊 Pharmacy Partner</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-700 dark:text-slate-300 block mb-1">Phone Number *</label>
                  <input name="phone" defaultValue="+91 98765 99999" placeholder="+91 98765 99999" className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded-xl p-2.5 font-bold outline-none" />
                </div>
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1">Hospital Facility / Subtitle</label>
                <input name="subtitle" defaultValue="Apollo Hospitals • Specialist Consultation" placeholder="e.g. Fortis Healthcare" className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded-xl p-2.5 font-bold outline-none" />
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1">Initial Greeting Message</label>
                <textarea name="initialMessage" rows={2} defaultValue="Hello! I am linked to your SpashtCare patient record." className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded-xl p-2.5 font-bold outline-none" />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button type="button" onClick={() => setIsNewChatModalOpen(false)} className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 font-bold">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black shadow-md flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Start WhatsApp Chat</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
