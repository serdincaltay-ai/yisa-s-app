/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🔒 API: ÇEKİRDEK PROTOKOL DURUMU
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Bu endpoint çekirdek protokollerin durumunu döndürür.
 * TEK BAĞLAYICI GERÇEK (Single Source of Truth)
 * 
 * @version 2.0.0
 */

import { NextRequest, NextResponse } from 'next/server';
import CORE_SYSTEM_PROTOCOLS, { validateAllProtocols } from '@/lib/core-protocols';
import { CORE_RULES, validateCoreRules } from '@/lib/core-rules';
import { CORE_FLOW, validateFlowLockStatus, FLOW_NODES } from '@/lib/core-flow';
import { SECURITY_GATES, validateGateLockStatus } from '@/lib/gates';

export async function GET(request: NextRequest) {
  // Tüm protokolleri doğrula
  const protocolValidation = validateAllProtocols();
  const rulesValidation = validateCoreRules();
  const flowValidation = validateFlowLockStatus();
  const gatesValidation = validateGateLockStatus();

  // Genel durum
  const allValid = protocolValidation.valid && 
                   rulesValidation.valid && 
                   flowValidation.locked && 
                   gatesValidation.locked;

  return NextResponse.json({
    // ─────────────────────────────────────────────────────────────────────────
    // GENEL DURUM
    // ─────────────────────────────────────────────────────────────────────────
    status: allValid ? 'LOCKED_AND_VALID' : 'VIOLATION_DETECTED',
    timestamp: new Date().toISOString(),
    version: CORE_SYSTEM_PROTOCOLS.lockStatus.version,

    // ─────────────────────────────────────────────────────────────────────────
    // PROTOKOL KİLİT DURUMU
    // ─────────────────────────────────────────────────────────────────────────
    lockStatus: {
      locked: CORE_SYSTEM_PROTOCOLS.lockStatus.locked,
      immutable: CORE_SYSTEM_PROTOCOLS.lockStatus.immutable,
      patronApprovalRequired: CORE_SYSTEM_PROTOCOLS.lockStatus.patronApprovalRequired,
      lockedAt: CORE_SYSTEM_PROTOCOLS.lockStatus.lockedAt,
      lockedBy: CORE_SYSTEM_PROTOCOLS.lockStatus.lockedBy,
    },

    // ─────────────────────────────────────────────────────────────────────────
    // ÇEKİRDEK AKIŞ (CORE FLOW LOCK)
    // ─────────────────────────────────────────────────────────────────────────
    coreFlow: {
      name: CORE_FLOW.mainFlow.nameTR,
      locked: CORE_FLOW.locked,
      validation: flowValidation,
      
      // Ana Akış
      mainFlow: {
        sequence: CORE_FLOW.mainFlow.sequence,
        locked: CORE_FLOW.mainFlow.locked,
      },

      // Çift Yönlü Akışlar
      bidirectionalFlows: {
        // Yetki Akışı: Aşağı yönlü (Patron → Panel)
        authorityFlow: {
          name: CORE_FLOW.authorityFlow.nameTR,
          direction: CORE_FLOW.authorityFlow.direction,
          path: CORE_FLOW.authorityFlow.path,
          locked: CORE_FLOW.authorityFlow.locked,
          description: CORE_FLOW.authorityFlow.descriptionTR,
        },
        
        // Veri Akışı: Yukarı yönlü (Panel → Patron)
        dataFlow: {
          name: CORE_FLOW.dataFlow.nameTR,
          direction: CORE_FLOW.dataFlow.direction,
          path: CORE_FLOW.dataFlow.path,
          locked: CORE_FLOW.dataFlow.locked,
          description: CORE_FLOW.dataFlow.descriptionTR,
        },
      },

      // Paralel Gruplar
      parallelGroups: CORE_FLOW.parallelGroups,
    },

    // ─────────────────────────────────────────────────────────────────────────
    // ÇEKİRDEK KURALLAR (CORE RULES LOCK)
    // ─────────────────────────────────────────────────────────────────────────
    coreRules: {
      name: 'Çekirdek Kurallar v2.0',
      locked: true,
      immutable: true,
      patronApprovalRequired: true,
      validation: rulesValidation,
      
      rules: CORE_RULES.map(rule => ({
        id: rule.id,
        code: rule.code,
        name: rule.nameTR,
        enforcement: rule.enforcement,
        immutable: rule.immutable,
        bypassable: rule.bypassable,
        patronApprovalRequired: rule.patronApprovalRequired,
        description: rule.descriptionTR,
      })),

      // Kural özeti
      summary: {
        'CR-001': 'Panel karar vermez',
        'CR-002': 'Veri silinmez/gizlenir',
        'CR-003': 'Çocuk ham verisi açılmaz',
        'CR-004': 'Patron DB kayıp yaşamaz',
        'CR-005': 'Audit log silinmez',
        'CR-006': 'Güvenlik robotu bypass edilemez',
        'CR-007': 'Tek seferde tam erişim yok',
      },
    },

    // ─────────────────────────────────────────────────────────────────────────
    // GÜVENLİK KAPILARI (SECURITY GATES)
    // ─────────────────────────────────────────────────────────────────────────
    securityGates: {
      name: 'Güvenlik Kapıları v2.0',
      locked: true,
      validation: gatesValidation,
      
      gates: {
        CISO_GATE: {
          name: SECURITY_GATES.CISO_GATE.nameTR,
          level: SECURITY_GATES.CISO_GATE.level,
          bypassable: SECURITY_GATES.CISO_GATE.bypassable,
          immutable: SECURITY_GATES.CISO_GATE.immutable,
          status: SECURITY_GATES.CISO_GATE.status,
          description: SECURITY_GATES.CISO_GATE.descriptionTR,
          requiredFor: SECURITY_GATES.CISO_GATE.requiredFor,
        },
        CLO_VETO: {
          name: SECURITY_GATES.CLO_VETO.nameTR,
          level: SECURITY_GATES.CLO_VETO.level,
          bypassable: SECURITY_GATES.CLO_VETO.bypassable,
          immutable: SECURITY_GATES.CLO_VETO.immutable,
          status: SECURITY_GATES.CLO_VETO.status,
          description: SECURITY_GATES.CLO_VETO.descriptionTR,
          requiredFor: SECURITY_GATES.CLO_VETO.requiredFor,
        },
      },

      // Kapı özeti
      summary: {
        'CISO_GATE': 'Siber güvenlik onay kapısı - bypass edilemez',
        'CLO_VETO': 'Hukuki veto kapısı - bypass edilemez',
      },
    },

    // ─────────────────────────────────────────────────────────────────────────
    // ROL HİYERARŞİSİ
    // ─────────────────────────────────────────────────────────────────────────
    roleHierarchy: {
      layers: [
        { layer: 0, name: 'SUPREME', nodes: ['PATRON'] },
        { layer: 1, name: 'EXECUTIVE_SUPPORT', nodes: ['PATRON_ASISTANI', 'SIBER_GUVENLIK', 'VERI_ARSIVLEME'] },
        { layer: 2, name: 'EXECUTIVE', nodes: ['CEO', 'CELF'] },
        { layer: 3, name: 'MANAGEMENT', nodes: ['COO', 'VITRIN'] },
        { layer: 4, name: 'OPERATIONAL', nodes: ['PANEL'] },
        { layer: 5, name: 'SUPPORT', nodes: Array.from({ length: 13 }, (_, i) => `ROL_${i}`) },
      ],
    },

    // ─────────────────────────────────────────────────────────────────────────
    // DOĞRULAMA ÖZET
    // ─────────────────────────────────────────────────────────────────────────
    validationSummary: {
      protocolValid: protocolValidation.valid,
      rulesValid: rulesValidation.valid,
      flowLocked: flowValidation.locked,
      gatesLocked: gatesValidation.locked,
      allViolations: [
        ...protocolValidation.violations,
        ...rulesValidation.violations,
        ...flowValidation.violations,
        ...gatesValidation.violations,
      ],
    },

    // ─────────────────────────────────────────────────────────────────────────
    // META BİLGİ
    // ─────────────────────────────────────────────────────────────────────────
    meta: {
      source: 'lib/core-protocols.ts',
      singleSourceOfTruth: true,
      documentation: 'Doküman v2.0',
      lastUpdated: '2026-01-21T09:00:00Z',
      updatedBy: 'PATRON',
    },
  });
}

export async function POST(request: NextRequest) {
  // POST ile protokol değiştirme denemesi engellenir
  return NextResponse.json({
    error: 'CORE_RULE_VIOLATION',
    message: 'Çekirdek protokoller değiştirilemez! Bu protokoller "Patron onayı olmadan değişmez" olarak işaretlidir.',
    patronApprovalRequired: true,
    locked: true,
  }, { status: 403 });
}

export async function PUT(request: NextRequest) {
  // PUT ile protokol değiştirme denemesi engellenir
  return NextResponse.json({
    error: 'CORE_RULE_VIOLATION',
    message: 'Çekirdek protokoller değiştirilemez! Bu protokoller immutable olarak tanımlanmıştır.',
    patronApprovalRequired: true,
    locked: true,
  }, { status: 403 });
}

export async function DELETE(request: NextRequest) {
  // DELETE ile protokol silme denemesi engellenir
  return NextResponse.json({
    error: 'CORE_RULE_VIOLATION',
    rule: 'CR-005',
    message: 'Çekirdek protokoller silinemez! Audit log ve sistem protokolleri kalıcıdır.',
    patronApprovalRequired: true,
    locked: true,
  }, { status: 403 });
}
