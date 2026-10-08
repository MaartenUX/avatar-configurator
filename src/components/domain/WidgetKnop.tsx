import { useState } from 'react'
import { Play, X } from 'lucide-react'
import { Avatar } from './Avatar'
import { VideoPreview } from './VideoPreview'
import { avatarById } from '../../data/avatars'
import { langDef, langLabel } from '../../data/langs'
import { backgroundImage, demoVideo, kantoorshot } from '../../lib/assets'
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

/**
 * De widget zoals hij op de gemeentepagina staat: één kader met daarin een
 * staand videoframe en daaronder een balk in de huisstijlkleur (CHANGES-02 B8
 * en B9). De liggende, vrijstaande variant uit CHANGES-03 A2 is vervallen.
 *
 * Zolang de huisstijl niet is opgehaald is de balk grijs; de tekst wordt dan
 * donker, want wit op gray-5 is niet te lezen.
 */
export function WidgetKnop({ config, mini, onOpen }: WidgetKnopProps) {
  const taal = (config.languages[0] ?? 'nl') as Lang
  const avatar = avatarById(config.avatars[taal])
  const bg = backgroundImage(config.backgrounds[0] ?? kantoorshot(0))
  const opgehaald = Boolean(config.primary)

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label="Bekijk uitleg"
      className="block w-full overflow-hidden rounded-sm border border-gray-5 bg-white shadow-card"
    >
      <span className="relative block aspect-[9/16] overflow-hidden bg-gray-6">
        <img src={bg} alt="" className="absolute inset-0 size-full scale-105 object-cover blur-[3px]" />
        <Avatar
          face={avatar?.face}
          name={avatar?.name}
          className="absolute inset-x-0 bottom-0 mx-auto h-[82%] w-[86%]"
        />
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

      {/* In het 3x3-raster is de knop te klein voor tekst; daar blijft alleen
          de balk in de huisstijlkleur over. */}
      <span
        className={cn(
          'block w-full truncate px-2 text-center font-medium',
          mini ? 'py-1 text-[0px]' : 'py-1 text-[11px] leading-5',
          opgehaald ? 'text-white' : 'text-gray-2',
        )}
        style={{ background: config.primary ?? '#e0e0e0' }}
      >
        {mini ? '' : 'Videovertaling'}
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
