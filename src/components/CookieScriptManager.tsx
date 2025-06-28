import type { Script } from '../lib/models/Script.js'

interface CookieScriptManagerProps {
  scripts: Script[]
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
            key={`${script.category}-${script.service || 'unknown'}-${index}`}
          />
        )
      })}
    </>
  )
}
