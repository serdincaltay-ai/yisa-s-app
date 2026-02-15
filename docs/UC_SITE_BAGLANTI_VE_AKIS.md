# YİSA-S — 3 Site Bağlantısı ve Akış Şeması

## 1. Üç Site Özeti

| Site | Klasör | Domain | Hedef Kullanıcı | Ana İşlev |
|------|--------|--------|-----------------|-----------|
| **Patron Paneli** | yisa-s.com (v0-futuristic-dashboard-ng) | app.yisa-s.com | Serdinç ALTAY (YİSA-S sahibi) | Her şeyi görür, onaylar, yönetir |
| **Vitrin** | yisa-s-website | yisa-s.com, www.yisa-s.com | Potansiyel franchise alıcıları | Satış, demo talebi, paket seçimi |
| **Franchise Paneli** | yisa-s-app | *.yisa-s.com | Franchise sahipleri, tesis yöneticileri | Öğrenci, yoklama, aidat, program |

---

## 2. Bağlantı ve Yetki Matrisi

```
                    ┌─────────────────────────────────────────────────────────┐
                    │                    PATRON PANELİ                         │
                    │                  app.yisa-s.com                          │
                    │  • Onay kuyruğu (demo talepleri)                         │
                    │  • Franchise yönetimi (tenant listesi)                   │
                    │  • Vitrin şablonları görüntüleme                         │
                    │  • Beyin Takımı / CELF                                   │
                    │  • Tüm tenant verilerine erişim (read-only veya admin)   │
                    └────────────────────────┬────────────────────────────────┘
                                             │
                    ┌────────────────────────┼────────────────────────────────┐
                    │                        │                                │
                    ▼                        ▼                                ▼
        ┌───────────────────┐    ┌───────────────────┐    ┌───────────────────┐
        │      VİTRİN       │    │    SUPABASE       │    │   FRANCHİSE       │
        │   yisa-s.com      │    │   (Tek DB)        │    │   *.yisa-s.com    │
        │                   │    │                   │    │                   │
        │ • Satış sayfası   │───▶│ tenants           │◀───│ Öğrenci, yoklama  │
        │ • Demo formu      │    │ athletes          │    │ aidat, program    │
        │ • Paket bilgisi   │    │ attendance        │    │                   │
        │ • Şablon önizleme │    │ payments          │    │ Her tenant kendi  │
        └───────────────────┘    │ celf_*            │    │ subdomain'inde    │
                                 │ templates         │    └───────────────────┘
                                 └───────────────────┘
```

---

## 3. Kullanıcı Akışı (Vitrin → Franchise)

### Aşama 1: Potansiyel Alıcı Vitrine Gelir
1. **yisa-s.com** açılır
2. "Franchise Al", "Demo İste", "Paketler" linkleri
3. Form: İsim, e-posta, telefon, kulüp adı, şehir
4. İsteğe bağlı: Renkler, logo, web şablonu seçimi
5. Gönder → `demo_requests` veya `leads` tablosuna INSERT

### Aşama 2: Patron Onayı
1. **app.yisa-s.com** → Onay Kuyruğu
2. Patron talebi görür
3. Onaylar → Tenant oluşturulur (`tenants` tablosu)
4. Subdomain atanır (örn: bjktuzlacimnastik.yisa-s.com)
5. Hazır paket: Standart şablonlar, başlangıç token kotası

### Aşama 3: Franchise Sahibi Panel Açar
1. **bjktuzlacimnastik.yisa-s.com** (franchise paneli)
2. Giriş yapar (auth)
3. Kendi tenant_id’si ile sadece kendi verisini görür
4. Öğrenci, yoklama, aidat, program kullanır

### Aşama 4: Token ve Ekstra Özellik
- Başlangıç paketi: X token
- Öğrenci sayısı, işlem sayısı → token tüketimi
- Ekstra şablon, ekstra direktörlük → token veya ek ücret
- COO mağazası: Robot, şablon satın alma → token harcanır

