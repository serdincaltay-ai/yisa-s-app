/**
 * CELF Pipeline E2E Test — Suite 3
 * 15 direktörlük keyword routing doğrulaması
 *
 * CELF_DIRECTORATES'taki her direktörlüğün:
 * - triggers (tetikleyici kelimeler) array'i olduğu
 * - tasks array'i olduğu
 * - aiProviders atanmış olduğu
 * - Veri erişim / koruma / onay mekanizmalarının çalıştığı
 * doğrulanır.
 */

import { describe, it, expect } from 'vitest'
import {
  CELF_DIRECTORATES,
  CELF_DIRECTORATE_KEYS,
  getDirectorAIProviders,
  directorHasVeto,
  checkDataAccess,
  checkProtection,
  checkApprovalRequired,
  checkVeto,
  runCelfChecks,
  type DirectorKey,
  type CelfAIProvider,
} from '@/lib/robots/celf-center'
import { INITIAL_TASKS, getPendingInitialTasks, getAllPendingInitialTasks } from '@/lib/robots/directorate-initial-tasks'
import { CELF_DIRECTOR_EXTERNAL_APIS } from '@/lib/ai/celf-pool'

// ─── Directorate Completeness ────────────────────────────────────────────────

describe('15 direktörlük eksiksizlik kontrolü', () => {
  const EXPECTED_KEYS: DirectorKey[] = [
    'CFO', 'CTO', 'CIO', 'CMO', 'CHRO', 'CLO',
    'CSO_SATIS', 'CPO', 'CDO', 'CISO', 'CCO',
    'CSO_STRATEJI', 'CSPO', 'COO', 'RND',
  ]

  it('CELF_DIRECTORATE_KEYS should contain exactly 15 entries', () => {
    expect(CELF_DIRECTORATE_KEYS).toHaveLength(15)
  })

  it('every expected directorate key should exist', () => {
    for (const key of EXPECTED_KEYS) {
      expect(CELF_DIRECTORATE_KEYS).toContain(key)
    }
  })

  it('CELF_DIRECTORATES should have an entry for each key', () => {
    for (const key of EXPECTED_KEYS) {
      expect(CELF_DIRECTORATES[key]).toBeDefined()
      expect(CELF_DIRECTORATES[key].name).toBeTruthy()
    }
  })

  it('no duplicate directorate keys', () => {
    const unique = new Set(CELF_DIRECTORATE_KEYS)
    expect(unique.size).toBe(CELF_DIRECTORATE_KEYS.length)
  })
})

// ─── Trigger Keywords ────────────────────────────────────────────────────────

