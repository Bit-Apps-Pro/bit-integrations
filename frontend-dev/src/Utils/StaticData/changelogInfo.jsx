const changelogInfo = {
  '2.2.0': {
    date: '15-July-2023',
    changes: {
      added: {
        label: 'Added',
        list: [
          {
            label: 'New Field',
            tag: 'new',
            list: [
              'Repeater Field - to create repeated forms with complex conditional logics calculation',
            ],
          },
          {
            label: 'Features',
            list: [
              {
                label: 'Form Abandonment or Partial Form Submission',
                tag: 'new',
              },
              {
                label: 'Pdf Attachment of Form Entry in Email Notifications',
                tag: 'new',
              },
            ],
          },
        ],
      },
      fixed: {
        label: 'Fixed',
        list: [
          'Form entry edit route 404 issue',
          "Forms not initializing on Elementor page builder's modal",
          'Telegram Integration issue regarding multiple uploaded files',
          'MailerLite Integration timeline log issue',
          'Zoho workdrive integration next button disabled issue',
          'Country field default value issue from Conditional Logics',
          'bitform_dequeue_styles hook issue with form ids',
          'Deprycated notice from shortcode function if form content is empty',
          'alt attribute not updating from custom attribute settings',
        ],
      },
    },
  },
  '2.11.0': {
    date: '18 April, 2024',
    changes: {
      added: {
        label: 'Added',
        list: [
          {
            label: (<b> Slider(range) filed</b>),
            tag: 'new',
            list: [
              'Added a slider field to allow users to select a range of values',
            ],
          },
        ],
      },
      fixed: {
        label: 'Fixed',
        list: [
          'Resolve API issue with Brevo integration.',
          'Fixed issue with checkbox and radio field actions in Conversational Form.',
        ],
      },
      coming: {
        label: <b>Coming Soon</b>,
        list: [
          'Frontend Entry View, Edit & Delete (CRUD).',
          'Molie Payment Gateway Integration',
          'Form Templates',
        ],
      },
    },
  },
  '2.10.0': {
    date: '12 February, 2024',
    changes: {
      added: {
        label: 'Added',
        list: [
          {
            label: (<b>Conversational Form</b>),
            tag: 'new',
            list: [
              'Easily convert your standard forms into conversational experiences with just one click',
            ],
          },
        ],
      },
      imporovement: {
        label: 'Improvement',
        list: [
          'Added missing functionality to automatically populate placeholders based on conditional logic onload.',
          'Included missing Smart Tags (such as calc and count) in PHP.',
          'Enabled workflow actions triggered upon form submission via API.',
        ],
      },
      fixed: {
        label: 'Fixed',
        list: [
          'Resolved issue with previous saved data initialization in WP Auth (Registration, Login, Forgot Password) Page.',
          'Fixed problem with empty values in exported entries for file upload and signature fields.',
        ],
      },
      coming: {
        label: <b>Coming Soon</b>,
        list: [
          'Frontend Entry View, Edit & Delete (CRUD)',
        ],
      },
    },
  },
}

export default changelogInfo
