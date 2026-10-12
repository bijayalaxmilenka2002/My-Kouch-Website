const { spawn } = require('child_process');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const USER_DATA = path.join(process.env.TEMP || 'C:\\Temp', 'chrome_audit_owner_' + Date.now());
const PORT = 9275;

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

async function auditOwner() {
  console.log('Testing Owner Portal Responsiveness & Toggles...');
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

  await client.send('Page.navigate', { url: 'https://mykouch.com/owner/login' });
  await delay(3000);

  // Fill in login form
  const loginResult = await client.eval(`(async () => {
    const emailInput = document.querySelector('input[type="email"]');
    const passInput = document.querySelector('input[type="password"]');
    const submitBtn = document.querySelector('button[type="submit"]');
    if (!emailInput || !passInput || !submitBtn) return { error: 'Form elements not found' };

    emailInput.value = 'admin@mykouch.in';
    emailInput.dispatchEvent(new Event('input', { bubbles: true }));
    passInput.value = 'MyKouch@2026';
    passInput.dispatchEvent(new Event('input', { bubbles: true }));

    submitBtn.click();
    return { submitted: true };
  })()`);
  console.log('Login submitted:', loginResult);

  await delay(4000);

  const currentUrl = await client.eval('window.location.href');
  console.log('Current URL after login attempt:', currentUrl);

  const dashboardMetrics = await client.eval(`(() => {
    const winW = window.innerWidth;
    const docW = document.documentElement.scrollWidth;
    const bodyW = document.body.scrollWidth;
    
    // Check table container
    const tableContainer = document.querySelector('.dashboard-table-container');
    const table = document.querySelector('.dashboard-table');
    const switches = Array.from(document.querySelectorAll('.toggle-switch input'));

    return {
      winW,
      docW,
      bodyW,
      hasPageOverflow: docW > winW || bodyW > winW,
      tableContainerFound: !!tableContainer,
      tableContainerScrollW: tableContainer ? tableContainer.scrollWidth : null,
      tableContainerClientW: tableContainer ? tableContainer.clientWidth : null,
      switchCount: switches.length,
      firstSwitchChecked: switches[0] ? switches[0].checked : null,
      firstSwitchId: switches[0] ? switches[0].closest('tr')?.querySelector('strong')?.textContent : null
    };
  })()`);
  console.log('Dashboard mobile audit:', JSON.stringify(dashboardMetrics, null, 2));

  // If we found switches, let's try toggling one!
  if (dashboardMetrics && dashboardMetrics.switchCount > 0) {
    console.log('Attempting to click first toggle switch...');
    const toggleResult = await client.eval(`(() => {
      const sw = document.querySelector('.toggle-switch input');
      if (sw) {
        const before = sw.checked;
        sw.click();
        return { clicked: true, before, after: sw.checked };
      }
      return { clicked: false };
    })()`);
    console.log('Toggle click result:', toggleResult);
    await delay(2000);

    // Now reload the page!
    console.log('Reloading dashboard page to see if toggle state persists or turns on...');
    await client.send('Page.reload');
    await delay(4000);

    const afterReload = await client.eval(`(() => {
      const sw = document.querySelector('.toggle-switch input');
      return {
        firstSwitchChecked: sw ? sw.checked : null,
        firstSwitchId: sw ? sw.closest('tr')?.querySelector('strong')?.textContent : null
      };
    })()`);
    console.log('After reload switch state:', afterReload);
  }

  client.close();
  chrome.kill();
}

auditOwner().catch(console.error);
