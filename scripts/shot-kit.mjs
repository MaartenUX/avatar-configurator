/** Screenshot van één kit-tabblad, om een onderdeel goed te kunnen bekijken. */
import { chromium } from 'playwright'

const base = process.argv[2]
const tab = process.argv[3] ?? 'Domein'
const out = process.argv[4] ?? `shots/kit-${tab.toLowerCase()}.png`

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto(`${base}#/kit`, { waitUntil: 'load' })
await page.getByRole('button', { name: tab, exact: true }).click()
await page.waitForTimeout(600)
await page.screenshot({ path: out, fullPage: true })
await browser.close()
console.log(out)
