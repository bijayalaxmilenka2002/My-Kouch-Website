const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const USER_DATA = path.join(process.env.TEMP || 'C:\\Temp', 'chrome_table_test_' + Date.now());
const PORT = 9287;

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
  await send('Page.navigate', { url: 'https://mykouch.com/owner/login' });
  await delay(5000);

  await send('Runtime.evaluate', {
    expression: `document.querySelector('button[type="submit"]')?.click()`,
    returnByValue: true
  });
  await delay(3500);

  // Scroll to table
  await send('Runtime.evaluate', {
    expression: `document.querySelector('.dashboard-table-container')?.scrollIntoView({ behavior: 'instant', block: 'start' })`,
    returnByValue: true
  });
  await delay(1000);

  const screenshot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scripts/live_dashboard_table_mobile.png', Buffer.from(screenshot.data, 'base64'));
  console.log('Saved table screenshot');

  ws.close();
  chrome.kill();
}

run().catch(console.error);
