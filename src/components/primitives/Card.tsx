import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

export interface CardProps {
  children: ReactNode
  /** Uit als de kaart zijn eigen padding regelt. */
  padded?: boolean
  interactive?: boolean
  tone?: 'default' | 'tint' | 'dashed'
  onClick?: () => void
  className?: string
  /** Voor anker-links, bijv. /hulp#feedback. */
  id?: string
}

export function Card({
  children,
  padded = true,
  interactive,
  tone = 'default',
  onClick,
  className,
  id,
}: CardProps) {
  const Tag = onClick ? 'button' : 'div'
  return (
    <Tag
      id={id}
      onClick={onClick}
      className={cn(
        'rounded-md text-left',
        tone === 'tint' && 'bg-blue-tint',
        tone === 'dashed' && 'border border-dashed border-gray-4 bg-white',
        tone === 'default' && 'bg-white shadow-card',
        padded && 'p-6',
        (interactive || onClick) && 'transition-shadow hover:shadow-pop',
        onClick && 'w-full',
        className,
      )}
    >
      {children}
    </Tag>
  )
}
