import { useState } from 'react'
import { CircleHelp } from 'lucide-react'
import { Accordion, SidePanel } from './SidePanel'
import { learnMore } from '../../data/learnmore'
import { icon as lookupIcon } from '../../lib/icons'

export interface LearnMoreProps {
  sectionId: string
  label?: string
}

/** Knop die het zijpaneel opent met de uitleg en FAQ van deze stap. */
export function LearnMore({ sectionId, label = 'Meer weten' }: LearnMoreProps) {
  const [open, setOpen] = useState(false)
  const content = learnMore(sectionId)
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

      <SidePanel open={open} onClose={() => setOpen(false)} title={content.title}>
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
      </SidePanel>
    </>
  )
}
