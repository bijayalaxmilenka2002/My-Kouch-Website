import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const USER_DATA = path.join(process.env.TEMP || 'C:\\Temp', 'chrome_scroll_test_' + Date.now());
const PORT = 9232;

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

async function test() {
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

    console.log('Navigating to http://localhost:5173/ ...');
    await cdp.send('Page.navigate', { url: 'http://localhost:5173/' });
    await delay(1800);

    // Scroll to very bottom
    console.log('Scrolling down to the end of the page...');
    await cdp.eval('window.scrollTo(0, document.body.scrollHeight)');
    await delay(800);

    const atBottom = await cdp.eval(`(() => {
      const h = document.querySelector('.site-header');
      const rect = h ? h.getBoundingClientRect() : null;
      return {
        scrollY: window.scrollY,
        className: h ? h.className : '',
        rect: rect ? { top: rect.top, bottom: rect.bottom, height: rect.height } : null,
        transform: h ? window.getComputedStyle(h).transform : null
      };
    })()`);
    console.log('State at Bottom:', atBottom);

    // Scroll up
    console.log('Scrolling UP from the end...');
    await cdp.eval('window.scrollBy(0, -350)');
    await delay(800);

    const afterScrollUp = await cdp.eval(`(() => {
      const h = document.querySelector('.site-header');
      const rect = h ? h.getBoundingClientRect() : null;
      return {
        scrollY: window.scrollY,
        className: h ? h.className : '',
        rect: rect ? { top: rect.top, bottom: rect.bottom, height: rect.height } : null,
        transform: h ? window.getComputedStyle(h).transform : null,
        position: h ? window.getComputedStyle(h).position : null
      };
    })()`);
    console.log('State after scrolling UP from bottom:', afterScrollUp);

    // Take a screenshot of the top viewport to verify navbar visibility
    const screenshot = await cdp.send('Page.captureScreenshot', { format: 'png' });
    const artifactDir = 'C:\\Users\\bijay\\.gemini\\antigravity-ide\\brain\\827afe67-eeac-423c-8dcd-ebad4cf16bfa';
    fs.writeFileSync(path.join(artifactDir, 'verified_scroll_up_from_bottom.png'), Buffer.from(screenshot.data, 'base64'));
    console.log('Screenshot saved to verified_scroll_up_from_bottom.png');

  } finally {
    if (cdp) cdp.close();
    chromeProc.kill('SIGKILL');
  }
}

test().catch(console.error);
