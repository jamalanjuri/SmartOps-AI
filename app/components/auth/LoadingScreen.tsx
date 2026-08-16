"use client";

import { Loader2, ShieldCheck } from "lucide-react";

interface LoadingScreenProps {
  message?: string;
}

export default function LoadingScreen({
  message = "Checking your session...",
}: LoadingScreenProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute left-[-120px] top-[-120px] h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute bottom-[-140px] right-[-140px] h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/80 p-10 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col items-center">
          {/* Logo */}
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg">
            <ShieldCheck className="h-10 w-10 text-white" />
          </div>

          {/* Brand */}
          <h1 className="text-3xl font-bold text-white">
            SmartOps AI
          </h1>

          <p className="mt-2 text-center text-sm text-slate-400">
            Enterprise Business Management Platform
          </p>

          {/* Spinner */}
          <div className="mt-10">
            <Loader2 className="h-12 w-12 animate-spin text-cyan-400" />
          </div>

          {/* Status */}
          <p className="mt-6 text-center text-base font-medium text-slate-200">
            {message}
          </p>

          <p className="mt-2 text-center text-sm text-slate-500">
            Please wait while we securely verify your account.
          </p>

          {/* Progress Bar */}
          <div className="mt-8 h-2 w-full overflow-hidden rounded-full bg-slate-800">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-gradient-to-r from-cyan-500 to-blue-600" />
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-xs text-slate-500">
            Secure Authentication • Powered by Supabase
          </div>
        </div>
      </div>
    </div>
  );
}