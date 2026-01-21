"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter, useSearchParams } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [logoutMessage, setLogoutMessage] = useState("");

  useEffect(() => {
    // URL'de logout parametresi varsa mesaj göster
    if (searchParams.get('logout') === 'success') {
      setLogoutMessage("Oturumunuz başarıyla kapatıldı.");
      // URL'den parametreyi temizle
      window.history.replaceState({}, '', '/');
    }

    // Oturum kontrolü
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          router.push("/dashboard/patron");
        } else {
          setCheckingAuth(false);
        }
      } catch (err) {
        console.error('Auth check error:', err);
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, [router, searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setLogoutMessage("");

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
      } else if (data.session) {
        // Cookie'ye token kaydet (middleware için)
        document.cookie = `sb-access-token=${data.session.access_token}; path=/; max-age=3600; SameSite=Lax`;
        router.push("/dashboard/patron");
        router.refresh();
      }
    } catch (err) {
      setError("Giriş sırasında bir hata oluştu.");
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-white">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl mx-auto flex items-center justify-center mb-4">
            <span className="text-4xl font-bold text-white">Y</span>
          </div>
          <h1 className="text-3xl font-bold text-white">YİSA-S</h1>
          <p className="text-zinc-400 mt-2">Spor Yönetim Sistemi</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
          <h2 className="text-xl font-semibold text-white mb-6">Giriş Yap</h2>

          {logoutMessage && (
            <div className="bg-emerald-500/10 border border-emerald-500 text-emerald-400 px-4 py-2 rounded-xl mb-4 text-sm">
              {logoutMessage}
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-xl mb-4 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">E-posta</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500"
                placeholder="ornek@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-1">Şifre</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold py-3 rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </button>
          </div>
        </form>

        <p className="text-center text-zinc-500 text-sm mt-6">
          © 2025 YİSA-S. Tüm hakları saklıdır.
        </p>
      </div>
    </div>
  );
}
