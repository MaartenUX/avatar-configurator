import { useSearchParams } from 'react-router-dom'

/**
 * Kijkstand: een afgetekende stap terugkijken zonder hem opnieuw te kunnen
 * goedkeuren. Aangezet met ?bekijk=1 vanaf een goedgekeurde regel op de
 * paginakaart.
 */
export function useBekijkstand() {
  const [params] = useSearchParams()
  return params.get('bekijk') === '1'
}
