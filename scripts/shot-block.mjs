/** Screenshot van precies één KitBlock, op ware grootte. */
import { chromium } from 'playwright'

const [base, tab, heading, out] = process.argv.slice(2)
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
await page.goto(`${base}#/kit`, { waitUntil: 'load' })
await page.getByRole('button', { name: tab, exact: true }).click()
await page.waitForTimeout(500)

// De h2 zelf pakken en daarvan de dichtstbijzijnde section, anders wint de
// buitenste section van het hele paneel.
const block = page.getByRole('heading', { level: 2, name: heading, exact: true })
  .locator('xpath=ancestor::section[1]')
await block.scrollIntoViewIfNeeded()
await page.waitForTimeout(400)
await block.screenshot({ path: out })
await browser.close()
console.log(out)
