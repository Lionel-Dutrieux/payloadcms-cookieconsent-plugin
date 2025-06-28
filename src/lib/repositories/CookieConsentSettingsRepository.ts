import type { Payload } from 'payload'

import type { CookieConsentSettings } from '../models/CookieConsentSettings.js'

export class CookieConsentSettingsRepository {
  constructor(private readonly payload: Payload) {}

  async getSettings(locale?: string): Promise<CookieConsentSettings | null> {
    try {
      const result = await this.payload.findGlobal({
        slug: 'cookie-consent-settings',
        depth: 1,
        locale,
      })

      if (!result) {
        return null
      }

      return {
        autoShow: result.autoShow ?? true,
        consentModal: {
          acceptAllBtn: result.consentModal?.acceptAllBtn ?? 'Accept all',
          acceptNecessaryBtn: result.consentModal?.acceptNecessaryBtn ?? 'Reject all',
          description:
            result.consentModal?.description ??
            'We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic.',
          equalWeightButtons: result.consentModal?.equalWeightButtons ?? true,
          flipButtons: result.consentModal?.flipButtons ?? false,
          layout: result.consentModal?.layout ?? 'cloud inline',
          position: result.consentModal?.position ?? 'bottom center',
          showPreferencesBtn: result.consentModal?.showPreferencesBtn ?? 'Manage preferences',
          title: result.consentModal?.title ?? 'We use cookies',
        },
        cookieDomain: result.cookieDomain,
        cookieExpiresAfterDays: result.cookieExpiresAfterDays ?? 182,
        cookieName: result.cookieName ?? 'cc_cookie',
        cookiePath: result.cookiePath ?? '/',
        cookieSameSite: result.cookieSameSite ?? 'Lax',
        disablePageInteraction: result.disablePageInteraction ?? false,
        hideFromBots: result.hideFromBots ?? true,
        mode: result.mode ?? 'opt-in',
        preferencesModal: {
          acceptAllBtn: result.preferencesModal?.acceptAllBtn ?? 'Accept all',
          acceptNecessaryBtn: result.preferencesModal?.acceptNecessaryBtn ?? 'Reject all',
          closeIconLabel: result.preferencesModal?.closeIconLabel ?? 'Close modal',
          equalWeightButtons: result.preferencesModal?.equalWeightButtons ?? true,
          flipButtons: result.preferencesModal?.flipButtons ?? false,
          layout: result.preferencesModal?.layout ?? 'box',
          savePreferencesBtn: result.preferencesModal?.savePreferencesBtn ?? 'Save preferences',
          serviceCounterLabel: result.preferencesModal?.serviceCounterLabel ?? 'Service|Services',
          title: result.preferencesModal?.title ?? 'Manage cookie preferences',
        },
        revision: result.revision ?? 0,
        scripts:
          result.scripts?.map((script: any) => ({
            category: script.category,
            enabled: script.enabled ?? true,
            html: script.html,
            service: script.service,
          })) ?? [],
      }
    } catch (error) {
      console.error('Error fetching cookie consent settings:', error)
      return null
    }
  }
}
