import { test, expect } from '@playwright/test'

test('anasayfa yuklenebilmeli', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/.*/)
})
