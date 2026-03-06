/**
 * Vitest global setup
 * Mock environment variables so modules that read process.env at import time work.
 */

process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://mock.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'mock-anon-key'
process.env.SUPABASE_SERVICE_ROLE_KEY = 'mock-service-role-key'
