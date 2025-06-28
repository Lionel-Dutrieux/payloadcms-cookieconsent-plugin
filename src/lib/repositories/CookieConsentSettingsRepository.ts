import type { Payload } from 'payload'

import { COLLECTION_SLUGS } from '../../constants/defaults.js'

export interface ScriptDocument {
  category: {
    id: string
    name: string
  }
  enabled: boolean
  html: string
  service: string
}

export interface ConsentModalDocument {
  acceptAllBtn: string
  acceptNecessaryBtn: string
  description: string
  equalWeightButtons: boolean
  flipButtons: boolean
  layout: 'bar' | 'bar inline' | 'box' | 'cloud' | 'cloud inline'
  position: string
  showPreferencesBtn: string
  title: string
}

export interface PreferencesModalDocument {
  acceptAllBtn: string
  acceptNecessaryBtn: string
  closeIconLabel: string
  equalWeightButtons: boolean
  flipButtons: boolean
  layout: 'bar' | 'box'
  savePreferencesBtn: string
  serviceCounterLabel: string
  title: string
}

export interface CookieConsentSettingsDocument {
  autoShow: boolean
  consentModal: ConsentModalDocument
  cookieDomain?: string
  cookieExpiresAfterDays: number
  cookieName: string
  cookiePath: string
  cookieSameSite: 'Lax' | 'None' | 'Strict'
  createdAt: string
  disablePageInteraction: boolean
  hideFromBots: boolean
  id: string
  mode: 'opt-in' | 'opt-out'
  preferencesModal: PreferencesModalDocument
  revision: number
  scripts: ScriptDocument[]
  updatedAt: string
}

export class CookieConsentSettingsRepository {
  constructor(private readonly payload: Payload) {}

  async findSettings(locale?: string): Promise<CookieConsentSettingsDocument | null> {
    try {
      const result = await this.payload.findGlobal({
        slug: COLLECTION_SLUGS.COOKIE_CONSENT_SETTINGS,
        depth: 1, // Need depth 1 to get category relationship data
        locale,
      })

      if (!result) {
        return null
      }

      return result as CookieConsentSettingsDocument
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
