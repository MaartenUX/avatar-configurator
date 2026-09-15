import type { ReactNode } from 'react'

export interface HowBoxProps {
  title?: string
  points: string[]
  /** Rechtsonder in het kader, bijvoorbeeld de knop naar meer tips. */
  actie?: ReactNode
}

/** "Waar let je op?" — twee à drie concrete dingen, geen algemeenheden. */
export function HowBox({ title = 'Waar let je op?', points, actie }: HowBoxProps) {
  return (
    <section className="rounded-md border border-blue-tint bg-blue-tint/50 p-4">
      <h3 className="type-label mb-2 text-blue-shade">{title}</h3>
      <ul className="flex flex-col gap-1.5">
        {points.map((p) => (
          <li key={p} className="flex gap-2.5 text-body text-gray-2">
            <span className="mt-2 size-1.5 shrink-0 rounded-pill bg-blue" aria-hidden />
            {p}
          </li>
        ))}
      </ul>
      {actie && <div className="mt-3 flex justify-end">{actie}</div>}
    </section>
  )
}
