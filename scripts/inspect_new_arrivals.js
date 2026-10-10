import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const USER_DATA = path.join(process.env.TEMP || 'C:\\Temp', 'chrome_arrivals_test_' + Date.now());
const PORT = 9260;

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
    if (res.exceptionDetails) {
      console.error('Eval error:', res.exceptionDetails.exception?.description || res.exceptionDetails);
    }
    return res.result?.value;
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function run() {
  console.log('Inspecting live website New Arrivals on mobile...');
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

  await delay(1500);

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
      await delay(300);
    }
  }

  if (!wsUrl) {
    console.error('Failed to get WebSocket debugger URL');
    chrome.kill();
    return;
  }

  const client = new CDPClient(wsUrl);
  await client.connect();

  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 360,
    height: 740,
    deviceScaleFactor: 2,
    mobile: true,
  });

  await client.send('Page.enable');
  await client.send('Page.navigate', { url: 'http://localhost:4173/' });
  await delay(3000);

  const pageInfo = await client.eval(`({
    title: document.title,
    href: window.location.href,
    bodyLen: document.body.innerHTML.length,
    snippet: document.body.innerHTML.slice(0, 300),
    arrivalsEl: !!document.querySelector('#new-arrivals'),
    allIds: Array.from(document.querySelectorAll('[id]')).map(el => el.id)
  })`);
  console.log('Page info:', pageInfo);

  const arrivalsData = await client.eval(`(() => {
    const section = document.querySelector('#new-arrivals');
    if (!section) return { found: false };
    
    const banner = section.querySelector('.wakefit-arrivals-banner');
    const bgImg = section.querySelector('.wakefit-banner-bg-img');
    const cardsRow = section.querySelector('.wakefit-cards-row');
    const firstCard = section.querySelector('.wakefit-card');
    const firstCardImg = firstCard ? firstCard.querySelector('.wakefit-card-img') : null;
    const capsuleBar = section.querySelector('.wakefit-capsule-bar');

    return {
      found: true,
      bannerRect: banner ? banner.getBoundingClientRect() : null,
      bgImgVisible: bgImg ? {
        display: getComputedStyle(bgImg).display,
        opacity: getComputedStyle(bgImg).opacity,
        rect: bgImg.getBoundingClientRect(),
        src: bgImg.src
      } : null,
      capsuleBarRect: capsuleBar ? capsuleBar.getBoundingClientRect() : null,
      capsuleBarScrollWidth: capsuleBar ? capsuleBar.scrollWidth : null,
      capsuleBarClientWidth: capsuleBar ? capsuleBar.clientWidth : null,
      firstCardRect: firstCard ? firstCard.getBoundingClientRect() : null,
      firstCardImgComputed: firstCardImg ? {
        width: firstCardImg.clientWidth,
        height: firstCardImg.clientHeight,
        objectFit: getComputedStyle(firstCardImg).objectFit,
        objectPosition: getComputedStyle(firstCardImg).objectPosition,
        aspectRatio: getComputedStyle(firstCard.querySelector('.wakefit-card-img-wrap')).aspectRatio,
        src: firstCardImg.src,
        naturalWidth: firstCardImg.naturalWidth,
        naturalHeight: firstCardImg.naturalHeight
      } : null
    };
  })()`);

  console.log('Arrivals Data:', JSON.stringify(arrivalsData, null, 2));

  // Scroll into view of #new-arrivals
  await client.eval(`(() => {
    const el = document.querySelector('#new-arrivals');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  })()`);
  await delay(1000);

  const screenshot = await client.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scripts/new_arrivals_mobile.png', Buffer.from(screenshot.data, 'base64'));
  console.log('Saved screenshot to scripts/new_arrivals_mobile.png');

  // Scroll to show next cards
  await client.eval(`(() => {
    const row = document.querySelector('.wakefit-cards-row');
    if (row) row.scrollLeft = 320;
  })()`);
  await delay(600);

  const screenshotCards2 = await client.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scripts/new_arrivals_cards_2.png', Buffer.from(screenshotCards2.data, 'base64'));

  await client.eval(`(() => {
    const row = document.querySelector('.wakefit-cards-row');
    if (row) row.scrollLeft = 650;
  })()`);
  await delay(600);

  const screenshotCards3 = await client.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('scripts/new_arrivals_cards_3.png', Buffer.from(screenshotCards3.data, 'base64'));
  console.log('Saved additional cards screenshots');

  client.close();
  chrome.kill();
}

run().catch(console.error);
