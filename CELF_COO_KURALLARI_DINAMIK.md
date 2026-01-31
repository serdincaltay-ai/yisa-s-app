# CELF ve COO Kuralları — Yazılı Olanlar ve Dinamik Yapı

**Patron:** Serdinç ALTAY  
**Tarih:** 30 Ocak 2026

---

## 1. CELF görevlendirme kuralları — Yazılı mı?

**Evet.** "Şu alanlar olursa şu API'leri oraya görevlendirir" mantığı yazılı:

| Nerede | Ne var |
|--------|--------|
| **Kod** | `lib/robots/celf-center.ts` — Her direktörlük (CFO, CTO, …) için: `triggers` (tetikleyici kelimeler), `tasks`, `aiProviders` (hangi API'ler). Örn: CFO → GPT, GEMINI; CTO → GPT, CURSOR; CMO → GPT, CLAUDE. |
| **Çalıştırma** | `lib/ai/celf-execute.ts` — `getDirectorAIProviders(directorKey)` ile direktörlüğün API listesi alınır; sırayla çağrılır. |
| **Veritabanı** | `director_rules` tablosu (Supabase) — `director_key`, `ai_providers`, `triggers`, `data_access`, `read_only`, `protected_data`, `requires_approval`, `has_veto`. Dinamik güncelleme için hazır. |

Yani: Hangi alan/direktörlük → hangi API'ler, hem kodda sabit hem DB'de güncellenebilir (dinamik) olacak şekilde tasarlandı.

---

## 2. COO ne yapacak — Yazılı mı?

**Evet.** COO kuralları yazılı:

| Nerede | Ne var |
|--------|--------|
| **Kod** | `lib/robots/coo-robot.ts` — `COO_OPERATIONS` (günlük operasyon, tesis koordinasyonu, franchise koordinasyonu, süreç takibi, kaynak tahsisi); `mapDirectorToCOO(director)` (hangi direktörlük → hangi operasyon tipi). |
| **Kullanım** | Rutin görevler çalışırken (`app/api/coo/run-due`) CELF'e `director_key` ile gidilir; COO zamanlama ve operasyon tipi eşlemesi bu kurallara göre. |

COO kendi içinde API çağırmaz; sadece kurallar ve CELF tetiklemesi. Bu kurallar da ileride veritabanından okunacak şekilde genişletilebilir (dinamik).

---

## 3. Dinamik yapı — Güncellenebilir, artırılabilir

- CELF görevlendirme (alan → API'ler, tetikleyiciler) ve COO kuralları **geliştirilebilir, güncellenebilir, artırılabilir**.
- Bu güncellemeler **sadece Patron onayı sonrası** yapılır. Rutine bağlanamaz; **sadece Patron ile ilgilidir; bana sorularak yapılır.**
- Sistemin zarar vermeyecek şekilde değişecek: kural değişikliği onay sürecine bağlı, audit log tutulabilir.

---

## 4. Kilit kural — Kural değişikliği

| Kural | Açıklama |
|-------|----------|
| **CELF/COO kural değişikliği** | CELF görevlendirme (director_rules) veya COO kuralları değiştirilebilir — **yalnızca Patron onayı ile**. |
| **Rutine bağlanamaz** | Bu iş rutin görev olarak çalıştırılamaz; otomatik güncelleme yapılmaz. |
| **Sadece Patron** | İlgili tek yetkili Patron; "bana sorularak" yapılır. |
| **Sistem zarar görmesin** | Değişiklik onay sürecinden geçer; gerekirse audit log ile izlenir. |

---

## 5. Teknik özet

- **CELF:** `celf-center.ts` (varsayılan) + `director_rules` tablosu (dinamik override). Okuma: önce DB; yoksa kod. Yazma: sadece Patron onayı ile API.
- **COO:** `coo-robot.ts` (varsayılan). İleride `coo_rules` veya benzeri tablo ile dinamik yapı genişletilebilir; aynı kilit kural geçerli.
- **Kural değişikliği:** Proje içinde `.cursor/rules/kural-degisikligi-patron-onayi.mdc` ile sabitlendi; yeni kod bu kurala uyar.

---

## 6. Dinamik güncelleme nasıl yapılır?

- **CELF (director_rules):** `lib/db/director-rules-db.ts` — `getDirectorRulesFromDb`, `getDirectorRuleByKey`, `upsertDirectorRule`. Güncelleme **sadece Patron onayı sonrası** çağrılır; rutin görev ile çağrılmaz. API tarafında `patron_approved: true` veya Patron rolü kontrolü yapılmalı.
- **Çalışma zamanı:** `lib/robots/celf-config-merged.ts` — `getDirectorateConfigMerged(directorKey)` önce DB'den okur; kayıt varsa birleştirir, yoksa kod varsayılanını kullanır. CELF çalıştırıcı (`celf-execute.ts`) bu birleştirilmiş konfigürasyonu kullanır.
- **COO:** İleride `coo_rules` tablosu (şema: `supabase/coo-rules-table.sql`) ile dinamik kurallar eklenebilir; aynı kilit kural (sadece Patron onayı, rutine bağlanamaz) geçerli.

**Döküman sonu.**
