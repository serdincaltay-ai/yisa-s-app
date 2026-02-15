# Telefondan YİSA-S Uygulamasını Açma — Adım Adım

Bu uygulama **internet sayfası** gibi çalışır. Bilgisayarda çalıştırırsınız; telefondan da **aynı WiFi** ile veya **internette yayınlanan link** ile açarsınız.

---

## ÖNEMLİ

- **localhost:3000** sadece **bilgisayarınızda** çalışır. Telefonda bu adresi yazarsanız açılmaz.
- Telefondan açmak için **iki yol** var:
  1. Bilgisayar açık + aynı WiFi → bilgisayarın adresini telefonda yazmak
  2. Uygulamayı internete (Vercel vb.) yükleyip oradan link almak

---

# YOL 1 — Bilgisayar açıkken telefondan aynı WiFi ile açmak

Bilgisayarınızda uygulama çalışacak; telefon **aynı WiFi ağında** olacak. Telefonda tarayıcıya bilgisayarın adresini yazacaksınız.

---

## Adım 1: Bilgisayarda proje klasörünü aç

1. **Dosya Gezgini** açın.
2. Şu klasöre gidin (kopyalayıp adres çubuğuna yapıştırabilirsiniz):

```
C:\Users\info\Downloads\serdincaltay-ai-yisa-s-app
```

---

## Adım 2: Bu klasörde “Adres çubuğuna tıkla ve cmd yaz” (veya PowerShell)

1. Klasörün içindeyken **üstteki adres çubuğuna** tıklayın.
2. Şunu yazıp Enter’a basın:

```
cmd
```

Siyah bir pencere (Komut İstemi) açılacak; o klasörde olacaksınız.

---

## Adım 3: Telefondan erişim için uygulamayı başlat

Komut penceresinde **tam olarak** şunu yazıp Enter’a basın (kopyalayıp yapıştırabilirsiniz):

```
npm run dev:phone
```

Bir süre bekleyin. En sonda şuna benzer bir satır çıkacak:

```
- Local:        http://localhost:3000
```

Bu pencereyi **kapatmayın**; uygulama bu pencerede çalışıyor.

---

## Adım 4: Bilgisayarınızın IP adresini bulun

1. **Yeni bir** Komut İstemi açın (Başlat → “cmd” yazın → Enter).
2. Şunu yazıp Enter’a basın:

```
ipconfig
```

3. Çıkan listede **“Kablosuz LAN bağdaştırıcısı”** veya **“Wireless LAN adapter”** bölümünü bulun.
4. O bölümde **“IPv4 Adresi”** satırına bakın. Örnek:

```
IPv4 Adresi. . . . . . . . . . . : 192.168.1.45
```

Sizdeki sayı farklı olabilir (örn. 192.168.0.10). **Kendi gördüğünüz IPv4 adresini** not alın.

---

## Adım 5: Telefonda tarayıcıyı açın

1. Telefonunuz **bilgisayarla aynı WiFi**e bağlı olsun.
2. Telefonda **Chrome** veya **Safari** (veya başka tarayıcı) açın.
3. Adres çubuğuna şunu yazın (**192.168.1.45** yerine kendi IPv4 adresinizi yazın):

```
http://192.168.1.45:3000
```

4. Enter’a basın veya “Git” deyin.

YİSA-S giriş sayfası açılıyorsa başarılı. Giriş yapıp kullanabilirsiniz.

---

## Kısa özet (kopyala-yapıştır)

**Bilgisayarda (cmd, proje klasöründe):**

```
cd C:\Users\info\Downloads\serdincaltay-ai-yisa-s-app
npm run dev:phone
```

**Bilgisayarda başka bir cmd’de:**

```
ipconfig
```

(IPv4 adresini not alın, örn. 192.168.1.45)

**Telefonda tarayıcıya:**

```
http://BURAYA_IP_YAZIN:3000
```

Örnek: `http://192.168.1.45:3000`

---

# YOL 2 — İnternete yükleyip her yerden (telefon, başka bilgisayar) açmak

Uygulamayı **Vercel** gibi bir yere yüklerseniz size bir link verir (örn. https://yisa-s-app.vercel.app). Bu linki telefondan, tabletten, her yerden açabilirsiniz; bilgisayarınızın açık olması gerekmez.

Bu yol için:

1. **GitHub** hesabı
2. Projeyi GitHub’a yükleme (git push)
3. **Vercel** hesabı (ücretsiz) ve projeyi Vercel’e bağlama

gerekir. İsterseniz bir sonraki belgede bunu da tek tek, kopyala-yapıştır şeklinde yazarız.

---

## Sık sorulanlar

**S: Telefonda “localhost:3000” yazdım, açılmıyor.**  
C: Doğru. localhost sadece bilgisayarınız içindir. YOL 1’deki gibi bilgisayarın **IP adresini** (örn. 192.168.1.45) ve **:3000** yazmalısınız.

**S: “npm run dev:phone” yazdım, hata veriyor.**  
C: Önce bir kez `npm install` yapın. Sonra tekrar `npm run dev:phone` deneyin.

**S: Telefonda sayfa açılmıyor.**  
C: Telefon ve bilgisayar **aynı WiFi**de mi? Bilgisayarda güvenlik duvarı 3000 portunu engelliyor olabilir; Windows güvenlik duvarında “Node” veya “3000” için izin verin.

**S: Uygulamayı “telefona indirip” mağazadan gibi kullanabilir miyim?**  
C: Bu proje şu an **web uygulaması**. Telefonda tarayıcıdan açarsınız; mağazadan indirilen bir uygulama değil. İsterseniz tarayıcıda “Ana ekrana ekle” ile kısayol koyabilirsiniz; tıklayınca yine tarayıcıda açılır.

---

*Son güncelleme: 31 Ocak 2026*
