# YİSA-S — Site Çalışma Mantığı

Bu doküman, sistemin nasıl çalıştığını adım adım açıklar.

---

## 1. GENEL MANTIK

YİSA-S, **alt domainlere** göre farklı paneller sunar:

| Subdomain | Kim girer? | Ne görür? |
|-----------|------------|-----------|
| **www.yisa-s.com** | Herkes | Tanıtım sitesi, demo talep formu, fiyatlar |
| **app.yisa-s.com** | Patron (Serdinç ALTAY) | Patron paneli: CELF, onay kuyruğu, tenant yönetimi |
| **franchise.yisa-s.com** | Franchise sahibi / tesis yetkilisi | Tesis paneli: üye, personel, aidat, yoklama |
| **veli.yisa-s.com** | Veli | Çocuklarım, aidat, devamsızlık |
| **antrenor.yisa-s.com** | Antrenör | Antrenör paneli |

Giriş adresi ortak: `/auth/login` (Supabase Auth). Girişten sonra rol ve tenant’a göre uygun panele yönlendirilirsin.

---

## 2. AKIŞ: DEMO → SATIŞ → TESİS

### Adım 1: Müşteri demo talebinde bulunur

- **Nerede?** www.yisa-s.com veya /demo sayfası
- **Ne yapar?** Form doldurur: Ad, e-posta, telefon, tesis türü, şehir
- **Kayıt:** `demo_requests` tablosuna yazılır, durum: `new`

### Adım 2: Patron onaylar

- **Nerede?** app.yisa-s.com → Onay Kuyruğu → Demo Talepleri
- **Ne yapar?** "Onayla" veya "Reddet"
- **Onayla:**
  1. `tenants` tablosunda yeni tesis oluşturulur (slug, ad, durum: aktif)
  2. E-posta ile auth kullanıcısı aranır; bulunursa:
     - `tenants.owner_id` = o kullanıcı
     - `user_tenants` tablosuna (user_id, tenant_id, role: owner) eklenir
  3. Demo talebi durumu `converted` olur

### Adım 3: Franchise sahibi giriş yapar

- **Nerede?** franchise.yisa-s.com
- **Koşul:** Bu e-posta ile daha önce kayıt olmuş olmalı
- **Ne görür?** Kendi tesisinin dashboard’u, üye listesi, personel, aidat, yoklama vb.

---

## 3. FRANCHISE PANELİ (Tesis Yönetimi)

### Giriş sonrası

- `user_tenants` veya `tenants.owner_id` ile tenant bulunur
- Tenant yoksa: "Tesis atanmasını bekleyin" mesajı gösterilir

### Yapabildikleri

1. **Üyeler (Öğrenciler)**  
   - Liste görüntüleme  
   - Yeni üye ekleme (ad, soyad, doğum tarihi, veli e-postası)  
   - Veli e-postası:  
     - Eğer bu e-posta ile sistemde kullanıcı varsa → `parent_user_id` otomatik atanır  
     - Yoksa → sadece `parent_email` kaydedilir, veli sonra kayıt olunca eşleşir  

2. **Personel**  
   - Antrenör, müdür vb. ekleme, listeleme  

3. **Aidat Takibi**  
   - Ödeme listesi (filtre: tümü / bekleyen / ödendi / gecikmiş)  
   - Yeni ödeme ekleme (öğrenci, tutar, dönem)  
   - Toplu aidat (tüm aktif üyeler için ay seçerek)  
   - "Ödendi Yap" ile durum güncelleme  

4. **Yoklama**  
   - Tarih seçerek günlük yoklama  
   - Sporcu listesi + durum: Geldi / Gelmedi / Geç / İzinli  
   - Kaydet → `attendance` tablosuna upsert  

5. **COO Mağazası**  
   - Şablon kullanımı, modül/robot ürünleri  

---

## 4. VELİ PANELİ

### Giriş sonrası

- `athletes.parent_user_id = auth.uid()` olan kayıtlar çocuklar listesi olarak gelir  
- **Otomatik eşleştirme:**  
  - `parent_email = kullanıcı e-postası` ve `parent_user_id = null` olan kayıtlar varsa  
  - Bunların `parent_user_id` değeri velinin user.id ile güncellenir  
- Böylece veli ilk girişte çocuklarını otomatik görür  

### Yapabildikleri

1. **Genel**  
   - Çocuk bilgisi, devam oranı (son 30 gün), son yoklamalar  

2. **Aidat**  
   - Toplam borç  
   - Ödeme listesi: Ödendi / Bekliyor / Gecikmiş  

3. **Antrenman / AI**  
   - Placeholder içerik (ileride doldurulacak)  

---

## 5. VERİ AKIŞI ÖZETİ

```
Demo Talep (www)
    ↓
Patron Onayı (app)
    ↓
Tenant + user_tenants oluşur
    ↓
Franchise girişi → Tesis paneli

Franchise üye ekler (veli e-postası ile)
    ↓
athletes: parent_email, parent_user_id (varsa)
    ↓
Veli kayıt olur, giriş yapar
    ↓
parent_email eşleşirse → parent_user_id güncellenir
    ↓
Veli çocuklarını görür, aidat/devamsızlık takip eder
```

---

## 6. ÖNEMLİ TABLOLAR

| Tablo | Amaç |
|-------|------|
| `tenants` | Tesisler (franchise) |
| `user_tenants` | Kullanıcı–tesis ilişkisi, rol |
| `demo_requests` | Demo talepleri |
| `athletes` | Üyeler (parent_user_id = veli, parent_email = veli e-postası) |
| `staff` | Personel |
| `payments` | Aidat / ödemeler |
| `attendance` | Yoklama kayıtları |

---

## 7. RLS (Güvenlik)

- Her tablo `tenant_id` ile tenant izolasyonu kullanır  
- Franchise kullanıcıları sadece kendi tenant’ının verisini görür  
- Veliler sadece `parent_user_id` eşleşen çocukların verisini okur  
