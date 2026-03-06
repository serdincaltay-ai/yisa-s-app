/**
 * CELF Pipeline E2E Test — Suite 2
 * patron_commands → ceo_tasks → task_results zinciri (chain)
 *
 * Mock Supabase client kullanır (gerçek DB'ye bağlanmaz).
 * getSupabaseServer() mock'lanarak createCeoTask, createPatronCommand,
 * insertCelfLog ve createTaskResult fonksiyonlarının doğru tabloları,
 * doğru payload'larla çağırdığı doğrulanır.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createMockSupabaseClient } from './helpers/mock-supabase'

// ─── Mock Supabase modules ──────────────────────────────────────────────────

const mockSupabase = createMockSupabaseClient()

// Mock getSupabaseServer — used by ceo-celf.ts and task-results.ts
vi.mock('@/lib/supabase', () => ({
  getSupabaseServer: () => mockSupabase.client,
  isSupabaseConfigured: true,
  supabase: mockSupabase.client,
}))

// ─── Tests ──────────────────────────────────────────────────────────────────

describe('patron_commands → ceo_tasks → task_results zinciri', () => {
  beforeEach(() => {
    mockSupabase.resetCalls()
  })

  it('createPatronCommand should INSERT into patron_commands with correct fields', async () => {
    const { createPatronCommand } = await import('@/lib/db/ceo-celf')

    const result = await createPatronCommand({
      user_id: 'patron-user-001',
      command: 'Tüm direktörlüklere başlangıç görevi ver',
      ceo_task_id: undefined,
      output_payload: { source: 'chat' },
    })

    expect(result.id).toBeDefined()
    expect(result.error).toBeUndefined()

    // Verify patron_commands table was called with INSERT
    const patronInserts = mockSupabase.getCallsForTableMethod('patron_commands', 'insert')
    expect(patronInserts).toHaveLength(1)

    const args = patronInserts[0].args as Record<string, unknown>
    expect(args.user_id).toBe('patron-user-001')
    expect(args.command).toBe('Tüm direktörlüklere başlangıç görevi ver')
    expect(args.status).toBe('pending')
    expect(args.ceo_task_id).toBeNull()
    expect(args.output_payload).toEqual({ source: 'chat' })
  })

  it('createCeoTask should INSERT into ceo_tasks with correct fields', async () => {
    const { createCeoTask } = await import('@/lib/db/ceo-celf')

    const result = await createCeoTask({
      user_id: 'patron-user-001',
      task_description: 'Finansal rapor oluştur',
      task_type: 'celf_directorate',
      director_key: 'CFO',
    })

    expect(result.id).toBeDefined()
    expect(result.error).toBeUndefined()

    // Verify ceo_tasks table was called
    const ceoInserts = mockSupabase.getCallsForTableMethod('ceo_tasks', 'insert')
    expect(ceoInserts.length).toBeGreaterThanOrEqual(1)

    const args = ceoInserts[0].args as Record<string, unknown>
    expect(args.user_id).toBe('patron-user-001')
    expect(args.task_description).toBe('Finansal rapor oluştur')
    expect(args.task_type).toBe('celf_directorate')
    expect(args.director_key).toBe('CFO')
    expect(args.status).toBe('assigned')
  })

  it('insertCelfLog should INSERT into celf_logs with correct fields', async () => {
    const { insertCelfLog } = await import('@/lib/db/ceo-celf')

    const result = await insertCelfLog({
      ceo_task_id: 'task-001',
      director_key: 'CTO',
      action: 'execute',
      input_summary: 'Sistem sağlık kontrolü yap',
      output_summary: 'Tüm sistemler çalışıyor',
      payload: { health: 'ok' },
    })

    expect(result.id).toBeDefined()
    expect(result.error).toBeUndefined()

    const logInserts = mockSupabase.getCallsForTableMethod('celf_logs', 'insert')
    expect(logInserts.length).toBeGreaterThanOrEqual(1)

    const args = logInserts[0].args as Record<string, unknown>
    expect(args.ceo_task_id).toBe('task-001')
    expect(args.director_key).toBe('CTO')
    expect(args.action).toBe('execute')
    expect(args.input_summary).toBe('Sistem sağlık kontrolü yap')
    expect(args.output_summary).toBe('Tüm sistemler çalışıyor')
    expect(args.payload).toEqual({ health: 'ok' })
  })

  it('createTaskResult should INSERT into task_results with correct fields', async () => {
    const { createTaskResult } = await import('@/lib/db/task-results')

    const result = await createTaskResult({
      task_id: 'task-001',
      director_key: 'CFO',
      ai_providers: ['GPT', 'CLAUDE'],
      input_command: 'Aylık gelir-gider raporu oluştur',
      output_result: 'Rapor: Toplam gelir 50.000 TL, gider 30.000 TL',
      status: 'completed',
    })

    expect(result.id).toBeDefined()
    expect(result.error).toBeUndefined()

    const trInserts = mockSupabase.getCallsForTableMethod('task_results', 'insert')
    expect(trInserts.length).toBeGreaterThanOrEqual(1)

    const args = trInserts[0].args as Record<string, unknown>
    expect(args.task_id).toBe('task-001')
    expect(args.director_key).toBe('CFO')
    expect(args.ai_providers).toEqual(['GPT', 'CLAUDE'])
    expect(args.input_command).toBe('Aylık gelir-gider raporu oluştur')
    expect(args.output_result).toContain('50.000 TL')
    expect(args.status).toBe('completed')
  })

  it('full chain: patron_command → ceo_task → celf_log → task_result', async () => {
    const { createPatronCommand, createCeoTask, insertCelfLog } = await import('@/lib/db/ceo-celf')
    const { createTaskResult } = await import('@/lib/db/task-results')

    // Step 1: Patron issues command
    const patronCmd = await createPatronCommand({
      user_id: 'patron-001',
      command: 'CTO: Sistem sağlık kontrolü yap',
    })
    expect(patronCmd.id).toBeDefined()

    // Step 2: CEO task created for CTO directorate
    const ceoTask = await createCeoTask({
      user_id: 'patron-001',
      task_description: 'Sistem sağlık kontrolü yap',
      task_type: 'celf_directorate',
      director_key: 'CTO',
    })
    expect(ceoTask.id).toBeDefined()

    // Step 3: CELF log entry for directorate execution
    const celfLog = await insertCelfLog({
      ceo_task_id: ceoTask.id,
      director_key: 'CTO',
      action: 'execute',
      input_summary: 'Sistem sağlık kontrolü yap',
      output_summary: 'API endpointleri çalışıyor, Supabase bağlantısı aktif',
    })
    expect(celfLog.id).toBeDefined()

    // Step 4: Task result recorded
    const taskResult = await createTaskResult({
      task_id: ceoTask.id,
      director_key: 'CTO',
      ai_providers: ['CLAUDE'],
      input_command: 'Sistem sağlık kontrolü yap',
      output_result: 'Tüm sistemler aktif. API yanıt süresi: 120ms.',
      status: 'completed',
    })
    expect(taskResult.id).toBeDefined()

    // Verify the full chain of DB calls
    const allCalls = mockSupabase.getCalls()
    const tables = allCalls.map((c) => c.table)

    expect(tables).toContain('patron_commands')
    expect(tables).toContain('ceo_tasks')
    expect(tables).toContain('celf_logs')
    expect(tables).toContain('task_results')

    // Verify order: patron_commands → ceo_tasks → celf_logs → task_results
    const patronIdx = tables.indexOf('patron_commands')
    const ceoIdx = tables.indexOf('ceo_tasks')
    const logIdx = tables.indexOf('celf_logs')
    const resultIdx = tables.indexOf('task_results')

    expect(patronIdx).toBeLessThan(ceoIdx)
    expect(ceoIdx).toBeLessThan(logIdx)
    expect(logIdx).toBeLessThan(resultIdx)
  })

  it('createPatronCommand should handle null user_id', async () => {
    const { createPatronCommand } = await import('@/lib/db/ceo-celf')

    const result = await createPatronCommand({
      command: 'Anonim komut testi',
    })

    expect(result.id).toBeDefined()

    const inserts = mockSupabase.getCallsForTableMethod('patron_commands', 'insert')
    const lastInsert = inserts[inserts.length - 1]
    const args = lastInsert.args as Record<string, unknown>
    expect(args.user_id).toBeNull()
  })

  it('createCeoTask should set status to assigned by default', async () => {
    const { createCeoTask } = await import('@/lib/db/ceo-celf')

    await createCeoTask({
      user_id: 'user-002',
      task_description: 'Test görev',
      task_type: 'manual',
      director_key: 'CMO',
    })

    const inserts = mockSupabase.getCallsForTableMethod('ceo_tasks', 'insert')
    const lastInsert = inserts[inserts.length - 1]
    const args = lastInsert.args as Record<string, unknown>
    expect(args.status).toBe('assigned')
  })

  it('createTaskResult should default status to completed', async () => {
    const { createTaskResult } = await import('@/lib/db/task-results')

    await createTaskResult({
      input_command: 'Test komut',
      output_result: 'Test sonuç',
    })

    const inserts = mockSupabase.getCallsForTableMethod('task_results', 'insert')
    const lastInsert = inserts[inserts.length - 1]
    const args = lastInsert.args as Record<string, unknown>
    expect(args.status).toBe('completed')
  })

  it('insertCelfLog should handle missing optional fields', async () => {
    const { insertCelfLog } = await import('@/lib/db/ceo-celf')

    const result = await insertCelfLog({
      director_key: 'CISO',
    })

    expect(result.id).toBeDefined()

    const inserts = mockSupabase.getCallsForTableMethod('celf_logs', 'insert')
    const lastInsert = inserts[inserts.length - 1]
    const args = lastInsert.args as Record<string, unknown>
    expect(args.ceo_task_id).toBeNull()
    expect(args.action).toBeNull()
    expect(args.input_summary).toBeNull()
    expect(args.output_summary).toBeNull()
    expect(args.payload).toEqual({})
  })

  it('multi-directorate chain: patron issues command spanning CFO + CTO', async () => {
    const { createPatronCommand, createCeoTask, insertCelfLog } = await import('@/lib/db/ceo-celf')
    const { createTaskResult } = await import('@/lib/db/task-results')

    // Patron command
    const cmd = await createPatronCommand({
      user_id: 'patron-001',
      command: 'Bütçe planla ve sistem kontrolü yap',
    })
    expect(cmd.id).toBeDefined()

    // CFO task
    const cfoTask = await createCeoTask({
      user_id: 'patron-001',
      task_description: 'Bütçe planla',
      task_type: 'celf_directorate',
      director_key: 'CFO',
    })
    expect(cfoTask.id).toBeDefined()

    // CTO task
    const ctoTask = await createCeoTask({
      user_id: 'patron-001',
      task_description: 'Sistem kontrolü yap',
      task_type: 'celf_directorate',
      director_key: 'CTO',
    })
    expect(ctoTask.id).toBeDefined()

    // CFO execution + result
    await insertCelfLog({
      ceo_task_id: cfoTask.id,
      director_key: 'CFO',
      action: 'execute',
      input_summary: 'Bütçe planla',
      output_summary: 'Bütçe planı oluşturuldu',
    })
    await createTaskResult({
      task_id: cfoTask.id,
      director_key: 'CFO',
      ai_providers: ['GPT'],
      input_command: 'Bütçe planla',
      output_result: 'Q1 bütçe planı: Gelir hedefi 100K TL',
      status: 'completed',
    })

    // CTO execution + result
    await insertCelfLog({
      ceo_task_id: ctoTask.id,
      director_key: 'CTO',
      action: 'execute',
      input_summary: 'Sistem kontrolü yap',
      output_summary: 'Sistem sağlıklı',
    })
    await createTaskResult({
      task_id: ctoTask.id,
      director_key: 'CTO',
      ai_providers: ['CLAUDE'],
      input_command: 'Sistem kontrolü yap',
      output_result: 'Tüm API endpointleri aktif',
      status: 'completed',
    })

    // Verify both directorates wrote to all tables
    const ceoInserts = mockSupabase.getCallsForTableMethod('ceo_tasks', 'insert')
    const cfoInsert = ceoInserts.find((c) => (c.args as Record<string, unknown>).director_key === 'CFO')
    const ctoInsert = ceoInserts.find((c) => (c.args as Record<string, unknown>).director_key === 'CTO')
    expect(cfoInsert).toBeDefined()
    expect(ctoInsert).toBeDefined()

    const trInserts = mockSupabase.getCallsForTableMethod('task_results', 'insert')
    const cfoResult = trInserts.find((c) => (c.args as Record<string, unknown>).director_key === 'CFO')
    const ctoResult = trInserts.find((c) => (c.args as Record<string, unknown>).director_key === 'CTO')
    expect(cfoResult).toBeDefined()
    expect(ctoResult).toBeDefined()
  })
})
