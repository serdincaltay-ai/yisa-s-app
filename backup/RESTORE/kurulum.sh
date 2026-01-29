#!/bin/bash
set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/../.."
echo "YİSA-S Sistem Kurulumu Başlıyor... (proje kökü: $(pwd))"
echo ""

echo "[1/5] Bağımlılıklar yükleniyor..."
npm install

echo "[2/5] Veritabanı tabloları..."
echo "SQL dosyalarını Supabase SQL Editor'da sırayla çalıştırın:"
echo "  backup/SQL/01-temel-tablolar.sql"
echo "  backup/SQL/02-rls-policies.sql"
echo "  backup/SQL/03-seed-data.sql"
echo ""

echo "[3/5] Ortam değişkenleri kontrol ediliyor..."
if [ ! -f .env.local ]; then
  echo ".env.local bulunamadı!"
  echo "backup/CONFIG/env.example dosyasını .env.local olarak kopyalayıp düzenleyin."
  exit 1
fi
echo ".env.local mevcut."
echo ""

echo "[4/5] Build alınıyor..."
npm run build

echo "[5/5] Kurulum tamamlandı!"
echo ""
echo "Sonraki adımlar:"
echo "1. Supabase SQL Editor'da 01, 02, 03 dosyalarını çalıştırın"
echo "2. .env.local dosyasını düzenleyin (URL, key, API)"
echo "3. npm run dev ile test edin"
echo "4. Patron onayı ile git push / deploy edin"
echo ""
