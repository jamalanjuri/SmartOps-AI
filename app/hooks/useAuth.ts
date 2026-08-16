"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  role: string;
}

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session?.user) {
          if (isMounted) {
            setUser(null);
            setProfile(null);
            setLoading(false);
          }
          return;
        }

        if (isMounted) setUser(session.user);

        // Fetch user profile from Supabase with a fallback
        const { data: profileData } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", session.user.id)
          .maybeSingle();

        if (isMounted) {
          if (profileData) {
            setProfile(profileData);
          } else {
            setProfile({
              id: session.user.id,
              email: session.user.email || "",
              role: "admin",
            });
          }
        }
      } catch (err) {
        console.error("Auth init exception:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    initAuth();

    // Fallback safety timeout so page never freezes permanently
    const timeoutId = setTimeout(() => {
      if (isMounted && loading) {
        setLoading(false);
      }
    }, 2500);

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!isMounted) return;

        if (session?.user) {
          setUser(session.user);
          const { data: profileData } = await supabase
            .from("user_profiles")
            .select("*")
            .eq("id", session.user.id)
            .maybeSingle();

          if (isMounted) {
            setProfile(
              profileData || {
                id: session.user.id,
                email: session.user.email || "",
                role: "admin",
              }
            );
          }
        } else {
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      authListener.subscription.unsubscribe();
    };
  }, []);

  return { user, profile, loading };
}

export default useAuth;