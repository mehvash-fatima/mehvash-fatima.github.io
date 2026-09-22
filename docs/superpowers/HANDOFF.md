# Copilot Privacy Manager prototype — handoff

**Last session ended:** 2026-09-22, after Task 10's automatable parts.
**Branch:** `copilot-prototype` (local only, never pushed). 25 commits ahead of `main`.
**Spec:** `docs/superpowers/specs/2026-09-15-copilot-prototype-design.md`
**Plan:** `docs/superpowers/plans/2026-09-15-copilot-prototype.md`

## How to pick this up

```bash
git checkout copilot-prototype
node --test                 # 22 pass / 0 fail. NEVER pass a directory path — see below
python3 -m http.server 8000 # then open http://localhost:8000/prototype-copilot.html
```

The plan was executed with `superpowers:subagent-driven-development`: one implementer
per task, a reviewer after each, fix rounds until clean. To resume that, re-invoke
the skill and start at Task 7b's remaining steps. The working ledger was at
`.superpowers/sdd/2026-09-15-copilot-prototype/progress.md` — **gitignored**, so it
may be gone; everything load-bearing from it is reproduced below.

## State

| Task | Status |
|------|--------|
| 1 — Figma inventory, scenario 1 | Complete, reviewed |
| 2 — Engine state machine | Complete, reviewed. 12 tests |
| 3 — Scenario 1 as data | Complete, reviewed. 7 beats |
| 4 — Shell renderers + CSS | Complete, reviewed (visual fidelity verified against Figma) |
| 5 — Scenario validator | Complete, reviewed. 10 tests |
| 6 — mount.js + standalone page | Complete, reviewed (adversarial pass clean) |
| 7a — SRR scenario (2.1) | Complete, reviewed. 4 beats. Plus two correction commits |
| 7b — Tracker Scanning (2.2) | Complete. Browser-walked; found and fixed a hotspot-disarm bug |
| 7c — RoPA / Privacy Assessments (3) | Complete. 3 beats. Browser-walked and screenshot-compared |
| 8 — Mobile reflow below 768px | Complete. Verified 360–1600px |
| 9 — CTA band in case study 02 | Complete. Two bands, carousel unaffected |
| 10 — Accessibility + cross-browser + README | **Mostly complete — two legs need a human, see below** |

### What works today

`prototype-copilot.html` runs scenarios 1 and 2.1 end to end: guided spotlights,
character-by-character typing, a thinking pause with the latency card, genuinely
editable Copilot-suggested wizard fields whose badge drops when a human edits them,
Reset, Previous (by replay), a step indicator, and a 90-second idle auto-reset that
pauses while the tab is hidden. Desktop only so far — the canvas scales by transform.

### Verifying in a browser

`docs/superpowers/tools/walk-prototype.mjs` walks a scenario in headless Chrome over
raw CDP (no dependencies — Node 24 has a global `WebSocket`). Usage is in its header.
Two things it learned the hard way, both encoded in it now:

- **Poll the mount's own busy signals** (`.is-typing`, `.pp-latency`), not a stability
  heuristic. Nothing changes during a 1200ms `thinking` pause either, and a click
  landing mid-animation **fast-forwards** it instead of advancing the beat — so a
  too-eager walk silently burns a click and under-reports the beat count.
- **Disable the cache** (`Network.setCacheDisabled`). ES modules are cached hard, and
  a walk after an edit will otherwise re-verify the code you just changed away from.

**The walk cannot see visual fidelity.** Every defect fixed in the last commit of
scenario 3 was found by screenshotting the canvas and putting it next to the frame,
and none of them failed a test. Budget for that pass on any new scenario.

### Task 7b, as completed

- `837bfd3` — inventory committed: `docs/superpowers/notes/figma-scenario-2-2.md` (5 frames)
- `a8ab00b` — WIP code committed: tracker data, renderers, CSS, one new SVG asset

All four modules parse; 22/22 tests pass, so the tracker data already satisfies the
validator. Three beats are authored with spotlights `#tracker-risk-card`,
`#review-scan-button`, `#chat-suggestion`; `HOTSPOTS` now has a `risks` view.

All four items closed in `01bcd03`:

1. Walked — three beats, one spotlight each, terminal state reached.
2. Scenarios 1 and 2.1 regression-walked; unchanged.
3. `assets/f4e216c68090.svg` is the Microsoft Teams brand mark — seven paths in five
   brand colours. A genuine logo, kept.
4. The walk found a defect older than the scenario: `armSpotlight` swept only
   `HOTSPOTS[state.view]`, so a suggested-action button the chat transcript carries
   into a later view stayed enabled, in the tab order, and silently did nothing on
   click. It now sweeps the union of every view's hotspots.

## Rules that bind all remaining work

