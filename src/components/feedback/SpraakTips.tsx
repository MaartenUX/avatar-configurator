import { useState } from 'react'
import { Lightbulb } from 'lucide-react'
import { Accordion, SidePanel } from './SidePanel'
import { ONDERTITEL_FAQ, ONDERTITEL_TIPS, SPRAAKTIPS, SPRAAK_FAQ } from '../../data/spraaktips'
import { cn } from '../../lib/cn'

export interface SpraakTipsProps {
  /** 'spraak' bij de tekststappen, 'ondertitel' bij de videostap. */
  soort?: 'spraak' | 'ondertitel'
  /** Korte variant voor binnen het "Waar let je op"-kader. */
  compact?: boolean
}

const INHOUD = {
  spraak: {
    knop: 'Zo maak je de tekst beter voor spraak',
    titel: 'Beter voor spraak',
    intro:
      'Een stem leest je tekst precies zoals hij er staat. Deze zeven dingen maken het verschil tussen een zin die loopt en een zin waar je overheen struikelt.',
    tips: SPRAAKTIPS,
    faq: SPRAAK_FAQ,
  },
  ondertitel: {
    knop: 'Waar let je op bij ondertiteling?',
    titel: 'Ondertiteling nakijken',
    intro:
      'De ondertitels zijn automatisch uit de spraak gehaald. Meestal klopt het; op deze punten gaat het weleens mis.',
    tips: ONDERTITEL_TIPS,
    faq: ONDERTITEL_FAQ,
  },
}

/** Hoort in het "Waar let je op"-kader; compact toont alleen "Meer tips". */
export function SpraakTips({ soort = 'spraak', compact }: SpraakTipsProps) {
  const [open, setOpen] = useState(false)
  const inhoud = INHOUD[soort]

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          'inline-flex w-fit items-center gap-2 rounded-sm transition-colors',
          compact
            ? 'text-body-sm text-blue-shade hover:underline'
            : 'border border-gray-5 bg-white px-4 py-2.5 text-body text-gray-2 hover:border-blue hover:text-blue-shade',
        )}
      >
        <Lightbulb size={compact ? 15 : 17} aria-hidden />
        {compact ? 'Meer tips' : inhoud.knop}
      </button>

      <SidePanel open={open} onClose={() => setOpen(false)} title={inhoud.titel}>
        <p className="text-body text-gray-2">{inhoud.intro}</p>

        <ol className="flex flex-col gap-3">
          {inhoud.tips.map((tip, i) => (
            <li key={tip} className="flex gap-3">
              <span className="grid size-6 shrink-0 place-items-center rounded-pill bg-blue-tint text-body-sm font-semibold text-blue-shade">
                {i + 1}
              </span>
              <span className="text-body text-gray-2">{tip}</span>
            </li>
          ))}
        </ol>

        <div className="flex flex-col gap-1">
          <h3 className="type-label mb-1 text-gray-3">Veelgestelde vragen</h3>
          {inhoud.faq.map((f) => (
            <Accordion key={f.q} q={f.q} a={f.a} />
          ))}
        </div>
      </SidePanel>
    </>
  )
}
