/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🔒 GÜVENLİK KAPILARI (SECURITY GATES) v2.0
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * CISO GATE + CLO VETO - ÇEKİRDEK KURAL SEVİYESİNDE KORUMA
 * 
 * Bu kapılar BYPASS EDİLEMEZ. Hiçbir koşulda devre dışı bırakılamaz.
 * 
 * @version 2.0.0
 * @locked true
 * @bypassable false
 * @patron_approval_required true
 */

// ═══════════════════════════════════════════════════════════════════════════════
// TİP TANIMLARI
// ═══════════════════════════════════════════════════════════════════════════════

export type GateType = 'CISO_GATE' | 'CLO_VETO';
export type GateStatus = 'ACTIVE' | 'PENDING' | 'BLOCKED';
export type GateDecision = 'APPROVED' | 'DENIED' | 'PENDING_REVIEW';
export type GateLevel = 'CORE_RULE' | 'POLICY' | 'STANDARD';

export interface SecurityGate {
  readonly id: string;
  readonly code: GateType;
  readonly name: string;
  readonly nameTR: string;
  readonly description: string;
  readonly descriptionTR: string;
  readonly level: GateLevel;
  readonly bypassable: false; // Her zaman false
  readonly immutable: true; // Her zaman true
  readonly status: GateStatus;
  readonly requiredFor: readonly string[];
  readonly createdAt: string;
  readonly lockedAt: string;
  readonly lockedBy: 'PATRON';
}

export interface GateCheckRequest {
  gateCode: GateType;
  action: string;
  actor: string;
  target: string;
  context: Record<string, unknown>;
  timestamp: string;
}

export interface GateCheckResult {
  gate: SecurityGate;
  decision: GateDecision;
  allowed: boolean;
  reason: string;
  timestamp: string;
  auditLog: GateAuditEntry;
}

export interface GateAuditEntry {
  id: string;
  gateCode: GateType;
  action: string;
  actor: string;
  target: string;
  decision: GateDecision;
  reason: string;
  timestamp: string;
  immutable: true;
}

// ═══════════════════════════════════════════════════════════════════════════════
// GÜVENLİK KAPILARI TANIMLARI
// ═══════════════════════════════════════════════════════════════════════════════

