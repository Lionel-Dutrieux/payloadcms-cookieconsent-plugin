export interface Category {
  description: string
  enabled: boolean
  name: string
  required: boolean
  title: string
}

export interface ConsentEvent {
  acceptedCategories: string[]
  acceptType: string
  action: 'granted' | 'modified' | 'renewed' | 'withdrawn'
  ipAddress?: string
  rejectedCategories?: string[]
  timestamp: string
  userAgent?: string
}

export interface ConsentRecord {
  consentId: string
  createdAt: string
  events: ConsentEvent[]
  lastModified: string
}
