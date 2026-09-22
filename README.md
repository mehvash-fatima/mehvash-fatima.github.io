# Mehvash Fatima — Portfolio

A static portfolio site presenting UX case studies from 8+ years at Microsoft
across data governance, privacy, and AI-powered security tooling.

**Live:** https://mehvash-fatima.github.io

## Structure

```
.
├── index.html                    # Landing page — intro + links to each case study
├── case-study-01-dspm.html       # Purview DSPM & AI Observability
├── case-study-02-copilot.html    # AI-Powered Privacy Manager
├── case-study-03-priva.html      # Microsoft Priva – Privacy Management
├── case-study-04-babylon.html    # Project Babylon — Azure Purview
├── prototype-copilot.html        # Interactive prototype for case study 02
└── assets/
    ├── prototype/                # The prototype's modules, CSS and tests
    └── …                         # Image files referenced by the pages
```

Each page is self-contained HTML with its CSS and JavaScript inlined — no build
step, no framework, no dependencies beyond Google Fonts (loaded via CDN). The
one exception is the prototype, which is ES modules in `assets/prototype/`;
see below.

## Images

Images live as real files in `assets/` and are referenced with
`<img src="assets/…" loading="lazy" decoding="async">`. They were previously
embedded as base64 `data:` URIs directly in the HTML; that made each page 2–5 MB
and caused mobile browsers to blank the heavier pages when they exceeded the
per-tab memory limit. Keeping images as separate, lazy-loaded files keeps each
page a few KB, lets the browser decode only what's on screen, and allows the
files to be cached across pages.

**When adding a new image**, drop the file in `assets/` and reference it the same
way — do not paste base64 into the HTML.

## Running locally

No build required. Serve the folder with any static server:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Opening the `.html` files directly via `file://` also works for the case study
pages, but a local server matches how GitHub Pages serves the site (root-relative
paths, correct MIME types).

**`prototype-copilot.html` is the exception: it must be served over HTTP.** It
loads `assets/prototype/mount.js` as an ES module, and browsers refuse module
imports from `file://` under the same-origin policy — the page will render its
heading and then stay blank, with a CORS error in the console. Use the server
above.

## The interactive prototype

`prototype-copilot.html` replays four Copilot Privacy Manager scenarios, rebuilt
in code from the original Figma frames. A visitor advances by clicking whichever
control is ringed in gold; everything else on screen is deliberately inert.

It is built as data, not as pages:

```
assets/prototype/
├── scenarios.js   the demo scripts — data only, no imports, no DOM
├── engine.js      pure: applyBeat(state, beat, content) -> settled state
├── shell.js       render(state) -> DOM, plus the hotspot registries
├── mount.js       the only module that touches `document` — timers, animation
├── engine.test.js
└── scenarios.test.js   validates the scripts against the shell
```

Editing the demo means editing `scenarios.js`. The tests check the hand-authored
scripts mechanically: that every spotlight resolves to a hotspot the shell renders
*in the view that beat runs in*, that content keys resolve and none is orphaned,
that every scenario folds start to finish, and that emphasis phrases occur exactly
once in their own text.

### Tests

```bash
node --test
```

Run it from the repository root and **pass no path**. `node --test assets/prototype/`
runs zero tests on Node 24 while still reporting success — the suite is found by
its `*.test.js` naming, not by directory.

### What the tests cannot see

The suite validates data. It has nothing to say about layout, contrast, focus
order, or whether a card is clipped — every visual defect found while building
this came from driving a real browser and comparing against the Figma frame.
A headless-Chrome walk harness (`tools/walk-prototype.mjs` on the
`copilot-prototype` branch) drives a scenario over CDP and reports the settled
state after each beat. Screenshot and compare for anything it cannot assert.

The prototype's build notes — the plan, the Figma inventories and the record of
which source-design slips were corrected and which were deliberately left alone
— are kept on the `copilot-prototype` branch rather than here, because this
branch is the Pages deploy source and everything on it is served publicly.

## Deploying

This repo is a GitHub Pages **user site** (`mehvash-fatima.github.io`), so every
push to the default branch publishes automatically within a minute or two — no
Actions workflow or build step.

```bash
git add -A
git commit -m "Describe the change"
git push
```

### Custom domain (optional)

Not currently configured. To use one, add a `CNAME` file at the repo root
containing the domain (e.g. `www.example.com`) — or set it via **Settings →
Pages** — and point the domain's DNS at GitHub Pages at your registrar.

## Why `.nojekyll`

GitHub Pages runs this repo through Jekyll by default. This site is hand-written
HTML, not a Jekyll project, so the empty `.nojekyll` file at the root switches
that build off and publishes the tree as-is.

It matters for one specific reason: Jekyll silently drops any file or directory
whose name begins with `_`. A future `_partial.js` or `_draft.html` would vanish
from the deployed site with no error anywhere. Turning Jekyll off removes that
whole class of problem, and the build is a little faster.

The trade-off: with Jekyll off there is no `exclude:` mechanism, so **everything
on the deploy branch is served**. Keep anything that should not be public off
that branch rather than trying to hide it by filename.
