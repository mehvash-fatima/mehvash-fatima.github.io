/**
 * Walks a prototype scenario in headless Chrome over CDP, clicking only the
 * armed spotlight and reporting the settled state after every beat. No
 * dependencies: Node 24 ships a global WebSocket, so raw CDP is cheaper than
 * adding puppeteer to a repo that deliberately has no package.json.
 *
 *   python3 -m http.server 8000 &
 *   "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
 *     --headless=new --remote-debugging-port=9222 \
 *     --user-data-dir=/tmp/pp-chrome about:blank &
 *   node docs/superpowers/tools/walk-prototype.mjs <scenarioId> <beatCount>
 *
 * What a passing walk looks like: exactly one spotlight before every click,
 * the step counter advancing by one each time, and a terminal state with no
 * spotlight and the completion panel shown.
 */
const PORT = process.env.CDP_PORT || 9222;
const URL_ = 'http://localhost:8000/prototype-copilot.html';

const listTargets = async () => (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();

const targets = await listTargets();
const page = targets.find(t => t.type === 'page');
if (!page) { console.error('no page target'); process.exit(1); }

const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener('open', r, { once: true }));

let id = 0;
const pending = new Map();
ws.addEventListener('message', ev => {
  const msg = JSON.parse(ev.data);
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id);
    pending.delete(msg.id);
    msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
  }
});
const send = (method, params = {}) => new Promise((resolve, reject) => {
  const mid = ++id;
  pending.set(mid, { resolve, reject });
  ws.send(JSON.stringify({ id: mid, method, params }));
});

const evaluate = async expr => {
  const r = await send('Runtime.evaluate', {
    expression: expr, awaitPromise: true, returnByValue: true
  });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || 'eval threw');
  return r.result.value;
};

const sleep = ms => new Promise(r => setTimeout(r, ms));

await send('Page.enable');
await send('Runtime.enable');

// Surface page errors — a module that fails to parse is otherwise silent.
const consoleErrors = [];
ws.addEventListener('message', ev => {
  const m = JSON.parse(ev.data);
  if (m.method === 'Runtime.exceptionThrown') {
    consoleErrors.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text);
  }
});

await send('Network.enable');
await send('Network.setCacheDisabled', { cacheDisabled: true });
await send('Page.navigate', { url: URL_ });
await sleep(2500);

// Probe: what the page can tell us about its own state.
const probe = `(() => {
  const root = document.getElementById('pp-root');
  const spots = [...root.querySelectorAll('.is-spotlit')];
  const canvas = root.querySelector('.pp-canvas');
  return {
    spotCount: spots.length,
    spotIds: spots.map(n => '#' + n.id),
    spotVisible: spots.map(n => n.getBoundingClientRect().width > 0 && n.getBoundingClientRect().height > 0),
    step: document.getElementById('pp-step').textContent,
    completeHidden: document.getElementById('pp-complete').hidden,
    canvasClasses: canvas ? canvas.className : null,
    chatCount: root.querySelectorAll('.pp-chat > *').length,
    busy: Boolean(root.querySelector('.is-typing') || root.querySelector('.pp-latency')),
    chatInput: (() => { const n = root.querySelector('#copilot-chat-input');
      return n ? n.value : null; })(),
    promptBar: (() => { const n = root.querySelector('#prompt-bar');
      return n ? (n.querySelector('.pp-prompt-text') || n).textContent : null; })(),
    chatText: [...root.querySelectorAll('.pp-chat > *')]
      .map(n => n.textContent.replace(/\\s+/g, ' ').trim().slice(0, 90)),
    wizardStep: (() => { const n = root.querySelector('.pp-wizard h2, .pp-wizard h3');
      return n ? n.textContent.trim() : null; })(),
    presentHotspots: [...root.querySelectorAll('[id]')].map(n => '#' + n.id)
      .filter(s => ['#prompt-bar','#srr-risk-card','#tracker-risk-card','#generate-draft-button',
        '#view-tasks-button','#review-scan-button','#wizard-next','#wizard-save-close',
        '#chat-suggestion','#email-card-open','#copilot-chat-input'].includes(s))
  };
})()`;

const scenarioId = process.argv[2] || 'tracker';
const expectedBeats = Number(process.argv[3] || 3);

await evaluate(`document.querySelector('[data-scenario-id="${scenarioId}"]').click()`);
await sleep(600);

console.log(`\n===== SCENARIO: ${scenarioId} (${expectedBeats} beats) =====`);

for (let i = 0; i <= expectedBeats; i++) {
  // Wait for the beat to settle: typing + thinking animations must finish.
  // Settle = two identical probes 700ms apart. A spotlight arms while typing
  // is still running, so "spotCount === 1" alone is not settled, and a click
  // during an animation fast-forwards it instead of advancing the beat.
  // Settled = the probe is unchanged across 700ms AND the mount has finished
  // the beat: either a hotspot is armed or the scenario is complete. Stability
  // alone is not enough — nothing changes during the `thinking` pause either,
  // and a click landing mid-animation fast-forwards it instead of advancing.
  // Settled = the mount is not animating (no `.is-typing` target, no latency
  // card) AND the beat has landed: a hotspot is armed, or the scenario is
  // complete. A click landing while `busy` fast-forwards the animation
  // instead of advancing, so polling on the busy flag is what keeps the walk
  // honest — a stability heuristic cannot tell a finished beat from the
  // middle of a 1200ms `thinking` pause, where nothing changes either.
  let s;
  let settled = false;
  for (let tries = 0; tries < 60; tries++) {
    s = await evaluate(probe);
    if (!s.busy && (s.spotCount === 1 || s.completeHidden === false)) { settled = true; break; }
    await sleep(250);
  }
  if (!settled) console.log('!! never settled within 15s');
  console.log(`\n--- after ${i} click(s) ---`);
  console.log(JSON.stringify(s, null, 2));

  if (i === expectedBeats) break;
  if (s.spotCount !== 1) { console.log(`!! expected exactly 1 spotlight, got ${s.spotCount} — stopping`); break; }
  await evaluate(`document.querySelector('#pp-root .is-spotlit').click()`);
  await sleep(300);
}

if (consoleErrors.length) console.log('\n!! PAGE ERRORS:\n' + consoleErrors.join('\n'));
else console.log('\nno page errors');
ws.close();
