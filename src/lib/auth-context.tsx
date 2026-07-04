import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "student" | "college_admin" | "platform_admin";

export type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  student_verified: boolean;
};

type AuthState = {
  loading: boolean;
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  roles: AppRole[];
  isAuthenticated: boolean;
  hasRole: (r: AppRole) => boolean;
  primaryRole: AppRole | null;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthCtx = createContext<AuthState | null>(null);

async function loadProfileAndRoles(userId: string) {
  const [{ data: profile }, { data: roles }] = await Promise.all([
    supabase.from("profiles").select("id, full_name, avatar_url, student_verified").eq("id", userId).maybeSingle(),
    supabase.from("user_roles").select("role").eq("user_id", userId),
  ]);
  return {
    profile: (profile as Profile | null) ?? null,
    roles: ((roles ?? []) as { role: AppRole }[]).map((r) => r.role),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Register listener FIRST so we don't miss the initial event.
    const { data: sub } = supabase.auth.onAuthStateChange((event, next) => {
      if (!mounted) return;
      setSession(next);
      if (next?.user) {
        // Defer supabase calls out of the listener to avoid deadlocks.
        setTimeout(() => {
          loadProfileAndRoles(next.user.id).then((r) => {
            if (!mounted) return;
            setProfile(r.profile);
            setRoles(r.roles);
          });
        }, 0);
      } else {
        setProfile(null);
        setRoles([]);
      }
      if (event === "INITIAL_SESSION") setLoading(false);
    });

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      if (!data.session) setLoading(false);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthState>(() => {
    const primary: AppRole | null =
      roles.includes("platform_admin") ? "platform_admin"
      : roles.includes("college_admin") ? "college_admin"
      : roles.includes("student") ? "student"
      : null;
    return {
      loading,
      session,
      user: session?.user ?? null,
      profile,
      roles,
      isAuthenticated: !!session?.user,
      hasRole: (r) => roles.includes(r),
      primaryRole: primary,
      refresh: async () => {
        if (session?.user) {
          const r = await loadProfileAndRoles(session.user.id);
          setProfile(r.profile);
          setRoles(r.roles);
        }
      },
      signOut: async () => {
        await supabase.auth.signOut();
      },
    };
  }, [loading, session, profile, roles]);

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
