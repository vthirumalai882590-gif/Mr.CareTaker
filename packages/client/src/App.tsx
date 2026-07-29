import React, { useState, useEffect } from 'react';
import { Navbar, ActiveTab, LeftSidebarNav } from './components/Navbar';
import { useTheme } from './context/ThemeContext';
import { WhatsAppSimScreen } from './screens/WhatsAppSim';
import { CaseOverviewScreen } from './screens/CaseOverview';
import { ExtractionReplayScreen } from './screens/ExtractionReplay';
import { TrustReceiptScreen } from './screens/TrustReceipt';
import { MedicationHistoryScreen } from './screens/MedicationHistory';
import { SafetyFlagsScreen } from './screens/SafetyFlags';
import { TimelineViewScreen } from './screens/TimelineView';
import { AdherenceTrackerScreen } from './screens/AdherenceTracker';
import { EmergencyCardScreen } from './screens/EmergencyCard';
import { GenericSubstituteScreen } from './screens/GenericSubstitute';
import { SettingsScreen } from './screens/Settings';
import { PatientSimpleModeScreen } from './screens/PatientSimpleMode';
import { GovernanceScreen } from './screens/Governance';
import { WeeklyDigestScreen } from './screens/WeeklyDigest';
import { DrugInteractionScreen } from './screens/DrugInteraction';
import { PredictiveRiskScreen } from './screens/PredictiveRisk';
import { ManagePatientsModal } from './components/ManagePatientsModal';
import { AddPatientModal } from './components/AddPatientModal';
import { AIChatModal } from './components/AIChatModal';
import { Patient } from './types';
import { PATIENT_DATA_MAP, PatientCaseFullData } from './patientDataMap';

const INITIAL_PATIENTS: Patient[] = Object.values(PATIENT_DATA_MAP).map(d => d.patient);

