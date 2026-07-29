const ngrok = require('@ngrok/ngrok');

(async function() {
  try {
    const listener = await ngrok.forward({
      addr: 3001,
      authtoken: '3H8WWNUVp7Nlj95sxNFhRIQ6tUK_5RXeCdmfiwwsdXBQ1eCao'
    });
    const url = listener.url();
    console.log('==================================================');
    console.log('🚀 NGROK PUBLIC TUNNEL URL:', url);
    console.log('👉 META WEBHOOK CALLBACK URL:', `${url}/api/whatsapp/webhook`);
    console.log('==================================================');
  } catch (e) {
    console.error('Ngrok tunnel error:', e);
  }
})();
