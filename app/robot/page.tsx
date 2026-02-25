"use client"

/**
 * YiSA-S Robot Arayuzu — 4 Robot Karti + Chat
 * CELF, Veri, Guvenlik, YiSA-S robotlari
 * Dark theme bg-zinc-950, cyan accent
 */

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  Database,
  Shield,
  Bot,
  Send,
  ChevronRight,
  Activity,
  Circle,
} from "lucide-react"
import Link from "next/link"

type RobotStatus = "aktif" | "pasif" | "beklemede"

interface Robot {
  id: string
  name: string
  description: string
  status: RobotStatus
  lastTask: string
  icon: typeof Brain
  color: string
  bgColor: string
  borderColor: string
  href: string
}

interface ChatMessage {
  id: string
  robot: string
  content: string
  timestamp: Date
  isUser: boolean
}

const ROBOTS: Robot[] = [
  {
    id: "celf",
    name: "CELF Robotu",
    description: "Merkezi karar motoru. Gorev dagitimi, onay surecleri, direktörluk yonetimi.",
    status: "aktif",
    lastTask: "Gorev dagitimi tamamlandi",
    icon: Brain,
    color: "text-cyan-400",
    bgColor: "bg-cyan-400/10",
    borderColor: "border-cyan-400/30",
    href: "/patron",
  },
  {
    id: "veri",
    name: "Veri Robotu",
    description: "Veritabani izleme, tablo durumu, satir sayilari, performans metrikleri.",
    status: "aktif",
    lastTask: "Tablo analizi tamamlandi",
    icon: Database,
    color: "text-emerald-400",
    bgColor: "bg-emerald-400/10",
    borderColor: "border-emerald-400/30",
    href: "/robot/veri",
  },
  {
    id: "guvenlik",
    name: "Guvenlik Robotu",
    description: "Siber guvenlik, yasak islem loglari, patron-lock, RLS kontrol.",
    status: "aktif",
    lastTask: "Guvenlik taramas\u0131 temiz",
    icon: Shield,
    color: "text-orange-400",
    bgColor: "bg-orange-400/10",
    borderColor: "border-orange-400/30",
    href: "/robot/guvenlik",
  },
  {
    id: "yisas",
    name: "YiSA-S Robotu",
    description: "Sistem durumu, PWA, deployment, servis izleme.",
    status: "beklemede",
    lastTask: "Sistem durumu: OK",
    icon: Bot,
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
    borderColor: "border-purple-400/30",
    href: "/robot",
  },
]

function getStatusBadge(status: RobotStatus) {
  switch (status) {
    case "aktif":
      return (
        <Badge variant="outline" className="border-emerald-500/50 text-emerald-400 bg-emerald-500/10 text-xs">
          <Circle className="h-2 w-2 mr-1 fill-emerald-400" />
          Aktif
        </Badge>
      )
    case "pasif":
      return (
        <Badge variant="outline" className="border-zinc-500/50 text-zinc-400 bg-zinc-500/10 text-xs">
          <Circle className="h-2 w-2 mr-1 fill-zinc-400" />
          Pasif
        </Badge>
      )
    case "beklemede":
      return (
        <Badge variant="outline" className="border-amber-500/50 text-amber-400 bg-amber-500/10 text-xs">
          <Circle className="h-2 w-2 mr-1 fill-amber-400" />
          Beklemede
        </Badge>
      )
  }
}

export default function RobotPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      robot: "CELF",
      content: "Merhaba Patron! Robot komuta merkezine hosgeldiniz. Size nasil yardimci olabilirim?",
      timestamp: new Date(),
      isUser: false,
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [selectedRobot, setSelectedRobot] = useState("CELF")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      robot: selectedRobot,
      content: inputValue.trim(),
      timestamp: new Date(),
      isUser: true,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")

    // Simulate robot response
    setTimeout(() => {
      const robotResponses: Record<string, string> = {
        CELF: `CELF analiz etti: "${inputValue.trim().slice(0, 50)}..." — Gorev olusturuldu ve ilgili direktorluge yonlendirildi.`,
        Veri: `Veri Robotu: Veritabani durumu kontrol edildi. 60+ tablo aktif, son yedekleme 2 saat once.`,
        Guvenlik: `Guvenlik Robotu: Mesaj taranıd — yasak kelime bulunamadi. Sistem guvenli.`,
        "YiSA-S": `YiSA-S Robotu: Sistem durumu normal. PWA aktif, tum servisler calisiyor.`,
      }

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        robot: selectedRobot,
        content: robotResponses[selectedRobot] ?? "Komut alindi.",
        timestamp: new Date(),
        isUser: false,
      }
      setMessages((prev) => [...prev, botMessage])
    }, 800)
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-cyan-400/10 flex items-center justify-center">
              <Bot className="h-5 w-5 text-cyan-400" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Robot Komuta Merkezi</h1>
              <p className="text-xs text-zinc-400">4 Robot Aktif Izleme</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-emerald-400" />
            <span className="text-sm text-emerald-400">Sistem Aktif</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Robot Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {ROBOTS.map((robot) => {
            const Icon = robot.icon
            return (
              <Link key={robot.id} href={robot.href}>
                <Card
                  className={`bg-zinc-900 ${robot.borderColor} border rounded-2xl hover:bg-zinc-800/80 transition-all cursor-pointer group`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className={`h-10 w-10 rounded-xl ${robot.bgColor} flex items-center justify-center`}>
                        <Icon className={`h-5 w-5 ${robot.color}`} strokeWidth={1.5} />
                      </div>
                      {getStatusBadge(robot.status)}
                    </div>
                    <CardTitle className="text-base font-semibold text-white mt-3">
                      {robot.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-zinc-400 mb-3 line-clamp-2">{robot.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-zinc-500 truncate max-w-[160px]">
                        {robot.lastTask}
                      </span>
                      <ChevronRight className="h-4 w-4 text-zinc-600 group-hover:text-cyan-400 transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* Chat Interface */}
        <Card className="bg-zinc-900 border-zinc-800 rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-zinc-800 pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-white">Robot Chat</CardTitle>
              <div className="flex gap-1">
                {["CELF", "Veri", "Guvenlik", "YiSA-S"].map((name) => (
                  <button
                    key={name}
                    onClick={() => setSelectedRobot(name)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      selectedRobot === name
                        ? "bg-cyan-400/20 text-cyan-400 border border-cyan-400/30"
                        : "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:bg-zinc-700"
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {/* Messages */}
            <div className="h-[320px] overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm ${
                      msg.isUser
                        ? "bg-cyan-400/20 text-cyan-100 border border-cyan-400/20"
                        : "bg-zinc-800 text-zinc-300 border border-zinc-700"
                    }`}
                  >
                    {!msg.isUser && (
                      <span className="text-xs font-medium text-cyan-400 block mb-1">
                        {msg.robot} Robotu
                      </span>
                    )}
                    <p>{msg.content}</p>
                    <span className="text-[10px] text-zinc-500 mt-1 block">
                      {msg.timestamp.toLocaleTimeString("tr-TR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-zinc-800 p-3 flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder={`${selectedRobot} Robotuna mesaj yaz...`}
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 h-10 rounded-xl"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="bg-cyan-500 hover:bg-cyan-600 text-white h-10 px-4 rounded-xl"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
