// middleware.ts
/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * SİSTEM MIDDLEWARE - PROTOKOL DOĞRULAMA KATMANI
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Bu middleware, tüm isteklerin Sistem Protokolleri v2.0'a uygunluğunu denetler.
 * CISO Gate ve CLO Veto kontrolleri bu katmanda uygulanır.
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// ═══════════════════════════════════════════════════════════════════════════════
// PROTOKOL SABİTLERİ (Edge Runtime uyumluluğu için inline tanımlı)
// ═══════════════════════════════════════════════════════════════════════════════

const PROTOCOL_VERSION = '2.0.0';
const PROTOCOL_STATUS = 'LOCKED';

/**
 * Çekirdek Kurallar - Edge Runtime için kısaltılmış versiyon
 */
const CORE_RULES_SUMMARY = {
  RULE_001: 'Panel karar vermez',
  RULE_002: 'Veri silinmez/gizlenir',
  RULE_003: 'Çocuk ham verisi açılmaz',
  RULE_004: 'Patron DB kayıp yaşamaz',
  RULE_005: 'Audit log silinmez',
  RULE_006: 'Güvenlik robotu bypass edilemez',
  RULE_007: 'Tek seferde tam erişim yok'
};

/**
 * Yetki Akışı Sırası
 */
const AUTHORITY_FLOW_SEQUENCE = [
  'PATRON',
  'PATRON_ASISTANI', 'SIBER_GUVENLIK', 'VERI_ARSIVLEME',
  'CEO', 'CELF', 'COO', 'VITRIN',
  'ROL_0', 'ROL_1', 'ROL_2', 'ROL_3', 'ROL_4', 'ROL_5',
  'ROL_6', 'ROL_7', 'ROL_8', 'ROL_9', 'ROL_10', 'ROL_11', 'ROL_12'
];

/**
 * Korumalı rotalar ve gereken minimum yetki seviyeleri
 */
const PROTECTED_ROUTES: Record<string, number> = {
  '/dashboard/patron': 0,      // Sadece PATRON (level 0)
  '/dashboard/patron/robot-dashboard': 0,
  '/panel/dashboard': 6,       // Panel rolleri (level 6)
  '/api/db': 2,                // CEO ve üstü
  '/api/chat': 5,              // Vitrin ve üstü
};

/**
 * Hassas veri endpoint'leri - CLO Veto kontrolü gerektirir
 */
const SENSITIVE_DATA_ROUTES = [
  '/api/db',
  '/api/audit',
  '/api/users',
  '/api/children',
];

// ═══════════════════════════════════════════════════════════════════════════════
// MIDDLEWARE FONKSİYONLARI
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * İstek header'larından kullanıcı rolünü çıkarır
 */
function extractUserRole(req: NextRequest): string | null {
  // Gerçek implementasyonda JWT token veya session'dan alınır
  return req.headers.get('x-user-role') || null;
}

/**
 * Rol seviyesini döndürür
 */
function getRoleLevel(role: string): number {
  const index = AUTHORITY_FLOW_SEQUENCE.indexOf(role);
  if (index === -1) return 999; // Bilinmeyen rol = en düşük yetki
  
  // Seviye hesaplama (Patron = 0, diğerleri pozisyona göre)
  if (role === 'PATRON') return 0;
  if (['PATRON_ASISTANI', 'SIBER_GUVENLIK', 'VERI_ARSIVLEME'].includes(role)) return 1;
  if (role === 'CEO') return 2;
  if (['CELF', 'CLO'].includes(role)) return 3;
  if (role === 'COO') return 4;
  if (role === 'VITRIN') return 5;
  return 6; // Panel rolleri
}

/**
 * CISO Gate Kontrolü
 * Tüm istekler güvenlik kontrolünden geçmeli
 */
function checkCISOGate(req: NextRequest): { passed: boolean; reason: string } {
  // Güvenlik başlıkları kontrolü
  const securityHeaders = {
    hasOrigin: !!req.headers.get('origin'),
    hasUserAgent: !!req.headers.get('user-agent'),
    // Gerçek implementasyonda daha fazla kontrol eklenir
  };
  
  // Şüpheli aktivite kontrolü (basitleştirilmiş)
  const suspiciousPatterns = [
    /\.\.\//,           // Path traversal
    /<script/i,         // XSS
    /union.*select/i,   // SQL injection
  ];
  
  const url = req.nextUrl.pathname + req.nextUrl.search;
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(url)) {
      return { 
        passed: false, 
        reason: 'RULE_006: Güvenlik tehdidi tespit edildi' 
      };
    }
  }
  
  return { passed: true, reason: '' };
}

/**
 * CLO Veto Kontrolü
 * Hassas veri işlemleri için hukuki kontrol
 */
function checkCLOVeto(req: NextRequest): { vetoed: boolean; reason: string } {
  const pathname = req.nextUrl.pathname;
  const method = req.method;
  
  // Hassas rota kontrolü
  const isSensitiveRoute = SENSITIVE_DATA_ROUTES.some(route => 
    pathname.startsWith(route)
  );
  
  if (!isSensitiveRoute) {
    return { vetoed: false, reason: '' };
  }
  
  // DELETE işlemi engellendi (RULE_002: Veri silinmez)
  if (method === 'DELETE') {
    return { 
      vetoed: true, 
      reason: 'RULE_002: Veri silme işlemi engellendi. Sadece soft-delete (gizleme) yapılabilir.' 
    };
  }
  
  // Çocuk verisi erişimi kontrolü (RULE_003)
  if (pathname.includes('/children') || pathname.includes('/child')) {
    const role = extractUserRole(req);
    // Çocuk ham verisine erişim tamamen engelli
    return { 
      vetoed: true, 
      reason: 'RULE_003: Çocuk ham verisi erişime kapalıdır.' 
    };
  }
  
  return { vetoed: false, reason: '' };
}

