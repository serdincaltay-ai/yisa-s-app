-- ═══════════════════════════════════════════════════════════════════════════════════════
-- YİSA-S BACKUP - 03 SEED DATA
-- 02-rls-policies.sql sonrası çalıştırın.
-- system_backups: İlk konfigürasyon yedeği (v1.0.0)
-- ═══════════════════════════════════════════════════════════════════════════════════════

INSERT INTO system_backups (version, backup_type, backup_data, description)
VALUES (
  'v1.0.0',
  'full',
  '{
    "robot_hierarchy": [
      {"layer": 0, "name": "PATRON", "detail": "Serdinç Altay"},
      {"layer": 1, "name": "PATRON ASİSTAN", "detail": "Claude + GPT + Gemini + Together + V0 + Cursor"},
      {"layer": 2, "name": "SİBER GÜVENLİK"},
      {"layer": 3, "name": "VERİ ARŞİVLEME"},
      {"layer": 4, "name": "CEO ORGANİZATÖR", "detail": "Kural tabanlı, AI yok"},
      {"layer": 5, "name": "YİSA-S CELF MERKEZ", "detail": "12 Direktörlük"},
      {"layer": 6, "name": "COO YARDIMCI"},
      {"layer": 7, "name": "YİSA-S VİTRİN"}
    ],
    "celf_directors": ["CFO", "CTO", "CIO", "CMO", "CHRO", "CLO", "CSO_SATIS", "CPO", "CDO", "CISO", "CCO", "CSO_STRATEJI"],
    "forbidden_commands": [".env", "API_KEY", "git push", "git commit", "vercel deploy", "DROP TABLE", "DELETE FROM", "TRUNCATE", "delete_user", "change_password", "grant_permission", "fiyat_degistir", "kullanici_sil", "yetki_degistir"],
    "require_patron_approval": ["deploy", "commit", "push", "merge", "table create", "user delete", "role change", "price change", "env change"],
    "role_permissions": ["Ziyaretçi", "Ücretsiz Üye", "Ücretli Üye", "Deneme Üyesi", "Eğitmen", "Tesis Yöneticisi", "Tesis Sahibi", "Bölge Müdürü", "Franchise Sahibi", "Franchise Yöneticisi", "Sistem Admini", "Süper Admin", "Patron"],
    "routine_tasks_schema": {"schedule": ["daily", "weekly", "monthly"], "status": ["completed", "failed", "cancelled"]},
    "env_keys": ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "ANTHROPIC_API_KEY", "OPENAI_API_KEY", "GOOGLE_API_KEY", "TOGETHER_API_KEY", "SUPABASE_SERVICE_ROLE_KEY", "NEXT_PUBLIC_SITE_URL"]
  }'::jsonb,
  'YİSA-S Omurga v1.0 - İlk kurulum'
);
