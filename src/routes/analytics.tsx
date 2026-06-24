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
        <Kpi icon={<Smile className="h-4 w-4" />} label="Positive sentiment" value={`${Math.round((positives.length / Math.max(filtered.length, 1)) * 100)}%`} trend="+4%" />
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

        {/* Positive */}
        <Panel
          title="What students love"
          subtitle="Top themes from 4–5★ reviews"
          accent="brand"
          icon={<Smile className="h-4 w-4" />}
        >
          <ul className="space-y-3 text-sm">
            {(positives.slice(0, 3).length ? positives.slice(0, 3) : filtered.slice(0, 3)).map((r) => (
              <li key={r.id} className="rounded-xl bg-brand-soft/60 p-3">
                <div className="text-xs font-semibold text-brand">{r.title}</div>
                <div className="mt-1 line-clamp-2 text-xs text-muted-foreground">"{r.body}"</div>
              </li>
            ))}
          </ul>
        </Panel>

        {/* Negative */}
        <Panel
          title="What needs work"
          subtitle="Concerns from 1–3★ reviews"
          accent="warm"
          icon={<Frown className="h-4 w-4" />}
        >
          <ul className="space-y-3 text-sm">
            {negatives.length ? negatives.slice(0, 3).map((r) => (
              <li key={r.id} className="rounded-xl bg-accent/50 p-3">
                <div className="text-xs font-semibold text-foreground">{r.title}</div>
                <div className="mt-1 line-clamp-2 text-xs text-muted-foreground">"{r.body}"</div>
              </li>
            )) : (
              <li className="rounded-xl border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
                No critical reviews in this view.
              </li>
            )}
          </ul>
        </Panel>
      </div>
    </div>
  );
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
