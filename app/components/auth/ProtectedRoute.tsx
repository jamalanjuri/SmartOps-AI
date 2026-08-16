"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

import useAuth from "@/app/hooks/useAuth";
import LoadingScreen from "./LoadingScreen";

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  redirectTo = "/auth/login",
}: ProtectedRouteProps) {
  const router = useRouter();

  const {
    user,
    loading,
  } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(redirectTo);
    }
  }, [loading, user, router, redirectTo]);

  // Still checking authentication
  if (loading) {
    return (
      <LoadingScreen message="Verifying your session..." />
    );
  }

  // No authenticated user
  if (!user) {
    return null;
  }

  // User authenticated
  return <>{children}</>;
}