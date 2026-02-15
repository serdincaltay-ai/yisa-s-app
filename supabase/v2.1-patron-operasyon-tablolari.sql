-- ═══════════════════════════════════════════════════════════════════════════════════════
-- YİSA-S v2.1 - PATRON VE OPERASYON TABLOLARI
-- Master Doküman v2.1 EK-C.2'ye göre
-- Tarih: 29 Ocak 2026
-- ═══════════════════════════════════════════════════════════════════════════════════════
--
-- Bu script: önce tenants tablosunu oluşturur (yoksa), sonra 7 tablo + view'lar + örnek veriler.
-- Supabase SQL Editor'da: New query → bu dosyanın tamamını yapıştırın → Run
-- ═══════════════════════════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────────────────────
-- 0. TENANTS (Kiracı / Franchise sahibi) — Diğer tablolar buna referans verir
--    Tablo yoksa oluşturulur; varsa atlanır.
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ad VARCHAR(255),
    slug VARCHAR(100) UNIQUE,
    durum VARCHAR(20) DEFAULT 'aktif' CHECK (durum IN ('aktif', 'askida', 'iptal')),
    olusturma_tarihi TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    guncelleme_tarihi TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tenants_slug ON tenants(slug);
CREATE INDEX IF NOT EXISTS idx_tenants_durum ON tenants(durum);

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. APPROVAL_QUEUE (Onay Kuyruğu) - Patron Paneli
-- Kural: Deploy/commit SADECE Patron onayı ile
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS approval_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Talep Bilgileri
    talep_tipi VARCHAR(50) NOT NULL CHECK (talep_tipi IN (
        'yeni_ozellik',      -- ARGE'den gelen yeni özellik talebi
        'deploy',            -- Vercel/Railway deploy talebi
        'commit',            -- Git commit/push talebi
        'fiyat_degisikligi', -- Fiyat güncellemesi
        'franchise_basvuru', -- Yeni franchise başvurusu
        'modul_aktivasyon',  -- Modül açma/kapama
        'kullanici_yetkisi', -- Rol değişikliği
        'veri_silme',        -- Veri gizleme/silme talebi
        'diger'
    )),
    baslik VARCHAR(255) NOT NULL,
    aciklama TEXT,

    -- Kaynak Bilgileri
    talep_eden_robot VARCHAR(50),  -- CEO, CELF, CTO, ARGE vb.
    talep_eden_direktörlük VARCHAR(50),  -- CFO, CMO, CPO vb.
    tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,

    -- Durum
    durum VARCHAR(20) DEFAULT 'bekliyor' CHECK (durum IN (
        'bekliyor',    -- Patron kararı bekleniyor
        'onaylandi',   -- Patron onayladı
        'reddedildi',  -- Patron reddetti
        'degistirildi' -- Patron değişiklik istedi
    )),

    -- Patron Kararı
    patron_notu TEXT,
    karar_tarihi TIMESTAMP WITH TIME ZONE,

    -- Öncelik (1=en yüksek, 5=en düşük)
    oncelik INTEGER DEFAULT 3 CHECK (oncelik BETWEEN 1 AND 5),

    -- İlişkili Veriler
    iliskili_tablo VARCHAR(100),
    iliskili_kayit_id UUID,
    payload JSONB DEFAULT '{}'::jsonb,

    -- Zaman Damgaları
    olusturma_tarihi TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    guncelleme_tarihi TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index'ler
CREATE INDEX IF NOT EXISTS idx_approval_queue_durum ON approval_queue(durum);
CREATE INDEX IF NOT EXISTS idx_approval_queue_talep_tipi ON approval_queue(talep_tipi);
CREATE INDEX IF NOT EXISTS idx_approval_queue_oncelik ON approval_queue(oncelik);
CREATE INDEX IF NOT EXISTS idx_approval_queue_tarih ON approval_queue(olusturma_tarihi DESC);

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. EXPENSES (Patron Şirketi Giderleri) - Kasa Defteri
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Gider Bilgileri
    kategori VARCHAR(50) NOT NULL CHECK (kategori IN (
        'api_maliyeti',      -- Claude, GPT, Gemini, Together
        'altyapi',           -- Vercel, Railway, Supabase
        'hosting',           -- Domain, SSL, CDN
        'depolama',          -- Storage, backup
        'lisans',            -- Şablon, yazılım lisansları
        'operasyonel',       -- Elektrik, internet, ofis
        'personel',          -- Maaş, sigorta
        'pazarlama',         -- Reklam, tanıtım
        'hukuk',             -- Danışmanlık, sözleşme
        'diger'
    )),
    alt_kategori VARCHAR(100),
    aciklama TEXT NOT NULL,

    -- Tutar
    tutar DECIMAL(12,2) NOT NULL,
    para_birimi VARCHAR(3) DEFAULT 'USD',

    -- Fatura Bilgileri
    fatura_no VARCHAR(50),
    fatura_tarihi DATE,
    odeme_durumu VARCHAR(20) DEFAULT 'bekliyor' CHECK (odeme_durumu IN (
        'bekliyor',
        'odendi',
        'iptal'
    )),
    odeme_tarihi DATE,

    -- Dönem
    donem_ay INTEGER CHECK (donem_ay BETWEEN 1 AND 12),
    donem_yil INTEGER,

    -- İlişki
    tedarikci VARCHAR(255),

    -- Zaman Damgaları
    olusturma_tarihi TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    guncelleme_tarihi TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    gizli BOOLEAN DEFAULT FALSE
);

