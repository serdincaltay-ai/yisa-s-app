# YİSA-S İş Akışı — Anayasa Uyumlu

**Tarih:** 4 Şubat 2026

---

## 1. Patron Akışı: Asistan Seç → Sohbet → Komut Gönder

1. **Asistan seçin** — GPT, Gemini, Claude, Together, V0, Cursor, Supabase, GitHub, Vercel, Railway, Fal
2. **Sohbet edin** — Seçilen asistanla konuşun, netleştirin
3. **Hedef direktör** — Boş = CEO otomatik yönlendirir. Seçili = Komut doğrudan o direktöre gider (CFO, CTO, CSPO, vb.)
4. **Komut olarak gönder** — "CEO'ya Gönder" butonu ile son mesaj komut olarak CEO → CELF'e gider

---

## 2. Robot Hiyerarşisi (Katman 0–8)

| Katman | Ad | Görev |
|--------|-----|-------|
| 0 | PATRON | Tek yetkili |
| 1 | PATRON ASİSTAN | GPT, Claude, Gemini, Together, V0, Cursor — Sohbet, danışmanlık |
| 2 | CIO | Strateji beyin — Komut yorumlama, önceliklendirme |
| 3 | SİBER GÜVENLİK | 3 Duvar, bypass önleme |
| 4 | VERİ ARŞİVLEME | Yedekleme, task_results |
| 5 | CEO ORGANİZATÖR | Kural tabanlı — Görev dağıtımı (AI yok) |
| 6 | CELF MERKEZ | 15 Direktörlük — CFO, CTO, CIO, CMO, CHRO, CLO, CSO, CPO, CDO, CISO, CCO, CSPO, COO, RND |
| 7 | COO YARDIMCI | Operasyon koordinasyonu |
| 8 | YİSA-S VİTRİN | Franchise hizmetleri |

---

## 3. Direktörler — Kısıtlanmış API (Pompa Mantığı)

Her direktör sadece kendi alanında çalışır:

| Direktör | Alan | Veri Erişimi |
|----------|------|--------------|
| CFO | Finans | payments, invoices, expenses |
| CTO | Teknoloji | system_logs, api_health |
| CIO | Bilgi Sistemleri | tables, integrations |
| CMO | Pazarlama | campaigns, content |
| CHRO | İnsan Kaynakları | personnel, training |
| CLO | Hukuk | contracts, compliance |
| CSPO | Spor | athletes, movements, training_programs, evaluations, health_records (readOnly) |
| CDO | Veri | analytics, reports |
| CISO | Güvenlik | security_logs |
| CCO | Müşteri | tickets, feedback |
| CPO | Ürün | website_templates, ui_components |
| COO | Operasyon | reports, analytics |
| RND | AR-GE | research, prototypes |

---

## 4. Vitrin Motoru (CELF / COO)

- **Franchise yetkilileri** — `/franchise` veya `/auth/login` → Tesis paneli
- **COO Mağazası** — Şablonlar, robotlar, modüller satın alma
- **Şablon değiştirme** — Franchise kendi şablonunu seçer, günceller
- **İnsan motoru** — En alt: Franchise patronları kendi kullanıcı adı/şifre ile rolüne göre tesis olarak girer

---

## 5. Veritabanı — Sağlık / Spor

- **athletes** — Sporcu bilgisi (ad, doğum tarihi, branş, seviye)
- **health_records** (planlanan) — Sağlık geçmişi, CSPO readOnly erişir
- **training_programs** — Antrenman programları
- **CSPO** — Çocuğun yaşına göre antrenman programı hazırlar, veritabanından athletes + health_records çeker, Sportif Direktöre sunar

---

## 6. Çakışma Kontrolü

- **CIO** — conflictWarnings üretir, loglar
- **Tek bekleyen iş** — Patron dışı için: Önce onayla/reddet
- **Patron** — Komut hiç engellenmez

---

## 7. Kim Ne Yapar?

| İş | Kim |
|----|-----|
| Sohbet | Patron Asistan (seçilen LLM) |
| Komut gönder | Patron → CEO'ya Gönder |
| Yönlendirme | CEO (routeToDirector) veya Hedef direktör seçimi |
| İş yapma | CELF Direktörleri |
| Onay | Patron (Havuz) |
| Push/Deploy | Patron onayı sonrası otomatik |
