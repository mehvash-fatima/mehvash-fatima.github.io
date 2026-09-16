# Copilot Privacy Manager Prototype — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a standalone, interactive, resettable prototype of the four Copilot Privacy Manager scenarios as a page on the portfolio site.

**Architecture:** A pure state machine (`engine.js`) folds a list of declarative "beats" over an initial state; `shell.js` renders that state into DOM and declares which hotspot ids each view owns; `scenarios.js` holds the four demo scripts as data only; `mount.js` is the sole owner of `document`. Data flows one direction — scenario data to engine state to DOM — which makes reset a single code path and lets the whole engine be tested with no browser.

**Tech Stack:** Vanilla ES modules, CSS custom properties, Node's built-in test runner. No frameworks, no build step, no dependencies.

**Spec:** `docs/superpowers/specs/2026-09-15-copilot-prototype-design.md`

## Global Constraints

- No runtime dependencies, no dev dependencies, no `package.json`, no build step.
- ES modules only. The prototype page is served over HTTP, never `file://`.
- Tests run with `node --test assets/prototype/` and require Node 18 or newer.
- Breakpoint between scaled canvas and mobile reflow: **768px**.
- Design canvas is **1920x1080**; scaling above the breakpoint is a CSS transform.
- Idle auto-reset fires after **90 seconds** of no interaction, paused while the tab is hidden.
- `prefers-reduced-motion: reduce` renders all text complete and instant; no beat is skipped or merged.
- Exported images go in `assets/` with 12-hex-character filenames, referenced with `loading="lazy" decoding="async"`. Anything drawable in CSS is not exported.
- Figma file key `TlIT2Cy6DqGvN9kiODC9dz`, page `0:1`. Asset URLs from the Figma MCP expire with the session — download them in the same session that reads the design.
- **Never invent file paths, site paths, or product data.** Where the Figma file shows unresolved placeholders, reword the beat so no fabricated location appears.
- All work happens on branch `copilot-prototype`.

---

### Task 1: Extract scenario 1 from Figma into a content inventory

No code yet. This task produces the written source of truth that Tasks 3 and 4 build from. Without it the later tasks would be guesswork against screenshots.

**Files:**
- Create: `docs/superpowers/notes/figma-scenario-1.md`
- Create: any true image exports in `assets/` (12-hex filenames)

**Interfaces:**
- Consumes: nothing
- Produces: `docs/superpowers/notes/figma-scenario-1.md`, containing for each of the 9 frames — frame node id, a one-line description of what changed from the previous frame, every string of visible copy verbatim, the element the user is meant to click, and whether each visual is CSS-buildable or needs an export.

- [ ] **Step 1: Load the design-to-code skill**

The Figma skill is a mandatory prerequisite for `get_design_context`. Run the `figma:figma-design-to-code` skill before the first call.

- [ ] **Step 2: Read each scenario 1 frame in order**

Call `get_design_context` with `fileKey: TlIT2Cy6DqGvN9kiODC9dz` once per node, in this order:

```
1:67292  1:67354  1:67310  1:67181  1:67203  1:67225  1:67247  1:67269  1:67332
```

Also read the shared components: `1:67949` (chat pane), `1:67883` (latency card), `1:67901` (email output card).

- [ ] **Step 3: Write the inventory**

For each frame, record in `docs/superpowers/notes/figma-scenario-1.md`:

```markdown
## Frame 4 — `1:67181`
**Changes from previous:** Copilot answer lands, three citations, suggestion chip appears
**Click target:** suggestion chip "Create a draft consent model"
**Copy (verbatim):**
- Heading: "..."
- Body: "..."
- Chip: "Create a draft consent model"
**Visuals:** all CSS (pill, card, citation badges). No exports needed.
```

- [ ] **Step 4: Flag placeholder content**

Text layer `1:67583` reads "Placeholder location paths, need PM suggestions:". Wherever scenario 1 depends on those paths, write a **Reword** note in the inventory proposing copy that carries the same meaning without naming a location. Do not invent paths.

- [ ] **Step 5: Export only what CSS cannot draw**

For each visual marked "needs export", get the asset URL, then:

```bash
curl -sL -o "assets/$(openssl rand -hex 6).png" "<asset-url>"
```

Record the resulting filename next to the visual in the inventory.

- [ ] **Step 6: Commit**

