import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ROUTES, RouteTree, samplePath } from '../routes'
import { TickProvider } from '../state/TickProvider'
import { useStore } from '../state/store'

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <TickProvider>
        <RouteTree />
      </TickProvider>
    </MemoryRouter>,
  )

describe('routes', () => {
  it('rendert elke route zonder te crashen', () => {
    useStore.getState().setScenario('tweede')
    for (const route of ROUTES) {
      const { unmount } = renderAt(samplePath(route.path))
      unmount()
    }
  })

  it('stuurt een onbekende taalcode terug naar de pagina', () => {
    useStore.getState().setScenario('tweede')
    renderAt('/paginas/p-bijstand/samenvattng')
    // De guard redirect naar /paginas/:id, dus we zien het beheerscherm.
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('toont een nette pagina voor een onbekende route', () => {
    renderAt('/bestaat-niet')
    expect(screen.getByText(/bestaat niet/i)).toBeInTheDocument()
  })
})
