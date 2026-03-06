/**
 * Mock Supabase Client for CELF Pipeline E2E Tests
 * Gerçek DB'ye bağlanmadan tüm Supabase işlemlerini simüle eder.
 */

import { vi } from 'vitest'

// ─── In-memory data store ────────────────────────────────────────────────────

export interface MockStore {
  tenants: Record<string, unknown>[]
  demo_requests: Record<string, unknown>[]
  user_tenants: Record<string, unknown>[]
  franchise_subdomains: Record<string, unknown>[]
  franchises: Record<string, unknown>[]
  tenant_purchases: Record<string, unknown>[]
  tenant_schedule: Record<string, unknown>[]
  sim_updates: Record<string, unknown>[]
  patron_commands: Record<string, unknown>[]
  ceo_tasks: Record<string, unknown>[]
  celf_logs: Record<string, unknown>[]
  celf_epics: Record<string, unknown>[]
  celf_tasks: Record<string, unknown>[]
  task_results: Record<string, unknown>[]
  audit_log: Record<string, unknown>[]
  [key: string]: Record<string, unknown>[]
}

export function createEmptyStore(): MockStore {
  return {
    tenants: [],
    demo_requests: [],
    user_tenants: [],
    franchise_subdomains: [],
    franchises: [],
    tenant_purchases: [],
    tenant_schedule: [],
    sim_updates: [],
    patron_commands: [],
    ceo_tasks: [],
    celf_logs: [],
    celf_epics: [],
    celf_tasks: [],
    task_results: [],
    audit_log: [],
  }
}

// ─── Mock Query Builder ──────────────────────────────────────────────────────

/**
 * Chainable query builder that mimics Supabase PostgREST API.
 * All mutations execute synchronously so tests can assert on store state
 * without awaiting microtasks.
 */
class MockQueryBuilder {
  private table: string
  private store: MockStore
  private operation: 'select' | 'insert' | 'update' | 'delete' | 'upsert'
  private insertData: Record<string, unknown> | Record<string, unknown>[] | null = null
  private updateData: Record<string, unknown> | null = null
  private filters: Array<{ type: string; column?: string; value?: unknown; values?: unknown[] }> = []
  private selectColumns: string | null = null
  private limitCount: number | null = null
  private orderColumn: string | null = null
  private orderAsc = true
  private shouldSelect = false
  private headMode = false
  private countMode: 'exact' | null = null
  private executed = false
  private executedRows: Record<string, unknown>[] = []

  constructor(table: string, store: MockStore, operation: 'select' | 'insert' | 'update' | 'delete' | 'upsert') {
    this.table = table
    this.store = store
    this.operation = operation
  }

  // ─── Filter methods ────────────────────────────────────────────────────

  eq(column: string, value: unknown): this {
    this.filters.push({ type: 'eq', column, value })
    return this
  }

  in(column: string, values: unknown[]): this {
    this.filters.push({ type: 'in', column, values })
    return this
  }

  is(column: string, value: unknown): this {
    this.filters.push({ type: 'is', column, value })
    return this
  }

  // ─── Modifier methods ──────────────────────────────────────────────────

  select(columns?: string, opts?: { count?: 'exact'; head?: boolean }): this {
    if (this.operation === 'insert' || this.operation === 'update' || this.operation === 'upsert') {
      this.shouldSelect = true
    } else {
      this.selectColumns = columns ?? '*'
    }
    if (opts?.count === 'exact') this.countMode = 'exact'
    if (opts?.head) this.headMode = true
    return this
  }

  order(column: string, opts?: { ascending?: boolean }): this {
    this.orderColumn = column
    this.orderAsc = opts?.ascending ?? true
    return this
  }

  limit(count: number): this {
    this.limitCount = count
    return this
  }

  // ─── Terminal methods ──────────────────────────────────────────────────

  single(): { data: Record<string, unknown> | null; error: null; count?: number } {
    const result = this.ensureExecuted()
    if (this.countMode === 'exact') {
      return { data: result[0] ?? null, error: null, count: result.length }
    }
    return { data: result[0] ?? null, error: null }
  }

