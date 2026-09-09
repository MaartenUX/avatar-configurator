import { Lock } from 'lucide-react'
import { Button } from '../primitives/Button'
import { formatDateNl } from '../../lib/format'

export interface LockedBannerProps {
  signedAt?: string
  to?: string
  compact?: boolean
}

/** De configuratie ligt vast: inzien mag, wijzigen niet. */
export function LockedBanner({ signedAt, to = '/configuratie', compact }: LockedBannerProps) {
  return (
    <div className="flex items-center gap-3 rounded-md border border-gray-5 bg-white px-4 py-3">
      <span className="grid size-8 shrink-0 place-items-center rounded-sm bg-gray-6 text-gray-2">
        <Lock size={16} aria-hidden />
      </span>
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
