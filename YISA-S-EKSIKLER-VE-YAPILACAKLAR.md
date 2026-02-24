# YiSA-S EKSIKLER ANALIZI ve YAPILACAKLAR LISTESI

**Tarih:** 24 Subat 2026
**Durum:** Mevcut proje analizi sonrasi tespit edilen eksiklikler ve oncelikli yapilacaklar

---

## A. TAMAMLANAN ISLER (MEVCUT DURUM)

### A1. Altyapi (TAMAMLANDI)
- 3 repo olusturuldu ve Vercel'e deploy edildi
- Supabase veritabani 60+ tablo ile kuruldu
- RLS (Row Level Security) aktif
- Supabase Auth (JWT + Session) calisiyor
- CORS yapilandirmasi (yisa-s.com -> app.yisa-s.com) yapildi
- Subdomain yonetimi (franchise bazli) kuruldu

### A2. Patron Sistemi (BUYUK OLCUDE TAMAMLANDI)
- Patron dashboard (app-yisa-s + tenant-yisa-s)
- Patron komut sistemi (patron_commands tablosu + UI)
- Onay kuyrugu (approval_queue + UI)
- CELF motor sistemi (13 direktorluk)
- CEO gorev yonetimi (ceo_tasks)
- Beyin takimi (AI multi-provider chat)
- Robot hiyerarsisi (9 katman tanimli)
- Denetim kayitlari (audit_log, celf_audit_logs)
- Director kurallari (director_rules)
- COO kurallari ve zamanlanmis gorevler (coo_rules, ceo_routines)
- Vercel Cron: `/api/coo/run-due` (gunluk 02:00 UTC)

### A3. AI Entegrasyonu (TAMAMLANDI)
- Claude (Anthropic) - derin analiz, denetci, NeebChat varsayilan
- GPT-4o (OpenAI) - hizli iletisim, icerik uretimi
- Gemini (Google) - gorsel analiz
- Together AI - ekonomik rutin gorevler (Llama 3.1)
- V0 (Vercel) - UI bileseni uretimi
- Cursor - kod uretimi
- Fal AI - gorsel uretim (Flux/Schnell)

### A4. Vitrin Sitesi (BUYUK OLCUDE TAMAMLANDI)
- Landing page (hero, features, pricing, CTA)
- Demo talep formu
- Franchise basvuru formu
- NeebChat robot (sohbet widget)
- CRM sistemi (crm_contacts, crm_activities, lead stages)
- SEO: sitemap.ts ve robots.ts mevcut
- Admin panel (/panel: demo listesi, bayilik listesi)

