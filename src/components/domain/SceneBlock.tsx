import { useState } from 'react'
import { Check, Pencil } from 'lucide-react'
import { WordCounter } from './WordCounter'
import { Player } from './Player'
import { Button } from '../primitives/Button'
import { wordCount } from '../../lib/format'
import { cn } from '../../lib/cn'

export interface SceneBlockProps {
  index: number
  title: string
  text: string
  maxWords: number
  onChange?: (text: string) => void
  /** Toont een speler per scène, zoals in de script-stap. */
  audioId?: string
  audioSec?: number
  dir?: 'ltr' | 'rtl'
  readOnly?: boolean
}

/** Eén scène uit de samenvatting, inline te bewerken. */
export function SceneBlock({
  index,
  title,
  text,
  maxWords,
  onChange,
  audioId,
  audioSec = 28,
  dir = 'ltr',
  readOnly,
}: SceneBlockProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(text)
  const count = wordCount(editing ? draft : text)

  const save = () => {
    onChange?.(draft)
    setEditing(false)
  }

  return (
    <article className="flex flex-col gap-2.5 rounded-md bg-white p-4 shadow-card">
      <header className="flex items-center gap-2">
        <span className="type-label text-gray-3">Scène {index}</span>
        <h3 className="flex-1 text-body font-medium text-gray-1">{title}</h3>
        {!readOnly && !editing && (
          <button
            type="button"
            onClick={() => {
              setDraft(text)
              setEditing(true)
            }}
            aria-label={`Scène ${index} bewerken`}
            className="rounded-sm p-1.5 text-gray-3 transition-colors hover:bg-gray-6 hover:text-blue-shade"
          >
            <Pencil size={15} aria-hidden />
          </button>
        )}
      </header>

      {editing ? (
        <>
          <textarea
            value={draft}
            dir={dir}
            rows={4}
            autoFocus
            onChange={(e) => setDraft(e.target.value)}
            className={cn(
              'w-full resize-none rounded-sm border border-blue bg-white p-2.5 text-body text-gray-1 outline-none',
              dir === 'rtl' && 'text-right',
            )}
          />
          <div className="flex items-center gap-2">
            <WordCounter count={count} max={maxWords} />
            <span className="ml-auto flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>
                Annuleer
              </Button>
              <Button size="sm" iconLeft={Check} onClick={save}>
                Klaar
              </Button>
            </span>
          </div>
        </>
      ) : (
        <>
          <p dir={dir} className={cn('text-body text-gray-2', dir === 'rtl' && 'text-right')}>
            {text}
          </p>
          <div className="flex items-center gap-3">
            <WordCounter count={count} max={maxWords} />
          </div>
        </>
      )}

      {audioId && <Player id={audioId} durationSec={audioSec} compact />}
    </article>
  )
}
