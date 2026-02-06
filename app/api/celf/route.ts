import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { securityCheck } from '@/lib/robots/security-robot'
import { archiveTaskResult } from '@/lib/robots/data-robot'
import {
  CELF_DIRECTORATES,
  getDirectorAIProviders,
  directorHasVeto,
  type DirectorKey,
} from '@/lib/robots/celf-center'
import { routeToDirector } from '@/lib/robots/ceo-robot'
import { runCelfDirector } from '@/lib/ai/celf-execute'
import { claudeDenet } from '@/lib/ai/claude-denetci'

function isValidDirectorKey(key: string): key is DirectorKey {
  return key in CELF_DIRECTORATES
}

const VALID_DIRECTOR_KEYS = Object.keys(CELF_DIRECTORATES) as DirectorKey[]

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const command = typeof body.command === 'string' ? body.command.trim() : ''
    const directorKeyParam = body.director_key as string | undefined
    const run = body.run === true || body.execute === true
    const userId = typeof body.user_id === 'string' ? body.user_id : (body.user?.id as string | undefined)
    const forwardedFor = req.headers.get('x-forwarded-for') ?? ''
    const ipAddress = forwardedFor.split(',')[0].trim() || req.headers.get('x-real-ip') || undefined

    if (!command) {
      return NextResponse.json({ ok: false, error: 'Komut bos olamaz.' }, { status: 400 })
    }

    const security = await securityCheck({ message: command, userId, ipAddress, logToDb: true })
    if (!security.allowed) {
      return NextResponse.json({ ok: false, error: security.reason ?? 'Yasak komut.', blocked: true }, { status: 403 })
    }

    let directorKey: DirectorKey | null = null
    if (directorKeyParam && isValidDirectorKey(directorKeyParam)) {
      directorKey = directorKeyParam
    } else {
      directorKey = routeToDirector(command)
    }

    if (!directorKey) {
      return NextResponse.json({ ok: false, error: 'Direktorluk belirlenemedi.', suggested_directors: VALID_DIRECTOR_KEYS }, { status: 400 })
    }

    const director = CELF_DIRECTORATES[directorKey]
    const aiProviders = getDirectorAIProviders(directorKey)
    const hasVeto = directorHasVeto(directorKey)

    if (!run) {
      return NextResponse.json({
        ok: true,
        director_key: directorKey,
        director_name: director?.name,
        work: director?.work,
        ai_providers: aiProviders,
        has_veto: hasVeto,
        message: 'Gorev ' + (director?.name ?? directorKey) + ' direktorlugune yonlendirildi. run: true ile calistirin.',
      })
    }

    const supabase = getSupabase()
    let commandId: string | undefined

    try {
      if (supabase) {
        const { data: insertedCmd, error: insertErr } = await supabase
          .from('patron_commands')
          .insert({
            command,
            type: 'celf',
            title: directorKey + ': ' + command.substring(0, 100),
            status: 'pending',
            priority: 'normal',
            source: 'celf_api',
            user_id: userId ?? null,
            output_payload: { processing: true, director_key: directorKey, ai_providers: aiProviders },
          })
          .select('id')
          .single()

        if (!insertErr && insertedCmd?.id) {
          commandId = insertedCmd.id
        }
      }
    } catch (_) {
      // Insert hatası: sessizce devam, CELF sonucu dönecek
    }

    const celfResult = await runCelfDirector(directorKey, command)
    let displayText = celfResult.text ?? (celfResult as { errorReason?: string }).errorReason ?? 'Yanıt oluşturulamadı.'
    const usedProviders = celfResult.text ? [(celfResult as { provider: string }).provider] : []

    if (celfResult.text) {
      const denet = await claudeDenet(
        command,
        directorKey,
        director?.name ?? directorKey,
        displayText,
        celfResult.provider ?? '—'
      )
      if (!denet.approved) {
        try {
          if (supabase && commandId) {
            await supabase.from('patron_commands').update({
              output_payload: {
                processing: false,
                director_key: directorKey,
                director_name: director?.name,
                ai_providers: [...usedProviders, 'CLAUDE_DENET'],
                displayText: displayText,
                denet_rejected: true,
                denet_feedback: denet.feedback,
                denet_revised: denet.revisedText,
              },
              status: 'rejected',
              decision: 'denet_reject',
              decision_at: new Date().toISOString(),
            }).eq('id', commandId)
          }
        } catch (_) {}
        return NextResponse.json({
          ok: false,
          command_id: commandId,
          director_key: directorKey,
          denet_rejected: true,
          feedback: denet.feedback,
          revised_suggestion: denet.revisedText,
          error: 'Claude denetçi reddetti: ' + (denet.feedback ?? 'Belirtilmedi'),
        }, { status: 400 })
      }
      if (denet.revisedText && denet.reason === 'needs_revision') {
        displayText = denet.revisedText
      }
      usedProviders.push('CLAUDE_DENET')
    }

    try {
      await archiveTaskResult({
        taskId: commandId,
        directorKey,
        aiProviders: usedProviders,
        inputCommand: command,
        outputResult: displayText,
        status: celfResult.text ? 'completed' : 'failed',
      })
    } catch (_) {
      // Arşiv hatası: sessizce devam
    }

    if (celfResult.text !== null) {
      try {
        if (supabase && commandId) {
          const outputPayload: Record<string, unknown> = {
            processing: false,
            completed_at: new Date().toISOString(),
            director_key: directorKey,
            director_name: director?.name,
            ai_providers: usedProviders,
            provider: celfResult.provider,
            displayText,
            assignments: [{ director: directorKey, provider_used: celfResult.provider, status: 'done', has_veto: hasVeto }],
          }
          if ('githubPreparedCommit' in celfResult && celfResult.githubPreparedCommit) {
            outputPayload.github_prepared_commit = celfResult.githubPreparedCommit
          }
          if (directorKey === 'CPO' || directorKey === 'CTO') {
            const codeBlocks = extractCodeBlocks(displayText)
            if (codeBlocks.length > 0) outputPayload.code_files = codeBlocks
          }
          await supabase.from('patron_commands').update({ output_payload: outputPayload, status: 'pending' }).eq('id', commandId)
        }
      } catch (_) {
        // Update hatası: sessizce devam, yine de başarılı yanıt dön
      }
      const codeFiles = (directorKey === 'CPO' || directorKey === 'CTO') && displayText ? extractCodeBlocks(displayText) : undefined
      return NextResponse.json({
        ok: true,
        command_id: commandId,
        director_key: directorKey,
        director_name: director?.name,
        ai_providers: usedProviders,
        provider: celfResult.provider,
        text: displayText,
        status: 'pending',
        message: 'Is tamamlandi ve onay kuyruguna eklendi.',
        github_prepared_commit: 'githubPreparedCommit' in celfResult ? celfResult.githubPreparedCommit : undefined,
        code_files: codeFiles?.length ? codeFiles : undefined,
      })
    }

    try {
      if (supabase && commandId) {
        await supabase.from('patron_commands').update({
          output_payload: { processing: false, error_reason: celfResult.errorReason },
          status: 'rejected',
          decision: 'auto_reject',
          decision_at: new Date().toISOString(),
        }).eq('id', commandId)
      }
    } catch (_) {
      // Update hatası: sessizce devam
    }

    return NextResponse.json({ ok: false, command_id: commandId, director_key: directorKey, text: displayText, error: celfResult.errorReason }, { status: 502 })

  } catch (e) {
    const err = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ ok: false, error: 'CELF hatasi', detail: err }, { status: 500 })
  }
}

function extractCodeBlocks(text: string): Array<{ file: string; content: string; language: string }> {
  const blocks: Array<{ file: string; content: string; language: string }> = []
  const regex = /```(\w+)?\s*file="([^"]+)"[^\n]*\n([\s\S]*?)```/g
  let match
  while ((match = regex.exec(text)) !== null) {
    blocks.push({ language: match[1] || 'text', file: match[2], content: match[3].trim() })
  }
  return blocks
}
