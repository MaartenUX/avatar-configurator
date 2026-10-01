import type { Lang } from '../state/types'

export interface LangDef {
  code: Lang
  /** Nederlandse naam, zoals de webredacteur hem ziet. */
  label: string
  /** Naam in de taal zelf, voor de collega-view. */
  native: string
  dir: 'ltr' | 'rtl'
}

export const LANGS: LangDef[] = [
  { code: 'nl', label: 'Nederlands', native: 'Nederlands', dir: 'ltr' },
  { code: 'en', label: 'Engels', native: 'English', dir: 'ltr' },
  { code: 'de', label: 'Duits', native: 'Deutsch', dir: 'ltr' },
  { code: 'fr', label: 'Frans', native: 'Français', dir: 'ltr' },
  { code: 'tr', label: 'Turks', native: 'Türkçe', dir: 'ltr' },
  { code: 'ar', label: 'Arabisch', native: 'العربية', dir: 'rtl' },
  { code: 'pl', label: 'Pools', native: 'Polski', dir: 'ltr' },
  { code: 'el', label: 'Grieks', native: 'Ελληνικά', dir: 'ltr' },
  { code: 'es', label: 'Spaans', native: 'Español', dir: 'ltr' },
]

export const LANG_CODES = LANGS.map((l) => l.code)

const BY_CODE = Object.fromEntries(LANGS.map((l) => [l.code, l])) as Record<Lang, LangDef>

export const langDef = (code: Lang) => BY_CODE[code]
export const langLabel = (code: Lang) => BY_CODE[code]?.label ?? code
export const langDir = (code: Lang) => BY_CODE[code]?.dir ?? 'ltr'
export const isLang = (v: unknown): v is Lang =>
  typeof v === 'string' && Object.hasOwn(BY_CODE, v)

/** Nederlands staat vast; dit zijn de talen waar de redacteur uit kiest (max 4). */
export const OPTIONAL_LANGS: Lang[] = ['en', 'de', 'fr', 'tr', 'ar', 'pl', 'el', 'es']
export const MAX_EXTRA_LANGS = 4

/**
 * Een zachte tint per taal, zodat de vrijstaande avatars in de kiesrij ergens
 * op staan en je de talen uit elkaar houdt (CHANGES-03 D16). Letterlijke
 * classnamen: de Tailwind-scanner leest broncode als tekst.
 */
const TINT: Record<Lang, string> = {
  nl: 'bg-turq-tint',
  en: 'bg-blue-tint',
  de: 'bg-violet-tint',
  fr: 'bg-pink-tint',
  tr: 'bg-orange-tint',
  ar: 'bg-green-tint',
  pl: 'bg-blue-tint',
  el: 'bg-turq-tint',
  es: 'bg-orange-tint',
}

export const langTint = (code: Lang) => TINT[code] ?? 'bg-gray-6'
