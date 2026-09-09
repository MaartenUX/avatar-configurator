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

export const assetCounts = () => ({
  // Het silhouet is een placeholder, geen portret: niet meetellen.
  avatars: Object.keys(AVATARS).filter((k) => k !== 'silhouet').length,
  voices: Object.keys(VOICES).length,
  backgrounds: Object.keys(BACKGROUNDS).length,
})
