import type { CollectionConfig } from 'payload'

export const ConsentRecords: CollectionConfig = {
  slug: 'consent-records',
  access: {
    create: () => true,
    delete: () => false, // GDPR: no deletion
    read: () => true,
    update: () => true,
  },
  admin: {
    defaultColumns: [
      'user',
      'consentId',
      'lastModified',
      'createdAt',
      'eventsCount',
      'acceptedCategoriesCount',
      'rejectedCategoriesCount',
    ],
    group: 'Cookie Consent Manager',
    useAsTitle: 'consentId',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'user',
          type: 'relationship',
          admin: { readOnly: true },
          hasMany: false,
          label: 'User',
          relationTo: 'users',
          required: false,
        },
        {
          name: 'consentId',
          type: 'text',
          admin: { readOnly: true },
          index: true,
          label: 'Consent ID',
          required: true,
          unique: true,
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'createdAt',
          type: 'date',
          admin: { readOnly: true },
          label: 'Consent Created At',
          required: true,
        },
        {
          name: 'lastModified',
          type: 'date',
          admin: { readOnly: true },
          label: 'Last Modified At',
          required: true,
        },
      ],
    },
    {
      name: 'events',
      type: 'array',
      admin: { readOnly: true },
      fields: [
        {
          name: 'timestamp',
          type: 'date',
          admin: { readOnly: true },
          label: 'Event Timestamp',
          required: true,
        },
        {
          name: 'action',
          type: 'select',
          admin: { readOnly: true },
          label: 'Consent Action',
          options: [
            { label: 'Granted', value: 'granted' },
            { label: 'Modified', value: 'modified' },
            { label: 'Withdrawn', value: 'withdrawn' },
            { label: 'Renewed', value: 'renewed' },
          ],
          required: true,
        },
        {
          name: 'acceptedCategories',
          type: 'json',
          admin: { readOnly: true },
          label: 'Accepted Categories',
          required: true,
        },
        {
          name: 'rejectedCategories',
          type: 'json',
          admin: { readOnly: true },
          label: 'Rejected Categories',
          required: false,
        },
        {
          name: 'acceptType',
          type: 'text',
          admin: { readOnly: true },
          label: 'Consent Accept Type',
          required: true,
        },
        {
          name: 'userAgent',
          type: 'textarea',
          admin: { readOnly: true, rows: 2 },
          label: 'User Agent',
          required: false,
        },
        {
          name: 'ipAddress',
          type: 'text',
          admin: { readOnly: true },
          label: 'IP Address (anonymized)',
          required: false,
        },
      ],
      label: 'Consent Events History',
      minRows: 1,
      required: true,
    },
    {
      name: 'eventsCount',
      type: 'number',
      admin: { hidden: true, readOnly: true },
      hooks: {
        afterRead: [({ data }) => (data?.events ? data.events.length : 0)],
      },
      label: 'Event Count',
      virtual: true,
    },
    {
      name: 'acceptedCategoriesCount',
      type: 'number',
      admin: { hidden: true, readOnly: true },
      hooks: {
        afterRead: [
          ({ data }) => {
            if (!data?.events || !Array.isArray(data.events) || data.events.length === 0) {
              return 0
            }
            // Take the last event (most recent)
            const last = data.events[data.events.length - 1]
            return Array.isArray(last.acceptedCategories) ? last.acceptedCategories.length : 0
          },
        ],
      },
      label: 'Accepted Categories Count',
      virtual: true,
    },
    {
      name: 'rejectedCategoriesCount',
      type: 'number',
      admin: { hidden: true, readOnly: true },
      hooks: {
        afterRead: [
          ({ data }) => {
            if (!data?.events || !Array.isArray(data.events) || data.events.length === 0) {
              return 0
            }
            const last = data.events[data.events.length - 1]
            return Array.isArray(last.rejectedCategories) ? last.rejectedCategories.length : 0
          },
        ],
      },
      label: 'Rejected Categories Count',
      virtual: true,
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation, req }) => {
        if (req?.user) {
          data.user = req.user.id || req.user._id
        }
        const now = new Date().toISOString()
        if (operation === 'create') {
          data.createdAt = now
          data.lastModified = now
          if (!data.events || data.events.length === 0) {
            data.events = [
              {
                acceptedCategories: data.acceptedCategories || [],
                acceptType: data.acceptType || 'custom',
                action: 'granted',
                ipAddress: data.ipAddress || '',
                rejectedCategories: data.rejectedCategories || [],
                timestamp: now,
                userAgent: data.userAgent || '',
              },
            ]
          }
        } else if (operation === 'update') {
          data.lastModified = now
          // Add a new event, do not modify previous ones
          if (data.newEvent) {
            data.events = [...(data.events || []), { ...data.newEvent, timestamp: now }]
            delete data.newEvent
          }
        }
        return data
      },
    ],
  },
  labels: {
    plural: 'Consents',
    singular: 'Consent',
  },
  timestamps: false, // We handle createdAt/lastModified manually
  versions: false, // No Payload drafts/versions
}
