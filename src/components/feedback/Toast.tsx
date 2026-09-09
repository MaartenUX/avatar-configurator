import { useEffect } from 'react'
import { Check, Info, TriangleAlert, X } from 'lucide-react'
import { cn } from '../../lib/cn'
import { useNow } from '../../state/TickProvider'
import { useStore } from '../../state/store'

const TONES = {
  success: { icon: Check, chip: 'bg-green-tint text-green-shade' },
  info: { icon: Info, chip: 'bg-blue-tint text-blue-shade' },
  error: { icon: TriangleAlert, chip: 'bg-red-tint text-red-shade' },
} as const

const LIFETIME = 5000

/** Leest de klok af in plaats van een eigen timer te houden, net als de rest. */
export function ToastHost() {
  const toast = useStore((s) => s.toast)
  const dismiss = useStore((s) => s.dismissToast)
  const now = useNow()

  const expired = toast ? now - toast.startedAt > LIFETIME : false

  useEffect(() => {
    if (expired) dismiss()
  }, [expired, dismiss])

  if (!toast || expired) return null
  const { icon: Icon, chip } = TONES[toast.tone]

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 animate-[toast-in_.25s_var(--ease-soft)]"
    >
      <div className="flex items-center gap-3 rounded-md bg-white px-4 py-3 shadow-pop">
        <span className={cn('grid size-7 shrink-0 place-items-center rounded-pill', chip)}>
          <Icon size={16} strokeWidth={2.5} aria-hidden />
        </span>
        <span className="text-body text-gray-1">{toast.text}</span>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Melding sluiten"
          className="ml-2 rounded-sm p-1 text-gray-3 hover:bg-gray-6 hover:text-gray-1"
        >
          <X size={16} aria-hidden />
        </button>
      </div>
    </div>
  )
}
