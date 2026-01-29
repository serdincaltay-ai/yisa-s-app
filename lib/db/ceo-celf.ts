/**
 * CEO görevleri, CELF logları, Patron komutları - Supabase yazma.
 * API route'lardan çağrılır.
 */

import { getSupabaseServer } from '@/lib/supabase'

export async function createCeoTask(params: {
  user_id?: string
  task_description: string
  task_type: string
  director_key: string | null
}): Promise<{ id?: string; error?: string }> {
  const db = getSupabaseServer()
  if (!db) return { error: 'Supabase bağlantısı yok' }

  const { error, data } = await db
    .from('ceo_tasks')
    .insert({
      user_id: params.user_id ?? null,
      task_description: params.task_description,
      task_type: params.task_type,
      director_key: params.director_key,
      status: 'assigned',
    })
    .select('id')
    .single()

  if (error) return { error: error.message }
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
  error?: string
}> {
  const db = getSupabaseServer()
  if (!db) return { error: 'Supabase bağlantısı yok' }

  const { data, error } = await db
    .from('patron_commands')
    .select('command, output_payload')
    .eq('id', id)
    .single()

  if (error) return { error: error.message }
  return {
    command: data?.command as string | undefined,
    output_payload: (data?.output_payload as Record<string, unknown>) ?? {},
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
