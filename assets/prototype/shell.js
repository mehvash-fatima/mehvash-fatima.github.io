/**
 * Renders state into DOM. Knows nothing about scenarios, beats, or ordering.
 *
 * HOTSPOTS is the single source of truth for clickable ids — every renderer
 * below reads its id from this map (see the destructured constants under it),
 * so the registry can never drift from the DOM it describes.
 *
 * render(state) is pure: same state in, same DOM out. No event listeners, no
 * timers, no document queries, no reads of anything outside `state` and the
 * module-level CONTENT/copy constants. Interactivity belongs to mount.js.
 *
 * CONTENT is imported for one reason only: `state.actionCard` is a
 * presentational content key ('action-card-pending' / 'action-card-completed')
 * rather than content, so the card's copy has to be looked up here.
 */
import { CONTENT } from './scenarios.js';

/**
 * Click targets, by view. Every id here is rendered as a real
 * <button type="button"> — that invariant is assertable precisely because
 * typing targets live in their own map below.
 */
export const HOTSPOTS = {
  home:   ['#prompt-bar'],
  risks:  ['#srr-risk-card', '#tracker-risk-card'],
  answer: ['#generate-draft-button', '#view-tasks-button', '#review-scan-button', '#toc-topic', '#create-summary-button'],
  dialog: ['#wizard-next', '#wizard-save-close', '#chat-suggestion', '#email-card-open']
};

/**
 * Typing targets, by view: elements a beat's `then.type.into` writes into.
 * These are editable controls, not buttons. `#prompt-bar` appears in both
 * maps because beat 1 both arms it and types into it.
 */
export const TYPING_TARGETS = {
  home:   ['#prompt-bar'],
  dialog: ['#copilot-chat-input']
};

// The one place an id is turned into a string. Renderers read from these.
const [PROMPT_BAR] = HOTSPOTS.home;
const [SRR_RISK_CARD, TRACKER_RISK_CARD] = HOTSPOTS.risks;
const [GENERATE_DRAFT, VIEW_TASKS, REVIEW_SCAN, TOC_TOPIC, CREATE_SUMMARY] = HOTSPOTS.answer;
const [WIZARD_NEXT, WIZARD_SAVE_CLOSE, CHAT_SUGGESTION, EMAIL_CARD_OPEN] = HOTSPOTS.dialog;
const [CHAT_INPUT] = TYPING_TARGETS.dialog;

/**
 * Which hotspot a suggested-action card's primary button carries, keyed by
 * the card's own content key. A card whose key is absent renders that button
 * inert, because no beat arms it. The selector itself still lives only in
 * HOTSPOTS above.
 */
const ACTION_HOTSPOT = {
  'action-card-pending': GENERATE_DRAFT,
  'action-card-srr-tasks': VIEW_TASKS,
  'action-card-tracker-scan': REVIEW_SCAN,
  // Scenario 3's first card is deliberately absent: on frame 1:67760 the beat
  // arms the topic rail, not this button, so it renders inert. The second
  // card, on frame 1:67601, is the one that opens the dialog.
  'action-card-ropa-assessments': CREATE_SUMMARY
};

/**
 * Same idea for the risk dashboard: a risk row is clickable only when a
 * scenario drills into it. Scenario 3 adds its row's key here.
 */
const RISK_HOTSPOT = {
  srr: SRR_RISK_CARD,
  tracker: TRACKER_RISK_CARD
};

/* ------------------------------------------------------------------ *
 * Chrome copy. Verbatim from docs/superpowers/notes/figma-scenario-1.md
 * ("Global chrome" plus the per-frame sections). It lives here rather
 * than in scenarios.js because it never varies with scenario state.
 * ------------------------------------------------------------------ */
const COPY = {
  tabTitle: 'Microsoft Priva',
  urlScheme: 'https://',
  urlHost: 'purview.microsoft.com',
  urlPath: '/fabrikam/en-us/',
  suiteTitle: 'Microsoft Priva',
  previewPill: 'Preview',
  disclaimer:
    'AI-generated content may be incorrect. Use it for informational purposes only and do not treat it as legal advice.',
  shortDisclaimer: 'AI-generated content may be incorrect',
  // CORRECTION B1 (unified, both scenarios): the source design mixes
  // "Privacy Manager" (title case) and "Privacy manager" (lower-case m)
  // for the same product across BOTH scenarios' frames — see the B1 note in
  // docs/superpowers/notes/figma-scenario-1.md and
  // docs/superpowers/notes/figma-scenario-2-1.md for the exact frames each
  // casing appears on. The prototype renders the title-case form
  // everywhere, since that is what the primary data surfaces (this app's
  // dashboard and hero) use. `pageTitle` is now the single source for both
  // scenarios; there is no longer a separate SRR-only variant.
  pageTitle: 'Privacy Manager',
  homeBack: 'Priva Home',
  answerBack: 'Back',
  homeSubtitle: "Manage your organization's privacy posture with the help of AI.",
  homeLearnMore: 'Learn more',
  promptPlaceholder: 'Ask me anything about privacy...',
  suggestions: [
    { category: 'Summarize', text: 'Summarize the top 5 privacy compliance issues across all Priva solutions' },
    { category: 'Find', text: 'Show me the past due Privacy Assessments where there is highly sensitive data' },
    { category: 'Find', text: 'Show me the list of websites with uncategorized trackers in most to least order' },
    { category: 'Regulations', text: 'What are the cookie consent regulations for websites in the EU?' },
    { category: 'Learn more', text: 'Summarize the capabilities of Privacy Manager' }
  ],
  suggestedActions: 'Suggested actions',
  showProcess: 'Show process',
  feedbackPrompt: "How's this response?",
  thumbsUp: 'Helpful',
  thumbsDown: 'Not helpful',
  copilot: 'Copilot',
  openInConsent: 'Open in Consent Management',
  // CORRECTION B3: the design reuses scenario 1's "Open in Consent
  // Management" dialog-header button verbatim inside scenario 2.1's SRR
  // dialog (frames 1:67810-1:67859). Re-pointed at the scenario's own
  // product (see SCENARIOS[].product, 'Subject Rights Requests'), matching
  // the phrasing pattern kept from Reword note R2 in
  // docs/superpowers/notes/figma-scenario-2-1.md. Still rendered inert —
  // no destination path is specified by any frame, so none is invented.
  openInSRR: 'Open in Subject Rights Requests',
  // Scenario 2.2's frames (1:67487-1:67457) already name their own solution
  // here, so this one is verbatim — no correction needed. Still inert: no
  // frame specifies a destination (Reword note R2 in
  // docs/superpowers/notes/figma-scenario-2-2.md).
  openInTracker: 'Open in Tracker Scanning',
  // Scenario 3's frame (1:67629) also names its own solution, so this is
  // verbatim too. Inert for the same reason as the others: no frame gives
  // the button a destination, and none is invented.
  openInAssessments: 'Open in Privacy Assessments',
  closeDialog: 'Close',
  // CORRECTION B1 (unified): source design has this same placeholder as
  // "...Privacy manager." (lower-case) in the consent-scenario dialog
  // (Frame 1:67181) — corrected to match the title-case product name used
  // everywhere else in the prototype now.
  chatPlaceholder: "Ask a question or describe what you'd like to do in Privacy Manager.",
  attach: 'Attach a file',
  send: 'Send',
  copilotSuggestion: 'Copilot suggestion',
  wizardBack: 'Back',
  wizardNext: 'Next',
  wizardSaveClose: 'Save and close',
  wizardCancel: 'Cancel',
  customize: 'Customize',
  required: 'Required',

  /* --- Risk dashboard (scenario 2.1 Frame 1:67165, shared entry point for
         the compliance-issue scenarios). Verbatim from
         docs/superpowers/notes/figma-scenario-2-1.md, except for the page
         title itself, which is CORRECTION B1 (unified) — see the note on
         `COPY.pageTitle` above. This view uses `COPY.pageTitle` directly;
         there is no separate SRR-only title constant. --- */
  risksHeading: 'Top compliance risks',
  recentHeading: 'Recent',
  risksChips: [
    'Privacy notice compliance issues',
    'Privacy requests due soon',
    'Show me past due Privacy Assessments'
  ],
  heroRisk: {
    title: 'Priva Tracker Scanning',
    headline: '4 websites with uncategorized trackers',
    // Four flat wedges, drawn as a conic-gradient. Shares add to 20, so the
    // slice sizes are derived, never hard-coded as percentages.
    slices: [
      { label: 'California1.com', note: '(8 uncategorized)', share: 8 },
      { label: 'India1.com', note: '(6 uncategorized)', share: 6 },
      { label: 'Canada1.com', note: '(4 uncategorized)', share: 4 },
      { label: 'France1.com', note: '(2 uncategorized)', share: 2 }
    ]
  },
  // `key` is what RISK_HOTSPOT above is keyed by; a row whose key is absent
  // from that map renders inert.
  riskRows: [
    {
      key: 'srr',
      title: 'Priva Subject Rights Requests',
      // CORRECTION B7: the design's dashboard row read "6 expiring requests"
      // while the answer it drills into (breadcrumb, prompt row, and body
      // text) says 15 throughout — reconciled on 15, the figure the rest of
      // the scenario supports 4-to-1. The "15 days" deadline here already
      // agreed with the answer body; the answer's other two "2 weeks"
      // mentions were the ones reconciled to match this dashboard figure.
      // See docs/superpowers/notes/figma-scenario-2-1.md B7.
      lines: ['15 expiring requests with deadlines expiring within the next 15 days.']
    },
    {
      key: 'tracker',
      title: 'Priva Tracker Scanning',
      lines: ['1 privacy statement detected missing during a recent scan of contoso.com']
    },
    {
      key: 'risk',
      title: 'Priva Risk Management',
      lines: [
        '205 high risk data transfers with personal data detected by risk management policies in the 7 days, affecting 50 users',
        '1241 assets with personal data were detected in Risk Management policies in the past 7 days, affecting 100 users',
        '25 personal data types in Azure and AWS aren’t protected by a data protection policy'
      ]
    }
  ],
  recent: [
    { query: 'What are the California privacy consent laws for websites?', meta: '5 prompts, created consent model' },
    { query: 'Summarize top 5 privacy compliance issues across all Priva solutions.', meta: '3 prompts' },
    { query: 'Show me the past due Privacy Assessments where there is highly sensitive data.', meta: '2 prompts' },
    { query: 'Show me the list of websites with uncategorized trackers in most to least order.', meta: '4 prompts' },
    { query: 'Summarize the capabilities of Microsoft Priva.', meta: '1 prompt' }
  ],
  moreSuggestions: 'More suggested prompts',
  openEmail: 'Open the draft email',
  // Scenario 2.2's output card holds a Teams message rather than an email.
  // Both labels are the prototype's own accessible names for a glyph the
  // design draws bare — neither is design copy.
  openMessage: 'Open the draft message',
  // Accessible names for the scan panel's checkboxes, which the design draws
  // as bare glyphs. The prototype's own words, not design copy.
  objectSelected: 'Selected',
  objectNotSelected: 'Not selected'
};

