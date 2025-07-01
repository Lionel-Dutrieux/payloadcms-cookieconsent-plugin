'use client'

import 'vanilla-cookieconsent/dist/cookieconsent.css'
import { useEffect } from 'react'
import * as CookieConsent from 'vanilla-cookieconsent'

interface CookieConsentBannerProps {
  config: CookieConsent.CookieConsentConfig
}

export const CookieConsentBanner = ({ config }: CookieConsentBannerProps) => {
  config.onFirstConsent = () => {
    logConsent()
  }

  config.onChange = () => {
    logConsent()
  }

  useEffect(() => {
    void CookieConsent.run(config)
  }, [config])

  return <></>
}

const logConsent = () => {
  const cookie = CookieConsent.getCookie()
  const preferences = CookieConsent.getUserPreferences()

  const userConsent = {
    acceptedCategories: preferences.acceptedCategories,
    acceptType: preferences.acceptType,
    consentId: cookie.consentId,
    rejectedCategories: preferences.rejectedCategories,
  }

  void fetch('/api/consent', {
    body: JSON.stringify(userConsent),
    method: 'POST',
  }).catch((error) => {
    console.error('Error saving consent:', error)
  })
}
