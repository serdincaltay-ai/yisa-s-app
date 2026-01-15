"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

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

      {/* Inbox */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
        <div className="font-semibold mb-3">Patron Inbox (son 20)</div>
        <div className="space-y-2">
          {inbox.map((i) => (
            <div key={i.id} className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="font-medium">{i.title ?? "Başlıksız"}</div>
                <div className="text-xs text-zinc-400">{new Date(i.created_at).toLocaleString()}</div>
              </div>
              <div className="text-sm text-zinc-200 mt-1 whitespace-pre-wrap">{i.message ?? ""}</div>
              <div className="text-xs text-zinc-400 mt-2">
                Risk: {i.risk_level ?? "-"} • Robot: {i.source_robot ?? "-"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Jobs */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
        <div className="font-semibold mb-3">Jobs (son 20)</div>
        <div className="space-y-2">
          {jobs.map((j) => (
            <div key={j.id} className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="font-medium">{j.job_type_key} • {j.status}</div>
                <div className="text-xs text-zinc-400">{new Date(j.created_at).toLocaleString()}</div>
              </div>
              {j.last_error && <div className="text-sm text-red-300 mt-1">Hata: {j.last_error}</div>}
            </div>
          ))}
        </div>
      </div>
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
