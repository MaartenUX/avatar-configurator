import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import { ShellLayout } from './components/layout/ShellLayout'
import { SpokeLayout } from './components/layout/SpokeLayout'
import Overzicht from './screens/Overzicht'
import Team from './screens/Team'
import Hulp from './screens/Hulp'
import NotFound from './screens/NotFound'
import Kit from './screens/Kit'
import Configuratie from './screens/configuratie/Configuratie'
import Demo from './screens/configuratie/Demo'
import Beheer from './screens/paginas/Beheer'
import NieuwePagina from './screens/paginas/NieuwePagina'
import Samenvatting from './screens/paginas/Samenvatting'
import ScriptScherm from './screens/paginas/Script'
import Vertaling from './screens/paginas/Vertaling'
import Video from './screens/paginas/Video'
import Publiceren from './screens/paginas/Publiceren'
import { isLang } from './data/langs'

export type RouteLayout = 'shell' | 'spoke'

export interface RouteDef {
  path: string
  layout: RouteLayout
  label: string
}

/**
 * Eén bron voor de router en voor de smoke-test.
 *
 * React Router rangschikt statische segmenten boven dynamische, dus
 * /paginas/nieuw wint van /paginas/:id en /paginas/:id/samenvatting wint van
 * /paginas/:id/:lang. De guard hieronder vangt alleen typefouten op: zonder
 * hem zou /paginas/p-1/samenvattng het vertaalscherm openen met lang="samenvattng".
 */
export const ROUTES: RouteDef[] = [
  { path: '/', layout: 'shell', label: 'Overzicht' },
  { path: '/configuratie', layout: 'shell', label: 'Configuratie' },
  { path: '/configuratie/demo', layout: 'shell', label: 'Demo' },
  { path: '/paginas/:id', layout: 'shell', label: 'Pagina beheren' },
  { path: '/team', layout: 'shell', label: 'Team' },
  { path: '/hulp', layout: 'shell', label: 'Hulp' },
  { path: '/kit', layout: 'shell', label: 'Componenten' },
  { path: '/paginas/nieuw', layout: 'spoke', label: 'Pagina toevoegen' },
  { path: '/paginas/:id/samenvatting', layout: 'spoke', label: 'Basissamenvatting' },
  { path: '/paginas/:id/script', layout: 'spoke', label: 'Nederlands script' },
  { path: '/paginas/:id/publiceren', layout: 'spoke', label: 'Publiceren' },
  { path: '/paginas/:id/video/:lang', layout: 'spoke', label: 'Video controleren' },
  { path: '/paginas/:id/:lang', layout: 'spoke', label: 'Vertaling controleren' },
]

/** Voorbeeldwaarden waarmee de smoke-test elke route kan invullen. */
export const ROUTE_SAMPLE = { id: 'p-bijstand', lang: 'tr' }

export const samplePath = (path: string) =>
  path.replace(':id', ROUTE_SAMPLE.id).replace(':lang', ROUTE_SAMPLE.lang)

/** Onbekende taalcode? Dan is het geen vertaalscherm maar een tikfout. */
function VertalingGuard() {
  const { id, lang } = useParams()
  if (!isLang(lang)) return <Navigate to={`/paginas/${id}`} replace />
  return <Vertaling />
}

function VideoGuard() {
  const { id, lang } = useParams()
  if (!isLang(lang)) return <Navigate to={`/paginas/${id}`} replace />
  return <Video />
}

export function RouteTree() {
  return (
    <Routes>
      <Route element={<ShellLayout />}>
        <Route path="/" element={<Overzicht />} />
        <Route path="/configuratie" element={<Configuratie />} />
        <Route path="/configuratie/demo" element={<Demo />} />
        {/* De paginalijst is opgegaan in het overzicht; oude links blijven werken. */}
        <Route path="/paginas" element={<Navigate to="/" replace />} />
        <Route path="/paginas/:id" element={<Beheer />} />
        <Route path="/team" element={<Team />} />
        <Route path="/hulp" element={<Hulp />} />
        <Route path="/kit" element={<Kit />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route element={<SpokeLayout />}>
        <Route path="/paginas/nieuw" element={<NieuwePagina />} />
        <Route path="/paginas/:id/samenvatting" element={<Samenvatting />} />
        <Route path="/paginas/:id/script" element={<ScriptScherm />} />
        <Route path="/paginas/:id/publiceren" element={<Publiceren />} />
        <Route path="/paginas/:id/video/:lang" element={<VideoGuard />} />
        <Route path="/paginas/:id/:lang" element={<VertalingGuard />} />
      </Route>
    </Routes>
  )
}
