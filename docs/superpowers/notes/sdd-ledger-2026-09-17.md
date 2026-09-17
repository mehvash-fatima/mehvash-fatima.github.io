# SDD ledger — plan: docs/superpowers/plans/2026-09-15-copilot-prototype.md

Spec: docs/superpowers/specs/2026-09-15-copilot-prototype-design.md (read)
Branch: copilot-prototype (not main; user consented to implementation)

## Pre-flight conflict scan

| Check | Produces -> Consumes | Finding |
|---|---|---|
| T2 -> T3, T5, T6 | `initialState`/`applyBeat`/`stateAt` | Names and arities agree across all three consumers. Clean. |
| T3 -> T5, T6 | `SCENARIOS`, `CONTENT` | Both named consistently everywhere. Clean. |
| T4 -> T5 | `HOTSPOTS` map | T5 reads values as `#`-prefixed selectors; T4 declares them `#`-prefixed. Clean. |
| T4 -> T6 | `render(state)` -> DocumentFragment | T6 uses `root.replaceChildren(render(state))`. Clean. |
| T4 -> T6 | hotspot ids | T4 strips `#` when setting element id; T6 queries with `#`. Clean. |
| T1 -> T3, T4 | Figma content inventory | T3 copy and T4 tokens both sourced from it. Ordering correct. |
| T6 -> T8 | `fitCanvas(root)` | T8 restates the whole function; no partial-edit ambiguity. Clean. |
| T7 -> T4, T5 | new views extend `HOTSPOTS` | T7 requires shell + registry edited in the same commit. Clean. |
| T2 self | tests vs implementation | "reset returns exactly the initial state" was near-vacuous — strengthened (see Ruling 2). |
| T2/T3/T4/T5/T10 self | test command vs environment | **CONFLICT** — see Ruling 1. |
| T9 self | files created vs touched | Touches only case-study-02-copilot.html. Clean. |

## Rulings

Ruling 1: No Node runtime exists on this machine (`node`, `npm`, `nvm`, `deno`,
`bun` all absent; only Python 3.9). The plan's Global Constraints mandate
`node --test assets/prototype/`, which cannot run here, and tests that cannot
run are worth nothing. Installing Node is a side effect outside the repo that
norms say to ask about first. Decision: keep the spec's binding intent —
dependency-free automated tests — and change the mechanism. A ~40-line
`testkit.js` provides the `test()` / `assert` subset the test files already use,
and `tests.html` runs the suite in the browser against the same
`python3 -m http.server` the site already uses. Test files keep their existing
shape and assertions. Cost if wrong: the suite runs in a browser tab rather
than a terminal, so it cannot gate CI without a later swap back to
`node --test`, which is a mechanical change to import lines only.

Ruling 2: Task 2's "reset returns exactly the initial state" test asserted
almost nothing (it compared a pure function to itself). Strengthened to advance
the scenario first, then assert the rebuilt initial state differs from the
advanced state and equals the original. Cost if wrong: none; a stricter test.

## Execution

Task 1: dispatched (Figma extraction, sonnet), BASE 42375ba

Ruling 1 SUPERSEDED by user instruction ("install node"). Node v24.21.0 (current
LTS) installed user-locally at ~/.local/node-v24.21.0, symlinked into
~/.local/bin, which was already on PATH. No sudo, nothing outside $HOME.
Homebrew was tried first and refused — /opt/homebrew is not writable by this
user and fixing it needs `sudo chown -R`, which was not run. Browser-harness
commit 42375ba reverted (9137131); plan and spec are back to `node --test`.
Ruling 2 (strengthened reset test) re-applied on top in c910619.
New BASE for Task 1 review: c910619.

Task 1: DONE (commit 64f8fc6), review dispatched. Inventory at
docs/superpowers/notes/figma-scenario-1.md, 9 frames + 3 shared components,
5 assets exported. Implementer flagged 7 ambiguities; rulings below.

