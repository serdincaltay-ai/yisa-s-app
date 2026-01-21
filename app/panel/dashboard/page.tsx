'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { Send, Paperclip, X, FileText, Image, LogOut } from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  file?: { name: string; type: string }
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: 'Merhaba Patron! Ben YİSA-S Robot. Emrinizdeyim.' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [fileContent, setFileContent] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const router = useRouter()

  useEffect(() => {
    getUser()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + 'px'
    }
  }, [input])

  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) setUser(user)
  }

  const handleLogout = async () => {
    try {
      // Supabase oturumunu kapat
      await supabase.auth.signOut()
      
      // Tüm cookie'leri temizle
      document.cookie.split(";").forEach((c) => {
        const name = c.split("=")[0].trim();
        document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      });
      
      // localStorage temizle
      localStorage.clear();
      
      // Ana sayfaya yönlendir
      router.push('/?logout=success')
      router.refresh()
    } catch (error) {
      console.error('Çıkış hatası:', error)
      router.push('/')
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return
    setFile(selectedFile)
    if (selectedFile.type.startsWith('text/') || selectedFile.name.match(/\.(txt|md|json|csv)$/)) {
      setFileContent(await selectedFile.text())
    }
  }

  const removeFile = () => {
    setFile(null)
    setFileContent('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const sendMessage = async () => {
    if ((!input.trim() && !file) || loading) return

    let messageContent = input.trim()
    if (file && fileContent) {
      messageContent = `[Dosya: ${file.name}]\n\n${fileContent.substring(0, 3000)}\n\n${messageContent || 'Analiz et.'}`
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim() || `Dosya: ${file?.name}`,
      file: file ? { name: file.name, type: file.type } : undefined
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    removeFile()
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageContent,
          userId: 'patron',
          sessionId: Date.now().toString(),
          hasFile: !!file,
          fileName: file?.name,
          fileContent
        })
      })
      const data = await res.json()
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message || 'Hata oluştu.'
      }])
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Bağlantı hatası.'
      }])
    }
    setLoading(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <span className="text-slate-900 font-bold">Y</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">YİSA-S Patron Paneli</h1>
              <p className="text-xs text-emerald-400">Robot Aktif</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400">{user?.email}</span>
            <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-400">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-4 py-3 rounded-2xl ${msg.role === 'user' ? 'bg-amber-500 text-slate-900' : 'bg-slate-800 text-white'}`}>
                {msg.file && (
                  <div className="flex items-center gap-2 mb-2 text-xs opacity-75">
                    {msg.file.type.startsWith('image/') ? <Image size={14} /> : <FileText size={14} />}
                    {msg.file.name}
                  </div>
                )}
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-800 text-white px-4 py-3 rounded-2xl animate-pulse">Yazıyor...</div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* File Preview */}
      {file && (
        <div className="max-w-4xl mx-auto px-4">
          <div className="p-2 bg-slate-800 rounded-lg flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <FileText size={16} />
              <span className="truncate max-w-[300px]">{file.name}</span>
            </div>
            <button onClick={removeFile} className="text-red-400"><X size={16} /></button>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="bg-slate-900 border-t border-slate-800 p-4">
        <div className="max-w-4xl mx-auto flex gap-2 items-end">
          <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
          <button onClick={() => fileInputRef.current?.click()} className="p-3 text-slate-400 hover:text-amber-500 rounded-xl">
            <Paperclip size={20} />
          </button>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Komutunuzu yazın Patron..."
            rows={1}
            className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none"
          />
          <button onClick={sendMessage} disabled={loading || (!input.trim() && !file)} className="p-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl disabled:opacity-50">
            <Send size={20} className="text-slate-900" />
          </button>
        </div>
      </div>
    </div>
  )
}
