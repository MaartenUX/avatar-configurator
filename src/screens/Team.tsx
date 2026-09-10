import { Mail, Plus, ShieldCheck } from 'lucide-react'
import { Button, Card, ShellContainer } from '../components'
import { useStore } from '../state/store'
import { langLabel } from '../data/langs'

/** Max vijf accounts onder één hoofdaccount; geen rollen per taal. */
const MAX_ACCOUNTS = 5

export default function Team() {
  const team = useStore((s) => s.team)

  return (
    <ShellContainer>
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-h1 text-gray-1">Team</h1>
        <p className="text-body text-gray-2">
          Je collega’s controleren de tekst in hun eigen taal. Iedereen ziet hetzelfde overzicht;
          er zijn geen aparte rechten per taal.
        </p>
      </header>

      <Card className="flex flex-col divide-y divide-gray-6 p-0">
        {team.map((lid) => (
          <div key={lid.email} className="flex flex-wrap items-center gap-4 px-5 py-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-pill bg-violet-tint text-body font-semibold text-violet-shade">
              {lid.name.slice(0, 1)}
            </span>
            <span className="flex min-w-40 flex-1 flex-col">
              <span className="text-body text-gray-1">{lid.name}</span>
              <span className="text-body-sm text-gray-3">{lid.email}</span>
            </span>
            {lid.role === 'owner' ? (
              <span className="type-label inline-flex items-center gap-1.5 rounded-pill bg-blue-tint px-2.5 py-1 text-blue-shade">
                <ShieldCheck size={13} aria-hidden />
                Beheerder
              </span>
            ) : (
              <span className="text-body-sm text-gray-3">
                Controleert {lid.langs?.map(langLabel).join(' en ') ?? '—'}
              </span>
            )}
          </div>
        ))}
      </Card>

      <Card className="flex flex-wrap items-center gap-4">
        <span className="flex-1 text-body text-gray-2">
          Je gebruikt {team.length} van de {MAX_ACCOUNTS} accounts. Een collega toevoegen kan
          zolang er plek is.
        </span>
        <Button variant="secondary" iconLeft={Plus} disabled={team.length >= MAX_ACCOUNTS}>
          Collega toevoegen
        </Button>
      </Card>

      <Card className="flex flex-col gap-2">
        <h2 className="text-h3 text-gray-1">Hoe je collega’s bericht krijgen</h2>
        <p className="text-body text-gray-2">
          Zodra jij het Nederlandse script goedkeurt, krijgt iedereen één bericht. Daarin staat om
          welke pagina het gaat en welke taal van hen wordt verwacht.
        </p>
        <span className="flex w-fit items-center gap-2 rounded-sm bg-gray-6 px-3 py-2 text-body-sm text-gray-2">
          <Mail size={15} aria-hidden />
          Er gaat één bericht per pagina, niet per taal.
        </span>
      </Card>
    </div>
    </ShellContainer>
  )
}
