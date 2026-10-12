/**
 * Assets die Maarten later aanlevert. De glob-patronen zijn letterlijk, dus
 * Vite analyseert ze bij de build; een lege map levert {} op en alles valt
 * netjes terug op een gegenereerde variant. Bestanden erin droppen vraagt geen
 * enkele codewijziging.
 */
const byBasename = (mods: Record<string, string>) =>
  Object.fromEntries(
    Object.entries(mods).map(([path, url]) => [
      path.split('/').pop()!.replace(/\.\w+$/, ''),
      url,
    ]),
  )

const AVATARS = byBasename(
  import.meta.glob('../assets/avatars/*.{png,jpg,jpeg,webp}', {
    eager: true,
    query: '?url',
    import: 'default',
  }) as Record<string, string>,
)

const VOICES = byBasename(
  import.meta.glob('../assets/voices/*.{mp3,m4a,wav}', {
    eager: true,
    query: '?url',
    import: 'default',
  }) as Record<string, string>,
)

/** Portret bij een gezicht-slug (zie AvatarDef.face). */
export const faceImage = (face?: string): string | undefined =>
  face ? AVATARS[face] : undefined

/** Het grijze silhouet voor de lege staat, zolang er niets gekozen is. */
export const silhouetImage = (): string | undefined => AVATARS['silhouet']
export const voiceClip = (id: string): string | undefined => VOICES[id]

/**
 * Media uit public/media: die wordt niet in de bundel gebakken maar als los
 * bestand geserveerd, want video's maken een bundel onwerkbaar groot
 * (CHANGES-03 H).
 */
const media = (pad: string) => `${import.meta.env.BASE_URL}media/${pad}`

/**
 * Welke avatars een eigen clip hebben. Elke clip is opgenomen met het gezicht
 * van precies deze avatar, dus de koppeling gaat per avatar en niet per taal.
 * De rest geeft undefined terug en valt terug op het portret met de
 * pulsanimatie — nu nog alleen Nour, haar clip moet nog komen.
 */
const CLIPS = new Set([
  'nl-daan', 'nl-sanne',
  'en-emma', 'en-james',
  'tr-zeynep', 'tr-mehmet',
  'ar-omar',
])

export const avatarClip = (id?: string) =>
  id && CLIPS.has(id) ? media(`avatars/${id}.webm`) : undefined

/** Eén demovideo voor alle talen: hij laat ze allemaal achter elkaar zien. */
export const demoVideo = () => media('demo/demo.mp4')

/** De twee standaard kantoorshots wisselen elkaar af over de zes scènes. */
export const KANTOORSHOTS = ['kantoor-1', 'kantoor-2']
export const kantoorshot = (scene: number) => KANTOORSHOTS[scene % KANTOORSHOTS.length]

/**
 * Voorbeelden van eigen foto's, één per scène. Illustraties, geen foto's; zie
 * scripts/maak-voorbeeldfotos.mjs.
 */
export const VOORBEELD_FOTOS = [
  'gemeentehuis',
  'park',
  'winkelstraat',
  'bibliotheek',
  'sporthal',
  'plein',
]

/** Een achtergrond is een standaard kantoorshot of een eigen beeld. */
export const backgroundImage = (slug: string) =>
  KANTOORSHOTS.includes(slug) ? media(`backgrounds/${slug}.jpg`) : media(`examples/${slug}.jpg`)

export const assetCounts = () => ({
  // Het silhouet is een placeholder, geen portret: niet meetellen.
  avatars: Object.keys(AVATARS).filter((k) => k !== 'silhouet').length,
  voices: Object.keys(VOICES).length,
  backgrounds: KANTOORSHOTS.length,
  clips: CLIPS.size,
})
