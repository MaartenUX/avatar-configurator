import { useState } from 'react'
import { Play, X } from 'lucide-react'
import { Avatar } from './Avatar'
import { VideoPreview } from './VideoPreview'
import { avatarById } from '../../data/avatars'
import { langDef, langLabel } from '../../data/langs'
import { demoVideo } from '../../lib/assets'
import { WIDGET_FADE_MS, WIDGET_TAAL_MS, WIDGET_TEKST } from '../../data/widget'
import { useNow } from '../../state/TickProvider'
import { pageContent } from '../../data'
import { DEMO_DUUR, demoSubtitles } from '../../data/demo'
import type { Config, Lang } from '../../state/types'
import { cn } from '../../lib/cn'

export interface WidgetKnopProps {
  config: Config
  /** Kleiner, voor de mini-previews in het raster. */
  mini?: boolean
  onOpen?: () => void
}

/** Hoe breed één figuur in de knop is, afhankelijk van het aantal talen. */
const FIGUUR = {
  1: 'w-[40%]',
  2: 'w-[34%]',
  3: 'w-[30%]',
  4: 'w-[26%]',
  5: 'w-[23%]',
} as const

/**
 * De widget zoals hij op de gemeentepagina staat: liggend, één kader met een
 * witte bovenkant waarin de gekozen avatars vrijstaand naast elkaar staan, de
 * play-knop eroverheen, en daaronder een balk in de huisstijlkleur
 * (CHANGES-05 B3).
 *
 * Geen foto erachter: die hoort bij de video, niet bij de knop. Zolang er voor
 * een taal nog geen avatar gekozen is, staat er een grijs silhouet.
 */
export function WidgetKnop({ config, mini, onOpen }: WidgetKnopProps) {
  const talen = (config.languages.length ? config.languages : ['nl']) as Lang[]
  const getoond = talen.slice(0, 5)

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label="Bekijk uitleg"
      className="block w-full overflow-hidden rounded-sm border border-gray-5 bg-white shadow-card"
    >
      <span className="relative flex aspect-[16/8] w-full items-end justify-center bg-white px-1">
        {getoond.map((code, i) => {
          const avatar = avatarById(config.avatars[code])
          return (
            <Avatar
              key={code}
              face={avatar?.face}
              name={avatar?.name}
              className={cn('h-[94%]', FIGUUR[getoond.length as 1] ?? 'w-[23%]', i > 0 && '-ml-[5%]')}
            />
          )
        })}

        <span className="absolute inset-0 grid place-items-center">
          <span
            className={cn(
              'grid place-items-center rounded-pill bg-white/95 text-blue-shade shadow-card',
              mini ? 'size-5' : 'size-9',
            )}
          >
            <Play size={mini ? 10 : 17} aria-hidden />
          </span>
        </span>
      </span>

      <WidgetBalk config={config} mini={mini} />
    </button>
  )
}

/**
 * De balk onder de knop. De tekst wisselt elke 2,5 seconde naar een volgende
 * gekozen taal en fadet daarbij uit en in. Hij hangt aan de gedeelde klok, dus
 * alle widgets op het scherm lopen gelijk en er is geen eigen interval.
 */
function WidgetBalk({ config, mini }: { config: Config; mini?: boolean }) {
  const now = useNow()
  const talen = (config.languages.length ? config.languages : ['nl']) as Lang[]
  const taal = talen[Math.floor(now / WIDGET_TAAL_MS) % talen.length]
  const sinds = now % WIDGET_TAAL_MS
  const opgehaald = Boolean(config.primary)

  return (
    <span
      className={cn(
        'block w-full truncate px-2 text-center font-medium',
        mini ? 'py-1 text-[0px]' : 'py-1 text-[11px] leading-5',
        opgehaald ? 'text-white' : 'text-gray-2',
      )}
      style={{ background: config.primary ?? '#e0e0e0' }}
    >
      {/* In het 3x3-raster is de knop te klein voor tekst; daar blijft alleen
          de balk in de huisstijlkleur over. */}
      {!mini && (
        <span
          dir={langDef(taal)?.dir}
          className="inline-block transition-opacity"
          style={{
            opacity: sinds >= WIDGET_TAAL_MS - WIDGET_FADE_MS ? 0 : 1,
            transitionDuration: `${WIDGET_FADE_MS}ms`,
          }}
        >
          {WIDGET_TEKST[taal]}
        </span>
      )}
    </span>
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
  // Zonder pagina is dit de demo: een voorbeeldtekst die de gemeente niet
  // noemt, want je kijkt naar je instellingen (CHANGES-03 E20).
  const inhoud = pageId ? pageContent(pageId) : undefined

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="relative w-full max-w-[280px]">
        <VideoPreview
          avatarId={config.avatars[taal]}
          lang={taal}
          subtitles={inhoud ? inhoud.subtitles[taal] ?? inhoud.subtitles.nl : demoSubtitles(taal)}
          durationSec={inhoud ? undefined : DEMO_DUUR}
          film={inhoud ? undefined : demoVideo()}
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
