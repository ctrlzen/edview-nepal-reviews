import { useState, useMemo, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search, Star, ThumbsUp, BadgeCheck, ListFilter as Filter, ArrowUpDown } from "lucide-react";
import {
  usePremiumCollege,
  PremiumPageShell,
  PremiumCard,
  EmptyState,
} from "@/components/edview/PremiumLayout";
import {
  searchReviews,
  filterReviews,
  sortReviews,
  getPrograms,
  getBatches,
  getReviewSentiment,
  type SortOption,
  type Sentiment,
} from "@/lib/premium-analytics";
import { avgOverall, type Review } from "@/lib/edview-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/premium/reviews")({
  head: () => ({ meta: [{ title: "Reviews — Premium Dashboard — EdView" }] }),
  component: ReviewsPage,
});

function ReviewsPage() {
  const { college, reviews } = usePremiumCollege();
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [programFilter, setProgramFilter] = useState<string>("all");
  const [batchFilter, setBatchFilter] = useState<string>("all");
  const [sentimentFilter, setSentimentFilter] = useState<string>("all");
  const [sort, setSort] = useState<SortOption>("newest");

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  const programs = useMemo(() => getPrograms(reviews), [reviews]);
  const batches = useMemo(() => getBatches(reviews), [reviews]);

  const filtered = useMemo(() => {
    let result = searchReviews(reviews, query);
    result = filterReviews(result, {
      rating: ratingFilter === "all" ? undefined : parseInt(ratingFilter),
      program: programFilter,
      batch: batchFilter,
      sentiment: sentimentFilter === "all" ? undefined : (sentimentFilter as Sentiment),
    });
    return sortReviews(result, sort);
  }, [reviews, query, ratingFilter, programFilter, batchFilter, sentimentFilter, sort]);

  if (!college) return null;

  return (
    <PremiumPageShell>
      <h1 className="text-3xl tracking-tight md:text-4xl">
        Review <span className="font-display italic text-brand">— analytics.</span>
      </h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Search, filter, and monitor all student reviews. Colleges cannot edit or delete reviews.
      </p>

      {/* Search + Filters */}
      <div className="mt-6 rounded-3xl border border-border bg-card p-4 shadow-soft">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search reviews by title, body, author, program..."
            className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm outline-none focus:border-brand"
          />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <FilterSelect label="Rating" value={ratingFilter} onChange={setRatingFilter} options={[
            { value: "all", label: "All ratings" },
            { value: "5", label: "5 stars" },
            { value: "4", label: "4 stars" },
            { value: "3", label: "3 stars" },
            { value: "2", label: "2 stars" },
            { value: "1", label: "1 star" },
          ]} />
          <FilterSelect label="Program" value={programFilter} onChange={setProgramFilter} options={[
            { value: "all", label: "All programs" },
            ...programs.map((p) => ({ value: p, label: p })),
          ]} />
          <FilterSelect label="Batch" value={batchFilter} onChange={setBatchFilter} options={[
            { value: "all", label: "All batches" },
            ...batches.map((b) => ({ value: b, label: b })),
          ]} />
          <FilterSelect label="Sentiment" value={sentimentFilter} onChange={setSentimentFilter} options={[
            { value: "all", label: "All sentiment" },
            { value: "positive", label: "Positive" },
            { value: "neutral", label: "Neutral" },
            { value: "negative", label: "Negative" },
          ]} />
        </div>

        <div className="mt-2 flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          <FilterSelect label="Sort" value={sort} onChange={(v) => setSort(v as SortOption)} options={[
            { value: "newest", label: "Newest" },
            { value: "most_helpful", label: "Most helpful" },
            { value: "lowest", label: "Lowest rating" },
            { value: "highest", label: "Highest rating" },
          ]} />
          <span className="ml-auto text-xs text-muted-foreground">
            {filtered.length} review{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Reviews list */}
      <div className="mt-6 space-y-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-40 rounded-3xl" />
          ))
        ) : filtered.length === 0 ? (
          <EmptyState title="No reviews match your filters" message="Try adjusting your search or filters to see more reviews." />
        ) : (
          filtered.map((r) => <ReviewCard key={r.id} review={r} />)
        )}
      </div>
    </PremiumPageShell>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 rounded-lg border border-border bg-background pl-3 pr-8 text-xs font-medium outline-none focus:border-brand"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const overall = avgOverall(review.ratings);
  const sentiment = getReviewSentiment(review);
  const sentimentColor = sentiment === "positive" ? "text-green-600 bg-green-50" : sentiment === "negative" ? "text-destructive bg-red-50" : "text-amber-600 bg-amber-50";

  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-soft transition-transform hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-semibold">{review.title}</h3>
            <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium capitalize", sentimentColor)}>
              {sentiment}
            </span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{review.author}</span>
            {review.studentType && (
              <span className="inline-flex items-center gap-1 rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-medium text-brand">
                <BadgeCheck className="h-3 w-3" /> Verified Student
              </span>
            )}
            <span>·</span>
            <span>{review.program}</span>
            <span>·</span>
            <span>Class of {review.year}</span>
            <span>·</span>
            <span>{new Date(review.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1 rounded-xl bg-brand/5 px-3 py-1.5">
          <Star className="h-4 w-4 fill-brand text-brand" />
          <span className="text-sm font-semibold">{overall.toFixed(1)}</span>
        </div>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-muted-foreground line-clamp-3">{review.body}</p>

      {(review.pros?.length || review.cons?.length) && (
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {review.pros?.length ? (
            <div className="rounded-xl bg-green-50 p-2.5">
              <div className="text-[10px] font-semibold text-green-600">PROS</div>
              <ul className="mt-1 space-y-0.5">
                {review.pros.slice(0, 2).map((p) => (
                  <li key={p} className="text-xs text-muted-foreground">+ {p}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {review.cons?.length ? (
            <div className="rounded-xl bg-red-50 p-2.5">
              <div className="text-[10px] font-semibold text-destructive">CONS</div>
              <ul className="mt-1 space-y-0.5">
                {review.cons.slice(0, 2).map((c) => (
                  <li key={c} className="text-xs text-muted-foreground">- {c}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      )}

      <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <ThumbsUp className="h-3.5 w-3.5" /> {review.helpful} helpful
        </span>
        {review.recommend !== undefined && (
          <span className={cn("font-medium", review.recommend ? "text-green-600" : "text-destructive")}>
            {review.recommend ? "✓ Recommends" : "✗ Doesn't recommend"}
          </span>
        )}
      </div>
    </div>
  );
}
