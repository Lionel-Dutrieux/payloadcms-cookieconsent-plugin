import type { ScriptDocument } from '../lib/repositories/CookieConsentSettingsRepository.js'

interface CookieScriptManagerProps {
  scripts: ScriptDocument[]
}

export const CookieScriptManager = ({ scripts }: CookieScriptManagerProps) => {
  const enabledScripts = scripts.filter((script) => script.enabled)

  return (
    <>
      {enabledScripts.map((script, index) => {
        // Parse the script tag to add necessary attributes
        const modifiedHtml = script.html.replace(
          /<script/i,
          `<script data-category="${script.category.name}"${script.service ? ` data-service="${script.service}"` : ''} type="text/plain"`,
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
