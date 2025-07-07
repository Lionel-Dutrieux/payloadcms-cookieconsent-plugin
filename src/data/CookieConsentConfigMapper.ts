import type { CookieConsentConfig } from 'vanilla-cookieconsent'

import type { Category } from '../collections/types.js'
import type { CookieConsentSettings, Script } from '../globals/types.js'

import {
  BEHAVIOR_DEFAULTS,
  COOKIE_DEFAULTS,
  ERROR_MESSAGES,
  UI_DEFAULTS,
} from '../constants/defaults.js'

export class CookieConsentConfigMapper {
  private createCategoriesConfig(
    categories: Category[],
    scripts: Script[],
  ): { [key: string]: any } {
    const categoriesConfig: { [key: string]: any } = {}
    categories.forEach((category) => {
      if (!category.enabled) {
        return
      }
      categoriesConfig[category.name] = {
        enabled: category.enabled,
        readOnly: category.required,
      }
      const categoryScripts = scripts.filter(
        (script) => script.category === category && script.enabled,
      )
      if (categoryScripts.length > 0) {
        categoriesConfig[category.name].services = {}
        categoryScripts.forEach((script) => {
          const serviceKey = script.service.toLowerCase().replace(/\s+/g, '_')
          categoriesConfig[category.name].services[serviceKey] = {
            label: script.service,
          }
        })
      }
    })
    return categoriesConfig
  }

  private createPreferenceModalSections(categories: Category[]): Array<{
    description: string
    linkedCategory: string
    title: string
  }> {
    return categories
      .filter((category) => category.enabled)
      .map((category) => ({
        description: category.description,
        linkedCategory: category.name,
        title: category.title,
      }))
  }

  private mapCategoryDocument(doc: Category): Category {
    return doc
  }

  private mapScriptDocuments(scripts: Script[]): Script[] {
    return scripts.map((script) => {
      return {
        category: {
          name: script.category.name,
          required: script.category.required,
        },
        enabled: script.enabled,
        html: script.html,
        service: script.service,
      }
    })
  }

