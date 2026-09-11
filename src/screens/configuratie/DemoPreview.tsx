import { useState } from 'react'
import { Play } from 'lucide-react'
import { VideoPreview } from '../../components'
import { avatarById } from '../../data/avatars'
import { langDef, langLabel } from '../../data/langs'
import { pageContent } from '../../data'
import type { Config, Lang } from '../../state/types'

/**
 * De gemaakte demo, zoals een inwoner hem ziet: eerst de widget, dan de
 * taalkeuze, dan de video. Vervangt de preview zodra de demo klaar is.
 */
export function DemoPreview({ config }: { config: Config }) {
  const [taal, setTaal] = useState<Lang | null>(null)
  const [open, setOpen] = useState(false)
  const parkeren = pageContent('p-parkeervergunning')

  if (taal) {
    return (
      <div className="flex w-full flex-col gap-3">
        <VideoPreview
          avatarId={config.avatars[taal]}
          lang={taal}
          subtitles={parkeren?.subtitles[taal] ?? parkeren?.subtitles.nl}
          backgrounds={config.backgrounds}
          logo={config.logo}
        />
        <button
          type="button"
          onClick={() => {
            setTaal(null)
            setOpen(false)
          }}
          className="w-fit text-body-sm text-gray-3 hover:text-blue-shade"
        >
          Terug naar de widget
        </button>
      </div>
    )
  }

  return (
    <div className="relative flex w-full flex-col items-center gap-3">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 rounded-md bg-white px-5 py-4 shadow-pop transition-shadow hover:shadow-card"
      >
        <span
          className="grid size-11 place-items-center rounded-pill text-white"
          style={{ background: config.primary ?? '#46BAD8' }}
        >
          <Play size={20} aria-hidden />
        </span>
        <span className="flex flex-col text-left">
          <span className="text-h3 text-gray-1">Bekijk uitleg</span>
          <span className="text-body-sm text-gray-3">In {config.languages.length} talen</span>
        </span>
      </button>

      {open && (
        <div className="flex w-64 flex-col gap-1 rounded-md bg-white p-2 shadow-pop">
          <span className="type-label px-2 py-1 text-gray-3">Kies je taal</span>
          {config.languages.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setTaal(l)}
              dir={langDef(l)?.dir}
              className="flex items-center gap-3 rounded-sm px-3 py-2 text-left text-body text-gray-1 hover:bg-blue-tint"
            >
              <span className="type-label w-7 text-gray-3">{l}</span>
              {langDef(l)?.native ?? langLabel(l)}
              <span className="ml-auto text-body-sm text-gray-3">
                {avatarById(config.avatars[l])?.name}
              </span>
            </button>
          ))}
        </div>
      )}

      <p className="text-center text-body-sm text-gray-3">
        Zo ziet een inwoner het op je pagina.
      </p>
    </div>
  )
}
