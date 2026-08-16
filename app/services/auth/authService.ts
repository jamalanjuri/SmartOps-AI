import supabase from "@/lib/supabase/client";
import type { AuthError, Session, User } from "@supabase/supabase-js";

export interface AuthResponse {
  success: boolean;
  user?: User | null;
  session?: Session | null;
  error?: string;
}

class AuthService {
  /**
   * Sign In
   */
  async signIn(email: string, password: string): Promise<AuthResponse> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return this.handleResponse(data.user, data.session, error);
  }

  /**
   * Register User
   */
  async signUp(
    email: string,
    password: string
  ): Promise<AuthResponse> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    return this.handleResponse(data.user, data.session, error);
  }

  /**
   * Logout
   */
  async signOut(): Promise<boolean> {
    const { error } = await supabase.auth.signOut();

    return !error;
  }

  /**
   * Forgot Password
   */
  async forgotPassword(email: string): Promise<boolean> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo:
        `${window.location.origin}/auth/reset-password`,
    });

    return !error;
  }

  /**
   * Get Logged In User
   */
  async getCurrentUser(): Promise<User | null> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    return user;
  }

  /**
   * Get Active Session
   */
  async getSession(): Promise<Session | null> {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    return session;
  }

  /**
   * Update Password
   */
  async updatePassword(password: string): Promise<boolean> {
    const { error } = await supabase.auth.updateUser({
      password,
    });

    return !error;
  }

  /**
   * Internal Response Handler
   */
  private handleResponse(
    user: User | null,
    session: Session | null,
    error: AuthError | null
  ): AuthResponse {
    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      user,
      session,
    };
  }
}

const authService = new AuthService();

export default authService;