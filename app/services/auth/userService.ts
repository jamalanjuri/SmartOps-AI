import supabase from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export interface UserProfile {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  role?: string;
}

interface DatabaseProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: string | null;
}

class UserService {
  /**
   * Get the currently authenticated Supabase user.
   *
   * We use the user already contained in the local session
   * instead of calling supabase.auth.getUser().
   *
   * This avoids unnecessary Auth API requests and prevents
   * repeated calls from contributing to rate limiting.
   */
  async getCurrentUser(): Promise<User | null> {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error(
        "Failed to get authentication session:",
        error.message
      );

      return null;
    }

    return session?.user ?? null;
  }

  /**
   * Get a SmartOps application profile from public.profiles.
   *
   * An optional User can be supplied by AuthProvider so that
   * we do not perform another session lookup unnecessarily.
   */
  async getProfile(
    currentUser?: User
  ): Promise<UserProfile | null> {
    const user =
      currentUser ?? (await this.getCurrentUser());

    if (!user) {
      return null;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select(
        "id, email, full_name, avatar_url, role"
      )
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      console.error(
        "Failed to get user profile:",
        error.message
      );

      return null;
    }

    if (!data) {
      console.warn(
        "No profile record found for authenticated user:",
        user.id
      );

      return null;
    }

    const profile = data as DatabaseProfile;

    return {
      id: profile.id,
      email:
        profile.email ??
        user.email ??
        "",
      fullName:
        profile.full_name ?? "",
      avatarUrl:
        profile.avatar_url ?? "",
      role:
        profile.role ?? "staff",
    };
  }

  /**
   * Update the authenticated user's profile
   * in public.profiles.
   */
  async updateProfile(
    updates: {
      fullName?: string;
      avatarUrl?: string;
    },
    currentUser?: User
  ) {
    const user =
      currentUser ?? (await this.getCurrentUser());

    if (!user) {
      return {
        success: false,
        data: null,
        error: "No authenticated user.",
      };
    }

    const { data, error } = await supabase
      .from("profiles")
      .update({
        full_name: updates.fullName,
        avatar_url: updates.avatarUrl,
      })
      .eq("id", user.id)
      .select(
        "id, email, full_name, avatar_url, role"
      )
      .maybeSingle();

    if (error) {
      console.error(
        "Failed to update user profile:",
        error.message
      );
    }

    return {
      success: !error,
      data,
      error: error?.message ?? null,
    };
  }

  /**
   * Get the authenticated user's application role.
   */
  async getRole(
    currentUser?: User
  ): Promise<string> {
    const profile =
      await this.getProfile(currentUser);

    return profile?.role ?? "staff";
  }

  /**
   * Check whether the current user has
   * one of the allowed application roles.
   */
  async hasRole(
    roles: string[],
    currentUser?: User
  ): Promise<boolean> {
    const role =
      await this.getRole(currentUser);

    return roles.includes(role);
  }
}

const userService = new UserService();

export default userService;