'use client'

import { useState, useCallback } from 'react'
import { useQAGate } from '@/lib/hooks/useQAGate'

/**
 * QA Gate Validator Component
 * ===========================
 * UI component for validating tasks against QA Gate protocol
 */

interface QAGateValidatorProps {
  taskId?: string
  onValidationComplete?: (isValid: boolean, result: any) => void
  showTemplate?: boolean
  className?: string
}

export default function QAGateValidator({
  taskId: initialTaskId,
  onValidationComplete,
  showTemplate = true,
  className = ''
}: QAGateValidatorProps) {
  const [taskId, setTaskId] = useState(initialTaskId || `task-${Date.now()}`)
  const [input, setInput] = useState('')
  const { state, validate, reset, formatTemplate } = useQAGate()

  const handleValidate = useCallback(async () => {
    const isValid = await validate(taskId, input)
    onValidationComplete?.(isValid, state.lastValidation)
  }, [taskId, input, validate, onValidationComplete, state.lastValidation])

  const handleReset = useCallback(async () => {
    await reset(taskId)
    setInput('')
  }, [taskId, reset])

  const handleUseTemplate = useCallback(() => {
    setInput(formatTemplate)
  }, [formatTemplate])

  return (
    <div className={`bg-black/20 border border-white/10 rounded-xl p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          🚪 QA Gate Validator
        </h2>
        <span className={`px-3 py-1 rounded-full text-sm ${
          state.isValid === null ? 'bg-gray-600' :
          state.isValid ? 'bg-green-600' : 'bg-red-600'
        }`}>
          {state.isValid === null ? 'Bekliyor' :
           state.isValid ? '✅ Geçti' : '❌ Red'}
        </span>
      </div>

      {/* Task ID */}
      <div className="mb-4">
        <label className="block text-sm opacity-70 mb-1">Task ID</label>
        <input
          type="text"
          value={taskId}
          onChange={(e) => setTaskId(e.target.value)}
          className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-md"
          placeholder="task-001"
        />
      </div>

      {/* Input Area */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm opacity-70">Görev Tanımı (4 Blok Formatı)</label>
          {showTemplate && (
            <button
              onClick={handleUseTemplate}
              className="text-xs text-blue-400 hover:text-blue-300"
            >
              📋 Şablonu Kullan
            </button>
          )}
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-64 px-3 py-2 bg-black/30 border border-white/10 rounded-md font-mono text-sm"
          placeholder={`🎯 GÖREV: ...

✅ KABUL KRİTERİ: ...

🔧 DEĞİŞECEK DOSYA/TABLO: ...

YÜRÜTME PLANI:
- Adım 1: ...
- Adım 2: ...`}
        />
      </div>

      {/* Validation Result */}
      {state.error && (
        <div className="mb-4 p-4 bg-red-900/30 border border-red-500/50 rounded-lg">
          <div className="font-semibold text-red-400 mb-2">❌ Validasyon Hatası</div>
          <div className="text-sm opacity-90">{state.error}</div>
          
          {state.missingBlocks.length > 0 && (
            <div className="mt-2">
              <div className="text-sm font-medium">Eksik Bloklar:</div>
              <ul className="list-disc list-inside text-sm opacity-80">
                {state.missingBlocks.map((block, i) => (
                  <li key={i}>{block}</li>
                ))}
              </ul>
            </div>
          )}
          
          {state.retryCount > 0 && (
            <div className="mt-2 text-sm">
              Deneme: {state.retryCount}/{state.maxRetries}
            </div>
          )}
        </div>
      )}

      {state.isValid && (
        <div className="mb-4 p-4 bg-green-900/30 border border-green-500/50 rounded-lg">
          <div className="font-semibold text-green-400">✅ Validasyon Başarılı</div>
          <div className="text-sm opacity-90">4 Blok formatı doğrulandı. Görev işleme alınabilir.</div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleValidate}
          disabled={state.isValidating || !input.trim()}
          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition"
        >
          {state.isValidating ? '🔄 Kontrol ediliyor...' : '🔍 Validate Et'}
        </button>
        
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition"
        >
          🔄 Sıfırla
        </button>
      </div>

      {/* Info Panel */}
      <div className="mt-6 p-4 bg-black/30 rounded-lg">
        <div className="text-sm font-medium mb-2">📋 QA Gate Protokolü</div>
        <div className="text-xs opacity-70 space-y-1">
          <div>• Tüm görevler 4 blok formatında olmalıdır</div>
          <div>• 🎯 GÖREV | ✅ KABUL KRİTERİ | 🔧 DEĞİŞECEK | YÜRÜTME PLANI</div>
          <div>• "via master", "undefined", "null", boş cevap → Otomatik RED</div>
          <div>• RED sonrası maksimum 3 yeniden deneme hakkı</div>
        </div>
      </div>
    </div>
  )
}
