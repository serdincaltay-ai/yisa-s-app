# AŞAMA 6 RAPOR — Aidat Takip Sistemi

**Tarih:** 2 Şubat 2026  
**Durum:** ✅ Tamamlandı

---

## Yapılan İşler

### 1. Veritabanı
- `supabase/migrations/20260202_payments.sql`
- **payments** tablosu: tenant_id, athlete_id, amount, payment_type (aidat/kayit/ekstra), period_month, period_year, due_date, paid_date, status (pending/paid/overdue/cancelled), payment_method
- RLS: Tenant kullanıcıları yönetir, veli sadece kendi çocuklarının ödemelerini okur

### 2. API
- **GET/POST/PATCH** `/api/franchise/payments` — Liste, yeni ödeme, toplu aidat, ödeme güncelleme
- **GET** `/api/veli/payments` — Veli: çocukların ödemeleri + toplam borç

### 3. Franchise Paneli — Aidat Takibi
- Filtre: Tümü / Bekleyen / Ödendi / Gecikmiş
- Ödeme listesi (öğrenci, tutar, dönem, durum)
- Yeni ödeme ekleme formu (öğrenci, tutar, dönem, son ödeme tarihi)
- Toplu aidat oluşturma (tüm aktif üyeler için ay/yıl seçerek)
- "Ödendi Yap" butonu (bekleyen/gecikmiş için)

### 4. Veli Paneli — Aidat sekmesi
- Toplam borç özeti (varsa)
- Çocukların ödeme listesi (durum: Ödendi/Bekliyor/Gecikmiş)

---

## Migration

```bash
supabase db push
# veya Supabase SQL Editor'da 20260202_payments.sql çalıştırın
```
