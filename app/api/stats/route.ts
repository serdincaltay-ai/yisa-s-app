import { NextResponse } from 'next/server'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export interface StatsPayload {
  athletes: number
  coaches: number
  revenueMonth: number
  demoRequests: number
}

const DEFAULT: StatsPayload = {
  athletes: 0,
  coaches: 0,
  revenueMonth: 0,
  demoRequests: 0,
}

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

async function count(
  table: string,
  supabase: SupabaseClient
): Promise<{ n: number; ok: boolean }> {
  const { count, error } = await supabase
    .from(table)
    .select('*', { count: 'exact', head: true })
  if (error) return { n: 0, ok: false }
  return { n: count ?? 0, ok: true }
}

async function revenueThisMonth(supabase: SupabaseClient): Promise<number> {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), 1)
  const startStr = start.toISOString().slice(0, 10)

  const tables = ['payments', 'transactions', 'subscriptions']
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('amount, total, price, created_at')
      if (error) continue
      if (!Array.isArray(data)) continue
      const numKey = data[0] && typeof data[0] === 'object' && data[0] !== null
        ? ['amount', 'total', 'price'].find((k) => k in (data[0] as object))
        : null
      if (!numKey) continue
      let sum = 0
      for (const row of data) {
        const r = row as Record<string, unknown>
        const d = r.created_at ?? r.createdAt
        const dateStr = typeof d === 'string' ? d.slice(0, 10) : ''
        if (dateStr >= startStr) {
          const v = Number(r[numKey])
          if (!Number.isNaN(v)) sum += v
        }
      }
      return sum
    } catch {
      continue
    }
  }
  return 0
}

export async function GET() {
  try {
    const supabase = getSupabase()
    if (!supabase) {
      return NextResponse.json(DEFAULT)
    }

    const athletesTables = ['athletes', 'athlete', 'sporcular', 'profiles']
    const coachesTables = ['coaches', 'coach', 'antrenorler', 'trainers']
    const demoTables = ['demo_requests', 'demo_talepleri', 'leads']

    let athletes = 0
    let coaches = 0
    let demoRequests = 0

    for (const t of athletesTables) {
      const { n, ok } = await count(t, supabase)
      athletes = n
      if (ok) break
    }
    for (const t of coachesTables) {
      const { n, ok } = await count(t, supabase)
      coaches = n
      if (ok) break
    }
    for (const t of demoTables) {
      const { n, ok } = await count(t, supabase)
      demoRequests = n
      if (ok) break
    }

    const revenueMonth = await revenueThisMonth(supabase)

    return NextResponse.json({
      athletes,
      coaches,
      revenueMonth: Math.round(revenueMonth),
      demoRequests,
    } satisfies StatsPayload)
  } catch {
    return NextResponse.json(DEFAULT)
  }
}
