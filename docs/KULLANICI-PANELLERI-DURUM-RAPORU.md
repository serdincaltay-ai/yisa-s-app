# YİSA-S — Kullanıcı Panelleri Durum Raporu

> **Amaç:** Veli, antrenör, tesis müdürü, temizlik personeli, kayıt görevlisi, tesis sahibi panellerinin ne kadar hazır olduğu; giriş sonrası hangi bilgilerin açılacağı; mevcut veya başka klasörlerden çekilebilecek içerik/veri.

**Tarih:** 27 Şubat 2026  
**Kaynak:** tenant-yisa-s (çekirdek), yisa-s-com (giriş), ROL_FAYDA_SAYFA_DOMAIN_OZET.md, kod taraması.

---

## 1. Özet Tablo: Panel Hazırlık Durumu

| Rol | Panel yolu | Sayfa var mı? | API / veri | Giriş sonrası yönlendirme | Hazırlık (kaba) |
|-----|------------|----------------|------------|----------------------------|------------------|
| **Veli** | `/veli` | ✅ Evet | ✅ API var; gerçek + demo | `/veli` | **~70%** — UI hazır; canlı veri .env + Supabase’e bağlı |
| **Antrenör** | `/antrenor` | ✅ Evet | ✅ API var | `/antrenor` | **~75%** — Sayfa + API hazır; veri tenant/staff’a bağlı |
| **Tesis Müdürü** | `/tesis` | ✅ Evet (tek sayfa) | ⚠️ Mock veri; alt sayfa/API yok | `/tesis` | **~40%** — İskelet var; gerçek veri ve alt sayfalar eksik |
| **Franchise / Tesis Sahibi** | `/franchise` | ✅ Evet | ✅ API var | `/franchise` | **~80%** — Ana işletme paneli en dolu |
| **Kayıt görevlisi** | `/franchise` veya `/panel` | ✅ Franchise ve panel sayfaları var | ✅ API var | Şu an rol ayrımı yok → franchise | **~60%** — Ayrı “kayıt paneli” yok; franchise/panel kullanılıyor |
| **Temizlik personeli** | `/franchise` (rol: cleaning) | ⚠️ Sadece personel listesinde rol var | ❌ Günlük checklist API/sayfası yok | franchise | **~20%** — Ayrı panel yok; “temizlik checklist” sayfası yok |
| **Yardımcı antrenör** | `/antrenor` | ✅ Antrenör ile aynı | Aynı API | `/antrenor` | Antrenörle aynı |
| **Patron** | `/dashboard` | ✅ Evet | ✅ | `/dashboard` | Ayrı rapor konusu |

**“Veli paneli %0” ifadesi:** Veli paneli **hiç başlanmamış değil**. Sayfalar ve API’ler (çocuklar, ödeme, yoklama, mesajlar, gelişim, kredi) tenant-yisa-s içinde mevcut. Eksik olan: **canlı ortamda .env + Supabase verisi** ve **veli hesabıyla giriş testi**. Yani **UI ve akış ~70% hazır; veri bağlantısı ve test kısmı %0’a yakın** denebilir.

---

## 2. Giriş ve Rol Yönlendirmesi (Hangi kullanıcı nereye düşer?)

**tenant-yisa-s** (`lib/auth/resolve-role.ts`):

| Rol (veritabanı / user_metadata) | Giriş sonrası URL |
|-----------------------------------|---------------------|
| Patron (veya PATRON_EMAIL) | `/dashboard` |
| franchise / firma_sahibi / ROL-1 | `/franchise` |
| isletme_muduru / tesis_sahibi / tesis müdürü | `/tesis` |
| antrenor / antrenör | `/antrenor` |
| veli / ROL-10 | `/veli` |
| (tanımsız) | Varsayılan: `/veli` |

