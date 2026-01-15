"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Msg = {
  id: string;
  role: string;
  content: string;
  created_at: string;
};

export default function AssistantPage() {
  const [conversationId, setConversationId] = useState<string>("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      const id = crypto.randomUUID();
      await supabase.from("conversations").insert({ id });
      await supabase.rpc("bootstrap_conversation", { p_conversation_id: id });
      setConversationId(id);
    })();
  }, []);

  useEffect(() => {
    if (!conversationId) return;
    supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })
      .then(({ data }) => setMessages((data as Msg[]) || []));
  }, [conversationId]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages.length]);

  async function sendMessage() {
    if (!text.trim()) return;
    await supabase.from("messages").insert({
      conversation_id: conversationId,
      role: "USER",
      content: text.trim(),
    });
    setText("");
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });
    setMessages((data as Msg[]) || []);
  }

  return (
    <div className="h-screen flex flex-col bg-zinc-950 text-zinc-100">
      <div className="border-b border-zinc-800 px-4 py-3 font-semibold">
        YİSA-S Merkez Asistan
      </div>

      <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.role === "USER" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                m.role === "USER" ? "bg-blue-600" : "bg-zinc-800"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
      </div>

      <div className="sticky bottom-0 bg-zinc-950 border-t border-zinc-800 px-3 py-3">
        <div className="flex gap-2">
          <textarea
            className="flex-1 resize-none rounded-xl bg-zinc-900 px-3 py-2 text-sm"
            rows={2}
            value={text}
            placeholder="Mesaj yaz…"
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 rounded-xl bg-green-600 text-sm font-semibold"
          >
            Gönder
          </button>
        </div>
      </div>
    </div>
  );
}