describe('15 direktörlük keyword routing doğrulaması', () => {
  it.each(CELF_DIRECTORATE_KEYS)('%s should have non-empty triggers array', (key) => {
    const dir = CELF_DIRECTORATES[key]
    expect(dir.triggers).toBeDefined()
    expect(Array.isArray(dir.triggers)).toBe(true)
    expect(dir.triggers.length).toBeGreaterThan(0)
  })

  it.each(CELF_DIRECTORATE_KEYS)('%s should have non-empty tasks array', (key) => {
    const dir = CELF_DIRECTORATES[key]
    expect(dir.tasks).toBeDefined()
    expect(Array.isArray(dir.tasks)).toBe(true)
    expect(dir.tasks.length).toBeGreaterThan(0)
  })

  it.each(CELF_DIRECTORATE_KEYS)('%s should have at least one AI provider', (key) => {
    const dir = CELF_DIRECTORATES[key]
    expect(dir.aiProviders).toBeDefined()
    expect(dir.aiProviders.length).toBeGreaterThan(0)
  })

  it('each directorate triggers should be unique strings', () => {
    for (const key of CELF_DIRECTORATE_KEYS) {
      const dir = CELF_DIRECTORATES[key]
      for (const trigger of dir.triggers) {
        expect(typeof trigger).toBe('string')
        expect(trigger.trim().length).toBeGreaterThan(0)
      }
    }
  })

  // Specific trigger keyword verification per directorate
  const expectedTriggers: Record<string, string[]> = {
    CFO: ['gelir', 'gider', 'bütçe', 'finans'],
    CTO: ['sistem', 'kod', 'api', 'teknoloji'],
    CIO: ['veri', 'database', 'entegrasyon', 'bilgi'],
    CMO: ['kampanya', 'reklam', 'pazarlama'],
    CHRO: ['personel', 'eğitim', 'izin'],
    CLO: ['sözleşme', 'kvkk', 'hukuk'],
    CSO_SATIS: ['müşteri', 'crm', 'satış'],
    CPO: ['şablon', 'tasarım', 'ui', 'ürün'],
    CDO: ['analiz', 'rapor', 'dashboard'],
    CISO: ['güvenlik', 'audit', 'erişim'],
    CCO: ['destek', 'şikayet', 'memnuniyet'],
    CSO_STRATEJI: ['plan', 'hedef', 'strateji'],
    CSPO: ['antrenman', 'sporcu', 'program', 'spor'],
    COO: ['operasyon', 'süreç', 'tesis', 'deploy'],
    RND: ['ar-ge', 'araştırma', 'inovasyon'],
  }

  for (const [key, expectedKeywords] of Object.entries(expectedTriggers)) {
    it(`${key} should contain expected trigger keywords`, () => {
      const dir = CELF_DIRECTORATES[key as DirectorKey]
      for (const keyword of expectedKeywords) {
        expect(dir.triggers).toContain(keyword)
      }
    })
  }
})

// ─── AI Provider Assignment ──────────────────────────────────────────────────

describe('AI provider atamaları', () => {
  const VALID_PROVIDERS: CelfAIProvider[] = ['GPT', 'CLAUDE', 'GEMINI', 'TOGETHER', 'V0', 'CURSOR']

  it.each(CELF_DIRECTORATE_KEYS)('%s aiProviders should only contain valid providers', (key) => {
    const dir = CELF_DIRECTORATES[key]
    for (const provider of dir.aiProviders) {
      expect(VALID_PROVIDERS).toContain(provider)
    }
  })

  it('getDirectorAIProviders should return correct providers for each directorate', () => {
    expect(getDirectorAIProviders('CFO')).toEqual(['CLAUDE', 'GPT'])
    expect(getDirectorAIProviders('CTO')).toEqual(['CURSOR', 'CLAUDE'])
    expect(getDirectorAIProviders('CPO')).toEqual(['V0', 'CURSOR'])
    expect(getDirectorAIProviders('CDO')).toEqual(['TOGETHER', 'CLAUDE'])
    expect(getDirectorAIProviders('RND')).toEqual(['CLAUDE', 'TOGETHER'])
  })

  it('CPO should have V0 provider (tasarım/UI)', () => {
    expect(CELF_DIRECTORATES.CPO.aiProviders).toContain('V0')
  })

  it('CTO should have CURSOR provider (kod yazma)', () => {
    expect(CELF_DIRECTORATES.CTO.aiProviders).toContain('CURSOR')
  })

  it('CELF_DIRECTOR_EXTERNAL_APIS should cover all 15 directorates', () => {
    for (const key of CELF_DIRECTORATE_KEYS) {
      expect(CELF_DIRECTOR_EXTERNAL_APIS[key]).toBeDefined()
      expect(CELF_DIRECTOR_EXTERNAL_APIS[key].length).toBeGreaterThan(0)
    }
  })
})

// ─── Data Access & Protection ────────────────────────────────────────────────

