import { Lock } from 'lucide-react'
import { Button } from '../primitives/Button'
import { Avatar } from '../domain/Avatar'
import { avatarById } from '../../data/avatars'
import { useStore } from '../../state/store'
import { formatDateNl } from '../../lib/format'
import { cn } from '../../lib/cn'

export interface LockedBannerProps {
  signedAt?: string
  to?: string
  compact?: boolean
}

/** De configuratie ligt vast: inzien mag, wijzigen niet. */
export function LockedBanner({ signedAt, to = '/configuratie', compact }: LockedBannerProps) {
  const config = useStore((s) => s.config)

  return (
    <div className="flex items-center gap-3 rounded-md border border-gray-5 bg-white px-4 py-3">
      <span className="grid size-8 shrink-0 place-items-center rounded-sm bg-gray-6 text-gray-2">
        <Lock size={16} aria-hidden />
      </span>

      {/* De gekozen avatars: zo zie je meteen dat dit boven alle pagina's
          hangt en niet bij één pagina hoort (CHANGES-06 A3). */}
      {config.languages.length > 0 && (
        <span className="flex shrink-0 items-center">
          {config.languages.map((lang, i) => {
            const avatar = avatarById(config.avatars[lang])
            return (
              <Avatar
                key={lang}
                face={avatar?.face}
                name={avatar?.name}
                round
                size={28}
                /* Lichte vulling: de portretten zijn vrijstaand, dus zonder
                   achtergrond valt de cirkel weg op het witte vlak. */
                className={cn('bg-gray-6 ring-2 ring-white', i > 0 && '-ml-1.5')}
              />
            )
          })}
        </span>
      )}

      <p className="flex-1 text-body text-gray-2">
        Configuratie vastgelegd{signedAt ? ` op ${formatDateNl(signedAt)}` : ''}.
        {!compact && ' Je instellingen gelden voor alle video’s.'}
      </p>
      <Button variant="secondary" size="sm" to={to}>
        Bekijk configuratie
      </Button>
    </div>
  )
}
