# YİSA-S — Sadece migration çalıştır
# DATABASE_URL .env.local'de olmalı

$ProjeKlasoru = $PSScriptRoot
Set-Location $ProjeKlasoru

Write-Host ""
Write-Host "  YİSA-S — Migration" -ForegroundColor Cyan
Write-Host "  =================" -ForegroundColor Cyan
Write-Host ""

node scripts/run-full-migrations.js

Write-Host ""
Read-Host "  Bitirmek icin Enter"
