import { Link, Outlet } from 'react-router-dom'
import { CircleHelp, FileVideo, LayoutGrid, Settings2, Users } from 'lucide-react'
import { SidebarItem } from './SidebarItem'
import { CreditsMeter } from './CreditsMeter'
import { ToastHost } from '../feedback/Toast'
import { useStore } from '../../state/store'
import { USERS } from '../../data/team'

/** De schil met sidebar. Alles behalve de spaken zit hierin. */
export function ShellLayout() {
  const credits = useStore((s) => s.credits)
  const user = useStore((s) => s.user)
  const switchUser = useStore((s) => s.switchUser)
  const configLocked = useStore((s) => s.config.status === 'locked')
  const active = USERS[user]

  return (
    <div className="min-h-svh bg-bg">
      <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-gray-5 bg-white px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-sm bg-blue text-white" aria-hidden>
            <FileVideo size={18} />
          </span>
          <span className="text-h3 font-semibold text-gray-1">Uitlegvideo's</span>
        </Link>

        <div className="flex items-center gap-6">
          <CreditsMeter used={credits.used} total={credits.total} />
          {/* Alleen in dit prototype: wisselen tussen beheerder en collega. */}
          <label className="flex items-center gap-2 text-body-sm text-gray-3">
            <span className="type-label">Ingelogd als</span>
            <select
              value={user}
              onChange={(e) => switchUser(e.target.value as 'esmee' | 'emre')}
              className="rounded-sm border border-gray-5 bg-white px-2.5 py-1.5 text-body-sm text-gray-1"
            >
              <option value="esmee">Esmee (beheerder)</option>
              <option value="emre">Emre (collega Turks)</option>
            </select>
          </label>
          <span className="grid size-9 place-items-center rounded-pill bg-violet-tint text-body-sm font-semibold text-violet-shade">
            {active.name.slice(0, 1)}
          </span>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1440px] gap-8 px-6 py-8">
        <nav aria-label="Hoofdmenu" className="w-[220px] shrink-0">
          <ul className="flex flex-col gap-1">
            <li><SidebarItem to="/" icon={LayoutGrid} label="Overzicht" end /></li>
            <li><SidebarItem to="/paginas" icon={FileVideo} label="Pagina's" /></li>
            <li><SidebarItem to="/configuratie" icon={Settings2} label="Configuratie" locked={configLocked} /></li>
            <li><SidebarItem to="/team" icon={Users} label="Team" /></li>
            <li><SidebarItem to="/hulp" icon={CircleHelp} label="Hulp" /></li>
          </ul>
        </nav>

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>

      <ToastHost />
    </div>
  )
}
