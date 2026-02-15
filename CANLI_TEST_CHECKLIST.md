# Canlı Test Checklist

**Tarih:** 3 Şubat 2026  
**Durum:** Tablolar hazır, migration tamam, kod push edilmiş. Vercel deploy tamamlandığında yeni özellikler canlıda görünür.

---

## 1. Vercel deploy kontrolü

1. **Vercel Dashboard** → Proje **yisa-s-app** → **Deployments**.
2. En üstteki deploy’un durumu **Ready** mi kontrol edin.
3. **Ready** değilse deploy bitene kadar bekleyin.
4. **Ready** ise tarayıcıda **hard refresh:** `Ctrl+Shift+R` (Windows) veya `Cmd+Shift+R` (Mac).

Böylece ana sayfadaki linkler güncel olur:
- **Patron Paneli** → `/patron/login` (eski: `/auth/login`)
- **Sistemi Tanıyın — Franchise** / **Vitrin** → `/vitrin` (eski: `/demo`)

---

## 2. Test adresleri ve yapılacaklar

| Test adresi | Ne yapacaksınız | Beklenen sonuç |
|-------------|------------------|-----------------|
| **www.yisa-s.com/vitrin** | Seçim yap, ad/e-posta gir, "Seçimleri gönder" | "Talebiniz alındı. Patron onayından sonra tesis paneliniz kurulacak." |
| **app.yisa-s.com/patron/login** | Patron e-posta + şifre ile giriş | Dashboard açılır |
| **app.yisa-s.com/dashboard/onay-kuyrugu** | Vitrin talebini listede bul | Onayla → tenant oluşur |
| **franchise.yisa-s.com** | Tenant atanmış kullanıcı ile giriş | Tesis paneli (franchise) açılır |
| **veli.yisa-s.com** | Veli kullanıcısı ile giriş | Çocuk listesi görünür |

---

## 3. Supabase doğrulama

- **Supabase Dashboard** → **Table Editor** → **demo_requests**.
- Vitrin’den gönderilen talebin kaydı var mı kontrol edin (source = `vitrin`, name/email/notes dolu).

---

## 4. Sorun çıkarsa

- **Linkler hâlâ eski:** Vercel deploy Ready mi kontrol edin; hard refresh (Ctrl+Shift+R) yapın; gerekirse farklı tarayıcı veya gizli pencere deneyin.
- **Vitrin talebi kaybolmuş:** demo_requests tablosunda `source = 'vitrin'` ve ilgili migration’ın çalıştığından emin olun.
- **Onay kuyruğu boş:** demo_requests’te status = `new` kayıt var mı bakın; API’nin Supabase env (URL, service_role veya anon key) ile çalıştığını kontrol edin.

**Döküman sonu.**
