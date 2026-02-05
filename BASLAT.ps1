# YİSA-S — Tek tıkla başlat
# Çift tıkla veya: powershell -ExecutionPolicy Bypass -File BASLAT.ps1

$ProjeKlasoru = $PSScriptRoot
Set-Location $ProjeKlasoru

Write-Host ""
Write-Host "  YİSA-S — Baslat" -ForegroundColor Cyan
Write-Host "  ================" -ForegroundColor Cyan
Write-Host ""

# 1. Migration çalıştır mı? (opsiyonel - uygulama migration olmadan da calisir)
$Cevap = Read-Host "  Migration calistir? (e/h, Enter=h)"
if ($Cevap -eq "e" -or $Cevap -eq "E") {
    Write-Host "  Migration calistiriliyor..." -ForegroundColor Yellow
    node scripts/run-full-migrations.js
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  Migration atlandi (DATABASE_URL gerekebilir). Uygulama yine de calisacak." -ForegroundColor Yellow
        Read-Host "  Devam icin Enter"
    }
    Write-Host ""
}

# 2. Dev sunucusunu başlat
Write-Host "  Dev sunucu baslatiliyor (localhost:3000)..." -ForegroundColor Green
Write-Host "  Durdurmak icin: Ctrl+C" -ForegroundColor Gray
Write-Host ""
npm run dev
