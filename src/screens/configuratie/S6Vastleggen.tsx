import { useState, type RefObject } from 'react'
import { ArrowRight, Check, Pencil, Send } from 'lucide-react'
import { Button, Card, VideoPreview } from '../../components'
import { useStore } from '../../state/store'
import { avatarById } from '../../data/avatars'
import { langLabel } from '../../data/langs'
import { pageContent } from '../../data'
import { SECTIONS } from './sections'
import type { Lang } from '../../state/types'

export interface S6Props {
  /** Zodra dit in beeld komt wisselt de preview naar het 3x3-raster. */
  gridSentinel: RefObject<HTMLDivElement | null>
  onWijzig: (index: number) => void
  onVastgelegd: () => void
}

const HOEK_LABEL = {
  lt: 'Linksboven', rt: 'Rechtsboven', lb: 'Linksonder', rb: 'Rechtsonder',
} as const

export function S6Vastleggen({ gridSentinel, onWijzig, onVastgelegd }: S6Props) {
  const config = useStore((s) => s.config)
  const lockConfig = useStore((s) => s.lockConfig)
  const [begrepen, setBegrepen] = useState(false)
  const [demoTaal, setDemoTaal] = useState<Lang | null>(null)
  const [verstuurd, setVerstuurd] = useState(false)

  const parkeren = pageContent('p-parkeervergunning')
  const vergrendeld = config.status === 'locked'

  const regels: { label: string; waarde: string; sectie: number }[] = [
    { label: 'Taalniveau', waarde: config.level, sectie: 1 },
    { label: 'Talen', waarde: config.languages.map(langLabel).join(', '), sectie: 1 },
    {
      label: 'Avatars',
      waarde: config.languages
        .map((l) => `${langLabel(l)}: ${avatarById(config.avatars[l])?.name ?? '—'}`)
        .join(' · '),
      sectie: 2,
    },
    {
      label: 'Type video',
      waarde: config.videoType === 'vast' ? 'Vaste samenvatting, max 3 min' : 'Adaptief, max 6 min',
      sectie: 3,
    },
    {
      label: 'Achtergronden',
      waarde: config.backgrounds.every((b) => b === null)
        ? 'Standaard kantoorshots'
        : `${config.backgrounds.filter(Boolean).length} eigen beelden`,
      sectie: 4,
    },
    { label: 'Website', waarde: config.siteUrl || '—', sectie: 5 },
    { label: 'Plek van de widget', waarde: HOEK_LABEL[config.widgetCorner], sectie: 5 },
  ]

  return (
    <>
      {/* Volledige demo: klik op de widget, kies een taal, zie de video. */}
      <Card className="flex flex-col gap-3">
        <h3 className="text-h3 text-gray-1">Probeer het zoals een inwoner het ziet</h3>
        {demoTaal ? (
          <>
            <VideoPreview
              avatarId={config.avatars[demoTaal]}
              lang={demoTaal}
              subtitles={parkeren?.subtitles[demoTaal] ?? parkeren?.subtitles.nl}
              backgrounds={config.backgrounds}
              logo={config.logo}
            />
            <Button variant="ghost" onClick={() => setDemoTaal(null)}>Sluit de demo</Button>
          </>
        ) : (
          <>
            <p className="text-body text-gray-2">Kies een taal, net als een bezoeker op je site.</p>
            <div className="flex flex-wrap gap-2">
              {config.languages.map((l) => (
                <Button key={l} variant="secondary" onClick={() => setDemoTaal(l)}>
                  {langLabel(l)}
                </Button>
              ))}
            </div>
          </>
        )}

        <span className="flex items-center gap-3 border-t border-gray-6 pt-3">
          <Button
            variant="secondary" size="sm" iconLeft={Send}
            onClick={() => setVerstuurd(true)}
          >
            Stuur preview naar mezelf
          </Button>
          {verstuurd && (
            <span className="text-body-sm text-green-shade">
              Verstuurd naar e.devries@bergrode.nl
            </span>
          )}
        </span>
      </Card>

      {/* Vanaf hier wisselt de preview links naar het 3x3-raster. */}
      <div ref={gridSentinel} className="h-px" aria-hidden />

      <Card className="flex flex-col gap-4">
        <h3 className="text-h3 text-gray-1">Je keuzes</h3>
        <dl className="flex flex-col divide-y divide-gray-6">
          {regels.map((r) => (
            <div key={r.label} className="flex items-baseline gap-4 py-2.5">
              <dt className="w-44 shrink-0 text-body-sm text-gray-3">{r.label}</dt>
              <dd className="flex-1 text-body text-gray-1">{r.waarde}</dd>
              {!vergrendeld && (
                <button
                  type="button"
                  onClick={() => onWijzig(r.sectie)}
                  className="inline-flex shrink-0 items-center gap-1 rounded-sm px-2 py-1 text-body-sm text-blue-shade hover:bg-blue-tint"
                >
                  <Pencil size={13} aria-hidden />
                  Wijzig
                </button>
              )}
            </div>
          ))}
        </dl>
      </Card>

      {vergrendeld ? (
        <Card className="flex flex-col gap-3 border-2 border-green-shade">
          <h3 className="text-h3 text-gray-1">Vastgelegd</h3>
          <p className="text-body text-gray-2">
            Bekijk hoe het eruitziet en deel het gerust met je collega’s.
          </p>
          <Button iconLeft={ArrowRight} onClick={onVastgelegd}>Bekijk de demo</Button>
        </Card>
      ) : (
        <Card className="flex flex-col gap-4 border-2 border-blue">
          <h3 className="text-h3 text-gray-1">Vastleggen</h3>
          <label className="flex cursor-pointer items-start gap-3 text-body text-gray-2">
            <input
              type="checkbox"
              checked={begrepen}
              onChange={(e) => setBegrepen(e.target.checked)}
              className="mt-1 accent-[#46BAD8]"
            />
            Ik begrijp dat deze configuratie vastligt. Opnieuw instellen betekent een volledig
            nieuwe set-up en nieuwe video’s voor al mijn pagina’s.
          </label>
          <span className="flex flex-wrap items-center gap-3">
            <Button
              iconLeft={Check}
              disabled={!begrepen || SECTIONS.slice(0, 5).some((s) => !s.isDone(config))}
              onClick={lockConfig}
            >
              Configuratie vastleggen
            </Button>
            {SECTIONS.slice(0, 5).some((s) => !s.isDone(config)) && (
              <span className="text-body-sm text-orange-shade">
                Maak eerst alle stappen af.
              </span>
            )}
          </span>
        </Card>
      )}
    </>
  )
}
