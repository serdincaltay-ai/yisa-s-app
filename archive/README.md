# Archive — Kök klasördeki .md ve .bat dosyaları

Bu klasör, kök klasördeki doküman (.md) ve batch (.bat) dosyalarının taşınacağı yerdir.

**Taşıma (Patron kendi bilgisayarında yapacak):**

Proje kökünde PowerShell veya CMD açıp:

```powershell
cd "C:\Users\info\OneDrive\Desktop\YISA_S_APP\yisa-s-app"
Move-Item -Path .\*.md -Destination .\archive\ -Force
Move-Item -Path .\*.bat -Destination .\archive\ -Force
```

Veya Windows Gezgini ile kökteki tüm .md ve .bat dosyalarını sürükleyip `archive` klasörüne bırakın.

**Taşınacak dosyalar (kök klasörde):**
- ASSISTANT_KURALLARI.md
- COMMIT_DEPLOY_KONTROL.md
- COMMIT_DEPLOY_TAM_SISTEM.md
- COMMIT_VE_DEPLOY.md
- CURSOR_FINAL_TALIMAT_DURUM.md
- DOMAIN.md
- GELISTIRME_RAPORU_10_MADDE.md
- git-commit-deploy-tam-sistem.bat
- git-commit-push.bat
- git-kilit-ac-ve-push.bat
- INCELEME_LISTESI.md
- NPM_BUILD_LINT_RAPOR.md
- PATRON_PANEL_EYLEM_PLANI.md
- ROBOT_GOREVLERI.md
- SISTEM_AKTIF_KOMUTLARI.md
- SISTEM_DURUM_OZET.md
- SORUN_GIDERME.md
- SUAN_DURUM_VE_DEVAM.md
- TEMIZLIK_LISTESI.md
- YISA-S-MASTER-DOKUMAN-v2.0-INCELEME-RAPORU.md
- YISA-S-MASTER-DOKUMAN-v2.1-TASLAK.md
- CURSOR_KURULUM_KOMUTLARI.bat
- TEK_SEFERDE_BITIR.bat

Bu README dosyası archive içinde kalsın (taşınmasın).

---

## Referans dokümanlar (eski çalışmalardan eklenen bilgiler)

Eksik faydalı bilgiler için eklenen referans dosyaları (4 Şubat 2026):

| Dosya | İçerik |
|-------|--------|
| `REFERANS_DERS_PROGRAMI_SABLONU.md` | Haftalık program matrisi, yaş grupları, antrenör dağılımı, özel günler |
| `REFERANS_FIYAT_LISTESI.md` | VIP/Plus/Standart, branş paketleri, kampanyalar, iade politikası |
| `REFERANS_HAREKET_HAVUZU.md` | Temel hareketler (Latince+Türkçe), seviyeler, yaş hedefleri, güvenlik kuralları |
| `REFERANS_KATALOG_ICERIK.md` | Program açıklamaları, "neden biz?", iletişim bloğu |
| `REFERANS_SOSYAL_MEDYA_PLANI.md` | Instagram şablonları, haftalık plan, görsel standartlar, hashtag'ler |
| `REFERANS_CALISMA_STANDARDI_VELI_RAPORU.md` | 7 adımlı akış, veli bilgilendirme, 10 perspektif, haftalık veli raporu şablonu |
