/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🔒 ÇEKİRDEK KURALLAR (CORE RULES) v2.0
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Bu kurallar "Patron onayı olmadan değişmez" olarak işaretlenmiştir.
 * Tüm kurallar IMMUTABLE ve BYPASSABLE=false olarak tanımlanmıştır.
 * 
 * @version 2.0.0
 * @locked true
 * @patron_approval_required true
 * @immutable true
 */

// ═══════════════════════════════════════════════════════════════════════════════
// TİP TANIMLARI
// ═══════════════════════════════════════════════════════════════════════════════

export type EnforcementLevel = 'ABSOLUTE' | 'STRICT' | 'STANDARD';
export type RuleCategory = 'DATA_PROTECTION' | 'ACCESS_CONTROL' | 'SECURITY' | 'AUDIT' | 'GOVERNANCE';

export interface CoreRule {
  readonly id: string;
  readonly code: string;
  readonly name: string;
  readonly nameTR: string;
  readonly description: string;
  readonly descriptionTR: string;
  readonly category: RuleCategory;
  readonly enforcement: EnforcementLevel;
  readonly immutable: true; // Her zaman true
  readonly bypassable: false; // Her zaman false
  readonly patronApprovalRequired: true; // Her zaman true
  readonly createdAt: string;
  readonly lockedAt: string;
  readonly lockedBy: 'PATRON';
  readonly violationSeverity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  readonly violationAction: 'BLOCK' | 'ALERT_AND_BLOCK' | 'LOG_AND_BLOCK';
  readonly affectedEntities: readonly string[];
}

