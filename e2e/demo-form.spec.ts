import { test, expect } from '@playwright/test'

test.describe('Demo Formu (/demo)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demo')
  })

  test('sayfa yuklenebilmeli ve form gorunmeli', async ({ page }) => {
    await expect(page.locator('h2', { hasText: 'Franchise Bilgi Formu' })).toBeVisible()
    await expect(page.locator('input[placeholder="Ad Soyad"]')).toBeVisible()
    await expect(page.locator('input[placeholder="E-posta"]')).toBeVisible()
    await expect(page.locator('input[placeholder="Telefon"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  test('bos form gonderilemez (required alanlari kontrol)', async ({ page }) => {
    // HTML5 required validation — form submit click should not navigate away
    const submitBtn = page.locator('button[type="submit"]')
    await submitBtn.click()
    // Page should still be on /demo since required fields are empty
    await expect(page).toHaveURL(/\/demo/)
    await expect(page.locator('h2', { hasText: 'Franchise Bilgi Formu' })).toBeVisible()
  })

  test('formu doldur ve gonder — basari mesaji kontrol', async ({ page }) => {
    // API'yi mock'la — gercek Supabase baglantisina ihtiyac yok
    await page.route('**/api/demo-requests', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true, id: 'mock-id' }),
      })
    })

    await page.fill('input[placeholder="Ad Soyad"]', 'Test Kullanici')
    await page.fill('input[placeholder="E-posta"]', 'test@example.com')
    await page.fill('input[placeholder="Telefon"]', '05551234567')
    await page.fill('input[placeholder*="Tesis türü"]', 'Cimnastik')
    await page.fill('input[placeholder*="ehir"]', 'Istanbul')
    await page.fill('input[placeholder*="Firma"]', 'Test Firma')

    await page.locator('button[type="submit"]').click()

    // Basari mesaji goruntulenmeli
    await expect(page.locator('text=Basvurunuz alindi')).toBeVisible({ timeout: 10_000 })
  })

  test('API hatasi durumunda alert gosterilmeli', async ({ page }) => {
    await page.route('**/api/demo-requests', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: false, error: 'Kayit sirasinda hata olustu.' }),
      })
    })

    // dialog handler'i onceden kaydet
    page.on('dialog', async (dialog) => {
      expect(dialog.message()).toContain('hata')
      await dialog.accept()
    })

    await page.fill('input[placeholder="Ad Soyad"]', 'Test')
    await page.fill('input[placeholder="E-posta"]', 'test@example.com')

    await page.locator('button[type="submit"]').click()
  })

  test('hero bolumu ve ozellik kartlari gorunmeli', async ({ page }) => {
    await expect(page.locator('h1', { hasText: 'Cimnastik Tesisi Franchise Sistemi' })).toBeVisible()
    await expect(page.locator('text=Robot Yönetimi')).toBeVisible()
    await expect(page.locator('text=Veri ile Eğitim')).toBeVisible()
    await expect(page.locator('text=Franchise Vitrin')).toBeVisible()
  })
})
