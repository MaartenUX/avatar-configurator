import { useEffect, useState } from 'react'
import { Check, Volume2 } from 'lucide-react'
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
  onSelect: () => void
}

const SPEAK_MS = 3000

/**
 * Aanklikken doet twee dingen tegelijk: de avatar kiezen én hem laten spreken.
 * Tijdens die drie seconden pulseert het portret en verschijnt de voorbeeldzin
 * als ondertitel in de taal zelf, zodat je hoort en ziet wat de inwoner krijgt.
 */
export function AvatarTile({ avatar, selected, advised, onSelect }: AvatarTileProps) {
  const [speaking, setSpeaking] = useState(false)
  const bars = waveformBars(avatar.id, 24)
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
        'relative flex w-full flex-col items-center gap-3 rounded-md border-2 p-5 transition-all',
        selected
          ? 'border-blue bg-blue-tint'
          : 'border-gray-5 bg-white hover:border-gray-4 hover:shadow-card',
      )}
    >
      {advised && (
        <span className="type-label absolute right-3 top-3 rounded-pill bg-green-tint px-2 py-0.5 text-green-shade">
          Meest gekozen
        </span>
      )}

      <Avatar id={avatar.id} name={avatar.name} size={88} speaking={speaking} />

      <span className="flex items-center gap-2">
        <span className={cn('text-h3', selected ? 'text-blue-shade' : 'text-gray-1')}>
          {avatar.name}
        </span>
        {selected && (
          <span className="grid size-5 place-items-center rounded-pill bg-blue text-white">
            <Check size={13} strokeWidth={3} aria-hidden />
          </span>
        )}
      </span>

      <span className="text-center text-body-sm text-gray-3">
        {avatar.keywords.join(' · ')}
      </span>

      {speaking ? (
        <span className="flex h-5 items-center gap-[2px]" aria-hidden>
          {bars.map((h, i) => (
            <span
              key={i}
              className="w-1 rounded-pill bg-blue"
              style={{ height: `${Math.round(h * 100)}%` }}
            />
          ))}
        </span>
      ) : (
        <span className="flex h-5 items-center gap-1.5 text-body-sm text-blue-shade">
          <Volume2 size={15} aria-hidden />
          Beluister
        </span>
      )}

      {/* Ondertitel bij het spreken: wat de inwoner straks te horen krijgt. */}
      <span
        dir={dir}
        className={cn(
          'min-h-10 rounded-sm px-2 py-1 text-center text-body-sm transition-opacity duration-300',
          dir === 'rtl' && 'font-[var(--font-arabic)]',
          speaking ? 'bg-gray-1/85 text-white opacity-100' : 'opacity-0',
        )}
      >
        {avatar.sampleSentence}
      </span>
    </button>
  )
}
