/**
 * Deterministische balkhoogtes per id, zodat dezelfde audio er bij elke render
 * hetzelfde uitziet en niet flikkert.
 */
export function waveformBars(id: string, count = 40): number[] {
  let seed = 0
  for (let i = 0; i < id.length; i++) seed = (seed * 31 + id.charCodeAt(i)) | 0

  const bars: number[] = []
  let x = Math.abs(seed) || 1
  for (let i = 0; i < count; i++) {
    x = (x * 1103515245 + 12345) & 0x7fffffff
    // Een sinus eroverheen geeft het golvende verloop van echte spraak.
    const envelope = 0.55 + 0.45 * Math.sin((i / count) * Math.PI * 3)
    bars.push(0.15 + ((x % 1000) / 1000) * 0.85 * envelope)
  }
  return bars
}
