import { useId, type ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '../../lib/cn'

export interface InputProps {
  label?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  /** Uitleg onder het veld. */
  hint?: string
  error?: string
  type?: 'text' | 'url' | 'email'
  icon?: LucideIcon
  suffix?: ReactNode
  disabled?: boolean
  id?: string
}

/**
 * Label ín het veld: 12px label boven de waarde van 16px, in een tint-vlak.
 * Zo blijft het label leesbaar terwijl er iets in staat.
 */
export function Input({
  label,
  value,
  onChange,
  placeholder,
  hint,
  error,
  type = 'text',
  icon: Icon,
  suffix,
  disabled,
  id,
}: InputProps) {
  const autoId = useId()
  const fieldId = id ?? autoId
  const hintId = `${fieldId}-hint`

  return (
    <div className="flex flex-col gap-1.5">
      <div
        className={cn(
          'flex items-center gap-2.5 rounded-sm border px-3 py-2 transition-colors',
          error
            ? 'border-red bg-red-tint/30'
            : disabled
              ? 'border-gray-5 bg-gray-6'
              : 'border-gray-4 bg-white focus-within:border-blue hover:border-gray-3',
        )}
      >
        {Icon && <Icon size={18} className="shrink-0 text-gray-3" aria-hidden />}
        <span className="flex min-w-0 flex-1 flex-col">
          {label && (
            <label htmlFor={fieldId} className="type-label text-gray-3">
              {label}
            </label>
          )}
          <input
            id={fieldId}
            type={type}
            value={value}
            disabled={disabled}
            placeholder={placeholder}
            aria-describedby={hint || error ? hintId : undefined}
            aria-invalid={error ? true : undefined}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-transparent text-body text-gray-1 outline-none placeholder:text-gray-4 disabled:text-gray-3"
          />
        </span>
        {suffix}
      </div>
      {(hint || error) && (
        <span id={hintId} className={cn('text-body-sm', error ? 'text-red-shade' : 'text-gray-3')}>
          {error ?? hint}
        </span>
      )}
    </div>
  )
}
