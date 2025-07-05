import type { Payload } from 'payload'

import type { CookieConsentSettings } from '../globals/types.js'

import { COLLECTION_SLUGS } from '../constants/defaults.js'

export class CookieConsentSettingsRepository {
  constructor(private readonly payload: Payload) {}

  async findSettings(locale?: string): Promise<CookieConsentSettings | null> {
    try {
      const result = await this.payload.findGlobal({
        slug: COLLECTION_SLUGS.COOKIE_CONSENT_SETTINGS,
        depth: 1, // Need depth 1 to get category relationship data
        locale,
      })

      if (!result) {
        return null
      }

      return result as unknown as CookieConsentSettings
    } catch (error) {
      throw new Error(
        `Failed to fetch cookie consent settings: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }
  }

  async updateRevision(newRevision: number, locale?: string): Promise<void> {
    try {
      await this.payload.updateGlobal({
        slug: COLLECTION_SLUGS.COOKIE_CONSENT_SETTINGS,
        data: { revision: newRevision },
        locale,
      })
    } catch (error) {
      throw new Error(
        `Failed to update revision: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }
  }
}
