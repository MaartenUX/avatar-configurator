import { Check, Globe, MessageCircle, Users, Video } from 'lucide-react'
import { Card } from '../primitives/Card'

export interface CelebrationProps {
  title?: string
  /** Wat er allemaal gelukt is. */
  done: string[]
}

const CHANNELS = [
  { icon: Globe, label: 'Website', note: 'De widget staat live op je pagina.' },
  { icon: Users, label: 'Facebook', note: 'Deel de video in je tijdlijn.' },
  { icon: MessageCircle, label: 'WhatsApp', note: 'Stuur hem door in wijkgroepen.' },
  { icon: Video, label: 'YouTube', note: 'Zet hem op je gemeentekanaal.' },
]

/** Sluit de flow af en laat zien wat er nu nog méér kan. */
export function Celebration({ title = 'Je bent klaar!', done }: CelebrationProps) {
  return (
    <div className="flex flex-col gap-5">
      <Card className="flex flex-col gap-3">
        <h2 className="text-h1 text-gray-1">{title}</h2>
        <ul className="flex flex-col gap-2">
          {done.map((d) => (
            <li key={d} className="flex items-center gap-2.5 text-body text-gray-2">
              <span className="grid size-5 shrink-0 place-items-center rounded-pill bg-green-tint text-green-shade">
                <Check size={13} strokeWidth={3} aria-hidden />
              </span>
              {d}
            </li>
          ))}
        </ul>
      </Card>

      <div className="flex flex-col gap-2">
        <h3 className="text-h3 text-gray-1">Laat je video meer doen</h3>
        <div className="grid gap-2 sm:grid-cols-2">
          {CHANNELS.map((c) => (
            <Card key={c.label} className="flex items-start gap-3 p-4" interactive>
              <span className="grid size-9 shrink-0 place-items-center rounded-sm bg-violet-tint text-violet-shade">
                <c.icon size={17} aria-hidden />
              </span>
              <span className="flex flex-col">
                <span className="text-body text-gray-1">{c.label}</span>
                <span className="text-body-sm text-gray-3">{c.note}</span>
                <span className="mt-1 text-body-sm text-blue-shade">
                  Laat je inspireren door Gemeente Zonnestad
                </span>
              </span>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
