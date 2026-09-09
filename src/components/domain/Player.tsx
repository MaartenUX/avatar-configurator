import { useEffect, useRef, useState } from 'react'
import { Pause, Play } from 'lucide-react'
import { useNow } from '../../state/TickProvider'
import { voiceClip } from '../../lib/assets'
import { waveformBars } from '../../mock/waveform'
import { formatTimecode } from '../../lib/format'
import { cn } from '../../lib/cn'

export interface PlayerProps {
  /** Bepaalt de waveform en welk stemfragment gezocht wordt. */
  id: string
  label?: string
  durationSec: number
  compact?: boolean
  onEnded?: () => void
  className?: string
}

/**
 * Speelt src/assets/voices/{id}.mp3 als dat bestaat, en anders een mock die de
 * voortgang tegen de gedeelde klok afleest. Beide lopen door dezelfde
 * component, dus een mp3 erin droppen wisselt geen codepad.
 *
 * Speelt nooit vanzelf af: browsers blokkeren audio zonder klik.
 */
export function Player({ id, label, durationSec, compact, onEnded, className }: PlayerProps) {
  const [startedAt, setStartedAt] = useState<number | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const now = useNow()
  const src = voiceClip(id)
  const bars = waveformBars(id, compact ? 28 : 40)

  const elapsed = startedAt ? Math.min(durationSec, (now - startedAt) / 1000) : 0
  const progress = durationSec > 0 ? elapsed / durationSec : 0
  const playing = startedAt !== null && elapsed < durationSec

  useEffect(() => {
    if (startedAt !== null && elapsed >= durationSec) {
      setStartedAt(null)
      onEnded?.()
    }
  }, [startedAt, elapsed, durationSec, onEnded])

  const toggle = () => {
    if (playing) {
      setStartedAt(null)
      audioRef.current?.pause()
      return
    }
    setStartedAt(Date.now())
    if (src && audioRef.current) {
      audioRef.current.currentTime = 0
      void audioRef.current.play().catch(() => {
        /* Zonder gebruikersgebaar geweigerd: de mock loopt gewoon door. */
      })
    }
  }

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-md bg-white px-3 py-2.5 shadow-card',
        className,
      )}
    >
      {src && <audio ref={audioRef} src={src} preload="none" />}

      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? 'Pauzeer' : label ? `Speel ${label} af` : 'Speel af'}
        className="grid size-9 shrink-0 place-items-center rounded-pill bg-blue text-white transition-colors hover:bg-blue-shade"
      >
        {playing ? <Pause size={16} aria-hidden /> : <Play size={16} aria-hidden />}
      </button>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {label && !compact && <span className="type-label text-gray-3">{label}</span>}
        <div className="flex h-7 items-center gap-[2px]" aria-hidden>
          {bars.map((h, i) => {
            const passed = i / bars.length <= progress
            return (
              <span
                key={i}
                className={cn(
                  'w-full rounded-pill transition-colors',
                  passed ? 'bg-blue' : 'bg-gray-5',
                )}
                style={{ height: `${Math.round(h * 100)}%` }}
              />
            )
          })}
        </div>
      </div>

      <span className="shrink-0 text-body-sm tabular-nums text-gray-3">
        {formatTimecode(elapsed)} / {formatTimecode(durationSec)}
      </span>
    </div>
  )
}
