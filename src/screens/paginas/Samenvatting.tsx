import { Navigate, useParams } from 'react-router-dom'
import { RefreshCw } from 'lucide-react'
import {
  ApproveBox, Avatar, Button, Card, HowBox, SceneBlock, WaitScreen,
} from '../../components'
import { SpokeFrame } from '../../components/layout/SpokeLayout'
import { HelpTray } from '../../components/feedback/HelpTray'
import { useStore } from '../../state/store'
import { useFinishSpoke } from '../../state/flow'
import { findPage } from '../../state/selectors'
import { avatarById } from '../../data/avatars'
import { HOE, WACHT_TIPS } from '../../data/copy'

const MAX_WOORDEN = 50

/**
 * S1 en S2 in één route: wachten en daarna controleren. Dat is de enige
 * doorlopende keten in de flow, en het maakt de wachttijd bestand tegen een
 * reload — je landt terug in dezelfde wachttijd met een kloppende teller.
 */
export default function Samenvatting() {
  const { id } = useParams()
  const page = useStore((s) => findPage(s.pages, id))
  const config = useStore((s) => s.config)
  const editScenes = useStore((s) => s.editScenes)
  const approveSummary = useStore((s) => s.approveSummary)
  const rerun = useStore((s) => s.rerun)
  const finish = useFinishSpoke()

  if (!page) return <Navigate to="/" replace />

  const avatar = avatarById(config.avatars.nl)
  const wacht = page.status === 'summarizing'

  return (
    <SpokeFrame
      help={<HelpTray sectionId="videotype" tips={WACHT_TIPS.samenvatting} />}
      preview={<Voorbeeld avatarFace={avatar?.face} naam={avatar?.name} />}
    >
      {wacht ? (
        <WaitScreen
          title="We maken de samenvatting"
          subtitle={`We lezen ${page.title.toLowerCase()} en schrijven er een korte samenvatting bij op ${config.level}-niveau.`}
          timer={page.timer}
          tips={WACHT_TIPS.samenvatting}
        />
      ) : (
        <>
          <h1 className="text-h2 text-gray-1">Basissamenvatting controleren</h1>

          <Card tone="tint" className="p-4">
            <p className="text-body text-blue-shade">
              Dit is de basis voor alle talen. Er staat alleen de essentiële informatie in —
              details van de pagina laten we bewust weg.
            </p>
          </Card>

          <HowBox points={HOE.samenvatting} />

          <div className="flex flex-col gap-3">
            {page.scenes.map((scene, i) => (
              <SceneBlock
                key={i}
                index={i + 1}
                title={scene.title}
                text={scene.text}
                maxWords={MAX_WOORDEN}
                onChange={(text) =>
                  editScenes(page.id, page.scenes.map((s, j) => (j === i ? { ...s, text } : s)))
                }
              />
            ))}
          </div>

          <Button
            variant="secondary" iconLeft={RefreshCw}
            onClick={() => rerun(page.id)}
          >
            Opnieuw genereren (1 credit)
          </Button>

          <ApproveBox
            consequence="Na akkoord wordt deze tekst de basis voor elke taal. In de volgende stap maak je de Nederlandse zinnen mooi voor de spraak."
            onApprove={() => {
              approveSummary(page.id)
              finish('summary', { pageId: page.id })
            }}
            onSave={() => finish('summary', { pageId: page.id })}
          />
        </>
      )}
    </SpokeFrame>
  )
}

/** Links: het frame is nog wazig, want er is nog geen audio en geen video. */
function Voorbeeld({ avatarFace, naam }: { avatarFace?: string; naam?: string }) {
  return (
    <div className="relative aspect-video w-full max-w-xl overflow-hidden rounded-md bg-gradient-to-br from-turq-tint to-blue-tint shadow-card">
      <span className="absolute inset-0 grid place-items-end justify-center">
        <Avatar face={avatarFace} name={naam} className="h-4/5 w-48 blur-[2px] opacity-70" />
      </span>
      <span className="absolute inset-x-4 bottom-4 rounded-sm bg-white/80 px-3 py-2 text-center text-body-sm text-gray-2">
        De video wordt gemaakt zodra de tekst klaar is
      </span>
    </div>
  )
}

export { Voorbeeld }
