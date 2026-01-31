-- YİSA-S Franchise seed: Tuzla Beşiktaş Cimnastik Okulu
-- Firma yetkilisi: Merve Görmezer
-- Tarih: 29 Ocak 2026
-- Supabase SQL Editor'da çalıştırın (franchises veya organizations tablosu varsa).

-- Örnek: franchises tablosu kullanıyorsanız (sütunlar projenize göre uyarlanabilir)
-- CREATE TABLE IF NOT EXISTS franchises (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   name TEXT NOT NULL,
--   slug TEXT UNIQUE,
--   region TEXT,
--   package TEXT,
--   members_count INT DEFAULT 0,
--   athletes_count INT DEFAULT 0,
--   status TEXT DEFAULT 'lead',
--   contact_name TEXT,
--   contact_email TEXT,
--   contact_phone TEXT,
--   notes TEXT,
--   created_at TIMESTAMPTZ DEFAULT now()
-- );

-- Tablo yoksa önce oluşturun (örnek):
-- create table franchises (id uuid primary key default gen_random_uuid(), name text, slug text, region text, package text, members_count int default 0, athletes_count int default 0, status text default 'lead', contact_name text, contact_email text, contact_phone text, notes text, created_at timestamptz default now());

INSERT INTO franchises (
  name, slug, region, package, members_count, athletes_count, status,
  contact_name, contact_email, contact_phone, notes
) VALUES (
  'Tuzla Beşiktaş Cimnastik Okulu',
  'tuzla-besiktas-cimnastik',
  'Tuzla / İstanbul',
  'Temel Paket (satış öncesi)',
  0, 0, 'lead',
  'Merve Görmezer',
  'merve.gormezer@tuzlabesiktascimnastik.com',
  NULL,
  'Franchise firması olarak satış yapılacak. Yetkili: Merve Görmezer.'
);

-- Not: Tablo adı organizations veya tenants ise sütunları uyarlayıp orada INSERT yapın.
