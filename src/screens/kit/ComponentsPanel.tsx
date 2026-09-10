import { useState } from 'react'
import { Check, Filter, Play, Sparkles, Trash2 } from 'lucide-react'
import {
  Badge, Button, Card, Chip, Dialog, Indicator, Input, PipelineStep,
  ProgressBar, StatCard, Stepper, Tabs, Textarea,
} from '../../components'
import { STATUS_KEYS } from '../../tokens/status'
import { KitBlock, KitRow } from './KitBlock'

export function ComponentsPanel() {
  const [chip, setChip] = useState(true)
  const [text, setText] = useState('https://www.bergrode.nl')
  const [area, setArea] = useState(
    'Woont u in een straat met betaald parkeren? Dan kunt u een parkeervergunning aanvragen.',
  )
  const [tab, setTab] = useState('productie')
  const [step, setStep] = useState(3)
  const [dialog, setDialog] = useState(false)
  const [reason, setReason] = useState('avatar')

  return (
    <div className="flex flex-col gap-8">
      <KitBlock title="Button" note="primary · secondary · ghost · danger, in md en sm">
        <KitRow>
          <Button>Akkoord</Button>
          <Button variant="secondary">Sla op</Button>
          <Button variant="ghost">Annuleer</Button>
          <Button variant="danger" iconLeft={Trash2}>Verwijder</Button>
        </KitRow>
        <KitRow>
          <Button size="sm">Akkoord</Button>
          <Button size="sm" variant="secondary">Sla op</Button>
          <Button iconLeft={Sparkles}>Opnieuw genereren</Button>
          <Button iconRight={Play} variant="secondary">Beluister</Button>
        </KitRow>
        <KitRow>
          <Button disabled>Uitgeschakeld</Button>
          <Button loading>Bezig</Button>
          <Button variant="secondary" disabled>Niets meer over</Button>
        </KitRow>
      </KitBlock>

      <KitBlock title="Chip" note="filter-pill, aan of uit, optioneel met teller">
        <KitRow>
          <Chip label="Alle talen" selected={chip} count={4} onClick={() => setChip(!chip)} />
          <Chip label="Nederlands" count={2} onClick={() => {}} />
          <Chip label="Turks" icon={Filter} onClick={() => {}} />
          <Chip label="Arabisch" chevron onClick={() => {}} />
          <Chip label="Grieks" disabled />
        </KitRow>
      </KitBlock>

      <KitBlock title="Badge en Indicator" note="elke status, met en zonder stip">
        <KitRow>
          {STATUS_KEYS.map((s) => <Badge key={s} status={s} dot />)}
        </KitRow>
        <KitRow>
          <Badge status="generating" percentage={62}>Wordt gemaakt</Badge>
          <Badge status="review">Jouw beurt</Badge>
        </KitRow>
        <KitRow>
          {STATUS_KEYS.map((s) => (
            <Indicator key={s} status={s} label={s} pulse={s === 'generating'} />
          ))}
        </KitRow>
      </KitBlock>

      <KitBlock title="Input en Textarea" note="label in het veld, met hint- en foutstaat">
        <div className="grid max-w-2xl gap-3">
          <Input label="Website" value={text} onChange={setText} type="url" hint="We halen hier je logo en kleuren op." />
          <Input label="Website" value="bergrode" onChange={() => {}} error="Vul een volledig webadres in, bijvoorbeeld https://www.bergrode.nl" />
          <Input label="Website" value="" onChange={() => {}} placeholder="https://" />
          <Input label="Vastgelegd" value="https://www.bergrode.nl" onChange={() => {}} disabled />
          <Textarea label="Scène 1" value={area} onChange={setArea} />
        </div>
      </KitBlock>

      <KitBlock title="Tabs" note="onderstreept, en de compacte subtab-variant">
        <Tabs
          items={[
            { id: 'productie', label: 'In productie', count: 1 },
            { id: 'live', label: 'Live', count: 3 },
          ]}
          value={tab}
          onChange={setTab}
        />
        <div className="mt-4">
          <Tabs
            variant="subtabs"
            items={[
              { id: 'productie', label: 'Tekst', icon: Check },
              { id: 'live', label: 'Video', icon: Play },
            ]}
            value={tab}
            onChange={setTab}
          />
        </div>
      </KitBlock>

      <KitBlock title="Card en StatCard">
        <KitRow>
          <Card className="w-64"><p className="text-body text-gray-2">Witte kaart met schaduw en 24 padding.</p></Card>
          <Card tone="tint" className="w-64"><p className="text-body text-blue-shade">Tint-variant.</p></Card>
          <Card tone="dashed" className="w-64"><p className="text-body text-gray-3">Gestippeld, voor lege staten.</p></Card>
        </KitRow>
        <KitRow>
          <StatCard label="Weergaven Nederlands" value={2891} sub="afgelopen 30 dagen" />
          <StatCard label="Weergaven Turks" value={264} sub="afgelopen 30 dagen" />
          <StatCard label="Uitlegvideo’s over" value="7" sub="van 10" />
        </KitRow>
      </KitBlock>

      <KitBlock title="Stepper en ProgressBar">
        <div className="grid max-w-3xl gap-6 md:grid-cols-2">
          <Stepper
            steps={[
              { id: '1', label: 'Taalniveau en talen' },
              { id: '2', label: 'Avatar en stem per taal' },
              { id: '3', label: 'Type video' },
              { id: '4', label: 'Personaliseer de video' },
              { id: '5', label: 'Widget: kleur en positie' },
              { id: '6', label: 'Preview en vastleggen' },
            ]}
            current={step}
            done={[1, 2]}
            onStepClick={setStep}
          />
          <div className="flex flex-col gap-5">
            <ProgressBar value={step} max={6} note="± 10 min te gaan" />
            <ProgressBar value={5} max={6} status="approved" note="bijna klaar" />
            <ProgressBar value={2} max={6} showLabel={false} size="sm" status="generating" />
          </div>
        </div>
      </KitBlock>

      <KitBlock title="PipelineStep" note="de stappen uit 'Dit gaat er gebeuren'">
        <Card className="max-w-md">
          <ol>
            <PipelineStep index={1} label="Samenvatting maken" meta="1 min · automatisch" status="approved" />
            <PipelineStep index={2} label="Basissamenvatting controleren" meta="3 min · jij" status="review" />
            <PipelineStep index={3} label="Nederlands script finetunen" meta="5 min · jij" status="todo" />
            <PipelineStep index={4} label="Vertalingen controleren" meta="5 min per taal · collega's" status="todo" />
            <PipelineStep index={5} label="Video's maken" meta="20 min · automatisch" status="todo" isLast />
          </ol>
        </Card>
      </KitBlock>

      <KitBlock title="Dialog">
        <Button variant="secondary" onClick={() => setDialog(true)}>Open dialoog</Button>
        <Dialog
          open={dialog}
          onClose={() => setDialog(false)}
          title="Video is niet oké?"
          description="Vertel wat er mis is. Opnieuw maken gaat van je gezamenlijke pot."
          options={[
            { id: 'avatar', label: 'Avatar ziet er vreemd uit' },
            { id: 'sync', label: 'Spraak loopt niet synchroon' },
            { id: 'anders', label: 'Anders', description: 'We nemen contact met je op.' },
          ]}
          value={reason}
          onValueChange={setReason}
          confirmLabel="Opnieuw maken"
          onConfirm={() => setDialog(false)}
        />
      </KitBlock>
    </div>
  )
}
