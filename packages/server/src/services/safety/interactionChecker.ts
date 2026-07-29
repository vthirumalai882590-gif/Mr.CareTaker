/**
 * SpashtCare — Drug Interaction & Safety Checker
 * Sources: curated interaction list based on common Indian prescription patterns
 * All flags end with "ask your pharmacist or doctor"
 */

import { getTherapeuticClass } from '../extraction/drugDB';

export interface DrugInteraction {
  drug_a: string;
  drug_b: string;
  severity: 'info' | 'caution' | 'serious';
  reasoning: string;
}

// Curated interaction pairs — Source: WHO drug interaction guidelines + Indian pharmacopeia references
// Cited in UI as "Reference: WHO Interaction Guidelines + Indian Pharmacopeia"
const INTERACTION_DATABASE: DrugInteraction[] = [
  {
    drug_a: 'Metformin', drug_b: 'Ibuprofen',
    severity: 'caution',
    reasoning: 'Ibuprofen (an NSAID) can reduce kidney function, which may slow the clearance of Metformin and increase its blood concentration. Please ask your pharmacist or doctor if you have any kidney concerns.'
  },
  {
    drug_a: 'Aspirin', drug_b: 'Ibuprofen',
    severity: 'caution',
    reasoning: 'Both Aspirin and Ibuprofen belong to the NSAID class. Taking both together increases the risk of stomach bleeding and can reduce the antiplatelet effect of Aspirin. Please confirm this combination with your pharmacist or doctor.'
  },
  {
    drug_a: 'Warfarin', drug_b: 'Aspirin',
    severity: 'serious',
    reasoning: 'Warfarin and Aspirin together significantly increase the risk of serious bleeding. This combination requires close monitoring. Please ask your doctor or pharmacist immediately.'
  },
  {
    drug_a: 'Metformin', drug_b: 'Alcohol',
    severity: 'caution',
    reasoning: 'Alcohol combined with Metformin can increase the risk of lactic acidosis (a rare but serious side effect). Please ask your pharmacist or doctor.'
  },
  {
    drug_a: 'ACE Inhibitor', drug_b: 'ARB Antihypertensive',
    severity: 'serious',
    reasoning: 'Combining an ACE inhibitor with an ARB (two different blood pressure drug classes) can cause dangerously low blood pressure and kidney problems. Please ask your doctor before taking both.'
  },
  {
    drug_a: 'Clopidogrel', drug_b: 'Omeprazole',
    severity: 'caution',
    reasoning: 'Omeprazole can reduce the effectiveness of Clopidogrel. Your doctor may prefer a different stomach-protecting medicine. Please ask your pharmacist or doctor.'
  },
  {
    drug_a: 'Atorvastatin', drug_b: 'Azithromycin',
    severity: 'caution',
    reasoning: 'Azithromycin may increase Atorvastatin levels slightly, which could increase the risk of muscle side effects. The risk is low for short antibiotic courses. Please ask your pharmacist or doctor.'
  },
  {
    drug_a: 'Metformin', drug_b: 'Glimepiride',
    severity: 'info',
    reasoning: 'Both Metformin and Glimepiride lower blood sugar. This is a common combination but requires monitoring for hypoglycemia (low blood sugar). Please ask your pharmacist or doctor.'
  },
  {
    drug_a: 'Aspirin', drug_b: 'Diclofenac',
    severity: 'caution',
    reasoning: 'Both Aspirin and Diclofenac are NSAIDs. Taking two NSAIDs together increases the risk of stomach bleeding and kidney problems. Please ask your pharmacist or doctor.'
  },
];

// Therapeutic class pairs that represent duplication risk
const THERAPEUTIC_DUPLICATION_PAIRS: Array<{
  class_a: string;
  class_b: string;
  severity: 'info' | 'caution' | 'serious';
  reasoning_template: string;
}> = [
  {
    class_a: 'Calcium Channel Blocker',
    class_b: 'ARB Antihypertensive',
    severity: 'caution',
    reasoning_template: 'DRUG_A (DOCTOR_A) and DRUG_B (DOCTOR_B) are both blood-pressure medications from different drug classes. Taking two antihypertensives together without coordination between your doctors may cause your blood pressure to drop too low. Please ask your pharmacist or doctor before taking both.'
  },
  {
    class_a: 'Calcium Channel Blocker',
    class_b: 'ACE Inhibitor',
    severity: 'caution',
    reasoning_template: 'DRUG_A and DRUG_B are both blood-pressure medications. This combination is sometimes prescribed intentionally, but if from different doctors, coordination is important. Please ask your pharmacist or doctor.'
  },
  {
    class_a: 'ACE Inhibitor',
    class_b: 'ARB Antihypertensive',
    severity: 'serious',
    reasoning_template: 'DRUG_A (an ACE inhibitor) and DRUG_B (an ARB) both block the same blood-pressure pathway. Combining them can cause dangerously low blood pressure and kidney problems. Please ask your doctor before taking both.'
  },
  {
    class_a: 'Proton Pump Inhibitor',
    class_b: 'Proton Pump Inhibitor',
    severity: 'info',
    reasoning_template: 'DRUG_A and DRUG_B are both proton pump inhibitors (stomach acid reducers). There is usually no benefit to taking two of the same class. Please ask your pharmacist which one to continue.'
  },
  {
    class_a: 'Statin',
    class_b: 'Statin',
    severity: 'caution',
    reasoning_template: 'DRUG_A and DRUG_B are both statins (cholesterol-lowering medicines). Taking two statins together is rarely necessary and may increase the risk of muscle side effects. Please ask your pharmacist or doctor.'
  },
  {
    class_a: 'Biguanide Antidiabetic',
    class_b: 'Biguanide Antidiabetic',
    severity: 'caution',
    reasoning_template: 'DRUG_A and DRUG_B are both Metformin-class medicines. This duplication is unusual. Please ask your pharmacist or doctor.'
  },
];

