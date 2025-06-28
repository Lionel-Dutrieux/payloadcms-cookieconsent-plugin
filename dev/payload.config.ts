import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { MongoMemoryReplSet } from 'mongodb-memory-server'
import path from 'path'
import { buildConfig } from 'payload'
import { payloadcmsCookieconsentPlugin } from 'payloadcms-cookieconsent-plugin'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { testEmailAdapter } from './helpers/testEmailAdapter.js'
import { seed } from './seed.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

process.env.ROOT_DIR ??= dirname

const buildConfigWithMemoryDB = async () => {
  if (process.env.NODE_ENV === 'test') {
    const memoryDB = await MongoMemoryReplSet.create({
      replSet: {
        count: 3,
        dbName: 'payloadmemory',
      },
    })

    process.env.DATABASE_URI = `${memoryDB.getUri()}&retryWrites=true`
  }

  return buildConfig({
    admin: {
      importMap: {
        baseDir: path.resolve(dirname),
      },
    },
    collections: [
      {
        slug: 'posts',
        fields: [],
      },
      {
        slug: 'media',
        fields: [],
        upload: {
          staticDir: path.resolve(dirname, 'media'),
        },
      },
    ],
    db: mongooseAdapter({
      ensureIndexes: true,
      url: process.env.DATABASE_URI ?? '',
    }),
    editor: lexicalEditor(),
    email: testEmailAdapter,
    localization: {
      defaultLocale: 'en',
      fallback: true,
      locales: [
        {
          code: 'en',
          label: 'English',
        },
        {
          code: 'es',
          label: 'Spanish',
        },
        {
          code: 'fr',
          label: 'French',
        },
        {
          code: 'de',
          label: 'German',
        },
      ],
    },
    onInit: async (payload) => {
      await seed(payload)
    },
    plugins: [
      payloadcmsCookieconsentPlugin({
        collections: {
          posts: true,
        },
      }),
    ],
    secret: process.env.PAYLOAD_SECRET ?? 'test-secret_key',
    sharp,
    typescript: {
      outputFile: path.resolve(dirname, 'payload-types.ts'),
    },
  })
}

export default buildConfigWithMemoryDB()
