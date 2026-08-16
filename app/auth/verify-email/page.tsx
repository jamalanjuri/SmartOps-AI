"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BrainCircuit,
  Mail,
  MailCheck,
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
  Lock,
  Globe,
  RefreshCw
} from "lucide-react";

export default function VerifyEmailPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [verified, setVerified] = useState<boolean>(false);
  const [resending, setResending] = useState<boolean>(false);
  const [resent, setResent] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(60);
  const [canResend, setCanResend] = useState<boolean>(false);

  // Email state for demonstration / simulation
  const userEmail = "john.doe@smartops.co.ke";

  // Handle resend countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0 && !canResend) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [countdown, canResend]);

  const handleVerifyCheck = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setVerified(true);
    }, 2000);
  };

  const handleResendEmail = () => {
    if (!canResend || resending) return;

    setResending(true);
    setResent(false);

    setTimeout(() => {
      setResending(false);
      setResent(true);
      setCanResend(false);
      setCountdown(60);
    }, 2000);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-100 via-white to-indigo-100 flex items-center justify-center p-6">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
                <BrainCircuit className="h-7 w-7 text-indigo-400"/>
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                  SmartOps <span className="text-indigo-600">AI</span>
                </h1>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                  Enterprise Email Verification
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed pt-2">
              Corporate email verification protocol ensures strict data governance, zero-trust authentication, and authorized role dispatch before granting system access.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                title: "Secure Email Verification",
                desc: "Cryptographic single-use token authorization dispatch",
                icon: MailCheck
              },
              {
                title: "Zero Trust Identity",
                desc: "Strict access control and continuous session integrity",
                icon: Shield
              },
              {
                title: "Enterprise Access Control",
                desc: "Role-based authorization tied directly to corporate domain",
                icon: Building2
              },
              {
                title: "Encrypted Authentication Tokens",
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
                <Server className="h-3.5 w-3.5 text-slate-400"/> Verification Cluster
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
            RIGHT PANEL: VERIFY EMAIL CARD
        ========================================== */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl border border-slate-200/90 bg-white/80 backdrop-blur-xl p-8 sm:p-10 shadow-2xl shadow-slate-300/50 transition-all duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-100 gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    Verify Your Email
                  </h2>
                  <span className="rounded-full bg-slate-900 px-2.5 py-0.5 text-[10px] font-extrabold text-white">
                    v4.2
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  A verification email has been dispatched to your corporate inbox.
                </p>
              </div>

              <div className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 border border-indigo-200">
                <Fingerprint className="h-3.5 w-3.5 text-indigo-600"/>
                <span>Identity Verification</span>
              </div>
            </div>

            {verified ? (
              /* ==========================================
                 SUCCESS STATE
              ========================================== */
              <div className="mt-6 space-y-6">
                <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3.5 text-emerald-900">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0 mt-0.5"/>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold">Email Successfully Verified</h3>
                    <p className="text-xs text-emerald-700 leading-relaxed">
                      Your corporate identity (<span className="font-semibold underline">{userEmail}</span>) has been verified. You can now securely access SmartOps AI.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2 font-bold text-slate-800">
                    <Sparkles className="h-4 w-4 text-indigo-600"/>
                    <span>Authorized System Privileges:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 pl-1 text-[11px] text-slate-500">
                    <li>Full operational access to Multi-Branch POS & Inventory.</li>
                    <li>AI Telemetry Dashboard & Financial Ledger synchronization.</li>
                    <li>Multi-Factor Authentication (MFA) enabled for active session.</li>
                  </ul>
                </div>

                <div className="pt-2">
                  <Link className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/25 transition-all duration-200 hover:bg-indigo-700 hover:scale-[1.005] active:scale-[0.99] cursor-pointer" href="/auth/login">
                    <span>Continue to Login</span>
                    <ArrowRight className="h-4 w-4"/>
                  </Link>
                </div>
              </div>
            ) : (
              /* ==========================================
                 VERIFICATION IN-PROGRESS FORM
              ========================================== */
              <div className="mt-6 space-y-5">
                {/* Email Display Status Card */}
                <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-white text-indigo-600 shadow-sm shrink-0">
                      <Mail className="h-5 w-5"/>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-indigo-900 uppercase tracking-wider">
                        Target Verification Inbox
                      </p>
                      <p className="text-sm font-extrabold text-slate-900 font-mono">
                        {userEmail}
                      </p>
                    </div>
                  </div>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-indigo-700 bg-white px-2.5 py-1 rounded-full border border-indigo-200">
                    Dispatch Sent
                  </span>
                </div>

                {resent && (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 text-emerald-800 text-xs font-semibold">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5"/>
                    <div className="flex-1">
                      A new verification email has been sent to your inbox.
                    </div>
                  </div>
                )}

                <p className="text-xs text-slate-600 leading-relaxed">
                  Please click the link inside the security email sent to your corporate address. Once completed, click the button below to validate your credentials.
                </p>

                {/* Primary Action Button */}
                <button
                  type="button"
                  onClick={handleVerifyCheck}
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/25 transition-all duration-200 hover:bg-indigo-700 hover:scale-[1.005] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-white"/>
                      <span>Validating Authorization...</span>
                    </>
                  ) : (
                    <>
                      <span>I've Verified My Email</span>
                      <ArrowRight className="h-4 w-4"/>
                    </>
                  )}
                </button>

                {/* Secondary Resend Option */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700">Didn't receive the email?</span>
                    {!canResend && (
                      <span className="text-[11px] font-mono font-semibold text-slate-500">
                        Resend in <span className="text-indigo-600 font-bold">{countdown}s</span>
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleResendEmail}
                    disabled={!canResend || resending}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 hover:text-indigo-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    {resending ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-600"/>
                        <span>Dispatching New Link...</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-3.5 w-3.5"/>
                        <span>Resend Verification Email</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="text-center pt-2">
                  <Link className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors" href="/auth/login">
                    <ArrowLeft className="h-3.5 w-3.5"/>
                    <span>Back to Enterprise Login</span>
                  </Link>
                </div>
              </div>
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
                    <BadgeIcon className="h-3.5 w-3.5 text-slate-500"/>
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