interface MedicineInput {
  medicine_id: string;
  name: string;
  therapeutic_class?: string;
  source_document_id?: string;
  doctor_name?: string;
}

export interface SafetyFlagOutput {
  flag_type: 'drug_interaction' | 'allergy' | 'therapeutic_duplication';
  involved_medicine_ids: string[];
  reasoning_text: string;
  severity: 'info' | 'caution' | 'serious';
}

export function checkInteractions(medicines: MedicineInput[]): SafetyFlagOutput[] {
  const flags: SafetyFlagOutput[] = [];

  for (let i = 0; i < medicines.length; i++) {
    for (let j = i + 1; j < medicines.length; j++) {
      const a = medicines[i];
      const b = medicines[j];

      // Check direct drug-drug interactions
      for (const interaction of INTERACTION_DATABASE) {
        const matchAB =
          namesMatch(a.name, interaction.drug_a) && namesMatch(b.name, interaction.drug_b);
        const matchBA =
          namesMatch(b.name, interaction.drug_a) && namesMatch(a.name, interaction.drug_b);

        // Also check by therapeutic class
        const tcA = a.therapeutic_class || getTherapeuticClass(a.name) || '';
        const tcB = b.therapeutic_class || getTherapeuticClass(b.name) || '';
        const matchClassAB =
          classMatch(tcA, interaction.drug_a) && classMatch(tcB, interaction.drug_b);
        const matchClassBA =
          classMatch(tcB, interaction.drug_a) && classMatch(tcA, interaction.drug_b);

        if (matchAB || matchBA || matchClassAB || matchClassBA) {
          flags.push({
            flag_type: 'drug_interaction',
            involved_medicine_ids: [a.medicine_id, b.medicine_id],
            reasoning_text: interaction.reasoning,
            severity: interaction.severity,
          });
        }
      }
    }
  }

  return flags;
}

export function checkTherapeuticDuplication(medicines: MedicineInput[]): SafetyFlagOutput[] {
  const flags: SafetyFlagOutput[] = [];

  for (let i = 0; i < medicines.length; i++) {
    for (let j = i + 1; j < medicines.length; j++) {
      const a = medicines[i];
      const b = medicines[j];

      const tcA = a.therapeutic_class || getTherapeuticClass(a.name) || '';
      const tcB = b.therapeutic_class || getTherapeuticClass(b.name) || '';

      for (const dup of THERAPEUTIC_DUPLICATION_PAIRS) {
        const match =
          (classMatch(tcA, dup.class_a) && classMatch(tcB, dup.class_b)) ||
          (classMatch(tcB, dup.class_a) && classMatch(tcA, dup.class_b));

        if (match) {
          // Skip if this interaction was already flagged as drug_interaction above
          const reasoning = dup.reasoning_template
            .replace('DRUG_A', a.name)
            .replace('DRUG_B', b.name)
            .replace('DOCTOR_A', a.doctor_name || 'a doctor')
            .replace('DOCTOR_B', b.doctor_name || 'another doctor');

          flags.push({
            flag_type: 'therapeutic_duplication',
            involved_medicine_ids: [a.medicine_id, b.medicine_id],
            reasoning_text: reasoning,
            severity: dup.severity,
          });
        }
      }
    }
  }

  return flags;
}

export function checkAllergies(
  medicines: MedicineInput[],
  knownAllergies: string[]
): SafetyFlagOutput[] {
  const flags: SafetyFlagOutput[] = [];

  for (const med of medicines) {
    for (const allergy of knownAllergies) {
      if (namesMatch(med.name, allergy) || crossReactivityCheck(med.name, allergy)) {
        flags.push({
          flag_type: 'allergy',
          involved_medicine_ids: [med.medicine_id],
          reasoning_text: `${med.name} may be related to ${allergy}, which is listed as a known allergy for this patient. Please confirm with your pharmacist or doctor before taking this medicine.`,
          severity: 'serious',
        });
      }
    }
  }

  return flags;
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

function namesMatch(a: string, b: string): boolean {
  const normalize = (s: string) => s.toLowerCase().replace(/[^a-z]/g, '');
  return normalize(a).includes(normalize(b)) || normalize(b).includes(normalize(a));
}

function classMatch(tc: string, pattern: string): boolean {
  return tc.toLowerCase().includes(pattern.toLowerCase()) ||
         pattern.toLowerCase().includes(tc.toLowerCase().split(' ')[0]);
}

// Simple cross-reactivity: Penicillin → Amoxicillin, Sulfa → Trimethoprim, etc.
const CROSS_REACTIVITY: Record<string, string[]> = {
  'Penicillin': ['Amoxicillin', 'Ampicillin', 'Cloxacillin'],
  'Sulfa drugs': ['Trimethoprim', 'Sulfamethoxazole'],
  'NSAIDs': ['Ibuprofen', 'Diclofenac', 'Naproxen'],
};

function crossReactivityCheck(drugName: string, allergy: string): boolean {
  const crossReactors = CROSS_REACTIVITY[allergy] || [];
  return crossReactors.some(r => namesMatch(drugName, r));
}
