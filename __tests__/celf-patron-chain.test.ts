/**
 * CELF Pipeline E2E Test — Patron Command Chain
 * patron_commands → ceo_tasks → task_results zinciri
 *
 * Mock Supabase client kullanır, gerçek DB'ye bağlanmaz.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createMockSupabaseClient, createEmptyStore, type MockStore } from './mock-supabase'
import { routeToDirector } from '@/lib/robots/ceo-robot'
import {
  CELF_DIRECTORATES,
  getDirectorAIProviders,
  directorHasVeto,
  runCelfChecks,
  checkDataAccess,
  checkProtection,
  checkApprovalRequired,
  type DirectorKey,
} from '@/lib/robots/celf-center'

// ─── Mock env ────────────────────────────────────────────────────────────────

vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://mock.supabase.co')
vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'mock-service-role-key')

// ─── Helper: simulate patron command → ceo_task → task_result chain ─────────

interface ChainResult {
  patronCommandId: string
  ceoTaskId: string
  directorKey: DirectorKey
  taskResultId: string
  aiResult: string
}

/**
 * Simulates the full patron command chain:
 * 1. INSERT patron_commands
 * 2. Route to directorate via CEO Robot
 * 3. INSERT ceo_tasks (assigned to directorate)
 * 4. INSERT celf_logs (execution log)
 * 5. INSERT task_results (final result)
 * 6. UPDATE patron_commands status
 */