/**
 * Which "Open in <solution>" label the dialog header carries, keyed by the
 * scenario. Every one is rendered inert — no frame in any scenario specifies
 * a destination — so this map is purely which product name to print.
 */
const DIALOG_OPEN_IN = {
  consent: COPY.openInConsent,
  srr: COPY.openInSRR,
  tracker: COPY.openInTracker,
  ropa: COPY.openInAssessments
};

/* ------------------------------------------------------------------ *
 * Tiny DOM helpers. Nothing here touches innerHTML.
 * ------------------------------------------------------------------ */
function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined && text !== null) node.textContent = text;
  return node;
}

const SVG_NS = 'http://www.w3.org/2000/svg';

// Decorative Fluent-style glyphs, drawn rather than exported. Every one is
// aria-hidden — the control it sits inside always carries a real text label
// or aria-label.
const GLYPHS = {
  send:        { d: 'M2.3 8 14 2.6 9.2 14.2 7.6 9.6z', fill: true },
  sparkle:     { d: 'M8 2l1.25 3.25L12.5 6.5 9.25 7.75 8 11 6.75 7.75 3.5 6.5 6.75 5.25z', fill: true },
  pencil:      { d: 'M11.2 2.6a1.4 1.4 0 0 1 2 2L6.4 11.4l-2.6.8.8-2.6z' },
  external:    { d: 'M9 3h4v4M12.6 3.4 7.4 8.6M11 9.5V13H3V5h3.5' },
  chevronDown: { d: 'M4.5 6.5 8 10l3.5-3.5' },
  chevronRight:{ d: 'M6.5 4.5 10 8l-3.5 3.5' },
  check:       { d: 'M3.2 8.4 6.3 11.5 12.8 5' },
  close:       { d: 'M4 4l8 8M12 4l-8 8' },
  arrowLeft:   { d: 'M7 3.5 2.5 8 7 12.5M2.5 8H13' },
  refresh:     { d: 'M13 8a5 5 0 1 1-1.6-3.7M13.2 2.4v3.2h-3.2' },
  list:        { d: 'M3 4.5h1M3 8h1M3 11.5h1M6 4.5h7M6 8h7M6 11.5h7' },
  thumbUp:     { d: 'M5.5 14V7.2l3-5a1.6 1.6 0 0 1 1.7 2L9.4 6.4h3.1a1.2 1.2 0 0 1 1.2 1.5l-1 4.8A1.5 1.5 0 0 1 11.2 14zM2.5 7h3v7h-3z', fill: true },
  thumbDown:   { d: 'M10.5 2v6.8l-3 5a1.6 1.6 0 0 1-1.7-2l.8-2.2H3.5a1.2 1.2 0 0 1-1.2-1.5l1-4.8A1.5 1.5 0 0 1 4.8 2zM10.5 2h3v7h-3z', fill: true },
  lock:        { d: 'M4.5 7V5.2a3.5 3.5 0 0 1 7 0V7M3.5 7h9v6h-9z' },
  shield:      { d: 'M8 1.8 13 3.6v4.1c0 3.2-2.1 5.4-5 6.5-2.9-1.1-5-3.3-5-6.5V3.6z' },
  grid:        { d: 'M3 3h2v2H3zM7 3h2v2H7zM11 3h2v2h-2zM3 7h2v2H3zM7 7h2v2H7zM11 7h2v2h-2zM3 11h2v2H3zM7 11h2v2H7zM11 11h2v2h-2z', fill: true },
  bell:        { d: 'M4.5 11V7a3.5 3.5 0 0 1 7 0v4M3 11h10M6.6 13.2a1.6 1.6 0 0 0 2.8 0' },
  gear:        { fill: true, rule: 'evenodd', d: 'M9.02 1.5a.6.6 0 0 1 .58.45l.28 1.13c.33.12.63.3.91.5l1.12-.34a.6.6 0 0 1 .69.28l1.02 1.76a.6.6 0 0 1-.11.73l-.85.8c.03.18.04.36.04.55s-.01.37-.04.55l.85.8a.6.6 0 0 1 .11.73l-1.02 1.76a.6.6 0 0 1-.69.28l-1.12-.34c-.28.2-.58.38-.91.5l-.28 1.13a.6.6 0 0 1-.58.45H6.98a.6.6 0 0 1-.58-.45l-.28-1.13a4.3 4.3 0 0 1-.91-.5l-1.12.34a.6.6 0 0 1-.69-.28L2.38 9.44a.6.6 0 0 1 .11-.73l.85-.8A4.4 4.4 0 0 1 3.3 8c0-.19.01-.37.04-.55l-.85-.8a.6.6 0 0 1-.11-.73L3.4 4.16a.6.6 0 0 1 .69-.28l1.12.34c.28-.2.58-.38.91-.5l.28-1.13a.6.6 0 0 1 .58-.45zM8 6.1a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8z' },
  link:        { d: 'M6.6 9.4 9.4 6.6M6.9 4.4 8.5 2.8a2.6 2.6 0 0 1 3.7 3.7l-1.6 1.6M9.1 11.6l-1.6 1.6a2.6 2.6 0 0 1-3.7-3.7l1.6-1.6' },
  help:        { d: 'M8 1.6a6.4 6.4 0 1 0 0 12.8A6.4 6.4 0 0 0 8 1.6M6.4 6.3a1.6 1.6 0 1 1 2.2 1.5c-.4.2-.6.5-.6.9v.4M8 11.6v.1' },
  megaphone:   { d: 'M3 6.5h2.5L11 3.5v9L5.5 9.5H3zM13 6v4' },
  person:      { d: 'M8 8.4a2.7 2.7 0 1 0 0-5.4 2.7 2.7 0 0 0 0 5.4M3.2 13.4a4.8 4.8 0 0 1 9.6 0' },
  attach:      { d: 'M12.5 7.5 7.8 12.2a2.9 2.9 0 0 1-4.1-4.1L8.6 3.2a1.9 1.9 0 0 1 2.7 2.7L6.5 10.7a.9.9 0 0 1-1.3-1.3l4.3-4.3' },
  more:        { d: 'M4 8h.01M8 8h.01M12 8h.01' },
  play:        { d: 'M6 4.2 11.5 8 6 11.8z', fill: true },
  doc:         { d: 'M4 2.5h5L12 5.5V13.5H4zM9 2.5v3h3' },
  dash:        { d: 'M4.5 8h7' },
  add:         { d: 'M8 3.5v9M3.5 8h9' },
  search:      { d: 'M7.2 2.6a4.6 4.6 0 1 0 0 9.2 4.6 4.6 0 0 0 0-9.2M10.6 10.6 13.6 13.6' },
  sortDown:    { d: 'M8 3.2v9.2M4.6 9.2 8 12.6l3.4-3.4' },
  mail:        { d: 'M2.5 4.2h11v7.6h-11zM2.5 4.6 8 8.6l5.5-4' },
  info:        { d: 'M8 1.8a6.2 6.2 0 1 0 0 12.4A6.2 6.2 0 0 0 8 1.8M8 7.2v4M8 4.9v.1', fill: false }
};

function glyph(name, size = 16) {
  const spec = GLYPHS[name];
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 16 16');
  svg.setAttribute('width', String(size));
  svg.setAttribute('height', String(size));
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  svg.setAttribute('class', 'pp-glyph');
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', spec ? spec.d : '');
  if (spec && spec.fill) {
    path.setAttribute('fill', 'currentColor');
    if (spec.rule) path.setAttribute('fill-rule', spec.rule);
  } else {
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', 'currentColor');
    path.setAttribute('stroke-width', '1.3');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
  }
  svg.append(path);
  return svg;
}

/** A hotspot. Always a real <button type="button"> with a visible label. */
function hotspotButton(selector, label, className) {
  const button = document.createElement('button');
  button.type = 'button';
  button.id = selector.replace('#', '');
  button.className = className;
  if (label) button.append(el('span', 'pp-btn-label', label));
  return button;
}

/** A button the flow never arms. Inert by omission — no handler ever binds. */
function inertButton(label, className, options = {}) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `${className} is-inert`;
  if (options.iconBefore) button.append(glyph(options.iconBefore, options.iconSize || 16));
  if (label) button.append(el('span', 'pp-btn-label', label));
  if (options.iconAfter) button.append(glyph(options.iconAfter, options.iconSize || 16));
  if (options.ariaLabel) button.setAttribute('aria-label', options.ariaLabel);
  button.setAttribute('tabindex', '-1');
  button.setAttribute('aria-disabled', 'true');
  return button;
}

function iconButton(name, ariaLabel, className = 'pp-icon-button', size = 16) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `${className} is-inert`;
  button.setAttribute('aria-label', ariaLabel);
  button.setAttribute('tabindex', '-1');
  button.setAttribute('aria-disabled', 'true');
  button.append(glyph(name, size));
  return button;
}

/**
 * Appends `line` to `node`, wrapping any occurrence of an `emphasis` phrase in
 * a <strong>. The phrases are matched against the copy, never embedded in it,
 * so the characters rendered are exactly the characters stored — nothing is
 * added, removed, or re-punctuated.
 */