export const SECURITY_GATES: Record<GateType, SecurityGate> = {
  // ─────────────────────────────────────────────────────────────────────────────
  // CISO GATE - Chief Information Security Officer
  // ─────────────────────────────────────────────────────────────────────────────
  CISO_GATE: {
    id: 'GATE-CISO-001',
    code: 'CISO_GATE',
    name: 'CISO Security Gate',
    nameTR: 'CISO Güvenlik Kapısı',
    description: 'Chief Information Security Officer approval gate. Cannot be bypassed under any circumstances.',
    descriptionTR: 'Bilgi Güvenliği Başkanı onay kapısı. Hiçbir koşulda bypass edilemez.',
    level: 'CORE_RULE',
    bypassable: false,
    immutable: true,
    status: 'ACTIVE',
    requiredFor: [
      'DATA_ACCESS',           // Veri erişimi
      'DATA_EXPORT',           // Veri dışa aktarma
      'DATA_MODIFICATION',     // Veri değişikliği
      'SYSTEM_CHANGE',         // Sistem değişikliği
      'SECURITY_CONFIG',       // Güvenlik konfigürasyonu
      'USER_PRIVILEGE_CHANGE', // Kullanıcı yetki değişikliği
      'API_KEY_GENERATION',    // API anahtarı oluşturma
      'DATABASE_SCHEMA_CHANGE',// Veritabanı şema değişikliği
      'ENCRYPTION_CONFIG',     // Şifreleme konfigürasyonu
      'BACKUP_RESTORE',        // Yedek geri yükleme
      'NETWORK_CONFIG',        // Ağ konfigürasyonu
      'AUTHENTICATION_CHANGE', // Kimlik doğrulama değişikliği
    ],
    createdAt: '2026-01-21T09:00:00Z',
    lockedAt: '2026-01-21T09:00:00Z',
    lockedBy: 'PATRON',
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // CLO VETO - Chief Legal Officer
  // ─────────────────────────────────────────────────────────────────────────────
  CLO_VETO: {
    id: 'GATE-CLO-001',
    code: 'CLO_VETO',
    name: 'CLO Legal Veto Gate',
    nameTR: 'CLO Hukuki Veto Kapısı',
    description: 'Chief Legal Officer veto gate. Cannot be bypassed under any circumstances.',
    descriptionTR: 'Hukuk Başkanı veto kapısı. Hiçbir koşulda bypass edilemez.',
    level: 'CORE_RULE',
    bypassable: false,
    immutable: true,
    status: 'ACTIVE',
    requiredFor: [
      'LEGAL_COMPLIANCE',      // Yasal uyumluluk
      'DATA_PRIVACY',          // Veri gizliliği
      'CHILD_DATA',            // Çocuk verisi işlemleri
      'PERSONAL_DATA_EXPORT',  // Kişisel veri dışa aktarma
      'CONSENT_MANAGEMENT',    // Onay yönetimi
      'DATA_RETENTION',        // Veri saklama
      'DATA_DELETION_REQUEST', // Veri silme talebi
      'CROSS_BORDER_TRANSFER', // Sınır ötesi veri aktarımı
      'CONTRACT_EXECUTION',    // Sözleşme yürütme
      'LIABILITY_ASSESSMENT',  // Sorumluluk değerlendirmesi
      'REGULATORY_REPORTING',  // Düzenleyici raporlama
      'LEGAL_HOLD',            // Yasal saklama
    ],
    createdAt: '2026-01-21T09:00:00Z',
    lockedAt: '2026-01-21T09:00:00Z',
    lockedBy: 'PATRON',
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// KAPI DOĞRULAMA FONKSİYONLARI
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Tüm kapıların kilit durumunu doğrular
 */
export function validateGateLockStatus(): { locked: boolean; violations: string[] } {
  const violations: string[] = [];

  for (const [code, gate] of Object.entries(SECURITY_GATES)) {
    if (gate.bypassable !== false) {
      violations.push(`CRITICAL: ${code} kapısı bypassable olarak işaretli!`);
    }
    if (gate.immutable !== true) {
      violations.push(`CRITICAL: ${code} kapısı immutable değil!`);
    }
    if (gate.level !== 'CORE_RULE') {
      violations.push(`CRITICAL: ${code} kapısı CORE_RULE seviyesinde değil!`);
    }
    if (gate.status !== 'ACTIVE') {
      violations.push(`WARNING: ${code} kapısı aktif değil!`);
    }
  }

  return {
    locked: violations.length === 0,
    violations,
  };
}

/**
 * Güvenlik kapısı kontrolü yapar
 * 
 * @param request - Kapı kontrol isteği
 * @returns Kapı kontrol sonucu
 */
export function validateGateAccess(request: GateCheckRequest): GateCheckResult {
  const gate = SECURITY_GATES[request.gateCode];
  
  // Kapı yoksa engelle
  if (!gate) {
    return {
      gate: SECURITY_GATES.CISO_GATE, // Default gate
      decision: 'DENIED',
      allowed: false,
      reason: `Geçersiz kapı kodu: ${request.gateCode}`,
      timestamp: new Date().toISOString(),
      auditLog: generateAuditEntry(request, 'DENIED', `Geçersiz kapı kodu: ${request.gateCode}`),
    };
  }

  // Bypass denemesi kontrolü
  if (request.context.bypassGate || request.context.skipGate || request.context.disableGate) {
    return {
      gate,
      decision: 'DENIED',
      allowed: false,
      reason: `ÇEKİRDEK KURAL İHLALİ: ${gate.nameTR} BYPASS EDİLEMEZ! Bu kapı çekirdek kural seviyesinde korunmaktadır.`,
      timestamp: new Date().toISOString(),
      auditLog: generateAuditEntry(request, 'DENIED', 'Bypass denemesi engellendi'),
    };
  }

  // İşlem kapı gereksinimleri içinde mi?
  const actionRequiresGate = gate.requiredFor.some(
    req => request.action.toUpperCase().includes(req) || req.includes(request.action.toUpperCase())
  );

  if (actionRequiresGate) {
    // Bu işlem için kapı onayı gerekli - şimdilik PENDING_REVIEW döndür
    return {
      gate,
      decision: 'PENDING_REVIEW',
      allowed: false,
      reason: `Bu işlem ${gate.nameTR} onayı gerektirmektedir. İşlem: ${request.action}`,
      timestamp: new Date().toISOString(),
      auditLog: generateAuditEntry(request, 'PENDING_REVIEW', `${gate.nameTR} onayı bekleniyor`),
    };
  }

  // İşlem kapı kapsamında değilse geçir
  return {
    gate,
    decision: 'APPROVED',
    allowed: true,
    reason: `İşlem ${gate.nameTR} kapsamında değil, geçirildi`,
    timestamp: new Date().toISOString(),
    auditLog: generateAuditEntry(request, 'APPROVED', 'Kapı kapsamı dışında'),
  };
}

/**
 * CISO Gate kontrolü
 */
export function checkCISOGate(
  action: string,
  actor: string,
  target: string,
  context: Record<string, unknown> = {}
): GateCheckResult {
  return validateGateAccess({
    gateCode: 'CISO_GATE',
    action,
    actor,
    target,
    context,
    timestamp: new Date().toISOString(),
  });
}

/**
 * CLO Veto kontrolü
 */
export function checkCLOVeto(
  action: string,
  actor: string,
  target: string,
  context: Record<string, unknown> = {}
): GateCheckResult {
  return validateGateAccess({
    gateCode: 'CLO_VETO',
    action,
    actor,
    target,
    context,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Her iki kapıyı da kontrol eder (tam güvenlik kontrolü)
 */
export function checkAllGates(
  action: string,
  actor: string,
  target: string,
  context: Record<string, unknown> = {}
): { cisoResult: GateCheckResult; cloResult: GateCheckResult; overallAllowed: boolean } {
  const cisoResult = checkCISOGate(action, actor, target, context);
  const cloResult = checkCLOVeto(action, actor, target, context);

  // Her iki kapı da APPROVED olmalı
  const overallAllowed = cisoResult.allowed && cloResult.allowed;

  return {
    cisoResult,
    cloResult,
    overallAllowed,
  };
}

/**
 * Kapı bypass denemesini engeller ve loglar
 */
export function blockBypassAttempt(
  gateCode: GateType,
  actor: string,
  action: string,
  context: Record<string, unknown>
): { blocked: true; reason: string; auditLog: GateAuditEntry } {
  const gate = SECURITY_GATES[gateCode];
  
  const auditEntry: GateAuditEntry = {
    id: `BYPASS-BLOCK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    gateCode,
    action,
    actor,
    target: 'GATE_BYPASS_ATTEMPT',
    decision: 'DENIED',
    reason: `BYPASS ATTEMPT BLOCKED: ${actor} tried to bypass ${gate.nameTR}`,
    timestamp: new Date().toISOString(),
    immutable: true,
  };

  return {
    blocked: true,
    reason: `🚫 BYPASS ENGELLENDİ: ${gate.nameTR} hiçbir koşulda bypass edilemez! Bu güvenlik kapısı çekirdek kural seviyesinde (CORE_RULE) korunmaktadır. İşlem: ${action}, Aktör: ${actor}`,
    auditLog: auditEntry,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// YARDIMCI FONKSİYONLAR
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Audit log girdisi oluşturur
 */
function generateAuditEntry(
  request: GateCheckRequest,
  decision: GateDecision,
  reason: string
): GateAuditEntry {
  return {
    id: `GATE-LOG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    gateCode: request.gateCode,
    action: request.action,
    actor: request.actor,
    target: request.target,
    decision,
    reason,
    timestamp: new Date().toISOString(),
    immutable: true,
  };
}

/**
 * Kapının gerektirdiği işlemleri listeler
 */
export function getGateRequirements(gateCode: GateType): readonly string[] {
  const gate = SECURITY_GATES[gateCode];
  return gate ? gate.requiredFor : [];
}

/**
 * İşlemin hangi kapıları gerektirdiğini bulur
 */
export function getRequiredGates(action: string): GateType[] {
  const requiredGates: GateType[] = [];

  for (const [code, gate] of Object.entries(SECURITY_GATES) as [GateType, SecurityGate][]) {
    if (gate.requiredFor.some(req => 
      action.toUpperCase().includes(req) || req.includes(action.toUpperCase())
    )) {
      requiredGates.push(code);
    }
  }

  return requiredGates;
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export default SECURITY_GATES;
