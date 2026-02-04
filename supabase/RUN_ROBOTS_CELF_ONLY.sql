-- YİSA-S Robots + CELF Directorates (role_permissions YISA-S_TUM ile çakışmasın diye ayrı)
-- YISA-S_TUM_TABLOLAR_TEK_SQL sonrası çalıştırılır.

CREATE TABLE IF NOT EXISTS robots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kod VARCHAR(50) UNIQUE NOT NULL,
  isim VARCHAR(255) NOT NULL,
  hiyerarsi_sirasi INTEGER NOT NULL DEFAULT 0,
  aciklama TEXT,
  ai_model VARCHAR(50),
  durum VARCHAR(20) DEFAULT 'aktif' CHECK (durum IN ('aktif', 'pasif')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_robots_kod ON robots(kod);
ALTER TABLE robots ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service can manage robots" ON robots;
CREATE POLICY "Service can manage robots" ON robots FOR ALL USING (true);

CREATE TABLE IF NOT EXISTS celf_directorates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kod VARCHAR(50) UNIQUE NOT NULL,
  isim VARCHAR(100) NOT NULL,
  tam_isim VARCHAR(255),
  aciklama TEXT,
  sorumluluk_alanlari JSONB DEFAULT '[]'::jsonb,
  sira INTEGER NOT NULL DEFAULT 0,
  ana_robot_id UUID REFERENCES robots(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_celf_directorates_kod ON celf_directorates(kod);
ALTER TABLE celf_directorates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service can manage celf_directorates" ON celf_directorates;
CREATE POLICY "Service can manage celf_directorates" ON celf_directorates FOR ALL USING (true);

INSERT INTO robots (kod, isim, hiyerarsi_sirasi, aciklama, ai_model, durum)
VALUES
  ('ROB-PATRON', 'Patron Asistanı', 1, 'Claude + GPT + Gemini + Together + V0 + Cursor', 'multi', 'aktif'),
  ('ROB-CIO', 'CIO Robot', 2, 'Strateji Beyin - Komut yorumlama', 'claude', 'aktif'),
  ('ROB-SIBER', 'Siber Güvenlik', 3, '3 Duvar sistemi', NULL, 'aktif'),
  ('ROB-ARSIV', 'Veri Arşivleme', 4, 'Yedekleme, şablon kütüphanesi', NULL, 'aktif'),
  ('ROB-CEO', 'CEO Organizatör', 5, 'Görev dağıtımı', NULL, 'aktif'),
  ('ROB-CELF', 'CELF Merkez', 6, '12 Direktörlük havuzu', 'multi', 'aktif'),
  ('ROB-COO', 'COO Yardımcı', 7, 'Operasyon koordinasyonu', 'gemini', 'aktif'),
  ('ROB-VITRIN', 'YİSA-S Vitrin', 8, 'Franchise hizmetleri', 'gemini', 'aktif')
ON CONFLICT (kod) DO UPDATE SET isim=EXCLUDED.isim, aciklama=EXCLUDED.aciklama, ai_model=EXCLUDED.ai_model, durum=EXCLUDED.durum;

INSERT INTO celf_directorates (kod, isim, tam_isim, aciklama, sorumluluk_alanlari, sira)
VALUES
  ('CFO', 'CFO', 'Chief Financial Officer', 'Finans yönetimi', '["finans","butce","gelir","gider"]'::jsonb, 1),
  ('CTO', 'CTO', 'Chief Technology Officer', 'Teknoloji yönetimi', '["sistem","kod","api"]'::jsonb, 2),
  ('CIO', 'CIO', 'Chief Information Officer', 'Bilgi sistemleri', '["veri","database","entegrasyon"]'::jsonb, 3),
  ('CMO', 'CMO', 'Chief Marketing Officer', 'Pazarlama', '["kampanya","reklam","sosyal_medya"]'::jsonb, 4),
  ('CHRO', 'CHRO', 'Chief Human Resources Officer', 'İnsan kaynakları', '["personel","egitim","performans"]'::jsonb, 5),
  ('CLO', 'CLO', 'Chief Legal Officer', 'Hukuk, KVKK', '["sozlesme","patent","uyum","kvkk"]'::jsonb, 6),
  ('CSO_SATIS', 'CSO-Satış', 'Chief Sales Officer', 'Satış, CRM', '["musteri","siparis","crm"]'::jsonb, 7),
  ('CPO', 'CPO', 'Chief Product Officer', 'Ürün, tasarım', '["sablon","tasarim","ui"]'::jsonb, 8),
  ('CDO', 'CDO', 'Chief Data Officer', 'Veri analizi', '["analiz","rapor","dashboard"]'::jsonb, 9),
  ('CISO', 'CISO', 'Chief Information Security Officer', 'Bilgi güvenliği', '["guvenlik","audit","erisim"]'::jsonb, 10),
  ('CCO', 'CCO', 'Chief Customer Officer', 'Müşteri deneyimi', '["destek","sikayet","memnuniyet"]'::jsonb, 11),
  ('CSO_STRATEJI', 'CSO-Strateji', 'Chief Strategy Officer', 'Strateji, plan', '["plan","hedef","strateji"]'::jsonb, 12),
  ('CSPO', 'CSPO', 'Chief Sports Officer', 'Spor yönetimi', '["antrenman","hareket","sporcu","program"]'::jsonb, 13),
  ('COO', 'COO', 'Chief Operating Officer', 'Operasyon', '["operasyon","surec","deploy"]'::jsonb, 14),
  ('RND', 'RND', 'AR-GE', 'Araştırma geliştirme', '["ar-ge","inovasyon"]'::jsonb, 15)
ON CONFLICT (kod) DO UPDATE SET isim=EXCLUDED.isim, tam_isim=EXCLUDED.tam_isim, aciklama=EXCLUDED.aciklama, sorumluluk_alanlari=EXCLUDED.sorumluluk_alanlari, sira=EXCLUDED.sira;

UPDATE celf_directorates SET ana_robot_id = (SELECT id FROM robots WHERE kod = 'ROB-CELF') WHERE ana_robot_id IS NULL;

CREATE TABLE IF NOT EXISTS core_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kural_no INTEGER NOT NULL,
  kural_kodu VARCHAR(50) UNIQUE NOT NULL,
  baslik VARCHAR(255) NOT NULL,
  aciklama TEXT,
  kategori VARCHAR(50),
  zorunlu BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_core_rules_kural_kodu ON core_rules(kural_kodu);
ALTER TABLE core_rules ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service can manage core_rules" ON core_rules;
CREATE POLICY "Service can manage core_rules" ON core_rules FOR ALL USING (true);

INSERT INTO core_rules (kural_no, kural_kodu, baslik, aciklama, kategori, zorunlu)
VALUES
  (1, 'KURAL-1', 'Hiyerarşi Koruma', 'Katman 0-7 hiyerarşisi değiştirilemez', 'hiyerarsi', true),
  (2, 'KURAL-2', 'Patron Onayı', 'Deploy, commit, fiyat Patron onayı gerektirir', 'onay', true),
  (3, 'KURAL-3', 'Veri Silme Yasağı', 'AI audit_log, core_rules silemez', 'veri', true),
  (4, 'KURAL-4', 'RLS Zorunluluğu', 'Tenant izolasyonu aktif', 'guvenlik', true),
  (5, 'KURAL-5', 'Token Limiti', 'Günlük token limiti aşılamaz', 'maliyet', true),
  (6, 'KURAL-6', 'Yasak Bölgeler', 'AI .env, API_KEY erişemez', 'guvenlik', true),
  (7, 'KURAL-7', 'Franchise İzolasyonu', 'Franchise veri erişemez', 'veri', true)
ON CONFLICT (kural_kodu) DO UPDATE SET baslik=EXCLUDED.baslik, aciklama=EXCLUDED.aciklama, kategori=EXCLUDED.kategori, zorunlu=EXCLUDED.zorunlu;

CREATE TABLE IF NOT EXISTS cio_analysis_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ceo_task_id UUID,
  command TEXT NOT NULL,
  task_type VARCHAR(50),
  classification VARCHAR(20) CHECK (classification IN ('company', 'private', 'unclear')),
  primary_director VARCHAR(20),
  target_directors JSONB DEFAULT '[]'::jsonb,
  priority VARCHAR(20) CHECK (priority IN ('critical', 'high', 'medium', 'low')),
  is_routine BOOLEAN DEFAULT FALSE,
  estimated_token_cost INTEGER DEFAULT 0,
  strategy_notes JSONB DEFAULT '[]'::jsonb,
  conflict_warnings JSONB DEFAULT '[]'::jsonb,
  work_order_id VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_cio_analysis_ceo_task ON cio_analysis_logs(ceo_task_id);
ALTER TABLE cio_analysis_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "cio_analysis_logs_service" ON cio_analysis_logs;
CREATE POLICY "cio_analysis_logs_service" ON cio_analysis_logs FOR ALL USING (true);
