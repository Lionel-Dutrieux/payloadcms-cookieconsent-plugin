import type { PayloadHandler } from 'payload'

import { COLLECTION_SLUGS } from '../constants/defaults.js'

interface ConsentRecord {
  acceptedCategories: string[]
  acceptType: string
  consentId: string
  rejectedCategories: string[]
}

export const consentEndpointHandler: PayloadHandler = (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 })
  }

  if (req.body === null || req.body === undefined) {
    return Response.json({ error: 'No body' }, { status: 400 })
  }

  const payload = req.payload

  return Response.json({})
}
