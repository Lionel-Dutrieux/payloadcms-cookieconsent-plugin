'use client'

import 'vanilla-cookieconsent/dist/cookieconsent.css'
import { useEffect } from 'react'
import * as CookieConsent from 'vanilla-cookieconsent'

interface CookieConsentBannerProps {
  config: CookieConsent.CookieConsentConfig
}

export const CookieConsentBanner = ({ config }: CookieConsentBannerProps) => {
  config.onFirstConsent = () => {
    logConsent('granted')
  }

  config.onChange = () => {
    logConsent('modified')
  }

  useEffect(() => {
    void CookieConsent.run(config)
  }, [config])

  return <></>
}

const logConsent = (action: 'granted' | 'modified' | 'renewed' | 'withdrawn') => {
  const cookie = CookieConsent.getCookie()
  const preferences = CookieConsent.getUserPreferences()

  const event = {
    acceptedCategories: preferences.acceptedCategories,
    acceptType: preferences.acceptType,
    action,
    rejectedCategories: preferences.rejectedCategories,
    // userAgent and ipAddress are set server-side
  }

  const consentId = cookie.consentId

  void fetch('/api/consent', {
    body: JSON.stringify({ consentId, event }),
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  }).catch((error) => {
    console.error('Error saving consent:', error)
  })
}
