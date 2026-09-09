import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile()],
  build: {
    // Zonder dit emit Vite assets als losse bestanden en breekt de single-file
    // build stilletjes: dist/index.html verwijst dan naar buren die er niet zijn.
    assetsInlineLimit: Number.MAX_SAFE_INTEGER,
    cssCodeSplit: false,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/__tests__/setup.ts'],
  },
})
