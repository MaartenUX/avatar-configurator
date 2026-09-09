import type { PageContent } from './types'
import parkeervergunning from './pages/p-parkeervergunning'
import bijstand from './pages/p-bijstand'
import wmo from './pages/p-wmo'
import paspoort from './pages/p-paspoort'
import afval from './pages/p-afval'

/** Route-segmenten die nooit een pagina-id mogen zijn. */
export const RESERVED_IDS = new Set(['nieuw'])

export const PAGE_CONTENT: PageContent[] = [
  parkeervergunning,
  bijstand,
  wmo,
  paspoort,
  afval,
]

const BY_ID = Object.fromEntries(PAGE_CONTENT.map((p) => [p.id, p])) as Record<
  string,
  PageContent
>

export const pageContent = (id: string): PageContent | undefined => BY_ID[id]

/** Sjabloon voor een pagina die de gebruiker zelf toevoegt en die niet in de
 *  contentbibliotheek staat: hij leent de scenes van de parkeervergunning. */
export const fallbackContent = (id: string, url: string, title: string): PageContent => ({
  ...parkeervergunning,
  id,
  url,
  title,
})

export * from './types'
export * from './langs'

/**
 * Bewakingen die alleen in ontwikkeling draaien. Ze vangen het soort fout dat
 * anders pas tijdens de gebruikerstest opvalt: een pagina met drie scènes, een
 * taal zonder aanbevolen avatar, of een id dat met een route botst.
 */
if (import.meta.env?.DEV) {
  const problems: string[] = []

  for (const page of PAGE_CONTENT) {
    if (RESERVED_IDS.has(page.id)) problems.push(`${page.id} botst met een route-segment`)
    if (page.scenes.length !== 4) {
      problems.push(`${page.id} heeft ${page.scenes.length} scènes, verwacht 4`)
    }
    for (const [lang, scenes] of Object.entries(page.translations)) {
      if (scenes?.length !== page.scenes.length) {
        problems.push(`${page.id} ${lang} heeft ${scenes?.length} scènes, NL heeft ${page.scenes.length}`)
      }
    }
    for (const [lang, lines] of Object.entries(page.subtitles)) {
      if (!lines || lines.length < 8 || lines.length > 10) {
        problems.push(`${page.id} ${lang} heeft ${lines?.length} ondertitelregels, verwacht 8 tot 10`)
      }
    }
  }

  if (problems.length) console.warn('[data]\n  ' + problems.join('\n  '))
}
