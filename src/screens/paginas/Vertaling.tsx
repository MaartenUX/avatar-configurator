import { Navigate, useParams } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { ApproveBox, HowBox, Player, SceneBlock } from '../../components'
import { SpokeFrame } from '../../components/layout/SpokeLayout'
import { Bekijkbalk } from '../../components/feedback/Bekijkbalk'
import { HelpTray } from '../../components/feedback/HelpTray'
import { useStore } from '../../state/store'
import { useBekijkstand } from '../../state/useBekijkstand'
import { useFinishSpoke } from '../../state/flow'
import { findPage } from '../../state/selectors'
import { avatarById } from '../../data/avatars'
import { langDir, langLabel, isLang } from '../../data/langs'
import { HOE } from '../../data/copy'
import { Voorbeeld } from './Samenvatting'
import { cn } from '../../lib/cn'

const MAX_WOORDEN = 55

/** S3: de collega-view. Zelfde anatomie als het NL-script, in zijn eigen taal. */
export default function Vertaling() {
  const { id, lang } = useParams()
  const page = useStore((s) => findPage(s.pages, id))
  const bekijken = useBekijkstand()
  const config = useStore((s) => s.config)
  const editTranslation = useStore((s) => s.editTranslation)
  const approveLang = useStore((s) => s.approveLang)
  const finish = useFinishSpoke()
  const [nlOpen, setNlOpen] = useState(false)

  if (!page || !isLang(lang)) return <Navigate to="/" replace />

  const avatar = avatarById(config.avatars[lang])
  const dir = langDir(lang)
  const scenes = page.translations[lang] ?? page.scenes

  return (
    <SpokeFrame
      locked={bekijken}
      help={<HelpTray sectionId="avatars" tips={HOE.vertaling} />}
      preview={
        <div className="flex w-full max-w-xl flex-col gap-3">
          <Voorbeeld avatarFace={avatar?.face} naam={avatar?.name} />
          <Player
            id={config.avatars[lang] ?? lang}
            label={`${langLabel(lang)} · ${avatar?.name ?? ''}`}
            durationSec={110}
          />

          {/* De Nederlandse tekst als referentie, uitklapbaar. */}
          <div className="rounded-md bg-white shadow-card">
            <button
              type="button"
              onClick={() => setNlOpen(!nlOpen)}
              aria-expanded={nlOpen}
              className="flex w-full items-center gap-2 px-4 py-3 text-left text-body text-gray-1"
            >
              <span className="flex-1">Nederlandse tekst ter vergelijking</span>
              <ChevronDown
                size={17} aria-hidden
                className={cn('text-gray-3 transition-transform', nlOpen && 'rotate-180')}
              />
            </button>
            {nlOpen && (
              <div className="flex flex-col gap-2.5 px-4 pb-4">
                {page.scenes.map((s, i) => (
                  <p key={i} className="text-body-sm text-gray-2">
                    <span className="type-label mr-2 text-gray-3">{i + 1}</span>
                    {s.text}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      }
    >
      <h1 className="text-h2 text-gray-1">{langLabel(lang)}</h1>
      <p className="text-body text-gray-2">
        Je collega heeft de Nederlandse tekst goedgekeurd. Controleer of de versie in het{' '}
        {langLabel(lang)} klopt en prettig klinkt om uit te spreken.
      </p>

      <HowBox points={HOE.vertaling} />

      <div className="flex flex-col gap-3">
        {scenes.map((scene, i) => (
          <SceneBlock
            key={i}
            index={i + 1}
            title={scene.title}
            text={scene.text}
            maxWords={MAX_WOORDEN}
            dir={dir}
            audioId={`${config.avatars[lang] ?? lang}-${i}`}
            audioSec={28}
            onChange={(text) =>
              editTranslation(page.id, lang, scenes.map((s, j) => (j === i ? { ...s, text } : s)))
            }
          />
        ))}
      </div>

      {bekijken ? (
            <Bekijkbalk />
          ) : (
            <ApproveBox
          consequence={`Na akkoord wordt de video in het ${langLabel(lang)} gemaakt. Dat duurt ongeveer 20 minuten. Daarna controleer je de ondertiteling.`}
          onApprove={() => {
            approveLang(page.id, lang)
            finish('lang', { pageId: page.id, lang })
          }}
          onSave={() => finish('lang', { pageId: page.id, lang })}
        />
          )}
    </SpokeFrame>
  )
}
