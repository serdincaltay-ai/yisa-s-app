"use client"

import { useState } from "react"
import {
  Instagram,
  MessageCircle,
  Facebook,
  Copy,
  Check,
  Eye,
  Sparkles,
} from "lucide-react"
import {
  ALL_DEFAULT_TEMPLATES,
  fillTemplate,
  type Platform,
  type TemplateVariables,
} from "@/lib/social-media-robot"

/* ================================================================
   Sosyal Medya Robotu — Instagram / WhatsApp / Facebook
   Tenant-branded icerik olusturma
   ================================================================ */

const PLATFORMS: { key: Platform; label: string; icon: typeof Instagram; color: string }[] = [
  { key: "instagram", label: "Instagram", icon: Instagram, color: "text-pink-400" },
  { key: "whatsapp", label: "WhatsApp", icon: MessageCircle, color: "text-green-400" },
  { key: "facebook", label: "Facebook", icon: Facebook, color: "text-blue-400" },
]

const DEFAULT_VARS: TemplateVariables = {
  tenant_name: "BJK Tuzla Cimnastik",
  branch_name: "Tuzla Şubesi",
  phone: "0533 249 19 03",
  address: "Tuzla, İstanbul",
  date: "1 Mart 2026",
  time: "14:00",
  sport: "cimnastik",
  price: "2.500 ₺",
}

export default function SosyalMedyaRobotPage() {
  const [activePlatform, setActivePlatform] = useState<Platform>("instagram")
  const [vars, setVars] = useState<TemplateVariables>(DEFAULT_VARS)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [previewIdx, setPreviewIdx] = useState<number | null>(null)

  const filtered = ALL_DEFAULT_TEMPLATES.filter(
    (t) => t.platform === activePlatform
  )

  function handleCopy(content: string, idx: number) {
    const filled = fillTemplate(content, vars)
    navigator.clipboard.writeText(filled).catch(() => {})
    setCopiedId(`${activePlatform}-${idx}`)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-4 md:p-8 font-[Inter]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Sparkles className="w-7 h-7 text-cyan-400" />
        <div>
          <h1 className="text-2xl font-bold">Sosyal Medya Robotu</h1>
          <p className="text-sm text-zinc-400">
            Instagram, WhatsApp, Facebook şablonları — tenant-branded içerik
          </p>
        </div>
      </div>

      {/* Platform Tabs */}
      <div className="flex gap-2 mb-6">
        {PLATFORMS.map((p) => (
          <button
            key={p.key}
            onClick={() => {
              setActivePlatform(p.key)
              setPreviewIdx(null)
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activePlatform === p.key
                ? "bg-zinc-800 text-white border border-zinc-700"
                : "bg-zinc-900 text-zinc-400 hover:text-white border border-transparent"
            }`}
          >
            <p.icon className={`w-4 h-4 ${p.color}`} />
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Variables Panel */}
        <div className="lg:col-span-1 bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-cyan-400 mb-4">
            Değişkenler
          </h3>
          <div className="space-y-3">
            {Object.entries(vars).map(([key, value]) => (
              <div key={key}>
                <label className="text-xs text-zinc-500 block mb-1">
                  {`{{${key}}}`}
                </label>
                <input
                  type="text"
                  value={value || ""}
                  onChange={(e) =>
                    setVars((prev) => ({ ...prev, [key]: e.target.value }))
                  }
                  className="w-full px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Templates */}
        <div className="lg:col-span-2 space-y-4">
          {filtered.map((tpl, idx) => {
            const filled = fillTemplate(tpl.content, vars)
            const isPreview = previewIdx === idx
            const isCopied = copiedId === `${activePlatform}-${idx}`

            return (
              <div
                key={`${tpl.platform}-${tpl.template_type}-${idx}`}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden"
              >
                {/* Template Header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800">
                  <div>
                    <h4 className="text-sm font-semibold text-white">
                      {tpl.title}
                    </h4>
                    <span className="text-xs text-zinc-500">
                      {tpl.template_type.toUpperCase()} — {tpl.platform}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setPreviewIdx(isPreview ? null : idx)
                      }
                      className="flex items-center gap-1 px-3 py-1.5 text-xs bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-300 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      {isPreview ? "Şablon" : "Önizleme"}
                    </button>
                    <button
                      onClick={() => handleCopy(tpl.content, idx)}
                      className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg transition-colors ${
                        isCopied
                          ? "bg-green-600 text-white"
                          : "bg-cyan-600 hover:bg-cyan-500 text-white"
                      }`}
                    >
                      {isCopied ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      {isCopied ? "Kopyalandı" : "Kopyala"}
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <pre className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-300 font-[Inter]">
                    {isPreview ? filled : tpl.content}
                  </pre>
                </div>

                {/* Variables used */}
                <div className="px-5 py-3 border-t border-zinc-800 flex flex-wrap gap-1.5">
                  {tpl.variables.map((v) => (
                    <span
                      key={v}
                      className="px-2 py-0.5 text-xs bg-zinc-800 text-zinc-400 rounded-md"
                    >
                      {`{{${v}}}`}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}

          {filtered.length === 0 && (
            <div className="text-center py-12 text-zinc-500 text-sm">
              Bu platform için henüz şablon yok.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