```bash
git add docs/superpowers/notes/figma-scenario-1.md assets/
git commit -m "Record scenario 1 design inventory from Figma"
```

---

### Task 2: Engine state machine

**Files:**
- Create: `assets/prototype/engine.js`
- Test: `assets/prototype/engine.test.js`

**Interfaces:**
- Consumes: nothing
- Produces:
  - `initialState(scenario) -> State`
  - `applyBeat(state, beat, content) -> State`
  - `stateAt(scenario, content, beatIndex) -> State`
  - `State` is `{ scenarioId, beatIndex, view, chat, wizard, prompt }` where `chat` is an array of `{ role: 'user'|'assistant', text?, key?, ...contentFields }` and `wizard` is `null` or `{ title, fields: [{ id, label, value, source: 'ai'|'user' }] }`
  - `applyBeat` returns the **settled** state at the end of a beat. Animation is not its concern.

- [ ] **Step 1: Write the failing tests**

Create `assets/prototype/engine.test.js`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { initialState, applyBeat, stateAt } from './engine.js';

const content = {
  'answer-demo': { text: 'Here is what California requires.' },
  'wizard-demo': { title: 'New consent model', fields: [{ id: 'name', label: 'Name', value: 'CCPA baseline' }] }
};

const scenario = {
  id: 'demo',
  initial: { view: 'home' },
  beats: [
    { spotlight: '#prompt-bar', await: 'click',
      then: { type: { into: '#prompt-bar', text: 'What does California require?' },
              push: { chat: 'answer-demo' } } },
    { spotlight: '#chip', await: 'click',
      then: { set: { view: 'wizard' }, populate: { wizard: 'wizard-demo' } } }
  ]
};

test('initialState starts before the first beat with an empty chat', () => {
  const s = initialState(scenario);
  assert.equal(s.view, 'home');
  assert.equal(s.beatIndex, -1);
  assert.deepEqual(s.chat, []);
  assert.equal(s.wizard, null);
});

test('a type beat records the typed text as a user message', () => {
  const s = applyBeat(initialState(scenario), scenario.beats[0], content);
  assert.equal(s.chat[0].role, 'user');
  assert.equal(s.chat[0].text, 'What does California require?');
  assert.equal(s.prompt, '');
});

test('a push beat appends the named content as an assistant message', () => {
  const s = applyBeat(initialState(scenario), scenario.beats[0], content);
  assert.equal(s.chat[1].role, 'assistant');
  assert.equal(s.chat[1].text, 'Here is what California requires.');
});

test('a populate beat marks every field as AI-sourced', () => {
  const s = stateAt(scenario, content, 1);
  assert.equal(s.view, 'wizard');
  assert.equal(s.wizard.fields[0].source, 'ai');
});

test('an unknown content key fails loudly', () => {
  const bad = { then: { push: { chat: 'does-not-exist' } } };
  assert.throws(() => applyBeat(initialState(scenario), bad, content), /does-not-exist/);
});

test('replaying to a beat equals stepping through to it', () => {
  let stepped = initialState(scenario);
  for (const beat of scenario.beats) stepped = applyBeat(stepped, beat, content);
  assert.deepEqual(stateAt(scenario, content, scenario.beats.length - 1), stepped);
});

test('reset returns exactly the initial state', () => {
  const before = initialState(scenario);
  stateAt(scenario, content, 1);
  assert.deepEqual(initialState(scenario), before);
});

test('applyBeat does not mutate the state it is given', () => {
  const before = initialState(scenario);
  const snapshot = structuredClone(before);
  applyBeat(before, scenario.beats[0], content);
  assert.deepEqual(before, snapshot);
});
```

- [ ] **Step 2: Run the tests and watch them fail**

```bash
node --test assets/prototype/
```

Expected: failure, `Cannot find module .../engine.js`.

- [ ] **Step 3: Implement the engine**

Create `assets/prototype/engine.js`:

```js
/**
 * Pure state machine. Beats fold over state; the DOM is never consulted.
 * applyBeat returns the settled state at the END of a beat — animation is
 * presentational and lives in mount.js.
 */

export function initialState(scenario) {
  return {
    scenarioId: scenario.id,
    beatIndex: -1,
    view: scenario.initial.view,
    chat: [],
    wizard: null,
    prompt: ''
  };
}

