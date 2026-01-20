"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Paperclip, X, FileText, GripVertical, Maximize2, Minimize2 } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  model?: string;
}

interface Position {
  x: number;
  y: number;
}

interface Size {
  width: number;
  height: number;
}

export default function AssistantPanel() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Merhaba Patron! Ben YİSA-S Robot. Tüm AI modelleri ve araçlar hazır. Emrinizdeyim.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Draggable and resizable state
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [size, setSize] = useState<Size>({ width: 520, height: 700 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [prevState, setPrevState] = useState<{ position: Position; size: Size } | null>(null);
  const dragStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const resizeStart = useRef<{ x: number; y: number; width: number; height: number }>({ x: 0, y: 0, width: 0, height: 0 });

  // Initialize position to bottom-right
  useEffect(() => {
    if (position.x === 0 && position.y === 0) {
      const newX = window.innerWidth - size.width - 16;
      const newY = window.innerHeight - size.height - 16;
      setPosition({ x: Math.max(0, newX), y: Math.max(0, newY) });
    }
  }, [position.x, position.y, size.width, size.height]);

  // Handle dragging
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragStart.current.x;
      const newY = e.clientY - dragStart.current.y;
      const maxX = window.innerWidth - size.width;
      const maxY = window.innerHeight - size.height;
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    }
    if (isResizing) {
      const deltaX = e.clientX - resizeStart.current.x;
      const deltaY = e.clientY - resizeStart.current.y;
      const newWidth = Math.max(400, Math.min(resizeStart.current.width + deltaX, window.innerWidth - position.x));
      const newHeight = Math.max(500, Math.min(resizeStart.current.height + deltaY, window.innerHeight - position.y));
      setSize({ width: newWidth, height: newHeight });
    }
  }, [isDragging, isResizing, size.width, size.height, position.x, position.y]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  const startDragging = (e: React.MouseEvent) => {
    if (isMaximized) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const startResizing = (e: React.MouseEvent) => {
    if (isMaximized) return;
    e.stopPropagation();
    setIsResizing(true);
    resizeStart.current = { x: e.clientX, y: e.clientY, width: size.width, height: size.height };
  };

  const toggleMaximize = () => {
    if (isMaximized) {
      if (prevState) {
        setPosition(prevState.position);
        setSize(prevState.size);
      }
      setIsMaximized(false);
    } else {
      setPrevState({ position, size });
      setPosition({ x: 0, y: 0 });
      setSize({ width: window.innerWidth, height: window.innerHeight });
      setIsMaximized(true);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const sendMessage = async () => {
    if ((!input.trim() && !file) || loading) return;

    const userContent = input.trim() || `Dosya: ${file?.name}`;
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userContent,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("https://yisa-s-app-production.up.railway.app/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input.trim(),
          hasFile: !!file,
          fileType: file?.type,
          fileName: file?.name,
        }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.message || "Bir hata oluştu.",
          model: data.model,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Bağlantı hatası. Tekrar deneyin.",
        },
      ]);
    }

    removeFile();
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div 
      ref={panelRef}
      className={`fixed bg-slate-900 border border-slate-700 flex flex-col shadow-2xl z-50 ${isMaximized ? '' : 'rounded-2xl'}`}
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
      }}
    >
      {/* Draggable Header */}
      <div 
        className="p-3 border-b border-slate-700 flex items-center justify-between cursor-move select-none"
        onMouseDown={startDragging}
      >
        <div className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-slate-500" />
          <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center text-slate-900 font-bold">
            Y
          </div>
          <div>
            <div className="text-amber-400 font-bold text-sm">YİSA-S ASİSTAN</div>
            <div className="text-emerald-400 text-xs">● Patron Modu Aktif • Sürükle & Boyutlandır</div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={toggleMaximize} 
            className="p-1.5 hover:bg-slate-800 rounded-lg"
            title={isMaximized ? "Küçült" : "Tam Ekran"}
          >
            {isMaximized ? <Minimize2 className="w-4 h-4 text-slate-400" /> : <Maximize2 className="w-4 h-4 text-slate-400" />}
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-3 overflow-y-auto space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] px-3 py-2 rounded-xl text-sm ${
                msg.role === "user"
                  ? "bg-amber-500 text-slate-900"
                  : "bg-slate-800 text-white"
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>
              {msg.model && msg.role === "assistant" && (
                <div className="text-xs opacity-60 mt-1">via {msg.model}</div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 text-white px-3 py-2 rounded-xl text-sm animate-pulse">
              Düşünüyor...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* File Preview */}
      {file && (
        <div className="mx-3 mb-2 p-2 bg-slate-800 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <FileText size={16} />
            <span className="truncate max-w-[280px]">{file.name}</span>
          </div>
          <button onClick={removeFile} className="text-red-400 hover:text-red-300">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Input Area - En az 15 satır */}
      <div className="p-3 border-t border-slate-700 flex-shrink-0">
        <div className="flex flex-col gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="hidden"
          />
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Mesajınızı yazın... (Shift+Enter yeni satır, Enter gönderir)"
            rows={15}
            className="w-full bg-slate-800 text-white px-3 py-3 rounded-xl text-sm outline-none border border-slate-700 focus:border-amber-500 resize-y min-h-[300px]"
            style={{ maxHeight: `${size.height * 0.4}px` }}
          />
          <div className="flex gap-2 items-center justify-between">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-slate-400 hover:text-amber-500 hover:bg-slate-800 rounded-lg"
              title="Dosya Yükle"
            >
              <Paperclip size={18} />
            </button>
            <button
              onClick={sendMessage}
              disabled={loading || (!input.trim() && !file)}
              className="px-5 py-2 bg-amber-500 rounded-xl hover:bg-amber-600 disabled:opacity-50 flex items-center gap-2"
            >
              <Send size={18} className="text-slate-900" />
              <span className="text-slate-900 font-medium text-sm">Gönder</span>
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
  );
}
