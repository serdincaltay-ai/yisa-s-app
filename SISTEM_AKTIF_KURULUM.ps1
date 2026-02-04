# YİSA-S TAM SİSTEM AKTİVASYONU
# SQL + Kod + Deploy — hepsini yapar
# Çalıştırma: .\SISTEM_AKTIF_KURULUM.ps1

$ErrorActionPreference = "Stop"
$projectRoot = $PSScriptRoot

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  YİSA-S TAM SİSTEM AKTİVASYONU" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. .env.local kontrolü
Write-Host "[1/5] .env.local kontrolü..." -ForegroundColor Yellow
if (-not (Test-Path "$projectRoot\.env.local")) {
    Write-Host "  UYARI: .env.local yok. .env.example'dan kopyalanıyor..." -ForegroundColor Yellow
    if (Test-Path "$projectRoot\.env.example") {
        Copy-Item "$projectRoot\.env.example" "$projectRoot\.env.local"
        Write-Host "  .env.local oluşturuldu. Supabase + API anahtarlarını doldurun." -ForegroundColor Red
        Write-Host "  Sonra bu scripti tekrar çalıştırın." -ForegroundColor Red
        exit 1
    }
}
Write-Host "  OK" -ForegroundColor Green

# 2. SQL Migration (DATABASE_URL varsa)
Write-Host ""
Write-Host "[2/5] SQL Migration..." -ForegroundColor Yellow
$envContent = Get-Content "$projectRoot\.env.local" -Raw -ErrorAction SilentlyContinue
$hasDbUrl = $envContent -match "DATABASE_URL\s*=\s*postgresql"
if ($hasDbUrl) {
    Set-Location $projectRoot
    $migrateResult = npm run db:full-migrate 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  OK: Tüm migration'lar çalıştırıldı" -ForegroundColor Green
    } else {
        Write-Host "  UYARI: Migration hata verdi. Supabase SQL Editor'da manuel çalıştırın:" -ForegroundColor Yellow
        Write-Host "  supabase/YISA-S_TUM_TABLOLAR_TEK_SQL.sql" -ForegroundColor Gray
        Write-Host "  supabase/YENI_MIGRASYONLAR_TEK_SQL.sql" -ForegroundColor Gray
        Write-Host "  supabase/RUN_ROBOTS_CELF_ONLY.sql" -ForegroundColor Gray
        Write-Host "  migrations/*.sql (sırayla)" -ForegroundColor Gray
    }
} else {
    Write-Host "  ATLA: DATABASE_URL yok. Supabase SQL Editor'da manuel çalıştırın:" -ForegroundColor Yellow
    Write-Host "  1. supabase/YISA-S_TUM_TABLOLAR_TEK_SQL.sql" -ForegroundColor Gray
    Write-Host "  2. supabase/YENI_MIGRASYONLAR_TEK_SQL.sql" -ForegroundColor Gray
    Write-Host "  3. supabase/RUN_ROBOTS_CELF_ONLY.sql" -ForegroundColor Gray
    Write-Host "  4. migrations/20260203_ceo_templates_ve_sablonlar.sql" -ForegroundColor Gray
    Write-Host "  5. migrations/20260204_ceo_templates_columns.sql" -ForegroundColor Gray
    Write-Host "  6. supabase/SABLONLAR_TEK_SQL.sql" -ForegroundColor Gray
    Write-Host "  7. migrations/20260203_patron_commands_komut_sonuc_durum.sql" -ForegroundColor Gray
    Write-Host "  8. migrations/20260130_ceo_tasks_awaiting_approval.sql" -ForegroundColor Gray
    Write-Host "  9. migrations/20260130_ceo_tasks_idempotency.sql" -ForegroundColor Gray
}

# 3. npm install
Write-Host ""
Write-Host "[3/5] npm install..." -ForegroundColor Yellow
Set-Location $projectRoot
npm install 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "  OK" -ForegroundColor Green
} else {
    Write-Host "  HATA: npm install başarısız" -ForegroundColor Red
    exit 1
}

# 4. npm run build
Write-Host ""
Write-Host "[4/5] npm run build..." -ForegroundColor Yellow
$buildOut = npm run build 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "  OK: Build başarılı" -ForegroundColor Green
} else {
    Write-Host "  HATA: Build başarısız" -ForegroundColor Red
    Write-Host $buildOut -ForegroundColor Gray
    exit 1
}

# 5. Git commit + push (deploy)
Write-Host ""
Write-Host "[5/5] Git commit + push (Vercel/Railway deploy)..." -ForegroundColor Yellow
$gitStatus = git status --porcelain 2>&1
if ($gitStatus) {
    git add -A 2>&1 | Out-Null
    git commit -m "feat: tam sistem aktivasyonu - SQL, CELF, LLM/Araçlar, migration script" 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        git push 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  OK: Push tamamlandı. Vercel/Railway otomatik deploy başlayacak." -ForegroundColor Green
        } else {
            Write-Host "  UYARI: git push başarısız (remote yok veya yetki)" -ForegroundColor Yellow
        }
    } else {
        Write-Host "  UYARI: git commit başarısız" -ForegroundColor Yellow
    }
} else {
    Write-Host "  ATLA: Değişiklik yok" -ForegroundColor Gray
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  AKTİVASYON TAMAMLANDI" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Sonraki adımlar:" -ForegroundColor Cyan
Write-Host "  1. npm run dev  -> Yerel sunucu (http://localhost:3000)" -ForegroundColor Gray
Write-Host "  2. Dashboard   -> http://localhost:3000/dashboard" -ForegroundColor Gray
Write-Host "  3. Vercel/Railway -> Push sonrası otomatik deploy" -ForegroundColor Gray
Write-Host ""
