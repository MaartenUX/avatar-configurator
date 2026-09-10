import { ChevronRight, Eye } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '../primitives/Badge'
import { LANG_STATUS, LANG_STATUS_LABEL } from '../../tokens/status'
import { langLabel } from '../../data/langs'
import { formatNumber } from '../../lib/format'
import type { Lang, LangStatus, Timer } from '../../state/types'
import { useCountdown } from '../../state/useCountdown'
import { cn } from '../../lib/cn'

export interface LanguageRowProps {
  lang: Lang
  status: LangStatus
  /** Alleen bij een goedgekeurde regel: wie het heeft afgetekend. */
  reviewer?: string
  etaMin?: number
  timer?: Timer
  /** Waar de actieknop heen gaat; zonder link geen knop. */
  actionTo?: string | null
  actionLabel?: string
  /** Link naar de spaak in kijkstand, verschijnt bij hover. */
  bekijkTo?: string | null
  highlight?: boolean
}

/**
 * Eén taal binnen een paginakaart. Alleen een goedgekeurde regel noemt een
 * naam; bij een open taak is de taak zelf het belangrijkste, niet wie hem
 * ooit krijgt.
 */
export function LanguageRow({
  lang,
  status,
  reviewer,
  etaMin,
  timer,
  actionTo,
  actionLabel,
  bekijkTo,
  highlight,
}: LanguageRowProps) {
  const countdown = useCountdown(timer)
  const statusKey = LANG_STATUS[status]
  const afgerond = status === 'approved' || status === 'live'

  const minuten = countdown?.etaMin ?? etaMin
  const bezig = status === 'generating'
  const label = bezig && minuten
    ? `Video wordt gemaakt · nog ${minuten} min`
    : LANG_STATUS_LABEL[status]

  return (
    <div
      className={cn(
        'group flex items-center gap-3 rounded-sm px-2.5 py-2 transition-colors',
        highlight ? 'bg-blue-tint' : 'hover:bg-gray-6',
      )}
    >
      <span className="type-label w-8 shrink-0 text-gray-3">{lang}</span>
      <span className="w-24 shrink-0 text-body text-gray-1">{langLabel(lang)}</span>

      <Badge status={statusKey} dot pulse={bezig}>
        {label}
      </Badge>

      {/* Een naam alleen als er is afgetekend. */}
      {afgerond && reviewer && (
        <span className="truncate text-body-sm text-gray-3">door {reviewer}</span>
      )}

      {actionTo && (
        <Link
          to={actionTo}
          className="ml-auto inline-flex shrink-0 items-center gap-1 rounded-sm border border-gray-4 bg-white px-3 py-1.5 text-body-sm text-gray-1 transition-colors hover:border-blue hover:text-blue-shade"
        >
          {actionLabel ?? 'Controleer'}
          <ChevronRight size={15} aria-hidden />
        </Link>
      )}

      {/* Afgetekende stappen zijn terug te kijken; pas zichtbaar bij hover. */}
      {!actionTo && bekijkTo && (
        <Link
          to={bekijkTo}
          className="ml-auto inline-flex shrink-0 items-center gap-1 rounded-sm px-3 py-1.5 text-body-sm text-gray-3 opacity-0 transition-opacity hover:text-blue-shade group-hover:opacity-100 focus-visible:opacity-100"
        >
          <Eye size={14} aria-hidden />
          Bekijk
        </Link>
      )}
    </div>
  )
}

export interface LangViewTileProps {
  lang: Lang
  views?: number
}

/** Compacte tegel voor een live pagina: taal en aantal weergaven, meer niet. */
export function LangViewTile({ lang, views }: LangViewTileProps) {
  return (
    <span className="flex items-baseline gap-2 rounded-sm bg-gray-6 px-3 py-2">
      <span className="type-label text-gray-3">{lang}</span>
      <span className="text-body text-gray-1">{langLabel(lang)}</span>
      <span className="flex items-center gap-1 text-body-sm text-gray-3">
        {formatNumber(views ?? 0)}
      </span>
    </span>
  )
}