-- Index'ler
CREATE INDEX IF NOT EXISTS idx_expenses_kategori ON expenses(kategori);
CREATE INDEX IF NOT EXISTS idx_expenses_donem ON expenses(donem_yil, donem_ay);
CREATE INDEX IF NOT EXISTS idx_expenses_odeme ON expenses(odeme_durumu);

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. FRANCHISES (Franchise Listesi ve Durumları)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS franchises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID UNIQUE REFERENCES tenants(id) ON DELETE CASCADE,

    -- Franchise Bilgileri
    isletme_adi VARCHAR(255) NOT NULL,
    yetkili_ad VARCHAR(100) NOT NULL,
    yetkili_soyad VARCHAR(100) NOT NULL,
    telefon VARCHAR(20),
    email VARCHAR(255),
    adres TEXT,
    il VARCHAR(50),
    ilce VARCHAR(50),

    -- Sözleşme
    sozlesme_tarihi DATE,
    sozlesme_bitis DATE,
    giris_ucreti_odendi BOOLEAN DEFAULT FALSE,
    giris_ucreti_tutar DECIMAL(10,2) DEFAULT 1500.00,

    -- Durum
    durum VARCHAR(20) DEFAULT 'aktif' CHECK (durum IN (
        'basvuru',      -- Başvuru aşamasında
        'onay_bekliyor', -- Patron onayı bekliyor
        'aktif',        -- Aktif franchise
        'askida',       -- Geçici durdurulmuş
        'iptal',        -- İptal edilmiş
        'ayrildi'       -- Kendi isteğiyle ayrılmış
    )),

    -- Paket ve Modüller
    paket_tipi VARCHAR(20) DEFAULT 'temel' CHECK (paket_tipi IN ('temel', 'standart', 'premium', 'enterprise')),
    aktif_moduller JSONB DEFAULT '[]'::jsonb,

    -- Kademeler
    ogrenci_sayisi INTEGER DEFAULT 0,
    personel_sayisi INTEGER DEFAULT 0,
    sube_sayisi INTEGER DEFAULT 1,
    brans_sayisi INTEGER DEFAULT 1,

    -- Performans
    aylik_gelir DECIMAL(12,2) DEFAULT 0,
    son_odeme_tarihi DATE,
    geciken_odeme BOOLEAN DEFAULT FALSE,

    -- AI Konuşma Geçmişi (v2.1)
    son_ai_konusma_id UUID,
    toplam_ai_konusma INTEGER DEFAULT 0,

    -- Notlar
    patron_notu TEXT,

    -- Zaman Damgaları
    basvuru_tarihi TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    aktivasyon_tarihi TIMESTAMP WITH TIME ZONE,
    olusturma_tarihi TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    guncelleme_tarihi TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    gizli BOOLEAN DEFAULT FALSE
);

