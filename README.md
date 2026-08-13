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
└── assets/                       # Image files referenced by the pages
```

Each page is self-contained HTML with its CSS and JavaScript inlined — no build
step, no framework, no dependencies beyond Google Fonts (loaded via CDN).

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

Opening the `.html` files directly via `file://` also works, but a local server
matches how GitHub Pages serves the site (root-relative paths, correct MIME types).

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
