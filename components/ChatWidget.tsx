"use client"

import { useState, useRef, useEffect } from "react"
import { usePathname } from "next/navigation"
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Building2,
  Users,
  Dumbbell,
} from "lucide-react"

/* ================================================================
   LiSES Robot Chat Widget — Floating sag-alt kose
   Franchise / Veli / Antrenor yonlendirme
   Demo talep takibi
   ================================================================ */

type UserType = "franchise" | "veli" | "antrenor" | null

interface ChatMessage {
  id: string
  role: "user" | "bot"
  text: string
  ts: number
}

const WELCOME_MSG: ChatMessage = {
  id: "welcome",
  role: "bot",
  text: "Merhaba! Ben LiSES, YiSA-S yapay zeka asistanınız. Size nasıl yardımcı olabilirim?",
  ts: Date.now(),
}

const USER_TYPE_OPTIONS = [
  {
    type: "franchise" as UserType,
    label: "Franchise / Okul Sahibi",
    icon: Building2,
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10 hover:bg-cyan-500/20",
  },
  {
    type: "veli" as UserType,
    label: "Veli / Aile",
    icon: Users,
    color: "text-orange-400",
    bgColor: "bg-orange-500/10 hover:bg-orange-500/20",
  },
  {
    type: "antrenor" as UserType,
    label: "Antrenör / Eğitmen",
    icon: Dumbbell,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10 hover:bg-emerald-500/20",
  },
]

const RESPONSES: Record<string, string[]> = {
  franchise: [
    "Franchise başvurusu için bilgilerinizi paylaşır mısınız? Ad, şehir ve iletişim numaranız yeterli.",
    "YiSA-S franchise sistemi ile kendi spor okulunuzu dijitalleştirebilirsiniz. Aylık abonelik modeli ile çalışıyoruz.",
    "Demo talebinizi oluşturduk! Ekibimiz en kısa sürede sizinle iletişime geçecek.",
  ],
  veli: [
    "Çocuğunuzun gelişim takibi, ders programı ve ödeme işlemleri için veli panelimizi kullanabilirsiniz.",
    "Deneme dersi için hangi branşla ilgileniyorsunuz? Cimnastik, basketbol, voleybol, yüzme, futbol veya tenis?",
    "Kaydınızı oluşturduk! Yakında sizinle iletişime geçeceğiz.",
  ],
  antrenor: [
    "Antrenör panelinden yoklama, ölçüm ve sınıf yönetimi yapabilirsiniz.",
    "Haftalık ders programınızı görüntülemek ve sporcu gelişim raporlarını takip etmek için giriş yapabilirsiniz.",
    "Bilgilerinizi aldık, antrenör hesabınız en kısa sürede oluşturulacak.",
  ],
}

export default function ChatWidget() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [userType, setUserType] = useState<UserType>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MSG])
  const [input, setInput] = useState("")
  const [responseIdx, setResponseIdx] = useState(0)
  const responseIdxRef = useRef(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Embed sayfalarinda widget gosterme — tum hook'lardan SONRA
  if (pathname?.startsWith("/embed")) {
    return null
  }

  function selectUserType(type: UserType) {
    setUserType(type)
    const introMsg: ChatMessage = {
      id: `bot-intro-${Date.now()}`,
      role: "bot",
      text:
        type === "franchise"
          ? "Harika! Franchise/okul sahibi olarak size nasıl yardımcı olabilirim? Yeni franchise başvurusu, mevcut sistem hakkında bilgi veya demo talep edebilirsiniz."
          : type === "veli"
            ? "Hoş geldiniz! Veli olarak deneme dersi kaydı, çocuk gelişim takibi veya ödeme işlemleri hakkında bilgi alabilirsiniz."
            : "Merhaba hocam! Antrenör paneli, yoklama sistemi veya sporcu ölçüm takibi hakkında bilgi alabilirsiniz.",
      ts: Date.now(),
    }
    setMessages((prev) => [...prev, introMsg])
  }

  function handleSend() {
    if (!input.trim()) return

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: input.trim(),
      ts: Date.now(),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput("")

    // Auto-reply based on userType
    setTimeout(() => {
      const pool = RESPONSES[userType || "franchise"] || RESPONSES.franchise
      const currentIdx = responseIdxRef.current
      const reply = pool[currentIdx % pool.length]
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: "bot",
        text: reply,
        ts: Date.now(),
      }
      setMessages((prev) => [...prev, botMsg])
      responseIdxRef.current = currentIdx + 1
      setResponseIdx(currentIdx + 1)
    }, 600)
  }

  function handleReset() {
    setUserType(null)
    setMessages([WELCOME_MSG])
    setResponseIdx(0)
    responseIdxRef.current = 0
  }

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-600/30 flex items-center justify-center transition-all hover:scale-110"
          aria-label="Chat aç"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-32px)] h-[520px] max-h-[calc(100vh-48px)] flex flex-col bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-zinc-900 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-cyan-400" />
              <div>
                <span className="text-sm font-semibold text-white">
                  LiSES
                </span>
                <span className="text-xs text-zinc-500 ml-2">
                  YiSA-S AI Asistan
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {userType && (
                <button
                  onClick={handleReset}
                  className="text-xs text-zinc-500 hover:text-zinc-300 px-2 py-1 rounded"
                >
                  Sıfırla
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-zinc-500 hover:text-white rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* User Type Selection */}
          {!userType && (
            <div className="p-4 space-y-2 border-b border-zinc-800">
              <p className="text-xs text-zinc-400 mb-2">
                Sizi doğru yönlendirebilmem için kim olduğunuzu seçin:
              </p>
              {USER_TYPE_OPTIONS.map((opt) => (
                <button
                  key={opt.type}
                  onClick={() => selectUserType(opt.type)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl ${opt.bgColor} border border-transparent hover:border-zinc-700 transition-all`}
                >
                  <opt.icon className={`w-5 h-5 ${opt.color}`} />
                  <span className="text-sm text-white font-medium">
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "bot" && (
                  <div className="w-7 h-7 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="w-4 h-4 text-cyan-400" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-cyan-600 text-white rounded-br-md"
                      : "bg-zinc-800 text-zinc-200 rounded-bl-md"
                  }`}
                >
                  {msg.text}
                </div>
                {msg.role === "user" && (
                  <div className="w-7 h-7 rounded-full bg-zinc-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="w-4 h-4 text-zinc-300" />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 px-4 py-3 bg-zinc-900 border-t border-zinc-800">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={
                userType
                  ? "Mesajınızı yazın..."
                  : "Önce yukarıdan profil seçin..."
              }
              disabled={!userType}
              className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 disabled:opacity-40"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || !userType}
              className="p-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
