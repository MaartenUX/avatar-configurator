import type { ReactNode } from 'react'
import { STATUS, type StatusKey } from '../../tokens/status'
import { cn } from '../../lib/cn'

export interface BadgeProps {
  children?: ReactNode
  status?: StatusKey
  /** Optioneel percentage achter het label, bijv. bij het genereren. */
  percentage?: number
  dot?: boolean
  className?: string
}

export function Badge({ children, status = 'todo', percentage, dot, className }: BadgeProps) {
  const style = STATUS[status]
  return (
    <span
      className={cn(
        'type-label inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1',
        style.chip,
        className,
      )}
    >
      {dot && <span className={cn('size-1.5 rounded-pill', style.dot)} />}
      {children ?? style.label}
      {percentage !== undefined && <span className="opacity-70">{percentage}%</span>}
    </span>
  )
}
