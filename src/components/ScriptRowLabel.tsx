'use client'

import { useRowLabel } from '@payloadcms/ui'

export const ScriptRowLabel = () => {
  const { data } = useRowLabel<{ category?: string; enabled?: boolean; service?: string }>()

  // Affiche seulement le nom du service
  return (
    <div>
      {data?.enabled ? '✅' : '❌'} {data?.service || 'Unnamed Script'}
    </div>
  )
}
