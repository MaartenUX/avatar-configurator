import { useState } from 'react'
import { CircleHelp, Lightbulb, MessageCircle, X } from 'lucide-react'
import { learnMore } from '../../data/learnmore'
import { cn } from '../../lib/cn'

export interface HelpTrayProps {
  /** Welke uitleg hoort bij deze stap. */
  sectionId?: string
  tips?: string[]
}

type Panel = 'uitleg' | 'tips' | 'feedback'

/** Drie icoonknoppen rechtsboven in elke spaak, elk met een popover. */
export function HelpTray({ sectionId, tips }: HelpTrayProps) {
  const [panel, setPanel] = useState<Panel | null>(null)
  const content = sectionId ? learnMore(sectionId) : undefined

  const buttons: { id: Panel; icon: typeof CircleHelp; label: string }[] = [
    { id: 'uitleg', icon: CircleHelp, label: 'Uitleg' },
    { id: 'tips', icon: Lightbulb, label: 'Tips' },
    { id: 'feedback', icon: MessageCircle, label: 'Feedback' },
  ]

  return (
    <div className="relative flex items-center gap-1">
      {buttons.map((b) => (
        <button
          key={b.id}
          type="button"
          aria-label={b.label}
          aria-expanded={panel === b.id}
          onClick={() => setPanel(panel === b.id ? null : b.id)}
          className={cn(
            'grid size-9 place-items-center rounded-pill transition-colors',
            panel === b.id ? 'bg-blue text-white' : 'bg-white text-gray-2 shadow-card hover:text-blue-shade',
          )}
        >
          <b.icon size={17} aria-hidden />
        </button>
      ))}

      {panel && (
        <div className="absolute right-0 top-11 z-40 w-80 rounded-md bg-white p-4 shadow-pop">
          <button
            type="button"
            onClick={() => setPanel(null)}
            aria-label="Sluiten"
            className="absolute right-2 top-2 rounded-sm p-1 text-gray-3 hover:bg-gray-6"
          >
            <X size={15} aria-hidden />
          </button>

          {panel === 'uitleg' && (
            <div className="flex flex-col gap-2">
              <h3 className="text-h3 text-gray-1">{content?.title ?? 'Uitleg'}</h3>
              <p className="text-body-sm text-gray-2">
                {content?.body ?? 'Deze stap heeft nog geen uitleg.'}
              </p>
              {content?.faq.slice(0, 2).map((f) => (
                <div key={f.q} className="mt-1">
                  <p className="text-body-sm font-medium text-gray-1">{f.q}</p>
                  <p className="text-body-sm text-gray-2">{f.a}</p>
                </div>
              ))}
            </div>
          )}

          {panel === 'tips' && (
            <div className="flex flex-col gap-2">
              <h3 className="text-h3 text-gray-1">Tips</h3>
              <ul className="flex flex-col gap-1.5">
                {(tips ?? ['Luister eerst de audio helemaal af.', 'Twijfel je over de inhoud? Overleg met de webredactie van de pagina.']).map((t) => (
                  <li key={t} className="flex gap-2 text-body-sm text-gray-2">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-pill bg-orange" aria-hidden />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {panel === 'feedback' && (
            <div className="flex flex-col gap-2">
              <h3 className="text-h3 text-gray-1">Feedback</h3>
              <p className="text-body-sm text-gray-2">
                Loopt er iets niet lekker? Laat het hier achter, dan kijkt XS2Content mee.
              </p>
              <textarea
                rows={3}
                placeholder="Wat viel je op?"
                className="w-full resize-none rounded-sm border border-gray-4 p-2 text-body-sm outline-none focus:border-blue"
              />
              <button
                type="button"
                onClick={() => setPanel(null)}
                className="self-start rounded-sm bg-blue px-3 py-1.5 text-body-sm text-white hover:bg-blue-shade"
              >
                Versturen
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
