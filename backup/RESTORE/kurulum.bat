@echo off
chcp 65001 >nul
cd /d "%~dp0"
cd ..\..
echo YİSA-S Sistem Kurulumu Başlıyor... (proje kökü: %CD%)
echo.

echo [1/5] Bağımlılıklar yükleniyor...
call npm install
if errorlevel 1 (
  echo npm install hatası.
  pause
  exit /b 1
)

echo [2/5] Veritabanı tabloları...
echo SQL dosyalarını Supabase SQL Editor'da sırayla çalıştırın:
echo   backup\SQL\01-temel-tablolar.sql
echo   backup\SQL\02-rls-policies.sql
echo   backup\SQL\03-seed-data.sql
echo.

echo [3/5] Ortam değişkenleri kontrol ediliyor...
if not exist .env.local (
  echo .env.local bulunamadı!
  echo backup\CONFIG\env.example dosyasını .env.local olarak kopyalayıp düzenleyin.
  pause
  exit /b 1
)
echo .env.local mevcut.
echo.

echo [4/5] Build alınıyor...
call npm run build
if errorlevel 1 (
  echo Build hatası.
  pause
  exit /b 1
)

echo [5/5] Kurulum tamamlandı!
echo.
echo Sonraki adımlar:
echo 1. Supabase SQL Editor'da 01, 02, 03 dosyalarını çalıştırın
echo 2. .env.local dosyasını düzenleyin (URL, key, API)
echo 3. npm run dev ile test edin
echo 4. Patron onayı ile git push / deploy edin
echo.
pause
