import React from 'react'

export type ConsentCategory = 'analytics' | 'marketing' | 'necessary'

export interface ConsentScriptProps extends React.ScriptHTMLAttributes<HTMLScriptElement> {
  /**
   * Consent category ("necessary", "analytics", "marketing").
   * Required.
   */
  category: ConsentCategory
  /**
   * Script type (e.g., 'module')
   */
  scriptType?: string
  /**
   * Service name (optional, e.g., 'Google Analytics')
   */
  service?: string
}

/**
 * Injects a <script> with the correct attributes for consent management.
 * - category: required ("necessary", "analytics", "marketing")
 * - service: optional
 * - scriptType: for type="module" etc.
 * - src: for external script
 * - children: for inline script
 */
export const ConsentScript: React.FC<ConsentScriptProps> = ({
  category,
  children,
  scriptType,
  service,
  src,
  ...rest
}) => {
  // "Necessary" scripts must execute immediately
  const isNecessary = category === 'necessary'

  // Common attributes
  const attrs: Record<string, any> = {
    'data-category': category,
    ...(!isNecessary && { type: 'text/plain' }),
    ...(service && { 'data-service': service }),
    ...(scriptType && { 'data-type': scriptType }),
    ...rest,
  }

  // External script
  if (src) {
    return <script {...attrs} src={src} />
  }

  // Inline script
  if (children) {
    return <script {...attrs} dangerouslySetInnerHTML={{ __html: children as string }} />
  }

  // If neither src nor children, render an empty script (for compatibility)
  return <script {...attrs} />
}
