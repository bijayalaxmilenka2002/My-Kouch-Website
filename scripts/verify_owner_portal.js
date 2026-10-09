import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const USER_DATA = path.join(process.env.TEMP || 'C:\\Temp', 'chrome_owner_portal_' + Date.now());
const PORT = 9229;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.id = 1;
    this.callbacks = new Map();
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.onopen = () => resolve();
      this.ws.onerror = (err) => reject(err);
      this.ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id && this.callbacks.has(msg.id)) {
          const cb = this.callbacks.get(msg.id);
          this.callbacks.delete(msg.id);
          if (msg.error) cb.reject(new Error(msg.error.message));
          else cb.resolve(msg.result);
        }
      };
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.id++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async eval(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    return res.result?.value;
  }

  async captureScreenshot(filepath) {
    const res = await this.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(filepath, Buffer.from(res.data, 'base64'));
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function verifyOwnerPortal() {
  console.log('Navigating to Owner Login...');
  const chromeProc = spawn(CHROME_PATH, [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${USER_DATA}`,
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1440,900',
  ]);

  await delay(1200);

  let cdp;
  try {
    const targetsRes = await fetch(`http://localhost:${PORT}/json`);
    const targets = await targetsRes.json();
    const pageTarget = targets.find((t) => t.type === 'page') || targets[0];

    cdp = new CDPClient(pageTarget.webSocketDebuggerUrl);
    await cdp.connect();
    await cdp.send('Page.enable');

    console.log('Navigating to http://localhost:5173/owner/login ...');
    await cdp.send('Page.navigate', { url: 'http://localhost:5173/owner/login' });
    await delay(1800);

    // Click submit button since email & password are prefilled
    await cdp.eval(`
      (() => {
        const btn = document.querySelector('button[type="submit"]');
        if (btn) btn.click();
      })()
    `);
    await delay(2500);

    const currentUrl = await cdp.eval('window.location.href');
    console.log('Current URL after login:', currentUrl);

    const dashboardTitle = await cdp.eval(`
      document.querySelector('h1')?.textContent?.trim() || document.querySelector('.owner-title')?.textContent?.trim()
    `);
    console.log('Dashboard Title:', dashboardTitle);

    const artifactDir = 'C:\\Users\\bijay\\.gemini\\antigravity-ide\\brain\\827afe67-eeac-423c-8dcd-ebad4cf16bfa';
    const screenshotPath = path.join(artifactDir, 'verified_owner_portal_dashboard.png');
    await cdp.captureScreenshot(screenshotPath);
    console.log('📸 Owner Portal Dashboard screenshot saved to:', screenshotPath);
  } finally {
    if (cdp) cdp.close();
    chromeProc.kill('SIGKILL');
  }
}

verifyOwnerPortal().catch(console.error);
