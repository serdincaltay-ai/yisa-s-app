/**
 * YiSA-S IS AKIS MOTORU
 * 
 * AKIS: Patron/Sistem → Asistan → Siber → CEO → CELF → COO → Vitrin → Veritabani
 * 
 * 9 Asamali Urun Sureci:
 * 1. TALEP - Patron veya sistem is ister
 * 2. PLANLAMA - CEO gorevi planlar
 * 3. DAGITIM - CEO ilgili direktorluge atar
 * 4. URETIM - Direktorluk AI ile uretir
 * 5. KALITE - CELF kontrol eder
 * 6. GUVENLIK - Siber robot tarar
 * 7. DEPOLAMA - Veri robotu kaydeder
 * 8. ONAY - Patron onaylar
 * 9. YAYINLAMA - COO/Vitrin sunar
 */

import { getSupabase } from '@/lib/supabase'

// Robot Kodlari
export const ROBOTS = {
  PATRON: 'ROB-PATRON',
  ASISTAN: 'ROB-ASISTAN',
  SIBER: 'ROB-SIBER',
  ARSIV: 'ROB-ARSIV',
  CEO: 'ROB-CEO',
  CELF: 'ROB-CELF',
  COO: 'ROB-COO',
  VITRIN: 'ROB-VITRIN'
} as const

// Is Durumu
export type TaskStatus = 
  | 'talep'      // 1. Patron istedi
  | 'planlama'   // 2. CEO planliyor
  | 'dagitim'    // 3. CEO dagitiyor
  | 'uretim'     // 4. Direktorluk uretiyor
  | 'kalite'     // 5. CELF kontrol
  | 'guvenlik'   // 6. Siber tarama
  | 'depolama'   // 7. Veritabani kayit
  | 'onay'       // 8. Patron onay bekliyor
  | 'yayinlama'  // 9. Satis/Vitrine sunuldu
  | 'tamamlandi' // Bitti
  | 'reddedildi' // Patron reddetti
  | 'hata'       // Hata olustu

// Is Tipi
export type TaskType = 
  | 'sablon'        // COO magaza icin sablon
  | 'rapor'         // Veri analizi
  | 'icerik'        // Pazarlama icerigi
  | 'belge'         // Hukuk belgesi
  | 'grafik'        // Sporcu grafigi
  | 'degerlendirme' // Sporcu degerlendirme
  | 'finansal'      // Muhasebe isi
  | 'teknik'        // Sistem isi
  | 'ozel'          // Patron ozel istek

// Gorev Yapisi
export interface WorkflowTask {
  id: string
  type: TaskType
  title: string
  description: string
  status: TaskStatus
  currentRobot: string
  createdBy: string
  tenantId?: string
  directorate?: string
  priority: 'low' | 'normal' | 'high' | 'urgent'
  input: Record<string, unknown>
  output?: Record<string, unknown>
  history: TaskHistoryEntry[]
  createdAt: string
  updatedAt: string
}

interface TaskHistoryEntry {
  robot: string
  status: TaskStatus
  message: string
  timestamp: string
  duration?: number
}

// ==================== ANA WORKFLOW MOTORU ====================

export class WorkflowEngine {
  
