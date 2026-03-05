# Dev Belgeleri Nerede ve Nasıl Paylaşılır?

> **Sorular:** Bu medya/dosyaları ben mi kopyalayacağım, GitHub'da var mı? Dev bunları nereden görecek — kitaptan mı, repodan mı?

**Tarih:** 27 Şubat 2026

---

## 1. Şu An Nerede?

| Konum | Açıklama |
|-------|----------|
| **Workspace kökü** | Tüm bu belgeler şu an **sadece bu klasörde**: `C:\Users\info\OneDrive\Desktop\v0 yisa s dosyamız\` |
| **Git durumu** | Bu **üst klasör ("v0 yisa s dosyamız") bir Git repo değil** — yani bu .md dosyaları **şu an GitHub'da yok**. |
| **Alt klasörler** | **tenant-yisa-s**, **app-yisa-s**, **yisa-s-com** ayrı Git repoları ve GitHub'da var (örn. serdincaltay-ai/tenant-yisa-s). Ama talimat/canlı rapor/kullanım kılavuzu gibi dosyalar **üst klasörde** olduğu için otomatik olarak hiçbir repoda değiller. |

**Özet:** Dev şu an GitHub’a baktığında bu talimat ve canlı rapor dosyalarını **göremez**; çünkü bunlar sadece sizin bilgisayardaki bu workspace kökünde.

---

## 2. Dev Nereden Görecek? İki Seçenek

### A) Siz kopyalayacaksınız / repoya koyacaksınız (GitHub’dan görsün)

- Bu belgeleri **dev’in kullandığı bir Git reposuna** ekleyip **push** ederseniz, dev **git pull** ile alır; GitHub’dan görür.
- **Seçenek 1:** Mevcut repolardan birine koyun (örn. **tenant-yisa-s**):
  - Örnek: `tenant-yisa-s/docs-proje/` veya `tenant-yisa-s/docs/` altına şu dosyaları kopyalayın:
    - DEV-TALIMATI-TAM-KOMUT.md
    - DEV-TALIMATI-ESKI-RAPORLAR-VE-CANLI-RAPOR.md
    - YISA-S-CANLI-PROJE-RAPORU.md
    - YISA-S-CANLI-IS-AKISI-SEMASI.md
    - YISA-S-CALISMA-PRENSIBI-VE-KULLANIM-KILAVUZU-CANLI.md
    - YISA-S-7-FAZ-DURUMU.md
    - YISA-S-FINAL-IS-HARITASI.md
    - YISA-S-IS-AKISI-VE-ASAMALAR.md
    - YISA-S-TUM-PROJELER-SEMA-VE-ZORUNLULUKLAR.md
    - HANGI-BELGE-NE-IS-E-YARIYOR.md
    - (ve diğer ihtiyaç duyduğunuz .md dosyaları)
  - Sonra: `git add ...` → `git commit` → `git push`. Dev `git pull` yapar, dosyaları görür.
- **Seçenek 2:** Ayrı bir repo açın (örn. **yisa-s-docs** veya **yisa-s-proje**). Tüm proje belgelerini oraya koyup push edin. Dev o repoyu clone’lar veya pull eder.

### B) Kitap / paylaşım ile vereceksiniz (GitHub dışı)

- "Kitap" = Notion, Confluence, OneDrive klasörü, e‑posta eki vb. ise:
  - Bu klasördeki ilgili .md dosyalarını **oraya kopyalayacaksınız** veya içeriği yapıştıracaksınız.
  - Dev bu dosyaları **GitHub’da değil**, verdiğiniz link/klasörden görecek.

---

## 3. Öneri (Net Erişim İçin)

1. **Tek yer:** Proje belgelerini tek bir yerde toplayın — ya **bir repoda** (tenant-yisa-s/docs-proje/ veya ayrı repo) ya da **tek bir paylaşım klasörü/linki**.
2. **Dev’e söyleyin:** "Talimat ve canlı raporlar şurada: [GitHub repo + yol] veya [OneDrive/Notion linki]. Oradan alacaksın; güncellemeleri de oraya yapacağız."
3. **Canlı dosyalar:** Canlı rapor / iş akışı / kullanım kılavuzu güncellenecekse, güncellemeyi **dev’in gördüğü o yer** üzerinden yapın (aynı repo veya aynı paylaşım); böylece dev hep aynı yerden görür.

---

## 4. Kısa Cevap

| Soru | Cevap |
|------|--------|
| Bu dosyalar GitHub’da var mı? | **Hayır.** Şu an sadece bu workspace kökünde; üst klasör Git repo değil. |
| Ben kopyalayacak mıyım? | **Evet.** Dev GitHub’dan görecekse bir repoya **siz kopyalayıp push** edeceksiniz. Veya kitap/paylaşım kullanacaksanız oraya kopyalayacaksınız. |
| Dev nereden görecek? | **Sizin belirleyeceğiniz yerden:** (1) GitHub’daki bir repo (siz dosyaları oraya koyduktan sonra), veya (2) kitap/paylaşım (Notion, OneDrive, e‑posta vb.). |

Bu dosya da aynı workspace’te; dev’e erişim yolunu anlattığınızda bu özeti paylaşabilirsiniz.
