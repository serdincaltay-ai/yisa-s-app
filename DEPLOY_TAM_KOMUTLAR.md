# YİSA-S — Deploy Tam Komutlar (Supabase + GitHub + Vercel)

Sistemi denemek için **sırayla** aşağıdakileri uygulayın.

---

## 1. Supabase (SQL Editor)

Supabase Dashboard → **SQL Editor** → Aşağıdaki dosyaları **sırayla** çalıştırın. Daha önce çalıştırdıklarınızı atlayın.

| Sıra | Dosya | Ne yapar |
|------|--------|----------|
| 1 | `supabase/YENI_MIGRASYONLAR_TEK_SQL.sql` | Tablolar + vitrin |
| 2 | `supabase/migrations/20260203_ceo_templates_ve_sablonlar.sql` | ceo_templates |
| 3 | `supabase/SABLONLAR_TEK_SQL.sql` | 66 şablon |
| 4 | `supabase/migrations/20260203_patron_commands_komut_sonuc_durum.sql` | patron_commands kolonları |
| 5 | `supabase/migrations/20260203_demo_requests_payment.sql` | Ödeme alanları (firma sahibi ödemesi) |
| 6 | `supabase/VITRIN_TEK_SQL.sql` | (1 çalıştırdıysanız atlayın) |

---

## 2. Yerel build (test için)

PowerShell veya CMD, proje klasöründe:

```powershell
cd C:\Users\info\OneDrive\Desktop\YISA_S_APP\yisa-s-app
npm run build
```

Hata yoksa:

```powershell
npm run dev
```

Tarayıcı: **http://localhost:3000**

---

## 3. GitHub + Vercel (tüm değişiklikleri push, deploy)

PowerShell veya CMD, proje klasöründe:

```powershell
cd C:\Users\info\OneDrive\Desktop\YISA_S_APP\yisa-s-app
git add -A
git status
git commit -m "feat: Odeme takibi, asistan direktifleri, patron V0/Cursor/CELF/direktor komutlari"
git push origin main
```

- **GitHub:** `main` branch güncellenir.
- **Vercel:** Repo bağlıysa `main`'e push ile otomatik deploy başlar. Birkaç dakika sonra canlı link güncel olur.

---

## 4. Özet

| Adım | Nerede | Komut / İşlem |
|------|--------|----------------|
| Supabase | Supabase Dashboard → SQL Editor | 1→2→3→4→5→6 dosyalarını sırayla Run |
| Yerel test | Proje klasörü | `npm run build` → `npm run dev` |
| GitHub | Proje klasörü | `git add -A` → `git commit -m "..."` → `git push origin main` |
| Vercel | Otomatik | Push sonrası deploy; canlı link güncellenir |

**Railway:** Projede Railway kullanıyorsanız, kendi dashboard’unuzdan "Deploy" veya GitHub bağlıysa push ile tetiklenir. Ana deploy bu projede **Vercel** üzerinden.

Bu sırayı tamamladıktan sonra sistemi canlıda deneyebilirsiniz.
