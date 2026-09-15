import { Play } from 'lucide-react'
import type { Config, Lang } from '../../state/types'
import { avatarById } from '../../data/avatars'
import { Avatar } from './Avatar'
import { backgroundImage } from '../../lib/assets'
import { langDef } from '../../data/langs'
import { cn } from '../../lib/cn'

export interface SiteMockProps {
  config: Config
  /** Titel van de nagebootste pagina. */
  pageTitle?: string
  /** Klein formaat voor het 3x3-raster. */
  mini?: boolean
  /** Toont de widget uitgeklapt als videoframe. */
  expanded?: boolean
  /** Welke scène-achtergrond in het frame staat. */
  shot?: number
  /** Contentpagina in plaats van homepage: kop, broodkruimel, tekst, zijbalk. */
  soort?: 'home' | 'content'
  className?: string
}

/** Hoe breed één figuur is, afhankelijk van het aantal talen. Voluit
 *  geschreven, want de Tailwind-scanner leest broncode als tekst. */
const FIGURE_WIDTH: Record<number, string> = {
  1: 'w-[46%]',
  2: 'w-[40%]',
  3: 'w-[36%]',
  4: 'w-[32%]',
  5: 'w-[28%]',
}

const CORNER: Record<Config['widgetCorner'], string> = {
  lb: 'bottom-0 left-0',
  rb: 'bottom-0 right-0',
  lt: 'top-0 left-0',
  rt: 'top-0 right-0',
}

/**
 * Wireframe van een gemeentesite met de widget erin. Elke laag bewaakt zijn
 * eigen configwaarde, zodat de preview ook klopt voor iemand die terugkomt en
 * meteen in sectie 5 landt.
 */
export function SiteMock({
  config,
  pageTitle = 'Parkeervergunning bewoners',
  mini,
  expanded,
  shot = 0,
  soort = 'home',
  className,
}: SiteMockProps) {
  const primary = config.primary ?? '#BDBDBD'
  const secondary = config.secondary ?? '#E0E0E0'
  const hasBrand = Boolean(config.primary)
  const langs = config.languages.length ? config.languages : (['nl'] as Lang[])

  return (
    <div
      className={cn(
        'relative flex w-full flex-col overflow-hidden rounded-md bg-white shadow-card',
        mini ? 'aspect-[4/3]' : 'aspect-[16/10]',
        className,
      )}
    >
      {/* Sitekop: krijgt de opgehaalde huisstijlkleur zodra die er is. */}
      <div
        className="flex items-center gap-2 px-3 py-2 transition-colors duration-500"
        style={{ background: hasBrand ? primary : '#F2F2F2' }}
      >
        <div
          className={cn('rounded-sm transition-all duration-500', mini ? 'h-2 w-8' : 'h-3.5 w-16')}
          style={{ background: hasBrand ? '#ffffff' : '#BDBDBD' }}
        />
        <div className="ml-auto flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn('rounded-pill', mini ? 'h-1 w-4' : 'h-1.5 w-8')}
              style={{ background: hasBrand ? 'rgba(255,255,255,.55)' : '#E0E0E0' }}
            />
          ))}
        </div>
      </div>

      {soort === 'content' ? (
        <ContentPagina mini={mini} pageTitle={pageTitle} secondary={hasBrand ? secondary : '#BDBDBD'} />
      ) : (
        <div className="flex flex-1 flex-col gap-2 p-3">
          <div
            className={cn('rounded-sm', mini ? 'h-2 w-2/3' : 'h-3 w-3/5')}
            style={{ background: hasBrand ? secondary : '#BDBDBD' }}
          />
          {!mini && <p className="text-body-sm text-gray-3">{pageTitle}</p>}
          {[1, 0.92, 0.97, 0.6].map((w, i) => (
            <div
              key={i}
              className={cn('rounded-pill bg-gray-6', mini ? 'h-1' : 'h-2')}
              style={{ width: `${w * 100}%` }}
            />
          ))}
        </div>
      )}

      {expanded ? (
        <VideoFrame config={config} shot={shot} />
      ) : (
        <Widget config={config} langs={langs} mini={mini} primary={hasBrand ? primary : '#828282'} />
      )}
    </div>
  )
}

