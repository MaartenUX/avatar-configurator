import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Save } from 'lucide-react'
import { Button, LockedBanner, PreviewGrid, SiteMock } from '../../components'
import { ProgressBar } from '../../components/layout/ProgressBar'
import { useStore } from '../../state/store'
import { SECTIONS, doneSections, firstOpenSection } from './sections'
import { SectionShell } from './SectionShell'
import { S1Talen, S2Avatars, S3VideoType, S4Personaliseren, S5Widget } from './secties'
import { S6Vastleggen } from './S6Vastleggen'
import { cn } from '../../lib/cn'

/** Hoe lang de observer een klik op "Verder" laat winnen van het scrollen. */
const INTENT_MS = 700

export default function Configuratie() {
  const config = useStore((s) => s.config)
  const setScrollY = useStore((s) => s.setScrollY)
  const startConfig = useStore((s) => s.startConfig)
  const navigate = useNavigate()

  const els = useRef(new Map<number, HTMLElement>())
  const settled = useRef(false)
  const intentUntil = useRef(0)
  const gridSentinel = useRef<HTMLDivElement | null>(null)

  const [active, setActive] = useState(() => firstOpenSection(config))
  const [previewMode, setPreviewMode] = useState<'site' | 'grid'>('site')

  const gedaan = doneSections(config)
  const vergrendeld = config.status === 'locked'

  useEffect(() => { startConfig() }, [startConfig])

  const register = useCallback(
    (index: number) => (el: HTMLElement | null) => {
      if (el) els.current.set(index, el)
      else els.current.delete(index)
    },
    [],
  )

  const scrollNaar = useCallback((index: number) => {
    const el = els.current.get(index)
    if (!el) return
    setActive(index)
    intentUntil.current = performance.now() + INTENT_MS
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  // 1. Herstel de scrollpositie vóór de eerste paint. De gate voorkomt dat de
  //    observer halverwege meldt en de bewaarde waarde overschrijft.
  useLayoutEffect(() => {
    const y = useStore.getState().config.scrollY
    if (!y) {
      settled.current = true
      return
    }
    const ga = () => {
      window.scrollTo({ top: y, behavior: 'instant' as ScrollBehavior })
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          settled.current = true
        }),
      )
    }
    if (document.fonts?.ready) void document.fonts.ready.then(ga)
    else ga()
  }, [])

  // 2. Welke sectie is actief? Een band van 10% in het midden van het scherm,
  //    zodat er nooit twee tegelijk in beeld zijn en de teller niet flappert.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        if (!settled.current) return
        if (performance.now() < intentUntil.current) return
        const raak = entries
          .filter((e) => e.isIntersecting)
          .map((e) => Number((e.target as HTMLElement).dataset.index))
          .sort((a, b) => a - b)[0]
        if (raak) setActive(raak)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    )
    els.current.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  // 3. Scrollpositie bewaren, hooguit vier keer per seconde.
  useEffect(() => {
    let raf = 0
    let laatst = 0
    const onScroll = () => {
      if (!settled.current || raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const nu = performance.now()
        if (nu - laatst < 250) return
        laatst = nu
        setScrollY(window.scrollY)
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [setScrollY])

  // 4. De preview wisselt naar het raster zodra de samenvattingskaart nadert.
  useEffect(() => {
    const el = gridSentinel.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => setPreviewMode(entry.isIntersecting ? 'grid' : 'site'),
      { rootMargin: '0px 0px -50% 0px', threshold: 0 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const inhoud = {
    talen: <S1Talen />,
    avatars: <S2Avatars />,
    videotype: <S3VideoType />,
    personaliseren: <S4Personaliseren />,
    widget: <S5Widget />,
    vastleggen: (
      <S6Vastleggen
        gridSentinel={gridSentinel}
        onWijzig={scrollNaar}
        onVastgelegd={() => navigate('/configuratie/demo')}
      />
    ),
  }

  return (
    <div>
      {/* Sticky balk: waar ben je, en hoe stop je tussentijds. */}
      <div className="sticky top-[72px] z-20 border-b border-gray-5 bg-white/95 px-6 py-3 backdrop-blur">
        <div className="flex items-center gap-6">
          <span className="min-w-0 flex-1">
            <ProgressBar
              value={vergrendeld ? 6 : active}
              max={6}
              note={vergrendeld ? 'Vastgelegd' : `± ${Math.max(2, (6 - gedaan.length) * 2)} min te gaan`}
            />
          </span>
          <Button variant="secondary" size="sm" iconLeft={Save} to="/">
            Sla op en ga later verder
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2">
        {/* Links: de preview die meegroeit met wat rechts gekozen wordt. */}
        <div className="hidden bg-bg px-8 py-8 lg:block">
          <div className="sticky top-[152px] flex flex-col gap-4">
            <div className="relative">
              <div
                className={cn(
                  'transition-all duration-500',
                  previewMode === 'grid' ? 'pointer-events-none absolute inset-0 scale-95 opacity-0' : 'opacity-100',
                )}
              >
                <SiteMock config={config} expanded={active >= 3 && active <= 4} />
              </div>
              <div
                className={cn(
                  'transition-all duration-500',
                  previewMode === 'site' ? 'pointer-events-none absolute inset-0 scale-105 opacity-0' : 'opacity-100',
                )}
              >
                <PreviewGrid config={config} />
              </div>
            </div>

          </div>
        </div>

        {/* Rechts: één doorlopende scrollpagina. */}
        <div className="flex flex-col bg-white px-8 py-8">
          {!vergrendeld && (
            <div className="mb-8 rounded-md bg-white p-5 shadow-card">
              <h1 className="text-h2 text-gray-1">Voordat je begint</h1>
              <p className="mt-1.5 text-body text-gray-2">
                Dit duurt ongeveer een kwartier. Je hebt nodig: het webadres van je website,
                eventueel eigen achtergrondfoto’s, en de namen van collega’s per taal.
              </p>
              <p className="mt-1.5 text-body-sm text-gray-3">
                Je kunt altijd stoppen en later verdergaan.
              </p>
            </div>
          )}

          {vergrendeld && (
            <div className="mb-8 flex flex-col gap-3">
              <LockedBanner signedAt={config.signedAt} to="/" />
              <p className="flex items-center gap-2 text-body-sm text-gray-3">
                <Lock size={14} aria-hidden />
                Je kunt alles inzien, maar niet meer wijzigen.
              </p>
            </div>
          )}

          {SECTIONS.map((def, i) => (
            <SectionShell
              key={def.id}
              def={def}
              register={register(def.index)}
              state={def.index === active ? 'active' : def.index < active ? 'past' : 'future'}
              onNext={i < SECTIONS.length - 1 ? () => scrollNaar(def.index + 1) : undefined}
            >
              <fieldset disabled={vergrendeld && def.id !== 'vastleggen'} className="contents">
                {inhoud[def.id]}
              </fieldset>
            </SectionShell>
          ))}
        </div>
      </div>
    </div>
  )
}
