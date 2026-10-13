import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '../../lib/cn'

export interface PopoverProps {
  /** Wat je aanklikt om hem te openen. Als functie krijgt hij mee of het
   *  kaartje openstaat, zodat een tooltip erin zich stil kan houden. */
  trigger: ReactNode | ((open: boolean) => ReactNode)
  /** Toegankelijke naam van de knop. */
  label: string
  /** Aan welke kant van de knop het kaartje uitlijnt. */
  align?: 'left' | 'right'
  /** Onder de knop, of erboven als daar meer ruimte is. */
  richting?: 'onder' | 'boven'
  children: ReactNode
  className?: string
}

/**
 * Kaartje dat onder zijn knop openklapt, met een pijltje ernaartoe. Sluit bij
 * een klik buiten of met Escape.
 *
 * Geen dialog: je leest hier iets na terwijl de pagina eronder gewoon blijft
 * staan. Een modaal venster zou dat zwaarder maken dan het is.
 */
export function Popover({
  trigger,
  label,
  align = 'left',
  richting = 'onder',
  children,
  className,
}: PopoverProps) {
  const [open, setOpen] = useState(false)
  const wrap = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!open) return
    const buiten = (e: MouseEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false)
    }
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', buiten)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('mousedown', buiten)
      document.removeEventListener('keydown', esc)
    }
  }, [open])

  return (
    <div ref={wrap} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={label}
        className="block cursor-pointer text-left"
      >
        {typeof trigger === 'function' ? trigger(open) : trigger}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={label}
          className={cn(
            'absolute z-40 w-80 rounded-md bg-white p-4 shadow-card',
            richting === 'boven' ? 'bottom-[calc(100%+10px)]' : 'top-[calc(100%+10px)]',
            align === 'right' ? 'right-0' : 'left-0',
          )}
        >
          {/* Pijltje naar de knop: een gedraaid vierkantje onder de rand. */}
          <span
            aria-hidden
            className={cn(
              'absolute size-3 rotate-45 bg-white',
              richting === 'boven' ? '-bottom-1.5' : '-top-1.5',
              align === 'right' ? 'right-6' : 'left-6',
            )}
          />
          <div className="relative flex flex-col gap-3">{children}</div>
        </div>
      )}
    </div>
  )
}
