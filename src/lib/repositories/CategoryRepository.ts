import type { Payload } from 'payload'

import { COLLECTION_SLUGS } from '../../constants/defaults.js'

export interface CategoryDocument {
  createdAt: string
  description: string
  enabled: boolean
  id: string
  name: string
  required: boolean
  title: string
  updatedAt: string
}

export class CategoryRepository {
  constructor(private readonly payload: Payload) {}

  async findAll(options?: {
    limit?: number
    locale?: string
    sort?: string
    where?: Record<string, any>
  }): Promise<CategoryDocument[]> {
    try {
      const result = await this.payload.find({
        collection: COLLECTION_SLUGS.CATEGORIES,
        depth: 0,
        limit: options?.limit || 100,
        locale: options?.locale,
        sort: options?.sort || 'name',
        where: options?.where,
      })

      return result.docs as CategoryDocument[]
    } catch (error) {
      throw new Error(
        `Failed to fetch categories: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }
  }

  async findById(id: string, locale?: string): Promise<CategoryDocument | null> {
    try {
      const result = await this.payload.findByID({
        id,
        collection: COLLECTION_SLUGS.CATEGORIES,
        depth: 0,
        locale,
      })

      return result as CategoryDocument
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        return null
      }
      throw new Error(
        `Failed to fetch category by ID: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }
  }

  async findByName(name: string, locale?: string): Promise<CategoryDocument | null> {
    try {
      const result = await this.findAll({
        limit: 1,
        locale,
        where: { name: { equals: name } },
      })

      return result.length > 0 ? result[0] : null
    } catch (error) {
      throw new Error(
        `Failed to fetch category by name: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }
  }

  async findEnabled(locale?: string): Promise<CategoryDocument[]> {
    return this.findAll({
      locale,
      where: { enabled: { equals: true } },
    })
  }
}
