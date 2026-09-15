import { Navigate, useParams } from 'react-router-dom'
import { RefreshCw } from 'lucide-react'
import { ApproveBox, Button, HowBox, Player, SceneBlock } from '../../components'
import { SpokeFrame } from '../../components/layout/SpokeLayout'
import { Bekijkbalk } from '../../components/feedback/Bekijkbalk'
import { SpraakTips } from '../../components/feedback/SpraakTips'
import { useStore } from '../../state/store'
import { useBekijkstand } from '../../state/useBekijkstand'
import { useFinishSpoke } from '../../state/flow'
import { findPage } from '../../state/selectors'
import { avatarById } from '../../data/avatars'
import { HOE } from '../../data/copy'
import { Voorbeeld } from './Samenvatting'
import { useCountdown } from '../../state/useCountdown'

const MAX_WOORDEN = 50

/** S2b: de Nederlandse zinnen mooi maken voor de spraak, mét audio. */
export default function Script() {
  const { id } = useParams()
  const page = useStore((s) => findPage(s.pages, id))
  const bekijken = useBekijkstand()
  const config = useStore((s) => s.config)
  const editScenes = useStore((s) => s.editScenes)
  const approveNl = useStore((s) => s.approveNl)
  const regenerateAudio = useStore((s) => s.regenerateAudio)
  const finish = useFinishSpoke()
  const countdown = useCountdown(page?.timer)

  if (!page) return <Navigate to="/" replace />

  const avatar = avatarById(config.avatars.nl)
  const audioBezig = page.timer?.kind === 'audio' && !countdown?.done
  const talen = Object.keys(page.langs).length

  return (
    <SpokeFrame
      locked={bekijken}
      preview={
        <div className="flex w-full max-w-xl flex-col gap-3">
          <Voorbeeld avatarFace={avatar?.face} naam={avatar?.name} />
          <Player
            id={config.avatars.nl ?? 'nl-sanne'}
            label={`Nederlands · ${avatar?.name ?? ''}`}
            durationSec={110}
          />
        </div>
      }
    >
      <h1 className="text-h2 text-gray-1">Nederlands script en audio finetunen</h1>
      <p className="text-body text-gray-2">
        De tekst staat vast; hier maak je de zinnen mooi om uit te spreken. Wat je hier verandert,
        verandert niet de betekenis voor de andere talen.
      </p>

      <HowBox points={HOE.script} actie={<SpraakTips compact />} />

      <div className="flex flex-col gap-3">
        {page.scenes.map((scene, i) => (
          <SceneBlock
            key={i}
            index={i + 1}
            title={scene.title}
            text={scene.text}
            maxWords={MAX_WOORDEN}
            audioId={`${config.avatars.nl ?? 'nl-sanne'}-${i}`}
            audioSec={28}
            onChange={(text) =>
              editScenes(page.id, page.scenes.map((s, j) => (j === i ? { ...s, text } : s)))
            }
          />
        ))}
      </div>

      <Button
        className="w-fit"
        variant="secondary" iconLeft={RefreshCw}
        loading={audioBezig}
        onClick={() => regenerateAudio(page.id)}
      >
        {audioBezig ? 'Audio wordt gemaakt' : 'Audio opnieuw maken (gratis)'}
      </Button>

      {bekijken ? (
            <Bekijkbalk />
          ) : (
            <ApproveBox
          consequence={`Na akkoord krijgen je collega's een bericht om hun taal te controleren, en worden de video's gemaakt. Dat duurt ongeveer 20 minuten.`}
          onApprove={() => {
            approveNl(page.id)
            finish('script', { pageId: page.id, langCount: talen })
          }}
          onSave={() => finish('summary', { pageId: page.id })}
        />
          )}
    </SpokeFrame>
  )
}
