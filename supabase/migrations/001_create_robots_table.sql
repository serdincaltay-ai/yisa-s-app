-- Migration: Create robots table
-- Description: Creates the robots table for YİSA-S AI system with 7 main robots
-- Date: 2026-01-20

-- Create robots table
CREATE TABLE IF NOT EXISTS robots (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    role VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'standby' CHECK (status IN ('active', 'standby', 'offline')),
    model VARCHAR(100),
    color VARCHAR(20),
    icon VARCHAR(10),
    capabilities JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_robots_code ON robots(code);
CREATE INDEX IF NOT EXISTS idx_robots_status ON robots(status);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger
DROP TRIGGER IF EXISTS update_robots_updated_at ON robots;
CREATE TRIGGER update_robots_updated_at
    BEFORE UPDATE ON robots
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert 7 main robots
INSERT INTO robots (name, code, role, description, status, model, color, icon, capabilities)
VALUES 
    (
        'CEO Robot',
        'CEO',
        'Üst Düzey Karar Verici',
        'Stratejik kararlar alır, öncelikleri belirler ve diğer robotları koordine eder.',
        'active',
        'claude-sonnet-4-20250514',
        '#F59E0B',
        '👔',
        '["strategic-planning", "decision-making", "coordination", "priority-management"]'::jsonb
    ),
    (
        'Analyst Robot',
        'ANALYST',
        'Veri Analisti',
        'Verileri analiz eder, raporlar oluşturur ve içgörüler sağlar.',
        'active',
        'claude-sonnet-4-20250514',
        '#3B82F6',
        '📊',
        '["data-analysis", "reporting", "insights", "visualization"]'::jsonb
    ),
    (
        'Developer Robot',
        'DEV',
        'Yazılım Geliştirici',
        'Kod yazar, sistemleri geliştirir ve teknik sorunları çözer.',
        'active',
        'claude-sonnet-4-20250514',
        '#10B981',
        '💻',
        '["coding", "debugging", "architecture", "optimization"]'::jsonb
    ),
    (
        'Designer Robot',
        'DESIGNER',
        'UI/UX Tasarımcı',
        'Kullanıcı arayüzleri tasarlar ve kullanıcı deneyimini optimize eder.',
        'active',
        'claude-sonnet-4-20250514',
        '#EC4899',
        '🎨',
        '["ui-design", "ux-research", "prototyping", "branding"]'::jsonb
    ),
    (
        'Support Robot',
        'SUPPORT',
        'Müşteri Desteği',
        'Kullanıcı sorularını yanıtlar, sorunları çözer ve destek sağlar.',
        'active',
        'claude-sonnet-4-20250514',
        '#8B5CF6',
        '🤝',
        '["customer-support", "problem-solving", "communication", "documentation"]'::jsonb
    ),
    (
        'Research Robot',
        'RESEARCH',
        'Araştırmacı',
        'Pazar araştırması yapar, trendleri takip eder ve bilgi toplar.',
        'active',
        'claude-sonnet-4-20250514',
        '#06B6D4',
        '🔬',
        '["market-research", "trend-analysis", "information-gathering", "competitive-analysis"]'::jsonb
    ),
    (
        'Operations Robot',
        'OPS',
        'Operasyon Yöneticisi',
        'Günlük operasyonları yönetir, süreçleri optimize eder ve verimliliği artırır.',
        'standby',
        'claude-sonnet-4-20250514',
        '#F97316',
        '⚙️',
        '["operations-management", "process-optimization", "efficiency", "automation"]'::jsonb
    )
ON CONFLICT (code) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE robots ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Allow read access for all users" ON robots
    FOR SELECT
    USING (true);

CREATE POLICY "Allow update for authenticated users" ON robots
    FOR UPDATE
    USING (true);

-- Comment on table
COMMENT ON TABLE robots IS 'YİSA-S Robot Filosu - 7 Ana Yapay Zeka Robotu';
