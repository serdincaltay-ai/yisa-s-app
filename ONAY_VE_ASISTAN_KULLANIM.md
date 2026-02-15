# Onay ve Asistan Kullanım Kılavuzu

Bu doküman: **Onay nerede**, **asistanı nasıl çağırırsın**, **v0'a nasıl gönderirsin** sorularına cevap verir.

---

## 1. Onay Nerede?

| Yer | Ne yazıyor |
|-----|------------|
| **Sol menü** | "Onay Kuyruğu (10'a Çıkart)" |
| **Ana sayfa kartları** | "Onay Bekliyor" (sarı kart, sayı) |
| **Chat sağ panel** | "Onay Kuyruğu" — Direktör işleri burada, **Onayla** butonu |
| **Her asistan mesajı altında** | **Onayla** / Reddet / Değiştir butonları |

**Özet:** Onay = sağdaki panel (Havuz) veya her mesajın altındaki **Onayla** butonu. Sol menüden "Onay Kuyruğu" sayfasına da gidebilirsin.

---

## 2. Asistanı Nasıl Çağırırsın?

### Yöntem 1: Asistan zinciri (tıkla seç)

1. Chat açıkken üstte **GPT, Gemini, Claude, V0, Cursor** vb. butonlar var
2. Tıklayarak zincire ekle (örn: 1.Gemini → 2.V0)
3. Mesaj yaz, **Gönder** bas
4. Sırayla çalışır: önce Gemini, sonra V0

### Yöntem 2: Doğrudan yaz (v0, cursor, direktör)

Chat'e şunları yazabilirsin:

| Yazdığın | Ne olur |
|---------|---------|
| **v0'a tasarım yaptır** | CPO (V0) direktörüne gider, tasarım üretir |
| **v0'u çağır** | Aynı — CPO'ya gider |
| **v0'u görevlendir** | Aynı |
| **cursor'a gönder** | CTO (kod) direktörüne gider |
| **CFO'ya rapor hazırla** | CFO'ya gider |
| **CSPO'ya antrenman öner** | CSPO'ya gider |

**Önemli:** Bu komutları yazdıktan sonra **"CEO'ya Gönder"** butonuna bas veya **Şirket İşi** seç. Yoksa sadece sohbet olarak kalır, CELF'e gitmez.

### Yöntem 3: "Onaylıyorum" (bekleyen iş varsa)

Havuzda bekleyen iş varsa chat'e **"Onaylıyorum"** yaz → En son bekleyen iş onaylanır, push/deploy tetiklenir.

---

## 3. Akış Özeti

```
Sen yazıyorsun
    ↓
"Bu mu demek istediniz?" (imla düzeltme) → Şirket İşi / Özel İş seç
    ↓
Şirket İşi seçilirse → CIO → CEO → CELF (direktör)
    ↓
Sonuç → Onay Kuyruğu (sağ panel)
    ↓
Onayla bas → Push, deploy, tamamlandı
```

**Özel İş:** CELF'e gitmez, sadece asistan cevaplar. "Kaydet?" derse kendi alanına kaydedebilirsin.

---

## 4. Sık Karışan Noktalar

| Soru | Cevap |
|------|-------|
| "Onay" nerede yazıyor? | Sol menü: "Onay Kuyruğu", kart: "Onay Bekliyor", sağ panel: "Onay Kuyruğu" |
| v0'a nasıl gönderirim? | "v0'a tasarım yaptır" yaz + Şirket İşi seç veya CEO'ya Gönder |
| Asistanı çağırır mı? | Evet — zincirden seç veya "v0'u çağır", "CFO'ya rapor" yaz |
| Neden işim havuzda görünmüyor? | Şirket İşi seçmeden veya CEO'ya Gönder basmadan sadece sohbet olur |

---

## 5. Yapılan Değişiklikler (5 Şubat 2026)

- Sidebar: "10'a Çıkart" → **"Onay Kuyruğu (10'a Çıkart)"**
- Kart: "Onay" → **"Onay Bekliyor"**
- Sağ panel: "Havuz (Onay Kuyruğu)" → **"Onay Kuyruğu"**
- Chat placeholder: **"Örn: v0'a tasarım yaptır, CFO'ya rapor hazırla, Onaylıyorum"**
- Flow: **"v0'a gönder"**, **"v0'u çağır"**, **"v0'u görevlendir"** → CPO'ya otomatik yönlendirme
- Flow: **"cursor'a gönder"**, **"cursor'u çağır"** → CTO'ya otomatik yönlendirme
- **v0 direktifi:** "v0'u görevlendir" dediğinde **sadece V0 çalışır**, Cursor atlanır (V0_API_KEY gerekli)
