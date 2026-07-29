/**
 * SpashtCare — Drug Database Fuzzy Matcher
 * Uses fuse.js for phonetic/partial drug name matching in Step 3 of the FSM
 */

import Fuse from 'fuse.js';

// Curated drug name list — common Indian medications + generic names
// Source: WHO Essential Medicines List + Jan Aushadhi formulary (open data)
const DRUG_DATABASE: Array<{ name: string; therapeutic_class: string; common_brands: string[] }> = [
  // Cardiovascular
  { name: 'Amlodipine', therapeutic_class: 'Calcium Channel Blocker', common_brands: ['Amlokind', 'Amlong', 'Stamlo'] },
  { name: 'Telmisartan', therapeutic_class: 'ARB Antihypertensive', common_brands: ['Telma', 'Telmikind', 'Telista'] },
  { name: 'Atenolol', therapeutic_class: 'Beta Blocker', common_brands: ['Aten', 'Tenormin'] },
  { name: 'Ramipril', therapeutic_class: 'ACE Inhibitor', common_brands: ['Cardace', 'Ramistar'] },
  { name: 'Losartan', therapeutic_class: 'ARB Antihypertensive', common_brands: ['Losium', 'Repace'] },
  { name: 'Enalapril', therapeutic_class: 'ACE Inhibitor', common_brands: ['Enam', 'Envas'] },
  { name: 'Metoprolol', therapeutic_class: 'Beta Blocker', common_brands: ['Metolar', 'Seloken'] },
  { name: 'Furosemide', therapeutic_class: 'Loop Diuretic', common_brands: ['Lasix', 'Fruco'] },
  { name: 'Aspirin', therapeutic_class: 'Antiplatelet / NSAID', common_brands: ['Ecosprin', 'Disprin'] },
  { name: 'Clopidogrel', therapeutic_class: 'Antiplatelet', common_brands: ['Clopivas', 'Plavix'] },
  { name: 'Rosuvastatin', therapeutic_class: 'Statin', common_brands: ['Rozavel', 'Crestor'] },
  { name: 'Atorvastatin', therapeutic_class: 'Statin', common_brands: ['Atorva', 'Lipitor', 'Storvas'] },

  // Diabetes
  { name: 'Metformin', therapeutic_class: 'Biguanide Antidiabetic', common_brands: ['Glycomet', 'Glucophage', 'Gluconorm'] },
  { name: 'Glimepiride', therapeutic_class: 'Sulfonylurea', common_brands: ['Glimisave', 'Amaryl'] },
  { name: 'Sitagliptin', therapeutic_class: 'DPP-4 Inhibitor', common_brands: ['Januvia', 'Istamet'] },
  { name: 'Dapagliflozin', therapeutic_class: 'SGLT2 Inhibitor', common_brands: ['Forxiga', 'Dapacept'] },
  { name: 'Insulin Glargine', therapeutic_class: 'Long-acting Insulin', common_brands: ['Lantus', 'Basalog'] },

  // Pain / Anti-inflammatory
  { name: 'Ibuprofen', therapeutic_class: 'NSAID', common_brands: ['Brufen', 'Combiflam'] },
  { name: 'Diclofenac', therapeutic_class: 'NSAID', common_brands: ['Voveran', 'Voltaren'] },
  { name: 'Paracetamol', therapeutic_class: 'Analgesic / Antipyretic', common_brands: ['Crocin', 'Dolo', 'Tylenol'] },
  { name: 'Tramadol', therapeutic_class: 'Opioid Analgesic', common_brands: ['Ultracet', 'Tramazac'] },

  // Gastrointestinal
  { name: 'Pantoprazole', therapeutic_class: 'Proton Pump Inhibitor', common_brands: ['Pan-D', 'Pantocid', 'Pantop'] },
  { name: 'Omeprazole', therapeutic_class: 'Proton Pump Inhibitor', common_brands: ['Omez', 'Prilosec'] },
  { name: 'Rabeprazole', therapeutic_class: 'Proton Pump Inhibitor', common_brands: ['Razo', 'Rablet'] },
  { name: 'Domperidone', therapeutic_class: 'Prokinetic', common_brands: ['Domstal', 'Motilium'] },

  // Antibiotics
  { name: 'Amoxicillin', therapeutic_class: 'Penicillin Antibiotic', common_brands: ['Mox', 'Trimox'] },
  { name: 'Azithromycin', therapeutic_class: 'Macrolide Antibiotic', common_brands: ['Azithral', 'Zithromax'] },
  { name: 'Ciprofloxacin', therapeutic_class: 'Fluoroquinolone Antibiotic', common_brands: ['Ciplox', 'Cifran'] },
  { name: 'Cefixime', therapeutic_class: 'Cephalosporin Antibiotic', common_brands: ['Taxim-O', 'Zifi'] },
  { name: 'Doxycycline', therapeutic_class: 'Tetracycline Antibiotic', common_brands: ['Doxt', 'Vibramycin'] },

  // Thyroid
  { name: 'Levothyroxine', therapeutic_class: 'Thyroid Hormone', common_brands: ['Thyronorm', 'Eltroxin'] },

  // Respiratory
  { name: 'Salbutamol', therapeutic_class: 'Beta2 Agonist Bronchodilator', common_brands: ['Asthalin', 'Ventolin'] },
  { name: 'Montelukast', therapeutic_class: 'Leukotriene Antagonist', common_brands: ['Montair', 'Singulair'] },
  { name: 'Budesonide', therapeutic_class: 'Inhaled Corticosteroid', common_brands: ['Budecort', 'Pulmicort'] },

  // Neurological / Psychiatric
  { name: 'Alprazolam', therapeutic_class: 'Benzodiazepine', common_brands: ['Alprax', 'Restyl'] },
  { name: 'Sertraline', therapeutic_class: 'SSRI Antidepressant', common_brands: ['Zosert', 'Serlift'] },
  { name: 'Pregabalin', therapeutic_class: 'Anticonvulsant / Neuropathic Pain', common_brands: ['Lyrica', 'Pregeb'] },

  // Vitamins / Supplements (commonly prescribed)
  { name: 'Vitamin D3', therapeutic_class: 'Vitamin / Supplement', common_brands: ['Calcirol', 'D-Rise', 'Uprise-D3'] },
  { name: 'Calcium Carbonate', therapeutic_class: 'Mineral Supplement', common_brands: ['Shelcal', 'Calcimax'] },
  { name: 'Vitamin B12', therapeutic_class: 'Vitamin / Supplement', common_brands: ['Methylcobal', 'Cobadex'] },
];

