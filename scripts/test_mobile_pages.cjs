const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const USER_DATA = path.join(process.env.TEMP || 'C:\\Temp', 'chrome_full_mobile_' + Date.now());
const PORT = 9290;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  const chrome = spawn(
    CHROME_PATH,
    [
      `--remote-debugging-port=${PORT}`,
      `--user-data-dir=${USER_DATA}`,
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      '--window-size=390,844',
    ],
    { stdio: 'ignore' }
  );

  await delay(1200);

  let wsUrl;
  for (let i = 0; i < 15; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json`);
      const tabs = await res.json();
      const pageTab = tabs && tabs.find((t) => t.type === 'page');
      if (pageTab?.webSocketDebuggerUrl) {
        wsUrl = pageTab.webSocketDebuggerUrl;
        break;
      }
    } catch {
      await delay(250);
    }
  }

  const ws = new WebSocket(wsUrl);
  await new Promise(r => ws.onopen = r);

  let id = 1;
  const send = (method, params = {}) => new Promise((resolve) => {
    const curId = id++;
    const handler = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === curId) {
        ws.removeEventListener('message', handler);
        resolve(msg.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id: curId, method, params }));
  });

  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true,
  });

  // 1. Home Top
  await send('Page.navigate', { url: 'https://mykouch.com/' });
  await delay(5000);
  let snap = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scripts/snap_home_hero.png', Buffer.from(snap.data, 'base64'));

  // Open mobile menu
  await send('Runtime.evaluate', {
    expression: `document.querySelector('.mobile-nav-toggle')?.click()`,
    returnByValue: true
  });
  await delay(600);
  snap = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scripts/snap_home_menu.png', Buffer.from(snap.data, 'base64'));

  // Close menu and scroll to offer banner
  await send('Runtime.evaluate', {
    expression: `(() => {
      document.querySelector('.mobile-drawer-close')?.click();
      const offer = document.querySelector('.promotional-offer-banner, .home-offer-section, #offer-banner');
      if (offer) offer.scrollIntoView({ behavior: 'instant', block: 'center' });
      else window.scrollTo(0, 1800);
    })()`,
    returnByValue: true
  });
  await delay(800);
  snap = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scripts/snap_home_offer.png', Buffer.from(snap.data, 'base64'));

  // 2. Collections Page
  await send('Page.navigate', { url: 'https://mykouch.com/collections' });
  await delay(4000);
  snap = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scripts/snap_collections.png', Buffer.from(snap.data, 'base64'));

  // 3. Product Detail Page
  await send('Page.navigate', { url: 'https://mykouch.com/product/mykouch-royal-emerald-velvet-l-shape' });
  await delay(4000);
  snap = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scripts/snap_product_detail.png', Buffer.from(snap.data, 'base64'));

  console.log('All mobile audit snapshots taken!');
  ws.close();
  chrome.kill();
}

run().catch(console.error);