  /**
   * 1. TALEP - Yeni is olustur
   */
  static async createTask(params: {
    type: TaskType
    title: string
    description: string
    createdBy: string
    tenantId?: string
    priority?: 'low' | 'normal' | 'high' | 'urgent'
    input?: Record<string, unknown>
  }): Promise<{ taskId: string; error?: string }> {
    const supabase = getSupabase()
    
    const task: Partial<WorkflowTask> = {
      type: params.type,
      title: params.title,
      description: params.description,
      status: 'talep',
      currentRobot: ROBOTS.ASISTAN,
      createdBy: params.createdBy,
      tenantId: params.tenantId,
      priority: params.priority || 'normal',
      input: params.input || {},
      history: [{
        robot: ROBOTS.PATRON,
        status: 'talep',
        message: `Gorev olusturuldu: ${params.title}`,
        timestamp: new Date().toISOString()
      }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    const { data, error } = await supabase
      .from('workflow_tasks')
      .insert(task)
      .select('id')
      .single()
    
    if (error) {
      // Tablo yoksa tasks tablosunu kullan
      const { data: fallback, error: fallbackError } = await supabase
        .from('tasks')
        .insert({
          title: params.title,
          description: params.description,
          status: 'queued',
          type: params.type,
          priority: params.priority || 'normal',
          metadata: { workflow: task }
        })
        .select('id')
        .single()
      
      if (fallbackError) return { taskId: '', error: fallbackError.message }
      return { taskId: fallback.id }
    }
    
    return { taskId: data.id }
  }
  
  /**
   * 2. PLANLAMA - CEO gorevi planlar
   */
  static async planTask(taskId: string): Promise<{ success: boolean; directorate?: string; error?: string }> {
    const supabase = getSupabase()
    
    // Gorevi al
    const { data: task } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .single()
    
    if (!task) return { success: false, error: 'Gorev bulunamadi' }
    
    // Gorev tipine gore direktorluk belirle
    const directorateMap: Record<TaskType, string> = {
      sablon: 'CPO',      // Urun Direktorlugu
      rapor: 'CDO',       // Veri Direktorlugu
      icerik: 'CMO',      // Pazarlama
      belge: 'CLO',       // Hukuk
      grafik: 'CMDO',     // Medya
      degerlendirme: 'CSPO', // Sportif
      finansal: 'CFO',    // Finans
      teknik: 'CTO',      // Teknoloji
      ozel: 'CPO'         // Varsayilan
    }
    
    const directorate = directorateMap[task.type as TaskType] || 'CPO'
    
    // Guncelle
    await supabase
      .from('tasks')
      .update({
        status: 'running',
        assigned_to: directorate,
        metadata: {
          ...task.metadata,
          workflow_status: 'planlama',
          current_robot: ROBOTS.CEO
        }
      })
      .eq('id', taskId)
    
    return { success: true, directorate }
  }
  
  /**
   * 3. DAGITIM - CEO direktorluge atar
   */
  static async distributeTask(taskId: string, directorate: string): Promise<{ success: boolean }> {
    const supabase = getSupabase()
    
    await supabase
      .from('tasks')
      .update({
        assigned_to: directorate,
        metadata: {
          workflow_status: 'dagitim',
          current_robot: ROBOTS.CELF,
          distributed_at: new Date().toISOString()
        }
      })
      .eq('id', taskId)
    
    return { success: true }
  }
  
  /**
   * 4. URETIM - Direktorluk AI ile uretir
   */
  static async produceContent(taskId: string): Promise<{ success: boolean; output?: unknown }> {
    const supabase = getSupabase()
    const { routeToAI } = await import('@/lib/ai/router')
    
    const { data: task } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .single()
    
    if (!task) return { success: false }
    
    // AI ile uret
    const result = await routeToAI({
      directorate: task.assigned_to || 'CPO',
      taskType: task.type || 'ozel',
      prompt: task.description || '',
      tenantId: task.tenant_id || 'system'
    })
    
    // Sonucu kaydet
    const metadata = (task.metadata || {}) as Record<string, unknown>
    await supabase
      .from('tasks')
      .update({
        result: result.response,
        metadata: {
          ...metadata,
          workflow_status: 'uretim',
          ai_used: result.aiUsed,
          tokens: { input: result.inputTokens, output: result.outputTokens },
          cost: result.cost,
          produced_at: new Date().toISOString()
        }
      })
      .eq('id', taskId)
    
    return { success: true, output: result }
  }
  
  /**
   * 5. KALITE - CELF kontrol eder
   */
  static async qualityCheck(taskId: string): Promise<{ passed: boolean; issues?: string[] }> {
    const supabase = getSupabase()
    
    const { data: task } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .single()
    
    if (!task || !task.result) return { passed: false, issues: ['Urun bulunamadi'] }
    
    const issues: string[] = []
    
    // Basit kalite kontrolleri
    if (typeof task.result === 'string') {
      if (task.result.length < 10) issues.push('Icerik cok kisa')
      if (task.result.includes('hata') || task.result.includes('error')) issues.push('Hata iceriyor olabilir')
    }
    
    const passed = issues.length === 0
    
    const qcMetadata = (task.metadata || {}) as Record<string, unknown>
    await supabase
      .from('tasks')
      .update({
        metadata: {
          ...qcMetadata,
          workflow_status: 'kalite',
          quality_check: { passed, issues },
          checked_at: new Date().toISOString()
        }
      })
      .eq('id', taskId)
    
    return { passed, issues }
  }
  
  /**
   * 6. GUVENLIK - Siber robot tarar
   */
  static async securityScan(taskId: string): Promise<{ safe: boolean; threats?: string[] }> {
    const supabase = getSupabase()
    const { scanForThreats } = await import('@/lib/robots/security-robot')
    
    const { data: task } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .single()
    
    if (!task) return { safe: false, threats: ['Gorev bulunamadi'] }
    
    // Guvenlik taramasi
    const scanResult = await scanForThreats({
      input: JSON.stringify(task.result || task.description),
      userId: task.created_by
    })
    
    const secMetadata = (task.metadata || {}) as Record<string, unknown>
    await supabase
      .from('tasks')
      .update({
        metadata: {
          ...secMetadata,
          workflow_status: 'guvenlik',
          current_robot: ROBOTS.SIBER,
          security_scan: scanResult,
          scanned_at: new Date().toISOString()
        }
      })
      .eq('id', taskId)
    
    return { safe: scanResult.safe, threats: scanResult.threats }
  }
  
  /**
   * 7. DEPOLAMA - Veri robotu kaydeder
   */
  static async storeResult(taskId: string): Promise<{ stored: boolean; location?: string }> {
    const supabase = getSupabase()
    
    const { data: task } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .single()
    
    if (!task) return { stored: false }
    
    // Task sonucunu arsivle
    const { data: archived } = await supabase
      .from('task_results')
      .insert({
        task_id: taskId,
        director_key: task.assigned_to,
        input_command: task.description,
        output_result: task.result,
        status: 'success',
        ai_providers: [task.metadata?.ai_used || 'unknown']
      })
      .select('id')
      .single()
    
    const storeMetadata = (task.metadata || {}) as Record<string, unknown>
    await supabase
      .from('tasks')
      .update({
        metadata: {
          ...storeMetadata,
          workflow_status: 'depolama',
          current_robot: ROBOTS.ARSIV,
          archived_id: archived?.id,
          stored_at: new Date().toISOString()
        }
      })
      .eq('id', taskId)
    
    return { stored: true, location: `task_results/${archived?.id}` }
  }
  
  /**
   * 8. ONAY - Patron onay bekler
   */
  static async requestApproval(taskId: string): Promise<{ approvalId: string }> {
    const supabase = getSupabase()
    
    const { data: task } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .single()
    
    // Onay kaydi olustur
    const { data: approval } = await supabase
      .from('patron_commands')
      .insert({
        command_type: 'approval_request',
        command_text: `Gorev onay bekliyor: ${task?.title}`,
        status: 'pending',
        context: { task_id: taskId, task_title: task?.title, task_result: task?.result }
      })
      .select('id')
      .single()
    
    const approvalMetadata = (task?.metadata || {}) as Record<string, unknown>
    await supabase
      .from('tasks')
      .update({
        status: 'pending_approval',
        metadata: {
          ...approvalMetadata,
          workflow_status: 'onay',
          approval_id: approval?.id,
          approval_requested_at: new Date().toISOString()
        }
      })
      .eq('id', taskId)
    
    return { approvalId: approval?.id || '' }
  }
  
  /**
   * Patron Onay/Red
   */
  static async handleApproval(taskId: string, approved: boolean, note?: string): Promise<{ success: boolean }> {
    const supabase = getSupabase()
    
    if (approved) {
      // Yayinlamaya gonder
      await this.publishResult(taskId)
    } else {
      // Reddet
      await supabase
        .from('tasks')
        .update({
          status: 'cancelled',
          metadata: {
            workflow_status: 'reddedildi',
            rejection_note: note,
            rejected_at: new Date().toISOString()
          }
        })
        .eq('id', taskId)
    }
    
    return { success: true }
  }
  
  /**
   * 9. YAYINLAMA - COO/Vitrin sunar
   */
  static async publishResult(taskId: string): Promise<{ published: boolean; url?: string }> {
    const supabase = getSupabase()
    
    const { data: task } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .single()
    
    if (!task) return { published: false }
    
    // Sablon ise COO magazasina ekle
    if (task.type === 'sablon') {
      await supabase
        .from('coo_store_items')
        .insert({
          task_id: taskId,
          title: task.title,
          description: task.description,
          content: task.result,
          category: task.assigned_to,
          price_tokens: 100, // Varsayilan fiyat
          status: 'active'
        })
    }
    
    // Gorevi tamamla
    const pubMetadata = (task.metadata || {}) as Record<string, unknown>
    await supabase
      .from('tasks')
      .update({
        status: 'success',
        completed_at: new Date().toISOString(),
        metadata: {
          ...pubMetadata,
          workflow_status: 'yayinlama',
          current_robot: ROBOTS.COO,
          published_at: new Date().toISOString()
        }
      })
      .eq('id', taskId)
    
    return { published: true, url: `/store/item/${taskId}` }
  }
  
  /**
   * TAM AKIS - Bastan sona calistir
   */
  static async runFullWorkflow(taskId: string): Promise<{
    success: boolean
    finalStatus: TaskStatus
    steps: { step: string; success: boolean; message: string }[]
  }> {
    const steps: { step: string; success: boolean; message: string }[] = []
    
    try {
      // 2. Planlama
      const plan = await this.planTask(taskId)
      steps.push({ step: 'planlama', success: plan.success, message: `Direktorluk: ${plan.directorate}` })
      if (!plan.success) throw new Error('Planlama basarisiz')
      
      // 3. Dagitim
      const dist = await this.distributeTask(taskId, plan.directorate!)
      steps.push({ step: 'dagitim', success: dist.success, message: `${plan.directorate}'e atandi` })
      
      // 4. Uretim
      const prod = await this.produceContent(taskId)
      steps.push({ step: 'uretim', success: prod.success, message: 'AI ile uretildi' })
      if (!prod.success) throw new Error('Uretim basarisiz')
      
      // 5. Kalite
      const qual = await this.qualityCheck(taskId)
      steps.push({ step: 'kalite', success: qual.passed, message: qual.issues?.join(', ') || 'Gecti' })
      
      // 6. Guvenlik
      const sec = await this.securityScan(taskId)
      steps.push({ step: 'guvenlik', success: sec.safe, message: sec.threats?.join(', ') || 'Guvenli' })
      if (!sec.safe) throw new Error('Guvenlik taramasi basarisiz')
      
      // 7. Depolama
      const store = await this.storeResult(taskId)
      steps.push({ step: 'depolama', success: store.stored, message: store.location || 'Kaydedildi' })
      
      // 8. Onay bekle
      const approval = await this.requestApproval(taskId)
      steps.push({ step: 'onay', success: true, message: `Onay ID: ${approval.approvalId}` })
      
      return { success: true, finalStatus: 'onay', steps }
      
    } catch (error) {
      steps.push({ step: 'hata', success: false, message: String(error) })
      return { success: false, finalStatus: 'hata', steps }
    }
  }
}

export default WorkflowEngine
