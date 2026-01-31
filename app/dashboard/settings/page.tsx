'use client'

import { FORBIDDEN_FOR_AI, REQUIRE_PATRON_APPROVAL } from '@/lib/security/patron-lock'
import {
  SIBER_GUVENLIK_KURALLARI,
  logAlaniDenetlenebilir,
} from '@/lib/security/siber-guvenlik'
import {
  VERI_ARSIVLEME_KURALLARI,
  saklamaSuresi,
} from '@/lib/archiving/veri-arsivleme'
import { Shield, Archive } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Ayarlar</h1>
        <p className="text-slate-400">Güvenlik kilitleri, Patron onayı — .env dokunulmaz.</p>
      </div>

      <div className="space-y-6">
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">AI için Yasak Alanlar</h2>
          <div className="flex flex-wrap gap-2">
            {FORBIDDEN_FOR_AI.map((term) => (
              <span
                key={term}
                className="px-3 py-1 rounded-lg bg-red-500/10 text-red-400 text-sm border border-red-500/20"
              >
                {term}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Patron Onayı Gerektiren İşlemler</h2>
          <div className="flex flex-wrap gap-2">
            {REQUIRE_PATRON_APPROVAL.map((term) => (
              <span
                key={term}
                className="px-3 py-1 rounded-lg bg-amber-500/10 text-amber-400 text-sm border border-amber-500/20"
              >
                {term}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
            <Shield size={20} className="text-amber-400" />
            Siber Güvenlik (Katman 2)
          </h2>
          <p className="text-slate-400 text-sm mb-3">
            Log alanları: {SIBER_GUVENLIK_KURALLARI.LOG_ALANLARI.join(', ')}. Audit anahtarları:{' '}
            {SIBER_GUVENLIK_KURALLARI.AUDIT_KEYWORDS.slice(0, 4).join(', ')}…
          </p>
          <div className="flex flex-wrap gap-2">
            {SIBER_GUVENLIK_KURALLARI.LOG_ALANLARI.map((a) => (
              <span
                key={a}
                className="px-3 py-1 rounded-lg bg-slate-700/50 text-slate-300 text-sm"
              >
                {a} {logAlaniDenetlenebilir(a) ? '✓' : ''}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
            <Archive size={20} className="text-amber-400" />
            Veri Arşivleme (Katman 3)
          </h2>
          <p className="text-slate-400 text-sm mb-3">
            Arşivlenebilir: {VERI_ARSIVLEME_KURALLARI.ARSIVLENEBILIR.join(', ')}. Format:{' '}
            {VERI_ARSIVLEME_KURALLARI.FORMAT}.
          </p>
          <div className="flex flex-wrap gap-2">
            {VERI_ARSIVLEME_KURALLARI.ARSIVLENEBILIR.map((t) => (
              <span key={t} className="px-3 py-1 rounded-lg bg-slate-700/50 text-slate-300 text-sm">
                {t} → {saklamaSuresi(t)} gün
              </span>
            ))}
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <p className="text-slate-400">
            <strong className="text-white">.env / .env.local / API key:</strong> Değiştirilmez.
            Deploy ve commit sadece Patron onayı ile.
          </p>
        </div>
      </div>
    </div>
  )
}
