# Figma content inventory — Scenario 2.2: "Tracker Scanning Top Compliance Issues"

Source file: `TlIT2Cy6DqGvN9kiODC9dz` (Figma). Read via `mcp__plugin_figma_figma__get_design_context` /
`get_screenshot` / `get_metadata` / `download_assets`, `figma-design-to-code` skill loaded first per
requirement.

Frames are listed in flow order (1–5), node IDs exactly as given in the task brief. The shared output
card `1:67901` (documented in `figma-scenario-2-1.md`) is the same component Frame 5 instantiates, with a
**Teams** product mark instead of the Mail glyph and a different fill — the CSS rebuilt for scenario 2.1
is reused rather than duplicated; see Frame 5.

---

## Global chrome (identical to scenarios 1 and 2.1 — documented there, not repeated here)

Browser window, Priva suite header, address bar (`https://` + `purview.microsoft.com` + `/fabrikam/en-us/`),
the Copilot mark, the edit pencil, and the boilerplate disclaimer **"AI-generated content may be
incorrect. Use it for informational purposes only and do not treat it as legal advice."** are
byte-identical to the frames inventoried in `figma-scenario-1.md`. The short form **"AI-generated content
may be incorrect"** is used inside chat cards.

**Page title casing:** Frame 2 renders the page title as **"Privacy manager"** (lower-case m); the chat
composer placeholder on Frames 3–5 likewise reads "...do in Privacy manager." This is the same pervasive
authoring slip recorded as **B1** in both existing inventories, already corrected project-wide: the
prototype renders **"Privacy Manager"** everywhere via the shared `COPY.pageTitle` /
`COPY.chatPlaceholder`. No new decision is taken here; the scenario simply inherits it.

**Visuals:** almost all CSS-buildable. **One new asset was exported this session** — the Microsoft Teams
product mark on Frame 5's output card (`assets/f4e216c68090.svg`). Everything else is drawn in CSS; the
judgment for each candidate is recorded per frame and summarised at the bottom.

---

## Frame 1 — `1:67517` ("00") — Privacy Manager risk dashboard (a **second, less-resolved variant**)

**Changes from previous:** n/a (entry point).

**This frame is a duplicate of scenario 2.1's entry frame `1:67165`, at an earlier stage of authoring.**
Same layout — hero title, subtitle, search box, three prompt chips, a "Top compliance risks" board (hero
pie card + three-row risks card) and a "Recent" rail — but three regions still hold placeholder copy that
2.1's frame has resolved. Full comparison in **Ambiguity B1** below. **The prototype does not build a
second dashboard: scenario 2.2 enters on the same `risks` view scenario 2.1 already ships**, whose copy
comes from `1:67165`. The one string this scenario actually depends on — the Tracker Scanning risk row —
is byte-identical in both variants, so nothing is lost.

**Click target:** the **"Tracker Scanning"** row inside the right-hand risks card (`1:5269`, an
`.local-app-risk-card` inside the shared `.local-risks-card` component `1:5266`) — the whole row, header +
body. Clicking a risk drills into it; Frames 3–5's breadcrumb trail ends on this row's exact text, which
is how the target is confirmed. **There is no typing in this scenario's opening beat**, exactly as in 2.1.

**Copy (verbatim, as this frame authors it):**
- Back link: "Priva Home"
- Title: "Privacy Manager"
- Subtitle: "Manage your organization’s privacy posture with the help of AI." + link "Learn more"
- Search placeholder: "Ask me anything about privacy..."
- Prompt chips (three, in order): "Prompt suggestion goes here", "Prompt suggestion goes here",
  "Prompt suggestion goes here" — **literal placeholders, see Reword note R1**
- Section heading: "Top compliance risks"
- **Hero risk card** (`.local-hero-card`, `1:67526`): app title "Tracker"; headline "2 responses are past
  due on assessments with highly sensitive PI."; a four-slice pie with leader labels, each two lines:
  - "Contonso.com" / "(8)" — *the frame's own spelling of the first label only; see Ambiguity B2*
  - "Contoso2.com" / "(6)"
  - "Contoso3.com" / "(4)"
  - "Contoso4.com" / "(2)"
