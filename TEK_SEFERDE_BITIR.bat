@echo off
chcp 65001 >nul
title YİSA-S — Tek seferde bitir
cd /d "%~dp0"

echo.
echo ============================================
echo   YİSA-S — TEK SEFERDE BİTİR
echo ============================================
echo.

:: 1. Lock kaldır
if exist ".git\index.lock" (
    del /f /q ".git\index.lock"
    echo [1/5] .git\index.lock kaldirildi.
) else (
    echo [1/5] Lock yok, geciliyor.
)

:: 2. .env.local olustur/guncelle (Supabase anon key komut icinde; mevcut ANTHROPIC korunur)
powershell -NoProfile -Command "$anon='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJndHVxZGtmcHBjam10cmRzbGRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0ODk5MTYsImV4cCI6MjA4MzA2NTkxNn0.xWIH5niHklW9OyY-QwOVhSytywNZAz_LY0lsTV4tpyw'; if (Test-Path '.env.local') { (Get-Content '.env.local' -Raw) -replace 'NEXT_PUBLIC_SUPABASE_ANON_KEY=.*', ('NEXT_PUBLIC_SUPABASE_ANON_KEY='+$anon) | Set-Content '.env.local' -NoNewline } else { @('# YİSA-S Patron Paneli','NEXT_PUBLIC_SUPABASE_URL=https://bgtuqdkfppcjmtrdsldl.supabase.co','NEXT_PUBLIC_SUPABASE_ANON_KEY='+$anon,'ANTHROPIC_API_KEY=','NEXT_PUBLIC_SITE_URL=https://app.yisa-s.com') | Set-Content '.env.local' -Encoding UTF8 }"
echo [2/5] .env.local guncellendi (Supabase anon key eklendi).

:: 3. npm install
echo.
echo [3/5] npm install...
call npm install
if errorlevel 1 (
    echo HATA: npm install basarisiz.
    pause
    exit /b 1
)

:: 4. Supabase ve Vercel sayfalarini ac (anon key + env icin)
echo.
echo [4/5] Supabase ve Vercel sayfalari aciliyor (anon key + env yapistirmaniz icin)...
start "" "https://supabase.com/dashboard/project/bgtuqdkfppcjmtrdsldl/settings/api"
timeout /t 2 >nul
start "" "https://supabase.com/dashboard/project/bgtuqdkfppcjmtrdsldl/auth/users"
timeout /t 1 >nul
start "" "https://vercel.com/dashboard"

:: 5. Dev sunucusunu baslat
echo.
echo [5/5] Geliştirme sunucusu baslatiliyor...
echo       Tarayicida: http://localhost:3000
echo       Dashboard:  http://localhost:3000/dashboard
echo.
echo Supabase'te: Settings ^> API ^> "anon public" kopyala ^> .env.local'de NEXT_PUBLIC_SUPABASE_ANON_KEY= satirina yapistir.
echo Supabase Auth ^> Users ^> bir kullanici olustur (giris icin).
echo.
call npm run dev

pause
