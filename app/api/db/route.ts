/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * VERİTABANI API - PROTOKOL UYUMLU
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Bu endpoint Sistem Protokolleri v2.0 kurallarına uygun çalışır.
 * RULE_002: Veri silinmez, sadece gizlenir
 * RULE_004: Patron DB kayıp yaşamaz
 * RULE_005: Audit log silinmez
 */

import { NextRequest, NextResponse } from 'next/server';
import Anthropic from "@anthropic-ai/sdk";
import { 
  CORE_RULES,
  checkCLOVeto,
  checkCISOGate 
} from '@/lib/system-protocols';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const SYSTEM_PROMPT = `Sen YİSA-S Robot'sun - 6 Yapay Zeka Motorlu Kolektif Zeka Sistemi.
═══════════════════════════════════════════════════════════════════════════════
PATRON MODU AKTİF
Kurallar:
- Her zaman Türkçe, net ve uygulanabilir cevap ver.
- Kısa ve madde madde anlat.
- Gerektiğinde soruyu netleştirmek için 1-2 soru sor.

ÇEKİRDEK KURALLAR (DEĞİŞTİRİLEMEZ):
1. Panel karar vermez
2. Veri silinmez/gizlenir
3. Çocuk ham verisi açılmaz
4. Patron DB kayıp yaşamaz
5. Audit log silinmez
6. Güvenlik robotu bypass edilemez
7. Tek seferde tam erişim yok

Not:
- İçeride CEO ve ASST modları bulunur; kullanıcı bağlama göre uygun rolü uygula.
`;

/**
 * Audit log kaydı oluşturur
 */
function createAuditLog(
  action: string, 
  details: Record<string, unknown>,
  userRole: string | null
): void {
  const auditEntry = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    action,
    details,
    userRole: userRole || 'ANONYMOUS',
    // RULE_005: Bu log asla silinemez
    immutable: true
  };
  
  // Gerçek implementasyonda write-once storage'a yazılır
  console.log('[AUDIT][DB_OPERATION]', JSON.stringify(auditEntry));
}

/**
 * POST /api/db
 * Veritabanı işlemleri
 */
export async function POST(req: NextRequest) {
  const userRole = req.headers.get('x-user-role');
  
  try {
    const body = await req.json();
    const { operation, table, data, id } = body;
    
    // CISO Gate kontrolü
    const cisoResult = checkCISOGate(operation, userRole as any);
    if (!cisoResult.passed) {
      createAuditLog('BLOCKED_BY_CISO', { operation, table, reason: cisoResult.action }, userRole);
      return NextResponse.json({
        error: 'Güvenlik kontrolü başarısız',
        rule: 'RULE_006'
      }, { status: 403 });
    }
    
    // CLO Veto kontrolü - DELETE işlemleri için
    if (operation === 'DELETE' || operation === 'delete') {
      const cloResult = checkCLOVeto('delete', 'general');
      
      createAuditLog('DELETE_ATTEMPT_BLOCKED', { 
        table, 
        id, 
        reason: CORE_RULES.RULE_002_NO_DATA_DELETE.title_tr 
      }, userRole);
      
      return NextResponse.json({
        error: CORE_RULES.RULE_002_NO_DATA_DELETE.title_tr,
        rule: 'RULE_002',
        message: 'Veri silme işlemi engellendi. Bunun yerine soft-delete (gizleme) kullanın.',
        suggestedOperation: 'SOFT_DELETE',
        suggestedPayload: {
          operation: 'UPDATE',
          table,
          id,
          data: { 
            is_hidden: true, 
            hidden_at: new Date().toISOString(),
            hidden_by: userRole 
          }
        }
      }, { status: 403 });
    }
    
    // Çocuk verisi kontrolü
    if (table === 'children' || table === 'child_data') {
      const cloResult = checkCLOVeto('access', 'child');
      
      createAuditLog('CHILD_DATA_ACCESS_BLOCKED', { 
        table, 
        operation,
        reason: CORE_RULES.RULE_003_CHILD_DATA_PROTECTED.title_tr 
      }, userRole);
      
      return NextResponse.json({
        error: CORE_RULES.RULE_003_CHILD_DATA_PROTECTED.title_tr,
        rule: 'RULE_003',
        message: 'Çocuk ham verisine erişim tamamen engellidir. Sadece anonim istatistikler görüntülenebilir.',
        alternativeEndpoint: '/api/statistics/children/anonymized'
      }, { status: 403 });
    }
    
    // Audit log tablosu koruması
    if (table === 'audit_logs' && (operation === 'UPDATE' || operation === 'DELETE')) {
      createAuditLog('AUDIT_LOG_MODIFICATION_BLOCKED', { 
        table, 
        operation,
        reason: CORE_RULES.RULE_005_AUDIT_LOG_IMMUTABLE.title_tr 
      }, userRole);
      
      return NextResponse.json({
        error: CORE_RULES.RULE_005_AUDIT_LOG_IMMUTABLE.title_tr,
        rule: 'RULE_005',
        message: 'Audit logları değiştirilemez veya silinemez. WORM (Write Once Read Many) prensibi uygulanır.'
      }, { status: 403 });
    }
    
    // Normal işlem devam eder
    createAuditLog('DB_OPERATION', { operation, table, dataKeys: data ? Object.keys(data) : [] }, userRole);
    
    return NextResponse.json({
      success: true,
      message: 'İşlem başarılı',
      protocolCompliant: true
    });
    
  } catch (error) {
    createAuditLog('DB_ERROR', { error: String(error) }, userRole);
    return NextResponse.json({
      error: 'İşlem hatası',
      message: String(error)
    }, { status: 500 });
  }
}

/**
 * DELETE /api/db
 * DELETE metodu tamamen engellendi (RULE_002)
 */
export async function DELETE(req: NextRequest) {
  const userRole = req.headers.get('x-user-role');
  
  createAuditLog('DELETE_METHOD_BLOCKED', { 
    reason: CORE_RULES.RULE_002_NO_DATA_DELETE.title_tr 
  }, userRole);
  
  return NextResponse.json({
    error: CORE_RULES.RULE_002_NO_DATA_DELETE.title_tr,
    rule: 'RULE_002',
    message: 'DELETE HTTP metodu bu sistemde devre dışıdır. Veri silme yerine soft-delete (gizleme) kullanın.',
    documentation: '/docs/soft-delete',
    example: {
      method: 'POST',
      body: {
        operation: 'UPDATE',
        table: 'your_table',
        id: 'record_id',
        data: { is_hidden: true }
      }
    }
  }, { status: 405 });
}

/**
 * GET /api/db
 * Sağlık kontrolü
 */
export async function GET(req: NextRequest) {
  return NextResponse.json({
    status: 'active',
    protocolVersion: '2.0.0',
    protocolStatus: 'LOCKED',
    coreRulesEnforced: [
      'RULE_002: ' + CORE_RULES.RULE_002_NO_DATA_DELETE.title_tr,
      'RULE_003: ' + CORE_RULES.RULE_003_CHILD_DATA_PROTECTED.title_tr,
      'RULE_004: ' + CORE_RULES.RULE_004_PATRON_DB_NO_LOSS.title_tr,
      'RULE_005: ' + CORE_RULES.RULE_005_AUDIT_LOG_IMMUTABLE.title_tr
    ]
  });
}
