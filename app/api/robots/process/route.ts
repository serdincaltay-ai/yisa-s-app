/**
 * Robot Görev İşleme Endpoint'i
 * POST: Kuyruktan görevleri al ve işle
 */

import { NextResponse } from 'next/server'
import { robotRunner } from '@/lib/robots/runner'
import { protocolHandler } from '@/lib/robots/protocol'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action, maxTasks, approvals } = body

    switch (action) {
      // Tek görev işle
      case 'process_one': {
        const result = await robotRunner.processNextTask()
        if (!result) {
          return NextResponse.json({ success: true, message: 'Kuyruk boş' })
        }
        return NextResponse.json({ success: true, result })
      }

      // Birden fazla görev işle
      case 'process_batch': {
        const results = await robotRunner.processAllTasks(maxTasks || 10)
        return NextResponse.json({ 
          success: true, 
          processedCount: results.length,
          results 
        })
      }

      // Patron onaylarını işle
      case 'process_approvals': {
        if (!approvals || !Array.isArray(approvals)) {
          return NextResponse.json({ success: false, error: 'approvals array required' }, { status: 400 })
        }
        const results = await robotRunner.processPatronApprovals(approvals)
        return NextResponse.json({ success: true, results })
      }

      // Görev durumunu getir
      case 'get_queue': {
        const tasks = await protocolHandler.getPendingTasks()
        return NextResponse.json({ success: true, tasks })
      }

      default:
        return NextResponse.json({ 
          success: false, 
          error: 'Unknown action',
          availableActions: ['process_one', 'process_batch', 'process_approvals', 'get_queue']
        }, { status: 400 })
    }
  } catch (error) {
    console.error('[v0] Process error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    const stats = await protocolHandler.getTaskStats()
    const patronReview = await protocolHandler.getPatronReviewTasks()
    
    return NextResponse.json({
      success: true,
      stats,
      patronReviewCount: patronReview.length,
      patronReviewTasks: patronReview.slice(0, 5) // İlk 5 tanesi
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
