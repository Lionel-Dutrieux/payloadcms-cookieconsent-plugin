import { getPayload, type ServerFunctionClient } from 'payload'
import '@payloadcms/next/css'
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config'
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'
import { CookieConsentProvider } from 'payloadcms-cookieconsent-plugin/rsc'
import React from 'react'

import './custom.scss'
import { importMap } from './admin/importMap.js'

type Args = {
  children: React.ReactNode
}

const serverFunction: ServerFunctionClient = async function (args) {
  'use server'
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  })
}

const Layout = async ({ children }: Args) => {
  const payload = await getPayload({ config })
  return (
    <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
      <CookieConsentProvider isPreview={true} locale="en" payload={payload}>
        {children}
      </CookieConsentProvider>
    </RootLayout>
  )
}

export default Layout
