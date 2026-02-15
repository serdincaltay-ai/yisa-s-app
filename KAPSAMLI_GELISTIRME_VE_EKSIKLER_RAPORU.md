# YİSA-S — Kapsamlı Geliştirme ve Eksikler Raporu

**Tarih:** 4 Şubat 2026  
**Amaç:** Sistemin genel çalışma mantığı, eksikler, “böyle olursa çalışmaz / daha iyi olur” önerileri ve yapılması gerekenler.

---

## 1. Özet: Ne Çalışır, Ne Eksik, Ne Riskli

| Alan | Durum | Not |
|------|--------|-----|
| Komut → CEO → CELF → Onay kuyruğu | ✅ Çalışır | Flow ve DB akışı tamam |
| COO Mağazası → Satış → CELF Kasa | ✅ Çalışır | Satış kaydı + tenant_purchases yazılıyor |
| Kasa Defteri gelir + ödeme onayı | ✅ Çalışır | Onay sonrası kullanım açılıyor |
| Patron kimliği | ⚠️ Sadece e-posta | DB’de “Patron” rolü yok, env’e bağlı |
| API yetkilendirme | ❌ Kritik eksik | Birçok endpoint auth/rol kontrolü yapmıyor |
| Migration / startup yetkisi | ❌ Zayıf | Client’tan gelen user’a güveniliyor veya auth yok |
| RLS (celf_kasa, tenant_purchases) | ⚠️ Eksik | Tablolarda RLS politikası yok |
| Hata / validasyon | ⚠️ Dağınık | Tutarlı mesajlar ve log yok |

Aşağıda bu başlıklar detaylı açılıyor; “yapılması gereken” maddeler net yazıldı.

---

## 2. Güvenlik ve Yetkilendirme (Kritik)

### 2.1 Bu Böyle Olursa Çalışmaz / Ciddi Risk

- **POST /api/patron/command** — Hiç kimlik kontrolü yok. Herkes (hatta giriş yapmamış biri) komut gönderebilir.  
  **Yapılacak:** En azından giriş zorunlu yapın; tercihen `isPatron(user)` veya `canTriggerFlow(user)` ile sadece Patron/yetkili roller tetikleyebilsin. User’ı **sunucuda** `createClient().auth.getUser()` ile alın, request body’den değil.

- **POST /api/kasa/approve** — Sadece “giriş yapmış mı” bakıyor. Böylece dashboard’a girebilen herhangi bir kullanıcı (Sistem Admini vb.) CELF kasa ödemesini onaylayabilir.  
  **Yapılacak:** Bu endpoint’i sadece Patron (ve istenirse Süper Admin) yapabilsin: `isPatron(user)` kontrolü ekleyin; değilse 403 dönün.

- **POST /api/approvals** (Onayla / Reddet / İptal / Push) — Auth yok. Herkes komut onaylayabilir / iptal edebilir.  
  **Yapılacak:** Giriş zorunlu + `canTriggerFlow(user)` (veya en azından `isPatron(user)`). User’ı cookie/session’dan alın.

- **GET /api/approvals** — Onay kuyruğu listesi herkese açık (auth yok). Hassas iş bilgisi sızabilir.  
  **Yapılacak:** Giriş + dashboard yetkisi (örn. `canAccessDashboard(user)`).

- **POST /api/db/migrate** — Kimlik kontrolü yok. Endpoint’i bilen herkes migration çalıştırabilir.  
  **Yapılacak:** Sadece Patron (veya güvenilir bir “sistem admin” rolü) çağırabilsin; user’ı sunucuda session’dan alın.

- **POST /api/startup** (run_task / run_director / run_all) — Yetki `body.user` ile kontrol ediliyor. İstemci `user: { email: PATRON_EMAIL }` göndererek yetkiyi taklit edebilir.  
  **Yapılacak:** User’ı **asla** body’den almayın. `createClient().auth.getUser()` ile alın; `canTriggerFlow(user)` ile kontrol edin.

### 2.2 Bu Böyle Olursa Daha İyi Olur

- **Ortak auth helper:** Örneğin `requireAuth()`, `requirePatron()`, `requireDashboard()` gibi fonksiyonlar. Tüm hassas API’lerde tek yerden kullanılsın; 401/403 ve loglama tutarlı olsun.
- **Patron’u veritabanında tutmak:** Şu an Patron = `NEXT_PUBLIC_PATRON_EMAIL`. İleride çoklu “Patron benzeri” rol veya yetkili liste isterseniz, `profiles` veya `role_permissions` + kullanıcı eşlemesi (örn. `user_roles`) ile “sistem rolü” saklamak daha esnek olur.
- **Rate limiting:** Özellikle `/api/patron/command`, `/api/chat/flow`, `/api/ai` gibi pahalı endpoint’lere istek sınırı koymak bot / kötüye kullanımı azaltır.

