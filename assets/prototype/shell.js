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
  answer: ['#generate-draft-button'],
  dialog: ['#wizard-next', '#wizard-save-close']
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
const [GENERATE_DRAFT] = HOTSPOTS.answer;
const [WIZARD_NEXT, WIZARD_SAVE_CLOSE] = HOTSPOTS.dialog;
const [CHAT_INPUT] = TYPING_TARGETS.dialog;

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
  pageTitle: 'Privacy manager',
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
  closeDialog: 'Close',
  chatPlaceholder: "Ask a question or describe what you'd like to do in Privacy manager.",
  attach: 'Attach a file',
  send: 'Send',
  copilotSuggestion: 'Copilot suggestion',
  wizardBack: 'Back',
  wizardNext: 'Next',
  wizardSaveClose: 'Save and close',
  wizardCancel: 'Cancel',
  customize: 'Customize',
  required: 'Required'
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
  doc:         { d: 'M4 2.5h5L12 5.5V13.5H4zM9 2.5v3h3' }
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
 * array. The first user turn is the page's breadcrumb query and any
 * assistant turn carrying page furniture (a `toc` or a `sectionHeading`)
 * is the page's answer; everything later is a chat-pane message.
 * ------------------------------------------------------------------ */
function splitChat(chat) {
  const page = [];
  const pane = [];
  let seenPageQuery = false;
  for (const message of chat || []) {
    if (message.role === 'user') {
      if (!seenPageQuery) { page.push(message); seenPageQuery = true; }
      else pane.push(message);
    } else if (message.toc || message.sectionHeading) {
      page.push(message);
    } else {
      pane.push(message);
    }
  }
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
 * View: answer (Frames 3 and 9) — also the backdrop under the dialog
 * ------------------------------------------------------------------ */
function renderAnswerHeader(query) {
  const header = el('header', 'pp-page-header');
  const row = el('div', 'pp-backrow');
  row.append(inertButton(COPY.answerBack, 'pp-link-button', { iconBefore: 'arrowLeft' }));
  header.append(row);

  const main = el('div', 'pp-page-header-main');
  main.append(el('h1', 'pp-page-title', COPY.pageTitle));

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
  const nav = el('nav', 'pp-toc');
  nav.setAttribute('aria-label', toc.heading);
  nav.append(el('h2', 'pp-toc-heading', toc.heading));
  const list = el('ul', 'pp-toc-list');
  for (const item of toc.items) {
    const li = document.createElement('li');
    const isAdd = item.trim().startsWith('+');
    const isSelected = item === toc.selected;
    const entry = el('div', `pp-toc-item${isSelected ? ' is-selected' : ''}${isAdd ? ' is-add' : ''}`);
    entry.append(el('span', 'pp-toc-label', item));
    if (!isAdd) entry.append(glyph(isSelected ? 'refresh' : 'play', 14));
    li.append(entry);
    list.append(li);
  }
  nav.append(list);
  return nav;
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
    message.citations.forEach((citation, index) => {
      const li = document.createElement('li');
      const pill = el('span', 'pp-citation');
      pill.append(el('span', 'pp-citation-index', String(index + 1)));
      pill.append(el('span', 'pp-citation-label', citation.trim()));
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
    // The first button is the armed hotspot ("Generate draft"); the rest are
    // inert, because no beat targets them.
    row.append(hotspotButton(GENERATE_DRAFT, content.buttons[0], 'pp-button pp-button-secondary'));
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
  const query = (page.find(message => message.role === 'user') || {}).text || '';
  const answers = page.filter(message => message.role === 'assistant');
  const toc = (answers.find(message => message.toc) || {}).toc;

  const root = el('div', `pp-page pp-page-answer${live ? '' : ' is-backdrop'}`);
  root.append(renderAnswerHeader(query));

  const columns = el('div', 'pp-columns');
  if (toc) columns.append(renderToc(toc));

  const main = el('main', live ? 'pp-chat' : 'pp-answer-region');
  if (live) {
    main.setAttribute('aria-live', 'polite');
    main.setAttribute('aria-atomic', 'false');
  }
  for (const message of answers) main.append(renderAnswerMessage(message));
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

function renderLayoutField(field) {
  const card = el('article', 'pp-layout-card');
  card.dataset.source = field.source || 'user';
  if (field.suggested) card.dataset.suggested = 'true';

  if (field.suggested) {
    const badge = el('div', 'pp-suggestion-banner');
    const tag = el('span', 'pp-ai-badge');
    tag.append(glyph('sparkle', 13));
    tag.append(el('span', null, COPY.copilotSuggestion));
    badge.append(tag);
    badge.append(iconButton('more', 'More options'));
    card.append(badge);
    if (field.note) card.append(el('p', 'pp-layout-note', field.note));
  }

  if (field.image) {
    const figure = el('div', 'pp-layout-thumb');
    const img = document.createElement('img');
    img.src = field.image;
    img.alt = `${field.label} preview`;
    figure.append(img);
    card.append(figure);
  }

  const choiceId = `pp-layout-${field.id}`;
  const head = el('div', 'pp-layout-head');
  const label = document.createElement('label');
  label.className = 'pp-layout-title';
  label.htmlFor = choiceId;
  label.textContent = field.label;
  head.append(label);

  // A real radio, not a styled div. It deliberately carries no data-field-id:
  // its value is a choice, not the field's text value.
  const radio = document.createElement('input');
  radio.type = 'radio';
  radio.className = 'pp-radio';
  radio.id = choiceId;
  radio.name = 'pp-layout-choice';
  radio.value = field.id;
  radio.dataset.layoutChoice = field.id;
  if (field.suggested) radio.checked = true;
  head.append(radio);
  card.append(head);

  card.append(el('p', 'pp-layout-desc', field.value));
  if (field.previewLabel) card.append(inertButton(field.previewLabel, 'pp-link-inline'));
  return card;
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

  if (fields.some(field => field.image)) {
    const grid = el('div', 'pp-layout-grid');
    grid.setAttribute('role', 'radiogroup');
    grid.setAttribute('aria-label', wizard.heading || wizard.title);
    for (const field of fields) grid.append(renderLayoutField(field));
    body.append(grid);
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
 * View: dialog (Frames 4-8) — chat pane + wizard over the answer page
 * ------------------------------------------------------------------ */
function renderPaneMessage(message) {
  if (message.role === 'user') {
    const bubble = el('div', 'pp-bubble pp-bubble-user');
    bubble.append(el('p', null, message.text));
    return bubble;
  }

  const bubble = el('div', 'pp-bubble pp-bubble-assistant');
  if (message.text) bubble.append(el('p', 'pp-bubble-text', message.text));
  if (message.bullets && message.bullets.length) {
    const list = el('ul', 'pp-bubble-bullets');
    for (const item of message.bullets) list.append(renderLabelledBullet(item));
    bubble.append(list);
  }
  const footer = el('div', 'pp-bubble-footer');
  footer.append(el('span', 'pp-bubble-disclaimer', COPY.shortDisclaimer));
  const feedback = el('div', 'pp-feedback');
  feedback.append(iconButton('thumbUp', COPY.thumbsUp));
  feedback.append(iconButton('thumbDown', COPY.thumbsDown));
  footer.append(feedback);
  bubble.append(footer);
  bubble.append(inertButton(COPY.showProcess, 'pp-link-button', { iconAfter: 'chevronDown', iconSize: 13 }));
  return bubble;
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
  dialog.setAttribute('aria-label', state.wizard ? state.wizard.title : COPY.copilot);

  const header = el('header', 'pp-dialog-header');
  const brand = el('div', 'pp-dialog-brand');
  brand.append(copilotMark('sm'));
  brand.append(el('span', 'pp-dialog-title', COPY.copilot));
  brand.append(el('span', 'pp-pill pp-pill-preview', COPY.previewPill));
  header.append(brand);

  const headerActions = el('div', 'pp-dialog-actions');
  // R1: no destination exists for this button in scenario 1 — inert on purpose.
  headerActions.append(inertButton(COPY.openInConsent, 'pp-link-button', { iconBefore: 'external' }));
  headerActions.append(iconButton('close', COPY.closeDialog, 'pp-icon-button pp-icon-button-lg'));
  header.append(headerActions);
  dialog.append(header);

  const body = el('div', 'pp-dialog-body');
  body.append(renderChatPane(state));
  if (state.wizard) body.append(renderWizard(state.wizard));
  dialog.append(body);

  scrim.append(dialog);
  return scrim;
}

/* ------------------------------------------------------------------ *
 * Composition
 * ------------------------------------------------------------------ */
export function render(state) {
  const fragment = document.createDocumentFragment();
  const canvas = el('div', 'pp-canvas');
  canvas.append(renderBrowserChrome());
  canvas.append(renderSuiteHeader());

  const stage = el('div', 'pp-stage');
  if (state.view === 'dialog') {
    const backdrop = renderAnswerPage(state, { live: false });
    backdrop.setAttribute('aria-hidden', 'true');
    stage.append(backdrop);
    stage.append(renderDialog(state));
  } else if (state.view === 'answer') {
    stage.append(renderAnswerPage(state, { live: true }));
  } else {
    stage.append(renderHome(state));
  }

  canvas.append(stage);
  fragment.append(canvas);
  return fragment;
}
