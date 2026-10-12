import type { Lang } from '../state/types'

/**
 * De tekst op de balk van de widget, per taal. Hij wisselt door de gekozen
 * talen heen, zodat een bezoeker zijn eigen taal voorbij ziet komen
 * (CHANGES-05 B4).
 */
export const WIDGET_TEKST: Record<Lang, string> = {
  nl: 'Videovertaling',
  en: 'Video translation',
  de: 'Videoübersetzung',
  fr: 'Traduction vidéo',
  tr: 'Video çevirisi',
  ar: 'ترجمة الفيديو',
  pl: 'Tłumaczenie wideo',
  el: 'Μετάφραση βίντεο',
  es: 'Traducción de vídeo',
}

/** Hoe lang één taal blijft staan, en hoe lang de overgang duurt. */
export const WIDGET_TAAL_MS = 2500
export const WIDGET_FADE_MS = 400
