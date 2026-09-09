# Avatar-configurator prototype — uitvoeringsplan

## Context

Het bouwplan (v5, 9 sep 2026) beschrijft een klikbaar React-prototype voor XS2Content × ReadSpeaker: een webredacteur (persona Esmee, Gemeente Bergrode) richt het product eenmalig in en maakt daarna zelfstandig AI-uitlegvideo's met avatar bij gemeentepagina's. Het prototype dient een gebruikerstest met 5 webredacteuren. Geen backend, geen echte generatie — alle wachttijden zijn gemockt.

De huidige werkmap (`lumi-prototype-2`) bevat het **Lumi**-prototype: 6.355 regels JS met inline styles, framer-motion, geen router, geen Tailwind, dirty working tree op `experiment/v3`. Nul overlap met dit product en een botsende stack. Daarom bouwen we naast Lumi.

**Doel:** een `dist/index.html` van één bestand dat zonder server opent, waarin de vier testtaken uit §11 van het bouwplan zonder hulp uit te voeren zijn.

### Afgesproken kaders

| | |
|---|---|
| Locatie | `/Users/maartenjanssen/Library/CloudStorage/Dropbox/dvd/avatar-configurator`, nieuw + lokale `git init`, geen remote |
| Levering | **Pauze na checkpoint 3** voor review, daarna door t/m 9 |
| Avatar-assets | Maarten levert PNG's later; ik bouw fallbacks, mappen en naamgeving staan klaar |
| Content | 2 pagina's volledig (Parkeervergunning, Bijstandsuitkering), 3 dun (WMO, Paspoort, Afval) |
| Fonts | Google Fonts `<link>`: Inter + Noto Sans Arabic |

---

## Beslissingen die ik neem (komen in `DECISIONS.md`)

Het bouwplan zegt: "kies bij twijfel de eenvoudigste variant en noteer die in `DECISIONS.md`." Dit zijn de punten waar ik dat doe, inclusief de twee plekken waar ik bewust van het bouwplan afwijk.

