/**
 * Demo scripts. DATA ONLY — no imports, no functions, no DOM.
 * Safe to edit copy here without touching any logic.
 *
 * Source: docs/superpowers/notes/figma-scenario-1.md (verbatim transcription
 * of Figma frames 1-9, scenario "Summarize Consent Laws + Create Draft Model").
 * Corrections applied per project-owner rulings are called out inline below.
 */

export const CONTENT = {
  // Frame 3 — the CCPA answer page. Pushed once as the assistant's reply to
  // the opening query; stays in chat history unchanged for the rest of the
  // scenario (Frame 9 shows the same page/text, verified identical).
  'answer-ccpa': {
    text: 'California has stringent privacy laws for websites, primarily governed by the California Consumer Privacy Act (CCPA). The CCPA grants California consumers rights such as the Right to Know, Right to Delete, Right to Opt-Out of Sale, Right to Correct, Right to Limit, and Right to Non-Discrimination regarding their personal information collected by businesses.\n\n. Key points about the CCPA include:\n- Businesses must post their privacy policy on their websites, usually found at the bottom of webpages.\n- Personal information includes data that identifies or relates to an individual or household.\n- The CCPA applies to for-profit businesses meeting specific criteria like revenue thresholds or dealing with a significant amount of personal information\n\nAdditionally, the California Online Privacy Protection Act (CalOPPA) requires commercial websites to have a privacy notice policy available to visitors. Companies not complying with these laws may face financial penalties enforced by the California Privacy Protection Agency. The California Privacy Rights Act (CPRA), passed in 2020, expands on the CCPA by introducing new provisions and defining a category of "sensitive personal information". These laws aim to protect consumer privacy rights and regulate how businesses handle personal information in California.',
    // Frame 3 bolds three act names inside the body copy. Stored as phrases
    // rather than in-string markers or character offsets so `text` above stays
    // byte-identical to the design's verbatim copy and remains safe to edit.
    emphasis: [
      'California Consumer Privacy Act (CCPA)',
      'California Online Privacy Protection Act (CalOPPA)',
      'California Privacy Rights Act (CPRA)'
    ],
    citations: ['California Consumer Privacy Act', 'Privacy Law Guide - California ', 'Compliance Essentials'],
    sectionHeading: 'Current data collection impact',
    promptRow: 'How do these laws impact data collection practices on our website?',
    sourcesLabel: 'Sources',
    toc: {
      heading: 'Suggested topics',
      items: [
        'Current data collection impact',
        'User consent requirements',
        'User data management',
        'Recent regulation changes',
        'Best practices with examples',
        '+ Add topic'
      ],
      selected: 'Current data collection impact'
    }
  },

  // Frame 3's "Suggested actions" card in its two states. Referenced by
  // state.actionCard (a plain content-key string, same convention as `view`)
  // rather than baked into answer-ccpa, because the card's status changes
  // (Frame 9) after the message that introduced it has already been pushed.
  'action-card-pending': {
    header: 'Priva Consent Management',
    body: 'Create a consent model for my website in California',
    buttons: ['Generate draft', 'Assign']
  },
  'action-card-completed': {
    header: 'Priva Consent Management',
    body: 'Create a consent model for my website in California',
    status: 'Draft created',
    button: 'Open'
  },

  // Frame 4 — the dialog's chat pane, assistant's suggestion summary.
  'wizard-suggestions-summary': {
    text: 'Sure. 11 suggestions were generated based on your prompt and other related details: ',
    bullets: [
      'Contacts: Kadji Bell (You)',
      'Consent type: Tracker consent',
      'Target country/region: United States',
      'Default language: English - U.S.',
      'Expires after: 12 months',
      'Layout: Layout #2',
      'Link description: Do not sell my personal information',
      'Customize button: Opt out',
      'Header: Do not sell my personal information',
      'Opt out: Opt out',
      'Save button: Save'
    ]
  },

  // Frame 4 — wizard step 1 of 5, "Basic details".
  'wizard-basic-details': {
    title: 'New consent model',
    subtitle: 'Consent Management',
    step: 1,
    totalSteps: 5,
    heading: 'Basic details',
    fields: [
      { id: 'name', label: 'Name', value: '', placeholder: 'Placeholder text', required: true },
      { id: 'description', label: 'Description', value: '', placeholder: 'Placeholder text', required: true },
      { id: 'contacts', label: 'Contacts', value: 'Kadji Bell (You)', required: true, suggested: true },
      { id: 'consent-type', label: 'Consent type', value: 'Tracker consent', required: true, suggested: true },
      { id: 'target-country-region', label: 'Target country/region', value: 'United States', required: true, suggested: true },
      { id: 'default-language', label: 'Default language', value: 'English - U.S.', required: true, suggested: true },
      { id: 'expires-after', label: 'Expires after', value: '12', unit: 'Months', required: true, suggested: true }
    ]
  },

  // Frame 5 — wizard step 2 of 5, "Layout".
  'wizard-layout': {
    title: 'New consent model',
    subtitle: 'Consent Management',
    step: 2,
    totalSteps: 5,
    heading: 'Layout',
    intro: 'Select a layout template for this model and enter layout properties.',
    // ONE field, three options — the shape the shell needs for the pick to
    // stick. `value` is the current choice and `recommended` is the one
    // Copilot proposed, so overriding the suggestion moves the tick without
    // erasing what was suggested.
    fields: [
      {
        id: 'layout',
        label: 'Layout',
        value: 'layout-banner-light',
        recommended: 'layout-banner-light',
        suggested: true,
        options: [
          {
            id: 'layout-modal-light',
            label: 'Modal light mode (1 page)',
            description: 'Floating pop-up to Allow or Deny.',
            previewLabel: 'Preview',
            image: 'assets/61bfa871e7cb.png'
          },
          {
            id: 'layout-banner-light',
            label: 'Banner light mode (2 pages)',
            description: 'Blocking banner with hyperlink to second page.',
            previewLabel: 'Preview',
            note: 'Supports CA "Do Not Sell" requirement.',
            image: 'assets/90e9e2597fc2.png'
          },
          {
            id: 'layout-banner-dark',
            label: 'Banner dark mode (2 pages)',
            description: 'Blocking banner with hyperlink to second page.',
            previewLabel: 'Preview',
            image: 'assets/4cb4f9a92f10.png'
          }
        ]
      }
    ]
  },

  // Frame 6 — wizard step 3 of 5, "Link". RULING 7: the inventory's intro
  // line ("Enter the basic details for this consent model.") was copy-pasted
  // from step 1 and does not describe this step; corrected minimally to name
  // the step it actually belongs to.
  'wizard-link': {
    title: 'New consent model',
    subtitle: 'Consent Management',
    step: 3,
    totalSteps: 5,
    intro: 'Enter the link details for this consent model.',
    subsectionHeading: 'Link',
    subsectionIntro: 'Edit the contents of each section of the link.',
    fields: [
      { id: 'source-language', label: 'Source language', value: 'English - en', required: true, suggested: true },
      { id: 'link-description', label: 'Description', value: 'Do not sell my personal information', section: 'link', suggested: true },
      { id: 'link-customize-button', label: 'Customize button', value: 'Opt out', section: 'link', suggested: true }
    ]
  },

  // Frame 7 — wizard step 4 of 5, "Preferences". RULING 7: the inventory's
  // heading ("Basic details") was copy-pasted from step 1; corrected minimally
  // to name this step, mirroring the "basic" -> "link" fix on step 3.
  // RULING 6: the "Opt out" and "Save button" values below use the chat pane's
  // self-consistent values ("Opt out", "Save") rather than Frame 7's own
  // swapped field values ("United States", "English - U.S.").
  'wizard-preferences': {
    title: 'New consent model',
    subtitle: 'Consent Management',
    step: 4,
    totalSteps: 5,
    heading: 'Preferences details',
    subsectionHeading: 'Preferences',
    subsectionIntro: 'Edit the contents of each section of the preferences.',
    fields: [
      { id: 'source-language', label: 'Source language', value: 'English - en', required: true, suggested: true },
      { id: 'preferences-description', label: 'Description', value: '', placeholder: 'Enter text...', section: 'preferences' },
      { id: 'preferences-opt-out', label: 'Opt out', value: 'Opt out', section: 'preferences', suggested: true },
      { id: 'preferences-save-button', label: 'Save button', value: 'Save', section: 'preferences', suggested: true }
    ]
  },

  // Frame 8 — wizard step 5 of 5, preview of the resulting cookie banner.
  'wizard-preview': {
    title: 'New consent model',
    subtitle: 'Consent Management',
    step: 5,
    totalSteps: 5,
    heading: 'Preview and customize consent model.',
    links: ['Cookie Policy'],
    fields: [
      { id: 'preview-address', label: 'Address', value: 'microsoft.com' },
      {
        id: 'preview-banner-text',
        label: 'Banner text',
        value: 'This website uses cookies and similar files to enable and improve the use of the website by personalizing content and ads, providing social media features and analyzing our traffic. We also share information about your use of our site with our partners. Review our Cookie Policy to learn more and to manage your preferences. By clicking on the "Accept all" button, you consent to the use of analytics and other files on your device.'
      },
      { id: 'preview-accept-all', label: 'Accept all button', value: 'Accept all' },
      { id: 'preview-decline-all', label: 'Decline all button', value: 'Decline all' },
      { id: 'preview-manage-preferences', label: 'Manage preferences link', value: 'Manage preferences' }
    ]
  },

  /* ================================================================
     Scenario 2.1 — SRR Top Compliance Issues.
     Source: docs/superpowers/notes/figma-scenario-2-1.md (verbatim
     transcription of Figma frames 1:67165, 1:67371, 1:67788, 1:67810,
     1:67834, 1:67859, 1:92886 and the shared card 1:67901).
     ================================================================ */

  // Frame 1:67788 — the "Privacy requests summary" answer. `breadcrumb` is
  // carried on the message rather than typed, because this scenario opens by
  // drilling into a risk card: there is no user turn to read a query off.
  'srr-answer': {
    // CORRECTION B7: the design's breadcrumb and prompt row read "2 weeks"
    // here while the dashboard row and this answer's own body text both say
    // "15 days" — reconciled on "15 days", the dashboard's figure (the
    // data surface), since the two readings were evenly split. See
    // docs/superpowers/notes/figma-scenario-2-1.md B7.
    breadcrumb: 'Details on risk: 15 requests with deadlines approaching in next 15 days',
    sectionHeading: 'Privacy requests summary',
    promptRow: 'Summarize 15 subject rights requests with deadlines approaching in next 15 days with a table that lists requests ',
    sourcesLabel: 'Sources',
    // CORRECTION B2: the design's only citation named "Privacy Assessments"
    // on an answer entirely about Subject Rights Requests — almost certainly
    // a copy/paste from the Privacy Assessments scenario. Re-pointed at the
    // solution this answer is actually drawn from, using the scenario's own
    // bare solution name (it already appears twice elsewhere in this
    // scenario: the Tasks panel subtitle and the chat reply's closing line,
    // "...from the Subject Rights Requests solution."). No name is invented.
    // See docs/superpowers/notes/figma-scenario-2-1.md B2.
    citations: ['Subject Rights Requests'],
    text: "15 soon expiring privacy requests from Subject Rights Request were found with request deadlines approaching within the next 15 days.\n\n- Impacts individuals' rights and expectations regarding their personal data.\n- Timely response crucial to maintaining regulatory compliance and fostering trust.\n- Failure to address promptly may result in legal consequences and reputational damage.\n\nSee below for a few of the requests expiring soonest:",
    toc: {
      heading: 'Suggested topics',
      items: ['Privacy requests summary', 'Subject Rights Requests reports', '+ Add topic'],
      selected: 'Privacy requests summary'
    },
    // Request names are links in the design with no destination in any frame
    // (Reword R1), so the shell renders them inert.
    // CORRECTION B9: this table spelled the contact/assignee "Daisy Philips"
    // (one L) in the design, while Frame 7's email spells the same person
    // "Daisy Phillips" (two Ls, confirmed against the raw asset — see the
    // scenario's B11 entry). Standardised on the two-L spelling here.
    // See docs/superpowers/notes/figma-scenario-2-1.md B9.
    table: {
      columns: ['Request name', 'Status', 'Action assigned to', 'Response deadline', 'Contact'],
      sortColumns: [0, 1, 2, 3, 4],
      rows: [
        [
          { text: 'John Doe - Export', link: true },
          { text: 'Not started', status: 'neutral' },
          { text: '-' },
          { text: '4/23/2024 11:16 AM' },
          { text: 'Dataownergroup', avatar: 'DG' }
        ],
        [
          { text: 'John Doe - Delete', link: true },
          { text: 'Active', status: 'info', icon: 'refresh' },
          { text: 'System' },
          { text: '4/23/2024 11:16 AM' },
          { text: 'Dataownergroup', avatar: 'DG' }
        ],
        [
          { text: 'Jerome Bell - Export', link: true },
          { text: 'Active', status: 'info', icon: 'refresh' },
          { text: 'Data subject' },
          { text: '4/23/2024 11:16 AM' },
          { text: 'Dataownergroup', avatar: 'DG' }
        ],
        [
          { text: 'Dianne Russell - Export', link: true },
          { text: 'Active', status: 'info', icon: 'refresh' },
          { text: 'Daisy Phillips', avatar: 'DP' },
          { text: '4/23/2024 11:16 AM' },
          { text: 'Daisy Phillips', avatar: 'DP' }
        ],
        [
          { text: 'Kathryn Murphy - Export', link: true },
          { text: 'Active', status: 'info', icon: 'refresh' },
          { text: 'Henry Brill', avatar: 'HB' },
          { text: '4/23/2024 11:16 AM' },
          { text: 'Lilly Georgsen', avatar: 'LG' }
        ],
        [
          { text: 'Kristin Watson - Export', link: true },
          { text: 'Active', status: 'info', icon: 'refresh' },
          { text: 'Daisy Phillips', avatar: 'DP' },
          { text: '4/23/2024 11:16 AM' },
          { text: 'Kat Larrson', avatar: 'KL' }
        ]
      ]
    }
  },

  // Frame 1:67788's "Suggested actions" card. Its body text is the same
  // string the dialog replays as the user's prompt in Frame 1:67810.
  'action-card-srr-tasks': {
    header: 'Priva Subject Rights Requests',
    body: '15 incomplete tasks from requests expiring soon',
    buttons: ['View tasks']
  },

  // Frame 1:67810 — the dialog's chat pane. "Request name:" is placeholder
  // copy the design repeats three times with no destination; transcribed
  // verbatim and rendered inert (Reword R1). `suggestion` is the chip the
  // next beat sends.
  'srr-tasks-reply': {
    text: 'Here’s the 3 Subject Rights Requests with the nearest deadlines:',
    steps: [
      { label: 'Request name:', text: 'This request is not started and the deadline was on 03/28/2024.' },
      { label: 'Request name:', text: 'This request is in progress and the deadline was on 03/28/2024.' },
      { label: 'Request name:', text: 'This request is in progress and the deadline was on 04/01/2024.' }
    ],
    outro: 'Here’s the list of tasks for these requests from the Subject Rights Requests solution.',
    suggestion: 'Generate a summary email for the owners of those tasks'
  },

  // Frame 1:67810 — the dialog's right half. Thirteen rows are authored; the
  // design clips at eleven (ambiguity B10), so the panel scrolls rather than
  // dropping any. Row 3's status is authored pre-truncated (B4).
  'srr-tasks-panel': {
    title: 'Tasks',
    subtitle: 'Subject Rights Requests',
    filters: [
      { label: 'Response deadline', value: 'Overdue' },
      { label: 'Assigned to', value: 'All' }
    ],
    count: '21 items',
    filterPlaceholder: 'Filter by keyword',
    table: {
      columns: ['Task name', 'Status', 'Request type', 'Assigned to', 'Response deadline'],
      sortColumns: [0],
      rows: [
        [{ text: 'SRR Export Customer', link: true }, { text: 'In progress', status: 'info', icon: 'refresh' }, { text: 'Export' }, { text: 'John Doe', avatar: 'JD' }, { text: '10/08/2023, 6:27 PM' }],
        [{ text: 'SRR Export', link: true }, { text: 'Not started', status: 'neutral' }, { text: 'Export' }, { text: 'John Doe', avatar: 'JD' }, { text: '10/21/2023, 2:00 AM' }],
        [{ text: 'Export Request', link: true }, { text: 'Completed; Awaitin...', status: 'info', icon: 'check' }, { text: 'Export' }, { text: 'Cameron Williamson', avatar: 'CW' }, { text: '8/21/2023, 9:43 AM' }],
        [{ text: 'DSAR - Delete', link: true }, { text: 'Completed; Awaiting approval', status: 'info', icon: 'check' }, { text: 'Delete' }, { text: '-', avatar: '' }, { text: '10/31/2023, 10:00 AM' }],
        [{ text: 'DSAR - Delete', link: true }, { text: 'Failed', status: 'danger', icon: 'close' }, { text: 'Delete' }, { text: 'Wade Warren', avatar: 'WW' }, { text: '7/14/2023, 5:15 PM' }],
        [{ text: 'DSAR - Delete', link: true }, { text: 'Not applicable', status: 'danger', icon: 'dash' }, { text: 'Export' }, { text: 'John Doe', avatar: 'JD' }, { text: '8/21/2023, 9:43 AM' }],
        [{ text: 'DSAR - Export', link: true }, { text: 'Reopened', status: 'info', icon: 'refresh' }, { text: 'Export' }, { text: 'John Doe', avatar: 'JD' }, { text: '8/21/2023, 9:43 AM' }],
        [{ text: 'DSAR - Delete', link: true }, { text: 'Not started', status: 'neutral' }, { text: 'Delete' }, { text: '-', avatar: '' }, { text: '10/31/2023, 10:00 AM' }],
        [{ text: 'DSAR - Delete', link: true }, { text: 'Approved', status: 'success', icon: 'check' }, { text: 'Delete' }, { text: 'John Doe', avatar: 'JD' }, { text: '7/14/2023, 5:15 PM' }],
        [{ text: 'DSAR - Export', link: true }, { text: 'Approved', status: 'success', icon: 'check' }, { text: 'Export' }, { text: 'John Doe', avatar: 'JD' }, { text: '8/21/2023, 9:43 AM' }],
        [{ text: 'DSAR - Export', link: true }, { text: 'Approved', status: 'success', icon: 'check' }, { text: 'Export' }, { text: 'John Doe', avatar: 'JD' }, { text: '10/08/2023, 6:27 PM' }],
        [{ text: 'DSAR - Export', link: true }, { text: 'Approved', status: 'success', icon: 'check' }, { text: 'Export' }, { text: 'Cameron Williamson', avatar: 'CW' }, { text: '10/31/2023, 10:00 AM' }],
        [{ text: 'DSAR - Export', link: true }, { text: 'Approved', status: 'success', icon: 'check' }, { text: 'Export' }, { text: 'Jenny Wilson', avatar: 'JW' }, { text: '7/14/2023, 5:15 PM' }]
      ]
    }
  },

  // Frame 1:67859 / shared card 1:67901. This card is the only one in the
  // file with no "Show process" row, hence the explicit opt-out.
  'srr-email-card': {
    text: 'Here’s a generated summary email of incomplete tasks. Open to verify items and send via email:',
    emailCard: {
      title: 'SRR summary email',
      subtitle: 'Incomplete tasks due soon '
    },
    showProcess: false
  },

  // Frame 1:92886 — the draft, open in Outlook. This frame is two flattened
  // screenshots with no text layers; every string below was transcribed from
  // the raster at full resolution (ambiguity B11).
  'srr-email-draft': {
    windowTitle: 'Untitled - Message',
    tabs: ['Message', 'Insert', 'Format text', 'Options'],
    fontName: 'Aptos',
    fontSize: '12',
    send: 'Send',
    from: 'From: kat@contoso.com',
    to: 'To',
    cc: 'Cc',
    bcc: 'Bcc',
    subjectPlaceholder: 'Add a subject',
    savedNote: 'Draft saved at 11:00 AM',
    brand: 'Microsoft',
    banner: 'Important',
    heading: 'Subject rights request summary email to owners',
    // A literal authoring placeholder, square brackets and all (Reword R3).
    description: '[Description text goes here]',
    columns: ['Owner', 'Tasks left', 'Deadline'],
    groups: [
      {
        label: 'Subject rights request 1',
        rows: [
          { name: 'David Power', initials: 'DP', tasks: '3', deadline: '03/08/2024' },
          { name: 'Daisy Phillips', initials: 'DP', tasks: '1', deadline: '03/08/2024' }
        ]
      },
      {
        label: 'Subject rights request 2',
        rows: [
          { name: 'David Power', initials: 'DP', tasks: '5', deadline: '03/08/2024' },
          { name: 'Kevin Sturgis', initials: 'KS', tasks: '2', deadline: '03/08/2024' }
        ]
      },
      {
        label: 'Subject rights request 3',
        rows: [
          { name: 'Daisy Phillips', initials: 'DP', tasks: '8', deadline: '03/08/2024' },
          { name: 'Kadji Bell', initials: 'KB', tasks: '4', deadline: '03/08/2024' },
          { name: 'Oscar Krogh', initials: 'OK', tasks: '3', deadline: '03/08/2024' }
        ]
      }
    ],
    cta: 'Open Microsoft Priva',
    // One sentence, split only so the link run keeps its own styling.
    footerBefore: 'Sent by ',
    footerLink: 'Microsoft Email Orchestrator',
    footerAfter: ', a compliant and secure email platform for the Microsoft Cloud',
    privacyLink: 'Privacy Statement'
  },

  /* ================================================================
     Scenario 2.2 — Tracker Scanning Top Compliance Issues.
     Source: docs/superpowers/notes/figma-scenario-2-2.md (verbatim
     transcription of Figma frames 1:67517, 1:67388, 1:67487, 1:67427,
     1:67457 and the shared output card 1:67901).

     The scenario enters on the same `risks` dashboard scenario 2.1
     built: frame 1:67517 is a second, less-resolved copy of 1:67165
     (placeholder chips, a repeated Recent rail), and the one row this
     flow clicks is byte-identical in both. See ambiguity B1.
     ================================================================ */

  // Frame 1:67388 — the "Missing privacy statements" answer.
  'tracker-answer': {
    // CORRECTION B3: the design's breadcrumb here read "What are the
    // California privacy consent laws for websites" — scenario 1's query,
    // pasted onto a Tracker Scanning answer. Frames 1:67487-1:67457 show
    // the intended crumb (node 1:67464), which is also the dashboard risk
    // row this flow clicks, word for word. No value is invented.
    // See docs/superpowers/notes/figma-scenario-2-2.md B3.
    breadcrumb: '1 privacy statement detected missing during a recent scan of contoso.com',
    sectionHeading: 'Missing privacy statements',
    // CORRECTION B4: the design read "Provide a additional details on..." —
    // an article left behind by an edit. The stray "a" is deleted and
    // nothing else is touched. See figma-scenario-2-2.md B4.
    promptRow: 'Provide additional details on the missing privacy statement detected during a scan of contoso.com',
    sourcesLabel: 'Sources',
    citations: ['Tracker Scanning'],
    // The blank lines are authored as zero-width-space paragraphs in the
    // layer; transcribed as ordinary blank lines. "websites that have
    // recently scanned" is the design's own wording (ambiguity B10) and is
    // left exactly as authored.
    text: 'The scans conducted on Contoso.com and Contosopromos.com indicated that the location value provided for the privacy statement was not detected. This suggests that these websites may need to review and update their privacy statements to ensure they are providing the necessary location information.\n\nOn 5 other websites, the location value provided was detected and deemed accurate.\n- Contosopromos.com\n- Contoso.fr\n- Contoso.co.uk\n- Contosomarketing.com\n- Contoso.ca\n\nBelow is a list of all websites that have recently scanned for privacy statements:',
    toc: {
      heading: 'Suggested topics',
      items: ['Missing privacy statements', 'Contoso.com scan details', 'Legal implications', '+ Add topic'],
      selected: 'Missing privacy statements'
    },
    // Website names are plain text here, not links (contrast scenario 2.1's
    // request table). Every "Crawl definition" value is authored
    // pre-truncated, row 1 with four dots where row 2 has three (B7), and
    // the scan times mix 12-hour, 24-hour and no meridiem at all, three of
    // them with a trailing space (B8). All transcribed as authored.
    table: {
      columns: ['Website name', 'Crawl definition', 'Scan region', 'Scan status', 'Scan result', 'Last scan time'],
      sortColumns: [0],
      rows: [
        [
          { text: 'Contoso.com' },
          { text: 'Cookies, Privacy statement....' },
          { text: 'West US' },
          { text: 'Complete', status: 'info', icon: 'check' },
          { text: 'Failed', status: 'danger', icon: 'close' },
          { text: '4/1/2024, 4:45 ' }
        ],
        [
          { text: 'Contosopromos.com' },
          { text: 'Cookies, Privacy statement...' },
          { text: 'West US' },
          { text: 'Complete', status: 'info', icon: 'check' },
          { text: 'Succeeded', status: 'success', icon: 'check' },
          { text: '3/28/2024, 11:00 AM' }
        ],
        [
          { text: 'Contoso.fr' },
          { text: 'Privacy statement, Consent...' },
          { text: 'EU' },
          { text: 'Complete', status: 'info', icon: 'check' },
          { text: 'Succeeded', status: 'success', icon: 'check' },
          { text: '3/18/2024, 20:45' }
        ],
        [
          { text: 'Contoso.co.uk' },
          { text: 'Pixels, Privacy statement, C...' },
          { text: 'East US' },
          { text: 'Complete', status: 'info', icon: 'check' },
          { text: 'Succeeded', status: 'success', icon: 'check' },
          { text: '3/12/2024, 16:00' }
        ],
        [
          { text: 'Contosomarketing.com' },
          { text: 'Privacy statement, Reject all...' },
          { text: 'EU' },
          { text: 'Complete', status: 'info', icon: 'check' },
          { text: 'Succeeded', status: 'success', icon: 'check' },
          { text: '3/7/2024, 17:15 ' }
        ],
        [
          { text: 'Contoso.ca' },
          { text: 'Privacy statement, Consent...' },
          { text: 'West US' },
          { text: 'Complete', status: 'info', icon: 'check' },
          { text: 'Succeeded', status: 'success', icon: 'check' },
          { text: '2/22/2024, 14:45 ' }
        ]
      ]
    }
  },

  // Frame 1:67388's "Suggested actions" card. Its "Review scan" button is
  // the hotspot that opens the dialog; unlike scenario 2.1's card, its body
  // text is NOT what the dialog replays as the prompt.
  'action-card-tracker-scan': {
    header: 'Priva Tracker Scanning',
    body: 'Review scan configuration for Contoso.com',
    buttons: ['Review scan']
  },

  // Frame 1:67487 — the dialog's chat pane. The design answers one prompt
  // with THREE separate output cards (ambiguity B13), so the turn carries a
  // `cards` array. None of them has a "Show process" row.
  'tracker-scan-reply': {
    showProcess: false,
    cards: [
      {
        text: 'In the most recent scan for 5 websites a different location path was used for the privacy statement. ',
        value: '//*[@id="c-uhff-footer_privacyandcookies"]/a',
        valueAction: 'Hide value'
      },
      {
        text: 'The location path used in this scan matches the correctly scanned one found in other websites. This scan seems up to date, and problem may be in the website itself.'
      },
      {
        // Lower-case "teams" is the design's own; the chip below answers this
        // question with "email". Both transcribed verbatim — see B5.
        text: 'Would you like me to generate a teams message to the website owner summarizing the issue?'
      }
    ],
    suggestion: 'Yes, generate email'
  },

  // Frame 1:67487 — the dialog's right half. A third panel type after the
  // wizard and the list: a tabbed scan editor, open on tab 3. `kind` picks
  // the renderer, so no scenario id is hard-coded in the shell.
  'tracker-scan-panel': {
    kind: 'scan',
    title: 'Contoso.com – Scan 2',
    // Authored as an ordered list — the numbers are list markers, not copy.
    tabs: ['Basic details', 'Authentication steps', 'Scan definition', 'Scan trigger'],
    activeTab: 'Scan definition',
    intro: 'Select the items you want to scan for across your website.',
    introLink: 'Learn more',
    sections: [
      {
        heading: 'Trackers and tags',
        text: 'Select the trackers and tags you want to scan for and whether to capture associated tags and relationships.',
        expanded: false
      },
      {
        heading: 'Compliance objects',
        // No terminating full stop — as authored.
        text: 'Select or unselect the compliance objects you want to scan for. If anything is missing, you can also manually add compliance objects to scan for',
        expanded: true
      }
    ],
    addObject: 'Add compliance object',
    // CORRECTION B9: all three panel copies of the location path were
    // authored with a literal space ("c-uhff footer_..."), while the chat
    // card writes the same value with a hyphen. The design's own copy says
    // the two "match", and a space cannot appear inside a single HTML id
    // token, so the hyphenated form — the design's own string — is used in
    // all four places. See figma-scenario-2-2.md B9.
    objects: [
      {
        label: '“Privacy statement” link',
        checked: true,
        highlight: true,
        fieldLabel: 'Location path',
        value: '//*[@id="c-uhff-footer_privacyandcookies"]/a',
        detectedLabel: 'Copilot detected:',
        detected: '//*[@id="c-uhff-footer_privacyandcookies"]/a',
        note: 'Based on other recent scans, the location path seems to be up to date in this scan. '
      },
      {
        label: 'Consent banner',
        checked: true,
        fieldLabel: 'Location path',
        value: '//*[@id="c-uhff-footer_privacyandcookies"]/a'
      },
      { label: '“Cookie policy” link', checked: false, fieldLabel: 'Location path', placeholder: 'Add location path' },
      { label: '“Do not sell” link', checked: false, fieldLabel: 'Location path', placeholder: 'Add location path' },
      { label: '“Accept all” button', checked: false, fieldLabel: 'Location path', placeholder: 'Add location path' },
      { label: '“Reject all” button', checked: false, fieldLabel: 'Location path', placeholder: 'Add location path' }
    ]
  },

  // Frame 1:67457 / shared card 1:67901 — the same component scenario 2.1's
  // email card uses, re-skinned with the Teams product mark. Terminal: the
  // tile's open glyph is drawn but no frame follows it (B12).
  'tracker-teams-card': {
    text: 'Here’s a generated summary teams message of compliance issues for the websites. Open to verify items and send via teams:',
    emailCard: {
      title: 'Website summary ',
      subtitle: 'Compliance issues listed out',
      icon: 'teams'
    },
    showProcess: false
  },

  /* ---------------------------------------------------------------- *
   * Scenario 3 — Privacy Assessments, "Generate Data Inventory / RoPA".
   * Source: docs/superpowers/notes/figma-scenario-3.md (frames 1:67565,
   * 1:67584, 1:67760, 1:67601, 1:67629).
   * ---------------------------------------------------------------- */

  // Frame 1:67760 — the answer page as first generated. Carries a `toc`, so
  // splitChat files it as the PAGE's answer rather than a chat-pane message.
  //
  // The citations are numbered 1 and 3, not 1 and 2: the design skips 2. They
  // are authored as objects so the data states the number the design shows,
  // instead of the renderer inferring it from array position and quietly
  // renumbering dw.com to 2.
  //
  // `toc.hotspot` names the item beat 2 arms. The selector for it lives only
  // in HOTSPOTS.answer — the data says WHICH item is clickable, never what
  // its id is.
  'answer-france-legal': {
    sectionHeading: 'Legal framework and authorities',
    promptRow: 'Explain the legal considerations behind documenting personal data in France',
    sourcesLabel: 'Sources',
    citations: [
      { label: 'iclg.com', index: 1 },
      { label: 'dw.com', index: 3 }
    ],
    text: 'In France, documenting personal data involves adhering to specific legal requirements. Let\u2019s explore the key aspects:\n\nRelevant Legislation and Competent Authorities:\n\n- The General Data Protection Regulation (GDPR), effective since May 25, 2018, is the principal data protection legislation in the EU.\n- In France, the French Data Protection Act (FDPA) has been in force since January 6, 1978. It was amended in 2018 to align with GDPR requirements under French law.\n- Other relevant legislation includes the ePrivacy Directive, which governs electronic communications, and various regulations related to data processing, security, and individual rights1',
    // The design bolds the three named instruments inside the bullets.
    emphasis: [
      'General Data Protection Regulation (GDPR)',
      'French Data Protection Act (FDPA)',
      'ePrivacy Directive'
    ],
    toc: {
      heading: 'Suggested topics',
      items: [
        'Legal framework and authorities',
        'Data principles and definitions',
        'Compliance requirements',
        'Specific considerations',
        'Enforcement and sanctions',
        '+ Add topic'
      ],
      selected: 'Legal framework and authorities',
      hotspot: 'Compliance requirements'
    }
  },

  // Frame 1:67601 — the same page after "Compliance requirements" is picked.
  // Pushed as a second page answer, not merged into the first: the design
  // REPLACES the body, and renderAnswerPage shows the newest page answer.
  //
  // AMBIGUITY B14, left as designed: the heading still reads "Legal framework
  // and authorities" even though the selected topic is now "Compliance
  // requirements". Confirmed in the node, not just the render. Either the
  // heading is the answer's overall title and is meant to stay, or it was not
  // updated — the frames do not settle it, so it is reproduced rather than
  // "fixed". One string to flip if that call changes.
  'answer-france-compliance': {
    sectionHeading: 'Legal framework and authorities',
    promptRow: 'Explain the legal considerations behind documenting personal data in France',
    sourcesLabel: 'Sources',
    citations: [
      { label: 'iclg.com', index: 1 },
      { label: 'dw.com', index: 3 }
    ],
    text: 'Territorial Scope:\n- Both GDPR and FDPA apply to all sectors in France.\n\nKey Principles:\n- Data processing must be lawful, fair, and transparent.\n- Data minimization: Collect only necessary data.\n- Purpose limitation: Use data only for specified purposes.\n- Accuracy: Ensure data accuracy and update as needed.\n- Storage limitation: Retain data for the necessary period.\n- Security: Protect data against unauthorized access or breaches.\n\nIndividual Rights:\n- Individuals have rights to access, rectify, erase, and restrict processing of their data.\n- They can also object to processing and request data portability.\n\nRegistration Formalities and Prior Approval:\n- Organizations processing personal data may need to register with the French data protection authority (CNIL).',
    toc: {
      heading: 'Suggested topics',
      items: [
        'Legal framework and authorities',
        'Data principles and definitions',
        'Compliance requirements',
        'Specific considerations',
        'Enforcement and sanctions',
        '+ Add topic'
      ],
      selected: 'Compliance requirements',
      // Frame 1:67601 shows BOTH generated topics with the refresh glyph,
      // only one of which is selected.
      generated: ['Legal framework and authorities', 'Compliance requirements']
    }
  },

  // Frame 1:67760's suggested-action card. Its button is NOT armed — beat 2
  // arms the topic rail instead — so this key is absent from ACTION_HOTSPOT
  // and the button renders inert.
  'action-card-ropa': {
    header: 'Privacy Assessments',
    body: 'Create a summary for processing activities in France',
    buttons: ['Create processing activity summary']
  },

  // Frame 1:67601's card. RULING R6: the header really does gain its "Priva "
  // prefix between the two frames, matching the convention the other
  // scenarios' cards already use, so both states are authored and beat 2
  // swaps them. RULING R5: the panel LABEL above the card is not swapped —
  // frame 1:67601 alone calls it "Suggested Priva tasks" where every other
  // frame in every scenario says "Suggested actions", and it is one shared
  // string (COPY.suggestedActions).
  'action-card-ropa-assessments': {
    header: 'Priva Privacy Assessments',
    body: 'Create a summary for processing activities in France using relevant assessments.',
    buttons: ['Create processing activity summary']
  },

  // Frame 1:67629's chat pane. RULING R3: the design's last bullet reads
  // "(1 or more may apply" with no closing bracket — unbalanced within the
  // string itself, and its sibling "(1 or more)" closes correctly, so this is
  // a confirmed slip rather than a suspected one.
  'ropa-report-reply': {
    text: 'For an EU-GDPR data inventory the following fields will be included:',
    bullets: [
      'Processing Activity',
      'Department',
      'Name of Asset',
      'Asset Internal Contact',
      'Categories of personal data',
      'Third party transfer categories (1 or more)',
      'Data boundary involved',
      'Data Retention (highest for group)',
      'Lawful basis of processing (1 or more may apply)'
    ],
    showProcess: true
  },

  // Frame 1:67629's right half. `kind` picks the renderer, same convention as
  // scenario 2.2's scan panel.
  //
  // RULING R1: the nav rail lists nine steps and the design authors five
  // blocks, of which blocks 4 and 5 repeat block 3's answer verbatim — the
  // asset list, pasted under "Asset internal contacts" and "Categories of
  // personal data". That is unfinished filler. The rail stays verbatim at
  // nine because it is a real artifact of the design; the body stops after
  // block 3, where the authored content stops. Nothing is invented to fill
  // the gap, and the design's own frame clips at roughly the same place.
  //
  // RULING R2: block 3's heading is "Name of asssts" in the design. Corrected
  // to "Name of assets" — nav step 3 and the chat pane's field list both
  // disagree with the misspelling, which makes it confirmed, not suspected.
  'ropa-report-panel': {
    kind: 'report',
    title: 'France Processing Activity Summary \u2013 April 3/2024',
    steps: [
      '1: Processing activity summary',
      '2: Department',
      '3: Name of assets',
      '4: Asset internal contacts',
      '5: Categories of personal data',
      '6: Third party transfer categories',
      '7: Data boundary',
      '8: Data retention',
      '9: Lawful basis of processing'
    ],
    riskLabel: 'Risk level: ',
    riskValue: 'Low \u2013 Sensitive data',
    blocks: [
      {
        heading: 'Processing activity',
        body: 'Employee data is collected and processed for the purposes of employee payroll, health & benefits processing, and internal surveys. Partner data is collected for the purposes of providing services to customers and for billing purposes. Customer data is collected and processed for business needs such as to track active orders, process payments or refunds, and troubleshoot order issues with support teams. Customer data is collected with consent to send promotional emails, inform customers of relevant product updates or news, and to share with affiliates based on selected preferences.'
      },
      {
        heading: 'Department',
        body: 'Marketing, HR-Payroll, HR-Records mgmt, Order fulfillment, Billing, Product promotions team, Customer care support'
      },
      {
        heading: 'Name of assets',
        body: 'Workpay, CRM tool, Sellingforce, TrackShip, PaymentApp, CampaignMgr, SupportTktSystem'
      }
    ]
  }
};

