import type { Payload } from 'payload'

import type { Category } from '../models/Category.js'

export class CategoryRepository {
  constructor(private readonly payload: Payload) {}

  async getCategories(locale?: string): Promise<Category[]> {
    const result = await this.payload.find({
      collection: 'categories',
      depth: 1,
      locale,
    })

    return (
      result.docs.map((doc: any) => ({
        name: doc.name,
        description: doc.description,
        enabled: doc.enabled,
        required: doc.required,
        title: doc.title,
      })) ?? ([] as Category[])
    )
  }
}
