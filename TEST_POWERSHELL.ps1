# YISA-S API Test - PowerShell
# Port 3000 kullanılmıyorsa aşağıda $base = "http://localhost:3001" yapın.
$base = "http://localhost:3000"

Write-Host "=== 1. Vitrin sayfasi (GET /vitrin) ===" -ForegroundColor Cyan
try {
  $r = Invoke-WebRequest -Uri "$base/vitrin" -UseBasicParsing
  Write-Host "StatusCode: $($r.StatusCode), Content Length: $($r.Content.Length)"
} catch { Write-Host "Hata: $_" }

Write-Host "`n=== 2. Demo Request (POST /api/demo-requests, source=vitrin) ===" -ForegroundColor Cyan
# Test verisi — canlıda kullanma, karıştırma
$body = '{"name":"Test Kullanici","email":"demo@yisa-s.com","phone":"5551234567","facility_type":"jimnastik","city":"Istanbul","source":"vitrin"}'
try {
  $demo = Invoke-RestMethod -Uri "$base/api/demo-requests" -Method POST -Body $body -ContentType "application/json"
  $demo | ConvertTo-Json -Depth 3
} catch { Write-Host "Hata: $_" }

Write-Host "`n=== 3. Sablonlar (GET /api/templates) ===" -ForegroundColor Cyan
try {
  $tpl = Invoke-RestMethod -Uri "$base/api/templates" -Method GET
  Write-Host "sablonlar sayisi: $($tpl.sablonlar.Count), toplam: $($tpl.toplam)"
  if ($tpl.sablonlar.Count -gt 0) { $tpl.sablonlar[0] | ConvertTo-Json -Depth 2 }
} catch { Write-Host "Hata: $_" }

Write-Host "`n=== 4. Chat (POST /api/chat) ===" -ForegroundColor Cyan
try {
  $chatBody = '{"message":"Sistem durumu nedir?","role":"patron"}'
  $chat = Invoke-RestMethod -Uri "$base/api/chat" -Method POST -Body $chatBody -ContentType "application/json"
  $chat | ConvertTo-Json -Depth 3
} catch { Write-Host "Hata: $_" }

Write-Host "`n=== 5. Health (GET /api/health) ===" -ForegroundColor Cyan
try {
  Invoke-RestMethod -Uri "$base/api/health" -Method GET | ConvertTo-Json -Depth 2
} catch { Write-Host "Hata: $_" }

Write-Host "`n=== Test bitti ===" -ForegroundColor Green
