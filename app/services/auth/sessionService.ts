import supabase from "@/lib/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

class SessionService {
  /**
   * Returns the current authenticated session.
   */
  async getSession(): Promise<Session | null> {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    return session;
  }

  /**
   * Returns the currently authenticated user.
   */
  async getUser(): Promise<User | null> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    return user;
  }

  /**
   * Returns true if a user is logged in.
   */
  async isAuthenticated(): Promise<boolean> {
    const session = await this.getSession();
    return session !== null;
  }

  /**
   * Refresh the current authentication session.
   */
  async refreshSession(): Promise<Session | null> {
    const {
      data: { session },
      error,
    } = await supabase.auth.refreshSession();

    if (error) {
      console.error("Failed to refresh session:", error.message);
      return null;
    }

    return session;
  }

  /**
   * Subscribe to authentication state changes.
   */
  onAuthStateChange(
    callback: (session: Session | null) => void
  ) {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      callback(session);
    });

    return subscription;
  }
}

const sessionService = new SessionService();

export default sessionService;