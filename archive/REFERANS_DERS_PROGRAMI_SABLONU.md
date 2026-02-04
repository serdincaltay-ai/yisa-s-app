# Referans: Ders Programı Şablonu

**Kaynak:** Eski YİSA-S dokümantasyonu (Kalıcı Arşiv)  
**Kullanım:** Haftalık program seed verisi, franchise varsayılan şablonu veya dokümantasyon.  
**Sistem:** ScheduleTab ve `/api/franchise/schedule` ile uyumludur.

---

## Haftalık program matrisi

| SAAT | PAZARTESİ | SALI | ÇARŞAMBA | PERŞEMBE | CUMA | CUMARTESİ | PAZAR |
|:----:|:---------:|:----:|:--------:|:--------:|:----:|:---------:|:-----:|
| 09:00-10:00 | - | - | - | - | - | Minikler (3-5) | Minikler (3-5) |
| 10:00-11:00 | - | - | - | - | - | Çocuk (6-9) | Çocuk (6-9) |
| 11:00-12:00 | - | - | - | - | - | Oyun Saati | Oyun Saati |
| 14:00-15:00 | Minikler (3-5) | - | Minikler (3-5) | - | Minikler (3-5) | Gelişim (10-14) | Gelişim (10-14) |
| 15:00-16:00 | Çocuk (6-9) | Çocuk (6-9) | Çocuk (6-9) | Çocuk (6-9) | Çocuk (6-9) | Yarışmacı | Yarışmacı |
| 16:00-17:30 | Gelişim (10-14) | Gelişim (10-14) | Gelişim (10-14) | Gelişim (10-14) | Gelişim (10-14) | - | - |
| 17:30-19:00 | Yarışmacı | Yarışmacı | Yarışmacı | Yarışmacı | Yarışmacı | - | - |
| 19:00-20:00 | Yetişkin | - | Yetişkin | - | Yetişkin | - | - |

---

## Yaş grupları

| Grup | Yaş | Süre | Kapasite | İçerik özeti |
|------|-----|------|----------|--------------|
| Minikler | 3-5 | 45-60 dk | Max 8 | Temel motor beceriler, denge, koordinasyon, oyun temelli öğrenme |
| Çocuk | 6-9 | 60 dk | Max 12 | Artistik jimnastik temelleri, esneklik, kuvvet, takla |
| Gelişim | 10-14 | 90 dk | Max 15 | İleri seviye hareketler, alet çalışmaları, yarışmaya hazırlık |
| Yarışmacı | Seçme | 90 dk | Seçme | Yoğun antrenman, müsabaka hazırlığı |
| Oyun Saati | Tüm yaşlar | 60 dk | - | Serbest oyun, trambolin, parkur; fiyat ders fiyatının %50'si |

---

## Antrenör dağılımı (örnek)

| Rol | Grup | Günler |
|-----|------|--------|
| Sportif Direktör | Yarışmacı, Gelişim | Tüm hafta |
| Uzman Antrenör | Gelişim, Çocuk | Pazartesi-Cuma |
| Antrenör 1 | Çocuk, Minikler | Pazartesi-Cuma |
| Antrenör 2 | Çocuk, Minikler | Hafta sonu |
| Yardımcı | Destek | Değişken |

---

## Kontenjan (örnek)

| Grup | Kapasite | Dolu | Boş |
|------|:--------:|:----:|:---:|
| Minikler (3-5) | 24 | - | 24 |
| Çocuk (6-9) | 60 | - | 60 |
| Gelişim (10-14) | 45 | - | 45 |
| Yarışmacı | 20 | - | 20 |

---

## Özel günler (kapalı)

| Tarih / Dönem | Not |
|---------------|-----|
| 1 Ocak | Yılbaşı |
| 23 Nisan | Ulusal Egemenlik |
| 1 Mayıs | İşçi Bayramı |
| 19 Mayıs | Gençlik Bayramı |
| Ramazan Bayramı | 3 gün |
| Kurban Bayramı | 4 gün |
| 30 Ağustos | Zafer Bayramı |
| 29 Ekim | Cumhuriyet Bayramı |

---

## İş kuralları

1. Program değişikliği için en az 1 hafta önceden duyuru yapılır.
2. Yönetici randevu saatlerini kapatabilir.
3. Etkinlik günlerinde program değişebilir.
4. Yarışma öncesi ek antrenmanlar planlanabilir.
