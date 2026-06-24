import { createFileRoute, useRouter, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  TrendingUp, MessageCircle, Smile, Frown, Star, ThumbsUp, ThumbsDown,
  GraduationCap, MapPin, Calendar, Sparkles, AlertCircle, ChevronDown, Filter,
  BarChart3, Quote, PenLine, ArrowUpRight,
} from "lucide-react";
import { COLLEGES, CATEGORIES, avgOverall, collegeAverages, recommendationPct, type Category, type College } from "@/lib/edview-data";
import { useReviews } from "@/lib/edview-store";
import { RatingPill, Stars } from "@/components/edview/Stars";

export const Route = createFileRoute("/analytics")({
  validateSearch: (search: Record<string, unknown>) => ({
    college: typeof search.college === "string" ? search.college : undefined,
  }),
  head: () => ({
    meta: [
      { title: "College Analytics Dashboard — EdView" },
      { name: "description", content: "Performance analytics dashboard for college administrators and school management." },
    ],
  }),
  component: Analytics,
});

function Analytics() {
  const { reviews } = useReviews();
  const router = useRouter();
  const { college: initialCollege } = Route.useSearch();
  const [slug, setSlug] = useState<string>(initialCollege ?? "__all");

  const selectedCollege = slug !== "__all"
    ? (COLLEGES.find((c) => c.slug === slug) ?? null)
    : null;

  const filtered = useMemo(
    () => (slug === "__all" ? reviews : reviews.filter((r) => r.collegeSlug === slug)),
    [reviews, slug],
  );

  const overall = filtered.length
    ? filtered.reduce((s, r) => s + avgOverall(r.ratings), 0) / filtered.length
    : 0;

  const averages = collegeAverages(filtered);
  const recPct = recommendationPct(filtered);
  const positives = filtered.filter((r) => avgOverall(r.ratings) >= 4);
  const negatives = filtered.filter((r) => avgOverall(r.ratings) <= 3);
  const positiveSentimentPct = filtered.length ? Math.round((positives.length / filtered.length) * 100) : 0;
  const negativeSentimentPct = filtered.length ? Math.round((negatives.length / filtered.length) * 100) : 0;

  const positiveThemes = useMemo(() => tally(filtered.flatMap((r) => r.pros ?? [])), [filtered]);
  const negativeThemes = useMemo(() => tally(filtered.flatMap((r) => r.cons ?? [])), [filtered]);

  // 5 most recent reviews
  const recentReviews = useMemo(
    () => [...filtered].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5),
    [filtered],
  );

  // Rating distribution
  const distribution = [5, 4, 3, 2, 1].map((star) => {
    const count = filtered.filter((r) => Math.round(avgOverall(r.ratings)) === star).length;
    return { star, count, pct: filtered.length ? (count / filtered.length) * 100 : 0 };
  });

  function handleCollegeChange(value: string) {
    setSlug(value);
    const college = value === "__all" ? undefined : value;
    const url = new URL(window.location.href);
    if (college) url.searchParams.set("college", college);
    else url.searchParams.delete("college");
    router.navigate({ to: "/analytics", search: { college } });
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-14">
      {/* HEADER */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-brand">
            <BarChart3 className="mr-1 inline h-3.5 w-3.5" /> Analytics Dashboard
          </p>
          <h1 className="mt-2 text-4xl tracking-tight md:text-5xl">
            College Performance <span className="font-display italic text-brand">Insights</span>
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            For college administrators and school management. Aggregate ratings, sentiment and trends.
          </p>
        </div>
        <div className="relative">
          <select
            value={slug}
            onChange={(e) => handleCollegeChange(e.target.value)}
            className="h-11 appearance-none rounded-full border border-border bg-card pl-4 pr-10 text-sm font-medium shadow-soft outline-none focus:border-brand"
          >
            <option value="__all">All colleges</option>
            {COLLEGES.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>

      {/* COLLEGE INFO BANNER (when a specific college is selected) */}
      {selectedCollege && (
        <div className="mt-6 rounded-2xl border border-border bg-gradient-to-br from-brand-soft/30 via-card to-card p-6 shadow-soft">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="grid h-16 w-16 flex-none place-items-center rounded-2xl bg-brand text-xl font-semibold text-brand-foreground shadow-soft">
                {selectedCollege.name.split(" ").slice(0, 2).map((w) => w[0]).join("")}
              </div>
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">{selectedCollege.name}</h2>
                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{selectedCollege.location}</span>
                  <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />Est. {selectedCollege.established}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="rounded-xl border border-border bg-background px-4 py-3 text-center">
                <div className="text-xs text-muted-foreground">Overall</div>
                <div className="mt-1 flex items-center gap-1 text-xl font-bold text-brand">
                  {overall.toFixed(1)} <Stars value={overall} size={12} />
                </div>
              </div>
              <div className="rounded-xl border border-border bg-background px-4 py-3 text-center">
                <div className="text-xs text-muted-foreground">Reviews</div>
                <div className="mt-1 text-xl font-bold text-foreground">{filtered.length}</div>
              </div>
              <div className="rounded-xl border border-border bg-background px-4 py-3 text-center">
                <div className="text-xs text-muted-foreground">Recommend</div>
                <div className="mt-1 text-xl font-bold text-foreground">{recPct}%</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OVERVIEW CARDS */}
      {filtered.length > 0 && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <OverviewCard
            icon={<Star className="h-5 w-5" />}
            label="Average Rating"
            value={overall.toFixed(1)}
            suffix="/ 5"
            accent="brand"
          />
          <OverviewCard
            icon={<MessageCircle className="h-5 w-5" />}
            label="Total Reviews"
            value={String(filtered.length)}
            suffix={filtered.length === 1 ? "review" : "reviews"}
            accent="brand"
          />
          <OverviewCard
            icon={<Smile className="h-5 w-5" />}
            label="Positive Sentiment"
            value={`${positiveSentimentPct}%`}
            suffix={`${positives.length} reviews ≥ 4★`}
            accent="brand"
          />
          <OverviewCard
            icon={<Frown className="h-5 w-5" />}
            label="Critical Feedback"
            value={`${negativeSentimentPct}%`}
            suffix={`${negatives.length} reviews ≤ 3★`}
            accent="warm"
          />
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* RATING DISTRIBUTION */}
        <Panel
          title="Rating Distribution"
          subtitle="5-star to 1-star breakdown"
          icon={<Star className="h-4 w-4 text-brand" />}
        >
          <div className="space-y-3">
            {distribution.map((d) => (
              <div key={d.star} className="flex items-center gap-3">
                <span className="w-8 text-sm font-semibold text-foreground">{d.star}★</span>
                <div className="flex-1">
                  <div className="h-3 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-brand transition-all"
                      style={{ width: `${d.pct}%` }}
                    />
                  </div>
                </div>
                <span className="w-8 text-right text-sm font-semibold text-foreground">{d.count}</span>
              </div>
            ))}
          </div>
        </Panel>

        {/* CATEGORY ANALYSIS */}
        <Panel
          title="Category Analysis"
          subtitle="Average scores across all categories"
          icon={<BarChart3 className="h-4 w-4 text-brand" />}
          className="lg:col-span-2"
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map(({ key, label }) => {
              const v = averages[key as Category];
              return (
                <div key={key} className="rounded-xl border border-border bg-background p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{label}</span>
                    <span className="font-display text-2xl text-brand">{v.toFixed(1)}</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-brand transition-all"
                      style={{ width: `${(v / 5) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>

        {/* POSITIVE THEMES */}
        <Panel
          title="Positive Themes"
          subtitle="Most frequently mentioned strengths"
          accent="brand"
          icon={<Sparkles className="h-4 w-4" />}
        >
          {positiveThemes.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {positiveThemes.slice(0, 8).map((t) => (
                <span
                  key={t.label}
                  className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft/60 px-3 py-1.5 text-xs font-medium text-brand"
                >
                  {t.label}
                  <span className="rounded-full bg-brand px-1.5 py-0.5 text-[10px] font-semibold text-brand-foreground">
                    {t.count}
                  </span>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No positive themes identified yet.</p>
          )}
        </Panel>

        {/* TOP CONCERNS */}
        <Panel
          title="Top Concerns"
          subtitle="Most frequently mentioned challenges"
          accent="warm"
          icon={<AlertCircle className="h-4 w-4" />}
        >
          {negativeThemes.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {negativeThemes.slice(0, 8).map((t) => (
                <span
                  key={t.label}
                  className="inline-flex items-center gap-1.5 rounded-full bg-accent/50 px-3 py-1.5 text-xs font-medium text-accent-foreground"
                >
                  {t.label}
                  <span className="rounded-full bg-warm px-1.5 py-0.5 text-[10px] font-semibold text-brand-foreground">
                    {t.count}
                  </span>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No concerns reported.</p>
          )}
        </Panel>

        {/* COMBINED THEMES + RECENT REVIEWS */}
        <Panel
          title="Recent Feedback"
          subtitle={`Latest reviews${slug !== "__all" ? ` for ${selectedCollege?.name ?? ""}` : ""}`}
          icon={<Quote className="h-4 w-4 text-brand" />}
          className="lg:col-span-3"
        >
          {recentReviews.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {recentReviews.map((r) => {
                const college = COLLEGES.find((c) => c.slug === r.collegeSlug);
                return (
                  <div
                    key={r.id}
                    className="rounded-xl border border-border bg-background p-4 transition hover:shadow-soft"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-soft text-[10px] font-semibold text-brand">
                          {r.author.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                        </div>
                        <div className="min-w-0">
                          <div className="truncate text-xs font-semibold">{r.author}</div>
                          <div className="text-[10px] text-muted-foreground">{r.program}</div>
                        </div>
                      </div>
                      <RatingPill value={avgOverall(r.ratings)} />
                    </div>
                    <h4 className="mt-2 text-xs font-semibold leading-snug line-clamp-1">{r.title}</h4>
                    <p className="mt-1 text-[10px] leading-relaxed text-muted-foreground line-clamp-2">
                      "{r.body}"
                    </p>
                    <div className="mt-2 flex items-center justify-between text-[9px] text-muted-foreground">
                      <span>
                        {new Date(r.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                      </span>
                      {college && (
                        <Link
                          to="/colleges/$slug"
                          params={{ slug: college.slug }}
                          className="inline-flex items-center gap-0.5 font-medium text-foreground hover:text-brand"
                        >
                          {college.name.split(" ").slice(0, 1)} <ArrowUpRight className="h-2.5 w-2.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border p-8 text-center">
              <p className="text-sm text-muted-foreground">
                No reviews yet.{" "}
                <Link to="/submit" className="text-brand hover:underline">Be the first to write one.</Link>
              </p>
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}

function tally(items: string[]): { label: string; count: number }[] {
  const m = new Map<string, number>();
  for (const it of items) m.set(it, (m.get(it) ?? 0) + 1);
  return Array.from(m.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}

function Panel({
  title, subtitle, children, className, accent, icon,
}: {
  title: string; subtitle?: string; children: React.ReactNode; className?: string;
  accent?: "brand" | "warm"; icon?: React.ReactNode;
}) {
  return (
    <section className={`rounded-2xl border border-border bg-card p-6 shadow-soft ${className ?? ""}`}>
      <header className="mb-5 flex items-start justify-between">
        <div>
          <h2 className="inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {icon} {title}
          </h2>
          {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        {accent && (
          <span className={`h-2 w-2 rounded-full ${accent === "brand" ? "bg-brand" : "bg-warm"}`} />
        )}
      </header>
      {children}
    </section>
  );
}

function OverviewCard({
  icon, label, value, suffix, accent,
}: {
  icon: React.ReactNode; label: string; value: string; suffix: string; accent?: "brand" | "warm";
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft transition hover:shadow-elevated">
      <div className="flex items-center gap-3">
        <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
          accent === "warm" ? "bg-warm/20 text-warm" : "bg-brand-soft text-brand"
        }`}>
          {icon}
        </span>
        <div className="min-w-0">
          <div className="text-xs font-medium text-muted-foreground">{label}</div>
          <div className="flex items-baseline gap-1">
            <span className={`font-display text-3xl leading-none ${
              accent === "warm" ? "text-warm" : "text-foreground"
            }`}>
              {value}
            </span>
            <span className="text-xs text-muted-foreground">{suffix}</span>
          </div>
        </div>
      </div>
    </div>
  );
}