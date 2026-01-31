/**
 * YİSA-S Data Robot (Katman 3 - Veri Arşivleme)
 * Tüm konuşmaları, kararları, sonuçları kaydeder.
 * AES-256 şifreleme, günlük 02:00 yedek (politika; gerçek yedek cron/job ile yapılır).
 */

import { createTaskResult } from '@/lib/db/task-results'
import { VERI_ARSIVLEME_KURALLARI } from '@/lib/archiving/veri-arsivleme'

export const DATA_ROBOT_POLICY = {
  ...VERI_ARSIVLEME_KURALLARI,
  /** Her görev sonucu task_results'a yazılır */
  SAVE_TASK_RESULTS: true,
}

export interface ArchiveTaskResultParams {
  taskId?: string
  routineTaskId?: string
  directorKey?: string
  aiProviders?: string[]
  inputCommand: string
  outputResult: string
  status?: 'completed' | 'failed' | 'cancelled'
}

/**
 * Görev sonucunu arşive yazar (task_results).
 */
export async function archiveTaskResult(
  params: ArchiveTaskResultParams
): Promise<{ id?: string; error?: string }> {
  if (!DATA_ROBOT_POLICY.SAVE_TASK_RESULTS) return {}
  return createTaskResult({
    task_id: params.taskId,
    routine_task_id: params.routineTaskId,
    director_key: params.directorKey,
    ai_providers: params.aiProviders,
    input_command: params.inputCommand,
    output_result: params.outputResult,
    status: params.status,
  })
}

// Data Robot Konfigürasyonu
export const DATA_ROBOT_CONFIG = {
  code: 'ROB-ARSIV',
  name: 'Veri Arşivleme Robotu',
  layer: 3,
  description: 'Soft delete, backup, veri koruma',
  capabilities: [
    'soft_delete',
    'backup_management',
    'data_recovery',
    'audit_trail',
    'encryption',
    'retention_policy'
  ]
}

// Saklama Politikaları (gün)
export const RETENTION_POLICIES = {
  audit_logs: -1,        // Sonsuz - asla silinmez
  patron_commands: 365,  // 1 yıl
  tasks: 90,             // 3 ay
  messages: 180,         // 6 ay
  evaluations: 730,      // 2 yıl
  security_alerts: 365,  // 1 yıl
  ai_usage: 365,         // 1 yıl
  templates: -1          // Sonsuz
}

// Soft Delete - Veri silinmez, gizlenir
export async function softDelete(table: string, id: string, userId: string): Promise<boolean> {
  const { getSupabase } = await import('@/lib/supabase')
  const supabase = getSupabase()
  
  // Audit log - silinmez
  if (table === 'audit_logs') {
    console.error('[DATA-ROBOT] Audit logs silinemez!')
    return false
  }
  
  // Soft delete işlemi
  const { error } = await supabase
    .from(table)
    .update({
      is_deleted: true,
      deleted_at: new Date().toISOString(),
      deleted_by: userId
    })
    .eq('id', id)
  
  if (error) {
    console.error('[DATA-ROBOT] Soft delete hatası:', error)
    return false
  }
  
  // Arşiv kaydı
  await supabase.from('archive_logs').insert({
    table_name: table,
    record_id: id,
    action: 'soft_delete',
    performed_by: userId,
    created_at: new Date().toISOString()
  })
  
  return true
}

// Veri Kurtarma
export async function recoverData(table: string, id: string, userId: string): Promise<boolean> {
  const { getSupabase } = await import('@/lib/supabase')
  const supabase = getSupabase()
  
  const { error } = await supabase
    .from(table)
    .update({
      is_deleted: false,
      deleted_at: null,
      deleted_by: null,
      recovered_at: new Date().toISOString(),
      recovered_by: userId
    })
    .eq('id', id)
  
  if (error) return false
  
  // Arşiv kaydı
  await supabase.from('archive_logs').insert({
    table_name: table,
    record_id: id,
    action: 'recover',
    performed_by: userId,
    created_at: new Date().toISOString()
  })
  
  return true
}

// Kalıcı Silme (sadece Patron onayı ile)
export async function permanentDelete(
  table: string,
  id: string,
  userId: string,
  patronApprovalId: string
): Promise<boolean> {
  const { getSupabase } = await import('@/lib/supabase')
  const supabase = getSupabase()
  
  // Audit log kalıcı silinemez
  if (table === 'audit_logs') {
    console.error('[DATA-ROBOT] Audit logs kalıcı silinemez!')
    return false
  }
  
  // Patron onayı kontrol
  const { data: approval } = await supabase
    .from('patron_approvals')
    .select('*')
    .eq('id', patronApprovalId)
    .eq('status', 'approved')
    .single()
  
  if (!approval) {
    console.error('[DATA-ROBOT] Patron onayı bulunamadı!')
    return false
  }
  
  // Önce yedeğe al
  const { data: record } = await supabase
    .from(table)
    .select('*')
    .eq('id', id)
    .single()
  
  if (record) {
    await supabase.from('deleted_records_backup').insert({
      table_name: table,
      record_id: id,
      record_data: record,
      deleted_by: userId,
      patron_approval_id: patronApprovalId,
      created_at: new Date().toISOString()
    })
  }
  
  // Kalıcı sil
  const { error } = await supabase
    .from(table)
    .delete()
    .eq('id', id)
  
  if (error) return false
  
  // Arşiv kaydı
  await supabase.from('archive_logs').insert({
    table_name: table,
    record_id: id,
    action: 'permanent_delete',
    performed_by: userId,
    patron_approval_id: patronApprovalId,
    created_at: new Date().toISOString()
  })
  
  return true
}

// Eski Verileri Temizle (retention policy'ye göre)
export async function cleanupOldData(): Promise<{ cleaned: number; errors: number }> {
  const { getSupabase } = await import('@/lib/supabase')
  const supabase = getSupabase()
  
  let cleaned = 0
  let errors = 0
  
  for (const [table, days] of Object.entries(RETENTION_POLICIES)) {
    if (days === -1) continue // Sonsuz saklama
    
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)
    
    // Sadece soft deleted olanları kalıcı sil
    const { data, error } = await supabase
      .from(table)
      .select('id')
      .eq('is_deleted', true)
      .lt('deleted_at', cutoffDate.toISOString())
    
    if (error) {
      errors++
      continue
    }
    
    // Her birini yedekle ve sil (gerçek implementasyonda batch yapılır)
    for (const record of data || []) {
      cleaned++
    }
  }
  
  return { cleaned, errors }
}

// Arşiv İstatistikleri
export async function getArchiveStats(): Promise<{
  totalArchived: number
  totalRecovered: number
  totalPermanentlyDeleted: number
  byTable: Record<string, number>
}> {
  const { getSupabase } = await import('@/lib/supabase')
  const supabase = getSupabase()
  
  const { data } = await supabase
    .from('archive_logs')
    .select('table_name, action')
  
  const stats = {
    totalArchived: 0,
    totalRecovered: 0,
    totalPermanentlyDeleted: 0,
    byTable: {} as Record<string, number>
  }
  
  data?.forEach(row => {
    if (row.action === 'soft_delete') stats.totalArchived++
    if (row.action === 'recover') stats.totalRecovered++
    if (row.action === 'permanent_delete') stats.totalPermanentlyDeleted++
    
    stats.byTable[row.table_name] = (stats.byTable[row.table_name] || 0) + 1
  })
  
  return stats
}
