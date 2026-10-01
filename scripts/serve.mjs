/**
 * Minimale statische server voor de controlescripts.
 *
 * Sinds de build een map is in plaats van één bestand werkt file:// niet
 * meer: een module-script uit een los bestand valt dan over CORS. Elk
 * controlescript serveert dist daarom zelf op een vrije poort.
 */
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { join, extname, normalize } from 'node:path'

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mp3': 'audio/mpeg',
  '.woff2': 'font/woff2',
  '.md': 'text/markdown; charset=utf-8',
}

export async function serveer(map = 'dist') {
  const server = createServer(async (req, res) => {
    // Alles wat geen bestand is valt terug op index.html, net als op Vercel.
    const pad = normalize(decodeURIComponent((req.url ?? '/').split('?')[0]))
    let bestand = join(map, pad === '/' ? 'index.html' : pad)
    try {
      if ((await stat(bestand)).isDirectory()) bestand = join(bestand, 'index.html')
    } catch {
      bestand = join(map, 'index.html')
    }
    try {
      const inhoud = await readFile(bestand)
      res.writeHead(200, { 'content-type': TYPES[extname(bestand)] ?? 'application/octet-stream' })
      res.end(inhoud)
    } catch {
      res.writeHead(404).end('niet gevonden')
    }
  })

  await new Promise((klaar) => server.listen(0, '127.0.0.1', klaar))
  const { port } = server.address()
  const stop = () => new Promise((klaar) => server.close(klaar))
  process.on('exit', () => server.close())
  return { url: `http://127.0.0.1:${port}`, stop }
}
