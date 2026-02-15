# YİSA-S — Neden Çalışmıyor? Genel Sorunlar ve Çözümler

Bu dokümanda **.env karışıklığı**, **commit/push yapamama** ve **komutların işe yaramaması** gibi sorunların nedenleri ve adım adım çözümleri var.

---

## 1. .env.example vs .env.local — Sistem Hangi Dosyayı Kullanıyor?

| Dosya | Ne için? | Kullanım |
|-------|----------|----------|
| **`.env.example`** | **Şablon / örnek.** İçinde `xxxxx`, `eyJhbGc...` gibi placeholder’lar var. | Sadece referans. Uygulama **bunu okumaz**. |
| **`.env.local`** | **Gerçek ayarlar.** Supabase URL/Key, Anthropic API Key vb. burada. | Next.js **sadece bunu** okur. `npm run dev` / build hep **`.env.local`** kullanır. |

**Özet:**  
- "env.example", "export", "explore" gibi ifadeler **`.env.example`** dosyasından geliyor; o sadece örnek.  
- **Çalışan config** **`.env.local`**. Projede `.env.local` var ve Supabase + Anthropic anahtarları tanımlı.  
- Lokal çalıştırma: proje kökünde `npm run dev` → Next.js otomatik `.env.local` okur.

**Yapmanız gereken:**  
- `.env.local`’i silmeyin, değiştirmeyin.  
- Yeni değişken ekleyecekseniz hem `.env.local`’e ekleyin hem (örnek olarak) `.env.example`’a placeholder yazın.

---

## 2. Commit / Push Yapamıyorum — "Hiç Commit / Deploy Yapılmamış" Hissi

### 2.1 GitHub’da Aslında Commit ve Deploy Var

- Repoda commit’ler var (örn. "chore: guncelleme", "feat: tam sistem kurulumu...").  
- Vercel’de 247 deployment görünüyor, production deploy’lar "Ready".  
- Yani **genel olarak** commit ve deploy **yapılmış**.

### 2.2 Sizin Sorununuz: Yereldeki Son Değişiklikler GİTMİYOR

Sorun büyük ihtimalle şunlardan biri:

1. **`.git/index.lock`** — Git bu dosyayı görünce commit/push’ı kilitleyebilir.  
2. **Komutların yanlış yerde / yanlış sözdizimiyle çalıştırılması** (ör. PowerShell’de `&&` kullanmak).  
3. **Proje klasörüne girmeden** git komutu çalıştırmak.

Bu yüzden **sizin yaptığınız son değişiklikler** commit edilmiyor, push gitmiyor → "hiç commit / deploy yapılmamış" gibi hissediyorsunuz.

---

## 3. .git/index.lock — Commit/Push Engeli

**Belirti:**  
- `git status`, `git add`, `git commit`, `git push` ya hata veriyor ya da "Index locked" benzeri uyarı.  
- Bazen `unable to unlink '.../.git/index.lock': Invalid argument` görürsünüz.

**Neden:**  
- Başka bir Git işlemi (Cursor, VS Code, GitHub Desktop vb.) yarım kalmış veya OneDrive dosyayı kilitlemiş olabilir.

**Çözüm (adım adım):**

1. **Cursor, VS Code, GitHub Desktop** vb. tüm editörleri **kapatın**.  
2. Mümkünse **OneDrive** senkronunu o klasör için **duraklatın** veya senkronun bitmesini bekleyin.  
3. **CMD** (PowerShell değil) açın, şunu çalıştırın (yol kendi proje klasörünüze göre):

```batch
del /f /q "C:\Users\info\OneDrive\Desktop\YISA_S_APP\yisa-s-app\.git\index.lock"
```

4. "Erişim engellendi" alırsanız:  
   - Dosya gezgininden proje → `.git` → `index.lock`’a sağ tık → Sil.  
   - Hâlâ silinmiyorsa bilgisayarı yeniden başlatıp tekrar deneyin.  
5. Sonra **proje klasörüne** girip:

```batch
cd /d "C:\Users\info\OneDrive\Desktop\YISA_S_APP\yisa-s-app"
git status
```

`index.lock` gittiğinde `git status` normal çıkar. Ondan sonra `git add` / `commit` / `push` kullanabilirsiniz.

**Hazır script:**  
`git-kilit-ac-ve-push.bat` — Önce kilidi açmayı dener, sonra add/commit/push yapar. İsterseniz onu kullanın.

---

## 4. Komutlar "İşe Yaramıyor" — PowerShell vs CMD

Cursor varsayılan terminali **PowerShell**. PowerShell’de `&&` **çalışmaz**.

**Yanlış (PowerShell’de hata verir):**
```powershell
cd "C:\Users\info\OneDrive\Desktop\YISA_S_APP\yisa-s-app" && git status
```

**Doğru — seçenek A (PowerShell):**  
`;` kullanın:
```powershell
cd "C:\Users\info\OneDrive\Desktop\YISA_S_APP\yisa-s-app"; git status
```

**Doğru — seçenek B (CMD):**  
CMD açıp:
```batch
cd /d "C:\Users\info\OneDrive\Desktop\YISA_S_APP\yisa-s-app"
git status
```

**Commit + push (PowerShell):**
```powershell
cd "C:\Users\info\OneDrive\Desktop\YISA_S_APP\yisa-s-app"
git add .
git commit -m "fix: guncellemeler"
git push origin main
```

**Commit + push (CMD):**
```batch
cd /d "C:\Users\info\OneDrive\Desktop\YISA_S_APP\yisa-s-app"
git add .
git commit -m "fix: guncellemeler"
git push origin main
```

Önce mutlaka **proje klasörüne** (`yisa-s-app`) girip sonra bu komutları çalıştırın.

---

## 5. Kısa Özet — "Genel Sorun Ne, Neden Yapamıyoruz?"

| Sorun | Olası neden | Ne yapmalı? |
|-------|-------------|-------------|
| "env example / export / explore" | `.env.example` şablon; uygulama onu okumuyor | Gerçek config **`.env.local`**. Ona dokunmayın; `npm run dev` onu kullanır. |
| "Sistem çalışmıyor" | Yanlış klasör, eksik `npm install` veya node | `cd ...\yisa-s-app` → `npm install` → `npm run dev` |
| "Commit yapılmıyor" | `index.lock` veya yanlış dizin | Lock’u sil (yukarıdaki adımlar), sonra `git add` / `commit` / `push` |
| "Push / deploy yok" | Push yapılamadığı için Vercel yeni deploy almıyor | Önce push’ı düzeltin; Vercel `main`’e otomatik deploy alır. |
| "Verdiğin komutlar işe yaramıyor" | `&&` PowerShell’de geçersiz; proje klasörü dışında çalıştırma | `;` kullanın (PowerShell) veya CMD’de `cd` sonra komutlar; hep proje kökünde çalıştırın. |

---

## 6. Tek Seferde Kontrol (PowerShell)

Proje klasöründe PowerShell açıp:

```powershell
cd "C:\Users\info\OneDrive\Desktop\YISA_S_APP\yisa-s-app"
git status
git log --oneline -3
git remote -v
```

- "up to date with 'origin/main'" ve "nothing to commit" → son değişiklikler push’lanmış.  
- "Changes not staged" / "Untracked" → commit etmeniz gereken değişiklik var.  
- Lock / erişim hatası → önce `index.lock` çözümünü uygulayın.

Bu adımlar hem **neden çalışmadığını** hem **neyi düzeltmeniz gerektiğini** netleştirir.
