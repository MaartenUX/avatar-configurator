import type { LucideIcon } from 'lucide-react'
import { Card } from './Card'
import { formatNumber } from '../../lib/format'

export interface StatCardProps {
  label: string
  value: number | string
  sub?: string
  icon?: LucideIcon
}

export function StatCard({ label, value, sub, icon: Icon }: StatCardProps) {
  return (
    <Card className="flex flex-col gap-1 p-5">
      <span className="type-label flex items-center gap-1.5 text-gray-3">
        {Icon && <Icon size={13} aria-hidden />}
        {label}
      </span>
      <span className="text-h1 text-gray-1">
        {typeof value === 'number' ? formatNumber(value) : value}
      </span>
      {sub && <span className="text-body-sm text-gray-3">{sub}</span>}
    </Card>
  )
}
