import { cn } from '../../lib/cn'
import { STATUS, type StatusKey } from '../../tokens/status'

export interface ProgressBarProps {
  value: number
  max: number
  /** Bijv. "± 10 min te gaan", rechts van het stap-label. */
  note?: string
  showLabel?: boolean
  status?: StatusKey
  size?: 'sm' | 'md'
}

export function ProgressBar({
  value,
  max,
  note,
  showLabel = true,
  status = 'review',
  size = 'md',
}: ProgressBarProps) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0
  return (
    <div className="flex flex-col gap-1.5">
      {showLabel && (
        <div className="flex items-baseline justify-between gap-4">
          <span className="text-body-sm text-gray-2">
            Stap {value} van {max}
          </span>
          {note && <span className="text-body-sm text-gray-3">{note}</span>}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        className={cn('w-full overflow-hidden rounded-pill bg-gray-5', size === 'sm' ? 'h-1' : 'h-1.5')}
      >
        <div
          className={cn('h-full rounded-pill transition-[width] duration-500', STATUS[status].bar)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
