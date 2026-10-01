import { useState } from 'react'
import { Check, Pencil } from 'lucide-react'
import { WordCounter } from './WordCounter'
import { Player } from './Player'
import { Button } from '../primitives/Button'
import { wordCount } from '../../lib/format'
import { sceneLabel, sceneMaxWoorden } from '../../data/copy'
import { cn } from '../../lib/cn'

export interface SceneBlockProps {
  /** Nulgebaseerde positie binnen de video. */
  index: number
  totaal: number
  text: string
  onChange?: (text: string) => void
  /** Toont een speler per scène, zoals in de script-stap. */
  audioId?: string
  audioSec?: number
  dir?: 'ltr' | 'rtl'
  readOnly?: boolean
}

/**
 * Eén scène uit de samenvatting, inline te bewerken. Geen titel: die bestaat
 * niet in het product, dus ook niet in de editor (CHANGES-03 F26). Boven het
 * blok staat alleen waar je bent: intro, scène 2 tot en met 5, of outro.
 */
export function SceneBlock({
  index,
  totaal,
  text,
  onChange,
  audioId,
  audioSec = 18,
  dir = 'ltr',
  readOnly,
}: SceneBlockProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(text)
  const count = wordCount(editing ? draft : text)

  const label = sceneLabel(index, totaal)
  const maxWoorden = sceneMaxWoorden(index, totaal)
  const rand = index === 0 || index === totaal - 1

  const save = () => {
    onChange?.(draft)
    setEditing(false)
  }

  return (
    <article className="flex flex-col gap-2.5 rounded-md bg-white p-4 shadow-card">
      <header className="flex items-center gap-2">
        <span
          className={cn(
            'type-label rounded-pill px-2 py-0.5',
            rand ? 'bg-violet-tint text-violet-shade' : 'bg-gray-6 text-gray-3',
          )}
        >
          {label}
        </span>
        <span className="flex-1" />
        {!readOnly && !editing && (
          <button
            type="button"
            onClick={() => {
              setDraft(text)
              setEditing(true)
            }}
            aria-label={`${label} bewerken`}
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
            <WordCounter count={count} max={maxWoorden} />
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
          <WordCounter count={count} max={maxWoorden} />
        </>
      )}

      {audioId && <Player id={audioId} durationSec={audioSec} compact />}
    </article>
  )
}
