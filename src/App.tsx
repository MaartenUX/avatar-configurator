import { TickProvider } from './state/TickProvider'
import { RouteTree } from './routes'

export default function App() {
  return (
    <TickProvider>
      <RouteTree />
    </TickProvider>
  )
}
