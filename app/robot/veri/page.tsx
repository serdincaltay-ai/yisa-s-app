"use client"

/**
 * YiSA-S Veri Robotu Dashboard
 * Supabase tablolarinin durumu, satir sayilari, son guncelleme
 * Canli veri: /api/robot/veri/status endpoint
 */

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Database,
  Table2,
  RefreshCw,
  ArrowLeft,
  Activity,
  HardDrive,
  Clock,
  AlertCircle,
  CheckCircle2,
} from "lucide-react"
import Link from "next/link"

interface TableInfo {
  name: string
  row_count: number
  last_updated: string | null
}

interface VeriStatus {
  total_tables: number
  total_rows: number
  tables: TableInfo[]
  fetched_at: string
  error?: string
}

export default function VeriRobotPage() {
  const [status, setStatus] = useState<VeriStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStatus = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/robot/veri/status")
      const data: VeriStatus = await res.json()
      if (data.error) {
        setError(data.error)
      } else {
        setStatus(data)
      }
    } catch {
      setError("Veri Robotu baglantisi kurulamadi")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStatus()
  }, [fetchStatus])

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/robot" className="h-10 w-10 rounded-xl bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors">
              <ArrowLeft className="h-5 w-5 text-zinc-400" strokeWidth={1.5} />
            </Link>
            <div className="h-10 w-10 rounded-xl bg-emerald-400/10 flex items-center justify-center">
              <Database className="h-5 w-5 text-emerald-400" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Veri Robotu</h1>
              <p className="text-xs text-zinc-400">Veritabani Izleme Dashboard</p>
            </div>
          </div>
          <Button
            onClick={fetchStatus}
            disabled={loading}
            variant="outline"
            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 rounded-xl gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Yenile
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Error State */}
        {error && (
          <Card className="bg-red-500/10 border-red-500/30 rounded-2xl mb-6">
            <CardContent className="flex items-center gap-3 p-4">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <p className="text-sm text-red-300">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card className="bg-zinc-900 border-zinc-800 rounded-2xl">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-400/10 flex items-center justify-center">
                  <Table2 className="h-5 w-5 text-emerald-400" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {loading ? "..." : status?.total_tables ?? 0}
                  </p>
                  <p className="text-xs text-zinc-400">Toplam Tablo</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 rounded-2xl">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-cyan-400/10 flex items-center justify-center">
                  <HardDrive className="h-5 w-5 text-cyan-400" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {loading ? "..." : status?.total_rows?.toLocaleString("tr-TR") ?? 0}
                  </p>
                  <p className="text-xs text-zinc-400">Toplam Satir</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 rounded-2xl">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-purple-400/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-purple-400" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    {loading
                      ? "..."
                      : status?.fetched_at
                        ? new Date(status.fetched_at).toLocaleTimeString("tr-TR", {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })
                        : "--"}
                  </p>
                  <p className="text-xs text-zinc-400">Son Kontrol</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2 mb-4">
          {loading ? (
            <Activity className="h-4 w-4 text-amber-400 animate-pulse" />
          ) : error ? (
            <AlertCircle className="h-4 w-4 text-red-400" />
          ) : (
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          )}
          <span className="text-sm text-zinc-400">
            {loading ? "Veriler yukleniyor..." : error ? "Baglanti hatasi" : "Veritabani baglantisi aktif"}
          </span>
        </div>

        {/* Table List */}
        <Card className="bg-zinc-900 border-zinc-800 rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-zinc-800">
            <CardTitle className="text-base font-semibold text-white">Tablo Durumu</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center text-zinc-500">
                <RefreshCw className="h-6 w-6 mx-auto mb-2 animate-spin" />
                <p className="text-sm">Tablolar yukleniyor...</p>
              </div>
            ) : status?.tables && status.tables.length > 0 ? (
              <div className="divide-y divide-zinc-800">
                {status.tables.map((table) => (
                  <div
                    key={table.name}
                    className="flex items-center justify-between px-5 py-3 hover:bg-zinc-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Table2 className="h-4 w-4 text-zinc-500" strokeWidth={1.5} />
                      <span className="text-sm text-zinc-200 font-mono">{table.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge
                        variant="outline"
                        className={`text-xs font-mono ${
                          table.row_count > 0
                            ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/5"
                            : "border-zinc-600 text-zinc-500 bg-zinc-800/50"
                        }`}
                      >
                        {table.row_count.toLocaleString("tr-TR")} satir
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-zinc-500">
                <Database className="h-6 w-6 mx-auto mb-2" />
                <p className="text-sm">Tablo verisi bulunamadi</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
