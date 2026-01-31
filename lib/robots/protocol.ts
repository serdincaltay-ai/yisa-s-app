/**
 * YİSA-S Birimler Arası Protokol Sistemi
 * 9 Aşamalı Üretim Süreci
 */

import { getSupabase } from '@/lib/supabase'

// 9 Aşamalı Üretim Süreci
export const PRODUCTION_STAGES = [
  { id: 1, name: 'TALEP', description: 'İstek alınır (Patron/Sistem)', nextStage: 2 },
  { id: 2, name: 'PLANLAMA', description: 'CEO görevi planlar', nextStage: 3 },
  { id: 3, name: 'DAGITIM', description: 'İlgili direktörlüğe atanır', nextStage: 4 },
  { id: 4, name: 'URETIM', description: 'Direktörlük çalışır', nextStage: 5 },
  { id: 5, name: 'KALITE', description: 'CELF denetimi', nextStage: 6 },
  { id: 6, name: 'GUVENLIK', description: 'Siber güvenlik kontrolü', nextStage: 7 },
  { id: 7, name: 'DEPOLAMA', description: 'Veri arşivleme', nextStage: 8 },
  { id: 8, name: 'ONAY', description: 'Patron onayı bekler', nextStage: 9 },
  { id: 9, name: 'YAYINLAMA', description: 'Canlıya alınır', nextStage: null }
]

// Mesaj Formatı
export interface ProtocolMessage {
  id: string
  from: string // ROB-CEO, ROB-CELF, etc.
  to: string
  type: 'GOREV' | 'RAPOR' | 'ONAY_TALEBI' | 'ONAY' | 'RED' | 'UYARI'
  payload: {
    taskId?: string
    stage: number
    content: string
    priority: 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL'
    dependencies?: string[]
  }
  timestamp: string
}

// Görev Durumları
export type TaskStatus = 'queued' | 'running' | 'success' | 'fail' | 'cancelled' | 'patron_review' | 'dlq'

// Protokol İşleyici
export class ProtocolHandler {
  private supabase = getSupabase()

  // Yeni görev oluştur (Aşama 1: TALEP)
  async createTask(params: {
    title: string
    description: string
    priority: 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL'
    assignedTo: string // Direktörlük kodu
    createdBy: string // ROB-PATRON, ROB-CEO, etc.
  }) {
    const { data, error } = await this.supabase
      .from('tasks')
      .insert({
        title: params.title,
        description: params.description,
        priority: params.priority,
        assigned_to: params.assignedTo,
        created_by: params.createdBy,
        stage: 1,
        status: 'queued',
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Görevi bir sonraki aşamaya taşı
  async advanceStage(taskId: string, currentStage: number) {
    const stage = PRODUCTION_STAGES.find(s => s.id === currentStage)
    if (!stage || !stage.nextStage) return null

    const { data, error } = await this.supabase
      .from('tasks')
      .update({ 
        stage: stage.nextStage,
        updated_at: new Date().toISOString()
      })
      .eq('id', taskId)
      .select()
      .single()

    if (error) throw error

    // Aşama 8'e gelince patron onayı bekle
    if (stage.nextStage === 8) {
      await this.supabase
        .from('tasks')
        .update({ status: 'patron_review' })
        .eq('id', taskId)
    }

    return data
  }

  // Patron onayı
  async patronApprove(taskId: string, approved: boolean, note?: string) {
    const status = approved ? 'success' : 'cancelled'
    const stage = approved ? 9 : 8

    const { data, error } = await this.supabase
      .from('tasks')
      .update({ 
        status,
        stage,
        patron_note: note,
        patron_reviewed_at: new Date().toISOString()
      })
      .eq('id', taskId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Bekleyen görevleri getir
  async getPendingTasks(status?: TaskStatus) {
    let query = this.supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query
    if (error) throw error
    return data || []
  }

  // Patron onayı bekleyen görevler
  async getPatronReviewTasks() {
    return this.getPendingTasks('patron_review')
  }

  // Direktörlük görevleri
  async getDirectorateTasks(directorate: string) {
    const { data, error } = await this.supabase
      .from('tasks')
      .select('*')
      .eq('assigned_to', directorate)
      .in('status', ['queued', 'running'])
      .order('priority', { ascending: false })

    if (error) throw error
    return data || []
  }

  // Görev istatistikleri
  async getTaskStats() {
    const { data, error } = await this.supabase
      .from('tasks')
      .select('status, stage')

    if (error) throw error

    const stats = {
      total: data?.length || 0,
      queued: data?.filter(t => t.status === 'queued').length || 0,
      running: data?.filter(t => t.status === 'running').length || 0,
      patronReview: data?.filter(t => t.status === 'patron_review').length || 0,
      success: data?.filter(t => t.status === 'success').length || 0,
      failed: data?.filter(t => t.status === 'fail').length || 0,
      byStage: PRODUCTION_STAGES.map(s => ({
        stage: s.name,
        count: data?.filter(t => t.stage === s.id).length || 0
      }))
    }

    return stats
  }
}

export const protocolHandler = new ProtocolHandler()
