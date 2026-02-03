@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo.
echo === YISA-S: Tum degisiklikler - GitHub push + Vercel deploy ===
echo.
git add -A
git status
echo.
git commit -m "feat: Odeme takibi (demo_requests), asistan direktifleri (V0/Cursor/CELF/direktor), deploy rehberi"
if errorlevel 1 (
  echo Commit atlandi (degisiklik yok veya hata).
) else (
  echo Commit tamamlandi.
)
echo.
echo GitHub'a push ediliyor (origin main)...
git push origin main
if errorlevel 1 (
  echo.
  echo Push basarisiz. Ilk kez kullaniyorsaniz:
  echo   git remote add origin https://github.com/KULLANICI_ADINIZ/yisa-s-app.git
  echo   git branch -M main
  echo   git push -u origin main
  echo.
  echo Vercel: vercel.com - Import - yisa-s-app - Deploy. Linki alin.
) else (
  echo.
  echo === Bitti. Vercel bagliysa otomatik deploy alacak. ===
)
echo.
pause
