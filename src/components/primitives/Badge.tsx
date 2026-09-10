import type { ReactNode } from 'react'
import { Check } from 'lucide-react'
import { STATUS, type StatusKey } from '../../tokens/status'
import { cn } from '../../lib/cn'

export interface BadgeProps {
  children?: ReactNode
  status?: StatusKey
  /** Optioneel percentage achter het label, bijv. bij het genereren. */
  percentage?: number
  dot?: boolean
  /** Trage puls als loader bij "wordt gemaakt". */
  pulse?: boolean
  className?: string
}

export function Badge({ children, status = 'todo', percentage, dot, pulse, className }: BadgeProps) {
  const style = STATUS[status]
  const afgerond = status === 'approved' || status === 'live'
  return (
    <span
      className={cn(
        'type-label inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1',
        style.chip,
        className,
      )}
    >
      {dot &&
        (afgerond ? (
          <Check size={12} strokeWidth={3} aria-hidden />
        ) : (
          <span
            className={cn(
              'size-1.5 rounded-pill',
              style.dot,
              pulse && 'animate-[traag-pulseren_2.5s_ease-in-out_infinite]',
            )}
          />
        ))}
      {children ?? style.label}
      {percentage !== undefined && <span className="opacity-70">{percentage}%</span>}
    </span>
  )
}
