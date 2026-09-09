import type { Lang, LangStatus, Page } from './types'
import { langLabel } from '../data/langs'

export interface NextAction {
  /** Wat er op de knop staat. */
  label: string
  /** Waar de knop heen gaat, of null als er niets te doen is. */
  to: string | null
  /** Korte uitleg van de stand van zaken, voor de kaart. */
  hint: string
}

/**
 * Wat is de eerstvolgende stap voor deze pagina? Eén bron voor het overzicht,
 * de paginalijst en het beheerscherm, zodat die drie nooit uiteen lopen.
 */
export function nextAction(page: Page, user: 'esmee' | 'emre' = 'esmee'): NextAction {
  // De collega ziet alleen zijn eigen taal.
  if (user === 'emre') {
    const tr = page.langs.tr
    if (!tr) return { label: 'Niets te doen', to: null, hint: 'Deze pagina heeft geen Turkse versie.' }
    if (tr.status === 'review-text')
      return { label: 'Controleer tekst', to: `/paginas/${page.id}/tr`, hint: 'Turkse tekst klaar om te controleren' }
    if (tr.status === 'review-video')
      return { label: 'Controleer video', to: `/paginas/${page.id}/video/tr`, hint: 'Turkse video klaar om te controleren' }
    if (tr.status === 'generating')
      return { label: 'Wordt gemaakt', to: null, hint: 'De Turkse video wordt gemaakt' }
    return { label: 'Bekijk', to: `/paginas/${page.id}`, hint: 'Turks is klaar' }
  }

  switch (page.status) {
    case 'summarizing':
      return { label: 'Wordt gemaakt', to: `/paginas/${page.id}/samenvatting`, hint: 'De samenvatting wordt gemaakt' }
    case 'review-summary':
      return {
        label: 'Controleer samenvatting',
        to: `/paginas/${page.id}/samenvatting`,
        hint: 'De basissamenvatting is klaar om te controleren',
      }
    case 'review-nl':
      return {
        label: 'Finetune het script',
        to: `/paginas/${page.id}/script`,
        hint: 'Het Nederlandse script staat klaar',
      }
    case 'ready-to-publish':
      return { label: 'Publiceer', to: `/paginas/${page.id}/publiceren`, hint: 'Alle talen zijn goedgekeurd' }
    case 'live':
      return { label: 'Bekijk', to: `/paginas/${page.id}`, hint: 'Staat live op de website' }
    case 'in-translation':
    default: {
      // Eerst kijken of Esmee zelf iets kan doen: een video controleren.
      const video = langsWith(page, 'review-video')[0]
      if (video)
        return {
          label: `Controleer video ${langLabel(video)}`,
          to: `/paginas/${page.id}/video/${video}`,
          hint: 'Een video is klaar om te controleren',
        }
      const text = langsWith(page, 'review-text')
      if (text.length)
        return {
          label: 'Wacht op collega',
          to: null,
          hint: `${text.map(langLabel).join(' en ')} wordt gecontroleerd door een collega`,
        }
      return { label: "Video's worden gemaakt", to: null, hint: 'Even geduld, de video’s worden gemaakt' }
    }
  }
}

export const langsWith = (page: Page, status: LangStatus): Lang[] =>
  (Object.keys(page.langs) as Lang[]).filter((l) => page.langs[l]?.status === status)

/** Kan deze pagina gepubliceerd worden? Pas als élke taal is goedgekeurd. */
export const canPublish = (page: Page) => {
  const all = Object.values(page.langs)
  return all.length > 0 && all.every((l) => l?.status === 'approved')
}

export const findPage = (pages: Page[], id?: string) => pages.find((p) => p.id === id)

/** Totaal aantal weergaven over alle talen. */
export const totalViews = (page: Page) =>
  Object.values(page.views).reduce<number>((sum, v) => sum + (v ?? 0), 0)