  maybeSingle(): { data: Record<string, unknown> | null; error: null } {
    const result = this.ensureExecuted()
    return { data: result[0] ?? null, error: null }
  }

  then(resolve: (value: { data: Record<string, unknown>[]; error: null }) => void): void {
    const result = this.ensureExecuted()
    resolve({ data: result, error: null })
  }

  // ─── Execution engine ──────────────────────────────────────────────────

  private applyFilters(rows: Record<string, unknown>[]): Record<string, unknown>[] {
    let result = [...rows]
    for (const filter of this.filters) {
      if (filter.type === 'eq' && filter.column) {
        result = result.filter((r) => r[filter.column!] === filter.value)
      } else if (filter.type === 'in' && filter.column && filter.values) {
        result = result.filter((r) => filter.values!.includes(r[filter.column!]))
      } else if (filter.type === 'is' && filter.column) {
        result = result.filter((r) => r[filter.column!] === filter.value)
      }
    }
    return result
  }

  private execute(): Record<string, unknown>[] {
    if (!this.store[this.table]) {
      this.store[this.table] = []
    }
    const tableData = this.store[this.table]

    switch (this.operation) {
      case 'select': {
        let result = this.applyFilters(tableData)
        if (this.orderColumn) {
          result.sort((a, b) => {
            const aVal = a[this.orderColumn!] as string
            const bVal = b[this.orderColumn!] as string
            return this.orderAsc ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1)
          })
        }
        if (this.limitCount !== null) {
          result = result.slice(0, this.limitCount)
        }
        if (this.headMode && this.countMode === 'exact') {
          // count-only query: return empty but set count
          return result
        }
        return result
      }

      case 'insert': {
        const rows = Array.isArray(this.insertData) ? this.insertData : [this.insertData!]
        const inserted: Record<string, unknown>[] = []
        for (const row of rows) {
          const newRow = {
            id: crypto.randomUUID(),
            created_at: new Date().toISOString(),
            ...row,
          }
          tableData.push(newRow)
          inserted.push(newRow)
        }
        return inserted
      }

      case 'update': {
        const matching = this.applyFilters(tableData)
        for (const row of matching) {
          Object.assign(row, this.updateData)
        }
        return matching
      }

      case 'delete': {
        const toDelete = this.applyFilters(tableData)
        const ids = new Set(toDelete.map((r) => r.id))
        this.store[this.table] = tableData.filter((r) => !ids.has(r.id))
        return toDelete
      }

      case 'upsert': {
        const rows = Array.isArray(this.insertData) ? this.insertData : [this.insertData!]
        const upserted: Record<string, unknown>[] = []
        for (const row of rows) {
          const existing = tableData.find((r) =>
            Object.entries(row).some(([k, v]) => r[k] === v && k === 'name')
          )
          if (existing) {
            Object.assign(existing, row)
            upserted.push(existing)
          } else {
            const newRow = { id: crypto.randomUUID(), created_at: new Date().toISOString(), ...row }
            tableData.push(newRow)
            upserted.push(newRow)
          }
        }
        return upserted
      }
    }

    return []
  }

  private ensureExecuted(): Record<string, unknown>[] {
    if (this.executed) return this.executedRows
    this.executed = true
    this.executedRows = this.execute()
    return this.executedRows
  }

  // Used internally by MockSupabaseClient to set insert/update data
  _setInsertData(data: Record<string, unknown> | Record<string, unknown>[]): this {
    this.insertData = data
    // Eagerly execute insert so fire-and-forget patterns work
    this.ensureExecuted()
    return this
  }

  _setUpdateData(data: Record<string, unknown>): this {
    this.updateData = data
    return this
  }

  /** Force execution for update/delete chains without terminal calls */
  _forceExecute(): void {
    this.ensureExecuted()
  }
}

// ─── Mock Update Builder ─────────────────────────────────────────────────────

/**
 * Wrapper for update operations that auto-executes after .eq() chain.
 * Handles Supabase fire-and-forget pattern: supabase.from(t).update(data).eq(col, val)
 */
