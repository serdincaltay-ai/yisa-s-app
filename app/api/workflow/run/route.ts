/**
 * WORKFLOW RUN API
 * 
 * POST /api/workflow/run - Belirli bir gorevi calistir
 * POST /api/workflow/run?step=planlama - Sadece belirli adimi calistir
 */

import { NextRequest, NextResponse } from 'next/server'
import { WorkflowEngine } from '@/lib/workflow/engine'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { taskId, step } = body
    
    if (!taskId) {
      return NextResponse.json({ error: 'taskId zorunlu' }, { status: 400 })
    }
    
    // Belirli bir adim mi, tam akis mi?
    if (step) {
      let result
      
      switch (step) {
        case 'planlama':
          result = await WorkflowEngine.planTask(taskId)
          break
        case 'dagitim':
          const planResult = await WorkflowEngine.planTask(taskId)
          result = await WorkflowEngine.distributeTask(taskId, planResult.directorate || 'CPO')
          break
        case 'uretim':
          result = await WorkflowEngine.produceContent(taskId)
          break
        case 'kalite':
          result = await WorkflowEngine.qualityCheck(taskId)
          break
        case 'guvenlik':
          result = await WorkflowEngine.securityScan(taskId)
          break
        case 'depolama':
          result = await WorkflowEngine.storeResult(taskId)
          break
        case 'onay':
          result = await WorkflowEngine.requestApproval(taskId)
          break
        case 'yayinlama':
          result = await WorkflowEngine.publishResult(taskId)
          break
        default:
          return NextResponse.json({ error: `Gecersiz adim: ${step}` }, { status: 400 })
      }
      
      return NextResponse.json({
        taskId,
        step,
        result
      })
    }
    
    // Tam akis
    const result = await WorkflowEngine.runFullWorkflow(taskId)
    
    return NextResponse.json({
      taskId,
      ...result
    })
    
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    )
  }
}
