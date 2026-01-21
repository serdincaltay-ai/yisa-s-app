/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * SİSTEM PROTOKOLLERİ v2.0 - TEK BAĞLAYICI GERÇEK
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Bu dosya sistemin çekirdek akışını ve kurallarını tanımlar.
 * PATRON ONAYI OLMADAN HİÇBİR DEĞER DEĞİŞTİRİLEMEZ.
 * 
 * Son Güncelleme: 2026-01-21
 * Versiyon: 2.0.0
 * Durum: KİLİTLİ (LOCKED)
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════════
// BÖLÜM 1: SİSTEM HİYERARŞİSİ VE ROL TANIMLARI
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Sistem Rolleri - Hiyerarşik Sıralama
 * Seviye 0 = En yüksek yetki (Patron)
 */
export const SYSTEM_ROLES = Object.freeze({
  // Üst Kademe (Çekirdek Yönetim)
  PATRON: { id: 'PATRON', level: 0, name: 'Patron', canModifyCore: true },
  PATRON_ASISTANI: { id: 'PATRON_ASISTANI', level: 1, name: 'Patron Asistanı', canModifyCore: false },
  SIBER_GUVENLIK: { id: 'SIBER_GUVENLIK', level: 1, name: 'Siber Güvenlik (CISO)', canModifyCore: false },
  VERI_ARSIVLEME: { id: 'VERI_ARSIVLEME', level: 1, name: 'Veri Arşivleme', canModifyCore: false },
  
  // Yönetim Katmanı
  CEO: { id: 'CEO', level: 2, name: 'CEO', canModifyCore: false },
  CELF: { id: 'CELF', level: 3, name: 'CELF (Chief Executive Legal Finance)', canModifyCore: false },
  CLO: { id: 'CLO', level: 3, name: 'CLO (Chief Legal Officer)', canModifyCore: false },
  COO: { id: 'COO', level: 4, name: 'COO', canModifyCore: false },
  
  // Operasyon Katmanı
  VITRIN: { id: 'VITRIN', level: 5, name: 'Vitrin', canModifyCore: false },
  
  // Panel Rolleri (ROL-0 ile ROL-12)
  ROL_0: { id: 'ROL_0', level: 6, name: 'Rol 0 - Temel Kullanıcı', canModifyCore: false },
  ROL_1: { id: 'ROL_1', level: 6, name: 'Rol 1 - İzleyici', canModifyCore: false },
  ROL_2: { id: 'ROL_2', level: 6, name: 'Rol 2 - Katkıcı', canModifyCore: false },
  ROL_3: { id: 'ROL_3', level: 6, name: 'Rol 3 - Editör', canModifyCore: false },
  ROL_4: { id: 'ROL_4', level: 6, name: 'Rol 4 - Moderatör', canModifyCore: false },
  ROL_5: { id: 'ROL_5', level: 6, name: 'Rol 5 - Koordinatör', canModifyCore: false },
  ROL_6: { id: 'ROL_6', level: 6, name: 'Rol 6 - Supervisor', canModifyCore: false },
  ROL_7: { id: 'ROL_7', level: 6, name: 'Rol 7 - Yönetici', canModifyCore: false },
  ROL_8: { id: 'ROL_8', level: 6, name: 'Rol 8 - Kıdemli Yönetici', canModifyCore: false },
  ROL_9: { id: 'ROL_9', level: 6, name: 'Rol 9 - Direktör', canModifyCore: false },
  ROL_10: { id: 'ROL_10', level: 6, name: 'Rol 10 - VP', canModifyCore: false },
  ROL_11: { id: 'ROL_11', level: 6, name: 'Rol 11 - SVP', canModifyCore: false },
  ROL_12: { id: 'ROL_12', level: 6, name: 'Rol 12 - EVP', canModifyCore: false },
} as const);

export type SystemRoleId = keyof typeof SYSTEM_ROLES;

// ═══════════════════════════════════════════════════════════════════════════════
// BÖLÜM 2: ÇEKİRDEK AKIŞ KİLİDİ (CORE FLOW LOCK)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * YETKİ AKIŞI (Yukarıdan Aşağıya) - AUTHORITY FLOW
 * Kararlar ve yetkiler bu akış ile aşağı iner
 */