/**
 * Audit Log Kaydı
 * Tüm kritik işlemler loglanır (RULE_005)
 */
function logAuditEntry(req: NextRequest, result: 'ALLOWED' | 'BLOCKED', reason: string): void {
  // Gerçek implementasyonda veritabanına veya log servisine yazılır
  const auditEntry = {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.nextUrl.pathname,
    role: extractUserRole(req) || 'ANONYMOUS',
    result,
    reason,
    ip: req.headers.get('x-forwarded-for') || 'unknown',
    userAgent: req.headers.get('user-agent') || 'unknown',
    protocolVersion: PROTOCOL_VERSION
  };
  
  // Console log (production'da gerçek audit sisteme gönderilir)
  if (result === 'BLOCKED') {
    console.warn('[AUDIT][BLOCKED]', JSON.stringify(auditEntry));
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ANA MIDDLEWARE
// ═══════════════════════════════════════════════════════════════════════════════

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  
  // Protokol header'ları ekle
  const response = NextResponse.next();
  response.headers.set('X-Protocol-Version', PROTOCOL_VERSION);
  response.headers.set('X-Protocol-Status', PROTOCOL_STATUS);
  
  // 1. CISO Gate Kontrolü (RULE_006: Güvenlik bypass edilemez)
  const cisoCheck = checkCISOGate(req);
  if (!cisoCheck.passed) {
    logAuditEntry(req, 'BLOCKED', cisoCheck.reason);
    return new NextResponse(
      JSON.stringify({ 
        error: 'Güvenlik kontrolü başarısız',
        rule: 'RULE_006',
        message: cisoCheck.reason 
      }),
      { 
        status: 403, 
        headers: { 
          'Content-Type': 'application/json',
          'X-Protocol-Version': PROTOCOL_VERSION,
          'X-Blocked-By': 'CISO_GATE'
        } 
      }
    );
  }
  
  // 2. CLO Veto Kontrolü (RULE_002, RULE_003, RULE_005)
  const cloCheck = checkCLOVeto(req);
  if (cloCheck.vetoed) {
    logAuditEntry(req, 'BLOCKED', cloCheck.reason);
    return new NextResponse(
      JSON.stringify({ 
        error: 'Hukuki veto',
        rule: cloCheck.reason.split(':')[0],
        message: cloCheck.reason 
      }),
      { 
        status: 403, 
        headers: { 
          'Content-Type': 'application/json',
          'X-Protocol-Version': PROTOCOL_VERSION,
          'X-Blocked-By': 'CLO_VETO'
        } 
      }
    );
  }
  
  // 3. Yetki Akışı Kontrolü (Korumalı rotalar için)
  const protectedRouteEntry = Object.entries(PROTECTED_ROUTES).find(
    ([route]) => pathname.startsWith(route)
  );
  
  if (protectedRouteEntry) {
    const [, requiredLevel] = protectedRouteEntry;
    const userRole = extractUserRole(req);
    
    if (!userRole) {
      logAuditEntry(req, 'BLOCKED', 'Kimlik doğrulama gerekli');
      return new NextResponse(
        JSON.stringify({ 
          error: 'Kimlik doğrulama gerekli',
          message: 'Bu kaynağa erişmek için giriş yapmalısınız' 
        }),
        { 
          status: 401, 
          headers: { 
            'Content-Type': 'application/json',
            'X-Protocol-Version': PROTOCOL_VERSION
          } 
        }
      );
    }
    
    const userLevel = getRoleLevel(userRole);
    
    // RULE_001: Panel karar vermez - Panel rolleri belirli endpoint'lere erişemez
    if (userLevel === 6 && pathname.includes('/decision') || pathname.includes('/approve')) {
      logAuditEntry(req, 'BLOCKED', 'RULE_001: Panel karar veremez');
      return new NextResponse(
        JSON.stringify({ 
          error: 'Yetersiz yetki',
          rule: 'RULE_001',
          message: 'Panel rolleri karar verme yetkisine sahip değildir' 
        }),
        { 
          status: 403, 
          headers: { 
            'Content-Type': 'application/json',
            'X-Protocol-Version': PROTOCOL_VERSION
          } 
        }
      );
    }
    
    // Yetki seviyesi kontrolü
    if (userLevel > requiredLevel) {
      logAuditEntry(req, 'BLOCKED', `Yetersiz yetki: ${userRole} (level ${userLevel}) < required (level ${requiredLevel})`);
      return new NextResponse(
        JSON.stringify({ 
          error: 'Yetersiz yetki',
          message: 'Bu kaynağa erişim yetkiniz bulunmamaktadır',
          yourLevel: userLevel,
          requiredLevel: requiredLevel
        }),
        { 
          status: 403, 
          headers: { 
            'Content-Type': 'application/json',
            'X-Protocol-Version': PROTOCOL_VERSION
          } 
        }
      );
    }
  }
  
  // 4. RULE_007: Tek seferde tam erişim yok - Rate limiting ve session kontrolü
  // (Gerçek implementasyonda Redis veya benzeri bir store kullanılır)
  
  // Başarılı istek
  return response;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/panel/:path*',
    '/api/:path*',
    '/assistant/:path*'
  ]
}
