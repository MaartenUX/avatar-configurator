import { STATUS, type StatusKey } from '../../tokens/status'
import { cn } from '../../lib/cn'

export interface IndicatorProps {
  status: StatusKey
  label?: string
  /** Laat het rondje pulseren zolang er iets loopt. */
  pulse?: boolean
  size?: 'sm' | 'md'
}

export function Indicator({ status, label, pulse, size = 'md' }: IndicatorProps) {
  const style = STATUS[status]
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className={cn(
          'rounded-pill',
          size === 'sm' ? 'size-2.5' : 'size-4',
          style.dot,
          pulse && 'animate-pulse',
        )}
        role={label ? undefined : 'img'}
        aria-label={label ? undefined : style.label}
      />
      {label && <span className={cn('text-body-sm', style.text)}>{label}</span>}
    </span>
  )
}
