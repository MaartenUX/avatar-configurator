import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, FileVideo, Megaphone, Video } from 'lucide-react'
import { Button, Card, ChoiceTile, Input, PipelineStep, SiteMock } from '../../components'
import { SpokeFrame } from '../../components/layout/SpokeLayout'
import { useStore } from '../../state/store'
import { PRODUCTIE_STAPPEN } from '../../data/copy'
import { PAGE_CONTENT } from '../../data'

export default function NieuwePagina() {
  const navigate = useNavigate()
  const config = useStore((s) => s.config)
  const videos = useStore((s) => s.videos)
  const addPage = useStore((s) => s.addPage)

  const [url, setUrl] = useState('https://www.bergrode.nl/parkeervergunning-bewoners')
  const [titel, setTitel] = useState('Parkeervergunning bewoners')

  const geenVideos = videos.used >= videos.total
  const over = videos.total - videos.used
  const bestaat = useStore((s) => s.pages.some((p) => p.url === url))

  const start = () => {
    const id = addPage(url.trim(), titel.trim())
    navigate(`/paginas/${id}/samenvatting`)
  }

  return (
    <SpokeFrame
      preview={<SiteMock config={config} pageTitle={titel || 'Je pagina'} className="max-w-xl" />}
    >
      <h1 className="text-h2 text-gray-1">Pagina toevoegen</h1>

      <div className="flex flex-col gap-2">
        <h2 className="text-h3 text-gray-1">Wat maak je?</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <ChoiceTile title="Uitlegvideo" icon={FileVideo} selected onSelect={() => {}}
            description="Bij een pagina." />
          <ChoiceTile title="Alert-video" icon={Megaphone} selected={false} disabled onSelect={() => {}}
            description="Binnenkort." />
          <ChoiceTile title="Losse video" icon={Video} selected={false} disabled onSelect={() => {}}
            description="Binnenkort." />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Input
          label="Adres van de pagina" value={url} onChange={setUrl} type="url"
          hint="Plak het webadres van de pagina waar de video bij komt."
          error={bestaat ? 'Voor deze pagina bestaat al een video.' : undefined}
        />
        <Input label="Titel" value={titel} onChange={setTitel} hint="Zo heet de pagina in je overzicht." />
        {PAGE_CONTENT.some((p) => p.url === url) && (
          <p className="text-body-sm text-gray-3">
            We herkennen deze pagina en hebben de tekst al opgehaald.
          </p>
        )}
      </div>

      <Card className="flex flex-col gap-3">
        <h2 className="text-h3 text-gray-1">Dit gaat er gebeuren</h2>
        <ol>
          {PRODUCTIE_STAPPEN.map((s, i, arr) => (
            <PipelineStep
              key={s.label} index={i + 1} label={s.label} meta={s.meta}
              status="todo" isLast={i === arr.length - 1}
            />
          ))}
        </ol>
        <p className="text-body-sm text-gray-3">
          Bij elkaar ben je hier ongeveer een kwartier mee bezig. Het wachten doen wij.
        </p>
      </Card>

      <Card className="flex flex-col gap-3 border-2 border-blue">
        <span className="flex items-center gap-2 text-body text-gray-1">
          {geenVideos ? (
            <>
              <AlertTriangle size={18} className="text-orange-shade" aria-hidden />
              Je hebt alle uitlegvideo’s gebruikt. Neem contact op met XS2Content voor meer.
            </>
          ) : (
            <>Dit is uitlegvideo {videos.used + 1} van {videos.total}. Je houdt er {over - 1} over.</>
          )}
        </span>
        <span className="flex gap-2">
          <Button onClick={start} disabled={geenVideos || !url.trim() || !titel.trim() || bestaat}>
            Start
          </Button>
          <Button variant="secondary" to="/">Annuleer</Button>
        </span>
      </Card>
    </SpokeFrame>
  )
}
