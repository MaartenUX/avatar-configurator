import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES, samplePath } from '../routes'
import { STATUS, STATUS_KEYS } from '../tokens/status'
import { useStore } from '../state/store'
import { useNow } from '../state/TickProvider'
import { useCountdown } from '../state/useCountdown'
import { nextAction } from '../state/selectors'
import { assetCounts } from '../lib/assets'
import { PAGE_CONTENT } from '../data'
import { SCENARIOS } from '../data/seed'
import { LANGS } from '../data/langs'
import { cn } from '../lib/cn'
import { ShellContainer } from '../components'
import { ComponentsPanel } from './kit/ComponentsPanel'
import { DomainPanel } from './kit/DomainPanel'
import { KitBlock } from './kit/KitBlock'

type Tab = 'componenten' | 'domein' | 'tokens' | 'state' | 'data' | 'routes'

const TABS: { id: Tab; label: string }[] = [
  { id: 'componenten', label: 'Componenten' },
  { id: 'domein', label: 'Domein' },
  { id: 'tokens', label: 'Tokens' },
  { id: 'state', label: 'State' },
  { id: 'data', label: 'Content' },
  { id: 'routes', label: 'Routes' },
]

export default function Kit() {
  const [tab, setTab] = useState<Tab>('componenten')

  return (
    <ShellContainer breed>
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-h1 text-gray-1">Componenten en tokens</h1>
        <p className="text-body text-gray-3">
          Werkpagina voor de bouw. Hier staat elk onderdeel in elke staat, zodat keuzes te maken
          zijn voordat ze in twaalf schermen zitten.
        </p>
      </header>

      <div className="flex gap-1 border-b border-gray-5">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              'border-b-2 px-4 py-2.5 text-body transition-colors',
              tab === t.id
                ? 'border-blue text-blue-shade'
                : 'border-transparent text-gray-3 hover:text-gray-1',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'componenten' && <ComponentsPanel />}
      {tab === 'domein' && <DomainPanel />}
      {tab === 'tokens' && <TokensPanel />}
      {tab === 'state' && <StatePanel />}
      {tab === 'data' && <DataPanel />}
      {tab === 'routes' && <RoutesPanel />}
    </section>
    </ShellContainer>
  )
}

/* ------------------------------------------------------------------ tokens */

const FAMILIES = ['blue', 'orange', 'green', 'red', 'turq', 'violet', 'pink'] as const

// Voluit, want de Tailwind-scanner leest broncode als tekst.
const SWATCHES: Record<string, [string, string, string]> = {
  blue: ['bg-blue', 'bg-blue-tint', 'bg-blue-shade'],
  orange: ['bg-orange', 'bg-orange-tint', 'bg-orange-shade'],
  green: ['bg-green', 'bg-green-tint', 'bg-green-shade'],
  red: ['bg-red', 'bg-red-tint', 'bg-red-shade'],
  turq: ['bg-turq', 'bg-turq-tint', 'bg-turq-shade'],
  violet: ['bg-violet', 'bg-violet-tint', 'bg-violet-shade'],
  pink: ['bg-pink', 'bg-pink-tint', 'bg-pink-shade'],
}

const GRAYS = ['bg-gray-1', 'bg-gray-2', 'bg-gray-3', 'bg-gray-4', 'bg-gray-5', 'bg-gray-6']

