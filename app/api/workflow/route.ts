/**
 * WORKFLOW API
 * 
 * POST /api/workflow - Yeni is olustur ve akisi baslat
 * GET /api/workflow - Bekleyen isleri listele
 * PATCH /api/workflow - Patron onay/red
 */

import { NextRequest, NextResponse } from 'next/server'
import { WorkflowEngine, TaskType } from '@/lib/workflow/engine'
import { getSupabase } from '@/lib/supabase'

// GET - Bekleyen isleri listele
export async function GET(req: NextRequest) {
  const supabase = getSupabase()
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status') || 'pending_approval'
  
  const { data: tasks, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false })
    .limit(50)
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  // Onay bekleyenleri ayri getir
  const { data: pendingApprovals } = await supabase
    .from('patron_commands')
    .select('*')
    .eq('status', 'pending')
    .eq('command_type', 'approval_request')
    .order('created_at', { ascending: false })
  
  return NextResponse.json({
    tasks,
    pendingApprovals: pendingApprovals || [],
    stats: {
      total: tasks?.length || 0,
      pendingApproval: pendingApprovals?.length || 0
    }
  })
}

// POST - Yeni is olustur
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type, title, description, priority, autoRun, tenantId } = body
    
    if (!type || !title || !description) {
      return NextResponse.json(
        { error: 'type, title ve description zorunlu' },
        { status: 400 }
      )
    }
    
    // 1. Gorev olustur
    const { taskId, error } = await WorkflowEngine.createTask({
      type: type as TaskType,
      title,
      description,
      createdBy: 'patron', // TODO: Auth'dan al
      tenantId,
      priority: priority || 'normal',
      input: body.input || {}
    })
    
    if (error) {
      return NextResponse.json({ error }, { status: 500 })
    }
    
    // 2. Otomatik calistir (opsiyonel)
    if (autoRun) {
      const result = await WorkflowEngine.runFullWorkflow(taskId)
      return NextResponse.json({
        taskId,
        workflow: result,
        message: result.success 
          ? 'Is akisi tamamlandi, onay bekliyor' 
          : 'Is akisi sirasinda hata olustu'
      })
    }
    
    return NextResponse.json({
      taskId,
      message: 'Gorev olusturuldu',
      nextStep: 'POST /api/workflow/run ile akisi baslat'
    })
    
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    )
  }
}

// PATCH - Patron onay/red
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { taskId, approved, note } = body
    
    if (!taskId || approved === undefined) {
      return NextResponse.json(
        { error: 'taskId ve approved zorunlu' },
        { status: 400 }
      )
    }
    
    const result = await WorkflowEngine.handleApproval(taskId, approved, note)
    
    return NextResponse.json({
      success: result.success,
      message: approved ? 'Onaylandi ve yayinlandi' : 'Reddedildi',
      taskId
    })
    
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    )
  }
}
