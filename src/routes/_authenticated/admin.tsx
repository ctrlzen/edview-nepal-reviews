import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ShieldCheck, CheckCircle2, XCircle, MessageSquare, Users, Building2 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { useReviews } from "@/lib/edview-store";
import { COLLEGES } from "@/lib/edview-data";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Platform admin — EdView" }] }),
  component: AdminPage,
});

type ProfileRow = { id: string; full_name: string | null; student_verified: boolean; created_at: string };
type RoleRow = { user_id: string; role: "student" | "college_admin" | "platform_admin" };
type AssignmentRow = { id: string; user_id: string; college_slug: string; verified: boolean };

function AdminPage() {
  const { hasRole, loading } = useAuth();
  const [tab, setTab] = useState<"users" | "colleges" | "reviews">("users");

  if (loading) return <Shell><p className="text-sm text-muted-foreground">Loading…</p></Shell>;

  if (!hasRole("platform_admin")) {
    return (
      <Shell>
        <div className="rounded-3xl border border-border bg-card p-10 text-center shadow-soft">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand/10 text-brand">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-2xl">Platform Admin only</h2>
          <p className="mt-2 max-w-md mx-auto text-sm text-muted-foreground">
            This area is reserved for EdView platform administrators. Contact the team if you believe you should have access.
          </p>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
        <ShieldCheck className="h-3.5 w-3.5" /> Platform admin console
      </div>
      <h1 className="mt-3 text-4xl tracking-tight">
        Manage <span className="font-display italic">EdView.</span>
      </h1>

      <div className="mt-6 flex gap-1 rounded-full bg-muted p-1 text-sm w-fit">
        <TabBtn active={tab === "users"} onClick={() => setTab("users")} icon={<Users className="h-3.5 w-3.5" />}>Users</TabBtn>
        <TabBtn active={tab === "colleges"} onClick={() => setTab("colleges")} icon={<Building2 className="h-3.5 w-3.5" />}>Colleges</TabBtn>
        <TabBtn active={tab === "reviews"} onClick={() => setTab("reviews")} icon={<MessageSquare className="h-3.5 w-3.5" />}>Reviews</TabBtn>
      </div>

      <div className="mt-6">
        {tab === "users" && <UsersPanel />}
        {tab === "colleges" && <CollegesPanel />}
        {tab === "reviews" && <ReviewsPanel />}
      </div>
    </Shell>
  );
}

function UsersPanel() {
  const qc = useQueryClient();
  const users = useQuery({
    queryKey: ["admin-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("id, full_name, student_verified, created_at").order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as ProfileRow[];
    },
  });
  const roles = useQuery({
    queryKey: ["admin-roles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("user_roles").select("user_id, role");
      if (error) throw error;
      return (data ?? []) as RoleRow[];
    },
  });

  const verify = useMutation({
    mutationFn: async ({ id, verified }: { id: string; verified: boolean }) => {
      const { error } = await supabase.from("profiles").update({ student_verified: verified }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-profiles"] }),
  });

  const rolesByUser = new Map<string, string[]>();
  (roles.data ?? []).forEach((r) => {
    const list = rolesByUser.get(r.user_id) ?? [];
    list.push(r.role);
    rolesByUser.set(r.user_id, list);
  });

  return (
    <div className="rounded-3xl border border-border bg-card shadow-soft">
      <div className="border-b border-border p-5">
        <h3 className="text-sm font-semibold">All users</h3>
        <p className="mt-1 text-xs text-muted-foreground">Verify students to unlock review-writing.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="p-4">Name</th>
              <th className="p-4">Roles</th>
              <th className="p-4">Student verified</th>
              <th className="p-4">Joined</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {(users.data ?? []).map((u) => {
              const userRoles = rolesByUser.get(u.id) ?? [];
              return (
                <tr key={u.id} className="border-b border-border last:border-0">
                  <td className="p-4 font-medium">{u.full_name ?? "—"}</td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {userRoles.map((r) => (
                        <span key={r} className="rounded-full bg-muted px-2 py-0.5 text-xs">{r.replace("_", " ")}</span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4">
                    {u.student_verified ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand"><CheckCircle2 className="h-3.5 w-3.5" /> Verified</span>
                    ) : (
                      <span className="text-xs text-muted-foreground">Pending</span>
                    )}
                  </td>
                  <td className="p-4 text-xs text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => verify.mutate({ id: u.id, verified: !u.student_verified })}
                      className="rounded-full border border-border px-3 py-1 text-xs font-medium hover:bg-muted"
                    >
                      {u.student_verified ? "Revoke" : "Verify"}
                    </button>
                  </td>
                </tr>
              );
            })}
            {users.data && users.data.length === 0 && (
              <tr><td colSpan={5} className="p-8 text-center text-sm text-muted-foreground">No users yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CollegesPanel() {
  const qc = useQueryClient();
  const assignments = useQuery({
    queryKey: ["admin-assignments"],
    queryFn: async () => {
      const { data, error } = await supabase.from("college_admin_assignments").select("id, user_id, college_slug, verified");
      if (error) throw error;
      return (data ?? []) as AssignmentRow[];
    },
  });

  const toggleVerify = useMutation({
    mutationFn: async ({ id, verified }: { id: string; verified: boolean }) => {
      const { error } = await supabase.from("college_admin_assignments").update({ verified }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-assignments"] }),
  });

  const [userId, setUserId] = useState("");
  const [slug, setSlug] = useState(COLLEGES[0].slug);
  const create = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("college_admin_assignments").insert({ user_id: userId.trim(), college_slug: slug, verified: true });
      if (error) throw error;
    },
    onSuccess: () => {
      setUserId("");
      qc.invalidateQueries({ queryKey: ["admin-assignments"] });
    },
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="rounded-3xl border border-border bg-card shadow-soft">
        <div className="border-b border-border p-5">
          <h3 className="text-sm font-semibold">College admin assignments</h3>
          <p className="mt-1 text-xs text-muted-foreground">Link college-admin users to the college they manage.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="p-4">User ID</th>
                <th className="p-4">College</th>
                <th className="p-4">Status</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {(assignments.data ?? []).map((a) => {
                const college = COLLEGES.find((c) => c.slug === a.college_slug);
                return (
                  <tr key={a.id} className="border-b border-border last:border-0">
                    <td className="p-4 font-mono text-xs">{a.user_id.slice(0, 8)}…</td>
                    <td className="p-4">{college?.name ?? a.college_slug}</td>
                    <td className="p-4">
                      {a.verified
                        ? <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand"><CheckCircle2 className="h-3.5 w-3.5" /> Verified</span>
                        : <span className="text-xs text-muted-foreground">Pending</span>}
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => toggleVerify.mutate({ id: a.id, verified: !a.verified })} className="rounded-full border border-border px-3 py-1 text-xs font-medium hover:bg-muted">
                        {a.verified ? "Revoke" : "Verify"}
                      </button>
                    </td>
                  </tr>
                );
              })}
              {assignments.data && assignments.data.length === 0 && (
                <tr><td colSpan={4} className="p-8 text-center text-sm text-muted-foreground">No assignments yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-card p-5 shadow-soft">
        <h3 className="text-sm font-semibold">Link college admin</h3>
        <p className="mt-1 text-xs text-muted-foreground">Paste the user ID from the Users tab.</p>
        <div className="mt-4 space-y-3">
          <input value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="User UUID" className="h-10 w-full rounded-xl border border-border bg-background px-3 font-mono text-xs outline-none focus:border-brand" />
          <select value={slug} onChange={(e) => setSlug(e.target.value)} className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-brand">
            {COLLEGES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
          <button disabled={!userId.trim() || create.isPending} onClick={() => create.mutate()} className="inline-flex h-10 w-full items-center justify-center rounded-full bg-foreground text-sm font-medium text-background disabled:opacity-50">
            Assign
          </button>
          {create.error && <p className="text-xs text-destructive">{(create.error as Error).message}</p>}
        </div>
      </div>
    </div>
  );
}

function ReviewsPanel() {
  const { reviews, removeReview } = useReviews();

  return (
    <div className="rounded-3xl border border-border bg-card shadow-soft">
      <div className="border-b border-border p-5">
        <h3 className="text-sm font-semibold">Moderate reviews</h3>
        <p className="mt-1 text-xs text-muted-foreground">Remove reviews that violate community guidelines.</p>
      </div>
      <div className="divide-y divide-border">
        {reviews.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">No user-submitted reviews yet.</p>
        ) : reviews.map((r) => {
          const college = COLLEGES.find((c) => c.slug === r.collegeSlug);
          return (
            <div key={r.id} className="flex items-start justify-between gap-4 p-5">
              <div className="min-w-0">
                <div className="text-xs text-muted-foreground">{college?.name ?? r.collegeSlug} · {r.author} · {r.date}</div>
                <div className="mt-1 text-sm font-semibold">{r.title}</div>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{r.body}</p>
              </div>
              <button onClick={() => removeReview(r.id)} className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10">
                <XCircle className="h-3.5 w-3.5" /> Remove
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TabBtn({ active, onClick, icon, children }: { active: boolean; onClick: () => void; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-medium transition ${active ? "bg-background text-foreground shadow-soft" : "text-muted-foreground"}`}>
      {icon}{children}
    </button>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-6xl px-6 py-14">{children}</div>;
}
