import type { Payload } from 'payload'
import type { ReactNode } from 'react'

import { Suspense } from 'react'

import { CookieConsentBanner } from '../components/Banner/index.js'
import { CookieScriptManager } from '../components/ScriptManager/index.js'
import { ERROR_MESSAGES } from '../constants/defaults.js'
import { CategoryRepository } from '../data/CategoryRepository.js'
import { CookieConsentConfigMapper } from '../data/CookieConsentConfigMapper.js'
import { CookieConsentSettingsRepository } from '../data/CookieConsentSettingsRepository.js'

interface CookieConsentProviderProps {
  children: ReactNode
  /**
   * Whether we are in preview mode (disables cache)
   * @default false
   */
  isPreview?: boolean
  locale?: string
  /**
   * Custom error handler for debugging and monitoring
   */
  onError?: (error: Error) => void
  payload: Payload
  /**
   * Whether to use React error boundary for additional error handling.
   * When true, provides better error isolation but requires client-side rendering.
   * @default false
   */
  useErrorBoundary?: boolean
}

interface CookieConsentContentProps {
  isPreview?: boolean
  locale?: string
  payload: Payload
}

/**
 * Error boundary component for cookie consent
 */
const CookieConsentErrorFallback = ({ error }: { error: Error }) => {
  console.error('Cookie consent initialization error:', error)

  // Return null to gracefully degrade when cookie consent fails
  // The main application will still work
  return null
}

/**
 * Loading component while fetching data
 */
const CookieConsentLoading = () => {
  // Return null for invisible loading state
  return null
}

/**
 * Internal component that handles data fetching and configuration
 */
const CookieConsentContent = async ({
  isPreview = false,
  locale,
  payload,
}: CookieConsentContentProps) => {
  try {
    const configMapper = new CookieConsentConfigMapper()
    const settingsRepository = new CookieConsentSettingsRepository(payload)
    const categoryRepository = new CategoryRepository(payload)
    const [settingsDoc, categories] = await Promise.all([
      settingsRepository.findSettings(locale),
      categoryRepository.findAll({ locale }),
    ])
    const config = configMapper.mapToConfig(settingsDoc, categories, locale)
    const scripts = settingsDoc?.scripts || []
    return (
      <>
        <CookieConsentBanner config={config} />
        <CookieScriptManager scripts={scripts} />
      </>
    )
  } catch (error) {
    // Log error for debugging but don't crash the application
    const errorMessage =
      error instanceof Error ? error.message : ERROR_MESSAGES.INVALID_CONFIGURATION
    console.error('Failed to initialize cookie consent:', errorMessage)

    // Return the error fallback component
    return (
      <CookieConsentErrorFallback
        error={error instanceof Error ? error : new Error(errorMessage)}
      />
    )
  }
}

/**
 * Main CookieConsentProvider component with error boundaries and loading states
 */
export const CookieConsentProvider = ({
  children,
  isPreview = false,
  locale,
  onError,
  payload,
  useErrorBoundary = false,
}: CookieConsentProviderProps) => {
  const content = (
    <Suspense fallback={<CookieConsentLoading />}>
      <CookieConsentContent isPreview={isPreview} locale={locale} payload={payload} />
    </Suspense>
  )
  return (
    <>
      {children}
      {content}
    </>
  )
}
