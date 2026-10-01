import type { Config } from '../../state/types'
import { langDef } from '../../data/langs'
import { WidgetKnop, WidgetVenster } from './WidgetKnop'
import { cn } from '../../lib/cn'

export interface SiteMockProps {
  config: Config
  /** Titel van de nagebootste pagina. */
  pageTitle?: string
  /** Klein formaat voor het 3x3-raster. */
  mini?: boolean
  /** Toont de widget uitgeklapt als videoframe. */
  expanded?: boolean
  /** Klik op de widget-knop. */
  onOpen?: () => void
  /** Contentpagina in plaats van homepage: kop, broodkruimel, tekst, zijbalk. */
  soort?: 'home' | 'content'
  className?: string
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
  onOpen,
  soort = 'home',
  className,
}: SiteMockProps) {
  const primary = config.primary ?? '#BDBDBD'
  const secondary = config.secondary ?? '#E0E0E0'
  const hasBrand = Boolean(config.primary)

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
        <div className="absolute inset-0 grid place-items-center bg-gray-1/35 p-3">
          <WidgetVenster config={config} />
        </div>
      ) : (
        <Widget config={config} mini={mini} onOpen={onOpen} />
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

/** De widget op de pagina: liggende knop, zonder eigen achtergrond. */
function Widget({
  config,
  mini,
  onOpen,
}: {
  config: Config
  mini?: boolean
  onOpen?: () => void
}) {
  const marge = config.widgetMargin ?? { x: 24, y: 24 }
  // De marge is in pixels op een echte pagina; hier schalen we mee met de mock.
  const schaal = mini ? 0.18 : 0.34

  return (
    <div
      className={cn(
        'absolute transition-all duration-500',
        CORNER[config.widgetCorner],
        mini ? 'w-[42%]' : 'w-[38%]',
      )}
      style={{ margin: `${marge.y * schaal}px ${marge.x * schaal}px` }}
    >
      <WidgetKnop config={config} mini={mini} onOpen={onOpen} />
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
