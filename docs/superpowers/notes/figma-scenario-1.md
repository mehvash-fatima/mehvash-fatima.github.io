# Figma content inventory — Scenario 1: "Summarize Consent Laws + Create Draft Model" (Consent Management)

Source file: `TlIT2Cy6DqGvN9kiODC9dz` (Figma). Read via `mcp__plugin_figma_figma__get_design_context` /
`get_screenshot` / `get_metadata`, `figma-design-to-code` skill loaded first per requirement.

Frames are listed in flow order (1–9). Node IDs are exactly as given in the task brief.

---

## Global chrome (identical across all 9 frames — documented once, not repeated per frame)

- Browser window: tab band, Windows caption controls, address bar. Tab title "Microsoft Priva".
  Address bar text (verbatim, three text runs): `https://` + `purview.microsoft.com` (black) + `/fabrikam/en-us/`.
- Priva suite header (dark blue bar): "Microsoft Priva" + "Preview" pill badge, waffle/grid icon,
  right-side action icons (megaphone, alert bell, gear, question mark, person-feedback), persona avatar.
- Page header (on the answer/output pages): "Back" button, page title "Privacy manager", breadcrumb
  query text, edit-pencil icon, Copilot logo icon, and (while loading) a gradient progress bar.
  **Corrected to title-case "Privacy Manager" in the prototype — see Ambiguity B1 below.**
- Disclaimer line reused verbatim in several places: **"AI-generated content may be incorrect. Use it
  for informational purposes only and do not treat it as legal advice."**

**Visuals:** all CSS-buildable (rectangles, text, flex layout). Icons (search, send, attach, thumbs
up/down, chevrons, gear, bell, question mark, megaphone, waffle grid, edit pencil, dismiss X,
open/external-link, sparkle, "Person Square Checkmark") are small monochrome Fluent glyphs — build with
an icon font or inline SVG, not exported as raster images. Microsoft favicon (4 colored squares in the
browser tab) — CSS-buildable (four flat-color squares). Persona/profile avatar (generic "Subtract"
silhouette shape + presence-badge dot) — CSS-buildable (plain circle/icon, not a real photo).

**Copilot logo** (rainbow product mark) recurs in the search box, page header, and dialog sidecar title.
It is a genuine brand mark with a gradient fill, not trivially redrawable in CSS — **needs export**.
Exported one representative (28px) instance: `assets/5135989b34f7.svg`.
The dialog sidecar header (frames 4–8) uses a different, more complex composite render of the same mark
(built from 4 separate quarter-shapes plus a soft-light gradient overlay, 5 image parts in the Figma
JSON) — this composite was **not** flattened/exported in this session; see Ambiguities below.

**Priva logo** (colorful abstract mark shown centered during the loading state in Frame 2) — brand mark,
**needs export**. Exported: `assets/5abed2089d2b.svg` (48px).

---

## Frame 1 — `1:67292` ("2190")

