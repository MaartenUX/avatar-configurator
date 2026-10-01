import { useState } from 'react'
import { Play, X } from 'lucide-react'
import { Avatar } from './Avatar'
import { VideoPreview } from './VideoPreview'
import { avatarById } from '../../data/avatars'
import { langDef, langLabel } from '../../data/langs'
import { widgetKnop } from '../../lib/assets'
import { pageContent } from '../../data'
import type { Config, Lang } from '../../state/types'
import { cn } from '../../lib/cn'

/** Hoe breed één figuur in de knop is, afhankelijk van het aantal talen. */
const FIGUUR = {
  1: 'w-[46%]',
  2: 'w-[40%]',
  3: 'w-[36%]',
  4: 'w-[32%]',
  5: 'w-[28%]',
} as const

export interface WidgetKnopProps {
  config: Config
  /** Kleiner, voor de mini-previews in het raster. */
  mini?: boolean
  onOpen?: () => void
}

/**
 * De knop zoals hij op de gemeentepagina staat: liggend, zonder eigen
 * achtergrond. De gekozen avatars staan vrij naast elkaar met de play-knop in
 * het midden, in de opgehaalde huisstijlkleur (CHANGES-03 A2).
 *
 * Levert Sebastiaan `public/media/widget/button.png`, dan tonen we die; tot
 * dan bouwen we hem op uit de losse portretten.
 */
export function WidgetKnop({ config, mini, onOpen }: WidgetKnopProps) {
  const [echteKnopFaalt, setEchteKnopFaalt] = useState(false)
  const talen = (config.languages.length ? config.languages : ['nl']) as Lang[]
  const getoond = talen.slice(0, 5)
  const primary = config.primary ?? '#828282'

  if (!echteKnopFaalt) {
    return (
      <button type="button" onClick={onOpen} className="block w-full" aria-label="Bekijk uitleg">
        <img
          src={widgetKnop()}
          alt="Bekijk uitleg"
          className="w-full"
          onError={() => setEchteKnopFaalt(true)}
        />
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label="Bekijk uitleg"
      className="relative flex aspect-[16/7] w-full items-end justify-center"
    >
      {getoond.map((code, i) => {
        const avatar = avatarById(config.avatars[code])
        return (
          <Avatar
            key={code}
            face={avatar?.face}
            name={avatar?.name}
            className={cn('h-full', FIGUUR[getoond.length as 1] ?? 'w-[28%]', i > 0 && '-ml-[7%]')}
          />
        )
      })}

      <span
        className={cn(
          'absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-pill text-white shadow-card',
          mini ? 'size-4' : 'size-10',
        )}
        style={{ background: primary }}
      >
        <Play size={mini ? 8 : 18} aria-hidden />
      </span>
    </button>
  )
}

export interface WidgetVensterProps {
  config: Config
  /** Welke pagina de demo laat zien; leeg = de voorbeeldpagina. */
  pageId?: string
  onClose?: () => void
}

/**
 * Wat je ziet na een klik op de knop: de staande speler, en daaronder de rij
 * avatars als taalkeuze. Die rij blijft altijd onder de speler staan, ook
 * tijdens het afspelen (CHANGES-03 A2).
 */
export function WidgetVenster({ config, pageId, onClose }: WidgetVensterProps) {
  const talen = (config.languages.length ? config.languages : ['nl']) as Lang[]
  const [taal, setTaal] = useState<Lang>(talen[0])
  const inhoud = pageContent(pageId ?? 'p-parkeervergunning')

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="relative w-full max-w-[280px]">
        <VideoPreview
          avatarId={config.avatars[taal]}
          lang={taal}
          subtitles={inhoud?.subtitles[taal] ?? inhoud?.subtitles.nl}
          backgrounds={config.backgrounds}
          transition={config.transition}
          primary={config.primary}
        />
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Sluiten"
            className="absolute -right-2 -top-2 grid size-7 place-items-center rounded-pill bg-white text-gray-2 shadow-card hover:text-gray-1"
          >
            <X size={15} aria-hidden />
          </button>
        )}
      </div>

      {/* De taalkeuze: de avatars zelf, want zo herken je wie er spreekt. */}
      <div className="flex flex-wrap items-end justify-center gap-2">
        {talen.map((code) => {
          const avatar = avatarById(config.avatars[code])
          const actief = code === taal
          return (
            <button
              key={code}
              type="button"
              onClick={() => setTaal(code)}
              aria-pressed={actief}
              dir={langDef(code)?.dir}
              className={cn(
                'flex flex-col items-center gap-1 rounded-sm p-1 transition-colors',
                actief ? 'bg-blue-tint' : 'hover:bg-gray-6',
              )}
            >
              <Avatar
                face={avatar?.face}
                name={avatar?.name}
                round
                size={40}
                className={cn('ring-2', actief ? 'ring-blue' : 'ring-transparent')}
              />
              <span className={cn('type-label', actief ? 'text-blue-shade' : 'text-gray-3')}>
                {langLabel(code)}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
