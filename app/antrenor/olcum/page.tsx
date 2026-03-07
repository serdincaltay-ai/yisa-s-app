'use client'

import { useEffect, useState } from 'react'
import { Ruler, Loader2, AlertTriangle, Activity, CheckCircle2 } from 'lucide-react'

type Sporcu = { id: string; name: string; surname?: string; birth_date?: string; gender?: string }

type PosturDeg = {
  toplam_skor: number
  noktalar: { bolge: string; skor: number }[]
  risk_seviyesi: 'normal' | 'dikkat' | 'risk'
  aciklama: string
}

type SaglikUyarisi = { tip: string; seviye: 'bilgi' | 'dikkat' | 'uyari'; mesaj: string }

type PhvTahmini = {
  maturity_offset: number
  tahmini_phv_yasi: number
  durum: string
  aciklama: string
}

type AnalizSonuc = {
  analiz?: Array<{ parametre: string; deger: number; durum: string; yuzdelik: number }>
  bransOnerileri?: string[]
  oneri?: string
  posturDegerlendirme?: PosturDeg | null
  saglikUyarilari?: SaglikUyarisi[]
  phvTahmini?: PhvTahmini | null
}

// Beighton testi 9 madde
const beightonMaddeler = [
  'Sol başparmak ön kola değiyor',
  'Sağ başparmak ön kola değiyor',
  'Sol dirsek >10° hiperekstansiyon',
  'Sağ dirsek >10° hiperekstansiyon',
  'Sol diz >10° hiperekstansiyon',
  'Sağ diz >10° hiperekstansiyon',
  'Sol 5. parmak >90° dorsifleksiyon',
  'Sağ 5. parmak >90° dorsifleksiyon',
  'Elleri yere koyarak öne eğilme',
]

const posturBolgeleri = [
  { key: 'postur_omuz', label: 'Omuz' },
  { key: 'postur_sirt', label: 'Sırt' },
  { key: 'postur_kalca', label: 'Kalça' },
  { key: 'postur_diz', label: 'Diz' },
  { key: 'postur_ayak', label: 'Ayak' },
  { key: 'postur_bas', label: 'Baş' },
]

