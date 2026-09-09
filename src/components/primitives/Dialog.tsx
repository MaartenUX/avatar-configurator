import { useEffect, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { Button } from './Button'
import { cn } from '../../lib/cn'

export interface DialogOption {
  id: string
  label: string
  description?: string
}

export interface DialogProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  /** Radio-opties, bijv. de reden waarom een video niet oké is. */
  options?: DialogOption[]
  value?: string
  onValueChange?: (id: string) => void
  confirmLabel?: string
  onConfirm?: () => void
  cancelLabel?: string
  danger?: boolean
  children?: ReactNode
}

export function Dialog({
  open,
  onClose,
  title,
  description,
  options,
  value,
  onValueChange,
  confirmLabel = 'Bevestig',
  onConfirm,
  cancelLabel = 'Annuleer',
  danger,
  children,
}: DialogProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    panelRef.current?.focus()
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-gray-1/40 p-6">
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className="w-full max-w-lg rounded-md bg-white p-6 shadow-pop outline-none"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-h2 text-gray-1">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Sluiten"
            className="rounded-sm p-1 text-gray-3 hover:bg-gray-6 hover:text-gray-1"
          >
            <X size={18} aria-hidden />
          </button>
        </div>

        {description && <p className="mt-2 text-body text-gray-2">{description}</p>}

        {options && (
          <fieldset className="mt-4 flex flex-col gap-2">
            <legend className="sr-only">{title}</legend>
            {options.map((o) => (
              <label
                key={o.id}
                className={cn(
                  'flex cursor-pointer items-start gap-3 rounded-sm border p-3 transition-colors',
                  value === o.id ? 'border-blue bg-blue-tint' : 'border-gray-5 hover:border-gray-4',
                )}
              >
                <input
                  type="radio"
                  name="dialog-option"
                  checked={value === o.id}
                  onChange={() => onValueChange?.(o.id)}
                  className="mt-1 accent-[#46BAD8]"
                />
                <span className="flex flex-col">
                  <span className="text-body text-gray-1">{o.label}</span>
                  {o.description && <span className="text-body-sm text-gray-3">{o.description}</span>}
                </span>
              </label>
            ))}
          </fieldset>
        )}

        {children && <div className="mt-4">{children}</div>}

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            {cancelLabel}
          </Button>
          {onConfirm && (
            <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm}>
              {confirmLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
