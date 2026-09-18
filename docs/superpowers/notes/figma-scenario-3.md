# Figma inventory — Scenario 3, Privacy Assessments ("Generate Data Inventory / RoPA")

**File:** `TlIT2Cy6DqGvN9kiODC9dz`, page `0:1`. Scenario card `1:67164`.
**Frames, in order:** `1:67565`, `1:67584`, `1:67760`, `1:67601`, `1:67629`.
**Prototype id:** `ropa`. **Product:** Privacy Assessments.

Read with `get_screenshot` on all five frames, then `get_design_context` only on the
subtrees whose text had to be verbatim — the whole-frame calls for `1:67760`, `1:67601`
and `1:67629` all exceed the response limit, so drilling is not optional. For `1:67629`
the useful split is `1:67661` (chat pane), `1:67684` (nav rail) and `1:67697` (the five
report blocks); the frame-level call returns a sparse tree that names them.

**Shape:** five frames, **three beats**. Frames 1→2→3 collapse into one beat exactly as
scenario 1's do — the loading frame is the `thinking` pause, not a beat.

**Entry point:** the **prompt bar**, not a risk card. Frame 2's breadcrumb reads *"How do
I document personal data in France"* and no chip on Frame 1 matches it, so the beat is
the user typing that query — the same reading, and the same ruling, as scenario 1.

**Visuals: nothing new to export.** Every candidate here is CSS-drawable, and the one
product mark on the suggested-action card is drawn by the existing `solutionBadge()`.
The judgments are listed at the bottom.

---

## Frame 1 — `1:67565` — Privacy Manager risk dashboard (a **third** variant)

Same hero, prompt bar and chip row as scenarios 1 and 2.1. The risk panel differs again:
a Tracker card carrying a pie chart, then a stacked card with **Subject Rights Requests**,
**Tracker Scanning** and **Privacy Risk Assessment** sections.

**Not reproduced — B1, as in scenario 2.2.** The prototype keeps scenario 2.1's dashboard
for the shared `risks` view. Reproducing a third variant would mean the `risks` view
changing shape depending on which tab you arrived from, which is a worse lie than showing
one consistent dashboard. Nothing in this scenario drills into a risk row, so no risk
hotspot is added.

**Click target that advances:** `#prompt-bar` (the scenario starts in the `home` view).

---

## Frame 2 — `1:67584` — "Generating response..." (timed loading)

Identical to scenario 1's loading frame: Priva mark, heading **"Generating response..."**,
body **"Copilot is searching across Priva solutions to generate a response and suggest
questions to help you get started."**, and a **"Stop generating"** button. Breadcrumb
reads the typed query.

**Not a beat.** Folds into beat 1 as `thinking: 1200`, reusing the `LOADING` copy already
in `mount.js`. No click target — it is timed.

---

## Frame 3 — `1:67760` — the answer page

Breadcrumb: **Privacy Manager** › **How do I document personal data in France**.

**Suggested topics rail** (left), verbatim, in order:

- Legal framework and authorities  ← selected
- Data principles and definitions
- Compliance requirements
- Specific considerations
- Enforcement and sanctions
- + Add topic

The selected item carries the refresh glyph; the rest carry the play glyph. This is
already what `renderToc` does.

**Answer heading:** Legal framework and authorities
**Prompt row:** Explain the legal considerations behind documenting personal data in France
**Sources label:** Sources · **citations:** `1 iclg.com`, `3 dw.com`

**Body**, verbatim (note the non-breaking spaces before the named acts, and the trailing
citation marker `1` on the last bullet):

> In France, documenting personal data involves adhering to specific legal requirements.
> Let's explore the key aspects:
>
> Relevant Legislation and Competent Authorities:
>
> - The General Data Protection Regulation (GDPR), effective since May 25, 2018, is the
>   principal data protection legislation in the EU.
> - In France, the French Data Protection Act (FDPA) has been in force since January 6,
>   1978. It was amended in 2018 to align with GDPR requirements under French law.
> - Other relevant legislation includes the ePrivacy Directive, which governs electronic
>   communications, and various regulations related to data processing, security, and
>   individual rights1

**Suggested-action card:** panel label **"Suggested actions"**; card header **"Privacy
Assessments"**; body **"Create a summary for processing activities in France"**; one
button **"Create processing activity summary"**.

**Disclaimer:** "AI-generated content may be incorrect. Use it for informational purposes
only and do not treat it as legal advice."

**Click target that advances:** the **"Compliance requirements"** topic in the rail.

---

## Frame 4 — `1:67601` — the answer page, a second topic generated

Selecting **Compliance requirements** swaps the answer body and the suggested-action card.
The rail keeps all six items; "Compliance requirements" now carries the selection bar, and
"Legal framework and authorities" keeps its refresh glyph (a generated topic keeps it).

**Body**, verbatim:

