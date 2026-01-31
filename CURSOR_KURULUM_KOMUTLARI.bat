@echo off
chcp 65001 >nul
title YİSA-S — Cursor tam yetkili kurulum
cd /d "%~dp0"

echo.
echo ============================================
echo   YİSA-S — CURSOR TAM YETKİLİ KURULUM
echo ============================================
echo.

echo [1/2] Bağımlılıklar kuruluyor...
call npm install
if errorlevel 1 (
  echo HATA: npm install başarısız.
  pause
  exit /b 1
)

echo.
echo [2/2] Geliştirme sunucusu başlatılıyor...
echo       Tarayıcıda: http://localhost:3000
echo       Dashboard:  http://localhost:3000/dashboard
echo.
call npm run dev

pause
