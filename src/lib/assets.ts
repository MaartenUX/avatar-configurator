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

const BACKGROUNDS = byBasename(
  import.meta.glob('../assets/backgrounds/*.{jpg,jpeg,png,webp}', {
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
export const backgroundImage = (slug: string): string | undefined => BACKGROUNDS[slug]

/**
 * Media uit public/media: die wordt niet in de bundel gebakken maar als los
 * bestand geserveerd, want video's maken een single-file build onwerkbaar
 * groot (CHANGES-03 H).
 *
 * Deze paden bestaan nog niet; Sebastiaan levert de bestanden later aan. Er is
 * daarom geen lijst om bij te werken: het pad wordt altijd teruggegeven en de
 * component valt terug op de mock zodra het laden mislukt. Een bestand erin
 * droppen is dus genoeg.
 */
export const avatarClip = (id: string) => `${import.meta.env.BASE_URL}media/avatars/${id}.webm`
export const demoVideo = (lang: string) => `${import.meta.env.BASE_URL}media/demo/${lang}.mp4`
export const widgetKnop = () => `${import.meta.env.BASE_URL}media/widget/button.png`

export const assetCounts = () => ({
  // Het silhouet is een placeholder, geen portret: niet meetellen.
  avatars: Object.keys(AVATARS).filter((k) => k !== 'silhouet').length,
  voices: Object.keys(VOICES).length,
  backgrounds: Object.keys(BACKGROUNDS).length,
})
