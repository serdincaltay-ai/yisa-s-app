@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo.
echo --- YİSA-S Git Commit + Push ---
echo.

if exist ".git\index.lock" (
    echo .git\index.lock siliniyor...
    del ".git\index.lock"
    echo.
)

echo Dosyalar ekleniyor...
git add .gitignore app lib GELISTIRME_RAPORU_10_MADDE.md DOMAIN.md ROBOT_GOREVLERI.md COMMIT_VE_DEPLOY.md vercel.json next-env.d.ts next.config.js package.json package-lock.json postcss.config.js tailwind.config.js tsconfig.json

echo.
echo Commit atılıyor...
git commit -m "YİSA-S Patron Paneli: 10 maddelik geliştirme (G1+G2+G3) tamamlandı"

if errorlevel 1 (
    echo.
    echo HATA: Commit atılamadı. "git status" ile kontrol et.
    pause
    exit /b 1
)

echo.
echo GitHub'a push ediliyor...
git push origin main

if errorlevel 1 (
    echo.
    echo UYARI: Push başarısız. GitHub token / erişim kontrol et.
    pause
    exit /b 1
)

echo.
echo Tamam. Vercel bagliysa otomatik deploy alacak.
pause
