import { Check } from 'lucide-react'
import { cn } from '../../lib/cn'

export interface StepperStep {
  id: string
  label: string
}

export interface StepperProps {
  steps: StepperStep[]
  /** 1-based index van de stap waar je nu bent. */
  current: number
  /** 1-based indexen van afgeronde stappen. */
  done?: number[]
  onStepClick?: (index: number) => void
  orientation?: 'vertical' | 'horizontal'
}

/** Gedaan ✓ / actief / komt nog. Afgeronde stappen zijn aanklikbaar. */
export function Stepper({
  steps,
  current,
  done = [],
  onStepClick,
  orientation = 'vertical',
}: StepperProps) {
  return (
    <ol className={cn('flex gap-1', orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap')}>
      {steps.map((step, i) => {
        const index = i + 1
        const isDone = done.includes(index)
        const isCurrent = index === current
        const clickable = Boolean(onStepClick) && (isDone || isCurrent)

        return (
          <li key={step.id}>
            <button
              type="button"
              disabled={!clickable}
              onClick={() => onStepClick?.(index)}
              aria-current={isCurrent ? 'step' : undefined}
              className={cn(
                'flex w-full items-center gap-2.5 rounded-sm px-2 py-1.5 text-left transition-colors',
                clickable ? 'hover:bg-blue-tint' : 'cursor-default',
              )}
            >
              <span
                className={cn(
                  'grid size-5 shrink-0 place-items-center rounded-pill text-[11px] font-semibold transition-colors',
                  isDone
                    ? 'bg-green-shade text-white'
                    : isCurrent
                      ? 'bg-blue text-white'
                      : 'bg-gray-5 text-gray-3',
                )}
              >
                {isDone ? <Check size={12} strokeWidth={3} aria-hidden /> : index}
              </span>
              <span
                className={cn(
                  'text-body-sm',
                  isCurrent ? 'text-gray-1' : isDone ? 'text-gray-2' : 'text-gray-3',
                )}
              >
                {step.label}
              </span>
            </button>
          </li>
        )
      })}
    </ol>
  )
}