- **Risks card** (`.local-risks-card`, `1:5266`), three stacked rows:
  1. "Subject Rights Requests" — "6 expiring requests with deadlines expiring within the next 15 days."
  2. **"Tracker Scanning" — "1 privacy statement detected missing during a recent scan of contoso.com"**
     ← the click target; identical to `1:67165`'s row
  3. "Privacy Risk Assessment" — three separate paragraphs, identical to `1:67165`'s third row:
     - "205 high risk data transfers with personal data detected by risk management policies in the 7 days, affecting 50 users"
     - "1241 assets with personal data were detected in Risk Management policies in the past 7 days, affecting 100 users"
     - "25 personal data types in Azure and AWS aren’t protected by a data protection policy"
- **Recent** rail — heading "Recent", then five `.local-chat-row` entries, **all five identical**:
  "What are the California privacy consent laws for websites?" / "5 prompts, created consent model" —
  **placeholder repetition, see Reword note R1**

**Emphasis:** none. As in 2.1, the leading number phrases ("1 privacy statement ", "205 high risk data
transfers ", …) are separate text spans at the **same** `Segoe UI Regular` weight — span splits, not
bolding. Do **not** add an `emphasis` list for them.

**Visuals / export judgment:** identical to `1:67165` — cards, chips, rails, pie and solution glyphs are
all **CSS-buildable**, and the prototype already draws them. Nothing exported. The row's solution glyph
here is the *Privacy Assessments* icon (Contact Card Ribbon) on a Tracker Scanning row — the same
mismatch recorded as B8 in 2.1, handled the same way (one shared solution badge).

---

## Frame 2 — `1:67388` ("01") — "Missing privacy statements" answer

**Changes from previous:** the risk was clicked and the answer has landed. Left TOC drawer with three
topics; centre column with the summary text and a six-row scan table; right column with a single
suggested action. **There is no separate loading frame in this scenario** (2.1 had `1:67371`); the pause
is still played, folded into the preceding beat as its `thinking` value exactly as both earlier scenarios
do — see Ambiguity B6.

**Click target:** the **"Review scan"** button inside the "Priva Tracker Scanning" suggested-action card
(`.local-suggestions-list` `1:67415`, button `I1:67415;22:30419;22:50614`).

**Copy (verbatim):**
- Page header — back link "Back"; title `Privacy manager` (**rendered "Privacy Manager"**, B1);
  breadcrumb text "What are the California privacy consent laws for websites" — **this is scenario 1's
  query, pasted into a Tracker Scanning answer; corrected in the prototype, see Ambiguity B3**
- TOC (`.local-inline-drawer` `1:67411`): heading "Suggested topics"; items "Missing privacy statements"
  (selected), "Contoso.com scan details", "Legal implications", "+ Add topic"
- Output title: "Missing privacy statements"
- Prompt row (sparkle glyph, then pencil and refresh glyphs):
  "Provide a additional details on the missing privacy statement detected during a scan of contoso.com"
  — **"a additional" corrected in the prototype, see Ambiguity B4**
- Sources label: "Sources"; one citation pill: 1 "Tracker Scanning" (the right solution for this answer —
  no repeat of 2.1's B2 slip here)
- Body text (`.local-output-text`), verbatim:
  > The scans conducted on Contoso.com and Contosopromos.com indicated that the location value provided
  > for the privacy statement was not detected. This suggests that these websites may need to review and
  > update their privacy statements to ensure they are providing the necessary location information.
  >
  > On 5 other websites, the location value provided was detected and deemed accurate.
  > - Contosopromos.com
  > - Contoso.fr
  > - Contoso.co.uk
  > - Contosomarketing.com
  > - Contoso.ca
  >
  > Below is a list of all websites that have recently scanned for privacy statements:

  (The blank lines are authored as zero-width-space paragraphs, `U+200B`; transcribed as ordinary blank
  lines. The bullet list is a real `<ul>` in the layer, not typed dashes. No bolding anywhere in this
  body. "have recently scanned" — not "have recently *been* scanned" — is the design's own wording and is
  left alone; see Ambiguity B10.)
- Table (`.local-page-ouput` → "Websites") — columns, first one with a sort arrow: "Website name",
  "Crawl definition", "Scan region", "Scan status", "Scan result", "Last scan time". Six rows:

  | Website name | Crawl definition | Scan region | Scan status | Scan result | Last scan time |
  |---|---|---|---|---|---|
  | Contoso.com | Cookies, Privacy statement.... | West US | Complete | Failed | `4/1/2024, 4:45 ` |
  | Contosopromos.com | Cookies, Privacy statement... | West US | Complete | Succeeded | 3/28/2024, 11:00 AM |
  | Contoso.fr | Privacy statement, Consent... | EU | Complete | Succeeded | 3/18/2024, 20:45 |
  | Contoso.co.uk | Pixels, Privacy statement, C... | East US | Complete | Succeeded | 3/12/2024, 16:00 |
  | Contosomarketing.com | Privacy statement, Reject all... | EU | Complete | Succeeded | `3/7/2024, 17:15 ` |
  | Contoso.ca | Privacy statement, Consent... | West US | Complete | Succeeded | `2/22/2024, 14:45 ` |

  Every "Crawl definition" value is authored **pre-truncated** — the ellipsis is typed into the copy, as
  in 2.1's B4 — and row 1's has **four** dots where row 2's has three. Both transcribed exactly as
  authored; see Ambiguity B7. Website names are plain text here, **not** links (contrast 2.1's request
  table). The "Last scan time" column mixes formats; see Ambiguity B8.
- Suggested action (`.local-suggestions-list`): section label "Suggested actions"; card app title
  "Priva Tracker Scanning"; card body "Review scan configuration for Contoso.com"; one button
  "Review scan"; then the long disclaimer.
- Footer (`.local-feedback`): "Show process" + "How's this response?" with thumbs up/down.

**Visuals / export judgment:** all **CSS-buildable** — table, citation pill, TOC, card, status dots. The
status glyph fills read straight off the exported Fluent SVGs and every one already exists as a token:
`#316BAA` = `--pp-accent-hover` (Complete), `#0E700E` = `--pp-success` (Succeeded), `#BC2F32` =
`--pp-danger` (Failed). No avatars appear anywhere in this scenario, so 2.1's headshot question does not
arise. The solution glyph on the action card is the Tracker Compliance "Location Target Square" —
a flat monochrome Fluent glyph, **CSS/icon-buildable**, drawn with the existing shared solution badge.

---

## Frame 3 — `1:67487` ("02") — Copilot dialog: scan definition + chat

**Changes from previous:** same answer page underneath, now behind a scrim with the Copilot dialog open.
The page header behind the scrim has also changed shape — Frames 3–5 replace Frame 2's title-plus-query
header with a **breadcrumb trail** (see Ambiguity B3). Left: the chat pane, carrying the user's prompt and
three Copilot replies. Right: **not a wizard and not a list** — a third panel type, the Tracker Scanning
**scan configuration** editor, opened on its third tab.

**Click target:** the suggested-prompt chip **"Yes, generate email"** in the chat pane's input area
(`I1:67516;52:113426;34:110303;52:109232;75675:5468;70136:13159`).

**Copy (verbatim):**
- Dialog header: Copilot mark, "Copilot", "Preview" pill; right side **"Open in Tracker Scanning"** and a
  close X. Unlike 2.1 (B3) this label already names the scenario's own solution — **no correction needed**.
  It is still rendered inert: no frame specifies a destination.
- Chat — user bubble: "Check for recent updates made to scans"
- Chat — assistant card 1 (three parts):
  - "In the most recent scan for 5 websites a different location path was used for the privacy statement. "
    (trailing space present in the layer)
  - a muted monospace value: `//*[@id="c-uhff-footer_privacyandcookies"]/a`
  - a small bordered button: "Hide value"
- Chat — assistant card 2: "The location path used in this scan matches the correctly scanned one found in
  other websites. This scan seems up to date, and problem may be in the website itself."
- Chat — assistant card 3: "Would you like me to generate a teams message to the website owner
  summarizing the issue?" (lower-case "teams" is the design's own; see Ambiguity B5)
- **None of these three cards carries a "Show process" row** — only the disclaimer + thumbs. (2.1's
  chat card did carry one; the flag is opt-out in the shell, so all three opt out.)
- Suggested-prompt chip: "Yes, generate email" — **an email chip answering a question about a Teams
  message, in a flow that ends in a Teams message; see Ambiguity B5**
- Chat textarea placeholder: "Ask a question or describe what you'd like to do in Privacy manager."
  (rendered with the corrected casing, B1)
- Scan panel (`I1:67486;52:113426;36:114945`, "TCS"):
  - Panel title: "Contoso.com – Scan 2" (en dash)
  - Tab list, authored as an ordered list so the numbers are list markers, not typed text:
    "Basic details", "Authentication steps", "Scan definition" (selected), "Scan trigger"
  - Intro: "Select the items you want to scan for across your website." + link " Learn more "
  - Section 1 (collapsed, chevron right): heading "Trackers and tags"; body "Select the trackers and tags
    you want to scan for and whether to capture associated tags and relationships."
  - Section 2 (expanded, chevron down): heading "Compliance objects"; body "Select or unselect the
    compliance objects you want to scan for. If anything is missing, you can also manually add compliance
    objects to scan for" (no terminating full stop — as authored)
  - Action: "+ Add compliance object"
  - Six compliance-object cards, in DOM order (the panel lays them out two per row):

    | # | Label | Checkbox | Field | Value |
    |---|---|---|---|---|
    | 1 | “Privacy statement” link | checked | Location path | `//*[@id="c-uhff footer_privacyandcookies"]/a` |
    | 2 | Consent banner | checked | Location path | `//*[@id="c-uhff footer_privacyandcookies"]/a` |
    | 3 | “Cookie policy” link | unchecked | Location path | *(empty)* placeholder "Add location path" |
    | 4 | “Do not sell” link | unchecked | Location path | *(empty)* placeholder "Add location path" |
    | 5 | “Accept all” button | unchecked | Location path | *(empty)* placeholder "Add location path" |
    | 6 | “Reject all” button | unchecked | Location path | *(empty)* placeholder "Add location path" |

    (The labels use curly typographic quotes in the design — `“ ”` — transcribed as authored.)
  - Card 1 alone is highlighted and carries a Copilot block underneath its field:
    - "Copilot detected:" then the value `//*[@id="c-uhff footer_privacyandcookies"]/a`
    - note: "Based on other recent scans, the location path seems to be up to date in this scan. "
      (trailing space present in the layer)
    - "AI-generated content may be incorrect" + thumbs up/down
  - **The three panel copies of the location path are spelled with a space where the chat card's copy has
    a hyphen — corrected in the prototype, see Ambiguity B9.**

**Leftover template content, NOT rendered in the frame:** the panel's `Toolbar` component carries a
"Right button set (optional)" holding two icon buttons (Arrow Undo, Arrow Redo), a divider and a **"Save"**
button. `get_design_context` emits all four, but none of them appears in the rendered frame — the panel's
title bar is empty to the right of "Contoso.com – Scan 2" in every one of Frames 3–5 (verified on the
rendered PNG at 1600px). Treated exactly as 2.1 treated the Kusto "Run the Kusto query" residue:
**excluded.**

**Visuals / export judgment:** all **CSS-buildable** — dialog, scrim, tab list, chevrons, checkboxes,
bordered inputs, the Copilot-detected wash (the existing `--pp-ai` gradient), chat bubbles. The sidecar's
composite "Security Copilot" mark is the same 5-part composite noted in scenario 1; the already-exported
flat mark (`assets/5135989b34f7.svg`) is reused.

---

## Frame 4 — `1:67427` ("03") — Copilot dialog: generating the message

**Changes from previous:** the chip has been sent. The chat has scrolled (card 1 is out of view), a new
**user bubble** appears, and a small in-pane latency card sits below it. Everything else — the answer page
behind, the dialog header, the whole scan panel — is unchanged (verified identical to Frame 3).

**Click target:** none — a system-timed transition. Folded into the preceding beat as its `thinking`
pause, exactly as 2.1 folded `1:67834`.

**Copy (verbatim):**
- User bubble: "Generate a summary message for the website owners." — **not** the chip's own text; see
  Ambiguity B5
- Latency card body: "OK..."
- Button below the card: "Stop generating"
- **The "Yes, generate email" chip is still drawn in the input area** even though it has just been sent;
  Frame 5 drops it. See Ambiguity B11.

**Visuals:** CSS-buildable (card, gradient progress bar as a `linear-gradient`). This is the smaller
`.local-latency-card` pattern rather than a full-page one — the same split recorded as **B6** in 2.1 and
handled identically (see Ambiguity B6 below).

---

## Frame 5 — `1:67457` ("2172") — Copilot dialog: Teams message ready

**Changes from previous:** the latency card resolves into an output card in the chat pane, and the chip is
gone from the input area. The answer page, dialog header and scan panel are unchanged.

**Click target:** none — terminal state of scenario 2.2. The card's **open glyph** is drawn (node
`…;53:131638`) but **no sixth frame exists** for it to lead to — contrast 2.1, where the equivalent glyph
opens the Outlook draft. It is therefore rendered but never armed; see Ambiguity B12.

**Copy (verbatim)** — the card is the same `.local-email-output-card` component as 2.1's (`1:67901`),
re-skinned:
- Card body: "Here's a generated summary teams message of compliance issues for the websites. Open to
  verify items and send via teams:" (the design uses a curly apostrophe in "Here's"; lower-case "teams"
  twice — see Ambiguity B5)
