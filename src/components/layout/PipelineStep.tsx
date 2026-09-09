import type { LucideIcon } from 'lucide-react'
import { Check } from 'lucide-react'
import { STATUS, type StatusKey } from '../../tokens/status'
import { cn } from '../../lib/cn'

export interface PipelineStepProps {
  index: number
  label: string
  /** Wie doet het en hoe lang duurt het, bijv. "3 min · jij". */
  meta?: string
  status: StatusKey
  icon?: LucideIcon
  isLast?: boolean
}

/** Verticale stap met icoon-tegel, gebruikt in "Dit gaat er gebeuren". */
export function PipelineStep({
  index,
  label,
  meta,
  status,
  icon: Icon,
  isLast,
}: PipelineStepProps) {
  const style = STATUS[status]
  const complete = status === 'approved' || status === 'live'

  return (
    <li className="flex gap-3">
      <div className="flex flex-col items-center">
        <span
          className={cn(
            'grid size-9 shrink-0 place-items-center rounded-sm',
            complete ? 'bg-green-tint text-green-shade' : style.chip,
          )}
        >
          {complete ? (
            <Check size={16} strokeWidth={3} aria-hidden />
          ) : Icon ? (
            <Icon size={16} aria-hidden />
          ) : (
            <span className="text-body-sm font-semibold">{index}</span>
          )}
        </span>
        {!isLast && <span className="mt-1 w-px flex-1 bg-gray-5" aria-hidden />}
      </div>

      <div className={cn('flex flex-col', isLast ? 'pb-0' : 'pb-5')}>
        <span className="text-body text-gray-1">{label}</span>
        {meta && <span className="text-body-sm text-gray-3">{meta}</span>}
      </div>
    </li>
  )
}
