import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FileText, Download, Star, TrendingUp, MessageSquare, ThumbsUp, CircleCheck as CheckCircle2, TriangleAlert as AlertTriangle, Sparkles } from "lucide-react";
import {
  usePremiumCollege,
  PremiumPageShell,
  PremiumCard,
  EmptyState,
} from "@/components/edview/PremiumLayout";
import {
  computeKpis,
  ratingTrend,
  categoryRatings,
  topCompliments,
  topComplaints,
  generateAiInsights,
} from "@/lib/premium-analytics";
import { CATEGORIES, collegeAverages, avgOverall, recommendationPct, type Category } from "@/lib/edview-data";

export const Route = createFileRoute("/_authenticated/premium/report")({
  head: () => ({ meta: [{ title: "Monthly Report — Premium Dashboard — EdView" }] }),
  component: ReportPage,
});

function ReportPage() {
  const { college, reviews } = usePremiumCollege();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  if (!college) return null;

  if (!reviews.length) {
    return (
      <PremiumPageShell>
        <h1 className="text-3xl tracking-tight">Monthly Report</h1>
        <div className="mt-8">
          <EmptyState title="No data for report" message="Your monthly report will be available once students start reviewing your college." />
        </div>
      </PremiumPageShell>
    );
  }

  const kpis = computeKpis(reviews);
  const trend = ratingTrend(reviews);
  const catRatings = categoryRatings(reviews);
  const compliments = topCompliments(reviews);
  const complaints = topComplaints(reviews);
  const insights = generateAiInsights(reviews);
  const averages = collegeAverages(reviews);
  const now = new Date();
  const monthName = now.toLocaleString("en-US", { month: "long" });
  const year = now.getFullYear();

  return (
    <PremiumPageShell>
      <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
        <FileText className="h-3.5 w-3.5" /> {monthName} {year} Report
      </div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl tracking-tight md:text-4xl">
            Monthly <span className="font-display italic text-brand">— report.</span>
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Comprehensive performance summary for {college.name}.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex h-10 items-center gap-2 rounded-full bg-foreground px-5 text-sm font-medium text-background transition-transform hover:scale-105">
            <Download className="h-4 w-4" /> Export PDF
          </button>
          <button className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-card px-5 text-sm font-medium transition-transform hover:scale-105">
            <Download className="h-4 w-4" /> Export CSV
          </button>
        </div>
      </div>

      {loading ? (
        <div className="mt-8 space-y-6">
          <div className="skeleton h-32 rounded-3xl" />
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="skeleton h-64 rounded-3xl" />
            <div className="skeleton h-64 rounded-3xl" />
          </div>
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          {/* Overall Performance */}
          <PremiumCard>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-brand" />
              <h3 className="text-sm font-semibold">Overall Performance</h3>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <ReportStat label="Overall Rating" value={`${kpis.overallRating.toFixed(2)} / 5`} />
              <ReportStat label="Reputation Score" value={`${kpis.reputationScore} / 100`} />
              <ReportStat label="Recommendation" value={`${kpis.recommendationPct}%`} />
              <ReportStat label="Student Satisfaction" value={`${kpis.studentSatisfaction}%`} />
            </div>
          </PremiumCard>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Rating Trends */}
            <PremiumCard title="Rating Trends">
              <div className="space-y-2">
                {trend.map((t) => (
                  <div key={t.month} className="flex items-center justify-between rounded-xl bg-muted/30 px-3 py-2">
                    <span className="text-sm font-medium">{t.month}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">{t.reviews} review{t.reviews !== 1 ? "s" : ""}</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-brand text-brand" />
                        <span className="text-sm font-semibold">{t.rating.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </PremiumCard>

            {/* Review Statistics */}
            <PremiumCard title="Review Statistics">
              <div className="grid grid-cols-2 gap-4">
                <ReportStat label="Total Reviews" value={String(kpis.totalReviews)} icon={<MessageSquare className="h-4 w-4" />} />
                <ReportStat label="Verified Reviews" value={String(kpis.verifiedReviews)} icon={<CheckCircle2 className="h-4 w-4" />} />
                <ReportStat label="Monthly Growth" value={`${kpis.monthlyGrowth > 0 ? "+" : ""}${kpis.monthlyGrowth}%`} icon={<TrendingUp className="h-4 w-4" />} />
                <ReportStat label="Active Students" value={String(kpis.activeStudents)} icon={<ThumbsUp className="h-4 w-4" />} />
              </div>
            </PremiumCard>
          </div>

          {/* Category Performance */}
          <PremiumCard title="Category Performance">
            <div className="space-y-3">
              {CATEGORIES.map(({ key, label }) => {
                const v = averages[key as Category];
                return (
                  <div key={key}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-semibold">{v.toFixed(2)} / 5</span>
                    </div>
                    <div className="mt-1 h-2 rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-brand transition-all duration-700"
                        style={{ width: `${(v / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </PremiumCard>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Top Compliments */}
            <PremiumCard>
              <div className="flex items-center gap-2 text-xs font-semibold text-green-600">
                <CheckCircle2 className="h-3.5 w-3.5" /> Top Compliments
              </div>
              <ul className="mt-3 space-y-2">
                {compliments.length ? (
                  compliments.map((c, i) => (
                    <li key={c} className="flex items-center gap-2.5 rounded-xl bg-green-50 px-3 py-2 text-sm">
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-green-500 text-xs font-bold text-white">{i + 1}</span>
                      {c}
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-muted-foreground">No compliments detected yet.</li>
                )}
              </ul>
            </PremiumCard>

            {/* Top Complaints */}
            <PremiumCard>
              <div className="flex items-center gap-2 text-xs font-semibold text-destructive">
                <AlertTriangle className="h-3.5 w-3.5" /> Top Complaints
              </div>
              <ul className="mt-3 space-y-2">
                {complaints.length ? (
                  complaints.map((c, i) => (
                    <li key={c} className="flex items-center gap-2.5 rounded-xl bg-red-50 px-3 py-2 text-sm">
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-destructive text-xs font-bold text-white">{i + 1}</span>
                      {c}
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-muted-foreground">No major complaints detected.</li>
                )}
              </ul>
            </PremiumCard>
          </div>

          {/* AI Summary */}
          <PremiumCard>
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-full bg-brand/10 text-brand">
                <Sparkles className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-semibold">AI Summary</h3>
            </div>
            <p className="mt-4 text-sm leading-relaxed">{insights.summary}</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div>
                <div className="text-xs font-semibold text-green-600">Strengths</div>
                <ul className="mt-1.5 space-y-1">
                  {insights.strengths.map((s) => <li key={s} className="text-xs text-muted-foreground">• {s}</li>)}
                </ul>
              </div>
              <div>
                <div className="text-xs font-semibold text-amber-600">Concerns</div>
                <ul className="mt-1.5 space-y-1">
                  {insights.concerns.map((c) => <li key={c} className="text-xs text-muted-foreground">• {c}</li>)}
                </ul>
              </div>
              <div>
                <div className="text-xs font-semibold text-brand">Improvements</div>
                <ul className="mt-1.5 space-y-1">
                  {insights.improvements.map((imp, i) => <li key={i} className="text-xs text-muted-foreground">• {imp}</li>)}
                </ul>
              </div>
            </div>
          </PremiumCard>
        </div>
      )}
    </PremiumPageShell>
  );
}

function ReportStat({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-muted/30 p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {icon && <span className="text-brand">{icon}</span>}
        {label}
      </div>
      <div className="mt-1.5 text-2xl font-semibold tracking-tight">{value}</div>
    </div>
  );
}
