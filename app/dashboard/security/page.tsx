'use client'

import { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { Shield, ShieldAlert, ShieldCheck, Lock, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

/* ── Tipler ────────────────────────────────────────────────── */

interface DuvarInfo {
  name: string
  description: string
  aktif: boolean
  kural_sayisi: number
  alarm_seviyeleri?: string[]
}

interface LogEntry {
  id: string
  event_type: string
  severity: string
  description: string | null
  blocked: boolean
  created_at: string
}

interface SecurityData {
  logs: LogEntry[]
  stats: {
    toplam: number
    engellenen: number
    izin_verilen: number
    severity: Record<string, number>
    event_types: Record<string, number>
  }
  duvarlar: {
    forbidden_zones: DuvarInfo
    patron_lock: DuvarInfo
    siber_guvenlik: DuvarInfo
  }
}

/* ── Renk haritaları ───────────────────────────────────────── */

const SEVERITY_COLORS: Record<string, string> = {
  sari: '#eab308',
  turuncu: '#f97316',
  kirmizi: '#ef4444',
  acil: '#dc2626',
}

const SEVERITY_LABELS: Record<string, string> = {
  sari: 'Sarı',
  turuncu: 'Turuncu',
  kirmizi: 'Kırmızı',
  acil: 'Acil',
}

const PIE_COLORS = ['#06b6d4', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#ec4899']

/* ── Yardımcı fonksiyonlar ─────────────────────────────────── */

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function severityBadge(severity: string) {
  const color = SEVERITY_COLORS[severity] ?? '#6b7280'
  const label = SEVERITY_LABELS[severity] ?? severity
  return (
    <Badge
      className="text-white font-medium"
      style={{ backgroundColor: color, borderColor: color }}
    >
      {label}
    </Badge>
  )
}

/* ── Ana Sayfa Bileşeni ────────────────────────────────────── */

export default function SecurityDashboardPage() {
  const [data, setData] = useState<SecurityData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/security/logs?limit=200')
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`)
      }
      const json = (await res.json()) as SecurityData
      setData(json)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Bilinmeyen hata')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  /* ── Grafik verileri ───────────────────────────────────────── */

  const severityChartData = data
    ? Object.entries(data.stats.severity).map(([key, value]) => ({
        name: SEVERITY_LABELS[key] ?? key,
        sayi: value,
        fill: SEVERITY_COLORS[key] ?? '#6b7280',
      }))
    : []

  const eventTypeChartData = data
    ? Object.entries(data.stats.event_types)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([name, sayi]) => ({ name, sayi }))
    : []

  /* ── Duvar kartları ────────────────────────────────────────── */

  const duvarCards = data
    ? [
        {
          key: 'forbidden_zones',
          info: data.duvarlar.forbidden_zones,
          icon: ShieldAlert,
          color: 'text-red-400',
          ring: 'ring-red-400/20',
        },
        {
          key: 'patron_lock',
          info: data.duvarlar.patron_lock,
          icon: Lock,
          color: 'text-amber-400',
          ring: 'ring-amber-400/20',
        },
        {
          key: 'siber_guvenlik',
          info: data.duvarlar.siber_guvenlik,
          icon: ShieldCheck,
          color: 'text-cyan-400',
          ring: 'ring-cyan-400/20',
        },
      ]
    : []

  /* ── Yükleniyor / Hata ─────────────────────────────────────── */

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <RefreshCw className="animate-spin text-cyan-400" size={32} />
        <span className="ml-3 text-muted-foreground">Güvenlik verileri yükleniyor...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <ShieldAlert className="text-red-400" size={48} />
        <p className="text-red-400 font-medium">{error}</p>
        <Button variant="outline" onClick={fetchData}>
          Tekrar Dene
        </Button>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="space-y-6">
      {/* Başlık */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="text-cyan-400" size={28} />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Güvenlik Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              3 Duvar sistemi durumu ve güvenlik logları
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={fetchData} className="gap-2">
          <RefreshCw size={14} />
          Yenile
        </Button>
      </div>

      {/* ── 3 Duvar Kartları ─────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {duvarCards.map(({ key, info, icon: Icon, color, ring }) => (
          <Card key={key} className={`ring-1 ${ring}`}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Icon className={color} size={24} />
                <Badge
                  variant={info.aktif ? 'default' : 'destructive'}
                  className={info.aktif ? 'bg-emerald-600 hover:bg-emerald-600' : ''}
                >
                  {info.aktif ? 'Aktif' : 'Pasif'}
                </Badge>
              </div>
              <CardTitle className="text-base mt-2">{info.name}</CardTitle>
              <CardDescription>{info.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Kural Sayısı</span>
                <span className={`font-mono font-bold ${color}`}>{info.kural_sayisi}</span>
              </div>
              {info.alarm_seviyeleri && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {info.alarm_seviyeleri.map((seviye) => (
                    <Badge key={seviye} variant="outline" className="text-xs">
                      {seviye}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Özet Kartları ────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Toplam Log</p>
            <p className="text-3xl font-bold text-foreground">{data.stats.toplam}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Engellenen</p>
            <p className="text-3xl font-bold text-red-400">{data.stats.engellenen}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">İzin Verilen</p>
            <p className="text-3xl font-bold text-emerald-400">{data.stats.izin_verilen}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Acil Alarm</p>
            <p className="text-3xl font-bold text-red-600">{data.stats.severity.acil ?? 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* ── Grafikler ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Severity Dağılımı — Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Severity Dağılımı</CardTitle>
            <CardDescription>Log sayısı — seviyeye göre</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={severityChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  />
                  <YAxis
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))',
                    }}
                  />
                  <Bar dataKey="sayi" name="Log Sayısı" radius={[4, 4, 0, 0]}>
                    {severityChartData.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Olay Türleri — Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Olay Türleri</CardTitle>
            <CardDescription>En sık görülen olay türleri</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={eventTypeChartData}
                    dataKey="sayi"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={(props: { name?: string; percent?: number }) =>
                      `${props.name ?? ''} (${((props.percent ?? 0) * 100).toFixed(0)}%)`
                    }
                    labelLine={false}
                  >
                    {eventTypeChartData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))',
                    }}
                  />
                  <Legend
                    wrapperStyle={{ color: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Olay Türleri Tablosu ─────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Olay Türleri Dağılımı</CardTitle>
          <CardDescription>Tüm olay türleri ve sayıları</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Olay Türü</TableHead>
                <TableHead className="text-right">Sayı</TableHead>
                <TableHead className="text-right">Oran</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(data.stats.event_types)
                .sort((a, b) => b[1] - a[1])
                .map(([type, count]) => (
                  <TableRow key={type}>
                    <TableCell className="font-medium">{type}</TableCell>
                    <TableCell className="text-right font-mono">{count}</TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {data.stats.toplam > 0
                        ? `%${((count / data.stats.toplam) * 100).toFixed(1)}`
                        : '%0'}
                    </TableCell>
                  </TableRow>
                ))}
              {Object.keys(data.stats.event_types).length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">
                    Henüz olay kaydı yok
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ── Son Loglar Tablosu ───────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Son Güvenlik Logları</CardTitle>
          <CardDescription>En son {data.logs.length} kayıt</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tarih</TableHead>
                <TableHead>Olay Türü</TableHead>
                <TableHead>Seviye</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead className="max-w-[300px]">Açıklama</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.logs.slice(0, 50).map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDate(log.created_at)}
                  </TableCell>
                  <TableCell className="font-medium text-sm">{log.event_type}</TableCell>
                  <TableCell>{severityBadge(log.severity)}</TableCell>
                  <TableCell>
                    <Badge variant={log.blocked ? 'destructive' : 'outline'}>
                      {log.blocked ? 'Engellendi' : 'Geçti'}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[300px] truncate text-xs text-muted-foreground">
                    {log.description ?? '—'}
                  </TableCell>
                </TableRow>
              ))}
              {data.logs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    Henüz güvenlik logu yok
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
