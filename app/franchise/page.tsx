"use client"

import React, { useEffect, useCallback, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
  BarChart3,
  Coins,
  ShoppingBag,
  ShoppingCart,
  Calendar,
  FileText,
  Heart,
  Megaphone,
  UserPlus,
  Wallet,
  Loader2,
  ClipboardCheck,
  MapPin,
  Phone,
  Facebook,
  Instagram,
  Youtube,
  ChevronDown,
  Star,
  Award,
  Target,
  Clock,
  CheckCircle2,
  ArrowRight,
  Menu,
  X,
  Mail,
  Sparkles
} from "lucide-react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import Image from "next/image"

type Athlete = { id: string; name: string; surname?: string | null; birth_date?: string | null; gender?: string | null; branch?: string | null; level?: string | null; status?: string; created_at?: string }
type StaffMember = {
  id: string; name: string; surname?: string | null; email?: string | null; phone?: string | null; role?: string; branch?: string | null; is_active?: boolean; created_at?: string;
  birth_date?: string | null; address?: string | null; city?: string | null; district?: string | null; previous_work?: string | null; chronic_condition?: string | null; has_driving_license?: boolean | null; languages?: string | null;
}
type TenantInfo = { id: string; name: string; slug?: string; status?: string; packageType?: string; tokenBalance?: number; franchise?: { businessName?: string; contactName?: string; memberCount?: number; staffCount?: number; monthlyRevenue?: number; phone?: string; address?: string; city?: string; district?: string } }

const navItems = [
  { label: "ANA SAYFA", href: "#", active: true },
  { label: "HAKKIMIZDA", href: "#about" },
  { label: "PROGRAMLAR", href: "#programs" },
  { label: "ANTRENÖRLER", href: "#trainers" },
  { label: "GALERİ", href: "#gallery" },
  { label: "İLETİŞİM", href: "#contact" },
]

