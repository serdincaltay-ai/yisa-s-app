"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function HomePage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);
  
  // Şifremi Unuttum state'leri
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    // Zaten giriş yapmışsa dashboard'a yönlendir
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push("/dashboard/patron");
      } else {
        setCheckingAuth(false);
      }
    });
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      router.push("/dashboard/patron");
    }
  };

  const handleForgotPassword = async () => {
    if (!resetEmail.trim()) {
      setResetError("Lütfen e-posta adresinizi girin.");
      return;
    }

    setResetLoading(true);
    setResetError("");

    const { error: resetAuthError } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (resetAuthError) {
      setResetError(resetAuthError.message);
    } else {
      setResetSuccess(true);
    }
    
    setResetLoading(false);
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

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-amber-500 hover:text-amber-400 text-sm transition-colors"
            >
              Şifremi Unuttum
            </button>
          </div>
        </form>

        {/* Şifremi Unuttum Modal */}
        {showForgotPassword && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 w-full max-w-md">
              <h3 className="text-xl font-semibold text-white mb-4">Şifre Sıfırlama</h3>
              
              {resetSuccess ? (
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-zinc-300 mb-4">Şifre sıfırlama linki e-posta adresinize gönderildi.</p>
                  <button
                    onClick={() => {
                      setShowForgotPassword(false);
                      setResetSuccess(false);
                      setResetEmail("");
                    }}
                    className="text-amber-500 hover:text-amber-400"
                  >
                    Giriş sayfasına dön
                  </button>
                </div>
              ) : (
                <>
                  {resetError && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-xl mb-4 text-sm">
                      {resetError}
                    </div>
                  )}
                  
                  <p className="text-zinc-400 text-sm mb-4">
                    E-posta adresinizi girin. Şifre sıfırlama linki göndereceğiz.
                  </p>
                  
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500 mb-4"
                    placeholder="ornek@email.com"
                  />
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setShowForgotPassword(false);
                        setResetError("");
                        setResetEmail("");
                      }}
                      className="flex-1 px-4 py-3 rounded-xl border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-colors"
                    >
                      İptal
                    </button>
                    <button
                      onClick={handleForgotPassword}
                      disabled={resetLoading}
                      className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold py-3 rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity"
                    >
                      {resetLoading ? "Gönderiliyor..." : "Gönder"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        <p className="text-center text-zinc-500 text-sm mt-6">
          © 2025 YİSA-S. Tüm hakları saklıdır.
        </p>
      </div>
    </div>
  );
}
