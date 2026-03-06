# Kullanici Paneli Tasarim Kilidi — Dev'e Komut

> **Referans:** https://tenant-yisa-7wty4mlqj-serdincaltay-5864s-projects.vercel.app/ (Veli Paneli ornegi)  
> **Amac:** Proje dagilmasin; tum kullanici panelleri (Veli, Antrenor) bu arayuze gore **kilitlensin**. Sadece renk, logo ve grafik tarafinda oynamalar yapilacak.

---

## 1. Tasarim Kilidi — Ne Sabit Kalacak

Asagidakiler **referans alinacak**, yapi ve icerik sunumu degismeyecek:

| Bilesen | Aciklama |
|--------|----------|
| **Genel arayuz** | Koyu tema, sutunlar, kutucuk (kart) tabanli yerlesim. Bilgi blok blok, kutu kutu gosterilecek. |
| **Ust alan** | Sol: Logo / "YISA-S" + panel adi ("VELI PANELI" / "ANTRENOR PANELI"). Sag: Cevrimici gostergesi (yesil nokta). |
| **Icerik alanlari** | Her bolum yuvarlatilmis koseli, koyu gri kartlar (kutucuklar) icinde. Baslik + alt metin + ikonlar net ayrilmis. |
| **Alt navigasyon** | Sabit alt bar: Profil, Program, Aidat, Gelisim, Bildirim — ikon + etiket; aktif sekme vurgulu (turkuaz/mavi). |
| **Ders programi ekrani** | Baslik "Ders Programi", alt baslik "Haftalik X ders". Gun secici: Pzt, Sal, Car, Per, Cum, Cmt, Paz (pill butonlar; secili gun vurgulu). Secilen gune ait dersler kartlar halinde (brans, ogrenci, saat, hoca, salon). En altta "Haftalik Ozet" — 3 kutucuk: [Cocuk1 Dersleri], [Cocuk2 Dersleri], [Toplam]. |
| **Aidat ekrani** | "Aidat & Odemeler" basligi. Ozet kartlari: Bekleyen (turuncu cerceve), Odenen (yesil). "Bekleyen Aidatlar" listesi — her biri kart (cocuk adi, brans–ay, son odeme tarihi, tutar, "Odeme Yap" butonu). "Odeme Gecmisi" listesi — kartlar halinde (cocuk, brans–ay, tutar, yesil tik). Altta "Toplam Bekleyen" ozeti. |
| **Gelisim ekrani** | Sporcu secici (orn. Elif / Can) pill butonlar. "Genel Puan" buyuk kart (sayi + brans–seviye). "Beceri Detaylari" — her beceri bir satir kart (ikon, ad, puan, acilir ok). "Basarilar" — rozet/medal ikonlu kartlar. "Antrenor Notu" — tek metin karti. |
| **Bildirimler ekrani** | "Bildirimler" basligi, "X okunmamis bildirim". Filtre sekmeleri: Tumu, Okunmamis (X), Aidat, Ders, Duyuru (secili vurgulu). Her bildirim bir kart: sol ikon (tipine gore renk), baslik, aciklama, zaman; okunmamislarda mavi nokta. |

**Ozet:** Veli paneli bu ekranlar ve bu kutucuk/sutun duzeni ile **kilitli**. Antrenor paneli de **ayni arayuz dilini** kullanacak (ayni kutucuk yapisi, alt navigasyon, kart duzeni); sadece icerik (veri) ve gerekiyorsa sekme isimleri rolune gore degisir.

---

## 2. Izin Verilen Degisiklikler (Sadece Bunlar)

| Ne | Aciklama |
|----|----------|
| **Kulubun renkleri** | Vurgu rengi (turkuaz/mavi) kulup rengi ile degistirilebilir. Arka plan tonu ayni koyu kalabilir veya kulup temasina gore hafif ayarlanabilir. |
| **Arka plan / logo** | Header'daki logo alani kulup logosu olacak. Istenirse sayfa arka planinda hafif logo/watermark kullanilabilir. |
| **Grafikler** | Grafikler (Gelisim'deki puanlar, beceri cubuklari, ileride raporlar) daha "teknolojik" gorunecek sekilde guncellenebilir (cizgi/bar stilleri, renkler). Kutucuk yapisi ve sayfa duzeni ayni kalacak. |

Bunlar disinda **layout, kutucuk duzeni, sutun yapisi ve navigasyon** referanstaki gibi kalacak.

---

## 3. Ders Programi — Net Gorunum

- **Ust:** "Ders Programi" + "Haftalik 8 ders" (veya gercek sayi).
- **Gun secici:** 7 pill (Pzt ... Paz); secili gun dolu renk (turkuaz/kulup rengi), digerleri koyu.
- **Ders kartlari:** Secilen gune gore liste. Her kart: Brans adi, cocuk adi, "Aktif" etiketi, saat araligi, antrenor adi, salon. Ikonlar (saat, kisi, konum) turkuaz/kulup rengi.
- **Haftalik ozet:** 3 kutu — [Isim1 Dersleri: sayi], [Isim2 Dersleri: sayi], [Toplam: sayi]. Toplam vurgulu renkte.

Bu yapi hem **Veli paneli** hem **Antrenor paneli** tarafinda (antrenor icin sinif/sube odakli veri ile) korunacak.

---

## 4. Dev'e Verilecek Tek Komut (Kopyala-Yapistir)

KULLANICI PANELI TASARIM KILIDI — Referans arayuz zorunlu. Referans: https://tenant-yisa-7wty4mlqj-serdincaltay-5864s-projects.vercel.app/ (Veli Paneli). YAPILACAKLAR: 1) ARAYUZU KILITLE — koyu tema, kutucuk layout, ust alan (logo + panel adi + cevrimici), alt navigasyon (Profil, Program, Aidat, Gelisim, Bildirim). 2) DERS PROGRAMI EKRANI — gun secici Pzt–Paz, ders kartlari, Haftalik Ozet 3 kutucuk. 3) AIDAT, GELISIM, BILDIRIMLER — kart yapilari yukaridaki gibi. 4) SADECE renk/logo/grafik oynamalari. 5) ANTRENOR PANELI ayni arayuz dili. Bu tasarim kilidi disina cikilmayacak.
