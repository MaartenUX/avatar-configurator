import { useEffect, useState } from 'react'
import { Play } from 'lucide-react'
import { Avatar } from './Avatar'
import { avatarById } from '../../data/avatars'
import { backgroundImage, demoVideo } from '../../lib/assets'
import { langDir } from '../../data/langs'
import { parseTimecode, formatTimecode } from '../../lib/format'
import { useNow } from '../../state/TickProvider'
import type { Lang, SubtitleLine } from '../../state/types'
import { cn } from '../../lib/cn'

/** Elke video duurt maximaal twee minuten (CHANGES-03 A3). */
export const VIDEO_DUUR = 120

export interface VideoPreviewProps {
  avatarId?: string
  lang: Lang
  subtitles?: SubtitleLine[]
  /** Achtergrond-slugs per scène; er zijn er zes. */
  backgrounds?: (string | null)[]
  /** Camerawissel of logo tussen de scènes. */
  transition?: 'zoom' | 'logo'
  /** Huisstijlkleur, voor het logovlak in de overgang. */
  primary?: string
  durationSec?: number
  /** Springt naar dit moment; gebruikt door de ondertitel-editor. */
  seekTo?: number | null
  onTimeUpdate?: (sec: number) => void
  className?: string
}

const SCENES = 6

/**
 * Het videoframe. Staand (9:16), want zo ziet het echte product eruit: de
 * video wordt op een telefoon bekeken (CHANGES-03 A1).
 *
 * Speelt `public/media/demo/{lang}.mp4` als dat bestand er is; anders de
 * nagebootste weergave met de avatar op de achtergrond.
 */
export function VideoPreview({
  avatarId,
  lang,
  subtitles = [],
  backgrounds = [],
  transition = 'zoom',
  primary,
  durationSec = VIDEO_DUUR,
  seekTo,
  onTimeUpdate,
  className,
}: VideoPreviewProps) {
  const [startedAt, setStartedAt] = useState<number | null>(null)
  const [offset, setOffset] = useState(0)
  const now = useNow()
  const avatar = avatarById(avatarId)
  const dir = langDir(lang)
  // De demovideo bestaat pas als Sebastiaan hem aanlevert.
  const [filmFaalt, setFilmFaalt] = useState(false)
  const film = filmFaalt ? undefined : demoVideo(lang)

  const elapsed = startedAt ? Math.min(durationSec, offset + (now - startedAt) / 1000) : offset
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

  const current = subtitles.reduce<SubtitleLine | null>(
    (found, line) => (parseTimecode(line.t) <= elapsed ? line : found),
    null,
  )

  // Zes scènes verdeeld over de duur bepalen de achtergrond en de overgang.
  const scene = Math.min(SCENES - 1, Math.floor((elapsed / durationSec) * SCENES))
  const slug = backgrounds[scene] ?? (scene % 2 === 0 ? 'kantoor-1' : 'kantoor-3')
  const bg = backgroundImage(slug)

  // Camerawissel: de camera wisselt per scène tussen dichtbij en verder weg.
  const ingezoomd = playing && transition === 'zoom' && scene % 2 === 1
  // Logo: een korte flits tussen twee scènes.
  const sceneLengte = durationSec / SCENES
  const inOvergang = playing && transition === 'logo' && elapsed % sceneLengte < 0.6 && scene > 0

  return (
    <div
      className={cn(
        // Staand, en gemeten aan de breedte: in een kolom zonder eigen hoogte
        // zou een hoogte-gestuurd kader tot niets inklappen.
        'relative mx-auto aspect-[9/16] w-full max-w-[280px] overflow-hidden rounded-md bg-gray-1 shadow-card',
        className,
      )}
    >
      {film ? (
        <video
          src={film}
          className="size-full object-cover"
          playsInline
          controls={playing}
          muted={!playing}
          onError={() => setFilmFaalt(true)}
        />
      ) : (
        <>
          <div
            className={cn(
              'absolute inset-0 blur-[7px] transition-transform duration-[400ms] ease-[cubic-bezier(.22,1,.36,1)]',
              ingezoomd ? 'scale-[1.35]' : 'scale-105',
            )}
            style={
              bg
                ? { backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                : { background: 'linear-gradient(160deg, #CDEFEC 0%, #E6FAFF 60%, #FFD9C8 100%)' }
            }
          />

          {avatar && (
            <span
              className={cn(
                'absolute inset-x-0 bottom-16 flex justify-center transition-transform duration-[400ms] ease-[cubic-bezier(.22,1,.36,1)]',
                ingezoomd && 'scale-[1.35]',
              )}
            >
              <Avatar face={avatar.face} name={avatar.name} speaking={playing} className="h-72 w-56" />
            </span>
          )}

          {/* Logovlak tussen twee scènes. */}
          {inOvergang && (
            <span
              className="absolute inset-0 grid place-items-center"
              style={{ background: primary ?? '#1F5E58' }}
            >
              <span className="text-h2 font-semibold text-white">Bergrode</span>
            </span>
          )}
        </>
      )}

      {current && !film && (
        <span
          dir={dir}
          className="absolute inset-x-4 bottom-12 mx-auto w-fit max-w-full rounded-sm bg-gray-1/85 px-3 py-1.5 text-center text-body-sm text-white"
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
