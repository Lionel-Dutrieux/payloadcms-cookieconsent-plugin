export interface ConsentRecord {
  acceptedCategories: string[]
  consentId: string
  expiresAt: string
  ipAddress?: string
  timestamp: string
  userAgent?: string
}
