import { useEffect, useState } from 'react'
import { Volume2 } from 'lucide-react'
import { Avatar } from './Avatar'
import { voiceClip } from '../../lib/assets'
import { waveformBars } from '../../mock/waveform'
import { langDir } from '../../data/langs'
import type { AvatarDef } from '../../data/types'
import { cn } from '../../lib/cn'

export interface AvatarTileProps {
  avatar: AvatarDef
  selected: boolean
  advised?: boolean
  /** Half formaat: zo passen twee talen naast elkaar in beeld. */
  compact?: boolean
  onSelect: () => void
}

const SPEAK_MS = 3000

/**
 * Portret in een licht kader, daaronder de naam en de steekwoorden. Gekozen is
 * een blauwe rand, geen gevuld vlak: het portret moet de aandacht houden.
 *
 * Aanklikken kiest én laat de avatar spreken. Tijdens die drie seconden
 * verschijnt de voorbeeldzin als ondertitel óver het portret, zoals in de
 * echte video, in plaats van eronder ruimte te reserveren.
 */
export function AvatarTile({ avatar, selected, advised, compact, onSelect }: AvatarTileProps) {
  const [speaking, setSpeaking] = useState(false)
  const bars = waveformBars(avatar.id, 20)
  const dir = langDir(avatar.lang)

  useEffect(() => {
    if (!speaking) return
    const t = window.setTimeout(() => setSpeaking(false), SPEAK_MS)
    return () => window.clearTimeout(t)
  }, [speaking])

  const handle = () => {
    onSelect()
    setSpeaking(true)
    const src = voiceClip(avatar.id)
    if (src) void new Audio(src).play().catch(() => {})
  }

  return (
    <button
      type="button"
      onClick={handle}
      aria-pressed={selected}
      className={cn(
        'group relative flex w-full flex-col rounded-md border-2 bg-white text-center transition-all',
        compact ? 'gap-2 p-2' : 'gap-3 p-3',
        selected
          ? 'border-blue shadow-card'
          : 'border-transparent shadow-card hover:border-gray-4',
      )}
    >
      <span className="relative block aspect-[9/8] overflow-hidden rounded-sm bg-gray-6">
        {advised && (
          <span
            className={cn(
              'type-label absolute left-2 top-2 z-10 whitespace-nowrap rounded-pill bg-green-tint text-green-shade',
              compact ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1',
            )}
          >
            Meest gekozen
          </span>
        )}
        {/* Iets minder dan vol: houdt kopruimte vrij voor het advieslabel. */}
        <Avatar
          face={avatar.face}
          name={avatar.name}
          speaking={speaking}
          className="absolute inset-x-0 bottom-0 h-[88%]"
        />

        {/* Beluister-affordance; verdwijnt zodra hij spreekt. */}
        <span
          className={cn(
            'absolute bottom-2 right-2 grid place-items-center rounded-pill bg-white/90 text-blue-shade shadow-card transition-opacity',
            compact ? 'size-6' : 'size-8',
            speaking ? 'opacity-0' : 'opacity-100',
          )}
        >
          <Volume2 size={compact ? 12 : 15} aria-hidden />
        </span>

        {speaking && (
          <>
            <span className="absolute bottom-2 right-2 flex h-5 items-end gap-[2px]" aria-hidden>
              {bars.slice(0, 8).map((h, i) => (
                <span
                  key={i}
                  className="w-1 rounded-pill bg-blue"
                  style={{ height: `${Math.round(h * 100)}%` }}
                />
              ))}
            </span>
            <span
              dir={dir}
              className="absolute inset-x-2 bottom-2 rounded-sm bg-gray-1/85 px-2 py-1 text-[11px] leading-snug text-white"
            >
              {avatar.sampleSentence}
            </span>
          </>
        )}
      </span>

      <span className="flex flex-col gap-0.5">
        <span className={cn(compact ? 'text-body font-medium' : 'text-h3', 'text-gray-1')}>
          {avatar.name}
        </span>
        <span className={cn('text-gray-3', compact ? 'text-[12px] leading-snug' : 'text-body-sm')}>
          {avatar.keywords.join(' • ')}
        </span>
      </span>
    </button>
  )
}
