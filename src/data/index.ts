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
