# YİSA-S — Commit, Deploy ve Hata Kontrolü

**Nasıl kontrol edeceğiniz:** Commit atılmış mı, deploy edilmiş mi, hata/çakışma var mı?

**Git + GitHub + Vercel + Supabase + Railway durumu ve “nasıl devam”:** → **SUAN_DURUM_VE_DEVAM.md**

---

## 0. TEK KOMUTLA DURUM + ÇAKIŞMA KONTROLÜ

Proje klasöründe **PowerShell** açıp şunu çalıştırın:

```powershell
cd C:\Users\info\OneDrive\Desktop\YISA_S_APP\yisa-s-app
Write-Host "=== GIT DURUMU ===" -ForegroundColor Cyan
git status
Write-Host "`n=== SON 3 COMMIT ===" -ForegroundColor Cyan
git log --oneline -3
Write-Host "`n=== REMOTE (GITHUB) ===" -ForegroundColor Cyan
git remote -v
Write-Host "`n=== ÇAKIŞMA VAR MI? ===" -ForegroundColor Cyan
git status | Select-String -Pattern "Unmerged|both modified|conflict"
if (-not $?) { Write-Host "Çakışma yok." -ForegroundColor Green }
```

**Çakışma yoksa:** "nothing to commit", "up to date with 'origin/main'" ve "Çakışma yok." görürsünüz.

---

## 1. COMMIT KONTROLÜ (Yerelde)

### 1.1 Proje klasöründe PowerShell veya CMD açın

```batch
cd C:\Users\info\OneDrive\Desktop\YISA_S_APP\yisa-s-app
```

### 1.2 Commit durumunu kontrol edin

| Komut | Ne gösterir |
|-------|-------------|
| `git status` | Commit edilmemiş değişiklik var mı? Branch main ile uyumlu mu? |
| `git log --oneline -5` | Son 5 commit (en son commit = en üstte) |
| `git remote -v` | GitHub’a bağlı mı? (origin) |

**Beklenen (her şey tamamsa):**

- `git status` → "nothing to commit, working tree clean" ve "Your branch is up to date with 'origin/main'"
- `git log` → En üstte son commit mesajınız (örn. "feat: tam sistem kurulumu...")

**Commit edilmemiş değişiklik varsa:**

- `git status` → "Changes not staged for commit" veya "Untracked files" listesi çıkar.
- Bunları commit etmek için: `git add .` → `git commit -m "mesaj"` → `git push origin main`

**Çakışma (conflict) varsa:**

- `git status` → "You have unmerged paths" veya "both modified: dosya_adı"
- Çözüm: İlgili dosyada `<<<<<<<`, `=======`, `>>>>>>>` işaretlerini bulup manuel düzeltin, sonra `git add .` → `git commit -m "fix: çakışma giderildi"` → `git push origin main`

---

## 2. DEPLOY KONTROLÜ (Vercel)

### 2.1 Vercel Dashboard

1. [vercel.com](https://vercel.com) → Giriş yapın.
2. **YİSA-S / yisa-s-app** projesini seçin.
3. **Deployments** sekmesine girin.

**Kontrol listesi:**

| Ne bakacaksınız | Nerede | Beklenen |
|-----------------|--------|----------|
| Son deploy tarihi | Deployments listesinin en üstü | Push yaptığınız zamana yakın |
| Durum | Yeşil tik "Ready" | Build başarılı |
| Branch | main | Production deploy = main |
| Commit mesajı | Deploy satırına tıklayın | Sizin son commit mesajınız |

**Hata varsa:**

- Kırmızı "Error" → **View Function Logs** veya **Building** log’una tıklayın.
- "Build failed" satırından itibaren hata mesajını okuyun (eksik env, TypeScript hatası, import hatası vb.).

### 2.2 Canlı site

- **app.yisa-s.com** (veya Vercel’in verdiği URL) açılmalı.
- Giriş sayfası ve dashboard yüklenmeli; konsol (F12 → Console) ve ağ (Network) sekmesinde kırmızı hata olmamalı.

---

## 3. HATA / ÇAKIŞMA KONTROLÜ

### 3.1 Git çakışması

- **Belirti:** `git pull` veya `git push` yaparken "merge conflict" uyarısı.
- **Kontrol:** `git status` → "Unmerged paths" var mı?
- **Çözüm:** Dosyada conflict işaretlerini düzeltin, `git add` → `git commit` → `git push`.

### 3.2 Vercel build hatası

- **Belirti:** Deployments’ta kırmızı "Error", e-posta bildirimi.
- **Kontrol:** Vercel → Proje → Deployments → Hatalı deploy’a tıkla → **Building** veya **Logs**.
- **Sık nedenler:** Eksik `NEXT_PUBLIC_*` veya `ANTHROPIC_API_KEY`, TypeScript/lint hatası, yanlış import.

### 3.3 Supabase / API hatası (canlı sitede)

- **Belirti:** Dashboard’da sayfa açılınca boş liste, "Failed to fetch" veya 500 hatası.
- **Kontrol:** Tarayıcıda F12 → **Console** ve **Network**; kırmızı satır veya başarısız istek (kırmızı) var mı?
- **Sık nedenler:** RLS politikası izin vermiyor, tablo/kolon adı uyuşmuyor, env (Supabase URL/Key) yanlış.

### 3.4 Tablo / kolon uyumsuzluğu (Supabase ↔ Kod)

- **Kontrol:** Supabase’te tablolar oluşturuldu mu? (Siz zaten kontrol ettiniz ✅)
- **Kod tarafı:** `app/api/franchises/route.ts`, `app/api/expenses/route.ts` vb. dosyalarda kullanılan tablo ve sütun adları, Supabase’teki `franchises`, `expenses` vb. ile aynı mı?
- Gerekirse Supabase **Table Editor**’da bir tabloya tıklayıp sütun isimlerini karşılaştırın.

---

## 4. HIZLI KONTROL (Tek seferde)

Proje klasöründe **PowerShell** açıp şunu çalıştırın:

```powershell
cd C:\Users\info\OneDrive\Desktop\YISA_S_APP\yisa-s-app
Write-Host "=== GIT STATUS ===" -ForegroundColor Cyan
git status
Write-Host "`n=== SON 5 COMMIT ===" -ForegroundColor Cyan
git log --oneline -5
Write-Host "`n=== REMOTE ===" -ForegroundColor Cyan
git remote -v
```

- **Commit atılmış mı?** → "nothing to commit" ve "up to date with 'origin/main'" ise evet.
- **Push gitti mi?** → "up to date with 'origin/main'" ise son commit GitHub’a gönderilmiş demektir.
- **Deploy edilmiş mi?** → Sadece Vercel Dashboard’dan veya app.yisa-s.com’u açarak doğrulayabilirsiniz; Git’te gösterilmez.

---

## 5. ÖZET TABLO

| Kontrol | Nerede / Nasıl | Tamam mı? |
|---------|----------------|-----------|
| Commit (yerel) | `git status` + `git log -5` | ☐ |
| Push (GitHub) | `git status` → "up to date with origin/main" | ☐ |
| Deploy (Vercel) | Vercel → Deployments → son satır "Ready" | ☐ |
| Canlı site | app.yisa-s.com açılıyor, hata yok | ☐ |
| Supabase tabloları | Supabase → Table Editor (8 tablo var) | ☐ |
| Çakışma | `git status` → "Unmerged" yok | ☐ |

Hepsi işaretliyse commit ve deploy tamam, belirgin bir çakışma yok demektir.
