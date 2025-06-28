export const COLLECTION_SLUGS = {
  CATEGORIES: 'categories',
  COOKIE_CONSENT_SETTINGS: 'cookie-consent-settings',
} as const

export const COOKIE_DEFAULTS = {
  EXPIRES_AFTER_DAYS: 182,
  NAME: 'cc_cookie',
  PATH: '/',
  SAME_SITE: 'Lax',
} as const

export const UI_DEFAULTS = {
  CONSENT_MODAL: {
    ACCEPT_ALL_BTN: 'Accept all',
    ACCEPT_NECESSARY_BTN: 'Reject all',
    DESCRIPTION:
      'We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic.',
    EQUAL_WEIGHT_BUTTONS: true,
    FLIP_BUTTONS: false,
    LAYOUT: 'cloud inline',
    POSITION: 'bottom center',
    SHOW_PREFERENCES_BTN: 'Manage preferences',
    TITLE: 'We use cookies',
  },
  PREFERENCES_MODAL: {
    ACCEPT_ALL_BTN: 'Accept all',
    ACCEPT_NECESSARY_BTN: 'Reject all',
    CLOSE_ICON_LABEL: 'Close modal',
    EQUAL_WEIGHT_BUTTONS: true,
    FLIP_BUTTONS: false,
    LAYOUT: 'box',
    SAVE_PREFERENCES_BTN: 'Save preferences',
    SERVICE_COUNTER_LABEL: 'Service|Services',
    TITLE: 'Manage cookie preferences',
  },
} as const

export const BEHAVIOR_DEFAULTS = {
  AUTO_SHOW: true,
  DISABLE_PAGE_INTERACTION: false,
  HIDE_FROM_BOTS: true,
  MODE: 'opt-in',
  REVISION: 0,
} as const

export const ERROR_MESSAGES = {
  FAILED_TO_LOAD_CATEGORIES: 'Failed to load cookie categories',
  FAILED_TO_LOAD_SETTINGS: 'Failed to load cookie consent settings',
  INVALID_CONFIGURATION: 'Invalid cookie consent configuration',
} as const
