# Copilot Privacy Manager — Interactive Prototype

**Date:** 2026-09-15
**Status:** Approved design, pending implementation plan
**Source of truth for the design:** Figma file `TlIT2Cy6DqGvN9kiODC9dz`
("Copilot Privacy Manger"), page `0:1`

## Purpose

Build a self-hosted, interactive, resettable prototype of the four Copilot
Privacy Manager scenarios laid out in Figma, published as a standalone page on
the portfolio site. It serves two audiences at once: a recruiter who wants to
feel the product in sixty seconds, and a reader who wants evidence that the
designer can build, not only draw.

Success looks like: a visitor lands on the page, is never unsure what to click,
walks a complete scenario end to end, and leaves believing they used a product
rather than watched a slideshow. On a phone as well as a laptop.

## Scope

In scope: all four scenarios, the shell they run in, a standalone page, a
call-to-action band in case study 02, and tests for the engine and the scenario
data.

Out of scope: an inline interactive embed in the case study (explicitly
dropped); free-form prompt input; browser automation tests; any change to the
other three case studies.

## Source material

Four scenarios, each a horizontal row of 1920x1080 frames on page `0:1`. Each
row is led by a `Scenario-Card` title frame.

| # | Product | Scenario | Card | Frames (in order) |
|---|---------|----------|------|-------------------|
| 1 | Consent Management | Summarize consent laws + create draft model | `1:67163` | `1:67292`, `1:67354`, `1:67310`, `1:67181`, `1:67203`, `1:67225`, `1:67247`, `1:67269`, `1:67332` |
| 2.1 | Subject Rights Requests | SRR top compliance issues | `1:67162` | `1:67165`, `1:67371`, `1:67788`, `1:67810`, `1:67834`, `1:67859`, `1:92886` |
| 2.2 | Tracker Scanning | Tracker scanning top compliance issues | `1:67161` | `1:67517`, `1:67388`, `1:67487`, `1:67427`, `1:67457` |
| 3 | Privacy Assessments | Generate data inventory / RoPA | `1:67164` | `1:67565`, `1:67584`, `1:67760`, `1:67601`, `1:67629` |

Shared components sitting off-canvas, to be rebuilt in CSS rather than
exported: `.local-chat-pane` (`1:67949`, instance `1:67858`),
`.local-latency-card` (`1:67883`), `.local-email-output-card` (`1:67901`).

Capabilities each scenario must demonstrate, taken from its title card:
knowledge-based answers (all four); create a draft consent model and a draft
website scan (1); natural-language access to insights and metrics, and
contacting owners by email or Teams (2.1, 2.2); create a draft data inventory
report (3).

Open content question: frame `1:67583` carries the note "Placeholder location
paths, need PM suggestions:". Those paths need real values before publishing, or
the beat that shows them needs rewording.

## Architecture

```
prototype-copilot.html          standalone page: site nav, framing, mount, footer
assets/prototype/
  |- prototype.css              all prototype styling and its own token layer
  |- shell.js                   component renderers: chrome, chat pane, home grid, wizard, report
  |- scenarios.js               the four scenarios as pure data
  |- engine.js                  beat runner: apply, advance, spotlight, reset, idle
  |- mount.js                   entry point, event wiring, DOM ownership
  |- engine.test.js             state machine tests
  |- scenarios.test.js          scenario data validated against the shell
```

ES modules, loaded from the standalone page only. This means the page must be
served over HTTP rather than opened via `file://`; the README gets a note. No
runtime dependencies, no build step, no `package.json` — consistent with the
rest of the site.

### Module responsibilities

- `scenarios.js` — data only. No DOM, no imports, no functions. Editable by
  someone who does not write JavaScript. This is the file that gets touched when
  demo copy is tuned.
- `shell.js` — renders components from state. Knows nothing about scenarios,
  beats, or ordering. Same state in, same DOM out. Alongside its renderers it
  exports a `HOTSPOTS` registry — a plain map of view name to the selectors that
  view renders (`{ home: ['#prompt-bar', '#suggestion-create-model', ...] }`).
  The registry is the single declaration of a hotspot's id; renderers read their
  ids from it rather than hardcoding strings, so the registry cannot drift from
  the DOM it describes.
- `engine.js` — owns the state machine: current scenario, beat index,
  accumulated state. Never touches the DOM; hands state to `shell.js`.
- `mount.js` — the only module that touches `document`. Wires events, measures
  the viewport for canvas scaling, decides nothing about scenario content.

### The one invariant

Data flows one direction: scenario data → engine state → rendered DOM. Nothing
reads application state back out of the DOM. Reset correctness and mobile
reflow both depend on this holding.

The single deliberate exception: editable wizard fields are controlled inputs.
A field's `input` event writes to state, and the wizard is not re-rendered from
state while one of its fields holds focus, so the caret is never destroyed
mid-edit. This is the only place where the DOM leads.

## Scenario data model

