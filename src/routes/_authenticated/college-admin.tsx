import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Building2, Star, TrendingUp, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { COLLEGES, SEED_REVIEWS, collegeAverages, avgOverall, recommendationPct, CATEGORIES, type Category } from "@/lib/edview-data";

export const Route = createFileRoute("/_authenticated/college-admin")({
  head: () => ({ meta: [{ title: "College admin dashboard — EdView" }] }),
  component: CollegeAdminPage,
});

function CollegeAdminPage() {
  const { user, hasRole, loading } = useAuth();

  const { data: assignments = [] } = useQuery({
    queryKey: ["college-admin-assignments", user?.id],
    enabled: !!user && hasRole("college_admin"),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("college_admin_assignments")
        .select("college_slug, verified")
        .eq("user_id", user!.id);
      if (error) throw error;
      return data as { college_slug: string; verified: boolean }[];
    },
  });

  if (loading) return <PageShell><p className="text-sm text-muted-foreground">Loading…</p></PageShell>;

  if (!hasRole("college_admin")) {
    return (
      <PageShell>
        <div className="rounded-3xl border border-border bg-card p-10 text-center shadow-soft">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand/10 text-brand">
            <Building2 className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-2xl">College Admin — <span className="font-display italic">Premium</span></h2>
          <p className="mt-2 max-w-md mx-auto text-sm text-muted-foreground">
            This dashboard is reserved for verified College Admin accounts. If you represent a college,
            create an account with the College Admin role and our team will verify you shortly.
          </p>
        </div>
      </PageShell>
    );
  }

  const colleges = assignments
    .map((a) => COLLEGES.find((c) => c.slug === a.college_slug))
    .filter((c): c is (typeof COLLEGES)[number] => !!c);

  const primary = colleges[0];

  return (
    <PageShell>
      <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
        <Building2 className="h-3.5 w-3.5" /> Premium — College Admin
      </div>

      {colleges.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-card p-10 text-center">
          <p className="text-sm text-muted-foreground">
            Your account is being verified. Once a Platform Admin links you to a college, its analytics will appear here.
          </p>
        </div>
      ) : (
        primary && <CollegeDashboard slug={primary.slug} colleges={colleges} />
      )}
    </PageShell>
  );
}

function CollegeDashboard({ slug, colleges }: { slug: string; colleges: typeof COLLEGES }) {
  const college = colleges.find((c) => c.slug === slug)!;
  const reviews = SEED_REVIEWS.filter((r) => r.collegeSlug === slug);
  const averages = collegeAverages(reviews);
  const overall = avgOverall(averages);
  const recommend = recommendationPct(reviews);

  return (
    <>
      <h1 className="text-4xl tracking-tight">
        {college.name} <span className="font-display italic text-brand">— live dashboard.</span>
      </h1>
      <p className="mt-2 text-muted-foreground">Real-time snapshot of how students perceive your college on EdView.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Kpi label="Reviews" value={String(reviews.length)} icon={<Users className="h-4 w-4" />} />
        <Kpi label="Overall rating" value={`${overall.toFixed(2)} / 5`} icon={<Star className="h-4 w-4" />} />
        <Kpi label="Would recommend" value={`${recommend}%`} icon={<TrendingUp className="h-4 w-4" />} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
          <h3 className="text-sm font-semibold">Category averages</h3>
          <div className="mt-4 space-y-3">
            {CATEGORIES.map(({ key, label }) => {
              const v = averages[key as Category];
              return (
                <div key={key}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-semibold">{v.toFixed(2)}</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-brand" style={{ width: `${(v / 5) * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
          <h3 className="text-sm font-semibold">Profile management</h3>
          <p className="mt-2 text-xs text-muted-foreground">
            Update your public college profile fields. Changes are queued for platform-admin review before going live.
          </p>
          <div className="mt-4 space-y-3 text-sm">
            <PField label="Tagline" value={college.tagline} />
            <PField label="Programs" value={college.programs.join(", ")} />
            <PField label="Tuition range" value={college.tuitionRange} />
            <PField label="About" value={college.about} multiline />
          </div>
          <button className="mt-5 inline-flex h-10 items-center rounded-full bg-foreground px-5 text-sm font-medium text-background">
            Submit changes for review
          </button>
        </div>
      </div>
    </>
  );
}

function Kpi({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-soft">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span className="grid h-7 w-7 place-items-center rounded-full bg-brand/10 text-brand">{icon}</span>
      </div>
      <div className="mt-2 text-3xl font-semibold tracking-tight">{value}</div>
    </div>
  );
}

function PField({ label, value, multiline }: { label: string; value: string; multiline?: boolean }) {
  return (
    <div>
      <div className="mb-1 text-xs font-medium text-muted-foreground">{label}</div>
      {multiline ? (
        <textarea defaultValue={value} rows={3} className="w-full rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-brand" />
      ) : (
        <input defaultValue={value} className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-brand" />
      )}
    </div>
  );
}

function PageShell({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-6xl px-6 py-14">{children}</div>;
}

// Prevent TS unused warning for redirect import kept for future use.
void redirect;
