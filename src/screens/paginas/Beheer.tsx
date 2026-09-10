import { useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { Copy, ExternalLink, Eye, Play, RefreshCw, X } from 'lucide-react'
import {
  Button, Card, Dialog, Distributie, EmbedBlok, ShellContainer, StatCard, VideoPreview,
} from '../../components'
import { Avatar } from '../../components/domain/Avatar'
import { useStore } from '../../state/store'
import { findPage, totalViews } from '../../state/selectors'
import { avatarById } from '../../data/avatars'
import { langLabel } from '../../data/langs'
import { formatDateNl, formatNumber } from '../../lib/format'
import { LANG_STATUS_LABEL } from '../../tokens/status'
import type { Lang } from '../../state/types'
import { cn } from '../../lib/cn'

/** Eén ontwerp voor live én in productie. Verschil zit in wat er al kan. */
export default function Beheer() {
  const { id } = useParams()
  const page = useStore((s) => findPage(s.pages, id))
  const config = useStore((s) => s.config)
  const rerun = useStore((s) => s.rerun)
  const reruns = useStore((s) => s.reruns)
  const [opnieuw, setOpnieuw] = useState(false)
  const [speelt, setSpeelt] = useState<Lang | null>(null)

  if (!page) return <Navigate to="/" replace />

  const talen = Object.keys(page.langs) as Lang[]
  const live = page.status === 'live'
  const script = page.scenes.map((s, i) => `${i + 1}. ${s.title}\n${s.text}`).join('\n\n')
  const geenReruns = reruns.used >= reruns.total
  const klaarVoorDownload = talen.every((l) => page.langs[l]?.status === 'approved')

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

        {/* Statistieken alleen als er iets te tellen valt. */}
        {live && (
          <section className="flex flex-col gap-3">
            <h2 className="text-h2 text-gray-1">Weergaven</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {talen.map((l) => (
                <StatCard key={l} label={langLabel(l)} value={page.views[l] ?? 0} sub="afgelopen 30 dagen" icon={Eye} />
              ))}
            </div>
            <p className="text-body-sm text-gray-3">
              {formatNumber(totalViews(page))} weergaven in totaal.
            </p>
          </section>
        )}

        {/* De video's per taal, naast elkaar. */}
        <section className="flex flex-col gap-3">
          <h2 className="text-h2 text-gray-1">De video’s</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {talen.map((l) => {
              const avatar = avatarById(config.avatars[l])
              const klaar = ['approved', 'live'].includes(page.langs[l]!.status)
              return (
                <button
                  key={l}
                  type="button"
                  disabled={!klaar}
                  onClick={() => setSpeelt(l)}
                  className={cn(
                    'group flex flex-col overflow-hidden rounded-md bg-white text-left shadow-card transition-shadow',
                    klaar ? 'hover:shadow-pop' : 'cursor-not-allowed opacity-60',
                  )}
                >
                  <span className="relative flex aspect-video items-end justify-center bg-gradient-to-br from-turq-tint to-blue-tint">
                    <Avatar face={avatar?.face} name={avatar?.name} className="h-[88%] w-24" />
                    {klaar && (
                      <span className="absolute inset-0 grid place-items-center">
                        <span className="grid size-10 place-items-center rounded-pill bg-white/90 text-blue-shade shadow-card">
                          <Play size={17} aria-hidden />
                        </span>
                      </span>
                    )}
                  </span>
                  <span className="flex flex-col gap-0.5 px-3 py-2.5">
                    <span className="text-body text-gray-1">{langLabel(l)}</span>
                    <span className="text-body-sm text-gray-3">
                      {klaar ? avatar?.name : LANG_STATUS_LABEL[page.langs[l]!.status]}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </section>

        {/* De hoofdtaak: op je website zetten. Daarnaast de andere kanalen. */}
        <section className="flex flex-col gap-3">
          <h2 className="text-h2 text-gray-1">Publiceren</h2>
          <div className="grid items-stretch gap-4 lg:grid-cols-2">
            <EmbedBlok page={page} langs={talen} live={live} />
            <Distributie langs={talen} beschikbaar={live || klaarVoorDownload} />
          </div>
        </section>

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

        <Card className="flex flex-wrap items-center gap-4">
          <div className="flex min-w-72 flex-1 flex-col gap-1">
            <h2 className="text-h3 text-gray-1">Pagina gewijzigd? Maak de video opnieuw</h2>
            <p className="text-body-sm text-gray-2">
              Is de tekst op je website veranderd, dan klopt de video niet meer. Opnieuw maken
              betekent dat je alles opnieuw controleert: de tekst, de vertalingen en de
              ondertiteling. Je hebt nog {reruns.total - reruns.used}× opnieuw maken over.
            </p>
          </div>
          <Button
            variant="secondary" iconLeft={RefreshCw}
            disabled={geenReruns}
            onClick={() => setOpnieuw(true)}
          >
            Maak opnieuw
          </Button>
        </Card>
      </div>

      {/* Lightbox bij een aangeklikte taal. */}
      {speelt && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-gray-1/60 p-8"
          onClick={() => setSpeelt(null)}
        >
          <div className="w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-2 flex items-center gap-3">
              <span className="text-h3 text-white">{langLabel(speelt)}</span>
              <button
                type="button"
                onClick={() => setSpeelt(null)}
                aria-label="Sluiten"
                className="ml-auto rounded-sm p-1.5 text-white/80 hover:bg-white/15 hover:text-white"
              >
                <X size={20} aria-hidden />
              </button>
            </div>
            <VideoPreview
              avatarId={config.avatars[speelt]}
              lang={speelt}
              subtitles={page.subtitles[speelt] ?? page.subtitles.nl}
              backgrounds={config.backgrounds}
              logo={config.logo}
            />
          </div>
        </div>
      )}

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
    </ShellContainer>
  )
}
