import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

const envPaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(__dirname, '../../../.env'),
  path.resolve(__dirname, '../../../../.env')
];
for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  }
}

export async function sendMetaWhatsAppMessage(toPhoneNumber: string, textMessage: string) {
  const apiToken = process.env.WHATSAPP_API_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const recipientEnv = process.env.WHATSAPP_RECIPIENT_PHONE;

  if (!apiToken || apiToken === 'your_whatsapp_cloud_api_token_here' || !phoneNumberId || phoneNumberId === 'your_whatsapp_phone_number_id_here') {
    console.log('[WhatsApp API] Credentials unconfigured in .env — simulated delivery logged.');
    return { success: false, reason: 'unconfigured_credentials' };
  }

  const rawPhone = (recipientEnv && /\d{8,}/.test(recipientEnv)) ? recipientEnv : toPhoneNumber;
  let cleanPhone = rawPhone.replace(/[^\d]/g, '');
  if (!cleanPhone || cleanPhone.length < 8) {
    cleanPhone = '916385808165';
  }
  const url = `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`;

  try {
    console.log(`[WhatsApp Outbound] Sending message to ${cleanPhone} via Meta Cloud API...`);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: cleanPhone,
        type: 'text',
        text: { body: textMessage }
      })
    });

    const data = await response.json() as any;

    if (!response.ok) {
      console.warn('[WhatsApp Meta API Notice]', data.error?.message || response.statusText);
      // Fallback to sending standard template if outside 24h window
      if (data.error?.code === 131047 || data.error?.code === 470) {
        console.log('[WhatsApp Meta API] Attempting template message delivery...');
        await sendMetaWhatsAppTemplate(cleanPhone, apiToken, phoneNumberId);
      }
      return { success: false, error: data.error };
    }

    console.log('[WhatsApp Outbound Success] Message ID:', data.messages?.[0]?.id);
    return { success: true, messageId: data.messages?.[0]?.id };
  } catch (err: any) {
    console.error('[WhatsApp Outbound Error]', err.message);
    return { success: false, error: err.message };
  }
}

export async function sendMetaWhatsAppTemplate(toPhoneNumber: string, apiToken: string, phoneNumberId: string) {
  const url = `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: toPhoneNumber,
        type: 'template',
        template: {
          name: 'hello_world',
          language: { code: 'en_US' }
        }
      })
    });
    const data = await response.json();
    console.log('[WhatsApp Template Outbound]', response.ok ? 'Success' : data);
    return data;
  } catch (e: any) {
    console.error('[WhatsApp Template Error]', e.message);
  }
}
