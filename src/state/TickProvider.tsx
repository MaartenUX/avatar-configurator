import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { useStore } from './store'

const NowContext = createContext<number>(Date.now())

/**
 * Het enige interval in de app. Zet de huidige tijd in een context en laat de
 * store afgelopen timers afhandelen. Staat boven de router, dus hij overleeft
 * elke navigatie; de beat bij mount en bij terugkeer naar de tab vangt reloads
 * en achtergrondtabs op waar de browser het interval heeft gesmoord.
 */
export function TickProvider({ children }: { children: ReactNode }) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const beat = () => {
      const t = Date.now()
      setNow(t)
      useStore.getState().tick(t)
    }
    beat()
    const id = window.setInterval(beat, 250)
    const onVisible = () => {
      if (document.visibilityState === 'visible') beat()
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      window.clearInterval(id)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [])

  return <NowContext.Provider value={now}>{children}</NowContext.Provider>
}

/** Alleen componenten die dit aanroepen hertekenen vier keer per seconde. */
export const useNow = () => useContext(NowContext)
