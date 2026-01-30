-- ═══════════════════════════════════════════════════════════════════════════════════════
-- YİSA-S TÜM TABLOLAR — TEK SCRIPT (27 DOSYANIN VERİTABANI ÖZETİ)
-- Supabase SQL Editor'da bu dosyanın tamamını yapıştırıp Run ile tek seferde çalıştırın.
-- Bu script şunları kapsar:
--   • Onay bekleyen işler: patron_commands, approval_queue, v_patron_bekleyen_onaylar
--   • Kullanıcı rolleri: role_permissions (KULLANICI_ROLLERI_SISTEM_ONERILERI)
--   • Patron / franchise ayrımı: tenants, franchises, approval_queue talep_tipi
--   • CELF/COO kuralları: director_rules, coo_rules (kural değişikliği Patron onayı)
--   • CELF maliyet + satış: celf_cost_reports, patron_sales_prices
--   • Chat, CEO, CELF log, robot, v2.1 operasyon (expenses, deploy_logs, api_usage, vb.)
-- Sıra: Patron/Chat/CEO → CELF/CEO merkez → Robot → v2.1 Operasyon → Maliyet/Satış → COO → Roller
-- Tarih: 30 Ocak 2026
-- ═══════════════════════════════════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════════════════════════════════
-- BÖLÜM 1: PATRON KOMUTU - CHAT, CEO, CELF, ONAY TABLOLARI
-- ═══════════════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    ai_providers TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at DESC);
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can read own chat_messages" ON chat_messages;
CREATE POLICY "Users can read own chat_messages" ON chat_messages FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Service can insert chat_messages" ON chat_messages;
CREATE POLICY "Service can insert chat_messages" ON chat_messages FOR INSERT WITH CHECK (true);

CREATE TABLE IF NOT EXISTS patron_commands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    command TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'modified')),
    decision VARCHAR(20) CHECK (decision IN ('approve', 'reject', 'modify')),
    decision_at TIMESTAMP WITH TIME ZONE,
    modify_text TEXT,
    ceo_task_id UUID,
    output_payload JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_patron_commands_user_id ON patron_commands(user_id);
CREATE INDEX IF NOT EXISTS idx_patron_commands_status ON patron_commands(status);
CREATE INDEX IF NOT EXISTS idx_patron_commands_created_at ON patron_commands(created_at DESC);
ALTER TABLE patron_commands ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can read own patron_commands" ON patron_commands;
CREATE POLICY "Users can read own patron_commands" ON patron_commands FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Service can insert update patron_commands" ON patron_commands;
CREATE POLICY "Service can insert update patron_commands" ON patron_commands FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS ceo_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    task_description TEXT NOT NULL,
    task_type VARCHAR(50) NOT NULL,
    director_key VARCHAR(50),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'celf_running', 'completed', 'failed', 'cancelled')),
    result_payload JSONB DEFAULT '{}',
    patron_command_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ceo_tasks_user_id ON ceo_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_ceo_tasks_status ON ceo_tasks(status);
CREATE INDEX IF NOT EXISTS idx_ceo_tasks_task_type ON ceo_tasks(task_type);
CREATE INDEX IF NOT EXISTS idx_ceo_tasks_created_at ON ceo_tasks(created_at DESC);
ALTER TABLE ceo_tasks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can read own ceo_tasks" ON ceo_tasks;
CREATE POLICY "Users can read own ceo_tasks" ON ceo_tasks FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Service can manage ceo_tasks" ON ceo_tasks;
CREATE POLICY "Service can manage ceo_tasks" ON ceo_tasks FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS celf_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ceo_task_id UUID REFERENCES ceo_tasks(id) ON DELETE SET NULL,
    director_key VARCHAR(50) NOT NULL,
    action VARCHAR(100),
    input_summary TEXT,
    output_summary TEXT,
    payload JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_celf_logs_ceo_task_id ON celf_logs(ceo_task_id);
CREATE INDEX IF NOT EXISTS idx_celf_logs_director_key ON celf_logs(director_key);
CREATE INDEX IF NOT EXISTS idx_celf_logs_created_at ON celf_logs(created_at DESC);
ALTER TABLE celf_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service can manage celf_logs" ON celf_logs;
CREATE POLICY "Service can manage celf_logs" ON celf_logs FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50),
    entity_id UUID,
    user_id UUID,
    payload JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_audit_log_action ON audit_log(action);
