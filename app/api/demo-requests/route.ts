import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'tesis'
}

/** Patron paneli: Demo taleplerini listele */
export async function GET() {
  try {
    const supabase = getSupabase()
    if (!supabase) return NextResponse.json({ items: [] })

    const { data, error } = await supabase
      .from('demo_requests')
      .select('id, name, email, phone, facility_type, city, notes, status, source, created_at, payment_status, payment_amount, payment_at, payment_notes')
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) return NextResponse.json({ items: [], error: error.message })
    return NextResponse.json({ items: data ?? [] })
  } catch (e) {
    console.error('[demo-requests] GET error:', e)
    return NextResponse.json({ items: [] })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Onay/Red — Patron panelinden
    const action = body.action as string | undefined
    if (action === 'decide') {
      const id = typeof body.id === 'string' ? body.id.trim() : ''
      const decision = body.decision as 'approve' | 'reject'
      if (!id || !['approve', 'reject'].includes(decision)) {
        return NextResponse.json({ error: 'id ve decision (approve|reject) gerekli.' }, { status: 400 })
      }
      const supabase = getSupabase()
      if (!supabase) return NextResponse.json({ error: 'Sunucu yapılandırma hatası.' }, { status: 500 })

      const { data: row } = await supabase.from('demo_requests').select('*').eq('id', id).single()
      if (!row) return NextResponse.json({ error: 'Talep bulunamadı.' }, { status: 404 })
      if (row.status !== 'new') {
        return NextResponse.json({ error: 'Bu talep zaten işlendi.' }, { status: 400 })
      }

      if (decision === 'reject') {
        await supabase.from('demo_requests').update({ status: 'rejected' }).eq('id', id)
        return NextResponse.json({ ok: true, message: 'Talep reddedildi.' })
      }

      // approve: tenant oluştur
      const baseName = row.name?.trim() || row.facility_type || 'Yeni Tesis'
      const cityPart = row.city ? ` ${row.city}` : ''
      const tenantName = `${baseName}${cityPart}`.trim() || 'Yeni Tesis'
      const baseSlug = slugify(tenantName)
      const slug = `${baseSlug}-${String(row.id).slice(0, 8)}`

      const { data: newTenant, error: insertErr } = await supabase
        .from('tenants')
        .insert({
          ad: tenantName,
          name: tenantName,
          slug,
          durum: 'aktif',
          owner_id: null,
          package_type: 'starter',
        } as Record<string, unknown>)
        .select('id')
        .single()

      if (insertErr) {
        console.error('[demo-requests] Tenant insert:', insertErr)
        return NextResponse.json({ error: 'Tenant oluşturulamadı: ' + insertErr.message }, { status: 500 })
      }

      const tenantId = newTenant?.id

      // E-posta ile kullanıcı var mı? Varsa user_tenants'a ata ve owner_id güncelle
      const reqEmail = (row.email ?? '').trim().toLowerCase()
      if (reqEmail && tenantId) {
        try {
          const { data: listData } = await supabase.auth.admin.listUsers({ perPage: 1000 })
          const existingUser = listData?.users?.find((u) => (u.email ?? '').toLowerCase() === reqEmail)
          if (existingUser) {
            await supabase.from('tenants').update({ owner_id: existingUser.id }).eq('id', tenantId)
            await supabase.from('user_tenants').upsert(
              { user_id: existingUser.id, tenant_id: tenantId, role: 'owner' },
              { onConflict: 'user_id,tenant_id' }
            )
          }
        } catch (_) {
          // Kullanıcı eşleştirme hatası - tenant yine de oluşturuldu
        }
      }

      await supabase.from('demo_requests').update({ status: 'converted' }).eq('id', id)
      return NextResponse.json({
        ok: true,
        message: 'Talep onaylandı, tenant oluşturuldu.',
        tenant_id: tenantId,
        slug,
      })
    }

    // Ödeme kaydı — Patron: "Merve ödedi" → bu talep için ödeme alındı işaretle
    if (action === 'record_payment') {
      const id = typeof body.id === 'string' ? body.id.trim() : ''
      const amount = typeof body.amount === 'number' ? body.amount : (typeof body.amount === 'string' ? parseFloat(body.amount) : undefined)
      const paidAt = typeof body.paid_at === 'string' ? body.paid_at : (body.paid_at ? new Date().toISOString() : undefined)
      const notes = typeof body.payment_notes === 'string' ? body.payment_notes.trim() : null
      if (!id) {
        return NextResponse.json({ error: 'id gerekli.' }, { status: 400 })
      }
      const supabase = getSupabase()
      if (!supabase) return NextResponse.json({ error: 'Sunucu yapılandırma hatası.' }, { status: 500 })
      const { data: row } = await supabase.from('demo_requests').select('id, status').eq('id', id).single()
      if (!row) return NextResponse.json({ error: 'Talep bulunamadı.' }, { status: 404 })
      const update: Record<string, unknown> = {
        payment_status: 'odendi',
        payment_at: paidAt ?? new Date().toISOString(),
      }
      if (amount != null && !Number.isNaN(amount)) update.payment_amount = amount
      if (notes != null) update.payment_notes = notes
      const { error: updErr } = await supabase.from('demo_requests').update(update).eq('id', id)
      if (updErr) return NextResponse.json({ error: updErr.message }, { status: 500 })
      return NextResponse.json({ ok: true, message: 'Ödeme kaydedildi.' })
    }

    // Yeni demo talebi (form gönderimi)
    const name = typeof body.name === 'string' ? body.name.trim() : ''
    const email = typeof body.email === 'string' ? body.email.trim() : ''
    const phone = typeof body.phone === 'string' ? body.phone.trim() : null
    const facilityType = typeof body.facility_type === 'string' ? body.facility_type.trim() : null
    const city = typeof body.city === 'string' ? body.city.trim() : null
    const notes = typeof body.notes === 'string' ? body.notes.trim() : null
    const source = typeof body.source === 'string' ? body.source : 'www'

    if (!name || !email) {
      return NextResponse.json({ error: 'Ad ve e-posta zorunludur.' }, { status: 400 })
    }

    const supabase = getSupabase()
    if (!supabase) {
      return NextResponse.json({ error: 'Sunucu yapılandırma hatası.' }, { status: 500 })
    }
    const { data, error } = await supabase
      .from('demo_requests')
      .insert({
        name,
        email,
        phone: phone || null,
        facility_type: facilityType || null,
        city: city || null,
        notes: notes || null,
        source: ['www', 'demo', 'fiyatlar', 'vitrin'].includes(source) ? source : 'www',
      })
      .select('id')
      .single()

    if (error) {
      console.error('[demo-requests] Insert error:', error)
      return NextResponse.json({ error: 'Kayıt sırasında hata oluştu.' }, { status: 500 })
    }

    return NextResponse.json({ ok: true, id: data?.id })
  } catch (e) {
    console.error('[demo-requests] Error:', e)
    return NextResponse.json({ error: 'Sunucu hatası.' }, { status: 500 })
  }
}
