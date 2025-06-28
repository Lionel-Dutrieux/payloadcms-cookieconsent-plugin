'use client'

import 'vanilla-cookieconsent/dist/cookieconsent.css'
import { useEffect } from 'react'
import * as CookieConsent from 'vanilla-cookieconsent'

interface CookieConsentBannerProps {
  config: CookieConsent.CookieConsentConfig
}

export const CookieConsentBanner = ({ config }: CookieConsentBannerProps) => {
  useEffect(() => {
    void CookieConsent.run(config)
  }, [config])

  return <></>
}
