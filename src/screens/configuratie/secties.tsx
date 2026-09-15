import { useState } from 'react'
import { Building2, Check, ChevronDown, Gauge, Images, Timer, Upload } from 'lucide-react'
import { AdviceBox, AvatarTile, Button, Card, ChoiceTile, Chip, Input } from '../../components'
import { useStore } from '../../state/store'
import { ADVICE, advisedFor, avatarsFor } from '../../data/avatars'
import { MAX_EXTRA_LANGS, OPTIONAL_LANGS, langLabel } from '../../data/langs'
import { backgroundImage } from '../../lib/assets'
import type { Lang, WidgetCorner } from '../../state/types'
import { cn } from '../../lib/cn'

/* ---------------------------------------------------------------- 1. talen */

export function S1Talen() {
  const config = useStore((s) => s.config)
  const patch = useStore((s) => s.patchConfig)
  const extra = config.languages.filter((l) => l !== 'nl')
  const vol = extra.length >= MAX_EXTRA_LANGS

  const toggle = (lang: Lang) => {
    const has = config.languages.includes(lang)
    if (!has && vol) return
    const languages = has
      ? config.languages.filter((l) => l !== lang)
      : [...config.languages, lang]
    const avatars = { ...config.avatars }
    if (has) delete avatars[lang]
    patch({ languages, avatars })
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        <h3 className="text-h3 text-gray-1">Taalniveau</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <ChoiceTile
            title="B1" tag="Aanbevolen" selected={config.level === 'B1'}
            description="Korte zinnen, gewone woorden. Ongeveer zeven op de tien inwoners leest dit comfortabel."
            onSelect={() => patch({ level: 'B1' })}
          />
          <ChoiceTile
            title="B2" selected={config.level === 'B2'}
            description="Langere zinnen, meer vakwoorden. Kies dit alleen als je doelgroep dat aankan."
            onSelect={() => patch({ level: 'B2' })}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-h3 text-gray-1">Talen</h3>
        <p className="text-body-sm text-gray-2">
          Kies er maximaal {MAX_EXTRA_LANGS} bij naast Nederlands.
        </p>
        <div className="flex flex-wrap gap-2">
          <Chip label="Nederlands" selected />
          {OPTIONAL_LANGS.map((l) => {
            const on = config.languages.includes(l)
            return (
              <Chip
                key={l}
                label={langLabel(l)}
                selected={on}
                disabled={!on && vol}
                onClick={() => toggle(l)}
              />
            )
          })}
        </div>
        {vol && (
          <p className="text-body-sm text-orange-shade">
            Je hebt het maximum van {MAX_EXTRA_LANGS} extra talen bereikt. Meer talen nodig? Dat
            staat onder “Meer weten”.
          </p>
        )}
      </div>
    </>
  )
}

/* -------------------------------------------------------------- 2. avatars */

export function S2Avatars() {
  const config = useStore((s) => s.config)
  const patch = useStore((s) => s.patchConfig)

  return (
    <>
      {config.languages.map((lang) => {
        const gekozen = config.avatars[lang]
        return (
          <div key={lang} className="flex flex-col gap-2">
            <h3 className="text-h3 text-gray-1">{langLabel(lang)}</h3>
            {/* Half formaat: twee talen passen zo naast elkaar in beeld. */}
            <div className="grid max-w-md grid-cols-2 gap-3">
              {avatarsFor(lang).map((a) => (
                <AvatarTile
                  key={a.id}
                  avatar={a}
                  compact
                  selected={gekozen === a.id}
                  advised={a.advised}
                  onSelect={() => patch({ avatars: { ...config.avatars, [lang]: a.id } })}
                />
              ))}
            </div>
            {/* Alleen als je de aanbevolen avatar ook echt kiest. Anders stond
                er "Sanne is het meest gekozen" terwijl je Daan had aangeklikt. */}
            {gekozen === advisedFor(lang)?.id && (
              <AdviceBox>
                {advisedFor(lang)?.name}. {ADVICE[lang]}
              </AdviceBox>
            )}
          </div>
        )
      })}
    </>
  )
}

/* ------------------------------------------------------------ 3. videotype */

export function S3VideoType() {
  const config = useStore((s) => s.config)
  const patch = useStore((s) => s.patchConfig)

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        <ChoiceTile
          title="Vaste samenvatting" icon={Timer} tag="Aanbevolen"
          selected={config.videoType === 'vast'}
          description="Maximaal 3 minuten, vier tot zes scènes. Dit is ongeveer de grens van wat iemand aandachtig uitzit."
          onSelect={() => patch({ videoType: 'vast' })}
        />
        <ChoiceTile
          title="Adaptieve samenvatting" icon={Gauge}
          selected={config.videoType === 'adaptief'}
          description="Ongeveer tien procent van de leestijd, maximaal 6 minuten. Meer scènes bij een lange pagina."
          onSelect={() => patch({ videoType: 'adaptief' })}
        />
      </div>
      {config.videoType === 'vast' && (
        <AdviceBox>
          Vast is de aanbeveling. Wat na drie minuten komt, wordt zelden gezien.
        </AdviceBox>
      )}
    </>
  )
}