function lookup(content, key) {
  const entry = content[key];
  if (!entry) throw new Error(`Unknown content key: ${key}`);
  return entry;
}

export function applyBeat(state, beat, content) {
  const then = beat.then || {};
  const next = { ...state, chat: state.chat.slice(), beatIndex: state.beatIndex + 1 };

  if (then.type) {
    next.chat.push({ role: 'user', text: then.type.text });
    next.prompt = '';
  }
  if (then.push && then.push.chat) {
    next.chat.push({ role: 'assistant', key: then.push.chat, ...lookup(content, then.push.chat) });
  }
  if (then.set) {
    Object.assign(next, then.set);
  }
  if (then.populate && then.populate.wizard) {
    const source = lookup(content, then.populate.wizard);
    next.wizard = {
      title: source.title,
      fields: source.fields.map(field => ({ ...field, source: 'ai' }))
    };
  }
  return next;
}

export function stateAt(scenario, content, beatIndex) {
  let state = initialState(scenario);
  for (let i = 0; i <= beatIndex; i += 1) {
    state = applyBeat(state, scenario.beats[i], content);
  }
  return state;
}
```

- [ ] **Step 4: Run the tests and watch them pass**

```bash
node --test assets/prototype/
```

Expected: 8 passing.

- [ ] **Step 5: Commit**

```bash
git add assets/prototype/engine.js assets/prototype/engine.test.js
git commit -m "Add the prototype beat engine with tests"
```

---

### Task 3: Scenario 1 as data

**Files:**
- Create: `assets/prototype/scenarios.js`
- Read: `docs/superpowers/notes/figma-scenario-1.md`

**Interfaces:**
- Consumes: `engine.js` state shape; the Task 1 inventory
- Produces: `export const SCENARIOS` (array) and `export const CONTENT` (object). Scenario shape: `{ id, label, product, initial: { view }, beats: [] }`. Beat shape: `{ spotlight, await: 'click', then: { type?, thinking?, push?, set?, populate? } }`.

- [ ] **Step 1: Write scenario 1 from the inventory**

Create `assets/prototype/scenarios.js`. Copy every visible string verbatim from `docs/superpowers/notes/figma-scenario-1.md`. Structure:

```js
/**
 * Demo scripts. DATA ONLY — no imports, no functions, no DOM.
 * Safe to edit copy here without touching any logic.
 */

export const CONTENT = {
  'answer-ccpa': {
    text: '…verbatim from the inventory…',
    citations: ['…', '…', '…']
  },
  'ccpa-draft': {
    title: '…verbatim…',
    fields: [
      { id: 'model-name', label: '…', value: '…' }
    ]
  }
};

export const SCENARIOS = [
  {
    id: 'consent',
    label: '1 — Summarize consent laws + create draft model',
    product: 'Consent Management',
    initial: { view: 'home' },
    beats: [
      { spotlight: '#prompt-bar', await: 'click',
        then: { type: { into: '#prompt-bar', text: '…verbatim…' },
                thinking: 900,
                push: { chat: 'answer-ccpa' } } }
    ]
  }
];
```

One beat per frame transition from the inventory — 8 beats for scenario 1's 9 frames.

- [ ] **Step 2: Apply the placeholder rewords**

For every **Reword** note recorded in Task 1, use the reworded copy here. Confirm by grepping for invented-looking paths:

```bash
grep -nE '[A-Za-z]:\\\\|/(contoso|placeholder|lorem)' assets/prototype/scenarios.js
```

Expected: no output.

- [ ] **Step 3: Sanity-check the data loads and folds**

```bash
node --input-type=module -e "
import { SCENARIOS, CONTENT } from './assets/prototype/scenarios.js';
import { stateAt } from './assets/prototype/engine.js';
const s = SCENARIOS[0];
const end = stateAt(s, CONTENT, s.beats.length - 1);
console.log(s.beats.length, 'beats ->', end.view, end.chat.length, 'messages');
"
```

Expected: a beat count, a final view name, and a non-zero message count, with no thrown error.

- [ ] **Step 4: Commit**

```bash
git add assets/prototype/scenarios.js
git commit -m "Add scenario 1 demo script as data"
```

---

### Task 4: Shell components, hotspot registry, and desktop styling

**Files:**
- Create: `assets/prototype/shell.js`
- Create: `assets/prototype/prototype.css`

**Interfaces:**
- Consumes: the `State` shape from Task 2
- Produces:
  - `export const HOTSPOTS` — `{ [viewName]: string[] }`, the single declaration of every clickable id. Renderers read ids from this map; they never hardcode a selector string.
  - `export function render(state) -> DocumentFragment` — same state in, same DOM out. No event listeners, no timers, no `document` queries.

- [ ] **Step 1: Declare the hotspot registry**

Create `assets/prototype/shell.js` starting with the registry, populated from the Task 1 inventory's click targets:

```js
/**
 * Renders state into DOM. Knows nothing about scenarios, beats, or ordering.
 * HOTSPOTS is the single source of truth for clickable ids — renderers read
 * from it so the registry can never drift from the DOM it describes.
 */
