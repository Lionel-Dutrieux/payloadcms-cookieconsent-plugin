import type { PayloadRequest } from 'payload'

import { createHash } from 'crypto'
import { z } from 'zod'

import { ConsentRecordRepository } from '../data/ConsentRecordRepository.js'

const ConsentEventSchema = z.object({
  acceptedCategories: z.array(z.string()),
  acceptType: z.string(),
  action: z.enum(['granted', 'modified', 'withdrawn', 'renewed']),
  rejectedCategories: z.array(z.string()).optional(),
  // timestamp, userAgent and ipAddress are set server-side
})

const ConsentBodySchema = z.object({
  consentId: z.string(),
  event: ConsentEventSchema,
})

function hashIp(ip: string): string {
  // SHA-256 hash, hex output
  return createHash('sha256').update(ip).digest('hex')
}

export const consentEndpointHandler = async (req: PayloadRequest) => {
  let body = req.body
  if (body && typeof body.getReader === 'function') {
    const text = await new Response(body).text()
    body = JSON.parse(text)
  }

  if (req.method !== 'POST') {
    return Response.json({ error: 'Method Not Allowed' }, { status: 405 })
  }
  try {
    const parseResult = ConsentBodySchema.safeParse(body)
    if (!parseResult.success) {
      return Response.json(
        { details: parseResult.error.errors, error: 'Invalid payload' },
        { status: 400 },
      )
    }
    const { consentId, event } = parseResult.data

    // Get user agent from headers (support both Headers and plain object)
    let userAgent = ''
    if (typeof req.headers.get === 'function') {
      userAgent = req.headers.get('user-agent') || ''
    } else if ('user-agent' in req.headers) {
      userAgent = (req.headers['user-agent'] as string) || ''
    }

    // Get IP address (x-forwarded-for or req.ip)
    let ip: string | undefined
    if (typeof req.headers.get === 'function') {
      ip = req.headers.get('x-forwarded-for') || undefined
    } else if ('x-forwarded-for' in req.headers) {
      ip = (req.headers['x-forwarded-for'] as string) || undefined
    }
    if (!ip && 'ip' in req) {
      ip = (req as any).ip
    }
    const ipAddress = ip ? hashIp(ip) : undefined

    const repo = new ConsentRecordRepository(req.payload)
    const userId = req.user?.id || req.user?._id
    const record = await repo.addConsentEvent(
      consentId,
      {
        ...event,
        ipAddress,
        timestamp: new Date().toISOString(),
        userAgent,
      },
      userId,
    )
    return Response.json({ record, success: true })
  } catch (error) {
    console.error('Error saving consent:', error)
    return Response.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
