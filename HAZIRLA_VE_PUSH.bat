@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo.
echo === YISA-S: GitHub'a push icin hazirlaniyor ===
echo.
git add -A
git status
echo.
git commit -m "Vercel icin hazir: build, PWA, deploy rehberi"
echo.
echo === Bitti. Simdi GitHub'a push edin ===
echo.
echo Proje klasorunde cmd acikken su komutu calistirin:
echo   git remote add origin https://github.com/KULLANICI_ADINIZ/yisa-s-app.git
echo   git branch -M main
echo   git push -u origin main
echo.
echo (KULLANICI_ADINIZ yerine kendi GitHub kullanici adinizi yazin.)
echo.
echo Sonra vercel.com - Import - yisa-s-app - Deploy. Linki alin.
echo.
pause
