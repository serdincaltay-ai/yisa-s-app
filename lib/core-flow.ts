/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🔒 ÇEKİRDEK AKIŞ TANIMLARI (CORE FLOW) v2.0
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * ÇİFT YÖNLÜ AKIŞ SİSTEMİ:
 * - Yetki Akışı: AŞAĞI yönlü (Patron → CEO → COO → Panel)
 * - Veri Akışı: YUKARI yönlü (Panel → COO → CELF → CEO → Patron)
 * 
 * TAM SİSTEM AKIŞI:
 * Patron → (Patron Asistanı + Siber Güvenlik + Veri Arşivleme) → CEO → CELF → COO → Vitrin → ROL-0..ROL-12
 * 
 * @version 2.0.0
 * @locked true
 * @patron_approval_required true
 */

// ═══════════════════════════════════════════════════════════════════════════════
// TİP TANIMLARI
// ═══════════════════════════════════════════════════════════════════════════════

export type FlowDirection = 'DOWNWARD' | 'UPWARD';
export type NodeLevel = 'SUPREME' | 'EXECUTIVE' | 'MANAGEMENT' | 'OPERATIONAL' | 'SUPPORT';

export interface FlowNode {
  readonly id: string;
  readonly name: string;
  readonly nameTR: string;
  readonly level: NodeLevel;
  readonly layer: number;
  readonly canDecide: boolean;
  readonly canExecute: boolean;
  readonly reportsTo: readonly string[];
  readonly manages: readonly string[];
  readonly parallelWith?: readonly string[];
}

export interface FlowPath {
  readonly name: string;
  readonly nameTR: string;
  readonly direction: FlowDirection;
  readonly nodes: readonly string[];
  readonly locked: boolean;
  readonly description: string;
  readonly descriptionTR: string;
}

