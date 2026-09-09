import { ChevronRight } from 'lucide-react'
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
  reviewer?: string
  /** Loopt er een timer voor deze taal, dan telt de rij mee af. */
  timer?: Timer
  views?: number
  /** Waar de actieknop heen gaat; zonder link geen knop. */
  actionTo?: string | null
  actionLabel?: string
  highlight?: boolean
}

/** Eén taal binnen een paginakaart: status, wie het oppakt, en wat jij kunt doen. */
export function LanguageRow({
  lang,
  status,
  reviewer,
  timer,
  views,
  actionTo,
  actionLabel,
  highlight,
}: LanguageRowProps) {
  const countdown = useCountdown(timer)
  const statusKey = LANG_STATUS[status]

  const label =
    status === 'generating' && countdown
      ? `Video wordt gemaakt · nog ${countdown.etaMin} min`
      : LANG_STATUS_LABEL[status]

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-sm px-2.5 py-2 transition-colors',
        highlight ? 'bg-blue-tint' : 'hover:bg-gray-6',
      )}
    >
      <span className="type-label w-8 shrink-0 text-gray-3">{lang}</span>
      <span className="w-24 shrink-0 text-body text-gray-1">{langLabel(lang)}</span>

      <Badge status={statusKey} dot>
        {label}
      </Badge>

      {reviewer && <span className="truncate text-body-sm text-gray-3">{reviewer}</span>}

      {views !== undefined && (
        <span className="text-body-sm text-gray-3">{formatNumber(views)} weergaven</span>
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
    </div>
  )
}
