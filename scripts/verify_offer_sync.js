import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const USER_DATA = path.join(process.env.TEMP || 'C:\\Temp', 'chrome_offer_sync_test_' + Date.now());
const PORT = 9233;

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

async function verifyOfferSync() {
  console.log('===============================================================');
  console.log('     VERIFYING DYNAMIC OWNER PORTAL -> CLIENT SIDE OFFER SYNC');
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

    // 1. Go to Owner Login
    console.log('1. Navigating to Owner Login...');
    await cdp.send('Page.navigate', { url: 'http://localhost:5173/owner/login' });
    await delay(1800);

    // 2. Submit Login
    console.log('2. Logging into Owner Dashboard...');
    await cdp.eval(`(() => {
      const btn = document.querySelector('button[type="submit"]');
      if (btn) btn.click();
    })()`);
    await delay(2200);

    // 3. Switch to Offers Tab
    console.log('3. Opening Offers & Promotions tab in Owner Portal...');
    await cdp.eval(`(() => {
      const buttons = Array.from(document.querySelectorAll('.dashboard-tab-btn, button'));
      const offersTab = buttons.find(b => b.textContent.includes('Offers & Promotions') || b.textContent.includes('Offers'));
      if (offersTab) offersTab.click();
    })()`);
    await delay(1000);

    // 4. Click Edit on First Offer
    console.log('4. Opening Edit Offer modal in Owner Portal...');
    await cdp.eval(`(() => {
      const editBtn = document.querySelector('.table-action-group .btn-icon-table[title="Edit Offer"]') ||
                      document.querySelector('button[title="Edit Offer"]');
      if (editBtn) editBtn.click();
    })()`);
    await delay(1000);

    // 5. Update Offer Fields to test dynamic updating
    console.log('5. Changing Offer details in the modal form...');
    const testTitle = 'Grand Festive Living Fest 2026';
    const testSubtitle = 'Direct-From-Factory Sofas & Mattresses Handcrafted in Bhubaneswar';
    const testDiscount = 'UP TO 50% OFF';
    const testCoupon = 'ROYAL50';
    const testCta = 'Claim Festive Savings';

    await cdp.eval(`(() => {
      const modal = document.querySelector('.modal-card');
      if (!modal) return false;

      const titleInput = modal.querySelector('input[placeholder*="Living"], input[value*="Offer"], input[required]');
      if (titleInput) {
        titleInput.value = ${JSON.stringify(testTitle)};
        titleInput.dispatchEvent(new Event('input', { bubbles: true }));
      }

      const subtitleInput = modal.querySelector('input[placeholder*="Bhubaneswar"]');
      if (subtitleInput) {
        subtitleInput.value = ${JSON.stringify(testSubtitle)};
        subtitleInput.dispatchEvent(new Event('input', { bubbles: true }));
      }

      const inputs = Array.from(modal.querySelectorAll('input'));
      const discountInput = inputs.find(i => i.placeholder?.includes('OFF') || i.value?.includes('OFF'));
      if (discountInput) {
        discountInput.value = ${JSON.stringify(testDiscount)};
        discountInput.dispatchEvent(new Event('input', { bubbles: true }));
      }

      const couponInput = inputs.find(i => i.placeholder?.includes('COMFORT') || i.value?.includes('COMFORT'));
      if (couponInput) {
        couponInput.value = ${JSON.stringify(testCoupon)};
        couponInput.dispatchEvent(new Event('input', { bubbles: true }));
      }

      // Submit the form
      const submitBtn = modal.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.click();
      return true;
    })()`);
    await delay(2500);

    // 6. Navigate to Client Homepage
    console.log('6. Navigating to Client Home Page to verify dynamic changes...');
    await cdp.send('Page.navigate', { url: 'http://localhost:5173/' });
    await delay(2200);

    // Scroll to #offers banner
    await cdp.eval(`(() => {
      const banner = document.querySelector('#offers');
      if (banner) banner.scrollIntoView({ behavior: 'instant', block: 'center' });
    })()`);
    await delay(1200);

    // Check what is rendered on OfferBanner
    const bannerData = await cdp.eval(`(() => {
      const banner = document.querySelector('#offers');
      if (!banner) return { found: false };
      return {
        found: true,
        headline: banner.querySelector('.flash-headline')?.textContent?.trim(),
        subtext: banner.querySelector('.flash-subtext')?.textContent?.trim(),
        couponCode: banner.querySelector('.flash-coupon-pill strong')?.textContent?.trim(),
        discount: banner.querySelector('.flash-discount-badge')?.textContent?.trim(),
        ctaText: banner.querySelector('.btn-flash-action span')?.textContent?.trim()
      };
    })()`);

    console.log('\n--- Client Side Live Banner Content ---');
    console.log(JSON.stringify(bannerData, null, 2));

    const artifactDir = 'C:\\Users\\bijay\\.gemini\\antigravity-ide\\brain\\827afe67-eeac-423c-8dcd-ebad4cf16bfa';
    const screenshotPath = path.join(artifactDir, 'verified_dynamic_offer_sync.png');
    await cdp.captureScreenshot(screenshotPath);
    console.log('\n📸 Screenshot saved to:', screenshotPath);

    console.log('\n--- Verification Results ---');
    const headlineMatch = bannerData.headline?.includes('Festive');
    const couponMatch = bannerData.couponCode === testCoupon;
    const discountMatch = bannerData.discount === testDiscount;
    console.log(`Headline Dynamically Updated: ${headlineMatch ? '✅ PASS' : '❌ FAIL'} (${bannerData.headline})`);
    console.log(`Coupon Dynamically Updated: ${couponMatch ? '✅ PASS' : '❌ FAIL'} (${bannerData.couponCode})`);
    console.log(`Discount Dynamically Updated: ${discountMatch ? '✅ PASS' : '❌ FAIL'} (${bannerData.discount})`);

  } finally {
    if (cdp) cdp.close();
    chromeProc.kill('SIGKILL');
  }
}

verifyOfferSync().catch(console.error);