### A5. Franchise/Panel Sistemi (KISMI)
- Franchise panel sayfasi (tenant-yisa-s /panel/*)
- Ogrenci yonetimi, yoklama, odemeler, program, aidat sayfalari
- Veli paneli (cocuk, gelisim, kredi, duyurular)
- Antrenor paneli (sporcular, yoklama, olcum)
- Kasa defteri + rapor
- Sozlesme ekranlari (franchise, personel, veli)

### A6. Guvenlik (TAMAMLANDI)
- 3 duvar siber guvenlik sistemi
- Yasak bolgeler (forbidden-zones)
- Patron kilidi (patron-lock)
- Guvenlik loglari (security_logs - severity seviyeleri)
- API auth middleware
- Rate limiting (app-yisa-s)
- CORS preflight handling

---

## B. EKSIKLER VE SORUNLAR

### B1. Test Altyapisi (KRITIK - HIC YOK)
- **Hicbir repoda test dosyasi yok** (unit test, integration test, e2e test)
- Test framework'u kurulmamis (Jest, Vitest, Playwright, Cypress)
- `package.json`'larda test script'i yok
- CI/CD pipeline'da test asamasi yok
- **Etki:** Refactoring ve yeni ozellik eklerken regresyon riski cok yuksek

### B2. Odeme Sistemi (KRITIK - ENTEGRASYON YOK)
- `.env.example`'da Stripe ve PayTR degiskenleri tanimli
- **Ancak hicbir API route'unda gercek odeme entegrasyonu yok**
- Stripe webhook handler yok
- PayTR callback handler yok
- Odeme onay/iptal akisi implemente edilmemis
- `payments` tablosu var ama API baglantisi yok
- **Etki:** Franchise'lardan aidat/odeme tahsilati yapilamiyor

### B3. SMS Sistemi (EKSIK - ENTEGRASYON KISMI)
- `lib/sms-provider.ts` dosyasi var (TODO iceriyor)
- `lib/sms-triggers.ts` tetikleyiciler tanimli
- **Ancak API route'larinda gercek SMS gonderim endpoint'i yok**
- Twilio/Netgsm gercek entegrasyonu test edilmemis
- **Etki:** Otomatik SMS bildirimleri calismiyor

### B4. Email Sistemi (KISMI)
- Resend entegrasyonu sadece `app-yisa-s/lib/emails/resend.ts`'de
- Demo request onayinda email gonderimi var
- **Ancak genel bildirim email'leri yok** (yoklama hatirlatma, odeme hatirlatma, vb.)
- Email sablonlari tanimli degil
- **Etki:** Otomatik email bildirimleri sinirli

### B5. CI/CD Pipeline (EKSIK)
- Sadece `tenant-yisa-s`'de `.github/workflows` var
- `app-yisa-s` ve `yisa-s-com`'da CI/CD pipeline yok
- Test asamasi hicbir repoda yok
- Lint kontrolu CI'da calisiyor mu belirsiz
- Otomatik deploy sonrasi smoke test yok
- **Etki:** Hatali kod production'a gidebilir

### B6. i18n / Coklu Dil Destegi (HIC YOK)
- Tum icerik Turkce hardcode
- i18n kutuphanesi (next-intl, next-i18next vb.) kullanilmiyor
- Uluslararasi franchise'lar icin coklu dil destegi yok
- **Etki:** Sadece Turkce konusan kullanicilar kullanabilir

### B7. Hata Izleme / Monitoring (KISMI)
- `SENTRY_DSN` env var tanimli (.env.example)
- `lib/logger.ts` mevcut (app-yisa-s)
- **Ancak Sentry gercek entegrasyonu yapilmamis**
- Error boundary'ler sinirli
- Merkezi hata raporlama yok
- Uptime monitoring yok
- **Etki:** Production hatalari fark edilemeyebilir

### B8. Analytics / Kullanici Takibi (KISMI)
- `@vercel/analytics` (app-yisa-s) ve `@vercel/speed-insights` (tenant-yisa-s) paket olarak var
- **Google Analytics / Google Tag Manager entegrasyonu yok**
- Kullanici davranis izleme (heatmap, session replay) yok
- Donusum orani takibi yok
- **Etki:** Vitrin performansi ve kullanici davranisi olculemiyor

### B9. Bildirim Sistemi (EKSIK)
- Push notification altyapisi yok (Web Push API, Firebase Cloud Messaging)
- `sw.js` service worker dosyalari mevcut ama icerik minimal
- In-app bildirim sistemi yok
- Veli/antrenor icin otomatik bildirim akisi yok (yoklama sonucu, odeme hatirlatma)
- **Etki:** Kullanicilar onemli guncellemelerden haberdar olamiyor

### B10. Dokumantasyon (KISMI)
- `ENV_REHBERI` dokumani var (app-yisa-s)
- API dokumantasyonu yok (Swagger/OpenAPI)
- Kod ici JSDoc/TSDoc sinirli
- Gelistirici onboarding rehberi yok
- **Etki:** Yeni gelistiriciler projeye adapte olmakta zorlanir

### B11. Performans Optimizasyonu (BELIRSIZ)
- Image optimization: app-yisa-s'de `unoptimized: true` (Next.js image opt kapali)
- Bundle analysis yapilmamis
- Lazy loading / code splitting stratejisi belirsiz
- Database query optimizasyonu (index'ler) belirsiz
- **Etki:** Sayfa yukleme sureleri optimize olmayabilir

### B12. Backup / Disaster Recovery (EKSIK)
- Veritabani yedekleme stratejisi tanimli degil
- Supabase otomatik backup konfigurasyonu belirsiz
- Disaster recovery plani yok
- Rollback proseduru dokumante edilmemis
- **Etki:** Veri kaybi durumunda geri donus plani yok

---

## C. ONCELIKLI YAPILACAKLAR

### C1. ACIL (1-2 Hafta)

| # | Gorev | Oncelik | Repo | Tahmini Sure |
|---|-------|---------|------|--------------|
| 1 | **Odeme entegrasyonu** (Stripe veya PayTR) | P0 | tenant-yisa-s | 3-5 gun |
| 2 | **Test altyapisi kurulumu** (Vitest + Playwright) | P0 | Tum repolar | 2-3 gun |
| 3 | **Sentry hata izleme** entegrasyonu | P0 | Tum repolar | 1 gun |
| 4 | **CI/CD pipeline** (app-yisa-s + yisa-s-com) | P1 | app-yisa-s, yisa-s-com | 1 gun |

### C2. KISA VADE (2-4 Hafta)

| # | Gorev | Oncelik | Repo | Tahmini Sure |
|---|-------|---------|------|--------------|
| 5 | **SMS entegrasyonu** tamamlama (Twilio veya Netgsm) | P1 | tenant-yisa-s | 2 gun |
| 6 | **Email sablon sistemi** (odeme, yoklama, bildirim) | P1 | tenant-yisa-s | 2-3 gun |
| 7 | **Push notification** altyapisi (Web Push) | P2 | tenant-yisa-s | 3 gun |
| 8 | **Google Analytics** entegrasyonu (vitrin) | P2 | yisa-s-com | 1 gun |
| 9 | **API dokumantasyonu** (Swagger/OpenAPI) | P2 | Tum repolar | 2-3 gun |
| 10 | **Image optimization** aktiflestirilmesi | P2 | app-yisa-s | 0.5 gun |

### C3. ORTA VADE (1-2 Ay)

| # | Gorev | Oncelik | Repo | Tahmini Sure |
|---|-------|---------|------|--------------|
| 11 | **Backup stratejisi** ve disaster recovery plani | P2 | - | 2 gun |
| 12 | **Performans optimizasyonu** (bundle analysis, lazy loading) | P2 | Tum repolar | 3-5 gun |
| 13 | **Veli mobil deneyimi** iyilestirme (PWA) | P3 | tenant-yisa-s | 5 gun |
| 14 | **Raporlama modulu** (franchise performans, gelir/gider) | P3 | tenant-yisa-s | 5-7 gun |
| 15 | **Coklu dil destegi** (i18n) | P3 | Tum repolar | 7-10 gun |

### C4. UZUN VADE (3+ Ay)

| # | Gorev | Oncelik | Repo | Tahmini Sure |
|---|-------|---------|------|--------------|
| 16 | **Mobil uygulama** (React Native veya PWA+) | P3 | Yeni repo | 30+ gun |
| 17 | **Gelismis CRM** (pipeline, otomasyonlar) | P3 | yisa-s-com | 10-15 gun |
| 18 | **White-label franchise sistemi** | P4 | tenant-yisa-s | 15-20 gun |
| 19 | **Gelismis AI ozellikleri** (sporcu performans tahmini) | P4 | app-yisa-s | 10-15 gun |

---

## D. REPO BAZINDA OZET

### app-yisa-s
| Durum | Sayi |
|-------|------|
| Tamamlanan ozellikler | ~15 |
| Eksik/kismi ozellikler | ~6 |
| Kritik eksikler | Test yok, CI yok, Sentry yok |
| TODO/FIXME sayisi | 1 |

### tenant-yisa-s
| Durum | Sayi |
|-------|------|
| Tamamlanan ozellikler | ~25 |
| Eksik/kismi ozellikler | ~8 |
| Kritik eksikler | Test yok, odeme yok, SMS tamamlanmamis |
| TODO/FIXME sayisi | 1 |

### yisa-s-com
| Durum | Sayi |
|-------|------|
| Tamamlanan ozellikler | ~10 |
| Eksik/kismi ozellikler | ~4 |
| Kritik eksikler | Test yok, CI yok, Analytics yok |
| TODO/FIXME sayisi | 2 |

---

## E. ONCELIK KODLARI

| Kod | Anlam | Aciklama |
|-----|-------|----------|
| **P0** | Acil | Is akisini engelliyor, gelir kaybi riski |
| **P1** | Yuksek | Kullanici deneyimini olumsuz etkiliyor |
| **P2** | Orta | Iyilestirme, muhendislik kalitesi |
| **P3** | Dusuk | Gelecek ozellikler, genisleme |
| **P4** | Planlama | Uzun vadeli vizyon |

---

> **Not:** Bu analiz statik kod incelemesi ile yapilmistir. Canli Supabase veritabani ve Vercel deployment durumu ayrica kontrol edilmelidir.
