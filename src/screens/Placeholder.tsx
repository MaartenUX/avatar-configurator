import type { ReactNode } from 'react'

/**
 * Tijdelijke inhoud voor schermen die pas in een later checkpoint gebouwd
 * worden. Toont wel de titel en de route, zodat de structuur nu al klopt.
 */
export function Placeholder({
  title,
  note,
  children,
}: {
  title: string
  note?: string
  children?: ReactNode
}) {
  return (
    <section className="flex flex-col gap-3">
      <h1 className="text-h1 text-gray-1">{title}</h1>
      {note && <p className="text-body text-gray-3">{note}</p>}
      <div className="rounded-md border border-dashed border-gray-4 bg-white p-6 text-body-sm text-gray-3">
        {children ?? 'Dit scherm wordt in een volgend checkpoint gebouwd.'}
      </div>
    </section>
  )
}
