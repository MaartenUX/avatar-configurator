import { useEffect, useState } from 'react'
import { ChevronDown, CircleHelp, X } from 'lucide-react'
import { icon as lookupIcon } from '../../lib/icons'
import { learnMore } from '../../data/learnmore'
import { cn } from '../../lib/cn'

export interface LearnMoreProps {
  sectionId: string
  label?: string
}

/** Knop die een overlay rechts opent met uitleg en de FAQ van deze stap. */
export function LearnMore({ sectionId, label = 'Meer weten' }: LearnMoreProps) {
  const [open, setOpen] = useState(false)
  const content = learnMore(sectionId)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  if (!content) return null

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-sm text-body text-blue-shade hover:underline"
      >
        <CircleHelp size={16} aria-hidden />
        {label}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex justify-end bg-gray-1/30" onClick={() => setOpen(false)}>
          <aside
            role="dialog"
            aria-modal="true"
            aria-label={content.title}
            onClick={(e) => e.stopPropagation()}
            className="flex h-full w-full max-w-md flex-col gap-5 overflow-y-auto bg-white p-6 shadow-pop"
          >
            <header className="flex items-start justify-between gap-4">
              <h2 className="text-h2 text-gray-1">{content.title}</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Sluiten"
                className="rounded-sm p-1 text-gray-3 hover:bg-gray-6 hover:text-gray-1"
              >
                <X size={18} aria-hidden />
              </button>
            </header>

            <p className="text-body text-gray-2">{content.body}</p>

            <ul className="grid grid-cols-2 gap-2">
              {content.features.map((f) => {
                const Icon = lookupIcon(f.icon)
                return (
                  <li
                    key={f.label}
                    className="flex items-center gap-2 rounded-sm bg-gray-6 px-3 py-2.5 text-body-sm text-gray-2"
                  >
                    {Icon && <Icon size={16} className="shrink-0 text-blue-shade" aria-hidden />}
                    {f.label}
                  </li>
                )
              })}
            </ul>

            <div className="flex flex-col gap-1">
              <h3 className="type-label mb-1 text-gray-3">Veelgestelde vragen</h3>
              {content.faq.map((item) => (
                <Accordion key={item.q} q={item.q} a={item.a} />
              ))}
            </div>
          </aside>
        </div>
      )}
    </>
  )
}

function Accordion({ q, a }: { q: string; a: string }) {
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