function appendEmphasised(node, line, phrases) {
  if (!phrases || !phrases.length) {
    node.append(document.createTextNode(line));
    return node;
  }
  let rest = line;
  while (rest) {
    let at = -1;
    let hit = '';
    for (const phrase of phrases) {
      if (!phrase) continue;
      const index = rest.indexOf(phrase);
      if (index !== -1 && (at === -1 || index < at || (index === at && phrase.length > hit.length))) {
        at = index;
        hit = phrase;
      }
    }
    if (at === -1) {
      node.append(document.createTextNode(rest));
      return node;
    }
    if (at > 0) node.append(document.createTextNode(rest.slice(0, at)));
    node.append(el('strong', 'pp-strong', hit));
    rest = rest.slice(at + hit.length);
  }
  return node;
}

/** Splits "\n"-separated content text into paragraphs and bullet lists. */
function renderRichText(container, text, emphasis) {
  const lines = String(text || '').split('\n');
  let list = null;
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) { list = null; continue; }
    if (line.startsWith('- ')) {
      if (!list) { list = el('ul', 'pp-bullets'); container.append(list); }
      list.append(appendEmphasised(el('li'), line.slice(2), emphasis));
      continue;
    }
    list = null;
    container.append(appendEmphasised(el('p', 'pp-paragraph'), line, emphasis));
  }
  return container;
}

/** "Contacts: Kadji Bell (You)" -> bold label, plain value. */
function renderLabelledBullet(item) {
  const li = document.createElement('li');
  const split = String(item).indexOf(': ');
  if (split === -1) {
    li.textContent = item;
    return li;
  }
  li.append(el('strong', null, String(item).slice(0, split + 1)));
  li.append(document.createTextNode(` ${String(item).slice(split + 2)}`));
  return li;
}

function disclaimerLine(text = COPY.disclaimer, className = 'pp-disclaimer') {
  return el('p', className, text);
}

/* ------------------------------------------------------------------ *
 * Chat partitioning
 *
 * The answer page and the dialog's chat pane read from the same `chat`
 * array. An assistant turn carrying page furniture (a `toc` or a
 * `sectionHeading`) is the page's answer; everything else is a chat-pane
 * message, except the OPENING turn when it is the user's — that one is the
 * query the page's breadcrumb shows.
 *
 * "Opening turn", not "first user turn": scenario 2.1 drills into a risk
 * card rather than typing, so its chat starts with the assistant and its
 * breadcrumb comes off that message instead (see renderAnswerPage). Keying
 * on index 0 keeps the user turn that opens the dialog — the second message
 * in that scenario — out of the page column, where nothing would render it.
 * ------------------------------------------------------------------ */
function splitChat(chat) {
  const page = [];
  const pane = [];
  (chat || []).forEach((message, index) => {
    if (message.role === 'user') {
      if (index === 0) page.push(message);
      else pane.push(message);
    } else if (message.toc || message.sectionHeading) {
      page.push(message);
    } else {
      pane.push(message);
    }
  });
  return { page, pane };
}

/* ------------------------------------------------------------------ *
 * Browser + suite chrome (identical on all frames)
 * ------------------------------------------------------------------ */
function renderBrowserChrome() {
  const chrome = el('div', 'pp-browser');

  const tabs = el('div', 'pp-browser-tabs');
  tabs.append(el('span', 'pp-browser-collections'));
  const tab = el('div', 'pp-browser-tab');
  tab.append(el('span', 'pp-favicon'));
  tab.append(el('span', 'pp-browser-tab-title', COPY.tabTitle));
  tabs.append(tab);
  tabs.append(el('span', 'pp-browser-newtab', '+'));
  tabs.append(el('span', 'pp-window-controls'));
  chrome.append(tabs);

  const bar = el('div', 'pp-browser-bar');
  const nav = el('div', 'pp-browser-nav');
  nav.append(glyph('arrowLeft'));
  nav.append(glyph('refresh'));
  bar.append(nav);

  const address = el('div', 'pp-address');
  address.append(glyph('lock', 14));
  const url = el('span', 'pp-address-url');
  url.append(el('span', 'pp-address-dim', COPY.urlScheme));
  url.append(el('span', 'pp-address-host', COPY.urlHost));
  url.append(el('span', 'pp-address-dim', COPY.urlPath));
  address.append(url);
  bar.append(address);
  bar.append(el('div', 'pp-browser-actions'));
  chrome.append(bar);

  return chrome;
}

function renderSuiteHeader() {
  const header = el('header', 'pp-suite');
  const left = el('div', 'pp-suite-left');
  left.append(iconButton('grid', 'All apps', 'pp-suite-icon', 18));
  left.append(el('span', 'pp-suite-title', COPY.suiteTitle));
  left.append(el('span', 'pp-pill pp-pill-preview', COPY.previewPill));
  header.append(left);

  const right = el('div', 'pp-suite-right');
  for (const [name, label] of [
    ['megaphone', 'Announcements'],
    ['bell', 'Notifications'],
    ['gear', 'Settings'],
    ['help', 'Help'],
    ['link', 'Give feedback']
  ]) {
    right.append(iconButton(name, label, 'pp-suite-icon', 18));
  }
  right.append(el('span', 'pp-avatar'));
  header.append(right);
  return header;
}

/**
 * The Priva solution mark: a filled brand-blue rounded square with a white
 * glyph, as the Figma draws it. CSS + glyph, no exported image.
 */
function solutionBadge(size = 18) {
  const badge = el('span', 'pp-solution-badge');
  badge.append(glyph('shield', size));
  return badge;
}

function copilotMark(size = 'md') {
  const img = document.createElement('img');
  img.className = `pp-copilot-mark pp-copilot-mark-${size}`;
  img.src = 'assets/5135989b34f7.svg';
  img.alt = '';
  img.setAttribute('aria-hidden', 'true');
  return img;
}

/* ------------------------------------------------------------------ *
 * View: home (Frame 1)
 * ------------------------------------------------------------------ */
function renderHome(state) {
  const page = el('div', 'pp-page pp-page-home');

  const back = el('div', 'pp-backrow');
  back.append(inertButton(COPY.homeBack, 'pp-link-button', { iconBefore: 'arrowLeft' }));
  page.append(back);

  const hero = el('div', 'pp-hero');
  hero.append(el('h1', 'pp-hero-title', COPY.pageTitle));

  const sub = el('p', 'pp-hero-sub');
  sub.append(document.createTextNode(`${COPY.homeSubtitle} `));
  const learn = inertButton(COPY.homeLearnMore, 'pp-link-inline', { iconAfter: 'external', iconSize: 12 });
  sub.append(learn);
  hero.append(sub);

  // #prompt-bar is both the armed hotspot and the beat's typing target, so it
  // is a real button that also shows the prompt text as it is typed.
  const promptBar = hotspotButton(PROMPT_BAR, '', 'pp-prompt-bar');
  promptBar.append(copilotMark('sm'));
  const promptText = el(
    'span',
    state.prompt ? 'pp-prompt-text' : 'pp-prompt-text is-placeholder',
    state.prompt || COPY.promptPlaceholder
  );
  promptBar.append(promptText);
  promptBar.append(glyph('send', 18));
  promptBar.setAttribute('aria-label', COPY.promptPlaceholder);
  hero.append(promptBar);

  const bento = el('div', 'pp-bento');
  // Ruling 3: no chip matches the query the flow submits, so the chips are
  // presentational only — rendered as static cards, never as buttons.
  for (const suggestion of COPY.suggestions) {
    const card = el('article', 'pp-suggestion');
    card.append(el('p', 'pp-suggestion-category', suggestion.category));
    card.append(el('p', 'pp-suggestion-text', suggestion.text));
    bento.append(card);
  }
  hero.append(bento);
  hero.append(disclaimerLine());
  page.append(hero);
  return page;
}

/* ------------------------------------------------------------------ *
 * View: risks (Frame 1:67165) — the Privacy Manager risk dashboard.
 *
 * A different landing surface from `home`: the same hero, then a
 * "Top compliance risks" board and a "Recent" prompt rail. Scenario 2.1
 * enters here by drilling into a risk row rather than typing a query, so
 * the search box is presentational — no beat types into it and no id is
 * put on it.
 * ------------------------------------------------------------------ */
function renderPie(hero) {
  const wrap = el('div', 'pp-pie-wrap');
  const slices = hero.slices || [];
  const total = slices.reduce((sum, slice) => sum + slice.share, 0) || 1;

  let at = 0;
  const stops = slices.map((slice, index) => {
    const from = (at / total) * 100;
    at += slice.share;
    const to = (at / total) * 100;
    return `var(--pp-chart-${index + 1}) ${from}% ${to}%`;
  });
  const pie = el('div', 'pp-pie');
  pie.style.background = `conic-gradient(${stops.join(', ')})`;
  pie.setAttribute('role', 'img');
  pie.setAttribute(
    'aria-label',
    slices.map(slice => `${slice.label} ${slice.note}`).join(', ')
  );
  wrap.append(pie);

  slices.forEach((slice, index) => {
    const label = el('div', `pp-pie-label pp-pie-label-${index + 1}`);
    label.setAttribute('aria-hidden', 'true');
    label.append(el('span', 'pp-pie-label-name', slice.label));
    label.append(el('span', 'pp-pie-label-note', slice.note));
    wrap.append(label);
  });
  return wrap;
}

function renderRiskRow(row) {
  const spotlight = RISK_HOTSPOT[row.key];
  // A row a scenario drills into is a real button; the rest are static.
  const node = spotlight
    ? hotspotButton(spotlight, '', 'pp-risk-row')
    : el('div', 'pp-risk-row is-inert');

  const title = el('div', 'pp-risk-row-title');
  title.append(solutionBadge(14));
  title.append(el('span', null, row.title));
  node.append(title);
  for (const line of row.lines) node.append(el('p', 'pp-risk-row-text', line));
  return node;
}

