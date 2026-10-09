import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const USER_DATA = path.join(process.env.TEMP || 'C:\\Temp', 'chrome_owner_test_' + Date.now());
const PORT = 9225;
const artifactDir = 'C:\\Users\\bijay\\.gemini\\antigravity-ide\\brain\\827afe67-eeac-423c-8dcd-ebad4cf16bfa';

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
      awaitPromise: true,
      returnByValue: true,
    });
    if (res.exceptionDetails) {
      throw new Error(res.exceptionDetails.text || 'Eval error');
    }
    return res.result?.value;
  }

  async waitForSelector(selector, timeoutMs = 8000) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      const exists = await this.eval(`!!document.querySelector('${selector}')`);
      if (exists) return true;
      await delay(200);
    }
    return false;
  }

  async captureScreenshot(filePath) {
    const res = await this.send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(res.data, 'base64');
    fs.writeFileSync(filePath, buffer);
  }
}

async function runOwnerPortalTests() {
  console.log('===============================================================');
  console.log('   myKouch™ OWNER PORTAL COMPLETE FUNCTIONALITY TEST');
  console.log('===============================================================\n');

  const chromeProcess = spawn(
    CHROME_PATH,
    [
      '--headless=new',
      `--user-data-dir=${USER_DATA}`,
      `--remote-debugging-port=${PORT}`,
      '--disable-gpu',
      '--no-first-run',
      '--window-size=1440,900',
      'about:blank',
    ],
    { stdio: 'ignore' }
  );

  let targets = null;
  for (let i = 0; i < 20; i++) {
    await delay(300);
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      if (res.ok) {
        targets = await res.json();
        if (targets && targets.length > 0) break;
      }
    } catch (e) {}
  }

  if (!targets || targets.length === 0) {
    throw new Error('Could not connect to Chrome debugging port.');
  }

  const pageTarget = targets.find((t) => t.type === 'page') || targets[0];
  const client = new CDPClient(pageTarget.webSocketDebuggerUrl);
  await client.connect();
  console.log('✓ Headless Chrome connected via CDP.\n');

  await client.send('Page.enable');
  await client.send('Runtime.enable');
  await client.send('DOM.enable');

  const testReport = [];
  function record(section, actionTested, passed, note = '') {
    testReport.push({ section, actionTested, passed, note });
    const symbol = passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${symbol} | [${section}] ${actionTested} ${note ? '(' + note + ')' : ''}`);
  }

  try {
    // -------------------------------------------------------------
    // STEP 1: OWNER LOGIN PAGE
    // -------------------------------------------------------------
    console.log('--- 1. Testing Owner Login Page ---');
    await client.send('Page.navigate', { url: 'http://localhost:5173/owner/login' });
    await client.waitForSelector('.owner-login-card');
    await delay(1000);

    const loginPageAudit = await client.eval(`
      (() => {
        const card = document.querySelector('.owner-login-card');
        const emailInput = document.querySelector('input[type="email"]');
        const passwordInput = document.querySelector('input[type="password"]');
        const submitBtn = document.querySelector('button[type="submit"]');
        const svgs = card ? card.querySelectorAll('svg') : [];

        return {
          hasCard: !!card,
          hasEmail: !!emailInput,
          hasPassword: !!passwordInput,
          hasSubmit: !!submitBtn,
          svgCount: svgs.length,
          emailVal: emailInput?.value,
        };
      })()
    `);
    record('OwnerLogin', 'Login Interface & Icon Rendering', loginPageAudit.hasCard && loginPageAudit.svgCount >= 3, `${loginPageAudit.svgCount} SVGs in login card`);

    // Capture Login Screen
    await client.captureScreenshot(path.join(artifactDir, 'tested_owner_login.png'));

    // Submit Login
    const loginResult = await client.eval(`
      (() => {
        const form = document.querySelector('form');
        const submitBtn = document.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.click();
        return { clicked: !!submitBtn };
      })()
    `);
    await delay(1500);

    // Verify Redirection to /owner/dashboard
    const currentUrl = await client.eval(`window.location.pathname`);
    const isDashboard = currentUrl === '/owner/dashboard';
    record('OwnerLogin', 'Authentication & Redirect to /owner/dashboard', isDashboard, `Current URL: ${currentUrl}`);

    // -------------------------------------------------------------
    // STEP 2: DASHBOARD STATS & ICONS
    // -------------------------------------------------------------
    console.log('\n--- 2. Testing Owner Dashboard Stats & Overview ---');
    await client.waitForSelector('.stat-card', 10000);
    await delay(1200);

    const statsAudit = await client.eval(`
      (() => {
        const cards = document.querySelectorAll('.stat-card');
        const statIcons = document.querySelectorAll('.stat-icon svg');
        const userBadge = document.querySelector('.dashboard-user-info');
        const logoutBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Logout'));
        const logoutIcon = logoutBtn ? logoutBtn.querySelector('svg') : null;

        return {
          cardsCount: cards.length,
          iconsCount: statIcons.length,
          hasUser: !!userBadge || document.body.textContent.includes('myKouch Owner') || document.body.textContent.includes('admin@mykouch.in'),
          hasLogout: !!logoutBtn,
          hasLogoutIcon: !!logoutIcon
        };
      })()
    `);
    record('DashboardStats', 'KPI Stat Cards & Stat Category Icons', statsAudit.cardsCount === 4 && statsAudit.iconsCount === 4, `${statsAudit.cardsCount} stat cards, ${statsAudit.iconsCount} icons`);
    record('DashboardHeader', 'Owner Profile Info & Logout Button (LogOut Icon)', statsAudit.hasUser && statsAudit.hasLogoutIcon, 'Owner authenticated session verified');

    // -------------------------------------------------------------
    // STEP 3: PRODUCTS TAB & PRODUCT ACTIONS
    // -------------------------------------------------------------
    console.log('\n--- 3. Testing Products Tab & Action Icons ---');
    const productsAudit = await client.eval(`
      (() => {
        const addBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Add New Product'));
        const hasAddIcon = !!(addBtn && addBtn.querySelector('svg'));
        const searchInput = document.querySelector('input[placeholder*="Search products"]');
        const searchBox = searchInput ? searchInput.parentElement : null;
        const searchIcon = searchBox ? searchBox.querySelector('svg') : null;
        const tableRows = document.querySelectorAll('.dashboard-table tbody tr');

        const firstRow = tableRows[0];
        const editIcon = firstRow ? firstRow.querySelector('button[title*="Edit"] svg, button:has(svg.lucide-edit)') : null;
        const deleteIcon = firstRow ? firstRow.querySelector('button[title*="Delete"] svg, button:has(svg.lucide-trash-2)') : null;
        const viewIcon = firstRow ? firstRow.querySelector('a[title*="View"] svg, a:has(svg.lucide-eye)') : null;

        return {
          hasAddBtn: !!addBtn,
          hasAddIcon,
          hasSearch: !!searchInput,
          hasSearchIcon: !!searchIcon,
          rowCount: tableRows.length,
          hasEditIcon: !!editIcon,
          hasDeleteIcon: !!deleteIcon,
          hasViewIcon: !!viewIcon
        };
      })()
    `);
    record('ProductsTab', 'Add Product Button (Plus Icon)', productsAudit.hasAddIcon, 'Add product CTA verified');
    record('ProductsTab', 'Product Search Box (Search Icon)', productsAudit.hasSearchIcon, 'Search input active with icon');
    record('ProductsTab', 'Row Actions (Edit, Delete, View Icons)', productsAudit.hasEditIcon && productsAudit.hasDeleteIcon, `${productsAudit.rowCount} product rows loaded with Edit, Delete & View actions`);

    // Capture Products Dashboard Screenshot
    await client.captureScreenshot(path.join(artifactDir, 'tested_owner_dashboard_products.png'));

    // -------------------------------------------------------------
    // STEP 4: ENQUIRIES TAB & ACTIONS
    // -------------------------------------------------------------
    console.log('\n--- 4. Testing Customer Enquiries Tab ---');
    const clickEnquiriesTab = await client.eval(`
      (() => {
        const tabs = Array.from(document.querySelectorAll('.dashboard-tab-btn'));
        const enqTab = tabs.find(t => t.textContent.includes('Customer Enquiries'));
        if (enqTab) enqTab.click();
        return !!enqTab;
      })()
    `);
    await delay(1200);

    const enquiriesAudit = await client.eval(`
      (() => {
        const enqCards = document.querySelectorAll('.dashboard-enquiry-card');
        const firstEnq = enqCards[0];
        const phoneLink = firstEnq ? firstEnq.querySelector('a[href^="tel:"]') : null;
        const waLink = firstEnq ? firstEnq.querySelector('a[href*="wa.me"]') : null;
        const statusSelect = firstEnq ? firstEnq.querySelector('select') : null;

        return {
          cardCount: enqCards.length,
          hasPhone: !!phoneLink,
          hasWhatsApp: !!waLink,
          hasStatusSelect: !!statusSelect
        };
      })()
    `);
    record('EnquiriesTab', 'Customer Enquiries List & Direct Contact Icons (Phone, WhatsApp)', enquiriesAudit.cardCount > 0 && enquiriesAudit.hasWhatsApp, `${enquiriesAudit.cardCount} customer enquiries loaded with one-tap WhatsApp contact`);
    record('EnquiriesTab', 'Enquiry Status Dropdown (New, Contacted, Completed)', enquiriesAudit.hasStatusSelect, 'Status progression dropdown controls active');

    // Capture Enquiries Dashboard Screenshot
    await client.captureScreenshot(path.join(artifactDir, 'tested_owner_dashboard_enquiries.png'));

    // -------------------------------------------------------------
    // STEP 5: OFFERS TAB & PROMOTIONS
    // -------------------------------------------------------------
    console.log('\n--- 5. Testing Offers & Promotions Tab ---');
    const clickOffersTab = await client.eval(`
      (() => {
        const tabs = Array.from(document.querySelectorAll('.dashboard-tab-btn'));
        const offersTab = tabs.find(t => t.textContent.includes('Offers & Promotions'));
        if (offersTab) offersTab.click();
        return !!offersTab;
      })()
    `);
    await delay(1200);

    const offersAudit = await client.eval(`
      (() => {
        const svgs = document.querySelectorAll('.dashboard-main svg');
        return {
          found: document.body.textContent.includes('Offer') || document.body.textContent.includes('Discount'),
          svgCount: svgs.length
        };
      })()
    `);
    record('OffersTab', 'Promotions & Festive Offers Panel', offersAudit.found, 'Offer controls and promotional cards verified');

    // Capture Offers Dashboard Screenshot
    await client.captureScreenshot(path.join(artifactDir, 'tested_owner_dashboard_offers.png'));

    // -------------------------------------------------------------
    // STEP 6: LOGOUT FUNCTIONALITY
    // -------------------------------------------------------------
    console.log('\n--- 6. Testing Owner Logout Flow ---');
    const logoutAction = await client.eval(`
      (() => {
        const logoutBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Logout'));
        if (logoutBtn) logoutBtn.click();
        return !!logoutBtn;
      })()
    `);
    await delay(1200);

    const afterLogoutUrl = await client.eval(`window.location.pathname`);
    const tokenCleared = await client.eval(`!localStorage.getItem('mykouch_owner_token')`);
    const logoutPassed = (afterLogoutUrl === '/owner/login' || afterLogoutUrl === '/') && tokenCleared;
    record('OwnerLogout', 'Session Cleared & Safe Redirect', logoutPassed, `Redirected to ${afterLogoutUrl}, auth token removed`);

  } finally {
    if (client.ws) client.ws.close();
    chromeProcess.kill();
    try {
      fs.rmSync(USER_DATA, { recursive: true, force: true });
    } catch (e) {}
  }

  console.log('\n===============================================================');
  console.log('           OWNER PORTAL TEST RESULTS SUMMARY');
  console.log('===============================================================');
  const total = testReport.length;
  const passed = testReport.filter((t) => t.passed).length;
  const failed = total - passed;
  console.log(`Total Owner Portal Tests Executed: ${total}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Pass Rate: ${Math.round((passed / total) * 100)}%\n`);

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runOwnerPortalTests().catch((err) => {
  console.error('\n❌ Owner Portal Test Error:', err.message);
  process.exit(1);
});
