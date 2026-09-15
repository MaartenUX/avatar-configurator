import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CircleHelp, MessageCircle, Plus, Settings2, Sparkles, Users } from 'lucide-react'
import {
  Button, Card, Chip, EmptyState, LockedBanner, PageCard, ShellContainer,
} from '../components'
import { useStore } from '../state/store'
import { useNow } from '../state/TickProvider'
import { langLabel } from '../data/langs'
import { FASES } from '../data/copy'
import type { Lang } from '../state/types'
import { cn } from '../lib/cn'

/** Hoe lang een net bijgewerkte kaart gemarkeerd blijft. */
const HIGHLIGHT_MS = 3500

export default function Overzicht() {
  const config = useStore((s) => s.config)
  const pages = useStore((s) => s.pages)
  const videos = useStore((s) => s.videos)
  const user = useStore((s) => s.user)
  const highlightPageId = useStore((s) => s.highlightPageId)
  const clearHighlight = useStore((s) => s.clearHighlight)
  const toast = useStore((s) => s.toast)
  const now = useNow()

  const [langFilter, setLangFilter] = useState<Lang[]>([])

  // De markering dooft vanzelf; geen eigen timer, dezelfde klok als de rest.
  const stale = toast ? now - toast.startedAt > HIGHLIGHT_MS : Boolean(highlightPageId)
  useEffect(() => {
    if (highlightPageId && stale) clearHighlight()
  }, [highlightPageId, stale, clearHighlight])

  const inProductie = pages.filter((p) => p.status !== 'live')
  const live = pages.filter((p) => p.status === 'live')

  const alleTalen = useMemo(() => {
    const set = new Set<Lang>()
    for (const p of pages) for (const l of Object.keys(p.langs) as Lang[]) set.add(l)
    return [...set]
  }, [pages])

  const geenVideos = videos.used >= videos.total

  if (config.status !== 'locked') return <EersteKeer />

  const zichtbaar = (list: typeof pages) =>
    langFilter.length === 0
      ? list
      : list.filter((p) => langFilter.some((l) => p.langs[l]))

  return (
    <ShellContainer>
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-display text-gray-1">Bergrode in één oogopslag</h1>
        <p className="text-body text-gray-2">
          {user === 'emre'
            ? 'Hieronder staan de pagina’s waar jouw taal aan de beurt is.'
            : 'Hier zie je per pagina wie aan zet is en wat er van jou wordt verwacht.'}
        </p>
      </header>

      <LockedBanner signedAt={config.signedAt} />

      {alleTalen.length > 1 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="type-label text-gray-3">Filter op taal</span>
          <Chip
            label="Alle"
            selected={langFilter.length === 0}
            onClick={() => setLangFilter([])}
          />
          {alleTalen.map((l) => (
            <Chip
              key={l}
              label={langLabel(l)}
              selected={langFilter.includes(l)}
              onClick={() =>
                setLangFilter((f) => (f.includes(l) ? f.filter((x) => x !== l) : [...f, l]))
              }
            />
          ))}
        </div>
      )}

      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-h2 text-gray-1">In productie</h2>
          <span className="text-body-sm text-gray-3">{inProductie.length}</span>
          {user === 'esmee' && (
            <span className="ml-auto flex items-center gap-3">
              {geenVideos && (
                <span className="text-body-sm text-orange-shade">
                  Je hebt alle uitlegvideo’s gebruikt. Neem contact op met XS2Content voor meer.
                </span>
              )}
              <Button iconLeft={Plus} to={geenVideos ? undefined : '/paginas/nieuw'} disabled={geenVideos}>
                Pagina toevoegen
              </Button>
            </span>
          )}
        </div>

        {zichtbaar(inProductie).length === 0 ? (
          <EmptyState
            icon={Sparkles}
            title="Niets in productie"
            body="Voeg een pagina toe. Binnen een halfuur staat er een video bij."
            action={
              user === 'esmee' ? (
                <Button to="/paginas/nieuw" iconLeft={Plus}>Pagina toevoegen</Button>
              ) : undefined
            }
          />
        ) : (
          <div className="flex flex-col gap-4">
            {zichtbaar(inProductie).map((p) => (
              <PageCard
                key={p.id}
                page={p}
                user={user}
                highlighted={highlightPageId === p.id && !stale}
                langFilter={langFilter}
              />
            ))}
          </div>
        )}
      </section>

      {live.length > 0 && (
        <section className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <h2 className="text-h2 text-gray-1">Live</h2>
            <span className="text-body-sm text-gray-3">{live.length}</span>
          </div>
          <div className="flex flex-col gap-4">
            {zichtbaar(live).map((p) => (
              <PageCard key={p.id} page={p} user={user} langFilter={langFilter} />
            ))}
          </div>
        </section>
      )}

      <Voettekst />
    </div>
    </ShellContainer>
  )
}

