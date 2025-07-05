import type { Payload } from 'payload'

import type { ConsentEvent, ConsentRecord } from '../collections/types.js'

export class ConsentRecordRepository {
  constructor(private readonly payload: Payload) {}

  /**
   * Add a new consent event for a given consentId. If the record does not exist, create it.
   * @param consentId Unique identifier for the user/session
   * @param event The consent event to add
   * @returns The updated or created ConsentRecord
   */
  async addConsentEvent(consentId: string, event: ConsentEvent): Promise<ConsentRecord> {
    // Try to find the existing record
    const existing = await this.payload.find({
      collection: 'consent-records',
      limit: 1,
      where: { consentId: { equals: consentId } },
    })
    if (existing.docs.length > 0) {
      // Update: push new event
      const record = existing.docs[0] as unknown as ConsentRecord
      const updated = await this.payload.update({
        id: (record as any).id,
        collection: 'consent-records',
        data: {
          newEvent: event,
        },
      })
      return updated as unknown as ConsentRecord
    } else {
      // Create new record
      const created = await this.payload.create({
        collection: 'consent-records',
        data: {
          consentId,
          events: [event],
        },
      })
      return created as unknown as ConsentRecord
    }
  }
}
