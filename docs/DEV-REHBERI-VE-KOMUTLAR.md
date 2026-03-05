# YİSA-S — Dev Rehberi ve Komutlar

> **Amaç:** Dev sitesinde merge edilen değişiklikleri nasıl indireceğiz; dev ne yapacak, neye dikkat edecek, şemaya göre nasıl çalışacak.

**Tarih:** 27 Şubat 2026  
**Referans şema:** YISA-S-TUM-PROJELER-SEMA-VE-ZORUNLULUKLAR.md — **tüm çalışma bu şemaya göre; anlaşma bu.**

---

## 1. Dev’te Merge Ettiklerimizi Nasıl İndiririz?

Dev branch’ında (veya dev sunucusunda) yaptığınız merge’leri **yerel makineye çekmek** için her çekirdek repo için aşağıdakileri kullanın.

### 1.1 Genel Akış (Her repo için)

```bash
# Repo klasörüne gir
cd "C:\Users\info\OneDrive\Desktop\v0 yisa s dosyamız\tenant-yisa-s"
# (veya app-yisa-s / yisa-s-com)

# Uzak değişiklikleri getir ve merge et
git fetch origin
git pull origin dev
```

Eğer **varsayılan branch** `main` veya `master` ise ve merge’ler `dev` branch’ında yapıldıysa:

```bash
git fetch origin
git checkout dev
git pull origin dev
# İsterseniz main'e merge: git checkout main && git merge dev
```

Eğer tek branch kullanıyorsanız (örn. sadece `main`):

```bash
git fetch origin
git pull origin main
```

### 1.2 Çekirdek 3 Repo — Tek Tek Komutlar

| Repo | Komut (PowerShell / CMD) |
|------|---------------------------|
| **tenant-yisa-s** | `cd "C:\...\v0 yisa s dosyamız\tenant-yisa-s"` → `git fetch origin` → `git pull origin dev` (veya kullandığınız branch) |
| **app-yisa-s** | `cd "C:\...\v0 yisa s dosyamız\app-yisa-s"` → aynı |
| **yisa-s-com** | `cd "C:\...\v0 yisa s dosyamız\yisa-s-com"` → aynı |

**Çakışma çıkarsa:** `git status` ile conflict dosyalarını görün; düzenleyip `git add .` → `git commit` ile bitirin. Şemada tanımlı olmayan yeni dosya/özellik eklediyseniz, önce **YISA-S-TUM-PROJELER-SEMA-VE-ZORUNLULUKLAR.md** ve **YISA-S-FINAL-IS-HARITASI.md** ile uyumunu kontrol edin.

---

## 2. Dev’e Verilecek Komut / Talimat (Özet)

Dev’e şunu söyleyebilirsiniz:

1. **Merge’leri indir:** Yukarıdaki gibi ilgili repoda `git fetch` + `git pull origin <branch>`.
2. **Şemaya uy çalış:** Tüm değişiklikler **YISA-S-TUM-PROJELER-SEMA-VE-ZORUNLUKLAR.md** ve **YISA-S-FINAL-IS-HARITASI.md** ile uyumlu olsun; çekirdek 3 repo (app-yisa-s, tenant-yisa-s, yisa-s-com) dışına taşma yok.
3. **Build kırma:** Her commit/push sonrası en az `npm run build` çalışsın; kırmayacak şekilde kod yazılsın.
4. **Yeni özellik / yeni repo:** Şemada yoksa önce bu belgelerde “nerede, hangi repo, çekirdek mi yardımcı mı” netleştirilsin; sonra kod.
5. **İş listesi:** Ne yapılacak sorusu → **YISA-S-FINAL-IS-HARITASI.md** Bölüm 1 ve 3.

---

## 3. Dev’in Neye Dikkat Etmesi Gerektiği (Şemaya Göre)

### 3.1 Mutlak Kurallar (Şemadan)

