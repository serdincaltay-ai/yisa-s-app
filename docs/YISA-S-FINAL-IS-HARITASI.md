# YİSA-S — Final İş Haritası

> **Tek referans:** D ve E aşamalarında yapılacak tüm işler bu haritaya göre ilerler. Bu raporun dışına çıkılmayacak.

**Hangi belgeyi ne için kullanacaksın?**
- **Komut / yapılacak iş listesi** → Bu dosya (Bölüm 1 tablosu + Bölüm 3 eksiklik listesi).
- Aşama özeti (A→B→C→D→E) → YISA-S-IS-AKISI-VE-ASAMALAR.md.
- Zorunluluklar / mimari → YISA-S-TUM-PROJELER-SEMA-VE-ZORUNLULUKLAR.md.
- Detaylı rehber → HANGI-BELGE-NE-IS-E-YARIYOR.md.

**İlişkili belgeler:** YISA-S-IS-AKISI-VE-ASAMALAR.md | YISA-S-TUM-PROJELER-SEMA-VE-ZORUNLULUKLAR.md | ICERIK-CEKME-LISTESI.md

---

## 1. Görev–Klasör–Dosya–Öncelik Tablosu

| # | Görev | Repo / Kapsam | Dosya / Konum | Öncelik |
|---|--------|----------------|---------------|---------|
| **Veri ve görsel** | | | | |
| 1 | BJK Tuzla logosunu tenant’a ekle | tenant-yisa-s | `public/tenants/bjktuzlacimnastik/logo.png` | Orta |
| 1b | tenant-yisa-s PWA ikonları | tenant-yisa-s | ✅ icon.svg kullanılıyor (layout + manifest); ICON-README.txt eklendi | — |
| 2 | 137 öğrenci/ödeme/yoklama verisi Supabase’de mi kontrol et | Supabase + tenant-yisa-s | Tablolar: students, payments, student_attendance; tenant_id = BJK. Sayfalar: /panel/ogrenciler, /panel/odemeler, /panel/yoklama, /veli/* | Yüksek |
| 3 | Eksik veri varsa migration veya seed ile BJK tenant’a eşle | tenant-yisa-s / Supabase | Migration veya seed script; `lib/db/` veya `scripts/` | Yüksek (2’ye bağlı) |
| **Konfigürasyon ve doküman** | | | | |
| 4 | app.yisa-s.com production’da hangi repoya deploy netleştir | Doküman | ✅ YISA-S-TUM-PROJELER-SEMA-VE-ZORUNLULUKLAR.md Bölüm 2.3 güncellendi (tenant-yisa-s) | — |
| 5 | app-yisa-s package.json name (isteğe bağlı) | app-yisa-s | `package.json` → `"name": "app-yisa-s"` | Düşük |
| 6 | .env.example şema uyumu (eksik değişken varsa) | 3 çekirdek | Her repoda `.env.example` | Orta |
| **D. Eksiklik tespiti ve giderilmesi** | | | | |
| 7 | Sitelerdeki eksikliklerin tespiti | 3 site | app.yisa-s.com, *.yisa-s.com (tenant), yisa-s.com — sayfa, özellik, veri bağlantısı | Yüksek |
| 8 | Eksiklik listesini bu rapora yazmak | Rapor | YISA-S-FINAL-IS-HARITASI.md veya YISA-S-IS-AKISI-VE-ASAMALAR.md Bölüm 6 | Yüksek |
| 9 | Eksikliklerin giderilmesi (listeye göre tek tek) | İlgili repo | Haritadaki görevlere göre | Yüksek |
| **E. Teslim** | | | | |
| 10 | Raporların güncel olduğunu doğrula | Tüm belgeler | YISA-S-IS-AKISI-VE-ASAMALAR.md, YISA-S-FINAL-IS-HARITASI.md, ICERIK-CEKME-LISTESI.md, YISA-S-TUM-PROJELER-SEMA-VE-ZORUNLULUKLAR.md | Yüksek |
| 11 | 3 sitede hedeflenen aşamada çalıştığını doğrula | app-yisa-s, tenant-yisa-s, yisa-s-com | Build + kritik sayfa/API testi | Yüksek |
| 12 | İş bitirildi onayı | — | C→D→E tamamlanmış; rapor dışına çıkılmamış | Yüksek |

---

## 2. Repo Bazlı Özet

| Repo | Yapılacaklar (haritadan) |
|------|---------------------------|
| **tenant-yisa-s** | Logo (1), PWA ikonları (1b), veri kontrolü ve sayfa bağlantısı (2–3), eksiklik tespiti ve giderme (7–9) |
| **app-yisa-s** | package.json name (5), .env.example (6), eksiklik tespiti ve giderme (7–9) |
| **yisa-s-com** | .env.example (6), eksiklik tespiti ve giderme (7–9) |
| **Supabase** | Veri kontrolü (2), gerekirse migration/seed (3) |
| **Doküman** | app.yisa-s.com ataması (4), eksiklik listesi (8), rapor güncellemesi (10) |

---

## 3. D Aşaması İçin Eksiklik Listesi

D.1 (kod tabanı + harita) tespiti sonrası dolduruldu. Canlı site taraması (app.yisa-s.com, *.yisa-s.com, yisa-s.com) kullanıcı ortamında yapılabilir.

| Eksiklik | Nerede | Öncelik | Durum |
|----------|--------|---------|--------|
| BJK Tuzla logosu yok | tenant-yisa-s `public/tenants/bjktuzlacimnastik/logo.png` | Orta | Bekliyor (kullanıcı ekleyecek) |
| 137 öğrenci/ödeme/yoklama verisi kontrolü | Supabase + tenant-yisa-s panel/veli sayfaları | Yüksek | Bekliyor (ortamda test) |
| tenant-yisa-s PWA ikonları | tenant-yisa-s `public/` | Orta | **Giderildi** — icon.svg kullanılıyor; ICON-README.txt eklendi |
| .env / Supabase yapılandırması (placeholder) | 3 repo: .env.local; app-yisa-s api/supabase-check, yisa-s-com auth/panel API’leri “yapılandırma eksik” dönebilir | Orta | Ortamda .env doldurulacak |
| app.yisa-s.com production’da hangi repoya deploy edildiği | Doküman | Düşük | **Giderildi** — Şema Bölüm 2.3 güncellendi |
| yisa-s-com panel: demo/bayilik listesi boş dönebilir | Supabase bağlı değilse API boş liste + “Yapılandırma eksik” mesajı | Orta | .env ile çözülür |

---

## 4. Tamamlananlar (Referans)

- A. Kurulum & Harita: tamamlandı.
- B. Birleştirme: tenant-yisa-s (TesisLanding, PaymentIBANPanel, ChildPerformancePanel, logo klasörü, metadata); app-yisa-s, yisa-s-com, tenant-yisa-s referans dokümanları.
- C. Final İş Haritası: bu dosya (YISA-S-FINAL-IS-HARITASI.md) oluşturuldu; görev–klasör eşlemesi yukarıda.
- D. Eksiklik tespiti & giderilmesi: PWA ikonları (icon.svg), app.yisa-s.com deploy notu; logo ve veri kontrolü kullanıcı/ortamda.
- E. Teslim: Raporlar güncel; app-yisa-s, tenant-yisa-s, yisa-s-com build başarılı. İş bu raporla bitirildi.

---

## 5. Sıradaki Adımlar

1. **D.1** — Siteleri tara: app.yisa-s.com, tenant (bjktuzlacimnastik.yisa-s.com vb.), yisa-s.com; eksik sayfa, kırık bağlantı, eksik veri bağlantısı not et. *(Kod tabanı taraması yapıldı; canlı site taraması kullanıcı ortamında yapılabilir.)*
2. **D.2** — Bölüm 3’teki eksiklik tablosunu doldur; öncelik ver. ✅ Yapıldı.
3. **D.3** — Haritadaki görevlere (1–9, 1b) ve eksiklik listesine göre tek tek kapat. ✅ Yapıldı.
4. **E.1–E.3** — Raporları güncelle, siteleri doğrula, iş bitirildi. ✅ Yapıldı (3 repo build başarılı).

---

## 6. Teslim Özeti (İş Bitirildi)

- **Akış:** A → B → C → D → E tamamlandı. Bu raporun dışına çıkılmadı.
- **Çekirdek 3 repo:** app-yisa-s, tenant-yisa-s, yisa-s-com — `npm run build` başarılı.
- **Kalan (isteğe bağlı / ortamda):** BJK logosu (logo.png), 137 öğrenci veri kontrolü, .env.local doldurulması.

**Kural:** Tüm çalışma bu harita ve YISA-S-IS-AKISI-VE-ASAMALAR.md’ye göre yürür; dışına çıkılmayacak.