export interface CoreRuleViolation {
  ruleId: string;
  ruleCode: string;
  timestamp: string;
  actor: string;
  action: string;
  target: string;
  context: Record<string, unknown>;
  blocked: boolean;
  reason: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ÇEKİRDEK KURALLAR - DEĞİŞTİRİLEMEZ (IMMUTABLE)
// ═══════════════════════════════════════════════════════════════════════════════

export const CORE_RULES: readonly CoreRule[] = [
  {
    id: 'CR-001',
    code: 'PANEL_NO_DECISION',
    name: 'Panel Does Not Decide',
    nameTR: 'Panel karar vermez',
    description: 'Panel is only an executor, not a decision-making authority. All decisions must come from the authority flow.',
    descriptionTR: 'Panel sadece uygulayıcıdır, karar mercii değildir. Tüm kararlar yetki akışından gelmelidir.',
    category: 'GOVERNANCE',
    enforcement: 'STRICT',
    immutable: true,
    bypassable: false,
    patronApprovalRequired: true,
    createdAt: '2026-01-21T09:00:00Z',
    lockedAt: '2026-01-21T09:00:00Z',
    lockedBy: 'PATRON',
    violationSeverity: 'HIGH',
    violationAction: 'ALERT_AND_BLOCK',
    affectedEntities: ['PANEL', 'COO', 'VITRIN', 'ROL_0', 'ROL_1', 'ROL_2', 'ROL_3', 'ROL_4', 'ROL_5', 'ROL_6', 'ROL_7', 'ROL_8', 'ROL_9', 'ROL_10', 'ROL_11', 'ROL_12'],
  },
  {
    id: 'CR-002',
    code: 'DATA_NO_DELETE',
    name: 'Data Cannot Be Deleted',
    nameTR: 'Veri silinmez/gizlenir',
    description: 'Data is never permanently deleted, only soft-deleted (hidden). All data must be retained for audit purposes.',
    descriptionTR: 'Veriler asla kalıcı olarak silinmez, sadece gizlenebilir (soft delete). Tüm veriler denetim amaçlı saklanmalıdır.',
    category: 'DATA_PROTECTION',
    enforcement: 'STRICT',
    immutable: true,
    bypassable: false,
    patronApprovalRequired: true,
    createdAt: '2026-01-21T09:00:00Z',
    lockedAt: '2026-01-21T09:00:00Z',
    lockedBy: 'PATRON',
    violationSeverity: 'CRITICAL',
    violationAction: 'BLOCK',
    affectedEntities: ['ALL_TABLES', 'ALL_DATABASES', 'ALL_STORAGE'],
  },
  {
    id: 'CR-003',
    code: 'CHILD_DATA_PROTECTED',
    name: 'Child Raw Data Cannot Be Exposed',
    nameTR: 'Çocuk ham verisi açılmaz',
    description: 'Raw data belonging to children cannot be exposed under any circumstances. This is an absolute rule with no exceptions.',
    descriptionTR: 'Çocuklara ait ham veriler hiçbir koşulda açılamaz. Bu mutlak bir kuraldır, istisnası yoktur.',
    category: 'DATA_PROTECTION',
    enforcement: 'ABSOLUTE',
    immutable: true,
    bypassable: false,
    patronApprovalRequired: true,
    createdAt: '2026-01-21T09:00:00Z',
    lockedAt: '2026-01-21T09:00:00Z',
    lockedBy: 'PATRON',
    violationSeverity: 'CRITICAL',
    violationAction: 'BLOCK',
    affectedEntities: ['CHILD_DATA', 'MINOR_RECORDS', 'STUDENT_DATA', 'YOUTH_DATA'],
  },
  {
    id: 'CR-004',
    code: 'PATRON_NO_DB_LOSS',
    name: 'Patron Cannot Experience DB Loss',
    nameTR: 'Patron DB kayıp yaşamaz',
    description: 'The Patron database must never experience data loss. Multiple backup and recovery systems must be in place.',
    descriptionTR: 'Patron veritabanı hiçbir koşulda veri kaybı yaşamaz. Çoklu yedekleme ve kurtarma sistemleri aktif olmalıdır.',
    category: 'DATA_PROTECTION',
    enforcement: 'ABSOLUTE',
    immutable: true,
    bypassable: false,
    patronApprovalRequired: true,
    createdAt: '2026-01-21T09:00:00Z',
    lockedAt: '2026-01-21T09:00:00Z',
    lockedBy: 'PATRON',
    violationSeverity: 'CRITICAL',
    violationAction: 'BLOCK',
    affectedEntities: ['PATRON_DB', 'PATRON_INBOX', 'PATRON_LOGS', 'PATRON_CONFIG'],
  },
  {
    id: 'CR-005',
    code: 'AUDIT_LOG_PROTECTED',
    name: 'Audit Logs Cannot Be Deleted',
    nameTR: 'Audit log silinmez',
    description: 'Audit logs can never be deleted or modified. They are immutable records of all system activity.',
    descriptionTR: 'Denetim kayıtları asla silinemez veya değiştirilemez. Tüm sistem aktivitelerinin değiştirilemez kayıtlarıdır.',
    category: 'AUDIT',
    enforcement: 'ABSOLUTE',
    immutable: true,
    bypassable: false,
    patronApprovalRequired: true,
    createdAt: '2026-01-21T09:00:00Z',
    lockedAt: '2026-01-21T09:00:00Z',
    lockedBy: 'PATRON',
    violationSeverity: 'CRITICAL',
    violationAction: 'BLOCK',
    affectedEntities: ['AUDIT_LOGS', 'SYSTEM_LOGS', 'ACCESS_LOGS', 'CHANGE_LOGS'],
  },
  {
    id: 'CR-006',
    code: 'SECURITY_ROBOT_UNBYPASSABLE',
    name: 'Security Robot Cannot Be Bypassed',
    nameTR: 'Güvenlik robotu bypass edilemez',
    description: 'The security robot cannot be bypassed or disabled under any circumstances. It is the core security enforcement mechanism.',
    descriptionTR: 'Güvenlik robotu hiçbir koşulda atlanamaz veya devre dışı bırakılamaz. Çekirdek güvenlik uygulama mekanizmasıdır.',
    category: 'SECURITY',
    enforcement: 'ABSOLUTE',
    immutable: true,
    bypassable: false,
    patronApprovalRequired: true,
    createdAt: '2026-01-21T09:00:00Z',
    lockedAt: '2026-01-21T09:00:00Z',
    lockedBy: 'PATRON',
    violationSeverity: 'CRITICAL',
    violationAction: 'BLOCK',
    affectedEntities: ['SECURITY_ROBOT', 'SIBER_GUVENLIK', 'CISO_GATE', 'ALL_SECURITY_SYSTEMS'],
  },
  {
    id: 'CR-007',
    code: 'NO_FULL_ACCESS_AT_ONCE',
    name: 'No Full Access At Once',
    nameTR: 'Tek seferde tam erişim yok',
    description: 'No user or system can access all data at once. Access must be segmented and controlled.',
    descriptionTR: 'Hiçbir kullanıcı/sistem tek seferde tüm verilere erişemez. Erişim bölümlenmeli ve kontrollü olmalıdır.',
    category: 'ACCESS_CONTROL',
    enforcement: 'STRICT',
    immutable: true,
    bypassable: false,
    patronApprovalRequired: true,
    createdAt: '2026-01-21T09:00:00Z',
    lockedAt: '2026-01-21T09:00:00Z',
    lockedBy: 'PATRON',
    violationSeverity: 'HIGH',
    violationAction: 'ALERT_AND_BLOCK',
    affectedEntities: ['ALL_USERS', 'ALL_SYSTEMS', 'ALL_ROBOTS', 'ALL_PANELS'],
  },
] as const;

// ═══════════════════════════════════════════════════════════════════════════════
// KURAL DOĞRULAMA FONKSİYONLARI
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Tüm çekirdek kuralların kilit durumunu doğrular
 */
export function validateCoreRules(): { valid: boolean; violations: string[] } {
  const violations: string[] = [];

  for (const rule of CORE_RULES) {
    if (!rule.immutable) {
      violations.push(`CRITICAL: Kural ${rule.code} immutable değil!`);
    }
    if (rule.bypassable) {
      violations.push(`CRITICAL: Kural ${rule.code} bypassable olarak işaretli!`);
    }
    if (!rule.patronApprovalRequired) {
      violations.push(`CRITICAL: Kural ${rule.code} Patron onayı gerektirmiyor!`);
    }
  }

  return {
    valid: violations.length === 0,
    violations,
  };
}

/**
 * Belirli bir işlemin çekirdek kuralı ihlal edip etmediğini kontrol eder
 */
export function checkRuleViolation(
  action: string,
  target: string,
  context: Record<string, unknown>
): CoreRuleViolation | null {
  
  // CR-002: Veri silme kontrolü
  if (action === 'DELETE' || action === 'HARD_DELETE' || action === 'TRUNCATE' || action === 'DROP') {
    if (!context.softDelete) {
      return {
        ruleId: 'CR-002',
        ruleCode: 'DATA_NO_DELETE',
        timestamp: new Date().toISOString(),
        actor: String(context.actor || 'UNKNOWN'),
        action,
        target,
        context,
        blocked: true,
        reason: 'Kalıcı veri silme yasak. Sadece soft delete (gizleme) kullanılabilir.',
      };
    }
  }

  // CR-003: Çocuk verisi kontrolü
  if (context.dataType === 'CHILD' || context.dataType === 'MINOR' || 
      target.toLowerCase().includes('child') || target.toLowerCase().includes('minor') ||
      target.toLowerCase().includes('student') || target.toLowerCase().includes('youth')) {
    if (action === 'READ_RAW' || action === 'EXPORT_RAW' || action === 'EXPOSE') {
      return {
        ruleId: 'CR-003',
        ruleCode: 'CHILD_DATA_PROTECTED',
        timestamp: new Date().toISOString(),
        actor: String(context.actor || 'UNKNOWN'),
        action,
        target,
        context,
        blocked: true,
        reason: 'Çocuk ham verisine erişim mutlak olarak yasaktır.',
      };
    }
  }

  // CR-004: Patron DB kontrolü
  if (target.toLowerCase().includes('patron') && 
      (action === 'DELETE' || action === 'DROP' || action === 'TRUNCATE')) {
    return {
      ruleId: 'CR-004',
      ruleCode: 'PATRON_NO_DB_LOSS',
      timestamp: new Date().toISOString(),
      actor: String(context.actor || 'UNKNOWN'),
      action,
      target,
      context,
      blocked: true,
      reason: 'Patron veritabanında veri kaybına yol açacak işlemler yasaktır.',
    };
  }

  // CR-005: Audit log kontrolü
  if ((target.toLowerCase().includes('audit') || target.toLowerCase().includes('log')) &&
      (action === 'DELETE' || action === 'UPDATE' || action === 'TRUNCATE' || action === 'DROP')) {
    return {
      ruleId: 'CR-005',
      ruleCode: 'AUDIT_LOG_PROTECTED',
      timestamp: new Date().toISOString(),
      actor: String(context.actor || 'UNKNOWN'),
      action,
      target,
      context,
      blocked: true,
      reason: 'Audit log silme veya değiştirme mutlak olarak yasaktır.',
    };
  }

  // CR-006: Güvenlik robotu bypass kontrolü
  if (context.bypassSecurity || context.disableSecurity || context.skipSecurityCheck) {
    return {
      ruleId: 'CR-006',
      ruleCode: 'SECURITY_ROBOT_UNBYPASSABLE',
      timestamp: new Date().toISOString(),
      actor: String(context.actor || 'UNKNOWN'),
      action,
      target,
      context,
      blocked: true,
      reason: 'Güvenlik robotu bypass edilemez. Güvenlik kontrolleri her zaman aktiftir.',
    };
  }

  // CR-007: Tam erişim kontrolü
  if (context.fullAccess || context.accessAll || action === 'SELECT_ALL' || action === 'EXPORT_ALL') {
    return {
      ruleId: 'CR-007',
      ruleCode: 'NO_FULL_ACCESS_AT_ONCE',
      timestamp: new Date().toISOString(),
      actor: String(context.actor || 'UNKNOWN'),
      action,
      target,
      context,
      blocked: true,
      reason: 'Tek seferde tam erişim yasaktır. Erişim bölümlenmeli ve kontrollü olmalıdır.',
    };
  }

  // CR-001: Panel karar verme kontrolü
  if (context.actor && typeof context.actor === 'string' && 
      context.actor.toLowerCase().includes('panel') &&
      (action === 'DECIDE' || action === 'APPROVE' || action === 'AUTHORIZE' || action === 'GRANT')) {
    return {
      ruleId: 'CR-001',
      ruleCode: 'PANEL_NO_DECISION',
      timestamp: new Date().toISOString(),
      actor: String(context.actor),
      action,
      target,
      context,
      blocked: true,
      reason: 'Panel karar mercii değildir. Kararlar yetki akışından (Patron→CEO→COO) gelmelidir.',
    };
  }

  return null; // İhlal yok
}

/**
 * Kuralı ID veya kod ile bulur
 */
export function getRuleByIdOrCode(idOrCode: string): CoreRule | undefined {
  return CORE_RULES.find(r => r.id === idOrCode || r.code === idOrCode);
}

/**
 * Kategoriye göre kuralları filtreler
 */
export function getRulesByCategory(category: RuleCategory): readonly CoreRule[] {
  return CORE_RULES.filter(r => r.category === category);
}

/**
 * ABSOLUTE seviyesindeki kuralları döndürür
 */
export function getAbsoluteRules(): readonly CoreRule[] {
  return CORE_RULES.filter(r => r.enforcement === 'ABSOLUTE');
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export default CORE_RULES;
