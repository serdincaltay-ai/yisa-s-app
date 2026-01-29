/**
 * YİSA-S Supabase Client
 * URL ve anon key .env.local üzerinden okunur.
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!url || !anon) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL ve NEXT_PUBLIC_SUPABASE_ANON_KEY tanımlı olmalı (.env.local)')
}

export const supabase = createClient(url, anon)

/**
 * Sunucu tarafı (API route) için Supabase client.
 * SUPABASE_SERVICE_ROLE_KEY varsa kullanır (chat_messages, patron_commands, ceo_tasks, celf_logs, audit_log yazmak için).
 * Yoksa anon key ile oku/yaz (RLS politikalarına tabi).
 */
export function getSupabaseServer(): SupabaseClient | null {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_KEY
  if (url && serviceKey) return createClient(url, serviceKey)
  if (url && anon) return createClient(url, anon)
  return null
}
