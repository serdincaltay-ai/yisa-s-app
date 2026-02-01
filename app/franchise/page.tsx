"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Activity,
  Building2,
  Users,
  Dumbbell,
  TrendingUp,
  Bell,
  Settings,
  LogOut,
  Search,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  BarChart3,
  Coins,
  Bot,
  ShoppingBag,
  Calendar,
  FileText,
  Heart,
  Brain,
  ChevronRight,
  Eye,
  Star,
  Megaphone,
  Package,
  Sparkles,
  UserPlus
} from "lucide-react"

const mockStudents = [
  { id: 1, name: "Elif Yilmaz", age: 8, branch: "Artistik Cimnastik", level: "Baslangic", health: "normal", tokens: 45 },
  { id: 2, name: "Ahmet Demir", age: 10, branch: "Trampolin", level: "Orta", health: "attention", tokens: 72 },
  { id: 3, name: "Zeynep Kaya", age: 7, branch: "Ritmik Cimnastik", level: "Baslangic", health: "normal", tokens: 38 },
  { id: 4, name: "Can Ozturk", age: 12, branch: "Artistik Cimnastik", level: "Ileri", health: "normal", tokens: 125 },
]

const mockTrainers = [
  { id: 1, name: "Mehmet Yildiz", specialty: "Artistik Cimnastik", students: 28, rating: 4.8 },
  { id: 2, name: "Ayse Celik", specialty: "Ritmik Cimnastik", students: 22, rating: 4.9 },
  { id: 3, name: "Ali Korkmaz", specialty: "Trampolin", students: 18, rating: 4.7 },
]

const mockCOOProducts = [
  { id: 1, name: "Sosyal Medya Robotu", description: "Otomatik paylasim ve cevaplama", price: 500, category: "robot" },
  { id: 2, name: "WhatsApp Robotu", description: "Veli iletisimi otomasyonu", price: 750, category: "robot" },
  { id: 3, name: "Strateji Robotu", description: "Is gelistirme onerileri", price: 1000, category: "robot" },
  { id: 4, name: "Web Sitesi Sablonu", description: "Hazir tesis web sitesi", price: 300, category: "template" },
  { id: 5, name: "Logo Paketi", description: "Profesyonel logo tasarimi", price: 200, category: "template" },
  { id: 6, name: "Online Magaza", description: "Spor urunleri satisi", price: 1500, category: "module" },
]

export default function FranchiseDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar">
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <Activity className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-sidebar-foreground">YISA-S</h1>
            <p className="text-xs text-sidebar-foreground/60">Franchise Paneli</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          <SidebarItem icon={BarChart3} label="Genel Bakis" active={activeTab === "overview"} onClick={() => setActiveTab("overview")} />
          <SidebarItem icon={Users} label="Ogrenciler" active={activeTab === "students"} onClick={() => setActiveTab("students")} />
          <SidebarItem icon={Dumbbell} label="Antrenorler" active={activeTab === "trainers"} onClick={() => setActiveTab("trainers")} />
          <SidebarItem icon={Calendar} label="Ders Programi" active={activeTab === "schedule"} onClick={() => setActiveTab("schedule")} />
          <SidebarItem icon={Heart} label="Saglik Takibi" active={activeTab === "health"} onClick={() => setActiveTab("health")} />
          <SidebarItem icon={ShoppingBag} label="COO Magazasi" active={activeTab === "coo"} onClick={() => setActiveTab("coo")} badge="Yeni" />
          <SidebarItem icon={Megaphone} label="Pazarlama" active={activeTab === "marketing"} onClick={() => setActiveTab("marketing")} />
          <SidebarItem icon={UserPlus} label="Personel (IK)" active={activeTab === "personel"} onClick={() => setActiveTab("personel")} />
          <SidebarItem icon={FileText} label="Raporlar" active={activeTab === "reports"} onClick={() => setActiveTab("reports")} />
          <SidebarItem icon={Settings} label="Ayarlar" active={activeTab === "settings"} onClick={() => setActiveTab("settings")} />
        </nav>

        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent">
              <Building2 className="h-5 w-5 text-accent-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-sidebar-foreground">Istanbul Kadikoy</p>
              <p className="text-xs text-sidebar-foreground/60">Franchise</p>
            </div>
            <Button variant="ghost" size="icon" className="text-sidebar-foreground/60 hover:text-sidebar-foreground">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </aside>

      <main className="ml-64 flex-1">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card px-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Ogrenci, antrenor ara..." className="w-64 pl-9" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="relative bg-transparent">
              <Bell className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">2</span>
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Yeni Ogrenci
            </Button>
          </div>
        </header>

        <div className="p-6">
          {activeTab === "overview" && <OverviewTab students={mockStudents} trainers={mockTrainers} />}
          {activeTab === "students" && <StudentsTab students={mockStudents} />}
          {activeTab === "trainers" && <TrainersTab trainers={mockTrainers} />}
          {activeTab === "schedule" && <ScheduleTab />}
          {activeTab === "health" && <HealthTab students={mockStudents} />}
          {activeTab === "coo" && <COOTab products={mockCOOProducts} />}
          {activeTab === "marketing" && <MarketingTab />}
          {activeTab === "personel" && <PersonelTab />}
          {activeTab === "reports" && <ReportsTab />}
          {activeTab === "settings" && <SettingsTab />}
        </div>
      </main>
    </div>
  )
}

