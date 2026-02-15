# Hedef Hizalama — Gönderilen Dosyalara Göre

**Tarih:** 4 Şubat 2026  
**Amaç:** Patron'un gönderdiği 8 dosyadaki vizyon ile mevcut sistemin karşılaştırması. Nerede hedeften çıkıldı, nasıl geri dönülecek.

---

## 1. GÖNDERİLEN DOSYALAR ÖZETİ

| Dosya | İçerik |
|-------|--------|
| Yeni Metin Belgesi.txt | Ana vizyon: www.yisa-s.com vitrin, merkez robot, COO, CIO, franchise, sosyal medya/WhatsApp robotları |
| (2) AI Orkestrasyon | AI Router, Claude/GPT/Gemini/Together, CELP direktörlük AI dağılımı, Patron Asistanı |
| (3) Komut Zinciri | Patron → CIO → CEO → CELP → COO → Franchise, 12 direktörlük |
| (4) Mimari Analiz | Agent vs Bot, CrewAI, multi-tenant |
| (5)-(6) Birimler Arası Protokol | Talep → CIO planlama → CEO dağıtım → CELF üretim → COO depolama → Patron onayı → Yayınlama |
| (7) AI Protokol v2.0 | Yetkiler, iş akışı, token, depo, rutin işler |
| (8) Medya Direktörlüğü | Fal.ai, Canva, AutoCAD API |

---

## 2. DOSYALARDAKİ TEMEL YAPI (HEDEF)

```
PATRON
   │
   ▼
PATRON ASİSTANI (Claude bazlı)
   │
   ▼
CIO (Strateji, komuta)
   │
   ▼
CEO (Operasyon, yürütme)
   │
   ▼
CELP (12 Direktörlük) — Merkez Beyin
   │
   ▼
COO (Vitrin — yisa-s.com)
   │
   ▼
FRANCHISE'LAR (Tenant)
```

**Kurallar (dosyalardan):**
- Direktörlükler birbirleriyle DİREKT konuşamaz; tüm iletişim CEO üzerinden
- Patron onayı: Yayınlama, finans, sözleşme, fiyat değişikliği
- İş akışı: Talep → CIO planlama → CEO dağıtım → Üretim → CEO toplama → COO depolama → Patron onayı → Yayınlama
- AI Router: Görev tipine göre Claude/GPT/Gemini/Together seçimi
- CELP direktörlükleri: CTO, CFO, CMO, CHRO, CLO, CSO, CPO, CDO, CCO, CSPO, CMDO, CRDO

---

## 3. SAPMALAR (Nerede Hedeften Çıkıldı)

| Konu | Dosyalardaki hedef | Yapılan / Mevcut | Sapma |
|------|-------------------|------------------|-------|
| **İsim** | CELP (Merkez Beyin) | CELF kullanılıyor | Kodda CELF var; dosyalarda CELP |
| **Patron Asistan** | Claude bazlı, CIO'ya komut gönderir | Konuşma/komut/onay ayrımı eklendi | Ek mantık dosyalarda yok; ama "her mesaj komut değil" Patron söylemişti |
| **AI Router** | Görev tipine göre AI seçimi (Claude analiz, Gemini hızlı, GPT içerik) | Basit sınıflandırma (conversation/command/approval) | Router mantığı tam uygulanmadı |
| **Robot seçim paneli** | Dosyalarda yok | PATRON_VIZYON_VE_CURSOR_HAZIRLIK'ta "canlı robot listesi" | Patron sözlü olarak istedi; dosyalarda detay yok |
| **İş akışı** | Talep → CIO → CEO → CELF → COO → Patron onayı → Yayınlama | Chat flow: imla → Şirket/Özel → CEO → CELF → Onay kuyruğu | CIO ayrı katman olarak net değil; CEO direkt CELF'e gidiyor |
| **Direktörlük iletişimi** | Direkt yok, CEO üzerinden | Mevcut kod CEO → CELF tek adım | Uyumlu |
| **COO / Vitrin** | COO vitrin yönetir, CEO'dan alır | demo_requests, vitrin, tenant var | Kısmen uyumlu |
| **Birimler protokolü** | job_request, job_plan, sub_tasks, bağımlılık zinciri | ceo_tasks, patron_commands | Daha basit yapı; job/sub_task detayı yok |

