import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import { useStore } from './state/store'
import type { ScenarioId } from './data/seed'
import './tokens/theme.css'

/**
 * HashRouter, niet BrowserRouter: dist/index.html moet vanaf file:// openen
 * zonder server, en daar kan BrowserRouter geen history in pushen.
 *
 * Vlaggen staan achter de hash (#/pad?fast=1) én ervoor, zodat beide werken.
 */
function readFlags() {
  const fromHash = window.location.hash.split('?')[1] ?? ''
  const params = new URLSearchParams(`${window.location.search.slice(1)}&${fromHash}`)
  return {
    fast: params.get('fast') === '1',
    reset: params.get('reset'),
    scenario: params.get('scenario'),
  }
}

const SCENARIO_IDS = ['eerste', 'tweede', 'derde', 'emre']

const { fast, reset, scenario } = readFlags()
const store = useStore.getState()

if (scenario && SCENARIO_IDS.includes(scenario)) {
  store.setScenario(scenario as ScenarioId)
} else if (reset === 'empty') {
  store.setScenario('eerste')
} else if (reset === '1') {
  store.resetScenario()
}
store.setFast(fast)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)
