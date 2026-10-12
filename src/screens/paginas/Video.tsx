import { useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { TriangleAlert } from 'lucide-react'
import {
  ApproveBox, Button, Dialog, HowBox, SubtitleEditor, VideoPreview, WaitScreen,
} from '../../components'
import { SpokeFrame } from '../../components/layout/SpokeLayout'
import { Bekijkbalk } from '../../components/feedback/Bekijkbalk'
import { SpraakTips } from '../../components/feedback/SpraakTips'
import { useStore } from '../../state/store'
import { useBekijkstand } from '../../state/useBekijkstand'
import { useFinishSpoke } from '../../state/flow'
import { findPage } from '../../state/selectors'
import { langDir, langLabel, isLang } from '../../data/langs'
import { HOE, WACHT_TIPS } from '../../data/copy'
import { cn } from '../../lib/cn'

const REDENEN = [
  { id: 'avatar', label: 'De avatar ziet er vreemd uit' },
  { id: 'sync', label: 'De spraak loopt niet synchroon' },
  { id: 'anders', label: 'Iets anders', description: 'We nemen contact met je op.' },
]

/** S4 en S5 in één route: wachten op de video, daarna ondertiteling nakijken. */
export default function Video() {
  const { id, lang } = useParams()
  const page = useStore((s) => findPage(s.pages, id))
  const bekijken = useBekijkstand()
  const config = useStore((s) => s.config)
  const editSubtitles = useStore((s) => s.editSubtitles)
  const approveVideo = useStore((s) => s.approveVideo)
  const rerun = useStore((s) => s.rerun)
  const reruns = useStore((s) => s.reruns)
  const flash = useStore((s) => s.flash)
  const finish = useFinishSpoke()
  const geenReruns = reruns.used >= reruns.total

  const [tijd, setTijd] = useState(0)
  const [spring, setSpring] = useState<number | null>(null)
  const [dialoog, setDialoog] = useState(false)
  const [reden, setReden] = useState('avatar')

  if (!page || !isLang(lang)) return <Navigate to="/" replace />

  const status = page.langs[lang]?.status
  const wacht = status === 'generating'
  const regels = page.subtitles[lang] ?? page.subtitles.nl ?? []
  const dir = langDir(lang)

  return (
    <SpokeFrame
      locked={bekijken}
      preview={
        <div className="flex w-full max-w-2xl flex-col gap-3">
          <VideoPreview
            avatarId={config.avatars[lang]}
            lang={lang}
            subtitles={regels}
            backgrounds={config.backgrounds}
            transition={config.transition}
            primary={config.primary}
            seekTo={spring}
            onTimeUpdate={setTijd}
          />
          {!wacht && (
            <button
              type="button"
              onClick={() => setDialoog(true)}
              className="inline-flex w-fit items-center gap-1.5 text-body-sm text-gray-3 hover:text-red-shade"
            >
              <TriangleAlert size={15} aria-hidden />
              Video is niet oké?
            </button>
          )}
        </div>
      }
    >
      {wacht ? (
        <WaitScreen
          title={`De video in het ${langLabel(lang)} wordt gemaakt`}
          subtitle="Je hoeft hier niet op te wachten. Zodra hij klaar is staat hij op je overzicht."
          timer={page.timer}
          tips={WACHT_TIPS.video}
        />
      ) : (
        <>
          <h1 className="text-h2 text-gray-1">Ondertiteling en video controleren</h1>
          <p className="text-body text-gray-2">
            {langLabel(lang)}. Klik op een tijdcode om daar in de video te springen.
          </p>

          <HowBox points={HOE.video} actie={<SpraakTips soort="ondertitel" compact />} />

          <SubtitleEditor
            lines={regels}
            currentTime={tijd}
            onSeek={setSpring}
            dir={dir}
            onChange={(lines) => editSubtitles(page.id, lang, lines)}
          />

          {bekijken ? (
            <Bekijkbalk />
          ) : (
            <ApproveBox
              consequence={`Na akkoord staat het ${langLabel(lang)} klaar om te publiceren. Zodra alle talen klaar zijn kun je de pagina live zetten.`}
              onApprove={() => {
                approveVideo(page.id, lang)
                finish('video', { pageId: page.id, lang })
              }}
              onSave={() => finish('video', { pageId: page.id, lang })}
            />
          )}
        </>
      )}

      <Dialog
        open={dialoog}
        onClose={() => setDialoog(false)}
        title="Video is niet oké?"
        description="Een video wordt automatisch gemaakt, dus het kan een keer misgaan. Vertel wat er mis is."
        options={REDENEN}
        value={reden}
        onValueChange={setReden}
        footer={
          /* Melden staat voorop: dat kost niets en wij kunnen er iets mee.
             Zelf opnieuw maken gaat van je eigen pot af (CHANGES-06 C7). */
          <div className="mt-6 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Button
                className="w-fit"
                disabled={!reden}
                onClick={() => {
                  setDialoog(false)
                  flash({
                    text: 'Je melding staat bij XS2Content. Je hoort ervan.',
                    tone: 'success',
                  })
                }}
              >
                Melden bij XS2Content
              </Button>
              <p className="text-body-sm text-gray-3">
                Beschrijf wat er niet klopt, dan kijken wij ernaar. Dit kost je niets.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <Button
                variant="secondary"
                className="w-fit"
                disabled={!reden || geenReruns}
                onClick={() => {
                  rerun(page.id, lang)
                  setDialoog(false)
                  finish('video', { pageId: page.id, lang })
                }}
              >
                Zelf opnieuw maken
              </Button>
              <p className={cn('text-body-sm', geenReruns ? 'text-orange-shade' : 'text-gray-3')}>
                {geenReruns
                  ? 'Je kunt niet meer zelf opnieuw maken. Meld het bij XS2Content.'
                  : `Dit gebruikt 1 van je ${reruns.total} keer opnieuw maken (nog ${reruns.total - reruns.used} over).`}
              </p>
            </div>
          </div>
        }
      />
    </SpokeFrame>
  )
}