**yisa-s-com** (auth/login): patron → app.yisa-s.com; franchise → `/franchise/dashboard`; antrenör → `/antrenor`; veli → `/veli`. Tesis müdürü, kayıt, temizlik ayrı case yok → franchise’a düşer.

**Özet:** Kullanıcı adı + şifre ile giriş yapınca rol çözülüyor; yukarıdaki tabloya göre ilgili panele yönlendiriliyor. “Bu bilgiler olacak” için aşağıdaki sayfa/API listeleri referans alınabilir.

---

## 3. Panel Bazlı: Hangi Sayfalar ve Veriler Var?

### 3.1 Veli Paneli (`/veli`)

| Sayfa | Dosya | Veri kaynağı | Not |
|-------|--------|---------------|-----|
| Ana / seçim | `app/veli/page.tsx` | `/api/veli/children` | Gerçek: parent_user_id = auth.uid() |
| Dashboard | `app/veli/dashboard/page.tsx` | `/api/veli/demo/children`, `demo/attendance` | **Demo** (Supabase’de demo.veli@yisa-s.com yoksa boş) |
| Çocuk detay | `app/veli/cocuk/[id]/page.tsx` | `/api/veli/demo/children`, `demo/attendance`, `demo/payments` | **Demo** |
| Ödeme | `app/veli/odeme/page.tsx` | `/api/veli/demo/payments` | **Demo** |
| Gelişim | `app/veli/gelisim/page.tsx` | `/api/veli/children`, `/api/veli/gelisim` | Kısmen gerçek |
| Kredi | `app/veli/kredi/page.tsx` | `/api/veli/kredi` | API var |
| Duyurular | `app/veli/duyurular/page.tsx` | — | Sayfa var; API bağlanabilir |
| Mesajlar | `app/veli/mesajlar/page.tsx` | `/api/veli/messages` | Konuşma listesi ileride tablolarla doldurulacak |
| Giriş | `app/veli/giris/page.tsx` | Auth | Veli giriş sayfası |

**Çocuk listesi gerçek veri:** `GET /api/veli/children` — Supabase `athletes` tablosunda `parent_user_id = giriş yapan user id` olan kayıtlar. İlk girişte `parent_email = user.email` olan kayıtlar otomatik `parent_user_id` ile bağlanıyor.

**Sonuç:** Veli paneli sayfa ve API olarak hazır. “Hiç yok” değil; canlı veri ve test eksik.

---

### 3.2 Antrenör Paneli (`/antrenor`)

| Sayfa | Dosya | Veri kaynağı |
|-------|--------|---------------|
| Dashboard | `app/antrenor/page.tsx` | `/api/antrenor/dashboard` |
| Sporcular | `app/antrenor/sporcular/page.tsx` | `/api/antrenor/sporcular` |
| Sporcu detay | `app/antrenor/sporcular/[id]/page.tsx` | `/api/antrenor/sporcular/[id]` |
| Gelişim | `app/antrenor/sporcular/[id]/gelisim/page.tsx` | `/api/antrenor/olcum/gecmis` |
| Yoklama | `app/antrenor/yoklama/page.tsx` | `/api/antrenor/schedules`, `/api/antrenor/yoklama` |
| Ölçüm | `app/antrenor/olcum/page.tsx` | `/api/antrenor/olcum` |

Tümü API ile bağlı; tenant + staff eşleşmesi ve Supabase verisine bağlı.

---

### 3.3 Tesis Müdürü Paneli (`/tesis`)

| Durum | Açıklama |
|-------|----------|
| Sayfa | `app/tesis/page.tsx` — tek sayfa, sidebar menü (Ana Sayfa, Öğrenciler, Ders Programı, Sağlık Takibi, Antrenörler, Belgeler, Raporlar, Ayarlar) |
| Veri | Şu an **sabit mock** (ogrenciler, bugunDersler, bildirimler). Alt URL’ler yok; menü tıklanınca aynı sayfada içerik değişmiyor (sadece state). |
| Eksik | Gerçek API, alt sayfalar (/tesis/ogrenciler, /tesis/dersler vb.), Supabase bağlantısı. |