---

## 4. GERİ DÖNÜŞ — HEDEFE HİZALAMA

### 4.1 İsim tutarlılığı
- **CELP vs CELF:** Dosyalarda CELP (Merkez Beyin). Kodda CELF. Patron hangisini tercih ediyor netleştirilmeli. Şimdilik değişiklik yapmıyorum; sadece not.

### 4.2 Akış — Dosyalara uygun sıra
```
Patron mesaj
   → Asistan (Claude) alır
   → Komut ise CIO'ya iletir (strateji, planlama)
   → CIO → CEO'ya iş emri
   → CEO → CELP direktörlüğüne dağıtır
   → Direktörlük üretir → CEO'ya teslim
   → CEO toplar → COO depoya kaydeder
   → Patron onayı
   → COO yayınlar
```

**Mevcut:** CIO analiz var (cio-robot) ama "planlama" katmanı zayıf. CEO direkt CELF'e gidiyor. COO "depolama" ayrı değil.

### 4.3 Yapılmayacaklar (hedefe aykırı)
- Direktörlüklerin birbirine direkt mesaj atması
- Patron onayı olmadan yayınlama
- Tenant'ların birbirinin verisini görmesi

### 4.4 Yapılacaklar (dosyalara göre)
1. **CIO katmanı:** Sadece analiz değil; "planlama" (hangi birimler, öncelik, tahmini token) → CEO'ya iş emri
2. **CEO:** CELP'e dağıtım, çıktıları toplama, COO'ya depolama emri
3. **COO:** Depo (drafts, approved, published) + vitrin
4. **AI Router:** Görev tipine göre Claude/GPT/Gemini seçimi (dosya 2'deki tablo)

---

## 5. PATRON SÖZLÜ İSTEKLERİ vs DOSYALAR

| Patron söyledi | Dosyalarda | Uyum |
|----------------|------------|------|
| "Her mesaj komut değil" | Yok (her şey komut gibi) | Sözlü istek öncelikli |
| "Gemini ile başla, Claude'a geç" | AI Router, görev bazlı | Panel fikri sözlü |
| "Bunu CEO'ya gönder deyince komut" | Asistan → CIO → CEO | Uyumlu |
| "Onaylıyorum deyince push/deploy" | Patron onayı zorunlu | Uyumlu |

**Sonuç:** Sözlü istekler dosyalarla çelişmiyor; tamamlıyor. "Konuşma/komut/onay" ayrımı hedefe uygun.

---

## 6. ÖZET — NEYİ KORUYALIM, NEYİ DÜZELTELİM

**Korunacak (hedefe uygun):**
- Patron konuşma/komut/onay ayrımı
- CEO → CELF (veya CELP) → Onay kuyruğu
- Patron onayı olmadan deploy/push yok
- Vitrin, demo, tenant yapısı

**Düzeltilecek / Eklenmesi gereken:**
- CIO planlama katmanı (job_plan, gerekli birimler)
- COO depo yapısı (drafts, approved, published)
- AI Router (görev tipine göre AI seçimi)
- İsim: CELP mi CELF mi netleştir

**Dosyalara sadık kalınacak:**
- Hiyerarşi: Patron → Asistan → CIO → CEO → CELP → COO → Franchise
- Direktörlükler arası direkt iletişim yok
- Onay seviyeleri (dosya 5-6)
- Token/ekonomi (dosya 7)

---

**Bu dosya:** Hedefi kaybetmemek için referans. Yeni özellik eklerken bu dosyaya bakılacak.
