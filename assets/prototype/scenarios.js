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
    fields: [
      {
        id: 'layout-modal-light',
        label: 'Modal light mode (1 page)',
        value: 'Floating pop-up to Allow or Deny.',
        previewLabel: 'Preview',
        image: 'assets/61bfa871e7cb.png'
      },
      {
        id: 'layout-banner-light',
        label: 'Banner light mode (2 pages)',
        value: 'Blocking banner with hyperlink to second page.',
        previewLabel: 'Preview',
        suggested: true,
        note: 'Supports CA "Do Not Sell" requirement.',
        image: 'assets/90e9e2597fc2.png'
      },
      {
        id: 'layout-banner-dark',
        label: 'Banner dark mode (2 pages)',
        value: 'Blocking banner with hyperlink to second page.',
        previewLabel: 'Preview',
        image: 'assets/4cb4f9a92f10.png'
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
          type: { into: '#prompt-bar', text: 'What are the California privacy consent laws for websites' },
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
          type: { into: '#copilot-chat-input', text: 'Create a consent model for my website in California' },
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
  }
];
