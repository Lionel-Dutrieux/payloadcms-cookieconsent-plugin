import type { Script } from './Script.js'

export interface ConsentModal {
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

export interface PreferencesModal {
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

export interface CookieConsentSettings {
  autoShow: boolean
  consentModal: ConsentModal
  cookieDomain?: string
  cookieExpiresAfterDays: number
  cookieName: string
  cookiePath: string
  cookieSameSite: 'Lax' | 'None' | 'Strict'
  disablePageInteraction: boolean
  hideFromBots: boolean
  mode: 'opt-in' | 'opt-out'
  preferencesModal: PreferencesModal
  revision: number
  scripts: Script[]
}
