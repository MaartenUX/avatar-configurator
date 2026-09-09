import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CircleHelp, MessageCircle, Plus, Settings2, Sparkles } from 'lucide-react'
import {
  Button, Card, Chip, EmptyState, LockedBanner, PageCard, PipelineStep,
} from '../components'
import { useStore } from '../state/store'
import { useNow } from '../state/TickProvider'
import { langLabel } from '../data/langs'
import { FASES } from '../data/copy'
import type { Lang } from '../state/types'

/** Hoe lang een net bijgewerkte kaart gemarkeerd blijft. */
const HIGHLIGHT_MS = 3500

export default function Overzicht() {
  const config = useStore((s) => s.config)
  const pages = useStore((s) => s.pages)
  const credits = useStore((s) => s.credits)
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

  const geenCredits = credits.used >= credits.total

  if (config.status !== 'locked') return <EersteKeer />

  const zichtbaar = (list: typeof pages) =>
    langFilter.length === 0
      ? list
      : list.filter((p) => langFilter.some((l) => p.langs[l]))

  return (
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
              {geenCredits && (
                <span className="text-body-sm text-orange-shade">
                  Je credits zijn op. Neem contact op met XS2Content voor meer.
                </span>
              )}
              <Button iconLeft={Plus} to={geenCredits ? undefined : '/paginas/nieuw'} disabled={geenCredits}>
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
  )
}

/** Eerste keer: nog geen configuratie, dus één duidelijke volgende stap. */
function EersteKeer() {
  const credits = useStore((s) => s.credits)

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-display text-gray-1">Welkom bij Bergrode</h1>
        <p className="text-body text-gray-2">
          Je richt het eenmalig in. Daarna maak je zelf video’s bij je pagina’s.
        </p>
      </header>

      <Card className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-h2 text-gray-1">Begin met de configuratie</h2>
          <p className="text-body text-gray-2">
            Dit duurt ongeveer een kwartier. Je kunt tussendoor stoppen en later verdergaan.
          </p>
        </div>

        <ol className="grid gap-4 md:grid-cols-3">
          {FASES.map((f, i) => (
            <li key={f.title} className="flex flex-col gap-1.5 rounded-md bg-gray-6 p-4">
              <span className="type-label text-gray-3">Fase {i + 1}</span>
              <span className="text-h3 text-gray-1">{f.title}</span>
              <span className="text-body-sm text-gray-2">{f.body}</span>
            </li>
          ))}
        </ol>

        <div className="flex flex-wrap items-center gap-3">
          <Button to="/configuratie" iconLeft={Settings2}>Start de configuratie</Button>
          <span className="text-body-sm text-gray-3">
            Je hebt {credits.total} credits. Elke pagina kost er één.
          </span>
        </div>
      </Card>

      <Card className="flex flex-col gap-3">
        <h2 className="text-h3 text-gray-1">Wat er daarna gebeurt</h2>
        <ol>
          {[
            { label: 'Je voegt een pagina toe', meta: 'Jij · 1 min' },
            { label: 'Wij maken een samenvatting', meta: 'Automatisch · 1 min' },
            { label: 'Jij controleert de tekst', meta: 'Jij · 8 min' },
            { label: 'Je collega’s controleren hun taal', meta: 'Collega’s · 5 min per taal' },
            { label: 'De video’s gaan live', meta: 'Automatisch · 20 min', last: true },
          ].map((s, i, arr) => (
            <PipelineStep
              key={s.label}
              index={i + 1}
              label={s.label}
              meta={s.meta}
              status="todo"
              isLast={i === arr.length - 1}
            />
          ))}
        </ol>
      </Card>

      <Voettekst />
    </div>
  )
}

function Voettekst() {
  const resetTo = useStore((s) => s.resetTo)

  return (
    <footer className="flex flex-wrap items-center gap-4 border-t border-gray-5 pt-5 text-body-sm">
      <Link to="/hulp" className="inline-flex items-center gap-1.5 text-gray-2 hover:text-blue-shade">
        <CircleHelp size={15} aria-hidden />
        Veelgestelde vragen
      </Link>
      <Link to="/hulp#feedback" className="inline-flex items-center gap-1.5 text-gray-2 hover:text-blue-shade">
        <MessageCircle size={15} aria-hidden />
        Feedback
      </Link>

      {/* Alleen voor de test: snel terug naar een bekende beginsituatie. */}
      <span className="ml-auto flex items-center gap-3 text-gray-4">
        <button type="button" onClick={() => resetTo('seed')} className="hover:text-gray-2">
          Reset naar seed
        </button>
        <button type="button" onClick={() => resetTo('empty')} className="hover:text-gray-2">
          Reset naar lege staat
        </button>
      </span>
    </footer>
  )
}
