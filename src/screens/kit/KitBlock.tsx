import type { ReactNode } from 'react'

export function KitBlock({
  title,
  note,
  children,
}: {
  title: string
  note?: string
  children: ReactNode
}) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-baseline gap-3">
        <h2 className="text-h3 text-gray-1">{title}</h2>
        {note && <span className="text-body-sm text-gray-3">{note}</span>}
      </div>
      {/* items-start, anders rekken losse knoppen op tot volle breedte. */}
      <div className="flex flex-col items-start gap-3">{children}</div>
    </section>
  )
}

export function KitRow({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap items-center gap-3">{children}</div>
}
