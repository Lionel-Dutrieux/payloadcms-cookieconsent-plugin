'use client'

import 'vanilla-cookieconsent/dist/cookieconsent.css'
import { useEffect } from 'react'
import * as CookieConsent from 'vanilla-cookieconsent'

interface CookieConsentBannerProps {
  config: CookieConsent.CookieConsentConfig
}

export const CookieConsentBanner = ({ config }: CookieConsentBannerProps) => {
  config.onFirstConsent = () => {
    console.log('onFirstConsent')
  }

  config.onChange = () => {
    console.log('onChange')

    const cookie = CookieConsent.getCookie()
    const preferences = CookieConsent.getUserPreferences()

    const userConsent = {
      acceptedCategories: preferences.acceptedCategories,
      acceptType: preferences.acceptType,
      consentId: cookie.consentId,
      rejectedCategories: preferences.rejectedCategories,
    }

    console.log(userConsent)
  }

  useEffect(() => {
    void CookieConsent.run(config)
  }, [config])

  return <></>
}
