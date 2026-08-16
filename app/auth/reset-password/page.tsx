"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BrainCircuit,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Shield,
  Building2,
  Database,
  Server,
  Fingerprint,
  Sparkles,
  Globe,
  AlertTriangle,
  Check,
  X
} from "lucide-react";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Password Requirements Checks
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  const passedRequirementsCount = [
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecialChar
  ].filter(Boolean).length;

  const calculateStrength = (): { score: number; label: string; color: string; width: string } => {
    if (password.length === 0) return { score: 0, label: "None", color: "bg-slate-200", width: "w-0" };
    if (passedRequirementsCount <= 2) return { score: 1, label: "Weak", color: "bg-rose-500", width: "w-1/4" };
    if (passedRequirementsCount === 3 || passedRequirementsCount === 4) return { score: 2, label: "Medium", color: "bg-amber-500", width: "w-2/4" };
    if (passedRequirementsCount === 5) return { score: 3, label: "Strong", color: "bg-emerald-500", width: "w-full" };
    return { score: 0, label: "None", color: "bg-slate-200", width: "w-0" };
  };

  const strength = calculateStrength();
  const passwordsMatch = password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;
  const isFormValid = passedRequirementsCount === 5 && passwordsMatch;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid || loading) return;

    setError(null);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 2000);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-100 via-white to-indigo-100 flex items-center justify-center p-6">
      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-cyan-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-violet-200/30 rounded-full blur-3xl" />
      </div>

      {/* Main Content Wrapper */}
      <div className="relative w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">
        {/* ==========================================
            LEFT PANEL: BRANDING & SECURITY
        ========================================== */}
        <div className="hidden lg:flex lg:col-span-5 flex-col justify-between space-y-8 pr-4">
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
                  Credential Security Protocol
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed pt-2">
              Corporate password update protocol enforces enterprise password policy guidelines, zero-trust cryptographic hashing, and immediate key revocation upon update.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                title: "Enforced Complexity Standards",
                desc: "Strict multi-character entropy and dictionary attack mitigation",
                icon: Shield
              },
              {
                title: "Zero Trust Identity",
                desc: "Active session termination across all active terminals upon update",
                icon: Lock
              },
              {
                title: "Enterprise Governance",
                desc: "Audit trail record generated for compliance verification",
                icon: Building2
              },
              {
                title: "Encrypted Data Vault",
                desc: "256-bit salted bcrypt encryption for stored credentials",
                icon: Database
              }
            ].map((feature, idx) => {
              const IconComp = feature.icon;
              return (
                <div
                  key={idx}
                  className="flex items-start gap-3.5 p-3.5 rounded-2xl border border-slate-200/80 bg-white/60 backdrop-blur-md transition-all hover:bg-white/90 hover:shadow-sm"
                >
                  <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 shrink-0">
                    <IconComp className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-xs font-bold text-slate-900">{feature.title}</h2>
                    <p className="text-[11px] text-slate-500 mt-0.5">{feature.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 bg-white/40 backdrop-blur-sm space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium flex items-center gap-1.5">
                <Server className="h-3.5 w-3.5 text-slate-400" /> Verification Cluster
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-100">
              <span>Region: Africa-East (Nairobi)</span>
              <span>TLS 1.3 Encryption</span>
            </div>
          </div>
        </div>

        {/* ==========================================
            RIGHT PANEL: RESET PASSWORD CARD
        ========================================== */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl border border-slate-200/90 bg-white/80 backdrop-blur-xl p-8 sm:p-10 shadow-2xl shadow-slate-300/50 transition-all duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-100 gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    Reset Your Password
                  </h2>
                  <span className="rounded-full bg-slate-900 px-2.5 py-0.5 text-[10px] font-extrabold text-white">
                    v4.2
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Construct a new corporate security key adhering to enterprise guidelines.
                </p>
              </div>

              <div className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 border border-indigo-200">
                <Fingerprint className="h-3.5 w-3.5 text-indigo-600" />
                <span>Identity Verification</span>
              </div>
            </div>

            {error && (
              <div className="mt-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-xs font-semibold">
                <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1">{error}</div>
              </div>
            )}

            {success ? (
              /* ==========================================
                 SUCCESS STATE
              ========================================== */
              <div className="mt-6 space-y-6">
                <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3.5 text-emerald-900">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold">Password Successfully Updated</h3>
                    <p className="text-xs text-emerald-700 leading-relaxed">
                      Your corporate identity credentials have been updated and encrypted. All other active user sessions have been terminated.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2 font-bold text-slate-800">
                    <Sparkles className="h-4 w-4 text-indigo-600" />
                    <span>Security Confirmation Summary:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 pl-1 text-[11px] text-slate-500">
                    <li>New 256-bit hash key successfully deployed to Auth cluster.</li>
                    <li>Audit trail log written: ID #SEC-KEY-99814.</li>
                    <li>Please authenticate with your new credentials on the login terminal.</li>
                  </ul>
                </div>

                <div className="pt-2">
                  <Link
                    href="/auth/login"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/25 transition-all duration-200 hover:bg-indigo-700 hover:scale-[1.005] active:scale-[0.99] cursor-pointer"
                  >
                    <span>Continue to Login</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ) : (
              /* ==========================================
                 RESET FORM STATE
              ========================================== */
              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                {/* New Password Field */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    New Password
                  </label>
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
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  {/* Strength Meter Bar */}
                  {password.length > 0 && (
                    <div className="mt-3 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                        <span>Password Strength:</span>
                        <span className={strength.score === 3 ? "text-emerald-600" : strength.score === 2 ? "text-amber-600" : "text-rose-600"}>
                          {strength.label}
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${strength.color} ${strength.width} transition-all duration-300`} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      placeholder="••••••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-10 pr-11 py-3 text-sm text-slate-900 placeholder-slate-400 font-medium focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                      title={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  {/* Password Match Indicator */}
                  {confirmPassword.length > 0 && (
                    <p className={`mt-2 text-[11px] font-bold flex items-center gap-1 ${passwordsMatch ? "text-emerald-600" : "text-rose-600"}`}>
                      {passwordsMatch ? (
                        <>
                          <Check className="h-3.5 w-3.5" /> Passwords match
                        </>
                      ) : (
                        <>
                          <X className="h-3.5 w-3.5" /> Passwords do not match
                        </>
                      )}
                    </p>
                  )}
                </div>

                {/* Requirements Checklist Card */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <p className="text-xs font-bold text-slate-800">Password Policy Requirements:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    {[
                      { label: "At least 8 characters", valid: hasMinLength },
                      { label: "One uppercase letter (A-Z)", valid: hasUppercase },
                      { label: "One lowercase letter (a-z)", valid: hasLowercase },
                      { label: "One number (0-9)", valid: hasNumber },
                      { label: "One special character (!@#$%)", valid: hasSpecialChar }
                    ].map((req, idx) => (
                      <div key={idx} className={`flex items-center gap-1.5 font-medium ${req.valid ? "text-emerald-600" : "text-slate-400"}`}>
                        {req.valid ? <Check className="h-3.5 w-3.5 shrink-0" /> : <X className="h-3.5 w-3.5 shrink-0" />}
                        <span>{req.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Primary Action Button */}
                <button
                  type="submit"
                  disabled={!isFormValid || loading}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/25 transition-all duration-200 hover:bg-indigo-700 hover:scale-[1.005] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-white" />
                      <span>Updating Credentials...</span>
                    </>
                  ) : (
                    <>
                      <span>Update & Reset Password</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>

                <div className="text-center pt-2">
                  <Link
                    href="/auth/login"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Back to Enterprise Login</span>
                  </Link>
                </div>
              </form>
            )}

            {/* ==========================================
                SECURITY BADGES
            ========================================== */}
            <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              {[
                { label: "MFA Protected", icon: Shield },
                { label: "TLS 1.3 SSL", icon: Lock },
                { label: "SOC2 Type II", icon: CheckCircle2 },
                { label: "ISO 27001", icon: Globe }
              ].map((badge, idx) => {
                const BadgeIcon = badge.icon;
                return (
                  <div key={idx} className="flex flex-col items-center gap-1 p-2 rounded-xl bg-slate-50/80 border border-slate-100">
                    <BadgeIcon className="h-3.5 w-3.5 text-slate-500" />
                    <span className="text-[10px] font-bold text-slate-600">{badge.label}</span>
                  </div>
                );
              })}
            </div>

            {/* ==========================================
                FOOTER HELP & LEGAL
            ========================================== */}
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