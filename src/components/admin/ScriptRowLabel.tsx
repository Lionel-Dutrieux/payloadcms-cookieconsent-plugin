'use client'

import { useRowLabel } from '@payloadcms/ui'

export const ScriptRowLabel = () => {
  const { data } = useRowLabel<{ category?: string; enabled?: boolean; service?: string }>()
  return (
    <div>
      {data?.enabled ? '✅' : '❌'} {data?.service || 'Unnamed Script'}
    </div>
  )
}
