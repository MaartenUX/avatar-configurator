import { useEffect, useState } from 'react'
import { Play } from 'lucide-react'
import { Avatar } from './Avatar'
import { avatarById } from '../../data/avatars'
import { backgroundImage } from '../../lib/assets'
import { langDir } from '../../data/langs'
import { parseTimecode, formatTimecode } from '../../lib/format'
import { useNow } from '../../state/TickProvider'
import type { Lang, SubtitleLine } from '../../state/types'
import { cn } from '../../lib/cn'

export interface VideoPreviewProps {
  avatarId?: string
  lang: Lang
  subtitles?: SubtitleLine[]
  /** Achtergrond-slugs per scène. */
  backgrounds?: (string | null)[]
  logo?: string
  durationSec?: number
  /** Springt naar dit moment; gebruikt door de ondertitel-editor. */
  seekTo?: number | null
  onTimeUpdate?: (sec: number) => void
  className?: string
}

/**
 * Stilstaand frame met play-overlay. Bij afspelen loopt de playhead tegen de
 * gedeelde klok en wisselen de ondertitels mee, zodat de mock hetzelfde
 * aanvoelt als een echte speler zonder dat er video is.
 */
export function VideoPreview({
  avatarId,
  lang,
  subtitles = [],
  backgrounds = [],
  logo,
  durationSec = 110,
  seekTo,
  onTimeUpdate,
  className,
}: VideoPreviewProps) {
  const [startedAt, setStartedAt] = useState<number | null>(null)
  const [offset, setOffset] = useState(0)
  const now = useNow()
  const avatar = avatarById(avatarId)
  const dir = langDir(lang)

  const elapsed = startedAt
    ? Math.min(durationSec, offset + (now - startedAt) / 1000)
    : offset
  const playing = startedAt !== null && elapsed < durationSec

  useEffect(() => {
    if (seekTo == null) return
    setOffset(seekTo)
    setStartedAt(null)
  }, [seekTo])

  useEffect(() => {
    onTimeUpdate?.(elapsed)
  }, [elapsed, onTimeUpdate])

  useEffect(() => {
    if (startedAt !== null && elapsed >= durationSec) {
      setStartedAt(null)
      setOffset(0)
    }
  }, [startedAt, elapsed, durationSec])

  // Welke ondertitelregel hoort bij dit moment?
  const current = subtitles.reduce<SubtitleLine | null>(
    (found, line) => (parseTimecode(line.t) <= elapsed ? line : found),
    null,
  )

  // Vier scènes verdeeld over de duur bepalen de achtergrond.
  const shot = Math.min(3, Math.floor((elapsed / durationSec) * 4))
  const slug = backgrounds[shot] ?? `kantoor-${shot + 1}`
  const bg = backgroundImage(slug)

  return (
    <div
      className={cn(
        'relative aspect-video w-full overflow-hidden rounded-md bg-gray-1 shadow-card',
        className,
      )}
    >
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={
          bg
            ? { backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }
            : { background: 'linear-gradient(135deg, #CDEFEC 0%, #E6FAFF 60%, #FFD9C8 100%)' }
        }
      />

      {avatar && (
        <span className="absolute bottom-14 left-1/2 -translate-x-1/2">
          <Avatar id={avatar.id} name={avatar.name} size={132} speaking={playing} />
        </span>
      )}

      {logo && (
        <span className="absolute right-3 top-3 rounded-sm bg-white/90 px-2 py-1 text-body-sm font-semibold text-gray-1">
          Bergrode
        </span>
      )}

      {current && (
        <span
          dir={dir}
          className="absolute inset-x-6 bottom-10 mx-auto w-fit max-w-full rounded-sm bg-gray-1/85 px-3 py-1.5 text-center text-body-sm text-white"
        >
          {current.text}
        </span>
      )}

      {!playing && (
        <button
          type="button"
          onClick={() => setStartedAt(Date.now())}
          aria-label="Speel video af"
          className="absolute inset-0 grid place-items-center bg-gray-1/20 transition-colors hover:bg-gray-1/30"
        >
          <span className="grid size-16 place-items-center rounded-pill bg-white/95 text-blue-shade shadow-pop">
            <Play size={26} aria-hidden />
          </span>
        </button>
      )}

      <div className="absolute inset-x-3 bottom-3 flex items-center gap-2">
        <div className="h-1 flex-1 overflow-hidden rounded-pill bg-white/30">
          <div
            className="h-full rounded-pill bg-white"
            style={{ width: `${(elapsed / durationSec) * 100}%` }}
          />
        </div>
        <span className="text-[11px] tabular-nums text-white/90">
          {formatTimecode(elapsed)} / {formatTimecode(durationSec)}
        </span>
      </div>
    </div>
  )
}
