'use client'
import { useLocale, useRowLabel } from '@payloadcms/ui'
import React, { useEffect, useState } from 'react'

export const ScriptRowLabel = () => {
  const { data } = useRowLabel<{ category?: string; enabled?: boolean; service?: string }>()
  const { code: locale } = useLocale()
  const [categoryName, setCategoryName] = useState<null | string>(null)

  useEffect(() => {
    if (data?.category) {
      fetch(`/api/categories/${data.category}`)
        .then((res) => res.json())
        .then((category) => {
          if (category?.name) {
            if (typeof category.name === 'string') {
              setCategoryName(category.name)
            } else {
              setCategoryName(
                category.name[locale] || category.name.en || Object.values(category.name)[0],
              )
            }
          } else {
            setCategoryName('Unknown')
          }
        })
        .catch(() => setCategoryName('Unknown'))
    }
  }, [data?.category, locale])

  if (!data) {
    return <span>Script</span>
  }

  const dotStyle = {
    background: data.enabled ? '#389e0d' : '#cf1322',
    borderRadius: '50%',
    display: 'inline-block',
    height: 10,
    marginRight: 6,
    verticalAlign: 'middle',
    width: 10,
  }

  return (
    <span style={{ alignItems: 'center', display: 'flex', gap: 8 }}>
      <span style={dotStyle}></span>
      <span style={{ color: data.enabled ? '#389e0d' : '#cf1322', fontWeight: 600 }}>
        {data.enabled ? 'Enabled' : 'Disabled'}
      </span>
      <span style={{ color: '#888' }}>{data.service || 'Unnamed Script'}</span>
      {data.category && (
        <span
          style={{
            color: '#888',
            flexShrink: 1,
            minWidth: 0,
            whiteSpace: 'normal',
            wordBreak: 'break-word',
          }}
        >
          | <b>Category:</b> {categoryName || '...'}
        </span>
      )}
    </span>
  )
}
