import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const body = await req.json()
    const title = typeof body.title === 'string' ? body.title.trim() : ''
    const description = typeof body.description === 'string' ? body.description.trim() : null
    const priority = typeof body.priority === 'string' && ['low', 'medium', 'high', 'critical'].includes(body.priority) ? body.priority : 'medium'
    const source = typeof body.source === 'string' ? body.source.trim() : 'chat-widget'

    if (!title) {
      return NextResponse.json({ error: 'Gorev basligi zorunludur' }, { status: 400 })
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) {
      return NextResponse.json({ error: 'Sunucu yapilandirma hatasi' }, { status: 500 })
    }

    const service = createServiceClient(url, key)

    // Find or create default epic for manual tasks
    let epicId: string | null = null
    const { data: existingEpic } = await service
      .from('celf_epics')
      .select('id')
      .eq('name', 'Manuel Gorevler')
      .limit(1)
      .maybeSingle()

    if (existingEpic) {
      epicId = existingEpic.id
    } else {
      const { data: newEpic } = await service
        .from('celf_epics')
        .insert({ name: 'Manuel Gorevler', description: 'Chat widget ve manuel olusturulan gorevler' })
        .select('id')
        .single()
      epicId = newEpic?.id ?? null
    }

    const insertData: Record<string, unknown> = {
      title,
      description,
      priority,
      status: 'queued',
      source,
      created_by: user?.id ?? null,
    }
    if (epicId) insertData.epic_id = epicId

    const { data, error } = await service
      .from('celf_tasks')
      .insert(insertData)
      .select('id, title, status, created_at')
      .single()

    if (error) {
      console.error('[celf/tasks POST]', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true, task: data })
  } catch (e) {
    console.error('[celf/tasks POST]', e)
    return NextResponse.json({ error: 'Sunucu hatasi' }, { status: 500 })
  }
}