/** Een informatiepagina ziet er anders uit dan een homepage. */
function ContentPagina({
  mini,
  pageTitle,
  secondary,
}: {
  mini?: boolean
  pageTitle: string
  secondary: string
}) {
  return (
    <div className="flex flex-1 gap-3 p-3">
      <div className="flex flex-[2] flex-col gap-2">
        {/* Broodkruimel */}
        <div className="flex items-center gap-1">
          {[10, 14, 18].map((w, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && <span className="text-[8px] text-gray-4">›</span>}
              <span className="h-1 rounded-pill bg-gray-5" style={{ width: w }} />
            </span>
          ))}
        </div>
        <div
          className={cn('rounded-sm', mini ? 'h-2 w-3/4' : 'h-3 w-4/5')}
          style={{ background: secondary }}
        />
        {!mini && <p className="text-body-sm text-gray-3">{pageTitle}</p>}
        {[1, 0.95, 0.98, 0.9, 0.7].map((w, i) => (
          <div
            key={i}
            className={cn('rounded-pill bg-gray-6', mini ? 'h-1' : 'h-1.5')}
            style={{ width: `${w * 100}%` }}
          />
        ))}
      </div>

      {/* Zijbalk met verwante links */}
      <div className="flex flex-1 flex-col gap-1.5 rounded-sm bg-gray-6 p-2">
        <div className="h-1.5 w-2/3 rounded-pill bg-gray-4" />
        {[0.9, 0.75, 0.85].map((w, i) => (
          <div key={i} className="h-1 rounded-pill bg-gray-5" style={{ width: `${w * 100}%` }} />
        ))}
      </div>
    </div>
  )
}

function Widget({
  config,
  langs,
  mini,
  primary,
}: {
  config: Config
  langs: Lang[]
  mini?: boolean
  primary: string
}) {
  const shown = langs.slice(0, 5)
  const marge = config.widgetMargin ?? { x: 24, y: 24 }
  // De marge is in pixels op een echte pagina; hier schalen we mee met de mock.
  const schaal = mini ? 0.18 : 0.34

  // De thumbnail toont het eerste frame van de video. Zolang er nog geen
  // achtergrond gekozen is blijft hij wit, zoals in het ontwerp; daarna staat
  // de avatar op het kantoorshot, net als in de echte video.
  const bg = config.achtergrondModus
    ? backgroundImage(config.backgrounds[0] ?? 'kantoor-1')
    : undefined

  return (
    <div
      className={cn(
        'absolute flex flex-col overflow-hidden rounded-md bg-white shadow-pop transition-all duration-500',
        CORNER[config.widgetCorner],
        mini ? 'w-[42%]' : 'w-[38%]',
      )}
      style={{ margin: `${marge.y * schaal}px ${marge.x * schaal}px` }}
    >
      {/* Videokaartje: de gekozen avatars naast elkaar op één grondlijn.
          Zolang er niets gekozen is staan er silhouetten, één per taal. */}
      <div className="relative flex aspect-[16/10] items-end justify-center overflow-hidden bg-white">
        {bg && (
          <span
            className="absolute inset-0 scale-105 blur-[5px]"
            style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            aria-hidden
          />
        )}
        {config.achtergrondModus && !bg && (
          <span
            className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, #CDEFEC 0%, #E6FAFF 100%)' }}
            aria-hidden
          />
        )}
        {shown.map((code, i) => {
          const avatar = avatarById(config.avatars[code])
          return (
            <Avatar
              key={code}
              face={avatar?.face}
              name={avatar?.name}
              className={cn('relative h-full', FIGURE_WIDTH[shown.length] ?? 'w-[28%]', i > 0 && '-ml-[7%]')}
            />
          )
        })}

        {/* Play in het midden, zoals bij elke videospeler. */}
        <span
          className={cn(
            'absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-pill text-white shadow-card',
            mini ? 'size-4' : 'size-9',
          )}
          style={{ background: primary }}
        >
          <Play size={mini ? 8 : 16} aria-hidden />
        </span>
      </div>

      {/* Ondertitelbalk: kleurt mee zodra de huisstijl is opgehaald. */}
      <div
        className={cn('flex items-center transition-colors duration-500', mini ? 'h-3 px-1' : 'h-6 px-2')}
        style={{ background: config.primary ?? '#E0E0E0' }}
      >
        {!mini && (
          <span
            className="h-1.5 w-3/5 rounded-pill"
            style={{ background: config.primary ? 'rgba(255,255,255,.6)' : '#BDBDBD' }}
          />
        )}
      </div>
    </div>
  )
}

