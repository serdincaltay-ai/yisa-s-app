@echo off
chcp 65001 >nul
echo ============================================
echo YİSA-S - Tam Sistem Kurulumu - Commit ve Deploy
echo ============================================
cd /d "%~dp0"

:: Lock dosyası varsa kaldır
if exist ".git\index.lock" (
    del /f /q ".git\index.lock"
    echo .git\index.lock kaldırıldı.
)

echo.
echo [1/3] git add .
git add .
if errorlevel 1 (
    echo HATA: git add başarısız.
    pause
    exit /b 1
)

echo.
echo [2/3] git commit
git commit -m "feat: tam sistem kurulumu - Patron paneli, franchise (Tuzla Beşiktaş Cimnastik, Merve Görmezer), onay kuyruğu, kasa defteri, şablonlar, Master Doküman v2.1 taslak"
if errorlevel 1 (
    echo UYARI: commit atlandı veya hata (zaten commit edilmiş olabilir).
)

echo.
echo [3/3] git push origin main
git push origin main
if errorlevel 1 (
    echo HATA: git push başarısız. Ağ / GitHub erişimini kontrol edin.
    pause
    exit /b 1
)

echo.
echo ============================================
echo Tamamlandı. Vercel otomatik deploy alacak.
echo ============================================
pause
