import type { Payload } from 'payload'

import { COLLECTION_SLUGS } from '../../constants/defaults.js'

export interface ConsentRecordDocument {
  acceptedCategories: string[]
  acceptType: 'all' | 'custom' | 'necessary'
  consentData?: {
    cookieDomain?: string
    cookieName?: string
    cookiePath?: string
  }
  consentId: string
  createdAt: string
  expiresAt: string
  id: string
  ipAddress?: string
  isValid: boolean
  legalBasis: 'consent' | 'legitimate_interest' | 'necessary'
  locale: string
  rejectedCategories: string[]
  revision: number
  source: 'api' | 'banner' | 'preferences_modal'
  timestamp: string
  updatedAt: string
  userAgent?: string
  userId?: string
}

export class ConsentRecordRepository {
  /**
   * Creates a new consent record
   */
  static async create(
    payload: Payload,
    consentRecord: Omit<ConsentRecordDocument, 'createdAt' | 'id' | 'updatedAt'>,
  ): Promise<ConsentRecordDocument> {
    const result = await payload.create({
      collection: COLLECTION_SLUGS.CONSENT_RECORDS,
      data: consentRecord,
    })

    return result as ConsentRecordDocument
  }

  /**
   * Finds consent records by consent ID
   */
  static async findByConsentId(
    payload: Payload,
    consentId: string,
  ): Promise<ConsentRecordDocument | null> {
    const result = await payload.find({
      collection: COLLECTION_SLUGS.CONSENT_RECORDS,
      limit: 1,
      where: {
        consentId: {
          equals: consentId,
        },
      },
    })

    return result.docs.length > 0 ? (result.docs[0] as ConsentRecordDocument) : null
  }

  /**
   * Finds consent records by IP address
   */
  static async findByIpAddress(
    payload: Payload,
    ipAddress: string,
    isValid = true,
  ): Promise<ConsentRecordDocument[]> {
    const result = await payload.find({
      collection: COLLECTION_SLUGS.CONSENT_RECORDS,
      sort: '-timestamp',
      where: {
        and: [
          {
            ipAddress: {
              equals: ipAddress,
            },
          },
          {
            isValid: {
              equals: isValid,
            },
          },
        ],
      },
    })

    return result.docs as ConsentRecordDocument[]
  }

  /**
   * Finds consent records by user ID
   */
  static async findByUserId(
    payload: Payload,
    userId: string,
    isValid = true,
  ): Promise<ConsentRecordDocument[]> {
    const result = await payload.find({
      collection: COLLECTION_SLUGS.CONSENT_RECORDS,
      sort: '-timestamp',
      where: {
        and: [
          {
            userId: {
              equals: userId,
            },
          },
          {
            isValid: {
              equals: isValid,
            },
          },
        ],
      },
    })

    return result.docs as ConsentRecordDocument[]
  }

  /**
   * Finds expired consent records
   */
  static async findExpired(payload: Payload): Promise<ConsentRecordDocument[]> {
    const now = new Date().toISOString()

    const result = await payload.find({
      collection: COLLECTION_SLUGS.CONSENT_RECORDS,
      where: {
        and: [
          {
            expiresAt: {
              less_than: now,
            },
          },
          {
            isValid: {
              equals: true,
            },
          },
        ],
      },
    })

    return result.docs as ConsentRecordDocument[]
  }

  /**
   * Gets consent statistics for reporting
   */
  static async getConsentStatistics(
    payload: Payload,
    startDate?: string,
    endDate?: string,
  ): Promise<{
    byAcceptType: Record<string, number>
    byLegalBasis: Record<string, number>
    bySource: Record<string, number>
    total: number
  }> {
    const whereCondition: any = {}

    if (startDate || endDate) {
      whereCondition.timestamp = {}
      if (startDate) {
        whereCondition.timestamp.greater_than_equal = startDate
      }
      if (endDate) {
        whereCondition.timestamp.less_than_equal = endDate
      }
    }

    const result = await payload.find({
      collection: COLLECTION_SLUGS.CONSENT_RECORDS,
      limit: 10000, // Adjust based on needs
      where: whereCondition,
    })

    const records = result.docs as ConsentRecordDocument[]

    return {
      byAcceptType: records.reduce(
        (acc, record) => {
          acc[record.acceptType] = (acc[record.acceptType] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      ),
      byLegalBasis: records.reduce(
        (acc, record) => {
          acc[record.legalBasis] = (acc[record.legalBasis] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      ),
      bySource: records.reduce(
        (acc, record) => {
          acc[record.source] = (acc[record.source] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      ),
      total: records.length,
    }
  }

  /**
   * Invalidates old consent records for a user (when they give new consent)
   */
  static async invalidateOldRecords(
    payload: Payload,
    userId?: string,
    ipAddress?: string,
  ): Promise<void> {
    const whereCondition: any = {
      isValid: {
        equals: true,
      },
    }

    if (userId) {
      whereCondition.userId = {
        equals: userId,
      }
    } else if (ipAddress) {
      whereCondition.ipAddress = {
        equals: ipAddress,
      }
    } else {
      throw new Error('Either userId or ipAddress must be provided')
    }

    // Find existing valid records
    const existingRecords = await payload.find({
      collection: COLLECTION_SLUGS.CONSENT_RECORDS,
      where: whereCondition,
    })

    // Invalidate them
    for (const record of existingRecords.docs) {
      await payload.update({
        id: record.id,
        collection: COLLECTION_SLUGS.CONSENT_RECORDS,
        data: {
          isValid: false,
        },
      })
    }
  }

  /**
   * Marks expired consent records as invalid
   */
  static async markExpiredAsInvalid(payload: Payload): Promise<number> {
    const expiredRecords = await this.findExpired(payload)

    for (const record of expiredRecords) {
      await payload.update({
        id: record.id,
        collection: COLLECTION_SLUGS.CONSENT_RECORDS,
        data: {
          isValid: false,
        },
      })
    }

    return expiredRecords.length
  }
}