export interface FlowValidationResult {
  valid: boolean;
  direction: FlowDirection;
  source: string;
  target: string;
  reason?: string;
  allowedPath?: readonly string[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// AKIŞ DÜĞÜMLER (FLOW NODES)
// ═══════════════════════════════════════════════════════════════════════════════

export const FLOW_NODES: Record<string, FlowNode> = {
  // ─────────────────────────────────────────────────────────────────────────────
  // SUPREME LEVEL (Layer 0)
  // ─────────────────────────────────────────────────────────────────────────────
  PATRON: {
    id: 'PATRON',
    name: 'Patron',
    nameTR: 'Patron',
    level: 'SUPREME',
    layer: 0,
    canDecide: true,
    canExecute: true,
    reportsTo: [],
    manages: ['PATRON_ASISTANI', 'SIBER_GUVENLIK', 'VERI_ARSIVLEME', 'CEO'],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // EXECUTIVE SUPPORT LEVEL (Layer 1 - Paralel)
  // ─────────────────────────────────────────────────────────────────────────────
  PATRON_ASISTANI: {
    id: 'PATRON_ASISTANI',
    name: 'Patron Assistant',
    nameTR: 'Patron Asistanı',
    level: 'EXECUTIVE',
    layer: 1,
    canDecide: false,
    canExecute: true,
    reportsTo: ['PATRON'],
    manages: [],
    parallelWith: ['SIBER_GUVENLIK', 'VERI_ARSIVLEME'],
  },
  SIBER_GUVENLIK: {
    id: 'SIBER_GUVENLIK',
    name: 'Cybersecurity',
    nameTR: 'Siber Güvenlik',
    level: 'EXECUTIVE',
    layer: 1,
    canDecide: false, // Gate rolü, karar değil onay verir
    canExecute: true,
    reportsTo: ['PATRON'],
    manages: [],
    parallelWith: ['PATRON_ASISTANI', 'VERI_ARSIVLEME'],
  },
  VERI_ARSIVLEME: {
    id: 'VERI_ARSIVLEME',
    name: 'Data Archiving',
    nameTR: 'Veri Arşivleme',
    level: 'EXECUTIVE',
    layer: 1,
    canDecide: false,
    canExecute: true,
    reportsTo: ['PATRON'],
    manages: [],
    parallelWith: ['PATRON_ASISTANI', 'SIBER_GUVENLIK'],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // EXECUTIVE LEVEL (Layer 2)
  // ─────────────────────────────────────────────────────────────────────────────
  CEO: {
    id: 'CEO',
    name: 'Chief Executive Officer',
    nameTR: 'CEO',
    level: 'EXECUTIVE',
    layer: 2,
    canDecide: true,
    canExecute: true,
    reportsTo: ['PATRON'],
    manages: ['CELF', 'COO'],
  },
  CELF: {
    id: 'CELF',
    name: 'Chief Executive Legal & Finance',
    nameTR: 'CELF (Hukuk & Finans Direktörü)',
    level: 'EXECUTIVE',
    layer: 2,
    canDecide: true, // Hukuki konularda karar verebilir
    canExecute: true,
    reportsTo: ['CEO'],
    manages: [],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // MANAGEMENT LEVEL (Layer 3)
  // ─────────────────────────────────────────────────────────────────────────────
  COO: {
    id: 'COO',
    name: 'Chief Operating Officer',
    nameTR: 'COO',
    level: 'MANAGEMENT',
    layer: 3,
    canDecide: true, // Operasyonel kararlar
    canExecute: true,
    reportsTo: ['CEO', 'CELF'],
    manages: ['VITRIN', 'PANEL'],
  },
  VITRIN: {
    id: 'VITRIN',
    name: 'Showcase',
    nameTR: 'Vitrin',
    level: 'MANAGEMENT',
    layer: 3,
    canDecide: false,
    canExecute: true,
    reportsTo: ['COO'],
    manages: ['ROL_0', 'ROL_1', 'ROL_2', 'ROL_3', 'ROL_4', 'ROL_5', 'ROL_6', 'ROL_7', 'ROL_8', 'ROL_9', 'ROL_10', 'ROL_11', 'ROL_12'],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // OPERATIONAL LEVEL (Layer 4 - Panel)
  // ─────────────────────────────────────────────────────────────────────────────
  PANEL: {
    id: 'PANEL',
    name: 'Panel',
    nameTR: 'Panel',
    level: 'OPERATIONAL',
    layer: 4,
    canDecide: false, // ÇEKİRDEK KURAL: Panel karar vermez!
    canExecute: true,
    reportsTo: ['COO'],
    manages: [],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // ROLE LEVEL (Layer 5 - ROL-0 to ROL-12)
  // ─────────────────────────────────────────────────────────────────────────────
  ...Object.fromEntries(
    Array.from({ length: 13 }, (_, i) => [
      `ROL_${i}`,
      {
        id: `ROL_${i}`,
        name: `Role ${i}`,
        nameTR: `ROL-${i}`,
        level: 'SUPPORT' as NodeLevel,
        layer: 5,
        canDecide: false,
        canExecute: true,
        reportsTo: ['VITRIN'],
        manages: [],
      } as FlowNode,
    ])
  ),
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// ÇEKİRDEK AKIŞ TANIMLARI (CORE FLOW)
// ═══════════════════════════════════════════════════════════════════════════════

export const CORE_FLOW = {
  version: '2.0.0',
  locked: true,
  lockedAt: '2026-01-21T09:00:00Z',
  lockedBy: 'PATRON',
  patronApprovalRequired: true,

  // ─────────────────────────────────────────────────────────────────────────────
  // ANA AKIŞ: Patron → ... → ROL-12
  // ─────────────────────────────────────────────────────────────────────────────
  mainFlow: {
    name: 'Main System Flow',
    nameTR: 'Ana Sistem Akışı',
    locked: true,
    sequence: [
      'PATRON',
      // Paralel Grup (eş zamanlı işlenebilir)
      ['PATRON_ASISTANI', 'SIBER_GUVENLIK', 'VERI_ARSIVLEME'],
      'CEO',
      'CELF',
      'COO',
      'VITRIN',
      // ROL-0 to ROL-12
      ...Array.from({ length: 13 }, (_, i) => `ROL_${i}`),
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // YETKİ AKIŞI: Aşağı Yönlü (Patron → Panel)
  // ─────────────────────────────────────────────────────────────────────────────
  authorityFlow: {
    name: 'Authority Flow',
    nameTR: 'Yetki Akışı',
    direction: 'DOWNWARD' as FlowDirection,
    locked: true,
    path: ['PATRON', 'CEO', 'COO', 'PANEL'],
    description: 'Decisions and authorizations flow from top to bottom',
    descriptionTR: 'Kararlar ve yetkiler yukarıdan aşağıya akar',
    rules: [
      'Kararlar yalnızca PATRON, CEO, COO tarafından verilebilir',
      'Panel sadece uygulayıcıdır, karar mercii değildir',
      'Yetki devri aşağı yönlü olmalıdır',
      'Atlama yapılamaz (PATRON doğrudan PANEL\'e yetki veremez)',
    ],
  } as FlowPath & { rules: string[] },

  // ─────────────────────────────────────────────────────────────────────────────
  // VERİ AKIŞI: Yukarı Yönlü (Panel → Patron)
  // ─────────────────────────────────────────────────────────────────────────────
  dataFlow: {
    name: 'Data Flow',
    nameTR: 'Veri Akışı',
    direction: 'UPWARD' as FlowDirection,
    locked: true,
    path: ['PANEL', 'COO', 'CELF', 'CEO', 'PATRON'],
    description: 'Data and reports flow from bottom to top',
    descriptionTR: 'Veriler ve raporlar aşağıdan yukarıya akar',
    rules: [
      'Veriler panel seviyesinden toplanır',
      'Raporlar CELF üzerinden hukuki filtreleme geçer',
      'CEO seviyesinde konsolide edilir',
      'Patron\'a özet ve kritik veriler ulaşır',
    ],
  } as FlowPath & { rules: string[] },

  // ─────────────────────────────────────────────────────────────────────────────
  // PARALEL GRUPLAR
  // ─────────────────────────────────────────────────────────────────────────────
  parallelGroups: {
    patronSupport: {
      name: 'Patron Support Group',
      nameTR: 'Patron Destek Grubu',
      nodes: ['PATRON_ASISTANI', 'SIBER_GUVENLIK', 'VERI_ARSIVLEME'],
      executionMode: 'PARALLEL',
      description: 'Bu düğümler PATRON sonrası eş zamanlı çalışabilir',
    },
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// AKIŞ DOĞRULAMA FONKSİYONLARI
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Akış yolu geçerliliğini doğrular
 */
export function validateFlowPath(
  source: string,
  target: string,
  direction: FlowDirection
): FlowValidationResult {
  const flow = direction === 'DOWNWARD' 
    ? CORE_FLOW.authorityFlow 
    : CORE_FLOW.dataFlow;

  const sourcePath = flow.path.indexOf(source);
  const targetPath = flow.path.indexOf(target);

  // Düğüm akışta mevcut mu?
  if (sourcePath === -1) {
    return {
      valid: false,
      direction,
      source,
      target,
      reason: `Kaynak düğüm '${source}' ${direction === 'DOWNWARD' ? 'yetki' : 'veri'} akışında bulunamadı`,
      allowedPath: flow.path,
    };
  }

  if (targetPath === -1) {
    return {
      valid: false,
      direction,
      source,
      target,
      reason: `Hedef düğüm '${target}' ${direction === 'DOWNWARD' ? 'yetki' : 'veri'} akışında bulunamadı`,
      allowedPath: flow.path,
    };
  }

  // Yön kontrolü
  if (direction === 'DOWNWARD') {
    // Yetki akışı: kaynak hedeften önce olmalı (düşük index)
    if (sourcePath >= targetPath) {
      return {
        valid: false,
        direction,
        source,
        target,
        reason: `Yetki akışı sadece aşağı yönlü olabilir. '${source}' → '${target}' geçersiz.`,
        allowedPath: flow.path,
      };
    }

    // Ardışıklık kontrolü (atlama yasak)
    if (targetPath - sourcePath > 1) {
      return {
        valid: false,
        direction,
        source,
        target,
        reason: `Yetki akışında atlama yapılamaz. '${source}' doğrudan '${target}'e yetki veremez.`,
        allowedPath: flow.path.slice(sourcePath, targetPath + 1),
      };
    }
  } else {
    // Veri akışı: kaynak hedeften sonra olmalı (yüksek index)
    if (sourcePath <= targetPath) {
      return {
        valid: false,
        direction,
        source,
        target,
        reason: `Veri akışı sadece yukarı yönlü olabilir. '${source}' → '${target}' geçersiz.`,
        allowedPath: flow.path,
      };
    }
  }

  return {
    valid: true,
    direction,
    source,
    target,
  };
}

/**
 * Düğümün karar verme yetkisi olup olmadığını kontrol eder
 */
export function canNodeDecide(nodeId: string): { canDecide: boolean; reason: string } {
  const node = FLOW_NODES[nodeId];
  
  if (!node) {
    return {
      canDecide: false,
      reason: `Düğüm '${nodeId}' bulunamadı`,
    };
  }

  if (!node.canDecide) {
    return {
      canDecide: false,
      reason: `${node.nameTR} (${nodeId}) karar verme yetkisine sahip değil. Level: ${node.level}`,
    };
  }

  return {
    canDecide: true,
    reason: `${node.nameTR} (${nodeId}) karar verme yetkisine sahip`,
  };
}

/**
 * İki düğüm arasındaki hiyerarşik ilişkiyi doğrular
 */
export function validateHierarchy(
  superior: string,
  subordinate: string
): { valid: boolean; reason: string } {
  const superiorNode = FLOW_NODES[superior];
  const subordinateNode = FLOW_NODES[subordinate];

  if (!superiorNode || !subordinateNode) {
    return {
      valid: false,
      reason: `Düğüm bulunamadı: ${!superiorNode ? superior : subordinate}`,
    };
  }

  // Layer kontrolü
  if (superiorNode.layer >= subordinateNode.layer) {
    return {
      valid: false,
      reason: `${superior} (Layer ${superiorNode.layer}) ${subordinate} (Layer ${subordinateNode.layer})'in üstü değil`,
    };
  }

  // Direkt yönetim kontrolü
  if (!superiorNode.manages.includes(subordinate)) {
    return {
      valid: false,
      reason: `${superior} doğrudan ${subordinate}'i yönetmiyor`,
    };
  }

  return {
    valid: true,
    reason: `${superior} → ${subordinate} hiyerarşisi geçerli`,
  };
}

/**
 * Tüm akış kilit durumunu doğrular
 */
export function validateFlowLockStatus(): { locked: boolean; violations: string[] } {
  const violations: string[] = [];

  if (!CORE_FLOW.locked) {
    violations.push('CRITICAL: Ana akış kilidi açık!');
  }

  if (!CORE_FLOW.mainFlow.locked) {
    violations.push('CRITICAL: Ana akış sırası kilidi açık!');
  }

  if (!CORE_FLOW.authorityFlow.locked) {
    violations.push('CRITICAL: Yetki akışı kilidi açık!');
  }

  if (!CORE_FLOW.dataFlow.locked) {
    violations.push('CRITICAL: Veri akışı kilidi açık!');
  }

  return {
    locked: violations.length === 0,
    violations,
  };
}

/**
 * Panel'in karar vermeye çalışmasını engeller (CR-001)
 */
export function enforceNoPanelDecision(actor: string, action: string): { allowed: boolean; reason?: string } {
  if (actor === 'PANEL' && ['DECIDE', 'APPROVE', 'AUTHORIZE', 'GRANT', 'REVOKE'].includes(action)) {
    return {
      allowed: false,
      reason: 'ÇEKİRDEK KURAL İHLALİ (CR-001): Panel karar vermez! Kararlar yetki akışından (PATRON→CEO→COO) gelmelidir.',
    };
  }
  return { allowed: true };
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export default CORE_FLOW;
