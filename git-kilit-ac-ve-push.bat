@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo.
echo ============================================
echo   YİSA-S — Git Kilit Aç + Commit + Push
echo ============================================
echo.

:: 1. index.lock varsa silmeyi dene
if exist ".git\index.lock" (
    echo [1] .git\index.lock bulundu, siliniyor...
    del /f /q ".git\index.lock" 2>nul
    if exist ".git\index.lock" (
        echo.
        echo UYARI: index.lock silinemedi. "Erisim engellendi" aliyorsaniz:
        echo   - Cursor / VS Code / GitHub Desktop u kapatip tekrar deneyin.
        echo   - OneDrive senkronunu duraklatin veya bekleyin.
        echo   - Detay: SORUN_GIDERME.md
        echo.
        pause
        exit /b 1
    )
    echo      index.lock kaldirildi.
) else (
    echo [1] index.lock yok, devam.
)

echo.
echo [2] git status
git status
echo.

echo [3] git add .
git add .
echo.

echo [4] git commit
git commit -m "fix: guncellemeler - kilit acma ve push"

if errorlevel 1 (
    echo.
    echo UYARI: Commit atilmadi. "nothing to commit" ise zaten her sey commit edilmis.
    echo        Baska hata varsa yukariya bakin.
    echo.
)

echo.
echo [5] git push origin main
git push origin main

if errorlevel 1 (
    echo.
    echo HATA: Push basarisiz. GitHub token, ag veya index.lock kontrol edin.
    echo       SORUN_GIDERME.md dosyasina bakin.
    echo.
    pause
    exit /b 1
)

echo.
echo ============================================
echo   Tamam. Vercel main branch icin otomatik deploy alacak.
echo ============================================
pause
