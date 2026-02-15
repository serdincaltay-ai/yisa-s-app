# YİSA-S — İş Şeması ve İlerleme Planı

**Tarih:** 15 Şubat 2026  
**Amaç:** Nereye ne yapılacak, nasıl yapılacak, hangi klasörde — Beyin Takımı aktifleştirme ve sistem hızlandırma

---

## 1. KLASÖR–GÖREV–SİTE EŞLEMESİ

| # | Klasör (workspace) | Repo | Domain | Sorumlu Görevler |
|---|-------------------|------|--------|------------------|
| 1 | `yisa-s.com` (v0-futuristic-dashboard-ng) | v0-futuristic-dashboard-ng | app.yisa-s.com | Patron Paneli, Beyin Takımı, Onay kuyruğu, CELF |
| 2 | `yisa-s-website` | yisa-s-website | yisa-s.com | Vitrin, demo formu, intro, tanıtım |
| 3 | `yisa-s-app` | yisa-s-app | *.yisa-s.com | Franchise Paneli, Öğrenci, Yoklama, Aidat, Veli, Antrenör |

> ⚠️ **Kural:** Her görevde önce `git remote -v` ile doğru repo'da olduğunu kontrol et.

---

## 2. MEVCUT DURUM ÖZETİ (15 Şubat 2026)

### 2.1 yisa-s-app (Franchise — BU KLASÖR)