function TokensPanel() {
  return (
    <div className="flex flex-col gap-8">
      <KitBlock title="Kleuren">
        <div className="flex flex-col gap-3">
          {FAMILIES.map((f) => (
            <div key={f} className="flex items-center gap-3">
              <span className="type-label w-16 text-gray-3">{f}</span>
              {SWATCHES[f].map((c, i) => (
                <div key={c} className="flex flex-col gap-1">
                  <div className={cn('size-16 rounded-sm shadow-card', c)} />
                  <span className="text-body-sm text-gray-3">
                    {['basis', 'tint', 'shade'][i]}
                  </span>
                </div>
              ))}
            </div>
          ))}
          <div className="flex items-center gap-3">
            <span className="type-label w-16 text-gray-3">grijs</span>
            {GRAYS.map((c, i) => (
              <div key={c} className="flex flex-col gap-1">
                <div className={cn('size-16 rounded-sm shadow-card', c)} />
                <span className="text-body-sm text-gray-3">{i + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </KitBlock>

      <KitBlock title="Statussen">
        <p className="mb-3 text-body-sm text-gray-3">
          Basisgroen is een tintsterkte: als stip op wit vrijwel onzichtbaar. Daarom gebruiken
          goedgekeurd en live green-shade voor stip en balk.
        </p>
        <div className="flex flex-wrap gap-3">
          {STATUS_KEYS.map((k) => (
            <div key={k} className="flex items-center gap-2 rounded-md bg-white p-3 shadow-card">
              <span className={cn('size-3 rounded-pill', STATUS[k].dot)} />
              <span className={cn('type-label rounded-pill px-2.5 py-1', STATUS[k].chip)}>
                {STATUS[k].label}
              </span>
            </div>
          ))}
        </div>
      </KitBlock>

      <KitBlock title="Typografie">
        <div className="flex flex-col gap-2 rounded-md bg-white p-6 shadow-card">
          <p className="text-display text-gray-1">Bergrode in één oogopslag</p>
          <p className="text-h1 text-gray-1">Kies je avatar</p>
          <p className="text-h2 text-gray-1">Basissamenvatting controleren</p>
          <p className="text-h3 text-gray-1">Waar let je op?</p>
          <p className="text-body text-gray-2">
            Dit is de basis voor alle talen. Er staat alleen de essentiële informatie in.
          </p>
          <p className="text-body-sm text-gray-3">Ondersteunende tekst en tabelcellen.</p>
          <p className="type-label text-gray-3">Sectielabel</p>
        </div>
      </KitBlock>

      <KitBlock title="Assets">
        <AssetStatus />
      </KitBlock>
    </div>
  )
}

function AssetStatus() {
  const counts = assetCounts()
  const rows = [
    { label: 'Avatarportretten', got: counts.avatars, want: 18, dir: 'src/assets/avatars/{id}.png' },
    { label: 'Stemfragmenten', got: counts.voices, want: 18, dir: 'src/assets/voices/{id}.mp3' },
    { label: 'Kantoorshots', got: counts.backgrounds, want: 4, dir: 'src/assets/backgrounds/kantoor-1.jpg' },
  ]
  return (
    <div className="flex flex-col gap-2">
      {rows.map((r) => (
        <div key={r.label} className="flex items-center gap-3 rounded-md bg-white p-4 shadow-card">
          <span
            className={cn(
              'size-3 rounded-pill',
              r.got >= r.want ? 'bg-green-shade' : r.got > 0 ? 'bg-orange' : 'bg-gray-4',
            )}
          />
          <span className="w-48 text-body text-gray-1">{r.label}</span>
          <span className="text-body-sm text-gray-3">
            {r.got} van {r.want} — droppen in <code className="text-gray-2">{r.dir}</code>
          </span>
        </div>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------- state */

/**
 * Wegwerp-paneel om de timer-spec te valideren voordat er echte schermen zijn.
 * Verdwijnt bij checkpoint 8.
 */
function StatePanel() {
  const store = useStore()
  const now = useNow()
  const page = store.pages[0]
  const countdown = useCountdown(page?.timer)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-2">
        {SCENARIOS.map((sc) => (
          <KitButton key={sc.id} onClick={() => store.setScenario(sc.id)}>{sc.label}</KitButton>
        ))}
        <KitButton onClick={() => store.setFast(!store.fast)}>
          Snel: {store.fast ? 'aan' : 'uit'}
        </KitButton>
        <KitButton onClick={() => store.addPage('https://www.bergrode.nl/parkeervergunning-bewoners', 'Parkeervergunning bewoners')}>
          addPage
        </KitButton>
        {page && (
          <>
            <KitButton onClick={() => store.approveSummary(page.id)}>approveSummary</KitButton>
            <KitButton onClick={() => store.approveNl(page.id)}>approveNl</KitButton>
            <KitButton onClick={() => store.approveLang(page.id, 'tr')}>approveLang tr</KitButton>
            <KitButton onClick={() => store.approveVideo(page.id, 'tr')}>approveVideo tr</KitButton>
            <KitButton onClick={() => store.publish(page.id)}>publish</KitButton>
            <KitButton onClick={() => store.rerun(page.id)}>rerun</KitButton>
          </>
        )}
      </div>

      <div className="rounded-md bg-white p-4 shadow-card">
        <p className="type-label mb-2 text-gray-3">Eerste pagina</p>
        {page ? (
          <div className="flex flex-col gap-1 text-body-sm text-gray-2">
            <span>
              <strong className="text-gray-1">{page.title}</strong> — status {page.status}
            </span>
            <span>volgende stap: {nextAction(page).label} → {nextAction(page).to ?? '—'}</span>
            <span>
              timer: {page.timer ? `${page.timer.kind}${page.timer.lang ? ` (${page.timer.lang})` : ''}` : 'geen'}
              {countdown && ` — nog ${countdown.seconds}s, ${Math.round(countdown.progress * 100)}%`}
            </span>
            <span>
              talen:{' '}
              {Object.entries(page.langs)
                .map(([l, v]) => `${l}=${v?.status}`)
                .join(' · ')}
            </span>
          </div>
        ) : (
          <p className="text-body-sm text-gray-3">Geen pagina's.</p>
        )}
      </div>

      <div className="rounded-md bg-white p-4 shadow-card">
        <p className="type-label mb-2 text-gray-3">Klok</p>
        <p className="text-body-sm text-gray-2">
          now = {now} · video’s {store.videos.used}/{store.videos.total} · opnieuw {store.reruns.used}/{store.reruns.total} · {store.user}
        </p>
      </div>

      <details className="rounded-md bg-white p-4 shadow-card">
        <summary className="cursor-pointer text-body text-gray-1">Volledige state</summary>
        <pre className="mt-3 max-h-96 overflow-auto rounded-sm bg-gray-6 p-3 text-body-sm text-gray-2">
          {JSON.stringify(
            { config: store.config, videos: store.videos, reruns: store.reruns, pages: store.pages.map((p) => ({ ...p, scenes: `${p.scenes.length} scenes`, translations: Object.keys(p.translations), subtitles: Object.keys(p.subtitles) })) },
            null,
            2,
          )}
        </pre>
      </details>
    </div>
  )
}

/* -------------------------------------------------------------------- data */

function DataPanel() {
  return (
    <div className="flex flex-col gap-6">
      <KitBlock title="Talen">
        <div className="flex flex-wrap gap-2">
          {LANGS.map((l) => (
            <span key={l.code} className="rounded-pill bg-gray-6 px-3 py-1.5 text-body-sm text-gray-2">
              {l.label} · <span dir={l.dir}>{l.native}</span>
            </span>
          ))}
        </div>
      </KitBlock>

      <KitBlock title="Pagina's">
        <div className="flex flex-col gap-3">
          {PAGE_CONTENT.map((p) => (
            <details key={p.id} className="rounded-md bg-white p-4 shadow-card">
              <summary className="cursor-pointer text-body text-gray-1">
                {p.title}{' '}
                <span className="text-body-sm text-gray-3">
                  {p.thin ? '· dun' : `· ${p.scenes.length} scenes · ${Object.keys(p.translations).join(', ')}`}
                </span>
              </summary>
              {!p.thin && (
                <div className="mt-3 flex flex-col gap-3">
                  {p.scenes.map((s, i) => (
                    <div key={i} className="rounded-sm bg-gray-6 p-3">
                      <p className="type-label text-gray-3">Scène {i + 1} · {s.title}</p>
                      <p className="mt-1 text-body-sm text-gray-2">{s.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </details>
          ))}
        </div>
      </KitBlock>
    </div>
  )
}

/* ------------------------------------------------------------------ routes */

function RoutesPanel() {
  return (
    <div className="flex flex-col gap-2">
      {ROUTES.map((r) => (
        <div key={r.path} className="flex items-center gap-3 rounded-md bg-white p-3 shadow-card">
          <span
            className={cn(
              'type-label rounded-pill px-2.5 py-1',
              r.layout === 'shell' ? 'bg-blue-tint text-blue-shade' : 'bg-violet-tint text-violet-shade',
            )}
          >
            {r.layout}
          </span>
          <Link to={samplePath(r.path)} className="text-body text-blue-shade hover:underline">
            {r.path}
          </Link>
          <span className="text-body-sm text-gray-3">{r.label}</span>
        </div>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ helpers */

function KitButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-sm border border-gray-4 bg-white px-3 py-1.5 text-body-sm text-gray-1 hover:border-blue hover:text-blue-shade"
    >
      {children}
    </button>
  )
}
