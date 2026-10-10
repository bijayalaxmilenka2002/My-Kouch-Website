import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const USER_DATA = path.join(process.env.TEMP || 'C:\\Temp', 'chrome_tab_test_' + Date.now());
const PORT = 9265;

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

  close() {
    if (this.ws) this.ws.close();
  }
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

  const client = new CDPClient(wsUrl);
  await client.connect();

  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true,
  });

  await client.send('Page.enable');
  await client.send('Page.navigate', { url: 'http://localhost:4173/' });
  await delay(2500);

  // Scroll to #new-arrivals
  await client.eval(`(() => {
    const el = document.querySelector('#new-arrivals');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  })()`);
  await delay(500);

  // Click on "Luxury Sofas" tab
  const clicked = await client.eval(`(() => {
    const btns = Array.from(document.querySelectorAll('.wakefit-capsule-item'));
    const sofaBtn = btns.find(b => b.textContent.includes('Luxury Sofas'));
    if (sofaBtn) {
      sofaBtn.click();
      return true;
    }
    return false;
  })()`);
  console.log('Clicked Luxury Sofas tab:', clicked);
  await delay(600);

  const screenshot = await client.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scripts/new_arrivals_luxury_sofas_tab.png', Buffer.from(screenshot.data, 'base64'));
  console.log('Saved screenshot scripts/new_arrivals_luxury_sofas_tab.png');

  client.close();
  chrome.kill();
}

run().catch(console.error);
