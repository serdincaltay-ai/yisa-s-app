"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, X, FileText } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  model?: string;
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  }, [input]);

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
    <div className="fixed bottom-4 right-4 w-[420px] h-[520px] bg-slate-900 border border-slate-700 rounded-2xl flex flex-col shadow-2xl z-50">
      {/* Header */}
      <div className="p-3 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center text-slate-900 font-bold">
            Y
          </div>
          <div>
            <div className="text-amber-400 font-bold text-sm">YİSA-S ASİSTAN</div>
            <div className="text-emerald-400 text-xs">● Patron Modu Aktif</div>
          </div>
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

      {/* Input */}
      <div className="p-3 border-t border-slate-700">
        <div className="flex gap-2 items-end">
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-slate-400 hover:text-amber-500 hover:bg-slate-800 rounded-lg"
          >
            <Paperclip size={18} />
          </button>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Komut yaz... (Enter gönderir, Shift+Enter yeni satır)"
            rows={1}
            className="flex-1 bg-slate-800 text-white px-3 py-2 rounded-xl text-sm outline-none border border-slate-700 focus:border-amber-500 resize-none min-h-[40px] max-h-[120px]"
          />
          <button
            onClick={sendMessage}
            disabled={loading || (!input.trim() && !file)}
            className="p-2 bg-amber-500 rounded-xl hover:bg-amber-600 disabled:opacity-50"
          >
            <Send size={18} className="text-slate-900" />
          </button>
        </div>
      </div>
    </div>
  );
}
