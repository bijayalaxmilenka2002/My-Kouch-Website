import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const USER_DATA = path.join(process.env.TEMP || 'C:\\Temp', 'chrome_navbar_scroll_test_' + Date.now());
const PORT = 9225;

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

async function verify() {
  console.log('===============================================================');
  console.log('  VERIFYING NEW BED & PILLOW IMAGES + SMART SCROLL NAVBAR');
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
    await delay(1800);

    // 1. Verify Category Section Images
    console.log('\n--- 1. Testing Category Section Cards & Images ---');
    const catImages = await cdp.eval(`
      Array.from(document.querySelectorAll('.category-card')).map(c => ({
        name: c.querySelector('.category-name')?.textContent?.trim(),
        imgSrc: c.querySelector('.category-image')?.getAttribute('src'),
      }))
    `);
    console.log('Category Cards Found:', JSON.stringify(catImages, null, 2));

    const bedCard = catImages?.find(c => c.name?.includes('Mattress'));
    const pillowCard = catImages?.find(c => c.name?.includes('Pillow'));

    const bedPassed = bedCard && bedCard.imgSrc?.includes('grand_luxury_master_bed_mattress.jpg');
    const pillowPassed = pillowCard && pillowCard.imgSrc?.includes('bespoke_emerald_terracotta_cushion_ensemble.jpg');

    console.log(`Luxury Bed Card Image: ${bedPassed ? '✅ PASS' : '❌ FAIL'} (${bedCard?.imgSrc})`);
    console.log(`Designer Pillow Card Image: ${pillowPassed ? '✅ PASS' : '❌ FAIL'} (${pillowCard?.imgSrc})`);

    // Capture category section screenshot
    const artifactDir = 'C:\\Users\\bijay\\.gemini\\antigravity-ide\\brain\\827afe67-eeac-423c-8dcd-ebad4cf16bfa';
    await cdp.captureScreenshot(path.join(artifactDir, 'verified_new_category_cards.png'));
    console.log('📸 Screenshot saved: verified_new_category_cards.png');

    // 2. Initial Navbar State at Top of Page
    console.log('\n--- 2. Testing Navbar Initial State (Top of Page) ---');
    const topState = await cdp.eval(`
      (() => {
        const h = document.querySelector('.site-header');
        return {
          className: h?.className,
          hasHidden: h?.classList.contains('nav-hidden'),
          hasVisible: h?.classList.contains('nav-visible'),
          hasScrolled: h?.classList.contains('scrolled'),
          scrollY: window.scrollY
        };
      })()
    `);
    console.log('Initial Header State (Top):', topState);
    const topPassed = !topState.hasHidden;
    console.log(`Top of page navbar visibility: ${topPassed ? '✅ PASS' : '❌ FAIL'}`);

    // 3. Scroll Down: navbar should hide cleanly
    console.log('\n--- 3. Testing Scroll DOWN (Auto-Hide Navbar) ---');
    await cdp.eval(`
      window.scrollTo({ top: 800, behavior: 'instant' });
      window.dispatchEvent(new Event('scroll'));
    `);
    await delay(500);

    const downState = await cdp.eval(`
      (() => {
        const h = document.querySelector('.site-header');
        return {
          className: h?.className,
          hasHidden: h?.classList.contains('nav-hidden'),
          hasVisible: h?.classList.contains('nav-visible'),
          scrollY: window.scrollY
        };
      })()
    `);
    console.log('Scrolled Down (at 800px):', downState);
    const downPassed = downState.hasHidden;
    console.log(`Scroll DOWN Auto-Hide: ${downPassed ? '✅ PASS' : '❌ FAIL'}`);

    await cdp.captureScreenshot(path.join(artifactDir, 'verified_navbar_scrolled_down_hidden.png'));
    console.log('📸 Screenshot saved: verified_navbar_scrolled_down_hidden.png');

    // 4. Scroll UP: navbar should reveal smoothly with sticky luxury treatment
    console.log('\n--- 4. Testing Scroll UP (Sticky Reveal Navbar) ---');
    await cdp.eval(`
      window.scrollTo({ top: 400, behavior: 'instant' });
      window.dispatchEvent(new Event('scroll'));
    `);
    await delay(500);

    const upState = await cdp.eval(`
      (() => {
        const h = document.querySelector('.site-header');
        return {
          className: h?.className,
          hasHidden: h?.classList.contains('nav-hidden'),
          hasVisible: h?.classList.contains('nav-visible'),
          hasScrolled: h?.classList.contains('scrolled'),
          scrollY: window.scrollY
        };
      })()
    `);
    console.log('Scrolled UP (at 400px):', upState);
    const upPassed = upState.hasVisible && upState.hasScrolled;
    console.log(`Scroll UP Sticky Reveal: ${upPassed ? '✅ PASS' : '❌ FAIL'}`);

    await cdp.captureScreenshot(path.join(artifactDir, 'verified_navbar_scrolled_up_sticky.png'));
    console.log('📸 Screenshot saved: verified_navbar_scrolled_up_sticky.png');

    console.log('\n===============================================================');
    console.log('                    VERIFICATION SUMMARY');
    console.log('===============================================================');
    console.log(`✅ Bed Card Image: ${bedPassed ? 'PASSED' : 'FAILED'}`);
    console.log(`✅ Pillow Card Image: ${pillowPassed ? 'PASSED' : 'FAILED'}`);
    console.log(`✅ Top Navbar Visible: ${topPassed ? 'PASSED' : 'FAILED'}`);
    console.log(`✅ Scroll DOWN Auto-Hide: ${downPassed ? 'PASSED' : 'FAILED'}`);
    console.log(`✅ Scroll UP Sticky Reveal: ${upPassed ? 'PASSED' : 'FAILED'}`);

  } finally {
    if (cdp) cdp.close();
    chromeProc.kill();
    try {
      fs.rmSync(USER_DATA, { recursive: true, force: true });
    } catch (e) {}
  }
}

verify().catch(console.error);
