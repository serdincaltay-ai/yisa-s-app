/**
 * YİSA-S Robot İş Üretim Sistemi — Veritabanı İşlemleri
 * V3.0 Mimari: CELF üretir → CEO Havuzu → Patron onaylar → Mağaza/Deploy
 * Tarih: 6 Şubat 2026
 */

import { getSupabaseServer } from '@/lib/supabase'

// ─── Tipler ──────────────────────────────────────────────────

export type JobStatus =
  | 'producing'       // CELF üretiyor
  | 'celf_review'     // Claude denetliyor
  | 'ceo_pool'        // 10'a Çıkart havuzunda — Patron görüyor
  | 'approved'        // Patron onayladı
  | 'rejected'        // Patron reddetti
  | 'correction'      // Düzeltme notu ile geri
  | 'deploying'       // Deploy sürecinde
  | 'published'       // Mağazaya yayınlandı
  | 'archived'        // Arşivlendi

export type JobType =
  | 'logo' | 'tasarim' | 'video' | 'belge' | 'sablon'
  | 'robot' | 'antrenman' | 'rapor' | 'kampanya' | 'general'

export type ContentType = 'text' | 'image' | 'video' | 'code' | 'template' | 'robot_config' | 'report'

export interface CreateJobParams {
  ticket_no: string
  source_robot?: string
  director_key?: string
  ai_provider?: string
  title: string
  description?: string
  job_type?: JobType
  content_type?: ContentType
  priority?: 'low' | 'normal' | 'high' | 'critical'
  output_data?: Record<string, unknown>
  output_preview?: string
  attachments?: Array<{ url: string; type: string; name: string }>
  tenant_id?: string
  target_audience?: string
  token_cost?: number
  parent_job_id?: string
}

export interface RobotJob {
  id: string
  ticket_no: string
  source_robot: string
  director_key: string | null
  ai_provider: string | null
  title: string
  description: string | null
  job_type: string
  content_type: string
  priority: string
  output_data: Record<string, unknown>
  output_preview: string | null
  attachments: Array<{ url: string; type: string; name: string }>
  version: number
  status: JobStatus
  patron_decision: string | null
  patron_notes: string | null
  patron_decision_at: string | null
  store_published: boolean
  store_category: string | null
  store_price_cents: number | null
  store_published_at: string | null
  tenant_id: string | null
  target_audience: string
  token_cost: number
  iteration_count: number
  parent_job_id: string | null
  created_at: string
  updated_at: string
  completed_at: string | null
}

// ─── Ticket Numarası Üretici ─────────────────────────────────

export function generateTicketNo(): string {
  const now = new Date()
  const yy = now.getFullYear().toString().slice(-2)
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')
  const hh = String(now.getHours()).padStart(2, '0')
  const mi = String(now.getMinutes()).padStart(2, '0')
  const seq = String(Math.floor(1000 + Math.random() * 9000))
  return `JOB-${yy}${mm}${dd}-${hh}${mi}-${seq}`
}

// ─── İş Oluştur ──────────────────────────────────────────────

export async function createRobotJob(params: CreateJobParams): Promise<{ id?: string; ticket_no?: string; error?: string }> {
  const db = getSupabaseServer()
  if (!db) return { error: 'Supabase bağlantısı yok' }

  const { data, error } = await db
    .from('robot_jobs')
    .insert({
      ticket_no: params.ticket_no,
      source_robot: params.source_robot ?? 'CELF',
      director_key: params.director_key ?? null,
      ai_provider: params.ai_provider ?? null,
      title: params.title,
      description: params.description ?? null,
      job_type: params.job_type ?? 'general',
      content_type: params.content_type ?? 'text',
      priority: params.priority ?? 'normal',
      output_data: params.output_data ?? {},
      output_preview: params.output_preview ?? null,
      attachments: params.attachments ?? [],
      tenant_id: params.tenant_id ?? null,
      target_audience: params.target_audience ?? 'all',
      token_cost: params.token_cost ?? 0,
      parent_job_id: params.parent_job_id ?? null,
      status: 'producing',
    })
    .select('id, ticket_no')
    .single()

  if (error) return { error: error.message }
  return { id: data?.id, ticket_no: data?.ticket_no }
}

