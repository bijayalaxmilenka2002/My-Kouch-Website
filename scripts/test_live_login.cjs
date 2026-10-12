const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const USER_DATA = path.join(process.env.TEMP || 'C:\\Temp', 'chrome_login_test_' + Date.now());
const PORT = 9286;

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
        console.log('API RES:', msg.params.response.status, msg.params.response.headers?.['content-type'], u);
      }
    }
  });

  console.log('Navigating to https://mykouch.com/owner/login...');
  await send('Page.navigate', { url: 'https://mykouch.com/owner/login' });
  await delay(6000);

  // Click submit
  console.log('Submitting login form...');
  const res = await send('Runtime.evaluate', {
    expression: `(() => {
      const btn = document.querySelector('button[type="submit"]');
      if (btn) {
        btn.click();
        return 'clicked';
      }
      return 'not found';
    })()`,
    returnByValue: true
  });
  console.log('Submit click result:', res.result?.value);
  await delay(4000);

  const curUrl = await send('Runtime.evaluate', {
    expression: 'window.location.href',
    returnByValue: true
  });
  console.log('Current URL:', curUrl.result?.value);

  // Take screenshot of dashboard
  const screenshot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scripts/live_dashboard_mobile.png', Buffer.from(screenshot.data, 'base64'));
  console.log('Screenshot saved to scripts/live_dashboard_mobile.png');

  // Check what products and toggles are visible
  const info = await send('Runtime.evaluate', {
    expression: `(() => {
      const rows = Array.from(document.querySelectorAll('tr')).map(r => {
        const title = r.querySelector('strong')?.textContent?.trim();
        const switches = Array.from(r.querySelectorAll('.toggle-switch input')).map(s => s.checked);
        return { title, switches };
      }).filter(r => r.title);
      return { rowCount: rows.length, rows: rows.slice(0, 5) };
    })()`,
    returnByValue: true
  });
  console.log('Table rows:', JSON.stringify(info.result?.value, null, 2));

  // Now click a switch in the first row!
  console.log('Clicking a switch in the first row...');
  const clickRes = await send('Runtime.evaluate', {
    expression: `(() => {
      const sw = document.querySelector('.toggle-switch input');
      if (sw) {
        const was = sw.checked;
        sw.click();
        return { clicked: true, was, now: sw.checked };
      }
      return { clicked: false };
    })()`,
    returnByValue: true
  });
  console.log('Click switch result:', clickRes.result?.value);
  await delay(2000);

  // Now reload page!
  console.log('Reloading page to test persistence...');
  await send('Page.reload');
  await delay(5000);

  const afterReloadInfo = await send('Runtime.evaluate', {
    expression: `(() => {
      const rows = Array.from(document.querySelectorAll('tr')).map(r => {
        const title = r.querySelector('strong')?.textContent?.trim();
        const switches = Array.from(r.querySelectorAll('.toggle-switch input')).map(s => s.checked);
        return { title, switches };
      }).filter(r => r.title);
      return { rowCount: rows.length, rows: rows.slice(0, 5) };
    })()`,
    returnByValue: true
  });
  console.log('Table rows AFTER reload:', JSON.stringify(afterReloadInfo.result?.value, null, 2));

  ws.close();
  chrome.kill();
}

run().catch(console.error);
