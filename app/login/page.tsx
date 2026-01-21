"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onLogin() {
    setErr(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setErr(error.message);
    else window.location.href = "/dashboard/patron";
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white">
      <div className="w-full max-w-sm rounded-2xl bg-neutral-900 p-6 shadow">
        <h1 className="text-xl font-semibold mb-4">YİSA-S Giriş</h1>

        <label className="text-sm text-neutral-300">Email</label>
        <input
          className="w-full mt-1 mb-3 rounded-lg p-2 text-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email"
        />

        <label className="text-sm text-neutral-300">Şifre</label>
        <input
          type="password"
          className="w-full mt-1 mb-2 rounded-lg p-2 text-black"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="şifre"
        />

        <button
          onClick={onLogin}
          disabled={loading}
          className="w-full mt-3 rounded-lg bg-blue-600 py-2 font-medium disabled:opacity-60"
        >
          {loading ? "Giriş yapılıyor..." : "Giriş"}
        </button>

        <div className="mt-3 text-sm text-neutral-300">
          <a className="underline" href="/login/forgot">
            Şifremi unuttum
          </a>
        </div>

        {err && <div className="mt-3 text-sm text-red-400">{err}</div>}
      </div>
    </div>
  );
}
