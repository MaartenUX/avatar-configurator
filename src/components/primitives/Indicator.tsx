import { Check } from 'lucide-react'
import { STATUS, type StatusKey } from '../../tokens/status'
import { cn } from '../../lib/cn'

export interface IndicatorProps {
  status: StatusKey
  label?: string
  /** 'traag' is de loader bij "wordt gemaakt": 2,5 s, opacity 0,4 tot 1. */
  pulse?: boolean | 'traag'
  size?: 'sm' | 'md'
}

export function Indicator({ status, label, pulse, size = 'md' }: IndicatorProps) {
  const style = STATUS[status]
  // Goedgekeurd en live krijgen een vinkje in plaats van een stip: dat leest
  // als "af", waar een stip alleen een kleur is.
  const afgerond = status === 'approved' || status === 'live'

  return (
    <span className="inline-flex items-center gap-2">
      {afgerond ? (
        <span
          className={cn('grid shrink-0 place-items-center text-green-shade', size === 'sm' ? 'size-3.5' : 'size-4')}
          role={label ? undefined : 'img'}
          aria-label={label ? undefined : style.label}
        >
          <Check size={size === 'sm' ? 14 : 16} strokeWidth={3} aria-hidden />
        </span>
      ) : (
        <span
          className={cn(
            'shrink-0 rounded-pill',
            size === 'sm' ? 'size-2.5' : 'size-4',
            style.dot,
            pulse === 'traag' && 'animate-[traag-pulseren_2.5s_ease-in-out_infinite]',
            pulse === true && 'animate-pulse',
          )}
          role={label ? undefined : 'img'}
          aria-label={label ? undefined : style.label}
        />
      )}
      {label && <span className={cn('text-body-sm', style.text)}>{label}</span>}
    </span>
  )
}
