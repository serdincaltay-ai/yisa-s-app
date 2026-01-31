/**
 * YİSA-S Supabase Client
 * URL ve anon key .env.local üzerinden okunur.
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

// Supabase client - environment variable'lar yoksa mock client döner
export const supabase = url && anon 
  ? createClient(url, anon)
  : createMockClient()

// Supabase bağlantısının aktif olup olmadığını kontrol et
export const isSupabaseConfigured = Boolean(url && anon)

// Mock client - Supabase yapılandırılmadığında hata vermeden çalışır
function createMockClient(): SupabaseClient {
  const mockResponse = { data: null, error: { message: 'Supabase yapılandırılmamış. NEXT_PUBLIC_SUPABASE_URL ve NEXT_PUBLIC_SUPABASE_ANON_KEY tanımlayın.' } }
  const mockAuthResponse = { data: { user: null, session: null }, error: null }
  
  return {
    auth: {
      getUser: async () => mockAuthResponse,
      getSession: async () => mockAuthResponse,
      signInWithPassword: async () => mockResponse,
      signOut: async () => ({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    from: () => ({
      select: () => ({ data: [], error: null, then: (fn: (v: { data: never[], error: null }) => void) => fn({ data: [], error: null }) }),
      insert: () => mockResponse,
      update: () => mockResponse,
      delete: () => mockResponse,
      upsert: () => mockResponse,
    }),
  } as unknown as SupabaseClient
}

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
