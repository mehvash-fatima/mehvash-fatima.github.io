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
import { initialState, applyBeat } from './engine.js';
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
// Kept in step with the `@media (max-width: 767px)` block in prototype.css —
// below this the canvas reflows instead of scaling.
const MOBILE_W = 768;

/**
 * Frame 2's loading copy, verbatim from
 * docs/superpowers/notes/figma-scenario-1.md. Shown for `then.thinking` ms
 * while the settled answer is held back.
 */
const LOADING = {
  heading: 'Generating response...',
  body: 'Copilot is searching across Priva solutions to generate a response and suggest questions to help you get started. ',
  // The design has TWO latency patterns, not one (ambiguity B6 in
  // docs/superpowers/notes/figma-scenario-2-1.md). The full-page card above
  // is what a page-level answer loads behind; inside the Copilot dialog the
  // chat pane gets a much smaller card reading just this.
  inlineBody: 'OK...',
  stop: 'Stop generating'
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

/**
 * B6: the design draws the wait two ways. A page-level answer loads behind
 * the full "Generating response..." card; a pause inside the Copilot dialog
 * gets a small card in the chat pane reading "OK...". Which one to draw is
 * not a new thing for a beat to declare — it follows from where the pause
 * happens, so it is read off the settled view and cannot be set wrong.
 */
function latencyCard({ inline = false } = {}) {
  const card = document.createElement('div');
  card.className = inline ? 'pp-latency pp-latency-inline' : 'pp-latency';
  card.setAttribute('role', 'status');

  if (inline) {
    const body = document.createElement('p');
    body.className = 'pp-latency-heading';
    body.textContent = LOADING.inlineBody;
    card.append(body);
  } else {
    const heading = document.createElement('p');
    heading.className = 'pp-latency-heading';
    heading.textContent = LOADING.heading;

    const body = document.createElement('p');
    body.className = 'pp-latency-text';
    body.textContent = LOADING.body;
    card.append(heading, body);
  }

  const track = document.createElement('div');
  track.className = 'pp-progress';
  const bar = document.createElement('div');
  bar.className = 'pp-progress-bar';
  track.append(bar);
  card.append(track);

  // Both frames put a "Stop generating" button under the card. No frame gives
  // it a destination, so it is inert — the same treatment every other
  // no-destination control in the prototype gets. Kept out of the tab order
  // rather than merely disabled: it exists for about a second, and a control
  // that flashes through the tab sequence is worse than one that never
  // enters it.
  const stop = document.createElement('button');
  stop.type = 'button';
  stop.className = 'pp-button pp-button-tiny is-inert';
  stop.textContent = LOADING.stop;
  stop.setAttribute('aria-disabled', 'true');
  stop.setAttribute('tabindex', '-1');
  card.append(stop);

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
  // Closed by hand, so later draws do not put the completion card back.
  let completeDismissed = false;

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
  /**
   * Above the breakpoint the canvas stays a 1920x1080 box scaled by a
   * transform, and the viewport is given the scaled height so the page below
   * it sits flush. Below the breakpoint that scaling is abandoned entirely:
   * a phone shrinking a desktop layout is unreadable, so the CSS reflows the
   * canvas at its natural size instead. Both inline properties are REMOVED
   * rather than overridden, because an inline style beats the stylesheet and
   * would pin a 1080px-tall box under a reflowed canvas.
   */
  const fitCanvas = () => {
    const canvas = root.querySelector('.pp-canvas');
    if (!canvas) return;
    if (window.innerWidth < MOBILE_W) {
      canvas.style.removeProperty('--pp-scale');
      root.style.removeProperty('height');
      return;
    }
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
    // The cue watches whatever is armed, including nothing: at the terminal
    // beat, and through a thinking pause, `beat` is null and the cue goes
    // away with it.
    cueTarget = beat ? root.querySelector(beat.spotlight) : null;
    scheduleCue();
    return cueTarget;
  };

  /* --- host chrome ------------------------------------------------- */
  /**
   * Set by `draw` for the length of one `announce` call: true when focus was
   * inside the canvas before the redraw. At the terminal beat there is no
   * armed button left to hand it back to, so the completion card takes it
   * instead — otherwise a keyboard visitor's focus lands on <body> and the
   * card they just earned is unreachable without tabbing from the top.
   */
  let handOffFocus = false;

  /**
   * The completion card, laid over the finished frame.
   *
   * Shown at the terminal beat and only until the visitor closes it:
   * `completeDismissed` has to survive the draws that happen afterwards
   * (a resize, an edit in a wizard field) or Close would not stick. The two
   * things that genuinely start a run over — Reset and picking another
   * scenario — both go through `reset`, which clears it.
   */
  const syncComplete = hasNext => {
    const card = el('pp-complete');
    if (!card) return;
    const show = !hasNext && !completeDismissed;
    const wasHidden = card.hidden;
    card.hidden = !show;
    if (!show) return;

    const copy = scenario.completion || {};
    const title = el('pp-complete-title');
    const summary = el('pp-complete-summary');
    if (title) title.textContent = copy.title || 'Scenario complete';
    if (summary) summary.textContent = copy.summary || '';

    // The onward move. Mid-list it is the next scenario; after the last one
    // there is nowhere further to go inside the prototype, so the link back
    // to the case study takes the primary slot. These are two elements that
    // take turns rather than one whose tag changes: a <button> that
    // navigates and an <a> that does not are both the wrong element, and
    // rewriting the tag at runtime is worse than rendering the right one.
    const upcoming = SCENARIOS[SCENARIOS.indexOf(scenario) + 1];
    const next = el('pp-complete-next');
    const exit = el('pp-complete-exit');
    if (next) {
      next.hidden = !upcoming;
      // The scenario's product, not its label: the labels run to forty
      // characters and wrap this button onto three lines.
      if (upcoming) next.textContent = `Next: ${upcoming.product}`;
    }
    if (exit) exit.hidden = Boolean(upcoming);

    if (!wasHidden) return;
    const onward = next && !next.hidden ? next : exit;
    if (handOffFocus && onward) onward.focus({ preventScroll: true });
    // The viewport is usually taller than the window, so the card can open
    // off screen — the same problem the scroll cue exists for, except here
    // the page can simply go there.
    const body = card.querySelector('.pp-complete-card');
    if (body) {
      body.scrollIntoView({
        block: 'center',
        behavior: reduceMotion() ? 'auto' : 'smooth'
      });
    }
  };

  const announce = () => {
    const total = scenario.beats.length;
    const beat = nextBeat();
    const step = el('pp-step');
    if (step) {
      step.textContent = `Step ${Math.min(state.beatIndex + 2, total)} of ${total}`;
    }
    syncComplete(Boolean(beat));
  };

  /* --- scroll cue --------------------------------------------------- */
  /**
   * The canvas is a good deal taller than most windows, so the armed hotspot
   * is regularly past the bottom of the screen and the visitor is left
   * looking at a frame with no "Click" tag anywhere on it. When that happens
   * a band shimmers along the edge the step lies past. It is measured, not
   * guessed: the armed node's own rect against the window.
   */
  // The site nav is fixed and 60px tall (prototype-copilot.html). The strip
  // behind it is not visible, so the cue does not count it as visible.
  const NAV_H = 60;
  // The spotlight ring and its "Click" tag stand proud of the button's own
  // box, so the box is inflated before it is measured — a hotspot whose ring
  // is cut off is still a hotspot you cannot see properly.
  const RING = 14;
  // Slack, so a hairline clip does not flash the cue on and off while the
  // page settles.
  const CUE_SLACK = 8;

  let cueTarget = null;
  let cueFrame = 0;

  const updateCue = () => {
    cueFrame = 0;
    const cue = el('pp-scroll-cue');
    if (!cue) return;

    const complete = el('pp-complete');
    const blocked = !cueTarget || !cueTarget.isConnected ||
      Boolean(complete && !complete.hidden);
    if (blocked) { cue.hidden = true; return; }

    const rect = cueTarget.getBoundingClientRect();
    if (!rect.width && !rect.height) { cue.hidden = true; return; }

    const above = rect.top - RING < NAV_H - CUE_SLACK;
    const below = rect.bottom + RING > window.innerHeight + CUE_SLACK;

    // Clipped at BOTH ends means the hotspot is taller than the window and
    // is plainly on screen already; there is nowhere useful to send anyone.
    let direction = null;
    if (above && below) direction = null;
    else if (below) direction = 'down';
    else if (above) direction = 'up';

    if (!direction) { cue.hidden = true; return; }

    cue.dataset.direction = direction;
    const label = el('pp-scroll-cue-label');
    if (label) {
      label.textContent = direction === 'down'
        ? 'Scroll down to the next step'
        : 'Scroll up to the next step';
    }
    cue.hidden = false;
  };

  // Scroll fires far faster than the cue can usefully change, and every run
  // reads layout. One measurement per frame is plenty.
  const scheduleCue = () => {
    if (cueFrame) return;
    cueFrame = requestAnimationFrame(updateCue);
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
    handOffFocus = hadFocus;
    announce();
    handOffFocus = false;
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
    const card = latencyCard({ inline: state.view === 'dialog' });
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
      // This turn is already on screen: `type` pushed the user's text and the
      // draw above rendered it, along with any reply the beat pushed with it.
      // Hold all of that back, play the typing into the composer, then clear
      // the composer and reveal — which is the order sending a message
      // actually happens in. Without it the settled frame shows the same
      // sentence twice, once in the transcript and once still in the input.
      //
      // Count what the beat added rather than taking the last child: a beat
      // that both types and pushes ends with the REPLY, so hiding one node
      // hides the wrong one and leaves the duplicate on screen. A beat typing
      // with `when: 'after'` sends from the composer, so both its user turn
      // and its reply belong to the pane.
      const added = 1 + (then.push && then.push.chat ? 1 : 0);
      const pane = root.querySelector('.pp-chat');
      const held = pane ? Array.from(pane.children).slice(-added) : [];
      for (const node of held) node.hidden = true;
      const reveal = () => { for (const node of held) node.hidden = false; };

      await typeInto(type.into, type.text);
      if (token !== runToken) { reveal(); return; }
      const composer = root.querySelector(type.into);
      if (composer) writeTyped(composer, '');
      reveal();
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

  const reset = () => {
    cancel();
    state = initialState(scenario);
    // Reset and switching scenario both route through here, and both are a
    // run starting over — so the completion card is owed again at the end.
    completeDismissed = false;
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

  /* --- scenario tabs ------------------------------------------------ */
  const tabs = document.querySelector('.pp-tabs');
  const syncTabs = () => {
    if (!tabs) return;
    for (const tab of tabs.querySelectorAll('[role="tab"]')) {
      tab.setAttribute('aria-selected', String(tab.dataset.scenarioId === scenario.id));
    }
  };

  /** The one way the running scenario changes — the tabs and the completion
   *  card's "Next" button both come through here. */
  const selectScenario = item => {
    scenario = item;          // reset() cancels every in-flight timer first
    reset();
    syncTabs();
    bumpIdle();
  };

  if (tabs) {
    tabs.replaceChildren();
    for (const item of SCENARIOS) {
      const tab = document.createElement('button');
      tab.type = 'button';
      tab.setAttribute('role', 'tab');
      tab.dataset.scenarioId = item.id;
      tab.textContent = item.label;
      tab.addEventListener('click', () => selectScenario(item));
      tabs.append(tab);
    }
    syncTabs();
  }

  const bind = (id, handler) => {
    const node = el(id);
    if (node) node.addEventListener('click', handler);
  };
  bind('pp-reset', () => { reset(); bumpIdle(); });

  bind('pp-complete-close', () => {
    completeDismissed = true;
    const card = el('pp-complete');
    if (card) card.hidden = true;
    // The card was covering the cue's decision; nothing is armed at the
    // terminal beat, so this settles it back to hidden either way.
    scheduleCue();
    bumpIdle();
  });

  bind('pp-complete-next', () => {
    const upcoming = SCENARIOS[SCENARIOS.indexOf(scenario) + 1];
    if (upcoming) selectScenario(upcoming);
  });

  addEventListener('resize', () => { fitCanvas(); scheduleCue(); });
  addEventListener('scroll', scheduleCue, { passive: true });

  draw();
  bumpIdle();
}