CREATE INDEX IF NOT EXISTS idx_audit_log_entity ON audit_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log(created_at DESC);
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service can insert audit_log" ON audit_log;
CREATE POLICY "Service can insert audit_log" ON audit_log FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Users can read own audit_log" ON audit_log;
CREATE POLICY "Users can read own audit_log" ON audit_log FOR SELECT USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION update_patron_commands_updated_at()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS trg_patron_commands_updated ON patron_commands;
CREATE TRIGGER trg_patron_commands_updated BEFORE UPDATE ON patron_commands FOR EACH ROW EXECUTE PROCEDURE update_patron_commands_updated_at();
DROP TRIGGER IF EXISTS trg_ceo_tasks_updated ON ceo_tasks;
CREATE TRIGGER trg_ceo_tasks_updated BEFORE UPDATE ON ceo_tasks FOR EACH ROW EXECUTE PROCEDURE update_patron_commands_updated_at();

-- ═══════════════════════════════════════════════════════════════════════════════════════
-- BÖLÜM 2: CELF İÇ DENETİM + CEO MERKEZ (patron_private_tasks, director_rules, ceo_routines, ...)
-- ═══════════════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS patron_private_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patron_id UUID NOT NULL,
  task_type TEXT,
  command TEXT NOT NULL,
  result TEXT,
  ai_providers TEXT[] DEFAULT '{}',
  is_private BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_patron_private_tasks_patron_id ON patron_private_tasks(patron_id);
CREATE INDEX IF NOT EXISTS idx_patron_private_tasks_created_at ON patron_private_tasks(created_at DESC);
ALTER TABLE patron_private_tasks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can read own patron_private_tasks" ON patron_private_tasks;
CREATE POLICY "Users can read own patron_private_tasks" ON patron_private_tasks FOR SELECT USING (auth.uid() = patron_id);
DROP POLICY IF EXISTS "Service can manage patron_private_tasks" ON patron_private_tasks;
CREATE POLICY "Service can manage patron_private_tasks" ON patron_private_tasks FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS celf_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID,
  director_key TEXT NOT NULL,
  check_type TEXT NOT NULL CHECK (check_type IN ('data_access', 'protection', 'approval', 'veto')),
  check_result TEXT NOT NULL CHECK (check_result IN ('passed', 'failed', 'warning')),
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_celf_audit_logs_task_id ON celf_audit_logs(task_id);
CREATE INDEX IF NOT EXISTS idx_celf_audit_logs_director_key ON celf_audit_logs(director_key);
CREATE INDEX IF NOT EXISTS idx_celf_audit_logs_created_at ON celf_audit_logs(created_at DESC);
ALTER TABLE celf_audit_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service can manage celf_audit_logs" ON celf_audit_logs;
CREATE POLICY "Service can manage celf_audit_logs" ON celf_audit_logs FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS director_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  director_key TEXT UNIQUE NOT NULL,
  data_access TEXT[] DEFAULT '{}',
  read_only TEXT[] DEFAULT '{}',
  protected_data TEXT[] DEFAULT '{}',
  requires_approval TEXT[] DEFAULT '{}',
  has_veto BOOLEAN DEFAULT false,
  ai_providers TEXT[] DEFAULT '{}',
  triggers TEXT[] DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_director_rules_director_key ON director_rules(director_key);
ALTER TABLE director_rules ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service can manage director_rules" ON director_rules;
CREATE POLICY "Service can manage director_rules" ON director_rules FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS ceo_routines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  routine_name TEXT NOT NULL,
  routine_type TEXT NOT NULL CHECK (routine_type IN ('rapor', 'kontrol', 'bildirim', 'sync')),
  director_key TEXT NOT NULL,
  command_template TEXT NOT NULL,
  data_sources TEXT[] DEFAULT '{}',
  schedule TEXT NOT NULL CHECK (schedule IN ('daily', 'weekly', 'monthly')),
  schedule_time TIME,
  is_active BOOLEAN DEFAULT true,
  last_result JSONB,
  last_run TIMESTAMPTZ,
  next_run TIMESTAMPTZ,
  created_by UUID,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ceo_routines_next_run ON ceo_routines(next_run) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_ceo_routines_director_key ON ceo_routines(director_key);
