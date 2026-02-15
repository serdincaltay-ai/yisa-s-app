# VERI_ROL_GOREV_FAYDA — Access / Excel'e Aktarma

Bu klasördeki CSV dosyaları Microsoft Access veya Excel'e aktarılabilir.

## Access'e Aktarma

1. Access'te **Yeni** → **Boş veritabanı**
2. **Harici Veri** → **Metin dosyasından** (Text File)
3. CSV dosyasını seçin
4. **Sınırlandırılmış** (Delimited), **Virgül** (Comma)
5. **İlk satır alan adları olarak kullan** işaretli
6. Tablo adı: `roller`, `gorevler`, `faydalar`, `hizmetler`, `veritabani_saglik`

## Dosya Listesi

| Dosya | İçerik |
|-------|--------|
| roller.csv | Rol kodu, adı, hiyerarşi, panel |
| gorevler.csv | Rol bazlı görevler, sıra, nerede |
| faydalar.csv | Hedef kitle, fayda, açıklama |
| hizmetler.csv | Kategori, hizmet, açıklama |
| veritabani_saglik.csv | Sağlık tabloları, erişim |

## MDB Oluşturma

Access'te tüm tabloları import ettikten sonra **Veritabanını Kaydet** → `.accdb` veya eski `.mdb` formatı seçebilirsiniz.
