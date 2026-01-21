/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🔒 ÇEKİRDEK SİSTEM PROTOKOLLERİ v2.0
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * TEK BAĞLAYICI GERÇEK (Single Source of Truth)
 * Bu dosya sistem akışı ve çekirdek kuralları için tek otorite kaynağıdır.
 * 
 * ⚠️ DEĞİŞTİRİLEMEZ (IMMUTABLE) - Patron onayı olmadan değiştirilemez
 * 
 * @version 2.0.0
 * @locked true
 * @patron_approval_required true
 */

import { CORE_RULES, CoreRule, CoreRuleViolation, validateCoreRules } from './core-rules';
import { CORE_FLOW, FlowDirection, FlowNode, validateFlowPath } from './core-flow';
import { SECURITY_GATES, GateType, validateGateAccess } from './gates';

// ═══════════════════════════════════════════════════════════════════════════════
// PROTOKOL KİLİT DURUMU
// ═══════════════════════════════════════════════════════════════════════════════

export const PROTOCOL_LOCK_STATUS = {
  version: '2.0.0',
  locked: true,
  lockedAt: '2026-01-21T09:00:00Z',
  lockedBy: 'PATRON',
  patronApprovalRequired: true,
  immutable: true,
  lastVerified: new Date().toISOString(),
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// ANA AKIŞ KAYDI (CORE FLOW LOCK)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Tam Sistem Akışı:
 * Patron → (Patron Asistanı + Siber Güvenlik + Veri Arşivleme) → CEO → CELF → COO → Vitrin → ROL-0..ROL-12
 */
export const REGISTERED_FLOW = {
  name: 'Çekirdek Sistem Akışı v2.0',
  locked: true,
  registeredAt: '2026-01-21T09:00:00Z',
  
  // Ana Akış Sırası
  mainFlow: [
    'PATRON',
    'PATRON_ASISTANI',
    'SIBER_GUVENLIK',
    'VERI_ARSIVLEME', 
    'CEO',
    'CELF', // Chief Executive Legal & Finance
    'COO',
    'VITRIN',
    // ROL-0 ile ROL-12 arası
    ...Array.from({ length: 13 }, (_, i) => `ROL_${i}`),
  ],

  // Çift Yönlü Akış Tanımları
  bidirectionalFlows: {
    // Yetki Akışı: Aşağı yönlü (Patron → Panel)
    authorityFlow: {
      direction: 'DOWNWARD' as const,
      name: 'Yetki Akışı',
      path: ['PATRON', 'CEO', 'COO', 'PANEL'],
      description: 'Kararlar ve yetkiler yukarıdan aşağıya akar',
      locked: true,
    },
    
    // Veri Akışı: Yukarı yönlü (Panel → Patron)
    dataFlow: {
      direction: 'UPWARD' as const,
      name: 'Veri Akışı', 
      path: ['PANEL', 'COO', 'CELF', 'CEO', 'PATRON'],
      description: 'Veriler ve raporlar aşağıdan yukarıya akar',
      locked: true,
    },
  },

  // Paralel İşlem Grupları (Patron sonrası eş zamanlı)
  parallelGroups: {
    afterPatron: ['PATRON_ASISTANI', 'SIBER_GUVENLIK', 'VERI_ARSIVLEME'],
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// ÇEKİRDEK KURALLAR KAYDI (CORE RULES LOCK)
// ═══════════════════════════════════════════════════════════════════════════════

export const REGISTERED_CORE_RULES = {
  name: 'Çekirdek Kurallar v2.0',
  locked: true,
  immutable: true,
  patronApprovalRequired: true,
  registeredAt: '2026-01-21T09:00:00Z',

  rules: [
    {
      id: 'CR-001',
      code: 'PANEL_NO_DECISION',
      name: 'Panel karar vermez',
      description: 'Panel sadece uygulayıcıdır, karar mercii değildir',
      enforcement: 'STRICT',
      immutable: true,
      bypassable: false,
    },
    {
      id: 'CR-002',
      code: 'DATA_NO_DELETE',
      name: 'Veri silinmez/gizlenir',
      description: 'Veriler asla silinmez, sadece gizlenebilir (soft delete)',
      enforcement: 'STRICT',
      immutable: true,
      bypassable: false,
    },
    {
      id: 'CR-003',
      code: 'CHILD_DATA_PROTECTED',
      name: 'Çocuk ham verisi açılmaz',
      description: 'Çocuklara ait ham veriler hiçbir koşulda açılamaz',
      enforcement: 'ABSOLUTE',
      immutable: true,
      bypassable: false,
    },
    {
      id: 'CR-004',
      code: 'PATRON_NO_DB_LOSS',
      name: 'Patron DB kayıp yaşamaz',
      description: 'Patron veritabanı hiçbir koşulda veri kaybı yaşamaz',
      enforcement: 'ABSOLUTE',
      immutable: true,
      bypassable: false,
    },
    {
      id: 'CR-005',
      code: 'AUDIT_LOG_PROTECTED',
      name: 'Audit log silinmez',
      description: 'Denetim kayıtları asla silinemez veya değiştirilemez',
      enforcement: 'ABSOLUTE',
      immutable: true,
      bypassable: false,
    },
    {
      id: 'CR-006',
      code: 'SECURITY_ROBOT_UNBYPASSABLE',
      name: 'Güvenlik robotu bypass edilemez',
      description: 'Güvenlik robotu hiçbir koşulda atlanamaz veya devre dışı bırakılamaz',
      enforcement: 'ABSOLUTE',
      immutable: true,
      bypassable: false,
    },
    {
      id: 'CR-007',
      code: 'NO_FULL_ACCESS_AT_ONCE',
      name: 'Tek seferde tam erişim yok',
      description: 'Hiçbir kullanıcı/sistem tek seferde tüm verilere erişemez',
      enforcement: 'STRICT',
      immutable: true,
      bypassable: false,
    },
  ],
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// GÜVENLİK KAPILARI (SECURITY GATES)
// ═══════════════════════════════════════════════════════════════════════════════

export const REGISTERED_SECURITY_GATES = {
  name: 'Güvenlik Kapıları v2.0',
  locked: true,
  registeredAt: '2026-01-21T09:00:00Z',

  gates: [
    {
      id: 'GATE-CISO',
      code: 'CISO_GATE',
      name: 'CISO Gate (Chief Information Security Officer)',
      description: 'Siber güvenlik onay kapısı - bypass edilemez',
      level: 'CORE_RULE',
      bypassable: false,
      immutable: true,
      requiredFor: ['DATA_ACCESS', 'SYSTEM_CHANGE', 'SECURITY_CONFIG'],
    },
    {
      id: 'GATE-CLO',
      code: 'CLO_VETO',
      name: 'CLO Veto (Chief Legal Officer)',
      description: 'Hukuki veto kapısı - bypass edilemez',
      level: 'CORE_RULE',
      bypassable: false,
      immutable: true,
      requiredFor: ['LEGAL_COMPLIANCE', 'DATA_PRIVACY', 'CHILD_DATA'],
    },
  ],
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// PROTOKOL DOĞRULAMA FONKSİYONLARI
// ═══════════════════════════════════════════════════════════════════════════════

export interface ProtocolValidationResult {
  valid: boolean;
  timestamp: string;
  lockStatus: typeof PROTOCOL_LOCK_STATUS;
  flowValid: boolean;
  rulesValid: boolean;
  gatesValid: boolean;
  violations: string[];
}

/**
 * Tüm protokolleri doğrular
 */
export function validateAllProtocols(): ProtocolValidationResult {
  const violations: string[] = [];
  
  // Lock durumunu kontrol et
  if (!PROTOCOL_LOCK_STATUS.locked) {
    violations.push('CRITICAL: Protokol kilidi açık!');
  }
  
  if (!PROTOCOL_LOCK_STATUS.immutable) {
    violations.push('CRITICAL: Protokol immutable değil!');
  }

  // Akış doğrulaması
  const flowValid = REGISTERED_FLOW.locked && 
    REGISTERED_FLOW.bidirectionalFlows.authorityFlow.locked &&
    REGISTERED_FLOW.bidirectionalFlows.dataFlow.locked;
  
  if (!flowValid) {
    violations.push('CRITICAL: Akış kilidi bozuk!');
  }

  // Kural doğrulaması
  const rulesValid = REGISTERED_CORE_RULES.locked && 
    REGISTERED_CORE_RULES.immutable &&
    REGISTERED_CORE_RULES.rules.every(r => r.immutable && !r.bypassable);
  
  if (!rulesValid) {
    violations.push('CRITICAL: Çekirdek kurallar bozuk!');
  }

  // Kapı doğrulaması
  const gatesValid = REGISTERED_SECURITY_GATES.locked &&
    REGISTERED_SECURITY_GATES.gates.every(g => !g.bypassable && g.immutable);
  
  if (!gatesValid) {
    violations.push('CRITICAL: Güvenlik kapıları bozuk!');
  }

  return {
    valid: violations.length === 0,
    timestamp: new Date().toISOString(),
    lockStatus: PROTOCOL_LOCK_STATUS,
    flowValid,
    rulesValid,
    gatesValid,
    violations,
  };
}

/**
 * Çekirdek kural ihlali kontrolü
 */
export function checkCoreRuleViolation(
  action: string,
  context: Record<string, unknown>
): { violated: boolean; rule?: typeof REGISTERED_CORE_RULES.rules[number]; reason?: string } {
  
  // Hard delete kontrolü
  if (action === 'DELETE' && !context.softDelete) {
    return {
      violated: true,
      rule: REGISTERED_CORE_RULES.rules.find(r => r.code === 'DATA_NO_DELETE'),
      reason: 'Veri silme işlemi yasak - sadece soft delete kullanılabilir',
    };
  }

  // Çocuk verisi kontrolü
  if (context.dataType === 'CHILD_RAW_DATA') {
    return {
      violated: true,
      rule: REGISTERED_CORE_RULES.rules.find(r => r.code === 'CHILD_DATA_PROTECTED'),
      reason: 'Çocuk ham verisine erişim yasak',
    };
  }

  // Audit log silme kontrolü
  if (action === 'DELETE' && context.table === 'audit_logs') {
    return {
      violated: true,
      rule: REGISTERED_CORE_RULES.rules.find(r => r.code === 'AUDIT_LOG_PROTECTED'),
      reason: 'Audit log silme işlemi yasak',
    };
  }

  // Tam erişim kontrolü
  if (context.fullAccess === true) {
    return {
      violated: true,
      rule: REGISTERED_CORE_RULES.rules.find(r => r.code === 'NO_FULL_ACCESS_AT_ONCE'),
      reason: 'Tek seferde tam erişim yasak',
    };
  }

  return { violated: false };
}

/**
 * Güvenlik kapısı kontrolü
 */
export function checkSecurityGate(
  gateCode: 'CISO_GATE' | 'CLO_VETO',
  action: string
): { allowed: boolean; gate: typeof REGISTERED_SECURITY_GATES.gates[number]; reason?: string } {
  
  const gate = REGISTERED_SECURITY_GATES.gates.find(g => g.code === gateCode);
  
  if (!gate) {
    return {
      allowed: false,
      gate: REGISTERED_SECURITY_GATES.gates[0],
      reason: 'Geçersiz kapı kodu',
    };
  }

  // Kapı bypass edilemez
  if (gate.bypassable === false) {
    return {
      allowed: false,
      gate,
      reason: `${gate.name} bypass edilemez - çekirdek kural seviyesinde korunuyor`,
    };
  }

  return { allowed: true, gate };
}

/**
 * Akış yolu doğrulaması
 */
export function validateFlowPathAccess(
  source: string,
  target: string,
  direction: 'AUTHORITY' | 'DATA'
): { valid: boolean; reason?: string } {
  
  const flow = direction === 'AUTHORITY' 
    ? REGISTERED_FLOW.bidirectionalFlows.authorityFlow
    : REGISTERED_FLOW.bidirectionalFlows.dataFlow;

  const sourcePath = flow.path.indexOf(source);
  const targetPath = flow.path.indexOf(target);

  if (sourcePath === -1 || targetPath === -1) {
    return {
      valid: false,
      reason: `Geçersiz akış noktası: ${source} veya ${target}`,
    };
  }

  // Yetki akışı aşağı yönlü olmalı
  if (direction === 'AUTHORITY' && sourcePath > targetPath) {
    return {
      valid: false,
      reason: 'Yetki akışı sadece aşağı yönlü olabilir (Patron → Panel)',
    };
  }

  // Veri akışı yukarı yönlü olmalı
  if (direction === 'DATA' && sourcePath < targetPath) {
    return {
      valid: false,
      reason: 'Veri akışı sadece yukarı yönlü olabilir (Panel → Patron)',
    };
  }

  return { valid: true };
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT - TEK BAĞLAYICI GERÇEK
// ═══════════════════════════════════════════════════════════════════════════════

export const CORE_SYSTEM_PROTOCOLS = {
  lockStatus: PROTOCOL_LOCK_STATUS,
  flow: REGISTERED_FLOW,
  rules: REGISTERED_CORE_RULES,
  gates: REGISTERED_SECURITY_GATES,
  
  // Doğrulama fonksiyonları
  validate: validateAllProtocols,
  checkRuleViolation: checkCoreRuleViolation,
  checkGate: checkSecurityGate,
  validateFlow: validateFlowPathAccess,
} as const;

export default CORE_SYSTEM_PROTOCOLS;
