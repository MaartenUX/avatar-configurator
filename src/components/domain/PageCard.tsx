import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Download, ExternalLink, SquarePlay } from 'lucide-react'
import { Card } from '../primitives/Card'
import { Badge } from '../primitives/Badge'
import { LangViewTile, LanguageRow } from './LanguageRow'
import { PAGE_STATUS } from '../../tokens/status'
import { nextAction } from '../../state/selectors'
import { formatNumber } from '../../lib/format'
import type { Lang, Page } from '../../state/types'
import { cn } from '../../lib/cn'

export interface PageCardProps {
  page: Page
  user?: 'esmee' | 'emre'
  /** Net bijgewerkt: krijgt een ring en scrollt één keer in beeld. */
  highlighted?: boolean
  /** Filter: alleen deze talen tonen. Leeg is alles. */
  langFilter?: Lang[]
}

export function PageCard({ page, user = 'esmee', highlighted, langFilter }: PageCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const action = nextAction(page, user)
  const isLive = page.status === 'live'

  useEffect(() => {
    if (highlighted) ref.current?.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }, [highlighted])

  const langs = (Object.keys(page.langs) as Lang[]).filter(
    (l) => !langFilter?.length || langFilter.includes(l),
  )

  // Staat de knop al op een taalregel, dan herhaalt de voettekst hem alleen
  // maar. En zonder actie is een balk met los tekstje ook geen balk waard.
  // Blijft wel staan bij de samenvatting en het script: daar hebben de
  // taalregels geen knoppen en is dit de enige ingang.
  const rijActies = langs.some((l) => rowActionFor(page, l, user))
  const toonVoettekst = isLive || (Boolean(action.to) && !rijActies)

  return (
    <div
      ref={ref}
      className={cn(
        'rounded-md transition-shadow',
        highlighted && 'ring-2 ring-blue animate-[highlight-ring_1.2s_var(--ease-soft)]',
      )}
    >
      <Card className="flex flex-col gap-4">
        <header className="flex items-start gap-3">
          <span
            className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-sm bg-gray-6 text-gray-2"
            aria-hidden
          >
            <SquarePlay size={18} />
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <h3 className="text-h3 text-gray-1">{page.title}</h3>
            <a
              href={page.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-fit items-center gap-1 text-body-sm text-gray-3 hover:text-blue-shade"
            >
              {page.url.replace('https://www.', '')}
              <ExternalLink size={12} aria-hidden />
            </a>
          </div>
          {/* Live staat één keer, op de kaart zelf. */}
          <Badge status={PAGE_STATUS[page.status]} dot pulse={page.status === 'in-translation'} />
        </header>

        {isLive ? (
          // Live: compacte tegels met weergaven, geen beoordelaars.
          <div className="flex flex-wrap gap-2">
            {langs.map((lang) => (
              <LangViewTile key={lang} lang={lang} views={page.views[lang]} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-0.5">
            {langs.map((lang) => {
              const entry = page.langs[lang]!
              const rowAction = rowActionFor(page, lang, user)
              return (
                <LanguageRow
                  key={lang}
                  lang={lang}
                  status={entry.status}
                  reviewer={entry.reviewer}
                  etaMin={entry.etaMin}
                  timer={page.timer?.lang === lang || !page.timer?.lang ? page.timer : undefined}
                  actionTo={rowAction?.to}
                  actionLabel={rowAction?.label}
                  bekijkTo={bekijkLinkFor(page, lang)}
                  highlight={user === 'emre' && lang === 'tr'}
                />
              )
            })}
          </div>
        )}

        {toonVoettekst && (
        <footer className="flex flex-wrap items-center gap-3 border-t border-gray-6 pt-3">
          {isLive ? (
            <>
              <span className="text-body-sm text-gray-3">
                {formatNumber(
                  Object.values(page.views).reduce<number>((s, v) => s + (v ?? 0), 0),
                )}{' '}
                weergaven totaal
              </span>
              <span className="ml-auto flex gap-2">
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-sm border border-gray-4 px-3 py-1.5 text-body-sm text-gray-1 hover:border-blue hover:text-blue-shade"
                >
                  <Download size={14} aria-hidden />
                  Download
                </button>
                <Link
                  to={`/paginas/${page.id}`}
                  className="inline-flex items-center gap-1 rounded-sm bg-blue px-3 py-1.5 text-body-sm text-white hover:bg-blue-shade"
                >
                  Bekijk
                  <ChevronRight size={15} aria-hidden />
                </Link>
              </span>
            </>
          ) : (
            <>
              <span className="text-body-sm text-gray-3">{action.hint}</span>
              {action.to && (
                <Link
                  to={action.to}
                  className="ml-auto inline-flex items-center gap-1 rounded-sm bg-blue px-3.5 py-2 text-body-sm text-white hover:bg-blue-shade"
                >
                  {action.label}
                  <ChevronRight size={15} aria-hidden />
                </Link>
              )}
            </>
          )}
        </footer>
        )}
      </Card>
    </div>
  )
}

/** Wat kan deze gebruiker voor déze taal doen? Null als het niet aan hem is. */
function rowActionFor(page: Page, lang: Lang, user: 'esmee' | 'emre') {
  const status = page.langs[lang]?.status
  if (user === 'emre' && lang !== 'tr') return null

  if (status === 'review-text') return { to: `/paginas/${page.id}/${lang}`, label: 'Controleer script' }
  if (status === 'review-video') return { to: `/paginas/${page.id}/video/${lang}`, label: 'Controleer video' }
  return null
}

/** Een afgetekende stap blijft terug te kijken, in kijkstand. */
function bekijkLinkFor(page: Page, lang: Lang) {
  if (page.langs[lang]?.status !== 'approved') return null
  return `/paginas/${page.id}/${lang === 'nl' ? 'script' : lang}?bekijk=1`
}
