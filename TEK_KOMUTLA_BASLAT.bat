@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo.
echo YISA-S — Tek komut: npm install + npm run dev
echo.
call npm install
if errorlevel 1 (
  echo npm install hata verdi.
  pause
  exit /b 1
)
echo.
echo Uygulama baslatiliyor: http://localhost:3000
echo Durdurmak icin bu pencerede Ctrl+C
echo.
call npm run dev
pause
