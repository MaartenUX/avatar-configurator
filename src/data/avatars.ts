import type { AvatarDef } from './types'

/**
 * Per taal een vrouw en een man, met namen en stemmen die bij de taal passen.
 * De voorbeeldzin klinkt bij het aanklikken en staat in de taal zelf, zodat je
 * hoort én ziet wat een inwoner straks krijgt.
 *
 * Gezichten mogen tussen talen hergebruikt worden; de set per taal ligt vast.
 * Portretten komen uit src/assets/avatars/{id}.png — ontbreekt het bestand,
 * dan valt Avatar terug op een getekend portret.
 */
export const AVATARS: AvatarDef[] = [
  // Nederlands
  {
    id: 'nl-sanne', lang: 'nl', name: 'Sanne', gender: 'v', advised: true,
    keywords: ['rustig', 'warm', 'duidelijk'],
    sampleSentence: 'Goedendag. Ik leg u in het kort uit hoe dit werkt.',
  },
  {
    id: 'nl-daan', lang: 'nl', name: 'Daan', gender: 'm',
    keywords: ['zakelijk', 'lage stem', 'kalm'],
    sampleSentence: 'Goedendag. Ik leg u in het kort uit hoe dit werkt.',
  },

  // Engels
  {
    id: 'en-emma', lang: 'en', name: 'Emma', gender: 'v', advised: true,
    keywords: ['helder', 'vriendelijk', 'neutraal accent'],
    sampleSentence: 'Hello. Let me briefly explain how this works.',
  },
  {
    id: 'en-james', lang: 'en', name: 'James', gender: 'm',
    keywords: ['warm', 'rustig tempo', 'lage stem'],
    sampleSentence: 'Hello. Let me briefly explain how this works.',
  },

  // Duits
  {
    id: 'de-lena', lang: 'de', name: 'Lena', gender: 'v',
    keywords: ['helder', 'vriendelijk', 'precies'],
    sampleSentence: 'Guten Tag. Ich erkläre Ihnen kurz, wie das funktioniert.',
  },
  {
    id: 'de-jonas', lang: 'de', name: 'Jonas', gender: 'm', advised: true,
    keywords: ['zakelijk', 'betrouwbaar', 'rustig'],
    sampleSentence: 'Guten Tag. Ich erkläre Ihnen kurz, wie das funktioniert.',
  },

  // Frans
  {
    id: 'fr-camille', lang: 'fr', name: 'Camille', gender: 'v', advised: true,
    keywords: ['warm', 'vloeiend', 'vriendelijk'],
    sampleSentence: 'Bonjour. Je vous explique brièvement comment cela fonctionne.',
  },
  {
    id: 'fr-louis', lang: 'fr', name: 'Louis', gender: 'm',
    keywords: ['kalm', 'lage stem', 'formeel'],
    sampleSentence: 'Bonjour. Je vous explique brièvement comment cela fonctionne.',
  },

  // Turks
  {
    id: 'tr-zeynep', lang: 'tr', name: 'Zeynep', gender: 'v', advised: true,
    keywords: ['warm', 'duidelijk', 'geduldig'],
    sampleSentence: 'Merhaba. Size bunun nasıl işlediğini kısaca anlatayım.',
  },
  {
    id: 'tr-mehmet', lang: 'tr', name: 'Mehmet', gender: 'm',
    keywords: ['zakelijk', 'rustig', 'lage stem'],
    sampleSentence: 'Merhaba. Size bunun nasıl işlediğini kısaca anlatayım.',
  },

  // Arabisch
  {
    id: 'ar-nour', lang: 'ar', name: 'Nour', gender: 'v',
    keywords: ['zacht', 'duidelijk', 'geduldig'],
    sampleSentence: 'مرحباً. سأشرح لك باختصار كيف يعمل هذا.',
  },
  {
    id: 'ar-omar', lang: 'ar', name: 'Omar', gender: 'm', advised: true,
    keywords: ['warm', 'rustig tempo', 'vertrouwd'],
    sampleSentence: 'مرحباً. سأشرح لك باختصار كيف يعمل هذا.',
  },

  // Pools
  {
    id: 'pl-zofia', lang: 'pl', name: 'Zofia', gender: 'v', advised: true,
    keywords: ['helder', 'vriendelijk', 'rustig'],
    sampleSentence: 'Dzień dobry. Wyjaśnię pokrótce, jak to działa.',
  },
  {
    id: 'pl-jakub', lang: 'pl', name: 'Jakub', gender: 'm',
    keywords: ['zakelijk', 'kalm', 'lage stem'],
    sampleSentence: 'Dzień dobry. Wyjaśnię pokrótce, jak to działa.',
  },

  // Grieks
  {
    id: 'el-eleni', lang: 'el', name: 'Eleni', gender: 'v', advised: true,
    keywords: ['warm', 'duidelijk', 'vriendelijk'],
    sampleSentence: 'Καλημέρα. Θα σας εξηγήσω σύντομα πώς λειτουργεί αυτό.',
  },
  {
    id: 'el-nikos', lang: 'el', name: 'Nikos', gender: 'm',
    keywords: ['rustig', 'lage stem', 'zakelijk'],
    sampleSentence: 'Καλημέρα. Θα σας εξηγήσω σύντομα πώς λειτουργεί αυτό.',
  },

  // Spaans
  {
    id: 'es-lucia', lang: 'es', name: 'Lucía', gender: 'v', advised: true,
    keywords: ['warm', 'vlot', 'vriendelijk'],
    sampleSentence: 'Hola. Le explico brevemente cómo funciona esto.',
  },
  {
    id: 'es-mateo', lang: 'es', name: 'Mateo', gender: 'm',
    keywords: ['kalm', 'duidelijk', 'lage stem'],
    sampleSentence: 'Hola. Le explico brevemente cómo funciona esto.',
  },
]

const BY_LANG = AVATARS.reduce<Record<string, AvatarDef[]>>((acc, a) => {
  ;(acc[a.lang] ??= []).push(a)
  return acc
}, {})

export const avatarsFor = (lang: string) => BY_LANG[lang] ?? []
export const avatarById = (id?: string) => AVATARS.find((a) => a.id === id)
export const advisedFor = (lang: string) => avatarsFor(lang).find((a) => a.advised)

/**
 * Waarom deze avatar de aanbeveling is. Verschilt per taal: in Duitsland wordt
 * een mannenstem als betrouwbaarder ervaren, in Nederland juist een vrouwenstem.
 */
export const ADVICE: Partial<Record<string, string>> = {
  nl: 'In Nederland wordt een vrouwenstem bij informatieve teksten als betrouwbaar ervaren.',
  en: 'Een neutraal accent werkt het best voor lezers die Engels als tweede taal spreken.',
  de: 'In Duitsland wordt een mannenstem bij overheidsinformatie als betrouwbaarder ervaren.',
  fr: 'Een warme vrouwenstem sluit aan bij de toon van Franse overheidscommunicatie.',
  tr: 'Turkse kijkers waarderen een geduldig tempo; Zeynep spreekt rustiger dan gemiddeld.',
  ar: 'Bij Arabische uitleg wordt een mannenstem het vaakst gekozen voor formele onderwerpen.',
  pl: 'Poolse kijkers kiezen meestal een heldere vrouwenstem bij praktische uitleg.',
  el: 'Een warme vrouwenstem wordt in Griekenland het vaakst gekozen bij publieksinformatie.',
  es: 'Een vlotte vrouwenstem sluit aan bij hoe Spaanse gemeenten hun uitleg brengen.',
}