```js
{
  id: 'consent',
  label: '1 — Summarize consent laws + create draft model',
  product: 'Consent Management',
  initial: { view: 'home', chat: [], wizard: null },
  beats: [
    { spotlight: '#prompt-bar',
      await:     'click',
      then: { type: { into: '#prompt-bar',
                      text: 'What are the consent requirements in California?' },
              thinking: 900,
              push:  { chat: 'answer-ccpa' } } },

    { spotlight: '#suggestion-create-model',
      await:     'click',
      then: { set: { view: 'wizard' },
              populate: { wizard: 'ccpa-draft' } } }
  ]
}
```

Beat vocabulary, complete: `spotlight` (selector to highlight), `await`
(`click`), and a `then` composed of `type`, `thinking`, `push`, `set`,
`populate`. Long response copy and wizard field sets live in a sibling
`content` map keyed by name (`answer-ccpa`, `ccpa-draft`) so beat lists stay
skimmable.

### Engine loop

Apply the current beat's changes to state → re-render from state → highlight the
next hotspot → wait for the awaited interaction. Repeat.

Consequences that fall out of this, rather than being built separately:

- **Reset** discards state, rebuilds from `initial`, renders. One code path.
- **Prev / Next / jump-to-beat** work by replaying beats `0..n` from `initial`,
  which is useful when presenting live.
- **Idle reset** after 90 seconds of no interaction runs the same path as a
  manual reset. The timer pauses while the tab is hidden, so it does not fire
  the moment a visitor returns to the tab.

### Motion

Typing animates character by character; the `thinking` beat shows the latency
card from the Figma file; responses fade in. Clicking an armed spotlight while
text is still typing fast-forwards that text to complete rather than queueing a
second beat. `prefers-reduced-motion: reduce` renders text complete and
instantly, with no beat skipped or merged.

## Visitor-facing surface

Four scenario tabs (Consent, SRR, Tracker Scanning, Privacy Assessments), a
step indicator ("Step 3 of 9"), Prev / Next, and Reset. Switching tabs resets
the outgoing scenario.

## Responsive strategy

One set of components, two layouts:

- **>= 768px** — the real 1920-wide canvas, scaled to fit via a CSS transform
  driven by a measured scale factor. Faithful proportions on laptops and
  tablets.
- **< 768px** — the same DOM reflows: chat pane becomes a bottom sheet, wizard
  goes single column, cards stack.

Spotlights and beats behave identically in both. A phone visitor gets the real
interaction, not a fallback.

## Accessibility

The case study itself recounts an inline chat panel being cut over
accessibility concerns, so the prototype must not be careless here.

- Spotlights are real `<button>` elements; the flow is fully keyboard-operable
  and focus lands where the highlight points.
- Chat responses render into a polite live region; step changes announce as
  "Step 3 of 9".
- Nothing is communicated by the highlight ring alone — the next action always
  carries a visible label.
- `prefers-reduced-motion` honored end to end.

## Testing

Node's built-in test runner, no dependencies installed.

- `engine.test.js` — applying a beat yields the expected state; reset restores
  `initial` exactly; replaying beats `0..n` equals stepping through them; idle
  reset matches manual reset; malformed beats fail loudly.
- `scenarios.test.js` — every `spotlight` selector appears in the `HOTSPOTS`
  registry for the view that beat runs in; every `push` / `populate` name
  resolves to real content; no orphaned content; every scenario reaches its
  final beat. Validating against the registry rather than against rendered DOM
  is what keeps this test dependency-free. This is the guard against a
  late-night copy edit silently producing a dead button.

Browser automation is deliberately excluded. Before publishing, a manual pass on
Safari, Chrome, and a real phone.

## Integration with the site

A full-width call-to-action band in `case-study-02-copilot.html` — animated
mini-mockup, "Try the interactive prototype", linking to
`prototype-copilot.html`. Placed after the TL;DR, repeated at the Outcome
section. No other page changes.

## Asset handling

Anything that can be drawn in CSS — cards, pills, the latency card, progress
bars — is built in CSS, not exported, so it stays sharp under canvas scaling and
can reflow on mobile. True images (logos, avatars, chart artwork) are exported
into `assets/` under the existing 12-hex-character filename convention and
referenced with `loading="lazy" decoding="async"`, per the README.

Figma asset URLs expire with the MCP session, so exports must be downloaded in
the same working session that reads the design.

## Build order

1. Shell and engine, with scenario 1 running end to end
2. Tests for engine and scenario data
3. Scenarios 2.1, 2.2, and 3
4. Mobile reflow pass
5. Call-to-action band in case study 02
6. Accessibility and cross-browser pass

## Decisions on record

- Coded UI rebuilt in HTML/CSS, not exported images with hotspots.
- Guided hotspots with one correct next step, not free exploration.
- Standalone page only; the inline interactive teaser was considered and
  dropped.
- Scaled canvas above 768px plus genuine mobile reflow below it, rather than
  either alone.
- Reset restores the current scenario, and idles back to the start after 90s.
- ES modules and separate files, accepting the loss of `file://` preview on
  this one page.
- No runtime or development dependencies.
