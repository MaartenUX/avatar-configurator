import { useState } from 'react'
import { Check, Link2, Play, Plus } from 'lucide-react'
import { Button, Card, ShellContainer, VideoPreview } from '../../components'
import { useStore } from '../../state/store'
import { avatarById } from '../../data/avatars'
import { langDef, langLabel } from '../../data/langs'
import { pageContent } from '../../data'
import type { Lang } from '../../state/types'
import { cn } from '../../lib/cn'

/**
 * Na het vastleggen. Geen mailbevestiging meer: je krijgt de demo zelf, over
 * de volle breedte, met een link die je kunt delen met je collega's.
 */
export default function Demo() {
  const config = useStore((s) => s.config)
  const flash = useStore((s) => s.flash)
  const [taal, setTaal] = useState<Lang | null>(null)
  const [open, setOpen] = useState(false)

  const parkeren = pageContent('p-parkeervergunning')

  const deel = () => {
    void navigator.clipboard
      ?.writeText('https://demo.xs2content.nl/bergrode/9f3a2c')
      .catch(() => {})
    flash({ text: 'Link gekopieerd. Plak hem in een bericht aan je collega’s.', tone: 'success' })
  }

  return (
    <ShellContainer>
      <div className="flex flex-col gap-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="type-label flex items-center gap-1.5 text-green-shade">
              <Check size={14} strokeWidth={3} aria-hidden />
              Configuratie vastgelegd
            </span>
            <h1 className="text-display text-gray-1">Zo ziet het eruit</h1>
            <p className="text-body text-gray-2">
              Dit is wat een inwoner straks op je pagina ziet. Probeer het gerust uit.
            </p>
          </div>
          <Button variant="secondary" iconLeft={Link2} onClick={deel}>
            Deel deze demo
          </Button>
        </header>

        {/* De volledige demo: widget → taalkeuze → video. */}
        <Card className="flex flex-col gap-4 p-8" tone="tint">
          {taal ? (
            <div className="mx-auto w-full max-w-3xl">
              <VideoPreview
                avatarId={config.avatars[taal]}
                lang={taal}
                subtitles={parkeren?.subtitles[taal] ?? parkeren?.subtitles.nl}
                backgrounds={config.backgrounds}
                logo={config.logo}
              />
              <Button variant="ghost" className="mt-3" onClick={() => { setTaal(null); setOpen(false) }}>
                Terug naar de widget
              </Button>
            </div>
          ) : (
            <div className="relative mx-auto flex min-h-72 w-full max-w-3xl items-center justify-center">
              <button
                type="button"
                onClick={() => setOpen(!open)}
                className="flex items-center gap-3 rounded-md bg-white px-5 py-4 shadow-pop transition-shadow hover:shadow-card"
              >
                <span
                  className="grid size-11 place-items-center rounded-pill text-white"
                  style={{ background: config.primary ?? '#46BAD8' }}
                >
                  <Play size={20} aria-hidden />
                </span>
                <span className="flex flex-col text-left">
                  <span className="text-h3 text-gray-1">Bekijk uitleg</span>
                  <span className="text-body-sm text-gray-3">
                    In {config.languages.length} talen
                  </span>
                </span>
              </button>

              {open && (
                <div className="absolute bottom-full mb-3 flex flex-col gap-1 rounded-md bg-white p-2 shadow-pop">
                  <span className="type-label px-2 py-1 text-gray-3">Kies je taal</span>
                  {config.languages.map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setTaal(l)}
                      dir={langDef(l)?.dir}
                      className={cn(
                        'flex items-center gap-3 rounded-sm px-3 py-2 text-left text-body text-gray-1 hover:bg-blue-tint',
                      )}
                    >
                      <span className="type-label w-7 text-gray-3">{l}</span>
                      {langDef(l)?.native ?? langLabel(l)}
                      <span className="ml-auto text-body-sm text-gray-3">
                        {avatarById(config.avatars[l])?.name}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </Card>

        <Card className="flex flex-wrap items-center gap-4">
          <p className="flex-1 text-body text-gray-2">
            Klaar om te beginnen? Voeg je eerste pagina toe. Je collega’s krijgen bericht zodra er
            iets voor hen klaarstaat.
          </p>
          <span className="flex gap-2">
            <Button to="/paginas/nieuw" iconLeft={Plus}>Voeg je eerste pagina toe</Button>
            <Button variant="secondary" to="/">Naar het overzicht</Button>
          </span>
        </Card>
      </div>
    </ShellContainer>
  )
}