- **`node --test` takes NO path argument.** `node --test assets/prototype/` runs ZERO
  tests on Node 24 and prints a spurious failure. Node v24.21.0 lives at
  `~/.local/bin/node` (installed this session, user-local, no sudo).
- No dependencies, no `package.json`, no build step. ES modules. Served over HTTP,
  never `file://`.
- `mount.js` is the ONLY module that touches `document`. No listeners or timers in
  `shell.js`.
- `engine.js` is pure: beats fold over state, `applyBeat` returns the SETTLED state,
  animation is the browser layer's problem. Do not put timing in it.
- Hotspot ids are declared ONCE in `HOTSPOTS` (click targets) / `TYPING_TARGETS`
  (typing targets) and read from there. Never hardcode an id twice.
- Every `type` clause needs `when: 'before' | 'after'` — which side of the view
  transition the typing plays on. A test enforces presence; the VALUE must be
  semantically right or text types into an off-screen element.
- Emphasis phrases must occur exactly once in their own `text` (bolding is by
  `indexOf`; a test enforces this).
- `set` may not touch `scenarioId`, `beatIndex`, or `chat` — the engine throws.
- Anything CSS-drawable is NOT exported. Real images only, 12-hex filenames in
  `assets/`. Figma asset URLs expire with the session that read the design.
- Copy is verbatim from the inventories — EXCEPT confirmed source-design slips, which
  are corrected in the prototype and recorded in the inventory (see Rulings).
- **Never invent file paths, site paths, or product data.**
- This repo is PUBLIC and serves mehvash.com. Anything committed publishes.

## Decisions taken on the user's behalf (reverse these freely)

1. **Coded UI, guided hotspots, standalone page** — user's choices, not mine.
2. **Scaled canvas ≥768px + genuine mobile reflow below** — user's choice; reflow is Task 8, not built yet.
3. **Reset returns to the scenario's start; idle auto-reset at 90s** — user's choice.
4. **Design gaps in scenario 1** (no click target between frames 1-2; a timed loading
   frame; a terminal "Open" button leading nowhere): the demo opens with the user
   TYPING the query verbatim from frame 2's breadcrumb; the loading frame became the
   `thinking` pause; the last beat arms no spotlight and shows a completion state.
5. **Frame 7's swapped values** ("Opt out: United States", "Save button: English - U.S.")
   contradict the chat pane's own summary — the prototype uses the chat pane's values.
6. **Frames 6-7 reused step 1's headings** — corrected to describe their actual steps.
7. **"Some suggested prompt" placeholder chips** — omitted rather than shipped or invented.
8. **Six confirmed slips corrected in scenario 2.1** and recorded in its inventory:
   Privacy Manager casing; a Privacy Assessments citation on an SRR answer; "Open in
   Consent Management" inside an SRR dialog; SRR count 6 vs 15 and "15 days" vs
   "2 weeks" (reconciled to 15); "Daisy Philips" vs "Daisy Phillips".
9. **Four suspected slips deliberately NOT corrected** — B4 (pre-truncated status) and
   B8 (icon mismatch) could not be confirmed by review; B5 and B10 were plausible but
   untraced. Correcting an unconfirmed bug injects an error. They stand as designed.
10. **"Privacy Manager" title case unified prototype-wide** — the source mixes casings
    in both scenarios; mixed casing reads as carelessness.
11. **A flattened frame's surrounding content is not reproduced.** Frame `1:92886` is
    two flattened PNGs; the outer one is an unrelated mailbox screenshot. It was not
    exported, its identifying details were redacted from the inventory (this repo is
    public), and the compose window was rebuilt in CSS on a neutral backdrop.
12. **Node was installed** (v24.21.0, user-local at `~/.local/bin`) after Homebrew
    refused — `/opt/homebrew` is not writable by this user and the fix needs
    `sudo chown -R`, which was not run.

## Task 10: what is verified and what is not

**Done and evidenced:**

- **Keyboard.** All four scenarios: the armed spotlight is Tab-reachable (11 stops from
  the top of the page), shows `:focus-visible`, Enter *and* Space advance, focus lands on
  the newly armed hotspot after each beat, and focus escapes the canvas afterwards — no
  trap. Note for whoever re-runs this: dispatch CDP `keyDown` **with `text`**, not
  `rawKeyDown`. `rawKeyDown` suppresses the default action, so a real `<button>` never
  gets the browser's synthesized click and Enter/Space look broken when they are fine.
- **Reduced motion.** Exactly one click per beat with nothing merged or skipped, no
  animation state at any point, settles in ~120ms. The case study's CTA band reports
  `animationName: none` and zero running animations under `reduce` — absent, not stilled.
- **Contrast.** "(Copilot suggestion)" attribution 6.19:1; AI-filled field values ~14:1
  against both stops of the tint gradient. The spotlight is not colour-only — the armed
  control carries a literal "Click" pill, and 24 other hotspots are `aria-disabled`.