ALTER TABLE ceo_routines ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service can manage ceo_routines" ON ceo_routines;
CREATE POLICY "Service can manage ceo_routines" ON ceo_routines FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS ceo_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_name TEXT NOT NULL,
  rule_type TEXT NOT NULL CHECK (rule_type IN ('validation', 'automation', 'restriction', 'notification')),
  applies_to TEXT[] DEFAULT '{}',
  condition JSONB NOT NULL,
  action JSONB NOT NULL,
  priority INTEGER DEFAULT 5,
  is_active BOOLEAN DEFAULT true,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ceo_rules_rule_type ON ceo_rules(rule_type);
ALTER TABLE ceo_rules ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service can manage ceo_rules" ON ceo_rules;
CREATE POLICY "Service can manage ceo_rules" ON ceo_rules FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS ceo_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_name TEXT NOT NULL,
  template_type TEXT NOT NULL CHECK (template_type IN ('rapor', 'dashboard', 'ui', 'email', 'bildirim')),
  director_key TEXT,
  content JSONB NOT NULL,
  variables TEXT[] DEFAULT '{}',
  data_sources TEXT[] DEFAULT '{}',
  is_approved BOOLEAN DEFAULT false,
  approved_by UUID,
  approved_at TIMESTAMPTZ,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ceo_templates_template_type ON ceo_templates(template_type);
ALTER TABLE ceo_templates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service can manage ceo_templates" ON ceo_templates;
CREATE POLICY "Service can manage ceo_templates" ON ceo_templates FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS ceo_approved_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL,
  task_type TEXT NOT NULL,
  director_key TEXT NOT NULL,
  original_command TEXT NOT NULL,
  final_result JSONB,
  data_used TEXT[] DEFAULT '{}',
  data_changed TEXT[] DEFAULT '{}',
  approved_by UUID,
  approved_at TIMESTAMPTZ DEFAULT NOW(),
  can_become_routine BOOLEAN DEFAULT true,
  became_routine_id UUID
);
CREATE INDEX IF NOT EXISTS idx_ceo_approved_tasks_task_id ON ceo_approved_tasks(task_id);
CREATE INDEX IF NOT EXISTS idx_ceo_approved_tasks_approved_at ON ceo_approved_tasks(approved_at DESC);
ALTER TABLE ceo_approved_tasks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service can manage ceo_approved_tasks" ON ceo_approved_tasks;
CREATE POLICY "Service can manage ceo_approved_tasks" ON ceo_approved_tasks FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS ceo_franchise_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  franchise_id UUID NOT NULL,
  data_type TEXT NOT NULL,
  data_value JSONB NOT NULL,
  period TEXT,
  reported_at TIMESTAMPTZ DEFAULT NOW(),
  synced_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ceo_franchise_data_franchise_id ON ceo_franchise_data(franchise_id);
CREATE INDEX IF NOT EXISTS idx_ceo_franchise_data_data_type ON ceo_franchise_data(data_type);
ALTER TABLE ceo_franchise_data ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service can manage ceo_franchise_data" ON ceo_franchise_data;
CREATE POLICY "Service can manage ceo_franchise_data" ON ceo_franchise_data FOR ALL USING (true) WITH CHECK (true);

-- ═══════════════════════════════════════════════════════════════════════════════════════
-- BÖLÜM 3: ROBOT SİSTEMİ (routine_tasks, task_results, security_logs)
-- ═══════════════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS routine_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_type TEXT NOT NULL,
  director_key TEXT NOT NULL,
  command TEXT NOT NULL,
  schedule TEXT NOT NULL CHECK (schedule IN ('daily', 'weekly', 'monthly')),
  schedule_time TIME,
  last_run TIMESTAMPTZ,
  next_run TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_routine_tasks_next_run ON routine_tasks(next_run) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_routine_tasks_director_key ON routine_tasks(director_key);
