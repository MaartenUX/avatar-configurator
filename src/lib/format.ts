/** "8 van 10 credits" */
export const creditsLabel = (used: number, total: number) =>
  `${Math.max(0, total - used)} van ${total} credits`

export const wordCount = (text: string) =>
  text.trim() ? text.trim().split(/\s+/).length : 0

/** "0:14" -> 14 */
export const parseTimecode = (t: string) => {
  const [m, s] = t.split(':').map(Number)
  return (m || 0) * 60 + (s || 0)
}

export const formatTimecode = (sec: number) =>
  `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, '0')}`

const MONTHS = [
  'januari', 'februari', 'maart', 'april', 'mei', 'juni',
  'juli', 'augustus', 'september', 'oktober', 'november', 'december',
]

/** "9 september" — kort, zoals in de LockedBanner. */
export const formatDateNl = (iso: string) => {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`
}

export const formatNumber = (n: number) => n.toLocaleString('nl-NL')

/** "nog 12 min" of "nog 45 sec" onder de minuut. */
export const formatEta = (minutes: number) =>
  minutes >= 1 ? `nog ${minutes} min` : 'bijna klaar'