---

## 3. Veritabanı ve RLS

### 3.1 Eksik / Risk

- **celf_kasa** — RLS açılmamış veya politika yok. Service role ile yazılıyor; anon key ile erişimde tüm satırlar görünebilir/güncellenebilir (politikaya bağlı).  
  **Yapılacak:**  
  - CELF kasa verisi merkez; sadece backend (service role) yazsın.  
  - Okuma: Sadece “Patron paneli” yetkisi olan kullanıcılar (veya service role) okuyabilsin. RLS ile `auth.uid()` ve bir “admin/Patron” kontrolü (ör. `profiles.role` veya allow-list) tanımlayın.  
  - Gider/gelir güncelleme/silme: Mümkünse sadece service role; RLS’te yazma/update’i kısıtlayın.

- **tenant_purchases** — Tenant bazlı veri. Şu an RLS yoksa tenant A, tenant B’nin satın alımlarını görebilir.  
  **Yapılacak:** RLS ekleyin: `tenant_id` için erişim, `user_tenants` veya `tenants.owner_id` ile eşleşmeli (mevcut tenant şemasına uygun). Franchise kullanıcısı sadece kendi tenant’ının satın alımlarını görsün.

- **patron_commands** — Hassas. Liste/okuma ve güncelleme sadece yetkili kullanıcılar (Patron/dashboard) tarafından yapılmalı.  
  **Yapılacak:** RLS ile SELECT/UPDATE’i “Patron/dashboard rolü” ile sınırlayın; diğer kullanıcılar hiç görmesin/güncelleyemesin.

### 3.2 Bu Böyle Olursa Daha İyi Olur

- **Odeme_onaylandi / odeme_onaylayan:** `celf_kasa` ve `tenant_purchases` için onay zamanı ve onaylayan kullanıcı tutuluyor; audit için iyi. İleride “onay geçmişi” tablosu eklenebilir (kim, ne zaman, hangi kayıt).
- **Soft delete:** Kritik tablolarda (ör. patron_commands, celf_kasa) `deleted_at` ile soft delete düşünülebilir; yanlışlıkla silme ve denetim kolaylaşır.

---

## 4. Akış ve İş Mantığı

### 4.1 Komut → Satış → Kasa (Mevcut Akış)

- Patron komut → CEO → CELF → Onay kuyruğu → Onay → `ceo_templates` → COO Mağazası’nda listelenir.  
- Franchise “Satin Al” → `POST /api/sales` → `celf_kasa` (gelir) + `tenant_purchases` (onay bekliyor).  
- Patron “Ödemeyi onayla” → `celf_kasa.odeme_onaylandi` + `tenant_purchases.odeme_onaylandi` = true → kullanım açılır.

Bu akış **doğru tasarlanmış**; eksik olan sadece yukarıdaki yetkilendirme ve RLS.

### 4.2 Eksik / Belirsiz Noktalar

- **Çift satış:** Aynı franchise aynı ürünü iki kez “Satin Al” basarsa iki kayıt oluşur. İsterseniz “aynı tenant + product_key için bekleyen satın alma varsa yeni kayıt yerine uyarı” gibi idempotency veya uyarı eklenebilir.
- **İade / iptal:** Satış sonrası iade veya satın almayı iptal etme akışı yok. İleride “iade” hareketi (gider olarak veya negatif gelir) ve `tenant_purchases` için “iptal” durumu eklenebilir.
- **Para birimi:** Tutarlar TRY varsayılıyor; çok para birimli raporlama isterseniz dönüşüm ve filtreleme netleştirilmeli.

### 4.3 Bu Böyle Olursa Daha İyi Olur

- **Onay kuyruğu sırası:** “Önce gelen önce onaylansın” veya öncelik alanı; UI’da sıralama ve filtre (tarih, durum, tenant) tutarlı olsun.
- **Bildirim:** Yeni satış veya yeni onay bekleyen komut olduğunda Patron’a e-posta/push (ileride) eklenebilir.
- **Raporlama:** Kasa Defteri’nde dönem seçimi (ay/hafta), özet (toplam gelir/gider), export (CSV/PDF) ile raporlama güçlendirilebilir.

---

## 5. Franchise ve Tenant Tarafı

### 5.1 Çalışanlar

- Tenant ayarları (antrenor_hedef, temizlik_hedef, mudur_hedef, aidat_tiers) ve ders programı (tenant_schedule) eklendi; API ve UI var.
- Franchise paneli girişi ve “atanmış tenant” kontrolü mevcut.

### 5.2 Eksik / İyileştirme

