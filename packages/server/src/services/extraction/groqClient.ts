/**
 * SpashtCare — Groq API Multimodal Client
 * Ultra-fast inference with Llama 3.2 11B Vision & Llama 3.3 70B Versatile
 */

import fs from 'fs';
import { ExtractionResult } from './geminiClient';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export async function extractFromImageWithGroq(imagePath: string): Promise<ExtractionResult> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey === 'your_groq_api_key_here') {
    throw new Error('GROQ_API_KEY environment variable not configured in .env');
  }

  let base64Image = '';
  try {
    const fileData = fs.readFileSync(imagePath);
    base64Image = fileData.toString('base64');
  } catch (e: any) {
    throw new Error(`Failed to read image file at ${imagePath}: ${e.message}`);
  }

  const promptText = `You are a medical prescription reader. Analyze this prescription image and extract ALL fields.
Return a JSON object with this structure:
{
  "raw_text": "complete verbatim OCR of the image",
  "doctor_name": "doctor name if visible",
  "hospital_name": "hospital/clinic name if visible",
  "prescription_date": "YYYY-MM-DD or null",
  "overall_legibility": 80,
  "fields": [
    {
      "field_type": "drug_name|dosage|frequency|duration|follow_up_date|instruction",
      "raw_value": "exact read",
      "normalized_value": "standard interpretation",
      "confidence_score": 90,
      "reasoning": "confidence explanation"
    }
  ]
}
Return raw valid JSON only.`;

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.2-11b-vision-instruct',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: promptText },
              { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64Image}` } }
            ]
          }
        ],
        temperature: 0.2,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Groq HTTP ${response.status}: ${errText}`);
    }

    const data = await response.json() as any;
    const content = data.choices[0].message.content;
    const parsed = JSON.parse(content);
    return parsed as ExtractionResult;
  } catch (e: any) {
    console.error('[Groq Vision Error]', e.message);
    throw new Error(`Groq Vision Extraction Failed: ${e.message}`);
  }
}

