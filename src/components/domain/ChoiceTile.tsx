import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Check } from 'lucide-react'
import { cn } from '../../lib/cn'

export interface ChoiceTileProps {
  title: string
  description?: string
  icon?: LucideIcon
  /** Afbeelding of gekleurd vlak boven de tekst. */
  visual?: ReactNode
  selected: boolean
  /** Label rechtsboven, bijv. "Aanbevolen". */
  tag?: string
  disabled?: boolean
  onSelect: () => void
  className?: string
}

/** Keuzeblok in Remarkable-stijl: gekozen = blauwe rand met tintvlak. */
export function ChoiceTile({
  title,
  description,
  icon: Icon,
  visual,
  selected,
  tag,
  disabled,
  onSelect,
  className,
}: ChoiceTileProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      aria-pressed={selected}
      className={cn(
        'relative flex flex-col gap-2 rounded-md border-2 p-4 text-left transition-all',
        selected
          ? 'border-blue bg-blue-tint'
          : 'border-gray-5 bg-white hover:border-gray-4 hover:shadow-card',
        disabled && 'cursor-not-allowed opacity-50',
        className,
      )}
    >
      {tag && (
        <span className="type-label absolute right-3 top-3 rounded-pill bg-green-tint px-2 py-0.5 text-green-shade">
          {tag}
        </span>
      )}

      {visual && <div className="overflow-hidden rounded-sm">{visual}</div>}

      <span className="flex items-center gap-2">
        {Icon && (
          <Icon size={18} className={selected ? 'text-blue-shade' : 'text-gray-3'} aria-hidden />
        )}
        <span className={cn('text-h3', selected ? 'text-blue-shade' : 'text-gray-1')}>{title}</span>
        {selected && (
          <span className="ml-auto grid size-5 place-items-center rounded-pill bg-blue text-white">
            <Check size={13} strokeWidth={3} aria-hidden />
          </span>
        )}
      </span>

      {description && <span className="text-body-sm text-gray-2">{description}</span>}
    </button>
  )
}