  mapToConfig(
    settingsDoc: CookieConsentSettings | null,
    categoryDocs: Category[],
    locale = 'en',
  ): CookieConsentConfig {
    try {
      const categories = categoryDocs
      const scripts = settingsDoc ? this.mapScriptDocuments(settingsDoc.scripts) : []
      const settings = {
        autoShow: settingsDoc?.autoShow ?? BEHAVIOR_DEFAULTS.AUTO_SHOW,
        consentModal: {
          acceptAllBtn:
            settingsDoc?.consentModal?.acceptAllBtn ?? UI_DEFAULTS.CONSENT_MODAL.ACCEPT_ALL_BTN,
          acceptNecessaryBtn:
            settingsDoc?.consentModal?.acceptNecessaryBtn ??
            UI_DEFAULTS.CONSENT_MODAL.ACCEPT_NECESSARY_BTN,
          description:
            settingsDoc?.consentModal?.description ?? UI_DEFAULTS.CONSENT_MODAL.DESCRIPTION,
          equalWeightButtons:
            settingsDoc?.consentModal?.equalWeightButtons ??
            UI_DEFAULTS.CONSENT_MODAL.EQUAL_WEIGHT_BUTTONS,
          flipButtons:
            settingsDoc?.consentModal?.flipButtons ?? UI_DEFAULTS.CONSENT_MODAL.FLIP_BUTTONS,
          layout: settingsDoc?.consentModal?.layout ?? UI_DEFAULTS.CONSENT_MODAL.LAYOUT,
          position: settingsDoc?.consentModal?.position ?? UI_DEFAULTS.CONSENT_MODAL.POSITION,
          showPreferencesBtn:
            settingsDoc?.consentModal?.showPreferencesBtn ??
            UI_DEFAULTS.CONSENT_MODAL.SHOW_PREFERENCES_BTN,
          title: settingsDoc?.consentModal?.title ?? UI_DEFAULTS.CONSENT_MODAL.TITLE,
        },
        cookieDomain: settingsDoc?.cookieDomain,
        cookieExpiresAfterDays:
          settingsDoc?.cookieExpiresAfterDays ?? COOKIE_DEFAULTS.EXPIRES_AFTER_DAYS,
        cookieName: settingsDoc?.cookieName ?? COOKIE_DEFAULTS.NAME,
        cookiePath: settingsDoc?.cookiePath ?? COOKIE_DEFAULTS.PATH,
        cookieSameSite: settingsDoc?.cookieSameSite ?? COOKIE_DEFAULTS.SAME_SITE,
        disablePageInteraction:
          settingsDoc?.disablePageInteraction ?? BEHAVIOR_DEFAULTS.DISABLE_PAGE_INTERACTION,
        hideFromBots: settingsDoc?.hideFromBots ?? BEHAVIOR_DEFAULTS.HIDE_FROM_BOTS,
        mode: settingsDoc?.mode ?? BEHAVIOR_DEFAULTS.MODE,
        preferencesModal: {
          acceptAllBtn:
            settingsDoc?.preferencesModal?.acceptAllBtn ??
            UI_DEFAULTS.PREFERENCES_MODAL.ACCEPT_ALL_BTN,
          acceptNecessaryBtn:
            settingsDoc?.preferencesModal?.acceptNecessaryBtn ??
            UI_DEFAULTS.PREFERENCES_MODAL.ACCEPT_NECESSARY_BTN,
          closeIconLabel:
            settingsDoc?.preferencesModal?.closeIconLabel ??
            UI_DEFAULTS.PREFERENCES_MODAL.CLOSE_ICON_LABEL,
          equalWeightButtons:
            settingsDoc?.preferencesModal?.equalWeightButtons ??
            UI_DEFAULTS.PREFERENCES_MODAL.EQUAL_WEIGHT_BUTTONS,
          flipButtons:
            settingsDoc?.preferencesModal?.flipButtons ??
            UI_DEFAULTS.PREFERENCES_MODAL.FLIP_BUTTONS,
          layout: settingsDoc?.preferencesModal?.layout ?? UI_DEFAULTS.PREFERENCES_MODAL.LAYOUT,
          savePreferencesBtn:
            settingsDoc?.preferencesModal?.savePreferencesBtn ??
            UI_DEFAULTS.PREFERENCES_MODAL.SAVE_PREFERENCES_BTN,
          serviceCounterLabel:
            settingsDoc?.preferencesModal?.serviceCounterLabel ??
            UI_DEFAULTS.PREFERENCES_MODAL.SERVICE_COUNTER_LABEL,
          title: settingsDoc?.preferencesModal?.title ?? UI_DEFAULTS.PREFERENCES_MODAL.TITLE,
        },
        revision: settingsDoc?.revision ?? BEHAVIOR_DEFAULTS.REVISION,
      }
      const config: CookieConsentConfig = {
        autoShow: settings.autoShow,
        categories: this.createCategoriesConfig(categories, scripts),
        cookie: {
          name: settings.cookieName,
          domain: settings.cookieDomain ?? undefined,
          expiresAfterDays: settings.cookieExpiresAfterDays,
          path: settings.cookiePath,
          sameSite: settings.cookieSameSite,
        },
        disablePageInteraction: settings.disablePageInteraction,
        guiOptions: {
          consentModal: {
            equalWeightButtons: settings.consentModal.equalWeightButtons,
            flipButtons: settings.consentModal.flipButtons,
            layout: settings.consentModal.layout,
            position: settings.consentModal.position as any,
          },
          preferencesModal: {
            equalWeightButtons: settings.preferencesModal.equalWeightButtons,
            flipButtons: settings.preferencesModal.flipButtons,
            layout: settings.preferencesModal.layout,
          },
        },
        hideFromBots: settings.hideFromBots,
        language: {
          autoDetect: 'document',
          default: locale,
          translations: {
            [locale]: {
              consentModal: {
                acceptAllBtn: settings.consentModal.acceptAllBtn,
                acceptNecessaryBtn: settings.consentModal.acceptNecessaryBtn,
                description: settings.consentModal.description,
                showPreferencesBtn: settings.consentModal.showPreferencesBtn,
                title: settings.consentModal.title,
              },
              preferencesModal: {
                acceptAllBtn: settings.preferencesModal.acceptAllBtn,
                acceptNecessaryBtn: settings.preferencesModal.acceptNecessaryBtn,
                closeIconLabel: settings.preferencesModal.closeIconLabel,
                savePreferencesBtn: settings.preferencesModal.savePreferencesBtn,
                sections: this.createPreferenceModalSections(categories),
                serviceCounterLabel: settings.preferencesModal.serviceCounterLabel,
                title: settings.preferencesModal.title,
              },
            },
          },
        },
        mode: settings.mode,
        revision: settings.revision,
      }
      return config
    } catch (error) {
      throw new Error(
        `${ERROR_MESSAGES.INVALID_CONFIGURATION}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }
  }
}
