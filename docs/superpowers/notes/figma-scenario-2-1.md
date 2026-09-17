# Figma content inventory — Scenario 2.1: "SRR Top Compliance Issues" (Subject Rights Requests)

Source file: `TlIT2Cy6DqGvN9kiODC9dz` (Figma). Read via `mcp__plugin_figma_figma__get_design_context` /
`get_screenshot` / `get_metadata`, `figma-design-to-code` skill loaded first per requirement.

Frames are listed in flow order (1–7), node IDs exactly as given in the task brief. The shared email
output card `1:67901` is documented after Frame 6, which instantiates it.

---

## Global chrome (identical to scenario 1 — documented there, not repeated here)

Browser window, Priva suite header, address bar (`https://` + `purview.microsoft.com` + `/fabrikam/en-us/`),
page header with "Back", the Copilot mark and the edit pencil, and the boilerplate disclaimer
**"AI-generated content may be incorrect. Use it for informational purposes only and do not treat it as
legal advice."** are byte-identical to the frames inventoried in `figma-scenario-1.md`. The short form
**"AI-generated content may be incorrect"** is used inside chat cards.

**One chrome string differs and it is a design bug — see Ambiguity B1 (corrected):** frames 1–3 render the
page title as **"Privacy Manager"** (capital M); frames 4–6 render the same header as
**"Privacy manager"** (lower-case m). This is not scoped to this scenario — scenario 1's own frames mix
both casings too (see `figma-scenario-1.md`'s B1 note). The prototype unifies **both scenarios** on the
title-case form; see B1's full entry in the Ambiguities section below.

**Visuals:** all CSS-buildable. No new brand marks appear — the Copilot mark
(`assets/5135989b34f7.svg`) and the Priva mark (`assets/5abed2089d2b.svg`) exported for scenario 1 are
the only images this scenario needs. **Nothing new was exported this session**; the judgment for each
candidate is recorded per frame and summarised at the bottom.

---

## Frame 1 — `1:67165` ("2164") — Privacy Manager risk dashboard

**Changes from previous:** n/a (entry point). **This is NOT scenario 1's home page.** Scenario 1 enters at
`1:67292`, a hero + five bento suggestion cards. This frame is a different landing surface: same hero
(title, subtitle, search box) but **three** short prompt chips instead of five cards, and below them a
"Top compliance risks" dashboard plus a "Recent" prompt history rail. Scenarios 2.2 and 3 are expected to
enter from the same dashboard (their brief lists `1:67517` / `1:67565`), so the renderer for this view is
written to take its cards from data.

**Click target:** the **"Priva Subject Rights Requests"** entry inside the right-hand risks card
(node `I1:67170;45:65682;103:346843`) — the whole `.local-app-risk-card` row, header + body. Clicking a
risk drills into it; Frame 2's breadcrumb ("Details on risk: …") is the drill-in breadcrumb, not a typed
query. **There is no typing in this scenario's opening beat** (contrast scenario 1, ruling 3).

**Copy (verbatim):**
- Back link: "Priva Home"
- Title: `Privacy Manager ` (trailing space present in the layer)
- Subtitle: "Manage your organization’s privacy posture with the help of AI. " + link "Learn more"
  (curly apostrophe in "organization’s"; external-link glyph after the link)
- Search placeholder: "Ask me anything about privacy..."
- Prompt chips (three, in order): "Privacy notice compliance issues", "Privacy requests due soon",
  "Show me past due Privacy Assessments"
- Section heading: "Top compliance risks"
- **Hero risk card** (`.local-hero-card`): app title "Priva Tracker Scanning"; headline
  "4 websites with uncategorized trackers"; a four-slice pie with leader labels, each label being two
  lines:
  - "California1.com" / "(8 uncategorized)" — slice fill `#637CEF`
  - "India1.com" / "(6 uncategorized)" — slice fill `#E3008C`
  - "Canada1.com" / "(4 uncategorized)" — slice fill `#2AA0A4`
  - "France1.com" / "(2 uncategorized)" — slice fill `#9373C0`
- **Risks card** (`.local-risks-card`), three stacked rows:
  1. "Priva Subject Rights Requests" — "6 expiring requests with deadlines expiring within the next
     15 days." — **corrected in the prototype to "15 expiring requests", see Ambiguity B7**
  2. "Priva Tracker Scanning" — "1 privacy statement detected missing during a recent scan of contoso.com"
  3. "Priva Risk Management" — three separate paragraphs:
     - "205 high risk data transfers with personal data detected by risk management policies in the 7 days, affecting 50 users"
     - "1241 assets with personal data were detected in Risk Management policies in the past 7 days, affecting 100 users"
     - "25 personal data types in Azure and AWS aren’t protected by a data protection policy"
- **Recent** rail — heading "Recent", then five `.local-chat-row` entries (query, then a count caption):
  1. "What are the California privacy consent laws for websites?" / "5 prompts, created consent model"
  2. "Summarize top 5 privacy compliance issues across all Priva solutions." / "3 prompts"
  3. "Show me the past due Privacy Assessments where there is highly sensitive data." / "2 prompts"
  4. "Show me the list of websites with uncategorized trackers in most to least order." / "4 prompts"
  5. "Summarize the capabilities of Microsoft Priva." / "1 prompt"
  (Entries 2–5 each carry a hard line break in the design; transcribed as one sentence each.)

**Emphasis:** none. The leading number phrases in the risk-card bodies ("1 privacy statement ",
"205 high risk data transfers ", "1241 assets with personal data ", "25 personal data types ") are
separate text spans but carry the **same** `Segoe UI Regular` weight as the rest of the sentence — they
are span splits, not bolding. Do **not** add an `emphasis` list for them.

**Visuals / export judgment:**
- Cards, chips, rails, the "Recent" chat glyphs — **CSS-buildable**.
- The pie chart is four flat wedges plus a drop-shadow base, exported by Figma as five separate SVG
  slices. Four flat wedges at 40/30/20/10% is an exact `conic-gradient`, so this is **CSS-buildable, not
  exported** — it is a chart drawn from four solid fills, not chart *artwork*. The four fills are new
  colour values and were added to the `prototype.css` token block (`--pp-chart-1…4`) rather than used as
  literals.
- Solution glyphs (Folder Person, Contact Card Ribbon, Fingerprint) — small monochrome Fluent glyphs,
  **CSS/icon-buildable**, not exported.

---

## Frame 2 — `1:67371` ("2166") — drill-in loading state

**Changes from previous:** the risk was clicked; the page switches to the full-page "Generating
response…" state. The page header now carries the drill-in breadcrumb and an animating gradient
progress bar. Structurally identical to scenario 1's Frame 2 (`1:67354`).

**Click target:** none — a system-timed transition. Folded into the preceding beat as its `thinking`
pause, exactly as scenario 1 folded `1:67354`.

**Copy (verbatim):**
- Page title: "Privacy Manager"
- Breadcrumb: "Details on risk: 15 requests with deadlines approaching in next 2 weeks" — **corrected in
  the prototype to "next 15 days", see Ambiguity B7**
- Loading heading: "Generating response..."
- Loading body: "Copilot is searching across Priva solutions to generate a response and suggest questions
  to help you get started. "
- Button: "Stop generating"

**Visuals:** CSS-buildable; the Priva mark is the already-exported `assets/5abed2089d2b.svg`.

---

## Frame 3 — `1:67788` ("2178") — Privacy requests summary answer

**Changes from previous:** the answer has landed. Left TOC drawer appears with two topics; the centre
column holds the summary text and a six-row request table; the right column holds a single suggested
action.

**Click target:** the **"View tasks"** button inside the "Priva Subject Rights Requests" suggested-action
card (`.local-suggestions-list`, node `I1:67798;22:30419;22:50638`).

**Copy (verbatim):**
- Page header — title "Privacy Manager", breadcrumb "Details on risk: 15 requests with deadlines
  approaching in next 2 weeks" — **corrected in the prototype to "next 15 days", see Ambiguity B7**
- TOC (`.local-inline-drawer`): heading "Suggested topics"; items "Privacy requests summary" (selected),
  "Subject Rights Requests reports", "+ Add topic"
- Output title: "Privacy requests summary"
- Prompt row (sparkle glyph, then pencil and refresh glyphs):
  `Summarize 15 subject rights requests with deadlines approaching in next 2 weeks with a table that lists requests `
  (trailing space present in the layer) — **corrected in the prototype to "15 days", see Ambiguity B7**
- Sources label: "Sources"; one citation pill: 1 "Privacy Assessments" — **see Ambiguity B2, corrected in
  the prototype** (wrong solution for an SRR answer)
- Body text (`.local-output-text`), verbatim including the design's own punctuation:
  > 15 soon expiring privacy requests from Subject Rights Request were found with request deadlines
  > approaching within the next 15 days.
  >
  > - Impacts individuals' rights and expectations regarding their personal data.
  > - Timely response crucial to maintaining regulatory compliance and fostering trust.
  > - Failure to address promptly may result in legal consequences and reputational damage.
  >
  > See below for a few of the requests expiring soonest:

  (Straight apostrophe in "individuals'" — the design uses `'` here and `’` elsewhere; transcribed as
  authored. No bolding anywhere in this body.)
- Table (`.local-assessments-table`) — columns, each with a sort arrow: "Request name", "Status",
  "Action assigned to", "Response deadline", "Contact". Six rows (the design's "Daisy Philips" — one L —
  is corrected to "Daisy Phillips" — two Ls — in the prototype; see Ambiguity B9):

  | Request name | Status | Action assigned to | Response deadline | Contact |
  |---|---|---|---|---|
  | John Doe - Export | Not started | - | 4/23/2024 11:16 AM | Dataownergroup (initials avatar "DG") |
  | John Doe - Delete | Active | System | 4/23/2024 11:16 AM | Dataownergroup ("DG") |
  | Jerome Bell - Export | Active | Data subject | 4/23/2024 11:16 AM | Dataownergroup ("DG") |
  | Dianne Russell - Export | Active | Daisy Philips | 4/23/2024 11:16 AM | Daisy Philips |
  | Kathryn Murphy - Export | Active | Henry Brill | 4/23/2024 11:16 AM | Lilly Georgsen ("LG") |
  | Kristin Watson - Export | Active | Daisy Philips | 4/23/2024 11:16 AM | Kat Larrson |

  The rendered frame shows row 5 clipped to "Kathryn Murphy - Expo"; the **text layer** reads
  "Kathryn Murphy - Export" and that is what is transcribed. Request names are blue links — **see
  Reword note R1**.
- Suggested action (`.local-suggestions-list`): section label "Suggested actions"; card app title
  "Priva Subject Rights Requests"; card body "15 incomplete tasks from requests expiring soon"; button
  "View tasks"; then the long disclaimer.
- Footer (`.local-feedback`): "Show process" + "How's this response?" with thumbs up/down.

**Visuals / export judgment:** all **CSS-buildable** — table, citation pill, TOC, card, status dots.
Status glyph fills read straight off the exported Fluent SVGs and every one already exists as a token:
`#316BAA` = `--pp-accent-hover` (Active / In progress), `#707070` = `--pp-ink-4` (Not started).
Contact avatars are a mix of initials monograms ("DG", "LG") and **photographic** portraits. The photos
are the only true images in the frame; they are stock persona headshots with no meaning in the flow, so
they are rendered as initials monograms for every person and **not exported** — recorded here so a later
session can reverse the call deliberately.

---

## Frame 4 — `1:67810` ("2180") — Copilot dialog: Tasks list

**Changes from previous:** same answer page underneath, now behind a scrim with the Copilot dialog open.
Left: the chat pane, already carrying the user's prompt and Copilot's reply. Right: **not a wizard** —
a "Tasks" list panel scoped to Subject Rights Requests, with two filter pills, an item count, a keyword
filter and a 13-row table.

**Click target:** the suggested-prompt chip **"Generate a summary email for the owners of those tasks"**
in the chat pane's input area (node `I1:67833;34:110303;22:40374;75675:5468;70136:13159`).

**Copy (verbatim):**
- Dialog header: Copilot mark, "Copilot", "Preview" pill; right side "Open in Consent Management" and a
  close X. **"Open in Consent Management" is wrong for this flow — corrected to "Open in Subject Rights
  Requests" in the prototype — see Ambiguity B3 and Reword note R2.**
- Chat — user bubble: "15 incomplete tasks from requests expiring soon" (identical to the action card's
  body text in Frame 3)
- Chat — assistant card:
  > Here’s the 3 Subject Rights Requests with the nearest deadlines:
  >
  > 1. **Request name:** This request is not started and the deadline was on 03/28/2024.
  > 2. **Request name:** This request is in progress and the deadline was on 03/28/2024.
  > 3. **Request name:** This request is in progress and the deadline was on 04/01/2024.
  >
  > Here’s the list of tasks for these requests from the Subject Rights Requests solution.

  "Request name:" is styled as a blue underlined **link** and repeats three times — it is unresolved
  placeholder copy, **see Reword note R1**. The three leading numbers are an `<ol>`, not literal "1." text.
- Chat card footer: "AI-generated content may be incorrect" + thumbs up/down, then "Show process".
- Suggested-prompt chip: "Generate a summary email for the owners of those tasks"
- Chat textarea placeholder: "Ask a question or describe what you'd like to do in Privacy manager."
- Tasks panel (`.local-wizard`, but instantiated as a list, not a stepper):
  - Identity: solution glyph, title "Tasks", subtitle "Subject Rights Requests"
  - Filter pills: "Response deadline" `:` "Overdue" and "Assigned to" `:` "All"
  - Right of the filters: "21 items" and a search field placeholder "Filter by keyword"
  - Columns: "Task name" (with sort arrow), "Status", "Request type", "Assigned to", "Response deadline"
  - Rows (13 authored; the dialog clips at 11 in the rendered frame):

    | Task name | Status | Request type | Assigned to | Response deadline |
    |---|---|---|---|---|
    | SRR Export Customer | In progress | Export | John Doe | 10/08/2023, 6:27 PM |
    | SRR Export | Not started | Export | John Doe | 10/21/2023, 2:00 AM |
    | Export Request | Completed; Awaitin... | Export | Cameron Williamson | 8/21/2023, 9:43 AM |
    | DSAR - Delete | Completed; Awaiting approval | Delete | - | 10/31/2023, 10:00 AM |
    | DSAR - Delete | Failed | Delete | Wade Warren | 7/14/2023, 5:15 PM |
    | DSAR - Delete | Not applicable | Export | John Doe | 8/21/2023, 9:43 AM |
    | DSAR - Export | Reopened | Export | John Doe | 8/21/2023, 9:43 AM |
    | DSAR - Delete | Not started | Delete | - | 10/31/2023, 10:00 AM |
    | DSAR - Delete | Approved | Delete | John Doe | 7/14/2023, 5:15 PM |
    | DSAR - Export | Approved | Export | John Doe | 8/21/2023, 9:43 AM |
    | DSAR - Export | Approved | Export | John Doe | 10/08/2023, 6:27 PM |
    | DSAR - Export | Approved | Export | Cameron Williamson | 10/31/2023, 10:00 AM |
    | DSAR - Export | Approved | Export | Jenny Wilson | 7/14/2023, 5:15 PM |

    Row 3's status is authored **literally** as the truncated string "Completed; Awaitin..." while row 4
    spells it out — **see Ambiguity B4**. Both are transcribed exactly as authored.
  - Footer buttons: "Back", "Next" (primary blue), "Save and close", "Cancel". **No frame in this
    scenario is reachable from any of them**, so all four are rendered inert — see Ambiguity B5.

**Status glyph colours** (read off the exported Fluent SVGs; every one already exists as a token):
In progress / Reopened / Completed;Awaiting = `#316BAA` (`--pp-accent-hover`); Not started = `#707070`
(`--pp-ink-4`); Failed / Not applicable = `#BC2F32` (`--pp-danger`); Approved = `#0E700E` (`--pp-success`).

**Leftover template content, NOT rendered in the frame:** the chat output card's master
(`1:37829` → `153:153370`) carries a Kusto "Markdown block" (a `let domains = dynamic([...])` /
`search in (EmailUrlInfo, UrlClickEvents, …)` query with line numbers) and an output-action row with a
**"Run the Kusto query"** button. `get_design_context` emits both, but they do not appear in the rendered
frame (the bubble closes straight after "…from the Subject Rights Requests solution."). They are
Security-Copilot template residue. **Excluded.**

**Visuals / export judgment:** all **CSS-buildable** — dialog, scrim, filter pills, list table, status
dots, chat bubbles. The sidecar's composite "Security Copilot" mark is the same 5-part composite noted in
scenario 1; the already-exported flat mark is reused.

---

## Frame 5 — `1:67834` ("2181") — Copilot dialog: generating the email

**Changes from previous:** the suggested-prompt chip has been sent. It now appears as a **user bubble**
in the chat pane (the chip is gone from the input area), and a small in-pane latency card sits below it.
Everything else — the answer page behind, the dialog header, the whole Tasks panel — is unchanged
(verified identical to Frame 4).

**Click target:** none — a system-timed transition, folded into the preceding beat as its `thinking`
pause, exactly as Frame 2 was.

**Copy (verbatim):**
- User bubble: "Generate a summary email for the owners of those tasks" (one hard line break in the
  design, after "the"; transcribed as one sentence)
- Latency card body: "OK..."
- Button below the card: "Stop generating"

**Visuals:** CSS-buildable (card, gradient progress bar as a `linear-gradient`). This is the smaller
`.local-latency-card` pattern (`1:67883`) rather than Frame 2's full-page one — **see Ambiguity B6**.

---

## Frame 6 — `1:67859` ("2182") — Copilot dialog: email draft ready

**Changes from previous:** the latency card resolves into an email output card in the chat pane. The
answer page, dialog header and Tasks panel are unchanged.

**Click target:** the **open / external-link glyph** on the "SRR summary email" preview tile
(node `1:67938` inside the card). This is what leads to Frame 7.

**Copy (verbatim)** — the card is an instance of `.local-email-output-card` (`1:67901`, read separately
per the brief; the instance's text is identical to the master's):
- Card body: "Here’s a generated summary email of incomplete tasks. Open to verify items and send via
  email:"
- Preview tile title: "SRR summary email"
- Preview tile subtitle: `Incomplete tasks due soon ` (trailing space present in the layer)
- Card footer: "AI-generated content may be incorrect" + thumbs up/down. **No "Show process" row on this
  card** (unlike the Frame 4 card).

**Visuals:** all CSS-buildable, including the 48px Mail envelope glyph on the light-blue preview panel
and the open glyph — small flat Fluent glyphs, not photos.

---

## Frame 7 — `1:92886` ("Frame 2018781179") — Outlook draft

**Changes from previous:** the prototype leaves Priva entirely. A New Outlook window with a "Untitled -
Message" compose window on top of it, the compose body holding the generated summary email.

**Click target:** none — terminal state of scenario 2.1.

**This frame is not built from layers.** `get_metadata` returns exactly two rounded rectangles with image
fills: `1:67947` ("Edit 1", 3840×2160 PNG, 1.7 MB) — a flattened screenshot of the whole Outlook desktop
app — and `1:67948` ("Email 1", 2076×2742 PNG, 260 KB) — a flattened screenshot of the email body,
composited on top. There is no text layer anywhere in this frame.

**Copy** below is therefore **transcribed from the raster at full resolution**, not read off text layers.
It is legible without ambiguity, but it is pixel-transcription and is flagged as such.

- Compose window title: "Untitled - Message"
- Ribbon tabs: "Message", "Insert", "Format text", "Options" ("Message" selected)
- Font controls: "Aptos", "12"
- "Send" button; "From: kat@contoso.com"
- Address rows: "To", "Cc", "Bcc"
- Subject placeholder: "Add a subject"; right of it "Draft saved at 11:00 AM"
- Email body:
  - Microsoft logo lockup (four squares + "Microsoft")
  - Blue info strip: "Important"
  - Heading: "Subject rights request summary email to owners"
  - Description: "[Description text goes here]" — literal unresolved placeholder, **see Reword note R3**
  - Table columns: "Owner" (with sort arrow), "Tasks left", "Deadline"
  - Group "Subject rights request 1": David Power / 3 / 03/08/2024 · Daisy Phillips / 1 / 03/08/2024
  - Group "Subject rights request 2": David Power / 5 / 03/08/2024 · Kevin Sturgis / 2 / 03/08/2024
  - Group "Subject rights request 3": Daisy Phillips / 8 / 03/08/2024 · Kadji Bell / 4 / 03/08/2024 ·
    Oscar Krogh / 3 / 03/08/2024
  - Call-to-action button: "Open Microsoft Priva"
  - Footer: "Sent by Microsoft Email Orchestrator, a compliant and secure email platform for the
    Microsoft Cloud" ("Microsoft Email Orchestrator" underlined as a link), then link "Privacy
    Statement", then the Microsoft logo lockup again.

**Export judgment — deliberate, and reversible:** the two PNGs were **not** exported. Reasons, so a later
session can overrule with full information:
1. The email body — the only content the flow is about — is completely legible and is plain text, a
   grouped table, a button and a footer. That is **CSS-buildable**, and building it keeps the copy
   editable and searchable like every other string in this prototype.
2. The compose window's chrome (title bar, ribbon tabs, Send row, address rows, subject row) is likewise
   plain boxes and text — **CSS-buildable**.
3. The 3840×2160 "Edit 1" screenshot's *outer* content is an unrelated mailbox screenshot — an inbox
   list, its message subjects, and a signed-in account address, none of which belong to this scenario.
   The specifics are deliberately not transcribed here: this repository is public (it serves
   mehvash.com), and recording a real-looking account address and someone's message subjects in a
   committed file would publish them just as surely as exporting the image would. A 1.7 MB raster of an
   inbox is not something to ship into a portfolio page in order to show three lines of Outlook chrome.
   **The renderer therefore draws the compose window on a neutral dimmed backdrop rather than reproducing
   the surrounding inbox.** This is the one place where the prototype deliberately shows less than the
   frame.
4. The owner rows in the email table carry photographic avatars (Oscar Krogh already uses an initials
   monogram "OK" in the design). Rendered as initials monograms for every owner, for the same reason as
   Frame 3's contacts.

---

## Reword notes (unresolved placeholders / destinations)

**R1 — "Request name:" (Frame 4 chat card) and the request-name links (Frame 3 table).**
The chat card repeats a blue, underlined link reading literally **"Request name:"** three times; it is
placeholder copy standing in for a real request title, and the link has no destination frame. Frame 3's
table likewise renders "John Doe - Export" etc. as links with no destination. Substituting the table's
names into the chat card is **not** safe: the chat card's deadlines (03/28/2024, 04/01/2024) contradict
the table's (4/23/2024 for every row), so any pairing would be invented product data.
**Resolution applied:** the text is kept verbatim, and every one of these links is rendered **inert** —
present and styled as the design draws it, never clickable, never pointing anywhere. No path, id or
request title is invented.

**R2 — "Open in Consent Management" (dialog header, Frames 4–6) — RESOLUTION UPDATED.**
The design reuses scenario 1's dialog header verbatim, so an SRR flow offers to open *Consent Management*.
Beyond being the wrong solution (Ambiguity B3), the button implies a Purview path that no frame in this
scenario specifies. **Design said:** "Open in Consent Management" (verbatim from scenario 1).
**Prototype now shows:** "Open in Subject Rights Requests" — the button's label is corrected to name the
scenario's own product, the same phrasing pattern with the solution swapped in, while the destination
question this note originally raised is resolved exactly as before: the button is rendered inert
(`aria-disabled`, out of the tab order), so no path is fabricated. This supersedes the original
resolution recorded here, which kept the label verbatim; the project's later ruling was that a
confirmed wrong-solution slip should be corrected in the prototype rather than reproduced.

**R3 — "[Description text goes here]" (Frame 7 email body).**
A literal authoring placeholder, square brackets and all. It names no location, so nothing has to be
reworded to avoid inventing one. **Resolution applied:** transcribed verbatim and rendered in the
placeholder's own muted style, so a reader sees it as the unfinished copy it is rather than as shipped
product text. Do not replace it with invented description copy.

No other copy in this scenario depends on an unresolved location path.

---

## Ambiguities / notes for the implementer

- **B1 (page title case flips mid-flow) — CORRECTED, then widened to both scenarios.** **Design said:**
  Frames 1–3 render "Privacy Manager" (capital M); Frames 4–6 render "Privacy manager" (lower-case m).
  Two spellings of the same page title, four frames apart, is an authoring slip rather than intent —
  confirmed by an independent reviewer. **First pass (superseded):** the prototype unified scenario
  2.1 alone on "Privacy Manager" via a scenario-only `COPY.pageTitleSRR` constant, on the assumption that
  scenario 1's own lower-case "Privacy manager" was that scenario's own separate, correct verbatim text.
  That assumption was wrong: scenario 1's own frames mix both casings too (see the B1 note in
  `figma-scenario-1.md` — Frame 1's hero title and the global page-header title read lower-case, while
  Frame 1's fifth suggestion chip already reads title-case). The casing slip is pervasive across the
  whole source file, not scoped to one scenario, so scoping the fix to scenario 2.1 left the prototype
  showing both casings depending which scenario a viewer was on. **Prototype now shows:** "Privacy
  Manager" (title case) everywhere in *both* scenarios, via a single shared `COPY.pageTitle` (the
  scenario-only `pageTitleSRR` constant was removed as redundant once the fix widened). This covers the
  dashboard, both scenarios' answer pages and dialog backdrops, and scenario 1's dialog chat-input
  placeholder, which also read "...Privacy manager." and is now "...Privacy Manager.".
