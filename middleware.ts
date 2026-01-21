// middleware.ts
/**
 * QA GATE MIDDLEWARE
 * ==================
 * Sistemin ön kapısı olarak çalışır.
 * Tüm robot/task istekleri bu middleware'den geçer.
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// QA Gate Headers
const QA_GATE_HEADER = 'X-QA-Gate-Status'
const QA_GATE_TASK_ID = 'X-QA-Gate-Task-ID'
const QA_GATE_VALIDATION = 'X-QA-Gate-Validation'

export function middleware(req: NextRequest) {
  const response = NextResponse.next()
  
  // QA Gate bilgilerini header olarak ekle
  response.headers.set(QA_GATE_HEADER, 'active')
  response.headers.set('X-QA-Protocol-Version', '1.0.0')
  
  // Task API istekleri için QA Gate kontrolü
  if (req.nextUrl.pathname.startsWith('/api/chat') || 
      req.nextUrl.pathname.startsWith('/api/task')) {
    
    // QA Gate bypass kontrolü (sadece internal çağrılar için)
    const bypassHeader = req.headers.get('X-QA-Gate-Bypass')
    const internalSecret = process.env.QA_GATE_INTERNAL_SECRET
    
    if (bypassHeader && bypassHeader === internalSecret) {
      response.headers.set(QA_GATE_VALIDATION, 'bypassed')
      return response
    }
    
    // Normal istekler için QA Gate bilgisi ekle
    response.headers.set(QA_GATE_VALIDATION, 'required')
    response.headers.set('X-QA-Required-Blocks', '🎯 GÖREV, ✅ KABUL KRİTERİ, 🔧 DEĞİŞECEK, YÜRÜTME PLANI')
  }
  
  // Dashboard istekleri
  if (req.nextUrl.pathname.startsWith('/dashboard') ||
      req.nextUrl.pathname.startsWith('/panel')) {
    response.headers.set(QA_GATE_VALIDATION, 'dashboard-exempt')
  }
  
  return response
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/assistant/:path*',
    '/panel/:path*',
    '/api/chat/:path*',
    '/api/task/:path*',
    '/api/qa-gate/:path*'
  ]
}