1. **`HashRouter` in plaats van `BrowserRouter`.** §3 noemt BrowserRouter, maar §11 eist dat `dist/index.html` zonder server opent. Onder `file://` kan BrowserRouter geen history pushen en 404't elke deeplink. HashRouter (`/#/paginas/p-1/script`) is de enige variant waarin beide eisen kloppen. Eén regel in `main.tsx` om terug te draaien.
2. **Zes configuratiesecties.** §6 beschrijft er zes, §10 checkpoint 5 zegt "alle 8 secties". Ik houd §6 aan.
3. **`doneSections` wordt afgeleid, niet opgeslagen.** Een sectie is "gedaan" zodra er een geldige keuze staat — dat is een functie van `Config`. Het veld blijft in de state voor spec-compatibiliteit, maar wordt altijd uit de afleiding geschreven.
4. **`green` (#BDFCB0) alleen als vlak, nooit als stip of balk.** Op wit is het onzichtbaar en het faalt contrast. Statusstippen en voortgangsbalken voor `approved`/`live` gebruiken `green-shade` (#1F9B06). De andere zes families zijn wel sterk genoeg als basis.
5. **Logo, huisstijl en screenshot zijn presets, geen echte upload.** §2.11 zegt "gemockt". Een echte `<input type=file>` → data-URL vult de 5 MB localStorage-quota met één screenshot. De uploadknop bestaat en voelt echt, maar kiest een preset.
6. **`config.backgrounds` bevat slugs (`'kantoor-1'`), nooit URL's.** Build-hashed paden in persisted state breken bij elke rebuild.
7. **Route `/paginas/:id/:lang` blijft zoals gespecificeerd,** met een guard die `:lang` tegen de negen taalcodes controleert en anders naar `/paginas/:id` redirect. React Router rangschikt statische segmenten boven dynamische, dus `/paginas/nieuw` en `/paginas/:id/samenvatting` winnen vanzelf; de guard vangt alleen typefouten.
8. **Ondertitels: 8–10 regels over 1:50**, zoals §9. Bij 180 woorden is dat een rustig tempo — passend bij een B1-uitlegvideo.
9. **Eén ticker van 250 ms** is het enige interval in de app. Toasts, kaart-highlights en de mock-playhead lezen allemaal `useNow()` af tegen een opgeslagen `startedAt`.

---

## Stack en projectopzet

Precies §3 van het bouwplan, met de bovenstaande router-afwijking:

```
npm create vite@latest avatar-configurator -- --template react-ts
npm i react-router-dom zustand clsx lucide-react
npm i -D tailwindcss @tailwindcss/vite vite-plugin-singlefile vitest @testing-library/react jsdom
```

`vite.config.ts` krijgt `@tailwindcss/vite`, `viteSingleFile()` en **`build.assetsInlineLimit: Number.MAX_SAFE_INTEGER`** — zonder dat laatste emit Vite assets als losse bestanden en breekt de single-file build stilletjes.

---

## Mappenstructuur

```
avatar-configurator/
├── index.html                   Inter + Noto Sans Arabic, lang="nl"
├── vite.config.ts  tsconfig.json  vitest.config.ts
├── PLAN.md  DECISIONS.md  CLAUDE.md  README.md
└── src/
    ├── main.tsx                 HashRouter, ?fast=1 / ?reset=1 uitlezen
    ├── App.tsx                  <TickProvider><RouteTree/></TickProvider>
    ├── routes.tsx               ROUTES-manifest (gedeeld met de smoke-test)
    ├── tokens/theme.css         @theme-block (zie onder)
    ├── tokens/status.ts         StatusKey → letterlijke Tailwind-classes
    ├── lib/  assets.ts  cn.ts  format.ts  scroll.ts
    ├── state/
    │   ├── types.ts store.ts selectors.ts flow.ts
    │   ├── timers.ts            DURATIONS, advancePage(), tickReducer()
    │   ├── TickProvider.tsx     één interval + NowContext
    │   ├── useCountdown.ts
    │   └── slices/  configSlice  pagesSlice  uiSlice  sessionSlice
    ├── data/
    │   ├── types.ts langs.ts avatars.ts learnmore.ts team.ts copy.ts seed.ts index.ts
    │   └── pages/  p-parkeervergunning.ts  p-bijstand.ts  p-wmo.ts  p-paspoort.ts  p-afval.ts
    ├── mock/  waveform.ts  videoTimeline.ts  siteScreenshot.tsx
    ├── assets/  avatars/.gitkeep  voices/.gitkeep  backgrounds/.gitkeep
    ├── components/  primitives/  layout/  domain/  feedback/  index.ts
    ├── screens/
    │   ├── Overzicht.tsx
    │   ├── configuratie/  Configuratie.tsx  sections.tsx  SectionShell.tsx  s1..s6  Bevestigd.tsx
    │   ├── paginas/  PaginaLijst  NieuwePagina  Samenvatting  Script  Vertaling  Video  Publiceren  Beheer
    │   └── Team.tsx  Hulp.tsx  Kit.tsx  NotFound.tsx
    └── __tests__/  setup.ts  routes.smoke.test.tsx
```

---

## De vier moeilijke stukken

### 1. Timers die een reload overleven

`setTimeout` overleeft geen reload; de persisted state wel. Daarom: **state slaat op wanneer een timer begon, niet wanneer hij afloopt.**

```ts
// state/timers.ts
export interface Timer { kind: 'summarize'|'audio'|'generate'; startedAt: number }
const BASE = { summarize: 6000, audio: 3000, generate: 8000 }
export const durationOf = (k, fast) => fast ? 1000 : BASE[k]
```

`advancePage(page, now, fast)` is een **pure functie** die `null` teruggeeft als er niets te doen is — idempotent, veilig om elke 250 ms aan te roepen, en los te unit-testen zonder UI. De overgangen zijn precies §8 van het bouwplan: `summarize` → `review-summary`; `audio` → `review-nl`; `generate` → NL wordt `review-video`, overige talen `review-text`.

`TickProvider` in `App.tsx` (boven de router, dus overleeft elke navigatie) draait één `setInterval(250)` dat `Date.now()` in een context zet én `store.tick()` aanroept. Het roept ook `beat()` aan bij mount en bij `visibilitychange` — dat vangt de reload én de teruggekeerde achtergrondtab. Een pagina die je start, waarna je herlaadt, telt gewoon door; laptop een uur dicht en weer open lost één tick alles op.

Componenten abonneren via `useCountdown(page.timer)` → `{ seconds, progress, done }`. Alleen componenten die `useNow()` aanroepen hertekenen op 4 Hz.

**Opslag beperken:** `partialize` bewaart alleen voortgang (`status`, `langs`, `timer`, `views`, plus eventuele gebruikersbewerkingen), nooit de ~8.000 woorden statische content. `merge` haakt bij rehydrate de content uit `src/data` er weer aan. localStorage blijft onder ~15 KB.

### 2. De configurator-scrollflow

Zes secties uit §6, als data in `sections.tsx` — één bron voor de progressbar, de done-detectie, de LearnMore-lookup en de smoke-test:

| # | Sectie | Gedaan zodra |
|---|---|---|
| 1 | Taalniveau en talen | `level` gezet én ≥1 taal naast NL |
| 2 | Avatar en stem per taal | elke gekozen taal heeft een avatar |
| 3 | Type video | `videoType` gezet |
| 4 | Personaliseer de video | alle 4 shots hebben een keuze |
| 5 | Widget: kleur en positie | `siteUrl` opgehaald én `widgetCorner` gezet |
| 6 | Preview en vastleggen | checkbox aangevinkt |

**Layout:** window-scroll (geen geneste container — dat maakt restore triviaal). Links `sticky top-0 h-svh`, rechts de scroller. `SectionShell` krijgt `min-height: calc(100svh - var(--bar-h) - 64px)`; dat is precies wat de volgende kop ~64 px boven de vouw laat piepen. Toekomstige secties dimmen naar `opacity-40` maar blijven klikbaar — dimmen is een hint, geen slot.

**Actieve sectie:** `IntersectionObserver` met `rootMargin: '-45% 0px -45% 0px'`. Dat knijpt de root tot een band van 10% in het midden, zodat er altijd exact één sectie in zit en het flapperen tussen twee secties verdwijnt.

**Scroll-restore zonder gevecht** — het klassieke probleem is dat restore `scrollTop` zet, de observer halverwege sectie 1 meldt, en de persist-handler `0` over de bewaarde waarde schrijft. Oplossing is één `settled`-ref die zowel de observer als de persist-handler respecteren:

```ts
useLayoutEffect(() => {                      // vóór paint, na fonts
  const y = store.getState().config.scrollY
  if (!y) { settled.current = true; return }
  document.fonts.ready.then(() => {
    window.scrollTo({ top: y, behavior: 'instant' })
    requestAnimationFrame(() => requestAnimationFrame(() => { settled.current = true }))
  })
}, [])
```

De observer-handler begint met `if (!settled.current) return`. De scroll-persist is rAF-throttled op 250 ms.

**"Verder ↓" versus de observer:** smooth scrollen laat de teller door 3→4→5 flitsen. Fix: bij klik optimistisch `setActive(target)` en `intentUntil.current = performance.now() + 700`; de observer negeert updates zolang die gate loopt. Zelfherstellend — grijpt de gebruiker de scrollbar, dan verloopt de gate en neemt de observer het over.

**Meegroeiende preview:** de linkerkolom leidt alles af uit `config`, geen aparte preview-state. `stage = doneSections(config).length` (0–6) drijft een schaal van 0.62 → 1.0. Binnen `SiteMock` bewaakt elke laag zijn eigen configwaarde met een `transition-opacity`, zodat de preview ook klopt voor een terugkerende gebruiker die direct in sectie 5 landt. De 3×3-swap in sectie 6 gebeurt via een sentinel-div boven de samenvattingskaart met een tweede observer, niet via een scrollpositie-berekening; `PreviewColumn` crossfade't tussen `SiteMock` en `PreviewGrid`.

### 3. Hub-and-spoke: waar de "waar ga ik heen"-beslissing woont

In **`state/flow.ts`**, niet in de store-acties (die blijven pure state-overgangen, testbaar zonder `useNavigate`) en niet verspreid over de schermen (dan verzint elk scherm zijn eigen toast-copy).

```ts
export const FLOW = {
  summary: { destination: () => '/', toast: () => 'Basissamenvatting goedgekeurd — nu het Nederlandse script' },
  script:  { destination: () => '/', toast: c => `Script goedgekeurd. ${c.langCount} talen worden nu gemaakt.` },
  lang:    { destination: () => '/', toast: c => `${langLabel(c.lang)} goedgekeurd — de video wordt gemaakt.` },
  video:   { destination: () => '/', toast: c => `Video ${langLabel(c.lang)} goedgekeurd.` },
  publish: { destination: c => `/paginas/${c.pageId}`, toast: () => 'Je video staat live.' },
}
export function useFinishSpoke() { /* flash(toast) + navigate(destination) */ }
```

Elke spaak eindigt met twee regels: `approveX(id); finish('script', {...})`. De **S0 → S1 → S2-uitzondering** valt vanzelf uit het ontwerp: `Samenvatting.tsx` is één route die `<WaitScreen/>` toont bij `status === 'summarizing'` en het reviewscherm zodra de tick doorklikt naar `review-summary`. Er is dus geen navigatie tussen S1 en S2, en een reload midden in de wachttijd landt terug in dezelfde wachttijd met een kloppende teller.

Toast en highlight zitten in `uiSlice` en zijn **uitgesloten van `partialize`** — een reload mag geen oude toast opgraven. `ToastHost` hangt in `ShellLayout` (zodat de toast zichtbaar is op `/` waar de spaak naartoe navigeert), leest `useNow()` en dooft na 5 s zonder eigen timer. `PageCard` reageert op `highlightPageId` met een ring, één `scrollIntoView({block:'center'})` en dooft na 3 s.

De knop op de kaart komt uit één selector: `nextAction(page)` → `{ label, to }`, afgeleid uit `page.status` + `page.langs`. `Overzicht`, `PaginaLijst` en `Beheer` hergebruiken hem allemaal. Dit is de functie om goed te krijgen — die krijgt een unit-test naast de smoke-test.

### 4. Assets die later binnenkomen zonder codewijziging

```ts
// lib/assets.ts — letterlijke glob-patronen, dus Vite analyseert ze statisch
const AVATARS = byBasename(import.meta.glob('../assets/avatars/*.{png,jpg,webp}',
  { eager: true, query: '?url', import: 'default' }))
export const avatarImage = (id: string) => AVATARS[id]        // undefined als er niets ligt
```

Een lege map levert `{}` op en alles degradeert netjes. De `.gitkeep`-bestanden moeten er staan zodat de mappen in een verse clone bestaan.

De fallbacks moeten er **bewust** uitzien, niet kapot — portretten zijn de held van sectie 2:
- `Avatar` zonder bestand: initialen op een kleur die deterministisch uit het id in een van de zeven merkfamilies wordt gehasht, met een subtiel hoofd-en-schouders-silhouet.
- `Player` zonder mp3: `startedAt` in lokale state, `useNow()` drijft de voortgang over `durationSec`, waveform uit `mock/waveform.ts`. Mock en echt lopen door dezelfde component, dus een mp3 erin droppen wisselt een prop, geen codepad.
- Achtergrond zonder jpg: CSS-gradient uit `turq-tint`/`blue-tint` plus het label.

**Wat ik van jou nodig heb wanneer je de assets levert** (relevant omdat single-file alles base64 inlined, ~1,37× opgeblazen): 18 portretten webp/png 400×400 ≤40 KB, 18 stemfragmenten mp3 mono ≤6 s ≤50 KB, 4 kantoorshots webp 1280×720 ≤120 KB. Dat landt `dist/index.html` rond 2,5 MB; boven ~8 MB wordt Safari traag.

---

## Designtokens

`src/tokens/theme.css` volgt §4.1 letterlijk — let op dat de grijsschaal van **donker naar licht** loopt (`gray-1` is `#333333`, niet omgekeerd):

```css
@import "tailwindcss";
@theme {
  --color-*: initial;                    /* Tailwind-defaults wissen, voorkomt bg-blue-500-drift */
  --color-white: #FFFFFF;
  --color-blue: #46BAD8;   --color-blue-tint: #E6FAFF;   --color-blue-shade: #156D84;
  --color-orange: #FF996D; --color-orange-tint: #FFD9C8; --color-orange-shade: #892900;
  --color-green: #BDFCB0;  --color-green-tint: #E6FEE1;  --color-green-shade: #1F9B06;
  --color-red: #FF4242;    --color-red-tint: #FFB8B8;    --color-red-shade: #780000;
  --color-turq: #7AD3CB;   --color-turq-tint: #CDEFEC;   --color-turq-shade: #1F5E58;
  --color-violet: #8EA0FF; --color-violet-tint: #D5DBFF; --color-violet-shade: #001895;
  --color-pink: #FF61C0;   --color-pink-tint: #FFC4E7;   --color-pink-shade: #84004F;
  --color-gray-1: #333333; --color-gray-2: #4F4F4F; --color-gray-3: #828282;
  --color-gray-4: #BDBDBD; --color-gray-5: #E0E0E0; --color-gray-6: #F2F2F2;
  --color-bg: #FAFAFA;
  --font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;
  --font-arabic: 'Noto Sans Arabic', 'Inter', sans-serif;
  --text-display: 40px; --text-display--line-height: 48px; --text-display--font-weight: 600;
  /* h1 32/40/600 · h2 24/32/600 · h3 20/28/500 · body 16/24/400 · body-sm 14/20/400 */
  /* label 12/16/600 + letter-spacing .08em · button 16/24/500 */
  --radius-*: initial;
  --radius-sm: 8px; --radius-md: 12px; --radius-pill: 999px;
  --shadow-card: 1px 1px 0 rgba(0,0,0,.10), 0 0 16px rgba(0,0,0,.05);
}
@utility type-label { /* label + text-transform: uppercase, niet uitdrukbaar als --text-* modifier */ }
```

`src/tokens/status.ts` is de enige plek waar een status naar classes vertaalt. **Kritiek voor Tailwind v4:** de scanner is een tekstscanner, dus `` `bg-${family}-tint` `` levert geen CSS op. De map bevat volledige letterlijke strings, niets wordt samengesteld:

```ts
export const STATUS: Record<StatusKey, {label,dot,chip,text,ring,bar}> = {
  todo:       { dot:'bg-gray-3',       chip:'bg-gray-6 text-gray-2',           ... },
  waiting:    { dot:'bg-orange',       chip:'bg-orange-tint text-orange-shade',... },
  review:     { dot:'bg-blue',         chip:'bg-blue-tint text-blue-shade',    ... },
  generating: { dot:'bg-turq',         chip:'bg-turq-tint text-turq-shade',    ... },
  approved:   { dot:'bg-green-shade',  chip:'bg-green-tint text-green-shade',  ... },
  live:       { dot:'bg-green-shade',  chip:'bg-green text-green-shade',       ... },
  error:      { dot:'bg-red',          chip:'bg-red-tint text-red-shade',      ... },
}
```
plus `LANG_STATUS` en `PAGE_STATUS` die de twee statusdomeinen hierop mappen. `Indicator` en `Badge` worden daarmee eenregelig.

---

## Componenten

Vier submappen onder `src/components/`, alles herexporteerd uit `index.ts` en alles op `/kit` met zijn volledige state-matrix (elke `variant × size × state` voor primitives, elke `StatusKey` voor statuscomponenten, elke `stage 0..6` voor `SiteMock`).

- **`primitives/`** — Button, Chip, Badge, Indicator, Input, Textarea, Tabs (+SubTabs), Card, Dialog
- **`layout/`** — ShellLayout, SpokeLayout, SidebarItem, CreditsMeter, StatCard, Stepper, ProgressBar, PipelineStep
- **`domain/`** — PageCard, LanguageRow, ChoiceTile, AvatarTile, Avatar, SiteMock, PreviewGrid, SceneBlock, WordCounter, Player, VideoPreview, SubtitleEditor, LockedBanner
- **`feedback/`** — WaitScreen, ApproveBox, AdviceBox, HowBox, LearnMore, HelpTray, Celebration, Toast, ToastHost, EmptyState

Dat zijn de 32 gespecificeerde componenten plus acht onvermijdelijke lijmcomponenten (Avatar, Textarea, CreditsMeter, Toast, ToastHost, EmptyState en de twee layouts).

`SceneBlock`, `SubtitleEditor`, `VideoPreview`-ondertitels en `LanguageRow` gebruiken logische properties (`ps-`/`pe-`/`text-start`) in plaats van `pl-`/`pr-`/`text-left`, zodat `dir="rtl"` voor Arabisch werkt zonder aparte varianten.

---

## Content

Vijf pagina's van Gemeente Bergrode, één bestand per pagina zodat alles over die pagina bij elkaar staat:

| Pagina | Diepte |
|---|---|
| Parkeervergunning bewoners | volledig: bronpagina ~350 w, 4 scenes à ~45 w, EN/TR/AR-vertaling, ondertitels 4 talen |
| Bijstandsuitkering aanvragen | volledig (dit is de pagina in productie in de seed) |
| WMO-ondersteuning · Paspoort of ID-kaart · Afval en grofvuil | dun: titel, URL, status, views per taal |

Verder: `avatars.ts` met 18 definities (NL Sanne/Daan, EN Emma/James, DE Lena/Jonas, FR Camille/Louis, TR Zeynep/Mehmet, AR Nour/Omar, PL Zofia/Jakub, EL Eleni/Nikos, ES Lucía/Mateo — elk met `keywords[]`, `sampleSentence` in die taal en `advised`), `learnmore.ts` (6 secties × 3–4 zinnen + 4 feature-icoontjes + 3 FAQ's), `team.ts` (Esmee, Vincent, Marloes, Emre, Layla), `copy.ts` voor gedeelde strings, `seed.ts`.

`src/data/index.ts` draait boot-asserties in dev: elke volledige pagina heeft 4 scenes, elke taal heeft precies één `advised` avatar, geen pagina-id botst met `nieuw`.

**Kanttekening bij TR en AR:** ik schrijf ze zorgvuldig, maar niemand in het team kan ze proeflezen. Voor een test met Nederlandse redacteuren is dat meestal onschadelijk — tot een deelnemer toevallig Turks leest. Laat de Turkse tekst van de Parkeervergunning-pagina vóór de test even nakijken door een spreker; dat is de enige die tijdens taak (c) daadwerkelijk geopend wordt.

---

## Bouwvolgorde

Twee dingen verhuizen naar checkpoint 1 ten opzichte van §10, omdat ze allebei het type risico zijn dat pas aan het eind ontploft en dan duur is:

- **De store + timers.** Het is het risicovolste stuk logica, volledig testbaar zonder UI, en elk scherm vanaf checkpoint 4 hangt aan de vorm ervan. Ontdekken bij checkpoint 6 dat `Page.status` en `langs[].status` elkaar tegenspreken betekent afgebouwde schermen herbouwen. Ik bouw hem met een wegwerp-`/kit#state`-paneel: knoppen voor `addPage` / `approveSummary` / `approveNl` plus een live JSON-dump. Daarmee valideer ik de hele timer-spec inclusief reload-duurzaamheid vóór er één echt scherm bestaat.
- **De single-file build.** Routerkeuze, `assetsInlineLimit` en font-inlining falen allemaal pas bij checkpoint 9. `npm run build && open dist/index.html` wordt een check bij élk checkpoint.

| CP | Inhoud |
|---|---|
| 1 | Vite + Tailwind v4 + tokens; HashRouter + ROUTES-manifest; Shell/Spoke-layouts; placeholder-schermen; **store + timers + TickProvider + persist**; **single-file build geverifieerd**; smoke-test |
| 2 | Primitives + layout-componenten op `/kit` |
| 3 | Domain- + feedback-componenten op `/kit`; `copy.ts`, avatars, learnmore, team, seed; 2 pagina's volledige content, 3 dun — **PAUZE** |
| 4 | Overzicht leeg + gevuld, PageCard, `nextAction`, toast + highlight, filter-chips, credits |
| 5 | Configuratie-scrollflow, meegroeiende SiteMock, PreviewGrid, vastleggen + mailbevestiging, resumable |
| 6 | Spaken S0–S6 aan `flow.ts`, mock-timers, collega-view Emre |
| 7 | Beheer, `/paginas` met tabs, Team, Hulp |
| 8 | RTL-pass Arabisch, hover/focus/toetsenbord, 1280 en 1440, lege en foutstaten, Celebration-polish |
| 9 | Definitieve single-file build, cross-browser check, reset-affordance |

Commit na elk checkpoint.

### Wat je bij de pauze wél en niet kunt zien

**Wel:** `/kit` met alle ~40 componenten in elke variant en state, met echte Nederlandse labels en echte statuskleuren — dit is het waardevolle reviewmoment, want hier zijn token-, spacing- en toonbeslissingen nog goedkoop. Alle 14 routes navigeren en renderen een getitelde placeholder in de juiste layout, dus de shell/spaak-splitsing en de 55/45-verdeling zijn zichtbaar. Een `/kit#data`-paneel dumpt pagina's, avatars en learnmore-teksten zodat je de Nederlandse copy kunt lezen en corrigeren voordat hij in twaalf schermen zit. En het `/kit#state`-paneel waarmee je de timers kunt aanzetten.

**Niet:** één enkele flow. Geen configurator-scroll, geen goedkeur-naar-toast, geen doorlopende klikpad. Je kunt bij checkpoint 3 níet "even door het prototype klikken" — dat begint bij checkpoint 4 en is pas compleet bij 6.

---

## Verificatie

- `npm run test` — smoke-test itereert het `ROUTES`-manifest, mount elke route onder `MemoryRouter` met de seed-state, plus unit-tests voor `advancePage()` (alle drie de overgangen, idempotentie, `fast`-modus) en `nextAction()` (elke `page.status` × taalcombinatie).
- **Timer-duurzaamheid handmatig:** start een pagina op `/paginas/nieuw`, herlaad tijdens het aftellen → de teller loopt door op de juiste stand. Wacht de tijd uit met de tab op de achtergrond → bij terugkeer staat de status al door.
- **Browser pane** (`preview_start` met `.claude/launch.json`) na checkpoint 4 en verder: console en netwerk op fouten, `read_page` op de scrollflow, screenshots op 1280 en 1440.
- **De vier testtaken uit §11** helemaal doorlopen als eindcontrole: (a) Bergrode inrichten en vastleggen, (b) Parkeervergunning toevoegen + basissamenvatting + NL-script, (c) als Emre de Turkse tekst en video goedkeuren, (d) publiceren en de social-versie downloaden.
- **`?fast=1`** versnelt elke timer naar 1 s — verplicht voor het doorlopen van (b) t/m (d) in redelijke tijd.
- **Single file:** `npm run build`, dan `open dist/index.html` vanaf `file://` — moet volledig werken inclusief deeplinks, zonder server.
