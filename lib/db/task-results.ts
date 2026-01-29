/**
 * YİSA-S Görev Sonuçları - task_results (Veri Arşivleme Katman 3)
 * Tüm görev çıktıları kaydedilir.
 */

import { getSupabaseServer } from '@/lib/supabase'

export type TaskResultStatus = 'completed' | 'failed' | 'cancelled'

export interface CreateTaskResultParams {
  task_id?: string
  routine_task_id?: string
  director_key?: string
  ai_providers?: string[]
  input_command: string
  output_result: string
  status?: TaskResultStatus
}

export async function createTaskResult(
  params: CreateTaskResultParams
): Promise<{ id?: string; error?: string }> {
  const db = getSupabaseServer()
  if (!db) return { error: 'Supabase bağlantısı yok' }

  const { error, data } = await db
    .from('task_results')
    .insert({
      task_id: params.task_id ?? null,
      routine_task_id: params.routine_task_id ?? null,
      director_key: params.director_key ?? null,
      ai_providers: params.ai_providers ?? [],
      input_command: params.input_command,
      output_result: params.output_result,
      status: params.status ?? 'completed',
    })
    .select('id')
    .single()

  if (error) return { error: error.message }
  return { id: data?.id }
}

export async function getTaskResultsByTaskId(taskId: string): Promise<{
  data?: { id: string; output_result: string; status: string; created_at: string }[]
  error?: string
}> {
  const db = getSupabaseServer()
  if (!db) return { error: 'Supabase bağlantısı yok' }

  const { data, error } = await db
    .from('task_results')
    .select('id, output_result, status, created_at')
    .eq('task_id', taskId)
    .order('created_at', { ascending: false })
  if (error) return { error: error.message }
  return { data: (data ?? []) as { id: string; output_result: string; status: string; created_at: string }[] }
}