export const AUTHORITY_FLOW = Object.freeze({
  name: 'YETKİ_AKIŞI',
  direction: 'DOWNSTREAM' as const,
  locked: true,
  lockedAt: '2026-01-21T00:00:00.000Z',
  lockedBy: 'PATRON',
  cannotBeModifiedWithout: 'PATRON_APPROVAL',
  
  sequence: Object.freeze([
    'PATRON',
    'PATRON_ASISTANI',
    'SIBER_GUVENLIK', 
    'VERI_ARSIVLEME',
    'CEO',
    'CELF',
    'COO',
    'VITRIN',
    'ROL_0', 'ROL_1', 'ROL_2', 'ROL_3', 'ROL_4', 'ROL_5',
    'ROL_6', 'ROL_7', 'ROL_8', 'ROL_9', 'ROL_10', 'ROL_11', 'ROL_12'
  ] as const),
  
  // Kısaltılmış gösterim
  shorthand: 'Patron→(Patron Asistanı + Siber Güvenlik + Veri Arşivleme)→CEO→CELF→COO→Vitrin→ROL-0..ROL-12'
});

/**
 * VERİ AKIŞI (Aşağıdan Yukarıya) - DATA FLOW
 * Veriler ve raporlar bu akış ile yukarı çıkar
 */
export const DATA_FLOW = Object.freeze({
  name: 'VERİ_AKIŞI',
  direction: 'UPSTREAM' as const,
  locked: true,
  lockedAt: '2026-01-21T00:00:00.000Z',
  lockedBy: 'PATRON',
  cannotBeModifiedWithout: 'PATRON_APPROVAL',
  
  sequence: Object.freeze([
    'ROL_0', 'ROL_1', 'ROL_2', 'ROL_3', 'ROL_4', 'ROL_5',
    'ROL_6', 'ROL_7', 'ROL_8', 'ROL_9', 'ROL_10', 'ROL_11', 'ROL_12',
    'VITRIN',
    'COO',
    'CELF',
    'CEO',
    'PATRON'
  ] as const),
  
  // Kısaltılmış gösterim
  shorthand: 'Panel(ROL-0..ROL-12)→Vitrin→COO→CELF→CEO→Patron'
});

/**
 * ÇİFT YÖNLÜ AKIŞ KİLİDİ
 * Her iki akışı da tek yapıda birleştirir
 */
