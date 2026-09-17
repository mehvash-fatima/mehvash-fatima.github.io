# Copilot Privacy Manager prototype — handoff

**Last session ended:** 2026-09-17, mid Task 7b.
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
| **7b — Tracker Scanning (2.2)** | **IN PROGRESS — see below** |
| 7c — RoPA / Privacy Assessments (3) | Not started |
| 8 — Mobile reflow below 768px | Not started |
| 9 — CTA band in case study 02 | Not started |
| 10 — Accessibility + cross-browser + README | Not started |

### What works today

`prototype-copilot.html` runs scenarios 1 and 2.1 end to end: guided spotlights,
character-by-character typing, a thinking pause with the latency card, genuinely
editable Copilot-suggested wizard fields whose badge drops when a human edits them,
Reset, Previous (by replay), a step indicator, and a 90-second idle auto-reset that
pauses while the tab is hidden. Desktop only so far — the canvas scales by transform.

### Task 7b, exactly where it stands

- `837bfd3` — inventory committed: `docs/superpowers/notes/figma-scenario-2-2.md` (5 frames)
- `a8ab00b` — WIP code committed: tracker data, renderers, CSS, one new SVG asset

All four modules parse; 22/22 tests pass, so the tracker data already satisfies the
validator. Three beats are authored with spotlights `#tracker-risk-card`,
`#review-scan-button`, `#chat-suggestion`; `HOTSPOTS` now has a `risks` view.

**Remaining for 7b:**
1. Browser-walk scenario 2.2 over CDP — every beat advances, exactly one spotlight
   at a time, typing lands in the view each `when` names, terminal state reached.
2. Regression-walk scenarios 1 (7 beats) and 2.1 (4 beats) — shared files were edited.
3. Justify `assets/f4e216c68090.svg` (referenced at `shell.js:1465`): confirm it is a
   genuine logo/mark and not something CSS should draw. If CSS-drawable, delete and
   rebuild in CSS.
4. Then a task review, per the plan's process.

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

## Known open items

- **B6** — the design shows a small in-pane latency card; the prototype shows the
  full-page one. Needs `mount.js`; deferred to Task 10.
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