export const HOTSPOTS = {
  home:   ['#prompt-bar', '#suggestion-create-model'],
  answer: ['#suggestion-create-model'],
  wizard: ['#wizard-submit'],
  report: ['#report-export']
};
```

- [ ] **Step 2: Implement the renderers**

Add to `shell.js` one function per component — `renderChrome`, `renderChatPane`, `renderHome`, `renderWizard`, `renderReport` — and a `render(state)` that composes them by `state.view`. Rules: build nodes with `document.createElement`, never `innerHTML` with interpolated content; give each hotspot element a real `<button>` and take its id from `HOTSPOTS`; mark AI-sourced wizard fields with `data-source="ai"` so CSS can badge them.

```js
function hotspotButton(id, label, className) {
  const button = document.createElement('button');
  button.type = 'button';
  button.id = id.replace('#', '');
  button.className = className;
  button.textContent = label;
  return button;
}

export function render(state) {
  const fragment = document.createDocumentFragment();
  fragment.append(renderChrome(state));
  if (state.view === 'wizard') fragment.append(renderWizard(state.wizard));
  else if (state.view === 'report') fragment.append(renderReport(state));
  else fragment.append(renderHome(state));
  fragment.append(renderChatPane(state.chat));
  return fragment;
}
```

- [ ] **Step 3: Write the desktop stylesheet**

Create `assets/prototype/prototype.css`. Define a token layer at the top (`--pp-bg`, `--pp-surface`, `--pp-accent`, `--pp-ai`, radii, spacing) taken from the Figma values in the inventory. Lay out the canvas at its true size and let a transform scale it:

```css
.pp-canvas {
  width: 1920px;
  height: 1080px;
  transform: scale(var(--pp-scale, 1));
  transform-origin: top center;
}
```

Build cards, pills, the latency card, and the progress bar in CSS — do not use exported images for them.

- [ ] **Step 4: Verify the registry and renderers agree**

```bash
node --input-type=module -e "
import { HOTSPOTS } from './assets/prototype/shell.js';
console.log(Object.keys(HOTSPOTS).join(', '));
"
```

Expected: the view names print, proving the module parses and exports cleanly under Node.

- [ ] **Step 5: Commit**

```bash
git add assets/prototype/shell.js assets/prototype/prototype.css
git commit -m "Add prototype shell components and desktop styling"
```

---

### Task 5: Scenario data validator

This is the test that protects late-night copy edits. It must not need a DOM.

**Files:**
- Test: `assets/prototype/scenarios.test.js`

**Interfaces:**
- Consumes: `SCENARIOS`, `CONTENT` from Task 3; `HOTSPOTS` from Task 4
- Produces: nothing importable

- [ ] **Step 1: Write the validator tests**

Create `assets/prototype/scenarios.test.js`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { SCENARIOS, CONTENT } from './scenarios.js';
import { HOTSPOTS } from './shell.js';
import { initialState, applyBeat } from './engine.js';

const everyHotspot = new Set(Object.values(HOTSPOTS).flat());

test('every scenario has the required fields', () => {
  for (const scenario of SCENARIOS) {
    assert.ok(scenario.id, 'scenario needs an id');
    assert.ok(scenario.label, `${scenario.id} needs a label`);
    assert.ok(scenario.initial && scenario.initial.view, `${scenario.id} needs an initial view`);
    assert.ok(scenario.beats.length > 0, `${scenario.id} has no beats`);
  }
});

test('every spotlight is a hotspot the shell actually renders', () => {
  for (const scenario of SCENARIOS) {
    for (const [index, beat] of scenario.beats.entries()) {
      assert.ok(
        everyHotspot.has(beat.spotlight),
        `${scenario.id} beat ${index} points at ${beat.spotlight}, which no view renders`
      );
    }
  }
});

test('the spotlight for each beat exists in the view that beat runs in', () => {
  for (const scenario of SCENARIOS) {
    let state = initialState(scenario);
    for (const [index, beat] of scenario.beats.entries()) {
      const available = HOTSPOTS[state.view] || [];
      assert.ok(
        available.includes(beat.spotlight),
        `${scenario.id} beat ${index} spotlights ${beat.spotlight} while view is "${state.view}"`
      );
      state = applyBeat(state, beat, CONTENT);
    }
  }
});

test('every content key referenced by a beat exists', () => {
  for (const scenario of SCENARIOS) {
    for (const beat of scenario.beats) {
      const then = beat.then || {};
      if (then.push && then.push.chat) assert.ok(CONTENT[then.push.chat], `missing content: ${then.push.chat}`);
      if (then.populate && then.populate.wizard) assert.ok(CONTENT[then.populate.wizard], `missing content: ${then.populate.wizard}`);
    }
  }
});

test('no content entry is orphaned', () => {
  const used = new Set();
  for (const scenario of SCENARIOS) {
    for (const beat of scenario.beats) {
      const then = beat.then || {};
      if (then.push && then.push.chat) used.add(then.push.chat);
      if (then.populate && then.populate.wizard) used.add(then.populate.wizard);
    }
  }
  const orphans = Object.keys(CONTENT).filter(key => !used.has(key));
  assert.deepEqual(orphans, [], `unused content entries: ${orphans.join(', ')}`);
});

test('every scenario folds from first beat to last without throwing', () => {
  for (const scenario of SCENARIOS) {
    let state = initialState(scenario);
    for (const beat of scenario.beats) state = applyBeat(state, beat, CONTENT);
    assert.equal(state.beatIndex, scenario.beats.length - 1);
  }
});
```

