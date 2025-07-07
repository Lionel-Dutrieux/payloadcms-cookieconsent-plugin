'use client'

import { useRowLabel } from '@payloadcms/ui'

export const ConsentEventRowLabel = () => {
  const { data } = useRowLabel<{
    acceptedCategories: string[]
    acceptType: string
    rejectedCategories: string[]
    timestamp: string
  }>()

  if (!data) {
    return <span>Consent event</span>
  }

  const date = new Date(data.timestamp).toLocaleString(undefined, {
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
    year: 'numeric',
  })

  let statusLabel = ''
  let statusColor = ''
  // Logic: if no rejected, granted; if only one accepted, denied; else partial
  if (data.rejectedCategories.length === 0) {
    statusLabel = 'Granted'
    statusColor = '#389e0d'
  } else if (data.acceptedCategories.length === 1) {
    statusLabel = 'Denied'
    statusColor = '#cf1322'
  } else {
    statusLabel = 'Partial'
    statusColor = '#d4b106'
  }

  const revision = (data as any).revision

  return (
    <span style={{ alignItems: 'center', display: 'flex', gap: 12 }}>
      <span style={{ alignItems: 'center', color: statusColor, display: 'flex', fontWeight: 600 }}>
        {statusLabel}
      </span>
      <span style={{ color: '#888' }}>{date}</span>
      <span>
        <b>Categories:</b>{' '}
        {data.acceptedCategories.length ? data.acceptedCategories.join(', ') : 'None'}
      </span>
      {revision !== undefined && (
        <span style={{ color: '#888' }}>
          <b>Revision:</b> {revision}
        </span>
      )}
    </span>
  )
}
