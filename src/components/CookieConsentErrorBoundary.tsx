'use client'

import type { ErrorInfo, ReactNode } from 'react'

import { Component } from 'react'

interface CookieConsentErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface CookieConsentErrorBoundaryState {
  error?: Error
  hasError: boolean
}

export class CookieConsentErrorBoundary extends Component<
  CookieConsentErrorBoundaryProps,
  CookieConsentErrorBoundaryState
> {
  constructor(props: CookieConsentErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): CookieConsentErrorBoundaryState {
    return { error, hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Cookie consent error boundary caught an error:', error, errorInfo)

    // Call the optional error handler
    this.props.onError?.(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      // Return the custom fallback or null to gracefully degrade
      return this.props.fallback ?? null
    }

    return this.props.children
  }
}
