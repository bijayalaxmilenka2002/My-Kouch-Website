const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const USER_DATA = path.join(process.env.TEMP || 'C:\\Temp', 'chrome_audit_' + Date.now());
const PORT = 9270;

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

async function audit() {
  console.log('Starting responsiveness audit...');
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

  if (!wsUrl) {
    console.error('No wsUrl found');
    chrome.kill();
    return;
  }

  const client = new CDPClient(wsUrl);
  await client.connect();

  const routes = [
    'https://mykouch.com/',
    'https://mykouch.com/collections',
    'https://mykouch.com/about',
    'https://mykouch.com/contact',
    'https://mykouch.com/become-a-dealer',
    'https://mykouch.com/owner/login'
  ];

  const widths = [360, 390, 768];

  for (const route of routes) {
    console.log(`\n================ Testing ${route} ================`);
    await client.send('Page.navigate', { url: route });
    await delay(3500);

    for (const w of widths) {
      await client.send('Emulation.setDeviceMetricsOverride', {
        width: w,
        height: 800,
        deviceScaleFactor: 2,
        mobile: w < 768,
      });
      await delay(500);

      const check = await client.eval(`(() => {
        const docW = document.documentElement.scrollWidth;
        const winW = window.innerWidth;
        const bodyW = document.body.scrollWidth;
        
        // Find elements causing horizontal overflow
        const overflowingEls = [];
        document.querySelectorAll('*').forEach(el => {
          const rect = el.getBoundingClientRect();
          if (rect.right > winW + 1) {
            overflowingEls.push({
              tag: el.tagName,
              className: el.className ? (typeof el.className === 'string' ? el.className.slice(0, 50) : '') : '',
              id: el.id,
              right: Math.round(rect.right),
              width: Math.round(rect.width)
            });
          }
        });

        return {
          windowWidth: winW,
          docScrollWidth: docW,
          hasHorizontalScroll: docW > winW,
          overflowCount: overflowingEls.length,
          topOverflowElements: overflowingEls.slice(0, 5)
        };
      })()`);

      console.log(`Width ${w}px:`, JSON.stringify(check));
    }
  }

  client.close();
  chrome.kill();
}

audit().catch(console.error);
