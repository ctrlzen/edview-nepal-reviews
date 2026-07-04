import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Flame, Sparkles, ThumbsUp, Clock, Heart, GraduationCap, Wallet,
  Trash2, ArrowRight, TrendingUp, BadgeCheck, CalendarClock,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { useRecentlyViewed } from "@/lib/recently-viewed";
import {
  COLLEGES, SEED_REVIEWS, ADMISSIONS, SCHOLARSHIPS,
  collegeAverages, avgOverall, recommendationPct, daysUntil,
} from "@/lib/edview-data";
import { AiSearchBar } from "@/components/edview/AiSearchBar";
import { CollegeLogo, TrendingCard } from "@/components/edview/CollegeCards";
import { RatingPill, Stars } from "@/components/edview/Stars";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — EdView" }] }),
  component: DashboardPage,
});

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

function DashboardPage() {
  const { profile, user } = useAuth();
  const { slugs: recentSlugs } = useRecentlyViewed();
  const firstName = (profile?.full_name ?? user?.email ?? "there").split(" ")[0];

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 md:py-14">
      {/* Hero */}
      <section className="animate-fade-in-up">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand">Your dashboard</p>
        <h1 className="mt-2 text-4xl tracking-tight md:text-5xl">
          {greeting()}, {firstName} <span className="inline-block animate-fade-in">👋</span>
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">What would you like to explore today?</p>
        <div className="mt-6 max-w-2xl">
          <AiSearchBar />
        </div>
      </section>

      <div className="mt-12 space-y-14">
        <TrendingSection />
        <RecommendedSection />
        <HelpfulReviewsSection />
        <AdmissionsSection />
        <ScholarshipsSection />
        <SavedSection />
        <RecentlyViewedSection slugs={recentSlugs} />
      </div>
    </div>
  );
}

function SectionHeader({ icon, title, action }: { icon: React.ReactNode; title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <h2 className="inline-flex items-center gap-2 text-2xl tracking-tight">
        <span className="text-brand">{icon}</span> {title}
      </h2>
      {action}
    </div>
  );
}

function TrendingSection() {
  const items = useMemo(() => {
    return COLLEGES.map((c) => {
      const rs = SEED_REVIEWS.filter((r) => r.collegeSlug === c.slug);
      const avg = rs.length ? rs.reduce((s, r) => s + avgOverall(r.ratings), 0) / rs.length : 0;
      return { college: c, avg, recPct: recommendationPct(rs), count: rs.length };
    })
      .sort((a, b) => b.avg - a.avg || b.count - a.count)
      .slice(0, 8);
  }, []);

  return (
    <section className="animate-fade-in-up">
      <SectionHeader
        icon={<Flame className="h-5 w-5" />}
        title="Trending Colleges"
        action={<Link to="/colleges" className="text-sm font-medium text-muted-foreground hover:text-foreground">View all →</Link>}
      />
      <div className="mt-5 flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
        {items.map((it) => (
          <TrendingCard key={it.college.slug} college={it.college} avg={it.avg} recPct={it.recPct} reviewCount={it.count} />
        ))}
      </div>
    </section>
  );
}

