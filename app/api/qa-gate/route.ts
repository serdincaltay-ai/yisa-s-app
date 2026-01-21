import { NextRequest, NextResponse } from 'next/server'
import { 
  QAGate, 
  validateQAGate, 
  createRetryLoop, 
  processRetryAttempt,
  generateRejectionMessage,
  generateSuccessMessage,
  QAValidationResult,
  RetryLoopState,
  DEFAULT_QA_CONFIG
} from '@/lib/qa-gate'

// In-memory retry state storage (production'da Redis/Supabase kullanılmalı)
const retryStates = new Map<string, RetryLoopState>()

/**
 * QA Gate Validation Endpoint
 * POST /api/qa-gate
 * 
 * Body:
 * {
 *   taskId: string,
 *   input: string,
 *   forceValidate?: boolean
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { taskId, input, forceValidate = false } = body

    if (!taskId) {
      return NextResponse.json({
        success: false,
        error: 'taskId zorunludur',
        code: 'MISSING_TASK_ID'
      }, { status: 400 })
    }

    if (!input && !forceValidate) {
      return NextResponse.json({
        success: false,
        error: 'input zorunludur',
        code: 'MISSING_INPUT'
      }, { status: 400 })
    }

    // Mevcut retry state'i kontrol et veya yeni oluştur
    let retryState = retryStates.get(taskId)
    if (!retryState) {
      retryState = createRetryLoop(taskId, DEFAULT_QA_CONFIG.maxRetries)
      retryStates.set(taskId, retryState)
    }

    // Validasyon yap
    const { state: newState, validation, shouldContinue } = processRetryAttempt(
      retryState,
      input || '',
      DEFAULT_QA_CONFIG
    )

    // State'i güncelle
    retryStates.set(taskId, newState)

    if (validation.valid) {
      // Başarılı - state'i temizle
      retryStates.delete(taskId)

      return NextResponse.json({
        success: true,
        status: 'APPROVED',
        message: generateSuccessMessage(validation),
        validation: {
          valid: true,
          parsedBlocks: validation.parsedBlocks,
          timestamp: validation.timestamp
        },
        nextAction: 'EXECUTE_TASK'
      })
    }

    // RED durumu
    const response: any = {
      success: false,
      status: 'REJECTED',
      message: generateRejectionMessage(validation),
      validation: {
        valid: false,
        missingBlocks: validation.missingBlocks,
        rejectionReason: validation.rejectionReason,
        autoRejectTriggered: validation.autoRejectTriggered,
        autoRejectPattern: validation.autoRejectPattern,
        retryCount: validation.retryCount,
        timestamp: validation.timestamp
      }
    }

    if (shouldContinue) {
      response.nextAction = 'RETRY_WITH_FORMAT'
      response.retryInfo = {
        currentAttempt: newState.currentAttempt,
        maxAttempts: newState.maxAttempts,
        remainingAttempts: newState.maxAttempts - newState.currentAttempt
      }
    } else {
      response.nextAction = 'TASK_CANCELLED'
      response.retryInfo = {
        currentAttempt: newState.currentAttempt,
        maxAttempts: newState.maxAttempts,
        remainingAttempts: 0
      }
      // Max retry aşıldı, state'i temizle
      retryStates.delete(taskId)
    }

    return NextResponse.json(response, { status: 422 })

  } catch (error) {
    console.error('QA Gate error:', error)
    return NextResponse.json({
      success: false,
      error: 'QA Gate işlem hatası',
      code: 'INTERNAL_ERROR',
      details: (error as Error).message
    }, { status: 500 })
  }
}

/**
 * QA Gate Status Check
 * GET /api/qa-gate?taskId=xxx
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const taskId = searchParams.get('taskId')

  if (!taskId) {
    // Genel bilgi döndür
    return NextResponse.json({
      service: 'QA Gate Protocol',
      version: '1.0.0',
      status: 'active',
      description: 'Sistem ön kapısı - 4 Blok validasyon protokolü',
      requiredBlocks: [
        '🎯 GÖREV',
        '✅ KABUL KRİTERİ',
        '🔧 DEĞİŞECEK',
        'YÜRÜTME PLANI'
      ],
      autoRejectPatterns: QAGate.autoRejectPatterns.map(p => p.description),
      config: {
        maxRetries: DEFAULT_QA_CONFIG.maxRetries,
        strictMode: DEFAULT_QA_CONFIG.strictMode
      }
    })
  }

  // Belirli task için retry state'i döndür
  const retryState = retryStates.get(taskId)

  if (!retryState) {
    return NextResponse.json({
      taskId,
      status: 'NOT_FOUND',
      message: 'Bu task için aktif retry döngüsü bulunamadı'
    }, { status: 404 })
  }

  return NextResponse.json({
    taskId,
    status: retryState.isActive ? 'RETRY_ACTIVE' : 'COMPLETED',
    currentAttempt: retryState.currentAttempt,
    maxAttempts: retryState.maxAttempts,
    remainingAttempts: retryState.maxAttempts - retryState.currentAttempt,
    lastValidation: retryState.lastValidation,
    historyCount: retryState.history.length
  })
}

/**
 * Reset retry state for a task
 * DELETE /api/qa-gate?taskId=xxx
 */
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const taskId = searchParams.get('taskId')

  if (!taskId) {
    return NextResponse.json({
      success: false,
      error: 'taskId zorunludur'
    }, { status: 400 })
  }

  const existed = retryStates.has(taskId)
  retryStates.delete(taskId)

  return NextResponse.json({
    success: true,
    taskId,
    wasActive: existed,
    message: existed ? 'Retry state sıfırlandı' : 'Aktif retry state yoktu'
  })
}