// ─── İş Durumunu Güncelle ────────────────────────────────────

export async function updateJobStatus(
  jobId: string,
  status: JobStatus,
  extra?: Partial<Pick<RobotJob, 'output_data' | 'output_preview' | 'ai_provider' | 'token_cost' | 'completed_at'>>
): Promise<{ error?: string }> {
  const db = getSupabaseServer()
  if (!db) return { error: 'Supabase bağlantısı yok' }

  const updates: Record<string, unknown> = { status, ...extra }
  if (status === 'approved' || status === 'published' || status === 'archived') {
    updates.completed_at = new Date().toISOString()
  }

  const { error } = await db.from('robot_jobs').update(updates).eq('id', jobId)
  return error ? { error: error.message } : {}
}

// ─── Patron Kararı ───────────────────────────────────────────

export async function setPatronDecision(
  jobId: string,
  decision: 'approved' | 'rejected' | 'correction',
  notes?: string
): Promise<{ error?: string }> {
  const db = getSupabaseServer()
  if (!db) return { error: 'Supabase bağlantısı yok' }

  const now = new Date().toISOString()
  const statusMap: Record<string, JobStatus> = {
    approved: 'approved',
    rejected: 'rejected',
    correction: 'correction',
  }

  const updates: Record<string, unknown> = {
    status: statusMap[decision],
    patron_decision: decision,
    patron_decision_at: now,
    patron_notes: notes ?? null,
  }

  if (decision === 'correction') {
    // Düzeltme: iteration sayacını artır
    const { data: job } = await db.from('robot_jobs').select('iteration_count').eq('id', jobId).single()
    updates.iteration_count = ((job?.iteration_count as number) ?? 1) + 1
  }

  if (decision === 'approved') {
    updates.completed_at = now
  }

  const { error } = await db.from('robot_jobs').update(updates).eq('id', jobId)
  return error ? { error: error.message } : {}
}

// ─── Mağazaya Yayınla ────────────────────────────────────────

export async function publishJobToStore(
  jobId: string,
  storeInfo: { category: string; price_cents?: number }
): Promise<{ product_id?: string; error?: string }> {
  const db = getSupabaseServer()
  if (!db) return { error: 'Supabase bağlantısı yok' }

  // İşi published olarak işaretle
  const now = new Date().toISOString()
  const { error: jobError } = await db
    .from('robot_jobs')
    .update({
      status: 'published' as JobStatus,
      store_published: true,
      store_category: storeInfo.category,
      store_price_cents: storeInfo.price_cents ?? 0,
      store_published_at: now,
    })
    .eq('id', jobId)

  if (jobError) return { error: jobError.message }

  // İş detaylarını al
  const { data: job, error: fetchErr } = await db
    .from('robot_jobs')
    .select('title, description, job_type, output_data, attachments')
    .eq('id', jobId)
    .single()

  if (fetchErr || !job) return { error: fetchErr?.message ?? 'İş bulunamadı' }

  // Store ürünü oluştur
  const { data: product, error: storeErr } = await db
    .from('store_products')
    .insert({
      job_id: jobId,
      name: job.title as string,
      description: job.description as string,
      category: storeInfo.category,
      price_cents: storeInfo.price_cents ?? 0,
      is_free: (storeInfo.price_cents ?? 0) === 0,
    })
    .select('id')
    .single()

  if (storeErr) return { error: storeErr.message }
  return { product_id: product?.id }
}

// ─── CEO Havuzu (10'a Çıkart) Sorgulama ──────────────────────

export async function getCeoPoolJobs(limit = 50): Promise<{ data?: RobotJob[]; error?: string }> {
  const db = getSupabaseServer()
  if (!db) return { error: 'Supabase bağlantısı yok' }

  const { data, error } = await db
    .from('robot_jobs')
    .select('*')
    .eq('status', 'ceo_pool')
    .order('priority', { ascending: true })  // critical > high > normal > low
    .order('created_at', { ascending: true })
    .limit(limit)

  if (error) return { error: error.message }
  return { data: (data ?? []) as RobotJob[] }
}

