import { cn } from '../../lib/cn'

export interface WordCounterProps {
  count: number
  max: number
}

/** Telt terug en kleurt mee: oranje vanaf 90%, rood vanaf 100%. */
export function WordCounter({ count, max }: WordCounterProps) {
  const ratio = max > 0 ? count / max : 0
  return (
    <span
      className={cn(
        'text-body-sm tabular-nums',
        ratio >= 1 ? 'text-red-shade' : ratio >= 0.9 ? 'text-orange-shade' : 'text-gray-3',
      )}
    >
      {count}/{max} woorden
    </span>
  )
}