- **ARIA structure.** Two live regions (`#pp-step` polite/atomic, `.pp-chat`
  polite/non-atomic), dialog with `role`/`aria-modal`/`aria-label`, and no button
  anywhere without an accessible name.
- **Chrome.** All four scenarios walk end to end at desktop and at 390px.

**Not done — both need a person at the machine:**

1. **VoiceOver.** The ARIA structure above is verified programmatically, which is not the
   same as listening to it. Worth checking specifically: that a pushed answer is actually
   announced from `.pp-chat`, and that the step counter's re-announcement on every beat is
   helpful rather than chatty.
2. **Safari and a real phone.** `safaridriver` is installed but refuses to start a session
   until **Safari → Settings → Developer → Allow Remote Automation** is ticked (or
   `safaridriver --enable`, which prompts for admin). A static portability audit found
   nothing at risk: the only notable features are `:has()`, `structuredClone`,
   `replaceChildren` and `scrollbar-width`, all supported well below the installed Safari
   26.5 — `scrollbar-width` needs 18.2 and degrades to a default scrollbar otherwise.

## Known open items

- ~~**B6**~~ — resolved (`5944ecd`). Both latency patterns are drawn, chosen from the
  settled view rather than a flag. Implementing it uncovered a live defect: the pause was
  not holding anything back in the dialog, because `[hidden]` is a bare attribute selector
  and `.pp-bubble-assistant { display: flex }` outranked it.
- **Deferred minor** — `textControl` (`shell.js`) and `previewControl` are near
  duplicates; collapse in a cleanup pass.
- **Deferred minor** — `let focusOnArm` is declared mid-file at `mount.js:168` rather
  than with the other bookkeeping around `:95-99`.
- **Deferred minor** — the `populate` deep-copy fix is correct but only the `push`
  branch has a dedicated aliasing regression test.
- **Unreviewed** — correction commits `f17e268` and `a782d1b` (copy-only) were folded
  into the final whole-branch review rather than reviewed separately.
- **`~/.zshrc`** had a duplicated PATH line; the edit was blocked by permissions.
  Fix with `sed -i '' '2d' ~/.zshrc` if desired. Cosmetic only.

## Reliability note for the next session

Seven subagents were lost mid-task to stalls, usage limits and dropped connections.
What worked: instructing implementers to COMMIT IN STAGES (inventory first, then
code). Every interruption after that cost minutes instead of a whole task. Keep doing
that, and re-verify repo state with `git log` / `git status` after any agent failure
rather than trusting a partial report.

## Recommended route for the remaining work (read before re-invoking the skill)

The first six tasks used full subagent-driven-development: implementer, reviewer,
fix round, scoped re-review — 3-5 agent round trips each. That was right while the
architecture was being decided, and it caught real defects (a test command that ran
zero tests, an aliasing bug that would have corrupted replay, lost inline bold in the
hero copy, a validator that could not fail).

**It is overkill for what remains.** Tasks 7c, 8, 9 and 10 repeat patterns that are
now established, and `scenarios.test.js` mechanically enforces most of what the
per-task reviewers were checking by hand: spotlights resolve to declared hotspots,
content keys resolve, `when` is present and valid, no orphaned content, emphasis
phrases unique. Re-reviewing those properties duplicates a test.

Suggested: **four dispatches, not fifteen.**

| Dispatch | Work | Model |
|---|---|---|
| A | Finish 7b's browser walk; build 7c (RoPA) using scenario 2.1 as an explicit template | Sonnet |
| B | Tasks 8 + 9 together — mobile reflow and the CTA band; small, independent, no Figma reads | Sonnet |
| C | Task 10 — accessibility, cross-browser, README, plus the deferred B6 in-pane latency card | Sonnet |
| D | One deep whole-branch review, explicitly including copy commits `f17e268` and `a782d1b` | Opus |

Also worth doing:

- **Verify in the browser ONCE, at the end, across all four scenarios** — rather than
  every agent re-walking all prior scenarios for regressions. The test suite catches
  data regressions; visual ones surface just as well in a single final pass.
- **Read Figma cheaply.** Scenario 2.1's extraction cost ~330k tokens, partly on full
  `get_design_context` where a screenshot would have done. Pull design context only
  for frames whose TEXT must be verbatim; use `get_screenshot` for everything else.
  If a frame is flattened raster, `download_assets` on the image node beats the
  cropped frame screenshot.
- **Skip the per-task ceremony** — brief extraction, review packages, per-task ledger
  entries. This document plus `git log` carries enough.

Trade-off, stated plainly: less review depth per task, concentrated into one thorough
review at the end. A defect introduced in 7c would surface at the end rather than
immediately. Given the remaining work is repetition guarded by a real test suite,
that is the right trade — but it is a trade.
