/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🔒 MIDDLEWARE - ÇEKİRDEK PROTOKOL UYGULAMASI v2.0
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Bu middleware çekirdek sistem protokollerini uygular:
 * - Çekirdek Kurallar (Core Rules)
 * - Çekirdek Akış (Core Flow)
 * - Güvenlik Kapıları (CISO Gate + CLO Veto)
 * 
 * @version 2.0.0
 * @locked true
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// ═══════════════════════════════════════════════════════════════════════════════
// ÇEKİRDEK PROTOKOL DURUMU (INLINE - DEĞİŞTİRİLEMEZ)
// ═══════════════════════════════════════════════════════════════════════════════

const CORE_PROTOCOL_STATUS = {
  version: '2.0.0',
  locked: true,
  immutable: true,
  patronApprovalRequired: true,
  lockedAt: '2026-01-21T09:00:00Z',
  lockedBy: 'PATRON',
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// ÇEKİRDEK KURALLAR (INLINE - DEĞİŞTİRİLEMEZ)
// ═══════════════════════════════════════════════════════════════════════════════

const CORE_RULES = {
  'CR-001': { code: 'PANEL_NO_DECISION', name: 'Panel karar vermez', immutable: true, bypassable: false },
  'CR-002': { code: 'DATA_NO_DELETE', name: 'Veri silinmez/gizlenir', immutable: true, bypassable: false },
  'CR-003': { code: 'CHILD_DATA_PROTECTED', name: 'Çocuk ham verisi açılmaz', immutable: true, bypassable: false },
  'CR-004': { code: 'PATRON_NO_DB_LOSS', name: 'Patron DB kayıp yaşamaz', immutable: true, bypassable: false },
  'CR-005': { code: 'AUDIT_LOG_PROTECTED', name: 'Audit log silinmez', immutable: true, bypassable: false },
  'CR-006': { code: 'SECURITY_ROBOT_UNBYPASSABLE', name: 'Güvenlik robotu bypass edilemez', immutable: true, bypassable: false },
  'CR-007': { code: 'NO_FULL_ACCESS_AT_ONCE', name: 'Tek seferde tam erişim yok', immutable: true, bypassable: false },
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// GÜVENLİK KAPILARI (INLINE - DEĞİŞTİRİLEMEZ)
// ═══════════════════════════════════════════════════════════════════════════════

const SECURITY_GATES = {
  CISO_GATE: {
    code: 'CISO_GATE',
    name: 'CISO Güvenlik Kapısı',
    level: 'CORE_RULE',
    bypassable: false,
    immutable: true,
  },
  CLO_VETO: {
    code: 'CLO_VETO',
    name: 'CLO Hukuki Veto Kapısı',
    level: 'CORE_RULE',
    bypassable: false,
    immutable: true,
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// AKIŞ TANIMLARI (INLINE - DEĞİŞTİRİLEMEZ)
// ═══════════════════════════════════════════════════════════════════════════════

const CORE_FLOW = {
  // Yetki Akışı: Aşağı yönlü
  authorityFlow: {
    direction: 'DOWNWARD',
    path: ['PATRON', 'CEO', 'COO', 'PANEL'],
    locked: true,
  },
  // Veri Akışı: Yukarı yönlü
  dataFlow: {
    direction: 'UPWARD',
    path: ['PANEL', 'COO', 'CELF', 'CEO', 'PATRON'],
    locked: true,
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// MIDDLEWARE FONKSİYONU
// ═══════════════════════════════════════════════════════════════════════════════

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;
  const method = req.method;
  
  // ─────────────────────────────────────────────────────────────────────────────
  // 1. PROTOKOL KİLİT DURUMU KONTROLÜ
  // ─────────────────────────────────────────────────────────────────────────────
  
  // Protokol kilidi kontrol endpoint'i
  if (pathname === '/api/core/status') {
    return NextResponse.json({
      status: 'LOCKED',
      protocol: CORE_PROTOCOL_STATUS,
      rules: CORE_RULES,
      gates: SECURITY_GATES,
      flow: CORE_FLOW,
      message: 'Çekirdek protokoller kilitli ve aktif',
    });
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. GÜVENLİK KAPISI BYPASS KONTROLÜ (CR-006)
  // ─────────────────────────────────────────────────────────────────────────────
  
  const bypassHeaders = [
    'x-bypass-security',
    'x-skip-gate',
    'x-disable-ciso',
    'x-disable-clo',
    'x-bypass-gate',
  ];
  
  for (const header of bypassHeaders) {
    if (req.headers.get(header)) {
      return new NextResponse(
        JSON.stringify({
          error: 'CORE_RULE_VIOLATION',
          rule: 'CR-006',
          message: 'ÇEKİRDEK KURAL İHLALİ: Güvenlik kapıları bypass edilemez!',
          gate: 'CISO_GATE + CLO_VETO',
          blocked: true,
        }),
        { 
          status: 403, 
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  }

  // Bypass query parametreleri kontrolü
  const bypassParams = ['bypass', 'skip_security', 'disable_gate', 'no_check'];
  for (const param of bypassParams) {
    if (searchParams.has(param)) {
      return new NextResponse(
        JSON.stringify({
          error: 'CORE_RULE_VIOLATION',
          rule: 'CR-006',
          message: 'ÇEKİRDEK KURAL İHLALİ: Güvenlik kontrolleri atlanamaz!',
          blocked: true,
        }),
        { 
          status: 403, 
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. VERİ SİLME KORUMASI (CR-002, CR-005)
  // ─────────────────────────────────────────────────────────────────────────────
  
  if (method === 'DELETE') {
    // Hard delete kontrolü
    const softDelete = searchParams.get('soft') === 'true' || 
                       searchParams.get('hide') === 'true';
    
    // Audit log silme kontrolü
    if (pathname.includes('audit') || pathname.includes('log')) {
      return new NextResponse(
        JSON.stringify({
          error: 'CORE_RULE_VIOLATION',
          rule: 'CR-005',
          message: 'ÇEKİRDEK KURAL İHLALİ: Audit log silinemez!',
          blocked: true,
        }),
        { 
          status: 403, 
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Hard delete engelleme (soft delete olmadan)
    if (!softDelete) {
      return new NextResponse(
        JSON.stringify({
          error: 'CORE_RULE_VIOLATION',
          rule: 'CR-002',
          message: 'ÇEKİRDEK KURAL İHLALİ: Veri silinemez, sadece gizlenebilir (soft delete)!',
          hint: 'Soft delete için ?soft=true veya ?hide=true parametresi ekleyin',
          blocked: true,
        }),
        { 
          status: 403, 
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. ÇOCUK VERİSİ KORUMASI (CR-003)
  // ─────────────────────────────────────────────────────────────────────────────
  
  const childDataPaths = ['/child', '/minor', '/student', '/youth', '/cocuk', '/ogrenci'];
  const rawDataParams = ['raw', 'raw_data', 'export_raw', 'ham_veri'];
  
  const isChildPath = childDataPaths.some(p => pathname.toLowerCase().includes(p));
  const isRawRequest = rawDataParams.some(p => searchParams.has(p));
  
  if (isChildPath && isRawRequest) {
    return new NextResponse(
      JSON.stringify({
        error: 'CORE_RULE_VIOLATION',
        rule: 'CR-003',
        message: 'ÇEKİRDEK KURAL İHLALİ: Çocuk ham verisi açılamaz! Bu mutlak bir kuraldır.',
        blocked: true,
      }),
      { 
        status: 403, 
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 5. TAM ERİŞİM KONTROLÜ (CR-007)
  // ─────────────────────────────────────────────────────────────────────────────
  
  const fullAccessParams = ['all', 'full', 'export_all', 'select_all', 'dump'];
  const hasFullAccessParam = fullAccessParams.some(p => searchParams.has(p));
  
  if (hasFullAccessParam) {
    return new NextResponse(
      JSON.stringify({
        error: 'CORE_RULE_VIOLATION',
        rule: 'CR-007',
        message: 'ÇEKİRDEK KURAL İHLALİ: Tek seferde tam erişim yasaktır!',
        hint: 'Veri erişimi sayfalandırılmış ve kontrollü olmalıdır',
        blocked: true,
      }),
      { 
        status: 403, 
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 6. PATRON DB KORUMASI (CR-004)
  // ─────────────────────────────────────────────────────────────────────────────
  
  const patronPaths = ['/patron', '/patron_inbox', '/patron_db', '/patron_config'];
  const destructiveActions = ['DELETE', 'TRUNCATE', 'DROP'];
  
  const isPatronPath = patronPaths.some(p => pathname.toLowerCase().includes(p));
  const isDestructive = destructiveActions.includes(method) || 
                        searchParams.has('truncate') || 
                        searchParams.has('drop');
  
  if (isPatronPath && isDestructive) {
    return new NextResponse(
      JSON.stringify({
        error: 'CORE_RULE_VIOLATION',
        rule: 'CR-004',
        message: 'ÇEKİRDEK KURAL İHLALİ: Patron veritabanında veri kaybına yol açacak işlemler yasaktır!',
        blocked: true,
      }),
      { 
        status: 403, 
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 7. PANEL KARAR VERME KONTROLÜ (CR-001)
  // ─────────────────────────────────────────────────────────────────────────────
  
  const panelPaths = ['/panel'];
  const decisionActions = ['approve', 'authorize', 'grant', 'revoke', 'decide'];
  
  const isPanelPath = panelPaths.some(p => pathname.toLowerCase().includes(p));
  const isDecisionAction = decisionActions.some(a => 
    pathname.toLowerCase().includes(a) || searchParams.has(a)
  );
  
  if (isPanelPath && isDecisionAction) {
    return new NextResponse(
      JSON.stringify({
        error: 'CORE_RULE_VIOLATION',
        rule: 'CR-001',
        message: 'ÇEKİRDEK KURAL İHLALİ: Panel karar vermez! Kararlar yetki akışından (PATRON→CEO→COO) gelmelidir.',
        blocked: true,
      }),
      { 
        status: 403, 
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 8. PROTOKOL HEADER EKLEMESİ
  // ─────────────────────────────────────────────────────────────────────────────
  
  const response = NextResponse.next();
  
  // Protokol durumu header'ları
  response.headers.set('X-Core-Protocol-Version', CORE_PROTOCOL_STATUS.version);
  response.headers.set('X-Core-Protocol-Locked', 'true');
  response.headers.set('X-CISO-Gate-Active', 'true');
  response.headers.set('X-CLO-Veto-Active', 'true');
  response.headers.set('X-Core-Rules-Enforced', 'CR-001,CR-002,CR-003,CR-004,CR-005,CR-006,CR-007');
  
  return response;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MIDDLEWARE KONFİGÜRASYONU
// ═══════════════════════════════════════════════════════════════════════════════

export const config = {
  matcher: [
    // Tüm API rotaları
    '/api/:path*',
    // Dashboard rotaları
    '/dashboard/:path*',
    // Panel rotaları
    '/panel/:path*',
    // Assistant rotaları
    '/assistant/:path*',
    // Patron rotaları
    '/patron/:path*',
  ]
}
