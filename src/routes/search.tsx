import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { Sparkles, CircleCheck as CheckCircle2, Search as SearchIcon, Quote, ThumbsUp, MapPin } from "lucide-react";
import { aiSearch, COLLEGES, avgOverall } from "@/lib/edview-data";
import { AiSearchBar } from "@/components/edview/AiSearchBar";
import { CollegeLogo } from "@/components/edview/CollegeCards";
import { RatingPill, Stars } from "@/components/edview/Stars";

const searchSchema = z.object({ q: z.string().optional() });

export const Route = createFileRoute("/search")({
  validateSearch: searchSchema,
  head: () => ({ meta: [{ title: "Search - EdView" }] }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const navigate = useNavigate();
  const query = q ?? "";

  const [phase, setPhase] = useState<"loading" | "done">("loading");

  useEffect(() => {
    if (!query) {
      setPhase("done");
      return;
    }
    setPhase("loading");
    const t = window.setTimeout(() => setPhase("done"), 1100);
    return () => clearTimeout(t);
  }, [query]);

  const result = useMemo(() => (query ? aiSearch(query) : null), [query]);

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-brand">
        <Sparkles className="h-3.5 w-3.5" /> AI Search
      </div>
      <h1 className="mt-2 text-3xl tracking-tight md:text-4xl">
        Results for <span className="font-display italic">"{query || "..."}"</span>
      </h1>

      <div className="mt-6">
        <AiSearchBar size="md" />
      </div>

      {!query ? (
        <EmptyState />
      ) : phase === "loading" ? (
        <LoadingState />
      ) : (
        <div className="mt-8 space-y-8 animate-fade-in">
          {result?.summary && (
            <div className="rounded-2xl border border-border bg-gradient-to-br from-brand-soft/40 to-card p-6 shadow-soft">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-brand">
                <Sparkles className="h-3.5 w-3.5" /> AI Summary
              </div>
              <p className="mt-3 text-sm leading-relaxed text-foreground">{result.summary}</p>
            </div>
          )}

          <section>
            <h2 className="text-lg font-semibold">Matching colleges</h2>
            {result && result.colleges.length > 0 ? (
              <div className="mt-4 grid gap-4 sm:grid-cols-2 stagger">
                {result.colleges.map(({ college, reason, avg, recPct }) => (
                  <Link
                    key={college.slug}
                    to="/colleges/$slug"
                    params={{ slug: college.slug }}
                    className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-elevated"
                  >
                    <CollegeLogo college={college} size={48} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="truncate text-sm font-semibold group-hover:text-brand">{college.name}</h3>
                        <RatingPill value={avg} />
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">{college.location}</p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        <span className="text-brand">{reason}</span> - {recPct}% recommend
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">No colleges matched. Try a broader term.</p>
            )}
          </section>

          {result && result.reviews.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold">Relevant reviews</h2>
              <div className="mt-4 space-y-4 stagger">
                {result.reviews.map((r) => {
                  const college = COLLEGES.find((c) => c.slug === r.collegeSlug)!;
                  return (
                    <Link
                      key={r.id}
                      to="/colleges/$slug"
                      params={{ slug: college.slug }}
                      className="block rounded-2xl border border-border bg-card p-5 shadow-soft transition hover:shadow-elevated"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="inline-flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3 shrink-0" />
                          <span className="truncate">{college.name} - {r.program}</span>
                        </span>
                        <Stars value={avgOverall(r.ratings)} size={12} />
                      </div>
                      <Quote className="mt-3 h-4 w-4 text-brand/60" />
                      <h3 className="mt-1 text-sm font-semibold">{r.title}</h3>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">"{r.body}"</p>
                      <div className="mt-3 flex items-center justify-between gap-3 text-xs text-muted-foreground">
                        <span className="min-w-0 truncate">- {r.author}, Class of {r.year}</span>
                        <span className="inline-flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> {r.helpful}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {result && result.related.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Related searches</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {result.related.map((r) => (
                  <button
                    key={r}
                    onClick={() => navigate({ to: "/search", search: { q: r } })}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium transition hover:bg-muted"
                  >
                    <SearchIcon className="h-3 w-3 text-muted-foreground" /> {r}
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mt-10 rounded-2xl border border-dashed border-border bg-card p-10 text-center">
      <Sparkles className="mx-auto h-8 w-8 text-brand/60" />
      <p className="mt-3 text-sm text-muted-foreground">Ask anything about Kathmandu's colleges: programs, academics, placements, value.</p>
    </div>
  );
}

function LoadingState() {
  const steps = ["Colleges", "Reviews", "AI Insights"];
  return (
    <div className="mt-10 rounded-2xl border border-border bg-card p-8 shadow-soft">
      <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-brand">
        <Sparkles className="h-3.5 w-3.5 animate-pulse" /> Searching through...
      </div>
      <ul className="mt-5 space-y-3">
        {steps.map((s, i) => (
          <li
            key={s}
            className="flex items-center gap-2.5 text-sm animate-fade-in-up"
            style={{ animationDelay: `${i * 0.25}s` }}
          >
            <CheckCircle2 className="h-4 w-4 text-brand" /> {s}
          </li>
        ))}
      </ul>
      <div className="mt-6 space-y-3">
        {[0, 1].map((i) => <div key={i} className="skeleton h-20 rounded-xl" />)}
      </div>
    </div>
  );
}
