import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Geen single-file meer: de video's uit public/media maken één bestand
    // onwerkbaar groot. De build is nu een map die Vercel serveert.
    // Dit past PLAN paragraaf 3 en 11 aan.
    assetsInlineLimit: 4096,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/__tests__/setup.ts'],
  },
})