/** Eerste keer: nog geen configuratie, dus precies één volgende stap. */
function EersteKeer() {
  return (
    <ShellContainer>
      <div className="flex flex-col gap-8">
        <header>
          <h1 className="text-display text-gray-1">De avatars voor de Gemeente Bergrode</h1>
        </header>

        <Card className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <h2 className="text-h2 text-gray-1">Begin met de configuratie</h2>
            <p className="text-body text-gray-2">
              Dit zijn de eenmalige basisinstellingen voor al je uitlegvideo’s. Aan het eind maak
              je een demo om alles te controleren. Daarna leg je de instellingen vast en maak je
              pagina voor pagina de echte video’s.
            </p>
          </div>

          {/* Drie fases op een rij. Fase 1 is waar je nu staat en krijgt de
              helft van de breedte; de andere twee vertellen wat erna komt. */}
          <ol className="grid gap-3 md:grid-cols-[2fr_1fr_1fr]">
            {FASES.map((fase, i) => (
              <li
                key={fase.title}
                className={cn(
                  'flex flex-col gap-1.5 rounded-md p-4',
                  i === 0 ? 'bg-blue-tint/60' : 'bg-gray-6',
                )}
              >
                <span className={cn('type-label', i === 0 ? 'text-blue-shade' : 'text-gray-3')}>
                  Fase {i + 1}
                </span>
                <span className="text-h3 text-gray-1">{fase.title}</span>
                <span className="text-body-sm text-gray-2">{fase.body}</span>

                {fase.punten && (
                  <ul className="mt-1 flex flex-col gap-1">
                    {fase.punten.map((punt) => (
                      <li key={punt} className="flex gap-2 text-body-sm text-gray-2">
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-pill bg-blue" aria-hidden />
                        {punt}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ol>

          <div className="flex flex-wrap items-center gap-3">
            <Button to="/configuratie" iconLeft={Settings2}>Start de configuratie</Button>
            <span className="text-body-sm text-gray-3">
              Je kunt tussendoor stoppen en later verdergaan.
            </span>
          </div>
        </Card>

        <Voettekst />
      </div>
    </ShellContainer>
  )
}

function Voettekst() {
  const resetScenario = useStore((s) => s.resetScenario)

  return (
    <footer className="flex flex-wrap items-center gap-4 border-t border-gray-5 pt-5 text-body-sm">
      <Link to="/hulp" className="inline-flex items-center gap-1.5 text-gray-2 hover:text-blue-shade">
        <CircleHelp size={15} aria-hidden />
        Veelgestelde vragen
      </Link>
      <Link to="/team" className="inline-flex items-center gap-1.5 text-gray-2 hover:text-blue-shade">
        <Users size={15} aria-hidden />
        Team
      </Link>
      <Link to="/hulp?tab=feedback" className="inline-flex items-center gap-1.5 text-gray-2 hover:text-blue-shade">
        <MessageCircle size={15} aria-hidden />
        Feedback
      </Link>

      {/* Alleen voor de test: dit scenario terugzetten naar zijn beginstand. */}
      <button
        type="button"
        onClick={resetScenario}
        className="ml-auto text-gray-4 hover:text-gray-2"
      >
        Zet dit scenario terug
      </button>
    </footer>
  )
}
