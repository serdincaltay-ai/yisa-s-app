"use client"

import React from "react"
import { useState } from "react"
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
} from "lucide-react"

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
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">2</span>
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="bg-primary px-4 pb-6 pt-4">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-foreground text-2xl font-bold text-primary">
            EY
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-primary-foreground">{mockChild.name}</h2>
            <p className="text-primary-foreground/80">{mockChild.age} yas - {mockChild.branch}</p>
            <div className="mt-1 flex items-center gap-2">
              <Badge className="bg-primary-foreground/20 text-primary-foreground">{mockChild.level}</Badge>
              <span className="flex items-center gap-1 text-sm text-primary-foreground/80">
                <Coins className="h-4 w-4" />
                {mockChild.tokens} Token
              </span>
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
            <TabsTrigger value="ai" className="flex-1">AI</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <main className="flex-1 p-4">
        {activeTab === "overview" && <OverviewTab child={mockChild} schedule={mockSchedule} />}
        {activeTab === "health" && <HealthTab data={mockHealthData} />}
        {activeTab === "training" && <TrainingTab movements={mockMovements} child={mockChild} />}
        {activeTab === "ai" && <AITab insights={mockAIInsights} child={mockChild} />}
      </main>

      <nav className="sticky bottom-0 border-t border-border bg-card">
        <div className="flex items-center justify-around py-2">
          <NavItem icon={Activity} label="Ana Sayfa" active={activeTab === "overview"} onClick={() => setActiveTab("overview")} />
          <NavItem icon={Heart} label="Saglik" active={activeTab === "health"} onClick={() => setActiveTab("health")} />
          <NavItem icon={Dumbbell} label="Antrenman" active={activeTab === "training"} onClick={() => setActiveTab("training")} />
          <NavItem icon={Brain} label="AI Analiz" active={activeTab === "ai"} onClick={() => setActiveTab("ai")} />
        </div>
      </nav>
    </div>
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

function OverviewTab({ child, schedule }: { child: typeof mockChild; schedule: typeof mockSchedule }) {
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
                <p className="font-semibold text-foreground">{child.nextClass}</p>
                <p className="text-sm text-muted-foreground">Antrenor: {child.trainer}</p>
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
                <p className="text-2xl font-bold text-foreground">%{child.attendance}</p>
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
                <p className="text-2xl font-bold text-foreground">%{child.progress}</p>
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
                <p className="text-2xl font-bold text-foreground">{child.tokens}</p>
                <p className="text-sm text-muted-foreground">Toplam Token</p>
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

function TrainingTab({ movements, child }: { movements: typeof mockMovements; child: typeof mockChild }) {
  return (
    <div className="space-y-4">
      <Card className="border-primary/50 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary">
              <span className="text-2xl font-bold text-primary-foreground">{child.progress}%</span>
            </div>
            <div>
              <p className="font-semibold text-foreground">Seviye Ilerlemesi</p>
              <p className="text-sm text-muted-foreground">{child.level} seviyesinde</p>
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

function AITab({ insights, child }: { insights: typeof mockAIInsights; child: typeof mockChild }) {
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
