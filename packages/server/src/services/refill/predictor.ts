/**
 * SpashtCare — Refill Predictor
 * Computes estimated run-out date per medicine from extracted quantity and frequency.
 * Triggers reminder 3 days before predicted run-out.
 */

export interface RefillPrediction {
  medicine_id: string;
  medicine_name: string;
  dosage: string;
  frequency: string;
  duration: string;
  start_date: string;
  computed_end_date: string;
  days_remaining: number;
  refill_reminder_date: string; // 3 days before computed_end_date
  needs_refill_soon: boolean;   // true if days_remaining <= 3
}

export function calculateRefillPrediction(med: {
  medicine_id: string;
  name: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
  start_date?: string;
  computed_end_date?: string;
}): RefillPrediction {
  const startDate = med.start_date ? new Date(med.start_date) : new Date();
  let durationDays = 30; // default assumption

  if (med.duration) {
    const match = med.duration.match(/(\d+)\s*(days?|weeks?|months?)/i);
    if (match) {
      const num = parseInt(match[1], 10);
      const unit = match[2].toLowerCase();
      if (unit.startsWith('day')) durationDays = num;
      else if (unit.startsWith('week')) durationDays = num * 7;
      else if (unit.startsWith('month')) durationDays = num * 30;
    }
  }

  const computedEnd = med.computed_end_date
    ? new Date(med.computed_end_date)
    : new Date(startDate.getTime() + durationDays * 86400000);

  const today = new Date();
  const diffTime = computedEnd.getTime() - today.getTime();
  const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const refillReminderDate = new Date(computedEnd.getTime() - 3 * 86400000);

  return {
    medicine_id: med.medicine_id,
    medicine_name: med.name,
    dosage: med.dosage || '',
    frequency: med.frequency || '',
    duration: med.duration || `${durationDays} days`,
    start_date: startDate.toISOString().split('T')[0],
    computed_end_date: computedEnd.toISOString().split('T')[0],
    days_remaining: daysRemaining,
    refill_reminder_date: refillReminderDate.toISOString().split('T')[0],
    needs_refill_soon: daysRemaining <= 3,
  };
}