- [ ] **Step 2: Run the tests**

```bash
node --test assets/prototype/
```

Expected: all pass. If the spotlight-in-view test fails, the fix is in `scenarios.js` or `HOTSPOTS` — not in the test.

- [ ] **Step 3: Commit**

```bash
git add assets/prototype/scenarios.test.js
git commit -m "Validate scenario data against the shell's hotspot registry"
```

---

### Task 6: Mount the page and run scenario 1 end to end

**Files:**
- Create: `assets/prototype/mount.js`
- Create: `prototype-copilot.html`

**Interfaces:**
- Consumes: `render`, `HOTSPOTS` (Task 4); `initialState`, `applyBeat`, `stateAt` (Task 2); `SCENARIOS`, `CONTENT` (Task 3)
- Produces: a working page. `mount.js` exports `export function mount(root)`.

- [ ] **Step 1: Build the page shell**

Create `prototype-copilot.html` copying the `<nav>` and `<footer>` markup and the font links from `case-study-02-copilot.html` so the page matches the site. Between them:

```html
<link rel="stylesheet" href="assets/prototype/prototype.css">
<main id="main" tabindex="-1">
  <header class="pp-intro">
    <p class="pp-eyebrow">Interactive prototype</p>
    <h1>Copilot Privacy Manager</h1>
    <p class="pp-lede">Four scenarios, rebuilt in code from the original Figma designs. Follow the highlighted step.</p>
  </header>
  <div class="pp-controls">
    <div class="pp-tabs" role="tablist" aria-label="Scenarios"></div>
    <p class="pp-step" aria-live="polite" aria-atomic="true"></p>
    <button type="button" id="pp-prev">Previous</button>
    <button type="button" id="pp-next">Next</button>
    <button type="button" id="pp-reset">Reset</button>
  </div>
  <div id="pp-root" class="pp-viewport"></div>
</main>
<script type="module">
  import { mount } from './assets/prototype/mount.js';
  mount(document.getElementById('pp-root'));
</script>
```

- [ ] **Step 2: Implement mount.js**

The only module allowed to touch `document`. It owns: current scenario and beat index, rendering on change, arming the spotlight, the typing animation, the idle timer, and the viewport scale.

