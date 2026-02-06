-- ═══════════════════════════════════════════════════════════════
-- YİSA-S Robot İş Üretim Sistemi — V3.0 Mimari
-- Tarih: 6 Şubat 2026
-- Akış: CELF üretir → CEO Havuzu → Patron onaylar → Mağaza/Deploy
-- ═══════════════════════════════════════════════════════════════

-- 1. robot_jobs: Ana iş tablosu — tüm üretilen işleri tek yerde izler
CREATE TABLE IF NOT EXISTS robot_jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_no TEXT NOT NULL,

  -- Kim üretti
  source_robot TEXT NOT NULL DEFAULT 'CELF',       -- CELF, CEO, SECURITY, DATA, YISAS
  director_key TEXT,                                -- CFO, CTO, CMO, CHRO, CLO, CSO, CDO, CISO, CCO, CPO, CIO, SPORTIF
  ai_provider TEXT,                                 -- GPT, CLAUDE, GEMINI, TOGETHER, V0, CURSOR

  -- İş tanımı
  title TEXT NOT NULL,
  description TEXT,
  job_type TEXT NOT NULL DEFAULT 'general',         -- logo, tasarim, video, belge, sablon, robot, antrenman, rapor, kampanya, general
  content_type TEXT DEFAULT 'text',                 -- text, image, video, code, template, robot_config, report
  priority TEXT NOT NULL DEFAULT 'normal',          -- low, normal, high, critical

  -- Üretilen içerik
  output_data JSONB DEFAULT '{}',                   -- AI çıktısı, dosya URL'leri, şablon verileri
  output_preview TEXT,                              -- Kısa önizleme metni
  attachments JSONB DEFAULT '[]',                   -- [{url, type, name}]
  version INTEGER DEFAULT 1,                        -- Versiyon numarası (düzeltme sonrası artar)

  -- Durum makinesi
  status TEXT NOT NULL DEFAULT 'producing',
    -- producing: CELF üretiyor
    -- celf_review: Claude denetliyor
    -- ceo_pool: CEO havuzunda (10'a Çıkart) — patron görüyor
    -- approved: Patron onayladı
    -- rejected: Patron reddetti → CELF'e geri
    -- correction: Düzeltme notu ile CELF'e geri gönderildi
    -- deploying: Deploy/yayın sürecinde
    -- published: Mağazaya/vitrine yayınlandı
    -- archived: Arşivlendi

  -- Patron kararı
  patron_decision TEXT,                             -- approved, rejected, correction
  patron_notes TEXT,                                -- Patron'un düzeltme/onay notu
  patron_decision_at TIMESTAMPTZ,

  -- Mağaza bilgileri (onay sonrası)
  store_published BOOLEAN DEFAULT FALSE,
  store_category TEXT,                              -- sablon, robot, paket, icerik
  store_price_cents INTEGER,                        -- Fiyat (kuruş cinsinden)
  store_published_at TIMESTAMPTZ,

  -- Tenant hedefi (varsa)
  tenant_id UUID REFERENCES tenants(id),
  target_audience TEXT DEFAULT 'all',               -- all, franchise, veli, antrenor, patron

  -- İzleme
  token_cost INTEGER DEFAULT 0,                     -- Harcanan token
  iteration_count INTEGER DEFAULT 1,                -- Kaç kez düzeltme yapıldı
  parent_job_id UUID REFERENCES robot_jobs(id),     -- Düzeltme sonrası yeni versiyon → önceki işe referans

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_robot_jobs_status ON robot_jobs(status);
CREATE INDEX IF NOT EXISTS idx_robot_jobs_ticket ON robot_jobs(ticket_no);
CREATE INDEX IF NOT EXISTS idx_robot_jobs_source ON robot_jobs(source_robot);
CREATE INDEX IF NOT EXISTS idx_robot_jobs_director ON robot_jobs(director_key);
CREATE INDEX IF NOT EXISTS idx_robot_jobs_tenant ON robot_jobs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_robot_jobs_store ON robot_jobs(store_published) WHERE store_published = TRUE;
CREATE INDEX IF NOT EXISTS idx_robot_jobs_ceo_pool ON robot_jobs(status) WHERE status = 'ceo_pool';

-- 2. tenant_robots: Tenant'a dağıtılan işletme robotları
CREATE TABLE IF NOT EXISTS tenant_robots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,

  robot_type TEXT NOT NULL,                         -- muhasebe, sosyal_medya, antrenor, satis, ik, iletisim
  robot_name TEXT NOT NULL,                         -- Görünen isim
  system_prompt TEXT NOT NULL,                      -- Robot'un kısıtlı system prompt'u
  capabilities JSONB DEFAULT '[]',                  -- ["kasa_defteri", "odeme_takibi", ...]
  boundaries JSONB DEFAULT '[]',                    -- ["sadece_finans", "silme_yasak", ...]
  ai_provider TEXT DEFAULT 'GPT',                   -- Hangi AI kullanacak
  token_limit INTEGER DEFAULT 5000,                 -- Günlük token limiti
  token_used INTEGER DEFAULT 0,                     -- Bugün kullanılan token

  is_active BOOLEAN DEFAULT TRUE,
  installed_at TIMESTAMPTZ DEFAULT NOW(),
  last_active_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tenant_robots_tenant ON tenant_robots(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_robots_type ON tenant_robots(robot_type);
CREATE UNIQUE INDEX IF NOT EXISTS idx_tenant_robots_unique ON tenant_robots(tenant_id, robot_type);

-- 3. store_products: Mağaza ürünleri (onaylanan işlerden oluşur)
CREATE TABLE IF NOT EXISTS store_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES robot_jobs(id),            -- Hangi iş'ten türetildi

  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,                            -- sablon, robot, paket, icerik, hizmet
  subcategory TEXT,                                  -- logo, web_sitesi, sosyal_medya, muhasebe_robotu, vb.

  price_cents INTEGER NOT NULL DEFAULT 0,            -- 0 = ücretsiz
  currency TEXT DEFAULT 'USD',
  is_free BOOLEAN DEFAULT FALSE,

  -- Paket içeriği
  includes JSONB DEFAULT '[]',                       -- ["web_sitesi", "logo", "sosyal_medya_robotu"]
  robot_configs JSONB DEFAULT '[]',                  -- Paket içindeki robot yapılandırmaları

  -- Görsel
  thumbnail_url TEXT,
  preview_urls JSONB DEFAULT '[]',
  demo_available BOOLEAN DEFAULT FALSE,

  -- İstatistik
  view_count INTEGER DEFAULT 0,
  purchase_count INTEGER DEFAULT 0,
  demo_request_count INTEGER DEFAULT 0,

  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_store_products_category ON store_products(category);
CREATE INDEX IF NOT EXISTS idx_store_products_active ON store_products(is_active) WHERE is_active = TRUE;

-- 4. store_orders: Mağaza siparişleri
CREATE TABLE IF NOT EXISTS store_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id),
  product_id UUID REFERENCES store_products(id),

  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,

  status TEXT NOT NULL DEFAULT 'pending',             -- pending, paid, setup, active, cancelled
  amount_cents INTEGER NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  payment_method TEXT,                                -- stripe, iyzico, manual
  payment_ref TEXT,                                   -- Ödeme referans numarası

  -- Sipariş sonrası otomatik setup
  setup_started_at TIMESTAMPTZ,
  setup_completed_at TIMESTAMPTZ,
  robots_installed JSONB DEFAULT '[]',                -- Hangi robotlar kuruldu

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_store_orders_tenant ON store_orders(tenant_id);
CREATE INDEX IF NOT EXISTS idx_store_orders_status ON store_orders(status);

-- 5. robot_job_logs: İş akış günlüğü (her adım kaydedilir)
CREATE TABLE IF NOT EXISTS robot_job_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES robot_jobs(id) ON DELETE CASCADE,

  action TEXT NOT NULL,                               -- created, celf_started, celf_completed, claude_reviewed, sent_to_ceo, patron_viewed, approved, rejected, correction_sent, deploying, published, archived
  actor TEXT NOT NULL,                                -- CELF, CEO, PATRON, SECURITY, SYSTEM
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_robot_job_logs_job ON robot_job_logs(job_id);
CREATE INDEX IF NOT EXISTS idx_robot_job_logs_action ON robot_job_logs(action);

-- 6. directorate_prompts: Her direktörlüğün system prompt'u (V3.0 Bölüm 4.2)
CREATE TABLE IF NOT EXISTS directorate_prompts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  director_key TEXT NOT NULL UNIQUE,
  director_name TEXT NOT NULL,
  system_prompt TEXT NOT NULL,
  producer_ai TEXT NOT NULL DEFAULT 'GPT',            -- Üretici AI
  reviewer_ai TEXT NOT NULL DEFAULT 'CLAUDE',         -- Denetçi AI (her zaman Claude)
  boundaries JSONB DEFAULT '[]',                      -- Sınırlar
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Direktörlük prompt'larını seed et
INSERT INTO directorate_prompts (director_key, director_name, system_prompt, producer_ai, reviewer_ai, boundaries) VALUES
('CFO', 'Finans Direktörlüğü',
 'Sen YİSA-S Finans Direktörüsün (CFO). Sadece muhasebe, bütçe, kasa, token ekonomisi, maliyet analizi ve ödeme takibi konularında çalışırsın. Başka konularda yorum yapma, yönlendir. Türkçe, net ve profesyonel yanıt ver.',
 'GPT', 'CLAUDE', '["sadece_finans", "fiyat_degisikligi_onay_gerekir", "silme_yasak"]'),
('CTO', 'Teknoloji Direktörlüğü',
 'Sen YİSA-S Teknoloji Direktörüsün (CTO). Sadece yazılım geliştirme, API, sistem mimarisi ve deployment konularında çalışırsın. Kod üret, teknik çözüm sun. Deploy ve commit için patron onayı zorunlu.',
 'CURSOR', 'CLAUDE', '["sadece_teknoloji", "deploy_onay_gerekir", "env_erisim_yasak"]'),
('CMO', 'Pazarlama Direktörlüğü',
 'Sen YİSA-S Pazarlama Direktörüsün (CMO). Sadece reklam, kampanya, sosyal medya stratejisi ve marka konularında çalışırsın. Yaratıcı ve etkili içerik üret.',
 'GPT', 'CLAUDE', '["sadece_pazarlama", "marka_degisikligi_onay_gerekir"]'),
('CHRO', 'İnsan Kaynakları Direktörlüğü',
 'Sen YİSA-S İnsan Kaynakları Direktörüsün (CHRO). Sadece personel yönetimi, işe alım, performans değerlendirme ve rol dağıtımı konularında çalışırsın.',
 'GPT', 'CLAUDE', '["sadece_ik", "isten_cikarma_onay_gerekir", "maas_bilgisi_korumali"]'),
('CLO', 'Hukuk Direktörlüğü',
 'Sen YİSA-S Hukuk Direktörüsün (CLO). Sadece KVKK, sözleşmeler, franchise anlaşmaları ve yasal uyumluluk konularında çalışırsın. Riskli işlemlerde veto hakkın var.',
 'CLAUDE', 'CLAUDE', '["sadece_hukuk", "veto_hakki_var", "sozlesme_degisikligi_onay_gerekir"]'),
('CSO', 'Strateji Direktörlüğü',
 'Sen YİSA-S Strateji Direktörüsün (CSO). Sadece iş stratejisi, büyüme planı, pazar analizi ve rekabet konularında çalışırsın.',
 'CLAUDE', 'CLAUDE', '["sadece_strateji"]'),
('CDO', 'Tasarım Direktörlüğü',
 'Sen YİSA-S Tasarım Direktörüsün (CDO). Sadece UI/UX, görsel içerik, logo, video, grafik ve şablon tasarımı konularında çalışırsın.',
 'V0', 'CLAUDE', '["sadece_tasarim"]'),
('CISO', 'Bilgi Güvenliği Direktörlüğü',
 'Sen YİSA-S Bilgi Güvenliği Direktörüsün (CISO). Sadece siber güvenlik politikaları, erişim kontrol, şifreleme ve güvenlik denetimi konularında çalışırsın.',
 'CLAUDE', 'CLAUDE', '["sadece_guvenlik", "erisim_kontrol"]'),
('CCO', 'İletişim Direktörlüğü',
 'Sen YİSA-S İletişim Direktörüsün (CCO). Sadece müşteri iletişimi, WhatsApp, e-posta, bildirimler ve destek konularında çalışırsın.',
 'GEMINI', 'CLAUDE', '["sadece_iletisim"]'),
('CPO', 'Ürün Direktörlüğü',
 'Sen YİSA-S Ürün Direktörüsün (CPO). Sadece ürün geliştirme, şablon oluşturma, paket tasarımı ve yeni özellik konularında çalışırsın.',
 'GPT', 'CLAUDE', '["sadece_urun", "sablon_silme_onay_gerekir"]'),
('CIO', 'Bilgi İşlem Direktörlüğü',
 'Sen YİSA-S Bilgi İşlem Direktörüsün (CIO). Sadece veri analizi, raporlama, dashboard, istatistik ve AI model yönetimi konularında çalışırsın.',
 'TOGETHER', 'CLAUDE', '["sadece_bilgi_islem"]'),
('SPORTIF', 'Sportif Direktörlük',
 'Sen YİSA-S Sportif Direktörüsün. Sadece antrenman programları, çocuk gelişim takibi, ölçüm, branş yönlendirme konularında çalışırsın. Çocuk ham verisi açıklamazsın, sadece yorumlanmış öneri sunarsın. 15 uzman bilgi tabanına sahipsin.',
 'CLAUDE', 'CLAUDE', '["sadece_sportif", "cocuk_ham_veri_yasak", "ortopedik_uyari_bildir"]')
ON CONFLICT (director_key) DO NOTHING;

-- updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOREACH tbl IN ARRAY ARRAY['robot_jobs', 'tenant_robots', 'store_products', 'store_orders', 'directorate_prompts']
  LOOP
    EXECUTE format(
      'DROP TRIGGER IF EXISTS trg_%s_updated_at ON %I; CREATE TRIGGER trg_%s_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION update_updated_at();',
      tbl, tbl, tbl, tbl
    );
  END LOOP;
END $$;

-- RLS Politikaları
ALTER TABLE robot_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_robots ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE robot_job_logs ENABLE ROW LEVEL SECURITY;

-- Service role her şeye erişebilir
CREATE POLICY "service_role_robot_jobs" ON robot_jobs FOR ALL TO service_role USING (TRUE);
CREATE POLICY "service_role_tenant_robots" ON tenant_robots FOR ALL TO service_role USING (TRUE);
CREATE POLICY "service_role_store_products" ON store_products FOR ALL TO service_role USING (TRUE);
CREATE POLICY "service_role_store_orders" ON store_orders FOR ALL TO service_role USING (TRUE);
CREATE POLICY "service_role_robot_job_logs" ON robot_job_logs FOR ALL TO service_role USING (TRUE);

-- Mağaza ürünleri herkes görebilir (aktif olanlar)
CREATE POLICY "public_store_products" ON store_products FOR SELECT TO anon USING (is_active = TRUE);

-- Tenant kendi robotlarını görebilir
CREATE POLICY "tenant_own_robots" ON tenant_robots FOR SELECT TO authenticated
  USING (tenant_id IN (SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid()));

-- Tenant kendi siparişlerini görebilir
CREATE POLICY "tenant_own_orders" ON store_orders FOR SELECT TO authenticated
  USING (tenant_id IN (SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid()));
