/**
 * CELF API - Direktörlük görevi çalıştırma
 * POST: director_key + command → yönlendirme bilgisi veya (run: true ile) gerçek AI çalıştırma.
 * run: true → runCelfDirector çağrılır, API'ler burada çalışır (V0, Cursor, GitHub, Claude, GPT, Gemini, Together).
 */

import { NextRequest, NextResponse } from 'next/server'
import { securityCheck } from '@/lib/robots/security-robot'
import {
  CELF_DIRECTORATES,
  getDirectorAIProviders,
  directorHasVeto,
  type DirectorKey,
} from '@/lib/robots/celf-center'
import { routeToDirector } from '@/lib/robots/ceo-robot'
import { runCelfDirector } from '@/lib/ai/celf-execute'

const VALID_DIRECTOR_KEYS = Object.keys(CELF_DIRECTORATES) as DirectorKey[]

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const command = typeof body.command === 'string' ? body.command : (body.command ?? '')
    const directorKeyParam = body.director_key as string | undefined
    const run = body.run === true || body.execute === true
    const userId = typeof body.user_id === 'string' ? body.user_id : (body.user?.id as string | undefined)
    const ipAddress = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? undefined

    const security = await securityCheck({
      message: command,
      userId,
      ipAddress,
      logToDb: true,
    })
    if (!security.allowed) {
      return NextResponse.json(
        { error: security.reason ?? 'Yasak komut.', blocked: true },
        { status: 403 }
      )
    }

    const directorKey: DirectorKey | null =
      directorKeyParam && VALID_DIRECTOR_KEYS.includes(directorKeyParam as DirectorKey)
        ? (directorKeyParam as DirectorKey)
        : routeToDirector(command)

    if (!directorKey) {
      return NextResponse.json({
        ok: false,
        error: 'Direktörlük belirlenemedi. Komutta anahtar kelime kullanın.',
        suggested_directors: VALID_DIRECTOR_KEYS,
      })
    }

    const director = CELF_DIRECTORATES[directorKey]
    const aiProviders = getDirectorAIProviders(directorKey)
    const hasVeto = directorHasVeto(directorKey)

    // Sadece yönlendirme bilgisi (varsayılan)
    if (!run) {
      return NextResponse.json({
        ok: true,
        director_key: directorKey,
        director_name: director?.name,
        work: director?.work,
        ai_providers: aiProviders,
        has_veto: hasVeto,
        message: `Görev ${director?.name ?? directorKey} direktörlüğüne yönlendirildi. AI: ${aiProviders.join(', ')}. Gerçek çalıştırma için body'de run: true gönderin.`,
      })
    }

    // run: true → API'ler burada çalışır (runCelfDirector)
    const celfResult = await runCelfDirector(directorKey, command)
    if (celfResult.text !== null) {
      return NextResponse.json({
        ok: true,
        director_key: directorKey,
        director_name: director?.name,
        ai_providers: aiProviders,
        provider: celfResult.provider,
        text: celfResult.text,
        github_prepared_commit: 'githubPreparedCommit' in celfResult ? celfResult.githubPreparedCommit : undefined,
      })
    }
    return NextResponse.json({
      ok: false,
      director_key: directorKey,
      error: celfResult.errorReason,
    }, { status: 502 })
  } catch (e) {
    const err = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: 'CELF hatası', detail: err }, { status: 500 })
  }
}
