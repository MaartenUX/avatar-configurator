import type { ReactNode } from 'react'
import { ArrowDown } from 'lucide-react'
import { HowBox, LearnMore } from '../../components'
import type { SectionDef } from './sections'
import { cn } from '../../lib/cn'

export interface SectionShellProps {
  def: SectionDef
  state: 'past' | 'active' | 'future'
  register: (el: HTMLElement | null) => void
  onNext?: () => void
  /** Staat altijd direct onder de intro, vóór de keuzes. */
  weten?: string[]
  children: ReactNode
}

/**
 * Eén sectie in de doorlopende scrollpagina.
 *
 * De minimumhoogte is precies een scherm min de sticky balk min 64px, zodat de
 * kop van de volgende sectie onderin al meekijkt. Toekomstige secties dimmen
 * wel, maar blijven klikbaar: dimmen is een hint, geen slot.
 */
export function SectionShell({ def, state, register, onNext, weten, children }: SectionShellProps) {
  return (
    <section
      ref={register}
      id={`sectie-${def.id}`}
      data-index={def.index}
      data-state={state}
      style={{ scrollMarginTop: 'var(--bar-h)' }}
      className={cn(
        'flex min-h-[calc(100svh-var(--bar-h)-64px)] flex-col gap-5 pb-16 transition-opacity duration-300',
        state === 'future' && 'opacity-40',
      )}
    >
      <header className="flex flex-col gap-1.5">
        <span className="type-label text-gray-3">Stap {def.index} van 6</span>
        <h2 className="text-h1 text-gray-1">{def.title}</h2>
        <p className="text-body text-gray-2">{def.subtitle}</p>
        <span className="mt-1">
          <LearnMore sectionId={def.id} />
        </span>
      </header>

      {weten && weten.length > 0 && <HowBox title="Goed om te weten" points={weten} />}

      <div className="flex flex-col gap-5">{children}</div>

      {/* Sticky onderin het paneel, zodat je nooit hoeft te zoeken waar je
          verder klikt. Bij de laatste sectie is er niets meer om heen te gaan. */}
      {onNext && state === 'active' && (
        <div className="sticky bottom-0 -mx-8 mt-auto border-t border-gray-5 bg-white px-8 py-3 shadow-[0_-4px_16px_rgba(0,0,0,.06)]">
          <button
            type="button"
            onClick={onNext}
            className="inline-flex items-center gap-1.5 rounded-sm px-3 py-2 text-body text-gray-2 transition-colors hover:text-blue-shade"
          >
            Verder
            <ArrowDown size={16} aria-hidden />
          </button>
        </div>
      )}
    </section>
  )
}
