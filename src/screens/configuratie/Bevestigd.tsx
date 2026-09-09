import { Check, Plus } from 'lucide-react'
import { Button, Card } from '../../components'
import { useStore } from '../../state/store'
import { avatarById } from '../../data/avatars'
import { langLabel } from '../../data/langs'

export default function Bevestigd() {
  const config = useStore((s) => s.config)

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <Card className="flex flex-col gap-4">
        <span className="grid size-12 place-items-center rounded-pill bg-green-tint text-green-shade">
          <Check size={24} strokeWidth={3} aria-hidden />
        </span>
        <h1 className="text-h1 text-gray-1">Je bent klaar</h1>
        <p className="text-body text-gray-2">
          Je configuratie ligt vast. Je collega’s hebben bericht gekregen en kunnen straks hun taal
          controleren. Voeg nu je eerste pagina toe.
        </p>

        <dl className="flex flex-col divide-y divide-gray-6 rounded-sm bg-gray-6/60 px-4">
          <Regel label="Talen" waarde={config.languages.map(langLabel).join(', ')} />
          <Regel
            label="Avatars"
            waarde={config.languages
              .map((l) => avatarById(config.avatars[l])?.name ?? '—')
              .join(' · ')}
          />
          <Regel
            label="Type video"
            waarde={config.videoType === 'vast' ? 'Vaste samenvatting, max 3 min' : 'Adaptief, max 6 min'}
          />
        </dl>

        <span className="flex flex-wrap gap-2">
          <Button to="/paginas/nieuw" iconLeft={Plus}>Voeg je eerste pagina toe</Button>
          <Button variant="secondary" to="/">Naar het overzicht</Button>
        </span>
      </Card>
    </div>
  )
}

function Regel({ label, waarde }: { label: string; waarde: string }) {
  return (
    <div className="flex items-baseline gap-4 py-2.5">
      <dt className="w-32 shrink-0 text-body-sm text-gray-3">{label}</dt>
      <dd className="text-body text-gray-1">{waarde}</dd>
    </div>
  )
}
