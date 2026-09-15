import { useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { TriangleAlert } from 'lucide-react'
import {
  ApproveBox, Dialog, HowBox, SubtitleEditor, VideoPreview, WaitScreen,
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
  const finish = useFinishSpoke()

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
            logo={config.logo}
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

          {/* Eigen scrollgebied: bij bijna dertig regels schuift anders het
              hele paneel weg onder de akkoordbalk. */}
          <div className="max-h-[46vh] overflow-y-auto rounded-md">
          <SubtitleEditor
            lines={regels}
            currentTime={tijd}
            onSeek={setSpring}
            dir={dir}
            onChange={(lines) => editSubtitles(page.id, lang, lines)}
          />
          </div>

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
        confirmLabel="Opnieuw maken"
        onConfirm={() => {
          rerun(page.id, lang)
          setDialoog(false)
          finish('video', { pageId: page.id, lang })
        }}
        cancelLabel="Melden bij XS2Content"
      />
    </SpokeFrame>
  )
}
