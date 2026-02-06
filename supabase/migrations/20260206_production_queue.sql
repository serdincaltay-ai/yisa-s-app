-- ═══════════════════════════════════════════════════════════════════
-- YİSA-S Üretim Havuzu Kuyruğu — DB Migration
-- CELF Motor'un görevlendirdiği işlerin kalıcı kaydı
-- Tarih: 6 Şubat 2026
-- ═══════════════════════════════════════════════════════════════════

-- Üretim kuyruğu tablosu
CREATE TABLE IF NOT EXISTS production_queue (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- İş referansı
  job_id UUID NOT NULL REFERENCES robot_jobs(id) ON DELETE CASCADE,

  -- Komut bilgileri
  command_hash TEXT NOT NULL,          -- Tekrar engeli için hash
  command_preview TEXT,                -- İlk 200 karakter

  -- İçerik ve pipeline
  content_type TEXT NOT NULL DEFAULT 'metin_rapor',
  pipeline JSONB NOT NULL DEFAULT '["GPT"]',  -- Robot sırası

  -- Gönderen
  source_directorate TEXT NOT NULL,
  directorate_output TEXT,            -- Direktörlük çıktısı (gereksinim dokümanı)
  idea_producer TEXT,                  -- Fikri geliştiren AI

  -- Patron tercihi
  patron_override_pipeline JSONB,     -- Patron özel hat belirlediyse

  -- Durum
  status TEXT NOT NULL DEFAULT 'queued'
    CHECK (status IN ('queued', 'in_progress', 'completed', 'failed', 'cancelled')),
  current_step INT DEFAULT 0,         -- Şu anki adım (0 = başlamadı)

  -- Adım çıktıları
  step_outputs JSONB DEFAULT '[]',    -- Her adımın detaylı çıktısı
  final_output TEXT,                  -- Son birleştirilmiş çıktı

  -- Claude denetim
  claude_review_passed BOOLEAN,
  claude_review_note TEXT,

  -- Maliyet
  estimated_tokens INT DEFAULT 0,
  actual_tokens INT DEFAULT 0,

  -- Öncelik (1=critical, 2=high, 3=normal, 4=low)
  priority INT DEFAULT 3,
  queue_position INT,

  -- Uyarılar ve öneriler
  warnings JSONB DEFAULT '[]',
  suggestions JSONB DEFAULT '[]',

  -- Zaman
  created_at TIMESTAMPTZ DEFAULT now(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_pq_job_id ON production_queue(job_id);
CREATE INDEX IF NOT EXISTS idx_pq_status ON production_queue(status);
CREATE INDEX IF NOT EXISTS idx_pq_command_hash ON production_queue(command_hash);
CREATE INDEX IF NOT EXISTS idx_pq_source_dir ON production_queue(source_directorate);
CREATE INDEX IF NOT EXISTS idx_pq_priority_status ON production_queue(priority, status);
CREATE INDEX IF NOT EXISTS idx_pq_created_at ON production_queue(created_at DESC);

-- updated_at trigger
CREATE OR REPLACE FUNCTION update_pq_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_pq_updated_at
  BEFORE UPDATE ON production_queue
  FOR EACH ROW EXECUTE FUNCTION update_pq_updated_at();

-- RLS (Row Level Security)
ALTER TABLE production_queue ENABLE ROW LEVEL SECURITY;

-- Servis rolü her şeyi görebilir
CREATE POLICY "service_role_all_pq" ON production_queue
  FOR ALL USING (auth.role() = 'service_role');

-- ═══════════════════════════════════════════════════════════════════
-- robot_jobs tablosuna yeni alanlar ekle (üretim havuzu entegrasyonu)
-- ═══════════════════════════════════════════════════════════════════

-- Üretim havuzu ile ilgili yeni alanlar
ALTER TABLE robot_jobs
  ADD COLUMN IF NOT EXISTS production_queue_id UUID REFERENCES production_queue(id),
  ADD COLUMN IF NOT EXISTS production_pipeline JSONB,          -- Atanan robot sırası
  ADD COLUMN IF NOT EXISTS production_content_type TEXT,        -- Üretim içerik türü
  ADD COLUMN IF NOT EXISTS patron_selected_pipeline JSONB,     -- Patron'un seçtiği hat
  ADD COLUMN IF NOT EXISTS task_duration TEXT DEFAULT 'tek_seferlik'
    CHECK (task_duration IN ('tek_seferlik', 'rutin', 'kalici')),
  ADD COLUMN IF NOT EXISTS routine_schedule TEXT
    CHECK (routine_schedule IN ('daily', 'weekly', 'monthly'));

-- robot_jobs status'a yeni değerler ekle (üretim aşaması)
-- Not: CHECK constraint'i kaldırıp yeniden oluşturmamız gerekebilir
-- Mevcut flow: producing → celf_review → ceo_pool → approved/rejected/correction → deploying → published → archived
-- Yeni eklenen: production_queued, production_in_progress
-- Bu değerler output_data içinde de takip edilebilir, status enum değiştirmek riskli olabilir
-- Bu yüzden status yerine production_status kullanıyoruz:
ALTER TABLE robot_jobs
  ADD COLUMN IF NOT EXISTS production_status TEXT DEFAULT 'none'
    CHECK (production_status IN ('none', 'queued', 'in_progress', 'completed', 'failed'));

COMMENT ON TABLE production_queue IS 'CELF Motor üretim kuyruğu — direktörlükten gelen işlerin üretim robotlarına dağıtımı';
COMMENT ON COLUMN production_queue.command_hash IS 'Tekrar engeli için komut hash değeri';
COMMENT ON COLUMN production_queue.pipeline IS 'Robot sırası JSON dizisi, örn: ["GEMINI","V0"]';
COMMENT ON COLUMN production_queue.step_outputs IS 'Her adımın çıktı detayı [{step,robot,output,success}]';
COMMENT ON COLUMN robot_jobs.production_status IS 'Üretim havuzu durumu — ana status ile karışmasın';