```js
import { SCENARIOS, CONTENT } from './scenarios.js';
import { initialState, applyBeat, stateAt } from './engine.js';
import { render } from './shell.js';

const IDLE_MS = 90_000;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

export function mount(root) {
  let scenario = SCENARIOS[0];
  let state = initialState(scenario);
  let idleTimer;

  const draw = () => {
    root.replaceChildren(render(state));
    armSpotlight();
    announceStep();
  };

  const advance = () => {
    const beat = scenario.beats[state.beatIndex + 1];
    if (!beat) return;
    state = applyBeat(state, beat, CONTENT);
    draw();
  };

  const reset = () => {
    state = initialState(scenario);
    draw();
  };

  const armSpotlight = () => {
    const beat = scenario.beats[state.beatIndex + 1];
    root.querySelectorAll('.is-spotlit').forEach(el => el.classList.remove('is-spotlit'));
    if (!beat) return;
    const target = root.querySelector(beat.spotlight);
    if (!target) return;
    target.classList.add('is-spotlit');
    target.addEventListener('click', advance, { once: true });
  };

  const bumpIdle = () => {
    clearTimeout(idleTimer);
    if (document.hidden) return;
    idleTimer = setTimeout(reset, IDLE_MS);
  };

  document.addEventListener('visibilitychange', bumpIdle);
  root.addEventListener('pointerdown', bumpIdle);
  root.addEventListener('keydown', bumpIdle);
  document.getElementById('pp-reset').addEventListener('click', () => { reset(); bumpIdle(); });
  document.getElementById('pp-next').addEventListener('click', () => { advance(); bumpIdle(); });
  document.getElementById('pp-prev').addEventListener('click', () => {
    state = stateAt(scenario, CONTENT, state.beatIndex - 1);
    draw();
    bumpIdle();
  });

  buildTabs(id => { scenario = SCENARIOS.find(s => s.id === id); reset(); });
  fitCanvas(root);
  addEventListener('resize', () => fitCanvas(root));
  draw();
  bumpIdle();
}
```

Add `buildTabs`, `announceStep` (writes "Step N of M" into `.pp-step`), and `fitCanvas`:

```js
function fitCanvas(root) {
  const canvas = root.querySelector('.pp-canvas');
  if (!canvas) return;
  const scale = Math.min(1, root.clientWidth / 1920);
  canvas.style.setProperty('--pp-scale', scale);
  root.style.height = `${1080 * scale}px`;
}
```

- [ ] **Step 3: Add the typing animation**

Between applying a `type` beat and drawing, animate the text into the prompt bar character by character. Two rules: if `reduceMotion` is true, set the text complete immediately; and a click on the armed spotlight while typing fast-forwards the text to complete rather than queueing a second advance. Guard with a module-level `let typing = false` checked at the top of `advance`.

- [ ] **Step 4: Render the thinking latency card**

A beat carrying `then.thinking: <ms>` shows the latency card from Figma
(`1:67883`) for that long before the assistant message appears. It is purely
presentational — `applyBeat` already returned the settled state including the
message, so `mount.js` delays revealing that last chat entry rather than
delaying the state change:

```js
const revealAfterThinking = (beat) => {
  const pause = reduceMotion ? 0 : (beat.then && beat.then.thinking) || 0;
  if (!pause) return Promise.resolve();
  root.querySelector('.pp-chat').append(latencyCard());
  return new Promise(resolve => setTimeout(() => {
    root.querySelector('.pp-latency')?.remove();
    resolve();
  }, pause));
};
```

Under reduced motion the pause is zero and the card never appears. Reset and
Previous must clear any in-flight timer — track it in the same module-level
variable the typing animation uses.

- [ ] **Step 5: Make wizard fields genuinely editable**

The wizard's AI-populated fields must be real, editable inputs — that is the
point the case study makes about attributable, editable suggestions. This is the
one place the DOM leads: an `input` event writes to state and the wizard is
**not** re-rendered while one of its fields holds focus, so the caret survives.

```js
root.addEventListener('input', (event) => {
  const field = event.target.closest('[data-field-id]');
  if (!field || !state.wizard) return;
  state = {
    ...state,
    wizard: {
      ...state.wizard,
      fields: state.wizard.fields.map(f =>
        f.id === field.dataset.fieldId ? { ...f, value: field.value, source: 'user' } : f)
    }
  };
  bumpIdle();
});
```

Changing a field flips its `source` from `ai` to `user`, so the "Copilot
suggested" badge disappears once a human has edited it. Verify by editing a
field, clicking Reset, and confirming the original AI value and badge return.