describe('veri erişim, koruma ve onay kontrolleri', () => {
  it('CFO should access payments, invoices, expenses, revenue', () => {
    const result = checkDataAccess('CFO', ['payments', 'invoices', 'expenses', 'revenue'])
    expect(result.passed).toBe(true)
  })

  it('CFO should NOT access system_logs (CTO domain)', () => {
    const result = checkDataAccess('CFO', ['system_logs'])
    expect(result.passed).toBe(false)
    expect(result.message).toContain('erişim yetkiniz yok')
  })

  it('CTO should have access to system_logs, api_health, deployments', () => {
    const result = checkDataAccess('CTO', ['system_logs', 'api_health', 'deployments'])
    expect(result.passed).toBe(true)
  })

  it('CISO should access security_logs and access_logs', () => {
    const result = checkDataAccess('CISO', ['security_logs', 'access_logs'])
    expect(result.passed).toBe(true)
  })

  it('CSPO should access athletes, movements, training_programs', () => {
    const result = checkDataAccess('CSPO', ['athletes', 'movements', 'training_programs'])
    expect(result.passed).toBe(true)
  })

  it('CSPO should NOT modify medical_data (protected)', () => {
    const result = checkProtection('CSPO', ['medical_data'])
    expect(result.passed).toBe(false)
    expect(result.message).toContain('korumalı')
  })

  it('CTO should NOT modify env_variables (protected)', () => {
    const result = checkProtection('CTO', ['env_variables'])
    expect(result.passed).toBe(false)
  })

  it('CFO fiyat_degisikligi should require Patron approval', () => {
    const result = checkApprovalRequired('CFO', 'fiyat_degisikligi')
    expect(result.required).toBe(true)
    expect(result.message).toContain('Patron onayı')
  })

  it('CTO deploy should require Patron approval', () => {
    const result = checkApprovalRequired('CTO', 'deploy')
    expect(result.required).toBe(true)
  })

  it('CHRO role_change should require Patron approval', () => {
    const result = checkApprovalRequired('CHRO', 'role_change')
    expect(result.required).toBe(true)
  })
})

// ─── CLO Veto Mechanism ─────────────────────────────────────────────────────

describe('CLO veto mekanizması', () => {
  it('CLO should have veto power', () => {
    expect(directorHasVeto('CLO')).toBe(true)
  })

  it('non-CLO directorates should NOT have veto power', () => {
    const nonVeto: DirectorKey[] = ['CFO', 'CTO', 'CIO', 'CMO', 'CHRO', 'CSO_SATIS', 'CPO', 'CDO', 'CISO', 'CCO', 'CSO_STRATEJI', 'CSPO', 'COO', 'RND']
    for (const key of nonVeto) {
      expect(directorHasVeto(key)).toBe(false)
    }
  })

  it('CLO should veto risky operations (silme, kvkk)', () => {
    const vetoSilme = checkVeto('CLO', 'veri_silme')
    expect(vetoSilme.veto).toBe(true)
    expect(vetoSilme.message).toContain('veto')

    const vetoKvkk = checkVeto('CLO', 'kvkk kontrolü')
    expect(vetoKvkk.veto).toBe(true)
  })

  it('CLO should NOT veto safe operations', () => {
    const result = checkVeto('CLO', 'rapor oluştur')
    expect(result.veto).toBe(false)
  })

  it('runCelfChecks should block on CLO veto', () => {
    const result = runCelfChecks({
      directorKey: 'CLO',
      operation: 'veri_silme',
      requiredData: ['contracts'],
      affectedData: ['legal_documents'],
    })
    expect(result.passed).toBe(false)
    expect(result.vetoBlocked).toBe(true)
  })
})

// ─── runCelfChecks Integration ───────────────────────────────────────────────

