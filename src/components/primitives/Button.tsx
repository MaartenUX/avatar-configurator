import type { ButtonHTMLAttributes, ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { LoaderCircle } from 'lucide-react'
import { cn } from '../../lib/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'md' | 'sm'

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  variant?: ButtonVariant
  size?: ButtonSize
  iconLeft?: LucideIcon
  iconRight?: LucideIcon
  loading?: boolean
  full?: boolean
  /** Rendert als router-link in plaats van knop. */
  to?: string
  children: ReactNode
}

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-blue text-white hover:bg-blue-shade disabled:bg-gray-4',
  secondary:
    'border border-gray-4 bg-white text-gray-1 hover:border-blue hover:text-blue-shade disabled:text-gray-4',
  ghost: 'text-gray-2 hover:bg-gray-6 hover:text-gray-1',
  danger: 'bg-red text-white hover:bg-red-shade',
}

// Klein is uppercase met zwaarder gewicht, zoals in Figma.
const SIZES: Record<ButtonSize, string> = {
  md: 'text-button px-4 py-2.5 rounded-sm gap-2',
  sm: 'text-body-sm font-semibold uppercase tracking-[0.04em] px-3 py-2 rounded-sm gap-1.5',
}

export function Button({
  variant = 'primary',
  size = 'md',
  iconLeft: IconLeft,
  iconRight: IconRight,
  loading,
  full,
  to,
  children,
  className,
  disabled,
  ...rest
}: ButtonProps) {
  const iconSize = size === 'sm' ? 15 : 18
  const classes = cn(
    'inline-flex items-center justify-center transition-colors',
    'disabled:cursor-not-allowed disabled:opacity-60',
    VARIANTS[variant],
    SIZES[size],
    full && 'w-full',
    className,
  )

  const content = (
    <>
      {loading ? (
        <LoaderCircle size={iconSize} className="animate-spin" aria-hidden />
      ) : (
        IconLeft && <IconLeft size={iconSize} aria-hidden />
      )}
      {children}
      {IconRight && !loading && <IconRight size={iconSize} aria-hidden />}
    </>
  )

  if (to && !disabled && !loading) {
    return (
      <Link to={to} className={classes}>
        {content}
      </Link>
    )
  }

  return (
    <button className={classes} disabled={disabled || loading} {...rest}>
      {content}
    </button>
  )
}
