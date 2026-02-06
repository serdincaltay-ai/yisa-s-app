/**
 * GET /api/store/products — Mağaza ürün kataloğu (herkese açık)
 * POST /api/store/products — Yeni ürün ekle (sadece Patron)
 * V3.0 Mimari: Bölüm 1.6 (Mağaza)
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServer } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  try {
    const db = getSupabaseServer()
    if (!db) return NextResponse.json({ error: 'Veritabanı bağlantısı yok' }, { status: 503 })

    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured') === 'true'
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100)

    let query = db
      .from('store_products')
      .select('id, name, description, category, subcategory, price_cents, currency, is_free, includes, thumbnail_url, preview_urls, demo_available, view_count, purchase_count, is_featured, created_at')
      .eq('is_active', true)

    if (category) query = query.eq('category', category)
    if (featured) query = query.eq('is_featured', true)

    const { data, error } = await query
      .order('is_featured', { ascending: false })
      .order('purchase_count', { ascending: false })
      .limit(limit)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({
      ok: true,
      products: data ?? [],
      count: data?.length ?? 0,
    })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    )
  }
}
