/**
 * SpashtCare — Multilingual Translations Dictionary
 * Supports 6 major Indian languages: English, Hindi, Tamil, Telugu, Bengali, Marathi
 */

export type LanguageCode = 'en' | 'hi' | 'ta' | 'te' | 'bn' | 'mr';

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
  script: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', script: 'hi-IN', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', script: 'ta-IN', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', script: 'te-IN', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', script: 'bn-IN', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', script: 'mr-IN', flag: '🇮🇳' },
  { code: 'en', name: 'English', nativeName: 'English', script: 'en-US', flag: '🇬🇧' },
];

export interface TranslationDictionary {
  todaysMedicines: string;
  patientModeTitle: string;
  voiceReadout: string;
  taken: string;
  missed: string;
  beforeFood: string;
  withFood: string;
  afterFood: string;
  streakTitle: string;
  sosButton: string;
  sideEffectReport: string;
  reportDizziness: string;
  doctorVisitCountdown: string;
  voiceSummaryText: string;
  welcomeGreeting: string;
  consentMessage: string;
  consentYes: string;
  consentNo: string;
  uploadDrMehta: string;
  uploadDrSharma: string;
  inspectRetryLoop: string;
  viewVisualTimeline: string;
  recordSymptomNote: string;
  dosageReminder: string;
  sharePharmacist: string;
  viewEmergencyCard: string;
  safetyAlertText: string;
}

