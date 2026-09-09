import { useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { Check, Copy, Download, Share2, Sparkles } from 'lucide-react'
import {
  ApproveBox, Button, Card, Celebration, PreviewGrid, VideoPreview,
} from '../../components'
import { SpokeFrame } from '../../components/layout/SpokeLayout'
import { HelpTray } from '../../components/feedback/HelpTray'
import { useStore } from '../../state/store'
import { useFinishSpoke } from '../../state/flow'
import { canPublish, findPage } from '../../state/selectors'
import { langLabel } from '../../data/langs'
import type { Lang } from '../../state/types'

/** S6: publiceren en afsluiten. */
export default function Publiceren() {
  const { id } = useParams()
  const page = useStore((s) => findPage(s.pages, id))
  const config = useStore((s) => s.config)
  const publish = useStore((s) => s.publish)
  const fast = useStore((s) => s.fast)
  const finish = useFinishSpoke()

  const [gekopieerd, setGekopieerd] = useState(false)
  const [socialBezig, setSocialBezig] = useState(false)
  const [socialKlaar, setSocialKlaar] = useState(false)

  if (!page) return <Navigate to="/" replace />

  const talen = Object.keys(page.langs) as Lang[]
  const mag = canPublish(page)
  const live = page.status === 'live'

  const script = page.scenes.map((s, i) => `${i + 1}. ${s.title}\n${s.text}`).join('\n\n')

  const maakSocials = () => {
    setSocialBezig(true)
    window.setTimeout(() => {
      setSocialBezig(false)
      setSocialKlaar(true)
    }, fast ? 400 : 3000)
  }

  return (
    <SpokeFrame
      help={<HelpTray sectionId="widget" />}
      preview={
        live ? (
          <div className="w-full max-w-xl"><PreviewGrid config={config} /></div>
        ) : (
          <VideoPreview
            avatarId={config.avatars.nl}
            lang="nl"
            subtitles={page.subtitles.nl}
            backgrounds={config.backgrounds}
            logo={config.logo}
            className="max-w-2xl"
          />
        )
      }
    >
      {live ? (
        <Celebration
          done={[
            'Basissamenvatting en script goedgekeurd',
            `${talen.length} talen gecontroleerd door je collega's`,
            `De video staat live op ${page.url.replace('https://www.', '')}`,
          ]}
        />
      ) : (
        <>
          <h1 className="text-h2 text-gray-1">Publiceren</h1>
          <p className="text-body text-gray-2">{page.title}</p>

          <Card className="flex flex-col gap-3">
            <span className="flex items-center gap-2">
              <h2 className="flex-1 text-h3 text-gray-1">Het script</h2>
              <Button
                size="sm" variant="secondary"
                iconLeft={gekopieerd ? Check : Copy}
                onClick={() => {
                  void navigator.clipboard?.writeText(script).catch(() => {})
                  setGekopieerd(true)
                }}
              >
                {gekopieerd ? 'Gekopieerd' : 'Kopieer'}
              </Button>
            </span>
            <p className="whitespace-pre-line rounded-sm bg-gray-6 p-3 text-body-sm text-gray-2">
              {script}
            </p>
          </Card>

          <Card className="flex flex-col gap-3">
            <h2 className="text-h3 text-gray-1">Downloads</h2>
            <p className="text-body-sm text-gray-3">
              Elke download heeft een AI-label, zodat kijkers weten dat de video automatisch is
              gemaakt.
            </p>
            <div className="flex flex-wrap gap-2">
              {talen.map((l) => (
                <Button key={l} size="sm" variant="secondary" iconLeft={Download}>
                  {langLabel(l)}
                </Button>
              ))}
            </div>
          </Card>

          <Card className="flex flex-col gap-3">
            <h2 className="text-h3 text-gray-1">Ook voor socials?</h2>
            <p className="text-body-sm text-gray-2">
              We maken een vierkante en een staande versie, geschikt voor Facebook, Instagram en
              WhatsApp.
            </p>
            <span className="flex items-center gap-3">
              <Button
                size="sm" variant="secondary" iconLeft={socialKlaar ? Check : Share2}
                loading={socialBezig} onClick={maakSocials}
              >
                {socialKlaar ? 'Social-versies klaar' : 'Maak social-versies'}
              </Button>
              {socialKlaar && (
                <Button size="sm" variant="ghost" iconLeft={Download}>
                  Download social-versies
                </Button>
              )}
            </span>
          </Card>

          <ApproveBox
            title="Publiceren"
            consequence={
              mag
                ? 'Publiceren zet de widget live op de pagina. Bezoekers zien de video direct.'
                : 'Nog niet alle talen zijn goedgekeurd. Zodra dat wel zo is kun je publiceren.'
            }
            approveLabel="Publiceer"
            disabled={!mag}
            onApprove={() => {
              publish(page.id)
              finish('publish', { pageId: page.id })
            }}
          />
        </>
      )}

      {live && (
        <Button to="/" iconLeft={Sparkles}>Terug naar het overzicht</Button>
      )}
    </SpokeFrame>
  )
}
