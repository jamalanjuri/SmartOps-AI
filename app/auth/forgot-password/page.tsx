"use client";

import React, { useState } from "react";

import Link from "next/link";

import {

BrainCircuit,

Mail,

ArrowRight,

ArrowLeft,

Loader2,

CheckCircle2,

AlertTriangle,

Shield,

Building2,

Database,

Server,

Fingerprint,

Sparkles,

Lock,

Globe

} from "lucide-react";

export default function ForgotPasswordPage() {

const [email, setEmail] = useState("");

const [loading, setLoading] = useState(false);

const [error, setError] = useState<string | null>(null);

const [success, setSuccess] = useState(false);

const handleSubmit = (e: React.FormEvent): void => {

e.preventDefault();

setError(null);

if (!email.trim()) {
  setError("Please enter your registered corporate email address.");
  return;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  setError("Please enter a valid email address format (e.g., name@company.co.ke).");
  return;
}

setLoading(true);

setTimeout(() => {
  setLoading(false);
  setSuccess(true);
}, 1500);
};

return (

<div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-100 via-white to-indigo-100 flex items-center justify-center p-6">

    {/* Decorative Background */}

    <div className="absolute inset-0 overflow-hidden pointer-events-none">

        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="absolute top-1/2 -right-40 h-[30rem] w-[30rem] rounded-full bg-cyan-500/20 blur-3xl" />

        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-violet-500/20 blur-3xl" />

    </div>

    <div className="relative w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">
    <div className="hidden lg:flex lg:col-span-5 flex-col justify-between space-y-8 pr-4">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg shadow-indigo-500/10">
            <BrainCircuit className="h-7 w-7 text-indigo-400"/>
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
              SmartOps <span className="text-indigo-600">AI</span>
            </h1>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
              Enterprise Account Recovery
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed pt-2">
          Secure identity verification and password recovery protocol for authorized enterprise administrators, managers, and operational staff.
        </p>
      </div>

      <div className="space-y-3">
        {[
          {
            title: "Encrypted Reset Tokens",
            desc: "Single-use time-bound cryptographic reset link dispatch",
            icon: Lock
          },
          {
            title: "SOC2 Security Standards",
            desc: "Zero-trust verification & security audit trail logging",
            icon: Shield
          },
          {
            title: "Multi-Branch Governance",
            desc: "Role-based credential recovery with admin oversight",
            icon: Building2
          },
          {
            title: "Automated KRA & Tax Security",
            desc: "Protected financial ledgers and sensitive system access",
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
                <IconComp className="h-4 w-4"/>
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
            <Server className="h-3.5 w-3.5 text-slate-400"/> Security Dispatch Cluster
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

    <div className="lg:col-span-7">
      <div className="rounded-3xl border border-slate-200/90 bg-white/80 backdrop-blur-xl p-8 sm:p-10 shadow-2xl shadow-slate-300/50 transition-all duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-100 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Reset Password
              </h2>
              <span className="rounded-full bg-slate-900 px-2.5 py-0.5 text-[10px] font-extrabold text-white">
                v4.2
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Provide your registered corporate email to receive security recovery instructions.
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 border border-indigo-200">
            <Fingerprint className="h-3.5 w-3.5 text-indigo-600"/>
            <span>Identity Verification</span>
          </div>
        </div>

        {error && (
          <div className="mt-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-xs font-semibold">
            <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5"/>
            <div className="flex-1">{error}</div>
          </div>
        )}

        {success ? (
          <div className="mt-6 space-y-6">
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3.5 text-emerald-900">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5"/>
              <div className="space-y-1">
                <h3 className="text-sm font-bold">Reset Instructions Dispatched</h3>
                <p className="text-xs text-emerald-700 leading-relaxed">
                  If an account exists for <span className="font-semibold underline">{email}</span>, a secure password reset link has been generated and sent. Please check your inbox and spam folders.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <Sparkles className="h-4 w-4 text-indigo-600"/>
                <span>Next Steps for Verification:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 pl-1 text-[11px] text-slate-500">
                <li>The recovery link will expire in 15 minutes.</li>
                <li>Click the token in the email to define your new corporate password.</li>
                <li>If you do not receive an email, contact your System Administrator.</li>
              </ul>
            </div>

            <div className="pt-2">
              <Link className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-3.5 text-sm font-bold text-white shadow-lg transition-all duration-200 hover:bg-slate-800 active:scale-[0.99] cursor-pointer" href="/auth/login">
                <ArrowLeft className="h-4 w-4"/>
                <span>Return to Enterprise Sign In</span>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Corporate Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"/>
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

            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-1.5">
              <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-indigo-600"/>
                Security Notice
              </p>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                For enterprise data governance, password resets are logged in the security audit trail. Multiple failed requests will automatically flag account safety protocols.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/25 transition-all duration-200 hover:bg-indigo-700 hover:scale-[1.005] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white"/>
                  <span>Sending Security Link...</span>
                </>
              ) : (
                <>
                  <span>Send Reset Link</span>
                  <ArrowRight className="h-4 w-4"/>
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <Link className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors" href="/auth/login">
                <ArrowLeft className="h-3.5 w-3.5"/>
                <span>Back to Enterprise Login</span>
              </Link>
            </div>
          </form>
        )}

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
                <BadgeIcon className="h-3.5 w-3.5 text-slate-500"/>
                <span className="text-[10px] font-bold text-slate-600">{badge.label}</span>
              </div>
            );
          })}
        </div>

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