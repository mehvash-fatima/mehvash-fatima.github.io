/**
 * The browser layer.
 *
 * This is the ONLY module allowed to touch `document`. engine.js folds beats
 * into state, shell.js turns state into DOM, scenarios.js is data; everything
 * with a listener, a timer or a class toggle on it lives here.
 *
 * Sequencing rule (the one thing that is easy to get backwards):
 * a beat's `then.type.when` says WHERE the typing animation plays.
 *   'before' — type into the view the beat STARTS in, then apply the beat.
 *   'after'  — apply the beat and draw first, then type into the new view.
 * Nothing re-derives that from the view names; the scenario declares it.
 */
import { SCENARIOS, CONTENT } from './scenarios.js';
import { initialState, applyBeat, stateAt } from './engine.js';
import { render, HOTSPOTS } from './shell.js';

/**
 * Every hotspot selector the shell can render, in any view. `armSpotlight`
 * disarms over this union rather than over the current view's list: a view's
 * entry in HOTSPOTS says which hotspots that view may ARM, but the chat
 * transcript carries suggested-action buttons forward into later views, so a
 * button armed in `answer` is still in the DOM once the dialog opens. Sweeping
 * only the current view left those looking and behaving live — enabled, in the
 * tab order, silently inert on click. Ids still live only in HOTSPOTS.
 */
const ALL_HOTSPOTS = [...new Set(Object.values(HOTSPOTS).flat())];

const IDLE_MS = 90_000;
const TYPE_MS = 26;        // per character
const CANVAS_W = 1920;
const CANVAS_H = 1080;

/**
 * Frame 2's loading copy, verbatim from
 * docs/superpowers/notes/figma-scenario-1.md. Shown for `then.thinking` ms
 * while the settled answer is held back.
 */
const LOADING = {
  heading: 'Generating response...',
  body: 'Copilot is searching across Priva solutions to generate a response and suggest questions to help you get started. '
};

const motion = matchMedia('(prefers-reduced-motion: reduce)');
/** Read live, not once: the OS setting can change while the page is open. */
const reduceMotion = () => motion.matches;

/* ------------------------------------------------------------------ *
 * Small DOM helpers
 * ------------------------------------------------------------------ */

/**
 * Writes the in-progress text into a typing target. Two shapes exist:
 * real editable controls (the dialog's textarea) and the prompt bar, which
 * is a button showing its text in a `.pp-prompt-text` span.
 */
function writeTyped(target, text) {
  if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
    target.value = text;
    return;
  }
  const slot = target.querySelector('.pp-prompt-text') || target;
  slot.classList.toggle('is-placeholder', !text);
  slot.textContent = text;
}

function latencyCard() {
  const card = document.createElement('div');
  card.className = 'pp-latency';
  card.setAttribute('role', 'status');

  const heading = document.createElement('p');
  heading.className = 'pp-latency-heading';
  heading.textContent = LOADING.heading;

  const body = document.createElement('p');
  body.className = 'pp-latency-text';
  body.textContent = LOADING.body;

  const track = document.createElement('div');
  track.className = 'pp-progress';
  const bar = document.createElement('div');
  bar.className = 'pp-progress-bar';
  track.append(bar);

  card.append(heading, body, track);
  return card;
}

/* ------------------------------------------------------------------ *
 * mount
 * ------------------------------------------------------------------ */
