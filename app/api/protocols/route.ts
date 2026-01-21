/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * SİSTEM PROTOKOLLERİ API - TEK BAĞLAYICI GERÇEK
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Bu endpoint, Sistem Protokolleri v2.0'ın durumunu ve bütünlüğünü raporlar.
 * Protokol detayları sadece yetkili roller tarafından görüntülenebilir.
 */

import { NextRequest, NextResponse } from 'next/server';
import SYSTEM_PROTOCOLS, { 
  validateProtocolIntegrity,
  CORE_FLOW_LOCK,
  CORE_RULES_LOCK,
  NON_BYPASSABLE_GATES
} from '@/lib/system-protocols';

/**
 * GET /api/protocols
 * Protokol durumunu ve bütünlük raporunu döndürür
 */
export async function GET(req: NextRequest) {
  // Bütünlük kontrolü
  const integrityCheck = validateProtocolIntegrity();
  
  // Temel protokol bilgisi (herkese açık)
  const publicInfo = {
    version: SYSTEM_PROTOCOLS.version,
    status: SYSTEM_PROTOCOLS.status,
    lockedAt: SYSTEM_PROTOCOLS.lockedAt,
    lockedBy: SYSTEM_PROTOCOLS.lockedBy,
    integrityValid: integrityCheck.valid,
    timestamp: new Date().toISOString()
  };
  
  // Rol kontrolü
  const userRole = req.headers.get('x-user-role');
  
  // Sadece CEO ve üstü detaylı bilgi görebilir
  const authorizedRoles = ['PATRON', 'PATRON_ASISTANI', 'SIBER_GUVENLIK', 'CEO', 'CELF', 'CLO'];
  
  if (!userRole || !authorizedRoles.includes(userRole)) {
    return NextResponse.json({
      ...publicInfo,
      message: 'Detaylı protokol bilgisi için yetkilendirme gereklidir.'
    });
  }
  
  // Detaylı protokol raporu (yetkili roller için)
  const detailedReport = {
    ...publicInfo,
    
    // Çekirdek Akış Kilidi
    coreFlowLock: {
      status: CORE_FLOW_LOCK.status,
      authorityFlow: {
        name: CORE_FLOW_LOCK.authorityFlow.name,
        direction: CORE_FLOW_LOCK.authorityFlow.direction,
        locked: CORE_FLOW_LOCK.authorityFlow.locked,
        shorthand: CORE_FLOW_LOCK.authorityFlow.shorthand
      },
      dataFlow: {
        name: CORE_FLOW_LOCK.dataFlow.name,
        direction: CORE_FLOW_LOCK.dataFlow.direction,
        locked: CORE_FLOW_LOCK.dataFlow.locked,
        shorthand: CORE_FLOW_LOCK.dataFlow.shorthand
      }
    },
    
    // Çekirdek Kurallar Kilidi
    coreRulesLock: {
      status: CORE_RULES_LOCK.status,
      totalRules: CORE_RULES_LOCK.totalRules,
      rules: Object.entries(CORE_RULES_LOCK.rules).map(([key, rule]) => ({
        id: rule.id,
        code: rule.code,
        title: rule.title_tr,
        severity: rule.severity,
        locked: rule.locked,
        enforcementLevel: rule.enforcementLevel
      })),
      modificationRequirements: CORE_RULES_LOCK.modification
    },
    
    // Bypass Edilemez Kapılar
    nonBypassableGates: {
      status: NON_BYPASSABLE_GATES.status,
      gates: Object.entries(NON_BYPASSABLE_GATES.gates).map(([key, gate]) => ({
        id: gate.id,
        name: gate.name,
        status: gate.status,
        cannotBypass: gate.cannotBypass
      })),
      linkedCoreRules: NON_BYPASSABLE_GATES.linkedCoreRules
    },
    
    // Bütünlük Kontrolü Detayları
    integrityReport: integrityCheck
  };
  
  return NextResponse.json(detailedReport);
}

/**
 * POST /api/protocols/validate
 * Protokol bütünlüğünü manuel olarak doğrular
 */
export async function POST(req: NextRequest) {
  const userRole = req.headers.get('x-user-role');
  
  // Sadece Siber Güvenlik ve üstü bütünlük kontrolü yapabilir
  const authorizedRoles = ['PATRON', 'SIBER_GUVENLIK', 'CEO'];
  
  if (!userRole || !authorizedRoles.includes(userRole)) {
    return NextResponse.json({
      error: 'Yetersiz yetki',
      message: 'Protokol bütünlük kontrolü için yetkilendirme gereklidir.'
    }, { status: 403 });
  }
  
  const integrityCheck = validateProtocolIntegrity();
  
  // Audit log kaydı
  console.log('[AUDIT][PROTOCOL_VALIDATION]', JSON.stringify({
    timestamp: new Date().toISOString(),
    requestedBy: userRole,
    result: integrityCheck.valid ? 'VALID' : 'COMPROMISED',
    errors: integrityCheck.errors
  }));
  
  if (!integrityCheck.valid) {
    return NextResponse.json({
      status: 'COMPROMISED',
      message: 'KRİTİK: Protokol bütünlüğü bozulmuş!',
      ...integrityCheck,
      action: 'IMMEDIATE_ESCALATION_REQUIRED'
    }, { status: 500 });
  }
  
  return NextResponse.json({
    status: 'VALID',
    message: 'Protokol bütünlüğü doğrulandı.',
    ...integrityCheck,
    validatedAt: new Date().toISOString(),
    validatedBy: userRole
  });
}
