import type { CollectionSlug, Config } from 'payload'

import { Categories } from './collections/Categories.js'
import { ConsentRecords } from './collections/ConsentRecords.js'
import { consentEndpointHandler } from './endpoints/consentEndpointHandler.js'
import { CookieConsentSettings } from './globals/CookieConsentSettings.js'

export * from './constants/defaults.js'
// Export the service and constants for advanced usage
export { CookieConsentConfigMapper } from './data/CookieConsentConfigMapper.js'

export type PayloadcmsCookieconsentPluginConfig = {
  /**
   * List of collections to add a custom field
   */
  collections?: Partial<Record<CollectionSlug, true>>
  disabled?: boolean
}

export const payloadcmsCookieconsentPlugin =
  (pluginOptions: PayloadcmsCookieconsentPluginConfig) =>
  (config: Config): Config => {
    config.collections ??= []

    /**
     * If the plugin is disabled, we still want to keep added collections/fields so the database schema is consistent which is important for migrations.
     * If your plugin heavily modifies the database schema, you may want to remove this property.
     */
    if (pluginOptions.disabled) {
      return config
    }

    config.collections.push(Categories, ConsentRecords)

    config.globals ??= []
    config.globals.push(CookieConsentSettings)

    config.endpoints ??= []

    config.admin ??= {}

    config.admin.components ??= {}

    config.admin.components.beforeDashboard ??= []

    config.endpoints.push({
      handler: consentEndpointHandler,
      method: 'post',
      path: '/consent',
    })

    const incomingOnInit = config.onInit

    config.onInit = async (payload) => {
      // Ensure we are executing any existing onInit functions before running our own.
      if (incomingOnInit) {
        await incomingOnInit(payload)
      }

      payload.logger.info('Hello from the plugin')
    }

    return config
  }
