import React from "react";
import { useMemo, useState } from "react";
import { Lock, Mail, Sparkles, Eye, EyeOff } from "lucide-react";


import { INDIAN_THEMES } from "../utils/indianThemes";

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const theme = useMemo(() => {
    const saved = localStorage.getItem("indian_calorie_theme_idx");
    const idx = saved ? parseInt(saved, 10) : 0;
    return INDIAN_THEMES[(Number.isFinite(idx) ? idx : 0) % INDIAN_THEMES.length];
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError("Email is required.");
      return;
    }
    if (!password) {
      setError("Password is required.");
      return;
    }

    setLoading(true);
    // Simulate auth latency
    await new Promise((r) => setTimeout(r, 600));

    const session = {
      token: "mock_" + Math.random().toString(16).slice(2),
      user: { email: trimmedEmail },
      createdAt: new Date().toISOString(),
      rememberMe,
    };

    localStorage.setItem("indian_calorie_auth", JSON.stringify(session));
    setLoading(false);
    onLoginSuccess();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 flex items-center justify-center px-5">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-100 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-white"
                style={{ background: `linear-gradient(to right, ${theme.hexPrimary}, ${theme.hexSecondary})` }}
              >
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-black tracking-wider">
                  Aahar<span style={{ color: theme.hexPrimary }}>Sutra</span>
                </div>
                <div className="text-[11px] text-gray-500 dark:text-gray-400 font-semibold">
                  Sign in to continue
                </div>
              </div>
            </div>
            <div className="text-[10px] px-2 py-1 rounded-full font-black" style={{ backgroundColor: `${theme.hexPrimary}12`, color: theme.hexPrimary }}>
              Mock Auth
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-extrabold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
              Email
            </label>
            <div className="flex items-center space-x-2 rounded-2xl border border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950/30 px-3 py-2">
              <Mail className="w-4 h-4" style={{ color: theme.hexPrimary }} />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                autoComplete="email"
                className="w-full bg-transparent outline-none text-sm"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-extrabold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
              Password
            </label>
            <div className="flex items-center space-x-2 rounded-2xl border border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950/30 px-3 py-2">
              <Lock className="w-4 h-4" style={{ color: theme.hexPrimary }} />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                className="w-full bg-transparent outline-none text-sm"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="p-1 rounded-xl hover:bg-white/60 dark:hover:bg-white/10"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 text-xs font-bold text-gray-600 dark:text-gray-300">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
              />
              Remember me
            </label>
            <span className="text-[10px] font-bold text-gray-400">
              Any non-empty credentials work
            </span>
          </div>

          {error && (
            <div
              className="text-[11px] p-3 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/80 dark:bg-red-950/30 text-red-700 dark:text-red-300 font-bold"
              role="alert"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl text-white text-xs font-black transition active:scale-[0.99] flex items-center justify-center space-x-2"
            style={{ background: `linear-gradient(to right, ${theme.hexPrimary}, ${theme.hexSecondary})` }}
          >
            {loading ? "Signing in..." : "Login"}
          </button>

          <div className="text-center text-[10px] text-gray-500 dark:text-gray-400 font-semibold pt-2">
            This app currently uses mock/local authentication for fast integration.
          </div>
        </form>
      </div>
    </div>
  );
}

