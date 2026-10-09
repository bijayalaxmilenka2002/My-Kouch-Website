import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const USER_DATA = path.join(process.env.TEMP || 'C:\\Temp', 'chrome_review_test_' + Date.now());
const PORT = 9226;

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

async function verifyReviews() {
  console.log('===============================================================');
  console.log('       VERIFYING REVIEW & TESTIMONIALS SECTION ON LIVE SITE');
  console.log('===============================================================\n');

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
    await cdp.send('DOM.enable');

    console.log('Navigating to http://localhost:5173/ ...');
    await cdp.send('Page.navigate', { url: 'http://localhost:5173/' });
    await delay(2000);

    // Scroll down to testimonials section
    console.log('Locating testimonials section...');
    const sectionInfo = await cdp.eval(`
      (() => {
        const section = document.querySelector('.testimonials-section') || document.querySelector('#testimonials');
        if (!section) return { found: false };
        const rect = section.getBoundingClientRect();
        const cards = Array.from(section.querySelectorAll('.testimonial-card, .luxury-testimonial-card, .review-card'));
        const style = window.getComputedStyle(section);
        return {
          found: true,
          display: style.display,
          visibility: style.visibility,
          opacity: style.opacity,
          height: section.offsetHeight,
          offsetTop: section.offsetTop,
          heading: section.querySelector('h2, .section-heading, .heading-2')?.textContent?.trim(),
          badge: section.querySelector('.section-badge')?.textContent?.trim(),
          cardsCount: cards.length,
          cardDetails: cards.map(c => ({
            author: c.querySelector('h4, .author-name, .customer-name')?.textContent?.trim(),
            location: c.querySelector('.author-location, .customer-location, span')?.textContent?.trim(),
            comment: c.querySelector('p, .testimonial-text')?.textContent?.trim()?.slice(0, 70),
            opacity: window.getComputedStyle(c).opacity
          }))
        };
      })()
    `);

    console.log('Section Info:', JSON.stringify(sectionInfo, null, 2));

    // Scroll to the review cards grid
    await cdp.eval(`
      (() => {
        const grid = document.querySelector('.testimonials-grid');
        if (grid) {
          grid.scrollIntoView({ behavior: 'instant', block: 'center' });
        }
      })()
    `);
    await delay(1000);

    const artifactDir = 'C:\\Users\\bijay\\.gemini\\antigravity-ide\\brain\\827afe67-eeac-423c-8dcd-ebad4cf16bfa';
    const screenshotPath = path.join(artifactDir, 'verified_review_cards_grid.png');
    await cdp.captureScreenshot(screenshotPath);
    console.log('📸 Grid Screenshot saved successfully:', screenshotPath);

    console.log('\n--- Review Section Verification Results ---');
    console.log(`Section Found: ${sectionInfo.found ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Section Height: ${sectionInfo.height}px (> 0: ${sectionInfo.height > 0 ? '✅ PASS' : '❌ FAIL'})`);
    console.log(`Cards Rendered: ${sectionInfo.cardsCount} cards (>= 3: ${sectionInfo.cardsCount >= 3 ? '✅ PASS' : '❌ FAIL'})`);
    console.log(`Card Opacity: ${sectionInfo.cardDetails?.[0]?.opacity} (Visible: ${sectionInfo.cardDetails?.[0]?.opacity !== '0' ? '✅ PASS' : '❌ FAIL'})`);

  } finally {
    if (cdp) cdp.close();
    chromeProc.kill('SIGKILL');
  }
}

verifyReviews().catch(console.error);