// Flatten for Fuse indexing
const searchIndex = DRUG_DATABASE.flatMap(drug => [
  { name: drug.name, therapeutic_class: drug.therapeutic_class, source: 'generic' },
  ...drug.common_brands.map(brand => ({ name: brand, therapeutic_class: drug.therapeutic_class, source: 'brand' }))
]);

const fuse = new Fuse(searchIndex, {
  keys: ['name'],
  threshold: 0.5,       // 0=exact, 1=match anything — 0.5 is good for typos
  includeScore: true,
  minMatchCharLength: 3,
});

export interface DrugMatch {
  name: string;
  therapeutic_class: string;
  score: number;  // 0-1, lower is better match
  source: 'generic' | 'brand';
}

export function fuzzyMatchDrug(query: string): DrugMatch[] {
  // Clean the query — remove dosage numbers if present
  const cleaned = query.replace(/\d+\s*(mg|ml|mcg|iu|units?)/gi, '').trim();
  const results = fuse.search(cleaned, { limit: 5 });
  
  return results.map(r => ({
    name: r.item.name,
    therapeutic_class: r.item.therapeutic_class,
    score: r.score ?? 1,
    source: r.item.source as 'generic' | 'brand',
  }));
}

export function getTherapeuticClass(drugName: string): string | null {
  const matches = fuzzyMatchDrug(drugName);
  if (matches.length > 0 && matches[0].score < 0.3) {
    return matches[0].therapeutic_class;
  }
  return null;
}

export function getDrugDatabase() {
  return DRUG_DATABASE;
}
