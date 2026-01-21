'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { 
  MessageSquare, X, Send, Paperclip, FileText, Image, Mic, MicOff, 
  Minimize2, Maximize2, GripVertical, ChevronDown, Settings, 
  Sparkles, Bot, Zap, Moon, Sun, Copy, Check, RotateCcw
} from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  file?: { name: string; type: string }
  model?: string
  timestamp: Date
}

interface Model {
  id: string
  name: string
  provider: string
  icon: React.ReactNode
  description: string
}

const MODELS: Model[] = [
  { id: 'claude-opus', name: 'Claude Opus', provider: 'Anthropic', icon: <Sparkles className="w-4 h-4" />, description: 'En güçlü model' },
  { id: 'claude-sonnet', name: 'Claude Sonnet', provider: 'Anthropic', icon: <Sparkles className="w-4 h-4" />, description: 'Hızlı ve dengeli' },
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', icon: <Bot className="w-4 h-4" />, description: 'Çok modlu' },
  { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI', icon: <Bot className="w-4 h-4" />, description: 'Güçlü akıl yürütme' },
  { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google', icon: <Zap className="w-4 h-4" />, description: 'Hızlı yanıtlar' },
]

export default function AdvancedChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      role: 'assistant', 
      content: 'Merhaba! Ben YİSA-S AI asistanınızım. Size nasıl yardımcı olabilirim?',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [fileContent, setFileContent] = useState<string>('')
  const [selectedModel, setSelectedModel] = useState<Model>(MODELS[0])
  const [showModelDropdown, setShowModelDropdown] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)
  
  // Drag state
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  
  // Resize state
  const [size, setSize] = useState({ width: 420, height: 600 })
  const [isResizing, setIsResizing] = useState(false)
  const [resizeDirection, setResizeDirection] = useState<string | null>(null)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const chatWindowRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)

  // Initialize position to bottom-right
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPosition({
        x: window.innerWidth - 440,
        y: window.innerHeight - 620
      })
    }
  }, [])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + 'px'
    }
  }, [input])

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = 'tr-TR'
      
      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('')
        setInput(transcript)
      }
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
      }
      
      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }
  }, [])

  // Drag handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.drag-handle')) {
      setIsDragging(true)
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      })
    }
  }, [position])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      const newX = Math.max(0, Math.min(window.innerWidth - size.width, e.clientX - dragOffset.x))
      const newY = Math.max(0, Math.min(window.innerHeight - size.height, e.clientY - dragOffset.y))
      setPosition({ x: newX, y: newY })
    }
    
    if (isResizing && resizeDirection) {
      const rect = chatWindowRef.current?.getBoundingClientRect()
      if (!rect) return
      
      let newWidth = size.width
      let newHeight = size.height
      let newX = position.x
      let newY = position.y
      
      if (resizeDirection.includes('e')) {
        newWidth = Math.max(350, Math.min(800, e.clientX - position.x))
      }
      if (resizeDirection.includes('w')) {
        const delta = position.x - e.clientX
        newWidth = Math.max(350, Math.min(800, size.width + delta))
        if (newWidth !== size.width) {
          newX = e.clientX
        }
      }
      if (resizeDirection.includes('s')) {
        newHeight = Math.max(400, Math.min(900, e.clientY - position.y))
      }
      if (resizeDirection.includes('n')) {
        const delta = position.y - e.clientY
        newHeight = Math.max(400, Math.min(900, size.height + delta))
        if (newHeight !== size.height) {
          newY = e.clientY
        }
      }
      
      setSize({ width: newWidth, height: newHeight })
      setPosition({ x: newX, y: newY })
    }
  }, [isDragging, isResizing, resizeDirection, dragOffset, position, size])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    setIsResizing(false)
    setResizeDirection(null)
  }, [])

  useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp])

  const startResize = (direction: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsResizing(true)
    setResizeDirection(direction)
  }

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Sesli giriş bu tarayıcıda desteklenmiyor')
      return
    }
    
    if (isListening) {
      recognitionRef.current.stop()
    } else {
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    setFile(selectedFile)

    if (selectedFile.type.startsWith('text/') || 
        selectedFile.name.match(/\.(txt|md|json|csv|js|ts|tsx|py|html|css)$/)) {
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

  const copyMessage = async (content: string, messageId: string) => {
    await navigator.clipboard.writeText(content)
    setCopiedMessageId(messageId)
    setTimeout(() => setCopiedMessageId(null), 2000)
  }

  const regenerateResponse = async (messageIndex: number) => {
    // Find the user message before this assistant message
    const userMessageIndex = messages.slice(0, messageIndex).findLastIndex(m => m.role === 'user')
    if (userMessageIndex === -1) return
    
    const userMessage = messages[userMessageIndex]
    
    // Remove messages from the assistant message onwards
    setMessages(prev => prev.slice(0, messageIndex))
    setLoading(true)
    
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage.content,
          userId: 'patron',
          sessionId: Date.now().toString(),
          model: selectedModel.id
        })
      })

      const data = await res.json()

      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.message || 'Bir hata oluştu.',
        model: selectedModel.name,
        timestamp: new Date()
      }])
    } catch {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Bağlantı hatası.',
        timestamp: new Date()
      }])
    }

    setLoading(false)
  }

  const sendMessage = async () => {
    if ((!input.trim() && !file) || loading) return

    let messageContent = input.trim()
    if (file && fileContent) {
      if (file.type.startsWith('image/')) {
        messageContent = `[Resim: ${file.name}]\n\n${messageContent}`
      } else {
        messageContent = `[Dosya: ${file.name}]\n\n${fileContent}\n\n${messageContent || 'Bu dosyayı analiz et.'}`
      }
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim() || `Dosya: ${file?.name}`,
      file: file ? { name: file.name, type: file.type } : undefined,
      timestamp: new Date()
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
          fileContent: fileContent,
          model: selectedModel.id
        })
      })

      const data = await res.json()

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message || 'Bir hata oluştu.',
        model: selectedModel.name,
        timestamp: new Date()
      }])
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Bağlantı hatası.',
        timestamp: new Date()
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

  const toggleMaximize = () => {
    if (isMaximized) {
      setSize({ width: 420, height: 600 })
      setPosition({
        x: window.innerWidth - 440,
        y: window.innerHeight - 620
      })
    } else {
      setSize({ width: window.innerWidth - 40, height: window.innerHeight - 40 })
      setPosition({ x: 20, y: 20 })
    }
    setIsMaximized(!isMaximized)
  }

  const bgColor = isDarkMode ? 'bg-zinc-900' : 'bg-white'
  const textColor = isDarkMode ? 'text-white' : 'text-zinc-900'
  const borderColor = isDarkMode ? 'border-zinc-700' : 'border-zinc-200'
  const inputBg = isDarkMode ? 'bg-zinc-800' : 'bg-zinc-100'
  const hoverBg = isDarkMode ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)} 
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full shadow-lg shadow-amber-500/30 flex items-center justify-center hover:scale-110 transition-all z-50 group"
        >
          <MessageSquare className="w-6 h-6 text-white" />
          <span className="absolute -top-10 right-0 bg-zinc-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            AI Asistan
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          ref={chatWindowRef}
          className={`fixed ${bgColor} ${borderColor} border rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden select-none`}
          style={{
            left: position.x,
            top: position.y,
            width: isMinimized ? 300 : size.width,
            height: isMinimized ? 60 : size.height,
            transition: isDragging || isResizing ? 'none' : 'width 0.2s, height 0.2s'
          }}
          onMouseDown={handleMouseDown}
        >
          {/* Resize Handles */}
          {!isMinimized && !isMaximized && (
            <>
              <div className="absolute top-0 left-0 right-0 h-2 cursor-n-resize" onMouseDown={startResize('n')} />
              <div className="absolute bottom-0 left-0 right-0 h-2 cursor-s-resize" onMouseDown={startResize('s')} />
              <div className="absolute top-0 bottom-0 left-0 w-2 cursor-w-resize" onMouseDown={startResize('w')} />
              <div className="absolute top-0 bottom-0 right-0 w-2 cursor-e-resize" onMouseDown={startResize('e')} />
              <div className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize" onMouseDown={startResize('nw')} />
              <div className="absolute top-0 right-0 w-4 h-4 cursor-ne-resize" onMouseDown={startResize('ne')} />
              <div className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize" onMouseDown={startResize('sw')} />
              <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize" onMouseDown={startResize('se')} />
            </>
          )}

          {/* Header */}
          <div className={`drag-handle flex items-center justify-between p-3 ${borderColor} border-b cursor-move`}>
            <div className="flex items-center gap-2">
              <GripVertical className={`w-4 h-4 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`} />
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">Y</span>
              </div>
              <div>
                <h3 className={`font-semibold text-sm ${textColor}`}>YİSA-S AI</h3>
                {!isMinimized && (
                  <p className={`text-xs ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                    {selectedModel.name}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-1.5 rounded-lg ${hoverBg} transition-colors`}
                title={isDarkMode ? 'Açık mod' : 'Koyu mod'}
              >
                {isDarkMode ? (
                  <Sun className={`w-4 h-4 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`} />
                ) : (
                  <Moon className={`w-4 h-4 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`} />
                )}
              </button>
              <button 
                onClick={() => setIsMinimized(!isMinimized)} 
                className={`p-1.5 rounded-lg ${hoverBg} transition-colors`}
                title={isMinimized ? 'Genişlet' : 'Küçült'}
              >
                <Minimize2 className={`w-4 h-4 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`} />
              </button>
              <button 
                onClick={toggleMaximize}
                className={`p-1.5 rounded-lg ${hoverBg} transition-colors`}
                title={isMaximized ? 'Küçült' : 'Tam ekran'}
              >
                <Maximize2 className={`w-4 h-4 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`} />
              </button>
              <button 
                onClick={() => setIsOpen(false)} 
                className={`p-1.5 rounded-lg hover:bg-red-500/10 transition-colors`}
                title="Kapat"
              >
                <X className="w-4 h-4 text-red-500" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Model Selector */}
              <div className={`p-2 ${borderColor} border-b`}>
                <div className="relative">
                  <button
                    onClick={() => setShowModelDropdown(!showModelDropdown)}
                    className={`w-full flex items-center justify-between p-2 ${inputBg} rounded-lg ${hoverBg} transition-colors`}
                  >
                    <div className="flex items-center gap-2">
                      {selectedModel.icon}
                      <span className={`text-sm ${textColor}`}>{selectedModel.name}</span>
                      <span className={`text-xs ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
                        {selectedModel.description}
                      </span>
                    </div>
                    <ChevronDown className={`w-4 h-4 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'} transition-transform ${showModelDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {showModelDropdown && (
                    <div className={`absolute top-full left-0 right-0 mt-1 ${bgColor} ${borderColor} border rounded-lg shadow-xl z-10 overflow-hidden`}>
                      {MODELS.map((model) => (
                        <button
                          key={model.id}
                          onClick={() => {
                            setSelectedModel(model)
                            setShowModelDropdown(false)
                          }}
                          className={`w-full flex items-center gap-3 p-3 ${hoverBg} transition-colors ${selectedModel.id === model.id ? (isDarkMode ? 'bg-zinc-800' : 'bg-zinc-100') : ''}`}
                        >
                          <div className={`w-8 h-8 rounded-lg ${isDarkMode ? 'bg-zinc-700' : 'bg-zinc-200'} flex items-center justify-center`}>
                            {model.icon}
                          </div>
                          <div className="text-left">
                            <div className={`text-sm font-medium ${textColor}`}>{model.name}</div>
                            <div className={`text-xs ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
                              {model.provider} · {model.description}
                            </div>
                          </div>
                          {selectedModel.id === model.id && (
                            <Check className="w-4 h-4 text-amber-500 ml-auto" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`group relative max-w-[85%] ${msg.role === 'user' ? '' : 'flex gap-2'}`}>
                      {msg.role === 'assistant' && (
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-white font-bold text-xs">Y</span>
                        </div>
                      )}
                      <div>
                        <div className={`px-4 py-3 rounded-2xl ${
                          msg.role === 'user' 
                            ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white' 
                            : isDarkMode ? 'bg-zinc-800 text-white' : 'bg-zinc-100 text-zinc-900'
                        }`}>
                          {msg.file && (
                            <div className="flex items-center gap-2 mb-2 text-xs opacity-75">
                              {msg.file.type.startsWith('image/') ? <Image size={14} /> : <FileText size={14} />}
                              {msg.file.name}
                            </div>
                          )}
                          <div className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</div>
                        </div>
                        
                        {/* Message actions */}
                        {msg.role === 'assistant' && (
                          <div className="flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => copyMessage(msg.content, msg.id)}
                              className={`p-1 rounded ${hoverBg} transition-colors`}
                              title="Kopyala"
                            >
                              {copiedMessageId === msg.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                              ) : (
                                <Copy className={`w-3.5 h-3.5 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`} />
                              )}
                            </button>
                            <button
                              onClick={() => regenerateResponse(index)}
                              className={`p-1 rounded ${hoverBg} transition-colors`}
                              title="Yeniden oluştur"
                            >
                              <RotateCcw className={`w-3.5 h-3.5 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`} />
                            </button>
                            {msg.model && (
                              <span className={`text-xs ${isDarkMode ? 'text-zinc-600' : 'text-zinc-400'} ml-1`}>
                                {msg.model}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {loading && (
                  <div className="flex justify-start">
                    <div className="flex gap-2">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-xs">Y</span>
                      </div>
                      <div className={`px-4 py-3 rounded-2xl ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
                        <div className="flex gap-1">
                          <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-zinc-500' : 'bg-zinc-400'} animate-bounce`} style={{ animationDelay: '0ms' }} />
                          <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-zinc-500' : 'bg-zinc-400'} animate-bounce`} style={{ animationDelay: '150ms' }} />
                          <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-zinc-500' : 'bg-zinc-400'} animate-bounce`} style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* File Preview */}
              {file && (
                <div className={`mx-4 mb-2 p-2 ${inputBg} rounded-lg flex items-center justify-between`}>
                  <div className={`flex items-center gap-2 text-sm ${textColor}`}>
                    {file.type.startsWith('image/') ? <Image size={16} /> : <FileText size={16} />}
                    <span className="truncate max-w-[250px]">{file.name}</span>
                  </div>
                  <button onClick={removeFile} className="text-red-400 hover:text-red-300">
                    <X size={16} />
                  </button>
                </div>
              )}

              {/* Input Area */}
              <div className={`p-4 ${borderColor} border-t`}>
                <div className={`flex gap-2 items-end ${inputBg} rounded-xl p-2`}>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept=".txt,.md,.json,.csv,.png,.jpg,.jpeg,.gif,.webp,.js,.ts,.tsx,.py,.html,.css"
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className={`p-2 ${isDarkMode ? 'text-zinc-400 hover:text-amber-500' : 'text-zinc-500 hover:text-amber-600'} rounded-lg transition-colors`}
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
                    className={`flex-1 px-2 py-2 bg-transparent ${textColor} placeholder-zinc-500 focus:outline-none resize-none min-h-[40px] max-h-[150px] text-sm`}
                  />
                  
                  <button
                    onClick={toggleListening}
                    className={`p-2 rounded-lg transition-colors ${
                      isListening 
                        ? 'bg-red-500 text-white animate-pulse' 
                        : `${isDarkMode ? 'text-zinc-400 hover:text-amber-500' : 'text-zinc-500 hover:text-amber-600'}`
                    }`}
                    title={isListening ? 'Dinlemeyi durdur' : 'Sesli giriş'}
                  >
                    {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>
                  
                  <button
                    onClick={sendMessage}
                    disabled={loading || (!input.trim() && !file)}
                    className="p-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
                    title="Gönder"
                  >
                    <Send className="w-5 h-5 text-white" />
                  </button>
                </div>
                
                <p className={`text-xs ${isDarkMode ? 'text-zinc-600' : 'text-zinc-400'} text-center mt-2`}>
                  Enter ile gönder, Shift+Enter ile yeni satır
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}

// Add type declarations for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionResultList {
  length: number
  item(index: number): SpeechRecognitionResult
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionResult {
  isFinal: boolean
  length: number
  item(index: number): SpeechRecognitionAlternative
  [index: number]: SpeechRecognitionAlternative
}

interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
  message: string
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start(): void
  stop(): void
  abort(): void
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
  onend: (() => void) | null
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance
}

declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionConstructor
    webkitSpeechRecognition: SpeechRecognitionConstructor
  }
}
