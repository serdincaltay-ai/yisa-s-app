"use client"

import { useEffect, useState, useRef } from "react"
import {
  Home,
  Wallet,
  Building2,
  Bot,
  Calendar,
  FolderOpen,
  Trophy,
  Dumbbell,
  UserCog,
  Briefcase,
  Cog,
  Users,
  Crown,
  Settings,
  Bell,
  Moon,
  Sun,
  Search,
  TrendingUp,
  TrendingDown,
  HardDrive,
  Wifi,
  ArrowUpRight,
  ArrowDownRight,
  type LucideIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function Dashboard() {
  const [theme, setTheme] = useState<"dark" | "light">("dark")
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeMenu, setActiveMenu] = useState("Ana Sayfa")
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Update time
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Red particle effect
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const particles: Particle[] = []
    const particleCount = 80

    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 2 + 1
        this.speedX = (Math.random() - 0.5) * 0.5
        this.speedY = (Math.random() - 0.5) * 0.5
        // Red particles
        this.color = `rgba(${Math.floor(Math.random() * 55) + 200}, ${Math.floor(Math.random() * 50) + 30}, ${Math.floor(Math.random() * 50) + 30}, ${Math.random() * 0.4 + 0.1})`
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.x > canvas.width) this.x = 0
        if (this.x < 0) this.x = canvas.width
        if (this.y > canvas.height) this.y = 0
        if (this.y < 0) this.y = canvas.height
      }

      draw() {
        if (!ctx) return
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    function animate() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const particle of particles) {
        particle.update()
        particle.draw()
      }

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      if (!canvas) return
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("tr-TR", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    })
  }

  const menuItems = [
    { icon: Home, label: "Ana Sayfa" },
    { icon: Wallet, label: "Kasa Defteri" },
    { icon: Building2, label: "Firma Platformları" },
    { icon: Bot, label: "Yapay Zeka Robotları" },
    { icon: Calendar, label: "Takvim" },
    { icon: FolderOpen, label: "Oluşturulan İçerikler" },
    { icon: Trophy, label: "Sporcu İçerikleri" },
    { icon: Dumbbell, label: "Antrenör İçerikleri" },
    { icon: UserCog, label: "Rol İçerikleri" },
    { icon: Briefcase, label: "İşletme İçerikleri" },
    { icon: Cog, label: "Robot Hizmetleri" },
    { icon: Users, label: "Üye İçerikleri" },
    { icon: Crown, label: "Kurucu İçerikleri" },
    { icon: Settings, label: "Ayarlar" },
  ]

  return (
    <div
      className={`${theme} min-h-screen bg-gradient-to-br from-black via-slate-900 to-red-950/30 text-slate-100 relative overflow-hidden`}
    >
      {/* Background particle effect */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-40" />

      <div className="container mx-auto p-4 relative z-10">
        {/* Header */}
        <header className="flex items-center justify-between py-4 border-b border-slate-700/50 mb-6 backdrop-blur-sm">
          <div>
            <h1 className="text-2xl font-bold text-slate-100">{activeMenu}</h1>
          </div>

          <div className="flex items-center gap-4">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/50 hover:bg-green-500/30">
              <div className="h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
              SİSTEM AKTİF
            </Badge>

            <div className="hidden md:flex items-center gap-2 bg-slate-800/50 rounded-full px-4 py-2 border border-slate-700/50 backdrop-blur-sm">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Ara..."
                className="bg-transparent border-none focus:outline-none text-sm w-32 placeholder:text-slate-500"
              />
            </div>

            <div className="flex flex-col items-end text-xs">
              <div className="font-mono text-red-400 text-lg">{formatTime(currentTime)}</div>
              <div className="text-slate-400 text-[10px]">{formatDate(currentTime)}</div>
            </div>

            <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-slate-100">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center">
                3
              </span>
            </Button>

            <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-slate-400 hover:text-slate-100">
              {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>

            <Avatar>
              <AvatarFallback className="bg-slate-700 text-red-400">SÇ</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - 2 cols */}
          <div className="col-span-12 lg:col-span-2">
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="p-4">
                {/* Logo */}
                <div className="flex flex-col items-center mb-6 pb-6 border-b border-slate-700/50">
                  <div className="relative w-16 h-16 mb-2">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-700 opacity-20 blur-xl"></div>
                    <div className="relative w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-lg flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">YS</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                      YİSA-S
                    </div>
                    <div className="text-[10px] text-slate-400">PATRON</div>
                  </div>
                </div>

                {/* Menu Items */}
                <nav className="space-y-1">
                  {menuItems.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => setActiveMenu(item.label)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                        activeMenu === item.label
                          ? "bg-red-500/20 border border-red-500/50 text-red-400"
                          : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
                      }`}
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      <span className="text-xs font-medium truncate">{item.label}</span>
                    </button>
                  ))}
                </nav>

                {/* System Status */}
                <div className="mt-6 pt-6 border-t border-slate-700/50 space-y-3">
                  <div className="text-[10px] text-slate-500 font-mono mb-2">SİSTEM DURUMU</div>
                  <StatusBar label="Ana Sistem" value={92} color="bg-green-500" />
                  <StatusBar label="Güvenlik" value={88} color="bg-blue-500" />
                  <StatusBar label="Ağ" value={95} color="bg-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - 7 cols */}
          <div className="col-span-12 lg:col-span-7">
            <div className="space-y-6">
              {/* Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <MetricCard title="Robot Yükü" value={67} icon={Bot} color="red" trend="up" trendValue="+5%" />
                <MetricCard
                  title="Hafıza Kullanımı"
                  value={72}
                  icon={HardDrive}
                  color="purple"
                  trend="stable"
                  trendValue="0%"
                />
                <MetricCard title="Ağ Durumu" value={94} icon={Wifi} color="blue" trend="down" trendValue="-2%" />
              </div>

              {/* Tabs Section */}
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <Tabs defaultValue="kasa" className="w-full">
                    <TabsList className="bg-slate-800/50 p-1 mb-6">
                      <TabsTrigger
                        value="kasa"
                        className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400"
                      >
                        Kasa
                      </TabsTrigger>
                      <TabsTrigger
                        value="firmalar"
                        className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400"
                      >
                        Firmalar
                      </TabsTrigger>
                      <TabsTrigger
                        value="takvim"
                        className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400"
                      >
                        Takvim
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="kasa" className="mt-0">
                      <div className="space-y-4">
                        {/* Stat Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <StatCard title="Günlük Gelir" value="₺12,450" color="green" />
                          <StatCard title="Günlük Gider" value="₺3,280" color="red" />
                          <StatCard title="Aylık Gelir" value="₺387,200" color="blue" />
                          <StatCard title="Mevcut Bakiye" value="₺124,870" color="purple" />
                        </div>

                        {/* Transaction List */}
                        <div className="bg-slate-800/30 rounded-lg border border-slate-700/50 overflow-hidden">
                          <div className="p-3 border-b border-slate-700/50 bg-slate-800/50">
                            <h3 className="text-sm font-semibold text-slate-100">Son İşlemler</h3>
                          </div>
                          <div className="divide-y divide-slate-700/30">
                            <TransactionRow
                              type="income"
                              title="Üyelik Ödemesi - BJK Tuzla"
                              date="06 Oca 2026, 14:30"
                              amount="₺450"
                            />
                            <TransactionRow
                              type="expense"
                              title="Ekipman Alımı"
                              date="06 Oca 2026, 11:15"
                              amount="₺1,200"
                            />
                            <TransactionRow
                              type="income"
                              title="Üyelik Ödemesi - SP Pilates"
                              date="06 Oca 2026, 09:45"
                              amount="₺350"
                            />
                            <TransactionRow
                              type="expense"
                              title="Kira Ödemesi"
                              date="05 Oca 2026, 16:00"
                              amount="₺8,500"
                            />
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="firmalar" className="mt-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <CompanyCard
                          name="BJK Tuzla Jimnastik"
                          emoji="🤸"
                          status="aktif"
                          members={127}
                          trainers={12}
                          revenue="₺45,000"
                        />
                        <CompanyCard
                          name="SP Pilates Studio"
                          emoji="🧘"
                          status="aktif"
                          members={85}
                          trainers={6}
                          revenue="₺32,000"
                        />
                        <CompanyCard
                          name="Hobi GYM Tuzla"
                          emoji="💪"
                          status="aktif"
                          members={203}
                          trainers={18}
                          revenue="₺67,500"
                        />
                        <CompanyCard
                          name="Yoga Merkezi"
                          emoji="🕉️"
                          status="bakımda"
                          members={42}
                          trainers={4}
                          revenue="₺18,200"
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="takvim" className="mt-0">
                      <div className="bg-slate-800/30 rounded-lg border border-slate-700/50 p-6">
                        <div className="text-center text-slate-400">
                          <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                          <p className="text-sm">Takvim görünümü yakında eklenecek</p>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Sidebar - 3 cols */}
          <div className="col-span-12 lg:col-span-3">
            <div className="space-y-6">
              {/* AI Robots */}
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center">
                    <Bot className="mr-2 h-5 w-5 text-red-400" />
                    Yapay Zeka Robotları
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <RobotItem name="İçerik Üretici" status="aktif" load={45} />
                  <RobotItem name="Sosyal Medya" status="aktif" load={72} />
                  <RobotItem name="Analiz Motoru" status="beklemede" load={12} />
                  <RobotItem name="Rapor Oluşturucu" status="aktif" load={88} />
                </CardContent>
              </Card>

              {/* Recent Activities */}
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center">
                    <Trophy className="mr-2 h-5 w-5 text-red-400" />
                    Son Aktiviteler
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ActivityItem title="Yeni üye kaydı" subtitle="BJK Tuzla Jimnastik" time="5 dk önce" />
                  <ActivityItem title="İçerik yayınlandı" subtitle="Instagram - Antrenman programı" time="23 dk önce" />
                  <ActivityItem title="Ödeme alındı" subtitle="SP Pilates Studio - ₺350" time="1 saat önce" />
                  <ActivityItem
                    title="Robot görevi tamamlandı"
                    subtitle="Haftalık rapor oluşturuldu"
                    time="2 saat önce"
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper Components
function StatusBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <Progress value={value} className="h-1.5 bg-slate-800">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${value}%` }} />
      </Progress>
    </div>
  )
}

