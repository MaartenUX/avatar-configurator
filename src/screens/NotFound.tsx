import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="flex flex-col items-start gap-4">
      <h1 className="text-h1 text-gray-1">Deze pagina bestaat niet</h1>
      <p className="text-body text-gray-2">
        Misschien is de link verouderd. Ga terug naar het overzicht om verder te werken.
      </p>
      <Link to="/" className="rounded-sm bg-blue px-4 py-2.5 text-button text-white hover:bg-blue-shade">
        Naar het overzicht
      </Link>
    </section>
  )
}
