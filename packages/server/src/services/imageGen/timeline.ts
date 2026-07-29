/**
 * SpashtCare — SVG & Image Generation Service
 * Renders SVG/Data URLs for Discharge Instruction Timelines and Emergency Cards (1080x1920 phone lock screen + wallet card).
 */

export interface TimelineStep {
  day: number;
  dateStr: string;
  title: string;
  description: string;
  type: 'medicine' | 'followup' | 'procedure' | 'warning';
}

export function generateTimelineSVG(steps: TimelineStep[], patientName: string): string {
  const width = 800;
  const stepHeight = 120;
  const headerHeight = 140;
  const footerHeight = 80;
  const height = headerHeight + steps.length * stepHeight + footerHeight;

  let stepsSVG = '';
  steps.forEach((step, index) => {
    const y = headerHeight + index * stepHeight;
    const isLast = index === steps.length - 1;
    const colorMap = {
      medicine: '#1F6F5C',
      followup: '#2D7DD2',
      procedure: '#D98B4E',
      warning: '#C4432B',
    };
    const color = colorMap[step.type] || '#1F6F5C';

    stepsSVG += `
      <!-- Connecting Line -->
      ${!isLast ? `<line x1="80" y1="${y + 35}" x2="80" y2="${y + stepHeight + 25}" stroke="#CBD5E1" stroke-width="4" stroke-dasharray="6 6" />` : ''}

      <!-- Node Circle -->
      <circle cx="80" cy="${y + 25}" r="22" fill="${color}" />
      <text x="80" y="${y + 31}" fill="#FFFFFF" font-family="sans-serif" font-weight="bold" font-size="14" text-anchor="middle">D${step.day}</text>

      <!-- Card Box -->
      <rect x="120" y="${y}" width="640" height="90" rx="12" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5" />
      <rect x="120" y="${y}" width="8" height="90" rx="4" fill="${color}" />

      <!-- Content -->
      <text x="145" y="${y + 32}" fill="#1A2421" font-family="sans-serif" font-weight="bold" font-size="18">${escapeXml(step.title)}</text>
      <text x="145" y="${y + 58}" fill="#5B6B66" font-family="sans-serif" font-size="15">${escapeXml(step.description)}</text>
      <text x="740" y="${y + 32}" fill="#94A3B8" font-family="monospace" font-size="14" text-anchor="end">${escapeXml(step.dateStr)}</text>
    `;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F7FAF9" />
      <stop offset="100%" stop-color="#E6F2EF" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="100%" height="100%" fill="url(#bgGrad)" />

  <!-- Header -->
  <rect x="0" y="0" width="${width}" height="100" fill="#1F6F5C" />
  <text x="40" y="45" fill="#FFFFFF" font-family="sans-serif" font-weight="bold" font-size="24">SpashtCare Care Timeline</text>
  <text x="40" y="75" fill="#E6F2EF" font-family="sans-serif" font-size="16">Patient: ${escapeXml(patientName)} | Discharge & Prescription Schedule</text>

  <!-- Steps -->
  ${stepsSVG}

  <!-- Footer Disclaimer -->
  <rect x="0" y="${height - 60}" width="${width}" height="60" fill="#1A2421" />
  <text x="40" y="${height - 25}" fill="#CBD5E1" font-family="sans-serif" font-size="12">
    SpashtCare reads &amp; organizes your doctor's prescription. Not medical advice — confirm with your pharmacist.
  </text>
</svg>`;
}

export function generateEmergencyCardSVG(patient: {
  name: string;
  age: number;
  blood_group?: string;
  known_allergies: string[];
  active_medicines: string[];
  caregiver_name: string;
  caregiver_phone: string;
}, mode: 'lockscreen' | 'wallet' = 'lockscreen'): string {
  if (mode === 'wallet') {
    return generateWalletCardSVG(patient);
  }

  // 1080 x 1920 Phone Lock Screen format
  const width = 1080;
  const height = 1920;

  const allergyList = patient.known_allergies.length > 0 ? patient.known_allergies.join(', ') : 'None Reported';
  const medListSVG = patient.active_medicines.map((m, i) => `
    <rect x="100" y="${920 + i * 90}" width="880" height="70" rx="16" fill="#FFFFFF" opacity="0.15"/>
    <circle cx="140" cy="${955 + i * 90}" r="10" fill="#D98B4E"/>
    <text x="170" y="${963 + i * 90}" fill="#FFFFFF" font-family="sans-serif" font-weight="600" font-size="34">${escapeXml(m)}</text>
  `).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="cardBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1A2421" />
      <stop offset="50%" stop-color="#1F6F5C" />
      <stop offset="100%" stop-color="#0F382F" />
    </linearGradient>
  </defs>

  <rect width="${width}" height="${height}" fill="url(#cardBg)" />

  <!-- Top Banner -->
  <rect x="0" y="0" width="${width}" height="240" fill="#C4432B" />
  <text x="540" y="140" fill="#FFFFFF" font-family="sans-serif" font-weight="900" font-size="52" text-anchor="middle">EMERGENCY MEDICAL CARD</text>
  <text x="540" y="195" fill="#FFEBE9" font-family="sans-serif" font-weight="500" font-size="30" text-anchor="middle">In case of emergency, show this screen</text>

  <!-- Patient Details Box -->
  <rect x="80" y="290" width="920" height="420" rx="32" fill="#FFFFFF" />
  
  <text x="140" y="370" fill="#5B6B66" font-family="sans-serif" font-size="28" font-weight="600">PATIENT NAME</text>
  <text x="140" y="430" fill="#1A2421" font-family="sans-serif" font-size="56" font-weight="800">${escapeXml(patient.name)}</text>

  <text x="140" y="520" fill="#5B6B66" font-family="sans-serif" font-size="26" font-weight="600">AGE / BLOOD GROUP</text>
  <text x="140" y="575" fill="#1A2421" font-family="sans-serif" font-size="44" font-weight="700">${patient.age} Yrs | Blood: <tspan fill="#C4432B">${patient.blood_group || 'Unknown'}</tspan></text>

  <text x="600" y="520" fill="#5B6B66" font-family="sans-serif" font-size="26" font-weight="600">KNOWN ALLERGIES</text>
  <text x="600" y="575" fill="#C4432B" font-family="sans-serif" font-size="38" font-weight="700">${escapeXml(allergyList)}</text>

  <!-- Active Medications Header -->
  <text x="100" y="860" fill="#E6F2EF" font-family="sans-serif" font-weight="700" font-size="38">CURRENT ACTIVE MEDICATIONS (${patient.active_medicines.length})</text>
  ${medListSVG}

  <!-- Emergency Contact Box -->
  <rect x="80" y="1520" width="920" height="240" rx="32" fill="#D98B4E" />
  <text x="130" y="1580" fill="#FFFFFF" font-family="sans-serif" font-size="28" font-weight="700">EMERGENCY CONTACT (CAREGIVER)</text>
  <text x="130" y="1640" fill="#FFFFFF" font-family="sans-serif" font-size="48" font-weight="800">${escapeXml(patient.caregiver_name)}</text>
  <text x="130" y="1710" fill="#FFFFFF" font-family="monospace" font-size="44" font-weight="700">${escapeXml(patient.caregiver_phone)}</text>

  <!-- Footer Disclaimer -->
  <text x="540" y="1860" fill="#A0AEC0" font-family="sans-serif" font-size="22" text-anchor="middle">Powered by SpashtCare — Non-diagnostic care continuity record</text>
</svg>`;
}

function generateWalletCardSVG(patient: any): string {
  const width = 1000;
  const height = 600;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" rx="24" fill="#FFFFFF" stroke="#1F6F5C" stroke-width="8" />
  <rect x="0" y="0" width="${width}" height="110" fill="#1F6F5C" rx="16" />
  <text x="40" y="68" fill="#FFFFFF" font-family="sans-serif" font-weight="bold" font-size="36">SpashtCare Emergency Wallet Card</text>
  
  <text x="40" y="170" fill="#5B6B66" font-size="20">NAME:</text>
  <text x="130" y="170" fill="#1A2421" font-weight="bold" font-size="26">${escapeXml(patient.name)} (${patient.age}y)</text>

  <text x="550" y="170" fill="#5B6B66" font-size="20">BLOOD TYPE:</text>
  <text x="700" y="170" fill="#C4432B" font-weight="bold" font-size="26">${patient.blood_group || 'N/A'}</text>

  <text x="40" y="230" fill="#5B6B66" font-size="20">ALLERGIES:</text>
  <text x="170" y="230" fill="#C4432B" font-weight="bold" font-size="22">${escapeXml(patient.known_allergies.join(', ') || 'None')}</text>

  <text x="40" y="290" fill="#5B6B66" font-size="20">MEDICINES:</text>
  <text x="170" y="290" fill="#1A2421" font-size="20">${escapeXml(patient.active_medicines.slice(0, 4).join(', '))}</text>

  <rect x="40" y="440" width="920" height="110" rx="16" fill="#F7FAF9" stroke="#E2E8F0" />
  <text x="70" y="480" fill="#5B6B66" font-size="18">EMERGENCY CONTACT:</text>
  <text x="70" y="520" fill="#1F6F5C" font-weight="bold" font-size="26">${escapeXml(patient.caregiver_name)} — ${escapeXml(patient.caregiver_phone)}</text>
</svg>`;
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}