// ─── Onaylanmış İşler (Hatırlatma) ──────────────────────────

export async function getApprovedJobs(limit = 20): Promise<{ data?: RobotJob[]; error?: string }> {
  const db = getSupabaseServer()
  if (!db) return { error: 'Supabase bağlantısı yok' }

  const { data, error } = await db
    .from('robot_jobs')
    .select('*')
    .eq('status', 'approved')
    .order('patron_decision_at', { ascending: false })
    .limit(limit)

  if (error) return { error: error.message }
  return { data: (data ?? []) as RobotJob[] }
}

// ─── Düzeltme Bekleyen İşler (CELF'e geri) ──────────────────

export async function getCorrectionJobs(): Promise<{ data?: RobotJob[]; error?: string }> {
  const db = getSupabaseServer()
  if (!db) return { error: 'Supabase bağlantısı yok' }

  const { data, error } = await db
    .from('robot_jobs')
    .select('*')
    .eq('status', 'correction')
    .order('created_at', { ascending: true })

  if (error) return { error: error.message }
  return { data: (data ?? []) as RobotJob[] }
}

// ─── Tüm İşler (Filtreleme) ─────────────────────────────────

export async function getJobsByFilter(filter: {
  status?: JobStatus
  director_key?: string
  job_type?: string
  tenant_id?: string
  limit?: number
}): Promise<{ data?: RobotJob[]; error?: string }> {
  const db = getSupabaseServer()
  if (!db) return { error: 'Supabase bağlantısı yok' }

  let query = db.from('robot_jobs').select('*')

  if (filter.status) query = query.eq('status', filter.status)
  if (filter.director_key) query = query.eq('director_key', filter.director_key)
  if (filter.job_type) query = query.eq('job_type', filter.job_type)
  if (filter.tenant_id) query = query.eq('tenant_id', filter.tenant_id)

  const { data, error } = await query
    .order('created_at', { ascending: false })
    .limit(filter.limit ?? 50)

  if (error) return { error: error.message }
  return { data: (data ?? []) as RobotJob[] }
}

// ─── Tek İş Getir ───────────────────────────────────────────

export async function getJobById(jobId: string): Promise<{ data?: RobotJob; error?: string }> {
  const db = getSupabaseServer()
  if (!db) return { error: 'Supabase bağlantısı yok' }

  const { data, error } = await db
    .from('robot_jobs')
    .select('*')
    .eq('id', jobId)
    .single()

  if (error) return { error: error.message }
  return { data: data as RobotJob }
}

// ─── İş Günlüğü Ekle ────────────────────────────────────────

export async function addJobLog(params: {
  job_id: string
  action: string
  actor: string
  details?: Record<string, unknown>
}): Promise<{ error?: string }> {
  const db = getSupabaseServer()
  if (!db) return { error: 'Supabase bağlantısı yok' }

  const { error } = await db.from('robot_job_logs').insert({
    job_id: params.job_id,
    action: params.action,
    actor: params.actor,
    details: params.details ?? {},
  })

  return error ? { error: error.message } : {}
}

// ─── İş İstatistikleri ──────────────────────────────────────

export async function getJobStats(): Promise<{
  data?: { total: number; ceo_pool: number; approved: number; published: number; correction: number; rejected: number }
  error?: string
}> {
  const db = getSupabaseServer()
  if (!db) return { error: 'Supabase bağlantısı yok' }

  const statuses = ['ceo_pool', 'approved', 'published', 'correction', 'rejected'] as const
  const counts: Record<string, number> = {}

  for (const status of statuses) {
    const { count } = await db
      .from('robot_jobs')
      .select('*', { count: 'exact', head: true })
      .eq('status', status)
    counts[status] = count ?? 0
  }

  const { count: total } = await db.from('robot_jobs').select('*', { count: 'exact', head: true })

  return {
    data: {
      total: total ?? 0,
      ceo_pool: counts.ceo_pool ?? 0,
      approved: counts.approved ?? 0,
      published: counts.published ?? 0,
      correction: counts.correction ?? 0,
      rejected: counts.rejected ?? 0,
    },
  }
}
