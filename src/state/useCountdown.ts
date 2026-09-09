import { useNow } from './TickProvider'
import { useStore } from './store'
import { etaMinutesOf, progressOf, remainingOf } from './timers'
import type { Timer } from './types'

export interface Countdown {
  remainingMs: number
  seconds: number
  progress: number
  etaMin: number
  done: boolean
}

/** Leest de resterende tijd van een lopende timer af tegen de gedeelde klok. */
export function useCountdown(timer?: Timer): Countdown | null {
  const now = useNow()
  const fast = useStore((s) => s.fast)
  if (!timer) return null
  const remainingMs = remainingOf(timer, fast, now)
  return {
    remainingMs,
    seconds: Math.ceil(remainingMs / 1000),
    progress: progressOf(timer, fast, now),
    etaMin: etaMinutesOf(timer, fast, now),
    done: remainingMs === 0,
  }
}