**Changes from previous:** n/a (entry point — Priva Home / Privacy Manager landing page).
**Click target:** ambiguous — see Ambiguities note A1 below. No visible suggestion chip's text matches
the query that appears in Frame 2's breadcrumb.
**Copy (verbatim):**
- Title: "Privacy manager " (note: trailing space present in the design layer's text content) —
  **corrected to "Privacy Manager" in the prototype, see Ambiguity B1**
- Subtitle: "Manage your organization's privacy posture with the help of AI. " + link "Learn more" (with
  an external-link glyph after it)
- Search placeholder: "Ask me anything about privacy..."
- Suggestion cards (category label in blue, then body text):
  1. "Summarize" — "Summarize the top 5 privacy compliance issues across all Priva solutions"
  2. "Find" — "Show me the past due Privacy Assessments where there is highly sensitive data"
  3. "Find" — "Show me the list of websites with uncategorized trackers in most to least order"
  4. "Regulations" — "What are the cookie consent regulations for websites in the EU?"
  5. "Learn more" — "Summarize the capabilities of Privacy Manager" (wraps as "Summarize the
     capabilities of␊Privacy Manager" — a hard line break in the design, transcribed as one sentence)
- Disclaimer: "AI-generated content may be incorrect. Use it for informational purposes only and do not
  treat it as legal advice."
- Back link: "Priva Home"
**Visuals:** all CSS-buildable — cards, pills, disclaimer row. Decorative radial-gradient blob behind the
suggestion cards ("Bento" background) — CSS-buildable (`radial-gradient`). Search-box Copilot icon —
see global Copilot logo note above.

---

## Frame 2 — `1:67354` ("2192")

**Changes from previous:** Query submitted; page shows a full-page "Generating response…" loading state.
Breadcrumb now reads a specific query (see below), page header progress bar animates.
**Click target:** none — this is a system-timed transition (the loading spinner/progress bar completing
on its own), not a user click. See Ambiguities note A2.
**Copy (verbatim):**
- Breadcrumb query: "What are the California privacy consent laws for websites" (no question mark)
- Loading heading: "Generating response..."
- Loading body: "Copilot is searching across Priva solutions to generate a response and suggest
  questions to help you get started. "
- Button: "Stop generating"
**Visuals:** all CSS-buildable (centered card, gradient progress bar as `linear-gradient`). Priva logo —
see global note above (exported).

---

## Frame 3 — `1:67310` ("2191")

**Changes from previous:** Answer has landed. Left TOC sidebar appears with 6 topics; right side shows
the CCPA answer with 3 source citations and a "Suggested actions" card.
**Click target:** "Generate draft" button inside the "Priva Consent Management" suggested-action card.
**Copy (verbatim):**
- TOC "Suggested topics" list: "Current data collection impact" (selected), "User consent requirements",
  "User data management", "Recent regulation changes", "Best practices with examples", "+ Add topic"
- Section heading: "Current data collection impact"
- Prompt row (with sparkle icon): "How do these laws impact data collection practices on our website?"
- Sources label: "Sources"; citations (numbered pills): 1 "California Consumer Privacy Act",
  2 "Privacy Law Guide - California " (trailing space present in the design text), 3 "Compliance
  Essentials"
- Body text (verbatim, including the design's own punctuation/line breaks):
  > California has stringent privacy laws for websites, primarily governed by the **California Consumer
  > Privacy Act (CCPA)**. The CCPA grants California consumers rights such as the Right to Know, Right
  > to Delete, Right to Opt-Out of Sale, Right to Correct, Right to Limit, and Right to
  > Non-Discrimination regarding their personal information collected by businesses.
  >
  > . Key points about the CCPA include:
  > - Businesses must post their privacy policy on their websites, usually found at the bottom of
  >   webpages.
  > - Personal information includes data that identifies or relates to an individual or household.
  > - The CCPA applies to for-profit businesses meeting specific criteria like revenue thresholds or
  >   dealing with a significant amount of personal information
  >
  > Additionally, the **California Online Privacy Protection Act (CalOPPA)** requires commercial
  > websites to have a privacy notice policy available to visitors. Companies not complying with these
  > laws may face financial penalties enforced by the California Privacy Protection Agency. The
  > **California Privacy Rights Act (CPRA)**, passed in 2020, expands on the CCPA by introducing new
  > provisions and defining a category of "sensitive personal information". These laws aim to protect
  > consumer privacy rights and regulate how businesses handle personal information in California.

  (Note the leading "**.** Key points…" line and the missing final period on the third bullet are
  transcribed exactly as authored — see Ambiguities note A3.)
- Suggested-action card: header "Priva Consent Management" (with icon), body "Create a consent model for
  my website in California", buttons "Generate draft" and "Assign", disclaimer (same boilerplate as
  above).
- Footer: "Show process" (with chevron), "How's this response?" with thumbs up/down icons.
**Visuals:** all CSS-buildable (citation pills, TOC list, card, feedback icons). ConsentManagementSolution
icon (used in the suggested-action card header) is a small flat Fluent glyph — CSS/icon-buildable, not a
photo.

---

## Frame 4 — `1:67181` ("2189")

**Changes from previous:** Same answer page underneath, now with a Copilot side-dialog overlay open: a
chat pane on the left (assistant has already replied with a structured summary of suggested field
values) and a "New consent model" wizard on the right, on step 1 of 5 ("Basic details"), pre-filled with
Copilot-suggested values.
**Click target:** "Next" button (solid blue, bottom-left of wizard footer).
**Copy (verbatim):**
- Chat pane title: "Copilot" with "Preview" pill.
- Chat — user bubble: "Create a consent model for my website in California"
- Chat — assistant response: "Sure. 11 suggestions were generated based on your prompt and other related
  details: " followed by a bulleted list:
  - Contacts: Kadji Bell (You)
  - Consent type: Tracker consent
  - Target country/region: United States
  - Default language: English - U.S.
  - Expires after: 12 months
  - Layout: Layout #2
  - Link description: Do not sell my personal information
  - Customize button: Opt out
  - Header: Do not sell my personal information
  - Opt out: Opt out
  - Save button: Save
  - Feedback row: "AI-generated content may be incorrect", "Show process"
- Suggested-prompt chip in chat input area: "Some suggested prompt" (generic placeholder text as
  authored — see Ambiguities note A4)
- Chat textarea placeholder: "Ask a question or describe what you'd like to do in Privacy manager." —
  **corrected to "Privacy Manager" in the prototype, see Ambiguity B1**
- Dialog header button: "Open in Consent Management" — see Reword note R1
- Wizard title: "New consent model" / subtitle "Consent Management"; stepper shows 5 steps, step 1 active
- Body heading: "Basic details"
- Fields:
  - Name * — empty, placeholder "Placeholder text"
  - Description * — empty, placeholder "Placeholder text"
  - Contacts (Copilot suggestion) * = "Kadji Bell (You)"
  - Consent type (Copilot suggestion) * = "Tracker consent"
  - Target country/region (Copilot suggestion) * = "United States"
  - Default language (Copilot suggestion) * = "English - U.S."
  - Expires after (Copilot suggestion) * = "12" / "Months"
- Footer buttons: "Next" (primary), "Save and close", "Cancel"
**Visuals:** all CSS-buildable — wizard stepper circles/numbers, gradient-tinted "Copilot suggestion"
input backgrounds, chat bubbles/cards. Composite "Security Copilot" sidecar-title icon — see global
Copilot logo note (not separately exported this session).

---

## Frame 5 — `1:67203` ("04")

**Changes from previous:** Wizard advances to step 2 of 5, "Layout". Same chat pane on the left
(unchanged — verified identical text to Frame 4).
**Click target:** "Next" button (primary blue, wizard footer).
**Copy (verbatim):**
- Body heading: "Layout"
- Intro: "Select a layout template for this model and enter layout properties."
- Disclaimer: same boilerplate as elsewhere.
- Three layout template cards:
  1. "Modal light mode (1 page)" — "Floating pop-up to Allow or Deny." — link "Preview"
  2. "Banner light mode (2 pages)" — "Blocking banner with hyperlink to second page." — link "Preview".
     This card carries a "Copilot suggestion" badge and the note **"Supports CA "Do Not Sell"
     requirement."** — it is the Copilot-recommended/selected option (matches "Layout #2" in the chat
     summary).
  3. "Banner dark mode (2 pages)" — "Blocking banner with hyperlink to second page." — link "Preview"
- Footer buttons: "Back", "Next" (primary), "Save and close", "Cancel"
**Visuals:** wizard chrome, "Copilot suggestion" badge, "More Horizontal" icon — all CSS-buildable.
**Layout thumbnail images are true mockup artwork — needs export.** Exported:
  - Modal light mode thumbnail → `assets/61bfa871e7cb.png`
  - Banner light mode thumbnail (Copilot-suggested) → `assets/90e9e2597fc2.png`
  - Banner dark mode thumbnail → `assets/4cb4f9a92f10.png`

---

## Frame 6 — `1:67225` ("05")

**Changes from previous:** Wizard advances to step 3 of 5. Fields for source language and the banner's
"Link" section appear.
**Click target:** "Next" button (primary blue, wizard footer).
**Copy (verbatim):**
- Body intro text: "Enter the basic details for this consent model." — see Ambiguities note A5 (this
  description text appears to be a leftover from step 1; it does not describe what this step actually
  configures).
- Field: Source language (Copilot suggestion) * = "English - en"
- Subsection heading: "Link" — "Edit the contents of each section of the link."
  - Description (Copilot suggestion) = "Do not sell my personal information"
  - Customize button (Copilot suggestion) = "Opt out"
- Disclaimer: same boilerplate as elsewhere.
- Footer buttons: "Back", "Next" (primary), "Save and close", "Cancel"
**Visuals:** all CSS-buildable (gradient "Copilot suggestion" input backgrounds, wizard chrome).

---

## Frame 7 — `1:67247` ("06")

**Changes from previous:** Wizard advances to step 4 of 5. Fields for source language and the banner's
second-page "Preferences" section appear.
**Click target:** "Next" button (primary blue, wizard footer).
**Copy (verbatim):**
- Body heading: "Basic details" — reused verbatim from step 1; see Ambiguities note A5 (same issue as
  Frame 6 — the heading does not match this step's actual content).
- Field: Source language (Copilot suggestion) * = "English - en"
- Subsection heading: "Preferences" — "Edit the contents of each section of the preferences."
  - Description * — empty, placeholder "Enter text..."
  - Opt out (Copilot suggestion) = "United States" — see Ambiguities note A6 (value looks swapped;
    the chat-pane summary in Frames 4–8 says "Opt out: Opt out")
  - Save button (Copilot suggestion) = "English - U.S." — see Ambiguities note A6 (value looks swapped;
    the chat-pane summary says "Save button: Save")
- Disclaimer: same boilerplate as elsewhere.
- Footer buttons: "Back", "Next" (primary), "Save and close", "Cancel"
**Visuals:** all CSS-buildable.

---

## Frame 8 — `1:67269` ("07")

**Changes from previous:** Wizard advances to step 5 of 5, "Preview and customize consent model." — a
live mocked-up browser preview of the resulting cookie banner replaces the form fields. "Save and close"
is now the primary (blue) button since this is the last step.
**Click target:** "Save and close" button (now primary/blue, bottom-right of wizard footer).
**Copy (verbatim):**
- Body heading: "Preview and customize consent model."
- Mini preview browser address bar: "microsoft.com"
- Banner text: "This website uses cookies and similar files to enable and improve the use of the website
  by personalizing content and ads, providing social media features and analyzing our traffic. We also
  share information about your use of our site with our partners. Review our " + link "Cookie Policy" +
  " to learn more and to manage your preferences. " + bold "By clicking on the "Accept all" button, you
  consent to the use of analytics and other files on your device."
- Buttons in the preview: "Accept all", "Decline all"
- Link in the preview: "Manage preferences" (a decorative mouse-cursor annotation icon sits near it in
  the design — this is a design annotation showing where a user would hover/click *inside the mocked-up
  preview*, not a click target of our own prototype)
- Footer buttons: "Back", "Save and close" (primary), "Cancel"
**Visuals:** the embedded browser-preview mockup (mini tab band, address bar, banner) is built from real
text/shape layers, not a flattened screenshot — CSS-buildable. Mouse-cursor annotation icon — small
decorative glyph, CSS/icon-buildable.

---

## Frame 9 — `1:67332`

**Changes from previous:** Dialog has closed; back on the same answer page as Frame 3. The "Suggested
actions" card now shows a completed state instead of the "Generate draft"/"Assign" buttons.
**Click target:** none required to continue — this is the terminal state of scenario 1. The card's "Open"
button exists but does not lead to another frame in this scenario; see Ambiguities note A7.
**Copy (verbatim):**
- Suggested-action card: header "Priva Consent Management", body "Create a consent model for my website
  in California", status pill (green, with checkmark icon) "Draft created", button "Open"
- Everything else on the page (TOC, body answer text, sources, breadcrumb "What are the California
  privacy consent laws for websites") is unchanged from Frame 3 — verified identical.
**Visuals:** green "Draft created" status pill — CSS-buildable (colored pill + checkmark icon).

---

## Shared components (read per brief, not literally instantiated with this content in the 9 frames)

### `1:67949` — `.local-chat-pane` (master/template component)
Structural container: sidecar header ("Copilot" + "Preview" pill), scrollable chat output, input row with
a suggestion chip and textarea. **The example content baked into this master component is a different,
unrelated demo scenario** — a "Create a summary for processing activities in France using relevant
assessments" flow with 6 assessment checkboxes and an Excel-export card ("France Processing Activity
Summary – April 4/2024"). None of that example copy is used in scenario 1. The actual chat-pane instances
inside scenario 1 (Frames 4–8) override this template with the consent-model conversation already
transcribed above — treat the per-frame text as authoritative for scenario 1, and this component only as
the reusable shell (header, scroll container, input row, feedback row, "Show process" accordion).
**Visuals:** all CSS-buildable. The unrelated demo content includes an "Excel" brand icon (32px, colored)
— not exported, since it does not appear in scenario 1's actual flow.

### `1:67883` — `.local-latency-card`
A small streaming/in-progress response card: placeholder response text "OK...", a bottom gradient
progress bar, and a "Stop generating" button below the card. Not seen instantiated as such inside any of
the 9 scenario-1 frames (Frame 2 uses a larger, full-page "Generating response…" pattern instead) — this
smaller pattern is presumably used for later message turns elsewhere in the same Figma file.
**Visuals:** all CSS-buildable (card, gradient progress bar, button).

### `1:67901` — `.local-email-output-card`
A card pattern: body text "Here's a generated summary email of incomplete tasks. Open to verify items and
send via email:", a preview tile titled "SRR summary email" / "Incomplete tasks due soon " with a mail
icon, and a feedback row ("AI-generated content may be incorrect" + thumbs up/down). This is a different,
unrelated demo scenario (a Subject Rights Request summary email) — not used anywhere in scenario 1.
**Visuals:** all CSS-buildable, including the "Mail" icon (small flat Fluent glyph, not a photo).

---

## Reword notes (placeholder location paths — text layer `1:67583`)

The pink annotation text layer `1:67583` ("Placeholder location paths, need PM suggestions:") sits at
canvas position `x=6432, y=8670`, far outside the `y=0–1080` band that all 9 scenario-1 frames occupy.
It belongs to an unrelated part of this large, multi-scenario Figma file, and none of the 9 scenario-1
frames contain a literal blank/TODO location-path string — every URL, breadcrumb, and preview domain
already has concrete, fully-authored demo text (e.g. `purview.microsoft.com/fabrikam/en-us/`,
`microsoft.com`).

**R1 — "Open in Consent Management" button (chat pane header, Frames 4–8).** This button implies
navigating to a specific page/path inside Purview's Consent Management surface that is not covered by
any of the 9 scenario-1 frames — the destination path was never specified by the design or a PM, and
inventing one would violate the "never invent site paths" constraint. **Recommended copy/behavior:**
treat this button as non-interactive (visually present, disabled, or simply not wired to any click
handler) in the guided click-through, since there is no real destination frame to send the user to.
If a label change is preferred to avoid implying navigation at all, an alternative that carries the same
meaning without naming a location: **"View in Consent Management"** paired with a disabled/inert state,
or omit the button's click affordance entirely while keeping its visible label.

No other scenario-1 copy was found to depend on an unresolved location path.

---

## Ambiguities / notes for the implementer

- **A1 (Frame 1 → Frame 2 click target is unclear).** Frame 2's breadcrumb shows the query "What are the
  California privacy consent laws for websites", but none of Frame 1's five suggestion chips contain that
  text (the closest is the "Regulations" chip: "What are the cookie consent regulations for websites in
  the EU?" — a different topic, EU vs. California). The transition therefore cannot be reproduced by
  clicking any visible Frame 1 element as authored. Do not guess a fix — flagging per instructions.
  Options for the implementer/PM to choose from: (a) change Frame 1's "Regulations" chip text to match
  Frame 2's query verbatim, or (b) treat the transition as "user types a custom query into the search box
  and clicks Send," in which case the click target is the search-box Send icon, not a chip.
- **A2 (Frame 2 → Frame 3 has no click target).** This is a loading/generation state that resolves on its
  own (timer or system event), not a user action. The guided click-through will need a non-click
  advance mechanism here (e.g. auto-advance after a delay, or a "Skip" affordance) rather than a
  highlighted element to click.
- **A3 (Frame 3 body copy has two apparent authoring artifacts).** The line "**.** Key points about the
  CCPA include:" begins with a stray period (likely leftover from list-numbering), and the third bullet
  ("...dealing with a significant amount of personal information") has no closing period while its
  siblings do. Both are transcribed exactly as authored; not treated as errors to silently fix.
- **A4 ("Some suggested prompt" chip, Frames 4–8).** This reads as literal unfinished placeholder copy
  (not a location path, so no Reword note under R1's rules), but it is almost certainly not intended as
  final shipped copy. Flagging for awareness; no location/path is implied, so left verbatim.
- **A5 (Wizard step body headings are copy-pasted, Frames 6–7).** Frame 6's intro line ("Enter the basic
  details for this consent model.") and Frame 7's heading ("Basic details") both describe step 1's
  content, not what those steps actually configure (Link / Preferences). Transcribed verbatim; the
  implementer should decide whether to correct these headings or reproduce the design's own
  inconsistency faithfully.
- **A6 (Frame 7 field values look swapped).** The "Opt out" field shows "United States" and the "Save
  button" field shows "English - U.S." — neither matches the field's evident purpose, and both differ
  from the chat-pane summary's stated values ("Opt out: Opt out", "Save button: Save"). Likely a
  copy/paste bug in the source file. Transcribed exactly as authored in both places; the chat-pane
  summary is probably the authoritative intended value if a single source of truth is needed.
- **A7 (Frame 9's "Open" button has no destination).** Scenario 1 ends at Frame 9; the "Open" button on
  the completed "Priva Consent Management" card is visible but not wired to any further frame in this
  scenario. Treat the guided click-through as complete at Frame 9 with no further highlighted element,
  or explicitly mark "Open" as inert/decorative.
- **B1 (page title casing flips within this scenario too) — CORRECTED.** Not flagged when this scenario
  was first inventoried, but confirmed on a later pass across both scenarios: this scenario's own
  frames mix "Privacy Manager" (title case) and "Privacy manager" (lower-case m) for the same product,
  the same slip already recorded as Ambiguity B1 in
  `docs/superpowers/notes/figma-scenario-2-1.md`. **Design said:** lower-case "Privacy manager" on the
  Frame 1 hero title (with its trailing space — see the "Global chrome" and Frame 1 sections above),
  the global page-header title used on the answer/output pages, and Frame 4's dialog chat-input
  placeholder, "...what you'd like to do in Privacy manager."; title-case "Privacy Manager" on Frame 1's
  fifth suggestion chip, "Summarize the capabilities of Privacy Manager". **Prototype now shows:** "Privacy Manager" (title case) everywhere in this scenario too — the hero title, the
  page-header title, and the chat placeholder are all corrected to match the suggestion chip's casing
  and scenario 2.1's dashboard, so the product name reads identically everywhere in the prototype, in
  both scenarios. This is the same `shell.js COPY.pageTitle` / `COPY.chatPlaceholder` constants scenario
  2.1 uses — there is no longer a per-scenario split.
- **Composite Copilot sidecar icon not flattened.** The 24px "Security Copilot" icon used in the dialog
  sidecar title (Frames 4–8) is built from 4 quarter-shapes plus a soft-light gradient overlay in the
  Figma file (5 separate image parts) rather than a single flat asset. This session exported a simpler
  28px flat Copilot mark instead (`assets/5135989b34f7.svg`); if the composite version's exact look is
  required, a later session should crop it via `get_screenshot` and export a flattened PNG.

---

## Assets exported this session

| Filename | Source | Notes |
|---|---|---|
| `assets/61bfa871e7cb.png` | Frame 5, "Modal light mode (1 page)" thumbnail | 740×580 PNG |
| `assets/90e9e2597fc2.png` | Frame 5, "Banner light mode (2 pages)" thumbnail (Copilot-suggested layout) | 1196×808 PNG |
| `assets/4cb4f9a92f10.png` | Frame 5, "Banner dark mode (2 pages)" thumbnail | 1172×774 PNG |
| `assets/5135989b34f7.svg` | Copilot logo (28px, flat variant) — used in search box / page header | matches existing `.svg` convention in `assets/` |
| `assets/5abed2089d2b.svg` | Priva logo (48px) — shown during Frame 2's loading state | matches existing `.svg` convention in `assets/` |