| Bileşen | Durum | Açıklama |
|---------|-------|----------|
| /panel/ogrenciler | ✅ Var | students tablosu, OgrenciForm, OgrenciTable |
| /panel/yoklama | ✅ Var | student_attendance, YoklamaList |
| /panel/odemeler | ✅ Var | PaketSatModal, OdemeAlModal |
| /panel/aidat | ✅ Var | Aidat sayfası |
| /panel/program | ✅ Var | Ders programı sayfası |
| /veli/* | ✅ Var | giris, dashboard, cocuk/[id], duyurular |
| FranchiseIntro | ✅ Var | Tesis adı, hoş geldin animasyonu |
| Sidebar | ✅ Var | Dashboard, Öğrenciler, Yoklama, Ödemeler, Aidat, Ders Programı |
| API | ⚠️ Karışık | Hem `students` hem `athletes` kullanılıyor (franchise/athletes, api/students) |
| RBAC | ❌ Yok | Login koruması, rol bazlı erişim yok |
| Antrenör paneli | ❌ Yok | Yoklama alma, ders listesi — yapılmadı |
| Kasa defteri | ❌ Yok | Günlük gelir-gider — yapılmadı |
| Subdomain → tenant_id | ⚠️ Kısmen | lib/subdomain.ts, middleware var |

### 2.2 Tablo Uyumsuzluğu

| Doküman (Master Komut) | Mevcut yisa-s-app | Not |
|------------------------|-------------------|-----|
| athletes: ad, soyad, sporcu_no, brans_id, seviye, grup, veli_ad | students: ad_soyad, tc_kimlik, brans, veli_adi | İki tablo var: athletes (asama2), students (Görev 9) |
| athletes | athletes + students | Panel çoğunlukla students; franchise API athletes |
| attendance: sporcu_id, schedule_id | student_attendance, attendance | Farklı migration'lar |
| schedules, sports_branches | Var mı kontrol gerek | |

### 2.3 Patron Paneli (yisa-s.com)

- Dashboard, chat, oylama, görev atama: ✅
- Beyin Takımı **UI**: ✅ (Claude, GPT, Gemini ile sohbet)
- Beyin Takımı **Motor**: ❌ (Görev parse, direktörlük dağıtımı, onay→uygulama YOK)
- Onay → Tenant Zinciri: ✅

### 2.4 Vitrin (yisa-s-website)

- Landing page, intro, demo form: ✅
- CORS (vitrin → patron API): ❌ Yapılmadı

### 2.5 Supabase

- 32 tablo kurulu: ✅
- ceo_tasks, celf_logs, celf_directorates: ✅ (Beyin Takımı MVP için hazır)
- Demo veri: ⚠️ Eksik (tablo kolon uyumsuzluğu)

---

## 3. İŞ AKIŞI ŞEMASI — BİR GÖREVİN BAŞTAN SONA AKIŞI

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         GÖREV AKIŞI (HEDEF SİSTEM)                               │
└─────────────────────────────────────────────────────────────────────────────────┘

 1. GİRİŞ
    Patron komut girer (app.yisa-s.com → Beyin Takımı chat)
    Örnek: "Yeni franchise için antrenör paneli kur"

 2. CELF PARSE (yok — yapılacak)
    Görevi parçalar: CTO, CHRO, CSPO, CPO, CFO, CMO ...
    → ceo_tasks tablosuna kayıt (task_type, input, status: pending)

 3. DİREKTÖRLÜK DAĞITIMI (yok — yapılacak)
    Her direktörlük kendi AI'dan çıktı alır:
    CTO → GPT (veritabanı şeması)
    CPO → v0 (UI tasarımı)
    CMO → GPT (tanıtım metni)
    ...
    → celf_logs tablosuna yazılır (ceo_task_id, director_key, output)

 4. PATRON GÖRÜNTÜLER (kısmen var)
    Patron panelde direktörlük çıktılarını görür
    Onay / Red / Düzeltme notu

 5. ONAY → UYGULAMA (yok — yapılacak)
    Patron onaylarsa:
    - Aşama 1 (MVP): Manuel — Cursor'a kopyala, uygula
    - Aşama 2: Cursor CLI webhook → PR aç → Patron merge
    - Aşama 3: Tam otonom (n8n, CI/CD)

 6. HEDEF BİLEŞEN (franchise, vitrin, patron)
    Üretilen kod/tasarım ilgili klasöre uygulanır
    - Antrenör paneli → yisa-s-app
    - Vitrin şablonu → yisa-s-website
    - CELF/Onay → yisa-s.com
```

---

## 4. GÖREV ÖNCELİK TABLOSU — NE, NEREDE, NEDEN

| Sıra | Görev | Klasör | Neden | Öncelik |
|------|-------|--------|-------|---------|
| **1** | Beyin Takımı MVP Motoru (ceo_tasks → celf_logs → Patron onay) | **yisa-s.com** | Görevleri görmek, dağıtmak, onaylamak — sistemin kalbi | 🔴 Kritik |
| **2** | Patron → Franchise görüntüleme (tenant seç, özet veri) | **yisa-s.com** | Patron her şeyi görebilmeli | 🔴 Kritik |
| **3** | Demo veri + tablo uyumu (athletes/students kararı) | Supabase + **yisa-s-app** | Test için veri, UI için tutarlılık | 🟠 Yüksek |
| **4** | RBAC + Login koruması | **yisa-s-app** | Güvenlik, şifresiz erişim engeli | 🟠 Yüksek |
| **5** | Subdomain → tenant_id tamamlama | **yisa-s-app** | Doğru tenant'a yönlendirme | 🟠 Yüksek |
| **6** | CORS (vitrin → patron API) | **yisa-s.com** | Demo formu patron API'ye ulaşabilsin | 🟡 Orta |
| **7** | Antrenör paneli | **yisa-s-app** | Yoklama alma, ders listesi | 🟡 Orta |
| **8** | Kasa defteri MVP | **yisa-s-app** | Günlük gelir-gider | 🟡 Orta |
| **9** | Aidat hatırlatma | **yisa-s-app** | Franchise işlevselliği | 🟢 Düşük |
| **10** | Vitrin canlı grafikler | **yisa-s-website** | Tanıtım | 🟢 Düşük |

---

## 5. HANGİ KLASÖRDE NE YAPILACAK — DETAY

### 5.1 yisa-s.com (Patron Paneli)

| Yapılacak | Nasıl | Dosya/Route |
|-----------|-------|-------------|
| Beyin Takımı görev parse | Patron komutu → ceo_tasks INSERT | API: /api/celf/task veya mevcut chat flow |
| Direktörlük dağıtım | ceo_tasks → her direktörlük için AI çağrısı → celf_logs | lib/robots/celf-center veya yeni lib |
| Patron onay ekranı | celf_logs listele, Onayla/Reddet butonları | app/.../beyin-takimi veya celf sayfası |
| Patron → Franchise görüntüleme | Tenant listesi, tıklayınca tenant detay (öğrenci sayısı, gelir) | app/.../franchises veya tenants |
| CORS ayarı | Vitrin'den gelen isteklere izin | next.config veya API route |

### 5.2 yisa-s-website (Vitrin)

| Yapılacak | Nasıl |
|-----------|-------|
| CORS sorunu | Patron API'ye fetch — backend'de CORS header |
| Canlı grafikler | Örnek veri ile dashboard |
| Şablon galerisi | COO Mağazası (ileride) |

### 5.3 yisa-s-app (Franchise — BU KLASÖR)

| Yapılacak | Nasıl | Dosya/Route |
|-----------|-------|-------------|
| Tablo birleştirme | students vs athletes — tek model seç, API'leri uyumlu hale getir | API routes, migrations |
| RBAC | user_tenants, roles → middleware ile kontrol | lib/auth, middleware |
| Login koruması | /panel/* için auth zorunlu | middleware.ts |
| Subdomain → tenant_id | Host'tan subdomain çıkar → tenant_id bul → context | lib/subdomain, middleware |
| Antrenör paneli | /panel/antrenor veya /antrenor — yoklama, ders listesi | Yeni sayfalar |
| Kasa defteri | Günlük gelir-gider, celf_kasa veya yeni tablo | /panel/kasa |
| Aidat hatırlatma | Cron veya manuel tetikleme — veli_email'e hatırlatma | API + Supabase Edge Function |

---

## 6. BEYİN TAKIMI MVP — MİNİMUM UYGULANABİLİR AKIŞ

**Hedef:** Patron bir komut girdiğinde, CELF bunu ceo_tasks'a kaydetsin, manuel mapping ile (CTO→GPT, CMO→GPT, CPO→v0) AI çıktıları celf_logs'a yazılsın, Patron panelde görsün ve onaylasın. Uygulama bu aşamada manuel.

```
Adım 1: Patron "Antrenör paneli tasarla" yazar
Adım 2: API ceo_tasks'a INSERT (input, status: pending)
Adım 3: Cron veya buton: CELF dağıtım tetiklenir
        - CTO görevi → GPT API → celf_logs (director_key: CTO)
        - CPO görevi → v0 API (veya simüle) → celf_logs (CPO)
Adım 4: Patron /celf veya /beyin-takimi sayfasında çıktıları görür
Adım 5: Onayla → ceo_tasks.status = approved, celf_logs.status = approved
Adım 6: Manuel — Cursor'a kopyala, uygula
```

**Gerekli (yisa-s.com):**
- `/api/celf/task` — POST: ceo_tasks INSERT
- `/api/celf/execute` — tetikle: AI çağrıları, celf_logs INSERT
- Sayfa: celf_logs listele, Onayla/Reddet
- Mevcut ceo_tasks, celf_logs, celf_directorates tabloları kullanılır

---

## 7. ÖNERİLEN İLERLEME SIRASI (ONAY BEKLİYOR)

| Hafta | Klasör | Görev | Çıktı |
|-------|--------|-------|-------|
| **1** | yisa-s.com | Beyin Takımı MVP (ceo_tasks → celf_logs → onay ekranı) | Patron komut girer, çıktıları görür, onaylar |
| **1** | yisa-s.com | Patron → Franchise görüntüleme (tenant detay) | Tenant listesi, tıklayınca özet |
| **2** | yisa-s-app | Tablo uyumu (students/athletes kararı) + demo veri | Tutarlı veri, test |
| **2** | yisa-s-app | RBAC + login koruması | Güvenli erişim |
| **3** | yisa-s-app | Antrenör paneli | Yoklama alma |
| **3** | yisa-s-app | Kasa defteri MVP | Gelir-gider takibi |
| **4** | yisa-s.com | CORS + vitrin entegrasyonu | Demo formu → Patron |

---

## 8. KRİTİK KARARLAR (PATRON ONAYI GEREKLİ)

1. **students vs athletes:** Hangisi kalacak? Panel şu an students kullanıyor, franchise API athletes. Birleştirilmeli mi?
2. **Beyin Takımı MVP başlangıç:** Önce yisa-s.com'da motor mu, yoksa yisa-s-app'te RBAC/demo veri mi?
3. **5 direktörlük mü 12 mi?** MVP için 5 (CTO, CPO, CMO, COO, CFO) yeterli mi?

---

## 9. HIZLI REFERANS

| Soru | Cevap |
|------|-------|
| Cursor hangi klasörde açılmalı? | Yapılacak göreve göre: yisa-s.com / yisa-s-website / yisa-s-app |
| Beyin Takımı motoru nerede? | yisa-s.com (Patron Paneli) |
| Franchise öğrenci/yoklama/aidat nerede? | yisa-s-app |
| Vitrin intro, demo form nerede? | yisa-s-website |
| Tek veritabanı? | Evet — Supabase (bgtuqdkfppcjmtrdsldl.supabase.co) |
| ceo_tasks, celf_logs? | Var — Beyin Takımı MVP için kullanılabilir |

---

**YİSA-S — Teknolojiyi Spora Başlattık.**  
**15 Şubat 2026 | İş Şeması v1.0**