export function App() {
  const { config } = useTheme();
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [isPatientMode, setIsPatientMode] = useState<boolean>(false);
  const [isAddPatientOpen, setIsAddPatientOpen] = useState<boolean>(false);
  const [isManagePatientsOpen, setIsManagePatientsOpen] = useState<boolean>(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(true);
  const [patientsList, setPatientsList] = useState<Patient[]>(INITIAL_PATIENTS);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('patient-ramesh-kumar');
  const [customDataMap, setCustomDataMap] = useState<Record<string, PatientCaseFullData>>(PATIENT_DATA_MAP);

  const activeCaseData = customDataMap[selectedPatientId] || (patientsList.length > 0 ? {
    patient: patientsList.find(p => p.patient_id === selectedPatientId) || patientsList[0],
    caregivers: [{ caregiver_id: 'cg-custom', name: 'Family Caregiver', relationship_to_patient: 'Caregiver', phone_number: '+91 98765 00001' }],
    medicines: [{ medicine_id: 'm-1', name: 'Prescribed Medicine', dosage: '5 mg', frequency: 'Once daily', duration: '30 days', doctor_name: 'Dr. Primary Practitioner', active: true, confidence: 95 }],
    safety_flags: [{ id: 'f-custom', type: 'info', severity: 'info', title: 'Onboarding Record Verified', medicines: ['Prescribed Medicine'], reasoning: 'Please confirm dosage schedule with your pharmacist.' }],
    adherence: { ratePercentage: 100, streakDays: 1, days: [{ eventId: 'evt-1', date: 'Today', status: 'done', med: 'Prescribed Medicine' }] },
    refills: [{ name: 'Prescribed Medicine', daysLeft: 30, endDate: '2026-08-27', status: 'Stock OK' }],
    timelineEvents: [{ id: 't-1', day: 'Day 1', title: 'Onboarding Regimen Start', desc: 'Started daily regimen.', type: 'start' }],
    upcomingFollowups: [{ date: 'Aug 25, 2026', doctor: 'Dr. Primary Practitioner', facility: 'City General Hospital' }],
    digest: { period: 'Current Week Digest', adherenceRate: 100, streakDays: 1, openFlagsCount: 1 },
    governance: [
      { role: 'Patient (Owner)', name: 'Patient Owner', phone: '+91 98765 43210', accessLevel: 'Full Access', addedAt: 'Onboarding (Today)' },
      { role: 'Primary Caregiver', name: 'Family Caregiver (Caregiver)', phone: '+91 98765 00001', accessLevel: 'Linked Caregiver', addedAt: 'Invite Confirmed (Today)' }
    ]
  } : null);

  useEffect(() => {
    fetch('/api/cases')
      .then(r => r.json())
      .then(data => {
        if (data.cases && data.cases.length > 0) {
          console.log('[App] Synchronized live patient cases from server database.');
        }
      })
      .catch(err => console.warn('[App] Backend sync notice:', err.message));
  }, []);

  const handleSavePatientFull = async (
    newPatient: Patient,
    caregiverName: string,
    caregiverPhone: string,
    caregiverRel: string,
    medList: any[],
    historyNotes: string,
    followupData?: { date: string; doctor: string; facility: string },
    safetyFlagData?: { title: string; reasoning: string; severity: string },
    adherenceData?: { rate: number; streak: number }
  ) => {
    let assignedPatientId = newPatient.patient_id;
    try {
      const res = await fetch('/api/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newPatient.name,
          age: newPatient.age,
          blood_group: newPatient.blood_group,
          known_allergies: newPatient.known_allergies,
          phone_number: newPatient.phone_number,
          caregiver_name: caregiverName,
          caregiver_phone: caregiverPhone,
        })
      });
      const serverRes = await res.json();
      if (serverRes.success && serverRes.patient_id) {
        assignedPatientId = serverRes.patient_id;
        newPatient.patient_id = assignedPatientId;
      }
    } catch (e) {
      console.warn('[App] Backend save fallback:', e);
    }

    const compiledMedicines = medList.map((m, idx) => ({
      medicine_id: `m-${Date.now()}-${idx}`,
      name: m.name || 'Prescribed Medicine',
      dosage: m.dosage || '5 mg',
      frequency: m.frequency || 'Once daily',
      duration: m.duration || '30 days',
      doctor_name: m.doctor_name || 'Dr. Primary Practitioner',
      active: true,
      confidence: 95
    }));

    const compiledRefills = medList.map(m => ({
      name: `${m.name} ${m.dosage || ''}`.trim(),
      daysLeft: 30,
      endDate: '2026-08-27',
      status: 'Stock OK'
    }));

    const compiledTimeline = medList.map((m, idx) => ({
      id: `t-${Date.now()}-${idx}`,
      day: `Day ${idx * 2 + 1}`,
      title: `Start ${m.name}`,
      desc: `Begin ${m.name} ${m.dosage} (${m.frequency}) prescribed by ${m.doctor_name}`,
      type: 'start' as const
    }));

    const mainMedNames = compiledMedicines.map(m => m.name);

    const customFlags = [
      {
        id: `sf-${Date.now()}`,
        type: safetyFlagData?.severity === 'serious' ? 'drug_interaction' : 'therapeutic_duplication',
        severity: (safetyFlagData?.severity as 'info' | 'caution') || 'caution',
        title: safetyFlagData?.title || 'Multi-Doctor Safety Verification',
        medicines: mainMedNames,
        reasoning: safetyFlagData?.reasoning || `Onboarded patient record for ${newPatient.name}. History Notes: "${historyNotes}".`
      }
    ];

    const followupList = [
      {
        date: followupData?.date || 'Aug 15, 2026',
        doctor: followupData?.doctor || 'Dr. A. Mehta (Cardiology)',
        facility: followupData?.facility || 'Apollo Hospital, Bengaluru'
      }
    ];

    const adherenceRateVal = adherenceData?.rate || 92;
    const streakDaysVal = adherenceData?.streak || 7;

    const newCaseData: PatientCaseFullData = {
      patient: { ...newPatient, patient_id: assignedPatientId },
      caregivers: [{ caregiver_id: `cg-${Date.now()}`, name: caregiverName, relationship_to_patient: caregiverRel, phone_number: caregiverPhone }],
      medicines: compiledMedicines,
      safety_flags: customFlags,
      adherence: {
        ratePercentage: adherenceRateVal,
        streakDays: streakDaysVal,
        days: compiledMedicines.map((m, i) => ({ eventId: `evt-${Date.now()}-${i}`, date: 'Today', status: 'done', med: `${m.name} ${m.dosage}` }))
      },
      refills: compiledRefills,
      timelineEvents: compiledTimeline,
      upcomingFollowups: followupList,
      digest: { period: 'Current Week Digest', adherenceRate: adherenceRateVal, streakDays: streakDaysVal, openFlagsCount: customFlags.length },
      governance: [
        { role: 'Patient (Owner)', name: newPatient.name, phone: newPatient.phone_number, accessLevel: 'Full Access', addedAt: 'Onboarding (Today)' },
        { role: 'Primary Caregiver', name: `${caregiverName} (${caregiverRel})`, phone: caregiverPhone, accessLevel: 'Linked Caregiver', addedAt: 'Invite Confirmed (Today)' }
      ]
    };

    setCustomDataMap(prev => ({ ...prev, [assignedPatientId]: newCaseData }));
    setPatientsList(prev => [{ ...newPatient, patient_id: assignedPatientId }, ...prev]);
    setSelectedPatientId(assignedPatientId);

    // Trigger Outbound WhatsApp Welcome & Onboarding message
    fetch('/api/whatsapp/send-reminder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: newPatient.phone_number || caregiverPhone || '+919876543210',
        patientName: newPatient.name,
        medicineName: compiledMedicines[0]?.name || 'Prescribed Medicines',
        dosage: compiledMedicines[0]?.dosage || 'As directed',
        frequency: `Onboarding Complete! Conditions: ${newPatient.primary_conditions?.join(', ') || 'Monitored'}`,
        doctor: followupList[0]?.doctor || 'SpashtCare AI Assistant'
      })
    }).catch(err => console.warn('[WhatsApp Onboarding Error]', err));

    setActiveTab('overview');
  };

  const handleDeletePatient = (patientId: string) => {
    setPatientsList(prev => {
      const filtered = prev.filter(p => p.patient_id !== patientId);
      if (selectedPatientId === patientId && filtered.length > 0) {
        setSelectedPatientId(filtered[0].patient_id);
      }
      return filtered;
    });

    setCustomDataMap(prev => {
      const next = { ...prev };
      delete next[patientId];
      return next;
    });
  };

  const handleDeleteAllPatients = () => {
    setPatientsList([]);
    setCustomDataMap({});
    setSelectedPatientId('');
  };

  return (
    <div className={`h-screen ${config.mainBg} flex flex-col font-sans overflow-hidden transition-colors duration-300`}>
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isPatientMode={isPatientMode}
        setIsPatientMode={setIsPatientMode}
        openSafetyCount={activeCaseData?.safety_flags?.length || 0}
        onOpenAddPatient={() => setIsManagePatientsOpen(true)}
        onOpenManagePatients={() => setIsManagePatientsOpen(true)}
        onOpenAIChat={() => setIsAIChatOpen(true)}
        patientsList={patientsList}
        selectedPatientId={selectedPatientId}
        onSelectPatient={(id) => setSelectedPatientId(id)}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={() => setIsSidebarCollapsed(prev => !prev)}
      />

      <ManagePatientsModal
        isOpen={isManagePatientsOpen}
        onClose={() => setIsManagePatientsOpen(false)}
        patientsList={patientsList}
        selectedPatientId={selectedPatientId}
        onSelectPatient={(id) => setSelectedPatientId(id)}
        onSavePatientFull={handleSavePatientFull}
        onDeletePatient={handleDeletePatient}
        onDeleteAllPatients={handleDeleteAllPatients}
      />

      <AIChatModal
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
        patientData={activeCaseData}
      />

      {/* Fixed Layout: Left Sidebar pinned, Right Main Panel scrolls */}
      <div className="flex-1 flex overflow-hidden h-[calc(100vh-4rem)]">
        {!isPatientMode && (
          <LeftSidebarNav
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            openSafetyCount={activeCaseData?.safety_flags?.length || 0}
            selectedPatientId={selectedPatientId}
            patientsList={patientsList}
            isCollapsed={isSidebarCollapsed}
          />
        )}

        <main className="flex-1 p-4 md:p-6 overflow-y-auto pb-12">
          {isPatientMode ? (
            <PatientSimpleModeScreen data={activeCaseData} />
          ) : (
            <>
              {activeTab === 'whatsapp' && <WhatsAppSimScreen data={activeCaseData} onOpenDashboard={(s) => setActiveTab(s as ActiveTab)} />}
              {activeTab === 'overview' && <CaseOverviewScreen data={activeCaseData} onNavigate={(s) => setActiveTab(s as ActiveTab)} />}

              {activeTab === 'replay' && <ExtractionReplayScreen data={activeCaseData} />}
              {activeTab === 'receipt' && <TrustReceiptScreen data={activeCaseData} onNavigateToReplay={() => setActiveTab('replay')} />}
              {activeTab === 'history' && <MedicationHistoryScreen data={activeCaseData} />}
              {activeTab === 'safety' && <SafetyFlagsScreen data={activeCaseData} flags={activeCaseData?.safety_flags} />}
              {activeTab === 'timeline' && <TimelineViewScreen data={activeCaseData} />}
              {activeTab === 'adherence' && <AdherenceTrackerScreen data={activeCaseData} />}
              {activeTab === 'governance' && <GovernanceScreen data={activeCaseData} />}
              {activeTab === 'digest' && <WeeklyDigestScreen data={activeCaseData} />}
              {activeTab === 'emergency' && <EmergencyCardScreen data={activeCaseData} patient={activeCaseData?.patient} />}
              {activeTab === 'generics' && <GenericSubstituteScreen data={activeCaseData} />}
              {activeTab === 'settings' && <SettingsScreen data={activeCaseData} />}
              {activeTab === 'patient' && <PatientSimpleModeScreen data={activeCaseData} />}
              {activeTab === 'interactions' && <DrugInteractionScreen data={activeCaseData} />}
              {activeTab === 'predictive_risk' && <PredictiveRiskScreen data={activeCaseData} onNavigate={(s) => setActiveTab(s as ActiveTab)} />}
            </>
          )}

          {/* Compact Micro-Footer at very bottom of content */}
          <footer className="mt-8 pt-3 border-t border-slate-200/60 text-[10px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left">
            <span className="font-bold text-slate-600">SpashtCare — Care Continuity Agent for Indian Households</span>
            <span className="italic text-slate-400">"Explains prescription records — please confirm changes with your doctor or pharmacist."</span>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default App;
