# Testing Tenant Provisioning & CELF Triggering

## Overview
The tenant-yisa-s repo is a Next.js app deployed on Vercel. It manages tenant provisioning (demo request approval → tenant creation → CELF startup). The core provisioning logic is in `lib/services/tenant-provisioning.ts`.

## Devin Secrets Needed
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` — Service role key for admin access
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Anon key (may not work for all tables)

## Supabase Access
- The anon key may return "Invalid API key" for some operations. Use the **service role key as both `apikey` header AND `Authorization: Bearer` header**:
  ```bash
  curl -s "${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/TABLE_NAME?select=*&limit=1" \
    -H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
    -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}"
  ```

## API Route Auth
- Most API routes (e.g., `/api/demo-requests`) require patron session auth via `requirePatronOrFlow()` in `lib/auth/api-auth.ts`.
- You **cannot** call these APIs directly with just a service role key — they check Supabase Auth session.
- For testing, use **direct Supabase REST API calls** to simulate what the provisioning code does, rather than trying to call the Next.js API routes.

## Database Schema Gotchas
- **`sim_updates` table columns**: `id`, `decision_id`, `target_robot`, `target_directorate`, `command`, `status`, `created_at`
- **IMPORTANT**: Documentation files (YISA_S_V0_YOL_HARITASI_v2.md, SOHBET_TASIMA_OZETI.md) incorrectly state the column is `target_direktorluk`. The **actual live DB column is `target_directorate`**. Using `target_direktorluk` returns HTTP 400.
- Existing CELF records use `target_robot: 'CELF'` (uppercase) and `target_directorate: 'genel_mudurluk'`.
- Valid status values observed: `'beklemede'`, `'completed'` (docs say `'beklemede'`/`'islendi'` but `'completed'` exists in practice).

## Testing the CELF Trigger Flow
1. **Create a test record** in `sim_updates` using the exact payload structure from `triggerCelfStartup`:
   ```json
   {
     "target_robot": "CELF",
     "target_directorate": "genel_mudurluk",
     "command": "{\"type\": \"tenant_baslangic_gorevleri\", ...}",
     "status": "beklemede"
   }
   ```
2. **Verify** the record exists with correct fields and `command` JSON contains all 15 directorate keys.
3. **Clean up** test records after verification to avoid polluting the DB.

## CELF Directorate Keys
- 15 total keys defined in `lib/robots/celf-center.ts` via `CELF_DIRECTORATE_KEYS`:
  CFO, CTO, CIO, CMO, CHRO, CLO, CSO_SATIS, CPO, CDO, CISO, CCO, CSO_STRATEJI, CSPO, COO, RND
- Always import from `celf-center.ts` rather than hardcoding to prevent drift.

## Vercel Preview
- PR deployments get Vercel preview URLs like: `tenant-yisa-s-git-{branch-slug}-{team}.vercel.app`
- Preview URL is accessible but API routes return 401 without patron auth session.

## ESLint
- ESLint may fail with a circular reference error in the project's eslint config (pre-existing issue, not related to code changes). Use TypeScript checks (`npx tsc --noEmit`) instead. Note that `@/` path alias errors from standalone tsc are also pre-existing.
