import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, TrendingUp, TrendingDown } from "lucide-react";
import {
  usePremiumCollege,
  PremiumPageShell,
  EmptyState,
} from "@/components/edview/PremiumLayout";
import { analyzeTopics } from "@/lib/premium-analytics";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/premium/topics")({
  head: () => ({ meta: [{ title: "AI Topics — Premium Dashboard — EdView" }] }),
  component: TopicsPage,
});

function TopicsPage() {
  const { college, reviews } = usePremiumCollege();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  if (!college) return null;

  const topics = analyzeTopics(reviews);
  const maxMentions = Math.max(...topics.map((t) => t.mentions), 1);

  return (
    <PremiumPageShell>
      <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
        <Sparkles className="h-3.5 w-3.5" /> AI Topic Detection
      </div>
      <h1 className="text-3xl tracking-tight md:text-4xl">
        AI Topic <span className="font-display italic text-brand">— analysis.</span>
      </h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Automatically detected topics from student reviews, with sentiment breakdown.
      </p>

      {loading ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton h-44 rounded-3xl" />
          ))}
        </div>
      ) : topics.length === 0 ? (
        <div className="mt-8">
          <EmptyState title="No topics detected yet" message="Topics will be automatically detected once students start mentioning specific aspects in their reviews." />
        </div>
      ) : (
        <>
          {/* Most Mentioned banner */}
          <div className="mt-8 rounded-3xl border border-border bg-gradient-to-r from-brand/5 to-transparent p-5">
            <div className="text-xs font-semibold text-muted-foreground">Most Mentioned Topics</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {topics.slice(0, 5).map((t) => (
                <div key={t.topic} className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm shadow-soft">
                  <span className="text-base">{t.emoji}</span>
                  <span className="font-medium">{t.topic}</span>
                  <span className="text-xs text-muted-foreground">{t.mentions}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Topic cards */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {topics.map((t, i) => (
              <div
                key={t.topic}
                className="rounded-3xl border border-border bg-card p-5 shadow-soft transition-transform hover:-translate-y-0.5"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-muted text-xl">{t.emoji}</span>
                    <div>
                      <div className="text-sm font-semibold">{t.topic}</div>
                      <div className="text-xs text-muted-foreground">{t.mentions} mention{t.mentions !== 1 ? "s" : ""}</div>
                    </div>
                  </div>
                </div>

                {/* Mention bar */}
                <div className="mt-4">
                  <div className="mb-1 flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>Frequency</span>
                    <span>{Math.round((t.mentions / maxMentions) * 100)}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted">
                    <div
                      className="h-1.5 rounded-full bg-brand transition-all duration-700"
                      style={{ width: `${(t.mentions / maxMentions) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Sentiment breakdown */}
                <div className="mt-4 space-y-2">
                  <SentimentBar label="Positive" pct={t.positivePct} color="bg-green-500" icon={<TrendingUp className="h-3 w-3" />} />
                  <SentimentBar label="Negative" pct={t.negativePct} color="bg-destructive" icon={<TrendingDown className="h-3 w-3" />} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </PremiumPageShell>
  );
}

function SentimentBar({ label, pct, color, icon }: { label: string; pct: number; color: string; icon: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-[10px]">
        <span className="flex items-center gap-1 text-muted-foreground">{icon} {label}</span>
        <span className="font-medium">{pct}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-muted">
        <div className={cn("h-1.5 rounded-full transition-all duration-700", color)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