/* ------------------------------------------- 4. scènes en achtergronden */

const EIGEN_FOTOS = ['kantoor-2', 'kantoor-3', 'kantoor-4', 'kantoor-1', 'kantoor-2', 'kantoor-3']

export function S4Scenes() {
  const config = useStore((s) => s.config)
  const patch = useStore((s) => s.patchConfig)
  const aantal = config.videoType === 'adaptief' ? 6 : 4
  const eigen = config.achtergrondModus === 'eigen'
  const shots = config.backgrounds.length === aantal
    ? config.backgrounds
    : Array.from({ length: aantal }, () => null)

  const zet = (index: number, slug: string | null) => {
    patch({ backgrounds: shots.map((b, i) => (i === index ? slug : b)) })
  }

  return (
    <>
      {/* Eerst de keuze, dan pas de tegels. */}
      <div className="grid gap-3 sm:grid-cols-2">
        <ChoiceTile
          title="Standaard kantoorshots" icon={Building2}
          selected={config.achtergrondModus === 'standaard'}
          description="Rustige kantoorinterieurs, per scène een ander. Je hoeft niets aan te leveren."
          onSelect={() => patch({ achtergrondModus: 'standaard', backgrounds: [] })}
        />
        <ChoiceTile
          title="Personaliseer met eigen foto’s" icon={Images} tag="Aanbevolen"
          selected={eigen}
          description="Bijvoorbeeld het gemeentehuis of een plek buiten in de gemeente."
          onSelect={() =>
            patch({
              achtergrondModus: 'eigen',
              backgrounds: Array.from({ length: aantal }, () => null),
            })
          }
        />
      </div>

      {eigen && (
        <>
          <AdviceBox label="Handig om te weten">
            Een leuke manier om de video’s persoonlijker te maken. Foto’s hoeven niet van
            topkwaliteit te zijn — ze worden altijd licht geblurd.
          </AdviceBox>

          <div className="grid gap-3 sm:grid-cols-2">
            {shots.map((slug, i) => {
              const standaard = slug === null
              const src = backgroundImage(slug ?? `kantoor-${(i % 4) + 1}`)
              const rol = i === 0 ? 'Intro' : i === shots.length - 1 ? 'Outro' : `Inhoud ${i}`
              return (
                <Card key={i} className="flex flex-col gap-3 p-4">
                  <span className="type-label text-gray-3">
                    Scène {i + 1} · {rol}
                  </span>
                  <span className="overflow-hidden rounded-sm">
                    {src ? (
                      <img src={src} alt="" className="aspect-video w-full scale-105 object-cover blur-[6px]" />
                    ) : (
                      <span className="grid aspect-video w-full place-items-center bg-turq-tint text-body-sm text-turq-shade">
                        Kantoorshot {i + 1}
                      </span>
                    )}
                  </span>
                  <span className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant={standaard ? 'primary' : 'secondary'}
                      iconLeft={standaard ? Check : Building2}
                      onClick={() => zet(i, null)}
                    >
                      Kantoorshot
                    </Button>
                    <Button
                      size="sm"
                      variant={!standaard ? 'primary' : 'secondary'}
                      iconLeft={!standaard ? Check : Upload}
                      onClick={() => zet(i, EIGEN_FOTOS[i])}
                    >
                      Eigen foto
                    </Button>
                  </span>
                </Card>
              )
            })}
          </div>
        </>
      )}
    </>
  )
}

/* ---------------------------------------------------------------- 5. widget */

const HOEKEN: { id: WidgetCorner; label: string }[] = [
  { id: 'lt', label: 'Linksboven' },
  { id: 'rt', label: 'Rechtsboven' },
  { id: 'lb', label: 'Linksonder' },
  { id: 'rb', label: 'Rechtsonder' },
]

/** Gemockte huisstijl van Bergrode; in het echt komt dit uit de site. */
const HUISSTIJL = { logo: 'bergrode', primary: '#1F5E58', secondary: '#FF996D' }

