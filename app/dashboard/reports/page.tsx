'use client'

export default function ReportsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Raporlar</h1>
        <p className="text-slate-400">CDO direktörlüğü — analiz, rapor, dashboard.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-2">Gelir Raporu</h2>
          <p className="text-slate-500 text-sm">Aylık/yıllık gelir özeti — CFO verisi.</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-2">Kullanıcı / Tesis</h2>
          <p className="text-slate-500 text-sm">Üye, tesis, franchise sayıları.</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-2">Operasyon</h2>
          <p className="text-slate-500 text-sm">COO süreç takibi, kaynak kullanımı.</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-2">Güvenlik / Audit</h2>
          <p className="text-slate-500 text-sm">CISO log, erişim raporları.</p>
        </div>
      </div>
    </div>
  )
}
