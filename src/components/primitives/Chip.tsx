import type { LucideIcon } from 'lucide-react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../lib/cn'

export interface ChipProps {
  label: string
  selected?: boolean
  count?: number
  icon?: LucideIcon
  chevron?: boolean
  disabled?: boolean
  onClick?: () => void
}

/** Filter-pill. Aan of uit, met een optionele teller. */
export function Chip({ label, selected, count, icon: Icon, chevron, disabled, onClick }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      className={cn(
        'inline-flex items-center gap-2 rounded-pill border px-3.5 py-1.5 text-body-sm transition-colors',
        selected
          ? 'border-blue bg-blue-tint text-blue-shade'
          : 'border-gray-4 bg-white text-gray-2 hover:border-blue hover:text-blue-shade',
        disabled && 'cursor-not-allowed opacity-50',
      )}
    >
      {Icon && <Icon size={15} aria-hidden />}
      {label}
      {count !== undefined && (
        <span className={cn('text-body-sm', selected ? 'text-blue-shade' : 'text-gray-3')}>{count}</span>
      )}
      {chevron && <ChevronDown size={15} aria-hidden />}
    </button>
  )
}
