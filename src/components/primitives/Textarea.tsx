import { useId } from 'react'
import { cn } from '../../lib/cn'

export interface TextareaProps {
  label?: string
  value: string
  onChange: (value: string) => void
  rows?: number
  disabled?: boolean
  dir?: 'ltr' | 'rtl'
  id?: string
  className?: string
}

export function Textarea({
  label,
  value,
  onChange,
  rows = 4,
  disabled,
  dir,
  id,
  className,
}: TextareaProps) {
  const autoId = useId()
  const fieldId = id ?? autoId

  return (
    <div
      className={cn(
        'flex flex-col rounded-sm border px-3 py-2 transition-colors',
        disabled ? 'border-gray-5 bg-gray-6' : 'border-gray-4 bg-white focus-within:border-blue',
        className,
      )}
    >
      {label && (
        <label htmlFor={fieldId} className="type-label text-gray-3">
          {label}
        </label>
      )}
      <textarea
        id={fieldId}
        value={value}
        rows={rows}
        dir={dir}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="w-full resize-none bg-transparent text-body text-gray-1 outline-none disabled:text-gray-3"
      />
    </div>
  )
}