function MetricCard({
  title,
  value,
  icon: Icon,
  color,
  trend,
  trendValue,
}: {
  title: string
  value: number
  icon: LucideIcon
  color: "red" | "purple" | "blue"
  trend: "up" | "down" | "stable"
  trendValue: string
}) {
  const colorClasses = {
    red: "text-red-400 bg-red-500/20",
    purple: "text-purple-400 bg-purple-500/20",
    blue: "text-blue-400 bg-blue-500/20",
  }

  return (
    <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex items-center gap-1 text-xs">
            {trend === "up" && <TrendingUp className="h-3 w-3 text-green-400" />}
            {trend === "down" && <TrendingDown className="h-3 w-3 text-red-400" />}
            <span className={trend === "up" ? "text-green-400" : trend === "down" ? "text-red-400" : "text-slate-400"}>
              {trendValue}
            </span>
          </div>
        </div>
        <div className="text-2xl font-bold text-slate-100 mb-1">{value}%</div>
        <div className="text-xs text-slate-400">{title}</div>
        <Progress value={value} className="h-1.5 bg-slate-800 mt-3">
          <div
            className={`h-full ${colorClasses[color].split(" ")[1].replace("/20", "")} rounded-full transition-all`}
            style={{ width: `${value}%` }}
          />
        </Progress>
      </CardContent>
    </Card>
  )
}