CREATE INDEX IF NOT EXISTS idx_routine_tasks_created_at ON routine_tasks(created_at DESC);
ALTER TABLE routine_tasks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service can manage routine_tasks" ON routine_tasks;
CREATE POLICY "Service can manage routine_tasks" ON routine_tasks FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS task_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID,
  routine_task_id UUID REFERENCES routine_tasks(id) ON DELETE SET NULL,
  director_key TEXT,
  ai_providers TEXT[] DEFAULT '{}',
  input_command TEXT,
  output_result TEXT,
  status TEXT DEFAULT 'completed' CHECK (status IN ('completed', 'failed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_task_results_task_id ON task_results(task_id);
CREATE INDEX IF NOT EXISTS idx_task_results_routine_task_id ON task_results(routine_task_id);
CREATE INDEX IF NOT EXISTS idx_task_results_director_key ON task_results(director_key);
CREATE INDEX IF NOT EXISTS idx_task_results_created_at ON task_results(created_at DESC);
ALTER TABLE task_results ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service can manage task_results" ON task_results;
CREATE POLICY "Service can manage task_results" ON task_results FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS security_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('sari', 'turuncu', 'kirmizi', 'acil')),
  description TEXT,
  user_id UUID,
  ip_address TEXT,
  blocked BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_security_logs_severity ON security_logs(severity);
CREATE INDEX IF NOT EXISTS idx_security_logs_created_at ON security_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_security_logs_blocked ON security_logs(blocked) WHERE blocked = true;
ALTER TABLE security_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service can manage security_logs" ON security_logs;
CREATE POLICY "Service can manage security_logs" ON security_logs FOR ALL USING (true) WITH CHECK (true);

-- ═══════════════════════════════════════════════════════════════════════════════════════
-- BÖLÜM 4: v2.1 PATRON VE OPERASYON (tenants, approval_queue, expenses, franchises, ...)
-- ═══════════════════════════════════════════════════════════════════════════════════════

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

CREATE TABLE IF NOT EXISTS approval_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    talep_tipi VARCHAR(50) NOT NULL CHECK (talep_tipi IN ('yeni_ozellik', 'deploy', 'commit', 'fiyat_degisikligi', 'franchise_basvuru', 'modul_aktivasyon', 'kullanici_yetkisi', 'veri_silme', 'diger')),
    baslik VARCHAR(255) NOT NULL,
    aciklama TEXT,
    talep_eden_robot VARCHAR(50),
    talep_eden_direktörlük VARCHAR(50),
    tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,
    durum VARCHAR(20) DEFAULT 'bekliyor' CHECK (durum IN ('bekliyor', 'onaylandi', 'reddedildi', 'degistirildi')),
    patron_notu TEXT,
    karar_tarihi TIMESTAMP WITH TIME ZONE,
    oncelik INTEGER DEFAULT 3 CHECK (oncelik BETWEEN 1 AND 5),
    iliskili_tablo VARCHAR(100),
    iliskili_kayit_id UUID,
    payload JSONB DEFAULT '{}'::jsonb,
    olusturma_tarihi TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    guncelleme_tarihi TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_approval_queue_durum ON approval_queue(durum);
CREATE INDEX IF NOT EXISTS idx_approval_queue_talep_tipi ON approval_queue(talep_tipi);
CREATE INDEX IF NOT EXISTS idx_approval_queue_oncelik ON approval_queue(oncelik);
CREATE INDEX IF NOT EXISTS idx_approval_queue_tarih ON approval_queue(olusturma_tarihi DESC);

CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kategori VARCHAR(50) NOT NULL CHECK (kategori IN ('api_maliyeti', 'altyapi', 'hosting', 'depolama', 'lisans', 'operasyonel', 'personel', 'pazarlama', 'hukuk', 'diger')),
    alt_kategori VARCHAR(100),
    aciklama TEXT NOT NULL,
    tutar DECIMAL(12,2) NOT NULL,
    para_birimi VARCHAR(3) DEFAULT 'USD',
    fatura_no VARCHAR(50),
    fatura_tarihi DATE,
    odeme_durumu VARCHAR(20) DEFAULT 'bekliyor' CHECK (odeme_durumu IN ('bekliyor', 'odendi', 'iptal')),
    odeme_tarihi DATE,
    donem_ay INTEGER CHECK (donem_ay BETWEEN 1 AND 12),
    donem_yil INTEGER,
    tedarikci VARCHAR(255),
    olusturma_tarihi TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    guncelleme_tarihi TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    gizli BOOLEAN DEFAULT FALSE
);
CREATE INDEX IF NOT EXISTS idx_expenses_kategori ON expenses(kategori);
CREATE INDEX IF NOT EXISTS idx_expenses_donem ON expenses(donem_yil, donem_ay);
CREATE INDEX IF NOT EXISTS idx_expenses_odeme ON expenses(odeme_durumu);

