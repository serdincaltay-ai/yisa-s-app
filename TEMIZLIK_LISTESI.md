# YİSA-S — PROJE TEMİZLİK LİSTESİ

**Tarih:** 29 Ocak 2026  
**Patron:** Serdinç ALTAY  
**Kural:** SİLME — Sadece listele. Patron karar verecek.

---

# ADIM 1: PROJE DOSYALARI TARANDI

## A) GEREKLİ DOSYALAR (YİSA-S için şart)

### /app
| Dosya | Açıklama |
|-------|----------|
| app/layout.tsx | Ana layout |
| app/page.tsx | Giriş sayfası (login, canAccessDashboard) |
| app/globals.css | Global stiller |
| app/components/DashboardSidebar.tsx | Sidebar, NAV, çıkış |
| app/components/PatronApproval.tsx | Onayla / Reddet / Değiştir UI |
| app/dashboard/layout.tsx | Dashboard layout, auth kontrolü |
| app/dashboard/page.tsx | Ana panel, chat, Seçenek 2 flow, stats |
| app/dashboard/robots/page.tsx | 7 katman, CELF, CEO, COO, Vitrin, FLOW_DESCRIPTION |
| app/dashboard/facilities/page.tsx | Tesis sayfası |
| app/dashboard/franchises/page.tsx | Franchise listesi |
| app/dashboard/franchises/[id]/page.tsx | Franchise detay |
| app/dashboard/kasa-defteri/page.tsx | Kasa defteri |
| app/dashboard/messages/page.tsx | Mesajlar sayfası |
| app/dashboard/onay-kuyrugu/page.tsx | Onay kuyruğu |
| app/dashboard/reports/page.tsx | Raporlar |
| app/dashboard/sablonlar/page.tsx | Şablonlar |
| app/dashboard/settings/page.tsx | Ayarlar, FORBIDDEN_FOR_AI listesi |
| app/dashboard/users/page.tsx | Kullanıcı & Roller, ROLE_LEVELS |
| app/api/chat/route.ts | Tek Claude chat (eski mod) |
| app/api/chat/flow/route.ts | Seçenek 2 flow API (routeToAI) |
| app/api/stats/route.ts | Dashboard istatistikleri, Supabase |
| app/api/approvals/route.ts | Onay API |
| app/api/expenses/route.ts | Gider API |
| app/api/franchises/route.ts | Franchise API |
| app/api/templates/route.ts | Şablon API |