function renderRisks() {
  const page = el('div', 'pp-page pp-page-risks');

  const back = el('div', 'pp-backrow');
  back.append(inertButton(COPY.homeBack, 'pp-link-button', { iconBefore: 'arrowLeft' }));
  page.append(back);

  const hero = el('div', 'pp-hero pp-hero-compact');
  hero.append(el('h1', 'pp-hero-title', COPY.pageTitle));
  const sub = el('p', 'pp-hero-sub');
  sub.append(document.createTextNode(`${COPY.homeSubtitle} `));
  sub.append(inertButton(COPY.homeLearnMore, 'pp-link-inline', { iconAfter: 'external', iconSize: 12 }));
  hero.append(sub);

  const bar = el('div', 'pp-prompt-bar is-inert');
  bar.append(copilotMark('sm'));
  bar.append(el('span', 'pp-prompt-text is-placeholder', COPY.promptPlaceholder));
  bar.append(glyph('send', 18));
  hero.append(bar);

  const chips = el('div', 'pp-chip-row pp-chip-row-centred');
  for (const chip of COPY.risksChips) chips.append(el('span', 'pp-chip is-inert', chip));
  hero.append(chips);
  page.append(hero);

  const board = el('div', 'pp-risk-board');

  const main = el('section', 'pp-risk-main');
  main.append(el('h2', 'pp-section-heading', COPY.risksHeading));
  const cards = el('div', 'pp-risk-cards');

  const heroCard = el('article', 'pp-card pp-risk-hero');
  const heroTitle = el('div', 'pp-risk-row-title');
  heroTitle.append(solutionBadge(14));
  heroTitle.append(el('span', null, COPY.heroRisk.title));
  heroCard.append(heroTitle);
  heroCard.append(el('p', 'pp-risk-hero-headline', COPY.heroRisk.headline));
  heroCard.append(renderPie(COPY.heroRisk));
  cards.append(heroCard);

  const list = el('article', 'pp-card pp-risk-list');
  for (const row of COPY.riskRows) list.append(renderRiskRow(row));
  cards.append(list);

  main.append(cards);
  board.append(main);

  const recent = el('aside', 'pp-recent');
  recent.append(el('h2', 'pp-section-heading', COPY.recentHeading));
  const rows = el('ul', 'pp-recent-list');
  for (const item of COPY.recent) {
    const li = document.createElement('li');
    const entry = el('div', 'pp-recent-row');
    entry.append(glyph('list', 18));
    const text = el('div', 'pp-recent-text');
    text.append(el('p', 'pp-recent-query', item.query));
    text.append(el('p', 'pp-recent-meta', item.meta));
    entry.append(text);
    li.append(entry);
    rows.append(li);
  }
  recent.append(rows);
  board.append(recent);

  page.append(board);
  return page;
}

/* ------------------------------------------------------------------ *
 * View: answer (Frames 3 and 9) — also the backdrop under the dialog
 * ------------------------------------------------------------------ */
function renderAnswerHeader(query, pageTitle) {
  const header = el('header', 'pp-page-header');
  const row = el('div', 'pp-backrow');
  row.append(inertButton(COPY.answerBack, 'pp-link-button', { iconBefore: 'arrowLeft' }));
  header.append(row);

  const main = el('div', 'pp-page-header-main');
  main.append(el('h1', 'pp-page-title', pageTitle));

  const breadcrumb = el('div', 'pp-breadcrumb');
  breadcrumb.append(el('span', 'pp-breadcrumb-text', query || ''));
  breadcrumb.append(iconButton('pencil', 'Edit query'));
  main.append(breadcrumb);

  const trailing = el('div', 'pp-page-header-trailing');
  trailing.append(copilotMark('md'));
  main.append(trailing);
  header.append(main);
  return header;
}

function renderToc(toc) {
  // A topic that has been GENERATED carries the refresh glyph; one that has
  // not carries play. Selection is a separate thing — frame 1:67601 shows two
  // topics with refresh and only one of them selected. Scenarios that only
  // ever generate the topic they select (1 and 2.1) need say nothing: the
  // selected item is the generated one.
  const generated = toc.generated || (toc.selected ? [toc.selected] : []);
  const nav = el('nav', 'pp-toc');
  nav.setAttribute('aria-label', toc.heading);
  nav.append(el('h2', 'pp-toc-heading', toc.heading));
  const list = el('ul', 'pp-toc-list');
  for (const item of toc.items) {
    const li = document.createElement('li');
    const isAdd = item.trim().startsWith('+');
    const isSelected = item === toc.selected;
    // Scenario 3 is the only flow that advances by picking a topic, so a rail
    // item becomes a real button only when the data names it. Which item that
    // is comes from the data; the selector comes from HOTSPOTS, never from
    // the item's text.
    const isHotspot = Boolean(toc.hotspot) && item === toc.hotspot;
    const classes = `pp-toc-item${isSelected ? ' is-selected' : ''}${isAdd ? ' is-add' : ''}`;
    const entry = isHotspot
      ? hotspotButton(TOC_TOPIC, null, classes)
      : el('div', classes);
    entry.append(el('span', 'pp-toc-label', item));
    if (!isAdd) entry.append(glyph(generated.includes(item) ? 'refresh' : 'play', 14));
    li.append(entry);
    list.append(li);
  }
  nav.append(list);
  return nav;
}

/* ------------------------------------------------------------------ *
 * Data tables
 *
 * One renderer serves both tables in scenario 2.1: the six-row request
 * summary on the answer page (Frame 1:67788) and the thirteen-row task list
 * inside the dialog (Frames 1:67810-1:67859). A row is an array of cells; a
 * cell is a plain object, so the data says what a cell IS rather than how it
 * looks:
 *   { text }                    plain
 *   { text, link: true }        a link the design draws but no frame leads
 *                               anywhere from — rendered inert (Reword R1)
 *   { text, status, icon }      a status pill; `status` names the colour
 *                               token bucket, `icon` an optional glyph
 *   { text, avatar }            a person; `avatar` is the initials monogram
 * ------------------------------------------------------------------ */
function renderCell(cell) {
  const content = el('div', 'pp-cell');
  if (cell.status) {
    const badge = el('span', 'pp-status-dot');
    badge.dataset.status = cell.status;
    if (cell.icon) badge.append(glyph(cell.icon, 11));
    content.append(badge);
  }
  if (cell.avatar !== undefined) {
    const mono = el('span', 'pp-mono', cell.avatar || '');
    mono.setAttribute('aria-hidden', 'true');
    content.append(mono);
  }
  if (cell.link) {
    // No destination exists for these in any frame of the scenario.
    content.append(el('span', 'pp-link-inline is-inert', cell.text));
  } else {
    content.append(el('span', 'pp-cell-text', cell.text));
  }
  return content;
}

function renderDataTable(table) {
  const wrapper = el('div', 'pp-table-wrap');
  const node = el('table', 'pp-table');
  const sortable = new Set(table.sortColumns || []);

  const thead = el('thead');
  const headRow = el('tr');
  (table.columns || []).forEach((column, index) => {
    const th = el('th', null);
    th.scope = 'col';
    const inner = el('div', 'pp-cell');
    inner.append(el('span', 'pp-cell-text', column));
    if (sortable.has(index)) inner.append(glyph('sortDown', 13));
    th.append(inner);
    headRow.append(th);
  });
  thead.append(headRow);
  node.append(thead);

  const tbody = el('tbody');
  for (const row of table.rows || []) {
    const tr = el('tr');
    for (const cell of row) {
      const td = el('td');
      td.append(renderCell(cell));
      tr.append(td);
    }
    tbody.append(tr);
  }
  node.append(tbody);
  wrapper.append(node);
  return wrapper;
}

function renderAnswerMessage(message) {
  const article = el('article', 'pp-answer');
  if (message.sectionHeading) article.append(el('h2', 'pp-answer-heading', message.sectionHeading));

  if (message.promptRow) {
    const row = el('div', 'pp-prompt-row');
    row.append(glyph('sparkle', 16));
    row.append(el('span', 'pp-prompt-row-text', message.promptRow));
    row.append(iconButton('pencil', 'Edit this prompt'));
    row.append(iconButton('refresh', 'Regenerate this response'));
    article.append(row);
  }

  if (message.citations && message.citations.length) {
    const sources = el('div', 'pp-sources');
    sources.append(el('p', 'pp-sources-label', message.sourcesLabel || 'Sources'));
    const pills = el('ul', 'pp-citations');
    // A citation is either a bare label (numbered by position, which is what
    // scenarios 1 and 2.1 show) or an object carrying its own number. Scenario
    // 3's answer cites sources 1 and 3 — the design skips 2 — so the position
    // is not the number, and inferring it would silently renumber dw.com.
    message.citations.forEach((citation, index) => {
      const label = typeof citation === 'string' ? citation : citation.label;
      const number = typeof citation === 'string' ? index + 1 : citation.index;
      const li = document.createElement('li');
      const pill = el('span', 'pp-citation');
      pill.append(el('span', 'pp-citation-index', String(number)));
      pill.append(el('span', 'pp-citation-label', String(label).trim()));
      pill.append(glyph('external', 13));
      li.append(pill);
      pills.append(li);
    });
    sources.append(pills);
    article.append(sources);
  }

  const body = el('div', 'pp-answer-body');
  renderRichText(body, message.text, message.emphasis);
  article.append(body);

  if (message.table) article.append(renderDataTable(message.table));
  return article;
}

function renderActionCard(cardKey) {
  const content = CONTENT[cardKey];
  const column = el('aside', 'pp-actions');
  column.setAttribute('aria-label', COPY.suggestedActions);
  if (!content) return column;

  const label = el('div', 'pp-actions-label');
  label.append(glyph('list', 16));
  label.append(el('span', null, COPY.suggestedActions));
  column.append(label);

  const card = el('div', 'pp-action-card');
  const header = el('div', 'pp-action-card-header');
  header.append(solutionBadge(14));
  header.append(el('span', 'pp-action-card-title', content.header));
  card.append(header);
  card.append(el('p', 'pp-action-card-body', content.body));

  if (content.status) {
    const status = el('span', 'pp-status-pill');
    status.append(glyph('check', 13));
    status.append(el('span', null, content.status));
    card.append(status);
  }

  const row = el('div', 'pp-action-card-buttons');
  if (content.buttons && content.buttons.length) {
    // The first button is the armed hotspot ("Generate draft" on scenario 1's
    // card, "View tasks" on scenario 2.1's); the rest are inert, because no
    // beat targets them. Which id this card carries is read from
    // ACTION_HOTSPOT, so the selector string still lives only in HOTSPOTS.
    const spotlight = ACTION_HOTSPOT[cardKey];
    if (spotlight) {
      row.append(hotspotButton(spotlight, content.buttons[0], 'pp-button pp-button-secondary'));
    } else {
      row.append(inertButton(content.buttons[0], 'pp-button pp-button-secondary'));
    }
    for (const label of content.buttons.slice(1)) {
      row.append(inertButton(label, 'pp-button pp-button-secondary'));
    }
  }
  // Ruling 5 / A7: Frame 9's "Open" leads nowhere in this scenario — inert.
  if (content.button) row.append(inertButton(content.button, 'pp-button pp-button-secondary'));
  if (row.childNodes.length) card.append(row);

  column.append(card);
  column.append(disclaimerLine(COPY.disclaimer, 'pp-disclaimer pp-disclaimer-tight'));
  return column;
}

