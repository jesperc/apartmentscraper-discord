export async function fetchHemnetData(url, puppeteer, stealthPlugin) {
  puppeteer.use(stealthPlugin())

  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()

  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 })

  const html = await page.evaluate(() => document.body.innerHTML)

  await browser.close()

  return html
}