class MockUpdateBuilder {
  private qb: MockQueryBuilder

  constructor(qb: MockQueryBuilder) {
    this.qb = qb
  }

  eq(column: string, value: unknown): MockUpdateBuilder {
    this.qb.eq(column, value)
    this.qb._forceExecute()
    return this
  }

  select(columns?: string, opts?: { count?: 'exact'; head?: boolean }): MockQueryBuilder {
    return this.qb.select(columns, opts)
  }

  single(): { data: Record<string, unknown> | null; error: null } {
    this.qb._forceExecute()
    return this.qb.single()
  }
}

// ─── Mock Supabase Client ────────────────────────────────────────────────────

export interface MockSupabaseClient {
  from: (table: string) => {
    select: (columns?: string, opts?: { count?: 'exact'; head?: boolean }) => MockQueryBuilder
    insert: (data: Record<string, unknown> | Record<string, unknown>[]) => MockQueryBuilder
    update: (data: Record<string, unknown>) => MockUpdateBuilder
    delete: () => MockQueryBuilder
    upsert: (data: Record<string, unknown> | Record<string, unknown>[], opts?: { onConflict?: string; ignoreDuplicates?: boolean }) => MockQueryBuilder
  }
  auth: {
    admin: {
      listUsers: (opts?: { perPage?: number }) => Promise<{ data: { users: Array<{ id: string; email: string }> } }>
      createUser: (opts: { email: string; password: string; email_confirm: boolean; user_metadata: Record<string, unknown> }) => Promise<{
        data: { user: { id: string; email: string } } | null
        error: null
      }>
    }
    getUser: () => Promise<{ data: { user: { id: string; email: string } | null } }>
  }
}

export function createMockSupabaseClient(store: MockStore): MockSupabaseClient {
  return {
    from: (table: string) => ({
      select: (columns?: string, opts?: { count?: 'exact'; head?: boolean }) => {
        const qb = new MockQueryBuilder(table, store, 'select')
        qb.select(columns, opts)
        return qb
      },
      insert: (data: Record<string, unknown> | Record<string, unknown>[]) => {
        const qb = new MockQueryBuilder(table, store, 'insert')
        qb._setInsertData(data)
        return qb
      },
      update: (data: Record<string, unknown>) => {
        const qb = new MockQueryBuilder(table, store, 'update')
        qb._setUpdateData(data)
        return new MockUpdateBuilder(qb)
      },
      delete: () => {
        return new MockQueryBuilder(table, store, 'delete')
      },
      upsert: (data: Record<string, unknown> | Record<string, unknown>[], _opts?: { onConflict?: string; ignoreDuplicates?: boolean }) => {
        const qb = new MockQueryBuilder(table, store, 'upsert')
        qb._setInsertData(data)
        return qb
      },
    }),
    auth: {
      admin: {
        listUsers: vi.fn(async () => ({
          data: { users: [] as Array<{ id: string; email: string }> },
        })),
        createUser: vi.fn(async (opts: { email: string; password: string; email_confirm: boolean; user_metadata: Record<string, unknown> }) => ({
          data: {
            user: {
              id: crypto.randomUUID(),
              email: opts.email,
            },
          },
          error: null,
        })),
      },
      getUser: vi.fn(async () => ({
        data: { user: { id: 'mock-patron-user-id', email: 'patron@yisa-s.com' } },
      })),
    },
  }
}

// ─── Helper: seed a demo request into the store ──────────────────────────────

export function seedDemoRequest(store: MockStore, overrides: Partial<Record<string, unknown>> = {}): string {
  const id = crypto.randomUUID()
  store.demo_requests.push({
    id,
    name: 'Test Spor Okulu',
    email: 'test@example.com',
    phone: '05551234567',
    facility_type: 'cimnastik',
    city: 'Istanbul',
    notes: null,
    status: 'new',
    source: 'vitrin',
    created_at: new Date().toISOString(),
    payment_status: null,
    payment_amount: null,
    ...overrides,
  })
  return id
}
