import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const USER_DATA = path.join(process.env.TEMP || 'C:\\Temp', 'chrome_resp_test_' + Date.now());
const PORT = 9255;

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
      console.error('Eval exception:', res.exceptionDetails.exception?.description || res.exceptionDetails);
    }
    return res.result?.value;
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function waitForSelector(client, selector, timeoutMs = 8000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const res = await client.eval(`!!document.querySelector('${selector}')`);
    if (res) return true;
    await delay(200);
  }
  return false;
}

async function run() {
  console.log('=== Checking Local Preview on http://localhost:4173/ ===');

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
      if (tabs && tabs[0]?.webSocketDebuggerUrl) {
        wsUrl = tabs[0].webSocketDebuggerUrl;
        break;
      }
    } catch (e) {
      await delay(400);
    }
  }

  if (!wsUrl) {
    console.error('Could not get CDP wsUrl');
    chrome.kill();
    process.exit(1);
  }

  const client = new CDPClient(wsUrl);
  await client.connect();
  await client.send('Page.enable');
  await client.send('DOM.enable');

  const viewports = [
    { name: 'Mobile_Compact_360', width: 360, height: 740, mobile: true },
    { name: 'Mobile_iPhone_390', width: 390, height: 844, mobile: true },
    { name: 'Tablet_iPad_768', width: 768, height: 1024, mobile: false },
    { name: 'Desktop_HD_1280', width: 1280, height: 800, mobile: false },
  ];

  for (const vp of viewports) {
    console.log(`\nTesting Viewport: ${vp.name} (${vp.width}x${vp.height})...`);
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 2,
      mobile: vp.mobile,
    });

    await client.send('Page.navigate', { url: 'http://localhost:4173/' });
    await waitForSelector(client, '.site-header');
    await delay(1000);

    const check = await client.eval(`(() => {
      const scrollWidth = document.documentElement.scrollWidth;
      const innerWidth = window.innerWidth;
      const hasHorizontalScroll = scrollWidth > innerWidth + 1;
      
      const header = document.querySelector('.site-header');
      const headerBox = header ? header.getBoundingClientRect() : null;
      
      const mbBtn = document.querySelector('.mobile-menu-btn');
      const mbBtnVisible = mbBtn ? (getComputedStyle(mbBtn).display !== 'none') : false;

      const heroTitle = document.querySelector('.hero-designer-title');
      const heroTitleSize = heroTitle ? getComputedStyle(heroTitle).fontSize : 'N/A';

      const offerRibbon = document.querySelector('.offer-flash-ribbon');
      const offerBox = offerRibbon ? offerRibbon.getBoundingClientRect() : null;

      const cards = document.querySelectorAll('.product-card');

      return {
        innerWidth,
        scrollWidth,
        hasHorizontalScroll,
        headerWidth: headerBox ? Math.round(headerBox.width) : 0,
        mbBtnVisible,
        heroTitleSize,
        offerWidth: offerBox ? Math.round(offerBox.width) : 0,
        productCardsCount: cards.length
      };
    })()`);

    console.log(`  -> innerWidth: ${check.innerWidth}px, scrollWidth: ${check.scrollWidth}px`);
    console.log(`  -> hasHorizontalScroll: ${check.hasHorizontalScroll ? 'FAIL ❌ (Overflow detected)' : 'PASS ✅ (Zero horizontal scroll)'}`);
    console.log(`  -> headerWidth: ${check.headerWidth}px`);
    console.log(`  -> hamburgerVisible: ${check.mbBtnVisible ? 'YES (mobile drawer button)' : 'NO (desktop nav)'}`);
    console.log(`  -> heroTitleSize: ${check.heroTitleSize}`);
    console.log(`  -> offerRibbonWidth: ${check.offerWidth}px`);
    console.log(`  -> productCardsCount: ${check.productCardsCount}`);
  }

  // Test Drawer Open on Mobile
  console.log('\n--- Testing Mobile Drawer on iPhone (390px) ---');
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true,
  });
  await client.send('Page.navigate', { url: 'http://localhost:4173/' });
  await waitForSelector(client, '.mobile-menu-btn');
  await delay(500);

  await client.eval(`document.querySelector('.mobile-menu-btn').click()`);
  await delay(400);

  const drawerState = await client.eval(`(() => {
    const drawer = document.querySelector('.mobile-drawer');
    const links = document.querySelectorAll('.mobile-nav-link');
    const ctas = document.querySelectorAll('.mobile-drawer .btn');
    return {
      isOpen: drawer ? drawer.classList.contains('open') : false,
      linksCount: links.length,
      ctasCount: ctas.length
    };
  })()`);
  console.log(`  -> Drawer open: ${drawerState.isOpen ? 'PASS ✅' : 'FAIL ❌'}`);
  console.log(`  -> Nav links in drawer: ${drawerState.linksCount}`);
  console.log(`  -> Bottom CTAs in drawer: ${drawerState.ctasCount}`);

  // Test Collections Page on Mobile
  console.log('\n--- Testing Collections Page on 390px ---');
  await client.send('Page.navigate', { url: 'http://localhost:4173/collections' });
  await waitForSelector(client, '.catalog-controls-row');
  await delay(800);

  const collState = await client.eval(`(() => {
    const scrollWidth = document.documentElement.scrollWidth;
    const innerWidth = window.innerWidth;
    const toggle = document.querySelector('.catalog-mobile-filter-toggle');
    const search = document.querySelector('.catalog-search-box');
    const sort = document.querySelector('.catalog-sort-box');
    const products = document.querySelectorAll('.product-card');

    return {
      scrollWidth,
      innerWidth,
      hasHorizontalScroll: scrollWidth > innerWidth + 1,
      toggleVisible: toggle ? (getComputedStyle(toggle).display !== 'none') : false,
      searchPresent: !!search,
      sortPresent: !!sort,
      productsCount: products.length
    };
  })()`);

  console.log(`  -> Collections hasHorizontalScroll: ${collState.hasHorizontalScroll ? 'FAIL ❌' : 'PASS ✅'}`);
  console.log(`  -> Mobile Filter Toggle Visible: ${collState.toggleVisible ? 'PASS ✅' : 'FAIL ❌'}`);
  console.log(`  -> Products loaded: ${collState.productsCount}`);

  // Test About Page on Mobile
  console.log('\n--- Testing About Page on 390px ---');
  await client.send('Page.navigate', { url: 'http://localhost:4173/about' });
  await waitForSelector(client, '.about-compare-table-wrapper');
  await delay(800);

  const aboutState = await client.eval(`(() => {
    const scrollWidth = document.documentElement.scrollWidth;
    const innerWidth = window.innerWidth;
    const wrapper = document.querySelector('.about-compare-table-wrapper');
    const table = document.querySelector('.about-compare-table');
    const scrollHint = document.querySelector('.about-mobile-scroll-hint');

    return {
      scrollWidth,
      innerWidth,
      hasHorizontalScroll: scrollWidth > innerWidth + 1,
      wrapperPresent: !!wrapper,
      tableMinWidth: table ? getComputedStyle(table).minWidth : 'none',
      scrollHintVisible: scrollHint ? (getComputedStyle(scrollHint).display !== 'none') : false
    };
  })()`);

  console.log(`  -> About hasHorizontalScroll: ${aboutState.hasHorizontalScroll ? 'FAIL ❌' : 'PASS ✅'}`);
  console.log(`  -> Compare Table Wrapper Present: ${aboutState.wrapperPresent ? 'PASS ✅' : 'FAIL ❌'}`);
  console.log(`  -> Compare Table Min-Width: ${aboutState.tableMinWidth}`);
  console.log(`  -> Mobile Scroll Hint: ${aboutState.scrollHintVisible ? 'PASS ✅' : 'FAIL ❌'}`);

  // Cleanup
  client.close();
  chrome.kill();
  try {
    fs.rmSync(USER_DATA, { recursive: true, force: true });
  } catch (e) {}

  console.log('\n=== All Responsive Checks Complete! ===');
}

run().catch((err) => {
  console.error('Error running test:', err);
  process.exit(1);
});
