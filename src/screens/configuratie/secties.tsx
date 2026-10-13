import { useState } from 'react'
import { Building2, Camera, Check, ChevronDown, Images, Sparkle, Upload } from 'lucide-react'
import { AdviceBox, Avatar, AvatarTile, Button, Card, ChoiceTile, Chip, Input } from '../../components'
import { avatarById } from '../../data/avatars'
import { sceneLabel } from '../../data/copy'
import { useStore } from '../../state/store'
import { ADVICE, advisedFor, avatarsFor } from '../../data/avatars'
import { LANG_CODES, MAX_TALEN, langLabel } from '../../data/langs'
import { KANTOORSHOTS, backgroundImage, kantoorshot } from '../../lib/assets'
import type { Lang, WidgetPositie } from '../../state/types'
import { cn } from '../../lib/cn'

/* ---------------------------------------------------------------- 1. talen */

export function S1Talen() {
  const config = useStore((s) => s.config)
  const patch = useStore((s) => s.patchConfig)
  const vol = config.languages.length >= MAX_TALEN

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
            title="A2" selected={config.level === 'A2'}
            description="Nog eenvoudiger: alleen de meest gewone woorden en heel korte zinnen. Voor wie moeite heeft met lezen."
            onSelect={() => patch({ level: 'A2' })}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-baseline gap-3">
          <h3 className="text-h3 text-gray-1">Talen</h3>
          <span className="text-body-sm text-gray-3">
            {config.languages.length} van {MAX_TALEN}
          </span>
        </div>
        <p className="text-body-sm text-gray-2">Kies maximaal {MAX_TALEN} talen.</p>
        <div className="flex flex-wrap gap-2">
          {LANG_CODES.map((l) => {
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
            Je hebt het maximum van {MAX_TALEN} talen bereikt. Meer talen nodig? Dat staat onder
            “Meer weten”.
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

/* ------------------- 4. scènes: overgangen en scèneachtergronden */

/**
 * Twee keuzes onder elkaar in één sectie (CHANGES-04 D12). Ze horen bij
 * elkaar: allebei bepalen ze hoe de video eruitziet, en allebei liggen ze na
 * het vastleggen vast.
 */
export function S4Scenes() {
  return (
    <>
      <Overgang />
      <Scèneachtergronden />
    </>
  )
}

function Overgang() {
  const config = useStore((s) => s.config)
  const patch = useStore((s) => s.patchConfig)

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-h3 text-gray-1">Overgang</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        <ChoiceTile
          title="Camerawissel" icon={Camera} tag="Aanbevolen"
          selected={config.transition === 'zoom'}
          description="De camera wisselt per scène tussen dichtbij en verder weg. Rustig en filmisch."
          onSelect={() => patch({ transition: 'zoom' })}
        />
        <ChoiceTile
          title="Logo tussen de scènes" icon={Sparkle}
          selected={config.transition === 'logo'}
          description="Tussen twee scènes komt je logo kort in beeld."
          onSelect={() => patch({ transition: 'logo' })}
        />
      </div>
      {config.transition === 'zoom' && (
        <AdviceBox>
          Camerawissel. De video loopt door zonder onderbreking; kijkers haken minder snel af.
        </AdviceBox>
      )}
    </div>
  )
}

/**
 * Elke scène krijgt een ander beeld, zodat je ziet dat je per scène kiest en
 * niet één foto voor alles. De eerste twee zijn de echte kantoorshots die ook
 * in de demovideo zitten; daarna volgen de voorbeelden (CHANGES-07 A2).
 */
const EIGEN_FOTOS = [...KANTOORSHOTS, 'park', 'winkelstraat', 'bibliotheek', 'plein']

function Scèneachtergronden() {
  const config = useStore((s) => s.config)
  const patch = useStore((s) => s.patchConfig)
  // Elke video heeft zes scènes: intro, vier inhoud, outro (CHANGES-03 A4).
  const aantal = 6
  const eigen = config.achtergrondModus === 'eigen'
  const shots = config.backgrounds.length === aantal
    ? config.backgrounds
    : Array.from({ length: aantal }, () => null)

  const zet = (index: number, slug: string | null) => {
    patch({ backgrounds: shots.map((b, i) => (i === index ? slug : b)) })
  }

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-h3 text-gray-1">Scèneachtergronden</h3>
      {/* Eerst de keuze, dan pas de tegels. */}
      <div className="grid gap-3 sm:grid-cols-2">
        <ChoiceTile
          title="Standaard kantoorshots" icon={Building2} tag="Aanbevolen"
          selected={config.achtergrondModus === 'standaard'}
          description="Rustige kantoorinterieurs, per scène een ander. Je hoeft niets aan te leveren."
          onSelect={() => patch({ achtergrondModus: 'standaard', backgrounds: [] })}
        />
        <ChoiceTile
          title="Personaliseer met eigen foto’s" icon={Images} tag="Tip" tagToon="tip"
          selected={eigen}
          description="Een leuke manier om de video’s persoonlijker te maken. Bijvoorbeeld het gemeentehuis of een plek buiten in de gemeente."
          /* Meteen gevuld met een beeld per scène: zo zie je waar het om gaat
             zonder eerst zes keer te klikken. */
          onSelect={() => patch({ achtergrondModus: 'eigen', backgrounds: [...EIGEN_FOTOS] })}
        />
      </div>

      {eigen && (
        <>
          <AdviceBox label="Handig om te weten">
            Foto’s hoeven niet van topkwaliteit te zijn — ze worden altijd licht geblurd.
            Staande foto’s werken het best. Liggend mag ook: we snijden er een staand stuk
            uit.
          </AdviceBox>

          <div className="grid gap-3 sm:grid-cols-3">
            {shots.map((slug, i) => {
              const standaard = slug === null
              const src = backgroundImage(slug ?? kantoorshot(i))
              const avatar = avatarById(config.avatars[config.languages[0] ?? 'nl'])
              return (
                <Card key={i} className="flex flex-col gap-3 p-3">
                  <span className="type-label text-gray-3">{sceneLabel(i, shots.length)}</span>
                  {/* Staand, met de avatar ervoor: zo zie je wat hij afdekt. */}
                  <span className="relative block aspect-[9/16] overflow-hidden rounded-sm bg-gray-6">
                    {src ? (
                      <img src={src} alt="" className="size-full scale-105 object-cover blur-[6px]" />
                    ) : (
                      <span className="grid size-full place-items-center bg-turq-tint text-body-sm text-turq-shade">
                        Kantoorshot
                      </span>
                    )}
                    <span className="absolute inset-x-0 bottom-0 flex justify-center">
                      <Avatar
                        face={avatar?.face}
                        name={avatar?.name}
                        className="h-[62%] w-3/4 opacity-45 grayscale"
                      />
                    </span>
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
    </div>
  )
}

/* ---------------------------------------------------------------- 3. widget */

const PLEKKEN: { id: WidgetPositie; label: string }[] = [
  { id: 'lt', label: 'Linksboven' },
  { id: 'lm', label: 'Links-midden' },
  { id: 'lb', label: 'Linksonder' },
  { id: 'rt', label: 'Rechtsboven' },
  { id: 'rm', label: 'Rechts-midden' },
  { id: 'rb', label: 'Rechtsonder' },
]

/** Gemockte huisstijl van Bergrode; in het echt komt dit uit de site. */
const HUISSTIJL = { logo: 'bergrode', primary: '#1F5E58', secondary: '#FF996D' }

export function S3Widget() {
  const config = useStore((s) => s.config)
  const patch = useStore((s) => s.patchConfig)
  const fast = useStore((s) => s.fast)
  const [url, setUrl] = useState(config.siteUrl || 'https://www.bergrode.nl')
  const [contentUrl, setContentUrl] = useState(config.contentUrl ?? '')
  const [contentOpen, setContentOpen] = useState(Boolean(config.contentUrl))
  const [specs, setSpecs] = useState(false)
  const [bezig, setBezig] = useState(false)
  const [aanpassen, setAanpassen] = useState(false)

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
        {/* De uitleg staat onder de hele rij, zodat de knop op dezelfde lijn
            blijft als het veld zelf. */}
        <div className="flex items-stretch gap-2">
          <span className="flex-1">
            <Input label="Webadres" value={url} onChange={setUrl} type="url" />
          </span>
          <Button onClick={ophalen} loading={bezig} className="self-stretch">
            Ophalen
          </Button>
        </div>
        <p className="text-body-sm text-gray-3">Hier halen we je logo en kleuren op.</p>

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
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setAanpassen(!aanpassen)}
              aria-expanded={aanpassen}
            >
              Aanpassen
            </Button>
            <Button size="sm" iconLeft={Check} onClick={() => setAanpassen(false)}>Ja</Button>
          </Card>
        )}

        {/* Klopt de opgehaalde huisstijl niet, dan pas je hem hier aan; de
            preview links verandert meteen mee (CHANGES-09 A3). */}
        {opgehaald && aanpassen && (
          <div className="flex flex-col gap-4 rounded-md border border-gray-5 p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <KleurVeld
                label="Primaire kleur"
                waarde={config.primary ?? '#1F5E58'}
                onChange={(v) => patch({ primary: v })}
              />
              <KleurVeld
                label="Tweede kleur"
                waarde={config.secondary ?? '#FF996D'}
                onChange={(v) => patch({ secondary: v })}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="type-label text-gray-3">Logo</span>
              <button
                type="button"
                onClick={() => patch({ logo: config.logo === 'eigen' ? 'bergrode' : 'eigen' })}
                className="flex w-fit items-center gap-2 rounded-sm border border-dashed border-gray-4 px-3 py-2 text-body-sm text-gray-2 hover:border-blue hover:text-blue-shade"
              >
                {config.logo === 'eigen' ? <Check size={15} aria-hidden /> : <Upload size={15} aria-hidden />}
                {config.logo === 'eigen' ? 'Eigen logo geüpload' : 'Ander logo uploaden'}
              </button>
            </div>
          </div>
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
        <div className="grid grid-cols-3 gap-2">
          {PLEKKEN.map((h) => (
            <button
              key={h.id}
              type="button"
              onClick={() => patch({ widgetPosition: h.id })}
              aria-pressed={config.widgetPosition === h.id}
              className={cn(
                'flex flex-col gap-1.5 rounded-sm border-2 p-2 text-left transition-colors',
                config.widgetPosition === h.id
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

/** Hexcode met het kleurvlakje ervoor; pas doorgeven als de code compleet is. */
function KleurVeld({
  label,
  waarde,
  onChange,
}: {
  label: string
  waarde: string
  onChange: (v: string) => void
}) {
  const [tekst, setTekst] = useState(waarde)

  return (
    <label className="flex flex-col gap-1.5">
      <span className="type-label text-gray-3">{label}</span>
      <span className="flex items-center gap-2 rounded-sm border border-gray-4 px-2 py-1.5 focus-within:border-blue">
        <span className="size-6 shrink-0 rounded-sm border border-gray-5" style={{ background: waarde }} />
        <input
          value={tekst}
          onChange={(e) => {
            const v = e.target.value
            setTekst(v)
            if (/^#[0-9a-fA-F]{6}$/.test(v)) onChange(v)
          }}
          spellCheck={false}
          className="w-full bg-transparent text-body text-gray-1 outline-none"
        />
      </span>
    </label>
  )
}

function HoekSchets({ corner }: { corner: WidgetPositie }) {
  const pos: Record<WidgetPositie, string> = {
    lt: 'top-1 left-1',
    lm: 'top-1/2 left-1 -translate-y-1/2',
    lb: 'bottom-1 left-1',
    rt: 'top-1 right-1',
    rm: 'top-1/2 right-1 -translate-y-1/2',
    rb: 'bottom-1 right-1',
  }
  return (
    <span className="relative block aspect-[4/3] w-full rounded-sm bg-gray-6">
      <span className={cn('absolute h-3 w-5 rounded-[3px] bg-blue', pos[corner])} />
    </span>
  )
}