export function mount(root) {
  if (!root) return;

  let scenario = SCENARIOS[0];
  let state = initialState(scenario);

  // --- in-flight bookkeeping ---------------------------------------
  // `stepTimer` is the single timer the typing animation and the thinking
  // pause share, so one clear kills whichever is running.
  // `inFlight` is non-null exactly while an animation can be fast-forwarded.
  // `running` covers the whole beat sequence including the gaps between
  // awaits, so a click can never start a second beat.
  // `runToken` invalidates anything still resolving after a cancel.
  let idleTimer = 0;
  let stepTimer = 0;
  let inFlight = null;
  let running = false;
  let runToken = 0;

  const el = id => document.getElementById(id);
  const nextBeat = () => scenario.beats[state.beatIndex + 1];

  /** Kills every pending timer and orphans any promise still in flight. */
  const cancel = () => {
    runToken += 1;
    clearTimeout(stepTimer);
    stepTimer = 0;
    inFlight = null;
    running = false;
  };

  /* --- viewport ---------------------------------------------------- */
  const fitCanvas = () => {
    const canvas = root.querySelector('.pp-canvas');
    if (!canvas) return;
    const scale = Math.min(1, root.clientWidth / CANVAS_W);
    canvas.style.setProperty('--pp-scale', String(scale));
    root.style.height = `${Math.round(CANVAS_H * scale)}px`;
  };

  /* --- spotlight --------------------------------------------------- */
  /**
   * Arms exactly one hotspot: the one the NEXT beat names. Every other
   * hotspot rendered in this view is made inert and taken out of the tab
   * order, so "click the highlighted thing" is the only path forward.
   * At the terminal beat nothing is armed at all.
   */
  const armSpotlight = (enabled = true) => {
    const beat = enabled ? nextBeat() : null;
    for (const selector of ALL_HOTSPOTS) {
      const node = root.querySelector(selector);
      if (!node) continue;
      const armed = Boolean(beat) && beat.spotlight === selector;
      node.classList.toggle('is-spotlit', armed);
      node.classList.toggle('is-inert', !armed);
      if (armed) {
        node.removeAttribute('aria-disabled');
        node.removeAttribute('tabindex');
      } else {
        node.setAttribute('aria-disabled', 'true');
        node.setAttribute('tabindex', '-1');
      }
    }
    return beat ? root.querySelector(beat.spotlight) : null;
  };

  /* --- host chrome ------------------------------------------------- */
  const announce = () => {
    const total = scenario.beats.length;
    const beat = nextBeat();
    const step = el('pp-step');
    if (step) {
      step.textContent = `Step ${Math.min(state.beatIndex + 2, total)} of ${total}`;
    }
    const complete = el('pp-complete');
    if (complete) complete.hidden = Boolean(beat);
    const prev = el('pp-prev');
    if (prev) prev.disabled = state.beatIndex < 0;
    const next = el('pp-next');
    if (next) next.disabled = !beat;
  };

  /* --- draw -------------------------------------------------------- */
  // Set when a draw wanted to hand focus on but could not, because the
  // spotlight was held back behind the thinking pause. Consumed when the
  // pause ends and the spotlight is finally armed.
  let focusOnArm = false;

  /**
   * `arm: false` draws the settled state with NO spotlight. Used for the
   * thinking pause: the suggested-action card the next beat targets is held
   * hidden behind the latency card, and a spotlight ring on an invisible
   * button would be a lie.
   */
  const draw = ({ arm = true } = {}) => {
    // Keyboard users drive this with Enter/Space on the armed button, and
    // replaceChildren destroys that button. Move focus onto the new one, but
    // only if focus was already inside the canvas — never steal it otherwise.
    const hadFocus = root.contains(document.activeElement);
    root.replaceChildren(render(state));
    fitCanvas();
    const armed = armSpotlight(arm);
    announce();
    focusOnArm = hadFocus && !arm;
    if (hadFocus && armed) armed.focus();
  };

  /* --- typing ------------------------------------------------------ */
  /**
   * Types `text` into `selector` one character at a time. Resolves when the
   * text is complete, when it is fast-forwarded, or when the run is cancelled
   * (the caller re-checks its token after every await).
   */
  const typeInto = (selector, text) => new Promise(resolve => {
    const target = root.querySelector(selector);
    if (!target) { resolve(); return; }
    const token = runToken;

    const finish = () => {
      clearTimeout(stepTimer);
      stepTimer = 0;
      writeTyped(target, text);
      target.classList.remove('is-typing');
      inFlight = null;
      resolve();
    };

    if (reduceMotion()) { finish(); return; }

    target.classList.add('is-typing');
    writeTyped(target, '');
    inFlight = { skip: finish };

    let index = 0;
    const tick = () => {
      if (token !== runToken) { resolve(); return; }
      index += 1;
      writeTyped(target, text.slice(0, index));
      if (index >= text.length) { finish(); return; }
      stepTimer = setTimeout(tick, TYPE_MS);
    };
    stepTimer = setTimeout(tick, TYPE_MS);
  });

  /* --- thinking ---------------------------------------------------- */
  /**
   * applyBeat already returned the settled state, message and all. The pause
   * is purely presentational, so the newest chat entry (and the suggested
   * actions that arrive with it) are held hidden behind the latency card for
   * `ms`, then revealed. Under reduced motion there is no pause and no card —
   * the beat still happens, it just settles instantly.
   */
  const thinkFor = ms => new Promise(resolve => {
    if (!ms || reduceMotion()) { resolve(); return; }
    const token = runToken;
    const chat = root.querySelector('.pp-chat');
    const held = chat ? chat.lastElementChild : null;
    const actions = root.querySelector('.pp-actions');
    if (held) held.hidden = true;
    if (actions) actions.classList.add('is-pending');
    const card = latencyCard();
    if (chat) chat.append(card);

    const finish = () => {
      clearTimeout(stepTimer);
      stepTimer = 0;
      card.remove();
      if (held) held.hidden = false;
      if (actions) actions.classList.remove('is-pending');
      inFlight = null;
      resolve();
    };

    inFlight = { skip: finish };
    stepTimer = setTimeout(() => {
      if (token !== runToken) { resolve(); return; }
      finish();
    }, ms);
  });

  /* --- the beat sequence ------------------------------------------- */
  const runBeat = async beat => {
    running = true;
    const token = runToken;
    const then = beat.then || {};
    const type = then.type;

    if (type && type.when === 'before') {
      await typeInto(type.into, type.text);
      if (token !== runToken) return;
    }

    // A real pause only happens when motion is allowed; under reduce the beat
    // settles at once, so the spotlight is armed by this draw as usual.
    const pausing = Boolean(then.thinking) && !reduceMotion();
    state = applyBeat(state, beat, CONTENT);
    draw({ arm: !pausing });

    if (then.thinking) {
      await thinkFor(then.thinking);
      if (token !== runToken) return;
      if (pausing) {
        const armed = armSpotlight();
        if (focusOnArm && armed) armed.focus();
        focusOnArm = false;
      }
    }

    if (type && type.when === 'after') {
      // The bubble for this text is already on screen: `type` pushes it as a
      // user turn and the draw above rendered it. So hold it back, play the
      // typing into the composer, then clear the composer and reveal the
      // bubble — which is the order sending a message actually happens in.
      // Without this the settled frame shows the same sentence twice, once
      // in the transcript and once still sitting in the input.
      const pane = root.querySelector('.pp-chat');
      const sent = pane ? pane.lastElementChild : null;
      if (sent) sent.hidden = true;
      await typeInto(type.into, type.text);
      if (token !== runToken) { if (sent) sent.hidden = false; return; }
      const composer = root.querySelector(type.into);
      if (composer) writeTyped(composer, '');
      if (sent) sent.hidden = false;
    }

    running = false;
    inFlight = null;
  };

  /**
   * The single entry point forward. A click landing while something is
   * animating fast-forwards it — it never queues a second beat.
   */
  const advance = () => {
    bumpIdle();
    if (inFlight) { inFlight.skip(); return; }
    if (running) return;
    const beat = nextBeat();
    if (!beat) return;
    runBeat(beat);
  };

  const back = () => {
    cancel();
    if (state.beatIndex < 0) return;
    state = stateAt(scenario, CONTENT, state.beatIndex - 1);
    draw();
    bumpIdle();
  };

  const reset = () => {
    cancel();
    state = initialState(scenario);
    draw();
  };

  /* --- idle -------------------------------------------------------- */
  // Cleared whenever the tab goes hidden and restarted from zero when it
  // comes back, so returning to the tab never trips an already-expired timer.
  const bumpIdle = () => {
    clearTimeout(idleTimer);
    idleTimer = 0;
    if (document.hidden) return;
    idleTimer = setTimeout(() => {
      if (document.hidden) return;
      reset();
    }, IDLE_MS);
  };

  /* --- listeners ---------------------------------------------------- */
  // Delegated, so no listener ever outlives the node it was bound to.
  // The armed hotspots are real <button>s, so Enter and Space reach this
  // through the browser's own click synthesis — no key handling needed.
  root.addEventListener('click', event => {
    const spot = event.target.closest('.is-spotlit');
    if (spot) { advance(); return; }
    bumpIdle();
  });

  // The one place the DOM leads: a wizard field is a real control, and the
  // wizard is deliberately NOT re-rendered while it has focus, so the caret
  // survives. state.wizard carries step chrome (step, heading, totalSteps...)
  // as well as fields — it must be spread, not rebuilt.
  root.addEventListener('input', event => {
    const control = event.target;
    const fieldId = control.dataset ? control.dataset.fieldId : null;
    if (!fieldId || !state.wizard) return;
    state = {
      ...state,
      wizard: {
        ...state.wizard,
        fields: (state.wizard.fields || []).map(field =>
          field.id === fieldId ? { ...field, value: control.value, source: 'user' } : field)
      }
    };
    // Mirror the flip into the DOM by hand, since we are not re-rendering:
    // the "Copilot suggestion" badge is CSS keyed off data-source.
    const owner = control.closest('[data-source]');
    if (owner) owner.dataset.source = 'user';
    bumpIdle();
  });

  root.addEventListener('pointerdown', bumpIdle);
  root.addEventListener('keydown', bumpIdle);
  document.addEventListener('visibilitychange', bumpIdle);

  const bind = (id, handler) => {
    const node = el(id);
    if (node) node.addEventListener('click', handler);
  };
  bind('pp-next', advance);
  bind('pp-prev', back);
  bind('pp-reset', () => { reset(); bumpIdle(); });
  bind('pp-restart', () => { reset(); bumpIdle(); });

  /* --- scenario tabs ------------------------------------------------ */
  const tabs = document.querySelector('.pp-tabs');
  const syncTabs = () => {
    if (!tabs) return;
    for (const tab of tabs.querySelectorAll('[role="tab"]')) {
      tab.setAttribute('aria-selected', String(tab.dataset.scenarioId === scenario.id));
    }
  };
  if (tabs) {
    tabs.replaceChildren();
    for (const item of SCENARIOS) {
      const tab = document.createElement('button');
      tab.type = 'button';
      tab.setAttribute('role', 'tab');
      tab.dataset.scenarioId = item.id;
      tab.textContent = item.label;
      tab.addEventListener('click', () => {
        scenario = item;      // reset() cancels every in-flight timer first
        reset();
        syncTabs();
        bumpIdle();
      });
      tabs.append(tab);
    }
    syncTabs();
  }

  addEventListener('resize', fitCanvas);

  draw();
  bumpIdle();
}
