/** Scrollt naar een element met ruimte voor de sticky balk erboven. */
export const scrollToId = (id: string) => {
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
