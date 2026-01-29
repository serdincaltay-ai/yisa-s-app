'use client'

import { CELF_DIRECTORATES, CELF_DIRECTORATE_KEYS } from '@/lib/robots/celf-center'
import { CEO_RULES } from '@/lib/robots/ceo-robot'
import { COO_OPERATIONS } from '@/lib/robots/coo-robot'
import { VITRIN_ACTIONS } from '@/lib/robots/yisas-vitrin'
import { ROBOT_HIERARCHY } from '@/lib/robots/hierarchy'
import { FLOW_DESCRIPTION } from '@/lib/assistant/task-flow'
import { QUALITY_FLOW } from '@/lib/ai-router'
import { Bot, Shield, Zap, GitBranch, Workflow } from 'lucide-react'

export default function RobotsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Robot Yönetimi</h1>
        <p className="text-slate-400">7 katmanlı hiyerarşi, CELF 12 direktörlük, CEO, COO, YİSA-S Vitrin.</p>
      </div>

      <div className="space-y-8">
        {/* 7 Katman Görsel Ağaç (Talimat Bölüm 1.1) */}
        <section className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
            <GitBranch size={20} className="text-amber-400" />
            7 Katman Görsel Ağaç
          </h2>
          <div className="font-mono text-sm text-slate-300 bg-slate-900/80 rounded-xl p-5 border border-slate-700 overflow-x-auto">
            <div className="space-y-0">
              {ROBOT_HIERARCHY.map((node, i) => (
                <div key={node.layer} className="flex items-start gap-2">
                  <span className="text-slate-500 shrink-0">
                    {i < ROBOT_HIERARCHY.length - 1 ? '│' : '└─'}
                  </span>
                  <div className="min-w-0">
                    <span className={node.layer === 0 ? 'text-amber-400 font-semibold' : 'text-white'}>
                      KATMAN {node.layer}: {node.name}
                    </span>
                    {node.detail && (
                      <span className="text-slate-500 ml-2">— {node.detail}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Robot Hiyerarşisi Liste */}
        <section className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
            <GitBranch size={20} className="text-amber-400" />
            Robot Hiyerarşisi (Katman 0–7)
          </h2>
          <div className="space-y-2">
            {ROBOT_HIERARCHY.map((node) => (
              <div
                key={node.layer}
                className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${
                  node.layer === 0
                    ? 'bg-amber-500/10 border-amber-500/30'
                    : 'bg-slate-900/80 border-slate-700'
                }`}
              >
                <span className="text-xs font-mono text-slate-500 w-16 shrink-0">Katman {node.layer}</span>
                <div className="min-w-0">
                  <span className="font-medium text-white">{node.name}</span>
                  {node.detail && (
                    <p className="text-sm text-slate-400 mt-0.5">{node.detail}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* İş akışı — Seçenek 2 + FLOW_DESCRIPTION */}
        <section className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
            <Workflow size={20} className="text-amber-400" />
            Asistan İş Akışı (Seçenek 2: Kalite Optimize)
          </h2>
          <p className="text-slate-400 text-sm mb-2">
            {QUALITY_FLOW.name} — Kalite: {QUALITY_FLOW.quality} — Tahmini: {QUALITY_FLOW.monthlyCost}
          </p>
          <pre className="text-xs text-slate-300 whitespace-pre-wrap font-mono bg-slate-900/80 rounded-xl p-4 border border-slate-700 overflow-x-auto">
            {FLOW_DESCRIPTION}
          </pre>
        </section>
        <section className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
            <Bot size={20} className="text-amber-400" />
            CELF Merkez — 12 Direktörlük
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CELF_DIRECTORATE_KEYS.map((key) => {
              const d = CELF_DIRECTORATES[key]
              return (
                <div
                  key={key}
                  className="bg-slate-900/80 border border-slate-700 rounded-xl p-4"
                >
                  <p className="font-medium text-amber-400">{key}</p>
                  <p className="text-slate-300 text-sm">{d.name}</p>
                  <p className="text-slate-500 text-xs mt-1">{d.tasks.join(', ')}</p>
                </div>
              )
            })}
          </div>
        </section>

        <section className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
            <Shield size={20} className="text-amber-400" />
            CEO Robot — Deploy / Commit Kuralları
          </h2>
          <div className="flex flex-wrap gap-4">
            <div className="px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-700">
              <span className="text-slate-400">Otomatik Deploy: </span>
              <span className={CEO_RULES.DEPLOY_RULES.autoDeployAllowed ? 'text-emerald-400' : 'text-red-400'}>
                {CEO_RULES.DEPLOY_RULES.autoDeployAllowed ? 'Açık' : 'Kapalı'}
              </span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-700">
              <span className="text-slate-400">Otomatik Commit: </span>
              <span className={CEO_RULES.DEPLOY_RULES.autoCommitAllowed ? 'text-emerald-400' : 'text-red-400'}>
                {CEO_RULES.DEPLOY_RULES.autoCommitAllowed ? 'Açık' : 'Kapalı'}
              </span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-700">
              <span className="text-slate-400">Patron Onayı: </span>
              <span className="text-amber-400">Zorunlu</span>
            </div>
          </div>
        </section>

        <section className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
            <Zap size={20} className="text-amber-400" />
            COO Operasyon Tipleri
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(COO_OPERATIONS).map(([key, config]) => {
              if (key === 'unknown') return null
              return (
                <div key={key} className="bg-slate-900/80 border border-slate-700 rounded-xl p-4">
                  <p className="font-medium text-slate-200">{config.label}</p>
                  <p className="text-slate-500 text-xs">{config.keywords.join(', ')}</p>
                </div>
              )
            })}
          </div>
        </section>

        <section className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">YİSA-S Vitrin Aksiyonları</h2>
          <div className="flex flex-wrap gap-3">
            {Object.entries(VITRIN_ACTIONS).map(([key, config]) => {
              if (key === 'unknown') return null
              return (
                <div key={key} className="px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-700">
                  <span className="text-slate-200">{config.label}</span>
                  <span className="text-slate-500 text-xs ml-2">({config.keywords.join(', ')})</span>
                </div>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}
