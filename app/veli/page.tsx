"use client"

import React, { useEffect, useCallback, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import {
  Activity,
  Users,
  Dumbbell,
  TrendingUp,
  Bell,
  Settings,
  Heart,
  Brain,
  Calendar,
  Coins,
  Star,
  Trophy,
  Moon,
  Utensils,
  Ruler,
  Weight,
  Target,
  CheckCircle2,
  Clock,
  Play,
  ChevronRight,
  MessageSquare,
  FileText,
  Wallet,
  Loader2,
} from "lucide-react"

type Child = { id: string; name: string; surname?: string | null; birth_date?: string | null; gender?: string | null; branch?: string | null; level?: string | null; status?: string }

const mockChild = {
  id: 1,
  name: "Elif Yilmaz",
  age: 8,
  branch: "Artistik Cimnastik",
  level: "Baslangic",
  trainer: "Ayse Celik",
  tokens: 45,
  height: 128,
  weight: 26,
  healthStatus: "Saglikli",
  nextClass: "Yarin 14:00",
  attendance: 92,
  progress: 68
}

const mockSchedule = [
  { day: "Pazartesi", time: "14:00 - 15:30", type: "Grup Dersi" },
  { day: "Carsamba", time: "14:00 - 15:30", type: "Grup Dersi" },
  { day: "Cuma", time: "16:00 - 17:00", type: "Bireysel Calisma" },
]

const mockMovements = [
  { name: "On Takla", status: "learned", date: "15 Ocak" },
  { name: "Kopru", status: "learned", date: "20 Ocak" },
  { name: "Amistand", status: "learning", progress: 70 },
  { name: "Arka Takla", status: "upcoming" },
  { name: "Rondat", status: "upcoming" },
]

const mockHealthData = {
  sleep: { average: 9.2, target: 9, unit: "saat" },
  nutrition: { score: 85, target: 80, unit: "puan" },
  posture: { status: "Normal", lastCheck: "25 Ocak" },
  flexibility: { score: 78, change: "+5" },
  strength: { score: 65, change: "+8" },
  speed: { score: 72, change: "+3" }
}

const mockAIInsights = [
  { type: "sport", title: "Yuzme Potansiyeli", description: "Elif'in vucud oranlari ve esneklik degerleri yuzme icin cok uygun.", confidence: 85 },
  { type: "health", title: "Boy Gelisimi", description: "Mevcut buyume hizi normalin uzerinde. Tahmini yetiskin boyu: 168-172 cm", confidence: 78 },
  { type: "training", title: "Antrenman Onerisi", description: "Patlayici kuvvet calismalarini artirmak faydali olacak.", confidence: 92 }
]

export default function VeliDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [children, setChildren] = useState<Child[]>([])
  const [selectedChild, setSelectedChild] = useState<Child | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchChildren = useCallback(async () => {
    const res = await fetch("/api/veli/children")
    const data = await res.json()
    const items = Array.isArray(data.items) ? data.items : []
    setChildren(items)
    setSelectedChild((prev) => {
      if (items.length === 0) return null
      if (prev && items.some((c: Child) => c.id === prev.id)) return prev
      return items[0]
    })
  }, [])

  useEffect(() => {
    fetchChildren().finally(() => setLoading(false))
  }, [fetchChildren])

  const child = selectedChild ?? (children[0] ?? null)
  const ageFromBirth = (d: string | null | undefined) => {
    if (!d) return null
    const diff = new Date().getTime() - new Date(d).getTime()
    return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000))
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-card">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Activity className="h-6 w-6 text-primary-foreground" />
            </div>
            <Link href="/" className="hover:opacity-90 transition">
              <div>
                <h1 className="font-bold text-foreground">YİSA-S</h1>
                <p className="text-xs text-muted-foreground">Veli Alanı — Proje & Forum</p>
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative" title="Bildirimler">
              <Bell className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">0</span>
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
      ) : children.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <Users className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-lg font-semibold mb-2">Cocuk Kaydi Yok</h2>
          <p className="text-sm text-muted-foreground text-center max-w-sm">
            Hesabiniza bagli cocuk bulunamadi. Tesisinizle iletisime gecin — cocugunuzu kaydettiklerinde e-posta adresinizi veli olarak tanimlamalari gerekir.
          </p>
        </div>
      ) : (
        <>
          <div className="bg-primary px-4 pb-6 pt-4">
            {children.length > 1 && (
              <div className="mb-3 flex gap-2 overflow-x-auto pb-2">
                {children.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedChild(c)}
                    className={`rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap transition-colors ${
                      selectedChild?.id === c.id
                        ? "bg-primary-foreground text-primary"
                        : "bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30"
                    }`}
                  >
                    {c.name} {c.surname ?? ""}
                  </button>
                ))}
              </div>
            )}
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-foreground text-2xl font-bold text-primary">
                {(child?.name[0] ?? "?") + (child?.surname?.[0] ?? "")}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-primary-foreground">{child?.name ?? ""} {child?.surname ?? ""}</h2>
                <p className="text-primary-foreground/80">{ageFromBirth(child?.birth_date) ?? "—"} yas — {child?.branch ?? "—"}</p>
                <div className="mt-1 flex items-center gap-2">
                  <Badge className="bg-primary-foreground/20 text-primary-foreground">{child?.level ?? "—"}</Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="sticky top-16 z-40 bg-card px-4 pt-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full">
                <TabsTrigger value="overview" className="flex-1">Genel</TabsTrigger>
                <TabsTrigger value="health" className="flex-1">Saglik</TabsTrigger>
                <TabsTrigger value="training" className="flex-1">Antrenman</TabsTrigger>
                <TabsTrigger value="aidat" className="flex-1">Aidat</TabsTrigger>
                <TabsTrigger value="ai" className="flex-1">AI</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <main className="flex-1 p-4">
            {activeTab === "overview" && child && (
              <>
                <BildirimlerCard />
                <DevamsizlikCard athleteId={child.id} />
                <OverviewTab child={child} schedule={mockSchedule} />
              </>
            )}
            {activeTab === "health" && <HealthTab data={mockHealthData} />}
            {activeTab === "training" && child && <TrainingTab movements={mockMovements} child={child} />}
            {activeTab === "aidat" && <AidatTab child={child} />}
            {activeTab === "ai" && child && <AITab insights={mockAIInsights} child={child} />}
          </main>

          <nav className="sticky bottom-0 border-t border-border bg-card">
            <div className="flex items-center justify-around py-2">
              <NavItem icon={Activity} label="Genel" active={activeTab === "overview"} onClick={() => setActiveTab("overview")} />
              <NavItem icon={Heart} label="Saglik" active={activeTab === "health"} onClick={() => setActiveTab("health")} />
              <NavItem icon={Dumbbell} label="Antrenman" active={activeTab === "training"} onClick={() => setActiveTab("training")} />
              <NavItem icon={Wallet} label="Aidat" active={activeTab === "aidat"} onClick={() => setActiveTab("aidat")} />
              <NavItem icon={Brain} label="AI" active={activeTab === "ai"} onClick={() => setActiveTab("ai")} />
            </div>
          </nav>
        </>
      )}
    </div>
  )
}

