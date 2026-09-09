import type { Lang, Scene, SubtitleLine } from '../state/types'

export interface PageContent {
  id: string
  url: string
  title: string
  /** Tekst van de gemeentepagina waar de video bij hoort. */
  sourceText: string
  /** De B1-basissamenvatting in scenes. Vier bij een vaste samenvatting. */
  scenes: Scene[]
  translations: Partial<Record<Lang, Scene[]>>
  subtitles: Partial<Record<Lang, SubtitleLine[]>>
  /** Dunne pagina's staan alleen als kaartje in de lijst; hun script opent niemand. */
  thin?: boolean
}

export interface AvatarDef {
  id: string
  lang: Lang
  name: string
  gender: 'v' | 'm'
  /** Bestandsnaam van het portret in src/assets/avatars/, zonder extensie.
   *  Gezichten mogen tussen talen hergebruikt worden, dus meerdere avatars
   *  kunnen naar hetzelfde bestand wijzen. */
  face: string
  /** Drie à vier steekwoorden: "rustig · warm · lage stem". */
  keywords: string[]
  /** Voorbeeldzin in de taal zelf, klinkt bij het beluisteren. */
  sampleSentence: string
  advised?: boolean
}

export interface FaqItem {
  q: string
  a: string
}

export interface LearnMoreDef {
  id: string
  title: string
  body: string
  features: { icon: string; label: string }[]
  faq: FaqItem[]
}