function StatCard({ title, value, color }: { title: string; value: string; color: string }) {
  const colorClasses = {
    green: "bg-green-500/20 border-green-500/50 text-green-400",
    red: "bg-red-500/20 border-red-500/50 text-red-400",
    blue: "bg-blue-500/20 border-blue-500/50 text-blue-400",
    purple: "bg-purple-500/20 border-purple-500/50 text-purple-400",
  }

  return (
    <div className={`p-4 rounded-lg border ${colorClasses[color as keyof typeof colorClasses]} backdrop-blur-sm`}>
      <div className="text-xs text-slate-400 mb-2">{title}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  )
}

function TransactionRow({
  type,
  title,
  date,
  amount,
}: {
  type: "income" | "expense"
  title: string
  date: string
  amount: string
}) {
  return (
    <div className="flex items-center justify-between p-3 hover:bg-slate-800/30 transition-colors">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${type === "income" ? "bg-green-500/20" : "bg-red-500/20"}`}>
          {type === "income" ? (
            <ArrowUpRight className="h-4 w-4 text-green-400" />
          ) : (
            <ArrowDownRight className="h-4 w-4 text-red-400" />
          )}
        </div>
        <div>
          <div className="text-sm text-slate-100">{title}</div>
          <div className="text-xs text-slate-500">{date}</div>
        </div>
      </div>
      <div className={`text-sm font-semibold ${type === "income" ? "text-green-400" : "text-red-400"}`}>
        {type === "income" ? "+" : "-"}
        {amount}
      </div>
    </div>
  )
}

function CompanyCard({
  name,
  emoji,
  status,
  members,
  trainers,
  revenue,
}: {
  name: string
  emoji: string
  status: string
  members: number
  trainers: number
  revenue: string
}) {
  return (
    <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm hover:border-red-500/50 transition-all">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="text-3xl">{emoji}</div>
          <Badge
            variant="outline"
            className={`text-xs ${
              status === "aktif"
                ? "bg-green-500/20 text-green-400 border-green-500/50"
                : "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
            }`}
          >
            {status}
          </Badge>
        </div>
        <h3 className="font-semibold text-slate-100 mb-3">{name}</h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <div className="text-slate-500">Üyeler</div>
            <div className="text-slate-100 font-semibold">{members}</div>
          </div>
          <div>
            <div className="text-slate-500">Antrenörler</div>
            <div className="text-slate-100 font-semibold">{trainers}</div>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-700/50">
          <div className="text-xs text-slate-500">Aylık Gelir</div>
          <div className="text-lg font-bold text-red-400">{revenue}</div>
        </div>
      </CardContent>
    </Card>
  )
}

function RobotItem({ name, status, load }: { name: string; status: string; load: number }) {
  return (
    <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/50">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-slate-100">{name}</div>
        <Badge
          variant="outline"
          className={`text-[10px] ${
            status === "aktif"
              ? "bg-green-500/20 text-green-400 border-green-500/50"
              : "bg-slate-500/20 text-slate-400 border-slate-500/50"
          }`}
        >
          {status}
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <Progress value={load} className="h-1.5 bg-slate-700 flex-1">
          <div
            className={`h-full rounded-full transition-all ${
              load > 80 ? "bg-red-500" : load > 50 ? "bg-yellow-500" : "bg-green-500"
            }`}
            style={{ width: `${load}%` }}
          />
        </Progress>
        <span className="text-xs text-slate-400">{load}%</span>
      </div>
    </div>
  )
}

function ActivityItem({ title, subtitle, time }: { title: string; subtitle: string; time: string }) {
  return (
    <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-800/30 transition-colors">
      <div className="h-2 w-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-sm text-slate-100 truncate">{title}</div>
        <div className="text-xs text-slate-500 truncate">{subtitle}</div>
        <div className="text-[10px] text-slate-600 mt-0.5">{time}</div>
      </div>
    </div>
  )
}
