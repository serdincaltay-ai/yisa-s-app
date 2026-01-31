/**
 * Robot Sağlık ve Durum Takip Sistemi
 */

import { getSupabase } from '@/lib/supabase'
import { ROBOT_HIERARCHY } from './hierarchy'

export type HealthStatus = 'healthy' | 'degraded' | 'down'

export interface RobotHealth {
  robotCode: string
  status: HealthStatus
  lastHeartbeat: string
  tasksCompleted: number
  tasksFailed: number
  avgResponseTime: number
  errorRate: number
}

export class RobotHealthMonitor {
  private supabase = getSupabase()

  // Tüm robotların sağlık durumu
  async getAllHealth(): Promise<RobotHealth[]> {
    const robots = ROBOT_HIERARCHY.filter(r => r.code)
    
    const healthData: RobotHealth[] = []
    
    for (const robot of robots) {
      const health = await this.getRobotHealth(robot.code)
      healthData.push(health)
    }
    
    return healthData
  }

  // Tek robot sağlık durumu
  async getRobotHealth(robotCode: string): Promise<RobotHealth> {
    // robot_health tablosundan kontrol et
    const { data: healthData } = await this.supabase
      .from('robot_health')
      .select('*')
      .eq('robot_code', robotCode)
      .single()

    if (healthData) {
      return {
        robotCode,
        status: healthData.status,
        lastHeartbeat: healthData.last_heartbeat,
        tasksCompleted: healthData.tasks_completed || 0,
        tasksFailed: healthData.tasks_failed || 0,
        avgResponseTime: healthData.avg_response_time || 0,
        errorRate: healthData.error_rate || 0
      }
    }

    // Varsayılan değerler
    return {
      robotCode,
      status: 'healthy',
      lastHeartbeat: new Date().toISOString(),
      tasksCompleted: 0,
      tasksFailed: 0,
      avgResponseTime: 0,
      errorRate: 0
    }
  }

  // Heartbeat gönder
  async sendHeartbeat(robotCode: string) {
    const { error } = await this.supabase
      .from('robot_health')
      .upsert({
        robot_code: robotCode,
        status: 'healthy',
        last_heartbeat: new Date().toISOString()
      }, { onConflict: 'robot_code' })

    return !error
  }

  // Robot durumunu güncelle
  async updateStatus(robotCode: string, status: HealthStatus, errorMessage?: string) {
    const { error } = await this.supabase
      .from('robot_health')
      .upsert({
        robot_code: robotCode,
        status,
        last_heartbeat: new Date().toISOString(),
        last_error: errorMessage
      }, { onConflict: 'robot_code' })

    return !error
  }

  // Görev tamamlandı
  async taskCompleted(robotCode: string, responseTime: number) {
    const health = await this.getRobotHealth(robotCode)
    const newCompleted = health.tasksCompleted + 1
    const newAvg = ((health.avgResponseTime * health.tasksCompleted) + responseTime) / newCompleted

    await this.supabase
      .from('robot_health')
      .upsert({
        robot_code: robotCode,
        tasks_completed: newCompleted,
        avg_response_time: newAvg,
        last_heartbeat: new Date().toISOString()
      }, { onConflict: 'robot_code' })
  }

  // Görev başarısız
  async taskFailed(robotCode: string, errorMessage: string) {
    const health = await this.getRobotHealth(robotCode)
    const newFailed = health.tasksFailed + 1
    const total = health.tasksCompleted + newFailed
    const errorRate = (newFailed / total) * 100

    // Hata oranı %20'yi geçerse degraded yap
    const status: HealthStatus = errorRate > 20 ? 'degraded' : 'healthy'

    await this.supabase
      .from('robot_health')
      .upsert({
        robot_code: robotCode,
        status,
        tasks_failed: newFailed,
        error_rate: errorRate,
        last_error: errorMessage,
        last_heartbeat: new Date().toISOString()
      }, { onConflict: 'robot_code' })
  }

  // Özet istatistikler
  async getSummary() {
    const allHealth = await this.getAllHealth()
    
    return {
      totalRobots: allHealth.length,
      healthy: allHealth.filter(h => h.status === 'healthy').length,
      degraded: allHealth.filter(h => h.status === 'degraded').length,
      down: allHealth.filter(h => h.status === 'down').length,
      totalTasksCompleted: allHealth.reduce((sum, h) => sum + h.tasksCompleted, 0),
      totalTasksFailed: allHealth.reduce((sum, h) => sum + h.tasksFailed, 0),
      avgResponseTime: allHealth.reduce((sum, h) => sum + h.avgResponseTime, 0) / allHealth.length || 0
    }
  }
}

export const robotHealthMonitor = new RobotHealthMonitor()
