const ngrok = require('@ngrok/ngrok');
const fs = require('fs');
const path = require('path');

async function main() {
  try {
    const listener = await ngrok.forward({
      addr: 3001,
      authtoken: '3H8WWNUVp7Nlj95sxNFhRIQ6tUK_5RXeCdmfiwwsdXBQ1eCao'
    });

    const url = listener.url();
    const webhookUrl = `${url}/api/whatsapp/webhook`;
    const info = `==================================================\n🚀 LIVE NGROK TUNNEL URL: ${url}\n👉 META WEBHOOK CALLBACK URL: ${webhookUrl}\n==================================================\n`;

    console.log(info);
    fs.writeFileSync(path.join(__dirname, 'ngrok_url.txt'), info, 'utf8');

    // Keep process alive indefinitely for Webhook requests
    setInterval(() => {}, 1000 * 60 * 60);
  } catch (err) {
    console.error('Ngrok Error:', err);
    fs.writeFileSync(path.join(__dirname, 'ngrok_url.txt'), `Ngrok Error: ${err.message || err}`, 'utf8');
  }
}

main();
