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
  }
];
