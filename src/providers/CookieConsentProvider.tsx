import type { Payload } from 'payload'
import type { CookieConsentConfig } from 'vanilla-cookieconsent'

import type { Category, CookieConsentSettings } from '../lib/index.js'

import { CookieConsentBanner } from '../components/CookieConsentBanner.js'
import { CookieScriptManager } from '../components/CookieScriptManager.js'
import { CategoryRepository } from '../lib/repositories/CategoryRepository.js'
import { CookieConsentSettingsRepository } from '../lib/repositories/CookieConsentSettingsRepository.js'

interface CookieConsentProviderProps {
  children: React.ReactNode
  locale?: string
  payload: Payload
}

/**
 * Maps PayloadCMS data to CookieConsent v3 configuration
 */
function mapPayloadToCookieConsentConfig(
  settings: CookieConsentSettings | null,
  categories: Category[],
  locale?: string,
): CookieConsentConfig {
  // Group scripts by category for the categories config
  const categoriesConfig: { [key: string]: any } = {}

  // Add categories from PayloadCMS
  categories.forEach((category) => {
    if (!category.enabled) {
      return
    }

    categoriesConfig[category.name] = {
      enabled: category.enabled,
      readOnly: category.required,
    }

    // Add scripts as services for this category
    const categoryScripts =
      settings?.scripts?.filter((script) => script.category === category && script.enabled) || []

    if (categoryScripts.length > 0) {
      categoriesConfig[category.name].services = {}

      categoryScripts.forEach((script) => {
        categoriesConfig[category.name].services[
          script.service.toLowerCase().replace(/\s+/g, '_')
        ] = {
          label: script.service,
        }
      })
    }
  })

  // Build the complete configuration
  const config: CookieConsentConfig = {
    // Core settings
    autoShow: settings?.autoShow ?? true,
    disablePageInteraction: settings?.disablePageInteraction ?? false,
    hideFromBots: settings?.hideFromBots ?? true,
    mode: settings?.mode || 'opt-in',
    revision: settings?.revision || 0,

    // Cookie configuration
    cookie: {
      name: settings?.cookieName || 'cc_cookie',
      domain: settings?.cookieDomain || undefined,
      expiresAfterDays: settings?.cookieExpiresAfterDays || 182,
      path: settings?.cookiePath || '/',
      sameSite: settings?.cookieSameSite || 'Lax',
    },

    // Categories and services
    categories: categoriesConfig,

    // Language and UI configuration
    language: {
      autoDetect: 'document',
      default: locale || 'en',
      translations: {
        [locale || 'en']: {
          consentModal: {
            acceptAllBtn: settings?.consentModal?.acceptAllBtn || 'Accept all',
            acceptNecessaryBtn: settings?.consentModal?.acceptNecessaryBtn || 'Reject all',
            description:
              settings?.consentModal?.description ||
              'We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic.',
            showPreferencesBtn: settings?.consentModal?.showPreferencesBtn || 'Manage preferences',
            title: settings?.consentModal?.title || 'We use cookies',
          },
          preferencesModal: {
            acceptAllBtn: settings?.preferencesModal?.acceptAllBtn || 'Accept all',
            acceptNecessaryBtn: settings?.preferencesModal?.acceptNecessaryBtn || 'Reject all',
            closeIconLabel: settings?.preferencesModal?.closeIconLabel || 'Close modal',
            savePreferencesBtn:
              settings?.preferencesModal?.savePreferencesBtn || 'Save preferences',
            sections: [
              // Dynamic sections for each category
              ...categories
                .filter((category) => category.enabled)
                .map((category) => ({
                  description: category.description,
                  linkedCategory: category.name,
                  title:
                    category.title ??
                    category.name.charAt(0).toUpperCase() + category.name.slice(1) + ' Cookies',
                })),
            ],
            serviceCounterLabel:
              settings?.preferencesModal?.serviceCounterLabel || 'Service|Services',
            title: settings?.preferencesModal?.title || 'Manage cookie preferences',
          },
        },
      },
    },

    // GUI Options
    guiOptions: {
      consentModal: {
        equalWeightButtons: settings?.consentModal?.equalWeightButtons ?? true,
        flipButtons: settings?.consentModal?.flipButtons ?? false,
        layout: settings?.consentModal?.layout || 'cloud inline',
        position: (settings?.consentModal?.position || 'bottom center') as any,
      },
      preferencesModal: {
        equalWeightButtons: settings?.preferencesModal?.equalWeightButtons ?? true,
        flipButtons: settings?.preferencesModal?.flipButtons ?? false,
        layout: settings?.preferencesModal?.layout || 'box',
      },
    },
  }

  return config
}

export const CookieConsentProvider = async ({
  children,
  locale,
  payload,
}: CookieConsentProviderProps) => {
  const categoryRepository = new CategoryRepository(payload)
  const categories = await categoryRepository.getCategories(locale)

  const cookieConsentSettingsRepository = new CookieConsentSettingsRepository(payload)
  const cookieConsentSettings = await cookieConsentSettingsRepository.getSettings(locale)

  // Map PayloadCMS data to CookieConsent v3 config
  const config = mapPayloadToCookieConsentConfig(cookieConsentSettings, categories, locale)

  return (
    <>
      {children}
      <CookieConsentBanner config={config} />
      <CookieScriptManager scripts={cookieConsentSettings?.scripts || []} />
    </>
  )
}
