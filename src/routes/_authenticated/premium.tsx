import { createFileRoute, redirect } from "@tanstack/react-router";
import { PremiumLayout } from "@/components/edview/PremiumLayout";
import { supabase } from "@/integrations/supabase/client";
import type { AppRole } from "@/lib/auth-context";

export const Route = createFileRoute("/_authenticated/premium")({
  ssr: false,
  head: () => ({ meta: [{ title: "Premium Dashboard - EdView" }] }),
  beforeLoad: async ({ location }) => {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      throw redirect({ to: "/auth", search: { redirect: location.href } });
    }

    const { data: roleRows, error: rolesError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id);

    if (rolesError) throw rolesError;

    const roles = ((roleRows ?? []) as { role: AppRole }[]).map((r) => r.role);
    if (!roles.includes("college_admin")) {
      throw redirect({ to: roles.includes("platform_admin") ? "/admin" : "/dashboard" });
    }
  },
  component: PremiumLayout,
});
