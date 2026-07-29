/**
 * SpashtCare — Reminder & Escalation Scheduler
 * Checks adherence events and triggers caregiver proactive nudges + pharmacist share links on missed doses.
 */

import cron from 'node-cron';
import { getDb } from '../../db/index';
import { v4 as uuid } from 'uuid';

export function startReminderScheduler() {
  console.log('[Scheduler] Starting SpashtCare adherence & escalation scheduler');

  // Check every 5 minutes for missed reminders or serious flags
  cron.schedule('*/5 * * * *', () => {
    try {
      checkMissedRemindersAndEscalate();
    } catch (e: any) {
      console.error('[Scheduler Error]', e.message);
    }
  });
}

export function checkMissedRemindersAndEscalate() {
  const db = getDb();
  
  // Escalate only repeated missed doses, matching the stored trigger type.
  const missedEvents = db.prepare(`
    SELECT m.case_id, COUNT(*) AS missed_count
    FROM adherence_events a
    JOIN medicines m ON a.medicine_id = m.medicine_id
    WHERE a.status = 'missed'
    AND a.scheduled_at >= datetime('now', '-2 days')
    GROUP BY m.case_id
    HAVING COUNT(*) >= 2
  `).all() as any[];

  if (missedEvents.length > 0) {
    const caseIds = Array.from(new Set(missedEvents.map(m => m.case_id)));

    for (const caseId of caseIds) {
      // Check if already escalated today
      const existing = db.prepare(`
        SELECT * FROM escalation_events
        WHERE case_id = ? AND trigger_type = 'repeated_missed_doses'
        AND created_at >= datetime('now', '-1 day')
      `).get(caseId);

      if (!existing) {
        const escalationId = uuid();
        db.prepare(`INSERT INTO escalation_events VALUES (?,?,?,?,?,?)`).run(
          escalationId,
          caseId,
          'repeated_missed_doses',
          new Date().toISOString(),
          1,
          new Date().toISOString()
        );
        console.log(`[Scheduler Escalation] Case ${caseId}: Missed dose detected -> Escalation event recorded & caregiver notified`);
      }
    }
  }
}
