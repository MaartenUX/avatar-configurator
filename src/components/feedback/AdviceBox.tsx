import type { ReactNode } from 'react'
import { Lightbulb } from 'lucide-react'

export interface AdviceBoxProps {
  /** Pill-label, bijv. "Meest gekozen". */
  label?: string
  children: ReactNode
}

/** Verschijnt onder een gemaakte keuze en legt uit waarom anderen die kiezen. */
export function AdviceBox({ label = 'Meest gekozen', children }: AdviceBoxProps) {
  return (
    <aside className="flex gap-3 rounded-md border border-green-tint bg-green-tint/60 p-4">
      <Lightbulb size={18} className="mt-0.5 shrink-0 text-green-shade" aria-hidden />
      <div className="flex flex-col gap-1">
        <span className="type-label text-green-shade">{label}</span>
        <p className="text-body text-gray-2">{children}</p>
      </div>
    </aside>
  )
}
