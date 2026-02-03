# AŞAMA 7 RAPOR — Devamsızlık ve Yoklama Sistemi

**Tarih:** 2 Şubat 2026  
**Durum:** ✅ Tamamlandı

---

## Yapılan İşler

### 1. Veritabanı
- `supabase/migrations/20260202_attendance.sql`
- **attendance** tablosu: tenant_id, athlete_id, lesson_date, lesson_time, status (present/absent/late/excused), notes, marked_by
- Unique: (tenant_id, athlete_id, lesson_date)
- RLS: Tenant yönetir, veli sadece okur

### 2. API
- **GET/POST** `/api/franchise/attendance` — Tarih bazlı yoklama listesi, toplu kayıt (upsert)
- **GET** `/api/veli/attendance` — Çocukların son N gün yoklaması + devam oranı (%)

### 3. Franchise Paneli — Yoklama
- Tarih seçici
- Sporcu listesi + durum seçimi (Geldi/Gelmedi/Geç/İzinli)
- Kaydet butonu (toplu upsert)

### 4. Veli Paneli — Devamsızlık
- Genel sekmesinde "Devam Oranı (Son 30 gün)" kartı
- % oran + son 10 yoklama kaydı (tarih, durum)
