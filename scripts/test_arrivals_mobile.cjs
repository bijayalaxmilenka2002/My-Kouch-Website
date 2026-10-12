const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const USER_DATA = path.join(process.env.TEMP || 'C:\\Temp', 'chrome_arrivals_snap_' + Date.now());
const PORT = 9295;

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

  await send('Page.navigate', { url: 'https://mykouch.com/' });
  await delay(6000);

  // Scroll to #new-arrivals
  await send('Runtime.evaluate', {
    expression: `(() => {
      const el = document.querySelector('#new-arrivals');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    })()`,
    returnByValue: true
  });
  await delay(1000);

  let snap = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scripts/arrivals_view_start.png', Buffer.from(snap.data, 'base64'));

  // Scroll 400px further down to see cards
  await send('Runtime.evaluate', {
    expression: `window.scrollBy(0, 350)`,
    returnByValue: true
  });
  await delay(1000);

  snap = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scripts/arrivals_view_cards.png', Buffer.from(snap.data, 'base64'));

  console.log('Saved arrivals_view_start.png and arrivals_view_cards.png');
  ws.close();
  chrome.kill();
}

run().catch(console.error);