Ruling 3 (A1 — Frame 1->2 has no matching click target; Frame 2's breadcrumb
query matches none of Frame 1's chips). Take the implementer's option (b): the
opening beat is the user typing the query into the prompt bar and sending it.
The query text is taken verbatim from Frame 2's breadcrumb, so nothing is
invented, and it exercises the typing animation the spec already specifies.
Cost if wrong: the demo opens with typing rather than a chip click; the
Regulations chip stays as the design authored it.

Ruling 4 (A2 — Frame 2->3 is a timed loading state with no click target). Do
not add a new beat vocabulary word. Frame 2 folds into the opening beat as its
`thinking` pause, which is exactly what `thinking` was specified for, with the
Priva logo treatment from Frame 2. Cost if wrong: none material.

Ruling 5 (A7 — Frame 9 is terminal; its "Open" button leads nowhere). The last
beat arms no spotlight; the engine already handles this (`if (!beat) return`).
Task 6 adds a visible "Scenario complete" state with Reset. The "Open" button
renders inert. Cost if wrong: a recruiter clicks "Open" and nothing happens,
which the completion state should make obviously intentional.

Ruling 6 (A6 — Frame 7's "Opt out" and "Save button" values look swapped and
contradict the chat pane's own summary). Use the chat pane's values ("Opt out",
"Save"). The design contains two conflicting sources; the chat pane is the
self-consistent one, and shipping "Opt out: United States" in a portfolio piece
reads as the designer's error rather than the source file's. Cost if wrong:
two wizard field values differ from one frame of the Figma.

Ruling 7 (A5 — Frames 6-7 reuse step 1's headings for the Link and Preferences
steps). Correct the two headings to describe their actual step. Same reasoning
as Ruling 6: faithfully reproducing a copy-paste slip makes the designer look
careless to the audience this artifact exists to persuade. Cost if wrong: two
headings differ from the Figma; the inventory records what the design said.

Ruling 8 (A4 — "Some suggested prompt" is literal unfinished placeholder copy
on an inert chip). Omit those chips from the prototype rather than ship
placeholder text or invent replacement prompts. They are decorative and carry
no beat. Cost if wrong: frames 4-8 show one fewer inert chip than the design.

Ruling 9 (composite Copilot sidecar icon was not flattened; a simpler flat mark
was exported instead). Accept the flat SVG. Re-exporting a 5-part composite for
a 24px mark is not worth a session. Cost if wrong: a 24px icon is slightly
simpler than the design's.

Task 1: minor (deferred): inventory says the two .svg exports "match existing
.svg convention in assets/" — no pre-existing .svg files there. Wording only;
12-hex naming rule is satisfied.
Task 1: complete (commits c910619..64f8fc6, review clean)
Task 2: dispatched (engine + tests, haiku — plan carries complete code), BASE 64f8fc6
Task 2: DONE (commit d057744, 8/8 passing), review dispatched.

Ruling 10 (Task 2 review, Critical): the plan's own test command was wrong.
`node --test assets/prototype/` runs ZERO tests on Node 24 and reports a
spurious failure; verified directly. Bare `node --test` from the repo root finds
and passes all 8. Plan corrected in 5e1ecd7 (7 occurrences) — this was a plan
defect, not a code defect, so no implementer round was spent on it. Cost if
wrong: none; both working forms were verified before choosing.

Task 2: minor (deferred): implementer's report claimed 127 lines for each file;
actual diff is 54 and 73. Correction requested with the fix round.
Task 2: fix round 1/5 dispatched — deep-copy content on push/populate
(structuredClone) and guard `set` against clobbering scenarioId/beatIndex/chat,
plus one covering test each.
Task 2: fix round 1/5 complete (commit 2c0c086, 10/10 passing); scoped re-review dispatched.
Task 2: minor (deferred): Finding 1's populate-branch aliasing fix is correct by
inspection but has no dedicated regression test (only the push branch is
covered). Surface to the final whole-branch review.
Task 2: complete (commits 64f8fc6..2c0c086, re-review clean)
Task 3: dispatched (scenario 1 as data, sonnet), BASE 2c0c086
Task 3: DONE (commit 1c5174c, 255-line data file, 7 beats), review dispatched.
Interface additions Task 4 MUST honour: spotlight ids #copilot-chat-input,
#generate-draft-button, #wizard-next, #wizard-save-close; new presentational
state key `actionCard` (set via `set`, same pattern as `view`).
Task 3: minor (deferred): `set` never calls lookup(), so a typo'd `actionCard`
value fails silently where content keys throw. Fold a value check into Task 5's
validator; surface to final review if not done there.
Task 3: forward note for Task 6: beat 2 types into #copilot-chat-input while its
spotlight is #generate-draft-button and `view` only becomes 'dialog' at the same
settle — the renderer must sequence dialog-open BEFORE the typing animation.
Task 3: complete (commits 2c0c086..1c5174c, review clean)
Task 4: dispatched (shell + HOTSPOTS + desktop CSS, opus), BASE 1c5174c
Task 4: INTERRUPTED by session usage limit mid-task (no commit, no report).
shell.js was left complete-looking but uncommitted (959 lines, both exports,
no listener/innerHTML violations); prototype.css not started. Agent resumed
rather than re-dispatched, to keep the Figma/token context it had gathered.
Task 4: DONE after resume (commit 0144ce4; shell.js 959 lines + prototype.css
1741 lines). Implementer verified all nine frames in headless Chrome against
fresh Figma screenshots and fixed three visual defects pre-commit. Review
dispatched (opus — visual fidelity is the project's biggest risk).
HOTSPOTS: home ['#prompt-bar'], answer ['#generate-draft-button'],
dialog ['#copilot-chat-input', '#wizard-next', '#wizard-save-close'].
Task 4: forward note for Task 6: beat 1 types into #prompt-bar while the same
beat flips view to 'answer', which does not render it. Type BEFORE switching
views. Same hazard as the beat-2 note from Task 3.
Task 4: open concern to rule on after review: engine `populate` discards wizard
step/heading metadata, so shell recovers the stepper by matching field-id
signatures back to CONTENT. Fragile; likely a one-line engine fix. Task 7 adds
three more scenarios with wizards, so this compounds if left.
Task 4 review: spec ✅, visual fidelity ✅ (dialog geometry within 0.4% of
Figma; registry rule verified with zero duplicated id literals), quality
"changes needed".

Ruling 11: the fix round authorises editing engine.js and scenarios.js — files
owned by Tasks 2 and 3 — because the WIZARD_BY_SIGNATURE fragility and the lost
inline bold can only be fixed properly at their source. Reviewer verified no
existing test asserts the narrow wizard shape, so the engine change is safe.
Cost if wrong: two earlier tasks' files carry changes their own reviews did not
see; the scoped re-review covers this diff.

Ruling 12: fixing all four "Minor" visual divergences (home spacing, card width
and fill, Priva mark, gear glyph) rather than deferring them. Visual fidelity is
this artifact's entire purpose, and each is a small localised change. Cost if
wrong: a slightly larger fix diff.

Task 4: minor (deferred): textControl (shell.js:561-571) and previewControl
(shell.js:657-670) are near-duplicates; collapse in a later cleanup pass.
Explicitly told the implementer NOT to fix it now, to keep the diff reviewable.
Task 4: fix round 1/5 dispatched — 4 Important (wizard metadata, inline bold,
rgba literals, HOTSPOTS/TYPING_TARGETS split) + 4 visual minors.
Task 4: fix round 1/5 complete (commit 9a15f19, 12/12 passing; 5 findings fixed,
finding 6 correctly left deferred). Scoped re-review dispatched.
Task 4: forward note for Task 5 validator: assert each `emphasis` phrase occurs
EXACTLY ONCE in its own `text` string. Emphasis matching is indexOf-based, so a
repeated phrase would bold every occurrence. Harmless in scenario 1; Task 7's
copy could trip it.
Task 4: forward note for Task 6: the wizard edit handler must keep spreading
`state.wizard` so the newly preserved step/heading metadata survives an edit.
Task 4: complete (commits 1c5174c..9a15f19, re-review clean — all 5 findings
addressed, finding 6 correctly untouched, 12/12 passing)
Task 5: dispatched (scenario validator, sonnet), BASE 9a15f19
Task 5: DONE (commit 147b42e, 21/21 = 12 engine + 9 validator). All three
deliberate breaks produced correct specific failures and were reverted clean.
Two deviations reported: orphan test also counts `set`-clause content refs;
`type.into` check accepts EITHER pre- or post-transition view. Review dispatched
with the second flagged for hardest scrutiny (accepting either view halves the
check's strength).
Task 5 review: spec ✅, rigour "changes needed" (1 Important). Reviewer PROVED
the type.into OR-check weakness empirically: planted a wrong-view target,
suite still passed 21/21, then reverted clean.

Ruling 13: rather than accept the blind spot, add the missing intent to the
data. Beats gain `type.when: 'before' | 'after'`, naming which side of the
transition the typing happens on, and check (C) tightens to that one view. This
also replaces the renderer-sequencing hazard that Tasks 3 and 4 each flagged
separately — Task 6 now reads the order from data instead of inferring it.
Authorises editing scenarios.js, which Task 5's brief forbade. `when` is inert
to engine.js (verified by the implementer, engine reads only into/text).
Cost if wrong: one extra field per type clause, and Task 6 must honour it.
Task 5: fix round 1/5 dispatched.
Task 5: fix round 1/5 complete (commit e718435, 22/22); re-review clean —
perturbations independently reproduced, `when` values verified semantically
correct against the Figma notes, text strings unmodified, engine untouched.
Task 5: complete (commits 9a15f19..e718435, re-review clean)
Task 6: dispatched (mount.js + standalone page, opus), BASE e718435
Task 6: first dispatch STALLED (watchdog, 600s no progress) before producing
anything — tree verified clean, 22/22 still green, nothing to recover.
Re-dispatched fresh on opus with an added instruction to work incrementally and
commit in stages, so a second stall cannot cost the whole task.
Task 6: retry hit the session usage limit mid-verification, but the incremental
-commit instruction worked: commit 68db0d4 landed with mount.js (396 lines) and
prototype-copilot.html, tree clean, 22/22 green. Agent resumed to finish the
walkthrough verification, close any unimplemented bullets (fast-forward guard
and focus management look absent by grep), and write the report.
Task 6: DONE (commits 68db0d4 + e5a50d4; mount.js 416 lines, page 359 lines,
+79 CSS). Implementer drove headless Chrome over CDP: full 7-beat walk, `when`
confirmed mid-animation, reduced-motion settles at 0ms with no beat skipped,
5 synchronous clicks = 1 advance, real 283s idle test, no h-scrollbar at six
widths, Enter/Space each advance once. Two browser-found fixes in e5a50d4.
Grep miss resolved: the fast-forward guard is `inFlight.skip()` — naming, not
absence. TYPING_TARGETS intentionally unused at runtime (a test already proves
membership). Hidden-tab idle verified via a document.hidden shim — flagged.
Review dispatched (opus) aimed at the ADVERSARIAL paths the implementer did not
try: Previous at beat 0, Next past the end, Reset mid-animation, edit-then-
navigate, resize mid-animation, Reset/spotlight alternation.
Task 6 review: spec ✅, adversarial ✅ (every probe correct, zero console
exceptions, no ghost writes after reset), quality ✅. runToken + shared
stepTimer held under every cancellation race the reviewer could construct.
Nav/footer byte-identical to case-study-02 apart from justified omissions.
Task 6: minor (deferred -> folded into Task 7): the layout step's radios
(pp-layout-choice) carry no data-field-id, so mount's input handler ignores
them; clicking a layout thumbnail visibly selects then snaps back on next draw.
Visible to a curious recruiter. Fix is in shell.js, which Task 7 already edits.
Task 6: minor (deferred): `let focusOnArm` declared mid-file at mount.js:168
rather than with the other bookkeeping at :95-99.
Task 6: complete (commits e718435..e5a50d4, review clean)

Ruling 14: split plan Task 7 (three scenarios in one task) into three separate
dispatches, 7a SRR / 7b Tracker Scanning / 7c RoPA. Each still ends in its own
commit and its own review, as the plan's own step structure intended. Reason:
two agents have now been lost mid-task to a stall and a usage limit, and a
single dispatch covering three Figma extractions plus three sets of shell views
is the largest remaining blast radius in the plan. Cost if wrong: three review
cycles instead of one, for work the plan already described as independently
committable.
Task 7a: DONE (commits 01d075f inventory + ac40b02 code; +2016 lines across
inventory, scenarios.js, shell.js, prototype.css). 4 beats, walks clean in
headless Chrome, 22/22 still passing, scenario 1 still walks its 7 beats.
Layout-radio fix (Task 6 deferred minor) required reshaping scenario 1's
`wizard-layout` into one field with three options — adding data-field-id alone
would have overwritten each card's description text. Regression risk to
scenario 1; review told to walk it in a browser.
Task 7a concerns to rule on after review:
 - Frame 1:92886 has NO text layers (two flattened PNGs). Copy transcribed by
   reading a raster; cannot be checked against text layers. Implementer declined
   to export the outer raster, describing it as a 1.7MB image of an UNRELATED
   PERSONAL MAILBOX. Review must confirm no personal data reached the inventory,
   the scenario data, or any asset — this publishes to a public site.
 - Design's in-pane latency card not implemented (mount.js owns it, out of
   scope). Possible visible gap.
 - Eleven suspected source-design bugs B1-B11 carried verbatim and flagged
   (SRR count 6 vs 15, a Privacy Assessments citation on an SRR answer, an
   "Open in Consent Management" button in an SRR dialog, a pre-truncated status
   string). Reviewer asked to adjudicate each as real bug vs transcription error
   before I rule, since Rulings 6/7 established that obvious slips get corrected.

Ruling 15: redacted the identifying details (account address, three message
subject lines) that the SRR inventory recorded while justifying its decision not
to export a flattened screenshot. The repo is PUBLIC (serves mehvash.com), so a
committed note publishes them as surely as an exported asset would. The
reasoning stays; the specifics are gone. Verified no other file carries them.
Nothing had been pushed — branch is local-only — so there was no exposure.
Cost if wrong: a later session cannot see exactly what was in that raster; the
frame id (1:92886) is recorded, so it can be re-examined in Figma directly.
Task 7a: first review dispatch died to the session limit before reading
anything. Re-dispatched on sonnet with a trimmed scope — the controller had
already verified the personal-data question directly (no images exported, only
kat@contoso.com present, identifying details redacted in e63667c), so that
section was removed from the reviewer's brief rather than paid for twice.
Task 7a review: second dispatch died to ECONNRESET after completing reading and
static analysis, at the point of writing its CDP driver. Resumed with a
priority-ordered remainder (browser walk + layout-radio regression first, the
B1-B11 adjudication second, flattened-frame transcription last) and explicit
permission to label sections unverified rather than guess. Three infrastructure
failures on this one review so far: limit, limit, ECONNRESET.
Task 7a review (third dispatch, resumed): A ✅ spec, B transcription accurate
(checked against the uncompressed 2076x2742 source raster, not the cropped
frame screenshot — zero divergences), C ✅ quality. Layout-radio fix verified
live: selection sticks, data-source flips ai->user on that card only, scenario 1
still walks 7 beats to its terminal state. No Critical/Important findings.
Task 7a: complete (commits e5a50d4..e63667c, review clean)

Ruling 16: act on the SIX independently confirmed source-design bugs only —
B1 (Privacy Manager / Privacy manager case flip), B2 (a Privacy Assessments
citation on an SRR answer), B3 ("Open in Consent Management" in an SRR dialog),
B7 (SRR count 6 vs 15; deadline "15 days" vs "2 weeks"), B9 (Philips vs
Phillips), B11. These follow Rulings 6/7: a portfolio viewer reads a source
slip as the designer's own mistake. B4 (pre-truncated status) and B8 (icon
mismatch) were explicitly NOT verified by the reviewer and are left exactly as
the design has them — correcting an unconfirmed "bug" would inject an error.
B5/B10 were plausible but not exhaustively traced; left alone for the same
reason. Cost if wrong: six strings differ from the Figma, each recorded in the
inventory with what the design actually said.

Ruling 17: B6 (the design's small in-pane latency card, vs the full-page card
currently shown) is deferred to Task 10's polish pass — it needs mount.js,
which Task 7a was correctly scoped out of. Cost if wrong: one pause renders
with the wrong card size until Task 10.
Task 7a corrections: commit f17e268 — six confirmed source-design slips
corrected (B1 casing, B2 citation -> Subject Rights Requests, B3 dialog button
-> Open in Subject Rights Requests, B7 reconciled to 15/"15 days", B9 Daisy
Phillips, B11 evidence upgraded). B4/B5/B6/B8/B10 confirmed byte-identical.
22/22 passing; both scenarios walk clean.

Ruling 18: B1's fix was scoped to scenario 2.1 only, which left shell.js
rendering BOTH "Privacy Manager" (lines 92,125,129,132,529) and "Privacy
manager" (81,110,126,129,885) — half-corrected is worse than either, and the
scenario-1 inventory shows the source mixes casings there too. Unifying on the
title-case product name across every rendered occurrence in both scenarios, with
a note added to BOTH inventories. Implementer instructed to check each
occurrence is genuinely the product name rather than blind-replacing. Cost if
wrong: the prototype names the product more consistently than the Figma does,
recorded in both inventories.
Task 7a corrections round 2: commit a782d1b — casing unified prototype-wide,
both inventories annotated. Controller verified independently: 5 title-case
occurrences render, the 2 remaining lower-case hits are explanatory COMMENTS at
shell.js:82 and :120, not rendered strings. 22/22 passing.

Ruling 19: the two correction commits (f17e268, a782d1b) get their independent
review folded into the FINAL whole-branch review rather than a separate scoped
re-review now. They are copy-only changes, already browser-verified by the
implementer across both scenarios, covered by the 22-test suite, and
spot-checked by the controller. Six agent failures so far (2 stalls, 3 usage
limits, 1 ECONNRESET) make an extra review cycle the wrong place to spend
remaining budget. The final reviewer will be pointed at these commits
explicitly. Cost if wrong: copy corrections reach the final review unreviewed
rather than being caught one cycle earlier.
Task 7b: dispatched (Tracker Scanning scenario, opus), BASE a782d1b
Task 7b: ECONNRESET mid-task (seventh agent loss). Staged commits held again —
inventory safe at 837bfd3; scenarios.js/shell.js/prototype.css edits and one new
asset (f4e216c68090.svg) uncommitted. 22/22 still passing, which given the
validator iterates every scenario means the tracker data already validates.
Resumed at the shell.js step, with the new SVG's CSS-drawable justification
added to its checklist.