/** De widget uitgeklapt: avatar op de achtergrond, met scène-tijdlijn. */
function VideoFrame({ config, shot }: { config: Config; shot: number }) {
  const avatar = avatarById(config.avatars[config.languages[0] ?? 'nl'])
  const slug = config.backgrounds[shot] ?? `kantoor-${(shot % 4) + 1}`
  const bg = backgroundImage(slug)
  const scenes = config.videoType === 'adaptief' ? 6 : 4

  return (
    <div className="absolute inset-2 overflow-hidden rounded-sm bg-gray-1">
      <div
        className="absolute inset-0 scale-105 blur-[6px]"
        style={
          bg
            ? { backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }
            : { background: 'linear-gradient(135deg, #CDEFEC 0%, #E6FAFF 100%)' }
        }
      />

      {avatar && (
        <span className="absolute bottom-6 left-1/2 -translate-x-1/2">
          <Avatar face={avatar.face} name={avatar.name} className="h-48 w-44" />
        </span>
      )}

      {config.logo && (
        <span className="absolute right-2 top-2 rounded-sm bg-white/90 px-1.5 py-0.5 text-[10px] font-semibold text-gray-1">
          AI-gegenereerd
        </span>
      )}

      {/* Ondertitelbalk plus de scène-tijdlijn die met het videotype meebeweegt. */}
      <div className="absolute inset-x-2 bottom-2 flex flex-col gap-1.5">
        <span className="mx-auto rounded-sm bg-gray-1/80 px-2 py-1 text-center text-[11px] text-white">
          Woont u in een straat met betaald parkeren?
        </span>
        <span className="flex items-center gap-1">
          {Array.from({ length: scenes }, (_, i) => (
            <span
              key={i}
              className={cn('h-1 flex-1 rounded-pill', i === shot ? 'bg-white' : 'bg-white/40')}
            />
          ))}
          <span className="ml-1 text-[10px] text-white/80">
            {config.videoType === 'adaptief' ? '3:10' : '1:50'}
          </span>
        </span>
      </div>
    </div>
  )
}

export function PreviewGrid({ config }: { config: Config }) {
  const titles = [
    'Parkeervergunning', 'Bijstandsuitkering', 'WMO-ondersteuning',
    'Paspoort aanvragen', 'Afval en grofvuil', 'Verhuizen',
    'Rijbewijs verlengen', 'Bezwaar maken', 'Subsidie aanvragen',
  ]
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-3 gap-2">
        {titles.map((t) => (
          <SiteMock key={t} config={config} pageTitle={t} mini soort="content" />
        ))}
      </div>
      <p className="text-center text-body-sm text-gray-3">
        Deze instellingen gelden voor al je video’s.
      </p>
    </div>
  )
}

/** Alle talen die in de widget passen, voor de taalkeuze-popup. */
export const widgetLangs = (config: Config) =>
  config.languages.map((c) => ({ code: c, label: langDef(c)?.native ?? c }))
