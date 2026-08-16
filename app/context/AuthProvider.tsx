"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";

import type {
  Session,
  User,
} from "@supabase/supabase-js";

import authService from "@/app/services/auth/authService";
import sessionService from "@/app/services/auth/sessionService";
import userService, {
  type UserProfile,
} from "@/app/services/auth/userService";

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;

  signIn: (
    email: string,
    password: string
  ) => Promise<any>;

  signOut: () => Promise<void>;

  refresh: () => Promise<void>;
}

const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  );

interface Props {
  children: ReactNode;
}

export function AuthProvider({
  children,
}: Props) {
  const [user, setUser] =
    useState<User | null>(null);

  const [profile, setProfile] =
    useState<UserProfile | null>(null);

  const [session, setSession] =
    useState<Session | null>(null);

  const [loading, setLoading] =
    useState(true);

  /**
   * Apply the current Supabase session
   * and load the SmartOps application profile
   * from public.profiles.
   *
   * The authenticated user is passed directly
   * to userService so we do not perform another
   * unnecessary authentication/session lookup.
   */
  const applySession = async (
    currentSession: Session | null
  ) => {
    setSession(currentSession);

    if (!currentSession) {
      setUser(null);
      setProfile(null);
      return;
    }

    const currentUser =
      currentSession.user;

    setUser(currentUser);

    try {
      const currentProfile =
        await userService.getProfile(
          currentUser
        );

      setProfile(currentProfile);
    } catch (error) {
      console.error(
        "Failed to load SmartOps user profile:",
        error
      );

      setProfile(null);
    }
  };

  /**
   * Reload the current authentication
   * session and database profile.
   */
  const refresh = async () => {
    try {
      setLoading(true);

      const currentSession =
        await sessionService.getSession();

      await applySession(currentSession);
    } catch (error) {
      console.error(
        "Failed to refresh authentication state:",
        error
      );

      await applySession(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sign into SmartOps AI.
   */
  const signIn = async (
    email: string,
    password: string
  ) => {
    const result =
      await authService.signIn(
        email,
        password
      );

    /*
     * Supabase emits SIGNED_IN after
     * successful authentication.
     *
     * The auth-state listener below receives
     * the new session and loads the profile.
     */
    return result;
  };

  /**
   * Sign out of SmartOps AI.
   */
  const signOut = async () => {
    await authService.signOut();

    /*
     * Clear local state immediately.
     */
    await applySession(null);
  };

  /**
   * Initialize authentication and subscribe
   * to future Supabase authentication changes.
   */
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        setLoading(true);

        const currentSession =
          await sessionService.getSession();

        if (mounted) {
          await applySession(
            currentSession
          );
        }
      } catch (error) {
        console.error(
          "Failed to initialize authentication:",
          error
        );

        if (mounted) {
          await applySession(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    const subscription =
      sessionService.onAuthStateChange(
        async (currentSession) => {
          if (!mounted) {
            return;
          }

          await applySession(
            currentSession
          );

          if (mounted) {
            setLoading(false);
          }
        }
      );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value =
    useMemo<AuthContextType>(
      () => ({
        user,
        profile,
        session,
        loading,
        isAuthenticated: !!user,
        signIn,
        signOut,
        refresh,
      }),
      [
        user,
        profile,
        session,
        loading,
      ]
    );

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuthContext must be used inside AuthProvider."
    );
  }

  return context;
}

export default AuthProvider;