export const TRANSLATIONS: Record<LanguageCode, TranslationDictionary> = {
  hi: {
    todaysMedicines: 'आज की दवाइयां',
    patientModeTitle: 'बुजुर्ग मरीज मोड',
    voiceReadout: 'आवाज़ सुनें (Voice Note)',
    taken: 'ली (Done)',
    missed: 'नहीं ली (Missed)',
    beforeFood: 'खाना खाने से पहले 🥣',
    withFood: 'खाना खाने के साथ 🍲',
    afterFood: 'खाना खाने के बाद 🍵',
    streakTitle: '5-दिन लगातार खुराक! 🎉',
    sosButton: '🚨 केयरगिवर को कॉल करें (SOS)',
    sideEffectReport: 'चक्कर या घबराहट महसूस हो रही है? (रिपोर्ट करें)',
    reportDizziness: 'केयरगिवर को सूचित किया गया',
    doctorVisitCountdown: 'अगली डॉक्टर मुलाकात: 14 दिन में 🩺',
    voiceSummaryText: 'नमस्ते रमेश जी। आज आपको ३ दवाइयां लेनी हैं। एम्लोडिपाइन सुबह की खुराक ली जा चुकी है। मेटफॉर्मिन दोपहर खाने के साथ लें।',
    welcomeGreeting: '🙏 नमस्ते! मैं स्पष्टकेयर हूँ — मरीज रमेश कुमार के लिए देखभाल सहायक।',
    consentMessage: 'आगे बढ़ने से पहले, मुझे रमेश कुमार की पर्चियां पढ़ने और देखभाल रिमाइंडर भेजने की आपकी सहमति चाहिए।',
    consentYes: '✅ हाँ, मैं सहमत हूँ (सहमति प्रदान की)',
    consentNo: '❌ नहीं धन्यवाद',
    uploadDrMehta: '📸 डॉ. मेहता की पर्ची अपलोड करें (एम्लोडिपाइन)',
    uploadDrSharma: '📸 विशेषज्ञ डॉ. शर्मा की पर्ची अपलोड करें',
    inspectRetryLoop: '🔍 एजेंट रीट्राई लूप की जांच करें',
    viewVisualTimeline: '📅 दृश्य टाइमलाइन देखें',
    recordSymptomNote: '🎤 लक्षण की आवाज नोट दर्ज करें ("कल से चक्कर आ रहे हैं")',
    dosageReminder: '⏰ खुराक रिमाइंडर: कृपया दवा लेने के बाद सूचित करें',
    sharePharmacist: '📲 फार्मासिस्ट के साथ केस साझा करें',
    viewEmergencyCard: '💳 आपातकालीन कार्ड देखें',
    safetyAlertText: '⚠️ सुरक्षा चेतावनी: दो समान बीपी दवाएं (एम्लोडिपाइन और टेल्मीसार्टन) एक साथ न लें।'
  },
  ta: {
    todaysMedicines: 'இன்றைய மருந்துகள்',
    patientModeTitle: 'முதியோர் நோயாளி முறைமை',
    voiceReadout: 'குரல் குறிப்பு (Voice Note)',
    taken: 'எடுத்துக்கொண்டேன் (Done)',
    missed: 'எடுக்கவில்லை (Missed)',
    beforeFood: 'உணவுக்கு முன் 🥣',
    withFood: 'உணவுடன் 🍲',
    afterFood: 'உணவுக்கு பின் 🍵',
    streakTitle: '5 நாட்கள் தொடர் மருந்து! 🎉',
    sosButton: '🚨 பராமரிப்பாளரை அழைக்கவும் (SOS)',
    sideEffectReport: 'மயக்கம் அல்லது அசௌகரியம் உள்ளதா?',
    reportDizziness: 'பராமரிப்பாளருக்கு அறிவிக்கப்பட்டது',
    doctorVisitCountdown: 'அடுத்த மருத்துவர் சந்திப்பு: 14 நாட்களில் 🩺',
    voiceSummaryText: 'வணக்கம் ரமேஷ். இன்று நீங்கள் 3 மருந்துகளை எடுத்துக்கொள்ள வேண்டும். ஆம்லோடிபைன் காலை உணவு முடிந்தது.',
    welcomeGreeting: '🙏 வணக்கம்! நான் ஸ்பஷ்ட்கேர் — ரமேஷ் குமாருக்கான பராமரிப்பு உதவியாளர்.',
    consentMessage: 'தொடர்வதற்கு முன், மருந்துக் குறிப்புகளைப் படிக்க அனுமதி வழங்கவும்.',
    consentYes: '✅ ஆம், நான் ஒப்புக்கொள்கிறேன்',
    consentNo: '❌ வேண்டாம்',
    uploadDrMehta: '📸 டாக்டர் மேத்தா மருந்துக் குறிப்பை பதிவேற்றவும்',
    uploadDrSharma: '📸 டாக்டர் சர்மா மருந்துக் குறிப்பை பதிவேற்றவும்',
    inspectRetryLoop: '🔍 மறுமுயற்சி சுழற்சியைப் பார்க்கவும்',
    viewVisualTimeline: '📅 காட்சி காலவரிசையைப் பார்க்கவும்',
    recordSymptomNote: '🎤 குரல் குறிப்பை பதிவு செய்யவும் ("நேற்றிலிருந்து மயக்கம்")',
    dosageReminder: '⏰ மருந்து நினைவூட்டல்: தயவுசெய்து உறுதிப்படுத்தவும்',
    sharePharmacist: '📲 மருந்தாளருடன் தகவலைப் பகிரவும்',
    viewEmergencyCard: '💳 அவசர அட்டையைப் பார்க்கவும்',
    safetyAlertText: '⚠️ பாதுகாப்பு எச்சரிக்கை: இரண்டு இரத்த அழுத்த மருந்துகளை ஒன்றாக எடுக்க வேண்டாம்.'
  },
  te: {
    todaysMedicines: 'ఈరోజు మందులు',
    patientModeTitle: 'వృద్ధ రోగి మోడ్',
    voiceReadout: 'వాయిస్ వినండి (Voice Note)',
    taken: 'తీసుకున్నాను (Done)',
    missed: 'తీసుకోలేదు (Missed)',
    beforeFood: 'భోజనానికి ముందు 🥣',
    withFood: 'భోజనంతో పాటు 🍲',
    afterFood: 'భోజనం తర్వాత 🍵',
    streakTitle: '5 రోజులు వరుసగా మందులు! 🎉',
    sosButton: '🚨 కేర్‌గివర్‌కి కాల్ చేయండి (SOS)',
    sideEffectReport: 'కళ్ళు తిరగడం లేదా అసౌకర్యంగా ఉందా?',
    reportDizziness: 'కేర్‌గివర్‌కి తెలియజేయబడింది',
    doctorVisitCountdown: 'తదుపరి డాక్టర్ కలయిక: 14 రోజుల్లో 🩺',
    voiceSummaryText: 'నమస్కారం రమేష్ గారు. ఈరోజు మీరు 3 మందులు తీసుకోవాలి.',
    welcomeGreeting: '🙏 నమస్కారం! నేను స్పష్టకేర్ — రమేష్ కుమార్ సంరక్షణ సహాయకుడిని.',
    consentMessage: 'కొనసాగడానికి ముందు, దయచేసి అనుమతిని అందించండి.',
    consentYes: '✅ అవును, నేను అంగీకరిస్తున్నాను',
    consentNo: '❌ అవసరం లేదు',
    uploadDrMehta: '📸 డాక్టర్ మెహతా ప్రిస్క్రిప్షన్ అప్‌లోడ్ చేయండి',
    uploadDrSharma: '📸 డాక్టర్ శర్మ ప్రిస్క్రిప్షన్ అప్‌లోడ్ చేయండి',
    inspectRetryLoop: '🔍 రీట్రై లూప్‌ని తనిఖీ చేయండి',
    viewVisualTimeline: '📅 టైమ్‌లైన్‌ని చూడండి',
    recordSymptomNote: '🎤 లక్షణ వాయిస్ నోట్‌ని రికార్డ్ చేయండి',
    dosageReminder: '⏰ మందుల రిమైండర్: దయచేసి ధృవీకరించండి',
    sharePharmacist: '📲 ఫార్మసిస్ట్‌తో షేర్ చేయండి',
    viewEmergencyCard: '💳 అత్యవసర కార్డును చూడండి',
    safetyAlertText: '⚠️ భద్రతా హెచ్చరిక: రెండు బిపి మందులను కలిపి తీసుకోకండి.'
  },
  bn: {
    todaysMedicines: 'আজকের ওষুধ',
    patientModeTitle: 'বয়স্ক রোগী মোড',
    voiceReadout: 'ভয়েস নোট শুনুন (Voice Note)',
    taken: 'খেয়েছি (Done)',
    missed: 'খাইনি (Missed)',
    beforeFood: 'খাবারের আগে 🥣',
    withFood: 'খাবারের সাথে 🍲',
    afterFood: 'খাবারের পরে 🍵',
    streakTitle: '৫ দিন টানা ওষুধ গ্রহণ! 🎉',
    sosButton: '🚨 কেয়ারগিভারকে কল করুন (SOS)',
    sideEffectReport: 'মাথা ঘোরা বা খারাপ লাগছে?',
    reportDizziness: 'কেয়ারগিভারকে জানানো হয়েছে',
    doctorVisitCountdown: 'পরবর্তী ডাক্তার সাক্ষাৎ: ১৪ দিনে 🩺',
    voiceSummaryText: 'নমস্কার রমেশ বাবু। আজ আপনাকে ৩টি ওষুধ খেতে হবে।',
    welcomeGreeting: '🙏 নমস্কার! আমি স্পষ্টকেয়ার — রমেশ বাবুর যত্ন সহকারী।',
    consentMessage: 'এগিয়ে যাওয়ার আগে, অনুগ্রহ করে অনুমতি প্রদান করুন।',
    consentYes: '✅ হ্যাঁ, আমি সম্মত',
    consentNo: '❌ না ধন্যবাদ',
    uploadDrMehta: '📸 ডঃ মেহতার প্রেসক্রিপশন আপলোড করুন',
    uploadDrSharma: '📸 ডঃ শর্মার প্রেসক্রিপশন আপলোড করুন',
    inspectRetryLoop: '🔍 এজেন্ট রিট্রাই লুপ পরীক্ষা করুন',
    viewVisualTimeline: '📅 ভিজ্যুয়াল টাইমলাইন দেখুন',
    recordSymptomNote: '🎤 লক্ষণের ভয়েস নোট রেকর্ড করুন',
    dosageReminder: '⏰ ওষুধের রিমাইন্ডার: দয়া করে নিশ্চিত করুন',
    sharePharmacist: '📲 ফার্মাসিস্টের সাথে শেয়ার করুন',
    viewEmergencyCard: '💳 জরুরি কার্ড দেখুন',
    safetyAlertText: '⚠️ সতর্কতা: দুটি ব্লাড প্রেসারের ওষুধ একসাথে খাবেন না।'
  },
  mr: {
    todaysMedicines: 'आजची औषधे',
    patientModeTitle: 'ज्येष्ठ रुग्ण मोड',
    voiceReadout: 'आवाज ऐका (Voice Note)',
    taken: 'घेतली (Done)',
    missed: 'नाही घेतली (Missed)',
    beforeFood: 'जेवणापूर्वी 🥣',
    withFood: 'जेवणासोबत 🍲',
    afterFood: 'जेवणानंतर 🍵',
    streakTitle: '५ दिवस सलग डोस! 🎉',
    sosButton: '🚨 केअरगिव्हरला कॉल करा (SOS)',
    sideEffectReport: 'चक्कर किंवा अस्वस्थ वाटत आहे का?',
    reportDizziness: 'केअरगिव्हरला कळवले गेले',
    doctorVisitCountdown: 'पुढील डॉक्टर भेट: १४ दिवसांत 🩺',
    voiceSummaryText: 'नमस्कार रमेश जी. आज तुम्हाला ३ औषधे घ्यायची आहेत.',
    welcomeGreeting: '🙏 नमस्कार! मी स्पष्टकेअर — रमेश कुमार यांच्यासाठी काळजी सहाय्यक.',
    consentMessage: 'पुढे जाण्यापूर्वी, कृपया तुमची संमती द्या.',
    consentYes: '✅ होय, मी सहमत आहे',
    consentNo: '❌ नको',
    uploadDrMehta: '📸 डॉ. मेहता यांची प्रिस्क्रिप्शन अपलोड करा',
    uploadDrSharma: '📸 डॉ. शर्मा यांची प्रिस्क्रिप्शन अपलोड करा',
    inspectRetryLoop: '🔍 एजंट रिट्राय लूप तपासा',
    viewVisualTimeline: '📅 व्हिज्युअल टाइमलाइन पहा',
    recordSymptomNote: '🎤 लक्षणांची व्हॉइस नोट नोंदवा',
    dosageReminder: '⏰ औषधांची आठवण: कृपया पुष्टी करा',
    sharePharmacist: '📲 फार्मसिस्टसोबत शेअर करा',
    viewEmergencyCard: '💳 आणीबाणी कार्ड पहा',
    safetyAlertText: '⚠️ सुरक्षा इशारा: दोन बीपीची औषधे एकत्र घेऊ नका.'
  },
  en: {
    todaysMedicines: "Today's Prescribed Medicines",
    patientModeTitle: 'Elderly Patient Simple Mode',
    voiceReadout: 'Listen to Voice Summary (Voice Note)',
    taken: 'Taken (Done)',
    missed: 'Missed',
    beforeFood: 'Before Meals 🥣',
    withFood: 'With Food / Meals 🍲',
    afterFood: 'After Meals 🍵',
    streakTitle: '5-Day Perfect Dose Streak! 🎉',
    sosButton: '🚨 Call Caregiver Instantly (SOS)',
    sideEffectReport: 'Feeling dizzy or unwell? Tap to alert caregiver',
    reportDizziness: 'Caregiver Notified Instantly',
    doctorVisitCountdown: 'Next Doctor Appointment: in 14 days 🩺',
    voiceSummaryText: 'Hello Ramesh Kumar. Today you have 3 scheduled doses. Amlodipine morning dose is complete. Metformin to be taken with meals.',
    welcomeGreeting: '🙏 Hello! I am SpashtCare — care continuity assistant for patient Ramesh Kumar.',
    consentMessage: 'Before we begin, I need your permission to read prescriptions and send care reminders for Ramesh Kumar.',
    consentYes: '✅ Yes, I agree (Grant Consent)',
    consentNo: '❌ No thanks',
    uploadDrMehta: '📸 Upload Dr. Mehta Prescription (Amlodipine)',
    uploadDrSharma: '📸 Upload Specialist Dr. Sharma Prescription',
    inspectRetryLoop: '🔍 Inspect Agent Retry Loop',
    viewVisualTimeline: '📅 View Visual Timeline',
    recordSymptomNote: '🎤 Record Symptom Note ("Dizzy since yesterday")',
    dosageReminder: '⏰ DOSAGE REMINDER: Please reply after taking your dose',
    sharePharmacist: '📲 Share Case with Pharmacist',
    viewEmergencyCard: '💳 View Emergency Card',
    safetyAlertText: '⚠️ SAFETY ALERT: Do not take two BP medications (Amlodipine and Telmisartan) together without doctor advice.'
  }
};
