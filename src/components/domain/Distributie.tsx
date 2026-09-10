import { useState } from 'react'
import { Check, Copy, Download, ExternalLink, Loader, Share2 } from 'lucide-react'
import { Button } from '../primitives/Button'
import { Card } from '../primitives/Card'
import { useStore } from '../../state/store'
import { langLabel } from '../../data/langs'
import type { Lang, Page } from '../../state/types'

/**
 * De blokken waarmee je de video verspreidt. Gedeeld door de beheerpagina en
 * de publiceerstap, zodat die twee niet uit elkaar groeien.
 */

const embedCode = (page: Page, langs: Lang[]) =>
  `<!-- Uitlegvideo van ReadSpeaker en XS2Content -->
<div
  data-xs2-video="${page.id}"
  data-talen="${langs.join(',')}"
  data-positie="rechtsonder"
></div>
<script src="https://widget.xs2content.nl/v1/widget.js" async></script>`

export function EmbedBlok({ page, langs, live }: { page: Page; langs: Lang[]; live: boolean }) {
  const [code, setCode] = useState(() => embedCode(page, langs))
  const [gekopieerd, setGekopieerd] = useState(false)

  const kopieer = () => {
    void navigator.clipboard?.writeText(code).catch(() => {})
    setGekopieerd(true)
    window.setTimeout(() => setGekopieerd(false), 2500)
  }

  return (
    <Card className="flex h-full flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h3 className="text-h3 text-gray-1">Toevoegen aan je website</h3>
        <p className="text-body-sm text-gray-2">
          Plak deze code op de pagina. De video verschijnt dan in de hoek die je in de
          configuratie hebt gekozen.
        </p>
      </div>

      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        rows={7}
        spellCheck={false}
        aria-label="Code voor je website"
        className="w-full resize-y rounded-sm border border-gray-4 bg-gray-6 p-3 font-mono text-[13px] leading-relaxed text-gray-1 outline-none focus:border-blue"
      />

      <Button iconLeft={gekopieerd ? Check : Copy} onClick={kopieer} full>
        {gekopieerd ? 'Gekopieerd' : 'Kopieer de code'}
      </Button>

      <p className="text-body-sm text-gray-3">
        Je mag de code aanpassen; je webdeveloper kan hem naar eigen inzicht inbouwen.
      </p>

      {!live && (
        <p className="rounded-sm bg-orange-tint/60 px-3 py-2 text-body-sm text-orange-shade">
          De widget wordt pas actief zodra je deze pagina publiceert. Je kunt de code alvast
          doorgeven.
        </p>
      )}
    </Card>
  )
}

export function Distributie({
  langs,
  beschikbaar,
}: {
  langs: Lang[]
  /** De video's zijn goedgekeurd. Dat is los van of de widget al live staat. */
  beschikbaar: boolean
}) {
  const fast = useStore((s) => s.fast)
  const [bezig, setBezig] = useState(false)
  const [klaar, setKlaar] = useState(false)

  const maak = () => {
    setBezig(true)
    window.setTimeout(() => {
      setBezig(false)
      setKlaar(true)
    }, fast ? 400 : 3000)
  }

  return (
    <Card className="flex h-full flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h3 className="text-h3 text-gray-1">Publiceren op andere kanalen</h3>
        <p className="text-body-sm text-gray-2">
          We maken een vierkante en een staande versie, geschikt voor social media. Elke download
          heeft een AI-label.
        </p>
      </div>

      {klaar ? (
        <div className="flex flex-wrap gap-2">
          {langs.map((l) => (
            <Button key={l} size="sm" variant="secondary" iconLeft={Download} disabled={!beschikbaar}>
              {langLabel(l)}
            </Button>
          ))}
        </div>
      ) : (
        <Button
          variant="secondary"
          iconLeft={bezig ? Loader : Share2}
          loading={bezig}
          disabled={!beschikbaar}
          onClick={maak}
          className="w-fit"
        >
          {bezig ? 'Versies worden gemaakt' : 'Maak downloadversies'}
        </Button>
      )}

      {!beschikbaar && (
        <p className="text-body-sm text-gray-3">
          Beschikbaar zodra alle talen zijn goedgekeurd.
        </p>
      )}

      <div className="mt-auto flex flex-col gap-2 border-t border-gray-6 pt-3">
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="inline-flex w-fit items-center gap-1.5 text-body text-blue-shade hover:underline"
        >
          Zo deed Gemeente Eindhoven het
          <ExternalLink size={13} aria-hidden />
        </a>
        <ul className="flex flex-col gap-1.5">
          {[
            'Zet de video zelf in het bericht; een link erheen wordt veel minder bekeken.',
            'Schrijf de kern ook in het bericht — veel mensen kijken zonder geluid.',
            'Deel de Turkse en Arabische versie in de groepen waar die talen gesproken worden.',
          ].map((tip) => (
            <li key={tip} className="flex gap-2 text-body-sm text-gray-2">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-pill bg-violet" aria-hidden />
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </Card>
  )
}
