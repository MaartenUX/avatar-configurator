import { useEffect, useRef, useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { Check, ChevronDown, RotateCcw, SquarePlay } from 'lucide-react'
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
            <span className="text-h3 font-semibold text-gray-1">Uitlegvideo’s</span>
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
          <div className="flex items-center gap-2 rounded-sm border-2 border-gray-1 px-2.5 py-1.5">
            <span className="type-label rounded-pill bg-gray-1 px-2 py-0.5 text-white">
              Prototype
            </span>
            <ScenarioKeuze scenario={scenario} setScenario={setScenario} label={actief.label} />
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <ToastHost />
    </div>
  )
}

/**
 * De scenariokiezer. Geen `select`: daar past geen scheidslijn en geen icoon
 * in, en "Alles wissen" hoort zichtbaar los te staan van de vier standen
 * (CHANGES-05 C7).
 */
function ScenarioKeuze({
  scenario,
  setScenario,
  label,
}: {
  scenario: ScenarioId
  setScenario: (id: ScenarioId) => void
  label: string
}) {
  const [open, setOpen] = useState(false)
  const wrap = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!open) return
    const buiten = (e: MouseEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false)
    }
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', buiten)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('mousedown', buiten)
      document.removeEventListener('keydown', esc)
    }
  }, [open])

  /** Alles weg en opnieuw beginnen. Een herlaad garandeert dat er niets
   *  blijft hangen: de store bouwt zich vers op uit het lege scenario. */
  const wisAlles = () => {
    try {
      localStorage.removeItem('avatar-proto-v1')
    } catch {
      // Een browser die localStorage blokkeert heeft ook niets te wissen.
    }
    window.location.assign(`${import.meta.env.BASE_URL}?scenario=eerste#/`)
  }

  return (
    <div ref={wrap} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-1.5 rounded-sm border border-gray-5 bg-white px-2 py-1 text-body-sm text-gray-1 hover:border-gray-4"
      >
        {label}
        <ChevronDown size={14} aria-hidden className={cn('transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+6px)] z-40 flex w-60 flex-col rounded-sm border border-gray-5 bg-white py-1 shadow-pop"
        >
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              type="button"
              role="menuitem"
              onClick={() => {
                setScenario(s.id)
                setOpen(false)
              }}
              className="flex items-center gap-2 px-3 py-2 text-left text-body-sm text-gray-1 hover:bg-gray-6"
            >
              <Check
                size={14}
                aria-hidden
                className={cn('shrink-0', s.id === scenario ? 'text-blue-shade' : 'text-transparent')}
              />
              {s.label}
            </button>
          ))}

          <span className="my-1 h-px bg-gray-5" aria-hidden />

          <button
            type="button"
            role="menuitem"
            onClick={wisAlles}
            className="flex items-center gap-2 px-3 py-2 text-left text-body-sm text-gray-2 hover:bg-gray-6"
          >
            <RotateCcw size={14} aria-hidden className="shrink-0" />
            Alles wissen
          </button>
        </div>
      )}
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
