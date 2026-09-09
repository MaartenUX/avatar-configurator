/** Screenshot van één blok op /kit, op ware grootte. */
import { chromium } from 'playwright'

const [base, tab, heading, out] = process.argv.slice(2)
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto(`${base}#/kit`, { waitUntil: 'load' })
await page.getByRole('button', { name: tab, exact: true }).click()
await page.waitForTimeout(500)
const section = page.locator('section').filter({ has: page.getByRole('heading', { name: heading, exact: true }) }).first()
await section.scrollIntoViewIfNeeded()
await page.waitForTimeout(300)
await section.screenshot({ path: out })
await browser.close()
console.log(out)
