# YiSA-S Backup Stratejisi

> **Son guncelleme:** Mart 2026
> **Kapsam:** tenant-yisa-s (Supabase PostgreSQL)

---

## 1. Genel Bakis

YiSA-S platformu tum verilerini Supabase uzerinde barindirmaktadir. Veri kaybi riskini minimize etmek icin iki katmanli bir backup stratejisi uygulanmaktadir:

| Katman | Yontem | Siklik | Saklama Suresi | Sorumluluk |
|--------|--------|--------|----------------|------------|
| 1 | Supabase Otomatik Backup | Gunluk | 7 gun (Free) / 30 gun (Pro) | Supabase |
| 2 | Manuel `pg_dump` | Haftalik | 90 gun | DevOps / Patron |

---

## 2. Katman 1: Supabase Otomatik Backup

Supabase, Pro plan dahilinde gunluk otomatik backup saglar. Bu backuplar Supabase Dashboard uzerinden yonetilir.

### Ozellikler

- **Siklik:** Her gun otomatik olarak alinir
- **Saklama suresi:** Pro plan icin 30 gun, Free plan icin 7 gun
- **Konum:** Supabase altyapisinda guvenli olarak saklanir
- **Restore:** Supabase Dashboard > Database > Backups > Restore

### Kontrol Adimlari