CREATE TABLE IF NOT EXISTS franchises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID UNIQUE REFERENCES tenants(id) ON DELETE CASCADE,
    isletme_adi VARCHAR(255) NOT NULL,
    yetkili_ad VARCHAR(100) NOT NULL,
    yetkili_soyad VARCHAR(100) NOT NULL,
    telefon VARCHAR(20),
    email VARCHAR(255),
    adres TEXT,
    il VARCHAR(50),
    ilce VARCHAR(50),
    sozlesme_tarihi DATE,
    sozlesme_bitis DATE,
    giris_ucreti_odendi BOOLEAN DEFAULT FALSE,
    giris_ucreti_tutar DECIMAL(10,2) DEFAULT 1500.00,
    durum VARCHAR(20) DEFAULT 'aktif' CHECK (durum IN ('basvuru', 'onay_bekliyor', 'aktif', 'askida', 'iptal', 'ayrildi')),
    paket_tipi VARCHAR(20) DEFAULT 'temel' CHECK (paket_tipi IN ('temel', 'standart', 'premium', 'enterprise')),
    aktif_moduller JSONB DEFAULT '[]'::jsonb,
    ogrenci_sayisi INTEGER DEFAULT 0,
    personel_sayisi INTEGER DEFAULT 0,
    sube_sayisi INTEGER DEFAULT 1,
    brans_sayisi INTEGER DEFAULT 1,
    aylik_gelir DECIMAL(12,2) DEFAULT 0,
    son_odeme_tarihi DATE,
    geciken_odeme BOOLEAN DEFAULT FALSE,
    son_ai_konusma_id UUID,
    toplam_ai_konusma INTEGER DEFAULT 0,
    patron_notu TEXT,
    basvuru_tarihi TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    aktivasyon_tarihi TIMESTAMP WITH TIME ZONE,
    olusturma_tarihi TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    guncelleme_tarihi TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    gizli BOOLEAN DEFAULT FALSE
);
CREATE INDEX IF NOT EXISTS idx_franchises_durum ON franchises(durum);
CREATE INDEX IF NOT EXISTS idx_franchises_il ON franchises(il);
CREATE INDEX IF NOT EXISTS idx_franchises_tenant ON franchises(tenant_id);

CREATE TABLE IF NOT EXISTS templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kategori VARCHAR(50) NOT NULL CHECK (kategori IN ('grafik_premium', 'grafik_standart', 'rapor', 'form', 'belge', 'sosyal_medya', 'email', 'sms', 'web', 'diger')),
    ad VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    aciklama TEXT,
    icerik JSONB DEFAULT '{}'::jsonb,
    onizleme_url VARCHAR(500),
    fiyat_tipi VARCHAR(20) DEFAULT 'dahil' CHECK (fiyat_tipi IN ('dahil', 'premium', 'standart', 'ekstra')),
    fiyat DECIMAL(10,2) DEFAULT 0,
    aktif BOOLEAN DEFAULT TRUE,
    kullanim_sayisi INTEGER DEFAULT 0,
    versiyon VARCHAR(20) DEFAULT '1.0',
    olusturma_tarihi TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    guncelleme_tarihi TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_templates_kategori ON templates(kategori);
CREATE INDEX IF NOT EXISTS idx_templates_slug ON templates(slug);
CREATE INDEX IF NOT EXISTS idx_templates_aktif ON templates(aktif);

