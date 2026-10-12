const { spawn } = require('child_process');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const USER_DATA = path.join(process.env.TEMP || 'C:\\Temp', 'chrome_console_' + Date.now());
const PORT = 9280;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function checkConsole() {
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

  const ws = new WebSocket(wsUrl);
  await new Promise(r => ws.onopen = r);

  let id = 1;
  const send = (method, params = {}) => new Promise((resolve) => {
    const curId = id++;
    const handler = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === curId) {
        ws.removeEventListener('message', handler);
        resolve(msg.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id: curId, method, params }));
  });

  ws.addEventListener('message', (event) => {
    const msg = JSON.parse(event.data);
    if (msg.method === 'Console.messageAdded') {
      console.log('CONSOLE:', msg.params.message.text);
    }
    if (msg.method === 'Runtime.exceptionThrown') {
      console.log('EXCEPTION:', msg.params.exceptionDetails.text, msg.params.exceptionDetails.exception?.description);
    }
  });

  await send('Console.enable');
  await send('Runtime.enable');
  await send('Page.enable');

  console.log('Navigating to https://mykouch.com/owner/login...');
  await send('Page.navigate', { url: 'https://mykouch.com/owner/login' });
  await delay(4000);

  const evalRes = await send('Runtime.evaluate', {
    expression: 'document.getElementById("root")?.innerHTML.slice(0, 500)',
    returnByValue: true
  });
  console.log('Root HTML snippet:', evalRes.result?.value);

  ws.close();
  chrome.kill();
}

checkConsole().catch(console.error);
