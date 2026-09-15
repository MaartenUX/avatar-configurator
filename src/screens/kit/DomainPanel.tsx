import { useState } from 'react'
import {
  AdviceBox, ApproveBox, AvatarTile, Celebration, ChoiceTile, EmptyState,
  HowBox, LanguageRow, LearnMore, PageCard, Player, PreviewGrid,
  SceneBlock, SiteMock, SubtitleEditor, VideoPreview, WaitScreen,
} from '../../components'
import { FileVideo, Gauge, Timer } from 'lucide-react'
import { SpraakTips } from '../../components/feedback/SpraakTips'
import { KitBlock, KitRow } from './KitBlock'
import { useStore } from '../../state/store'
import { AVATARS, ADVICE, avatarsFor } from '../../data/avatars'
import { langLabel } from '../../data/langs'
import { pageContent } from '../../data'
import { SEED_CONFIG } from '../../data/seed'
import { startTimer } from '../../state/timers'
import type { Config, WidgetCorner } from '../../state/types'

const CORNERS: { id: WidgetCorner; label: string }[] = [
  { id: 'lt', label: 'Linksboven' },
  { id: 'rt', label: 'Rechtsboven' },
  { id: 'lb', label: 'Linksonder' },
  { id: 'rb', label: 'Rechtsonder' },
]

