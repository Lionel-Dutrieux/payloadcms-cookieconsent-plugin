import type { CollectionConfig } from 'payload'

export const ConsentRecords: CollectionConfig = {
  slug: 'consent-records',
  admin: {
    defaultColumns: ['consentId', 'timestamp', 'acceptedCategories', 'ipAddress'],
    description: 'GDPR-compliant storage of user cookie consent preferences',
    group: 'Cookie Consent',
    listSearchableFields: ['consentId', 'ipAddress'],
    useAsTitle: 'consentId',
  },
  fields: [
    {
      name: 'consentId',
      type: 'text',
      admin: {
        description: 'Unique identifier for this consent instance',
        readOnly: true,
      },
      index: true,
      label: 'Consent ID',
      required: true,
      unique: true,
    },
    {
      name: 'timestamp',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        description: 'When the consent was given (ISO 8601 format)',
        readOnly: true,
      },
      label: 'Consent Timestamp',
      required: true,
    },
    {
      name: 'expiresAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        description: 'When this consent expires and needs to be renewed',
        readOnly: true,
      },
      label: 'Expires At',
      required: true,
    },
    {
      name: 'acceptedCategories',
      type: 'json',
      admin: {
        description: 'Array of category names that were accepted by the user',
      },
      label: 'Accepted Categories',
      required: true,
    },
    {
      name: 'ipAddress',
      type: 'text',
      admin: {
        description: 'IP address for legal compliance (GDPR evidence)',
        placeholder: '192.168.1.1',
      },
      label: 'IP Address',
      maxLength: 45, // IPv6 support
    },
    {
      name: 'userAgent',
      type: 'textarea',
      admin: {
        description: 'Browser information for consent verification',
        rows: 2,
      },
      label: 'User Agent',
      maxLength: 500,
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        // Set timestamp for new records
        if (operation === 'create' && !data.timestamp) {
          data.timestamp = new Date().toISOString()
        }

        // Calculate expiration date if not set (12 months default)
        if (operation === 'create' && !data.expiresAt) {
          const expirationDate = new Date()
          expirationDate.setFullYear(expirationDate.getFullYear() + 1)
          data.expiresAt = expirationDate.toISOString()
        }

        return data
      },
    ],
  },
  timestamps: true, // Enable createdAt and updatedAt
  versions: {
    drafts: false, // Consent records should not have drafts
  },
}
