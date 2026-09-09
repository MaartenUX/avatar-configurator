import { cn } from '../../lib/cn'
import { creditsLabel } from '../../lib/format'

export interface CreditsMeterProps {
  used: number
  total: number
  compact?: boolean
}

export function CreditsMeter({ used, total, compact }: CreditsMeterProps) {
  const left = Math.max(0, total - used)
  const pct = Math.round((left / total) * 100)
  const low = left <= 2

  return (
    <div className={cn('flex items-center gap-3', compact && 'gap-2')}>
      <div className="flex flex-col gap-1">
        <span className={cn('text-body-sm', low ? 'text-orange-shade' : 'text-gray-2')}>
          {creditsLabel(used, total)}
        </span>
        {!compact && (
          <div className="h-1.5 w-32 overflow-hidden rounded-pill bg-gray-5">
            <div
              className={cn('h-full rounded-pill transition-[width] duration-500', low ? 'bg-orange' : 'bg-blue')}
              style={{ width: `${pct}%` }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
