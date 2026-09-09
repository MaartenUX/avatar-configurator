import { Button } from '../primitives/Button'

export interface ApproveBoxProps {
  title?: string
  /** Wat er ná het akkoord gebeurt. Altijd invullen. */
  consequence: string
  approveLabel?: string
  onApprove: () => void
  saveLabel?: string
  onSave?: () => void
  disabled?: boolean
}

/** Elke controlestap eindigt hier: één expliciete keuze, met de gevolgen erbij. */
export function ApproveBox({
  title = 'Akkoord?',
  consequence,
  approveLabel = 'Akkoord',
  onApprove,
  saveLabel = 'Sla op',
  onSave,
  disabled,
}: ApproveBoxProps) {
  return (
    <section className="flex flex-col gap-3 rounded-md border-2 border-blue bg-white p-5 shadow-card">
      <h3 className="text-h3 text-gray-1">{title}</h3>
      <p className="text-body text-gray-2">{consequence}</p>
      <div className="flex flex-wrap gap-2">
        <Button onClick={onApprove} disabled={disabled}>
          {approveLabel}
        </Button>
        {onSave && (
          <Button variant="secondary" onClick={onSave}>
            {saveLabel}
          </Button>
        )}
      </div>
    </section>
  )
}