describe('runCelfChecks entegrasyon', () => {
  it('should pass for valid CFO operation with proper data access', () => {
    const result = runCelfChecks({
      directorKey: 'CFO',
      requiredData: ['payments'],
      affectedData: [],
      operation: 'rapor_olustur',
    })
    expect(result.passed).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('should fail for unauthorized data access', () => {
    const result = runCelfChecks({
      directorKey: 'CMO',
      requiredData: ['security_logs'],
      affectedData: [],
      operation: 'log_oku',
    })
    expect(result.passed).toBe(false)
    expect(result.errors.length).toBeGreaterThan(0)
  })

  it('should add warning for operations requiring Patron approval', () => {
    const result = runCelfChecks({
      directorKey: 'CTO',
      requiredData: ['deployments'],
      affectedData: [],
      operation: 'deploy',
    })
    expect(result.warnings.length).toBeGreaterThan(0)
    expect(result.warnings.some((w) => w.includes('Patron'))).toBe(true)
  })

  it('should fail for protected data modification', () => {
    const result = runCelfChecks({
      directorKey: 'CTO',
      requiredData: ['system_logs'],
      affectedData: ['api_keys'],
      operation: 'key_update',
    })
    expect(result.passed).toBe(false)
    expect(result.errors.some((e) => e.includes('korumalı'))).toBe(true)
  })
})

// ─── Initial Tasks per Directorate ──────────────────────────────────────────

describe('direktörlük başlangıç görevleri', () => {
  it('INITIAL_TASKS should have entries for all 15 directorates', () => {
    for (const key of CELF_DIRECTORATE_KEYS) {
      expect(INITIAL_TASKS[key]).toBeDefined()
      expect(INITIAL_TASKS[key].length).toBeGreaterThan(0)
    }
  })

  it('each initial task should have required fields', () => {
    for (const key of CELF_DIRECTORATE_KEYS) {
      for (const task of INITIAL_TASKS[key]) {
        expect(task.id).toBeTruthy()
        expect(task.directorKey).toBe(key)
        expect(task.name).toBeTruthy()
        expect(task.description).toBeTruthy()
        expect(['high', 'medium', 'low']).toContain(task.priority)
        expect(task.estimatedMinutes).toBeGreaterThan(0)
        expect(typeof task.requiresApproval).toBe('boolean')
        expect(task.aiProvider).toBeTruthy()
        expect(task.command).toBeTruthy()
        expect(['pending', 'running', 'completed', 'failed']).toContain(task.status)
      }
    }
  })

  it('getPendingInitialTasks should return only pending tasks', () => {
    const pending = getPendingInitialTasks('CFO')
    expect(pending.length).toBeGreaterThan(0)
    for (const task of pending) {
      expect(task.status).toBe('pending')
    }
  })

  it('getAllPendingInitialTasks should return tasks sorted by priority', () => {
    const all = getAllPendingInitialTasks()
    expect(all.length).toBeGreaterThan(0)

    // Verify priority ordering: high before medium before low
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    for (let i = 1; i < all.length; i++) {
      expect(priorityOrder[all[i].priority]).toBeGreaterThanOrEqual(
        priorityOrder[all[i - 1].priority]
      )
    }
  })

  it('task IDs should follow directorate prefix convention', () => {
    for (const key of CELF_DIRECTORATE_KEYS) {
      for (const task of INITIAL_TASKS[key]) {
        expect(task.id.startsWith(key)).toBe(true)
      }
    }
  })
})

// ─── Directorate Name Mapping ────────────────────────────────────────────────

describe('direktörlük isimleri', () => {
  const expectedNames: Record<string, string> = {
    CFO: 'Finans',
    CTO: 'Teknoloji',
    CIO: 'Bilgi Sistemleri',
    CMO: 'Pazarlama',
    CHRO: 'İnsan Kaynakları',
    CLO: 'Hukuk',
    CSO_SATIS: 'Satış',
    CPO: 'Ürün',
    CDO: 'Veri / Analitik',
    CISO: 'Bilgi Güvenliği',
    CCO: 'Müşteri İlişkileri',
    CSO_STRATEJI: 'Strateji',
    CSPO: 'Spor (SD)',
    COO: 'Operasyon',
    RND: 'AR-GE',
  }

  for (const [key, expectedName] of Object.entries(expectedNames)) {
    it(`${key} should be named "${expectedName}"`, () => {
      expect(CELF_DIRECTORATES[key as DirectorKey].name).toBe(expectedName)
    })
  }
})
