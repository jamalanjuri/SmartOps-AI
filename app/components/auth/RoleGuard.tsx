"use client";

import { ReactNode } from "react";

import useAuth from "@/app/hooks/useAuth";
import LoadingScreen from "./LoadingScreen";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: string[];
  fallback?: ReactNode;
}

export default function RoleGuard({
  children,
  allowedRoles,
  fallback,
}: RoleGuardProps) {
  const {
    loading,
    profile,
  } = useAuth();

  if (loading) {
    return (
      <LoadingScreen message="Checking permissions..." />
    );
  }

  const userRole = profile?.role ?? "admin";

  const hasPermission = allowedRoles.includes(userRole);

  if (!hasPermission) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6">
        <div className="max-w-md rounded-3xl border border-red-500/20 bg-slate-900 p-10 text-center shadow-2xl">
          <div className="mb-4 text-6xl">
            🚫
          </div>

          <h1 className="text-2xl font-bold text-white">
            Access Denied
          </h1>

          <p className="mt-4 text-slate-400">
            Your account does not have permission to access this page.
          </p>

          <div className="mt-8 rounded-xl bg-slate-800 p-4">
            <p className="text-sm text-slate-300">
              Current Role
            </p>

            <p className="mt-2 text-lg font-semibold text-cyan-400 capitalize">
              {userRole}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}