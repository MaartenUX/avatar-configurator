import { faceImage, silhouetImage } from '../../lib/assets'
import { cn } from '../../lib/cn'

export interface AvatarProps {
  /** Gezicht-slug uit AvatarDef.face. Leeg = silhouet. */
  face?: string
  name?: string
  /** Vierkant kader van deze grootte; weglaten om de ouder te vullen. */
  size?: number
  /** Rond uitsnijden, voor kleine rijtjes. Standaard rechthoekig. */
  round?: boolean
  /** Laat het portret "spreken": lichte puls. */
  speaking?: boolean
  className?: string
}

/**
 * Portret van een avatar: een uitgeknipte figuur met transparante achtergrond,
 * niet een pasfoto in een cirkel. De bestanden zijn strak om de figuur
 * getrimd (zie scripts/trim-avatars.mjs), dus object-contain toont hem altijd
 * heel, op de onderrand, ongeacht de vorm van het kader.
 *
 * Zonder gekozen avatar valt hij terug op het grijze silhouet — dat is de lege
 * staat uit het ontwerp, niet een gebrek.
 */
export function Avatar({ face, name, size, round, speaking, className }: AvatarProps) {
  const src = faceImage(face) ?? silhouetImage()

  return (
    <span
      className={cn(
        'relative block shrink-0 overflow-hidden transition-transform duration-500',
        round && 'rounded-pill',
        speaking && 'scale-[1.03]',
        className,
      )}
      style={size ? { width: size, height: size } : undefined}
    >
      {src ? (
        <img
          src={src}
          alt={name ?? ''}
          className="size-full object-contain object-bottom"
          draggable={false}
        />
      ) : (
        // Laatste terugval als zelfs het silhouet ontbreekt.
        <svg viewBox="0 0 96 96" className="size-full" role="img" aria-label={name ?? 'Avatar'}>
          <rect width="96" height="96" fill="#F2F2F2" />
          <circle cx="48" cy="36" r="16" fill="#DEDEDE" />
          <path d="M18 96c0-17 13.4-28 30-28s30 11 30 28z" fill="#DEDEDE" />
        </svg>
      )}
    </span>
  )
}
