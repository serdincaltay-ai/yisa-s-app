'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { MessageSquare, X, Send, Paperclip, FileText, Image, GripVertical, Maximize2, Minimize2 } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  file?: { name: string; type: string }
}

interface Position {
  x: number
  y: number
}

interface Size {
  width: number
  height: number
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
  
  // Draggable and resizable state
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 })
  const [size, setSize] = useState<Size>({ width: 500, height: 700 })
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)
  const [prevState, setPrevState] = useState<{ position: Position; size: Size } | null>(null)
  const dragStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const resizeStart = useRef<{ x: number; y: number; width: number; height: number }>({ x: 0, y: 0, width: 0, height: 0 })
  const panelRef = useRef<HTMLDivElement>(null)

  // Initialize position to bottom-right on first open
  useEffect(() => {
    if (isOpen && position.x === 0 && position.y === 0) {
      const newX = window.innerWidth - size.width - 24
      const newY = window.innerHeight - size.height - 24
      setPosition({ x: Math.max(0, newX), y: Math.max(0, newY) })
    }
  }, [isOpen, position.x, position.y, size.width, size.height])

  // Handle dragging
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragStart.current.x
      const newY = e.clientY - dragStart.current.y
      // Keep within viewport
      const maxX = window.innerWidth - size.width
      const maxY = window.innerHeight - size.height
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      })
    }
    if (isResizing) {
      const deltaX = e.clientX - resizeStart.current.x
      const deltaY = e.clientY - resizeStart.current.y
      const newWidth = Math.max(400, Math.min(resizeStart.current.width + deltaX, window.innerWidth - position.x))
      const newHeight = Math.max(500, Math.min(resizeStart.current.height + deltaY, window.innerHeight - position.y))
      setSize({ width: newWidth, height: newHeight })
    }
  }, [isDragging, isResizing, size.width, size.height, position.x, position.y])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    setIsResizing(false)
  }, [])

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp])

  const startDragging = (e: React.MouseEvent) => {
    if (isMaximized) return
    setIsDragging(true)
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y }
  }

  const startResizing = (e: React.MouseEvent) => {
    if (isMaximized) return
    e.stopPropagation()
    setIsResizing(true)
    resizeStart.current = { x: e.clientX, y: e.clientY, width: size.width, height: size.height }
  }

  const toggleMaximize = () => {
    if (isMaximized) {
      if (prevState) {
        setPosition(prevState.position)
        setSize(prevState.size)
      }
      setIsMaximized(false)
    } else {
      setPrevState({ position, size })
      setPosition({ x: 0, y: 0 })
      setSize({ width: window.innerWidth, height: window.innerHeight })
      setIsMaximized(true)
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      // Min 15 satır (yaklaşık 300px), max ekranın %50'si
      const minHeight = 300
      const maxHeight = Math.max(minHeight, size.height * 0.4)
      textareaRef.current.style.height = Math.max(minHeight, Math.min(textareaRef.current.scrollHeight, maxHeight)) + 'px'
    }
  }, [input, size.height])

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
        <div 
          ref={panelRef}
          className={`fixed bg-slate-900 border border-slate-700 shadow-2xl flex flex-col z-50 ${isMaximized ? '' : 'rounded-2xl'}`}
          style={{
            left: position.x,
            top: position.y,
            width: size.width,
            height: size.height,
          }}
        >
          {/* Draggable Header */}
          <div 
            className="flex items-center justify-between p-4 border-b border-slate-700 cursor-move select-none"
            onMouseDown={startDragging}
          >
            <div className="flex items-center gap-3">
              <GripVertical className="w-4 h-4 text-slate-500" />
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <span className="text-xl">Y</span>
              </div>
              <div>
                <h3 className="font-semibold text-white">YİSA-S Robot</h3>
                <p className="text-xs text-emerald-400">Patron Modu Aktif • Sürükle & Boyutlandır</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={toggleMaximize} 
                className="p-2 hover:bg-slate-800 rounded-lg"
                title={isMaximized ? "Küçült" : "Tam Ekran"}
              >
                {isMaximized ? <Minimize2 className="w-5 h-5 text-slate-400" /> : <Maximize2 className="w-5 h-5 text-slate-400" />}
              </button>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-800 rounded-lg">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
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

          {/* Input Area - En az 15 satır */}
          <div className="p-4 border-t border-slate-700 flex-shrink-0">
            <div className="flex flex-col gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".txt,.md,.json,.csv,.png,.jpg,.jpeg,.gif,.webp"
                className="hidden"
              />
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Mesajınızı yazın... (Shift+Enter yeni satır, Enter gönderir)"
                rows={15}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-y min-h-[300px]"
                style={{ maxHeight: `${size.height * 0.4}px` }}
              />
              <div className="flex gap-2 items-center justify-between">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-slate-400 hover:text-amber-500 hover:bg-slate-800 rounded-lg transition-colors"
                  title="Dosya Yükle"
                >
                  <Paperclip className="w-5 h-5" />
                </button>
                <button
                  onClick={sendMessage}
                  disabled={loading || (!input.trim() && !file)}
                  className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
                >
                  <Send className="w-5 h-5 text-slate-900" />
                  <span className="text-slate-900 font-medium">Gönder</span>
                </button>
              </div>
            </div>
          </div>

          {/* Resize Handle */}
          {!isMaximized && (
            <div
              className="absolute bottom-0 right-0 w-6 h-6 cursor-se-resize group"
              onMouseDown={startResizing}
            >
              <svg 
                className="w-4 h-4 absolute bottom-1 right-1 text-slate-500 group-hover:text-amber-500 transition-colors"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M22 22L12 22M22 22L22 12M22 22L16 16" />
              </svg>
            </div>
          )}
        </div>
      )}
    </>
  )
}
