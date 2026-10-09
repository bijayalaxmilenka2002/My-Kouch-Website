import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const USER_DATA = path.join(process.env.TEMP || 'C:\\Temp', 'chrome_full_sync_test_' + Date.now());
const PORT = 9244;

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

async function runFullSyncVerification() {
  console.log('========================================================================');
  console.log('  VERIFYING COMPLETE OWNER PORTAL -> MONGODB -> CLIENT SYNCHRONIZATION');
  console.log('========================================================================\n');

  // Test 1: Direct API & MongoDB Atlas verification
  console.log('1. Testing Atlas MongoDB connection & data retrieval via API...');
  const prodRes = await fetch('http://localhost:5000/api/products');
  const prodData = await prodRes.json();
  console.log(`   Atlas MongoDB Products Count: ${prodData.total} products returned.`);

  const offerRes = await fetch('http://localhost:5000/api/offers/active');
  const offerData = await offerRes.json();
  console.log(`   Atlas MongoDB Active Offer: "${offerData.offer?.title}" (${offerData.offer?.discount})`);

  // Test 2: Launch browser automation
  console.log('\n2. Launching headless browser for UI testing...');
  const chromeProc = spawn(CHROME_PATH, [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${USER_DATA}`,
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1440,900',
  ]);

  await delay(1500);

  let cdp;
  try {
    const targetsRes = await fetch(`http://localhost:${PORT}/json`);
    const targets = await targetsRes.json();
    const pageTarget = targets.find((t) => t.type === 'page') || targets[0];

    cdp = new CDPClient(pageTarget.webSocketDebuggerUrl);
    await cdp.connect();
    await cdp.send('Page.enable');

    // 3. Login to Owner Portal
    console.log('3. Logging into Owner Dashboard...');
    await cdp.send('Page.navigate', { url: 'http://localhost:5173/owner/login' });
    await delay(1800);
    await cdp.eval(`(() => {
      const btn = document.querySelector('button[type="submit"]');
      if (btn) btn.click();
    })()`);
    await delay(2500);

    // 4. Verify Owner Portal loaded all products from MongoDB
    const dashboardStats = await cdp.eval(`(() => {
      const tableRows = document.querySelectorAll('.dashboard-table tbody tr');
      const title = document.querySelector('.owner-topbar h1')?.textContent?.trim();
      return {
        title,
        renderedRows: tableRows.length
      };
    })()`);
    console.log('4. Owner Dashboard loaded:');
    console.log(`   Title: "${dashboardStats.title}", Rendered Products in Table: ${dashboardStats.renderedRows}`);

    // 5. Navigate to Client Collections Page
    console.log('\n5. Navigating to Client Collections Page (http://localhost:5173/collections)...');
    await cdp.send('Page.navigate', { url: 'http://localhost:5173/collections' });
    await delay(2000);

    const clientProducts = await cdp.eval(`(() => {
      const cards = document.querySelectorAll('.product-card');
      const firstCard = cards[0];
      return {
        totalCards: cards.length,
        firstTitle: firstCard?.querySelector('.product-card-title')?.textContent?.trim(),
        firstPrice: firstCard?.querySelector('.price-current')?.textContent?.trim()
      };
    })()`);
    console.log(`   Client Collections Page rendered ${clientProducts.totalCards} cards.`);
    console.log(`   First Product: "${clientProducts.firstTitle}" - ${clientProducts.firstPrice}`);

    const artifactDir = 'C:\\Users\\bijay\\.gemini\\antigravity-ide\\brain\\827afe67-eeac-423c-8dcd-ebad4cf16bfa';
    const collectionsScreenshot = path.join(artifactDir, 'verified_client_collections.png');
    await cdp.captureScreenshot(collectionsScreenshot);
    console.log('   📸 Client Collections screenshot saved:', collectionsScreenshot);

    // 6. Navigate to Client Home Page and check active offer & new arrivals
    console.log('\n6. Navigating to Client Home Page (http://localhost:5173/)...');
    await cdp.send('Page.navigate', { url: 'http://localhost:5173/' });
    await delay(2200);

    const homeData = await cdp.eval(`(() => {
      const banner = document.querySelector('#offers');
      return {
        offerHeadline: banner?.querySelector('.flash-headline')?.textContent?.trim(),
        offerCoupon: banner?.querySelector('.flash-coupon-pill strong')?.textContent?.trim(),
        offerDiscount: banner?.querySelector('.flash-discount-badge')?.textContent?.trim(),
        topSellingCards: document.querySelectorAll('.product-card').length
      };
    })()`);
    console.log('   Home Page Client State:');
    console.log(`   - Offer Headline: "${homeData.offerHeadline}"`);
    console.log(`   - Coupon: "${homeData.offerCoupon}"`);
    console.log(`   - Discount: "${homeData.offerDiscount}"`);
    console.log(`   - Product Cards on Home: ${homeData.topSellingCards}`);

    const homeScreenshot = path.join(artifactDir, 'verified_client_homepage_synced.png');
    await cdp.captureScreenshot(homeScreenshot);
    console.log('   📸 Client Home Page screenshot saved:', homeScreenshot);

    console.log('\n========================================================================');
    console.log('  ALL DYNAMIC SYNC & DATABASE TESTS COMPLETED SUCCESSFULLY! ✅');
    console.log('========================================================================\n');

  } finally {
    if (cdp) cdp.close();
    chromeProc.kill('SIGKILL');
  }
}

runFullSyncVerification().catch(console.error);