function renderAnswerFooter() {
  const footer = el('footer', 'pp-answer-footer');
  footer.append(inertButton(COPY.showProcess, 'pp-link-button', { iconAfter: 'chevronDown', iconSize: 14 }));
  const feedback = el('div', 'pp-feedback');
  feedback.append(el('span', 'pp-feedback-label', COPY.feedbackPrompt));
  feedback.append(iconButton('thumbUp', COPY.thumbsUp));
  feedback.append(iconButton('thumbDown', COPY.thumbsDown));
  footer.append(feedback);
  return footer;
}

/**
 * `live` decides which element is THE polite live region. Only one `.pp-chat`
 * may exist per render: under the dialog this page is a backdrop, and the
 * dialog's chat pane takes over as the announced region.
 */
function renderAnswerPage(state, { live }) {
  const { page } = splitChat(state.chat);
  const answers = page.filter(message => message.role === 'assistant');
  // Two ways a breadcrumb is authored: scenario 1 types a query, so the
  // breadcrumb IS the user's turn; scenario 2.1 drills into a risk card, so
  // the answer carries its own `breadcrumb` string. The explicit one wins.
  const query =
    (answers.find(message => message.breadcrumb) || {}).breadcrumb ||
    (page.find(message => message.role === 'user') || {}).text ||
    '';
  // The rail reflects the CURRENT answer, so its selection follows the newest
  // page answer rather than the first one.
  const current = answers.length ? answers[answers.length - 1] : null;
  const toc = current && current.toc ? current.toc : (answers.find(message => message.toc) || {}).toc;

  // CORRECTION B1 (unified): both scenarios render the same title-case
  // product name now — see the note on `COPY.pageTitle` above.
  const root = el('div', `pp-page pp-page-answer${live ? '' : ' is-backdrop'}`);
  root.append(renderAnswerHeader(query, COPY.pageTitle));

  const columns = el('div', 'pp-columns');
  if (toc) columns.append(renderToc(toc));

  const main = el('main', live ? 'pp-chat' : 'pp-answer-region');
  if (live) {
    main.setAttribute('aria-live', 'polite');
    main.setAttribute('aria-atomic', 'false');
  }
  // Only the newest page answer renders. Scenarios 1, 2.1 and 2.2 push exactly
  // one, so this is identical for them; scenario 3 pushes a second when a
  // topic is picked, and the design REPLACES the body rather than stacking
  // two. Chat-pane history is unaffected — splitChat keeps that separate.
  if (current) main.append(renderAnswerMessage(current));
  columns.append(main);

  columns.append(renderActionCard(state.actionCard));
  root.append(columns);
  root.append(renderAnswerFooter());
  return root;
}

/* ------------------------------------------------------------------ *
 * Wizard
 * ------------------------------------------------------------------ */

const MULTILINE_FIELDS = new Set(['description', 'preferences-description', 'preview-banner-text']);

function fieldLabel(field, controlId) {
  const label = document.createElement('label');
  label.className = 'pp-field-label';
  label.htmlFor = controlId;
  label.append(el('span', 'pp-field-label-text', field.label));
  if (field.suggested) {
    // The case study's central claim: the suggestion is attributed, in words.
    label.append(el('span', 'pp-field-attribution', `(${COPY.copilotSuggestion})`));
  }
  if (field.required) {
    const star = el('span', 'pp-required', '*');
    star.setAttribute('title', COPY.required);
    label.append(star);
  }
  return label;
}

function textControl(field) {
  const control = document.createElement(MULTILINE_FIELDS.has(field.id) ? 'textarea' : 'input');
  if (control.tagName === 'INPUT') control.type = 'text';
  control.className = 'pp-input';
  control.id = `pp-field-${field.id}`;
  control.value = field.value || '';
  control.dataset.fieldId = field.id;
  if (field.placeholder) control.placeholder = field.placeholder;
  if (MULTILINE_FIELDS.has(field.id)) control.rows = field.id === 'preview-banner-text' ? 5 : 2;
  return control;
}

function renderTextField(field) {
  const wrapper = el('div', 'pp-field');
  wrapper.dataset.source = field.source || 'user';
  if (field.suggested) wrapper.dataset.suggested = 'true';
  const control = textControl(field);
  wrapper.append(fieldLabel(field, control.id));

  const row = el('div', 'pp-field-row');
  const box = el('div', 'pp-field-box');
  box.append(control);
  if (field.suggested) box.append(glyph('pencil', 15));
  row.append(box);

  if (field.unit) {
    // A real control, not a styled div — the design shows a dropdown here.
    const unitBox = el('div', 'pp-field-box pp-field-unit');
    const select = document.createElement('select');
    select.className = 'pp-input';
    select.setAttribute('aria-label', `${field.label} unit`);
    const option = document.createElement('option');
    option.value = field.unit;
    option.textContent = field.unit;
    option.selected = true;
    select.append(option);
    unitBox.append(select);
    if (field.suggested) unitBox.append(glyph('pencil', 15));
    row.append(unitBox);
  }
  wrapper.append(row);
  if (field.note) wrapper.append(el('p', 'pp-field-note', field.note));
  return wrapper;
}

/**
 * The layout step is ONE field whose `value` is the chosen option's id, not
 * three fields each holding a description. That shape is what makes the
 * choice stick: mount.js's input handler writes `control.value` onto the
 * field whose id matches `data-field-id`, so a radio carrying the group's
 * field id and the option's id as its value lands the pick in state, and the
 * next draw re-checks it. (Before this, the radios carried no
 * `data-field-id` at all, the handler ignored them, and a clicked thumbnail
 * silently snapped back on the next draw.)
 *
 * `recommended` — not `value` — decides which card wears the Copilot badge,
 * so overriding the suggestion moves the tick without rewriting history.
 */
function renderLayoutOption(field, option) {
  const card = el('article', 'pp-layout-card');
  card.dataset.source = field.source || 'user';
  const isRecommended = field.suggested && option.id === field.recommended;
  if (isRecommended) card.dataset.suggested = 'true';

  if (isRecommended) {
    const badge = el('div', 'pp-suggestion-banner');
    const tag = el('span', 'pp-ai-badge');
    tag.append(glyph('sparkle', 13));
    tag.append(el('span', null, COPY.copilotSuggestion));
    badge.append(tag);
    badge.append(iconButton('more', 'More options'));
    card.append(badge);
    if (option.note) card.append(el('p', 'pp-layout-note', option.note));
  }

  if (option.image) {
    const figure = el('div', 'pp-layout-thumb');
    const img = document.createElement('img');
    img.src = option.image;
    img.alt = `${option.label} preview`;
    figure.append(img);
    card.append(figure);
  }

  const choiceId = `pp-layout-${option.id}`;
  const head = el('div', 'pp-layout-head');
  const label = document.createElement('label');
  label.className = 'pp-layout-title';
  label.htmlFor = choiceId;
  label.textContent = option.label;
  head.append(label);

  const radio = document.createElement('input');
  radio.type = 'radio';
  radio.className = 'pp-radio';
  radio.id = choiceId;
  radio.name = `pp-choice-${field.id}`;
  radio.value = option.id;
  radio.dataset.fieldId = field.id;
  radio.checked = field.value === option.id;
  head.append(radio);
  card.append(head);

  card.append(el('p', 'pp-layout-desc', option.description));
  if (option.previewLabel) card.append(inertButton(option.previewLabel, 'pp-link-inline'));
  return card;
}

function renderLayoutField(field) {
  const grid = el('div', 'pp-layout-grid');
  grid.setAttribute('role', 'radiogroup');
  grid.setAttribute('aria-label', field.label);
  for (const option of field.options) grid.append(renderLayoutOption(field, option));
  return grid;
}

function previewControl(field, className, tag = 'input') {
  const control = document.createElement(MULTILINE_FIELDS.has(field.id) ? 'textarea' : tag);
  if (control.tagName === 'INPUT') control.type = 'text';
  control.className = className;
  control.id = `pp-field-${field.id}`;
  control.value = field.value || '';
  control.dataset.fieldId = field.id;
  control.setAttribute('aria-label', field.label);
  if (control.tagName === 'TEXTAREA') control.rows = 4;
  return control;
}

/**
 * Step 5 renders the mocked-up consumer banner rather than a form, but every
 * string in it is still a real editable control bound to its wizard field —
 * the step's whole point is "preview and customize".
 */
