import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    defaultColumns: ['name', 'title', 'enabled', 'required'],
    group: 'Cookie Consent Manager',
    listSearchableFields: ['name', 'title'],
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      admin: {
        description:
          'Unique identifier for the category (e.g., "necessary", "analytics", "marketing")',
        placeholder: 'e.g., necessary, analytics, marketing',
      },
      label: 'Name',
      maxLength: 50,
      required: true,
      unique: true,
      validate: (value: null | string | undefined) => {
        if (!value) {
          return true
        } // Required validation handles empty values
        if (typeof value === 'string' && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
          return 'Name must be lowercase letters, numbers, and hyphens only (e.g., "analytics", "social-media")'
        }
        return true
      },
    },
    {
      name: 'title',
      type: 'text',
      admin: {
        placeholder: 'e.g., Analytics Cookies, Marketing Cookies',
      },
      label: 'Title',
      localized: true,
      maxLength: 100,
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        placeholder:
          'Explain what this category of cookies does and why users might want to enable/disable them...',
        rows: 4,
      },
      label: 'Description',
      localized: true,
      maxLength: 500,
      required: true,
    },
    {
      type: 'collapsible',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          admin: {
            description: 'If false, the category will not be used in the cookie consent banner.',
          },
          defaultValue: true,
          label: 'Enabled Category',
        },
        {
          name: 'required',
          type: 'checkbox',
          admin: {
            description:
              '⚠️ Enabling this option marks the category as required. Required categories cannot be disabled or removed by the user. This setting should ONLY be used for strictly necessary categories, such as those essential for the website to function. Marking analytics, marketing, or other non-essential categories as required is a violation of GDPR and other privacy regulations, potentially leading to legal repercussions. We strongly recommend leaving this option unchecked unless you have a specific, legitimate need and have consulted with a legal professional to ensure compliance.',
          },
          defaultValue: false,
          label: 'Mark as Required (Essential Cookies)',
        },
      ],
      label: '⚙️ Category Settings',
    },
  ],
  versions: {
    drafts: true,
  },
}
