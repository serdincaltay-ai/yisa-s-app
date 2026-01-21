'use client'

import { useState, useCallback } from 'react'

/**
 * QA Gate Hook
 * ============
 * React hook for QA Gate validation in client components
 */

export interface QAValidationState {
  isValidating: boolean
  isValid: boolean | null
  error: string | null
  missingBlocks: string[]
  retryCount: number
  maxRetries: number
  lastValidation: any | null
}

export interface UseQAGateReturn {
  state: QAValidationState
  validate: (taskId: string, input: string) => Promise<boolean>
  reset: (taskId: string) => Promise<void>
  checkStatus: (taskId: string) => Promise<any>
  formatTemplate: string
}

const FOUR_BLOCK_TEMPLATE = `🎯 GÖREV: [Görev tanımı]

✅ KABUL KRİTERİ: [Kabul kriterleri]

🔧 DEĞİŞECEK DOSYA/TABLO: [Değişecek dosyalar]

YÜRÜTME PLANI:
- Adım 1: ...
- Adım 2: ...
- Adım 3: ...`

export function useQAGate(): UseQAGateReturn {
  const [state, setState] = useState<QAValidationState>({
    isValidating: false,
    isValid: null,
    error: null,
    missingBlocks: [],
    retryCount: 0,
    maxRetries: 3,
    lastValidation: null
  })

  const validate = useCallback(async (taskId: string, input: string): Promise<boolean> => {
    setState(prev => ({ ...prev, isValidating: true, error: null }))

    try {
      const response = await fetch('/api/qa-gate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, input })
      })

      const data = await response.json()

      if (data.success) {
        setState(prev => ({
          ...prev,
          isValidating: false,
          isValid: true,
          error: null,
          missingBlocks: [],
          lastValidation: data.validation
        }))
        return true
      }

      setState(prev => ({
        ...prev,
        isValidating: false,
        isValid: false,
        error: data.validation?.rejectionReason || 'Validasyon başarısız',
        missingBlocks: data.validation?.missingBlocks || [],
        retryCount: data.validation?.retryCount || prev.retryCount,
        lastValidation: data.validation
      }))
      return false

    } catch (error) {
      setState(prev => ({
        ...prev,
        isValidating: false,
        isValid: false,
        error: (error as Error).message
      }))
      return false
    }
  }, [])

  const reset = useCallback(async (taskId: string): Promise<void> => {
    try {
      await fetch(`/api/qa-gate?taskId=${encodeURIComponent(taskId)}`, {
        method: 'DELETE'
      })
      setState({
        isValidating: false,
        isValid: null,
        error: null,
        missingBlocks: [],
        retryCount: 0,
        maxRetries: 3,
        lastValidation: null
      })
    } catch (error) {
      console.error('QA Gate reset error:', error)
    }
  }, [])

  const checkStatus = useCallback(async (taskId: string): Promise<any> => {
    try {
      const response = await fetch(`/api/qa-gate?taskId=${encodeURIComponent(taskId)}`)
      return await response.json()
    } catch (error) {
      console.error('QA Gate status check error:', error)
      return null
    }
  }, [])

  return {
    state,
    validate,
    reset,
    checkStatus,
    formatTemplate: FOUR_BLOCK_TEMPLATE
  }
}

export default useQAGate