---

### 3.4 Franchise / Tesis Sahibi / Kayıt Personeli

- **Franchise paneli** (`/franchise`): Ana sayfa, öğrenciler, personel, ders programı, aidat, yoklama, iletişim, belgeler, ayarlar vb. — en kapsamlı panel.
- **Panel** (`/panel`): `/panel/ogrenciler`, `/panel/odemeler`, `/panel/yoklama`, `/panel/program`, `/panel/aidat` — öğrenci/ödeme/yoklama işleri. Kayıt görevlisi buradan veya franchise’dan kullanabilir; rol bazlı kısıtlama ayrı tanımlanabilir.
- **Personel sayfası** (`/personel`): Franchise yetkisi ile personel listesi ve davet; roller: tesis müdürü, antrenör, yardımcı antrenör, kasa/kayıt, sekreter, **temizlik**, güvenlik. Yani “temizlik personeli” **rolü** var; ayrı **temizlik paneli** yok.

---

### 3.5 Temizlik Personeli

- **Şu an:** Sadece franchise personel listesinde rol: `cleaning` (temizlik). Ayrı bir “temizlik personeli paneli” veya “günlük checklist” sayfası/API’si **yok**.
- **ROL_FAYDA:** “Temizlik: Günlük checklist, tamamla, sorun bildir” deniyor; bu özellik kodda yok.
- **Çekilebilecek:** Şema dokümanında “Tesis Acilis Checklist” (COO) şablonu geçiyor; ileride `/tesis/temizlik` veya `/franchise/temizlik-checklist` gibi bir sayfa eklenebilir.

---

## 4. Başka Klasörlerden Çekilebilecek İçerik / Veri

| Kaynak | Ne var? | Nereye / ne için kullanılabilir? |
|--------|---------|-----------------------------------|
| **ÇALIŞMALAR / yisa-s-patron (4),(5)** | `app/panel/veli/page.tsx` — Veli Paneli (Cocugum, Gelisim, Odemeler, Mesajlar sekmeli) | Referans UI; tenant-yisa-s veli sayfaları zaten daha kapsamlı; gerekirse sekme yapısı veya metinler alınabilir. |
| **_schema_sources/app-yisa-s-main** | `app/veli/` — layout (Dashboard, Çocuklarım, Devamsızlık, Ödeme, Mesajlar, Belgeler), dashboard sayfası | Sidebar menü ve sayfa isimleri tenant-yisa-s ile uyumlu; eksik sayfa varsa referans. |
| **_schema_sources/tenant-yisa-s-main** | Aynı yapıya yakın veli/antrenor/tesis | Zaten çekirdek tenant-yisa-s ile birleştirilmiş durumda. |
| **_schema_sources/yisa-s-app-uh-main** | Hafif sürüm: ana sayfa, giriş, patron, franchise, veli, antrenor, **tesis** panelleri | Tesis müdürü için ek sayfa fikirleri veya basit şablonlar; CELF/Asistan dokümanları. |
| **tenant-yisa-s ROL_FAYDA_SAYFA_DOMAIN_OZET.md** | Rol → panel eşlemesi, veli rapor şablonu (10 perspektif), domain listesi | “Kim nereye girer, veli raporunda ne olacak” için tek referans. |
| **YISA-S-TUM-PROJELER-SEMA-VE-ZORUNLULUKLAR.md** | Domain ve repo atamaları (veli.yisa-s.com → tenant-yisa-s) | Giriş URL’leri ve domain planı. |

**Eski / dağınık projelerde “hazır veri”:** Öğrenci/ödeme/yoklama verisi Supabase’de olmalı (BJK tenant, 137 öğrenci vb.). Eski bir uygulama veritabanı export’u varsa migration/seed ile tenant-yisa-s Supabase’ine aktarılabilir; panel sayfaları zaten bu tablolara (athletes, payments, student_attendance vb.) bağlanacak şekilde yazılmış.

