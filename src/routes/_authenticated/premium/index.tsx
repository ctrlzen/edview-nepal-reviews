import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Star, Award, ThumbsUp, MessageSquare, BadgeCheck, TrendingUp, Smile, Users, Sparkles, CircleCheck as CheckCircle2, TriangleAlert as AlertTriangle, Lightbulb } from "lucide-react";
import { useCountUp } from "@/hooks/use-count-up";
import {
  usePremiumCollege,
  PremiumPageShell,
  PremiumKpi,
  PremiumCard,
} from "@/components/edview/PremiumLayout";
import { computeKpis, generateAiInsights } from "@/lib/premium-analytics";

export const Route = createFileRoute("/_authenticated/premium/")({
  head: () => ({ meta: [{ title: "Overview — Premium Dashboard — EdView" }] }),
  component: OverviewPage,
});

function OverviewPage() {
  const { college, reviews } = usePremiumCollege();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  if (!college) return null;

  const kpis = computeKpis(reviews);
  const insights = generateAiInsights(reviews);

  return (
    <PremiumPageShell>
      <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
        <Sparkles className="h-3.5 w-3.5" /> AI-Powered Analytics
      </div>
      <h1 className="text-3xl tracking-tight md:text-4xl">
        {college.name} <span className="font-display italic text-brand">— dashboard.</span>
      </h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Real-time snapshot of how students perceive your college on EdView.
      </p>

      {/* KPI Grid */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton h-28 rounded-3xl" />
          ))
        ) : (
          <>
            <AnimatedKpi label="Overall Rating" value={kpis.overallRating} suffix="" icon={<Star className="h-4 w-4" />} delay={0} />
            <AnimatedKpi label="Reputation Score" value={kpis.reputationScore} suffix="/100" icon={<Award className="h-4 w-4" />} delay={50} />
            <AnimatedKpi label="Recommendation" value={kpis.recommendationPct} suffix="%" icon={<ThumbsUp className="h-4 w-4" />} delay={100} />
            <AnimatedKpi label="Total Reviews" value={kpis.totalReviews} icon={<MessageSquare className="h-4 w-4" />} delay={150} />
            <AnimatedKpi label="Verified Reviews" value={kpis.verifiedReviews} icon={<BadgeCheck className="h-4 w-4" />} delay={200} />
            <AnimatedKpi label="Monthly Growth" value={kpis.monthlyGrowth} suffix="%" icon={<TrendingUp className="h-4 w-4" />} delay={250} />
            <AnimatedKpi label="Student Satisfaction" value={kpis.studentSatisfaction} suffix="%" icon={<Smile className="h-4 w-4" />} delay={300} />
            <AnimatedKpi label="Active Students" value={kpis.activeStudents} icon={<Users className="h-4 w-4" />} delay={350} />
          </>
        )}
      </div>

      {/* AI Insights */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PremiumCard>
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-full bg-brand/10 text-brand">
                <Sparkles className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-semibold">AI Insights</h3>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-foreground">{insights.summary}</p>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-green-600">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Top Strengths
                </div>
                <ul className="mt-2 space-y-1.5">
                  {insights.strengths.length ? (
                    insights.strengths.map((s) => (
                      <li key={s} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                        {s}
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-muted-foreground">No standout strengths yet.</li>
                  )}
                </ul>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600">
                  <AlertTriangle className="h-3.5 w-3.5" /> Top Concerns
                </div>
                <ul className="mt-2 space-y-1.5">
                  {insights.concerns.length ? (
                    insights.concerns.map((c) => (
                      <li key={c} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                        {c}
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-muted-foreground">No major concerns detected.</li>
                  )}
                </ul>
              </div>
            </div>
          </PremiumCard>
        </div>

        <PremiumCard>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-brand">
            <Lightbulb className="h-3.5 w-3.5" /> Suggested Improvements
          </div>
          <ul className="mt-3 space-y-3">
            {insights.improvements.map((imp, i) => (
              <li key={i} className="flex gap-2.5 text-sm text-muted-foreground">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand/10 text-xs font-semibold text-brand">
                  {i + 1}
                </span>
                {imp}
              </li>
            ))}
          </ul>
        </PremiumCard>
      </div>
    </PremiumPageShell>
  );
}

function AnimatedKpi({
  label,
  value,
  suffix = "",
  icon,
  delay,
}: {
  label: string;
  value: number;
  suffix?: string;
  icon: React.ReactNode;
  delay: number;
}) {
  const display = useCountUp(value, 900);
  const isDecimal = !Number.isInteger(value);
  const shown = isDecimal ? display.toFixed(2) : Math.round(display).toLocaleString();

  return (
    <PremiumKpi label={label} value={0} suffix={suffix} icon={icon} delay={delay}>
      <div className="mt-2 text-3xl font-semibold tracking-tight">
        {shown}{suffix}
      </div>
    </PremiumKpi>
  );
}