- Preview tile art: the **Microsoft Teams product mark**, 32px, colour variant, centred on a cornflower
  panel (`#C8D1FA`, Fluent `status/generic/cornflower/background/2/rest`) — 2.1's card uses a 48px Mail
  glyph on `#E3EFFD` in the same slot
- Preview tile title: `Website summary ` (trailing space present in the layer)
- Preview tile subtitle: "Compliance issues listed out"
- Card footer: "AI-generated content may be incorrect" + thumbs up/down. **No "Show process" row**, same
  as 2.1's card.

**Visuals / export judgment:** the tile, its panel and the open glyph are **CSS-buildable** and reuse
2.1's `.pp-email-tile` rules unchanged apart from a fill variant. The **Teams product mark is a brand
logo** — five flat colour shapes plus two shading overlays, not something to approximate by hand — so it
is the one asset **exported this session**: `assets/f4e216c68090.svg` (32×32 SVG, 1.9 KB, the flattened
`size=32, theme=Color` variant of Teams component `1:48759`). This follows the precedent set for the
Copilot and Priva marks in scenario 1.

---

## Reword notes (unresolved placeholders / destinations)

**R1 — Frame 1's prompt chips and "Recent" rail are placeholder copy.**
The three chips read literally "Prompt suggestion goes here", and all five Recent rows repeat "What are
the California privacy consent laws for websites?" / "5 prompts, created consent model". Neither names a
location, so nothing has to be reworded to avoid inventing one, and **no substitute copy is invented**.
**Resolution applied:** the prototype does not render this frame at all — scenario 2.2 enters on the
`risks` view already built from scenario 2.1's resolved twin of this dashboard (`1:67165`), whose chips
and Recent rows are real strings written by the same designer for the same board. See Ambiguity B1.

