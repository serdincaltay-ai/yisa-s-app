'use client'

import { useEffect, useState } from 'react'
import { User, Save, Loader2 } from 'lucide-react'

type Profil = {
  id: string
  name: string
  surname?: string
  email?: string
  phone?: string
  branch?: string
  bio?: string
  license_type?: string
  is_competitive_coach?: boolean
  competitive_experience?: string
  city?: string
  district?: string
  address?: string
}

export default function AntrenorProfilPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [profil, setProfil] = useState<Profil | null>(null)
  const [form, setForm] = useState<Record<string, string | boolean>>({})

  useEffect(() => {
    fetch('/api/antrenor/profil')
      .then((r) => r.json())
      .then((d) => {
        const p = d.profil
        setProfil(p)
        if (p) {
          setForm({
            bio: p.bio ?? '',
            license_type: p.license_type ?? '',
            is_competitive_coach: p.is_competitive_coach ?? false,
            competitive_experience: p.competitive_experience ?? '',
            phone: p.phone ?? '',
            city: p.city ?? '',
            district: p.district ?? '',
            address: p.address ?? '',
          })
        }
      })
      .catch(() => setProfil(null))
      .finally(() => setLoading(false))
  }, [])

  const handleKaydet = async () => {
    setSaving(true)
    setSaved(false)
    try {
      const res = await fetch('/api/antrenor/profil', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const j = await res.json()
      if (j.ok) setSaved(true)
      else alert(j.error ?? 'Kaydetme başarısız')
    } catch {
      alert('Kaydetme başarısız')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      </div>
    )
  }

  return (
    <main className="p-4 space-y-4">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <User className="h-6 w-6 text-cyan-400" strokeWidth={1.5} />
          Profil Düzenleme
        </h1>
        <p className="text-sm text-zinc-400">
          {profil ? `${profil.name} ${profil.surname ?? ''}` : 'Profil bilgilerinizi güncelleyin.'}
        </p>
      </div>

      {!profil ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
          <User className="h-10 w-10 text-zinc-600 mx-auto mb-3" strokeWidth={1.5} />
          <p className="text-sm text-zinc-400">Profil bilgisi bulunamadı. Yöneticinizle iletişime geçin.</p>
        </div>
      ) : (
        <>
          {/* Bio */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
            <h3 className="text-sm font-semibold text-white mb-3">Hakkımda</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-zinc-400">Biyografi</label>
                <textarea
                  value={String(form.bio ?? '')}
                  onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-white text-sm focus:border-cyan-400 focus:outline-none"
                  rows={3}
                  placeholder="Kendinizi kısaca tanıtın..."
                />
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-400">Telefon</label>
                <input
                  type="tel"
                  value={String(form.phone ?? '')}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-white text-sm focus:border-cyan-400 focus:outline-none"
                  placeholder="+90 (5XX) XXX XX XX"
                />
              </div>
            </div>
          </div>

          {/* Lisans & Deneyim */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
            <h3 className="text-sm font-semibold text-white mb-3">Lisans & Deneyim</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-zinc-400">Lisans Türü</label>
                <select
                  value={String(form.license_type ?? '')}
                  onChange={(e) => setForm((f) => ({ ...f, license_type: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-white text-sm focus:border-cyan-400 focus:outline-none"
                >
                  <option value="">Seçiniz</option>
                  <option value="1. Kademe">1. Kademe</option>
                  <option value="2. Kademe">2. Kademe</option>
                  <option value="3. Kademe">3. Kademe</option>
                  <option value="4. Kademe">4. Kademe</option>
                  <option value="5. Kademe">5. Kademe</option>
                  <option value="Yardımcı Antrenör">Yardımcı Antrenör</option>
                  <option value="Stajyer">Stajyer</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-400 flex items-center gap-2">
                  Yarışmacı Sporcu Çalıştırma
                </label>
                <div className="flex gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, is_competitive_coach: true }))}
                    className={`flex-1 rounded-xl py-2.5 text-sm font-medium border transition-all ${
                      form.is_competitive_coach === true
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-zinc-600'
                    }`}
                  >
                    Evet
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, is_competitive_coach: false }))}
                    className={`flex-1 rounded-xl py-2.5 text-sm font-medium border transition-all ${
                      form.is_competitive_coach === false
                        ? 'bg-red-500/20 text-red-400 border-red-500/30'
                        : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-zinc-600'
                    }`}
                  >
                    Hayır
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-400">Yarışmacı Deneyimi</label>
                <textarea
                  value={String(form.competitive_experience ?? '')}
                  onChange={(e) => setForm((f) => ({ ...f, competitive_experience: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-white text-sm focus:border-cyan-400 focus:outline-none"
                  rows={2}
                  placeholder="Yarışmacı çalıştırma deneyiminizi kısaca yazın..."
                />
              </div>
            </div>
          </div>

          {/* Konum */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
            <h3 className="text-sm font-semibold text-white mb-3">Konum Bilgileri</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-zinc-400">İl</label>
                <input
                  type="text"
                  value={String(form.city ?? '')}
                  onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-white text-sm focus:border-cyan-400 focus:outline-none"
                  placeholder="İstanbul"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-400">İlçe</label>
                <input
                  type="text"
                  value={String(form.district ?? '')}
                  onChange={(e) => setForm((f) => ({ ...f, district: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-white text-sm focus:border-cyan-400 focus:outline-none"
                  placeholder="Kadıköy"
                />
              </div>
            </div>
            <div className="mt-3">
              <label className="text-xs font-medium text-zinc-400">Adres</label>
              <input
                type="text"
                value={String(form.address ?? '')}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-white text-sm focus:border-cyan-400 focus:outline-none"
                placeholder="Açık adres"
              />
            </div>
          </div>

          {/* Kaydet */}
          <button
            onClick={handleKaydet}
            disabled={saving}
            className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 px-4 py-3 text-sm font-medium text-zinc-950 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Save className="h-4 w-4" strokeWidth={1.5} />
            {saving ? 'Kaydediliyor...' : saved ? 'Kaydedildi!' : 'Kaydet'}
          </button>
        </>
      )}
    </main>
  )
}
