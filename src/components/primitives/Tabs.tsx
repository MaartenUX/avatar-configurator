import type { LucideIcon } from 'lucide-react'
import { cn } from '../../lib/cn'

export interface TabItem {
  id: string
  label: string
  count?: number
  icon?: LucideIcon
}

export interface TabsProps {
  items: TabItem[]
  value: string
  onChange: (id: string) => void
  /** subtabs zijn compacter en hebben een icoon. */
  variant?: 'tabs' | 'subtabs'
}

export function Tabs({ items, value, onChange, variant = 'tabs' }: TabsProps) {
  return (
    <div role="tablist" className={cn('flex gap-1', variant === 'tabs' && 'border-b border-gray-5')}>
      {items.map((item) => {
        const active = item.id === value
        const Icon = item.icon
        return (
          <button
            key={item.id}
            role="tab"
            aria-selected={active}
            type="button"
            onClick={() => onChange(item.id)}
            className={cn(
              'inline-flex items-center gap-2 transition-colors',
              variant === 'tabs'
                ? cn(
                    'border-b-2 px-4 py-2.5 text-body',
                    active
                      ? 'border-blue text-blue-shade'
                      : 'border-transparent text-gray-3 hover:text-gray-1',
                  )
                : cn(
                    'rounded-pill px-3 py-1.5 text-body-sm',
                    active ? 'bg-blue-tint text-blue-shade' : 'text-gray-3 hover:bg-gray-6',
                  ),
            )}
          >
            {Icon && <Icon size={16} aria-hidden />}
            {item.label}
            {item.count !== undefined && (
              <span className={cn('text-body-sm', active ? 'text-blue-shade' : 'text-gray-4')}>
                {item.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
