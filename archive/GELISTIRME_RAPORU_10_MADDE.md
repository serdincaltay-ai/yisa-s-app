# YİSA-S Patron Paneli — 10 Maddelik Eksiklik & Geliştirme Raporu
**Tarih:** 28 Ocak 2026  
**Amaç:** Tasarımda olup eksik kalanlar + "Burası şöyle daha iyi" önerileri. Onay sonrası geliştirilecek.

---

## 1. Chat ↔ AI Router / Task Flow / Patron Lock entegrasyonu (Tasarımda vardı, yok)

**Durum:** Talimatta akış: **PATRON KOMUTU → GPT (Koordinatör) → [GEMINI|V0|GPT|TOGETHER|CLAUDE] → Claude (Düzeltici) → Cursor → GPT → Claude → PATRON.**

**Şu an:** Chat sadece `/api/chat` ile Claude'a gidiyor. `ai-router`, `task-flow`, `patron-lock` hiç kullanılmıyor.

**Yapılacak:**
- Chat gönderiminde `checkPatronLock` + `routeTask` kullan.
- API tarafında (veya yeni `/api/assistant`): router'a göre ilgili AI'a yönlendir; task-flow stage'lerini takip et.
- UI'da "Bu mesaj şu AI'a gidecek" bilgisi (opsiyonel) göster.

---

## 2. Chat öncesi yasak komut engeli (Güvenlik iyileştirmesi)

**Durum:** `FORBIDDEN_FOR_AI` ve `checkPatronLock` tanımlı ama chat'te kullanılmıyor. "API_KEY göster", "git push" gibi mesajlar doğrudan Claude'a gidiyor.

**Yapılacak:**
- Mesaj gönderilmeden önce `checkPatronLock(message)` çağır.
- `allowed: false` ise isteği gönderme; kullanıcıya "Bu işlem AI için yasaktır" uyarısı göster.

---

## 3. Robot hiyerarşisi görselleştirmesi (Tasarımda vardı, yok)

**Durum:** Talimatta **Robot Hiyerarşisi (KİLİTLİ)** ağaç yapısı var:

```
PATRON (Serdinç Altay) - Katman 0
  └── PATRON ASİSTAN (Claude+GPT+…) - Katman 1
        └── SİBER GÜVENLİK - Katman 2
              └── VERİ ARŞİVLEME - Katman 3
                    └── CEO ORGANİZATÖR - Katman 4
                          └── YİSA-S CELF MERKEZ (12 Direktörlük) - Katman 5
                                └── COO YARDIMCI - Katman 6
                                      └── YİSA-S VİTRİN - Katman 7
```

**Şu an:** Bu yapı hiçbir sayfada gösterilmiyor.

**Yapılacak:**
- `/dashboard/robots` sayfasına (veya ayrı `/dashboard/hierarchy`) "Robot Hiyerarşisi" bölümü ekle.
- Katman 0–7'yi ağaç / liste olarak görselleştir.

---

## 4. İş akışı (FLOW_DESCRIPTION) UI'da gösterilmiyor (Tasarımda vardı, yok)

