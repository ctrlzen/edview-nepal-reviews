import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  Cell,
} from "recharts";
import { TrendingUp, Activity, ChartBar as BarChart3, ThumbsUp } from "lucide-react";
import {
  usePremiumCollege,
  PremiumPageShell,
  PremiumCard,
  EmptyState,
} from "@/components/edview/PremiumLayout";
import {
  ratingTrend,
  sentimentTrend,
  reviewGrowth,
  categoryRatings,
} from "@/lib/premium-analytics";
import { CATEGORIES, recommendationPct } from "@/lib/edview-data";

export const Route = createFileRoute("/_authenticated/premium/analytics")({
  head: () => ({ meta: [{ title: "Analytics — Premium Dashboard — EdView" }] }),
  component: AnalyticsPage,
});

const CHART_COLORS = {
  brand: "oklch(0.42 0.11 168)",
  blue: "oklch(0.55 0.15 250)",
  amber: "oklch(0.78 0.13 65)",
  red: "oklch(0.58 0.2 27)",
  green: "oklch(0.55 0.15 145)",
};

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-card px-3 py-2 text-xs shadow-soft">
      <div className="font-semibold">{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="mt-0.5 text-muted-foreground">
          {p.name}: <span className="font-medium text-foreground">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

function AnalyticsPage() {
  const { college, reviews } = usePremiumCollege();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  if (!college) return null;

  if (!reviews.length) {
    return (
      <PremiumPageShell>
        <h1 className="text-3xl tracking-tight">Analytics</h1>
        <div className="mt-8">
          <EmptyState title="No reviews yet" message="Analytics charts will appear once students start reviewing your college." />
        </div>
      </PremiumPageShell>
    );
  }

  const rTrend = ratingTrend(reviews);
  const sTrend = sentimentTrend(reviews);
  const gData = reviewGrowth(reviews);
  const cRatings = categoryRatings(reviews);
  const recPct = recommendationPct(reviews);

  const recData = [{ name: "Recommend", value: recPct, fill: CHART_COLORS.brand }];

  return (
    <PremiumPageShell>
      <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
        <BarChart3 className="h-3.5 w-3.5" /> Visual Analytics
      </div>
      <h1 className="text-3xl tracking-tight md:text-4xl">
        Analytics <span className="font-display italic text-brand">— trends & insights.</span>
      </h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Track how your college performs across time, sentiment, and categories.
      </p>

      {loading ? (
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-72 rounded-3xl" />
          ))}
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          {/* Rating Trend */}
          <div className="grid gap-6 lg:grid-cols-2">
            <PremiumCard title="Rating Trend Over Time">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <TrendingUp className="h-3.5 w-3.5 text-brand" /> Average rating per month
              </div>
              <div className="mt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={rTrend} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.012 100)" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "oklch(0.46 0.02 165)" }} />
                    <YAxis domain={[0, 5]} tick={{ fontSize: 11, fill: "oklch(0.46 0.02 165)" }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="rating"
                      stroke={CHART_COLORS.brand}
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: CHART_COLORS.brand }}
                      activeDot={{ r: 6 }}
                      animationDuration={1000}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </PremiumCard>

            {/* Sentiment Trend */}
            <PremiumCard title="Sentiment Trend">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Activity className="h-3.5 w-3.5 text-brand" /> Positive / Neutral / Negative breakdown
              </div>
              <div className="mt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sTrend} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.012 100)" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "oklch(0.46 0.02 165)" }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "oklch(0.46 0.02 165)" }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="positive" stackId="1" stroke={CHART_COLORS.green} fill={CHART_COLORS.green} fillOpacity={0.6} animationDuration={1000} />
                    <Area type="monotone" dataKey="neutral" stackId="1" stroke={CHART_COLORS.amber} fill={CHART_COLORS.amber} fillOpacity={0.5} animationDuration={1000} />
                    <Area type="monotone" dataKey="negative" stackId="1" stroke={CHART_COLORS.red} fill={CHART_COLORS.red} fillOpacity={0.5} animationDuration={1000} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </PremiumCard>
          </div>

          {/* Review Growth */}
          <PremiumCard title="Review Growth">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <BarChart3 className="h-3.5 w-3.5 text-brand" /> Cumulative and new reviews per month
            </div>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={gData} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.012 100)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "oklch(0.46 0.02 165)" }} />
                  <YAxis tick={{ fontSize: 11, fill: "oklch(0.46 0.02 165)" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="cumulative" stroke={CHART_COLORS.brand} fill={CHART_COLORS.brand} fillOpacity={0.15} strokeWidth={2.5} animationDuration={1000} />
                  <Area type="monotone" dataKey="newReviews" stroke={CHART_COLORS.blue} fill={CHART_COLORS.blue} fillOpacity={0.3} strokeWidth={2} animationDuration={1000} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </PremiumCard>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Category Ratings */}
            <PremiumCard title="Category Ratings">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <BarChart3 className="h-3.5 w-3.5 text-brand" /> Average score per category (out of 5)
              </div>
              <div className="mt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={cRatings} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.012 100)" />
                    <XAxis dataKey="category" tick={{ fontSize: 10, fill: "oklch(0.46 0.02 165)" }} angle={-20} textAnchor="end" height={50} />
                    <YAxis domain={[0, 5]} tick={{ fontSize: 11, fill: "oklch(0.46 0.02 165)" }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="rating" radius={[6, 6, 0, 0]} animationDuration={1000}>
                      {cRatings.map((entry, i) => (
                        <Cell key={i} fill={entry.rating >= 4 ? CHART_COLORS.green : entry.rating >= 3 ? CHART_COLORS.amber : CHART_COLORS.red} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </PremiumCard>

            {/* Recommendation Percentage */}
            <PremiumCard title="Recommendation Percentage">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <ThumbsUp className="h-3.5 w-3.5 text-brand" /> Percentage of students who recommend
              </div>
              <div className="mt-4 flex h-64 items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart innerRadius="60%" outerRadius="100%" data={recData} startAngle={90} endAngle={90 - (recPct / 100) * 360}>
                    <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                    <RadialBar background dataKey="value" cornerRadius={10} fill={CHART_COLORS.brand} animationDuration={1000} />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
              <div className="-mt-32 text-center">
                <div className="text-4xl font-semibold tracking-tight">{recPct}%</div>
                <div className="mt-1 text-xs text-muted-foreground">would recommend</div>
              </div>
            </PremiumCard>
          </div>
        </div>
      )}
    </PremiumPageShell>
  );
}
