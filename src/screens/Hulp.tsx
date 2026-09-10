import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ChevronDown, Mail, MessageCircle, Phone } from 'lucide-react'
import { Button, Card, ShellContainer, Tabs } from '../components'
import { LEARN_MORE } from '../data/learnmore'
import { FAQ_KORT } from '../data/copy'
import { cn } from '../lib/cn'

export default function Hulp() {
  // Zo werkt /hulp?tab=feedback vanuit de voettekst.
  const [params, setParams] = useSearchParams()
  const [tab, setTabState] = useState(params.get('tab') ?? 'vragen')
  const setTab = (id: string) => {
    setTabState(id)
    setParams(id === 'vragen' ? {} : { tab: id }, { replace: true })
  }

  return (
    <ShellContainer>
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-h1 text-gray-1">Hulp</h1>
        <p className="text-body text-gray-2">
          Dezelfde vragen staan ook bij elke stap zelf, onder “Meer weten”.
        </p>
      </header>

      <Tabs
        items={[
          { id: 'vragen', label: 'Veelgestelde vragen' },
          { id: 'feedback', label: 'Feedback' },
          { id: 'contact', label: 'Contact' },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === 'vragen' && (
        <div className="flex flex-col gap-6">
          <section className="flex flex-col gap-2">
            <h2 className="text-h3 text-gray-1">Kort en goed</h2>
            <Card className="flex flex-col divide-y divide-gray-6 p-0 px-5">
              {FAQ_KORT.map((f) => <Vraag key={f.q} {...f} />)}
            </Card>
          </section>

          {LEARN_MORE.map((sectie) => (
            <section key={sectie.id} className="flex flex-col gap-2">
              <h2 className="text-h3 text-gray-1">{sectie.title}</h2>
              <Card className="flex flex-col divide-y divide-gray-6 p-0 px-5">
                {sectie.faq.map((f) => <Vraag key={f.q} {...f} />)}
              </Card>
            </section>
          ))}
        </div>
      )}

      {tab === 'feedback' && (
        <Card id="feedback" className="flex max-w-2xl flex-col gap-3">
          <h2 className="text-h3 text-gray-1">Wat viel je op?</h2>
          <p className="text-body text-gray-2">
            Loopt er iets niet lekker, of mis je iets? Laat het hier achter. XS2Content leest mee.
          </p>
          <textarea
            rows={5}
            placeholder="Bijvoorbeeld: ik snapte niet wat er na akkoord zou gebeuren."
            className="w-full resize-none rounded-sm border border-gray-4 p-3 text-body outline-none focus:border-blue"
          />
          <Button className="w-fit" iconLeft={MessageCircle}>Versturen</Button>
        </Card>
      )}

      {tab === 'contact' && (
        <Card className="flex max-w-2xl flex-col gap-3">
          <h2 className="text-h3 text-gray-1">XS2Content</h2>
          <p className="text-body text-gray-2">
            Voor extra talen, extra uitlegvideo’s of een configuratie die opnieuw moet.
          </p>
          <span className="flex flex-col gap-2 text-body text-gray-2">
            <span className="flex items-center gap-2">
              <Mail size={16} className="text-gray-3" aria-hidden />
              support@xs2content.nl
            </span>
            <span className="flex items-center gap-2">
              <Phone size={16} className="text-gray-3" aria-hidden />
              020 123 45 67, op werkdagen tussen 9 en 17 uur
            </span>
          </span>
        </Card>
      )}
    </div>
    </ShellContainer>
  )
}

function Vraag({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 py-4 text-left"
      >
        <span className="flex-1 text-body text-gray-1">{q}</span>
        <ChevronDown
          size={17} aria-hidden
          className={cn('shrink-0 text-gray-3 transition-transform', open && 'rotate-180')}
        />
      </button>
      {open && <p className="pb-4 text-body text-gray-2">{a}</p>}
    </div>
  )
}
