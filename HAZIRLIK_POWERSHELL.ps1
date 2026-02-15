# YISA-S Hazirlik - PowerShell
# Calisma klasoru: yisa-s-app
# Sira: Bu script -> Unsura test -> Cursor uygulama

$ErrorActionPreference = "Stop"
$projectRoot = $PSScriptRoot

Write-Host "=== YISA-S Hazirlik ===" -ForegroundColor Cyan
Write-Host "Proje: $projectRoot`n" -ForegroundColor Gray

# 1. .env.local kontrolu
Write-Host "1. .env.local kontrolu..." -ForegroundColor Yellow
if (Test-Path "$projectRoot\.env.local") {
    Write-Host "   OK: .env.local mevcut" -ForegroundColor Green
} else {
    Write-Host "   UYARI: .env.local yok. .env.example'dan kopyalayin:" -ForegroundColor Red
    Write-Host "   Copy-Item .env.example .env.local" -ForegroundColor Gray
    if (Test-Path "$projectRoot\.env.example") {
        Copy-Item "$projectRoot\.env.example" "$projectRoot\.env.local"
        Write-Host "   .env.local olusturuldu (.env.example'dan). Degerleri doldurun." -ForegroundColor Yellow
    }
}

# 2. node_modules
Write-Host "`n2. npm install..." -ForegroundColor Yellow
Set-Location $projectRoot
npm install 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "   OK: Bagimliliklar yuklendi" -ForegroundColor Green
} else {
    Write-Host "   HATA: npm install basarisiz" -ForegroundColor Red
    exit 1
}

# 3. Build kontrolu (opsiyonel)
Write-Host "`n3. Build kontrolu (npm run build)..." -ForegroundColor Yellow
$buildResult = npm run build 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "   OK: Build basarili" -ForegroundColor Green
} else {
    Write-Host "   UYARI: Build hata verebilir - dev modunda calisir" -ForegroundColor Yellow
}

# 4. Port 3000 kullanilabilir mi?
Write-Host "`n4. Port 3000 kontrolu..." -ForegroundColor Yellow
$portInUse = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($portInUse) {
    Write-Host "   UYARI: Port 3000 kullaniliyor. Mevcut sunucuyu durdurun veya farkli port kullanin." -ForegroundColor Yellow
} else {
    Write-Host "   OK: Port 3000 bos" -ForegroundColor Green
}

# 5. Ozet
Write-Host "`n=== Hazirlik tamamlandi ===" -ForegroundColor Green
Write-Host @"

Sonraki adimlar:
1. npm run dev     -> Sunucuyu baslat (http://localhost:3000)
2. .\TEST_POWERSHELL.ps1 -> API testleri (sunucu acikken)
3. Unsura ile test
4. Cursor ile PATRON_VIZYON_VE_CURSOR_HAZIRLIK.md'daki komutlari uygula

Referans: PATRON_VIZYON_VE_CURSOR_HAZIRLIK.md

"@ -ForegroundColor Gray
