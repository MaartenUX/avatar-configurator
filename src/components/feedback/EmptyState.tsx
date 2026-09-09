import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

export interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  body?: string
  action?: ReactNode
}

export function EmptyState({ icon: Icon, title, body, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-md border border-dashed border-gray-4 bg-white px-6 py-12 text-center">
      {Icon && (
        <span className="grid size-12 place-items-center rounded-pill bg-gray-6 text-gray-3">
          <Icon size={22} aria-hidden />
        </span>
      )}
      <h3 className="text-h3 text-gray-1">{title}</h3>
      {body && <p className="max-w-sm text-body text-gray-2">{body}</p>}
      {action}
    </div>
  )
}
