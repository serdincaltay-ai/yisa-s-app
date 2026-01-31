# YİSA-S Versiyon ve Değişiklik Geçmişi

## v1.0.0 — 30 Ocak 2026

### İlk kurulum paketi (Omurga v1.0)

- **7 katmanlı robot hiyerarşisi** (Katman 0–7): Patron, Asistan, Siber Güvenlik, Veri Arşivleme, CEO, CELF, COO, Vitrin
- **12 CELF direktörlüğü**: CFO, CTO, CIO, CMO, CHRO, CLO, CSO_SATIS, CPO, CDO, CISO, CCO, CSO_STRATEJI
- **13 rol**: Ziyaretçi … Patron (role-permissions.json)
- **Seçenek 2 iş akışı**: Patron → CEO (sınıflandır) → CELF → AI → CEO → Patron Onay
- **Supabase tabloları**: chat_messages, patron_commands, ceo_tasks, celf_logs, audit_log, routine_tasks, task_results, security_logs, system_backups
- **API endpoint'leri**: /api/ceo, /api/celf, /api/chat/flow, /api/routine, /api/routine/complete, /api/security, /api/approvals, /api/expenses, /api/franchises, /api/stats, /api/templates
- **Güvenlik**: FORBIDDEN_FOR_AI, REQUIRE_PATRON_APPROVAL, 4 seviye alarm (sari, turuncu, kirmizi, acil)
- **Yedek paketi**: backup/SQL, backup/CONFIG, backup/RESTORE, YISA-S-OMURGA-v1.0.md

### Versiyon kontrolü (her major değişiklikte)

1. Bu VERSION.md dosyasını güncelleyin
2. Supabase `system_backups` tablosuna yeni kayıt ekleyin (version, backup_type, backup_data)
3. `backup/` klasörünü güncelleyin (SQL, CONFIG, RESTORE)
