import { spawn } from 'child_process';
import path from 'path';

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9225',
  '--user-data-dir=' + path.join(process.env.TEMP, 'chrome_debug_err'),
  'about:blank',
]);

await new Promise((r) => setTimeout(r, 1500));
const targets = await (await fetch('http://127.0.0.1:9225/json/list')).json();
const ws = new WebSocket(targets[0].webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));

ws.send(JSON.stringify({ id: 1, method: 'Page.enable' }));
ws.send(JSON.stringify({ id: 2, method: 'Log.enable' }));
ws.send(JSON.stringify({ id: 3, method: 'Console.enable' }));
ws.send(JSON.stringify({ id: 4, method: 'Runtime.enable' }));
ws.send(JSON.stringify({ id: 5, method: 'Network.enable' }));

ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (m.method === 'Console.messageAdded') {
    console.log('CONSOLE MSG:', m.params.message.level, m.params.message.text);
  }
  if (m.method === 'Runtime.exceptionThrown') {
    console.log('RUNTIME EXCEPTION:', m.params.exceptionDetails?.exception?.description || m.params.exceptionDetails?.text);
  }
  if (m.method === 'Log.entryAdded') {
    console.log('LOG ENTRY:', m.params.entry.level, m.params.entry.text);
  }
  if (m.method === 'Network.responseReceived') {
    if (m.params.response.status >= 400) {
      console.log('HTTP ERROR:', m.params.response.status, m.params.response.url);
    } else {
      console.log('HTTP OK:', m.params.response.status, m.params.response.url);
    }
  }
};

await new Promise((r) => setTimeout(r, 500));
ws.send(JSON.stringify({ id: 6, method: 'Page.navigate', params: { url: 'http://localhost:5173/' } }));

await new Promise((r) => setTimeout(r, 4000));
chrome.kill();
process.exit(0);