- **Tenant atanmadan önce:** “Henüz tesis atanmadı” durumunda kullanıcı bazı sayfaları görüyor; veri girişi “tenant atanınca taşınacak” deniyor. Taşıma işleminin gerçekten yapıldığı bir akış (demo talebi onayı → tenant oluşturma → bu kullanıcıyı owner/user_tenants’a bağlama) dokümante edilmeli ve test edilmeli.
- **Franchise ↔ CELF kasa:** Franchise sadece “Satin Al” ile satış açar; kendi satış geçmişini (sadece kendi tenant’ına ait) görebileceği bir “Satın alma geçmişim” sayfası eklenebilir (tenant_purchases + RLS ile).
- **Şablon kullanımı:** Satın alınan şablonun gerçekten “kullanıldığı” (ör. bir rapor üretildiği, bir modül açıldığı) kaydı varsa, “Kullanılan şablonlar” raporu ile değer ölçülebilir.

---

## 6. API ve Teknik Tutarlılık

### 6.1 Bu Böyle Olursa Daha İyi Olur

- **Hata formatı:** Tüm API’ler aynı yapıda hata dönsün; örn. `{ error: string, code?: string }`. Frontend tek bir error handler ile parse edebilsin.
- **Validasyon:** Girdi (amount, id’ler, enum’lar) için Zod veya benzeri şema ile validate edin; 400 cevapları anlamlı mesajlarla dönsün.
- **Loglama:** Hassas işlemlerde (onay, satış, migration, startup tetikleme) kim, ne zaman, hangi id ile yaptı; audit_log veya benzeri bir yere yazılsın (zaten insertAuditLog kullanılıyor; kasa onayı ve migration için de eklenebilir).

### 6.2 Küçük Eksikler

- **GET /api/expenses:** Auth yok; Kasa Defteri verisi herkese açık olabilir. Sadece dashboard yetkisi olan (Patron paneli) kullanıcılar çağırabilsin.
- **GET /api/stats:** Aynı şekilde Patron paneli istatistikleri; auth ve rol kontrolü eklenmeli.
- **POST /api/templates:** Şablon oluşturma/güncelleme varsa; kimin oluşturduğu ve yetki (Patron/onay zinciri) netleştirilmeli.

---

## 7. Öncelik Sıralı Yapılacaklar Listesi

### Kritik (Güvenlik – hemen)

1. **POST /api/patron/command** — Auth ekle; sadece Patron/yetkili roller tetikleyebilsin; user’ı sunucuda al.
2. **POST /api/kasa/approve** — `isPatron(user)` (veya tanımlı “onay yetkisi”) kontrolü ekle; değilse 403.
3. **POST /api/approvals** — Giriş + `canTriggerFlow(user)`; user’ı session’dan al.
4. **GET /api/approvals** — Giriş + dashboard yetkisi.
5. **POST /api/startup** — User’ı body’den kaldır; session’dan al + `canTriggerFlow(user)`.
6. **POST /api/db/migrate** — Giriş + sadece Patron (veya tek bir “sistem admin” rolü).

### Yüksek (Veri bütünlüğü ve gizlilik)

7. **celf_kasa** — RLS aç; okuma/yazma sadece backend veya Patron rolü.
8. **tenant_purchases** — RLS: tenant’a göre erişim (user_tenants / owner_id).
9. **patron_commands** — RLS: sadece yetkili roller görsün/güncellesin.
10. **GET /api/expenses** ve **GET /api/stats** — Auth + rol (Patron paneli).

### Orta (İyileştirme)

11. Ortak `requireAuth` / `requirePatron` / `requireDashboard` helper’ları ve tüm hassas route’larda kullanım.
12. Hata cevabı standardı ve mümkünse Zod ile validasyon.
13. Kasa onayı ve migration için audit log kaydı.
14. Çift satış (aynı ürün + tenant, bekleyen) için uyarı veya idempotency.

### Düşük (İleride)

15. Patron’un veritabanında (profiles / user_roles) tutulması.
16. Rate limiting (patron/command, chat/flow, ai).
17. Franchise “Satın alma geçmişim” sayfası.
18. Kasa raporlama (dönem, özet, export).
19. İade/iptal akışı (kasa + tenant_purchases).

---

## 8. Sonuç

- **Çalışan:** Komut → Onay → Şablon → COO Mağazası → Satış → CELF Kasa → Ödeme onayı akışı ve franchise ayarları/ders programı mantıklı ve uçtan uca bağlı.
- **Çalışmaz / risk:** Yetkisiz kullanıcılar birçok kritik API’yi (komut gönderme, onay, kasa onayı, migration, startup) çağırabiliyor; bazı veriler RLS olmadan okunabiliyor.
- **Daha iyi olur:** Auth helper’lar, RLS, tutarlı hata/validasyon, audit ve ileride raporlama/bildirim ile sistem hem güvenli hem de sürdürülebilir hale gelir.

Önce **Kritik** maddeleri (1–6) uygulayıp ardından **Yüksek** (7–10) ile RLS ve diğer endpoint’leri kilitlemeniz önerilir.