CREATE TABLE IF NOT EXISTS franchise_revenue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    franchise_id UUID NOT NULL REFERENCES franchises(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,
    gelir_tipi VARCHAR(50) NOT NULL CHECK (gelir_tipi IN ('aylik_abonelik', 'giris_ucreti', 'modul_ucreti', 'grafik_satisi', 'tasarim_hizmeti', 'diger')),
    aciklama VARCHAR(255),
    brut_tutar DECIMAL(12,2) NOT NULL,
    yisas_payi DECIMAL(12,2),
    franchise_payi DECIMAL(12,2),
    net_tutar DECIMAL(12,2),
    para_birimi VARCHAR(3) DEFAULT 'TRY',
    donem_ay INTEGER CHECK (donem_ay BETWEEN 1 AND 12),
    donem_yil INTEGER,
    odeme_durumu VARCHAR(20) DEFAULT 'bekliyor' CHECK (odeme_durumu IN ('bekliyor', 'odendi', 'gecikti', 'iptal')),
    odeme_tarihi DATE,
    vade_tarihi DATE,
    olusturma_tarihi TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    guncelleme_tarihi TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    gizli BOOLEAN DEFAULT FALSE
);
CREATE INDEX IF NOT EXISTS idx_franchise_revenue_franchise ON franchise_revenue(franchise_id);
CREATE INDEX IF NOT EXISTS idx_franchise_revenue_donem ON franchise_revenue(donem_yil, donem_ay);
CREATE INDEX IF NOT EXISTS idx_franchise_revenue_odeme ON franchise_revenue(odeme_durumu);

CREATE TABLE IF NOT EXISTS deploy_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deploy_tipi VARCHAR(20) NOT NULL CHECK (deploy_tipi IN ('git_commit', 'git_push', 'vercel_deploy', 'railway_deploy', 'supabase_migration')),
    ortam VARCHAR(20) DEFAULT 'production' CHECK (ortam IN ('development', 'staging', 'production')),
    approval_queue_id UUID REFERENCES approval_queue(id) ON DELETE SET NULL,
    patron_onayli BOOLEAN DEFAULT FALSE,
    onay_tarihi TIMESTAMP WITH TIME ZONE,
    commit_hash VARCHAR(40),
    commit_mesaji TEXT,
    branch VARCHAR(100) DEFAULT 'main',
    durum VARCHAR(20) DEFAULT 'basarili' CHECK (durum IN ('bekliyor', 'basarili', 'basarisiz', 'geri_alindi')),
    hata_mesaji TEXT,
    deploy_url VARCHAR(500),
    baslangic_zamani TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    bitis_zamani TIMESTAMP WITH TIME ZONE,
    sure_saniye INTEGER,
    olusturma_tarihi TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_deploy_logs_tipi ON deploy_logs(deploy_tipi);
CREATE INDEX IF NOT EXISTS idx_deploy_logs_durum ON deploy_logs(durum);
CREATE INDEX IF NOT EXISTS idx_deploy_logs_tarih ON deploy_logs(olusturma_tarihi DESC);

CREATE TABLE IF NOT EXISTS api_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    api_adi VARCHAR(50) NOT NULL CHECK (api_adi IN ('claude', 'gpt4', 'together', 'gemini', 'llama', 'v0', 'cursor')),
    endpoint VARCHAR(255),
    tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,
    robot_id UUID,
    input_tokens INTEGER DEFAULT 0,
    output_tokens INTEGER DEFAULT 0,
    toplam_tokens INTEGER DEFAULT 0,
    tahmini_maliyet DECIMAL(10,6) DEFAULT 0,
    para_birimi VARCHAR(3) DEFAULT 'USD',
    yanit_suresi_ms INTEGER,
    basarili BOOLEAN DEFAULT TRUE,
    hata_mesaji TEXT,
    tarih DATE DEFAULT CURRENT_DATE,
    saat INTEGER,
    olusturma_tarihi TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_api_usage_api ON api_usage(api_adi);
