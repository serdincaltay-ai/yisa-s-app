/**
 * CEO API - Görev sınıflandırma ve direktörlük yönlendirme
 * POST: message → security check → detectTaskType + routeToDirector → ceo_task oluştur → response
 */

import { NextRequest, NextResponse } from 'next/server'
import { securityCheck } from '@/lib/robots/security-robot'
import {
  detectTaskType,
  routeToDirector,
  isRoutineRequest,
  getRoutineScheduleFromMessage,
} from '@/lib/robots/ceo-robot'
import { createCeoTask } from '@/lib/db/ceo-celf'
import { insertCelfLog } from '@/lib/db/ceo-celf'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const message = typeof body.message === 'string' ? body.message : (body.message ?? '')
    const userId = typeof body.user_id === 'string' ? body.user_id : (body.user?.id as string | undefined)
    const ipAddress = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? undefined

    const security = await securityCheck({
      message,
      userId,
      ipAddress,
      logToDb: true,
    })
    if (!security.allowed) {
      return NextResponse.json(
        { error: security.reason ?? 'Bu işlem AI için yasaktır.', blocked: true },
        { status: 403 }
      )
    }

    const taskType = detectTaskType(message)
    const directorKey = routeToDirector(message)
    const routineRequest = isRoutineRequest(message)
    const schedule = getRoutineScheduleFromMessage(message)

    const ceoTaskResult = await createCeoTask({
      user_id: userId,
      task_description: message,
      task_type: taskType,
      director_key: directorKey,
    })
    const ceoTaskId = ceoTaskResult.id
    if (ceoTaskId) {
      await insertCelfLog({
        ceo_task_id: ceoTaskId,
        director_key: directorKey ?? 'GENEL',
        action: 'ceo_classify',
        input_summary: message.substring(0, 200),
        output_summary: `${taskType} → ${directorKey ?? '—'}`,
      })
    }

    return NextResponse.json({
      ok: true,
      task_type: taskType,
      director_key: directorKey,
      ceo_task_id: ceoTaskId,
      routine_request: routineRequest,
      schedule: schedule ?? undefined,
      requires_approval: security.requiresApproval,
    })
  } catch (e) {
    const err = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: 'CEO hatası', detail: err }, { status: 500 })
  }
}
