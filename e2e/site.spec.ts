import { expect, test } from '@playwright/test'

const routes = [
  ['/home', 'Masterpiece comes with immaculate craftsmanship'],
  ['/archive', 'Archive'],
  ['/service', 'Commissions are temporarily closed'],
  ['/policies', 'Terms of Service'],
  ['/unknown', 'Page not found'],
] as const

for (const [route, heading] of routes) {
  test(`opens and reloads ${route} with working assets and no horizontal overflow`, async ({ page }) => {
    const errors: string[] = []
    const failedAssets: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    page.on('response', (response) => {
      // Reloads may validate cached assets with 304 rather than a new 200 body.
      if (new URL(response.url()).pathname.startsWith('/assets/') && response.status() >= 400) failedAssets.push(response.url())
    })
    await page.goto(route)
    await expect(page.getByRole('heading', { name: heading, exact: true })).toBeAttached()
    await page.reload()
    await expect(page.getByRole('heading', { name: heading, exact: true })).toBeAttached()
    const images = page.locator('img')
    for (const image of await images.all()) {
      await image.scrollIntoViewIfNeeded()
      await expect.poll(() => image.evaluate((element) => {
        const img = element as HTMLImageElement
        return img.complete && img.naturalWidth > 0
      })).toBe(true)
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
    expect(errors).toEqual([])
    expect(failedAssets).toEqual([])
  })
}

test('navigates between the public pages and restores browser history', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveURL(/\/home$/)
  await page.getByRole('navigation').getByRole('link', { name: 'Service' }).click()
  await expect(page.getByRole('heading', { name: 'Commissions are temporarily closed' })).toBeVisible()
  await page.getByRole('link', { name: 'View archive' }).click()
  await expect(page.locator('.archive-item img')).toHaveCount(19)
  await page.goBack()
  await expect(page.getByRole('heading', { name: 'Commissions are temporarily closed' })).toBeVisible()
  await page.getByRole('link', { name: 'Back home' }).click()
  await expect(page).toHaveURL(/\/home$/)
})

test('supports keyboard navigation through the header', async ({ page }) => {
  await page.goto('/home')
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'GLEWORKS' })).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(page.getByRole('navigation').getByRole('link', { name: 'Service' })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('heading', { name: 'Commissions are temporarily closed' })).toBeVisible()
})

test('opens a policy from the footer and selects another section', async ({ page }) => {
  await page.goto('/home')
  await page.getByRole('contentinfo').getByRole('link', { name: 'Return Policy' }).click()
  await expect(page).toHaveURL(/\/policies#return-policy$/)
  await expect(page.locator('.policies-sidebar').getByRole('link', { name: 'Return Policy' })).toHaveClass('active')
  await expect(page.locator('#return-policy h1')).toBeInViewport()
  await page.locator('.policies-sidebar').getByRole('link', { name: 'Privacy Policy' }).click()
  await expect(page.locator('#privacy-policy h1')).toBeInViewport()
})