- **B2 (the citation names the wrong solution) — CORRECTED.** **Design said:** Frame 3's only source pill
  reads "Privacy Assessments" on an answer entirely about Subject Rights Requests — almost certainly a
  copy/paste from the Privacy Assessments scenario. **Prototype now shows:** the citation re-pointed to
  "Subject Rights Requests" — the scenario's own bare solution name, which already appears twice
  elsewhere in this same scenario (the Tasks panel subtitle, Frame 4; and the chat reply's closing line,
  "...from the Subject Rights Requests solution.", Frame 4). No source name was invented; the correction
  reuses text the design already uses for this exact solution.
- **B3 (the dialog offers the wrong solution) — CORRECTED.** **Design said:** "Open in Consent
  Management" in an SRR dialog (Frames 4–6) — see Reword note R2 below for the full resolution.
  **Prototype now shows:** "Open in Subject Rights Requests" — same phrasing pattern, scenario's own
  product substituted in. The button remains rendered inert (no destination path is specified by any
  frame in this scenario, so none is fabricated).
- **B4 (a status string is authored pre-truncated).** Frame 4 row 3's status text layer literally
  contains "Completed; Awaitin..." — the ellipsis is typed into the copy, not produced by CSS overflow —
  while row 4 spells out "Completed; Awaiting approval". Both transcribed as authored. If a single value
  is ever needed, row 4's is the complete one.