export default function FranchiseTenantPage() {
  const router = useRouter()
  const [tenant, setTenant] = useState<TenantInfo | null>(null)
  const [athletes, setAthletes] = useState<Athlete[]>([])
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)

  const fetchTenant = useCallback(async () => {
    const res = await fetch("/api/franchise/tenant")
    const data = await res.json()
    if (data.tenant) setTenant(data.tenant)
  }, [])

  const fetchAthletes = useCallback(async () => {
    const res = await fetch("/api/franchise/athletes")
    const data = await res.json()
    setAthletes(Array.isArray(data.items) ? data.items : [])
  }, [])

  const fetchStaff = useCallback(async () => {
    const res = await fetch("/api/franchise/staff")
    const data = await res.json()
    setStaff(Array.isArray(data.items) ? data.items : [])
  }, [])

  useEffect(() => {
    Promise.all([fetchTenant(), fetchAthletes(), fetchStaff()]).finally(() => setLoading(false))
  }, [fetchTenant, fetchAthletes, fetchStaff])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  const tenantName = tenant?.name ?? "Spor Akademisi"
  const tenantPhone = tenant?.franchise?.phone ?? "0530 000 00 00"
  const tenantAddress = tenant?.franchise?.address ?? "Adres bilgisi"
  const tenantCity = tenant?.franchise?.city ?? ""
  const tenantDistrict = tenant?.franchise?.district ?? ""

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Top Bar */}
      <div className="bg-zinc-900 border-b border-zinc-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-10 text-sm">
            <div className="flex items-center gap-6">
              <Link href="#contact" className="flex items-center gap-2 text-zinc-300 hover:text-primary transition-colors">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="hidden sm:inline">TESİSİMİZ</span>
              </Link>
              <a href={`tel:${tenantPhone.replace(/\s/g, '')}`} className="flex items-center gap-2 text-zinc-300 hover:text-primary transition-colors">
                <Phone className="h-4 w-4 text-primary" />
                <span>{tenantPhone}</span>
              </a>
            </div>
            
            <div className="flex items-center gap-4">
              <Button 
                size="sm" 
                className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold px-4 rounded-sm"
                onClick={() => router.push('/kayit')}
              >
                DENEME DERSİ KAYIT FORMU
              </Button>
              <div className="hidden sm:flex items-center gap-2">
                <Link href="#" className="h-8 w-8 bg-zinc-700 hover:bg-primary rounded-sm flex items-center justify-center transition-colors">
                  <Facebook className="h-4 w-4" />
                </Link>
                <Link href="#" className="h-8 w-8 bg-zinc-700 hover:bg-primary rounded-sm flex items-center justify-center transition-colors">
                  <Instagram className="h-4 w-4" />
                </Link>
                <Link href="#" className="h-8 w-8 bg-zinc-700 hover:bg-primary rounded-sm flex items-center justify-center transition-colors">
                  <Youtube className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-zinc-950/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/franchise" className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-emerald-500">
                <Activity className="h-7 w-7 text-zinc-950" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white leading-tight">{tenantName}</h1>
                <p className="text-xs text-primary">Spor Akademisi</p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    item.active 
                      ? 'text-white border-b-2 border-primary' 
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Partner Logo Area */}
            <div className="hidden lg:flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-zinc-800 flex items-center justify-center">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <div className="text-right">
                <p className="text-xs text-zinc-400">Powered by</p>
                <p className="text-sm font-bold text-white">YİSA-S</p>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-zinc-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden absolute left-0 right-0 top-full bg-zinc-900 border-b border-zinc-800 py-4">
              <nav className="flex flex-col">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-6 py-3 text-sm font-medium ${
                      item.active ? 'text-primary bg-zinc-800' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=1920&q=80')`
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 leading-tight mb-6 animate-fade-in">
              {tenantCity ? `${tenantCity}'da Bir İlk` : "Bölgenizde Bir İlk"}
            </h2>
            <p className="text-xl sm:text-2xl text-zinc-200 mb-8 max-w-2xl mx-auto">
              Profesyonel eğitmenler eşliğinde, modern tesislerde spor eğitimi
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-rose-600 hover:bg-rose-700 text-white text-lg px-8 py-6 rounded-sm"
                onClick={() => router.push('/kayit')}
              >
                ÜCRETSİZ DENEME DERSİ
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-6 rounded-sm bg-transparent"
              >
                PROGRAMLARI İNCELE
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-8 w-8 text-white/60" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-zinc-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatItem value={athletes.length > 0 ? athletes.length.toString() : "100+"} label="Aktif Öğrenci" icon={Users} />
            <StatItem value={staff.length > 0 ? staff.length.toString() : "10+"} label="Uzman Eğitmen" icon={Award} />
            <StatItem value="5+" label="Farklı Branş" icon={Target} />
            <StatItem value="10+" label="Yıllık Tecrübe" icon={Clock} />
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-20 bg-zinc-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4">Eğitim Programlarımız</h3>
            <p className="text-zinc-400 max-w-2xl mx-auto">Her yaş ve seviyeye uygun programlarla spor eğitimi</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <ProgramCard 
              title="Artistik Cimnastik"
              description="Esneklik, güç ve zarafetin birleştiği temel cimnastik eğitimi"
              image="https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=600&q=80"
              ageRange="4-16 Yaş"
            />
            <ProgramCard 
              title="Ritmik Cimnastik"
              description="Müzik eşliğinde aparatlarla estetik hareketler"
              image="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80"
              ageRange="5-18 Yaş"
            />
            <ProgramCard 
              title="Trampolin"
              description="Eğlenceli ve enerjik trampolin eğitimi"
              image="https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&q=80"
              ageRange="6-16 Yaş"
            />
          </div>
        </div>
      </section>

      {/* Trainers Section */}
      <section id="trainers" className="py-20 bg-zinc-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4">Antrenörlerimiz</h3>
            <p className="text-zinc-400 max-w-2xl mx-auto">Deneyimli ve sertifikalı eğitmen kadromuz</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {staff.length > 0 ? (
              staff.slice(0, 3).map((s) => (
                <TrainerCard 
                  key={s.id}
                  name={`${s.name} ${s.surname ?? ''}`}
                  role={s.role ?? "Antrenör"}
                  branch={s.branch ?? "Genel"}
                />
              ))
            ) : (
              <>
                <TrainerCard name="Mehmet Yıldız" role="Baş Antrenör" branch="Artistik Cimnastik" />
                <TrainerCard name="Ayşe Çelik" role="Antrenör" branch="Ritmik Cimnastik" />
                <TrainerCard name="Ali Korkmaz" role="Antrenör" branch="Trampolin" />
              </>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-rose-600 to-pink-600">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Hemen Başlayın!
          </h3>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Ücretsiz deneme dersi için kayıt olun, çocuğunuzun spor yolculuğuna ilk adımı atın.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-rose-600 hover:bg-zinc-100 text-lg px-10 py-6 rounded-sm font-bold"
            onClick={() => router.push('/kayit')}
          >
            DENEME DERSİ KAYIT FORMU
          </Button>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-zinc-950">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-3xl font-bold text-white mb-6">İletişim</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Adres</p>
                    <p className="text-zinc-400">{tenantAddress}{tenantDistrict ? `, ${tenantDistrict}` : ''}{tenantCity ? `, ${tenantCity}` : ''}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Telefon</p>
                    <a href={`tel:${tenantPhone.replace(/\s/g, '')}`} className="text-zinc-400 hover:text-primary transition-colors">{tenantPhone}</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-white font-medium">E-posta</p>
                    <a href="mailto:info@example.com" className="text-zinc-400 hover:text-primary transition-colors">info@{tenant?.slug ?? 'example'}.com</a>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-8">
                <p className="text-white font-medium mb-4">Bizi Takip Edin</p>
                <div className="flex items-center gap-3">
                  <Link href="#" className="h-10 w-10 bg-zinc-800 hover:bg-primary rounded-full flex items-center justify-center transition-colors">
                    <Facebook className="h-5 w-5" />
                  </Link>
                  <Link href="#" className="h-10 w-10 bg-zinc-800 hover:bg-primary rounded-full flex items-center justify-center transition-colors">
                    <Instagram className="h-5 w-5" />
                  </Link>
                  <Link href="#" className="h-10 w-10 bg-zinc-800 hover:bg-primary rounded-full flex items-center justify-center transition-colors">
                    <Youtube className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 rounded-xl p-6">
              <h4 className="text-xl font-bold text-white mb-4">Bize Ulaşın</h4>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="Adınız" className="bg-zinc-800 border-zinc-700" />
                  <Input placeholder="Soyadınız" className="bg-zinc-800 border-zinc-700" />
                </div>
                <Input placeholder="E-posta" type="email" className="bg-zinc-800 border-zinc-700" />
                <Input placeholder="Telefon" type="tel" className="bg-zinc-800 border-zinc-700" />
                <textarea 
                  placeholder="Mesajınız" 
                  rows={4}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button className="w-full bg-rose-600 hover:bg-rose-700">
                  GÖNDER
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-900 border-t border-zinc-800 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center">
                <Activity className="h-5 w-5 text-zinc-950" />
              </div>
              <span className="text-white font-bold">{tenantName}</span>
            </div>
            <p className="text-zinc-500 text-sm">
              © 2026 {tenantName}. Tüm hakları saklıdır. Powered by <span className="text-primary">YİSA-S</span>
            </p>
          </div>
        </div>
      </footer>

      {/* Admin Panel Entry Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button 
          size="lg"
          className="bg-primary hover:bg-primary/90 text-zinc-950 shadow-lg rounded-full h-14 w-14"
          onClick={() => router.push('/franchise/yoklama')}
        >
          <Settings className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}

function StatItem({ value, label, icon: Icon }: { value: string; label: string; icon: React.ElementType }) {
  return (
    <div className="text-center">
      <div className="h-14 w-14 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
        <Icon className="h-7 w-7 text-primary" />
      </div>
      <p className="text-3xl sm:text-4xl font-bold text-white mb-1">{value}</p>
      <p className="text-zinc-400">{label}</p>
    </div>
  )
}

function ProgramCard({ title, description, image, ageRange }: { title: string; description: string; image: string; ageRange: string }) {
  return (
    <Card className="bg-zinc-900 border-zinc-800 overflow-hidden group cursor-pointer hover:border-primary/50 transition-colors">
      <div className="relative h-48 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
          style={{ backgroundImage: `url('${image}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />
        <Badge className="absolute top-4 right-4 bg-rose-600 text-white">{ageRange}</Badge>
      </div>
      <CardContent className="p-6">
        <h4 className="text-xl font-bold text-white mb-2">{title}</h4>
        <p className="text-zinc-400 text-sm">{description}</p>
        <Button variant="link" className="text-primary p-0 mt-4">
          Detaylı Bilgi <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  )
}

function TrainerCard({ name, role, branch }: { name: string; role: string; branch: string }) {
  return (
    <Card className="bg-zinc-800 border-zinc-700 overflow-hidden group">
      <div className="relative h-56 bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center">
        <div className="h-24 w-24 rounded-full bg-zinc-600 flex items-center justify-center">
          <Users className="h-12 w-12 text-zinc-400" />
        </div>
      </div>
      <CardContent className="p-6 text-center">
        <h4 className="text-lg font-bold text-white">{name}</h4>
        <p className="text-primary text-sm font-medium">{role}</p>
        <p className="text-zinc-400 text-sm mt-1">{branch}</p>
        <div className="flex items-center justify-center gap-1 mt-3">
          {[1,2,3,4,5].map((i) => (
            <Star key={i} className="h-4 w-4 fill-amber-500 text-amber-500" />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