function RecommendedSection() {
  const { user } = useAuth();
  const { data: saved = [] } = useQuery({
    queryKey: ["saved", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from("saved_colleges").select("college_slug");
      if (error) throw error;
      return data as { college_slug: string }[];
    },
  });

  const items = useMemo(() => {
    const savedSlugs = new Set(saved.map((s) => s.college_slug));
    const scored = COLLEGES.map((c) => {
      const rs = SEED_REVIEWS.filter((r) => r.collegeSlug === c.slug);
      const avg = rs.length ? rs.reduce((s, r) => s + avgOverall(r.ratings), 0) / rs.length : 0;
      let score = avg;
      if (savedSlugs.has(c.slug)) score += 1.5; // boost saved
      return { college: c, avg, recPct: recommendationPct(rs), count: rs.length, score };
    });
    return scored.sort((a, b) => b.score - a.score).slice(0, 4);
  }, [saved]);

  return (
    <section className="animate-fade-in-up">
      <SectionHeader icon={<Sparkles className="h-5 w-5" />} title="Recommended For You" />
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 stagger">
        {items.map((it) => (
          <Link
            key={it.college.slug}
            to="/colleges/$slug"
            params={{ slug: it.college.slug }}
            className="group flex flex-col rounded-2xl border border-border bg-card p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-elevated"
          >
            <div className="flex items-start justify-between">
              <CollegeLogo college={it.college} size={44} />
              <RatingPill value={it.avg} />
            </div>
            <h3 className="mt-4 truncate text-sm font-semibold">{it.college.name}</h3>
            <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{it.college.tagline}</p>
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{it.recPct}% recommend</span>
              <span className="inline-flex items-center gap-1 text-brand">Explore <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" /></span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function HelpfulReviewsSection() {
  const [open, setOpen] = useState<string | null>(null);
  const reviews = useMemo(
    () => [...SEED_REVIEWS].sort((a, b) => b.helpful - a.helpful).slice(0, 4),
    [],
  );

  return (
    <section className="animate-fade-in-up">
      <SectionHeader icon={<ThumbsUp className="h-5 w-5" />} title="Most Helpful Reviews" />
      <div className="mt-5 grid gap-4 md:grid-cols-2 stagger">
        {reviews.map((r) => {
          const college = COLLEGES.find((c) => c.slug === r.collegeSlug)!;
          const expanded = open === r.id;
          return (
            <article key={r.id} className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-soft">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-semibold text-brand">
                    <BadgeCheck className="h-3 w-3" /> Verified Student
                  </span>
                  <span className="text-xs text-muted-foreground">{r.program} · {r.year}</span>
                </div>
                <Stars value={avgOverall(r.ratings)} size={12} />
              </div>
              <h3 className="mt-3 text-sm font-semibold leading-snug">{r.title}</h3>
              <p className={`mt-1.5 text-sm text-muted-foreground ${expanded ? "" : "line-clamp-2"}`}>{r.body}</p>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs">
                <Link to="/colleges/$slug" params={{ slug: college.slug }} className="font-medium text-foreground hover:underline">
                  {college.name}
                </Link>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1 text-muted-foreground"><ThumbsUp className="h-3 w-3" /> {r.helpful}</span>
                  <button onClick={() => setOpen(expanded ? null : r.id)} className="font-medium text-brand hover:underline">
                    {expanded ? "Show less" : "Read full"}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function AdmissionsSection() {
  const items = useMemo(
    () => ADMISSIONS.map((a) => ({ ...a, college: COLLEGES.find((c) => c.slug === a.collegeSlug)! }))
      .filter((a) => a.college)
      .sort((a, b) => a.deadline.localeCompare(b.deadline))
      .slice(0, 6),
    [],
  );

  return (
    <section className="animate-fade-in-up">
      <SectionHeader icon={<CalendarClock className="h-5 w-5" />} title="Admissions Closing Soon" />
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 stagger">
        {items.map((a) => {
          const days = daysUntil(a.deadline);
          const urgent = days <= 7;
          return (
            <div key={a.collegeSlug + a.program} className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-soft">
              <div className="flex items-start justify-between">
                <Link to="/colleges/$slug" params={{ slug: a.collegeSlug }} className="flex items-center gap-3">
                  <CollegeLogo college={a.college} size={40} />
                  <div>
                    <div className="text-sm font-semibold hover:underline">{a.college.name}</div>
                    <div className="text-xs text-muted-foreground">{a.program}</div>
                  </div>
                </Link>
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${urgent ? "bg-destructive/10 text-destructive" : "bg-brand-soft text-brand"}`}>
                  {days}d left
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {new Date(a.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                <span>{a.rounds}</span>
              </div>
              <button className="mt-4 inline-flex h-9 items-center justify-center rounded-full bg-foreground text-xs font-medium text-background transition hover:bg-foreground/90">
                Apply now
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ScholarshipsSection() {
  const items = useMemo(
    () => SCHOLARSHIPS.map((s) => ({ ...s, college: COLLEGES.find((c) => c.slug === s.collegeSlug)! }))
      .filter((s) => s.college)
      .sort((a, b) => a.deadline.localeCompare(b.deadline)),
    [],
  );

  return (
    <section className="animate-fade-in-up">
      <SectionHeader icon={<Wallet className="h-5 w-5" />} title="Scholarships" />
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 stagger">
        {items.map((s) => {
          const days = daysUntil(s.deadline);
          return (
            <div key={s.id} className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-soft">
              <div className="flex items-start justify-between">
                <Link to="/colleges/$slug" params={{ slug: s.collegeSlug }} className="flex items-center gap-3">
                  <CollegeLogo college={s.college} size={40} />
                  <div>
                    <div className="text-sm font-semibold hover:underline">{s.name}</div>
                    <div className="text-xs text-muted-foreground">{s.college.name}</div>
                  </div>
                </Link>
                <span className="rounded-full bg-brand-soft px-2.5 py-1 text-[10px] font-semibold text-brand">{s.amount}</span>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">{s.eligibility}</p>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs">
                <span className="inline-flex items-center gap-1 text-muted-foreground"><Clock className="h-3.5 w-3.5" /> {days}d left</span>
                <span className="text-muted-foreground">{new Date(s.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function SavedSection() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const { data: saved = [], isLoading } = useQuery({
    queryKey: ["saved", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from("saved_colleges").select("college_slug, created_at").order("created_at", { ascending: false });
      if (error) throw error;
      return data as { college_slug: string; created_at: string }[];
    },
  });

  const remove = useMutation({
    mutationFn: async (slug: string) => {
      const { error } = await supabase.from("saved_colleges").delete().eq("college_slug", slug);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["saved", user?.id] }),
  });

  const items = saved
    .map((s) => COLLEGES.find((c) => c.slug === s.college_slug))
    .filter((c): c is (typeof COLLEGES)[number] => !!c)
    .slice(0, 4);

  return (
    <section className="animate-fade-in-up">
      <SectionHeader
        icon={<Heart className="h-5 w-5" />}
        title="Saved Colleges"
        action={<Link to="/saved" className="text-sm font-medium text-muted-foreground hover:text-foreground">All saved →</Link>}
      />
      {isLoading ? (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => <div key={i} className="skeleton h-32 rounded-2xl" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
          No saved colleges yet. <Link to="/colleges" className="text-brand hover:underline">Browse colleges</Link>
        </div>
      ) : (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 stagger">
          {items.map((c) => {
            const rs = SEED_REVIEWS.filter((r) => r.collegeSlug === c.slug);
            const avg = rs.length ? rs.reduce((s, r) => s + avgOverall(r.ratings), 0) / rs.length : 0;
            return (
              <div key={c.slug} className="group relative flex flex-col rounded-2xl border border-border bg-card p-5 shadow-soft">
                <button
                  onClick={() => remove.mutate(c.slug)}
                  className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                  aria-label="Remove"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
                <Link to="/colleges/$slug" params={{ slug: c.slug }} className="flex items-center gap-3">
                  <CollegeLogo college={c} size={40} />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold hover:underline">{c.name}</div>
                    <div className="text-xs text-muted-foreground">{c.location}</div>
                  </div>
                </Link>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <RatingPill value={avg} />
                  <span className="text-muted-foreground">{recommendationPct(rs)}% recommend</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function RecentlyViewedSection({ slugs }: { slugs: string[] }) {
  const items = slugs
    .map((s) => COLLEGES.find((c) => c.slug === s))
    .filter((c): c is (typeof COLLEGES)[number] => !!c)
    .slice(0, 6);

  if (items.length === 0) return null;

  return (
    <section className="animate-fade-in-up">
      <SectionHeader icon={<Clock className="h-5 w-5" />} title="Recently Viewed" />
      <div className="mt-5 flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
        {items.map((c) => (
          <Link
            key={c.slug}
            to="/colleges/$slug"
            params={{ slug: c.slug }}
            className="group flex w-56 flex-none items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-soft transition hover:-translate-y-0.5 hover:shadow-elevated"
          >
            <CollegeLogo college={c} size={36} />
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold group-hover:text-brand">{c.name}</div>
              <div className="truncate text-xs text-muted-foreground">{c.location}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

void collegeAverages;
