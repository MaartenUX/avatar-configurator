import { useState } from 'react'
import { Pencil } from 'lucide-react'
import { parseTimecode } from '../../lib/format'
import type { SubtitleLine } from '../../state/types'
import { cn } from '../../lib/cn'

export interface SubtitleEditorProps {
  lines: SubtitleLine[]
  onChange?: (lines: SubtitleLine[]) => void
  /** Huidige positie in de preview, om de actieve regel te markeren. */
  currentTime?: number
  onSeek?: (sec: number) => void
  dir?: 'ltr' | 'rtl'
  readOnly?: boolean
}

/** Klikken op een regel springt in de preview; tekst is inline te bewerken. */
export function SubtitleEditor({
  lines,
  onChange,
  currentTime = 0,
  onSeek,
  dir = 'ltr',
  readOnly,
}: SubtitleEditorProps) {
  const [editing, setEditing] = useState<number | null>(null)

  const activeIndex = lines.reduce(
    (found, line, i) => (parseTimecode(line.t) <= currentTime ? i : found),
    -1,
  )

  const update = (index: number, text: string) => {
    onChange?.(lines.map((l, i) => (i === index ? { ...l, text } : l)))
  }

  return (
    <ol className="flex flex-col divide-y divide-gray-6 overflow-hidden rounded-md bg-white shadow-card">
      {lines.map((line, i) => (
        <li
          key={`${line.t}-${i}`}
          className={cn(
            'flex items-start gap-3 px-3 py-2.5 transition-colors',
            i === activeIndex && 'bg-blue-tint',
          )}
        >
          <button
            type="button"
            onClick={() => onSeek?.(parseTimecode(line.t))}
            className="shrink-0 rounded-sm px-1 py-0.5 text-body-sm tabular-nums text-gray-3 hover:bg-gray-6 hover:text-blue-shade"
            aria-label={`Spring naar ${line.t}`}
          >
            {line.t}
          </button>

          {editing === i ? (
            <input
              value={line.text}
              dir={dir}
              autoFocus
              onChange={(e) => update(i, e.target.value)}
              onBlur={() => setEditing(null)}
              onKeyDown={(e) => e.key === 'Enter' && setEditing(null)}
              className={cn(
                'flex-1 rounded-sm border border-blue px-2 py-1 text-body text-gray-1 outline-none',
                dir === 'rtl' && 'text-right',
              )}
            />
          ) : (
            <span
              dir={dir}
              className={cn('flex-1 text-body text-gray-2', dir === 'rtl' && 'text-right')}
            >
              {line.text}
            </span>
          )}

          {!readOnly && editing !== i && (
            <button
              type="button"
              onClick={() => setEditing(i)}
              aria-label={`Regel ${i + 1} bewerken`}
              className="shrink-0 rounded-sm p-1 text-gray-3 hover:bg-gray-6 hover:text-blue-shade"
            >
              <Pencil size={14} aria-hidden />
            </button>
          )}
        </li>
      ))}
    </ol>
  )
}
