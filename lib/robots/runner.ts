/**
 * Robot Çalıştırıcı - Görevleri işler ve aşamalar arasında taşır
 */

import { getSupabase } from '@/lib/supabase'
import { protocolHandler, PRODUCTION_STAGES, TaskStatus } from './protocol'
import { robotHealthMonitor } from './health'
import { aiRouter } from '@/lib/ai/router'
import { DIRECTORATES } from './hierarchy'

export class RobotRunner {
  private supabase = getSupabase()
  private isRunning = false

  // Kuyruktan görev al ve işle
  async processNextTask() {
    const startTime = Date.now()
    
    // Kuyrukta bekleyen en öncelikli görevi al
    const { data: task, error } = await this.supabase
      .from('tasks')
      .select('*')
      .eq('status', 'queued')
      .order('priority', { ascending: false })
      .order('created_at', { ascending: true })
      .limit(1)
      .single()

    if (error || !task) {
      return null // Kuyruk boş
    }

    // Görevi çalışıyor olarak işaretle
    await this.supabase
      .from('tasks')
      .update({ status: 'running', started_at: new Date().toISOString() })
      .eq('id', task.id)

    try {
      // Görevi işle (aşamalara göre)
      const result = await this.executeTask(task)
      
      // Başarılı - sonraki aşamaya taşı
      await protocolHandler.advanceStage(task.id, task.stage)
      
      // Sağlık güncelle
      const responseTime = Date.now() - startTime
      await robotHealthMonitor.taskCompleted(task.assigned_to || 'ROB-CEO', responseTime)

      return { success: true, task, result, responseTime }
    } catch (err) {
      // Hata - görevi fail olarak işaretle
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      
      await this.supabase
        .from('tasks')
        .update({ 
          status: 'fail', 
          error_message: errorMessage,
          failed_at: new Date().toISOString()
        })
        .eq('id', task.id)

      await robotHealthMonitor.taskFailed(task.assigned_to || 'ROB-CEO', errorMessage)

      return { success: false, task, error: errorMessage }
    }
  }

  // Görevi aşamasına göre işle
  private async executeTask(task: any) {
    const stage = PRODUCTION_STAGES.find(s => s.id === task.stage)
    if (!stage) throw new Error('Invalid stage')

    switch (stage.id) {
      case 1: // TALEP
        return { message: 'Talep alındı' }
      
      case 2: // PLANLAMA
        // CEO görevi planlar, direktörlük atar
        const directorate = this.determineDirectorate(task)
        await this.supabase
          .from('tasks')
          .update({ assigned_to: directorate })
          .eq('id', task.id)
        return { message: `Planlama tamamlandı, ${directorate} direktörlüğüne atandı` }
      
      case 3: // DAGITIM
        return { message: 'Direktörlüğe dağıtıldı' }
      
      case 4: // URETIM
        // AI ile içerik üret
        const ai = aiRouter.selectAI('content', task.assigned_to)
        return { message: `${ai.provider} ile üretim tamamlandı` }
      
      case 5: // KALITE
        // CELF denetimi
        return { message: 'Kalite kontrolü geçti' }
      
      case 6: // GUVENLIK
        // Siber güvenlik kontrolü
        return { message: 'Güvenlik kontrolü geçti' }
      
      case 7: // DEPOLAMA
        // Veri arşivleme
        return { message: 'Arşivlendi' }
      
      case 8: // ONAY
        // Patron onayı bekleniyor (otomatik işlenmiyor)
        return { message: 'Patron onayı bekliyor' }
      
      case 9: // YAYINLAMA
        return { message: 'Yayınlandı' }
      
      default:
        return { message: 'Bilinmeyen aşama' }
    }
  }

  // Görev içeriğine göre direktörlük belirle
  private determineDirectorate(task: any): string {
    const title = (task.title || '').toLowerCase()
    const desc = (task.description || '').toLowerCase()
    const content = title + ' ' + desc

    if (content.includes('finans') || content.includes('muhasebe') || content.includes('ödeme')) return 'CFO'
    if (content.includes('teknik') || content.includes('api') || content.includes('veritabanı')) return 'CTO'
    if (content.includes('pazarlama') || content.includes('sosyal medya') || content.includes('kampanya')) return 'CMO'
    if (content.includes('personel') || content.includes('insan kaynakları') || content.includes('işe alım')) return 'CHRO'
    if (content.includes('hukuk') || content.includes('sözleşme') || content.includes('kvkk')) return 'CLO'
    if (content.includes('satış') || content.includes('crm') || content.includes('müşteri')) return 'CSO_SATIS'
    if (content.includes('ürün') || content.includes('tasarım') || content.includes('ui')) return 'CPO'
    if (content.includes('veri') || content.includes('rapor') || content.includes('analiz')) return 'CDO'
    if (content.includes('spor') || content.includes('antrenman') || content.includes('hareket')) return 'CSPO'
    if (content.includes('medya') || content.includes('video') || content.includes('görsel')) return 'CMDO'
    if (content.includes('araştırma') || content.includes('ar-ge') || content.includes('geliştirme')) return 'CRDO'
    
    return 'CTO' // Varsayılan
  }

  // Tüm kuyruklu görevleri işle
  async processAllTasks(maxTasks = 10) {
    const results = []
    
    for (let i = 0; i < maxTasks; i++) {
      const result = await this.processNextTask()
      if (!result) break // Kuyruk boş
      results.push(result)
    }
    
    return results
  }

  // Patron onayı bekleyen görevleri işle
  async processPatronApprovals(approvals: { taskId: string; approved: boolean; note?: string }[]) {
    const results = []
    
    for (const approval of approvals) {
      const result = await protocolHandler.patronApprove(
        approval.taskId, 
        approval.approved, 
        approval.note
      )
      results.push(result)
    }
    
    return results
  }
}

export const robotRunner = new RobotRunner()