-- Index'ler
CREATE INDEX IF NOT EXISTS idx_franchises_durum ON franchises(durum);
CREATE INDEX IF NOT EXISTS idx_franchises_il ON franchises(il);
CREATE INDEX IF NOT EXISTS idx_franchises_tenant ON franchises(tenant_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. TEMPLATES (Şablon Havuzu)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Şablon Bilgileri
    kategori VARCHAR(50) NOT NULL CHECK (kategori IN (
        'grafik_premium',    -- 10 Premium grafik
        'grafik_standart',   -- 20 Standart grafik
        'rapor',             -- Rapor şablonları
        'form',              -- Form şablonları
        'belge',             -- Belge şablonları
        'sosyal_medya',      -- Instagram, WhatsApp şablonları
        'email',             -- E-posta şablonları
        'sms',               -- SMS şablonları
        'web',               -- Web sayfası şablonları
        'diger'
    )),
    ad VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    aciklama TEXT,

    -- İçerik
    icerik JSONB DEFAULT '{}'::jsonb,
    onizleme_url VARCHAR(500),

    -- Fiyatlandırma
    fiyat_tipi VARCHAR(20) DEFAULT 'dahil' CHECK (fiyat_tipi IN (
        'dahil',        -- Temel pakete dahil
        'premium',      -- Premium grafik
        'standart',     -- Standart grafik
        'ekstra'        -- Ek ücretli
    )),
    fiyat DECIMAL(10,2) DEFAULT 0,

    -- Kullanım
    aktif BOOLEAN DEFAULT TRUE,
    kullanim_sayisi INTEGER DEFAULT 0,

    -- Versiyon
    versiyon VARCHAR(20) DEFAULT '1.0',

    -- Zaman Damgaları
    olusturma_tarihi TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    guncelleme_tarihi TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index'ler
CREATE INDEX IF NOT EXISTS idx_templates_kategori ON templates(kategori);
CREATE INDEX IF NOT EXISTS idx_templates_slug ON templates(slug);
CREATE INDEX IF NOT EXISTS idx_templates_aktif ON templates(aktif);

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. FRANCHISE_REVENUE (Franchise Gelirleri)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS franchise_revenue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    franchise_id UUID NOT NULL REFERENCES franchises(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,

    -- Gelir Bilgileri
    gelir_tipi VARCHAR(50) NOT NULL CHECK (gelir_tipi IN (
        'aylik_abonelik',    -- Aylık abonelik ücreti
        'giris_ucreti',      -- Tek seferlik giriş ücreti
        'modul_ucreti',      -- Ekstra modül ücreti
        'grafik_satisi',     -- Grafik satışından pay (%80)
        'tasarim_hizmeti',   -- Logo, site vb. tek seferlik
        'diger'
    )),
    aciklama VARCHAR(255),

    -- Tutar
    brut_tutar DECIMAL(12,2) NOT NULL,
    yisas_payi DECIMAL(12,2),  -- YİSA-S payı (genelde %80)
    franchise_payi DECIMAL(12,2),  -- Franchise payı (genelde %20)
    net_tutar DECIMAL(12,2),  -- YİSA-S'e kalan
    para_birimi VARCHAR(3) DEFAULT 'TRY',

    -- Dönem
    donem_ay INTEGER CHECK (donem_ay BETWEEN 1 AND 12),
    donem_yil INTEGER,

    -- Ödeme
    odeme_durumu VARCHAR(20) DEFAULT 'bekliyor' CHECK (odeme_durumu IN (
        'bekliyor',
        'odendi',
        'gecikti',
        'iptal'
    )),
    odeme_tarihi DATE,
    vade_tarihi DATE,

    -- Zaman Damgaları
    olusturma_tarihi TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    guncelleme_tarihi TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    gizli BOOLEAN DEFAULT FALSE
);

-- Index'ler
CREATE INDEX IF NOT EXISTS idx_franchise_revenue_franchise ON franchise_revenue(franchise_id);
CREATE INDEX IF NOT EXISTS idx_franchise_revenue_donem ON franchise_revenue(donem_yil, donem_ay);
CREATE INDEX IF NOT EXISTS idx_franchise_revenue_odeme ON franchise_revenue(odeme_durumu);

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. DEPLOY_LOGS (Deploy/Commit Geçmişi)
-- Kural: git push / vercel deploy / railway deploy SADECE Patron onayı ile
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS deploy_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Deploy Bilgileri
    deploy_tipi VARCHAR(20) NOT NULL CHECK (deploy_tipi IN (
        'git_commit',
        'git_push',
        'vercel_deploy',
        'railway_deploy',
        'supabase_migration'
    )),
    ortam VARCHAR(20) DEFAULT 'production' CHECK (ortam IN (
        'development',
        'staging',
        'production'
    )),

    -- Onay Bilgileri
    approval_queue_id UUID REFERENCES approval_queue(id) ON DELETE SET NULL,
    patron_onayli BOOLEAN DEFAULT FALSE,
    onay_tarihi TIMESTAMP WITH TIME ZONE,

    -- Git Bilgileri
    commit_hash VARCHAR(40),
    commit_mesaji TEXT,
    branch VARCHAR(100) DEFAULT 'main',

    -- Sonuç
    durum VARCHAR(20) DEFAULT 'basarili' CHECK (durum IN (
        'bekliyor',
        'basarili',
        'basarisiz',
        'geri_alindi'
    )),
    hata_mesaji TEXT,
    deploy_url VARCHAR(500),

    -- Zaman
    baslangic_zamani TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    bitis_zamani TIMESTAMP WITH TIME ZONE,
    sure_saniye INTEGER,

    -- Zaman Damgaları
    olusturma_tarihi TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index'ler
CREATE INDEX IF NOT EXISTS idx_deploy_logs_tipi ON deploy_logs(deploy_tipi);
CREATE INDEX IF NOT EXISTS idx_deploy_logs_durum ON deploy_logs(durum);
CREATE INDEX IF NOT EXISTS idx_deploy_logs_tarih ON deploy_logs(olusturma_tarihi DESC);

-- ─────────────────────────────────────────────────────────────────────────────
-- 7. API_USAGE (API Kullanım Logları)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS api_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- API Bilgileri
    api_adi VARCHAR(50) NOT NULL CHECK (api_adi IN (
        'claude',
        'gpt4',
        'together',
        'gemini',
        'llama',
        'v0',
        'cursor'
    )),
    endpoint VARCHAR(255),

    -- Kullanım
    tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,
    robot_id UUID,

    -- Token/Maliyet
    input_tokens INTEGER DEFAULT 0,
    output_tokens INTEGER DEFAULT 0,
    toplam_tokens INTEGER DEFAULT 0,
    tahmini_maliyet DECIMAL(10,6) DEFAULT 0,
    para_birimi VARCHAR(3) DEFAULT 'USD',

    -- Performans
    yanit_suresi_ms INTEGER,
    basarili BOOLEAN DEFAULT TRUE,
    hata_mesaji TEXT,

    -- Dönem
    tarih DATE DEFAULT CURRENT_DATE,
    saat INTEGER,

    -- Zaman Damgaları
    olusturma_tarihi TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index'ler
CREATE INDEX IF NOT EXISTS idx_api_usage_api ON api_usage(api_adi);
CREATE INDEX IF NOT EXISTS idx_api_usage_tenant ON api_usage(tenant_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_tarih ON api_usage(tarih);

-- ─────────────────────────────────────────────────────────────────────────────
-- 8. TRIGGER FONKSİYONU VE TRIGGER'LAR
-- ─────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_guncelleme_tarihi()
RETURNS TRIGGER AS $$
BEGIN
    NEW.guncelleme_tarihi = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
    tablo TEXT;
BEGIN
    FOR tablo IN SELECT unnest(ARRAY[
        'approval_queue',
        'expenses',
        'franchises',
        'templates',
        'franchise_revenue'
    ])
    LOOP
        EXECUTE format(
            'DROP TRIGGER IF EXISTS trg_%s_guncelle ON %s;
             CREATE TRIGGER trg_%s_guncelle
             BEFORE UPDATE ON %s
             FOR EACH ROW
             EXECUTE PROCEDURE update_guncelleme_tarihi();',
            tablo, tablo, tablo, tablo
        );
    END LOOP;
END $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 9. VIEW'LAR (Patron Paneli için)
-- ─────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE VIEW v_patron_bekleyen_onaylar AS
SELECT
    id,
    talep_tipi,
    baslik,
    aciklama,
    talep_eden_robot,
    oncelik,
    olusturma_tarihi,
    EXTRACT(DAY FROM (NOW() - olusturma_tarihi))::INTEGER AS bekleyen_gun
FROM approval_queue
WHERE durum = 'bekliyor'
ORDER BY oncelik ASC, olusturma_tarihi ASC;

CREATE OR REPLACE VIEW v_patron_aylik_gelir AS
SELECT
    donem_yil,
    donem_ay,
    gelir_tipi,
    COUNT(*) AS islem_sayisi,
    SUM(brut_tutar) AS toplam_brut,
    SUM(net_tutar) AS toplam_net,
    para_birimi
FROM franchise_revenue
WHERE gizli = FALSE
GROUP BY donem_yil, donem_ay, gelir_tipi, para_birimi
ORDER BY donem_yil DESC, donem_ay DESC;

CREATE OR REPLACE VIEW v_patron_aylik_gider AS
SELECT
    donem_yil,
    donem_ay,
    kategori,
    COUNT(*) AS islem_sayisi,
    SUM(tutar) AS toplam_tutar,
    para_birimi
FROM expenses
WHERE gizli = FALSE
GROUP BY donem_yil, donem_ay, kategori, para_birimi
ORDER BY donem_yil DESC, donem_ay DESC;

CREATE OR REPLACE VIEW v_patron_franchise_ozet AS
SELECT
    durum,
    COUNT(*) AS franchise_sayisi,
    COALESCE(SUM(ogrenci_sayisi), 0) AS toplam_ogrenci,
    COALESCE(SUM(aylik_gelir), 0) AS toplam_aylik_gelir
FROM franchises
WHERE gizli = FALSE
GROUP BY durum;

-- Son Deploy'lar (son 20 kayıt)
CREATE OR REPLACE VIEW v_patron_son_deploylar AS
SELECT
    id,
    deploy_tipi,
    ortam,
    patron_onayli,
    commit_mesaji,
    durum,
    olusturma_tarihi
FROM deploy_logs
ORDER BY olusturma_tarihi DESC
LIMIT 20;

-- ─────────────────────────────────────────────────────────────────────────────
-- 10. ÖRNEK VERİLER (Şablon Havuzu)
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO templates (kategori, ad, slug, aciklama, fiyat_tipi, fiyat) VALUES
('grafik_premium', 'Radar Grafik (Genel Yetenek)', 'radar-genel-yetenek', 'Sporcunun tüm yeteneklerini gösteren radar grafik', 'premium', 150),
('grafik_premium', 'Büyüme Trend Grafiği', 'buyume-trend', 'Boy-kilo gelişim trendi', 'premium', 150),
('grafik_premium', 'Branş Uygunluk Haritası', 'brans-uygunluk', 'Hangi branşa yatkın analizi', 'premium', 200),
('grafik_premium', 'Risk Analiz Grafiği', 'risk-analiz', 'Sakatlık ve aşırı yük risk analizi', 'premium', 175),
('grafik_premium', 'Karşılaştırmalı Gelişim', 'karsilastirmali-gelisim', 'Yaş grubu ortalamasıyla karşılaştırma', 'premium', 175),
('grafik_premium', 'Motor Beceri Haritası', 'motor-beceri', 'Koordinasyon, denge, çeviklik haritası', 'premium', 150),
('grafik_premium', 'Postür Analiz Görseli', 'postur-analiz', 'Duruş analizi ve öneriler', 'premium', 200),
('grafik_premium', 'PHV Takip Grafiği', 'phv-takip', 'Büyüme zirvesi takibi', 'premium', 200),
('grafik_premium', 'Performans Projeksiyon', 'performans-projeksiyon', '6-12 ay sonrası tahmin', 'premium', 200),
('grafik_premium', 'Kapsamlı Değerlendirme Raporu', 'kapsamli-degerlendirme', 'Tüm parametrelerin özet raporu', 'premium', 250),
('grafik_standart', 'Boy-Kilo Grafiği', 'boy-kilo', 'Temel fiziksel ölçümler', 'standart', 75),
('grafik_standart', 'Esneklik Grafiği', 'esneklik', 'Esneklik ölçüm sonuçları', 'standart', 75),
('grafik_standart', 'Kuvvet Grafiği', 'kuvvet', 'Kuvvet test sonuçları', 'standart', 75),
('grafik_standart', 'Denge Grafiği', 'denge', 'Denge test sonuçları', 'standart', 75),
('grafik_standart', 'Koordinasyon Grafiği', 'koordinasyon', 'Koordinasyon değerlendirmesi', 'standart', 75),
('grafik_standart', 'Dayanıklılık Grafiği', 'dayaniklilik', 'Kardiyovasküler dayanıklılık', 'standart', 75),
('grafik_standart', 'Sürat Grafiği', 'surat', 'Hız ve çabukluk testleri', 'standart', 75),
('grafik_standart', 'Devam Grafiği', 'devam', 'Devamsızlık analizi', 'standart', 75),
('grafik_standart', 'Haftalık Özet', 'haftalik-ozet', 'Haftalık performans özeti', 'standart', 75),
('grafik_standart', 'Aylık Özet', 'aylik-ozet', 'Aylık performans özeti', 'standart', 100)
ON CONFLICT (slug) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- 11. RLS
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE approval_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE franchises ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE franchise_revenue ENABLE ROW LEVEL SECURITY;
ALTER TABLE deploy_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────────────────────────────────────────
-- 12. DOĞRULAMA
-- ─────────────────────────────────────────────────────────────────────────────

SELECT
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns c
     WHERE c.table_name = t.table_name AND c.table_schema = 'public') AS kolon_sayisi
FROM information_schema.tables t
WHERE table_schema = 'public'
AND table_name IN (
    'approval_queue',
    'expenses',
    'franchises',
    'templates',
    'franchise_revenue',
    'deploy_logs',
    'api_usage'
)
ORDER BY table_name;

-- ═══════════════════════════════════════════════════════════════════════════════════════
-- YİSA-S v2.1 PATRON/OPERASYON TABLOLARI KURULUMU TAMAMLANDI
-- ═══════════════════════════════════════════════════════════════════════════════════════
