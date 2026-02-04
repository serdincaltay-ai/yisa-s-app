# Asistanların Siteleri Yönetebilmesi — Araştırma Özeti

**Tarih:** 4 Şubat 2026

---

## 1. Genel Bakış

AI asistanlarının (Cursor, Claude, ChatGPT vb.) siteleri yönetebilmesi için kullanılan başlıca yöntemler:

- **MCP (Model Context Protocol)** — AI’ın harici sistemlere (Vercel, GitHub, veritabanı) bağlanması
- **Vercel MCP** — Cursor ile entegre; proje ve deploy yönetimi
- **Webflow / Hygraph gibi platformlar** — Kendi AI asistanları ile içerik ve tasarım
- **GitHub + CI/CD** — Asistanın kod yazması → commit → otomatik deploy

---

## 2. Cursor + Vercel MCP

**Kaynak:** [Vercel – Cursor now supported on Vercel MCP](https://vercel.com/changelog/cursor-now-supported-on-vercel-mcp)

- Cursor, Vercel MCP sunucusuna bağlanabiliyor.
- **Yapılabilecekler:**
  - Projeleri listeleme ve arama
  - Başarısız deploy’ları inceleme
  - Deploy loglarını çekme ve inceleme
  - Proje ve deploy yönetimi
  - Vercel dokümantasyonunda arama

**Kurulum:** `.cursor/mcp.json` içine:

```json
{
  "mcpServers": {
    "vercel": {
      "url": "https://mcp.vercel.com"
    }
  }
}
```

Vercel hesabı ile giriş yapıldıktan sonra Cursor içinden deploy, log ve proje işlemleri yapılabiliyor.

---

## 3. MCP (Model Context Protocol)

**Kaynak:** [modelcontextprotocol.io](https://modelcontextprotocol.io)

- Açık standart: AI uygulamalarının veri kaynakları, araçlar ve iş akışlarına bağlanması.
- **AI’ın yapabildikleri:**
  - Harici veri (dosya, veritabanı)
  - Araçlar (arama, hesaplama)
  - Tasarımdan web uygulaması üretme (ör. Figma → kod)
  - İş akışları ve özelleştirilmiş prompt’lar

YİSA-S tarafında: Patron komutları → CEO/CELF → Onay → Şablon/ürün, zaten bir “asistan zinciri”. İsterseniz Cursor’a Vercel MCP ekleyerek “deploy et”, “logları getir” gibi komutları da Cursor üzerinden yönetebilirsiniz.

---

## 4. Platform Bazlı AI Asistanları

| Platform   | Özellik                                                                 |
|-----------|-------------------------------------------------------------------------|
| **Webflow** | Tasarım, içerik, SEO önerileri, CMS; sitede doğrudan düzenleme          |
| **Hygraph** | CMS, çok dilli içerik, SEO, onay akışları; şema ve governance          |
| **Vercel**  | MCP ile Cursor/Claude vb. — deploy, log, proje yönetimi                |

YİSA-S: Next.js + Vercel deploy ise, Cursor + Vercel MCP ile “siteyi yönet” kısmı (deploy, log, proje) asistan üzerinden yürütülebilir.

---

## 5. YİSA-S İçin Öneriler

1. **Cursor’da Vercel MCP açın**  
   Proje Vercel’de ise: Cursor’dan “deploy et”, “son deploy’u kontrol et”, “logları getir” gibi istekler doğrudan yapılabilsin.

2. **Mevcut Patron → CEO → CELF → Onay akışı**  
   Zaten “asistanlar siteleri yönetebilsin” mantığına uygun: Komut → İşlenir → Onay → Şablon/ürün/vitrin. Ek olarak:
   - Onay sonrası otomatik **git push** (mevcut)
   - İsteğe bağlı: Onay sonrası **Vercel’e deploy tetikleme** (webhook veya MCP)

3. **Belge/çıktı nereye kaydedilsin**  
   CELF çıktıları için Supabase Storage (`documents` bucket) veya `celf_documents` tablosu ile “bilgi/belge nereye kaydedilecek” sorusu netleştirilebilir.

---

## 6. Özet

- **Asistanların siteleri yönetebilmesi:** MCP (özellikle Vercel MCP) ve platform AI’ları (Webflow, Hygraph) ile pratikte yapılıyor.
- **YİSA-S:** Cursor + Vercel MCP eklenirse, “deploy / log / proje yönetimi” asistan üzerinden; “iş üretme ve onay” ise mevcut Patron → CEO → CELF → Onay zinciri ile teslim edilebilir.