function DevamsizlikCard({ athleteId }: { athleteId: string }) {
  const [rate, setRate] = useState<number | null>(null)
  const [items, setItems] = useState<{ lesson_date: string; status: string }[]>([])
  useEffect(() => {
    fetch(`/api/veli/attendance?athlete_id=${athleteId}&days=30`)
      .then((r) => r.json())
      .then((d) => {
        setRate(d?.attendanceRate ?? 0)
        setItems(Array.isArray(d?.items) ? d.items : [])
      })
      .catch(() => setRate(null))
  }, [athleteId])
  if (rate === null && items.length === 0) return null
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Devam Orani (Son 30 gun)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="text-3xl font-bold text-foreground">%{rate ?? 0}</div>
          <div className="flex-1 space-y-1 max-h-24 overflow-y-auto">
            {items.slice(0, 10).map((i, idx) => (
              <div key={i.lesson_date + '-' + idx} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{new Date(i.lesson_date).toLocaleDateString("tr-TR")}</span>
                <span className={i.status === "present" ? "text-green-600" : i.status === "absent" ? "text-red-600" : "text-amber-600"}>{i.status === "present" ? "Geldi" : i.status === "absent" ? "Gelmedi" : i.status === "late" ? "Gec" : "Izinli"}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function BildirimlerCard() {
  return (
    <Card className="mb-4 border-primary/30 bg-primary/5">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Bell className="h-4 w-4" />
          Bildirimler
        </CardTitle>
        <CardDescription>Yeni ders, aidat hatirlatma, performans raporu</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Henuz bildirim yok.</p>
      </CardContent>
    </Card>
  )
}

function NavItem({ icon: Icon, label, active, onClick }: { icon: React.ElementType; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 px-4 py-2 ${active ? "text-primary" : "text-muted-foreground"}`}
    >
      <Icon className="h-5 w-5" />
      <span className="text-xs">{label}</span>
    </button>
  )
}

function OverviewTab({ child, schedule }: { child: Child; schedule: typeof mockSchedule }) {
  return (
    <div className="space-y-4">
      <Card className="border-primary/50 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
                <Calendar className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sonraki Ders</p>
                <p className="font-semibold text-foreground">Tesis programina bakin</p>
                <p className="text-sm text-muted-foreground">Antrenor: —</p>
              </div>
            </div>
            <Button size="sm">
              <MessageSquare className="mr-2 h-4 w-4" />
              Mesaj
            </Button>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">—</p>
                <p className="text-xs text-muted-foreground">Devam Orani</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">—</p>
                <p className="text-xs text-muted-foreground">Ilerleme</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Haftalik Program</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {schedule.map((item, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg bg-muted p-3">
              <div>
                <p className="font-medium text-foreground">{item.day}</p>
                <p className="text-sm text-muted-foreground">{item.time}</p>
              </div>
              <Badge variant="outline">{item.type}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                <Coins className="h-6 w-6 text-accent-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">—</p>
                <p className="text-sm text-muted-foreground">Token / Grafik</p>
              </div>
            </div>
            <Button variant="outline" size="sm">Harca <ChevronRight className="ml-1 h-4 w-4" /></Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function HealthTab({ data }: { data: typeof mockHealthData }) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Fiziksel Gelisim</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
              <Ruler className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xl font-bold text-foreground">128 cm</p>
                <p className="text-xs text-muted-foreground">Boy</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
              <Weight className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xl font-bold text-foreground">26 kg</p>
                <p className="text-xs text-muted-foreground">Kilo</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Moon className="h-4 w-4" />
              <span className="text-xs">Uyku</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">{data.sleep.average}h</p>
            <p className="text-xs text-green-600">Hedef: {data.sleep.target}h</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Utensils className="h-4 w-4" />
              <span className="text-xs">Beslenme</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">{data.nutrition.score}</p>
            <p className="text-xs text-green-600">Hedef: {data.nutrition.target}</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                <Heart className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-foreground">Durus Kontrolu</p>
                <p className="text-sm text-muted-foreground">Son kontrol: {data.posture.lastCheck}</p>
              </div>
            </div>
            <Badge variant="outline" className="text-green-600">{data.posture.status}</Badge>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Performans Degerleri</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Esneklik</span>
              <span className="font-medium text-foreground">{data.flexibility.score}/100 <span className="text-green-600">({data.flexibility.change})</span></span>
            </div>
            <Progress value={data.flexibility.score} className="mt-2" />
          </div>
          <div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Kuvvet</span>
              <span className="font-medium text-foreground">{data.strength.score}/100 <span className="text-green-600">({data.strength.change})</span></span>
            </div>
            <Progress value={data.strength.score} className="mt-2" />
          </div>
          <div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Surat</span>
              <span className="font-medium text-foreground">{data.speed.score}/100 <span className="text-green-600">({data.speed.change})</span></span>
            </div>
            <Progress value={data.speed.score} className="mt-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function AidatTab({ child }: { child: Child | null }) {
  const [payments, setPayments] = useState<{ id: string; athlete_name: string; amount: number; period_month?: number; period_year?: number; due_date?: string; paid_date?: string; status: string }[]>([])
  const [totalDebt, setTotalDebt] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/veli/payments")
      .then((r) => r.json())
      .then((d) => {
        setPayments(Array.isArray(d?.items) ? d.items : [])
        setTotalDebt(typeof d?.totalDebt === "number" ? d.totalDebt : 0)
      })
      .catch(() => setPayments([]))
      .finally(() => setLoading(false))
  }, [])

  const statusBadge = (s: string) => {
    if (s === "paid") return <span className="text-green-600 text-sm">Odendi</span>
    if (s === "overdue") return <span className="text-red-600 text-sm">Gecikmis</span>
    return <span className="text-amber-600 text-sm">Bekliyor</span>
  }

  return (
    <div className="space-y-4">
      {totalDebt > 0 && (
        <Card className="border-amber-500/50 bg-amber-500/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Toplam Borc</p>
                <p className="text-2xl font-bold text-foreground">{totalDebt.toLocaleString("tr-TR")} TL</p>
              </div>
              <Wallet className="h-10 w-10 text-amber-500" />
            </div>
          </CardContent>
        </Card>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Aidat Durumu</CardTitle>
          <CardDescription>{child ? `${child.name} ${child.surname ?? ""}` : "Cocuklarim"} icin odeme gecmisi</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Yukleniyor…</p>
          ) : payments.length === 0 ? (
            <p className="text-sm text-muted-foreground">Henuz odeme kaydi yok. Tesisinizle iletisime gecin.</p>
          ) : (
            <div className="space-y-3">
              {payments.map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium">{p.athlete_name}</p>
                    <p className="text-sm text-muted-foreground">{p.period_month}/{p.period_year} · {p.amount.toLocaleString("tr-TR")} TL</p>
                  </div>
                  {statusBadge(p.status)}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function TrainingTab({ movements, child }: { movements: typeof mockMovements; child: Child }) {
  return (
    <div className="space-y-4">
      <Card className="border-primary/50 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary">
              <span className="text-2xl font-bold text-primary-foreground">{child.level ?? "—"}</span>
            </div>
            <div>
              <p className="font-semibold text-foreground">Seviye Ilerlemesi</p>
              <p className="text-sm text-muted-foreground">{child.level ?? "—"} seviyesinde</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Hareket Havuzu</CardTitle>
          <CardDescription>Ogrenilen ve calisilacak hareketler</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {movements.map((movement, i) => (
            <div
              key={i}
              className={`flex items-center justify-between rounded-lg p-3 ${
                movement.status === "learned" ? "bg-green-500/10" :
                movement.status === "learning" ? "bg-primary/10" : "bg-muted"
              }`}
            >
              <div className="flex items-center gap-3">
                {movement.status === "learned" ? <CheckCircle2 className="h-5 w-5 text-green-600" /> :
                  movement.status === "learning" ? <Play className="h-5 w-5 text-primary" /> :
                  <Clock className="h-5 w-5 text-muted-foreground" />}
                <div>
                  <p className="font-medium text-foreground">{movement.name}</p>
                  {movement.status === "learned" && "date" in movement && (
                    <p className="text-xs text-muted-foreground">Tamamlandi: {movement.date}</p>
                  )}
                  {movement.status === "learning" && "progress" in movement && (
                    <div className="mt-1 flex items-center gap-2">
                      <Progress value={movement.progress} className="h-1.5 w-20" />
                      <span className="text-xs text-muted-foreground">{movement.progress}%</span>
                    </div>
                  )}
                </div>
              </div>
              {movement.status === "learned" && <Badge variant="outline" className="text-green-600">Ogrenildi</Badge>}
              {movement.status === "learning" && <Badge>Calisiyor</Badge>}
              {movement.status === "upcoming" && <Badge variant="secondary">Sirada</Badge>}
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Basarilar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <div className="flex flex-col items-center gap-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10">
                <Trophy className="h-6 w-6 text-amber-500" />
              </div>
              <span className="text-xs text-muted-foreground">Ilk Takla</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground">5 Ders</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-xs text-muted-foreground">Hedef</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function AITab({ insights, child }: { insights: typeof mockAIInsights; child: Child }) {
  return (
    <div className="space-y-4">
      <Card className="border-primary/50 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <Brain className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <p className="font-semibold text-foreground">CELF AI Analizi</p>
              <p className="text-sm text-muted-foreground">{child.name} icin ozel degerlendirmeler</p>
            </div>
          </div>
        </CardContent>
      </Card>
      {insights.map((insight, i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                insight.type === "sport" ? "bg-blue-500/10" :
                insight.type === "health" ? "bg-green-500/10" : "bg-primary/10"
              }`}>
                {insight.type === "sport" ? <Trophy className="h-5 w-5 text-blue-600" /> :
                  insight.type === "health" ? <Heart className="h-5 w-5 text-green-600" /> :
                  <Dumbbell className="h-5 w-5 text-primary" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-foreground">{insight.title}</p>
                  <Badge variant="outline">{insight.confidence}% guven</Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{insight.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Onerilen Sporlar</CardTitle>
          <CardDescription>AI'in analiz ettigi potansiyel alanlar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-foreground">Artistik Cimnastik</span>
              <div className="flex items-center gap-2">
                <Progress value={92} className="h-2 w-24" />
                <span className="text-sm font-medium text-foreground">92%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-foreground">Yuzme</span>
              <div className="flex items-center gap-2">
                <Progress value={85} className="h-2 w-24" />
                <span className="text-sm font-medium text-foreground">85%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Button className="w-full">
        <FileText className="mr-2 h-4 w-4" />
        Detayli Rapor Al
      </Button>
    </div>
  )
}