- **B5 (the Tasks panel's footer buttons lead nowhere).** "Back", "Next", "Save and close" and "Cancel"
  are drawn on frames 4–6, and "Next" is the primary blue button, but no frame in this scenario is
  reachable from any of them — the flow leaves through the chat pane instead. All four are rendered
  inert. A later session that finds continuation frames should arm "Next".
- **B6 (two different latency patterns).** Frame 2 uses the full-page "Generating response…" card;
  Frame 5 uses the small in-pane `.local-latency-card` ("OK..." + progress bar + "Stop generating").
  `mount.js` owns the latency card and renders the full-page pattern for every `thinking` pause. The
  in-pane variant was **not** implemented, because `mount.js` is out of scope for this task. The pause
  still reads correctly (the card appears inside the chat pane, where Frame 5 puts it); only its copy and
  size differ. A later session touching `mount.js` can add a per-beat latency variant.
- **B7 (the dashboard's SRR count disagrees with the answer it opens) — CORRECTED.** **Design said:**
  Frame 1's SRR risk row says "**6** expiring requests with deadlines expiring within the next
  **15 days**"; clicking it produces a breadcrumb saying "**15** requests with deadlines approaching in
  next **2 weeks**", a prompt row saying "...deadlines approaching in next **2 weeks**...", and a body
  saying "**15** soon expiring privacy requests … within the next **15 days**". 6 vs 15 on the count;
  "15 days" vs "2 weeks" on the deadline. **Prototype now shows:** both reconciled. Count: "15"
  everywhere — the answer's breadcrumb, prompt row, body text, and suggested-action card all already
  agreed on 15 (four mentions to the dashboard's one), so the dashboard row was corrected from 6 to 15.
  Deadline: "15 days" everywhere — this pairing was evenly split (dashboard + body said "15 days";
  breadcrumb + prompt row said "2 weeks"), so per the project's tie-break rule the dashboard's figure
  (the data surface) won; the breadcrumb and prompt row were corrected from "2 weeks" to "15 days". No
  number was invented — both final values were already present, repeatedly, in the design's own text.
- **B8 (mismatched solution glyphs in the risks card).** The "Priva Tracker Scanning" row carries the
  *Privacy Assessments* solution icon (Contact Card Ribbon) and the "Priva Risk Management" row carries
  the *Microsoft Priva* icon (Fingerprint); only the SRR row's icon matches its label. The prototype draws
  one shared solution badge for all three rather than reproducing the mismatch.
- **B9 ("Daisy Philips" vs "Daisy Phillips") — CORRECTED.** **Design said:** Frame 3's table spells the
  contact/assignee with one L, "Daisy Philips"; Frame 7's email spells the same person with two Ls,
  "Daisy Phillips". **Prototype now shows:** "Daisy Phillips" (two Ls) everywhere — the table's three
  occurrences were corrected to match the email's spelling, which B11 below independently confirmed
  against the raw asset rather than a hand transcription.
- **B10 (13 authored task rows, 11 visible).** The Tasks panel's table has 13 rows in the file; the dialog
  clips at 11 with the 12th partly visible. All 13 are carried in the data and the panel scrolls, so
  nothing is silently dropped.
- **B11 (Frame 7 has no text layers) — VERIFIED.** Every string in Frame 7 is pixels; the original
  transcription above was read at full resolution and believed exact, but at the time this note was
  written it had not been (and could not easily be) checked against a text layer, since none exists.
  **Verification performed:** the raw image fill behind node `1:67948` (2076×2742 PNG) was pulled directly
  — not the rendered/cropped node, which only shows the first two owner rows — via
  `download_assets`/`get_screenshot` on the Figma MCP, and read at full resolution end to end. Every
  string in the existing transcription is confirmed exact, including all three "Subject rights request"
  group headings, all eight owner rows, the "Open Microsoft Priva" CTA, and the footer. In particular this
  confirms "Daisy Phillips" is spelled with two Ls in both of its Frame 7 occurrences, which is the
  evidence B9's correction above relies on. No prototype string differed from the verified transcription,
  so this entry required no code change beyond B9's — it upgrades B11 from an unverified belief to a
  confirmed fact.

---

## Assets exported this session

**None.** Every candidate was judged CSS-buildable or deliberately declined, with reasons recorded above:

| Candidate | Frame | Judgment |
|---|---|---|
| Four pie slices + shadow base (5 SVGs) | 1 | CSS — `conic-gradient` over four solid fills; fills added as `--pp-chart-1…4` tokens |
| Solution glyphs (Folder Person, Contact Card Ribbon, Fingerprint) | 1, 3, 4 | CSS/icon — flat monochrome Fluent glyphs |
| Status glyphs (6 variants) | 3, 4 | CSS/icon — flat fills, all four colours already tokenised |
| Contact / owner portrait avatars | 3, 7 | Declined — rendered as initials monograms; stock headshots carry no meaning in the flow |
| Mail envelope + open glyphs | 6 | CSS/icon |
| "Edit 1" Outlook desktop screenshot (3840×2160 PNG) | 7 | Declined — 1.7 MB raster of an unrelated mailbox; compose window rebuilt in CSS on a neutral backdrop |
| "Email 1" email-body screenshot (2076×2742 PNG) | 7 | Declined — fully legible plain text/table; rebuilt in CSS so the copy stays editable |
| Copilot mark, Priva mark | all | Reused from scenario 1 (`assets/5135989b34f7.svg`, `assets/5abed2089d2b.svg`) |
