# YİSA-S — Yapılanlar, Eksikler, Proje Komutları ve Kontrol

Bu belge: **Şu ana kadar ne tamamlandı**, **ne eksik**, **bitirmek için hangi komutlar çalıştırılacak** ve **nasıl kontrol edeceksiniz** tek yerde toplar.

---

## 1. TAMAMLANAN İŞLER (Kod tarafı)

| # | İş | Durum | Nerede |
|---|-----|--------|--------|
| 1 | Patron komut akışı — Onay/bekleyen iş atlandı | ✅ Yapıldı | `app/api/chat/flow/route.ts`, `lib/auth/roles.ts` (isPatron), `app/dashboard/page.tsx` (patron_direct_done) |
| 2 | Patron komutu → patron_commands kaydı, sonuc/durum | ✅ Yapıldı | `lib/db/ceo-celf.ts`, flow'da updatePatronCommand, migration `20260203_patron_commands_komut_sonuc_durum.sql` |
| 3 | 66 şablon — ceo_templates, API, dashboard | ✅ Yapıldı | Migration `20260203_ceo_templates_ve_sablonlar.sql`, `SABLONLAR_TEK_SQL.sql`, `app/api/templates/route.ts`, `app/dashboard/sablonlar/page.tsx` |
| 4 | Vitrin — demo_requests source=vitrin | ✅ Yapıldı | `VITRIN_TEK_SQL.sql`, `YENI_MIGRASYONLAR_TEK_SQL.sql` (sonunda), `app/vitrin/page.tsx`, `app/api/demo-requests/route.ts` |
| 5 | Onay Kuyruğu — Demo Talepleri + Patron Komutları | ✅ Yapıldı | `app/dashboard/onay-kuyrugu/page.tsx`, `app/api/approvals/route.ts`, `app/api/demo-requests/route.ts` |
| 6 | Giriş ve rol yönlendirme (Patron → dashboard, franchise → /franchise) | ✅ Yapıldı | `lib/auth/resolve-role.ts`, `app/auth/login/page.tsx`, `app/patron/login/page.tsx` |
| 7 | Dokümanlar (Kim ne yapar, Giriş ve iş akışı şeması) | ✅ Yapıldı | `KIM_NE_YAPAR_CALISMA_SEMASI.md`, `GIRIS_VE_IS_AKISI_SEMASI.md` |

---

## 2. SİZİN YAPMANIZ GEREKENLER (Komutlar ve Supabase)

Kod tarafı hazır. Aşağıdakileri **sırayla** yapın; hepsi tamamsa “şuraya kadar olan kısmı” bitirmiş olursunuz.

### 2.1 Supabase SQL (henüz çalıştırmadıysanız)

**Tümünü uygulama + vitrin → firma sahibi test senaryosu:** `HEPSINI_UYGULA_VE_TEST_SENARYOSU.md` dosyasına bakın.

Supabase Dashboard → **SQL Editor** → Aşağıdaki dosyaları **sırayla** çalıştırın:

| Sıra | Dosya | Ne yapar |
|------|--------|----------|
| 1 | `supabase/YENI_MIGRASYONLAR_TEK_SQL.sql` | Tablolar + vitrin (demo_requests source=vitrin) |
| 2 | `supabase/VITRIN_TEK_SQL.sql` | Sadece vitrin kuralı (1’i çalıştırdıysanız atlayabilirsiniz) |
| 3 | `supabase/migrations/20260203_ceo_templates_ve_sablonlar.sql` | ceo_templates kolonları |
| 4 | `supabase/SABLONLAR_TEK_SQL.sql` | 66 şablon INSERT (template_name, content ile) |
| 5 | `supabase/migrations/20260203_patron_commands_komut_sonuc_durum.sql` | patron_commands: komut, sonuc, durum, completed_at |

### 2.2 Proje komutları (build + çalıştırma)

PowerShell’de proje klasöründe:

```powershell
cd C:\Users\info\OneDrive\Desktop\YISA_S_APP\yisa-s-app
npm run build
```

Hata yoksa:

```powershell
npm run dev
```

- Tarayıcıda: `http://localhost:3000` (veya 3001).
- Eski `next dev` çalışıyorsa önce o pencerede **Ctrl+C** ile durdurun veya `Stop-Process -Id 14040 -Force` (PID’yi göre değiştirin).

### 2.3 Kontrol listesi (siz kontrol edin)

| Kontrol | Nerede | Beklenen |
|---------|--------|----------|
| Patron girişi | `/patron/login` → Patron e-posta + şifre | Dashboard açılır |
| Vitrin | `/vitrin` → Seçim yap → Seçimleri gönder | “Talebiniz alındı”; Onay Kuyruğu’nda kayıt (source: vitrin) |
| Demo onayı | Dashboard → Onay Kuyruğu → Demo Talepleri → Onayla | Tenant oluşur; Franchise listesinde görünür |
| 66 şablon | Dashboard → Şablonlar | 66 kayıt, kategori filtresi, karta tıklayınca içerik dolu |
| Patron chat | Dashboard ana sayfa → Mesaj yaz (Patron ile) | “Bu mu demek istediniz?” çıkmaz; sonuç doğrudan gelir |
| Franchise listesi | Dashboard → Franchise / Vitrin | Onaylanan tenant’lar listelenir (tenants tablosundan) |

---

## 3. EKSİK / İSTEĞE BAĞLI (Şu an zorunlu değil)

- **Firma sahibi Auth hesabı:** Demo onayında tenant oluşuyor; e-posta **zaten** Supabase Auth’da varsa otomatik owner bağlanıyor. **Yoksa** sizin Supabase → Authentication → Users’dan o e-postayı eklemeniz (veya davet göndermeniz) gerekir; kod şu an otomatik kullanıcı oluşturmuyor.
- **Patron şifresi:** Uygulama içinde sabit şifre yok; Supabase Auth’da Patron e-postası için şifre tanımlı olmalı.
- **CELF/İK sözleşmelerinin tenant paneline inmesi:** Şu an Patron/onay tarafında; istenirse ileride firma sahibi paneline otomatik düşecek akış eklenebilir.

---

## 4. ÖZET — “Tamamı yapıldı mı?”

- **Kod tarafı:** Evet — Patron akışı, 66 şablon, vitrin, onay kuyruğu, giriş/rol, dokümanlar tamamlandı.
- **Sizin taraf:** Supabase’de 1–5 arası SQL’leri çalıştırın, `npm run build` + `npm run dev` yapın, yukarıdaki kontrol listesini uygulayın.
- **Web sayfaları ve “bu kişi buraya girer” özeti:** Aşağıdaki **KIM_HANGI_SAYFAYA_GIRER.md** dosyasında tek tabloda verildi; oradan mevcut durumu kontrol edebilirsiniz.

Bu adımları tamamladıktan sonra “şuraya kadar olan kısım” bitmiş olur; sonrasında isterseniz ek özellik (otomatik kullanıcı, sözleşme inmesi vb.) için komutlar ayrıca yazılabilir.