export function S5Widget() {
  const config = useStore((s) => s.config)
  const patch = useStore((s) => s.patchConfig)
  const fast = useStore((s) => s.fast)
  const [url, setUrl] = useState(config.siteUrl || 'https://www.bergrode.nl')
  const [contentUrl, setContentUrl] = useState(config.contentUrl ?? '')
  const [contentOpen, setContentOpen] = useState(Boolean(config.contentUrl))
  const [specs, setSpecs] = useState(false)
  const [bezig, setBezig] = useState(false)

  const ophalen = () => {
    setBezig(true)
    // Gemockt: we doen alsof we de site uitlezen.
    window.setTimeout(() => {
      patch({ siteUrl: url, ...HUISSTIJL })
      setBezig(false)
    }, fast ? 300 : 1500)
  }

  const opgehaald = Boolean(config.primary)
  const marge = config.widgetMargin ?? { x: 24, y: 24 }

  return (
    <>
      <div className="flex flex-col gap-2">
        <h3 className="text-h3 text-gray-1">Je website</h3>
        <div className="flex items-end gap-2">
          <span className="flex-1">
            <Input
              label="Webadres" value={url} onChange={setUrl} type="url"
              hint="Hier halen we je logo en kleuren op."
            />
          </span>
          <Button onClick={ophalen} loading={bezig}>Ophalen</Button>
        </div>

        {opgehaald && (
          <Card className="flex flex-wrap items-center gap-4 p-4">
            <span className="flex items-center gap-2">
              <span className="grid size-10 place-items-center rounded-sm bg-gray-6 text-body-sm font-semibold text-gray-1">
                B
              </span>
              <span className="flex gap-1">
                <span className="size-6 rounded-sm" style={{ background: config.primary }} />
                <span className="size-6 rounded-sm" style={{ background: config.secondary }} />
              </span>
            </span>
            <span className="flex-1 text-body text-gray-2">Klopt dit?</span>
            <Button size="sm" variant="secondary" onClick={() => patch({ primary: undefined, logo: undefined })}>
              Aanpassen
            </Button>
            <Button size="sm" iconLeft={Check} onClick={() => {}}>Ja</Button>
          </Card>
        )}
      </div>

      {/* De preview toont een homepage; een informatiepagina ziet er anders uit. */}
      <div className="flex flex-col gap-2">
        {contentOpen ? (
          <>
            <Input
              label="Adres van een contentpagina"
              value={contentUrl}
              onChange={(v) => {
                setContentUrl(v)
                patch({ contentUrl: v })
              }}
              type="url"
              placeholder="https://www.bergrode.nl/parkeervergunning-bewoners"
              hint="De preview links wisselt dan naar een pagina met tekst en een zijbalk."
            />
            <Button
              variant="ghost" size="sm"
              onClick={() => {
                setContentOpen(false)
                setContentUrl('')
                patch({ contentUrl: undefined })
              }}
              className="w-fit"
            >
              Terug naar de homepage-preview
            </Button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setContentOpen(true)}
            className="w-fit text-body text-blue-shade hover:underline"
          >
            Preview verbeteren: voeg de URL van een contentpagina toe
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-h3 text-gray-1">Plek op de pagina</h3>
        <div className="flex flex-wrap gap-2">
          {HOEKEN.map((h) => (
            <button
              key={h.id}
              type="button"
              onClick={() => patch({ widgetCorner: h.id })}
              aria-pressed={config.widgetCorner === h.id}
              className={cn(
                'flex w-[120px] flex-col gap-1.5 rounded-sm border-2 p-2 text-left transition-colors',
                config.widgetCorner === h.id
                  ? 'border-blue bg-blue-tint'
                  : 'border-gray-5 hover:border-gray-4',
              )}
            >
              <HoekSchets corner={h.id} />
              <span className="text-body-sm text-gray-2">{h.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={() => setSpecs(!specs)}
          aria-expanded={specs}
          className="inline-flex w-fit items-center gap-1.5 rounded-sm py-1.5 text-body text-gray-2 hover:text-blue-shade"
        >
          Meer specificaties
          <ChevronDown size={16} aria-hidden className={cn('transition-transform', specs && 'rotate-180')} />
        </button>

        {specs && (
          <div className="flex flex-col gap-4 rounded-md border border-gray-5 p-4">
            <div className="flex flex-col gap-2">
              <h4 className="type-label text-gray-3">Afstand tot de rand</h4>
              <div className="flex flex-wrap gap-3">
                {(['x', 'y'] as const).map((as) => (
                  <label key={as} className="flex items-center gap-2 text-body-sm text-gray-2">
                    {as === 'x' ? 'Horizontaal' : 'Verticaal'}
                    <input
                      type="number"
                      min={0}
                      max={96}
                      value={marge[as]}
                      onChange={(e) =>
                        patch({ widgetMargin: { ...marge, [as]: Number(e.target.value) || 0 } })
                      }
                      className="w-20 rounded-sm border border-gray-4 px-2 py-1.5 text-body text-gray-1 outline-none focus:border-blue"
                    />
                    px
                  </label>
                ))}
              </div>
            </div>

            <p className="text-body-sm text-gray-3">
              Je krijgt straks standaardcode voor je website. Je webdeveloper kan die naar eigen
              inzicht aanpassen.
            </p>
          </div>
        )}
      </div>
    </>
  )
}

function HoekSchets({ corner }: { corner: WidgetCorner }) {
  const pos: Record<WidgetCorner, string> = {
    lt: 'top-1 left-1',
    rt: 'top-1 right-1',
    lb: 'bottom-1 left-1',
    rb: 'bottom-1 right-1',
  }
  return (
    <span className="relative block aspect-[4/3] w-full rounded-sm bg-gray-6">
      <span className={cn('absolute h-3 w-5 rounded-[3px] bg-blue', pos[corner])} />
    </span>
  )
}
