import type { Payload } from 'payload'

import type { Category } from '../collections/types.js'

const DEFAULT_CATEGORIES = [
  {
    name: 'necessary',
    description: 'These cookies are essential for the website to function properly.',
    enabled: true,
    required: true,
    title: 'Necessary Cookies',
  },
  {
    name: 'analytics',
    description: 'These cookies help us understand how visitors interact with the website.',
    enabled: true,
    required: false,
    title: 'Analytics Cookies',
  },
  {
    name: 'marketing',
    description: 'These cookies are used to deliver personalized advertisements.',
    enabled: true,
    required: false,
    title: 'Marketing Cookies',
  },
] as const satisfies Category[]

export const seedCategories = async (payload: Payload) => {
  // Always ensure 'necessary' exists
  const necessary = DEFAULT_CATEGORIES[0]
  const existingNecessary = await payload.find({
    collection: 'categories',
    limit: 1,
    where: { name: { equals: 'necessary' } },
  })
  if (!existingNecessary.docs.length) {
    await payload.create({
      collection: 'categories',
      data: necessary,
    })
    payload.logger.info(`Seeded category: ${necessary.name}`)
  }

  // For analytics and marketing, only seed if not present
  for (const category of DEFAULT_CATEGORIES.slice(1)) {
    const existing = await payload.find({
      collection: 'categories',
      limit: 1,
      where: { name: { equals: category.name } },
    })
    if (!existing.docs.length) {
      await payload.create({
        collection: 'categories',
        data: category,
      })
      payload.logger.info(`Seeded category: ${category.name}`)
    }
  }
}
