import { test, expect } from '@playwright/test'

test.describe('Giris Sayfasi (/auth/login)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login')
  })

  test('giris formu yuklenebilmeli', async ({ page }) => {
    await expect(page.locator('h1', { hasText: 'Giris Yap' })).toBeVisible()
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  test('gecersiz giris — hata mesaji gosterilmeli', async ({ page }) => {
    // Supabase auth mock'u — gecersiz kimlik hatasi
    await page.route('**/auth/v1/token*', async (route) => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'invalid_grant',
          error_description: 'Invalid login credentials',
        }),
      })
    })

    await page.fill('input[type="email"]', 'gecersiz@test.com')
    await page.fill('input[type="password"]', 'yanlis-sifre')
    await page.locator('button[type="submit"]').click()

    // Turkce hata mesaji goruntulenmeli
    await expect(page.locator('text=E-posta veya şifre hatalı')).toBeVisible({ timeout: 10_000 })
  })

  test('bos form gonderilemez', async ({ page }) => {
    const submitBtn = page.locator('button[type="submit"]')
    await submitBtn.click()
    // required alanlari bos — sayfa degismemeli
    await expect(page).toHaveURL(/\/auth\/login/)
    await expect(page.locator('h1', { hasText: 'Giris Yap' })).toBeVisible()
  })

  test('sifre sifirlama linki gorunmeli', async ({ page }) => {
    await expect(page.locator('text=Şifrenizi mi unuttunuz')).toBeVisible()
    await expect(page.locator('text=Şifre sıfırlama e-postası al')).toBeVisible()
  })

  test('kayit ol linki gorunmeli', async ({ page }) => {
    await expect(page.locator('text=Hesabiniz yok mu')).toBeVisible()
    const kayitLink = page.locator('a[href="/auth/sign-up"]')
    await expect(kayitLink).toBeVisible()
    await expect(kayitLink).toHaveText('Kayit olun')
  })

  test('sifre sifirlama — e-posta bos ise hata mesaji', async ({ page }) => {
    // E-posta alani bos birakilip sifre sifirlama butonu tiklanir
    await page.locator('text=Şifre sıfırlama e-postası al').click()
    await expect(page.locator('text=Şifre sıfırlama için önce e-posta adresinizi girin')).toBeVisible({
      timeout: 5_000,
    })
  })

  test('yetkisiz erisim uyarisi goruntulenmeli', async ({ page }) => {
    await page.goto('/auth/login?unauthorized=1')
    await expect(page.locator('text=Yetkisiz erişim')).toBeVisible()
  })
})
