import { useState } from 'react'
import { Building2, Check, Gauge, ImageUp, Timer, Upload } from 'lucide-react'
import {
  AdviceBox, AvatarTile, Button, Card, ChoiceTile, Chip, Input,
} from '../../components'
import { useStore } from '../../state/store'
import { ADVICE, advisedFor, avatarsFor } from '../../data/avatars'
import { MAX_EXTRA_LANGS, OPTIONAL_LANGS, langLabel } from '../../data/langs'
import { backgroundImage } from '../../lib/assets'
import type { Config, Lang, WidgetCorner } from '../../state/types'
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
          Nederlands staat vast en is de basis voor elke vertaling. Kies er maximaal{' '}
          {MAX_EXTRA_LANGS} bij. Elke taal heeft een collega nodig die hem controleert.
        </p>
        <div className="flex flex-wrap gap-2">
          <Chip label="Nederlands" selected count={undefined} />
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

      {config.languages.length > 1 && (
        <AdviceBox label="Goed om te weten">
          Je kiest {config.languages.length} talen. Voor elke taal behalve Nederlands heb je
          straks een collega nodig die de tekst controleert voordat de video gemaakt wordt.
        </AdviceBox>
      )}
    </>
  )
}

/* -------------------------------------------------------------- 2. avatars */

export function S2Avatars() {
  const config = useStore((s) => s.config)
  const patch = useStore((s) => s.patchConfig)

  return (
    <>
      {config.languages.map((lang) => (
        <div key={lang} className="flex flex-col gap-2">
          <h3 className="text-h3 text-gray-1">{langLabel(lang)}</h3>
          <div className="grid grid-cols-2 gap-3">
            {avatarsFor(lang).map((a) => (
              <AvatarTile
                key={a.id}
                avatar={a}
                selected={config.avatars[lang] === a.id}
                advised={a.advised}
                onSelect={() => patch({ avatars: { ...config.avatars, [lang]: a.id } })}
              />
            ))}
          </div>
          <AdviceBox>
            {advisedFor(lang)?.name}. {ADVICE[lang]}
          </AdviceBox>
        </div>
      ))}
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
      <AdviceBox>
        Vast is de aanbeveling. Bij informatieve video’s haakt het grootste deel van de kijkers na
        drie minuten af; wat daarna komt wordt zelden gezien.
      </AdviceBox>
    </>
  )
}

/* ------------------------------------------------- 4. personaliseer de video */

const EIGEN_FOTOS = ['kantoor-2', 'kantoor-3', 'kantoor-4', 'kantoor-1']

export function S4Personaliseren() {
  const config = useStore((s) => s.config)
  const patch = useStore((s) => s.patchConfig)
  const [eenFoto, setEenFoto] = useState(false)

  // Zolang er niets gekozen is tonen we de standaardshots, maar staat er nog
  // niets in de state: de sectie is dan ook nog niet af.
  const shots = config.backgrounds.length === 4 ? config.backgrounds : [null, null, null, null]

  const zet = (index: number, slug: string | null) => {
    const next = eenFoto
      ? shots.map(() => slug)
      : shots.map((b, i) => (i === index ? slug : b))
    patch({ backgrounds: next })
  }

  return (
    <>
      <label className="flex w-fit items-center gap-2.5 rounded-sm border border-gray-5 bg-white px-3 py-2.5 text-body text-gray-1">
        <input
          type="checkbox"
          checked={eenFoto}
          onChange={(e) => {
            setEenFoto(e.target.checked)
            if (e.target.checked) patch({ backgrounds: shots.map(() => shots[0]) })
          }}
          className="accent-[#46BAD8]"
        />
        Gebruik één beeld voor alle scènes
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        {shots.map((slug, i) => {
          const standaard = slug === null
          const src = backgroundImage(slug ?? `kantoor-${i + 1}`)
          return (
            <Card key={i} className="flex flex-col gap-3 p-4">
              <span className="type-label text-gray-3">Scène {i + 1}</span>
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

      <AdviceBox label="Waar let je op">
        Rustige beelden zonder mensen op de voorgrond werken het best. De avatar staat er half
        voor, dus houd het midden vrij.
      </AdviceBox>
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
  const [url, setUrl] = useState(config.siteUrl || 'https://www.bergrode.nl')
  const [bezig, setBezig] = useState(false)
  const fast = useStore((s) => s.fast)

  const ophalen = () => {
    setBezig(true)
    // Gemockt: we doen alsof we de site uitlezen.
    window.setTimeout(() => {
      patch({ siteUrl: url, ...HUISSTIJL })
      setBezig(false)
    }, fast ? 300 : 1500)
  }

  const opgehaald = Boolean(config.primary)

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
          <Card className="flex items-center gap-4 p-4">
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

      <div className="flex flex-col gap-2">
        <h3 className="text-h3 text-gray-1">Plek op de pagina</h3>
        <div className="grid grid-cols-2 gap-3">
          {HOEKEN.map((h) => (
            <ChoiceTile
              key={h.id}
              title={h.label}
              selected={config.widgetCorner === h.id}
              onSelect={() => patch({ widgetCorner: h.id })}
              visual={<HoekSchets corner={h.id} />}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-h3 text-gray-1">Je eigen pagina zien</h3>
        <p className="text-body-sm text-gray-2">
          Upload een schermafbeelding van je site, dan zie je de widget op je echte pagina staan.
        </p>
        <span className="flex gap-2">
          <Button
            variant="secondary" iconLeft={ImageUp}
            onClick={() => patch({ siteScreenshot: backgroundImage('kantoor-1') })}
          >
            Schermafbeelding uploaden
          </Button>
          {config.siteScreenshot && (
            <Button variant="ghost" onClick={() => patch({ siteScreenshot: undefined })}>
              Terug naar de schets
            </Button>
          )}
        </span>
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

export type { Config }
