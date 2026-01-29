# Tam Sistem Kurulumu — Commit ve Deploy

**Tarih:** 29 Ocak 2026

## Bu commit'e dahil olanlar

- **Patron paneli:** Franchise geliri, gider, aktif franchise, onay kuyruğu, yeni başvuru kartları
- **Sidebar:** Onay Kuyruğu, Franchise'lar, Kasa Defteri, Şablonlar, Kullanıcı & Roller
- **API:** `/api/approvals`, `/api/expenses`, `/api/franchises`, `/api/templates`; `/api/stats` güncellendi
- **Sayfalar:** Onay Kuyruğu, Franchise'lar (+ detay + Satış yap), Kasa Defteri, Şablonlar
- **Franchise seed:** Tuzla Beşiktaş Cimnastik Okulu, yetkili Merve Görmezer (Satış yap)
- **Dokümanlar:** PATRON_PANEL_EYLEM_PLANI.md, YISA-S-MASTER-DOKUMAN v2.0 inceleme, v2.1 taslak
- **Supabase:** seed-franchise-tuzla-besiktas.sql (isteğe bağlı)

## Commit ve deploy (yerelde çalıştırın)

### Yöntem 1: Batch dosyası

Proje klasöründe çift tıklayın:

```
git-commit-deploy-tam-sistem.bat
```

### Yöntem 2: Manuel komutlar

Proje klasöründe **PowerShell** veya **CMD** açıp sırayla:

```batch
cd C:\Users\info\OneDrive\Desktop\YISA_S_APP\yisa-s-app
```

Lock varsa kaldırın:

```batch
del .git\index.lock
```

Sonra:

```batch
git add .
git commit -m "feat: tam sistem kurulumu - Patron paneli, franchise (Tuzla Beşiktaş Cimnastik, Merve Görmezer), onay kuyruğu, kasa defteri, şablonlar, Master Doküman v2.1 taslak"
git push origin main
```

Push sonrası **Vercel** otomatik deploy alır.  
Hata alırsanız: `.git/index.lock` veya `.git/objects` başka bir program (OneDrive, IDE) tarafından kilitlenmiş olabilir; o programları kapatıp tekrar deneyin.
