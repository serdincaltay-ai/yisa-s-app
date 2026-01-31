/**
 * YİSA-S Security Robot (Katman 2 - Siber Güvenlik)
 * Her işlemde güvenlik kontrolü, FORBIDDEN_FOR_AI engeli, şüpheli aktivite logu.
 * 4 seviye alarm: Sarı, Turuncu, Kırmızı, Acil
 */

import { isForbiddenForAI, checkPatronLock, type PatronLockCheck } from '@/lib/security/patron-lock'
import { createSecurityLog, type SecuritySeverity } from '@/lib/db/security-logs'

export type SecurityCheckResult = PatronLockCheck & {
  severity?: SecuritySeverity
  logged?: boolean
}

/** Alarm seviyesi: yasak = acil, onay gerekli = kirmizi, şüpheli = turuncu, bilgi = sari */
export function severityForCheck(check: PatronLockCheck): SecuritySeverity {
  if (!check.allowed) return 'acil'
  if (check.requiresApproval) return 'kirmizi'
  return 'sari'
}

/**
 * Mesajı güvenlik kontrolünden geçirir; yasaksa engeller ve loglar.
 */
export async function securityCheck(params: {
  message: string
  action?: string
  userId?: string
  ipAddress?: string
  logToDb?: boolean
}): Promise<SecurityCheckResult> {
  const { message, action, userId, ipAddress, logToDb = true } = params
  const check = checkPatronLock(message, action)
  const severity = severityForCheck(check)

  if (logToDb) {
    await createSecurityLog({
      event_type: check.allowed ? 'security_check' : 'forbidden_blocked',
      severity,
      description: check.allowed
        ? (check.requiresApproval ? 'Patron onayı gerekli' : 'Kontrol OK')
        : (check.reason ?? 'Yasak komut'),
      user_id: userId,
      ip_address: ipAddress,
      blocked: !check.allowed,
    })
  }

  return {
    ...check,
    severity,
    logged: logToDb,
  }
}

/**
 * Sadece yasak mı kontrolü (log yok).
 */
export function isForbidden(message: string): boolean {
  return isForbiddenForAI(message)
}

// Siber Güvenlik Robot Konfigürasyonu
export const SECURITY_ROBOT_CONFIG = {
  code: 'ROB-SIBER',
  name: 'Siber Güvenlik Robotu',
  layer: 2,
  description: '7/24 koruma, gatekeeper, bypass edilemez',
  aiService: 'claude',  // Güvenlik için en güvenilir
  capabilities: [
    'request_validation',
    'threat_detection',
    'rate_limiting',
    'audit_logging',
    'intrusion_detection',
    'data_protection'
  ]
}

// Tehdit Tipleri
export const THREAT_TYPES = {
  sql_injection: { name: 'SQL Injection', severity: 'acil' as SecuritySeverity },
  xss: { name: 'Cross-Site Scripting', severity: 'kirmizi' as SecuritySeverity },
  csrf: { name: 'CSRF Attack', severity: 'kirmizi' as SecuritySeverity },
  brute_force: { name: 'Brute Force', severity: 'turuncu' as SecuritySeverity },
  unauthorized_access: { name: 'Yetkisiz Erişim', severity: 'kirmizi' as SecuritySeverity },
  data_exfiltration: { name: 'Veri Sızdırma', severity: 'acil' as SecuritySeverity },
  privilege_escalation: { name: 'Yetki Yükseltme', severity: 'acil' as SecuritySeverity },
  suspicious_pattern: { name: 'Şüpheli Aktivite', severity: 'turuncu' as SecuritySeverity }
}

// Rate Limiting
const rateLimitStore: Map<string, { count: number; resetAt: number }> = new Map()

export function checkRateLimit(identifier: string, limit: number = 100, windowMs: number = 60000): boolean {
  const now = Date.now()
  const record = rateLimitStore.get(identifier)
  
  if (!record || now > record.resetAt) {
    rateLimitStore.set(identifier, { count: 1, resetAt: now + windowMs })
    return true
  }
  
  if (record.count >= limit) {
    return false
  }
  
  record.count++
  return true
}

// SQL Injection Tespiti
export function detectSQLInjection(input: string): boolean {
  const patterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER)\b)/i,
    /(--)|(\/\*)|(\*\/)/,
    /(\bOR\b|\bAND\b)\s+\d+\s*=\s*\d+/i,
    /(;|\||`|\\)/
  ]
  return patterns.some(p => p.test(input))
}

// XSS Tespiti
export function detectXSS(input: string): boolean {
  const patterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe/gi,
    /<object/gi,
    /<embed/gi
  ]
  return patterns.some(p => p.test(input))
}

// Genel Tehdit Taraması
export async function scanForThreats(params: {
  input: string
  userId?: string
  ipAddress?: string
  endpoint?: string
}): Promise<{
  safe: boolean
  threats: string[]
  severity: SecuritySeverity
}> {
  const threats: string[] = []
  let maxSeverity: SecuritySeverity = 'sari'
  
  // SQL Injection
  if (detectSQLInjection(params.input)) {
    threats.push('sql_injection')
    maxSeverity = 'acil'
  }
  
  // XSS
  if (detectXSS(params.input)) {
    threats.push('xss')
    if (maxSeverity !== 'acil') maxSeverity = 'kirmizi'
  }
  
  // Yasaklı komutlar
  if (isForbiddenForAI(params.input)) {
    threats.push('forbidden_command')
    maxSeverity = 'acil'
  }
  
  // Rate limit
  if (params.ipAddress && !checkRateLimit(params.ipAddress)) {
    threats.push('rate_limit_exceeded')
    if (maxSeverity === 'sari') maxSeverity = 'turuncu'
  }
  
  // Tehdit varsa logla
  if (threats.length > 0) {
    await createSecurityLog({
      event_type: 'threat_detected',
      severity: maxSeverity,
      description: `Tehditler: ${threats.join(', ')}`,
      user_id: params.userId,
      ip_address: params.ipAddress,
      metadata: { threats, endpoint: params.endpoint },
      blocked: maxSeverity === 'acil'
    })
  }
  
  return {
    safe: threats.length === 0,
    threats,
    severity: maxSeverity
  }
}

// Gatekeeper - Her İstek Buradan Geçer
export async function gatekeeper(params: {
  action: string
  input: string
  userId?: string
  ipAddress?: string
  requiredRole?: string
}): Promise<{
  allowed: boolean
  reason?: string
  severity?: SecuritySeverity
}> {
  // 1. Tehdit taraması
  const threatScan = await scanForThreats({
    input: params.input,
    userId: params.userId,
    ipAddress: params.ipAddress,
    endpoint: params.action
  })
  
  if (!threatScan.safe && threatScan.severity === 'acil') {
    return {
      allowed: false,
      reason: `Güvenlik tehdidi tespit edildi: ${threatScan.threats.join(', ')}`,
      severity: 'acil'
    }
  }
  
  // 2. Güvenlik kontrolü
  const secCheck = await securityCheck({
    message: params.input,
    action: params.action,
    userId: params.userId,
    ipAddress: params.ipAddress
  })
  
  if (!secCheck.allowed) {
    return {
      allowed: false,
      reason: secCheck.reason || 'Güvenlik kontrolü başarısız',
      severity: secCheck.severity
    }
  }
  
  // 3. Onay gerekiyorsa bildir
  if (secCheck.requiresApproval) {
    return {
      allowed: true,
      reason: 'Patron onayı gerekiyor',
      severity: 'kirmizi'
    }
  }
  
  return { allowed: true }
}