function SidebarItem({ icon: Icon, label, active, onClick, badge }: {
  icon: React.ElementType
  label: string
  active: boolean
  onClick: () => void
  badge?: string | number
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
      }`}
    >
      <Icon className="h-5 w-5" />
      <span className="flex-1 text-left">{label}</span>
      {badge && (
        <span className="rounded-full px-2 py-0.5 text-xs bg-primary text-primary-foreground">
          {badge}
        </span>
      )}
    </button>
  )
}

function OverviewTab({ students, trainers }: { students: typeof mockStudents; trainers: typeof mockTrainers }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Istanbul Kadikoy Subesi</h2>
        <p className="text-muted-foreground">Tesis durumu ve gunluk ozet</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Toplam Ogrenci" value="85" change="+3 bu ay" icon={Users} color="primary" />
        <StatCard title="Aktif Antrenor" value="3" change="Tam kadro" icon={Dumbbell} color="success" />
        <StatCard title="Aylik Gelir" value="125.000 TL" change="+8%" icon={TrendingUp} color="accent" />
        <StatCard title="Token Havuzu" value="2.450" change="Dagitilabilir" icon={Coins} color="info" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Son Kayitlar</CardTitle>
              <CardDescription>Yeni katilan ogrenciler</CardDescription>
            </div>
            <Button variant="outline" size="sm">Tumunu Gor</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {students.slice(0, 3).map((student) => (
                <div key={student.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                      {student.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{student.name}</p>
                      <p className="text-sm text-muted-foreground">{student.branch}</p>
                    </div>
                  </div>
                  <Badge variant={student.health === "normal" ? "default" : "destructive"}>{student.level}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Bugunun Dersleri</CardTitle>
              <CardDescription>31 Ocak 2026</CardDescription>
            </div>
            <Button variant="outline" size="sm">Takvim</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ScheduleItem time="09:00" title="Baslangic Grubu" trainer="Ayse Celik" students={12} />
              <ScheduleItem time="11:00" title="Orta Seviye" trainer="Mehmet Yildiz" students={8} />
              <ScheduleItem time="14:00" title="Ileri Seviye" trainer="Ali Korkmaz" students={6} />
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className="border-primary/50 bg-primary/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle>AI Onerileri</CardTitle>
          </div>
          <CardDescription>CELF sisteminin bu haftaki onerileri</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg bg-card p-4">
              <p className="font-medium text-foreground">Reklam Kampanyasi</p>
              <p className="mt-1 text-sm text-muted-foreground">Ocak ayi sonuna kadar %15 indirim kampanyasi baslatmaniz oneriliyor.</p>
              <Button size="sm" className="mt-3">Kampanya Baslat</Button>
            </div>
            <div className="rounded-lg bg-card p-4">
              <p className="font-medium text-foreground">Antrenor Ihtiyaci</p>
              <p className="mt-1 text-sm text-muted-foreground">Ritmik cimnastik grubunda yogunluk artiyor.</p>
              <Button size="sm" variant="outline" className="mt-3 bg-transparent">Detaylar</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function StatCard({ title, value, change, icon: Icon, color }: {
  title: string
  value: string
  change: string
  icon: React.ElementType
  color: string
}) {
  const colorClasses: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    success: "bg-green-500/10 text-green-600",
    accent: "bg-accent/10 text-accent-foreground",
    info: "bg-blue-500/10 text-blue-600",
  }
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colorClasses[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-xs text-primary">{change}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ScheduleItem({ time, title, trainer, students }: { time: string; title: string; trainer: string; students: number }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-14 text-center">
        <p className="font-mono text-sm font-medium text-foreground">{time}</p>
      </div>
      <div className="h-12 w-px bg-border" />
      <div className="flex-1">
        <p className="font-medium text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{trainer} - {students} ogrenci</p>
      </div>
    </div>
  )
}

function StudentsTab({ students }: { students: typeof mockStudents }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Ogrenciler</h2>
          <p className="text-muted-foreground">Tum ogrencileri goruntule ve yonet</p>
        </div>
        <Button><Plus className="mr-2 h-4 w-4" />Yeni Ogrenci</Button>
      </div>
      <div className="grid gap-4">
        {students.map((student) => (
          <Card key={student.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-lg font-medium text-primary">
                    {student.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{student.name}</h3>
                    <p className="text-sm text-muted-foreground">{student.age} yas - {student.branch}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge variant="outline">{student.level}</Badge>
                      <Badge variant={student.health === "normal" ? "default" : "destructive"}>
                        {student.health === "normal" ? "Saglikli" : "Dikkat"}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="flex items-center gap-1 text-sm font-medium text-foreground">
                    <Coins className="h-4 w-4 text-accent-foreground" />{student.tokens} Token
                  </p>
                  <Button variant="outline" size="sm"><Eye className="mr-2 h-4 w-4" />Profil</Button>
                  <Button size="sm"><Brain className="mr-2 h-4 w-4" />AI Analiz</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function TrainersTab({ trainers }: { trainers: typeof mockTrainers }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Antrenorler</h2>
          <p className="text-muted-foreground">Antrenor kadrosu ve performanslari</p>
        </div>
        <Button><Plus className="mr-2 h-4 w-4" />Antrenor Ekle</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {trainers.map((trainer) => (
          <Card key={trainer.id}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-lg font-medium text-primary-foreground">
                  {trainer.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{trainer.name}</h3>
                  <p className="text-sm text-muted-foreground">{trainer.specialty}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-1 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{trainer.students} ogrenci</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 text-amber-500" />
                  <span className="text-foreground">{trainer.rating}</span>
                </div>
              </div>
              <Button variant="outline" className="mt-4 w-full bg-transparent" size="sm">Detaylar</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function ScheduleTab() {
  const days = ["Pazartesi", "Sali", "Carsamba", "Persembe", "Cuma", "Cumartesi"]
  const hours = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"]
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Ders Programi</h2>
          <p className="text-muted-foreground">Haftalik ders plani</p>
        </div>
        <Button><Plus className="mr-2 h-4 w-4" />Ders Ekle</Button>
      </div>
      <Card>
        <CardContent className="overflow-x-auto p-4">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-7 gap-2">
              <div className="p-2" />
              {days.map((day) => (
                <div key={day} className="rounded-lg bg-muted p-2 text-center font-medium text-foreground">{day}</div>
              ))}
              {hours.map((hour) => (
                <React.Fragment key={hour}>
                  <div className="flex items-center justify-center p-2 text-sm text-muted-foreground">{hour}</div>
                  {days.map((day) => (
                    <div key={`${hour}-${day}`} className="rounded-lg border border-border p-2 text-center text-xs">
                      Ders
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function HealthTab({ students }: { students: typeof mockStudents }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Saglik Takibi</h2>
        <p className="text-muted-foreground">Ogrenci saglik durumu ve risk analizleri</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold text-foreground">{students.filter(s => s.health === "normal").length}</p>
              <p className="text-sm text-muted-foreground">Saglikli</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10">
              <AlertCircle className="h-6 w-6 text-amber-600" />
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold text-foreground">{students.filter(s => s.health === "attention").length}</p>
              <p className="text-sm text-muted-foreground">Dikkat Gerektiren</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold text-foreground">12</p>
              <p className="text-sm text-muted-foreground">AI Analiz Yapildi</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function COOTab({ products }: { products: typeof mockCOOProducts }) {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const filteredProducts = selectedCategory === "all" ? products : products.filter(p => p.category === selectedCategory)
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">COO Magazasi</h2>
        <p className="text-muted-foreground">Tesisiniz icin robotlar, sablonlar ve moduller</p>
      </div>
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList>
          <TabsTrigger value="all">Tumu</TabsTrigger>
          <TabsTrigger value="robot">Robotlar</TabsTrigger>
          <TabsTrigger value="template">Sablonlar</TabsTrigger>
          <TabsTrigger value="module">Moduller</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="transition-shadow hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                {product.category === "robot" ? <Bot className="h-6 w-6 text-primary" /> :
                  product.category === "template" ? <Package className="h-6 w-6 text-primary" /> :
                  <Sparkles className="h-6 w-6 text-primary" />}
              </div>
              <div className="mt-4">
                <h3 className="font-semibold text-foreground">{product.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{product.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-lg font-bold text-primary">{product.price} Token</p>
                  <Button size="sm">Satin Al</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function MarketingTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Pazarlama</h2>
        <p className="text-muted-foreground">Kampanyalar ve sosyal medya yonetimi</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Aktif Kampanyalar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border p-4">
            <p className="font-medium text-foreground">Kis Indirimi</p>
            <p className="text-sm text-muted-foreground">%20 indirim - 15 Subat&apos;a kadar</p>
            <Progress value={65} className="mt-3" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ReportsTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Raporlar</h2>
        <p className="text-muted-foreground">Tesis performans raporlari</p>
      </div>
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Detayli raporlar veritabani baglantisi sonrasi aktif olacak.</p>
        </CardContent>
      </Card>
    </div>
  )
}

function PersonelTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Personel (IK)</h2>
        <p className="text-muted-foreground">Yeni personel dosyasi — IK_PERSONEL_ALANLARI ile uyumlu</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Personel Bilgi Formu</CardTitle>
          <CardDescription>Ad soyad, adres, adli sicil, is gecmisi, beklenti, is kanunu onay</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              alert("Form kaydi API baglantisi sonrasi aktif olacak.")
            }}
            className="space-y-6"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Ad Soyad</Label>
                <Input name="full_name" placeholder="Ad Soyad" required />
              </div>
              <div className="space-y-2">
                <Label>T.C. Kimlik No</Label>
                <Input name="tc" placeholder="T.C. Kimlik No" />
              </div>
              <div className="space-y-2">
                <Label>Dogum Tarihi</Label>
                <Input name="birth_date" type="date" />
              </div>
              <div className="space-y-2">
                <Label>Telefon</Label>
                <Input name="phone" placeholder="Telefon" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>E-posta</Label>
                <Input name="email" type="email" placeholder="E-posta" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Adres (ikametgah)</Label>
                <Input name="address" placeholder="Adres" />
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium text-foreground">Yasal / Guvenlik</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Adli sicil kaydi</Label>
                  <select name="adli_sicil" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="">Seciniz</option>
                    <option value="temiz">Goruntulendi / Temiz</option>
                    <option value="var">Var</option>
                  </select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Hastalik / saglik raporu (varsa aciklayin)</Label>
                  <Textarea name="health" placeholder="Hastalik var mi, varsa aciklayin" rows={2} />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium text-foreground">Is Gecmisi</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Onceki calistigi yer(ler)</Label>
                  <Input name="prev_work" placeholder="Yer adi" />
                </div>
                <div className="space-y-2">
                  <Label>Ne kadar sure calisti</Label>
                  <Input name="prev_duration" placeholder="Ornek: 2 yil" />
                </div>
                <div className="space-y-2">
                  <Label>Gorevi</Label>
                  <Input name="prev_role" placeholder="Gorev" />
                </div>
                <div className="space-y-2">
                  <Label>Ayrilis nedeni (kisa)</Label>
                  <Input name="leave_reason" placeholder="Kisa" />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium text-foreground">Beklenti ve Sure</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Maas / ucret beklentisi</Label>
                  <Input name="salary_expectation" placeholder="Beklenti" />
                </div>
                <div className="space-y-2">
                  <Label>Bizimle ne kadar sure calismayi dusunuyor</Label>
                  <Input name="duration_with_us" placeholder="Ornek: 2 yil" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Musaitlik (haftalik gun/saat)</Label>
                  <Input name="availability" placeholder="Ornek: Hafta ici 09-18" />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium text-foreground">Is kanunu ve kurallar</h4>
              <div className="space-y-2">
                <Label>Is sozlesmesi turu</Label>
                <select name="contract_type" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="">Seciniz</option>
                  <option value="belirsiz">Belirsiz sureli</option>
                  <option value="belirli">Belirli sureli</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" name="is_kanunu_onay" id="is_kanunu" className="rounded border-input" />
                <Label htmlFor="is_kanunu">Is kanununa gore bilgilendirme ve onay</Label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" name="sistem_gizlilik_onay" id="sistem_gizlilik" className="rounded border-input" />
                <Label htmlFor="sistem_gizlilik">Sistem ve veri kullanimi, gizlilik, fikri mulkiyet (NDA) onay</Label>
              </div>
            </div>
            <Button type="submit">Kaydet</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

function SettingsTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Tesis Ayarlari</h2>
        <p className="text-muted-foreground">Franchise ayarlarinizi yonetin</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Tesis Bilgileri</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Tesis Adi</label>
              <Input defaultValue="Istanbul Kadikoy" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Telefon</label>
              <Input defaultValue="+90 216 xxx xx xx" />
            </div>
          </div>
          <Button>Kaydet</Button>
        </CardContent>
      </Card>
    </div>
  )
}
