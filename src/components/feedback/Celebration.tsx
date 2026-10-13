import { ArrowUpRight, Briefcase, Camera, Check, Globe, MessageCircle, Users, Video } from 'lucide-react'
import { Card } from '../primitives/Card'

export interface CelebrationProps {
  title?: string
  /** Wat er allemaal gelukt is. */
  done: string[]
}

/**
 * Voorbeelden van wat andere gemeenten met hun video doen. Nadrukkelijk geen
 * knoppen: in de review las iemand ze als publiceerkeuzes (CHANGES-09 B10).
 */
const KANALEN = [
  { icon: Globe, label: 'Website', note: 'De widget staat live op de pagina zelf.' },
  { icon: Users, label: 'Facebook', note: 'In de tijdlijn, met de kern in het bericht.' },
  { icon: MessageCircle, label: 'WhatsApp', note: 'Doorgestuurd in wijk- en buurtgroepen.' },
  { icon: Video, label: 'YouTube', note: 'Op het eigen gemeentekanaal.' },
  { icon: Briefcase, label: 'LinkedIn', note: 'Voor ondernemers en partners.' },
  { icon: Camera, label: 'Instagram', note: 'De staande versie, als reel.' },
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
        <h3 className="text-h3 text-gray-1">Zo deden andere gemeenten het</h3>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {KANALEN.map((c) => (
            <Card key={c.label} className="flex items-start gap-3 p-4">
              <span className="grid size-9 shrink-0 place-items-center rounded-sm bg-violet-tint text-violet-shade">
                <c.icon size={17} aria-hidden />
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="text-body text-gray-1">{c.label}</span>
                <span className="text-body-sm text-gray-3">{c.note}</span>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="mt-1 inline-flex w-fit items-center gap-1 text-body-sm text-blue-shade hover:underline"
                >
                  Bekijk voorbeeld
                  <ArrowUpRight size={13} aria-hidden />
                </a>
              </span>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
