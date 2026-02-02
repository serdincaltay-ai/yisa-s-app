"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Brain, Target, Users, Building2, TrendingUp,
  Sparkles, Bot, Globe, Shield, Bell,
  CheckCircle2, XCircle, ArrowRight
} from "lucide-react"
import PatronCommandPanel from "@/components/PatronCommandPanel"

export default function PatronPanel() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-4 md:p-8">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center">
            <Shield className="w-5 h-5 text-zinc-950" />
          </div>
          <span className="text-xl font-bold">YISA-S</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/40 text-sm font-medium transition"
          >
            Komuta Merkezi <ArrowRight className="w-4 h-4" />
          </Link>
          <button className="relative p-2 rounded-full bg-zinc-900 hover:bg-zinc-800 transition">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center">4</span>
          </button>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500" />
        </div>
      </header>

      <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-4 auto-rows-[120px]">

        <motion.div
          className="col-span-4 md:col-span-4 lg:col-span-6 row-span-2 rounded-3xl bg-gradient-to-br from-emerald-500 to-cyan-500 p-6 cursor-pointer overflow-hidden relative group"
          whileHover={{ scale: 1.02 }}
          onHoverStart={() => setHoveredCard("main")}
          onHoverEnd={() => setHoveredCard(null)}
        >
          <div className="relative z-10">
            <p className="text-emerald-100 text-sm mb-2">Hoşgeldiniz</p>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Patron</h1>
            {hoveredCard === "main" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4"
              >
                <p className="text-white/80">CELF Merkezi hazır. 4 onay bekliyor.</p>
              </motion.div>
            )}
          </div>
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        </motion.div>

        <motion.div
          className="col-span-2 md:col-span-2 lg:col-span-3 row-span-2 rounded-3xl bg-zinc-900 p-5 cursor-pointer group hover:bg-zinc-800 transition"
          whileHover={{ scale: 1.02 }}
          onHoverStart={() => setHoveredCard("gelir")}
          onHoverEnd={() => setHoveredCard(null)}
        >
          <TrendingUp className="w-8 h-8 text-emerald-400 mb-3" />
          <p className="text-zinc-500 text-sm">Aylık Gelir</p>
          <p className="text-3xl font-bold mt-1">353K</p>
          {hoveredCard === "gelir" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 text-sm text-emerald-400">
              +12% bu ay
            </motion.div>
          )}
        </motion.div>

        <motion.div
          className="col-span-2 md:col-span-2 lg:col-span-3 row-span-2 rounded-3xl bg-zinc-900 p-5 cursor-pointer group hover:bg-zinc-800 transition"
          whileHover={{ scale: 1.02 }}
          onHoverStart={() => setHoveredCard("ogrenci")}
          onHoverEnd={() => setHoveredCard(null)}
        >
          <Users className="w-8 h-8 text-blue-400 mb-3" />
          <p className="text-zinc-500 text-sm">Öğrenci</p>
          <p className="text-3xl font-bold mt-1">230</p>
          {hoveredCard === "ogrenci" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 text-sm text-blue-400">
              4 tesiste aktif
            </motion.div>
          )}
        </motion.div>

        <motion.div
          className="col-span-4 md:col-span-8 lg:col-span-8 row-span-1 rounded-3xl bg-zinc-900 p-5 cursor-pointer overflow-hidden"
          whileHover={{ scale: 1.01 }}
        >
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">Asistan</span>
            </div>
            <div className="w-8 h-[2px] bg-zinc-700" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
                <Brain className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">CIO</span>
            </div>
            <div className="w-8 h-[2px] bg-zinc-700" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                <Target className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">CEO</span>
            </div>
            <div className="w-8 h-[2px] bg-zinc-700" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">CELF</span>
            </div>
            <div className="w-8 h-[2px] bg-zinc-700" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center">
                <Globe className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">COO</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="col-span-4 md:col-span-8 lg:col-span-12 row-span-1"
          whileHover={{ scale: 1.01 }}
        >
          <PatronCommandPanel />
        </motion.div>

        <motion.div
          className="col-span-2 md:col-span-2 lg:col-span-4 row-span-2 rounded-3xl bg-gradient-to-br from-orange-500 to-red-500 p-5 cursor-pointer relative overflow-hidden group"
          whileHover={{ scale: 1.02 }}
          onHoverStart={() => setHoveredCard("franchise")}
          onHoverEnd={() => setHoveredCard(null)}
        >
          <Building2 className="w-8 h-8 text-white/80 mb-3" />
          <p className="text-white/60 text-sm">Franchise</p>
          <p className="text-4xl font-bold mt-1">4</p>
          {hoveredCard === "franchise" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 space-y-1 text-sm text-white/80"
            >
              <p>Kadıköy - 85 öğrenci</p>
              <p>Çankaya - 62 öğrenci</p>
              <p>Karşıyaka - 45 öğrenci</p>
              <p>Nilüfer - 38 öğrenci</p>
            </motion.div>
          )}
        </motion.div>

        <motion.div
          className="col-span-4 md:col-span-4 lg:col-span-4 row-span-3 rounded-3xl bg-zinc-900 p-5 cursor-pointer overflow-hidden"
          whileHover={{ scale: 1.01 }}
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-zinc-400 text-sm">Onay Bekliyor</p>
            <span className="w-6 h-6 rounded-full bg-red-500 text-xs flex items-center justify-center">4</span>
          </div>
          <div className="space-y-3">
            <OnayKarti baslik="Yeni antrenör" kaynak="Kadıköy" birim="CHRO" />
            <OnayKarti baslik="Reklam kampanyası" kaynak="CMO" birim="CMO" />
            <OnayKarti baslik="Token fiyat güncelle" kaynak="CFO" birim="CFO" />
            <OnayKarti baslik="Aylık rapor" kaynak="CDO" birim="CDO" />
          </div>
        </motion.div>

        <motion.div
          className="col-span-4 md:col-span-4 lg:col-span-4 row-span-2 rounded-3xl bg-zinc-900 p-5 cursor-pointer"
          whileHover={{ scale: 1.01 }}
          onHoverStart={() => setHoveredCard("celf")}
          onHoverEnd={() => setHoveredCard(null)}
        >
          <Bot className="w-8 h-8 text-teal-400 mb-3" />
          <p className="text-zinc-500 text-sm">12 Direktörlük</p>
          <p className="text-3xl font-bold mt-1">CELF</p>
          {hoveredCard === "celf" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 flex flex-wrap gap-2">
              {["CFO", "CTO", "CMO", "CHRO", "CLO", "CPO"].map((d) => (
                <span key={d} className="px-2 py-1 bg-zinc-800 rounded text-xs">{d}</span>
              ))}
            </motion.div>
          )}
        </motion.div>

        <motion.div
          className="col-span-4 md:col-span-4 lg:col-span-4 row-span-2 rounded-3xl bg-gradient-to-br from-purple-600 to-pink-600 p-5 cursor-pointer relative overflow-hidden"
          whileHover={{ scale: 1.02 }}
          onHoverStart={() => setHoveredCard("asistan")}
          onHoverEnd={() => setHoveredCard(null)}
        >
          <Sparkles className="w-8 h-8 text-white/80 mb-3" />
          <p className="text-white/60 text-sm">Kişisel</p>
          <p className="text-3xl font-bold mt-1">Asistan</p>
          {hoveredCard === "asistan" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 text-sm text-white/80"
            >
              Claude tabanlı - Sadece sizinle konuşur
            </motion.div>
          )}
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        </motion.div>

      </div>
    </div>
  )
}

function OnayKarti({ baslik, kaynak, birim }: { baslik: string; kaynak: string; birim: string }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 transition group">
      <div className="flex items-center gap-3">
        <span className="text-xs px-2 py-1 rounded bg-zinc-700">{birim}</span>
        <div>
          <p className="text-sm font-medium">{baslik}</p>
          <p className="text-xs text-zinc-500">{kaynak}</p>
        </div>
      </div>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
        <button className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/40 transition">
          <XCircle className="w-4 h-4 text-red-400" />
        </button>
        <button className="p-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/40 transition">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        </button>
      </div>
    </div>
  )
}
