import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button, EmptyState, PageCard, Tabs } from '../../components'
import { useStore } from '../../state/store'

export default function PaginaLijst() {
  const pages = useStore((s) => s.pages)
  const user = useStore((s) => s.user)
  const credits = useStore((s) => s.credits)
  const [tab, setTab] = useState('productie')

  const inProductie = pages.filter((p) => p.status !== 'live')
  const live = pages.filter((p) => p.status === 'live')
  const lijst = tab === 'productie' ? inProductie : live
  const geenCredits = credits.used >= credits.total

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-start gap-4">
        <div className="flex flex-1 flex-col gap-1">
          <h1 className="text-h1 text-gray-1">Pagina’s</h1>
          <p className="text-body text-gray-2">Alles wat je hebt toegevoegd, op één plek.</p>
        </div>
        {user === 'esmee' && (
          <Button iconLeft={Plus} to={geenCredits ? undefined : '/paginas/nieuw'} disabled={geenCredits}>
            Pagina toevoegen
          </Button>
        )}
      </header>

      <Tabs
        items={[
          { id: 'productie', label: 'In productie', count: inProductie.length },
          { id: 'live', label: 'Live', count: live.length },
        ]}
        value={tab}
        onChange={setTab}
      />

      {lijst.length === 0 ? (
        <EmptyState
          title={tab === 'productie' ? 'Niets in productie' : 'Nog niets live'}
          body={
            tab === 'productie'
              ? 'Alles is af. Voeg een pagina toe om een nieuwe video te maken.'
              : 'Zodra je een pagina publiceert verschijnt hij hier, met de weergaven per taal.'
          }
        />
      ) : (
        <div className="flex flex-col gap-4">
          {lijst.map((p) => (
            <PageCard key={p.id} page={p} user={user} />
          ))}
        </div>
      )}
    </div>
  )
}