export function DomainPanel() {
  const pages = useStore((s) => s.pages)
  const [avatar, setAvatar] = useState('nl-sanne')
  const [videoType, setVideoType] = useState<Config['videoType']>('vast')
  const [stage, setStage] = useState(6)
  const [seek, setSeek] = useState<number | null>(null)
  const [time, setTime] = useState(0)

  const parkeren = pageContent('p-parkeervergunning')!
  const subs = parkeren.subtitles.nl ?? []

  // Preview-config die met de schuif meegroeit, om de zes stadia te tonen.
  const staged: Config = {
    ...SEED_CONFIG,
    languages: SEED_CONFIG.languages.slice(0, Math.max(1, Math.min(4, stage))),
    avatars: stage >= 2 ? SEED_CONFIG.avatars : {},
    logo: stage >= 5 ? SEED_CONFIG.logo : undefined,
    primary: stage >= 5 ? SEED_CONFIG.primary : undefined,
    secondary: stage >= 5 ? SEED_CONFIG.secondary : undefined,
    videoType,
  }

  return (
    <div className="flex flex-col gap-8">
      <KitBlock title="SiteMock" note="de preview die meegroeit met elke keuze in de configurator">
        <label className="flex items-center gap-3 text-body-sm text-gray-2">
          Stadium {stage} van 6
          <input
            type="range" min={0} max={6} value={stage}
            onChange={(e) => setStage(Number(e.target.value))}
            className="w-56 accent-[#46BAD8]"
          />
        </label>
        <KitRow>
          <div className="w-[420px]"><SiteMock config={staged} /></div>
          <div className="w-[420px]"><SiteMock config={staged} expanded shot={1} /></div>
        </KitRow>
        <KitRow>
          {CORNERS.map((c) => (
            <div key={c.id} className="w-52">
              <SiteMock config={{ ...staged, widgetCorner: c.id }} mini />
              <p className="mt-1 text-body-sm text-gray-3">{c.label}</p>
            </div>
          ))}
        </KitRow>
      </KitBlock>

      <KitBlock title="PreviewGrid" note="het 3x3-raster uit sectie 6">
        <div className="w-[520px]"><PreviewGrid config={staged} /></div>
      </KitBlock>

      <KitBlock title="AvatarTile" note="portret in een kader, naam en steekwoorden eronder">
        <div className="flex flex-col gap-5">
          {(['nl', 'tr', 'ar'] as const).map((code) => (
            <div key={code} className="flex flex-col gap-2">
              <h3 className="text-h3 text-gray-1">{langLabel(code)}</h3>
              <div className="grid w-[460px] grid-cols-2 gap-3">
                {avatarsFor(code).map((a) => (
                  <AvatarTile
                    key={a.id}
                    avatar={a}
                    selected={avatar === a.id}
                    advised={a.advised}
                    onSelect={() => setAvatar(a.id)}
                  />
                ))}
              </div>
              <AdviceBox>{ADVICE[code]}</AdviceBox>
            </div>
          ))}
        </div>
        <p className="text-body-sm text-gray-3">
          Alle {AVATARS.length} avatars staan in de Content-tab.
        </p>
      </KitBlock>

      <KitBlock title="ChoiceTile" note="gekozen = blauwe rand met tintvlak">
        <KitRow>
          <ChoiceTile
            title="Vaste samenvatting" icon={Timer} selected={videoType === 'vast'} tag="Aanbevolen"
            description="Maximaal 3 minuten, 4 tot 6 scènes. De maximale spanningsboog."
            onSelect={() => setVideoType('vast')} className="w-72"
          />
          <ChoiceTile
            title="Adaptieve samenvatting" icon={Gauge} selected={videoType === 'adaptief'}
            description="Ongeveer 10% van de leestijd, maximaal 6 minuten. Meer scènes."
            onSelect={() => setVideoType('adaptief')} className="w-72"
          />
          <ChoiceTile title="Alert-video" selected={false} disabled onSelect={() => {}} description="Binnenkort beschikbaar." className="w-56" />
        </KitRow>
      </KitBlock>

      <KitBlock title="PageCard" note="de kaart uit het overzicht, in productie en live">
        <div className="grid max-w-3xl gap-4">
          {pages.slice(0, 2).map((p, i) => (
            <PageCard key={p.id} page={p} highlighted={i === 0} />
          ))}
        </div>
      </KitBlock>

      <KitBlock title="LanguageRow" note="losse rij, elke status">
        <div className="w-full max-w-2xl rounded-md bg-white p-3 shadow-card">
                    <LanguageRow lang="en" status="review-text" reviewer="Esmee de Vries" actionTo="#" actionLabel="Controleer script" />
          <LanguageRow lang="tr" status="review-video" reviewer="Emre Yılmaz" actionTo="#" actionLabel="Controleer video" />
          <LanguageRow lang="ar" status="generating" reviewer="Layla Haddad" timer={startTimer('generate')} />
          <LanguageRow lang="de" status="waiting" reviewer="Esmee de Vries" />
          <LanguageRow lang="nl" status="approved" reviewer="Esmee de Vries" bekijkTo="#" />
        </div>
      </KitBlock>

      <KitBlock title="SceneBlock" note="inline bewerkbaar, met woordteller en optioneel audio">
        <div className="flex max-w-2xl flex-col gap-3">
          <SceneBlock index={1} title={parkeren.scenes[0].title} text={parkeren.scenes[0].text} maxWords={50} />
          <SceneBlock index={2} title={parkeren.scenes[1].title} text={parkeren.scenes[1].text} maxWords={50} audioId="nl-sanne" />
          <SceneBlock
            index={1} maxWords={50} dir="rtl"
            title={parkeren.translations.ar![0].title}
            text={parkeren.translations.ar![0].text}
          />
        </div>
      </KitBlock>

      <KitBlock title="Player" note="speelt een mp3 als die er is, anders een mock op dezelfde klok">
        <div className="flex w-full max-w-lg flex-col gap-3">
          <Player id="nl-sanne" label="Nederlands · Sanne" durationSec={110} />
          <Player id="tr-zeynep" durationSec={28} compact />
        </div>
      </KitBlock>

      <KitBlock title="VideoPreview en SubtitleEditor" note="klikken op een tijdcode springt in de preview">
        <div className="grid max-w-4xl gap-4 lg:grid-cols-2">
          <VideoPreview
            avatarId="nl-sanne" lang="nl" subtitles={subs} logo="bergrode"
            seekTo={seek} onTimeUpdate={setTime}
          />
          <SubtitleEditor lines={subs} currentTime={time} onSeek={setSeek} />
        </div>
        <div className="grid max-w-4xl gap-4 lg:grid-cols-2">
          <VideoPreview avatarId="ar-nour" lang="ar" subtitles={parkeren.subtitles.ar} logo="bergrode" />
          <SubtitleEditor lines={parkeren.subtitles.ar ?? []} dir="rtl" />
        </div>
      </KitBlock>

      <KitBlock title="WaitScreen" note="de knop wordt pas actief op nul">
        <div className="w-full max-w-lg rounded-md bg-bg p-6">
          <WaitScreen
            title="We maken de samenvatting"
            subtitle="Dit duurt ongeveer een minuut. Je hoeft niet te wachten; we laten het weten zodra hij klaar is."
            timer={startTimer('summarize')}
            tips={[
              'Luister straks eerst naar de audio.',
              'Pas zinnen aan als de essentie mist.',
              'Controleer of het B1-niveau klopt.',
            ]}
            actionLabel="Toon samenvatting"
          />
        </div>
      </KitBlock>

      <KitBlock title="HowBox, ApproveBox, AdviceBox">
        <div className="flex max-w-2xl flex-col gap-3">
          <HowBox points={[
            'Staat de essentie erin?',
            'Klopt het B1-niveau?',
            'Mist er iets wat een inwoner echt moet weten?',
          ]} />
          <AdviceBox label="Meest gekozen">{ADVICE.de}</AdviceBox>
          <ApproveBox
            consequence="Na akkoord wordt deze tekst de basis voor elke taal. In de volgende stap maak je de Nederlandse zinnen mooi voor de spraak."
            onApprove={() => {}}
            onSave={() => {}}
          />
        </div>
      </KitBlock>

      <KitBlock title="LearnMore en SpraakTips">
        <KitRow>
          <LearnMore sectionId="avatars" />
          <LearnMore sectionId="videotype" label="Waarom maximaal 3 minuten?" />
          <SpraakTips />
          <SpraakTips soort="ondertitel" />
        </KitRow>
      </KitBlock>

      <KitBlock title="Celebration en EmptyState">
        <div className="max-w-2xl">
          <Celebration done={[
            'Basissamenvatting goedgekeurd',
            'Vier talen gecontroleerd door je collega’s',
            'Video’s staan live op bergrode.nl',
          ]} />
        </div>
        <div className="max-w-lg">
          <EmptyState
            icon={FileVideo}
            title="Nog geen pagina’s"
            body="Voeg je eerste pagina toe. Binnen een halfuur staat er een video bij."
          />
        </div>
      </KitBlock>
    </div>
  )
}
