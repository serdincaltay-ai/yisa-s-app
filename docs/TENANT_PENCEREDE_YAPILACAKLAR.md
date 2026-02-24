# tenant-yisa-s Penceresinde Yapılacaklar

**Bu dosya:** `tenant-yisa-s` (Franchise — *.yisa-s.com) klasörünü açtığınızda, Cursor ile sırayla yapmanız gereken işlerin listesidir.  
**Kullanım:** tenant-yisa-s workspace'ini açın, bu dosyayı referans alarak Cursor'a "TENANT_PENCEREDE_YAPILACAKLAR.md'deki 1 numaralı işi yap" gibi talimat verin.

---

## 1. Yoklama Modülü

| Klasör / Dosya | İş | Not |
|----------------|-----|-----|
| `app/franchise/yoklama/` veya tenant route | Yoklama: GELDİ / GELMEDİ / MUAF; devamsızlık SMS tetiği | sms_templates + sms-provider ile entegre (app-yisa-s'te API/cron var). |

---

## 2. Aidat Yönetimi

| Klasör / Dosya | İş | Not |
|----------------|-----|-----|
| `app/franchise/aidatlar/` | Aidat yönetimi: hatırlatma, liste, toplu düzenleme | |

---

## 3. İletişim Modülü

| Klasör / Dosya | İş | Not |
|----------------|-----|-----|
| `app/franchise/iletisim/` | Duyurular, anketler, eğitmen–veli mesajlaşma | |

---

## 4. Belge Yönetimi

| Klasör / Dosya | İş | Not |
|----------------|-----|-----|
| `app/franchise/belgeler/` | Belge yönetimi: sağlık raporu, geçerlilik uyarıları, veli/eğitmen yükleme | |

---

## 5. Veli Dashboard

| Klasör / Dosya | İş | Not |
|----------------|-----|-----|
| `app/veli/dashboard/` | Veli dashboard: çocuk listesi, devamsızlık özeti | |

---

## 6. Veli – Devamsızlık Görüntüleme

| Klasör / Dosya | İş | Not |
|----------------|-----|-----|
| (Veli) | Çocuk devamsızlık görüntüleme sayfası/komponenti | |

---

## 7. Veli – Online Aidat Ödeme

| Klasör / Dosya | İş | Not |
|----------------|-----|-----|
| (Veli) | Online aidat ödeme (İyzico/Paratika entegrasyonu) | |

---

## 8. Veli – Mesajlaşma

| Klasör / Dosya | İş | Not |
|----------------|-----|-----|
| (Veli) | Mesajlaşma: antrenör ile iletişim | |

---

## Görev–klasör eşlemesi (referans)

| Görev no | Klasör | İçerik |
|----------|--------|--------|
| 27–30 | tenant-yisa-s | Yoklama, aidat, iletişim, belgeler |
| 31–34 | tenant-yisa-s | Veli paneli (dashboard, devamsızlık, ödeme, mesajlaşma) |

---

## Not

- Veritabanı ve Supabase tek (app-yisa-s ile aynı). Tenant subdomain'e göre `tenant_id` / RLS ile veri filtreleme yapılır.
- Bu işler **sadece tenant-yisa-s** penceresinde yapılmalı; yisa-s-com (vitrin) veya app-yisa-s penceresinde yapılmamalı.

---

## Cursor'a örnek komutlar

1. *"TENANT_PENCEREDE_YAPILACAKLAR.md'deki 1 numaralı işi yap: yoklama modülü (GELDİ/GELMEDİ/MUAF, devamsızlık SMS)."*
2. *"2 numaralı iş: aidat yönetimi sayfası ve hatırlatma."*
3. *"5 numaralı iş: veli dashboard'u (çocuk listesi, devamsızlık özeti)."*

Bu dosyayı **tenant-yisa-s** repo'sunda "yapılacaklar" listesi olarak kullanabilirsiniz.
