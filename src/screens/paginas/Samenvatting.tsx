import { useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { RefreshCw } from 'lucide-react'
import {
  ApproveBox, Avatar, Button, Dialog, HowBox, SceneBlock, WaitScreen,
} from '../../components'
import { SpokeFrame } from '../../components/layout/SpokeLayout'
import { Bekijkbalk } from '../../components/feedback/Bekijkbalk'
import { SpraakTips } from '../../components/feedback/SpraakTips'
import { useStore } from '../../state/store'
import { pageContent } from '../../data'
import { useBekijkstand } from '../../state/useBekijkstand'
import { useFinishSpoke } from '../../state/flow'
import { findPage } from '../../state/selectors'
import { avatarById } from '../../data/avatars'
import { HOE, WACHT_TIPS } from '../../data/copy'

/**
 * S1 en S2 in één route: wachten en daarna controleren. Dat is de enige
 * doorlopende keten in de flow, en het maakt de wachttijd bestand tegen een
 * reload — je landt terug in dezelfde wachttijd met een kloppende teller.
 */
export default function Samenvatting() {
  const { id } = useParams()
  const page = useStore((s) => findPage(s.pages, id))
  const bekijken = useBekijkstand()
  const config = useStore((s) => s.config)
  const editScenes = useStore((s) => s.editScenes)
  const approveSummary = useStore((s) => s.approveSummary)
  const rerun = useStore((s) => s.rerun)
  const finish = useFinishSpoke()
  const [waarschuw, setWaarschuw] = useState(false)

  if (!page) return <Navigate to="/" replace />

  const avatar = avatarById(config.avatars[config.languages[0] ?? 'nl'])
  const wacht = page.status === 'summarizing'

  // Opnieuw genereren gooit je eigen zinnen weg; dat zeggen we alleen als er
  // écht iets veranderd is (CHANGES-09 B9).
  const origineel = pageContent(page.id)?.scenes
  const bewerkt = Boolean(
    origineel && page.scenes.some((scene, i) => scene.text !== origineel[i]?.text),
  )

  return (
    <SpokeFrame
      locked={bekijken}
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
          <div className="flex flex-col gap-1.5">
            <h1 className="text-h2 text-gray-1">Basissamenvatting controleren</h1>
            <p className="text-body text-gray-2">
              Dit is de basis voor alle talen. Er staat alleen de essentiële informatie in —
              details van de pagina laten we bewust weg.
            </p>
          </div>

          <HowBox points={HOE.samenvatting} actie={<SpraakTips soort="b1" compact />} />

          <div className="flex flex-col gap-3">
            {page.scenes.map((scene, i) => (
              <SceneBlock
                key={i}
                index={i}
                text={scene.text}
                totaal={page.scenes.length}
                onChange={(text) =>
                  editScenes(page.id, page.scenes.map((s, j) => (j === i ? { ...s, text } : s)))
                }
              />
            ))}
          </div>

          <span className="flex flex-wrap items-center gap-3">
            <Button
              variant="secondary" iconLeft={RefreshCw}
              onClick={() => (bewerkt ? setWaarschuw(true) : rerun(page.id))}
            >
              Opnieuw genereren
            </Button>
            <span className="text-body-sm text-gray-3">
              Dit gaat van je gezamenlijke pot om opnieuw te maken.
            </span>
          </span>

          {bekijken ? (
            <Bekijkbalk />
          ) : (
            <ApproveBox
              consequence="Na akkoord maken we voor elke taal een script met audio. Je collega’s krijgen een bericht."
              onApprove={() => {
                approveSummary(page.id)
                finish('summary', { pageId: page.id })
              }}
              onSave={() => finish('summary', { pageId: page.id })}
            />
          )}
        </>
      )}
      <Dialog
        open={waarschuw}
        onClose={() => setWaarschuw(false)}
        title="Opnieuw genereren?"
        description="Opnieuw genereren maakt een nieuwe samenvatting. Je aanpassingen in de tekst gaan verloren."
        cancelLabel="Annuleer"
        confirmLabel="Opnieuw genereren"
        onConfirm={() => {
          setWaarschuw(false)
          rerun(page.id)
        }}
      />
    </SpokeFrame>
  )
}

/**
 * Links: onherkenbaar wazig. De avatar mag niet te zien zijn zolang de video
 * er niet is — anders lijkt het alsof er al iets klaarstaat.
 */
function Voorbeeld({ avatarFace, naam }: { avatarFace?: string; naam?: string }) {
  return (
    <div className="relative mx-auto aspect-[9/16] w-full max-w-[280px] overflow-hidden rounded-md bg-gradient-to-br from-turq-tint to-blue-tint shadow-card">
      <span className="absolute inset-0 grid place-items-end justify-center">
        <Avatar face={avatarFace} name={naam} className="h-4/5 w-56 scale-110 opacity-80 blur-[28px]" />
      </span>
      {/* Donkere sluier: zonder dit valt witte tekst weg op het lichte deel. */}
      <span className="absolute inset-0 bg-gray-1/35" aria-hidden />
      <span className="absolute inset-0 grid place-items-center px-6">
        <span className="text-center text-h3 text-white">
          De video wordt gemaakt zodra de tekst klaar is
        </span>
      </span>
    </div>
  )
}

export { Voorbeeld }
