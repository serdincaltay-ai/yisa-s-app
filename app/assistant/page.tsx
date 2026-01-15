"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Msg = {
  id: string;
  created_at: string;
  conversation_id: string;
  role: string;
  content: string;
  payload: any;
};

export default function AssistantPage() {
  const [conversationId, setConversationId] = useState<string>("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [uploading, setUploading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const shortId = useMemo(() => (conversationId ? conversationId.slice(0, 8) : "..."), [conversationId]);

  async function loadMessages(cid: string) {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", cid)
      .order("created_at", { ascending: true });
    if (error) console.error("messages fetch:", error.message);
    setMessages((data as Msg[]) ?? []);
  }

  useEffect(() => {
    (async () => {
      const cid = crypto.randomUUID();
      await supabase.from("conversations").insert({ id: cid });
      await supabase.rpc("bootstrap_conversation", { p_conversation_id: cid });
      setConversationId(cid);
      await loadMessages(cid);
    })();
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  async function sendMessage() {
    if (!conversationId || !text.trim()) return;

    const content = text.trim();
    setText("");

    await supabase.from("messages").insert({
      conversation_id: conversationId,
      role: "USER",
      content,
      payload: { type: "TEXT" },
    });

    await loadMessages(conversationId);
  }

  async function onPickFile(file: File) {
    if (!conversationId) return;
    setUploading(true);
    try {
      const path = `${conversationId}/${Date.now()}-${file.name}`;
      const { error: upErr } = await supabase.storage.from("uploads").upload(path, file);
      if (upErr) throw upErr;

      const { data: pub } = supabase.storage.from("uploads").getPublicUrl(path);
      const url = pub.publicUrl;

      await supabase.from("messages").insert({
        conversation_id: conversationId,
        role: "USER",
        content: `📎 Dosya yüklendi: ${file.name}`,
        payload: { type: "FILE", name: file.name, path, url },
      });

      await loadMessages(conversationId);
    } catch (e: any) {
      console.error("upload error:", e?.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="h-screen flex flex-col bg-zinc-950 text-zinc-100">
      {/* Header */}
      <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
        <div className="font-semibold">YİSA-S Merkez Asistan</div>
        <div className="text-xs text-zinc-400">Konuşma: {shortId}</div>
      </div>

      {/* Messages */}
      <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((m) => {
          const isUser = m.role === "USER";
          const isFile = m.payload?.type === "FILE";
          return (
            <div key={m.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm shadow ${isUser ? "bg-blue-600" : "bg-zinc-800"}`}>
                <div className="whitespace-pre-wrap">{m.content}</div>
                {isFile && m.payload?.url && (
                  <div className="mt-2 text-xs opacity-90">
                    <a className="underline" href={m.payload.url} target="_blank" rel="noreferrer">
                      Dosyayı aç
                    </a>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sticky composer */}
      <div className="sticky bottom-0 border-t border-zinc-800 bg-zinc-950 px-3 py-3">
        <div className="flex gap-2 items-end">
          <label className="cursor-pointer px-3 py-2 rounded-xl bg-zinc-800 text-sm">
            {uploading ? "Yükleniyor..." : "Dosya"}
            <input
              type="file"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onPickFile(f);
                e.currentTarget.value = "";
              }}
            />
          </label>

          <textarea
            className="flex-1 resize-none rounded-2xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm outline-none"
            rows={2}
            value={text}
            placeholder="Mesaj yaz… (Enter gönderir, Shift+Enter satır)"
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />

          <button className="px-4 py-2 rounded-2xl bg-green-600 text-sm font-semibold" onClick={sendMessage}>
            Gönder
          </button>
        </div>
      </div>
    </div>
  );
}