---

## 5. “Girecekler, Şu Bilgiler Olacak” Özet Tablosu

Aşağıdaki tablo, raporlarda veya dokümanda “kullanıcı girişi sonrası ne görür” diye kullanılabilir.

| Rol | Giriş URL (tenant) | Giriş sonrası açılan | Göreceği başlıca bilgiler |
|-----|---------------------|----------------------|----------------------------|
| **Veli** | `/auth/login` (veya veli.yisa-s.com) | `/veli` | Çocuklarım listesi, çocuk seçince gelişim/ödeme/yoklama, mesajlar, duyurular, kredi. (Veri: Supabase + parent_user_id) |
| **Antrenör** | `/auth/login` | `/antrenor` | Bugünkü dersler, atanan sporcular, yoklama, sporcu detay ve gelişim, ölçüm girişi. |
| **Tesis Müdürü** | `/auth/login` | `/tesis` | Tek sayfa: öğrenci listesi, bugünkü dersler, bildirimler (şu an mock). İleride: gerçek öğrenci/ders/yoklama. |
| **Franchise / Tesis Sahibi** | `/auth/login` | `/franchise` | Genel bakış, öğrenciler, personel, ders programı, aidat, yoklama, iletişim, belgeler, ayarlar. |
| **Kayıt görevlisi** | `/auth/login` | `/franchise` (veya rol ile `/panel`) | Öğrenci kayıt, ödemeler, yoklama (panel sayfaları). Ayrı “kayıt paneli” yok; franchise/panel kullanır. |
| **Temizlik personeli** | `/auth/login` | `/franchise` | Şu an sadece personel olarak listelenir; günlük checklist sayfası yok. |
| **Patron** | `/patron/login` veya app.yisa-s.com | `/dashboard` | Onay kuyruğu, franchise’lar, tesisler, CELF, raporlar vb. |

---

## 6. Yapılacaklar (Öncelik Sırasıyla)

1. **Veli paneli canlı veri:** Supabase’de BJK tenant için `athletes.parent_user_id` ve `parent_email` doldur; veli hesabıyla giriş yapıp `/veli` ve `/api/veli/children` test et. Demo API’leri isteğe göre gerçek `/api/veli/...` ile değiştir (dashboard, odeme, cocuk detay).
2. **Tesis müdürü:** `/tesis` için gerçek API’ler ve alt sayfalar (öğrenciler, dersler, yoklama özeti) ekle; mock veriyi kaldır.
3. **Temizlik personeli:** Rol zaten var; “günlük temizlik checklist” sayfası ve API’si eklenebilir (örn. `/franchise/temizlik` veya `/tesis/temizlik`).
4. **Kayıt görevlisi:** İstersen rol bazlı giriş sonrası doğrudan `/panel` yönlendirmesi (resolve-role’de yeni rol + path).
5. **Doküman:** Bu rapor, “hangi panel ne durumda” ve “giriş sonrası ne açılır” için tek referans olarak güncellenebilir; Final İş Haritası’na “Kullanıcı panelleri durum ve eksikler” maddesi eklenebilir.

---

**Özet:** Veli, antrenör, tesis müdürü, franchise/tesis sahibi için **sayfa ve büyük oranda API mevcut**; “hiç hazır değil” doğru değil. Eksik olan: canlı veri bağlantısı, veli/antrenör test hesapları, tesis panelinde gerçek veri ve alt sayfalar, temizlik checklist sayfası ve (isteğe bağlı) kayıt görevlisi için ayrı yönlendirme. Başka klasörlerden çekilebilecek şeyler: referans UI (veli/panel), şablon metinleri ve CELF dokümanları; gerçek veri için Supabase migration/seed veya mevcut veritabanı kontrolü.
