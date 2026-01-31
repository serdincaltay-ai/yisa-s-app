-- =====================================================
-- YİSA-S SUPABASE DOĞRULAMA SCRİPTİ
-- Omurga Adım 2: Tablo, Trigger, RLS kontrolü
-- Tarih: 31 Ocak 2026
-- =====================================================

-- 1. TABLO KONTROLÜ
SELECT '=== 1. TABLO KONTROLÜ ===' AS check_section;

SELECT 
  table_name,
  CASE WHEN table_name IS NOT NULL THEN '✓ VAR' ELSE '✗ YOK' END AS status
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN (
    'tenants', 'users', 'robots', 'robot_tasks', 'celf_directorates',
    'conversations', 'messages', 'athletes', 'evaluations', 'schedules',
    'attendance', 'payments', 'security_alerts', 'audit_logs', 'patron_commands',
    'role_permissions', 'core_rules', 'ceo_tasks', 'celf_logs', 'chat_messages',
    'task_results', 'routine_tasks', 'patron_private_tasks'
  )
ORDER BY table_name;

-- 2. 7 ROBOT SEED KONTROLÜ
SELECT '=== 2. ROBOT SEED KONTROLÜ ===' AS check_section;

SELECT kod, isim, hiyerarsi_sirasi, durum
FROM robots
ORDER BY hiyerarsi_sirasi;

-- Beklenen 7 robot: ROB-PATRON, ROB-SIBER, ROB-ARSIV, ROB-CEO, ROB-CELF, ROB-COO, ROB-VITRIN

-- 3. 12 DİREKTÖRLÜK SEED KONTROLÜ
SELECT '=== 3. DİREKTÖRLÜK SEED KONTROLÜ ===' AS check_section;

SELECT kod, isim, sira
FROM celf_directorates
ORDER BY sira;

-- 4. 7 ÇEKİRDEK KURAL KONTROLÜ
SELECT '=== 4. ÇEKİRDEK KURAL KONTROLÜ ===' AS check_section;

SELECT kural_no, kural_kodu, baslik
FROM core_rules
ORDER BY kural_no;

-- 5. 13 ROL KONTROLÜ
SELECT '=== 5. ROL KONTROLÜ ===' AS check_section;

SELECT rol_kodu, rol_adi, hiyerarsi_seviyesi
FROM role_permissions
ORDER BY hiyerarsi_seviyesi;

-- 6. RLS POLİTİKALARI KONTROLÜ
SELECT '=== 6. RLS POLİTİKALARI KONTROLÜ ===' AS check_section;

SELECT 
  schemaname, 
  tablename, 
  policyname,
  permissive,
  cmd
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 7. TRİGGER KONTROLÜ
SELECT '=== 7. TRİGGER KONTROLÜ ===' AS check_section;

SELECT 
  trigger_name,
  event_object_table,
  action_timing,
  event_manipulation
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- 8. FONKSİYON KONTROLÜ
SELECT '=== 8. FONKSİYON KONTROLÜ ===' AS check_section;

SELECT 
  routine_name,
  routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN (
    'get_user_tenant_id', 'get_user_rol_kodu', 'get_user_hiyerarsi',
    'is_service_role', 'update_guncelleme_tarihi', 'generate_sporcu_no',
    'generate_odeme_no', 'prevent_audit_delete', 'prevent_audit_update',
    'prevent_core_rules_modify'
  )
ORDER BY routine_name;

-- 9. CEO_TASKS TABLOSU KONTROLÜ
SELECT '=== 9. CEO_TASKS DURUM ===' AS check_section;

SELECT 
  status,
  COUNT(*) as count
FROM ceo_tasks
GROUP BY status
ORDER BY status;

-- 10. PATRON_COMMANDS TABLOSU KONTROLÜ
SELECT '=== 10. PATRON_COMMANDS DURUM ===' AS check_section;

SELECT 
  status,
  COUNT(*) as count
FROM patron_commands
GROUP BY status
ORDER BY status;

-- ÖZET
SELECT '=== ÖZET ===' AS check_section;

SELECT 
  (SELECT COUNT(*) FROM robots) AS robot_sayisi,
  (SELECT COUNT(*) FROM celf_directorates) AS direktorluk_sayisi,
  (SELECT COUNT(*) FROM core_rules) AS kural_sayisi,
  (SELECT COUNT(*) FROM role_permissions) AS rol_sayisi,
  (SELECT COUNT(*) FROM tenants WHERE durum = 'aktif') AS aktif_tenant_sayisi;
