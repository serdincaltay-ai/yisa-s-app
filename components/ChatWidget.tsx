'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageSquare, X, Send, Paperclip, FileText, Image } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  file?: { name: string; type: string }
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: 'Merhaba Patron! Ben YİSA-S Robot. Emrinizdeyim. Ne yapmamı istersiniz?' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [fileContent, setFileContent] = useState<string>('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px'
    }
  }, [input])

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    setFile(selectedFile)

    if (selectedFile.type.startsWith('text/') || selectedFile.name.endsWith('.txt') || selectedFile.name.endsWith('.md') || selectedFile.name.endsWith('.json') || selectedFile.name.endsWith('.csv')) {
      const text = await selectedFile.text()
      setFileContent(text)
    } else if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = () => {
        setFileContent(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
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
      if (file.type.startsWith('image/')) {
        messageContent = `[Resim yüklendi: ${file.name}]\n\n${messageContent}`
      } else {
        messageContent = `[Dosya: ${file.name}]\n\nDosya İçeriği:\n${fileContent}\n\n${messageContent || 'Bu dosyayı oku ve analiz et.'}`
      }
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim() || `Dosya yüklendi: ${file?.name}`,
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
          fileType: file?.type,
          fileName: file?.name,
          fileContent: fileContent
        })
      })

      const data = await res.json()

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message || 'Bir hata oluştu.'
      }])
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Bağlantı hatası Patron.'
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
    <>
      {!isOpen && (
        <button onClick={() => setIsOpen(true)} className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform z-50">
          <MessageSquare className="w-6 h-6 text-slate-900" />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[400px] h-[600px] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col z-50">
          <div className="flex items-center justify-between p-4 border-b border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <span className="text-xl">Y</span>
              </div>
              <div>
                <h3 className="font-semibold text-white">YİSA-S Robot</h3>
                <p className="text-xs text-emerald-400">Patron Modu Aktif</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-800 rounded-lg">
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-4 py-3 rounded-2xl ${msg.role === 'user' ? 'bg-amber-500 text-slate-900' : 'bg-slate-800 text-white'}`}>
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

          {file && (
            <div className="mx-4 mb-2 p-2 bg-slate-800 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                {file.type.startsWith('image/') ? <Image size={16} /> : <FileText size={16} />}
                <span className="truncate max-w-[250px]">{file.name}</span>
              </div>
              <button onClick={removeFile} className="text-red-400 hover:text-red-300">
                <X size={16} />
              </button>
            </div>
          )}

          <div className="p-4 border-t border-slate-700">
            <div className="flex gap-2 items-end">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".txt,.md,.json,.csv,.png,.jpg,.jpeg,.gif,.webp"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-slate-400 hover:text-amber-500 hover:bg-slate-800 rounded-lg transition-colors"
                title="Dosya Yükle"
              >
                <Paperclip className="w-5 h-5" />
              </button>
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Mesajınızı yazın..."
                rows={1}
                className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none min-h-[40px] max-h-[120px]"
              />
              <button
                onClick={sendMessage}
                disabled={loading || (!input.trim() && !file)}
                className="p-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl hover:opacity-90 disabled:opacity-50"
              >
                <Send className="w-5 h-5 text-slate-900" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
