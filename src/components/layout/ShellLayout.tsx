import { Link, Outlet } from 'react-router-dom'
import { SquarePlay } from 'lucide-react'
import { VideoMeter } from './VideoMeter'
import { ToastHost } from '../feedback/Toast'
import { useStore } from '../../state/store'
import { SCENARIOS } from '../../data/seed'
import type { ScenarioId } from '../../data/seed'
import { cn } from '../../lib/cn'

/**
 * De schil. Geen zijbalk: het overzicht is de hub en alles hangt daaronder.
 * Team en Hulp staan in de voettekst van het overzicht, de configuratie achter
 * de vastgelegd-banner.
 *
 * De main heeft bewust geen max-breedte of padding — elk scherm zet die zelf.
 * Zo kan de configurator zijn twee helften tot de schermrand doortrekken.
 */
export function ShellLayout() {
  const videos = useStore((s) => s.videos)
  const reruns = useStore((s) => s.reruns)
  const scenario = useStore((s) => s.scenario)
  const setScenario = useStore((s) => s.setScenario)
  const actief = SCENARIOS.find((s) => s.id === scenario) ?? SCENARIOS[1]

  return (
    <div className="min-h-svh bg-bg">
      <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between gap-6 border-b border-gray-5 bg-white px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid size-9 shrink-0 place-items-center rounded-sm bg-blue text-white" aria-hidden>
            <SquarePlay size={19} />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-h3 text-gray-1">
              <span className="font-semibold">Uitlegvideo’s</span>{' '}
              <span className="font-normal">voor gemeente Bergrode</span>
            </span>
            <span className="text-body-sm text-gray-3">door ReadSpeaker en XS2Content</span>
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <VideoMeter videos={videos} reruns={reruns} />

          {/* Het account hoort bij de interface; het kader ernaast niet. */}
          <span className="flex items-center gap-2.5">
            <span className="grid size-9 shrink-0 place-items-center rounded-pill bg-violet-tint text-body-sm font-semibold text-violet-shade">
              {actief.user === 'emre' ? 'E' : 'E'}
            </span>
            <span className="text-body-sm text-gray-1">
              {actief.user === 'emre' ? 'Emre Yılmaz' : 'Esmee de Vries'}
            </span>
          </span>

          {/* Zwart kader: dit is de testopstelling, geen onderdeel van het product. */}
          <label className="flex items-center gap-2 rounded-sm border-2 border-gray-1 px-2.5 py-1.5">
            <span className="type-label text-gray-1">Testscenario</span>
            <select
              value={scenario}
              onChange={(e) => setScenario(e.target.value as ScenarioId)}
              className="rounded-sm border border-gray-5 bg-white px-2 py-1 text-body-sm text-gray-1"
            >
              {SCENARIOS.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </label>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <ToastHost />
    </div>
  )
}

/** Standaardbreedte voor schermen die geen volle breedte nodig hebben. */
export function ShellContainer({
  children,
  breed,
}: {
  children: React.ReactNode
  /** Breder dan de standaard 1040, voor schermen met veel naast elkaar. */
  breed?: boolean
}) {
  return (
    <div className={cn('mx-auto w-full px-6 py-8', breed ? 'max-w-[1440px]' : 'max-w-[1040px]')}>
      {children}
    </div>
  )
}
