import { NavLink } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import { cn } from '../../lib/cn'

export interface SidebarItemProps {
  to: string
  icon: LucideIcon
  label: string
  badge?: number | string
  end?: boolean
  locked?: boolean
}

export function SidebarItem({ to, icon: Icon, label, badge, end, locked }: SidebarItemProps) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-sm px-3 py-2.5 text-body transition-colors',
          isActive ? 'bg-blue text-white' : 'text-gray-2 hover:bg-blue-tint hover:text-blue-shade',
        )
      }
    >
      <Icon size={18} strokeWidth={2} aria-hidden />
      <span className="flex-1">{label}</span>
      {locked && <span aria-label="vastgelegd">🔒</span>}
      {badge !== undefined && (
        <span className="type-label rounded-pill bg-orange-tint px-2 py-0.5 text-orange-shade">
          {badge}
        </span>
      )}
    </NavLink>
  )
}
