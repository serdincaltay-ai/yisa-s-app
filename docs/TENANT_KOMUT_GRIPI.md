# Tenant penceresi — Komut listesi (grip)

**Yoklama modülü burada (kanat):** 1 numara = yoklama. Görev sırası: `docs/GOREV_YONETIMI.md`.  
**Tek iş / tek klasör sırası:** `docs/HANGI_KLASOR_SIMDI.md`.

**Kullanım:** tenant-yisa-s klasörünü Cursor'da açtığınız pencerede bu dosyayı (veya bu listeyi) referans alın. Cursor'a "1 numaralı görevi yap" veya aşağıdaki komutlardan birini verin.

---

## Kurulum (tenant penceresinde bir kez)

1. tenant-yisa-s klasörünü **File → Open Folder** ile açın.
2. Bu projedeki `docs/TENANT_CURSOR_RULE.mdc` içeriğini **tenant-yisa-s** içinde şu yola kopyalayın:  
   `tenant-yisa-s/.cursor/rules/tenant-protocol.mdc`  
   (Önce `.cursor/rules/` klasörünü oluşturun yoksa.)
3. İsterseniz bu komut listesini de tenant-yisa-s'e kopyalayın:  
   `tenant-yisa-s/docs/TENANT_KOMUT_GRIPI.md`

---

## Komutlar (sırayla veya isteğe göre)

| # | Komut / Görev | Klasör / Dosya |
|---|----------------|----------------|
| 1 | Yoklama modülünü yap: GELDİ/GELMEDİ/MUAF, devamsızlık SMS tetiği | `app/franchise/yoklama/page.tsx` veya tenant route |
| 2 | Aidat yönetimi: hatırlatma, liste, toplu düzenleme | `app/franchise/aidatlar/page.tsx` |
| 3 | İletişim: duyurular, anketler, eğitmen–veli mesajlaşma | `app/franchise/iletisim/page.tsx` |
| 4 | Belge yönetimi: sağlık raporu, geçerlilik uyarıları, veli/eğitmen yükleme | `app/franchise/belgeler/page.tsx` |
| 5 | Veli dashboard: çocuk listesi, devamsızlık özeti | `app/veli/dashboard/page.tsx` |
| 6 | Veli: çocuk devamsızlık görüntüleme sayfası/komponenti | `app/veli/` altı uygun sayfa |
| 7 | Veli: online aidat ödeme (İyzico/Paratika entegrasyonu) | `app/veli/` veya ilgili ödeme sayfası |
| 8 | Veli: mesajlaşma — antrenör ile iletişim | `app/veli/` veya iletişim modülü |

---

## Cursor'a verilebilecek örnek cümleler

- "TENANT_KOMUT_GRIPI.md'deki 1 numaralı görevi yap"
- "Yoklama modülünü yap: GELDİ/GELMEDİ/MUAF ve devamsızlık SMS tetiği"
- "Aidat yönetimi sayfası: hatırlatma, liste, toplu düzenleme"
- "Veli dashboard: çocuk listesi ve devamsızlık özeti"
- "TENANT_PENCEREDE_YAPILACAKLAR.md'deki 1 numaralı işi yap: yoklama modülü (GELDİ/GELMEDİ/MUAF, devamsızlık SMS tetiği)."

---

## Not

- Veritabanı: app-yisa-s ile aynı Supabase. Tablolarda `tenant_id` ile filtre kullanın.
- SMS/cron API'leri app-yisa-s'te; tenant tarafı sadece kendi UI ve API çağrılarıyla kullanır.
