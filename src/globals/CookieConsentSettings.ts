import type { GlobalConfig } from 'payload'

export const CookieConsentSettings: GlobalConfig = {
  slug: 'cookie-consent-settings',
  admin: {
    group: 'Settings',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'autoShow',
                  type: 'checkbox',
                  admin: {
                    description: 'Automatically show the consent modal if consent is not valid',
                    width: '50%',
                  },
                  defaultValue: true,
                  label: 'Auto Show Banner',
                },
                {
                  name: 'hideFromBots',
                  type: 'checkbox',
                  admin: {
                    description: 'Hide banner from search engines and crawlers',
                    width: '50%',
                  },
                  defaultValue: true,
                  label: 'Hide From Bots',
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'disablePageInteraction',
                  type: 'checkbox',
                  admin: {
                    description: 'Block user interaction with the page until consent is given',
                    width: '50%',
                  },
                  defaultValue: false,
                  label: 'Disable Page Interaction',
                },
                {
                  name: 'mode',
                  type: 'select',
                  admin: {
                    description: 'GDPR compliance: opt-in is recommended for EU users',
                    width: '50%',
                  },
                  defaultValue: 'opt-in',
                  label: 'Consent Mode',
                  options: [
                    {
                      label: 'Opt-in (GDPR Compliant)',
                      value: 'opt-in',
                    },
                    {
                      label: 'Opt-out',
                      value: 'opt-out',
                    },
                  ],
                },
              ],
            },
            {
              name: 'revision',
              type: 'number',
              admin: {
                description:
                  '⚠️ Auto-increments when you publish changes. This forces users to re-accept consent. Make sure to update your privacy policy and cookie information before publishing!',
                readOnly: true,
              },
              defaultValue: 0,
              label: 'Consent Revision (Auto-increment)',
              min: 0,
            },
            // Cookie Settings
            {
              type: 'collapsible',
              admin: {
                initCollapsed: true,
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'cookieName',
                      type: 'text',
                      admin: {
                        description: 'Name of the consent cookie',
                        placeholder: 'cc_cookie',
                        width: '33%',
                      },
                      defaultValue: 'cc_cookie',
                      label: 'Cookie Name',
                    },
                    {
                      name: 'cookieDomain',
                      type: 'text',
                      admin: {
                        description: 'Cookie domain (leave empty for current domain)',
                        placeholder: '.example.com',
                        width: '33%',
                      },
                      label: 'Cookie Domain',
                    },
                    {
                      name: 'cookiePath',
                      type: 'text',
                      admin: {
                        description: 'Cookie path',
                        placeholder: '/',
                        width: '34%',
                      },
                      defaultValue: '/',
                      label: 'Cookie Path',
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'cookieSameSite',
                      type: 'select',
                      admin: {
                        description: 'SameSite attribute for enhanced security',
                        width: '50%',
                      },
                      defaultValue: 'Lax',
                      label: 'SameSite Attribute',
                      options: [
                        { label: 'Lax (Recommended)', value: 'Lax' },
                        { label: 'Strict', value: 'Strict' },
                        { label: 'None', value: 'None' },
                      ],
                    },
                    {
                      name: 'cookieExpiresAfterDays',
                      type: 'number',
                      admin: {
                        description: 'Days before consent expires',
                        placeholder: '182',
                        width: '50%',
                      },
                      defaultValue: 182,
                      label: 'Cookie Expires After (days)',
                      max: 3650,
                      min: 1,
                    },
                  ],
                },
              ],
              label: '🍪 Advanced Cookie Settings',
            },
          ],
          label: '⚙️ General Settings',
        },
        {
          fields: [
            {
              name: 'consentModal',
              type: 'group',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'layout',
                      type: 'select',
                      admin: {
                        description: 'Visual style of the cookie banner',
                        width: '50%',
                      },
                      defaultValue: 'cloud inline',
                      label: 'Layout Style',
                      options: [
                        { label: 'Box', value: 'box' },
                        { label: 'Cloud', value: 'cloud' },
                        { label: 'Cloud Inline (Recommended)', value: 'cloud inline' },
                        { label: 'Bar', value: 'bar' },
                        { label: 'Bar Inline', value: 'bar inline' },
                      ],
                    },
                    {
                      name: 'position',
                      type: 'select',
                      admin: {
                        description: 'Where the banner appears on screen',
                        width: '50%',
                      },
                      defaultValue: 'bottom center',
                      label: 'Screen Position',
                      options: [
                        { label: 'Top Left', value: 'top left' },
                        { label: 'Top Center', value: 'top center' },
                        { label: 'Top Right', value: 'top right' },
                        { label: 'Bottom Left', value: 'bottom left' },
                        { label: 'Bottom Center (Recommended)', value: 'bottom center' },
                        { label: 'Bottom Right', value: 'bottom right' },
                        { label: 'Middle Left', value: 'middle left' },
                        { label: 'Middle Center', value: 'middle center' },
                        { label: 'Middle Right', value: 'middle right' },
                      ],
                    },
                  ],
                },
                {
                  name: 'title',
                  type: 'text',
                  admin: {
                    placeholder: 'e.g., We use cookies, Cookie Notice, Privacy Notice',
                  },
                  defaultValue: 'We use cookies',
                  label: 'Banner Title',
                  localized: true,
                  maxLength: 100,
                  required: true,
                },
                {
                  name: 'description',
                  type: 'textarea',
                  admin: {
                    placeholder: 'Explain why you use cookies and how they benefit users...',
                    rows: 3,
                  },
                  defaultValue:
                    'We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic.',
                  label: 'Banner Description',
                  localized: true,
                  maxLength: 300,
                  required: true,
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'acceptAllBtn',
                      type: 'text',
                      admin: {
                        placeholder: 'e.g., Accept all, OK, Got it',
                        width: '50%',
                      },
                      defaultValue: 'Accept all',
                      label: 'Accept All Button',
                      localized: true,
                      maxLength: 50,
                    },
                    {
                      name: 'acceptNecessaryBtn',
                      type: 'text',
                      admin: {
                        placeholder: 'e.g., Reject all, Only necessary',
                        width: '50%',
                      },
                      defaultValue: 'Reject all',
                      label: 'Reject All Button',
                      localized: true,
                      maxLength: 50,
                    },
                  ],
                },
                {
                  name: 'showPreferencesBtn',
                  type: 'text',
                  admin: {
                    placeholder: 'e.g., Manage preferences, Customize',
                  },
                  defaultValue: 'Manage preferences',
                  label: 'Manage Preferences Button',
                  localized: true,
                  maxLength: 50,
                },
                {
                  type: 'collapsible',
                  admin: {
                    initCollapsed: true,
                  },
                  fields: [
                    {
                      name: 'equalWeightButtons',
                      type: 'checkbox',
                      admin: {
                        description: 'Make all buttons the same size for a cleaner look',
                      },
                      defaultValue: true,
                      label: 'Equal Weight Buttons',
                    },
                    {
                      name: 'flipButtons',
                      type: 'checkbox',
                      admin: {
                        description: 'Reverse the order of the buttons (Accept/Reject positions)',
                      },
                      defaultValue: false,
                      label: 'Flip Button Order',
                    },
                  ],
                  label: '⚙️ Advanced Options',
                },
              ],
              label: '🍪 Cookie Banner Settings',
            },
            {
              name: 'preferencesModal',
              type: 'group',
              fields: [
                {
                  name: 'layout',
                  type: 'select',
                  admin: {
                    description: 'Style for the detailed preferences modal',
                  },
                  defaultValue: 'box',
                  label: 'Modal Layout',
                  options: [
                    { label: 'Box (Recommended)', value: 'box' },
                    { label: 'Bar', value: 'bar' },
                  ],
                },
                {
                  name: 'title',
                  type: 'text',
                  admin: {
                    placeholder: 'e.g., Cookie preferences, Privacy settings',
                  },
                  defaultValue: 'Manage cookie preferences',
                  label: 'Modal Title',
                  localized: true,
                  maxLength: 100,
                  required: true,
                },
                {
                  name: 'closeIconLabel',
                  type: 'text',
                  admin: {
                    description: 'Accessibility label for the close button',
                    placeholder: 'e.g., Close modal, Close dialog',
                  },
                  defaultValue: 'Close modal',
                  label: 'Close Button Label',
                  localized: true,
                  maxLength: 50,
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'acceptAllBtn',
                      type: 'text',
                      admin: {
                        placeholder: 'e.g., Accept all, Enable all',
                        width: '50%',
                      },
                      defaultValue: 'Accept all',
                      label: 'Accept All Button',
                      localized: true,
                      maxLength: 50,
                    },
                    {
                      name: 'acceptNecessaryBtn',
                      type: 'text',
                      admin: {
                        placeholder: 'e.g., Reject all, Disable all',
                        width: '50%',
                      },
                      defaultValue: 'Reject all',
                      label: 'Reject All Button',
                      localized: true,
                      maxLength: 50,
                    },
                  ],
                },
                {
                  name: 'savePreferencesBtn',
                  type: 'text',
                  admin: {
                    placeholder: 'e.g., Save settings, Apply choices',
                  },
                  defaultValue: 'Save preferences',
                  label: 'Save Preferences Button',
                  localized: true,
                  maxLength: 50,
                },
                {
                  name: 'serviceCounterLabel',
                  type: 'text',
                  admin: {
                    description: 'Label for service counter (use | to separate singular/plural)',
                  },
                  defaultValue: 'Service|Services',
                  label: 'Service Counter Label',
                  localized: true,
                },
                {
                  type: 'collapsible',
                  admin: {
                    initCollapsed: true,
                  },
                  fields: [
                    {
                      name: 'equalWeightButtons',
                      type: 'checkbox',
                      admin: {
                        description: 'Make all buttons the same size for a cleaner look',
                      },
                      defaultValue: true,
                      label: 'Equal Weight Buttons',
                    },
                    {
                      name: 'flipButtons',
                      type: 'checkbox',
                      admin: {
                        description: 'Reverse the order of the buttons (Accept/Reject positions)',
                      },
                      defaultValue: false,
                      label: 'Flip Button Order',
                    },
                  ],
                  label: '⚙️ Advanced Options',
                },
              ],
              label: '⚙️ Preferences Modal Settings',
            },
          ],
          label: '🎨 UI Configuration',
        },
        {
          fields: [
            {
              name: 'scripts',
              type: 'array',
              admin: {
                components: {
                  RowLabel: 'payloadcms-cookieconsent-plugin/client/ScriptRowLabel',
                },
                description: 'Manage all tracking scripts and their categories in one place',
              },
              fields: [
                {
                  name: 'service',
                  type: 'text',
                  admin: {
                    description:
                      'Name of the service or tool (e.g., "Google Analytics", "Facebook Pixel")',
                    placeholder: 'e.g., Google Analytics, Facebook Pixel, Hotjar',
                    width: '50%',
                  },
                  label: 'Service Name',
                  maxLength: 100,
                  required: true,
                  validate: (value: null | string | undefined) => {
                    if (!value) {
                      return 'Service name is required'
                    }
                    if (typeof value === 'string' && value.trim().length < 2) {
                      return 'Service name must be at least 2 characters long'
                    }
                    return true
                  },
                },
                {
                  name: 'category',
                  type: 'relationship',
                  admin: {
                    description: 'Select the cookie category this script belongs to',
                    width: '50%',
                  },
                  hasMany: false,
                  label: 'Cookie Category',
                  relationTo: 'categories',
                  required: true,
                },
                {
                  name: 'html',
                  type: 'code',
                  admin: {
                    description:
                      'The complete HTML script tag or tracking code. Include <script> tags if needed.',
                    language: 'html',
                  },
                  label: 'Script Code',
                  required: true,
                  validate: (value: null | string | undefined) => {
                    if (!value) {
                      return 'Script code is required'
                    }
                    if (typeof value === 'string' && value.trim().length < 10) {
                      return 'Script code seems too short. Please provide the complete script.'
                    }
                    return true
                  },
                },
                {
                  name: 'enabled',
                  type: 'checkbox',
                  admin: {
                    description:
                      'If disabled, this script will not be loaded even if the user accepts its category.',
                  },
                  defaultValue: true,
                  label: 'Enable Script',
                },
              ],
              label: '📜 Scripts',
              minRows: 0,
            },
          ],
          label: '📜 Scripts Management',
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, req }) => {
        // Auto-increment revision on publish (not on draft saves)
        if (req.data && req.data._status !== 'draft') {
          // Only increment if not saving as draft
          data.revision = (data.revision || 0) + 1
        }
        return data
      },
    ],
  },
  versions: {
    drafts: true,
    max: 0,
  },
}
