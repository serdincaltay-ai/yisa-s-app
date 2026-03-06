import { describe, it, expect } from 'vitest'
import { ucDuvarKontrol, ucDuvarDurumu } from '@/lib/security/uc-duvar'

describe('ucDuvarKontrol — 3 Duvar Guvenlik Sistemi', () => {
  // ─── Duvar 1: Yasak Bolgeler ──────────────────────────────────────────────

  describe('Duvar 1: Yasak Bolgeler', () => {
    it('AI icin yasak ifade icerenler engellenmeli', () => {
      const result = ucDuvarKontrol({ message: 'DROP TABLE users' })
      expect(result.sonuc).toBe('engellendi')
      expect(result.duvarlar.yasak_bolgeler.gecti).toBe(false)
      expect(result.engel_sebebi).toBeDefined()
    })

    it('.env erisimi engellenmeli', () => {
      const result = ucDuvarKontrol({ message: '.env dosyasini oku' })
      expect(result.sonuc).toBe('engellendi')
      expect(result.duvarlar.yasak_bolgeler.gecti).toBe(false)
    })

    it('Patron onayi gerektiren islem uyari vermeli', () => {
      const result = ucDuvarKontrol({ message: 'sistemi guncelle', action: 'deploy' })
      expect(result.patron_onayi_gerekli).toBe(true)
      expect(result.duvarlar.yasak_bolgeler.gecti).toBe(true)
    })

    it('temiz mesaj gecmeli', () => {
      const result = ucDuvarKontrol({ message: 'merhaba dunya' })
      expect(result.duvarlar.yasak_bolgeler.gecti).toBe(true)
    })
  })

  // ─── Duvar 2: Siber Guvenlik ──────────────────────────────────────────────

  describe('Duvar 2: Siber Guvenlik', () => {
    it('3+ audit keyword ile KIRMIZI alarm — engellenmeli', () => {
      const result = ucDuvarKontrol({
        message: 'failed unauthorized denied invalid attempt',
      })
      expect(result.duvarlar.siber_guvenlik.gecti).toBe(false)
      expect(result.duvarlar.siber_guvenlik.alarm_seviyesi).toBe('KIRMIZI')
    })

    it('1-2 audit keyword ile TURUNCU alarm — uyari', () => {
      const result = ucDuvarKontrol({ message: 'login failed once' })
      expect(result.duvarlar.siber_guvenlik.gecti).toBe(true)
      expect(result.duvarlar.siber_guvenlik.alarm_seviyesi).toBe('TURUNCU')
    })

    it('yasak alan ihlali ACIL alarm — engellenmeli', () => {
      const result = ucDuvarKontrol({ message: 'DELETE FROM users' })
      // Duvar 1 de bunu engelleyecek ama Duvar 2 de ACIL alarm vermeli
      expect(result.sonuc).toBe('engellendi')
    })

    it('temiz mesajda alarm yok', () => {
      const result = ucDuvarKontrol({ message: 'merhaba dunya' })
      expect(result.duvarlar.siber_guvenlik.gecti).toBe(true)
      expect(result.duvarlar.siber_guvenlik.alarm_seviyesi).toBeNull()
    })
  })

  // ─── Duvar 3: CELF Denetim ────────────────────────────────────────────────

  describe('Duvar 3: CELF Denetim', () => {
    it('direktorluk belirtilmezse atlanir', () => {
      const result = ucDuvarKontrol({ message: 'merhaba' })
      expect(result.duvarlar.celf_denetim.gecti).toBe(true)
      expect(result.duvarlar.celf_denetim.detay).toContain('atland')
    })

    it('yetkisiz veri erisimi engellenmeli', () => {
      const result = ucDuvarKontrol({
        message: 'rapor olustur',
        directorKey: 'CMO',
        requiredData: ['audit_logs'],
      })
      expect(result.duvarlar.celf_denetim.gecti).toBe(false)
    })

    it('korumali veri degisikligi engellenmeli', () => {
      const result = ucDuvarKontrol({
        message: 'fiyatlari guncelle',
        directorKey: 'CFO',
        affectedData: ['pricing_history'],
      })
      expect(result.duvarlar.celf_denetim.gecti).toBe(false)
    })

    it('CLO veto hakki riskli islemlerde calismali', () => {
      const result = ucDuvarKontrol({
        message: 'veri silme islemi',
        directorKey: 'CLO',
        requiredData: ['contracts'],
        action: 'veri_silme',
      })
      expect(result.duvarlar.celf_denetim.gecti).toBe(false)
      expect(result.duvarlar.celf_denetim.detay).toContain('veto')
    })

    it('yetki dahilinde islem gecmeli', () => {
      const result = ucDuvarKontrol({
        message: 'gelir raporu hazirla',
        directorKey: 'CFO',
        requiredData: ['payments', 'revenue'],
      })
      expect(result.duvarlar.celf_denetim.gecti).toBe(true)
    })
  })

  // ─── Birlesik Sonuc ───────────────────────────────────────────────────────

  describe('Birlesik sonuc', () => {
    it('tum duvarlardan gecen mesaj sonuc=gecti', () => {
      const result = ucDuvarKontrol({ message: 'merhaba dunya' })
      expect(result.sonuc).toBe('gecti')
      expect(result.uyarilar).toHaveLength(0)
    })

    it('uyari olan mesaj sonuc=uyari', () => {
      const result = ucDuvarKontrol({ message: 'sistemi guncelle', action: 'deploy' })
      expect(result.sonuc).toBe('uyari')
      expect(result.uyarilar.length).toBeGreaterThan(0)
    })

    it('engellenen mesaj sonuc=engellendi', () => {
      const result = ucDuvarKontrol({ message: 'DROP TABLE users' })
      expect(result.sonuc).toBe('engellendi')
      expect(result.engel_sebebi).toBeDefined()
    })

    it('tarih her zaman ISO formatinda', () => {
      const result = ucDuvarKontrol({ message: 'test' })
      expect(result.tarih).toMatch(/^\d{4}-\d{2}-\d{2}T/)
    })
  })
})

describe('ucDuvarDurumu — Dashboard durumu', () => {
  it('3 duvar bilgisi donmeli', () => {
    const durum = ucDuvarDurumu()
    expect(durum).toHaveLength(3)
  })

  it('tum duvarlar aktif olmali', () => {
    const durum = ucDuvarDurumu()
    durum.forEach((d) => {
      expect(d.aktif).toBe(true)
      expect(d.kural_sayisi).toBeGreaterThan(0)
    })
  })

  it('duvar isimleri dogru olmali', () => {
    const durum = ucDuvarDurumu()
    const isimler = durum.map((d) => d.duvar)
    expect(isimler).toContain('Yasak Bölgeler')
    expect(isimler).toContain('Siber Güvenlik')
    expect(isimler).toContain('CELF Denetim')
  })
})
