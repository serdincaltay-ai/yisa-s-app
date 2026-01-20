"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Supabase robots tablosundaki gerçek kolonlar
type Robot = {
  robot_key: string;
  display_name: string;
  layer: string | null;
  is_active: boolean;
  created_at: string;
};

export default function RobotDashboard() {
  const [robots, setRobots] = useState<Robot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRobots();
  }, []);

  const fetchRobots = async () => {
    setLoading(true);
    setError(null);
    
    const { data, error: fetchError } = await supabase
      .from("robots")
      .select("robot_key, display_name, layer, is_active, created_at")
      .order("created_at", { ascending: true });

    if (fetchError) {
      setError(fetchError.message);
      setRobots([]);
    } else {
      setRobots((data as Robot[]) ?? []);
    }
    setLoading(false);
  };

  const activeCount = robots.filter((r) => r.is_active).length;
  const totalCount = robots.length;

  if (loading) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
        <div className="font-semibold mb-3">Robot Kadrosu</div>
        <div className="text-zinc-400 text-sm">Yükleniyor...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
        <div className="font-semibold mb-3">Robot Kadrosu</div>
        <div className="text-red-400 text-sm">Hata: {error}</div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="font-semibold">Robot Kadrosu</div>
          <div className="text-xs text-zinc-400">
            {activeCount} aktif / {totalCount} toplam
          </div>
        </div>
        <button
          onClick={fetchRobots}
          className="text-xs text-zinc-400 hover:text-zinc-200 px-2 py-1 rounded border border-zinc-700 hover:border-zinc-600"
        >
          Yenile
        </button>
      </div>

      {robots.length === 0 ? (
        <div className="text-zinc-400 text-sm">Henüz robot tanımlı değil.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {robots.map((robot) => (
            <div
              key={robot.robot_key}
              className={`rounded-xl border p-3 ${
                robot.is_active
                  ? "border-emerald-800/50 bg-emerald-950/20"
                  : "border-zinc-800 bg-zinc-950/60"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-zinc-100 truncate">
                    {robot.display_name}
                  </div>
                  <div className="text-xs text-zinc-500 font-mono mt-0.5">
                    {robot.robot_key}
                  </div>
                </div>
                <div
                  className={`shrink-0 w-2 h-2 rounded-full mt-1.5 ${
                    robot.is_active ? "bg-emerald-500" : "bg-zinc-600"
                  }`}
                  title={robot.is_active ? "Aktif" : "Pasif"}
                />
              </div>
              {robot.layer && (
                <div className="text-xs text-zinc-400 mt-2">
                  Layer: {robot.layer}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
