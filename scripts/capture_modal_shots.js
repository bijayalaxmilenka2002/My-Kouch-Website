import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const USER_DATA = path.join(process.env.TEMP || 'C:\\Temp', 'chrome_ss_' + Date.now());
const PORT = 9224;
const artifactDir = 'C:\\Users\\bijay\\.gemini\\antigravity-ide\\brain\\827afe67-eeac-423c-8dcd-ebad4cf16bfa';

async function run() {
  const chromeProcess = spawn(
    CHROME_PATH,
    [
      '--headless=new',
      `--user-data-dir=${USER_DATA}`,
      `--remote-debugging-port=${PORT}`,
      '--disable-gpu',
      '--no-first-run',
      '--window-size=1440,900',
      'about:blank',
    ],
    { stdio: 'ignore' }
  );

  await new Promise((r) => setTimeout(r, 1500));
  const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
  const targets = await res.json();
  const page = targets[0];
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));

  let id = 1;
  const send = (method, params = {}) =>
    new Promise((resolve) => {
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

  const capture = async (name) => {
    const r = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactDir, name), Buffer.from(r.data, 'base64'));
  };

  await send('Page.enable');
  await send('Runtime.enable');

  // 1. Capture Customize Modal
  await send('Page.navigate', { url: 'http://localhost:5173/?modal=customize' });
  await new Promise((r) => setTimeout(r, 1800));
  await capture('tested_modal_customize.png');
  console.log('✓ Captured tested_modal_customize.png');

  // 2. Capture Enquiry Modal
  await send('Page.navigate', { url: 'http://localhost:5173/?modal=enquire' });
  await new Promise((r) => setTimeout(r, 1800));
  await capture('tested_modal_enquiry.png');
  console.log('✓ Captured tested_modal_enquiry.png');

  // 3. Capture Open Mobile Drawer
  await send('Emulation.setDeviceMetricsOverride', {
    width: 375,
    height: 812,
    deviceScaleFactor: 2,
    mobile: true,
  });
  await send('Page.navigate', { url: 'http://localhost:5173/?menu=open' });
  await new Promise((r) => setTimeout(r, 1800));
  await capture('tested_mobile_drawer_open.png');
  console.log('✓ Captured tested_mobile_drawer_open.png');

  ws.close();
  chromeProcess.kill();
  try {
    fs.rmSync(USER_DATA, { recursive: true, force: true });
  } catch (e) {}
}

run().catch(console.error);