- [ ] **Step 6: Verify in a browser**

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000/prototype-copilot.html`. Walk scenario 1 start to finish. Confirm: the spotlight is always on exactly one element; Reset returns to beat one with the chat cleared; Previous steps back correctly; the canvas scales to the window with no horizontal scrollbar.

- [ ] **Step 7: Verify the idle reset**

Advance two beats, then leave the page untouched for 90 seconds. Expected: it returns to beat one on its own. Switch to another tab mid-wait and back; it should not fire while hidden.

- [ ] **Step 8: Commit**

```bash
git add prototype-copilot.html assets/prototype/mount.js
git commit -m "Run scenario 1 end to end on a standalone prototype page"
```

---

### Task 7: Scenarios 2.1, 2.2, and 3

Repeat Tasks 1 and 3 for the remaining three rows. Each scenario is committed separately so a reviewer can accept one and reject another.

**Files:**
- Create: `docs/superpowers/notes/figma-scenario-2-1.md`, `-2-2.md`, `-3.md`
- Modify: `assets/prototype/scenarios.js`, `assets/prototype/shell.js` (new views and hotspots only)

**Interfaces:**
- Consumes: everything from Tasks 2-5
- Produces: `SCENARIOS` with four entries; `HOTSPOTS` extended with any new view

- [ ] **Step 1: Extract scenario 2.1 (Subject Rights Requests)**

Frames in order: `1:67165`, `1:67371`, `1:67788`, `1:67810`, `1:67834`, `1:67859`, `1:92886`. Also read the email output card `1:67901` — this scenario ends in contacting owners by email. Write `docs/superpowers/notes/figma-scenario-2-1.md` in the Task 1 format.

- [ ] **Step 2: Add scenario 2.1 to scenarios.js**

Append to `SCENARIOS` with `id: 'srr'`, `product: 'Subject Rights Requests'`. If it needs a view the shell lacks (an email composer, a metrics answer), add the renderer to `shell.js` and its ids to `HOTSPOTS` in the same commit.

- [ ] **Step 3: Run the tests**

```bash
node --test assets/prototype/
```

Expected: pass. The validator will name any spotlight that does not exist in its view.

- [ ] **Step 4: Commit**

```bash
git add docs/superpowers/notes/figma-scenario-2-1.md assets/prototype/
git commit -m "Add the SRR compliance-issues scenario"
```

- [ ] **Step 5: Repeat for scenario 2.2 (Tracker Scanning)**

Frames: `1:67517`, `1:67388`, `1:67487`, `1:67427`, `1:67457`. Id `tracker`, product `Tracker Scanning`. This scenario contacts owners via Teams or email. Run the tests, then commit with message `Add the tracker scanning compliance-issues scenario`.

- [ ] **Step 6: Repeat for scenario 3 (Privacy Assessments)**

Frames: `1:67565`, `1:67584`, `1:67760`, `1:67601`, `1:67629`. Id `ropa`, product `Privacy Assessments`. Ends in a draft data inventory report. Run the tests, then commit with message `Add the data inventory / RoPA scenario`.

- [ ] **Step 7: Walk all four in a browser**

Serve the page and click each scenario tab through to its end. Confirm switching tabs resets the outgoing scenario and that the step counter matches each scenario's beat count.

---

### Task 8: Mobile reflow

**Files:**
- Modify: `assets/prototype/prototype.css`
- Modify: `assets/prototype/mount.js` (disable canvas scaling below the breakpoint)

**Interfaces:**
- Consumes: the shell DOM from Task 4
- Produces: no new exports

- [ ] **Step 1: Stop scaling below 768px**

In `fitCanvas`, return early when the viewport is narrow so the transform never applies:

```js
function fitCanvas(root) {
  const canvas = root.querySelector('.pp-canvas');
  if (!canvas) return;
  if (innerWidth < 768) {
    canvas.style.removeProperty('--pp-scale');
    root.style.removeProperty('height');
    return;
  }
  const scale = Math.min(1, root.clientWidth / 1920);
  canvas.style.setProperty('--pp-scale', scale);
  root.style.height = `${1080 * scale}px`;
}
```

- [ ] **Step 2: Write the reflow rules**

In `prototype.css`, under `@media (max-width: 767px)`: release the canvas from its fixed 1920x1080 box to `width: 100%; height: auto; transform: none;`; make the chat pane a bottom sheet pinned with `position: sticky; bottom: 0;`; stack wizard fields to one column; collapse card grids to a single column; raise base font size so nothing depends on scaling to be legible.

- [ ] **Step 3: Verify on a narrow viewport**

Serve the page, open dev tools device emulation at 390x844, and walk one full scenario. Confirm: no horizontal scrolling anywhere, the spotlight is visible without pinch-zoom, tap targets are at least 44px, and the chat sheet does not cover the armed hotspot.

- [ ] **Step 4: Verify the breakpoint boundary**

Drag the window slowly across 768px. Expected: layouts swap cleanly with no overlap or clipped chrome at either side.

- [ ] **Step 5: Commit**

```bash
git add assets/prototype/prototype.css assets/prototype/mount.js
git commit -m "Reflow the prototype for phones below 768px"
```

---

### Task 9: Call-to-action band in case study 02

**Files:**
- Modify: `case-study-02-copilot.html`

**Interfaces:**
- Consumes: `prototype-copilot.html`
- Produces: nothing importable

- [ ] **Step 1: Add the band after the TL;DR**

`case-study-02-copilot.html` has its TL;DR section around line 1587 and the Outcome slide around line 1712. Insert after the TL;DR `</div>`:

```html
<a class="cs-proto-cta" href="prototype-copilot.html">
  <span class="cs-proto-cta-label">Interactive prototype</span>
  <span class="cs-proto-cta-title">Walk all four Copilot scenarios yourself</span>
  <span class="cs-proto-cta-note">Rebuilt in code from the original designs — no video, no slideshow.</span>
  <span class="cs-proto-cta-go" aria-hidden="true">&rarr;</span>