export const CORE_FLOW_LOCK = Object.freeze({
  version: '2.0.0',
  status: 'LOCKED' as const,
  lockedAt: '2026-01-21T00:00:00.000Z',
  lockedBy: 'PATRON',
  
  authorityFlow: AUTHORITY_FLOW,
  dataFlow: DATA_FLOW,
  
  // Akış doğrulama hash'i (değişiklik tespiti için)
  integrityHash: 'SHA256:CORE_FLOW_LOCK_V2_IMMUTABLE_2026',
  
  validation: {
    isLocked: true,
    requiresPatronApproval: true,
    bypassAttemptLogged: true,
    violationAlertLevel: 'CRITICAL' as const
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// BÖLÜM 3: ÇEKİRDEK KURALLAR KİLİDİ (CORE RULES LOCK)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * 7 DEĞİŞTİRİLEMEZ ÇEKİRDEK KURAL
 * Bu kurallar PATRON ONAYI OLMADAN değiştirilemez
 */
export const CORE_RULES = Object.freeze({
  /**
   * KURAL 1: Panel karar vermez
   * Panel rolleri sadece veri girişi ve görüntüleme yapabilir,
   * sistem kararları alamaz
   */
  RULE_001_PANEL_NO_DECISION: Object.freeze({
    id: 'RULE_001',
    code: 'PANEL_NO_DECISION',
    title_tr: 'Panel karar vermez',
    title_en: 'Panel cannot make decisions',
    description: 'Panel rolleri (ROL-0 ile ROL-12) sistem kararları alamaz. Kararlar sadece Patron→CEO→COO zinciri üzerinden alınır.',
    severity: 'CRITICAL' as const,
    locked: true,
    lockedAt: '2026-01-21T00:00:00.000Z',
    cannotBeModifiedWithout: 'PATRON_APPROVAL',
    enforcementLevel: 'SYSTEM' as const,
    violationAction: 'BLOCK_AND_LOG' as const
  }),

  /**
   * KURAL 2: Veri silinmez/gizlenir
   * Hiçbir veri kalıcı olarak silinemez, sadece gizlenebilir (soft delete)
   */
  RULE_002_NO_DATA_DELETE: Object.freeze({
    id: 'RULE_002',
    code: 'NO_DATA_DELETE',
    title_tr: 'Veri silinmez/gizlenir',
    title_en: 'Data cannot be deleted, only hidden',
    description: 'Sistemdeki hiçbir veri kalıcı olarak silinemez. Veriler sadece gizlenebilir (soft delete). Gizleme işlemi de audit log\'a kaydedilir.',
    severity: 'CRITICAL' as const,
    locked: true,
    lockedAt: '2026-01-21T00:00:00.000Z',
    cannotBeModifiedWithout: 'PATRON_APPROVAL',
    enforcementLevel: 'DATABASE' as const,
    violationAction: 'BLOCK_AND_ALERT' as const
  }),

  /**
   * KURAL 3: Çocuk ham verisi açılmaz
   * 18 yaş altı kullanıcılara ait ham veri hiçbir şekilde erişime açılamaz
   */
  RULE_003_CHILD_DATA_PROTECTED: Object.freeze({
    id: 'RULE_003',
    code: 'CHILD_DATA_PROTECTED',
    title_tr: 'Çocuk ham verisi açılmaz',
    title_en: 'Child raw data cannot be exposed',
    description: '18 yaş altı kullanıcılara ait ham veri hiçbir rol tarafından, hiçbir koşulda erişime açılamaz. Sadece anonim istatistikler görüntülenebilir.',
    severity: 'MAXIMUM' as const,
    locked: true,
    lockedAt: '2026-01-21T00:00:00.000Z',
    cannotBeModifiedWithout: 'PATRON_APPROVAL',
    enforcementLevel: 'SYSTEM' as const,
    violationAction: 'BLOCK_ALERT_ESCALATE' as const,
    legalCompliance: ['GDPR', 'KVKK', 'COPPA']
  }),

  /**
   * KURAL 4: Patron DB kayıp yaşamaz
   * Patron veritabanı hiçbir koşulda veri kaybı yaşamamalı
   */
  RULE_004_PATRON_DB_NO_LOSS: Object.freeze({
    id: 'RULE_004',
    code: 'PATRON_DB_NO_LOSS',
    title_tr: 'Patron DB kayıp yaşamaz',
    title_en: 'Patron database cannot experience data loss',
    description: 'Patron veritabanı sürekli yedeklenir ve hiçbir koşulda veri kaybı yaşanamaz. Minimum 3 coğrafi lokasyonda replikasyon zorunludur.',
    severity: 'CRITICAL' as const,
    locked: true,
    lockedAt: '2026-01-21T00:00:00.000Z',
    cannotBeModifiedWithout: 'PATRON_APPROVAL',
    enforcementLevel: 'INFRASTRUCTURE' as const,
    violationAction: 'ALERT_AND_RESTORE' as const,
    backupRequirements: {
      minReplicas: 3,
      geoDistributed: true,
      maxRPO: '1_MINUTE',
      maxRTO: '5_MINUTES'
    }
  }),

  /**
   * KURAL 5: Audit log silinmez
   * Denetim kayıtları hiçbir koşulda silinemez veya değiştirilemez
   */
  RULE_005_AUDIT_LOG_IMMUTABLE: Object.freeze({
    id: 'RULE_005',
    code: 'AUDIT_LOG_IMMUTABLE',
    title_tr: 'Audit log silinmez',
    title_en: 'Audit log cannot be deleted or modified',
    description: 'Tüm sistem aktiviteleri denetim loguna kaydedilir. Bu loglar hiçbir rol tarafından silinemez veya değiştirilemez. WORM (Write Once Read Many) prensibi uygulanır.',
    severity: 'CRITICAL' as const,
    locked: true,
    lockedAt: '2026-01-21T00:00:00.000Z',
    cannotBeModifiedWithout: 'PATRON_APPROVAL',
    enforcementLevel: 'SYSTEM' as const,
    violationAction: 'BLOCK_AND_ESCALATE' as const,
    storagePolicy: 'WORM',
    retentionPeriod: 'INDEFINITE'
  }),

  /**
   * KURAL 6: Güvenlik robotu bypass edilemez
   * CISO/Siber Güvenlik kontrolü atlanamaz
   */
  RULE_006_SECURITY_NO_BYPASS: Object.freeze({
    id: 'RULE_006',
    code: 'SECURITY_NO_BYPASS',
    title_tr: 'Güvenlik robotu bypass edilemez',
    title_en: 'Security robot cannot be bypassed',
    description: 'CISO ve Siber Güvenlik robotunun kontrolleri hiçbir rol tarafından, hiçbir koşulda atlanamaz. Tüm işlemler güvenlik kontrolünden geçmelidir.',
    severity: 'MAXIMUM' as const,
    locked: true,
    lockedAt: '2026-01-21T00:00:00.000Z',
    cannotBeModifiedWithout: 'PATRON_APPROVAL',
    enforcementLevel: 'GATEWAY' as const,
    violationAction: 'BLOCK_ALERT_LOCKDOWN' as const,
    cisoGateRequired: true
  }),

  /**
   * KURAL 7: Tek seferde tam erişim yok
   * Hiçbir rol tek seferde tüm sisteme tam erişim sağlayamaz
   */
  RULE_007_NO_FULL_ACCESS_ONCE: Object.freeze({
    id: 'RULE_007',
    code: 'NO_FULL_ACCESS_ONCE',
    title_tr: 'Tek seferde tam erişim yok',
    title_en: 'No full access at once',
    description: 'Patron dahil hiçbir rol tek bir işlemde tüm sisteme tam erişim sağlayamaz. Erişimler modüler ve zaman sınırlı olmalıdır.',
    severity: 'CRITICAL' as const,
    locked: true,
    lockedAt: '2026-01-21T00:00:00.000Z',
    cannotBeModifiedWithout: 'PATRON_APPROVAL',
    enforcementLevel: 'SYSTEM' as const,
    violationAction: 'BLOCK_AND_SEGMENT' as const,
    accessPolicy: {
      maxModulesPerSession: 5,
      sessionTimeout: '4_HOURS',
      requiresReauth: true
    }
  })
});

export type CoreRuleId = keyof typeof CORE_RULES;

/**
 * Çekirdek Kurallar Kilidi Meta Bilgisi
 */
export const CORE_RULES_LOCK = Object.freeze({
  version: '2.0.0',
  status: 'LOCKED' as const,
  lockedAt: '2026-01-21T00:00:00.000Z',
  lockedBy: 'PATRON',
  totalRules: 7,
  rules: CORE_RULES,
  
  // Kural doğrulama hash'i
  integrityHash: 'SHA256:CORE_RULES_LOCK_V2_IMMUTABLE_2026',
  
  modification: {
    allowed: false,
    requiresPatronApproval: true,
    requiresCLOReview: true,
    requiresCISOSignoff: true,
    minimumApprovers: 3
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// BÖLÜM 4: CISO GATE + CLO VETO SİSTEMİ
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * CISO Gate - Güvenlik Geçidi
 * Tüm kritik işlemler bu geçitten geçmek zorundadır
 */
export const CISO_GATE = Object.freeze({
  id: 'CISO_GATE',
  name: 'Siber Güvenlik Geçidi',
  status: 'ACTIVE' as const,
  locked: true,
  lockedAt: '2026-01-21T00:00:00.000Z',
  cannotBypass: true,
  linkedToRule: 'RULE_006',
  
  requirements: Object.freeze({
    allRequestsMustPass: true,
    securityScanRequired: true,
    threatAssessmentRequired: true,
    anomalyDetectionActive: true
  }),
  
  actions: Object.freeze({
    onPass: 'ALLOW_WITH_LOG',
    onFail: 'BLOCK_AND_ALERT',
    onBypassAttempt: 'LOCKDOWN_AND_ESCALATE'
  }),
  
  exemptions: Object.freeze([]) // Hiçbir istisna yok
});

/**
 * CLO Veto - Hukuki Veto Sistemi
 * Hukuki uyumsuzluk durumunda işlemleri durdurabilir
 */
export const CLO_VETO = Object.freeze({
  id: 'CLO_VETO',
  name: 'Hukuki Veto Sistemi',
  status: 'ACTIVE' as const,
  locked: true,
  lockedAt: '2026-01-21T00:00:00.000Z',
  cannotBypass: true,
  linkedToRules: ['RULE_002', 'RULE_003', 'RULE_005'],
  
  vetoScope: Object.freeze({
    dataOperations: true,
    privacyOperations: true,
    complianceOperations: true,
    childDataOperations: true
  }),
  
  actions: Object.freeze({
    onVeto: 'BLOCK_AND_REVIEW',
    onBypassAttempt: 'ESCALATE_TO_PATRON'
  }),
  
  exemptions: Object.freeze([]) // Hiçbir istisna yok
});

/**
 * Bypass Edilemez Kapılar - Çekirdek Kural Seviyesinde
 */
export const NON_BYPASSABLE_GATES = Object.freeze({
  version: '2.0.0',
  status: 'LOCKED' as const,
  lockedAt: '2026-01-21T00:00:00.000Z',
  lockedBy: 'PATRON',
  
  gates: Object.freeze({
    CISO_GATE,
    CLO_VETO
  }),
  
  enforcement: Object.freeze({
    level: 'CORE_RULE' as const,
    bypassAttemptPenalty: 'ACCOUNT_SUSPENSION',
    bypassAttemptEscalation: 'IMMEDIATE_PATRON_ALERT',
    auditTrail: 'MANDATORY'
  }),
  
  linkedCoreRules: Object.freeze([
    'RULE_002', // Veri silinmez
    'RULE_003', // Çocuk verisi koruması
    'RULE_005', // Audit log koruması
    'RULE_006'  // Güvenlik bypass engeli
  ])
});

// ═══════════════════════════════════════════════════════════════════════════════
// BÖLÜM 5: PROTOKOL DOĞRULAMA FONKSİYONLARI
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Çekirdek protokollerin bütünlüğünü doğrular
 */
export function validateProtocolIntegrity(): { 
  valid: boolean; 
  flowLockValid: boolean; 
  rulesLockValid: boolean;
  gatesValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  // Akış kilidi kontrolü
  const flowLockValid = CORE_FLOW_LOCK.status === 'LOCKED' && 
                        CORE_FLOW_LOCK.authorityFlow.locked && 
                        CORE_FLOW_LOCK.dataFlow.locked;
  
  if (!flowLockValid) {
    errors.push('CRITICAL: Çekirdek akış kilidi bozulmuş!');
  }
  
  // Kural kilidi kontrolü
  const rulesLockValid = CORE_RULES_LOCK.status === 'LOCKED' &&
                         Object.values(CORE_RULES).every(rule => rule.locked);
  
  if (!rulesLockValid) {
    errors.push('CRITICAL: Çekirdek kural kilidi bozulmuş!');
  }
  
  // Geçit kontrolü
  const gatesValid = CISO_GATE.cannotBypass === true && 
                     CLO_VETO.cannotBypass === true;
  
  if (!gatesValid) {
    errors.push('CRITICAL: Güvenlik geçitleri bypass edilebilir durumda!');
  }
  
  return {
    valid: flowLockValid && rulesLockValid && gatesValid,
    flowLockValid,
    rulesLockValid,
    gatesValid,
    errors
  };
}

/**
 * Belirli bir rolün yetki seviyesini döndürür
 */
export function getRoleLevel(roleId: SystemRoleId): number {
  return SYSTEM_ROLES[roleId]?.level ?? 999;
}

/**
 * Bir rolün başka bir rol üzerinde yetkisi olup olmadığını kontrol eder
 */
export function hasAuthorityOver(actorRole: SystemRoleId, targetRole: SystemRoleId): boolean {
  const actorLevel = getRoleLevel(actorRole);
  const targetLevel = getRoleLevel(targetRole);
  return actorLevel < targetLevel;
}

/**
 * Çekirdek kural değişikliği yapılabilir mi kontrol eder
 * Sadece PATRON rolü değişiklik yapabilir ve o da onay sürecinden geçmelidir
 */
export function canModifyCoreRule(roleId: SystemRoleId): { 
  allowed: boolean; 
  reason: string;
  requiredApprovals: string[];
} {
  const role = SYSTEM_ROLES[roleId];
  
  if (!role) {
    return { 
      allowed: false, 
      reason: 'Geçersiz rol',
      requiredApprovals: []
    };
  }
  
  if (role.canModifyCore) {
    return { 
      allowed: true, 
      reason: 'Patron yetkisi ile değiştirilebilir',
      requiredApprovals: ['CLO_REVIEW', 'CISO_SIGNOFF', 'PATRON_FINAL_APPROVAL']
    };
  }
  
  return { 
    allowed: false, 
    reason: `${role.name} rolü çekirdek kuralları değiştiremez. Sadece Patron yetkilidir.`,
    requiredApprovals: []
  };
}

/**
 * İşlem için CISO Gate kontrolü
 */
export function checkCISOGate(operation: string, roleId: SystemRoleId): {
  passed: boolean;
  action: string;
  logRequired: boolean;
} {
  // Tüm işlemler loglanmalı
  const logRequired = true;
  
  // CISO Gate her zaman aktif ve bypass edilemez
  if (!CISO_GATE.requirements.allRequestsMustPass) {
    return {
      passed: false,
      action: CISO_GATE.actions.onBypassAttempt,
      logRequired
    };
  }
  
  // Normal geçiş (gerçek implementasyonda güvenlik kontrolü yapılır)
  return {
    passed: true,
    action: CISO_GATE.actions.onPass,
    logRequired
  };
}

/**
 * Veri işlemi için CLO Veto kontrolü
 */
export function checkCLOVeto(
  operationType: 'delete' | 'modify' | 'access',
  dataCategory: 'personal' | 'child' | 'audit' | 'general'
): {
  vetoed: boolean;
  reason: string;
  escalationRequired: boolean;
} {
  // Çocuk verisi erişimi - her zaman engelle
  if (dataCategory === 'child' && operationType === 'access') {
    return {
      vetoed: true,
      reason: 'RULE_003: Çocuk ham verisi açılamaz',
      escalationRequired: true
    };
  }
  
  // Audit log silme - her zaman engelle
  if (dataCategory === 'audit' && operationType === 'delete') {
    return {
      vetoed: true,
      reason: 'RULE_005: Audit log silinemez',
      escalationRequired: true
    };
  }
  
  // Herhangi bir veri silme - engelle, sadece gizleme izin ver
  if (operationType === 'delete') {
    return {
      vetoed: true,
      reason: 'RULE_002: Veri silinemez, sadece gizlenebilir',
      escalationRequired: false
    };
  }
  
  return {
    vetoed: false,
    reason: '',
    escalationRequired: false
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// BÖLÜM 6: PROTOKOL EXPORT - TEK BAĞLAYICI GERÇEK
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * SİSTEM PROTOKOLLERİ - ANA EXPORT
 * Bu obje sistemin "tek bağlayıcı gerçeği"dir.
 */
export const SYSTEM_PROTOCOLS = Object.freeze({
  version: '2.0.0',
  status: 'LOCKED' as const,
  lockedAt: '2026-01-21T00:00:00.000Z',
  lockedBy: 'PATRON',
  
  // Çekirdek Tanımlar
  roles: SYSTEM_ROLES,
  
  // Çekirdek Akış Kilidi
  coreFlowLock: CORE_FLOW_LOCK,
  
  // Çekirdek Kurallar Kilidi
  coreRulesLock: CORE_RULES_LOCK,
  
  // Bypass Edilemez Kapılar
  nonBypassableGates: NON_BYPASSABLE_GATES,
  
  // Doğrulama Fonksiyonları
  validators: {
    validateProtocolIntegrity,
    getRoleLevel,
    hasAuthorityOver,
    canModifyCoreRule,
    checkCISOGate,
    checkCLOVeto
  },
  
  // Meta Bilgi
  meta: Object.freeze({
    description: 'YİSA-S Kolektif Zeka Sistemi - Çekirdek Protokoller',
    singleSourceOfTruth: true,
    modificationRequires: 'PATRON_APPROVAL',
    lastIntegrityCheck: null as string | null
  })
});

// Default export
export default SYSTEM_PROTOCOLS;