const duzTabanSecenekler = [
  { value: 0, label: 'Normal', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  { value: 1, label: 'Hafif', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  { value: 2, label: 'Orta', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  { value: 3, label: 'Belirgin', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
]

export default function AntrenorOlcumPage() {
  const [sporcular, setSporcular] = useState<Sporcu[]>([])
  const [selected, setSelected] = useState('')
  const [form, setForm] = useState<Record<string, string | number>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [sonuc, setSonuc] = useState<AnalizSonuc | null>(null)
  const [activeTab, setActiveTab] = useState<'temel' | 'detayli'>('temel')

  // Beighton checkbox state
  const [beightonChecks, setBeightonChecks] = useState<boolean[]>(new Array(9).fill(false))

  useEffect(() => {
    fetch('/api/antrenor/olcum')
      .then((r) => r.json())
      .then((d) => setSporcular(d.sporcular ?? []))
      .catch(() => setSporcular([]))
      .finally(() => setLoading(false))
  }, [])

  // Beighton skor hesapla
  useEffect(() => {
    const skor = beightonChecks.filter(Boolean).length
    setForm((f) => ({ ...f, beighton_skoru: skor }))
  }, [beightonChecks])

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
        setSonuc({
          analiz: j.analiz ?? [],
          bransOnerileri: j.bransOnerileri ?? [],
          oneri: j.oneri ?? '',
          posturDegerlendirme: j.postur_degerlendirme ?? null,
          saglikUyarilari: j.saglik_uyarilari ?? [],
          phvTahmini: j.phv_tahmini ?? null,
        })
        setForm({})
        setBeightonChecks(new Array(9).fill(false))
      } else {
        alert(j.error ?? 'Kaydetme başarısız')
      }
    } catch {
      alert('Kaydetme başarısız')
    } finally {
      setSaving(false)
    }
  }

  const temelAlanlar = [
    { key: 'boy', label: 'Boy (cm)', type: 'number' },
    { key: 'kilo', label: 'Kilo (kg)', type: 'number' },
    { key: 'esneklik', label: 'Esneklik (cm)', type: 'number' },
    { key: 'dikey_sicrama', label: 'Dikey Sıçrama (cm)', type: 'number' },
    { key: 'sure_20m', label: '20m Sprint (sn)', type: 'number' },
    { key: 'denge', label: 'Denge (sn)', type: 'number' },
    { key: 'koordinasyon', label: 'Koordinasyon (puan)', type: 'number' },
    { key: 'kuvvet', label: 'Kuvvet (puan)', type: 'number' },
    { key: 'dayaniklilik', label: 'Dayanıklılık (puan)', type: 'number' },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      </div>
    )
  }

  const durumRenk = (durum: string) => {
    if (durum === 'yuksek') return 'border-green-500/40 text-green-400'
    if (durum === 'dusuk') return 'border-red-500/40 text-red-400'
    return 'border-zinc-700 text-zinc-300'
  }

  const uyariRenk = (seviye: string) => {
    if (seviye === 'uyari') return 'bg-red-500/10 border-red-500/30 text-red-400'
    if (seviye === 'dikkat') return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
    return 'bg-blue-500/10 border-blue-500/30 text-blue-400'
  }

  return (
    <main className="p-4 space-y-4">
      <h1 className="text-xl font-bold text-white flex items-center gap-2">
        <Ruler className="h-6 w-6 text-cyan-400" strokeWidth={1.5} />
        Ölçüm Girişi
      </h1>

      {/* Sporcu Seçimi */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
        <h3 className="text-sm font-semibold text-white mb-2">Sporcu Seçimi</h3>
        <p className="text-xs text-zinc-500 mb-3">Ölçüm yapılacak sporcuyu seçin</p>
        <select
          value={selected}
          onChange={(e) => { setSelected(e.target.value); setSonuc(null) }}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-white text-sm focus:border-cyan-400 focus:outline-none"
        >
          <option value="">Sporcu seçin</option>
          {sporcular.map((s) => (
            <option key={s.id} value={s.id}>{s.name} {s.surname ?? ''}</option>
          ))}
        </select>
      </div>

      {/* Sekme Seçimi */}
      {selected && (
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('temel')}
            className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
              activeTab === 'temel'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-700'
            }`}
          >
            Temel Ölçüm
          </button>
          <button
            onClick={() => setActiveTab('detayli')}
            className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
              activeTab === 'detayli'
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-700'
            }`}
          >
            Detaylı Değerlendirme
          </button>
        </div>
      )}

      {/* Temel Ölçüm Formu */}
      {selected && activeTab === 'temel' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
          <h3 className="text-sm font-semibold text-white mb-2">Temel Ölçüm Değerleri</h3>
          <p className="text-xs text-zinc-500 mb-3">10 temel parametreyi girin (opsiyonel alanlar boş bırakılabilir)</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {temelAlanlar.map((a) => (
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
            <label className="text-xs font-medium text-zinc-400">Genel Değerlendirme</label>
            <textarea
              value={form.genel_degerlendirme ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, genel_degerlendirme: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-white text-sm focus:border-cyan-400 focus:outline-none"
              rows={2}
            />
          </div>
        </div>
      )}

      {/* Detaylı Değerlendirme Formu */}
      {selected && activeTab === 'detayli' && (
        <div className="space-y-4">
          {/* Postür 6 Nokta Kontrolü */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
            <h3 className="text-sm font-semibold text-white mb-2">Postür 6 Nokta Kontrolü</h3>
            <p className="text-xs text-zinc-500 mb-3">Her bölge için 0 (normal) – 3 (belirgin sapma) arası puan verin</p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {posturBolgeleri.map((b) => (
                <div key={b.key}>
                  <label className="text-xs font-medium text-zinc-400">{b.label}</label>
                  <div className="flex gap-1 mt-1">
                    {[0, 1, 2, 3].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, [b.key]: val }))}
                        className={`flex-1 rounded-lg py-2 text-xs font-medium transition-all border ${
                          Number(form[b.key]) === val
                            ? val === 0
                              ? 'bg-green-500/20 text-green-400 border-green-500/40'
                              : val === 1
                                ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40'
                                : val === 2
                                  ? 'bg-orange-500/20 text-orange-400 border-orange-500/40'
                                  : 'bg-red-500/20 text-red-400 border-red-500/40'
                            : 'bg-zinc-800 text-zinc-500 border-zinc-700 hover:border-zinc-600'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-2 text-xs text-zinc-500">
              Toplam Postür Skoru: <span className="text-white font-medium">
                {posturBolgeleri.reduce((t, b) => t + (Number(form[b.key]) || 0), 0)}/18
              </span>
            </div>
          </div>

          {/* Beighton Hipermobilite Testi */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
            <h3 className="text-sm font-semibold text-white mb-2">Beighton Hipermobilite Testi</h3>
            <p className="text-xs text-zinc-500 mb-3">Pozitif olan maddeleri işaretleyin (4+ = hipermobil)</p>
            <div className="space-y-2">
              {beightonMaddeler.map((madde, i) => (
                <label key={i} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={beightonChecks[i]}
                    onChange={() => {
                      const yeni = [...beightonChecks]
                      yeni[i] = !yeni[i]
                      setBeightonChecks(yeni)
                    }}
                    className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-cyan-400 focus:ring-cyan-400 focus:ring-offset-0"
                  />
                  <span className="text-sm text-zinc-400 group-hover:text-zinc-300">{madde}</span>
                </label>
              ))}
            </div>
            <div className="mt-3 text-xs text-zinc-500">
              Beighton Skoru: <span className={`font-medium ${beightonChecks.filter(Boolean).length >= 4 ? 'text-yellow-400' : 'text-white'}`}>
                {beightonChecks.filter(Boolean).length}/9
              </span>
              {beightonChecks.filter(Boolean).length >= 4 && (
                <span className="ml-2 text-yellow-400">— Hipermobil</span>
              )}
            </div>
          </div>

          {/* Sağ/Sol Güç Karşılaştırması */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
            <h3 className="text-sm font-semibold text-white mb-2">Sağ/Sol Güç Karşılaştırması</h3>
            <p className="text-xs text-zinc-500 mb-3">Asimetri değerlendirmesi (0-10 arası puan)</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-zinc-400">Asimetri Skoru (0-10)</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={form.asimetri_skoru ?? ''}
                  onChange={(e) => setForm((f) => ({ ...f, asimetri_skoru: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-white text-sm focus:border-cyan-400 focus:outline-none"
                  placeholder="0 = eşit güç, 10 = çok fark"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-400">Baskın Taraf</label>
                <select
                  value={form.baskin_taraf ?? ''}
                  onChange={(e) => setForm((f) => ({ ...f, baskin_taraf: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-white text-sm focus:border-cyan-400 focus:outline-none"
                >
                  <option value="">Seçin</option>
                  <option value="esit">Eşit</option>
                  <option value="sag_hafif">Hafif Sağ</option>
                  <option value="sol_hafif">Hafif Sol</option>
                  <option value="sag_belirgin">Belirgin Sağ</option>
                  <option value="sol_belirgin">Belirgin Sol</option>
                </select>
              </div>
            </div>
          </div>

          {/* Düz Taban Derecesi */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
            <h3 className="text-sm font-semibold text-white mb-2">Düz Taban Derecesi</h3>
            <p className="text-xs text-zinc-500 mb-3">Ayak ark yapısını değerlendirin</p>
            <div className="grid grid-cols-4 gap-2">
              {duzTabanSecenekler.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, duz_taban_derecesi: s.value }))}
                  className={`rounded-xl py-3 text-xs font-medium transition-all border ${
                    Number(form.duz_taban_derecesi) === s.value
                      ? s.color
                      : 'bg-zinc-800 text-zinc-500 border-zinc-700 hover:border-zinc-600'
                  }`}
                >
                  {s.value} — {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Oturma Yüksekliği (PHV) */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
            <h3 className="text-sm font-semibold text-white mb-2">PHV Hesaplama Verileri</h3>
            <p className="text-xs text-zinc-500 mb-3">Büyüme hızı tahmini için oturma yüksekliği gereklidir (Mirwald 2002)</p>
            <div>
              <label className="text-xs font-medium text-zinc-400">Oturma Yüksekliği (cm)</label>
              <input
                type="number"
                value={form.oturma_yuksekligi ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, oturma_yuksekligi: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-white text-sm focus:border-cyan-400 focus:outline-none"
                placeholder="Oturarak ölçülen boy (cm)"
              />
            </div>
          </div>
        </div>
      )}

      {/* Kaydet Butonu */}
      {selected && (
        <button
          onClick={handleKaydet}
          disabled={saving}
          className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 px-4 py-3 text-sm font-medium text-zinc-950 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all disabled:opacity-50"
        >
          {saving ? 'Kaydediliyor...' : 'Kaydet ve Analiz Et'}
        </button>
      )}

      {/* Analiz Sonucu */}
      {sonuc && (
        <div className="space-y-4">
          {/* Genel Öneri */}
          {sonuc.oneri && (
            <div className="bg-zinc-900 border border-cyan-400/20 rounded-2xl p-4 shadow-[0_0_20px_rgba(34,211,238,0.1)]">
              <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                <Activity className="h-4 w-4 text-cyan-400" />
                Genel Değerlendirme
              </h3>
              <p className="text-sm text-zinc-300">{sonuc.oneri}</p>
            </div>
          )}

          {/* Parametre Analizi */}
          {sonuc.analiz && sonuc.analiz.length > 0 && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
              <h3 className="text-sm font-semibold text-white mb-3">Parametre Analizi</h3>
              <div className="flex flex-wrap gap-2">
                {sonuc.analiz.map((a) => (
                  <span
                    key={a.parametre}
                    className={`rounded-full bg-zinc-800 border text-xs px-3 py-1 ${durumRenk(a.durum)}`}
                  >
                    {a.parametre}: {a.deger} ({a.yuzdelik}%)
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Branş Önerileri */}
          {sonuc.bransOnerileri && sonuc.bransOnerileri.length > 0 && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
              <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                Branş Uygunluk Önerisi
              </h3>
              <div className="flex flex-wrap gap-2">
                {sonuc.bransOnerileri.map((b) => (
                  <span key={b} className="rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs px-3 py-1">
                    {b}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Postür Değerlendirmesi */}
          {sonuc.posturDegerlendirme && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
              <h3 className="text-sm font-semibold text-white mb-2">Postür Değerlendirmesi</h3>
              <div className={`rounded-xl p-3 border text-sm ${
                sonuc.posturDegerlendirme.risk_seviyesi === 'normal'
                  ? 'bg-green-500/10 border-green-500/30 text-green-400'
                  : sonuc.posturDegerlendirme.risk_seviyesi === 'dikkat'
                    ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
                    : 'bg-red-500/10 border-red-500/30 text-red-400'
              }`}>
                <p className="font-medium mb-1">Skor: {sonuc.posturDegerlendirme.toplam_skor}/18 — {sonuc.posturDegerlendirme.risk_seviyesi.toUpperCase()}</p>
                <p className="text-xs opacity-80">{sonuc.posturDegerlendirme.aciklama}</p>
              </div>
              {sonuc.posturDegerlendirme.noktalar.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {sonuc.posturDegerlendirme.noktalar.map((n) => (
                    <span key={n.bolge} className="text-xs bg-zinc-800 border border-zinc-700 rounded-full px-2 py-1 text-zinc-400">
                      {n.bolge}: {n.skor}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PHV Tahmini */}
          {sonuc.phvTahmini && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
              <h3 className="text-sm font-semibold text-white mb-2">PHV / Büyüme Tahmini (Mirwald 2002)</h3>
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-xs text-zinc-500">Maturity Offset</p>
                    <p className="text-purple-400 font-medium">{sonuc.phvTahmini.maturity_offset} yıl</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Tahmini PHV Yaşı</p>
                    <p className="text-purple-400 font-medium">{sonuc.phvTahmini.tahmini_phv_yasi} yaş</p>
                  </div>
                </div>
                <p className="text-xs text-zinc-400 mt-2">{sonuc.phvTahmini.aciklama}</p>
              </div>
            </div>
          )}

          {/* Sağlık Uyarıları */}
          {sonuc.saglikUyarilari && sonuc.saglikUyarilari.length > 0 && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
              <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-400" />
                Sağlık Uyarıları
              </h3>
              <div className="space-y-2">
                {sonuc.saglikUyarilari.map((u, i) => (
                  <div key={i} className={`rounded-xl p-3 border text-xs ${uyariRenk(u.seviye)}`}>
                    <span className="font-medium uppercase">{u.seviye}</span>: {u.mesaj}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  )
}
