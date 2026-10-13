import { Info } from 'lucide-react'
import { Popover } from '../feedback/Popover'
import { Accordion } from '../feedback/SidePanel'
import { ABONNEMENT } from '../../data/learnmore'
import { useStore } from '../../state/store'
import { rerunsLabel, videosLabel } from '../../lib/format'
import type { ReactNode } from 'react'

/** De inhoud van het kaartje: twee tellers met uitleg, daaronder de vragen. */
function Inhoud() {
  const videos = useStore((s) => s.videos)
  const reruns = useStore((s) => s.reruns)

  return (
    <>
      <span className="type-label w-fit rounded-pill bg-gray-6 px-2 py-0.5 text-gray-3">
        {ABONNEMENT.label}
      </span>

      <div className="flex flex-col gap-0.5">
        <span className="text-body text-gray-1">{videosLabel(videos.used, videos.total)}</span>
        <span className="text-body-sm text-gray-2">{ABONNEMENT.videos}</span>
      </div>

      <div className="flex flex-col gap-0.5">
        <span className="text-body text-gray-1">{rerunsLabel(reruns.used, reruns.total)}</span>
        <span className="text-body-sm text-gray-2">{ABONNEMENT.reruns}</span>
      </div>

      <div className="flex flex-col border-t border-gray-6 pt-1">
        {ABONNEMENT.faq.map((f) => (
          <Accordion key={f.q} q={f.q} a={f.a} />
        ))}
      </div>
    </>
  )
}

/** Hetzelfde kaartje achter een eigen knop. */
export function AbonnementPopover({
  trigger,
  align = 'left',
  richting,
}: {
  trigger: ReactNode | ((open: boolean) => ReactNode)
  align?: 'left' | 'right'
  richting?: 'onder' | 'boven'
}) {
  return (
    <Popover
      trigger={trigger}
      label="Wat zit er in je abonnement?"
      align={align}
      richting={richting}
      className="inline-block align-middle"
    >
      <Inhoud />
    </Popover>
  )
}

/** Klein ⓘ achter een zin die over het abonnement gaat. */
export function AbonnementInfo({
  align = 'left',
  richting,
}: {
  align?: 'left' | 'right'
  richting?: 'onder' | 'boven'
}) {
  return (
    <AbonnementPopover
      align={align}
      richting={richting}
      trigger={
        <Info size={14} className="text-gray-3 transition-colors hover:text-blue-shade" aria-hidden />
      }
    />
  )
}
