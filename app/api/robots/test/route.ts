/**
 * Robot Sistemi Test Endpoint'i
 * GET: Sistem durumu ve test sonuçları
 * POST: Test görevi oluştur ve çalıştır
 */

import { NextResponse } from 'next/server'
import { ProtocolHandler, PRODUCTION_STAGES } from '@/lib/robots/protocol'
import { RobotHealthMonitor } from '@/lib/robots/health'
import { TaskCreator, INITIAL_TASKS } from '@/lib/robots/task-creator'
import AIRouter from '@/lib/ai/router'
import { ROBOT_HIERARCHY, DIRECTORATES, CORE_RULES } from '@/lib/robots/hierarchy'

const protocolHandler = new ProtocolHandler()
const robotHealthMonitor = new RobotHealthMonitor()
const taskCreator = new TaskCreator()

export async function GET() {
  try {
    // 1. Robot sağlık durumu
    const healthSummary = await robotHealthMonitor.getSummary()
    
    // 2. Görev istatistikleri
    const taskStats = await protocolHandler.getTaskStats()
    
    // 3. Patron onayı bekleyen görevler
    const patronReviewTasks = await protocolHandler.getPatronReviewTasks()
    
    // 4. AI Router durumu
    const aiStatus = {
      availableProviders: ['claude', 'gpt', 'gemini', 'together', 'v0', 'cursor'],
      directorateCount: Object.keys(DIRECTORATES).length
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      system: {
        name: 'YİSA-S Robot Sistemi',
        version: '1.0.0',
        status: healthSummary.down === 0 ? 'operational' : 'degraded'
      },
      robots: {
        hierarchy: ROBOT_HIERARCHY.map(r => ({ layer: r.layer, name: r.name, code: r.code })),
        health: healthSummary
      },
      tasks: {
        stats: taskStats,
        patronReviewCount: patronReviewTasks.length,
        stages: PRODUCTION_STAGES.map(s => s.name)
      },
      directorates: Object.keys(DIRECTORATES),
      coreRules: CORE_RULES.length,
      ai: aiStatus
    })
  } catch (error) {
    console.error('[v0] Robot test error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action, directorate, taskId } = body

    switch (action) {
      // Test görevi oluştur
      case 'create_test_task': {
        const task = await protocolHandler.createTask({
          title: 'Test Görevi',
          description: 'Sistem testi için oluşturuldu',
          priority: 'NORMAL',
          assignedTo: directorate || 'CTO',
          createdBy: 'ROB-CEO'
        })
        return NextResponse.json({ success: true, task })
      }

      // Başlangıç görevlerini yükle
      case 'load_initial_tasks': {
        const results = await taskCreator.createAllInitialTasks()
        return NextResponse.json({ 
          success: true, 
          message: `${results.length} başlangıç görevi oluşturuldu`,
          tasks: results 
        })
      }

      // Direktörlük görevlerini yükle
      case 'load_directorate_tasks': {
        if (!directorate) {
          return NextResponse.json({ success: false, error: 'directorate required' }, { status: 400 })
        }
        const tasks = await taskCreator.createDirectorateTasks(directorate)
        return NextResponse.json({ success: true, tasks })
      }

      // Görevi ilerlet
      case 'advance_task': {
        if (!taskId) {
          return NextResponse.json({ success: false, error: 'taskId required' }, { status: 400 })
        }
        const task = await protocolHandler.advanceStage(taskId, body.currentStage || 1)
        return NextResponse.json({ success: true, task })
      }

      // Patron onayı
      case 'patron_approve': {
        if (!taskId) {
          return NextResponse.json({ success: false, error: 'taskId required' }, { status: 400 })
        }
        const task = await protocolHandler.patronApprove(taskId, body.approved ?? true, body.note)
        return NextResponse.json({ success: true, task })
      }

      // Robot heartbeat
      case 'heartbeat': {
        const robotCode = body.robotCode || 'ROB-CEO'
        await robotHealthMonitor.sendHeartbeat(robotCode)
        return NextResponse.json({ success: true, robotCode, timestamp: new Date().toISOString() })
      }

      // AI yönlendirme testi
      case 'test_ai_routing': {
        const taskType = body.taskType || 'analysis'
        const selectedAI = AIRouter.smartSelect({ taskType, directorate })
        return NextResponse.json({ success: true, taskType, directorate, selectedAI })
      }

      default:
        return NextResponse.json({ 
          success: false, 
          error: 'Unknown action',
          availableActions: [
            'create_test_task',
            'load_initial_tasks', 
            'load_directorate_tasks',
            'advance_task',
            'patron_approve',
            'heartbeat',
            'test_ai_routing'
          ]
        }, { status: 400 })
    }
  } catch (error) {
    console.error('[v0] Robot test POST error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
