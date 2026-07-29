import React from 'react';
import { Calendar, CheckCircle2, AlertTriangle, Share2, Award, HeartPulse, Clock } from 'lucide-react';
import { DisclaimerBanner } from '../../components/DisclaimerBanner';

interface Props {
  data?: any;
}

export const WeeklyDigestScreen: React.FC<Props> = ({ data }) => {
  const activeMeds = (data?.medicines || []).filter((m: any) => m.active).map((m: any) => ({
    name: `${m.name} ${m.dosage || ''}`.trim(),
    timing: m.frequency || 'As prescribed'
  }));

  const digestData = {
    patientName: data?.patient?.name || 'Ramesh Kumar',
    caregiverName: data?.caregivers?.[0]?.name || 'Priya Kumar',
    period: data?.digest?.period || 'July 21 – July 27, 2026',
    adherenceRate: data?.digest?.adherenceRate || 86,
    takenDoses: 12,
    scheduledDoses: 14,
    streakDays: data?.digest?.streakDays || 6,
    openFlagsCount: data?.digest?.openFlagsCount || 1,
    upcomingFollowups: data?.upcomingFollowups || [
      { date: 'Aug 09, 2026', doctor: 'Dr. A. Mehta', facility: 'Apollo Hospital, Bengaluru' }
    ],
    activeMedicines: activeMeds.length > 0 ? activeMeds : [
      { name: 'Amlodipine 5mg', timing: 'Once daily (Morning)' },
      { name: 'Metformin 500mg', timing: 'Twice daily (Meals)' },
      { name: 'Pantoprazole 40mg', timing: 'Once daily (Before breakfast)' },
    ]
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-1">
            <Calendar className="w-4 h-4" />
            <span>Section 3.10 Measurable Outcome Artifact</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Weekly Caregiver Digest</h1>
          <p className="text-sm text-slate-500 mt-1">
            Auto-generated 7-day adherence summary, open safety alerts, and upcoming medical appointments for {digestData.caregiverName}.
          </p>
        </div>

        <button
          onClick={() => alert('Digest summary ready to export or forward via WhatsApp.')}
          className="bg-primary hover:bg-primary-dark text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow transition flex items-center gap-2"
        >
          <Share2 className="w-4 h-4" />
          <span>Export / Forward Summary</span>
        </button>
      </div>

      <DisclaimerBanner />

      {/* Main Digest Card */}
      <div className="bg-gradient-to-br from-primary-light to-white p-6 md:p-8 rounded-3xl border border-primary/20 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-primary/10 pb-4">
          <div>
            <span className="bg-primary text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {digestData.period}
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 mt-2">{digestData.patientName}'s Weekly Summary</h2>
          </div>
          <div className="flex items-center gap-2 text-primary font-bold text-sm bg-white px-4 py-2 rounded-2xl shadow-sm border border-primary/10">
            <Award className="w-5 h-5 text-accent" />
            <span>{digestData.streakDays}-Day Adherence Streak!</span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Adherence Rate</span>
              <HeartPulse className="w-5 h-5 text-success" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900">{digestData.adherenceRate}%</div>
            <p className="text-xs text-slate-500">{digestData.takenDoses} of {digestData.scheduledDoses} doses confirmed</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Regimen</span>
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900">{digestData.activeMedicines.length} Medicines</div>
            <p className="text-xs text-slate-500">Scheduled daily dosages</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Open Flags</span>
              <AlertTriangle className="w-5 h-5 text-warning" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900">{digestData.openFlagsCount} Flag</div>
            <p className="text-xs text-warning font-semibold">Requires pharmacist check</p>
          </div>
        </div>

        {/* Active Regimen Checklist */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            Confirmed Active Medications
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {digestData.activeMedicines.map((m: any, i: number) => (
              <div key={i} className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block">{m.name}</span>
                <span className="text-slate-500 block">{m.timing}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-amber-50/60 p-5 rounded-2xl border border-amber-200 shadow-sm space-y-2">
          <h3 className="font-bold text-sm text-amber-950 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-600" />
            Upcoming Follow-up Appointment
          </h3>
          {digestData.upcomingFollowups.map((f: any, i: number) => (
            <div key={i} className="flex items-center justify-between text-xs text-amber-900">
              <span className="font-bold">{f.doctor} ({f.facility})</span>
              <span className="bg-amber-200/80 px-2.5 py-1 rounded-lg font-semibold">{f.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
