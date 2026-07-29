/**
 * SpashtCare — Voice Note TTS Service
 * Synthesizes short plain-language voice explanations for regional languages (Hindi, Tamil, Telugu, etc.)
 */

export interface VoiceNoteRequest {
  text: string;
  language: string; // 'hi' | 'ta' | 'te' | 'bn' | 'en'
}

export interface VoiceNoteResult {
  audio_url: string;
  transcript: string;
  language: string;
  duration_seconds: number;
}

export async function generateVoiceNote(req: VoiceNoteRequest): Promise<VoiceNoteResult> {
  const languageNames: Record<string, string> = {
    hi: 'Hindi',
    ta: 'Tamil',
    te: 'Telugu',
    bn: 'Bengali',
    en: 'English',
  };

  const lang = req.language || 'hi';
  const langName = languageNames[lang] || 'Hindi';

  // Plain-language summary text formatted for speech
  const speechText = `नमस्ते। आपकी पर्ची की जानकारी: ${req.text}। कृपया किसी भी बदलाव से पहले अपने फार्मासिस्ट या डॉक्टर से संपर्क करें।`;

  // Return synthetic voice URL with Web Speech API browser fallback hint
  return {
    audio_url: `/api/voice/synth?lang=${lang}&text=${encodeURIComponent(req.text)}`,
    transcript: speechText,
    language: langName,
    duration_seconds: 8,
  };
}