async function simulatePatronCommandChain(
  supabase: ReturnType<typeof createMockSupabaseClient>,
  store: MockStore,
  command: string,
  userId: string,
): Promise<ChainResult> {
  // Step 1: Insert patron command
  const { data: patronCmd } = supabase
    .from('patron_commands')
    .insert({
      command,
      type: 'celf',
      status: 'pending',
      priority: 'normal',
      source: 'celf_api',
      user_id: userId,
      output_payload: { processing: true },
    })
    .select('id')
    .single()

  const patronCommandId = (patronCmd as Record<string, unknown>).id as string

  // Step 2: Route to directorate
  const directorKey = routeToDirector(command)
  if (!directorKey) {
    throw new Error(`No directorate found for command: ${command}`)
  }

  const director = CELF_DIRECTORATES[directorKey]
  const aiProviders = getDirectorAIProviders(directorKey)

  // Step 3: Insert CEO task
  const { data: ceoTask } = supabase
    .from('ceo_tasks')
    .insert({
      user_id: userId,
      task_description: `[CELF] ${director.name}: ${command}`,
      task_type: 'celf',
      director_key: directorKey,
      status: 'assigned',
      patron_command_id: patronCommandId,
    })
    .select('id')
    .single()

  const ceoTaskId = (ceoTask as Record<string, unknown>).id as string

  // Step 4: Insert CELF log (simulating AI execution)
  const mockAiResult = `[${directorKey}] Görev tamamlandı: ${command} — AI: ${aiProviders[0]}`

  supabase
    .from('celf_logs')
    .insert({
      ceo_task_id: ceoTaskId,
      director_key: directorKey,
      action: 'celf_execute',
      input_summary: command.substring(0, 200),
      output_summary: mockAiResult.substring(0, 300),
      payload: { ai_provider: aiProviders[0], status: 'completed' },
    })
    .select('id')
    .single()

  // Step 5: Insert task result
  const { data: taskResult } = supabase
    .from('task_results')
    .insert({
      ceo_task_id: ceoTaskId,
      patron_command_id: patronCommandId,
      director_key: directorKey,
      ai_provider: aiProviders[0],
      result_text: mockAiResult,
      status: 'completed',
    })
    .select('id')
    .single()

  const taskResultId = (taskResult as Record<string, unknown>).id as string

  // Step 6: Update patron command and CEO task status
  supabase
    .from('patron_commands')
    .update({
      status: 'pending',
      output_payload: {
        processing: false,
        completed_at: new Date().toISOString(),
        director_key: directorKey,
        director_name: director.name,
        ai_providers: [aiProviders[0]],
        displayText: mockAiResult,
      },
    })
    .eq('id', patronCommandId)

  supabase
    .from('ceo_tasks')
    .update({
      status: 'completed',
      result_payload: { text: mockAiResult, provider: aiProviders[0] },
    })
    .eq('id', ceoTaskId)

  return {
    patronCommandId,
    ceoTaskId,
    directorKey,
    taskResultId,
    aiResult: mockAiResult,
  }
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('CELF Pipeline — Patron Command Chain', () => {
  let store: MockStore
  let supabase: ReturnType<typeof createMockSupabaseClient>
  const userId = 'patron-user-id-001'

  beforeEach(() => {
    store = createEmptyStore()
    supabase = createMockSupabaseClient(store)
  })

  it('should create patron_command → ceo_task → task_result for a finance command', async () => {
    const result = await simulatePatronCommandChain(
      supabase, store,
      'Aylık gelir gider raporu hazırla',
      userId,
    )

    expect(result.directorKey).toBe('CFO')
    expect(result.patronCommandId).toBeDefined()
    expect(result.ceoTaskId).toBeDefined()
    expect(result.taskResultId).toBeDefined()

    // Verify patron_commands
    expect(store.patron_commands).toHaveLength(1)
    expect(store.patron_commands[0].command).toBe('Aylık gelir gider raporu hazırla')
    expect(store.patron_commands[0].user_id).toBe(userId)

    // Verify ceo_tasks
    expect(store.ceo_tasks).toHaveLength(1)
    expect(store.ceo_tasks[0].director_key).toBe('CFO')
    expect(store.ceo_tasks[0].status).toBe('completed')

    // Verify celf_logs
    expect(store.celf_logs).toHaveLength(1)
    expect(store.celf_logs[0].director_key).toBe('CFO')

    // Verify task_results
    expect(store.task_results).toHaveLength(1)
    expect(store.task_results[0].director_key).toBe('CFO')
    expect(store.task_results[0].status).toBe('completed')
  })

  it('should create chain for a tech command → CTO', async () => {
    const result = await simulatePatronCommandChain(
      supabase, store,
      'API performans kontrolü yap',
      userId,
    )

    expect(result.directorKey).toBe('CTO')
    expect(store.ceo_tasks[0].task_description).toContain('Teknoloji')
    expect(store.celf_logs[0].output_summary).toContain('CTO')
  })

  it('should create chain for a marketing command → CMO', async () => {
    const result = await simulatePatronCommandChain(
      supabase, store,
      'Sosyal medya kampanya planı oluştur',
      userId,
    )

    expect(result.directorKey).toBe('CMO')
    expect(store.patron_commands[0].output_payload).toBeDefined()
    const payload = store.patron_commands[0].output_payload as Record<string, unknown>
    expect(payload.director_key).toBe('CMO')
  })

  it('should create chain for a security command → CISO', async () => {
    const result = await simulatePatronCommandChain(
      supabase, store,
      'Güvenlik audit raporu çıkar',
      userId,
    )

    expect(result.directorKey).toBe('CISO')
  })

  it('should create chain for a sports command → CSPO', async () => {
    const result = await simulatePatronCommandChain(
      supabase, store,
      'Antrenman programı hazırla cimnastik',
      userId,
    )

    expect(result.directorKey).toBe('CSPO')
    expect(store.task_results[0].ai_provider).toBe('CLAUDE')
  })

  it('should create chain for an HR command → CHRO', async () => {
    const result = await simulatePatronCommandChain(
      supabase, store,
      'Personel eğitim programı oluştur',
      userId,
    )

    expect(result.directorKey).toBe('CHRO')
  })

  it('should create chain for a legal command → CLO', async () => {
    const result = await simulatePatronCommandChain(
      supabase, store,
      'KVKK sözleşme şablonu hazırla',
      userId,
    )

    expect(result.directorKey).toBe('CLO')
  })

  it('all chain records should share consistent IDs', async () => {
    const result = await simulatePatronCommandChain(
      supabase, store,
      'Bütçe analizi yap',
      userId,
    )

    // patron_command and ceo_task linked
    const ceoTask = store.ceo_tasks[0]
    expect(ceoTask.patron_command_id).toBe(result.patronCommandId)

    // celf_log references ceo_task
    const celfLog = store.celf_logs[0]
    expect(celfLog.ceo_task_id).toBe(result.ceoTaskId)

    // task_result references both
    const taskResult = store.task_results[0]
    expect(taskResult.ceo_task_id).toBe(result.ceoTaskId)
    expect(taskResult.patron_command_id).toBe(result.patronCommandId)
  })

  it('should handle multiple sequential commands', async () => {
    const commands = [
      'Gelir raporu hazırla',
      'Sistem durumunu kontrol et',
      'Sosyal medya planı yap',
      'Sporcu seviye analizi',
      'Sözleşme taslağı hazırla',
    ]

    const results: ChainResult[] = []
    for (const cmd of commands) {
      results.push(await simulatePatronCommandChain(supabase, store, cmd, userId))
    }

    expect(store.patron_commands).toHaveLength(5)
    expect(store.ceo_tasks).toHaveLength(5)
    expect(store.celf_logs).toHaveLength(5)
    expect(store.task_results).toHaveLength(5)

    // Each should have unique IDs
    const patronIds = new Set(results.map((r) => r.patronCommandId))
    const ceoIds = new Set(results.map((r) => r.ceoTaskId))
    expect(patronIds.size).toBe(5)
    expect(ceoIds.size).toBe(5)

    // Verify expected directors
    expect(results[0].directorKey).toBe('CFO')
    expect(results[1].directorKey).toBe('CTO')
    expect(results[2].directorKey).toBe('CMO')
    expect(results[3].directorKey).toBe('CSPO')
    expect(results[4].directorKey).toBe('CLO')
  })

  // ─── CELF Check Tests ──────────────────────────────────────────────────

  describe('CELF Checks (veri erişim, koruma, onay, veto)', () => {
    it('should pass data access check for CFO accessing payments', () => {
      const result = checkDataAccess('CFO', ['payments', 'expenses'])
      expect(result.passed).toBe(true)
    })

    it('should fail data access check for CFO accessing security_logs', () => {
      const result = checkDataAccess('CFO', ['security_logs'])
      expect(result.passed).toBe(false)
      expect(result.message).toContain('erişim yetkiniz yok')
    })

    it('should detect protected data for CFO pricing_history', () => {
      const result = checkProtection('CFO', ['pricing_history'])
      expect(result.passed).toBe(false)
      expect(result.message).toContain('korumalı')
    })

    it('should require approval for CFO price change', () => {
      const result = checkApprovalRequired('CFO', 'fiyat_degisikligi yapılacak')
      expect(result.required).toBe(true)
      expect(result.message).toContain('Patron onayı')
    })

    it('CLO should have veto right', () => {
      expect(directorHasVeto('CLO')).toBe(true)
      expect(directorHasVeto('CFO')).toBe(false)
      expect(directorHasVeto('CTO')).toBe(false)
    })

    it('runCelfChecks should detect veto for CLO + risky operation', () => {
      const result = runCelfChecks({
        directorKey: 'CLO',
        operation: 'veri_silme işlemi',
      })
      expect(result.passed).toBe(false)
      expect(result.vetoBlocked).toBe(true)
      expect(result.errors.length).toBeGreaterThan(0)
    })

    it('runCelfChecks should pass for CTO accessing system_logs', () => {
      const result = runCelfChecks({
        directorKey: 'CTO',
        requiredData: ['system_logs', 'api_health'],
        operation: 'check system',
      })
      expect(result.passed).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('runCelfChecks should warn for CTO deploy operation', () => {
      const result = runCelfChecks({
        directorKey: 'CTO',
        operation: 'deploy yeni sürüm',
      })
      expect(result.warnings.length).toBeGreaterThan(0)
      expect(result.warnings[0]).toContain('Patron onayı')
    })
  })

  // ─── AI Provider Assignment Tests ────────────────────────────────────

  describe('AI Provider Assignments', () => {
    it('CFO should use CLAUDE and GPT', () => {
      expect(getDirectorAIProviders('CFO')).toEqual(['CLAUDE', 'GPT'])
    })

    it('CTO should use CURSOR and CLAUDE', () => {
      expect(getDirectorAIProviders('CTO')).toEqual(['CURSOR', 'CLAUDE'])
    })

    it('CPO should use V0 and CURSOR', () => {
      expect(getDirectorAIProviders('CPO')).toEqual(['V0', 'CURSOR'])
    })

    it('CISO should use CLAUDE only', () => {
      expect(getDirectorAIProviders('CISO')).toEqual(['CLAUDE'])
    })

    it('CSPO should use CLAUDE and GEMINI', () => {
      expect(getDirectorAIProviders('CSPO')).toEqual(['CLAUDE', 'GEMINI'])
    })

    it('every directorate should have at least one AI provider', () => {
      const keys = Object.keys(CELF_DIRECTORATES) as DirectorKey[]
      for (const key of keys) {
        expect(getDirectorAIProviders(key).length).toBeGreaterThan(0)
      }
    })
  })
})
