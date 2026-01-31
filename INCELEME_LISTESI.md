# YİSA-S — İnceleme Listesi (Tek Tek Kontrol)

**Patron:** Serdinç ALTAY  
**Tarih:** 29 Ocak 2026  
**Amaç:** Değişen/eklenen dosyaları tek tek inceleyip düzeltme veya onay vermek.

---

## Nasıl kullanılır

1. Aşağıdaki dosyaları sırayla açın.
2. Her dosyayı inceleyin.
3. Düzeltme gerekiyorsa not alın; yoksa ✓ işaretleyin.
4. Tümünü bitirince onay verin veya düzeltme talebi yazın.

---

## 1. AI Router ve Flow (Seçenek 2)

| # | Dosya | Kısa açıklama |
|---|-------|----------------|
| 1 | `lib/ai-router.ts` | AI_PROVIDERS, QUALITY_FLOW (9 adım), detectTaskType, routeToAI, defaultCallAI |
| 2 | `app/api/chat/flow/route.ts` | POST flow API: checkPatronLock, getAccumulatedText, callClaude/GPT/Gemini/Together, routeToAI |

---

## 2. Dashboard ve Chat UI

| # | Dosya | Kısa açıklama |
|---|-------|----------------|
| 3 | `app/dashboard/page.tsx` | Seçenek 2 varsayılan, /api/chat/flow, aiProviders badge (hex renkler), STEP_LABELS, PatronApprovalUI |
| 4 | `app/components/PatronApproval.tsx` | Onayla / Reddet / Değiştir, görev özeti, “Çalışan AI’lar” (sadece gerçekten çalışanlar) |

---

## 3. Güvenlik

| # | Dosya | Kısa açıklama |
|---|-------|----------------|
| 5 | `lib/security/patron-lock.ts` | FORBIDDEN_FOR_AI, REQUIRE_PATRON_APPROVAL (G2: veritabani_yapisi_degistir, robot_ayari_degistir, environment_variable_degistir) |
| 6 | `lib/security/forbidden-zones.ts` | patron-lock re-export (FORBIDDEN_FOR_AI, PATRON_APPROVAL_REQUIRED vb.) |
| 7 | `lib/security/siber-guvenlik.ts` | ALARM_SEVIYELERI (Sarı, Turuncu, Kırmızı, Acil) |

---

## 4. Veri Arşivleme ve Rol

| # | Dosya | Kısa açıklama |
|---|-------|----------------|
| 8 | `lib/archiving/veri-arsivleme.ts` | SIFRELEME: AES-256, GUNLUK_YEDEK_SAATI: 02:00 |
| 9 | `lib/auth/roles.ts` | ROLE_SYSTEM_13 (Talimat 1.3: 13 rol referansı) |

---

## 5. Robot sayfası ve istatistik

| # | Dosya | Kısa açıklama |
|---|-------|----------------|
| 10 | `app/dashboard/robots/page.tsx` | 7 katman görsel ağaç, Seçenek 2 (QUALITY_FLOW) bilgisi, FLOW_DESCRIPTION |
| 11 | `app/api/stats/route.ts` | Değiştirilmedi; Supabase’ten gerçek veri çekiyor (zaten vardı) |

---

## 6. Lint ve yapılandırma

| # | Dosya | Kısa açıklama |
|---|-------|----------------|
| 12 | `package.json` | "lint": "next lint", eslint, eslint-config-next (devDependencies) |
| 13 | `.eslintrc.json` | Yeni dosya — extends: "next/core-web-vitals" |

---

## 7. Rapor / referans

| # | Dosya | Kısa açıklama |
|---|-------|----------------|
| 14 | `CURSOR_FINAL_TALIMAT_DURUM.md` | Talimat durum raporu, 10 madde kontrol, Bölüm 7 kontrol listesi |
| 15 | `INCELEME_LISTESI.md` | Bu dosya — inceleyeceğiniz dosyaların listesi |

---

## Özet

- **Toplam:** 15 dosya (13 değişen/eklenen + 2 rapor).
- **Dokunulmayan:** `.env`, `.env.local` — hiçbir env dosyası değiştirilmedi.
- **Commit/push:** Yapılmadı; onayınızdan sonra siz yapacaksınız.

İncelemenizi bitirince “onay” veya “şu dosyada şunu düzelt” yazmanız yeterli.
