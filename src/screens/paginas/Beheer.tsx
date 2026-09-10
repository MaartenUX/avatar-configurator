import { useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { Copy, Download, ExternalLink, Eye, RefreshCw } from 'lucide-react'
import {
  Button, Card, Dialog, LanguageRow, ShellContainer, StatCard, VideoPreview,
} from '../../components'
import { useStore } from '../../state/store'
import { findPage, totalViews } from '../../state/selectors'
import { langLabel } from '../../data/langs'
import { formatDateNl } from '../../lib/format'
import type { Lang } from '../../state/types'

/** Beheerscherm voor een pagina die live staat. */
export default function Beheer() {
  const { id } = useParams()
  const page = useStore((s) => findPage(s.pages, id))
  const config = useStore((s) => s.config)
  const rerun = useStore((s) => s.rerun)
  const reruns = useStore((s) => s.reruns)
  const [opnieuw, setOpnieuw] = useState(false)

  if (!page) return <Navigate to="/paginas" replace />

  const talen = Object.keys(page.langs) as Lang[]
  const live = page.status === 'live'
  const script = page.scenes.map((s, i) => `${i + 1}. ${s.title}\n${s.text}`).join('\n\n')

  return (
    <ShellContainer>
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-h1 text-gray-1">{page.title}</h1>
        <a
          href={page.url} target="_blank" rel="noreferrer"
          className="inline-flex w-fit items-center gap-1.5 text-body text-gray-3 hover:text-blue-shade"
        >
          {page.url}
          <ExternalLink size={14} aria-hidden />
        </a>
        <p className="text-body-sm text-gray-3">
          Toegevoegd op {formatDateNl(page.createdAt)}
          {live ? ' · staat live' : ' · nog in productie'}
        </p>
      </header>

      {live && (
        <section className="flex flex-col gap-3">
          <h2 className="text-h2 text-gray-1">Weergaven</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {talen.map((l) => (
              <StatCard key={l} label={langLabel(l)} value={page.views[l] ?? 0} sub="afgelopen 30 dagen" icon={Eye} />
            ))}
          </div>
          <p className="text-body-sm text-gray-3">
            {totalViews(page).toLocaleString('nl-NL')} weergaven in totaal.
          </p>
        </section>
      )}

      <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
        <section className="flex flex-col gap-3">
          <h2 className="text-h2 text-gray-1">De video</h2>
          <VideoPreview
            avatarId={config.avatars.nl}
            lang="nl"
            subtitles={page.subtitles.nl}
            backgrounds={config.backgrounds}
            logo={config.logo}
          />
          <Card className="flex flex-col gap-2 p-4">
            <h3 className="type-label text-gray-3">Downloads</h3>
            <p className="text-body-sm text-gray-3">Elke download heeft een AI-label.</p>
            <div className="flex flex-wrap gap-2">
              {talen.map((l) => (
                <Button key={l} size="sm" variant="secondary" iconLeft={Download}>
                  {langLabel(l)}
                </Button>
              ))}
            </div>
          </Card>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-h2 text-gray-1">Talen</h2>
          <Card className="flex flex-col gap-0.5 p-3">
            {talen.map((l) => (
              <LanguageRow
                key={l}
                lang={l}
                status={page.langs[l]!.status}
                reviewer={page.langs[l]!.reviewer}
                views={live ? page.views[l] : undefined}
              />
            ))}
          </Card>

          <Card className="flex flex-col gap-2">
            <h3 className="text-h3 text-gray-1">Pagina gewijzigd?</h3>
            <p className="text-body-sm text-gray-2">
              Is de tekst op je website veranderd? Dan klopt de video niet meer. Je kunt hem
              opnieuw laten maken.
            </p>
            <Button variant="secondary" iconLeft={RefreshCw} onClick={() => setOpnieuw(true)}>
              Maak opnieuw
            </Button>
          </Card>
        </section>
      </div>

      <section className="flex flex-col gap-3">
        <span className="flex items-center gap-2">
          <h2 className="flex-1 text-h2 text-gray-1">Het script</h2>
          <Button
            size="sm" variant="secondary" iconLeft={Copy}
            onClick={() => void navigator.clipboard?.writeText(script).catch(() => {})}
          >
            Kopieer
          </Button>
        </span>
        <Card>
          <p className="whitespace-pre-line text-body text-gray-2">{script}</p>
        </Card>
      </section>

      <Dialog
        open={opnieuw}
        onClose={() => setOpnieuw(false)}
        title="Deze pagina opnieuw maken?"
        description={`We lezen de pagina opnieuw en maken een nieuwe samenvatting. Je controleert daarna alles opnieuw: de tekst, de vertalingen en de ondertiteling. Je kunt nog ${reruns.total - reruns.used}× een video opnieuw laten maken.`}
        confirmLabel="Ja, maak opnieuw"
        onConfirm={() => {
          rerun(page.id)
          setOpnieuw(false)
        }}
      />
    </div>
    </ShellContainer>
  )
}