function renderPreviewStep(wizard) {
  const byId = Object.fromEntries((wizard.fields || []).map(field => [field.id, field]));
  const section = el('div', 'pp-preview');

  section.append(inertButton(COPY.customize, 'pp-button pp-button-secondary', { iconBefore: 'doc' }));

  const frame = el('div', 'pp-preview-browser');
  const tabs = el('div', 'pp-preview-tabs');
  tabs.append(el('span', 'pp-favicon'));
  tabs.append(el('span', 'pp-preview-tab-title', 'Contoso'));
  tabs.append(el('span', 'pp-preview-window'));
  frame.append(tabs);

  const bar = el('div', 'pp-preview-bar');
  bar.append(glyph('arrowLeft', 14));
  bar.append(glyph('refresh', 14));
  const address = el('div', 'pp-preview-address');
  address.append(glyph('lock', 13));
  address.append(el('span', 'pp-address-dim', COPY.urlScheme));
  if (byId['preview-address']) address.append(previewControl(byId['preview-address'], 'pp-preview-url'));
  bar.append(address);
  frame.append(bar);

  const stage = el('div', 'pp-preview-stage');
  stage.append(el('div', 'pp-preview-block pp-preview-block-hero'));
  const strip = el('div', 'pp-preview-strip');
  strip.append(el('div', 'pp-preview-block'));
  strip.append(el('div', 'pp-preview-block'));
  strip.append(el('div', 'pp-preview-block'));
  stage.append(strip);
  frame.append(stage);

  const banner = el('div', 'pp-cookie-banner');
  if (byId['preview-banner-text']) {
    banner.append(previewControl(byId['preview-banner-text'], 'pp-cookie-text'));
  }
  if (wizard.links && wizard.links.length) {
    const links = el('p', 'pp-cookie-links');
    for (const link of wizard.links) links.append(el('span', 'pp-link-inline is-inert', link));
    banner.append(links);
  }
  const actions = el('div', 'pp-cookie-actions');
  for (const id of ['preview-accept-all', 'preview-decline-all']) {
    if (!byId[id]) continue;
    const box = el('span', `pp-cookie-button${id === 'preview-accept-all' ? ' is-primary' : ''}`);
    box.append(previewControl(byId[id], 'pp-cookie-button-input'));
    actions.append(box);
  }
  if (byId['preview-manage-preferences']) {
    const box = el('span', 'pp-cookie-manage');
    box.append(previewControl(byId['preview-manage-preferences'], 'pp-cookie-manage-input'));
    actions.append(box);
  }
  banner.append(actions);
  frame.append(banner);

  section.append(frame);
  return section;
}

function renderStepper(step, totalSteps) {
  const nav = el('ol', 'pp-stepper');
  nav.setAttribute('aria-label', `Step ${step} of ${totalSteps}`);
  for (let index = 1; index <= totalSteps; index += 1) {
    const done = index < step;
    const current = index === step;
    const li = el('li', `pp-stepper-item${done ? ' is-done' : ''}${current ? ' is-current' : ''}`);
    const dot = el('span', 'pp-stepper-dot');
    if (done) dot.append(glyph('check', 12));
    else dot.append(el('span', 'pp-stepper-number', String(index)));
    li.append(dot);
    const sr = el('span', 'pp-sr-only', `Step ${index} of ${totalSteps}`);
    li.append(sr);
    if (current) li.setAttribute('aria-current', 'step');
    nav.append(li);
  }
  return nav;
}

function renderWizardFields(wizard) {
  const body = el('div', 'pp-wizard-fields');
  const fields = wizard.fields || [];

  const choiceField = fields.find(field => field.options);
  if (choiceField) {
    body.append(renderLayoutField(choiceField));
    return body;
  }

  if (fields.every(field => field.id.startsWith('preview-'))) {
    body.append(renderPreviewStep(wizard));
    return body;
  }

  let currentSection = null;
  let container = body;
  for (const field of fields) {
    const section = field.section || null;
    if (section !== currentSection) {
      currentSection = section;
      if (section) {
        const group = el('section', 'pp-field-group');
        if (wizard.subsectionHeading) group.append(el('h3', 'pp-subheading', wizard.subsectionHeading));
        if (wizard.subsectionIntro) group.append(el('p', 'pp-subintro', wizard.subsectionIntro));
        body.append(group);
        container = group;
      } else {
        container = body;
      }
    }
    container.append(renderTextField(field));
  }
  return body;
}

function renderWizard(wizard) {
  // engine.populate() carries the whole content entry onto state.wizard, so
  // the step chrome is read straight off it.
  const step = wizard.step || 1;
  const totalSteps = wizard.totalSteps || 5;
  const isLastStep = step === totalSteps;

  const panel = el('section', 'pp-wizard');
  panel.setAttribute('aria-label', wizard.title);

  const header = el('header', 'pp-wizard-header');
  const identity = el('div', 'pp-wizard-identity');
  identity.append(solutionBadge(18));
  const titles = el('div', 'pp-wizard-titles');
  titles.append(el('h2', 'pp-wizard-title', wizard.title));
  if (wizard.subtitle) titles.append(el('p', 'pp-wizard-subtitle', wizard.subtitle));
  identity.append(titles);
  header.append(identity);
  header.append(renderStepper(step, totalSteps));
  panel.append(header);

  const body = el('div', 'pp-wizard-body');
  if (wizard.heading) body.append(el('h3', 'pp-wizard-heading', wizard.heading));
  if (wizard.intro) body.append(el('p', 'pp-wizard-intro', wizard.intro));
  // Frames 5-7 carry the disclaimer; frames 4 and 8 do not.
  if (step > 1 && !isLastStep) body.append(disclaimerLine(COPY.disclaimer, 'pp-disclaimer pp-disclaimer-tight'));
  body.append(renderWizardFields(wizard));
  panel.append(body);

  const footer = el('footer', 'pp-wizard-footer');
  const left = el('div', 'pp-wizard-footer-left');
  if (step > 1) left.append(inertButton(COPY.wizardBack, 'pp-button pp-button-secondary'));
  if (!isLastStep) {
    left.append(hotspotButton(WIZARD_NEXT, COPY.wizardNext, 'pp-button pp-button-primary'));
  }
  footer.append(left);

  const right = el('div', 'pp-wizard-footer-right');
  right.append(
    hotspotButton(
      WIZARD_SAVE_CLOSE,
      COPY.wizardSaveClose,
      `pp-button ${isLastStep ? 'pp-button-primary' : 'pp-button-secondary'}`
    )
  );
  right.append(inertButton(COPY.wizardCancel, 'pp-button pp-button-secondary'));
  footer.append(right);
  panel.append(footer);

  return panel;
}

/* ------------------------------------------------------------------ *
 * List panel — the dialog's right half in scenario 2.1 (Frames 1:67810,
 * 1:67834, 1:67859). Same shell as the wizard, but a filtered list instead
 * of a stepper: identity, a toolbar, a table, a footer.
 *
 * The footer's four buttons are all inert on purpose: the design draws them
 * (and makes "Next" primary) but no frame in the scenario is reachable from
 * any of them — the flow leaves through the chat pane. See ambiguity B5.
 * ------------------------------------------------------------------ */
function renderListPanel(panel) {
  const section = el('section', 'pp-wizard pp-panel');
  if (!panel) return section;
  section.setAttribute('aria-label', panel.title);

  const header = el('header', 'pp-wizard-header');
  const identity = el('div', 'pp-wizard-identity');
  identity.append(solutionBadge(18));
  const titles = el('div', 'pp-wizard-titles');
  titles.append(el('h2', 'pp-wizard-title', panel.title));
  if (panel.subtitle) titles.append(el('p', 'pp-wizard-subtitle', panel.subtitle));
  identity.append(titles);
  header.append(identity);
  section.append(header);

  const body = el('div', 'pp-wizard-body');

  const toolbar = el('div', 'pp-panel-toolbar');
  const filters = el('div', 'pp-filters');
  for (const filter of panel.filters || []) {
    const pill = inertButton('', 'pp-filter-pill', { iconAfter: 'chevronDown', iconSize: 13 });
    // Built as two runs so the value can carry its own weight, exactly as
    // the design draws "Response deadline: Overdue".
    const label = el('span', 'pp-filter-label', `${filter.label}: `);
    const value = el('span', 'pp-filter-value', filter.value);
    pill.prepend(value);
    pill.prepend(label);
    filters.append(pill);
  }
  toolbar.append(filters);

  const trailing = el('div', 'pp-panel-toolbar-trailing');
  if (panel.count) trailing.append(el('span', 'pp-panel-count', panel.count));
  if (panel.filterPlaceholder) {
    const box = el('div', 'pp-panel-search');
    box.append(glyph('search', 14));
    const input = document.createElement('input');
    input.type = 'search';
    input.className = 'pp-input';
    input.readOnly = true;   // the prototype does not filter; say so honestly
    input.placeholder = panel.filterPlaceholder;
    input.setAttribute('aria-label', panel.filterPlaceholder);
    box.append(input);
    trailing.append(box);
  }
  toolbar.append(trailing);
  body.append(toolbar);

  if (panel.table) body.append(renderDataTable(panel.table));
  section.append(body);

  const footer = el('footer', 'pp-wizard-footer');
  const left = el('div', 'pp-wizard-footer-left');
  left.append(inertButton(COPY.wizardBack, 'pp-button pp-button-secondary'));
  left.append(inertButton(COPY.wizardNext, 'pp-button pp-button-primary'));
  footer.append(left);
  const right = el('div', 'pp-wizard-footer-right');
  right.append(inertButton(COPY.wizardSaveClose, 'pp-button pp-button-secondary'));
  right.append(inertButton(COPY.wizardCancel, 'pp-button pp-button-secondary'));
  footer.append(right);
  section.append(footer);

  return section;
}

/* ------------------------------------------------------------------ *
 * Scan configuration panel (scenario 2.2, Frames 1:67487-1:67457)
 *
 * The dialog's third right-half type, after scenario 1's wizard and 2.1's
 * list. A tabbed scan editor opened on its third tab, with two collapsible
 * sections and a grid of compliance-object cards, one of which carries a
 * Copilot suggestion.
 *
 * Every control here is inert (Reword note R3): the tabs, the "+ Add
 * compliance object" action, the "Learn more" link and the six location-path
 * inputs have no frame behind them, and the panel's own component carries a
 * Save / undo / redo toolbar that the frames do not render at all, so it is
 * not drawn either.
 * ------------------------------------------------------------------ */
function renderScanObject(object) {
  const card = el('article', `pp-scan-object${object.highlight ? ' is-highlight' : ''}`);

  const head = el('div', 'pp-scan-object-head');
  head.append(el('span', 'pp-scan-object-label', object.label));
  const box = el('span', `pp-checkbox${object.checked ? ' is-checked' : ''}`);
  box.setAttribute('role', 'img');
  box.setAttribute(
    'aria-label',
    `${object.label}: ${object.checked ? COPY.objectSelected : COPY.objectNotSelected}`
  );
  if (object.checked) box.append(glyph('check', 11));
  head.append(box);
  card.append(head);

  if (object.fieldLabel) card.append(el('p', 'pp-scan-field-label', object.fieldLabel));
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'pp-input pp-scan-input';
  input.readOnly = true;      // the prototype edits no scan configuration
  input.value = object.value || '';
  if (object.placeholder) input.placeholder = object.placeholder;
  input.setAttribute('aria-label', `${object.label} ${object.fieldLabel || ''}`.trim());
  card.append(input);

  if (object.detected) {
    card.append(el('p', 'pp-scan-detected-label', object.detectedLabel));
    card.append(el('p', 'pp-scan-detected-value', object.detected));
  }
  if (object.note) card.append(el('p', 'pp-scan-note', object.note));
  if (object.detected || object.note) {
    const footer = el('div', 'pp-bubble-footer');
    footer.append(el('span', 'pp-bubble-disclaimer', COPY.shortDisclaimer));
    const feedback = el('div', 'pp-feedback');
    feedback.append(iconButton('thumbUp', COPY.thumbsUp));
    feedback.append(iconButton('thumbDown', COPY.thumbsDown));
    footer.append(feedback);
    card.append(footer);
  }
  return card;
}