> Territorial Scope:
> - Both GDPR and FDPA apply to all sectors in France.
>
> Key Principles:
> - Data processing must be lawful, fair, and transparent.
> - Data minimization: Collect only necessary data.
> - Purpose limitation: Use data only for specified purposes.
> - Accuracy: Ensure data accuracy and update as needed.
> - Storage limitation: Retain data for the necessary period.
> - Security: Protect data against unauthorized access or breaches.
>
> Individual Rights:
> - Individuals have rights to access, rectify, erase, and restrict processing of their data.
> - They can also object to processing and request data portability.
>
> Registration Formalities and Prior Approval:
> - Organizations processing personal data may need to register with the French data
>   protection authority (CNIL).

**Suggested-action card — it changes here.** Panel label becomes **"Suggested Priva
tasks"**; card header becomes **"Priva Privacy Assessments"**; body becomes **"Create a
summary for processing activities in France using relevant assessments."** The button is
unchanged.

**Click target that advances:** **"Create processing activity summary"**.

---

## Frame 5 — `1:67629` — the RoPA dialog (terminal)

A Copilot dialog over the dimmed answer page. Header right: **"Open in Privacy
Assessments"** and a close button — the correct product for this dialog, unlike the
SRR dialog's mis-citation in scenario 2.1.

**Chat pane** (`1:67661`), verbatim. User bubble: **"Create an EU-GDPR processing activity
summary "** (trailing space in the source). Assistant reply:

> For an EU-GDPR data inventory the following fields will be included:
>
> - Processing Activity
> - Department
> - Name of Asset
> - Asset Internal Contact
> - Categories of personal data
> - Third party transfer categories (1 or more)
> - Data boundary involved
> - Data Retention (highest for group)
> - Lawful basis of processing (1 or more may apply)

Footer: "AI-generated content may be incorrect." and a "Show process" row. The input
placeholder reads "Ask a question or describe what you'd like to do in Privacy manager."
A **"Some suggested prompt"** chip sits above the input.

**Report title:** France Processing Activity Summary – April 3/2024

**Nav rail** (`1:67684`) — nine subway steps, verbatim, all with filled green markers:

1: Processing activity summary · 2: Department · 3: Name of assets ·
4: Asset internal contacts · 5: Categories of personal data ·
6: Third party transfer categories · 7: Data boundary · 8: Data retention ·
9: Lawful basis of processing

**Report body** (`1:67697`) — the rail promises nine sections; **only five are authored**,
and three of the five share one answer. Each block is a number, a heading, an answer, and
a `Risk level: Low – Sensitive data` pill.

| # | Heading (as designed) | Answer (as designed) |
|---|---|---|
| 1 | Processing activity | "Employee data is collected and processed for the purposes of employee payroll, health & benefits processing, and internal surveys. Partner data is collected for the purposes of providing services to customers and for billing purposes. Customer data is collected and processed for business needs such as to track active orders, process payments or refunds, and troubleshoot order issues with support teams. Customer data is collected with consent to send promotional emails, inform customers of relevant product updates or news, and to share with affiliates based on selected preferences." |
| 2 | Department | "Marketing, HR-Payroll, HR-Records mgmt, Order fulfillment, Billing, Product promotions team, Customer care support" |
| 3 | **Name of asssts** | "Workpay, CRM tool, Sellingforce, TrackShip, PaymentApp, CampaignMgr, SupportTktSystem" |
| 4 | Asset internal contacts | *same string as #3* |
| 5 | **Categories  of personal data** (double space) | *same string as #3* |

**Terminal.** Frame 5 has no onward frame. "Open in Privacy Assessments" is drawn but
never armed, the same call as scenario 2.1's email-card glyph and 2.2's open glyph.

---

## Rulings taken in this scenario

**R1 — Frames 4 and 5 of the report are not reproduced.** Blocks 4 and 5 repeat block 3's
answer verbatim: "Asset internal contacts" and "Categories of personal data" are both
filled with the *asset list*. That is unfinished filler, not content. Inventing plausible
contacts or data categories is exactly the move the project has refused everywhere else,
so the prototype renders blocks **1–3** and clips there — which is also close to what the
frame itself shows, since the dialog clips mid-block-4. The nav rail still lists all nine
steps verbatim, because that is a real design artifact. Recorded rather than papered over.

**R2 — "Name of asssts" is corrected to "Name of assets".** Confirmed against two other
places in the same frame: nav item 3 reads "3: Name of assets", and the chat pane's field
list reads "Name of Asset". A three-way disagreement where two agree is a confirmed slip.

**R3 — "Lawful basis of processing (1 or more may apply" gains its closing bracket.** The
parenthesis is unbalanced in the source string itself, which is confirmable without
reference to any other frame. Compare the sibling bullet "Third party transfer categories
(1 or more)", which closes correctly.

**R4 — "Categories  of personal data" (double space) is not an issue here** because block
5 is not reproduced (R1). Recorded so the next reader does not re-derive it.

