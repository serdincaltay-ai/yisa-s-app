# Kullanıcı Rolleri ve Sistem — Öneriler (Onay Bekliyor)

**Patron:** Serdinç ALTAY  
**Tarih:** 30 Ocak 2026  
**Amaç:** Tüm kullanıcı rollerinin çalışmasını destekleyecek, rol sistemini geliştirebilecek, kapasite/görev çakışması/sistem yükü ihtiyaçlarını karşılayacak kurallar ve özellikler. Onaylarsanız bu maddeler kurala eklenir.

---

## A. Rol sistemi referansı (tek kaynak)

| # | Öneri | Neden gerekli |
|---|--------|----------------|
| **A1** | Kullanıcı rolleri ve yetki matrisi **tek yerde** tutulsun: `role_permissions` tablosu (veya `lib/auth/roles.ts` + Master Doküman Bölüm 3). Tüm robotlar, panel ve API bu referansı kullansın. | Rol tutarsızlığı olmaz; geliştirme tek yerden yapılır. |
| **A2** | ROL-0 (Ziyaretçi) … ROL-12 (Misafir Sporcu) ile panel/uygulama rol kodları eşlensin; Patron "sistemde ayrı rol kodu yok, üst yetkili" kalsın. | Master Doküman ile uyum; franchise/veli/sporcu panelleri doğru yönlenir. |

---

## B. Rol tabanlı erişim (robotlar ve API)

| # | Öneri | Neden gerekli |
|---|--------|----------------|
| **B1** | **Patron Asistan / flow:** Sadece Patron (ve tanımlı üst roller: örn. Süper Admin, Sistem Admini) flow’u tetikleyebilsin. Diğer roller kendi panellerine yönlendirilsin; flow API’sine yetkisiz rol 403 dönsün. | Patron Asistan sadece yetkili kullanıcıya açık olur. |
| **B2** | **CELF / CEO / COO tetiklemesi:** Bu katmanlara giden işler sadece yetkili rolden (Patron veya tanımlı roller) gelsin. Güvenlik robotu veya flow girişinde rol kontrolü yapılsın. | CELF/CEO/COO’yu sadece yetkili rol tetikler. |
| **B3** | **Vitrin / Franchise paneli:** ROL-1 (Franchise Sahibi), ROL-2 (Tesis Müdürü), … ROL-10 (Veli), ROL-11 (Sporcu) kendi panellerine/sayfalarına yönlendirilsin. Rol → sayfa eşlemesi `role_permissions` veya tek config’ten okunsun. | Tüm rollerin çalışması desteklenir; geliştirme tek yerden. |

---

## C. Kapasite ve görev çakışması

| # | Öneri | Neden gerekli |
|---|--------|----------------|
| **C1** | **Görev çakışması:** Aynı kullanıcı aynı anda aynı görev tipinde (örn. "şirket işi – CELF’te bekliyor") birden fazla bekleyen işe sahip olmasın; ya reddedilsin ya kuyruğa alınsın. Limit veya "tek bekleyen iş" kuralı tanımlansın. | Çakışma ve karışıklık önlenir. |
| **C2** | **Rol bazlı eşzamanlı iş limiti (ileride):** Patron sınırsız veya yüksek limit; diğer roller için düşük limit (örn. 1 bekleyen iş) tanımlanabilir olsun. | Kapasite anlamında sistem kontrollü çalışır. |
| **C3** | **Kuyruk önceliği:** CEO/CELF kuyruğunda rol önceliği: Patron > Franchise Sahibi (ROL-1) > … şeklinde tanımlansın. | Öncelik sırası net olur. |

---

## D. Sistem yükü

| # | Öneri | Neden gerekli |
|---|--------|----------------|
| **D1** | **Rol bazlı rate limit (ileride):** Patron dışı roller için dakikada/saatte istek limiti konabilsin. Patron sınırsız veya yüksek limit. | Sistem yükü kontrol altında kalır. |
| **D2** | **API kullanımı loglansın:** İstekler `tenant_id` ve rol (veya `user_id`) ile loglansın (`api_usage` veya mevcut tablo). Kapasite planlaması ve limit aşımı takibi için. | Yük ve kapasite ölçülebilir. |

---

## E. Robotlara eklenecek kurallar

| # | Öneri | Neden gerekli |
|---|--------|----------------|
| **E1** | **Güvenlik robotu:** Her istekte kullanıcı rol bilgisini loglasın; yetkisiz rol CELF/CEO tetiklemesi yapıyorsa engellesin. | Rol ihlali önlenir. |
| **E2** | **CEO:** Gelen isteğin `user_id` + rol bilgisi ile kayıt yapsın; rol dışı işlem (tanımlı yetkili roller dışı) reddedilsin. | CEO sadece yetkili rolden iş alır. |
| **E3** | **Veri robotu / CELF:** Veri erişimi rol ve `tenant_id` ile kısıtlı kalsın; direktörlük `dataAccess`/`readOnly` kuralları rol ile uyumlu uygulansın. | Veri sızıntısı önlenir. |
| **E4** | **Rol değişikliği:** Zaten CHRO `requiresApproval: role_change`; rol değişikliği sadece Patron onayı ile yapılsın (patron-lock ve onay akışında kalsın). | Yetki bütünlüğü korunur. |

---

## F. Olmazsa sistem çalışmaz sayılacak maddeler (özet)

- **Rol referansı tek olmalı** (A1–A2); yoksa roller birbirine karışır.
- **Flow/CELF/CEO erişimi rol ile kısıtlı olmalı** (B1–B3); yoksa yetkisiz kullanıcı Patron Asistan veya CELF’i tetikleyebilir.
- **Görev çakışması kuralı** (C1) veya en azından "tek bekleyen iş" mantığı olmalı; yoksa aynı kullanıcı aynı anda çok sayıda bekleyen işle karışabilir.
- **Güvenlik robotunda rol kontrolü** (E1) ve **CEO’da rol ile kayıt/red** (E2) olmalı; yoksa rol tabanlı güvenlik eksik kalır.

---

## Onay sonrası yapılacak

Onaylarsanız:

1. Bu maddeler `.cursor/rules` içinde **kullanici-rolleri-sistem.mdc** olarak sabitlenir.
2. `CELF_COO_KURALLARI_DINAMIK.md` veya ilgili dokümana "Rol sistemi ve kapasite" bölümü eklenir.
3. Kod tarafında: flow API’sine rol kontrolü (B1), güvenlik robotuna rol logu/engeli (E1), CEO’ya rol bilgisi ile kayıt (E2) adımları planlanır (uygulama sırası ayrı netleştirilir).

**Lütfen onaylıyorsanız "onaylıyorum" veya "ekle" yazın; onaylamadığınız madde varsa numarasını belirtin.**
