const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const USER_DATA = path.join(process.env.TEMP || 'C:\\Temp', 'chrome_preview_test2_' + Date.now());
const PORT = 9315;

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
  await send('Network.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true,
  });

  ws.addEventListener('message', (event) => {
    const msg = JSON.parse(event.data);
    if (msg.method === 'Network.requestWillBeSent') {
      const u = msg.params.request.url;
      if (u.includes('/api/')) {
        console.log('API REQ:', msg.params.request.method, u);
      }
    }
    if (msg.method === 'Network.responseReceived') {
      const u = msg.params.response.url;
      if (u.includes('/api/')) {
        console.log('API RES:', msg.params.response.status, u);
      }
    }
  });

  console.log('Navigating to http://127.0.0.1:4173/owner/login...');
  await send('Page.navigate', { url: 'http://127.0.0.1:4173/owner/login' });
  await delay(2500);

  // Submit login
  console.log('Submitting login...');
  await send('Runtime.evaluate', {
    expression: `document.querySelector('button[type="submit"]')?.click()`,
    returnByValue: true
  });

  // Wait for /owner/dashboard
  for (let i = 0; i < 20; i++) {
    await delay(1000);
    const loc = await send('Runtime.evaluate', { expression: 'window.location.pathname', returnByValue: true });
    console.log(`Waiting for dashboard... Current: ${loc.result?.value}`);
    if (loc.result?.value === '/owner/dashboard') {
      break;
    }
  }

  await delay(2000);

  // Take screenshot of mobile dashboard
  let snap = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scripts/preview_dashboard_mobile.png', Buffer.from(snap.data, 'base64'));
  console.log('Saved scripts/preview_dashboard_mobile.png');

  // Scroll down to check mobile product cards
  await send('Runtime.evaluate', {
    expression: `window.scrollBy(0, 480)`,
    returnByValue: true
  });
  await delay(1000);

  snap = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scripts/preview_dashboard_cards.png', Buffer.from(snap.data, 'base64'));
  console.log('Saved scripts/preview_dashboard_cards.png');

  // Check mobile cards in DOM
  const cardsInfo = await send('Runtime.evaluate', {
    expression: `(() => {
      const cards = Array.from(document.querySelectorAll('.dashboard-mobile-card'));
      return {
        count: cards.length,
        firstCardTitle: cards[0]?.querySelector('.d-mobile-card-title')?.textContent,
        firstCardToggles: Array.from(cards[0]?.querySelectorAll('.toggle-switch input') || []).map(s => s.checked)
      };
    })()`,
    returnByValue: true
  });
  console.log('Mobile cards info:', JSON.stringify(cardsInfo.result?.value, null, 2));

  // Toggle "New Arrival" switch in first card!
  console.log('Toggling switch in first card...');
  const toggleRes = await send('Runtime.evaluate', {
    expression: `(() => {
      const sw = document.querySelector('.dashboard-mobile-card .toggle-switch input');
      if (sw) {
        const was = sw.checked;
        sw.click();
        return { was, now: sw.checked };
      }
      return null;
    })()`,
    returnByValue: true
  });
  console.log('Toggle result:', JSON.stringify(toggleRes.result?.value));
  await delay(2500);

  // Reload page to test persistence!
  console.log('Reloading preview page...');
  await send('Page.reload');
  await delay(5000);

  const afterReloadInfo = await send('Runtime.evaluate', {
    expression: `(() => {
      const cards = Array.from(document.querySelectorAll('.dashboard-mobile-card'));
      return {
        count: cards.length,
        firstCardTitle: cards[0]?.querySelector('.d-mobile-card-title')?.textContent,
        firstCardToggles: Array.from(cards[0]?.querySelectorAll('.toggle-switch input') || []).map(s => s.checked)
      };
    })()`,
    returnByValue: true
  });
  console.log('Mobile cards AFTER reload:', JSON.stringify(afterReloadInfo.result?.value, null, 2));

  ws.close();
  chrome.kill();
}

run().catch(console.error);
