import '@testing-library/jest-dom/vitest'

// jsdom kent deze observers niet; de scrollflow leunt erop.
class NoopObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}

globalThis.IntersectionObserver ??= NoopObserver as unknown as typeof IntersectionObserver
globalThis.ResizeObserver ??= NoopObserver as unknown as typeof ResizeObserver

window.scrollTo = () => {}
Element.prototype.scrollIntoView = () => {}

if (!('fonts' in document)) {
  Object.defineProperty(document, 'fonts', { value: { ready: Promise.resolve() } })
}