</a>
```

- [ ] **Step 2: Style it in the page's inline stylesheet**

The page keeps its CSS inline (ends line 1465). Add `.cs-proto-cta` rules there using the page's existing custom properties — full-width, clearly interactive, with a subtle animated element so it reads as live rather than as a static banner. Honor `prefers-reduced-motion` by stilling that animation.

- [ ] **Step 3: Repeat the band at the Outcome**

Add a second, more compact instance after the Outcome slide so a reader who scrolls the carousel meets it again.

- [ ] **Step 4: Verify**

Open the case study, confirm both bands render, both link correctly, and neither disturbs the carousel's layout or swipe behavior on a phone width.

- [ ] **Step 5: Commit**

```bash
git add case-study-02-copilot.html
git commit -m "Point case study 02 at the interactive prototype"
```

---

### Task 10: Accessibility, cross-browser, and docs

**Files:**
- Modify: `assets/prototype/shell.js`, `assets/prototype/prototype.css`, `assets/prototype/mount.js` as findings require
- Modify: `README.md`

**Interfaces:**
- Consumes: everything
- Produces: a publishable prototype

- [ ] **Step 1: Keyboard pass**

Tab through a full scenario using only the keyboard. Required: the armed spotlight is reachable and visibly focused, Enter and Space both advance, focus never gets trapped, and focus moves to the newly armed hotspot after each beat rather than resetting to the top of the page.

- [ ] **Step 2: Screen reader pass**

With VoiceOver on, confirm assistant responses are announced from the polite live region, step changes announce as "Step 3 of 9", and no hotspot announces as an unlabeled button.

- [ ] **Step 3: Reduced motion pass**

Enable Reduce Motion in System Settings, reload, and walk a scenario. Required: text appears complete and instantly, no beat is skipped or merged, and the CTA band's animation is still.

- [ ] **Step 4: Contrast check**

Verify the spotlight ring is not the only signal for any action, and that the AI-sourced field badge meets 4.5:1 against its background.

- [ ] **Step 5: Cross-browser pass**

Walk one full scenario in Safari, in Chrome, and on a real phone. Record anything broken and fix before continuing.

- [ ] **Step 6: Update the README**

Add `prototype-copilot.html` and `assets/prototype/` to the structure listing. Document two things: that this page uses ES modules and therefore must be served over HTTP rather than opened via `file://`, and that the tests run with `node --test assets/prototype/`.

- [ ] **Step 7: Run the full test suite one last time**

```bash
node --test assets/prototype/
```

Expected: all pass.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "Accessibility and cross-browser pass; document the prototype"
```
