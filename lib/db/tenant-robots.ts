/**
 * YİSA-S Tenant İşletme Robotları — Veritabanı İşlemleri
 * V3.0 Bölüm 6: Muhasebe, Sosyal Medya, Antrenör, Satış, İK, İletişim
 * Tarih: 6 Şubat 2026
 */

import { getSupabaseServer } from '@/lib/supabase'

// ─── Tipler ──────────────────────────────────────────────────

export type TenantRobotType = 'muhasebe' | 'sosyal_medya' | 'antrenor' | 'satis' | 'ik' | 'iletisim'

export interface TenantRobot {
  id: string
  tenant_id: string
  robot_type: TenantRobotType
  robot_name: string
  system_prompt: string
  capabilities: string[]
  boundaries: string[]
  ai_provider: string
  token_limit: number
  token_used: number
  is_active: boolean
  installed_at: string
  last_active_at: string | null
  created_at: string
  updated_at: string
}

// ─── Varsayılan Robot Tanımları (CELF tarafından üretilir) ──

export const DEFAULT_TENANT_ROBOTS: Array<{
  robot_type: TenantRobotType
  robot_name: string
  system_prompt: string
  capabilities: string[]
  boundaries: string[]
  ai_provider: string
  token_limit: number
}> = [
  {
    robot_type: 'muhasebe',
    robot_name: 'Muhasebe Robotu',
    system_prompt: 'Sen bir işletme muhasebe asistanısın. Sadece kasa defteri, ödeme takibi, aidat toplama, sabit ödemeler ve gelir-gider konularında yardım edersin. Finansal işlemler dışında yorum yapma. Veri silme, değiştirme yapma — sadece kayıt ve raporlama yap. Türkçe ve profesyonel yanıt ver.',
    capabilities: ['kasa_defteri', 'odeme_takibi', 'aidat_toplama', 'sabit_odemeler', 'gelir_gider_raporu'],
    boundaries: ['sadece_finans', 'silme_yasak', 'degistirme_yasak', 'yayinlama_yasak'],
    ai_provider: 'GPT',
    token_limit: 5000,
  },
  {
    robot_type: 'sosyal_medya',
    robot_name: 'Sosyal Medya Robotu',
    system_prompt: 'Sen bir sosyal medya yönetim asistanısın. Sadece paylaşım planı, şablon hazırlama, kampanya içeriği ve sosyal medya stratejisi konularında çalışırsın. İçerik üretirsin ama yayınlama yapma — onay gerekir. Türkçe ve yaratıcı yanıt ver.',
    capabilities: ['paylasim_plani', 'sablon_hazirlama', 'kampanya_icerigi', 'icerik_uretme'],
    boundaries: ['sadece_sosyal_medya', 'yayinlama_onay_gerekli', 'silme_yasak'],
    ai_provider: 'GPT',
    token_limit: 5000,
  },
  {
    robot_type: 'antrenor',
    robot_name: 'Antrenör Robotu',
    system_prompt: 'Sen bir sportif antrenör asistanısın. Antrenman programı oluşturma, ölçüm takibi, branş yönlendirme ve hareket havuzu yönetimi konularında çalışırsın. Çocuk ham verisi açıklamazsın — sadece yorumlanmış öneriler sunarsın. Ortopedik risk tespitinde Sportif Direktöre bildirim ver. Türkçe ve güvenli yanıt ver.',
    capabilities: ['antrenman_programi', 'olcum_takibi', 'brans_yonlendirme', 'hareket_havuzu'],
    boundaries: ['sadece_sportif', 'cocuk_ham_veri_yasak', 'ortopedik_uyari_bildir', 'silme_yasak'],
    ai_provider: 'CLAUDE',
    token_limit: 8000,
  },
  {
    robot_type: 'satis',
    robot_name: 'Satış Robotu',
    system_prompt: 'Sen bir satış ve pazarlama asistanısın. Ders programı reklamı, kampanya duyurusu, oyun saatleri tanıtımı ve üye kazanma konularında çalışırsın. Fiyat değişikliği ve indirim yapma — sadece mevcut fiyatları göster. Türkçe ve ikna edici yanıt ver.',
    capabilities: ['ders_reklami', 'kampanya_duyurusu', 'uye_kazanma', 'fiyat_gosterme'],
    boundaries: ['sadece_satis', 'fiyat_degistirme_yasak', 'indirim_yasak', 'silme_yasak'],
    ai_provider: 'GPT',
    token_limit: 4000,
  },
  {
    robot_type: 'ik',
    robot_name: 'İK Robotu',
    system_prompt: 'Sen bir insan kaynakları asistanısın. Personel yönetimi, kullanıcı rolleri, belge hazırlama ve sözleşme taslağı konularında çalışırsın. Maaş bilgisi gizlidir — gösterme. İşten çıkarma kararı verme — sadece süreç bilgisi sun. Türkçe ve profesyonel yanıt ver.',
    capabilities: ['personel_yonetimi', 'rol_atama', 'belge_hazirlama', 'sozlesme_taslagi'],
    boundaries: ['sadece_ik', 'maas_bilgisi_gizli', 'isten_cikarma_karar_yasak', 'silme_yasak'],
    ai_provider: 'GPT',
    token_limit: 4000,
  },
  {
    robot_type: 'iletisim',
    robot_name: 'İletişim Robotu',
    system_prompt: 'Sen bir müşteri iletişim asistanısın. WhatsApp mesajları, bildirimler, veli iletişimi ve randevu yönetimi konularında çalışırsın. Kişisel veri paylaşma. Mesaj gönderme — sadece taslak hazırla, onay gerekir. Türkçe, samimi ve profesyonel yanıt ver.',
    capabilities: ['mesaj_taslagi', 'bildirim_hazirlama', 'randevu_yonetimi', 'veli_iletisimi'],
    boundaries: ['sadece_iletisim', 'mesaj_gonderme_onay_gerekli', 'kisisel_veri_yasak', 'silme_yasak'],
    ai_provider: 'GEMINI',
    token_limit: 4000,
  },
]