---

## 4. Patron Panelinden Erişim

| Sayfa | Ne Yapar |
|-------|----------|
| **Onay Kuyruğu** | Vitrinden gelen demo taleplerini listeler, onaylar/reddeder |
| **Franchise Yönetimi** | Tenant listesi, her birine tıklayınca o tenant’ın verilerini görür (öğrenci sayısı, gelir vb.) |
| **Şablonlar** | Vitrin + franchise için kullanılan şablonları görür, yönetir |
| **Beyin Takımı / CELF** | Direktörlük görevleri, AI çıktıları, onay akışı |

---

## 5. Teknik Bağlantı (Tek Supabase)

- **Tek proje:** bgtuqdkfppcjmtrdsldl.supabase.co
- **Tablolar:** `tenant_id` ile filtrelenir (franchise verisi)
- **Patron:** `tenants.owner_id = auth.uid()` veya `user_tenants` ile tüm tenant’lara erişir
- **Vitrin:** Auth gerekmez (demo formu); veri `demo_requests` → Patron onayından sonra `tenants` oluşur

---

## 6. Beyin Takımı MVP (Aşama 1) — Bu Sistemde Nerede?

```
Patron komut girer (app.yisa-s.com)
        │
        ▼
┌───────────────────┐
│     tasks         │  ← CELF komutu kaydedilir (directorate, input, status)
└─────────┬─────────┘
          │
          ▼  Manuel mapping:
          ├── CTO  → GPT
          ├── CMO  → GPT
          ├── CPO  → v0
          ├── COO  → (kural/sorgu)
          └── CFO  → (kural/sorgu)
          │
          ▼
┌───────────────────────┐
│ directorate_outputs   │  ← AI çıktıları (directorate, task_id, output, status)
└─────────┬─────────────┘
          │
          ▼
Patron panelde görür → Onay/Red
          │
          ▼
Manuel uygulama (Cursor, merge, deploy) — Bu aşamada otomatik yok
```

**Gerekli tablolar (MVP):**
- `tasks`: id, tenant_id?, directorate, input, status (pending/completed/approved/rejected), created_at
- `directorate_outputs`: id, task_id, directorate, output (text/json), status, created_at

---

## 7. Token Senaryosu (Özet)

| Olay | Token Etkisi |
|------|--------------|
| Başlangıç paketi | N token verilir |
| Öğrenci sayısı (kademe) | 25 / 45 / 60 saat → farklı aidat, farklı token |
| Şablon kullanımı | X token |
| Robot (WhatsApp, sosyal medya) | Y token |
| COO mağazası satın alma | Token harcanır |

---

## 8. Mevcut Schema ile MVP Eşlemesi

Sistemde zaten şu tablolar var:
- **ceo_tasks** — Patron komutu / CELF girdisi (user_id, task_type, input, status)
- **celf_logs** — Direktörlük çıktıları (ceo_task_id, director_key, output, status)
- **celf_directorates** — Direktörlük tanımları (CTO, CPO, CMO, COO, CFO vb.)

MVP Aşama 1 için `ceo_tasks` + `celf_logs` kullanılabilir. Ek tablo gerekmez.

| MVP Kavramı | Mevcut Tablo |
|-------------|--------------|
| tasks | ceo_tasks |
| directorate_outputs | celf_logs |
| directorate | celf_directorates.kod |

---

## 9. Sonraki Adım Önerisi

1. **Beyin Takımı MVP:** Mevcut `ceo_tasks` + `celf_logs` üzerine basit API + Patron paneli görüntüleme
2. **Patron → Franchise görüntüleme:** Tenant seçince o tenant’ın özet verisini gösteren sayfa
3. **Vitrin → Onay kuyruğu:** Demo formu → `demo_requests` → Patron onay ekranı

Hangisinden başlamak istersiniz?
