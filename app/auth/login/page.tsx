"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Shield,
  Lock,
  Eye,
  EyeOff,
  Mail,
  Fingerprint,
  Building2,
  Sparkles,
  BrainCircuit,
  Database,
  Server,
  Globe,
  User,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import authService from "@/app/services/auth/authService";
import { supabase } from "@/lib/supabase/client";

/* ============================================================
   TYPES & INTERFACES
============================================================ */

type DemoRole = "Administrator" | "Manager" | "Cashier" | "Supervisor" | "Read Only";

interface DemoAccount {
  role: DemoRole;
  email: string;
  badgeColor: string;
}

/* ============================================================
   CONSTANTS & MOCK DATA
============================================================ */

const DEMO_ACCOUNTS: DemoAccount[] = [
  { role: "Administrator", email: "jamal.anjuri@smartops.co.ke", badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  { role: "Manager", email: "mercy.makokha@smartops.co.ke", badgeColor: "bg-purple-50 text-purple-700 border-purple-200" },
  { role: "Cashier", email: "david.ochieng@smartops.co.ke", badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { role: "Supervisor", email: "tony.gitau@smartops.co.ke", badgeColor: "bg-blue-50 text-blue-700 border-blue-200" },
  { role: "Read Only", email: "auditor@smartops.co.ke", badgeColor: "bg-slate-100 text-slate-700 border-slate-200" }
];

/* ============================================================
   MAIN COMPONENT
============================================================ */

export default function LoginPage() {
  const router = useRouter();

  /* ------------------------------------------------------------
     STATE MANAGEMENT
  ------------------------------------------------------------ */
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  /* ------------------------------------------------------------
     HANDLERS
  ------------------------------------------------------------ */
  const handlePasswordToggle = (): void => {
    setShowPassword((prev) => !prev);
  };

  const handleRememberMe = (): void => {
    setRememberMe((prev) => !prev);
  };

  const handleDemoLogin = (demoEmail: string): void => {
    setEmail(demoEmail);
    setPassword("SmartOps2026!Secure");
    setError(null);
  };
const handleGoogleLogin = async (): Promise<void> => {
  setError(null);
  setLoading(true);
const handleGoogleLogin = async (): Promise<void> => {
  setError(null);

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    setError(error.message);
  }
};
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    setError(error.message);
    setLoading(false);
  }
};
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Basic Validation
    if (!email.trim()) {
      setError("Please enter a valid corporate email address.");
      return;
    }

    if (!password) {
      setError("Please enter your secure access password.");
      return;
    }

    if (password.length < 6) {
      setError("Security Policy: Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
     const response = await authService.signIn(
  email.trim(),
  password
);

if (!response.success) {
  setError(response.error ?? "Authentication failed.");
  setLoading(false);
  return;
}

setSuccess(true);
setLoading(false);

router.push("/");
router.refresh();

      setLoading(false);
      setSuccess(true);

      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 1000);
    } catch (err: unknown) {
      setLoading(false);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected authentication error occurred. Please try again.");
      }
    }
  };

  /* ------------------------------------------------------------
     JSX RENDER
  ------------------------------------------------------------ */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 flex items-center justify-center p-6">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">
        {/* ============================================================
            LEFT PANEL
        ============================================================ */}
        <div className="hidden lg:flex lg:col-span-5 flex-col justify-between space-y-8 pr-4">
          {/* Logo & Platform Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg shadow-indigo-500/10">
                <BrainCircuit className="h-7 w-7 text-indigo-400" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                  SmartOps <span className="text-indigo-600">AI</span>
                </h1>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                  Enterprise Platform
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed pt-2">
              Next-generation POS, ERP, and AI-driven business management suite engineered for high-velocity multi-branch enterprises.
            </p>
          </div>

          {/* Feature Highlights Grid */}
          <div className="space-y-3">
            {[
              { title: "AI-Powered Telemetry", desc: "Real-time decision intelligence & sales prediction", icon: Sparkles },
              { title: "Enterprise Multi-Branch", desc: "Unified inventory & terminal synchronization", icon: Building2 },
              { title: "Finance & Tax Engine", desc: "Automated KRA ETIMS & P&L ledger reconciliation", icon: Database },
              { title: "SOC2 Security Standards", desc: "256-bit encryption & strict audit trail logs", icon: Shield }
            ].map((feat, idx) => {
              const IconComp = feat.icon;
              return (
                <div
                  key={idx}
                  className="flex items-start gap-3.5 p-3.5 rounded-2xl border border-slate-200/80 bg-white/60 backdrop-blur-md transition-all hover:bg-white/90 hover:shadow-sm"
                >
                  <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 shrink-0">
                    <IconComp className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-xs font-bold text-slate-900">{feat.title}</h2>
                    <p className="text-[11px] text-slate-500 mt-0.5">{feat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Infrastructure Health Status */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-white/40 backdrop-blur-sm space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium flex items-center gap-1.5">
                <Server className="h-3.5 w-3.5 text-slate-400" /> Infrastructure Cluster
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Operational
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-100">
              <span>Region: Africa-East (Nairobi)</span>
              <span>Latency: 14ms</span>
            </div>
          </div>
        </div>

        {/* ============================================================
            RIGHT LOGIN CARD
        ============================================================ */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl border border-slate-200/90 bg-white/80 backdrop-blur-xl p-8 sm:p-10 shadow-2xl shadow-slate-300/50 transition-all duration-300">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-100 gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    Enterprise Sign In
                  </h2>
                  <span className="rounded-full bg-slate-900 px-2.5 py-0.5 text-[10px] font-extrabold text-white">
                    v4.2
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Authenticate using your corporate credentials or single sign-on.
                </p>
              </div>

              <div className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                <Fingerprint className="h-3.5 w-3.5 text-emerald-600" />
                <span>Encrypted Session</span>
              </div>
            </div>

            {/* Banners: Error / Success */}
            {error && (
              <div className="mt-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-xs font-semibold animate-shake">
                <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1">{error}</div>
              </div>
            )}

            {success && (
              <div className="mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 text-emerald-800 text-xs font-semibold">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  Authentication successful. Initializing SmartOps AI session and redirecting...
                </div>
              </div>
            )}
<button
  type="button"
  onClick={handleGoogleLogin}
  className="w-full inline-flex items-center justify-center gap-3 rounded-2xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
>
  <svg className="h-5 w-5" viewBox="0 0 24 24">
    <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.2-.9 2.2-1.9 2.9v2.4h3.1c1.8-1.7 2.8-4.2 2.8-7.2 0-.7-.1-1.4-.2-2H12z"/>
    <path fill="#34A853" d="M12 22c2.7 0 5-0.9 6.7-2.6l-3.1-2.4c-.9.6-2 .9-3.6.9-2.7 0-5-1.8-5.8-4.3H3v2.5C4.7 19.6 8.1 22 12 22z"/>
    <path fill="#FBBC05" d="M6.2 13.6c-.2-.6-.3-1.2-.3-1.8s.1-1.3.3-1.8V7.5H3C2.4 8.8 2 10.3 2 11.8s.4 3 1 4.3l3.2-2.5z"/>
    <path fill="#4285F4" d="M12 6c1.5 0 2.9.5 4 1.6l3-3C17.1 2.9 14.8 2 12 2 8.1 2 4.7 4.4 3 7.5l3.2 2.5C7 7.8 9.3 6 12 6z"/>
  </svg>
  Continue with Google
</button>

<div className="relative my-6">
  <div className="absolute inset-0 flex items-center">
    <div className="w-full border-t border-slate-200" />
  </div>
  <div className="relative flex justify-center text-xs uppercase">
    <span className="bg-white px-3 text-slate-400">or continue with email</span>
  </div>
</div>
            {/* Form */}
            <form onSubmit={handleLogin} className="mt-6 space-y-5">
              {/* Email Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Corporate Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="name@smartops.co.ke"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 font-medium focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Password
                  </label>
                  <div className="flex items-center gap-3">
                    <Link
                      href="/auth/verify-email"
                      className="text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors"
                    >
                      Verify Email
                    </Link>
                    <span className="text-slate-300">•</span>
                    <Link
                      href="/auth/forgot-password"
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-10 pr-11 py-3 text-sm text-slate-900 placeholder-slate-400 font-medium focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={handlePasswordToggle}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={handleRememberMe}
                    className="h-4 w-4 rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-slate-600">
                    Keep session active on this workstation
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/25 transition-all duration-200 hover:bg-indigo-700 hover:scale-[1.005] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
{/* Google Sign In */}
<div className="mt-4">
  <button
    type="button"
    onClick={handleGoogleLogin}
    className="w-full inline-flex items-center justify-center gap-3 rounded-2xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
  >
    <svg className="h-5 w-5" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.67-2.26 1.06-3.71 1.06-2.85 0-5.27-1.92-6.13-4.5H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.87 14.13A6.99 6.99 0 015.5 12c0-.74.13-1.45.37-2.13V7.03H2.18A11.99 11.99 0 000 12c0 1.93.46 3.76 1.27 5.39l4.6-3.26z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.2 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.03l3.69 2.84c.86-2.58 3.28-4.49 6.13-4.49z"
      />
    </svg>
    Continue with Google
  </button>
</div>
            {/* Demo Accounts */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Quick Access Demo Accounts:
                </p>
                <span className="text-[10px] text-slate-400 font-mono">Autofill credentials</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {DEMO_ACCOUNTS.map((acc, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleDemoLogin(acc.email)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer ${acc.badgeColor}`}
                  >
                    <User className="h-3 w-3" />
                    <span>{acc.role}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Security Badges */}
            <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              {[
                { label: "MFA Active", icon: Shield },
                { label: "256-Bit SSL", icon: Lock },
                { label: "SOC2 Type II", icon: CheckCircle2 },
                { label: "ISO 27001", icon: Globe }
              ].map((sec, idx) => {
                const SecIcon = sec.icon;
                return (
                  <div key={idx} className="flex flex-col items-center gap-1 p-2 rounded-xl bg-slate-50/80 border border-slate-100">
                    <SecIcon className="h-3.5 w-3.5 text-slate-500" />
                    <span className="text-[10px] font-bold text-slate-600">{sec.label}</span>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="mt-8 text-center text-xs text-slate-400 space-y-2">
              <div className="flex items-center justify-center gap-4">
                <button type="button" onClick={() => alert("Documentation module opening...")} className="hover:text-slate-600 transition-colors">Documentation</button>
                <span>•</span>
                <button type="button" onClick={() => alert("Privacy policy page opening...")} className="hover:text-slate-600 transition-colors">Privacy Policy</button>
                <span>•</span>
                <button type="button" onClick={() => alert("Terms of service page opening...")} className="hover:text-slate-600 transition-colors">Terms of Service</button>
                <span>•</span>
                <button type="button" onClick={() => alert("Support channel opening...")} className="hover:text-slate-600 transition-colors">Support</button>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                © 2026 SmartOps AI. All rights reserved. Enterprise Build 4.2.0-PROD
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}