/**
 * Scenario 3's RoPA report (Frame 1:67629): a subway nav of nine steps beside
 * the generated sections.
 *
 * The step count and the block count deliberately disagree — see RULING R1 in
 * docs/superpowers/notes/figma-scenario-3.md. The rail is verbatim at nine
 * because that is what the design draws; the body carries only the blocks the
 * design actually authored. The rail is decorative here: no beat targets a
 * step, so nothing in it is a button.
 */
function renderReportPanel(panel) {
  const section = el('section', 'pp-wizard pp-panel pp-report-panel');
  if (!panel) return section;
  section.setAttribute('aria-label', panel.title);

  const header = el('header', 'pp-wizard-header');
  header.append(el('h2', 'pp-wizard-title', panel.title));
  section.append(header);

  const body = el('div', 'pp-wizard-body pp-report-body');

  const rail = el('ol', 'pp-subway');
  for (const step of panel.steps || []) {
    const li = el('li', 'pp-subway-item');
    li.append(el('span', 'pp-subway-marker'));
    li.append(el('span', 'pp-subway-label', step));
    rail.append(li);
  }
  body.append(rail);

  // Numbered by the list marker rather than by typed digits, same treatment
  // the scan panel's tabs get.
  const blocks = el('ol', 'pp-report-blocks');
  for (const block of panel.blocks || []) {
    const li = el('li', 'pp-report-block');
    li.append(el('h3', 'pp-report-heading', block.heading));
    li.append(el('p', 'pp-report-answer', block.body));
    const pill = el('span', 'pp-risk-pill');
    pill.append(el('span', 'pp-risk-pill-label', panel.riskLabel));
    pill.append(el('span', 'pp-risk-pill-value', panel.riskValue));
    li.append(pill);
    blocks.append(li);
  }
  body.append(blocks);

  section.append(body);
  return section;
}

function renderScanPanel(panel) {
  const section = el('section', 'pp-wizard pp-panel pp-scan-panel');
  if (!panel) return section;
  section.setAttribute('aria-label', panel.title);

  const header = el('header', 'pp-wizard-header');
  header.append(el('h2', 'pp-wizard-title', panel.title));
  section.append(header);

  const body = el('div', 'pp-wizard-body');

  // Authored as an ordered list, so "1." … "4." are list markers rather than
  // typed text — same treatment the numbered chat steps get in scenario 2.1.
  const tabs = el('ol', 'pp-scan-tabs');
  for (const label of panel.tabs || []) {
    const li = document.createElement('li');
    const selected = label === panel.activeTab;
    const item = el('span', `pp-scan-tab${selected ? ' is-selected' : ''}`, label);
    if (selected) item.setAttribute('aria-current', 'step');
    li.append(item);
    tabs.append(li);
  }
  body.append(tabs);

  if (panel.intro) {
    const intro = el('p', 'pp-scan-intro');
    intro.append(document.createTextNode(`${panel.intro} `));
    if (panel.introLink) intro.append(inertButton(panel.introLink.trim(), 'pp-link-inline'));
    body.append(intro);
  }

  for (const group of panel.sections || []) {
    const wrap = el('div', 'pp-scan-section');
    const heading = el('h3', 'pp-scan-section-heading');
    heading.append(glyph(group.expanded ? 'chevronDown' : 'chevronRight', 12));
    heading.append(el('span', null, group.heading));
    wrap.append(heading);
    if (group.text) wrap.append(el('p', 'pp-scan-section-text', group.text));
    body.append(wrap);
  }

  // The objects belong to the expanded "Compliance objects" section, which is
  // the last one the design draws — so appending them after the sections puts
  // them exactly where the frame does.
  if (panel.addObject) {
    body.append(inertButton(panel.addObject, 'pp-link-button pp-scan-add', { iconBefore: 'add', iconSize: 14 }));
  }
  if (panel.objects && panel.objects.length) {
    const grid = el('div', 'pp-scan-grid');
    for (const object of panel.objects) grid.append(renderScanObject(object));
    body.append(grid);
  }

  section.append(body);
  return section;
}

/* ------------------------------------------------------------------ *
 * View: dialog (Frames 4-8) — chat pane + wizard over the answer page
 * ------------------------------------------------------------------ */
/**
 * The "SRR summary email" preview tile inside the chat card (Frame
 * 1:67859 / component 1:67901). Its open glyph is the hotspot that leaves
 * Priva for the draft, so it is a real button with a real accessible name.
 */
function renderEmailTile(card) {
  const teams = card.icon === 'teams';
  const tile = el('div', 'pp-email-tile');
  const art = el('div', `pp-email-tile-art${teams ? ' pp-email-tile-art-teams' : ''}`);
  // Scenario 2.1's card shows a 48px Mail glyph; scenario 2.2's shows the
  // Microsoft Teams product mark, the one asset that scenario exported —
  // a seven-shape brand logo, not something to approximate with a path.
  if (teams) {
    const mark = document.createElement('img');
    mark.className = 'pp-teams-mark';
    mark.src = 'assets/f4e216c68090.svg';
    mark.alt = '';
    mark.setAttribute('aria-hidden', 'true');
    art.append(mark);
  } else {
    art.append(glyph('mail', 48));
  }
  tile.append(art);

  const foot = el('div', 'pp-email-tile-foot');
  const titles = el('div', 'pp-email-tile-titles');
  titles.append(el('p', 'pp-email-tile-title', card.title));
  titles.append(el('p', 'pp-email-tile-subtitle', card.subtitle));
  foot.append(titles);

  // Scenario 2.1 arms this glyph (it opens the Outlook draft); scenario 2.2
  // has no onward frame for it, so no beat names it and the spotlight
  // machinery leaves it inert — ambiguity B12.
  const open = hotspotButton(EMAIL_CARD_OPEN, '', 'pp-icon-button pp-email-tile-open');
  open.append(glyph('external', 18));
  open.setAttribute('aria-label', teams ? COPY.openMessage : COPY.openEmail);
  foot.append(open);

  tile.append(foot);
  return tile;
}

/**
 * One output card in the chat pane. Usually a whole assistant turn; in
 * scenario 2.2 a turn is three of these (see renderPaneMessage below).
 */
function renderAssistantCard(message) {
  const bubble = el('div', 'pp-bubble pp-bubble-assistant');
  if (message.text) bubble.append(el('p', 'pp-bubble-text', message.text));
  if (message.bullets && message.bullets.length) {
    const list = el('ul', 'pp-bubble-bullets');
    for (const item of message.bullets) list.append(renderLabelledBullet(item));
    bubble.append(list);
  }
  // Numbered steps whose lead-in is a link rather than a bold label. The
  // design repeats the placeholder "Request name:" three times and gives it
  // no destination, so every one is inert (Reword R1).
  if (message.steps && message.steps.length) {
    const list = el('ol', 'pp-bubble-steps');
    for (const step of message.steps) {
      const li = document.createElement('li');
      if (step.label) li.append(el('span', 'pp-link-inline is-inert', step.label));
      li.append(document.createTextNode(step.label ? ` ${step.text}` : step.text));
      list.append(li);
    }
    bubble.append(list);
  }
  if (message.outro) bubble.append(el('p', 'pp-bubble-text', message.outro));
  // Frame 1:67487's first card quotes the detected XPath as a muted value
  // with a "Hide value" button under it. The button toggles nothing in any
  // frame, so it is inert (Reword note R3).
  if (message.value) bubble.append(el('p', 'pp-bubble-value', message.value));
  if (message.valueAction) {
    const row = el('div', 'pp-bubble-value-actions');
    row.append(inertButton(message.valueAction, 'pp-button pp-button-tiny'));
    bubble.append(row);
  }
  if (message.emailCard) bubble.append(renderEmailTile(message.emailCard));

  const footer = el('div', 'pp-bubble-footer');
  footer.append(el('span', 'pp-bubble-disclaimer', COPY.shortDisclaimer));
  const feedback = el('div', 'pp-feedback');
  feedback.append(iconButton('thumbUp', COPY.thumbsUp));
  feedback.append(iconButton('thumbDown', COPY.thumbsDown));
  footer.append(feedback);
  bubble.append(footer);
  // Frame 1:67859's email card has no "Show process" row; every other card
  // in the file does, so the flag is opt-out.
  if (message.showProcess !== false) {
    bubble.append(inertButton(COPY.showProcess, 'pp-link-button', { iconAfter: 'chevronDown', iconSize: 13 }));
  }
  return bubble;
}

function renderPaneMessage(message) {
  if (message.role === 'user') {
    const bubble = el('div', 'pp-bubble pp-bubble-user');
    bubble.append(el('p', null, message.text));
    return bubble;
  }
  // Scenario 2.2's Frame 1:67487 answers one prompt with THREE separate
  // output cards. A beat pushes exactly one chat entry, so the entry carries
  // them all and they stack inside the one turn — which is what the frame
  // shows, since none of the three ever appears without the others
  // (ambiguity B13 in docs/superpowers/notes/figma-scenario-2-2.md).
  if (message.cards && message.cards.length) {
    const stack = el('div', 'pp-bubble-stack');
    for (const card of message.cards) {
      stack.append(renderAssistantCard({ showProcess: message.showProcess, ...card }));
    }
    return stack;
  }
  return renderAssistantCard(message);
}

