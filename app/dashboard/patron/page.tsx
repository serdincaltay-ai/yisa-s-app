"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import AssistantPanel from "@/components/AssistantPanel";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Inbox = {
  id: string;
  created_at: string;
  title: string | null;
  message: string | null;
  risk_level: string | null;
  source_robot: string | null;
  payload: any;
};

type Job = {
  id: string;
  created_at: string;
  status: string;
  job_type_key: string;
  tenant_id: string | null;
  last_error: string | null;
  payload: any;
};

export default function PatronDashboard() {
  const [inbox, setInbox] = useState<Inbox[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    (async () => {
      const { data: inboxData } = await supabase
        .from("patron_inbox")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);

      const { data: jobsData } = await supabase
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);

      setInbox((inboxData as any) ?? []);
      setJobs((jobsData as any) ?? []);
    })();
  }, []);

  const jobStats = useMemo(() => {
    const s = { queued: 0, running: 0, done: 0, error: 0 };
    for (const j of jobs) {
      const k = (j.status || "").toLowerCase();
      if (k in s) (s as any)[k]++;
    }
    return s;
  }, [jobs]);

  // Jobs'ı status'a göre grupla
  const groupedJobs = useMemo(() => {
    const groups: Record<string, Job[]> = {};
    for (const j of jobs) {
      const status = j.status || "unknown";
      if (!groups[status]) groups[status] = [];
      groups[status].push(j);
    }
    return groups;
  }, [jobs]);

  const jobStatusOrder = ["running", "queued", "done", "error"];
  const sortedJobStatuses = useMemo(() => {
    const keys = Object.keys(groupedJobs);
    return keys.sort((a, b) => {
      const aIdx = jobStatusOrder.indexOf(a.toLowerCase());
      const bIdx = jobStatusOrder.indexOf(b.toLowerCase());
      return (aIdx === -1 ? 99 : aIdx) - (bIdx === -1 ? 99 : bIdx);
    });
  }, [groupedJobs]);

  // Inbox'ı risk_level'a göre grupla
  const groupedInbox = useMemo(() => {
    const groups: Record<string, Inbox[]> = {};
    for (const i of inbox) {
      const risk = i.risk_level || "belirsiz";
      if (!groups[risk]) groups[risk] = [];
      groups[risk].push(i);
    }
    return groups;
  }, [inbox]);

  const riskOrder = ["high", "yüksek", "medium", "orta", "low", "düşük", "belirsiz"];
  const sortedRiskLevels = useMemo(() => {
    const keys = Object.keys(groupedInbox);
    return keys.sort((a, b) => {
      const aIdx = riskOrder.indexOf(a.toLowerCase());
      const bIdx = riskOrder.indexOf(b.toLowerCase());
      return (aIdx === -1 ? 99 : aIdx) - (bIdx === -1 ? 99 : bIdx);
    });
  }, [groupedInbox]);

  const getStatusColor = (status: string) => {
    const s = status.toLowerCase();
    if (s === "running") return "text-blue-400";
    if (s === "queued") return "text-yellow-400";
    if (s === "done") return "text-green-400";
    if (s === "error") return "text-red-400";
    return "text-zinc-400";
  };

  const getRiskColor = (risk: string) => {
    const r = risk.toLowerCase();
    if (r === "high" || r === "yüksek") return "text-red-400";
    if (r === "medium" || r === "orta") return "text-yellow-400";
    if (r === "low" || r === "düşük") return "text-green-400";
    return "text-zinc-400";
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-2xl font-semibold">Patron Dashboard</div>
          <div className="text-sm text-zinc-400">Özet + Inbox + Job durumu</div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat title="Queued" value={jobStats.queued} />
        <Stat title="Running" value={jobStats.running} />
        <Stat title="Done" value={jobStats.done} />
        <Stat title="Error" value={jobStats.error} />
      </div>

      {/* Inbox - Risk seviyesine göre gruplanmış */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
        <div className="font-semibold mb-3">Patron Inbox (son 20)</div>
        
        {sortedRiskLevels.length === 0 ? (
          <div className="text-zinc-500 py-4">Henüz mesaj yok.</div>
        ) : (
          <div className="space-y-4">
            {sortedRiskLevels.map((risk) => (
              <div key={risk}>
                {/* Risk grubu başlığı */}
                <div className="flex items-center gap-2 mb-2">
                  <h3 className={`font-medium uppercase text-sm ${getRiskColor(risk)}`}>
                    Risk: {risk}
                  </h3>
                  <span className="text-xs text-zinc-500">({groupedInbox[risk].length})</span>
                </div>
                
                {/* Bu risk grubundaki mesajlar */}
                <div className="space-y-2 pl-2 border-l-2 border-zinc-800">
                  {groupedInbox[risk].map((i) => (
                    <div key={i.id} className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="font-medium">{i.title ?? "Başlıksız"}</div>
                        <div className="text-xs text-zinc-400">{new Date(i.created_at).toLocaleString()}</div>
                      </div>
                      <div className="text-sm text-zinc-200 mt-1 whitespace-pre-wrap">{i.message ?? ""}</div>
                      <div className="text-xs text-zinc-400 mt-2">
                        Robot: {i.source_robot ?? "-"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Jobs - Status'a göre gruplanmış */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
        <div className="font-semibold mb-3">Jobs (son 20)</div>
        
        {sortedJobStatuses.length === 0 ? (
          <div className="text-zinc-500 py-4">Henüz job yok.</div>
        ) : (
          <div className="space-y-4">
            {sortedJobStatuses.map((status) => (
              <div key={status}>
                {/* Status grubu başlığı */}
                <div className="flex items-center gap-2 mb-2">
                  <h3 className={`font-medium uppercase text-sm ${getStatusColor(status)}`}>
                    {status}
                  </h3>
                  <span className="text-xs text-zinc-500">({groupedJobs[status].length})</span>
                </div>
                
                {/* Bu status grubundaki job'lar */}
                <div className="space-y-2 pl-2 border-l-2 border-zinc-800">
                  {groupedJobs[status].map((j) => (
                    <div key={j.id} className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="font-medium">{j.job_type_key}</div>
                        <div className="text-xs text-zinc-400">{new Date(j.created_at).toLocaleString()}</div>
                      </div>
                      {j.last_error && <div className="text-sm text-red-300 mt-1">Hata: {j.last_error}</div>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AssistantPanel />
    </div>
  );
}

function Stat({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
      <div className="text-sm text-zinc-400">{title}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}