1. [Supabase Dashboard](https://supabase.com/dashboard) adresine gidin
2. Projenizi secin
3. **Database > Backups** bolumune gidin
4. Son backup tarihini ve durumunu kontrol edin

### Otomatik Kontrol (API)

Backup durumu `/api/admin/backup-check` endpoint'i uzerinden kontrol edilebilir:

```bash
curl https://tenant.yisa-s.com/api/admin/backup-check
```

Bu endpoint Vercel Cron ile haftalik olarak otomatik calistirilir (her Pazartesi 03:00 UTC).

---

## 3. Katman 2: Haftalik pg_dump

Supabase otomatik backuplara ek olarak, haftalik manuel `pg_dump` ile tam veritabani yedegi alinir.

### Onkosullar

- PostgreSQL istemci araclarinin kurulu olmasi (`pg_dump`)
- Supabase veritabani baglanti bilgileri (Database URL)

### pg_dump Komutu

```bash
# Supabase Database URL'i .env dosyasindan alin
# Format: postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres

# Tam veritabani yedegi
pg_dump "$DATABASE_URL" \
  --format=custom \
  --no-owner \
  --no-privileges \
  --file="backup_$(date +%Y%m%d_%H%M%S).dump"

# Sadece sema yedegi (veri haric)
pg_dump "$DATABASE_URL" \
  --schema-only \
  --no-owner \
  --file="schema_$(date +%Y%m%d_%H%M%S).sql"
```

### Otomatik pg_dump Script

Asagidaki script haftalik cron ile calistirilabilir:

```bash
#!/bin/bash
# weekly-backup.sh
# Haftalik pg_dump backup scripti

set -euo pipefail

BACKUP_DIR="/backups/yisa-s"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/backup_${DATE}.dump"
LOG_FILE="${BACKUP_DIR}/backup_${DATE}.log"
RETENTION_DAYS=90

mkdir -p "$BACKUP_DIR"

echo "[$(date)] Backup basladi..." | tee -a "$LOG_FILE"

# pg_dump calistir
pg_dump "$DATABASE_URL" \
  --format=custom \
  --no-owner \
  --no-privileges \
  --file="$BACKUP_FILE" 2>> "$LOG_FILE"

if [ $? -eq 0 ]; then
  SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
  echo "[$(date)] Backup basarili: $BACKUP_FILE ($SIZE)" | tee -a "$LOG_FILE"
else
  echo "[$(date)] HATA: Backup basarisiz!" | tee -a "$LOG_FILE"
  exit 1
fi

# Eski backuplari temizle (90 gunden eski)
find "$BACKUP_DIR" -name "backup_*.dump" -mtime +$RETENTION_DAYS -delete
echo "[$(date)] Eski backuplar temizlendi (${RETENTION_DAYS} gunden eski)" | tee -a "$LOG_FILE"
```

### Crontab Ayari

```cron
# Her Pazar gece 02:00'de pg_dump al
0 2 * * 0 /opt/scripts/weekly-backup.sh >> /var/log/yisa-backup.log 2>&1
```

---

## 4. Backup Dogrulama

Backuplarin gecerliligini dogrulamak icin asagidaki adimlari takip edin:

### Supabase Backup Dogrulama

1. Dashboard'dan son backup tarihini kontrol edin
2. `/api/admin/backup-check` endpoint'ini cagirin
3. Cron job'un duzgun calistigini Vercel Logs'tan dogrulayin

### pg_dump Dogrulama

```bash
# Backup dosyasinin icerigini listele
pg_restore --list backup_YYYYMMDD_HHMMSS.dump

# Test veritabanina restore et
createdb yisa_test_restore
pg_restore --dbname=yisa_test_restore --no-owner backup_YYYYMMDD_HHMMSS.dump

# Tablo sayisini kontrol et
psql yisa_test_restore -c "SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public';"

# Test veritabanini sil
dropdb yisa_test_restore
```

---

## 5. Rollback Proseduru: Migration Geri Alma

### 5.1 Genel Yaklasim

YiSA-S migration dosyalari `supabase/migrations/` dizininde bulunur. Supabase CLI ile migration geri alma islemleri yapilir.

### 5.2 Son Migration'i Geri Alma

```bash
# Mevcut migration durumunu kontrol et
npx supabase migration list

# Son migration'i geri al (remote)
npx supabase db reset --linked

# Veya manuel olarak geri alin:
# 1. Son migration dosyasini inceleyin
# 2. Tersine SQL yazin
# 3. Supabase SQL Editor'de calistirin
```

### 5.3 Manuel Rollback Adimlari

Eger otomatik rollback mumkun degilse, asagidaki adimlari takip edin:

#### Adim 1: Problemi Teshis Et

```bash
# Son migration dosyalarini listele
ls -la supabase/migrations/ | tail -5

# Son migration dosyasini incele
cat supabase/migrations/<son_migration_dosyasi>.sql
```

#### Adim 2: Rollback SQL'i Hazirla

Her migration icin ters islemi yazin:

| Migration Islemi | Rollback Islemi |
|------------------|-----------------|
| `CREATE TABLE x` | `DROP TABLE IF EXISTS x CASCADE;` |
| `ALTER TABLE x ADD COLUMN y` | `ALTER TABLE x DROP COLUMN IF EXISTS y;` |
| `CREATE INDEX idx` | `DROP INDEX IF EXISTS idx;` |
| `CREATE POLICY p` | `DROP POLICY IF EXISTS p ON table;` |
| `INSERT INTO x` | `DELETE FROM x WHERE ...;` |
| `ALTER TABLE x ALTER COLUMN y TYPE z` | `ALTER TABLE x ALTER COLUMN y TYPE original_type;` |

#### Adim 3: Rollback SQL'i Calistir

```bash
# Supabase SQL Editor uzerinden calistirin
# veya CLI ile:
psql "$DATABASE_URL" -f rollback.sql
```

#### Adim 4: Dogrulama

```bash
# Tablo yapisini kontrol et
psql "$DATABASE_URL" -c "\dt public.*"

# Migration tablosunu guncelle (eger gerekirse)
psql "$DATABASE_URL" -c "DELETE FROM supabase_migrations.schema_migrations WHERE version = '<migration_version>';"
```

### 5.4 Tam Veritabani Restore (Acil Durum)

Eger birden fazla migration geri alinmasi gerekiyorsa veya veri bozulmasi varsa:

```bash
# 1. Supabase Dashboard'dan Point-in-Time Recovery (Pro plan)
#    Database > Backups > Restore to a specific point in time

# 2. Veya pg_dump backup'tan restore:
pg_restore \
  --dbname="$DATABASE_URL" \
  --clean \
  --no-owner \
  --no-privileges \
  backup_YYYYMMDD_HHMMSS.dump
```

---

## 6. Acil Durum Iletisim

| Durum | Aksiyon | Sorumluluk |
|-------|---------|------------|
| Veri kaybi tespit edildi | Supabase Dashboard'dan son backup'a restore | Patron / DevOps |
| Migration hatasi | Rollback SQL calistir (Bolum 5.3) | Gelistirici |
| Tam sistem cokusu | pg_dump backup'tan restore (Bolum 5.4) | DevOps |
| Supabase erisilemez | Supabase Status sayfasini kontrol et, destek bileti ac | Patron |

---

## 7. Vercel Cron Entegrasyonu

Backup kontrolu icin Vercel Cron job tanimlanmistir:

```json
{
  "path": "/api/admin/backup-check",
  "schedule": "0 3 * * 1"
}
```

Bu job her Pazartesi 03:00 UTC'de calisarak:
- Supabase baglantisini kontrol eder
- Kritik tablolarin veri butunlugunu dogrular
- Son kayit tarihlerini raporlar

---

## 8. Kontrol Listesi (Checklist)

### Haftalik Kontroller
- [ ] `/api/admin/backup-check` endpoint'ini cagir ve sonucu dogrula
- [ ] Supabase Dashboard'da son backup tarihini kontrol et
- [ ] pg_dump script'inin basarili calistigini dogrula

### Aylik Kontroller
- [ ] Backup'tan test restore yap
- [ ] Eski backup dosyalarinin temizlendigini dogrula
- [ ] Migration dosyalarinin guncel oldugunu kontrol et

### 3 Aylik Kontroller
- [ ] Tam disaster recovery testi yap
- [ ] Backup stratejisini gozden gecir ve guncelle
- [ ] Saklama surelerini degerlendır
