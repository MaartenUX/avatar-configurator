import { useNavigate } from 'react-router-dom'
import { useStore } from './store'
import { langLabel } from '../data/langs'
import type { Lang } from './types'

export type Spoke = 'summary' | 'script' | 'lang' | 'video' | 'publish'

export interface FlowCtx {
  pageId: string
  lang?: Lang
  langCount?: number
}

/**
 * Waar je na een akkoord landt en wat de toast zegt. Eén tabel, zodat geen
 * enkel scherm zijn eigen copy of bestemming verzint. De regel uit het
 * bouwplan: na élk akkoord terug naar het overzicht, behalve na publiceren.
 */
export const FLOW: Record<
  Spoke,
  { destination: (c: FlowCtx) => string; toast: (c: FlowCtx) => string }
> = {
  summary: {
    destination: () => '/',
    toast: () => 'Basissamenvatting goedgekeurd — nu het Nederlandse script',
  },
  script: {
    destination: () => '/',
    toast: (c) =>
      `Script goedgekeurd. Je collega's krijgen bericht en ${c.langCount ?? 0} video's worden gemaakt.`,
  },
  lang: {
    destination: () => '/',
    toast: (c) => `${langLabel(c.lang!)} goedgekeurd — de video wordt nu gemaakt.`,
  },
  video: {
    destination: () => '/',
    toast: (c) => `Video ${langLabel(c.lang!)} goedgekeurd.`,
  },
  publish: {
    destination: (c) => `/paginas/${c.pageId}`,
    toast: () => 'Je video staat live op de pagina.',
  },
}

/** Elke spaak sluit hiermee af: toast tonen, kaart markeren, terug naar de hub. */
export function useFinishSpoke() {
  const navigate = useNavigate()
  const flash = useStore((s) => s.flash)
  return (spoke: Spoke, ctx: FlowCtx) => {
    const f = FLOW[spoke]
    flash({ text: f.toast(ctx), tone: 'success', pageId: ctx.pageId })
    navigate(f.destination(ctx))
  }
}
