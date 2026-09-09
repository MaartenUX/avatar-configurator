import type { ReactNode } from 'react'
import { Button } from '../primitives/Button'
import { useCountdown } from '../../state/useCountdown'
import type { Timer } from '../../state/types'

export interface WaitScreenProps {
  title: string
  subtitle?: string
  timer?: Timer
  /** Wachttijd is instructietijd: hier staat wat je straks gaat doen. */
  tips?: string[]
  actionLabel?: string
  onAction?: () => void
  children?: ReactNode
}

/**
 * Cirkel met aftellend getal. De knop wordt pas actief op nul, zodat niemand
 * doorklikt naar iets wat er nog niet is.
 */
export function WaitScreen({
  title,
  subtitle,
  timer,
  tips,
  actionLabel,
  onAction,
  children,
}: WaitScreenProps) {
  const countdown = useCountdown(timer)
  const done = !timer || (countdown?.done ?? true)
  const progress = countdown?.progress ?? 1
  const seconds = countdown?.seconds ?? 0

  const R = 54
  const C = 2 * Math.PI * R

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <div className="relative grid size-32 place-items-center">
        <svg viewBox="0 0 128 128" className="absolute inset-0 -rotate-90" aria-hidden>
          <circle cx="64" cy="64" r={R} fill="none" stroke="#E0E0E0" strokeWidth="7" />
          <circle
            cx="64" cy="64" r={R} fill="none"
            stroke="#7AD3CB" strokeWidth="7" strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - progress)}
            style={{ transition: 'stroke-dashoffset .25s linear' }}
          />
        </svg>
        <span
          className="text-h1 tabular-nums text-gray-1"
          role="timer"
          aria-live="off"
        >
          {done ? '0' : seconds}
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        <h2 className="text-h2 text-gray-1">{title}</h2>
        {subtitle && <p className="max-w-md text-body text-gray-2">{subtitle}</p>}
      </div>

      {tips && tips.length > 0 && (
        <div className="w-full max-w-md rounded-md bg-white p-5 text-left shadow-card">
          <p className="type-label mb-2.5 text-gray-3">Alvast handig om te weten</p>
          <ul className="flex flex-col gap-2">
            {tips.map((tip) => (
              <li key={tip} className="flex gap-2.5 text-body text-gray-2">
                <span className="mt-2 size-1.5 shrink-0 rounded-pill bg-turq" aria-hidden />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {children}

      {actionLabel && (
        <Button onClick={onAction} disabled={!done}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
