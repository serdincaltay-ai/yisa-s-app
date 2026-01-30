/**
 * CEO görevleri, CELF logları, Patron komutları - Supabase yazma.
 * API route'lardan çağrılır.
 */

import { getSupabaseServer } from '@/lib/supabase'

/** Aynı kullanıcı için bekleyen (henüz tamamlanmamış) CEO görevi sayısı. Tek bekleyen iş kuralı için. */
const PENDING_STATUSES = ['pending', 'assigned', 'celf_running', 'awaiting_approval']

export async function getPendingCeoTaskCount(userId: string | undefined): Promise<{ count: number; error?: string }> {
  if (!userId) return { count: 0 }
  const db = getSupabaseServer()
  if (!db) return { count: 0, error: 'Supabase bağlantısı yok' }
  const { count, error } = await db
    .from('ceo_tasks')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .in('status', PENDING_STATUSES)
  if (error) return { count: 0, error: error.message }
  return { count: count ?? 0 }
}

/** Aynı user_id + idempotency_key ile mevcut task var mı (retry/idempotency için). */
export async function getCeoTaskByUserAndIdempotency(
  userId: string | undefined,
  idempotencyKey: string
): Promise<{ id?: string; error?: string }> {
  if (!userId || !idempotencyKey) return {}
  const db = getSupabaseServer()
  if (!db) return { error: 'Supabase bağlantısı yok' }
  const { data, error } = await db
    .from('ceo_tasks')
    .select('id')
    .eq('user_id', userId)
    .eq('idempotency_key', idempotencyKey)
    .limit(1)
    .maybeSingle()
  if (error) return { error: error.message }
  return { id: data?.id }
}

export async function createCeoTask(params: {
  user_id?: string
  task_description: string
  task_type: string
  director_key: string | null
  idempotency_key?: string
}): Promise<{ id?: string; error?: string }> {
  const db = getSupabaseServer()
  if (!db) return { error: 'Supabase bağlantısı yok' }

  const idempotencyKey = params.idempotency_key?.trim() || undefined

  if (idempotencyKey && params.user_id) {
    const existing = await getCeoTaskByUserAndIdempotency(params.user_id, idempotencyKey)
    if (existing.error) return { error: existing.error }
    if (existing.id) return { id: existing.id }
  }

  const insertPayload = {
    user_id: params.user_id ?? null,
    task_description: params.task_description,
    task_type: params.task_type,
    director_key: params.director_key,
    status: 'assigned' as const,
    ...(idempotencyKey && { idempotency_key: idempotencyKey }),
  }

  const { error, data } = await db
    .from('ceo_tasks')
    .insert(insertPayload)
    .select('id')
    .single()

  if (error) {
    if (error.code === '23505' && idempotencyKey && params.user_id) {
      const existing = await getCeoTaskByUserAndIdempotency(params.user_id, idempotencyKey)
      if (existing.id) return { id: existing.id }
    }
    return { error: error.message }
  }
  return { id: data?.id }
}

export async function updateCeoTask(
  id: string,
  updates: { status?: string; result_payload?: Record<string, unknown>; patron_command_id?: string }
): Promise<{ error?: string }> {
  const db = getSupabaseServer()
  if (!db) return { error: 'Supabase bağlantısı yok' }

  const { error } = await db.from('ceo_tasks').update(updates).eq('id', id)
  return error ? { error: error.message } : {}
}

export async function insertCelfLog(params: {
  ceo_task_id?: string
  director_key: string
  action?: string
  input_summary?: string
  output_summary?: string
  payload?: Record<string, unknown>
}): Promise<{ id?: string; error?: string }> {
  const db = getSupabaseServer()
  if (!db) return { error: 'Supabase bağlantısı yok' }

  const { error, data } = await db
    .from('celf_logs')
    .insert({
      ceo_task_id: params.ceo_task_id ?? null,
      director_key: params.director_key,
      action: params.action ?? null,
      input_summary: params.input_summary ?? null,
      output_summary: params.output_summary ?? null,
      payload: params.payload ?? {},
    })
    .select('id')
    .single()

  if (error) return { error: error.message }
  return { id: data?.id }
}

export async function createPatronCommand(params: {
  user_id?: string
  command: string
  ceo_task_id?: string
  output_payload?: Record<string, unknown>
}): Promise<{ id?: string; error?: string }> {
  const db = getSupabaseServer()
  if (!db) return { error: 'Supabase bağlantısı yok' }

  const { error, data } = await db
    .from('patron_commands')
    .insert({
      user_id: params.user_id ?? null,
      command: params.command,
      status: 'pending',
      ceo_task_id: params.ceo_task_id ?? null,
      output_payload: params.output_payload ?? {},
    })
    .select('id')
    .single()

  if (error) return { error: error.message }
  return { id: data?.id }
}

export async function getPatronCommand(id: string): Promise<{
  command?: string
  output_payload?: Record<string, unknown>
  ceo_task_id?: string | null
  error?: string
}> {
  const db = getSupabaseServer()
  if (!db) return { error: 'Supabase bağlantısı yok' }

  const { data, error } = await db
    .from('patron_commands')
    .select('command, output_payload, ceo_task_id')
    .eq('id', id)
    .single()

  if (error) return { error: error.message }
  return {
    command: data?.command as string | undefined,
    output_payload: (data?.output_payload as Record<string, unknown>) ?? {},
    ceo_task_id: data?.ceo_task_id as string | null | undefined,
  }
}

export async function updatePatronCommand(
  id: string,
  updates: { status: string; decision?: string; decision_at?: string; modify_text?: string }
): Promise<{ error?: string }> {
  const db = getSupabaseServer()
  if (!db) return { error: 'Supabase bağlantısı yok' }

  const { error } = await db.from('patron_commands').update(updates).eq('id', id)
  return error ? { error: error.message } : {}
}

export async function insertAuditLog(params: {
  action: string
  entity_type?: string
  entity_id?: string
  user_id?: string
  payload?: Record<string, unknown>
}): Promise<{ id?: string; error?: string }> {
  const db = getSupabaseServer()
  if (!db) return { error: 'Supabase bağlantısı yok' }

  const { error, data } = await db
    .from('audit_log')
    .insert({
      action: params.action,
      entity_type: params.entity_type ?? null,
      entity_id: params.entity_id ?? null,
      user_id: params.user_id ?? null,
      payload: params.payload ?? {},
    })
    .select('id')
    .single()

  if (error) return { error: error.message }
  return { id: data?.id }
}
