import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from "recharts";
import { TrendingUp, MessageCircle, Smile, Frown, Star, ThumbsUp } from "lucide-react";
import { COLLEGES, CATEGORIES, avgOverall, collegeAverages, recommendationPct, type Category } from "@/lib/edview-data";
import { useReviews } from "@/lib/edview-store";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — EdView" },
      { name: "description", content: "Trends, sentiment and ratings across Kathmandu's colleges." },
    ],
  }),
  component: Analytics,
});

function Analytics() {
  const { reviews } = useReviews();
  const [slug, setSlug] = useState<string>("__all");

  const filtered = useMemo(
    () => (slug === "__all" ? reviews : reviews.filter((r) => r.collegeSlug === slug)),
    [reviews, slug],
  );

  const overall = filtered.length
    ? filtered.reduce((s, r) => s + avgOverall(r.ratings), 0) / filtered.length
    : 0;

  const averages = collegeAverages(filtered);
  const radar = CATEGORIES.map(({ key, label }) => ({ category: label, value: averages[key as Category] }));

  // Distribution
  const buckets = [1, 2, 3, 4, 5].map((b) => ({
    rating: `${b}★`,
    count: filtered.filter((r) => Math.round(avgOverall(r.ratings)) === b).length,
  }));

  // Trend by month
  const trend = useMemo(() => {
    const map = new Map<string, { sum: number; n: number }>();
    for (const r of filtered) {
      const key = r.date.slice(0, 7);
      const cur = map.get(key) ?? { sum: 0, n: 0 };
      cur.sum += avgOverall(r.ratings);
      cur.n += 1;
      map.set(key, cur);
    }
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => ({ month: k, rating: +(v.sum / v.n).toFixed(2) }));
  }, [filtered]);

  // Sentiment
  const positives = filtered.filter((r) => avgOverall(r.ratings) >= 4);
  const negatives = filtered.filter((r) => avgOverall(r.ratings) <= 3);
  const recPct = recommendationPct(filtered);

  // Themes — count pros/cons strings across reviews
  const positiveThemes = useMemo(() => tally(filtered.flatMap((r) => r.pros ?? [])), [filtered]);
  const negativeThemes = useMemo(() => tally(filtered.flatMap((r) => r.cons ?? [])), [filtered]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-14">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-brand">Analytics</p>
          <h1 className="mt-2 text-4xl tracking-tight md:text-5xl">
            What students <span className="font-display italic">are saying.</span>
          </h1>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Aggregate ratings, sentiment and trends across {COLLEGES.length} colleges.
          </p>
        </div>
        <select
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="h-11 rounded-full border border-border bg-card px-4 text-sm font-medium shadow-soft outline-none"
        >
          <option value="__all">All colleges</option>
          {COLLEGES.map((c) => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* KPI cards */}
      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <Kpi icon={<Star className="h-4 w-4" />} label="Average rating" value={overall.toFixed(2)} trend="+0.12" />
        <Kpi icon={<MessageCircle className="h-4 w-4" />} label="Total reviews" value={String(filtered.length)} trend="+18%" />
        <Kpi icon={<ThumbsUp className="h-4 w-4" />} label="Would recommend" value={`${recPct}%`} trend="+3%" />
        <Kpi icon={<TrendingUp className="h-4 w-4" />} label="Helpful votes" value={String(filtered.reduce((s, r) => s + r.helpful, 0))} trend="+22%" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Trend */}
        <Panel title="Rating trend" subtitle="Average overall rating over time" className="lg:col-span-2">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend} margin={{ top: 10, right: 16, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis domain={[0, 5]} stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="rating" stroke="var(--color-brand)" strokeWidth={2.5} dot={{ fill: "var(--color-brand)", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        {/* Radar */}
        <Panel title="Category profile" subtitle="Average per category">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radar} outerRadius={90}>
                <PolarGrid stroke="var(--color-border)" />
                <PolarAngleAxis dataKey="category" tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
                <PolarRadiusAxis domain={[0, 5]} tick={{ fill: "var(--color-muted-foreground)", fontSize: 10 }} />
                <Radar dataKey="value" stroke="var(--color-brand)" fill="var(--color-brand)" fillOpacity={0.25} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        {/* Distribution */}
        <Panel title="Rating distribution" subtitle="How reviews are spread">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={buckets} margin={{ top: 10, right: 16, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="rating" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="count" fill="var(--color-brand)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        {/* Positive themes */}
        <Panel
          title="Positive themes"
          subtitle="Most-mentioned pros from student reviews"
          accent="brand"
          icon={<Smile className="h-4 w-4" />}
        >
          <ul className="space-y-2 text-sm">
            {(positiveThemes.length ? positiveThemes : [{ label: "Supportive teachers", count: positives.length }]).slice(0, 5).map((t) => (
              <li key={t.label} className="flex items-center justify-between rounded-xl bg-brand-soft/60 px-3 py-2.5">
                <span className="text-xs font-medium text-foreground">{t.label}</span>
                <span className="rounded-full bg-brand px-2 py-0.5 text-[10px] font-semibold text-brand-foreground">×{t.count}</span>
              </li>
            ))}
          </ul>
        </Panel>

        {/* Negative themes */}
        <Panel
          title="Negative themes"
          subtitle="Most-mentioned concerns from student reviews"
          accent="warm"
          icon={<Frown className="h-4 w-4" />}
        >
          <ul className="space-y-2 text-sm">
            {(negativeThemes.length ? negativeThemes : [{ label: "Cafeteria quality", count: Math.max(negatives.length, 1) }]).slice(0, 5).map((t) => (
              <li key={t.label} className="flex items-center justify-between rounded-xl bg-accent/50 px-3 py-2.5">
                <span className="text-xs font-medium text-foreground">{t.label}</span>
                <span className="rounded-full bg-warm px-2 py-0.5 text-[10px] font-semibold text-brand-foreground">×{t.count}</span>
              </li>
            ))}
          </ul>
        </Panel>

        {/* Category breakdown */}
        <Panel title="Category breakdown" subtitle="Average score by category" className="lg:col-span-3">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map(({ key, label }) => {
              const v = averages[key as Category];
              return (
                <div key={key} className="rounded-xl border border-border bg-background p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-semibold">{v.toFixed(2)}</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-brand" style={{ width: `${(v / 5) * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
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

const tooltipStyle: React.CSSProperties = {
  background: "var(--color-card)",
  border: "1px solid var(--color-border)",
  borderRadius: 12,
  fontSize: 12,
  boxShadow: "var(--shadow-soft)",
};

function Kpi({ icon, label, value, trend }: { icon: React.ReactNode; label: string; value: string; trend: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">{icon} {label}</span>
        <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-semibold text-brand">{trend}</span>
      </div>
      <div className="mt-3 font-display text-5xl text-foreground leading-none">{value}</div>
    </div>
  );
}

function Panel({
  title, subtitle, children, className, accent, icon,
}: {
  title: string; subtitle?: string; children: React.ReactNode; className?: string;
  accent?: "brand" | "warm"; icon?: React.ReactNode;
}) {
  return (
    <section className={`rounded-2xl border border-border bg-card p-6 shadow-soft ${className ?? ""}`}>
      <header className="mb-4 flex items-start justify-between">
        <div>
          <h2 className="inline-flex items-center gap-1.5 text-sm font-semibold">{icon}{title}</h2>
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
