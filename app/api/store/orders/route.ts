/**
 * POST /api/store/orders — Mağaza sipariş oluştur
 * GET /api/store/orders — Sipariş listesi (Patron)
 * V3.0 Mimari: Bölüm 1.6 (Mağaza + Tenant Yönetimi)
 *
 * Akış: Sipariş → Ödeme → Tenant oluştur → Robot kur → Aktif
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServer } from '@/lib/supabase'
import { installRobotsForTenant } from '@/lib/db/tenant-robots'
import { insertAuditLog } from '@/lib/db/ceo-celf'

export async function POST(req: NextRequest) {
  try {
    const db = getSupabaseServer()
    if (!db) return NextResponse.json({ error: 'Veritabanı bağlantısı yok' }, { status: 503 })

    const body = await req.json()
    const { product_id, customer_name, customer_email, customer_phone, payment_method } = body

    if (!product_id || !customer_email) {
      return NextResponse.json({ error: 'product_id ve customer_email zorunludur.' }, { status: 400 })
    }

    // Ürün bilgilerini al
    const { data: product, error: productErr } = await db
      .from('store_products')
      .select('id, name, price_cents, category, includes, robot_configs')
      .eq('id', product_id)
      .eq('is_active', true)
      .single()

    if (productErr || !product) {
      return NextResponse.json({ error: 'Ürün bulunamadı veya aktif değil.' }, { status: 404 })
    }

    // Sipariş oluştur
    const { data: order, error: orderErr } = await db
      .from('store_orders')
      .insert({
        product_id,
        customer_name: customer_name ?? null,
        customer_email,
        customer_phone: customer_phone ?? null,
        status: 'pending',
        amount_cents: product.price_cents,
        currency: 'USD',
        payment_method: payment_method ?? null,
      })
      .select('id')
      .single()

    if (orderErr) return NextResponse.json({ error: orderErr.message }, { status: 500 })

    // Satın alma sayısını artır
    await db.rpc('increment_field', {
      table_name: 'store_products',
      field_name: 'purchase_count',
      row_id: product_id,
    }).then(() => {}).catch(() => {
      // Eğer RPC yoksa manual update
      db.from('store_products')
        .update({ purchase_count: (product.purchase_count ?? 0) + 1 })
        .eq('id', product_id)
    })

    await insertAuditLog({
      action: 'store_order_created',
      entity_type: 'store_order',
      entity_id: order?.id,
      payload: { product_id, customer_email, amount_cents: product.price_cents },
    })

    return NextResponse.json({
      ok: true,
      order_id: order?.id,
      amount_cents: product.price_cents,
      message: 'Sipariş oluşturuldu. Ödeme bekleniyor.',
    })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    )
  }
}

/** GET /api/store/orders — Patron tüm siparişleri görür */
export async function GET(req: NextRequest) {
  try {
    const db = getSupabaseServer()
    if (!db) return NextResponse.json({ error: 'Veritabanı bağlantısı yok' }, { status: 503 })

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100)

    let query = db
      .from('store_orders')
      .select('*, store_products(name, category)')

    if (status) query = query.eq('status', status)

    const { data, error } = await query
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ ok: true, orders: data ?? [] })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    )
  }
}