### /lib
| Dosya | Açıklama |
|-------|----------|
| lib/supabase.ts | Supabase client (auth, API'ler kullanıyor) |
| lib/ai-router.ts | Seçenek 2: QUALITY_FLOW, routeToAI, detectTaskType |
| lib/assistant/ai-router.ts | Basit routeTask (task-flow kullanıyor) |
| lib/assistant/task-flow.ts | startTaskFlow, FLOW_DESCRIPTION (dashboard/robots kullanıyor) |
| lib/auth/roles.ts | ROLE_LEVELS, ROLE_SYSTEM_13, canAccessDashboard |
| lib/security/patron-lock.ts | FORBIDDEN_FOR_AI, REQUIRE_PATRON_APPROVAL, checkPatronLock |
| lib/security/siber-guvenlik.ts | ALARM_SEVIYELERI, SIBER_GUVENLIK_KURALLARI |
| lib/archiving/veri-arsivleme.ts | SAKLAMA_SURELERI, AES-256, 02:00 |
| lib/robots/hierarchy.ts | ROBOT_HIERARCHY (7 katman) |
| lib/robots/celf-center.ts | CELF_DIRECTORATES (12 direktörlük) |
| lib/robots/ceo-robot.ts | CEO_RULES (deploy/commit kuralları) |
| lib/robots/coo-robot.ts | COO_OPERATIONS |
| lib/robots/yisas-vitrin.ts | VITRIN_ACTIONS |
| lib/data/franchises-seed.ts | FRANCHISE_SEED (stats, franchises API kullanıyor) |

---

## B) GEREKSİZ / DUPLICATE DOSYALAR

| Dosya | Durum | Açıklama |
|-------|--------|----------|
| lib/security/forbidden-zones.ts | **Re-export, kimse import etmiyor** | Sadece patron-lock'tan re-export yapıyor. Tüm import'lar doğrudan `patron-lock` kullanıyor. Talimat uyumlu isim için eklendi; silinirse sadece patron-lock kullanılmaya devam eder. |
| (duplicate dosya yok) | — | `lib/ai-router.ts` ile `lib/assistant/ai-router.ts` farklı: biri Seçenek 2 full flow, diğeri task-flow için basit routeTask. İkisi de kullanılıyor. |

---

## C) TEST AMAÇLI OLUŞTURULMUŞ

| Sonuç |
|-------|
| **Yok.** Projede `*.test.*`, `*.spec.*`, `*.bak`, `*.old` dosyası bulunmadı. |

---

# ADIM 2: PACKAGE.JSON KONTROL

## Bağımlılıklar (dependencies)

| Paket | Kullanım | Durum |
|-------|----------|--------|
| next | Proje çekirdeği | ✅ Gerekli |
| react, react-dom | UI | ✅ Gerekli |
| @supabase/supabase-js | Auth, API'ler (stats, approvals, expenses, franchises, templates), lib/supabase | ✅ Gerekli |
| lucide-react | Dashboard, Sidebar, PatronApproval, robots, tüm sayfa ikonları | ✅ Gerekli |
| **framer-motion** | **Hiçbir dosyada import yok** | ⚠️ **Kullanılmıyor — silinebilir** |

## DevDependencies

| Paket | Kullanım | Durum |
|-------|----------|--------|
| typescript, @types/* | TS | ✅ Gerekli |
| eslint, eslint-config-next | next lint | ✅ Gerekli |
| tailwindcss, postcss, autoprefixer | Stil | ✅ Gerekli |

## Çakışan versiyon

- **Yok.** next 14.2.35 ile eslint-config-next 14.2.35 uyumlu.

---

# ADIM 3: ÇAKIŞMA KONTROLÜ

## Aynı işi yapan birden fazla dosya

| Konu | Durum |
|------|--------|
| İki ai-router | Farklı roller: `lib/ai-router.ts` = Seçenek 2 (routeToAI, QUALITY_FLOW); `lib/assistant/ai-router.ts` = task-flow için routeTask. Çakışma yok. |
| patron-lock vs forbidden-zones | forbidden-zones sadece patron-lock re-export; kimse forbidden-zones import etmiyor. Çakışma yok. |

## Import hataları

- **Tespit edilmedi.** Tüm import'lar mevcut dosyalara gidiyor.

## Duplicate export

- **Yok.** forbidden-zones patron-lock'u re-export ediyor, aynı isimle iki kez export eden modül yok.

---

# ADIM 4: TEMİZLİK ÖNERİSİ

## SİLİNECEKLER (Patron onayı sonrası)

| # | Öneri | Gerekçe |
|---|--------|--------|
| 1 | **package.json:** `framer-motion` dependency satırını kaldır | Projede hiçbir yerde import edilmiyor. |
| 2 | **lib/security/forbidden-zones.ts** (isteğe bağlı) | Kimse bu dosyadan import etmiyor; tüm kullanım `patron-lock` üzerinden. Talimat'ta "forbidden-zones" ismi geçiyorsa referans olarak bırakılabilir. |

## KALACAKLAR

- Yukarıda **A) GEREKLİ DOSYALAR** altında listelenen tüm `/app` ve `/lib` dosyaları.
- **lib/ai-router.ts** ve **lib/assistant/ai-router.ts** (ikisi de kullanılıyor, farklı amaç).
- **lib/security/patron-lock.ts** (ana güvenlik modülü).
- package.json'daki diğer tüm bağımlılıklar (framer-motion hariç).

## DÜZELTME GEREKİYOR

| Dosya | Sorun | Öneri |
|-------|--------|--------|
| (yok) | — | Kod tarafında zorunlu düzeltme tespit edilmedi. |

---

# KÖK KLASÖRDEKİ DÖKÜMANLAR (.md, .bat)

Bunlar kod değil; arşiv / referans. Silinip silinmeyeceği Patron kararı.

| Dosya | İçerik |
|-------|--------|
| ASSISTANT_KURALLARI.md | Asistan kuralları özeti |
| COMMIT_DEPLOY_KONTROL.md | Commit/deploy kontrol |
| COMMIT_DEPLOY_TAM_SISTEM.md | Commit/deploy tam sistem |
| COMMIT_VE_DEPLOY.md | Commit ve deploy |
| CURSOR_FINAL_TALIMAT_DURUM.md | Final talimat durum raporu |
| DOMAIN.md | Domain bilgisi |
| GELISTIRME_RAPORU_10_MADDE.md | Geliştirme raporu |
| INCELEME_LISTESI.md | İnceleme listesi |
| NPM_BUILD_LINT_RAPOR.md | npm/build/lint raporu |
| PATRON_PANEL_EYLEM_PLANI.md | Patron panel eylem planı |
| ROBOT_GOREVLERI.md | Robot görevleri |
| SISTEM_AKTIF_KOMUTLARI.md | Sistem aktif komutları |
| SISTEM_DURUM_OZET.md | Sistem durum özeti |
| SORUN_GIDERME.md | Sorun giderme |
| SUAN_DURUM_VE_DEVAM.md | Şu an durum ve devam |
| YISA-S-MASTER-DOKUMAN-v2.0-INCELEME-RAPORU.md | Master doküman inceleme |
| YISA-S-MASTER-DOKUMAN-v2.1-TASLAK.md | Master doküman taslak |
| CURSOR_KURULUM_KOMUTLARI.bat | Cursor kurulum |
| git-commit-deploy-tam-sistem.bat | Git commit + deploy |
| git-commit-push.bat | Git push |
| git-kilit-ac-ve-push.bat | Git kilit aç + push |
| TEK_SEFERDE_BITIR.bat | Tek seferde bitir |

---

# ÖZET

| Kategori | Sayı |
|----------|------|
| Silinebilecek (öneri) | 1 zorunlu (framer-motion), 1 isteğe bağlı (forbidden-zones) |
| Kalacak (kod) | Tüm app + lib listelenen dosyalar |
| Düzeltme | 0 |
| Test/duplicate dosya | 0 |

**SİLME YAPILMADI.** Patron onayından sonra yalnızca onayladığınız maddeler uygulanacak.
