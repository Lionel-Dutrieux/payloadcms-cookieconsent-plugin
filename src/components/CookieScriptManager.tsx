import type { ScriptDocument } from '../lib/repositories/CookieConsentSettingsRepository.js'

interface CookieScriptManagerProps {
  scripts: ScriptDocument[]
}

export const CookieScriptManager = ({ scripts }: CookieScriptManagerProps) => {
  const enabledScripts = scripts.filter((script) => script.enabled)

  return (
    <>
      {enabledScripts.map((script, index) => {
        // For required/necessary categories, don't add type="text/plain" so scripts execute immediately
        // For optional categories, add type="text/plain" to block execution until consent
        const isRequired = script.category.required

        const modifiedHtml = script.html.replace(
          /<script/i,
          `<script data-category="${script.category.name}"${script.service ? ` data-service="${script.service}"` : ''}${!isRequired ? ' type="text/plain"' : ''}`,
        )

        return (
          <div
            dangerouslySetInnerHTML={{ __html: modifiedHtml }}
            key={`${script.category.name}-${script.service || 'unknown'}-${index}`}
          />
        )
      })}
    </>
  )
}
