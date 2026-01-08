// worker/index.js
import process from "node:process";
import { setTimeout as sleep } from "node:timers/promises";
import { createClient } from "@supabase/supabase-js";

// ====== ENV ======
const {
  SUPABASE_URL,
  SUPABASE_SERVICE_KEY,
  WORKER_ID,
  POLL_MS,
  // LLM keys (ikisi de destekli)
  OPENAI_API_KEY,
  OPENAI_MODEL,
  ANTHROPIC_API_KEY,
  ANTHROPIC_MODEL,
} = process.env;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_KEY");
}
if (!OPENAI_API_KEY && !ANTHROPIC_API_KEY) {
  throw new Error("Missing LLM key: set OPENAI_API_KEY or ANTHROPIC_API_KEY");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false },
});

const workerId = WORKER_ID || `worker-${Math.random().toString(16).slice(2)}`;
const pollMs = Number(POLL_MS || "800");

const useOpenAI = !!OPENAI_API_KEY;
const model =
  (useOpenAI ? (OPENAI_MODEL || "gpt-4.1-mini") : (ANTHROPIC_MODEL || "claude-3-5-sonnet-latest"));

function systemPrompt(botId = "CEO") {
  if (botId === "ASST") {
    return `Sen YİSA-S (Yetenek İzleme ve Sporcu Analiz Sistemi) asistanısın. BJK Tuzla Cimnastik Spor Kulübü için çalışıyorsun.
Görevlerin:
- Sporcu değerlendirme raporları hazırlamak
- Antrenman programları önermek
- Veli iletişim metinleri yazmak
- Cimnastik terminolojisi hakkında bilgi vermek
- 10 Perspektif değerlendirme sistemi hakkında yardım etmek
Her zaman Türkçe cevap ver. Profesyonel ve samimi ol.
Patron: Serdinç ALTAY.`;
  }
  return `Sen YİSA-S CEO modülüsün. BJK Tuzla Cimnastik Spor Kulübü için karar destek verirsin.
Her zaman Türkçe, net, kısa ve uygulanabilir öneriler sun.`;
}

function buildInputText(messages, botId) {
  const lines = [];
  lines.push(`[SYSTEM]\n${systemPrompt(botId)}\n`);
  for (const m of messages) {
    if (m.role === "system") lines.push(`[SYSTEM]\n${m.content}\n`);
    if (m.role === "user") lines.push(`[USER]\n${m.content}\n`);
    if (m.role === "assistant") lines.push(`[ASSISTANT]\n${m.content}\n`);
  }
  lines.push(`[ASSISTANT]\n`);
  return lines.join("\n");
}

async function callOpenAI(inputText) {
  // Responses API
  const resp = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      input: inputText,
    }),
  });

  if (!resp.ok) {
    const t = await resp.text();
    throw new Error(`OpenAI error ${resp.status}: ${t}`);
  }

  const data = await resp.json();
  const text = (data.output_text || "").trim();
  return { text, rawId: data.id || null };
}

async function callAnthropic(inputText) {
  // Anthropic Messages API
  const resp = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model,
      max_tokens: 800,
      messages: [{ role: "user", content: inputText }],
    }),
  });

  if (!resp.ok) {
    const t = await resp.text();
    throw new Error(`Anthropic error ${resp.status}: ${t}`);
  }

  const data = await resp.json();
  const text = (data?.content?.[0]?.text || "").trim();
  return { text, rawId: data.id || null };
}

async function runOnce() {
  // 1) Claim job (RPC)
  const { data: claimed, error: claimErr } = await supabase.rpc("yisa_claim_next_job", {
    worker_id: workerId,
  });

  if (claimErr) {
    console.error(`[${workerId}] claimErr`, claimErr);
    return;
  }

  const job = Array.isArray(claimed) ? claimed[0] : claimed;
  if (!job?.id) return; // no job

  const jobId = job.id;
  const conversationId = job.conversation_id;
  const botId = job.payload?.bot_id || "CEO";

  console.log(`[${workerId}] claimed job=${jobId} conv=${conversationId} bot=${botId}`);

  try {
    // 2) Fetch last messages
    const { data: msgs, error: msgsErr } = await supabase
      .from("messages")
      .select("role, content, created_at")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })
      .limit(40);

    if (msgsErr) throw new Error(`messages fetch: ${msgsErr.message}`);

    const inputText = buildInputText(msgs || [], botId);

    // 3) LLM call
    const res = useOpenAI ? await callOpenAI(inputText) : await callAnthropic(inputText);
    const answer = res.text || "Şu an yanıt üretemedim, tekrar dener misiniz?";

    // 4) Write assistant message
    const { error: insErr } = await supabase.from("messages").insert({
      conversation_id: conversationId,
      role: "assistant",
      content: answer,
    });
    if (insErr) throw new Error(`insert assistant msg: ${insErr.message}`);

    // 5) Finish job
    const { error: finErr } = await supabase.rpc("yisa_finish_job", {
      job_id: jobId,
      new_status: "done",
      job_result: {
        answer,
        provider: useOpenAI ? "openai" : "anthropic",
        provider_id: res.rawId,
      },
      err: null,
    });
    if (finErr) throw new Error(`finish job: ${finErr.message}`);

    console.log(`[${workerId}] done job=${jobId}`);
  } catch (e) {
    const msg = e?.message ? String(e.message) : String(e);
    console.error(`[${workerId}] job error job=${jobId}`, msg);

    // error'a düşür
    await supabase.rpc("yisa_finish_job", {
      job_id: jobId,
      new_status: "error",
      job_result: null,
      err: msg.slice(0, 5000),
    });
  }
}

async function main() {
  console.log(
    `[${workerId}] worker started poll=${pollMs}ms provider=${useOpenAI ? "openai" : "anthropic"} model=${model}`
  );

  // eslint-disable-next-line no-constant-condition
  while (true) {
    await runOnce();
    await sleep(pollMs);
  }
}

main().catch((e) => {
  console.error("worker fatal", e);
  process.exit(1);
});
