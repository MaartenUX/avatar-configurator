import { Link, Outlet } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

/**
 * Volledig scherm zonder sidebar: links de preview, rechts het paneel.
 * Dat de sidebar hier wegvalt is opzet — het maakt voelbaar dat je in een
 * losse stap zit en straks weer terugkomt op het overzicht.
 */
export function SpokeLayout() {
  return (
    <div className="min-h-svh bg-bg">
      <Outlet />
    </div>
  )
}

export interface SpokeFrameProps {
  /** Wat er linksboven staat, standaard "Overzicht". */
  backTo?: string
  backLabel?: string
  help?: ReactNode
  preview: ReactNode
  children: ReactNode
  /** Vergrendeld scherm: geen bewerkbare velden, wel zichtbaar. */
  locked?: boolean
}

export function SpokeFrame({
  backTo = '/',
  backLabel = 'Overzicht',
  help,
  preview,
  children,
  locked,
}: SpokeFrameProps) {
  return (
    <div className="flex min-h-svh flex-col">
      <div className="flex h-[72px] shrink-0 items-center justify-between bg-bg px-6">
        <Link
          to={backTo}
          className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-body text-gray-2 hover:text-blue-shade"
        >
          <ArrowLeft size={18} aria-hidden />
          {backLabel}
        </Link>
        {help}
      </div>

      {/* Twee helften tot de schermrand: links de preview op grijs, rechts
          het werk op wit. De padding zit binnen de kolommen, zodat de
          kleurscheiding niet onderbroken wordt. */}
      <div className="grid flex-1 grid-cols-1 lg:grid-cols-2">
        <div className="bg-bg px-8 pb-10 lg:sticky lg:top-6 lg:h-[calc(100svh-120px)]">
          <div className="flex h-full items-center justify-center">{preview}</div>
        </div>
        {/* In kijkstand zijn de velden dood, maar de balk onderin blijft
            bedienbaar — anders kun je niet meer terug. */}
        <div
          className={cn(
            'flex flex-col gap-6 bg-white px-8 py-8',
            locked &&
              '[&>*:not(:last-child)]:pointer-events-none [&>*:not(:last-child)]:opacity-60',
          )}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