CREATE INDEX IF NOT EXISTS idx_api_usage_tenant ON api_usage(tenant_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_tarih ON api_usage(tarih);

CREATE OR REPLACE FUNCTION update_guncelleme_tarihi()
RETURNS TRIGGER AS $$ BEGIN NEW.guncelleme_tarihi = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;

DO $$
DECLARE tablo TEXT;
BEGIN
  FOR tablo IN SELECT unnest(ARRAY['approval_queue', 'expenses', 'franchises', 'templates', 'franchise_revenue'])
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS trg_%s_guncelle ON %s; CREATE TRIGGER trg_%s_guncelle BEFORE UPDATE ON %s FOR EACH ROW EXECUTE PROCEDURE update_guncelleme_tarihi();', tablo, tablo, tablo, tablo);
  END LOOP;
END $$;

CREATE OR REPLACE VIEW v_patron_bekleyen_onaylar AS
SELECT id, talep_tipi, baslik, aciklama, talep_eden_robot, oncelik, olusturma_tarihi, EXTRACT(DAY FROM (NOW() - olusturma_tarihi))::INTEGER AS bekleyen_gun
FROM approval_queue WHERE durum = 'bekliyor' ORDER BY oncelik ASC, olusturma_tarihi ASC;

CREATE OR REPLACE VIEW v_patron_aylik_gelir AS
SELECT donem_yil, donem_ay, gelir_tipi, COUNT(*) AS islem_sayisi, SUM(brut_tutar) AS toplam_brut, SUM(net_tutar) AS toplam_net, para_birimi
FROM franchise_revenue WHERE gizli = FALSE GROUP BY donem_yil, donem_ay, gelir_tipi, para_birimi ORDER BY donem_yil DESC, donem_ay DESC;

CREATE OR REPLACE VIEW v_patron_aylik_gider AS
SELECT donem_yil, donem_ay, kategori, COUNT(*) AS islem_sayisi, SUM(tutar) AS toplam_tutar, para_birimi
FROM expenses WHERE gizli = FALSE GROUP BY donem_yil, donem_ay, kategori, para_birimi ORDER BY donem_yil DESC, donem_ay DESC;

CREATE OR REPLACE VIEW v_patron_franchise_ozet AS
SELECT durum, COUNT(*) AS franchise_sayisi, COALESCE(SUM(ogrenci_sayisi), 0) AS toplam_ogrenci, COALESCE(SUM(aylik_gelir), 0) AS toplam_aylik_gelir
FROM franchises WHERE gizli = FALSE GROUP BY durum;

CREATE OR REPLACE VIEW v_patron_son_deploylar AS
SELECT id, deploy_tipi, ortam, patron_onayli, commit_mesaji, durum, olusturma_tarihi FROM deploy_logs ORDER BY olusturma_tarihi DESC LIMIT 20;

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

ALTER TABLE approval_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE franchises ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE franchise_revenue ENABLE ROW LEVEL SECURITY;
ALTER TABLE deploy_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;

-- ═══════════════════════════════════════════════════════════════════════════════════════
-- BÖLÜM 5: CELF MALİYET RAPORLARI + PATRON SATIŞ FİYATLARI
-- ═══════════════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS celf_cost_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_type TEXT NOT NULL CHECK (report_type IN ('franchise_package', 'student_tier', 'robot', 'veli_extra', 'one_time', 'monthly', 'custom')),
  period TEXT,
  description TEXT NOT NULL,
  product_key TEXT,
  cost_breakdown JSONB NOT NULL DEFAULT '{}',
  director_key TEXT DEFAULT 'CFO',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_celf_cost_reports_report_type ON celf_cost_reports(report_type);
CREATE INDEX IF NOT EXISTS idx_celf_cost_reports_product_key ON celf_cost_reports(product_key);
CREATE INDEX IF NOT EXISTS idx_celf_cost_reports_created_at ON celf_cost_reports(created_at DESC);
ALTER TABLE celf_cost_reports ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service can manage celf_cost_reports" ON celf_cost_reports;
CREATE POLICY "Service can manage celf_cost_reports" ON celf_cost_reports FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS patron_sales_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_key TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT,
  cost_report_id UUID REFERENCES celf_cost_reports(id) ON DELETE SET NULL,
  sales_price_amount NUMERIC(12,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  effective_from TIMESTAMPTZ DEFAULT NOW(),
  effective_to TIMESTAMPTZ,
  approved_by UUID,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_patron_sales_prices_product_key ON patron_sales_prices(product_key);
CREATE INDEX IF NOT EXISTS idx_patron_sales_prices_effective ON patron_sales_prices(effective_from, effective_to);
ALTER TABLE patron_sales_prices ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service can manage patron_sales_prices" ON patron_sales_prices;
CREATE POLICY "Service can manage patron_sales_prices" ON patron_sales_prices FOR ALL USING (true) WITH CHECK (true);

-- ═══════════════════════════════════════════════════════════════════════════════════════
-- BÖLÜM 6: COO KURALLARI (dinamik; Patron onayı ile güncellenir)
-- ═══════════════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS coo_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operation_type TEXT NOT NULL CHECK (operation_type IN ('daily_ops', 'facility_coord', 'franchise_coord', 'process_track', 'resource_alloc', 'unknown')),
  label TEXT NOT NULL,
  keywords TEXT[] DEFAULT '{}',
  director_mapping JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  approved_by UUID,
  approved_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_coo_rules_operation_type ON coo_rules(operation_type);
ALTER TABLE coo_rules ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service can manage coo_rules" ON coo_rules;
CREATE POLICY "Service can manage coo_rules" ON coo_rules FOR ALL USING (true) WITH CHECK (true);

-- ═══════════════════════════════════════════════════════════════════════════════════════
-- BÖLÜM 7: KULLANICI ROLLERİ (KULLANICI_ROLLERI_SISTEM_ONERILERI — A1/A2)
-- Rol ve yetki matrisi tek yerde; panel/API/robotlar bu tabloyu referans alır.
-- ═══════════════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_code VARCHAR(20) UNIQUE NOT NULL,          -- ROL-0, ROL-1, ... ROL-12
  role_name TEXT NOT NULL,                        -- Ziyaretçi, Franchise Sahibi, Patron vb.
  can_trigger_flow BOOLEAN DEFAULT false,         -- Patron Asistan / flow (B1)
  can_trigger_celf_ceo BOOLEAN DEFAULT false,     -- CELF/CEO tetikleme (B2)
  panel_route TEXT,                               -- Rol → sayfa yönlendirme (B3)
  max_pending_commands INTEGER DEFAULT 1,         -- Aynı anda max bekleyen iş (C1/C2)
  priority INTEGER DEFAULT 5,                     -- Kuyruk önceliği 1=en yüksek (C3)
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_role_permissions_role_code ON role_permissions(role_code);
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service can manage role_permissions" ON role_permissions;
CREATE POLICY "Service can manage role_permissions" ON role_permissions FOR ALL USING (true) WITH CHECK (true);

-- Varsayılan roller (Master Doküman / KULLANICI_ROLLERI ile uyumlu)
INSERT INTO role_permissions (role_code, role_name, can_trigger_flow, can_trigger_celf_ceo, panel_route, max_pending_commands, priority) VALUES
  ('ROL-0',  'Ziyaretçi',              false, false, '/vitrin',           0, 10),
  ('ROL-1',  'Franchise Sahibi',       false, false, '/franchise/panel',  1, 7),
  ('ROL-2',  'Tesis Müdürü',           false, false, '/franchise/panel',  1, 8),
  ('ROL-10', 'Veli',                   false, false, '/veli',             0, 9),
  ('ROL-11', 'Sporcu',                 false, false, '/sporcu',            0, 9),
  ('ROL-12', 'Misafir Sporcu',         false, false, '/vitrin',            0, 10),
  ('PATRON', 'Patron',                 true,  true,  '/patron',           99, 1)
ON CONFLICT (role_code) DO UPDATE SET
  role_name = EXCLUDED.role_name,
  can_trigger_flow = EXCLUDED.can_trigger_flow,
  can_trigger_celf_ceo = EXCLUDED.can_trigger_celf_ceo,
  panel_route = EXCLUDED.panel_route,
  max_pending_commands = EXCLUDED.max_pending_commands,
  priority = EXCLUDED.priority,
  updated_at = NOW();

-- ═══════════════════════════════════════════════════════════════════════════════════════
-- KURULUM TAMAMLANDI
-- Tüm tablolar, indeksler, RLS, view'lar ve role_permissions tek script ile oluşturuldu.
-- Onay bekleyen işler: patron_commands (status=pending), approval_queue (durum=bekliyor).
-- Seed (örnek franchise) için: supabase/seed-franchise-tuzla-besiktas.sql — v2.1 franchises
-- şemasına uyarlanarak ayrıca çalıştırılabilir.
-- ═══════════════════════════════════════════════════════════════════════════════════════