| Kural | Açıklama |
|-------|----------|
| **Çekirdek 3 repo** | Ana çalışma alanı: **app-yisa-s**, **tenant-yisa-s**, **yisa-s-com**. Yeni “resmi” özellik sadece bu üçte olacak. |
| **Domain ataması** | app.yisa-s.com → **tenant-yisa-s** (production). yisa-s.com / www → **yisa-s-com**. *.yisa-s.com (franchise) → **tenant-yisa-s**. Buna aykırı deploy/redirect yapılmamalı. |
| **Tek Supabase** | Üç çekirdek repo aynı Supabase projesine bağlı. Env: `.env.local` + `.env.example` şemadaki Bölüm 7 ve Final Harita ile uyumlu. |
| **Rapor dışına çıkma** | İş akışı **YISA-S-IS-AKISI-VE-ASAMALAR.md** ve iş listesi **YISA-S-FINAL-IS-HARITASI.md** ile tanımlı. Bu raporların dışında “bitirilmiş iş” sayılmaz. |

### 3.2 Birleştirme (Merge) Kuralları

| Ne | Nasıl |
|----|--------|
| Yardımcı projeden (v0-3-d, v0-social-media, bjktesis, yisa-s-app-uh) kod çekilecekse | Şema Bölüm 6’daki “Nereden → Nereye” tablosuna uygun hedefe kopyala; çekirdek 3’e dağınık yeni repo ekleme. |
| Yeni sayfa / yeni API | Hangi repoda olacağı şemada (Bölüm 2.1) yazılı yapıya uygun olsun. Belirsizse önce şemada netleştir. |
| .env / ortam değişkeni | Yeni key eklenecekse `.env.example` ve (varsa) YISA-S-PROJE-SEMA-VE-DURUM Bölüm 7 ile dokümante et. |

### 3.3 Dev’in Her Gün / Her Merge Sonrası Yapması Gerekenler

1. **Pull:** `git fetch` + `git pull origin <dev branch>` (veya kullandığınız branch).
2. **Bağımlılık:** `npm install` (package değiştiyse).
3. **Build:** `npm run build` — üç çekirdek repoda da hata vermemeli.
4. **Şema kontrolü:** Yeni eklenen özellik “çekirdek 3 + domain + Supabase tek proje” kuralına uygun mu diye bak.

---

## 4. Hangi Belge Ne İşe Yarıyor (Dev İçin Tekrar)

| Soru | Belge |
|------|--------|
| Ne yapacağım, komut / checklist? | **YISA-S-FINAL-IS-HARITASI.md** (Bölüm 1 tablo + Bölüm 3 eksiklik) |
| Bu özellik zorunlu mu, nereye deploy? | **YISA-S-TUM-PROJELER-SEMA-VE-ZORUNLULUKLAR.md** |
| Hangi aşamadayız, akış ne? | **YISA-S-IS-AKISI-VE-ASAMALAR.md** |
| Hangi belgeyi ne için kullanacağım? | **HANGI-BELGE-NE-IS-E-YARIYOR.md** |

**Anlaşma:** İlerleme ve “yapılacak iş” tek kaynak = Final İş Haritası. Mimari ve zorunluluk = Şema. Dev, merge’leri indirirken ve yeni iş yaparken bu şemaya göre çalışmalı.

---

## 5. Kısa Komut Özeti (Kopyala-Yapıştır)

**Dev’te merge edilenleri indir (örnek: branch adı `dev`):**

```powershell
cd "C:\Users\info\OneDrive\Desktop\v0 yisa s dosyamız\tenant-yisa-s"
git fetch origin
git pull origin dev
npm install
npm run build
```

Aynısını **app-yisa-s** ve **yisa-s-com** için tekrarla (cd path’i değişir).

**Branch adını bilmiyorsanız:** `git branch -a` ile tüm branch’ları görün; merge’lerin yapıldığı branch’ı `git pull origin <o_branch>` ile çekin.

---

Bu rehber, dev sitesindeki merge’leri indirme ve dev’in şemaya göre nasıl çalışacağı konusundaki anlaşmayı tek yerde toplar. Şemaya göre çalışma = **YISA-S-TUM-PROJELER-SEMA-VE-ZORUNLULUKLAR.md** + **YISA-S-FINAL-IS-HARITASI.md** + **YISA-S-IS-AKISI-VE-ASAMALAR.md**’e uyum.