**R5 — The suggested-actions panel label stays "Suggested actions".** Frame 4 alone calls
it "Suggested Priva tasks"; Frames 3, and every frame of scenarios 1, 2.1 and 2.2, call it
"Suggested actions". It is a shared string (`COPY.suggestedActions`), so this follows
ruling 10 — the source flips a label, the prototype picks the one it uses everywhere else.

**R6 — The card's own header change IS reproduced.** "Privacy Assessments" → "Priva
Privacy Assessments" between frames 3 and 4 is a visible, per-card difference, and the
"Priva " prefix matches the convention already in the data ("Priva Consent Management",
"Priva Tracker Scanning"). Frame 3's bare form is the outlier but it is what that frame
shows, so both states are authored and the beat swaps them.

**R7 — The placeholder chip is omitted.** "Some suggested prompt" is a placeholder, same
call as ruling 7 in scenarios 1 and 2.1.

**R8 — "Privacy manager" in the dialog's input placeholder renders as "Privacy Manager"**,
per the prototype-wide ruling 10. It already does; the shared string is reused unchanged.

---

## Ambiguities left alone

**B14 — Frame 4's answer heading does not follow the selected topic.** The rail selection
moves to "Compliance requirements" and the body swaps to compliance content, but the 20px
heading still reads **"Legal framework and authorities"** (confirmed in the node, not just
the render). Two readings are available and neither can be confirmed from the frames: the
heading is the answer's overall title and is *meant* to stay, or it was simply not
updated. Following the project's own precedent on suspected slips, **the prototype
reproduces it as designed.** Flagged because it is the one place in this scenario where
faithfulness and "looks correct to a visitor" pull in opposite directions — reversing it
is one string in `scenarios.js` if that is the call.

**B15 — the report claims nine sections and delivers five.** See R1. Not corrected in
either direction: the rail is verbatim, the body stops where the authored content stops.

---

## Assets

| Candidate | Frame | Judgment |
|---|---|---|
| Privacy Assessments product mark on the action card | 3, 4 | CSS — the existing `solutionBadge()` already draws this slot for every scenario |
| Subway nav markers (filled circles, `#0E700E`) | 5 | CSS — a filled circle and a 2px connector line |
| Risk pill (`Risk level: Low – Sensitive data`) | 5 | CSS — `rgba(159,216,159,0.2)` fill, `rgba(14,112,14,0.6)` border, `#0E700E` text |
| Topic rail play / refresh glyphs | 3, 4 | CSS/icon — already drawn by `glyph()` |
| Pie chart, solution glyphs | 1 | CSS — and not rendered at all; B1 keeps scenario 2.1's dashboard |
| Copilot mark, Priva mark | all | Reused (`assets/5135989b34f7.svg`, `assets/5abed2089d2b.svg`) |
| Chat pane, latency card, dialog chrome | 2, 5 | Reused from scenarios 1 and 2.1 |

**Nothing new was exported for this scenario.**

---

## Browser walk (verification)

Walked in headless Chrome over CDP with `docs/superpowers/tools/walk-prototype.mjs`,
clicking only `.is-spotlit`. All three beats advance, exactly one spotlight is armed
before each click (`#prompt-bar` → `#toc-topic` → `#create-summary-button`), the query
types into the prompt bar in the `home` view and the dialog prompt into
`#copilot-chat-input` in the `dialog` view its `when: 'after'` names, and the run ends
in the terminal state — no spotlight armed, completion panel shown. No page errors.
Scenarios 1, 2.1 and 2.2 were re-walked and are unchanged.

Frames 3, 4 and 5 were also compared against the design by screenshot, which is what
turned up the four defects below — none of them is the kind of thing the test suite can
see.

**Four fidelity defects found by looking, and fixed:**

1. **The dialog's assistant reply lost its bullets.** Authored as `\n- ` inside `text`,
   which `renderRichText` understands but the chat pane's `renderAssistantCard` does
   not — it renders `text` as one paragraph. Re-authored using the `bullets` array the
   pane already supports.
2. **The report blocks lost their numbers.** `.pp-canvas ol { list-style: none }` is the
   reset and it outranks a bare class selector. Moved the rule onto the `li`, which is
   how `.pp-bubble-steps` already does it.
3. **The typed prompt showed twice.** With `when: 'after'` the beat's draw has already
   rendered the user's bubble before the typing animation runs, so the settled frame
   left the same sentence in the composer *and* in the transcript. The last bubble is
   now held back during the animation and the composer cleared when it finishes — which
   is the order sending a message actually happens in. Scenarios 1 and 2.2 hid this
   because a later beat's redraw cleared the composer; scenario 3's typing beat is
   terminal, so nothing came along to clean up after it.
4. **The topic rail's glyph rule was wrong.** It gave the refresh glyph to the *selected*
   topic; frame `1:67601` gives it to every *generated* topic and selects only one of
   them. Selection and generation are now separate, with the generated list defaulting
   to the selected item so scenarios 1 and 2.1 are unaffected.

Defect 3 was a pre-existing bug in the shared mount, not something this scenario
introduced — it was simply never visible until a scenario ended on a typing beat.
