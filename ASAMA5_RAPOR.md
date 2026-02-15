# AŞAMA 5 RAPOR — Patron Paneli Güçlendirme (app.yisa-s.com)

**Tarih:** 2 Şubat 2026  
**Durum:** ✅ Tamamlandı — Kilitleme 🔒

---

## Yapılan İşler

### 1. CELF Direktörlükleri (/dashboard/directors)
- 12 direktörlük kartı: her biri için ad, görevler, AI sağlayıcılar
- "Tetikle" butonu — direktörlük başlangıç görevlerini çalıştırır (Patron yetkisi)
- Tek görev tetikleme — sıradaki görevlerden "Çalıştır" ile tek görev
- `/api/startup` GET (özet + sıradaki görevler) ve POST (run_director, run_task)

### 2. Franchise Yönetimi
- Tüm tenant'lar zaten `/dashboard/franchises` ve `/api/franchises` ile listeleniyor
- Tenant detay: `/dashboard/franchises/[id]`
- Demo talebi onayı sonrası tenant otomatik oluşturuluyor (aşağıda)

### 3. Onay Kuyruğu İşlevselliği
- **Patron Komutları** sekmesi: mevcut patron_commands onay/red/iptal
- **Demo Talepleri** sekmesi (yeni):
  - Demo taleplerini listeleme (GET /api/demo-requests)
  - Onay / Red butonları
  - Onaylandığında:
    - `tenants` tablosuna yeni kayıt (ad, slug, durum, package_type)
    - `demo_requests.status` → `converted`

### 4. API Güncellemeleri
- **GET /api/demo-requests**: Demo taleplerini listele (Patron paneli)
- **POST /api/demo-requests** (action: decide):
  - `{ action: 'decide', id, decision: 'approve' | 'reject' }`
  - approve → tenant oluştur, demo_requests güncelle

### 5. Sidebar
- CELF Direktörlükleri
- Onay Kuyruğu
- (Mevcut: Direktörler Canlı, Franchise, Kasa, Şablonlar, Raporlar, Ayarlar)

---

## Dosya Değişiklikleri

| Dosya | İşlem |
|-------|-------|
| app/dashboard/directors/page.tsx | Yeni — CELF direktörlükleri + tetikleme |
| app/dashboard/onay-kuyrugu/page.tsx | Güncellendi — Demo Talepleri sekmesi |
| app/api/demo-requests/route.ts | Güncellendi — GET + decide action |
| app/components/DashboardSidebar.tsx | Güncellendi — Directors, Onay Kuyruğu menü |

---

## Tenant Oluşturma (Demo Onayı)

Onay sırasında oluşturulan tenant:
- `ad`, `name`: demo talebi adı + şehir
- `slug`: `{slugify(name)}-{id.slice(0,8)}`
- `durum`: `aktif`
- `package_type`: `starter`
- `owner_id`: `null` (sonra franchise sahibi hesap açtığında bağlanabilir)
