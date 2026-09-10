import { useEffect, useState, type ReactNode } from 'react'
import { ChevronDown, X } from 'lucide-react'
import { cn } from '../../lib/cn'

export interface SidePanelProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

/**
 * Paneel dat over het scherm heen schuift. Gedeeld door LearnMore in de
 * configurator en de spraaktips in de controleschermen, zodat escape,
 * backdrop en rolgedrag maar op één plek staan.
 */
export function SidePanel({ open, onClose, title, children }: SidePanelProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-gray-1/30" onClick={onClose}>
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className="flex h-full w-full max-w-md flex-col gap-5 overflow-y-auto bg-white p-6 shadow-pop"
      >
        <header className="flex items-start justify-between gap-4">
          <h2 className="text-h2 text-gray-1">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Sluiten"
            className="rounded-sm p-1 text-gray-3 hover:bg-gray-6 hover:text-gray-1"
          >
            <X size={18} aria-hidden />
          </button>
        </header>
        {children}
      </aside>
    </div>
  )
}

export function Accordion({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-gray-6">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 py-3 text-left"
      >
        <span className="flex-1 text-body text-gray-1">{q}</span>
        <ChevronDown
          size={17}
          aria-hidden
          className={cn('shrink-0 text-gray-3 transition-transform', open && 'rotate-180')}
        />
      </button>
      {open && <p className="pb-3 text-body text-gray-2">{a}</p>}
    </div>
  )
}
