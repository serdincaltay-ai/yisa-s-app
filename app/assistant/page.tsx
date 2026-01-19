async function sendMessage() {
  if (!conversationId || !text.trim()) return;

  const content = text.trim();
  setText("");

  // Kullanıcı mesajını kaydet
  await supabase.from("messages").insert({
    conversation_id: conversationId,
    role: "USER",
    content,
    payload: { type: "TEXT" },
  });

  await loadMessages(conversationId);

  // AI'a gönder
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: content }),
    });
    const data = await res.json();

    // AI cevabını kaydet
    await supabase.from("messages").insert({
      conversation_id: conversationId,
      role: "ROBOT",
      content: data.message || "Bir hata oluştu.",
      payload: { type: "AI_RESPONSE", model: data.model },
    });

    await loadMessages(conversationId);
  } catch (error) {
    console.error("AI error:", error);
  }
}
