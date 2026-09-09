import { avatarImage } from '../../lib/assets'
import { cn } from '../../lib/cn'

export interface AvatarProps {
  id: string
  name: string
  size?: number
  /** Laat het portret "spreken": lichte puls tijdens het afspelen. */
  speaking?: boolean
  className?: string
}

// Deterministisch een van de zeven merkfamilies, zodat een avatar altijd
// dezelfde kleur houdt.
const PALETTE = [
  ['#E6FAFF', '#156D84'],
  ['#FFD9C8', '#892900'],
  ['#CDEFEC', '#1F5E58'],
  ['#D5DBFF', '#001895'],
  ['#FFC4E7', '#84004F'],
  ['#E6FEE1', '#1F9B06'],
  ['#FFB8B8', '#780000'],
] as const

const hash = (s: string) => {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

/**
 * Portret van een avatar. Staat het bestand in src/assets/avatars/, dan wordt
 * dat gebruikt; anders een getekend silhouet met de initiaal. Bewust een
 * ontworpen terugval en geen grijs vlak, want dit is waar de gebruiker zijn
 * keuze op baseert.
 */
export function Avatar({ id, name, size = 96, speaking, className }: AvatarProps) {
  const src = avatarImage(id)
  const [bg, fg] = PALETTE[hash(id) % PALETTE.length]

  return (
    <span
      className={cn(
        'relative block shrink-0 overflow-hidden rounded-pill transition-transform duration-500',
        speaking && 'scale-105',
        className,
      )}
      style={{ width: size, height: size }}
    >
      {src ? (
        <img src={src} alt={name} width={size} height={size} className="size-full object-cover" />
      ) : (
        <svg viewBox="0 0 96 96" width={size} height={size} role="img" aria-label={name}>
          <rect width="96" height="96" fill={bg} />
          {/* Hoofd en schouders, zodat de terugval als portret leest. */}
          <circle cx="48" cy="38" r="17" fill={fg} opacity="0.22" />
          <path d="M18 96c0-17 13.4-28 30-28s30 11 30 28z" fill={fg} opacity="0.22" />
          <text
            x="48"
            y="54"
            textAnchor="middle"
            fill={fg}
            fontSize="30"
            fontWeight="600"
            fontFamily="Inter, sans-serif"
          >
            {name.slice(0, 1)}
          </text>
        </svg>
      )}
    </span>
  )
}