**R2 — "Open in Tracker Scanning" (dialog header, Frames 3–5).**
The label is correct for this flow (unlike 2.1's, which needed correcting), but it still implies a Purview
destination that no frame in this scenario specifies. **Resolution applied:** the label is kept verbatim
and the button is rendered **inert** (`aria-disabled`, out of the tab order), so no path is fabricated.
Same treatment as R2 in `figma-scenario-2-1.md`, without that note's label correction.

**R3 — "Hide value", "+ Add compliance object", "Learn more", the six location-path inputs, and the four
panel tabs (Frames 3–5).**
Every one of these is drawn as an interactive control with no frame behind it. **Resolution applied:**
all are rendered inert — present and styled as the design draws them, never clickable, never pointing
anywhere. The location-path inputs are real `readonly` inputs so the prototype does not pretend to edit a
scan configuration it has no data for.

No copy in this scenario depends on an unresolved location path.

---

## Ambiguities / notes for the implementer

- **B1 (the dashboard exists twice, at two stages of authoring) — RESOLVED BY REUSE, NOT CORRECTED.**
  Frame `1:67517` (this scenario) and frame `1:67165` (scenario 2.1) are the same board. They differ in
  four places, and `1:67165` is the more resolved of the two in every one:

  | Region | `1:67517` (2.2) | `1:67165` (2.1) |
  |---|---|---|
  | Prompt chips | "Prompt suggestion goes here" ×3 | three real prompts |
  | Hero card title / headline | "Tracker" / "2 responses are past due on assessments with highly sensitive PI." | "Priva Tracker Scanning" / "4 websites with uncategorized trackers" |
  | Pie labels | "Contonso.com (8)" … "Contonso4.com (2)" | "California1.com (8 uncategorized)" … "France1.com (2 uncategorized)" |
  | Risk row titles | "Subject Rights Requests" / "Tracker Scanning" / "Privacy Risk Assessment" | "Priva Subject Rights Requests" / "Priva Tracker Scanning" / "Priva Risk Management" |
  | Recent rail | the same row five times | five distinct queries |

  The risk-row **bodies** are byte-identical across both frames, including the one this scenario clicks.
  **Decision:** the prototype keeps the single `risks` view it already has, built from `1:67165`. This is
  a reuse decision, not a copy correction — no string from `1:67517` is rewritten; the frame is simply not
  the one rendered. Recorded here so a later session can reverse it deliberately. (A "Tracker" hero card
  about *assessments* with a *Privacy Assessments* icon is itself incoherent, which is part of why the
  more resolved twin was preferred.)
- **B2 ("Contonso" vs "Contoso" in the hero pie).** Frame `1:67517`'s **first** pie label reads
  "Contonso.com" — with an extra *n* — while its own three siblings ("Contoso2.com", "Contoso3.com",
  "Contoso4.com") and every other occurrence of the fictional company in the file, this frame's own risk
  row included, read "Contoso". **Not corrected, because it is not rendered:** these labels live only in the hero card of the dashboard
  variant B1 declines to build. Flagged so it is not mistaken for a transcription error here.
- **B3 (the answer's breadcrumb is scenario 1's query) — CORRECTED.** **Design said:** Frame 2's header
  renders the page title "Privacy manager" with the crumb "What are the California privacy consent laws
  for websites" — verbatim scenario 1 copy, on an answer entirely about a missing privacy statement found
  by a Tracker Scanning scan. **Confirmed** against the same scenario's own later frames: Frames 3–5
  replace that header with a breadcrumb trail reading "Privacy Manager  ›  **1 privacy statement detected
  missing during a recent scan of contoso.com**" (node `1:67464`) — which is also, word for word, the
  dashboard risk row this flow clicks. **Prototype now shows:** the crumb "1 privacy statement detected
  missing during a recent scan of contoso.com" on every frame of the scenario. No value is invented: the
  replacement is a string the design already uses twice for exactly this drill-in.
- **B4 ("Provide a additional details") — CORRECTED.** **Design said:** the prompt row reads "Provide a
  additional details on the missing privacy statement detected during a scan of contoso.com" — an article
  left behind by an edit ("a detail" → "additional details"). **Prototype now shows:** "Provide additional
  details on the missing privacy statement detected during a scan of contoso.com". The stray article is
  deleted and nothing else is touched; no wording is invented.
- **B5 (Teams or email? the design says both) — TRANSCRIBED VERBATIM, NOT CORRECTED.** Within four frames
  the flow reads: Copilot asks "Would you like me to generate a **teams message**…?", the affirmative chip
  says "Yes, generate **email**", the prompt actually sent says "Generate a summary **message**…", and the
  result is "a generated summary **teams** message … send via **teams**". Three mentions favour Teams and
  one favours email; the artefact produced is unambiguously a Teams card. **Why this is not corrected:**
  the project rule permits correcting a *confirmed* slip, and it would be easy to rewrite the chip to
  "Yes, generate message" — but that phrasing appears nowhere in the design, so the correction would
  invent copy rather than choose between values the designer wrote, which is exactly what the rules
  forbid. Rewriting it to "Yes, generate teams message" has the same problem. All four strings are
  therefore transcribed exactly as authored, including the lower-case "teams" (the design never
  capitalises the product name in this scenario). A later session with the designer in the room should
  settle the channel and unify the four strings. Related: this is why the brief says the scenario contacts
  owners "via Teams **or** email" — the ambiguity is in the source, not in the brief.
- **B6 (no loading frame, and two latency patterns).** This scenario has no full-page "Generating
  response…" frame at all — Frame 1 goes straight to Frame 2 — and its in-dialog pause (Frame 4) uses the
  small `.local-latency-card` ("OK..." + progress bar + "Stop generating"). `mount.js` owns the latency
  card and renders the full-page pattern for every `thinking` pause; the in-pane variant was **not**
  implemented, because `mount.js` is out of scope for this task (identical reasoning to B6 in
  `figma-scenario-2-1.md`). Both pauses still read correctly; only the copy and size of the card differ.
- **B7 (crawl definitions are authored pre-truncated, inconsistently).** Every "Crawl definition" cell
  ends in a typed ellipsis rather than CSS overflow, and row 1's ends in **four** dots
  ("Cookies, Privacy statement....") where row 2's identical prefix ends in three
  ("Cookies, Privacy statement..."). Both transcribed as authored — as in 2.1's B4, the truncation is
  copy, and guessing the untruncated value would be inventing product data. If one value is ever needed,
  row 2's three-dot form is the consistent one.
- **B8 (the "Last scan time" column mixes formats).** Row 1 is "4/1/2024, 4:45" with **no meridiem at
  all**; row 2 is 12-hour with "AM"; rows 3–6 are 24-hour ("20:45", "16:00", "17:15", "14:45"). Three of
  the six also carry a trailing space in the layer. **Not corrected:** there is no way to confirm whether
  row 1 means 4:45 AM or PM, and no majority format to adopt — inventing either would fabricate product
  data. Transcribed exactly, trailing spaces included.
- **B9 (the same XPath is spelled two ways) — CORRECTED.** **Design said:** the chat card writes the
  detected location path as `//*[@id="c-uhff-footer_privacyandcookies"]/a` (hyphen), while all three
  copies inside the scan panel — the "Privacy statement" link's field, its "Copilot detected:" value, and
  the Consent banner's field — write `//*[@id="c-uhff footer_privacyandcookies"]/a` with a **literal
  space** (confirmed as `U+0020` in the layer text, not a line wrap). **Why this is treated as a confirmed
  slip:** the design's own copy asserts the two are the same value — "The location path used in this scan
  **matches** the correctly scanned one found in other websites" — so rendering them as two different
  strings would contradict the sentence sitting beside them; and a space inside an HTML `id` selector does
  not form a single token, so the space version cannot be the intended value of a path the product is
  said to have detected. **Prototype now shows:** the hyphenated form in all four places. The replacement
  is the design's own chat-card string; nothing is invented. Recorded in full because the count runs
  3-to-1 the other way, so a later session may wish to overrule.
- **B10 ("websites that have recently scanned for privacy statements").** The lead-in to the table reads
  as though the websites did the scanning. It is very likely meant to be "have recently **been** scanned",
  but the missing word is a guess, not a confirmable value, so the sentence is **transcribed verbatim**
  per the rule against correcting what is merely suspected.
- **B11 (the sent chip is still drawn in Frame 4).** "Yes, generate email" remains in the input area in
  Frame 4 even though its prompt has already been sent and is showing as a user bubble; Frame 5 correctly
  drops it. The shell drops a suggestion chip the moment the next turn is pushed, so the prototype matches
  Frame 5 and differs from Frame 4 for the duration of the pause. Noted rather than engineered around.
- **B12 (the Teams card's open glyph leads nowhere).** 2.1's equivalent glyph opens the Outlook draft
  (frame `1:92886`); this scenario has no such frame, so the glyph is rendered — the design draws it — but
  no beat arms it, and the spotlight machinery leaves it inert at the terminal beat. A later session that
  finds a Teams-composer frame should arm it as scenario 2.1 arms its own.
- **B13 (three assistant cards in one turn).** Frame 3 shows Copilot's reply as **three separate output
  cards**, where every earlier scenario used one. The engine pushes one chat entry per beat, so the entry
  carries a `cards` array and the shell stacks one bubble per card — the turn stays a single beat, which
  is what the frames show (all three are present at once in Frame 3; none appears alone).

---

## Assets exported this session

| Candidate | Frame | Judgment |
|---|---|---|
| **Microsoft Teams product mark (32px, colour)** | 5 | **EXPORTED → `assets/f4e216c68090.svg`** — brand logo, seven shapes in five brand colours; same call as the Copilot and Priva marks |
| Hero pie slices, solution glyphs, chat glyphs | 1 | CSS — and not rendered at all; B1 keeps scenario 2.1's dashboard |
| Status glyphs (Complete / Succeeded / Failed) | 2 | CSS/icon — flat fills, all three colours already tokenised |
| Sort arrow, sparkle, pencil, refresh, external-link | 2 | CSS/icon |
| Tab list, chevrons, checkboxes, inputs, "Copilot detected" wash | 3–5 | CSS — the wash reuses the existing `--pp-ai` gradient |
| Open glyph on the output card | 5 | CSS/icon |
| Cornflower card panel `#C8D1FA` | 5 | CSS — one new token, `--pp-cornflower-bg` |
| Copilot mark, Priva mark | all | Reused from scenario 1 (`assets/5135989b34f7.svg`, `assets/5abed2089d2b.svg`) |
| Email-card CSS (`.pp-email-tile`) | 5 | Reused from scenario 2.1 — the same component `1:67901`, one fill/art variant added rather than a second renderer |
