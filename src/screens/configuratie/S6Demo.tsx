import { useState, type RefObject } from 'react'
import { Check, Link2, Pencil, Play, Sparkles } from 'lucide-react'
import { Button, Card, WaitScreen } from '../../components'
import { useStore } from '../../state/store'
import { avatarById } from '../../data/avatars'
import { langDef, langLabel } from '../../data/langs'
import { SECTIONS } from './sections'

export interface S6Props {
  /** Zodra dit in beeld komt wisselt de preview naar het 3x3-raster. */
  gridSentinel: RefObject<HTMLDivElement | null>
  onWijzig: (index: number) => void
  onVastgelegd: () => void
}

const HOEK_LABEL = {
  lt: 'Linksboven', rt: 'Rechtsboven', lb: 'Linksonder', rb: 'Rechtsonder',
} as const

/**
 * De configurator eindigt in een echte demo, niet in een mail. Je maakt hem,
 * bekijkt hem links, en legt daarna pas vast.
 */
export function S6Demo({ gridSentinel, onWijzig, onVastgelegd }: S6Props) {
  const config = useStore((s) => s.config)
  const lockConfig = useStore((s) => s.lockConfig)
  const startDemo = useStore((s) => s.startDemo)
  const flash = useStore((s) => s.flash)

  const [begrepen, setBegrepen] = useState(false)

  const vergrendeld = config.status === 'locked'
  // De timer staat in de config: je mag wegklikken en later terugkomen.
  const bezig = Boolean(config.demoTimer)
  const klaar = Boolean(config.demoKlaar) || vergrendeld

  const deel = () => {
    void navigator.clipboard
      ?.writeText('https://demo.xs2content.nl/bergrode/9f3a2c')
      .catch(() => {})
    flash({ text: 'Link gekopieerd. Stuur hem naar je collega’s.', tone: 'success' })
  }

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
      label: 'Overgang',
      waarde: config.transition === 'logo' ? 'Logo tussen de scènes' : 'Camerawissel',
      sectie: 3,
    },
    {
      label: 'Achtergronden',
      waarde:
        config.achtergrondModus === 'eigen'
          ? `${config.backgrounds.filter(Boolean).length} eigen beelden`
          : 'Standaard kantoorshots',
      sectie: 4,
    },
    { label: 'Website', waarde: config.siteUrl || '—', sectie: 5 },
    {
      label: 'Plek van de widget',
      waarde: `${HOEK_LABEL[config.widgetCorner]}, ${config.widgetMargin?.x ?? 24} bij ${config.widgetMargin?.y ?? 24} px van de rand`,
      sectie: 5,
    },
  ]

  const alleStappenAf = SECTIONS.slice(0, 5).every((s) => s.isDone(config))

  if (bezig) {
    return (
      <WaitScreen
        title="We maken je demovideo"
        subtitle="Dit duurt ongeveer een half uur. Je hoeft niet te wachten — je krijgt een mail zodra de demo klaar is."
        timer={config.demoTimer}
        tips={[
          'Op het overzicht zie je hoelang het nog duurt.',
          'Straks speel je de demo af in de preview hiernaast.',
          'Klopt er iets niet? Je kunt elke stap nog aanpassen.',
        ]}
      >
        {/* Direct actief: wachten hoeft niet. */}
        <Button variant="secondary" to="/">
          Terug naar het overzicht
        </Button>
      </WaitScreen>
    )
  }

  if (!klaar) {
    return (
      <Card className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-h3 text-gray-1">Maak een demovideo</h3>
          <p className="text-body text-gray-2">
            We maken een korte video met jouw avatars, achtergronden en overgang. De tekst is een
            voorbeeldtekst. Zo zie je precies hoe je video’s eruit gaan zien voordat je de
            instellingen vastlegt.
          </p>
        </div>
        <span className="flex flex-wrap items-center gap-3">
          <Button iconLeft={Sparkles} onClick={startDemo} disabled={!alleStappenAf}>
            Maak demovideo
          </Button>
          {!alleStappenAf && (
            <span className="text-body-sm text-orange-shade">Maak eerst alle stappen af.</span>
          )}
        </span>
      </Card>
    )
  }

  return (
    <>
      <Card className="flex flex-wrap items-center gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-pill bg-green-tint text-green-shade">
          <Play size={17} aria-hidden />
        </span>
        <p className="min-w-48 flex-1 text-body text-gray-2">
          Je demovideo staat klaar. Klik links op de knop in de pagina om hem te bekijken.
        </p>
        <Button variant="secondary" iconLeft={Link2} onClick={deel}>
          Kopieer link
        </Button>
      </Card>

      {/* Vanaf hier wisselt de preview links naar het 3x3-raster. */}
      <div ref={gridSentinel} className="h-px" aria-hidden />

      <Card className="flex flex-col gap-4">
        <h3 className="text-h3 text-gray-1">Je keuzes</h3>
        <dl className="flex flex-col divide-y divide-gray-6">
          {regels.map((r) => (
            <div key={r.label} className="flex items-baseline gap-4 py-2.5">
              <dt className="w-40 shrink-0 text-body-sm text-gray-3">{r.label}</dt>
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
        <Card className="flex flex-col gap-2 border-2 border-green-shade">
          <h3 className="flex items-center gap-2 text-h3 text-gray-1">
            <Check size={19} strokeWidth={3} className="text-green-shade" aria-hidden />
            Instellingen vastgelegd
          </h3>
          <p className="text-body text-gray-2">
            Je kunt alles inzien, maar niet meer wijzigen.
          </p>
        </Card>
      ) : (
        <Card className="flex flex-col gap-4 border-2 border-blue">
          <h3 className="text-h3 text-gray-1">Instellingen vastleggen</h3>
          <label className="flex cursor-pointer items-start gap-3 text-body text-gray-2">
            <input
              type="checkbox"
              checked={begrepen}
              onChange={(e) => setBegrepen(e.target.checked)}
              className="mt-1 accent-[#46BAD8]"
            />
            Ik begrijp dat deze instellingen vastliggen. Opnieuw instellen betekent een volledig
            nieuwe set-up en nieuwe video’s voor al mijn pagina’s.
          </label>
          <Button
            iconLeft={Check}
            disabled={!begrepen}
            onClick={() => {
              lockConfig()
              onVastgelegd()
            }}
            className="w-fit"
          >
            Instellingen vastleggen
          </Button>
        </Card>
      )}
    </>
  )
}

export { langDef }
