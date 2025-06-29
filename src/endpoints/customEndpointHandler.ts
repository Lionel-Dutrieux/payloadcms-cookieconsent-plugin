import type { PayloadHandler } from 'payload'

import { COLLECTION_SLUGS } from '../constants/defaults.js'

export const customEndpointHandler: PayloadHandler = async (req) => {
  const payload = req.payload

  const categories = await payload.find({
    collection: COLLECTION_SLUGS.CATEGORIES,
  })

  const test = req.user

  // retrieve ip address
  const ip = req.headers.get('x-forwarded-for') ?? 'No IP address found'

  return Response.json({ categories, ip, message: 'Hello from custom endpoint', test })
}
