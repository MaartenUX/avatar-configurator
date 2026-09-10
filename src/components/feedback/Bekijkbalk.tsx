import { ArrowLeft, Eye } from 'lucide-react'
import { Button } from '../primitives/Button'

/** Vervangt de ApproveBox zodra je een afgetekende stap terugkijkt. */
export function Bekijkbalk() {
  return (
    <section className="flex flex-wrap items-center gap-3 rounded-md border border-gray-5 bg-gray-6 p-4">
      <Eye size={17} className="shrink-0 text-gray-3" aria-hidden />
      <p className="flex-1 text-body text-gray-2">
        Je bekijkt een stap die al is goedgekeurd. Wijzigen kan niet meer.
      </p>
      <Button variant="secondary" size="sm" iconLeft={ArrowLeft} to="/">
        Terug naar het overzicht
      </Button>
    </section>
  )
}