**Durum:** `task-flow.ts` içinde `FLOW_DESCRIPTION` metni var (PATRON → GPT → AI'lar → Claude → Cursor → Patron kararı). UI'da hiç kullanılmıyor.

**Yapılacak:**
- Dashboard chat alanında "İş akışı nasıl?" / "Akış şeması" linki veya küçük bilgi kutusu.
- Veya Robot sayfasında "Asistan iş akışı" bölümünde `FLOW_DESCRIPTION`'ı göster.

---

## 5. Patron kararı UI'ı: Onayla / Reddet / Değiştir (Tasarımda vardı, yok)

**Durum:** Talimatta **"PATRON KARAR VERİR (Onayla / Reddet / Değiştir)"** deniyor. Chat veya başka bir yerde bu karar butonları yok.

**Yapılacak:**
- Onay gerektiren işlemler (deploy, commit, vb.) için "Bekleyen işlemler" alanı (veya chat içi kart).
- Her öğede **Onayla / Reddet / Değiştir** butonları.
- `applyPatronDecision` ile state güncellemesi (örn. task-flow state'ine bağlı).

---

## 6. Chat yanıtında "Hangi AI yanıtladı?" etiketi (Geliştirme önerisi)

**Durum:** Şu an tüm yanıtlar Claude'dan. Router entegre edilince GEMINI/V0/GPT/TOGETHER/CLAUDE ayrımı olacak.

**Yapılacak:**
- API yanıtında `assignedAI` veya `taskType` dön.
- Chat balonunda küçük etiket: örn. "GEMINI", "GPT", "Claude" vb.
- Böylece Patron hangi AI'ın yanıt verdiğini görür.

---

## 7. Ana panel istatistikleri gerçek veriye bağlanması (Geliştirme önerisi)

**Durum:** "Toplam Sporcu", "Aktif Antrenör", "Bu Ay Gelir", "Demo Talepleri" hep **0**, sabit.

**Yapılacak:**
- Supabase'te ilgili tablolardan (sporcu, antrenör, gelir, demo vb.) sayım / özet çek.
- Dashboard'da bu verileri göster; yoksa fallback olarak "—" veya "0" kalsın.

---

## 8. Mesajlar sayfası (Eski tasarımda vardı, kaldırıldı)

**Durum:** Eski dashboard'da **"Mesajlar"** linki vardı. Yeni sidebar'da yok.

**Yapılacak:**
- Sidebar'a "Mesajlar" ekle → `/dashboard/messages`.
- Placeholder sayfa: "Mesajlar burada listelenecek" + ileride Supabase/entegrasyon notu.

---

## 9. Siber Güvenlik & Veri Arşivleme modülleri (Tasarımda vardı, yok)

**Durum:** Hiyerarşide **Katman 2: SİBER GÜVENLİK**, **Katman 3: VERİ ARŞİVLEME** var. Bunlara ait `lib` modülleri veya sayfalar yok.

**Yapılacak:**
- `lib/security/siber-güvenlik.ts`: basit kural seti veya arayüz (örn. log kontrolleri, yasak işlemler).
- `lib/archiving/veri-arsivleme.ts`: arşivleme kuralları / placeholder.
- İstersen Ayarlar veya Robot sayfasında "Siber Güvenlik" / "Veri Arşivleme" bölümleri veya kısa açıklamalar.

---

## 10. Rol bazlı erişim (13 seviye) – sadece liste var (Geliştirme önerisi)

**Durum:** 13 rol (Ziyaretçi → Patron) **Users** sayfasında listeleniyor. Ancak sayfa erişimi veya API erişimi rol bazlı kısıtlanmıyor; sadece login var.

**Yapılacak:**
- Supabase'te kullanıcı rolü tutuluyorsa, dashboard rotalarında veya API'de rol kontrolü (örn. sadece Patron / Süper Admin belirli sayfalara).
- En azından "Patron Paneli"ne girişi **Patron / Süper Admin / Sistem Admini** ile sınırlama (opsiyonel).
- Users sayfasında "Hangi rol ne yapabilir?" kısa açıklama metni eklenebilir.

---

## Özet

| # | Konu | Tip |
|---|------|-----|
| 1 | Chat ↔ Router / Task Flow / Patron Lock entegrasyonu | Tasarımda vardı, yok |
| 2 | Chat öncesi yasak komut engeli | Güvenlik iyileştirmesi |
| 3 | Robot hiyerarşisi görselleştirmesi | Tasarımda vardı, yok |
| 4 | FLOW_DESCRIPTION UI'da gösterimi | Tasarımda vardı, yok |
| 5 | Onayla / Reddet / Değiştir Patron kararı UI'ı | Tasarımda vardı, yok |
| 6 | Chat'te "Hangi AI yanıtladı?" etiketi | Geliştirme önerisi |
| 7 | Ana panel istatistikleri Supabase'ten | Geliştirme önerisi |
| 8 | Mesajlar sayfası (sidebar + placeholder) | Eski tasarımda vardı |
| 9 | Siber Güvenlik & Veri Arşivleme modülleri | Tasarımda vardı, yok |
| 10 | Rol bazlı erişim (13 seviye) | Geliştirme önerisi |

---

**Sonraki adım:** Bu 10 maddeyi inceleyip onayladıktan sonra sırayla veya öncelik vererek geliştirmeye geçebiliriz.
