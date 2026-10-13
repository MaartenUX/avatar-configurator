import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ABONNEMENT } from '../../data/learnmore'
import { rerunsLabel, videosLabel } from '../../lib/format'
import { cn } from '../../lib/cn'

export interface VideoMeterProps {
  videos: { used: number; total: number }
  reruns: { used: number; total: number }
  /** In de header is de teller aanklikbaar; elders alleen tekst. */
  interactief?: boolean
}

/** Hoe lang je moet blijven hangen voor de korte uitleg verschijnt. */
const TIP_MS = 500

/**
 * Twee potten: hoeveel uitlegvideo's je nog mag maken, met een balkje eronder,
 * en hoe vaak je er nog een opnieuw kunt laten draaien. Die tweede is
 * gezamenlijk, niet per video, en heeft daarom geen eigen balk.
 *
 * Hangen geeft de eerste zin, klikken het hele kaartje (CHANGES-08 A).
 */
export function VideoMeter({ videos, reruns, interactief }: VideoMeterProps) {
  const videosOver = Math.max(0, videos.total - videos.used)
  const rerunsOver = Math.max(0, reruns.total - reruns.used)

  return (
    <div className={cn('flex items-center gap-4', interactief && 'group')}>
      <div className="flex flex-col gap-1.5">
        <Tip tekst={ABONNEMENT.videos} aan={interactief}>
          <span
            className={cn(
              'text-body-sm',
              videosOver <= 2 ? 'text-orange-shade' : 'text-gray-2',
              interactief && 'group-hover:underline',
            )}
          >
            {videosLabel(videos.used, videos.total)}
          </span>
        </Tip>
        <span className="h-1 w-44 overflow-hidden rounded-pill bg-gray-5">
          <span
            className={cn(
              'block h-full rounded-pill transition-[width] duration-500',
              videosOver <= 2 ? 'bg-orange' : 'bg-blue',
            )}
            style={{ width: `${(videosOver / videos.total) * 100}%` }}
          />
        </span>
      </div>

      <Tip tekst={ABONNEMENT.reruns} aan={interactief}>
        <span
          className={cn(
            'text-body-sm',
            rerunsOver <= 1 ? 'text-orange-shade' : 'text-gray-3',
            interactief && 'group-hover:underline',
          )}
        >
          {rerunsLabel(reruns.used, reruns.total)}
        </span>
      </Tip>
    </div>
  )
}

/** Korte uitleg na een halve seconde hangen; het hele verhaal zit achter de klik. */
function Tip({ tekst, aan, children }: { tekst: string; aan?: boolean; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const klok = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(klok.current), [])

  if (!aan) return <>{children}</>

  return (
    <span
      className="relative block"
      onMouseEnter={() => {
        klok.current = window.setTimeout(() => setOpen(true), TIP_MS)
      }}
      onMouseLeave={() => {
        window.clearTimeout(klok.current)
        setOpen(false)
      }}
    >
      {children}
      {open && (
        <span className="absolute left-0 top-[calc(100%+8px)] z-40 w-60 rounded-sm bg-gray-1 px-2.5 py-1.5 text-body-sm leading-snug text-white shadow-pop">
          {tekst}
        </span>
      )}
    </span>
  )
}
