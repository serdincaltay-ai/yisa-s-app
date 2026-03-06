/**
 * Mock Supabase Client — CELF pipeline E2E testleri için.
 * Gerçek DB'ye bağlanmaz; insert/select/update çağrılarını kaydeder.
 */

import { vi } from 'vitest'

// ─── Types ──────────────────────────────────────────────────────────────────

export interface MockCall {
  table: string
  method: 'insert' | 'select' | 'update' | 'delete' | 'upsert'
  args: unknown
  filters: Record<string, unknown>
}

export interface MockRow {
  id: string
  [key: string]: unknown
}

// ─── MockSupabaseClient ─────────────────────────────────────────────────────

export function createMockSupabaseClient(options?: {
  /** Pre-seeded rows per table. from('table').select() will return these. */
  seedData?: Record<string, MockRow[]>
  /** If set, insert/update on these tables returns an error. */
  errorTables?: string[]
}) {
  const calls: MockCall[] = []
  const seedData = options?.seedData ?? {}
  const errorTables = new Set(options?.errorTables ?? [])
  let autoIdCounter = 1

  function makeError(table: string) {
    return {
      code: 'MOCK_ERROR',
      message: `Mock error for table: ${table}`,
      details: '',
      hint: '',
    }
  }

  function generateId(): string {
    return `mock-uuid-${String(autoIdCounter++).padStart(4, '0')}`
  }

  /**
   * Build a chainable query builder that records calls.
   */
  function queryBuilder(table: string) {
    let method: MockCall['method'] = 'select'
    let insertData: unknown = null
    let updateData: unknown = null
    const filters: Record<string, unknown> = {}
    let countMode = false
    let headMode = false
    let singleMode = false
    let maybeSingleMode = false

    const chain = {
      select(cols?: string, opts?: { count?: string; head?: boolean }) {
        // If method is already 'insert' or 'upsert', keep it — .select() after .insert() is a column selector
        if (method !== 'insert' && method !== 'upsert') {
          method = 'select'
        }
        if (opts?.count) countMode = true
        if (opts?.head) headMode = true
        return chain
      },
      insert(data: unknown) {
        method = 'insert'
        insertData = data
        return chain
      },
      update(data: unknown) {
        method = 'update'
        updateData = data
        return chain
      },
      delete() {
        method = 'delete'
        return chain
      },
      upsert(data: unknown, _opts?: unknown) {
        method = 'upsert'
        insertData = data
        return chain
      },
      eq(col: string, val: unknown) {
        filters[`eq_${col}`] = val
        return chain
      },
      in(col: string, vals: unknown[]) {
        filters[`in_${col}`] = vals
        return chain
      },
      is(col: string, val: unknown) {
        filters[`is_${col}`] = val
        return chain
      },
      order(_col: string, _opts?: unknown) {
        return chain
      },
      limit(_n: number) {
        return chain
      },
      single() {
        singleMode = true
        return chain
      },
      maybeSingle() {
        maybeSingleMode = true
        return chain
      },

      /** Terminal — resolves the chain (PromiseLike) */
      then(
        onfulfilled?: ((value: unknown) => unknown) | null,
        onrejected?: ((reason: unknown) => unknown) | null
      ) {
        const result = resolve()
        return Promise.resolve(result).then(onfulfilled, onrejected)
      },
    }

    function resolve(): {
      data: unknown
      error: unknown
      count?: number | null
    } {
      // Record the call
      calls.push({
        table,
        method,
        args: method === 'insert' || method === 'upsert' ? insertData : method === 'update' ? updateData : null,
        filters: { ...filters },
      })

      // Error tables
      if (errorTables.has(table)) {
        return { data: null, error: makeError(table) }
      }

      switch (method) {
        case 'insert': {
          const row = typeof insertData === 'object' && insertData !== null
            ? { id: generateId(), ...insertData as Record<string, unknown> }
            : { id: generateId() }
          if (!seedData[table]) seedData[table] = []
          seedData[table].push(row as MockRow)
          if (singleMode) return { data: row, error: null }
          return { data: [row], error: null }
        }
        case 'upsert': {
          const row = typeof insertData === 'object' && insertData !== null
            ? { id: generateId(), ...insertData as Record<string, unknown> }
            : { id: generateId() }
          if (!seedData[table]) seedData[table] = []
          seedData[table].push(row as MockRow)
          if (singleMode) return { data: row, error: null }
          return { data: [row], error: null }
        }
        case 'select': {
          const rows = seedData[table] ?? []
          if (countMode && headMode) {
            return { data: null, error: null, count: rows.length }
          }
          if (singleMode) {
            return { data: rows[0] ?? null, error: rows.length === 0 ? { code: 'PGRST116', message: 'No rows' } : null }
          }
          if (maybeSingleMode) {
            return { data: rows[0] ?? null, error: null }
          }
          return { data: rows, error: null }
        }
        case 'update': {
          const rows = seedData[table] ?? []
          const updated = rows.map((r) => ({ ...r, ...updateData as Record<string, unknown> }))
          seedData[table] = updated as MockRow[]
          return { data: updated, error: null }
        }
        case 'delete': {
          seedData[table] = []
          return { data: null, error: null }
        }
        default:
          return { data: null, error: null }
      }
    }

    return chain
  }

  const client = {
    from: vi.fn((table: string) => queryBuilder(table)),
    auth: {
      admin: {
        listUsers: vi.fn(async () => ({
          data: { users: [] },
          error: null,
        })),
        createUser: vi.fn(async (opts: { email: string; password: string }) => ({
          data: {
            user: {
              id: generateId(),
              email: opts.email,
            },
          },
          error: null,
        })),
      },
      getUser: vi.fn(async () => ({
        data: { user: null, session: null },
        error: null,
      })),
      getSession: vi.fn(async () => ({
        data: { session: null },
        error: null,
      })),
    },
  }

  return {
    client,
    /** All recorded DB calls in order */
    getCalls: () => calls,
    /** Get calls filtered by table */
    getCallsForTable: (table: string) => calls.filter((c) => c.table === table),
    /** Get calls filtered by table + method */
    getCallsForTableMethod: (table: string, m: MockCall['method']) =>
      calls.filter((c) => c.table === table && c.method === m),
    /** Reset call history */
    resetCalls: () => { calls.length = 0 },
    /** Get seeded/inserted data for a table */
    getData: (table: string) => seedData[table] ?? [],
  }
}