// ─── Tenant'a Robot Kur ──────────────────────────────────────

export async function installRobotsForTenant(
  tenantId: string,
  robotTypes?: TenantRobotType[]
): Promise<{ installed: string[]; error?: string }> {
  const db = getSupabaseServer()
  if (!db) return { installed: [], error: 'Supabase bağlantısı yok' }

  const typesToInstall = robotTypes ?? DEFAULT_TENANT_ROBOTS.map((r) => r.robot_type)
  const installed: string[] = []

  for (const robotDef of DEFAULT_TENANT_ROBOTS) {
    if (!typesToInstall.includes(robotDef.robot_type)) continue

    const { error } = await db.from('tenant_robots').upsert(
      {
        tenant_id: tenantId,
        robot_type: robotDef.robot_type,
        robot_name: robotDef.robot_name,
        system_prompt: robotDef.system_prompt,
        capabilities: robotDef.capabilities,
        boundaries: robotDef.boundaries,
        ai_provider: robotDef.ai_provider,
        token_limit: robotDef.token_limit,
        token_used: 0,
        is_active: true,
      },
      { onConflict: 'tenant_id,robot_type' }
    )

    if (!error) installed.push(robotDef.robot_type)
  }

  return { installed }
}

// ─── Tenant Robotlarını Getir ────────────────────────────────

export async function getTenantRobots(tenantId: string): Promise<{ data?: TenantRobot[]; error?: string }> {
  const db = getSupabaseServer()
  if (!db) return { error: 'Supabase bağlantısı yok' }

  const { data, error } = await db
    .from('tenant_robots')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('robot_type')

  if (error) return { error: error.message }
  return { data: (data ?? []) as TenantRobot[] }
}

// ─── Token Kullanımı Güncelle ────────────────────────────────

export async function updateTokenUsage(
  tenantId: string,
  robotType: TenantRobotType,
  tokensUsed: number
): Promise<{ remaining?: number; limit_exceeded?: boolean; error?: string }> {
  const db = getSupabaseServer()
  if (!db) return { error: 'Supabase bağlantısı yok' }

  const { data: robot } = await db
    .from('tenant_robots')
    .select('token_used, token_limit')
    .eq('tenant_id', tenantId)
    .eq('robot_type', robotType)
    .single()

  if (!robot) return { error: 'Robot bulunamadı' }

  const newUsed = (robot.token_used as number) + tokensUsed
  const limit = robot.token_limit as number
  const limitExceeded = newUsed >= limit

  await db
    .from('tenant_robots')
    .update({
      token_used: newUsed,
      last_active_at: new Date().toISOString(),
    })
    .eq('tenant_id', tenantId)
    .eq('robot_type', robotType)

  return { remaining: Math.max(0, limit - newUsed), limit_exceeded: limitExceeded }
}

// ─── Günlük Token Sıfırlama (COO cron) ──────────────────────

export async function resetDailyTokens(): Promise<{ reset_count?: number; error?: string }> {
  const db = getSupabaseServer()
  if (!db) return { error: 'Supabase bağlantısı yok' }

  const { data, error } = await db
    .from('tenant_robots')
    .update({ token_used: 0 })
    .gt('token_used', 0)
    .select('id')

  if (error) return { error: error.message }
  return { reset_count: data?.length ?? 0 }
}