function renderChatPane(state) {
  const pane = el('div', 'pp-chat-pane');
  const { pane: messages } = splitChat(state.chat);

  // This is the announced region while the dialog is open.
  const log = el('div', 'pp-chat');
  log.setAttribute('aria-live', 'polite');
  log.setAttribute('aria-atomic', 'false');
  log.setAttribute('aria-label', COPY.copilot);
  for (const message of messages) log.append(renderPaneMessage(message));
  pane.append(log);

  // A suggested-prompt chip belongs to the newest assistant turn that offers
  // one (Frame 1:67810). Sending it is what advances the flow, so it is the
  // armed hotspot; it disappears with the next turn, exactly as the design
  // shows in Frame 1:67834.
  const newest = messages[messages.length - 1];
  if (newest && newest.suggestion) {
    const row = el('div', 'pp-chip-row');
    row.append(hotspotButton(CHAT_SUGGESTION, newest.suggestion, 'pp-chip'));
    row.append(iconButton('doc', COPY.moreSuggestions));
    pane.append(row);
  }

  const composer = el('div', 'pp-composer');
  // #copilot-chat-input is a typing target, not a click target, so it is a
  // real editable control rather than a button — focusable, labelled, and
  // announced as a text field.
  const input = document.createElement('textarea');
  input.id = CHAT_INPUT.replace('#', '');
  input.className = 'pp-chat-input';
  input.rows = 3;
  input.placeholder = COPY.chatPlaceholder;
  input.setAttribute('aria-label', COPY.chatPlaceholder);
  input.value = '';
  composer.append(input);
  const composerActions = el('div', 'pp-composer-actions');
  composerActions.append(iconButton('attach', COPY.attach));
  composerActions.append(iconButton('send', COPY.send));
  composer.append(composerActions);
  pane.append(composer);

  return pane;
}

function renderDialog(state) {
  const scrim = el('div', 'pp-scrim');

  const dialog = el('div', 'pp-dialog');
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');
  const panel = state.wizard || (state.panel ? CONTENT[state.panel] : null);
  dialog.setAttribute('aria-label', panel ? panel.title : COPY.copilot);

  const header = el('header', 'pp-dialog-header');
  const brand = el('div', 'pp-dialog-brand');
  brand.append(copilotMark('sm'));
  brand.append(el('span', 'pp-dialog-title', COPY.copilot));
  brand.append(el('span', 'pp-pill pp-pill-preview', COPY.previewPill));
  header.append(brand);

  const headerActions = el('div', 'pp-dialog-actions');
  // R1/R2: no destination exists for this button in any scenario — inert
  // on purpose. CORRECTION B3: scenario 2.1's dialog names its own product
  // rather than reusing scenario 1's "Consent Management" label verbatim.
  const openInLabel = DIALOG_OPEN_IN[state.scenarioId] || COPY.openInConsent;
  headerActions.append(inertButton(openInLabel, 'pp-link-button', { iconBefore: 'external' }));
  headerActions.append(iconButton('close', COPY.closeDialog, 'pp-icon-button pp-icon-button-lg'));
  header.append(headerActions);
  dialog.append(header);

  const body = el('div', 'pp-dialog-body');
  body.append(renderChatPane(state));
  // The dialog's right half is a wizard in scenario 1, a list panel in 2.1
  // and a scan editor in 2.2. `state.panel` is a content key, same convention
  // as state.actionCard; the panel's own `kind` picks its renderer, so no
  // scenario id is hard-coded here.
  if (state.wizard) body.append(renderWizard(state.wizard));
  else if (panel && panel.kind === 'scan') body.append(renderScanPanel(panel));
  else if (panel && panel.kind === 'report') body.append(renderReportPanel(panel));
  else if (state.panel) body.append(renderListPanel(CONTENT[state.panel]));
  dialog.append(body);

  scrim.append(dialog);
  return scrim;
}

/* ------------------------------------------------------------------ *
 * View: email (Frame 1:92886) — the generated draft, open in Outlook.
 *
 * The source frame is two flattened screenshots with no text layers, so the
 * copy below was transcribed from the raster (see the inventory's Frame 7
 * section and ambiguity B11). The compose window is rebuilt rather than
 * exported: every string in it is plain text, and the screenshot's outer
 * chrome is an unrelated mailbox that has no business in this flow. The
 * backdrop is therefore a neutral desktop, not that mailbox.
 * ------------------------------------------------------------------ */
function microsoftLockup(text) {
  const lockup = el('div', 'pp-ms-lockup');
  lockup.append(el('span', 'pp-favicon'));
  lockup.append(el('span', 'pp-ms-wordmark', text));
  return lockup;
}

function renderEmailBody(draft) {
  const body = el('div', 'pp-email-body');
  body.append(microsoftLockup(draft.brand));

  const strip = el('div', 'pp-email-strip');
  strip.append(glyph('info', 16));
  strip.append(el('span', null, draft.banner));
  body.append(strip);

  body.append(el('h1', 'pp-email-heading', draft.heading));
  // A literal authoring placeholder, square brackets and all (Reword R3) —
  // shown in its own muted style so it reads as unfinished copy, not product
  // text, and never replaced with anything invented.
  body.append(el('p', 'pp-email-placeholder', draft.description));

  const table = el('table', 'pp-table pp-email-table');
  const thead = el('thead');
  const headRow = el('tr');
  (draft.columns || []).forEach((column, index) => {
    const th = el('th');
    th.scope = 'col';
    const inner = el('div', 'pp-cell');
    inner.append(el('span', 'pp-cell-text', column));
    if (index === 0) inner.append(glyph('sortDown', 13));
    th.append(inner);
    headRow.append(th);
  });
  thead.append(headRow);
  table.append(thead);

  for (const group of draft.groups || []) {
    const tbody = el('tbody');
    const groupRow = el('tr', 'pp-email-group');
    const cell = el('th', null, group.label);
    cell.scope = 'colgroup';
    cell.colSpan = (draft.columns || []).length;
    groupRow.append(cell);
    tbody.append(groupRow);

    for (const owner of group.rows) {
      const tr = el('tr');
      const nameCell = el('td');
      const inner = el('div', 'pp-cell');
      const mono = el('span', 'pp-mono', owner.initials);
      mono.setAttribute('aria-hidden', 'true');
      inner.append(mono);
      inner.append(el('span', 'pp-cell-text', owner.name));
      nameCell.append(inner);
      tr.append(nameCell);
      tr.append(el('td', 'pp-cell-number', owner.tasks));
      tr.append(el('td', null, owner.deadline));
      tbody.append(tr);
    }
    table.append(tbody);
  }
  body.append(table);

  body.append(inertButton(draft.cta, 'pp-button pp-email-cta'));

  const footer = el('div', 'pp-email-footer');
  const sent = el('p', 'pp-email-footer-text');
  sent.append(document.createTextNode(draft.footerBefore));
  sent.append(el('span', 'pp-link-inline is-inert', draft.footerLink));
  sent.append(document.createTextNode(draft.footerAfter));
  footer.append(sent);
  footer.append(inertButton(draft.privacyLink, 'pp-link-inline'));
  footer.append(microsoftLockup(draft.brand));
  body.append(footer);

  return body;
}

function renderEmail(state) {
  const draft = CONTENT[state.draft];
  const desktop = el('div', 'pp-desktop');
  if (!draft) return desktop;

  const win = el('section', 'pp-compose');
  win.setAttribute('aria-label', draft.windowTitle);

  const titlebar = el('header', 'pp-compose-titlebar');
  titlebar.append(el('span', 'pp-compose-title', draft.windowTitle));
  titlebar.append(el('span', 'pp-window-controls'));
  win.append(titlebar);

  const tabs = el('nav', 'pp-compose-tabs');
  draft.tabs.forEach((tab, index) => {
    tabs.append(el('span', `pp-compose-tab${index === 0 ? ' is-selected' : ''}`, tab));
  });
  win.append(tabs);

  const ribbon = el('div', 'pp-compose-ribbon');
  ribbon.append(el('span', 'pp-compose-font', draft.fontName));
  ribbon.append(el('span', 'pp-compose-font pp-compose-font-size', draft.fontSize));
  for (const name of ['pencil', 'attach', 'link', 'more']) {
    ribbon.append(iconButton(name, draft.windowTitle, 'pp-icon-button', 16));
  }
  win.append(ribbon);

  const sendRow = el('div', 'pp-compose-send');
  const send = inertButton(draft.send, 'pp-button pp-button-primary', { iconBefore: 'send' });
  sendRow.append(send);
  sendRow.append(el('span', 'pp-compose-from', draft.from));
  win.append(sendRow);

  const to = el('div', 'pp-compose-field');
  to.append(el('span', 'pp-compose-field-label', draft.to));
  to.append(el('span', 'pp-compose-field-value', ''));
  const copies = el('div', 'pp-compose-copies');
  copies.append(el('span', null, draft.cc));
  copies.append(el('span', null, draft.bcc));
  to.append(copies);
  win.append(to);

  const subject = el('div', 'pp-compose-field');
  subject.append(el('span', 'pp-compose-subject', draft.subjectPlaceholder));
  subject.append(el('span', 'pp-compose-saved', draft.savedNote));
  win.append(subject);

  win.append(renderEmailBody(draft));
  desktop.append(win);
  return desktop;
}

/* ------------------------------------------------------------------ *
 * Composition
 * ------------------------------------------------------------------ */
export function render(state) {
  const fragment = document.createDocumentFragment();
  const canvas = el('div', 'pp-canvas');
  // The draft opens in Outlook, outside Priva entirely: Frame 1:92886 has no
  // browser tab band and no suite header, so neither is drawn.
  if (state.view !== 'email') {
    canvas.append(renderBrowserChrome());
    canvas.append(renderSuiteHeader());
  }

  const stage = el('div', 'pp-stage');
  if (state.view === 'email') {
    stage.append(renderEmail(state));
  } else if (state.view === 'dialog') {
    const backdrop = renderAnswerPage(state, { live: false });
    backdrop.setAttribute('aria-hidden', 'true');
    stage.append(backdrop);
    stage.append(renderDialog(state));
  } else if (state.view === 'answer') {
    stage.append(renderAnswerPage(state, { live: true }));
  } else if (state.view === 'risks') {
    stage.append(renderRisks());
  } else {
    stage.append(renderHome(state));
  }

  canvas.append(stage);
  fragment.append(canvas);
  return fragment;
}
