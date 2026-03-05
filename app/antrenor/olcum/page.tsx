'use client'

import { useEffect, useState } from 'react'
import { Ruler, Loader2 } from 'lucide-react'

type Sporcu = { id: string; name: string; surname?: string; birth_date?: string; gender?: string }

export default function AntrenorOlcumPage() {
  const [sporcular, setSporcular] = useState<Sporcu[]>([])
  const [selected, setSelected] = useState('')
  const [form, setForm] = useState<Record<string, string | number>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [sonuc, setSonuc] = useState<{ analiz?: Array<{ parametre: string; deger: number; seviye: string }>; bransOnerileri?: string[] } | null>(null)

  useEffect(() => {
    fetch('/api/antrenor/olcum')
      .then((r) => r.json())
      .then((d) => setSporcular(d.sporcular ?? []))
      .catch(() => setSporcular([]))
      .finally(() => setLoading(false))
  }, [])

  const handleKaydet = async () => {
    if (!selected) return
    setSaving(true)
    setSonuc(null)
    try {
      const res = await fetch('/api/antrenor/olcum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          athlete_id: selected,
          olcum_tarihi: new Date().toISOString().slice(0, 10),
          ...form,
        }),
      })
      const j = await res.json()
      if (res.ok && j.ok) {
        setSonuc({ analiz: j.analiz ?? [], bransOnerileri: j.bransOnerileri ?? [] })
        setForm({})
      } else {
        alert(j.error ?? 'Kaydetme basarisiz')
      }
    } catch {
      alert('Kaydetme basarisiz')
    } finally {
      setSaving(false)
    }
  }

  const alanlar = [
    { key: 'boy', label: 'Boy (cm)', type: 'number' },
    { key: 'kilo', label: 'Kilo (kg)', type: 'number' },
    { key: 'esneklik', label: 'Esneklik (cm)', type: 'number' },
    { key: 'dikey_sicrama', label: 'Dikey Sicrama (cm)', type: 'number' },
    { key: 'sure_20m', label: '20m Sprint (sn)', type: 'number' },
    { key: 'denge', label: 'Denge (sn)', type: 'number' },
    { key: 'koordinasyon', label: 'Koordinasyon (puan)', type: 'number' },
    { key: 'kuvvet', label: 'Kuvvet (puan)', type: 'number' },
    { key: 'dayaniklilik', label: 'Dayaniklilik (puan)', type: 'number' },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      </div>
    )
  }

  return (
    <main className="p-4 space-y-4">
      <h1 className="text-xl font-bold text-white flex items-center gap-2">
        <Ruler className="h-6 w-6 text-cyan-400" strokeWidth={1.5} />
        Olcum Girisi
      </h1>

      {/* Sporcu Secimi */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
        <h3 className="text-sm font-semibold text-white mb-2">Sporcu Secimi</h3>
        <p className="text-xs text-zinc-500 mb-3">Olcum yapilacak sporcuyu secin</p>
        <select
          value={selected}
          onChange={(e) => { setSelected(e.target.value); setSonuc(null) }}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-white text-sm focus:border-cyan-400 focus:outline-none"
        >
          <option value="">Sporcu secin</option>
          {sporcular.map((s) => (
            <option key={s.id} value={s.id}>{s.name} {s.surname ?? ''}</option>
          ))}
        </select>
      </div>

      {/* Olcum Degerleri */}
      {selected && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
          <h3 className="text-sm font-semibold text-white mb-2">Olcum Degerleri</h3>
          <p className="text-xs text-zinc-500 mb-3">Tum parametreleri girin (opsiyonel alanlar bos birakilabilir)</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {alanlar.map((a) => (
              <div key={a.key}>
                <label className="text-xs font-medium text-zinc-400">{a.label}</label>
                <input
                  type={a.type}
                  value={form[a.key] ?? ''}
                  onChange={(e) => setForm((f) => ({ ...f, [a.key]: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-white text-sm focus:border-cyan-400 focus:outline-none"
                />
              </div>
            ))}
          </div>
          <div className="mt-3">
            <label className="text-xs font-medium text-zinc-400">Postur Notu</label>
            <textarea
              value={form.postur_notu ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, postur_notu: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-white text-sm focus:border-cyan-400 focus:outline-none"
              rows={2}
            />
          </div>
          <div className="mt-3">
            <label className="text-xs font-medium text-zinc-400">Genel Degerlendirme</label>
            <textarea
              value={form.genel_degerlendirme ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, genel_degerlendirme: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-white text-sm focus:border-cyan-400 focus:outline-none"
              rows={2}
            />
          </div>
          <button
            onClick={handleKaydet}
            disabled={saving}
            className="w-full mt-4 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 px-4 py-3 text-sm font-medium text-zinc-950 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all disabled:opacity-50"
          >
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      )}

      {/* Analiz Sonucu */}
      {sonuc && (
        <div className="bg-zinc-900 border border-cyan-400/20 rounded-2xl p-4 shadow-[0_0_20px_rgba(34,211,238,0.1)]">
          <h3 className="text-sm font-semibold text-white mb-3">Analiz Sonucu</h3>
          {sonuc.analiz && sonuc.analiz.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {sonuc.analiz.map((a) => (
                <span key={a.parametre} className="rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs px-3 py-1">
                  {a.parametre}: {a.deger} — {a.seviye}
                </span>
              ))}
            </div>
          )}
          {sonuc.bransOnerileri && sonuc.bransOnerileri.length > 0 && (
            <div>
              <p className="font-medium text-white text-sm mb-1">Brans Uygunluk Onerisi</p>
              <p className="text-sm text-zinc-400">{sonuc.bransOnerileri.join(', ')}</p>
            </div>
          )}
        </div>
      )}
    </main>
  )
}