export const SCENARIOS = [
  {
    id: 'consent',
    label: '1 — Summarize consent laws + create draft model',
    product: 'Consent Management',
    initial: { view: 'home' },
    beats: [
      // Frames 1 -> 2 -> 3. RULING 3: no Frame 1 chip matches Frame 2's
      // breadcrumb query, so the opening beat is the user typing that query
      // (verbatim) into the prompt bar and sending it. RULING 4: Frame 2's
      // timed loading state folds in here as the `thinking` pause rather than
      // a beat of its own.
      {
        spotlight: '#prompt-bar',
        await: 'click',
        then: {
          type: { into: '#prompt-bar', text: 'What are the California privacy consent laws for websites', when: 'before' },
          thinking: 1200,
          push: { chat: 'answer-ccpa' },
          set: { view: 'answer', actionCard: 'action-card-pending' }
        }
      },
      // Frame 3 -> 4. Click "Generate draft" on the suggested-action card;
      // the dialog opens replaying the prompt that produced it, the assistant
      // summarizes its 11 suggestions, and the wizard opens pre-filled on
      // step 1.
      {
        spotlight: '#generate-draft-button',
        await: 'click',
        then: {
          type: { into: '#copilot-chat-input', text: 'Create a consent model for my website in California', when: 'after' },
          push: { chat: 'wizard-suggestions-summary' },
          set: { view: 'dialog' },
          populate: { wizard: 'wizard-basic-details' }
        }
      },
      // Frame 4 -> 5.
      {
        spotlight: '#wizard-next',
        await: 'click',
        then: { populate: { wizard: 'wizard-layout' } }
      },
      // Frame 5 -> 6.
      {
        spotlight: '#wizard-next',
        await: 'click',
        then: { populate: { wizard: 'wizard-link' } }
      },
      // Frame 6 -> 7.
      {
        spotlight: '#wizard-next',
        await: 'click',
        then: { populate: { wizard: 'wizard-preferences' } }
      },
      // Frame 7 -> 8.
      {
        spotlight: '#wizard-next',
        await: 'click',
        then: { populate: { wizard: 'wizard-preview' } }
      },
      // Frame 8 -> 9. "Save and close" closes the dialog; back on the answer
      // page, the suggested-action card now shows its completed state.
      // RULING 5: Frame 9 is terminal — its "Open" button has no destination
      // in this scenario, so no further beat is authored to arm it.
      {
        spotlight: '#wizard-save-close',
        await: 'click',
        then: { set: { view: 'answer', actionCard: 'action-card-completed', wizard: null } }
      }
    ]
  },

  {
    id: 'srr',
    label: '2.1 — SRR top compliance issues',
    product: 'Subject Rights Requests',
    initial: { view: 'risks' },
    beats: [
      // Frames 1:67165 -> 1:67371 -> 1:67788. The flow opens by drilling into
      // a risk row, not by typing: Frame 1:67371's breadcrumb reads "Details
      // on risk: ...", which is a drill-in crumb rather than a query, so this
      // beat has no `type` clause and the answer carries its own breadcrumb.
      // Frame 1:67371's loading state folds in as the `thinking` pause, the
      // same way scenario 1 folds 1:67354.
      {
        spotlight: '#srr-risk-card',
        await: 'click',
        then: {
          thinking: 1200,
          push: { chat: 'srr-answer' },
          set: { view: 'answer', actionCard: 'action-card-srr-tasks' }
        }
      },
      // Frame 1:67788 -> 1:67810. "View tasks" opens the dialog: the action
      // card's body text is replayed as the user's prompt (when: 'after', so
      // it types into the chat input the dialog has only just drawn), Copilot
      // answers, and the Tasks panel fills the dialog's right half.
      {
        spotlight: '#view-tasks-button',
        await: 'click',
        then: {
          type: { into: '#copilot-chat-input', text: '15 incomplete tasks from requests expiring soon', when: 'after' },
          push: { chat: 'srr-tasks-reply' },
          set: { view: 'dialog', panel: 'srr-tasks-panel' }
        }
      },
      // Frames 1:67810 -> 1:67834 -> 1:67859. Sending the suggested-prompt
      // chip. `when: 'before'` because the design shows the prompt typed and
      // sent from the dialog it is already in, and only then the latency card
      // (Frame 1:67834) resolving into the email card — so the typing has to
      // play before the pause, not after it.
      {
        spotlight: '#chat-suggestion',
        await: 'click',
        then: {
          type: { into: '#copilot-chat-input', text: 'Generate a summary email for the owners of those tasks', when: 'before' },
          thinking: 1200,
          push: { chat: 'srr-email-card' }
        }
      },
      // Frame 1:67859 -> 1:92886. The open glyph on the "SRR summary email"
      // tile leaves Priva for the draft in Outlook. Terminal: Frame 1:92886
      // has no onward frame in this scenario.
      {
        spotlight: '#email-card-open',
        await: 'click',
        then: { set: { view: 'email', draft: 'srr-email-draft' } }
      }
    ]
  },

  {
    id: 'tracker',
    label: '2.2 — Tracker Scanning top compliance issues',
    product: 'Tracker Scanning',
    initial: { view: 'risks' },
    beats: [
      // Frames 1:67517 -> 1:67388. Drilling into the "Tracker Scanning" risk
      // row, not typing — the answer carries its own breadcrumb, exactly as
      // scenario 2.1 does. This scenario has no loading frame of its own
      // (contrast 1:67371), but the pause is still played here as the
      // `thinking` value so the answer does not appear instantaneously.
      {
        spotlight: '#tracker-risk-card',
        await: 'click',
        then: {
          thinking: 1200,
          push: { chat: 'tracker-answer' },
          set: { view: 'answer', actionCard: 'action-card-tracker-scan' }
        }
      },
      // Frame 1:67388 -> 1:67487. "Review scan" opens the dialog: the chat
      // pane replays the user's prompt, Copilot answers in three cards, and
      // the scan configuration editor fills the right half. `when: 'after'`
      // because #copilot-chat-input only exists once this beat's `set` has
      // opened the dialog. Note the prompt is NOT the action card's body
      // text (contrast scenario 2.1) — the design gives it its own wording.
      {
        spotlight: '#review-scan-button',
        await: 'click',
        then: {
          type: { into: '#copilot-chat-input', text: 'Check for recent updates made to scans', when: 'after' },
          push: { chat: 'tracker-scan-reply' },
          set: { view: 'dialog', panel: 'tracker-scan-panel' }
        }
      },
      // Frames 1:67487 -> 1:67427 -> 1:67457. Sending the suggested-prompt
      // chip. `when: 'before'` because the design types and sends from the
      // dialog it is already in, and only then shows the latency card
      // (1:67427) resolving into the Teams message card (1:67457) — so the
      // typing plays before the pause, not after it. The text typed is the
      // user bubble the design draws, which is not the chip's own label
      // (ambiguity B5). Terminal: 1:67457 has no onward frame, so the
      // card's open glyph is drawn but never armed (B12).
      {
        spotlight: '#chat-suggestion',
        await: 'click',
        then: {
          type: { into: '#copilot-chat-input', text: 'Generate a summary message for the website owners.', when: 'before' },
          thinking: 1200,
          push: { chat: 'tracker-teams-card' }
        }
      }
    ]
  },

  {
    id: 'ropa',
    label: '3 \u2014 Generate data inventory / RoPA',
    product: 'Privacy Assessments',
    initial: { view: 'home' },
    beats: [
      // Frames 1:67565 -> 1:67584 -> 1:67760. The entry is the PROMPT BAR,
      // not a risk card: frame 1:67584's breadcrumb carries the query and no
      // chip on 1:67565 matches it, so the opening beat is the user typing it
      // — scenario 1's reading exactly. Frame 1:67584 is the timed loading
      // state, folded in here as the `thinking` pause rather than a beat.
      {
        spotlight: '#prompt-bar',
        await: 'click',
        then: {
          type: { into: '#prompt-bar', text: 'How do I document personal data in France', when: 'before' },
          thinking: 1200,
          push: { chat: 'answer-france-legal' },
          set: { view: 'answer', actionCard: 'action-card-ropa' }
        }
      },
      // Frame 1:67760 -> 1:67601. Picking a second topic from the rail. This
      // is the only beat in the prototype whose target is a topic rather than
      // a button, and the only one that replaces the page's answer instead of
      // adding to it — the push lands a second PAGE answer and the newest
      // one is what renders.
      //
      // No loading frame sits between 1:67760 and 1:67601, but the pause is
      // played anyway: the rail marks a generated topic with a refresh glyph,
      // so a topic arriving instantly would contradict the design's own
      // affordance. Same call as scenario 2.2's opening beat.
      {
        spotlight: '#toc-topic',
        await: 'click',
        then: {
          thinking: 1200,
          push: { chat: 'answer-france-compliance' },
          set: { actionCard: 'action-card-ropa-assessments' }
        }
      },
      // Frames 1:67601 -> 1:67629. "Create processing activity summary" opens
      // the dialog: the chat pane replays the prompt, Copilot lists the nine
      // fields, and the RoPA report fills the right half. `when: 'after'`
      // because #copilot-chat-input only exists once this beat's `set` has
      // opened the dialog.
      //
      // The design's user bubble has a trailing space ("...summary "), which
      // is dropped here — it would type as an invisible extra keystroke and
      // changes nothing anyone can see. Recorded in the inventory.
      //
      // Terminal: 1:67629 has no onward frame, so no beat follows and
      // "Open in Privacy Assessments" is drawn but never armed.
      {
        spotlight: '#create-summary-button',
        await: 'click',
        then: {
          type: { into: '#copilot-chat-input', text: 'Create an EU-GDPR processing activity summary', when: 'after' },
          push: { chat: 'ropa-report-reply' },
          set: { view: 'dialog', panel: 'ropa-report-panel' }
        }
      }
    ]
  }
];
