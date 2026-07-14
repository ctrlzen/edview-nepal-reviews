import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  GraduationCap,
  Wallet,
  ThumbsUp,
  ThumbsDown,
  PenLine,
  Sparkles,
  AlertCircle,
  Lightbulb,
  Filter,
  ChevronDown,
  X,
  Check,
  Loader2,
} from "lucide-react";
import { COLLEGES, CATEGORIES, avgOverall, collegeAverages, getCollege, recommendationPct, type Category, type College, type Review } from "@/lib/edview-data";
import { useReviews, applyVotes } from "@/lib/edview-store";
import { useRecentlyViewed } from "@/lib/recently-viewed";
import { RatingPill, Stars } from "@/components/edview/Stars";
import { StarRating } from "@/components/edview/StarRating";
import { SaveCollegeButton } from "@/components/edview/SaveCollegeButton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/colleges/$slug")({
  loader: ({ params }) => {
    const college = getCollege(params.slug);
    if (!college) throw notFound();
    return { college };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.college.name ?? "College"} — EdView` },
      { name: "description", content: loaderData?.college.tagline ?? "College profile on EdView." },
    ],
  }),
  component: Profile,
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      <h1 className="text-2xl font-semibold">College not found</h1>
      <Link to="/colleges" className="mt-4 inline-block text-brand hover:underline">
        ← Back to directory
      </Link>
    </div>
  ),
});

type SortOption = "date" | "rating" | "program";

function Profile() {
  const { college } = Route.useLoaderData() as { college: College };
  const { reviews, votes, vote, addReview, addReviewAsync, isSubmitting } = useReviews();
  const { track } = useRecentlyViewed();

  useEffect(() => { track(college.slug); }, [college.slug, track]);

  const emptyRatings: Record<Category, number> = {
    academics: 0,
    teachers: 0,
    facilities: 0,
    studentLife: 0,
    careerSupport: 0,
    valueForMoney: 0,
  };

  // Filter and sort state
  const [sortBy, setSortBy] = useState<SortOption>("date");
  const [filterProgram, setFilterProgram] = useState<string>("all");
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Review form state
  const [formData, setFormData] = useState({
    author: "",
    program: "",
    year: "2024",
    title: "",
    body: "",
    ratings: { ...emptyRatings },
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Get unique programs from existing reviews
  const programs = useMemo(() => {
    const programSet = new Set(
      reviews.filter((r) => r.collegeSlug === college.slug).map((r) => r.program),
    );
    return Array.from(programSet).sort();
  }, [reviews, college.slug]);

  // Filter and sort reviews
  const collegeReviews = useMemo(() => {
    let filtered = reviews
      .filter((r) => r.collegeSlug === college.slug)
      .map((r) => applyVotes(r, votes));

    if (filterProgram !== "all") {
      filtered = filtered.filter((r) => r.program === filterProgram);
    }

    filtered.sort((a, b) => {
      if (sortBy === "rating") {
        return avgOverall(b.ratings) - avgOverall(a.ratings);
      }
      if (sortBy === "program") {
        return a.program.localeCompare(b.program);
      }
      return b.date.localeCompare(a.date);
    });

    return filtered;
  }, [reviews, votes, college.slug, sortBy, filterProgram]);

  const averages = collegeAverages(collegeReviews);
  const overall = collegeReviews.length
    ? collegeReviews.reduce((s, r) => s + avgOverall(r.ratings), 0) / collegeReviews.length
    : 0;
  const recPct = recommendationPct(collegeReviews);
  const positives = collegeReviews.filter((r) => avgOverall(r.ratings) >= 4);
  const negatives = collegeReviews.filter((r) => avgOverall(r.ratings) <= 3);
  const positiveThemes = useMemo(() => tally(collegeReviews.flatMap((r) => r.pros ?? [])), [collegeReviews]);
  const negativeThemes = useMemo(() => tally(collegeReviews.flatMap((r) => r.cons ?? [])), [collegeReviews]);

  // Check if form is valid
  const isFormValid =
    formData.author.trim() &&
    formData.program.trim() &&
    formData.title.trim() &&
    formData.body.trim().length >= 30 &&
    Object.values(formData.ratings).every((v) => v > 0);

  // Calculate form progress percentage
  const formProgress = useMemo(() => {
    let completed = 0;
    const total = 9; // author, program, title, body, 6 ratings (body counts for 1, year is optional)
    if (formData.author.trim()) completed++;
    if (formData.program.trim()) completed++;
    if (formData.title.trim()) completed++;
    if (formData.body.trim().length >= 30) completed++;
    Object.values(formData.ratings).forEach((v) => {
      if (v > 0) completed++;
    });
    return Math.round((completed / total) * 100);
  }, [formData]);

  async function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!isFormValid) return;

    const newReview: Review = {
      id: `user-${Date.now()}`,
      collegeSlug: college.slug,
      author: formData.author.trim(),
      program: formData.program.trim(),
      year: formData.year,
      title: formData.title.trim(),
      body: formData.body.trim(),
      date: new Date().toISOString().slice(0, 10),
      ratings: formData.ratings,
      helpful: 0,
      notHelpful: 0,
    };

    try {
      await addReviewAsync(newReview);
    } catch (err) {
      console.error("Failed to submit review", err);
      return;
    }

    setFormSubmitted(true);
    setTimeout(() => {
      setShowReviewModal(false);
      setFormSubmitted(false);
      setFormData({
        author: "",
        program: "",
        year: "2024",
        title: "",
        body: "",
        ratings: { ...emptyRatings },
      });
    }, 2200);
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <Link
        to="/colleges"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> All colleges
      </Link>

      {/* Cover */}
      <div className="relative mt-6 h-44 overflow-hidden rounded-3xl border border-border shadow-soft md:h-56">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.42 0.11 168) 0%, oklch(0.55 0.13 168) 45%, oklch(0.78 0.13 65) 100%)",
          }}
        />
        <div className="surface-grid absolute inset-0 opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between text-brand-foreground">
          <div className="font-display text-2xl italic md:text-3xl">{college.location}</div>
          <span className="hidden rounded-full bg-background/20 px-3 py-1 text-xs font-medium backdrop-blur md:inline-flex">
            Est. {college.established}
          </span>
        </div>
      </div>

      {/* Header */}
      <header className="-mt-10 overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-soft md:p-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-5">
            <div className="grid h-20 w-20 flex-none place-items-center rounded-2xl bg-brand text-2xl font-semibold text-brand-foreground shadow-elevated">
              {college.name
                .split(" ")
                .slice(0, 2)
                .map((w) => w[0])
                .join("")}
            </div>
            <div>
              <h1 className="text-3xl tracking-tight md:text-4xl">{college.name}</h1>
              <p className="mt-2 max-w-xl text-muted-foreground">{college.tagline}</p>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {college.location}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  Est. {college.established}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Wallet className="h-4 w-4" />
                  {college.tuitionRange}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 md:min-w-72">
            <div className="rounded-2xl border border-border bg-background p-4 text-center">
              <div className="font-display text-5xl text-brand leading-none">{overall.toFixed(1)}</div>
              <div className="mt-2 flex justify-center">
                <Stars value={overall} size={14} />
              </div>
              <div className="mt-1 text-[11px] text-muted-foreground">{collegeReviews.length} reviews</div>
            </div>
            <div className="rounded-2xl border border-border bg-background p-4 text-center">
              <div className="font-display text-5xl text-brand leading-none">{recPct}%</div>
              <div className="mt-2 text-[11px] uppercase tracking-wider text-muted-foreground">would recommend</div>
              <div className="mt-3 flex gap-2">
                <SaveCollegeButton collegeSlug={college.slug} />
                <Button
                  variant="default"
                  className="flex-1 h-8 text-[11px] rounded-full bg-foreground hover:bg-foreground/90"
                  onClick={() => setShowReviewModal(true)}
                >
                  <PenLine className="h-3 w-3" /> Review
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Sidebar: About + programs */}
        <aside className="space-y-6">
          <Card title="About">
            <p className="text-sm leading-relaxed text-muted-foreground">{college.about}</p>
          </Card>
          <Card title="Programs offered" icon={<GraduationCap className="h-4 w-4 text-brand" />}>
            <div className="flex flex-wrap gap-1.5">
              {college.programs.map((p) => (
                <span key={p} className="rounded-full bg-muted px-3 py-1 text-xs">
                  {p}
                </span>
              ))}
            </div>
            <div className="mt-4 text-xs text-muted-foreground">
              Affiliations: {college.affiliations.join(" · ")}
            </div>
          </Card>
        </aside>

        {/* Main: ratings + reviews */}
        <div className="space-y-6 lg:col-span-2">
          <Card title="Rating breakdown">
            <div className="grid gap-3 sm:grid-cols-2">
              {CATEGORIES.map(({ key, label }) => (
                <BreakdownRow key={key} label={label} value={averages[key as Category]} />
              ))}
            </div>
          </Card>

          {/* Write a Review CTA */}
          <div className="rounded-2xl border border-border bg-gradient-to-br from-brand-soft/50 to-card p-6 shadow-soft">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h3 className="text-lg font-semibold">Share your experience</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Help future students by writing an honest review about {college.name}.
                </p>
              </div>
              <Button
                variant="default"
                className="rounded-full bg-foreground hover:bg-foreground/90"
                onClick={() => setShowReviewModal(true)}
              >
                <PenLine className="h-4 w-4" /> Write a Review
              </Button>
            </div>
          </div>

          {/* Reviews Section */}
          <div>
            <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg font-semibold">Student reviews ({collegeReviews.length})</h2>

              <div className="flex flex-wrap items-center gap-2">
                {/* Program Filter */}
                <div className="relative">
                  <select
                    value={filterProgram}
                    onChange={(e) => setFilterProgram(e.target.value)}
                    className="h-9 appearance-none rounded-full border border-border bg-background pl-3 pr-8 text-xs font-medium outline-none focus:border-brand"
                  >
                    <option value="all">All Programs</option>
                    {programs.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  <Filter className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                </div>

                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="h-9 appearance-none rounded-full border border-border bg-background pl-3 pr-8 text-xs font-medium outline-none focus:border-brand"
                  >
                    <option value="date">Newest First</option>
                    <option value="rating">Highest Rated</option>
                    <option value="program">By Program</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {collegeReviews.map((r) => (
                <article key={r.id} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-full bg-brand-soft text-sm font-semibold text-brand">
                        {r.author
                          .split(" ")
                          .map((w) => w[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                      <div>
                        <div className="text-sm font-semibold">{r.author}</div>
                        <div className="text-xs text-muted-foreground">
                          {r.program} · Class of {r.year}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <RatingPill value={avgOverall(r.ratings)} />
                      <div className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                        {new Date(r.date).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                  </div>

                  <h3 className="mt-4 text-base font-semibold leading-snug">{r.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.body}</p>

                  {(r.pros?.length || r.cons?.length) && (
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {r.pros && r.pros.length > 0 && (
                        <div className="rounded-xl border border-border bg-brand-soft/40 p-3">
                          <div className="mb-1.5 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-brand">
                            <Sparkles className="h-3 w-3" /> Pros
                          </div>
                          <ul className="space-y-1 text-xs text-foreground">
                            {r.pros.map((p) => (
                              <li key={p} className="flex gap-1.5">
                                <span className="text-brand">+</span>
                                {p}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {r.cons && r.cons.length > 0 && (
                        <div className="rounded-xl border border-border bg-accent/40 p-3">
                          <div className="mb-1.5 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-accent-foreground">
                            <AlertCircle className="h-3 w-3" /> Cons
                          </div>
                          <ul className="space-y-1 text-xs text-foreground">
                            {r.cons.map((c) => (
                              <li key={c} className="flex gap-1.5">
                                <span>−</span>
                                {c}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {r.advice && (
                    <div className="mt-3 rounded-xl border border-dashed border-border bg-muted/60 p-3 text-xs">
                      <div className="mb-1 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        <Lightbulb className="h-3 w-3" /> Advice for future students
                      </div>
                      <p className="text-foreground">{r.advice}</p>
                    </div>
                  )}

                  <div className="mt-4 grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                    {CATEGORIES.map(({ key, label }) => (
                      <div
                        key={key}
                        className="flex items-center justify-between rounded-lg bg-muted px-2.5 py-1.5 text-xs"
                      >
                        <span className="text-muted-foreground">{label}</span>
                        <span className="font-semibold">{r.ratings[key as Category]}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 flex items-center gap-2 border-t border-border pt-4 text-xs">
                    <span className="text-muted-foreground">Was this helpful?</span>
                    <button
                      onClick={() => vote(r.id, "up")}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 transition ${
                        r.myVote === "up"
                          ? "border-brand bg-brand-soft text-brand"
                          : "border-border hover:bg-muted"
                      }`}
                    >
                      <ThumbsUp className="h-3.5 w-3.5" /> Helpful · {r.helpful}
                    </button>
                    <button
                      onClick={() => vote(r.id, "down")}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 transition ${
                        r.myVote === "down"
                          ? "border-destructive bg-destructive/10 text-destructive"
                          : "border-border hover:bg-muted"
                      }`}
                    >
                      <ThumbsDown className="h-3.5 w-3.5" /> Not · {r.notHelpful}
                    </button>
                  </div>
                </article>
              ))}
              {collegeReviews.length === 0 && (
                <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
                  {filterProgram !== "all" ? (
                    <>
                      No reviews found for {filterProgram}.{" "}
                      <button
                        onClick={() => setFilterProgram("all")}
                        className="text-brand hover:underline"
                      >
                        Show all reviews
                      </button>
                    </>
                  ) : (
                    <>
                      No reviews yet.{" "}
                      <button
                        onClick={() => setShowReviewModal(true)}
                        className="text-brand hover:underline"
                      >
                        Be the first to write one.
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Write Review Modal */}
      <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
            <DialogDescription>
              Share your honest experience at {college.name} to help future students.
            </DialogDescription>
          </DialogHeader>

          {formSubmitted ? (
            /* ----- Success Confirmation Screen ----- */
            <div className="py-12 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand text-brand-foreground">
                <Check className="h-8 w-8 animate-in zoom-in duration-300" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">Review submitted!</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Thanks for helping the next student decide.
              </p>
              <div className="mx-auto mt-6 max-w-xs rounded-xl border border-dashed border-border bg-muted/30 p-4 text-left text-xs text-muted-foreground">
                <div className="mb-1 font-semibold text-foreground">Your review summary</div>
                <p>
                  <span className="font-medium">College:</span> {college.name}
                </p>
                <p>
                  <span className="font-medium">Program:</span> {formData.program}
                </p>
                <p>
                  <span className="font-medium">Year:</span> Class of {formData.year}
                </p>
                <p>
                  <span className="font-medium">Title:</span> {formData.title}
                </p>
              </div>
              <p className="mt-6 text-xs text-muted-foreground/60">Closing automatically...</p>
            </div>
          ) : (
            /* ----- Review Form ----- */
            <form onSubmit={handleSubmitReview} className="space-y-5 py-4">
              {/* Progress Indicator */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Form completion</span>
                  <span className="font-semibold">{formProgress}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-brand transition-all duration-300 ease-out"
                    style={{ width: `${formProgress}%` }}
                  />
                </div>
                <div className="flex gap-1.5 pt-0.5">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((step) => {
                    const stepPct = Math.round(((step + 1) / 9) * 100);
                    return (
                      <div
                        key={step}
                        className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                          formProgress >= stepPct ? "bg-brand" : "bg-muted"
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Your Name</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="e.g. Riya M."
                    className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-brand"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Program</label>
                  <input
                    type="text"
                    value={formData.program}
                    onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                    placeholder="e.g. BBA, +2 Science"
                    className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-brand"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">Graduation Year</label>
                <select
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-brand"
                >
                  {["2020", "2021", "2022", "2023", "2024", "2025", "2026", "2027"].map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Rate by Category</label>
                <div className="grid gap-3 sm:grid-cols-2">
                  {CATEGORIES.map(({ key, label }) => (
                    <StarRating
                      key={key}
                      label={label}
                      value={formData.ratings[key as Category]}
                      onChange={(v) =>
                        setFormData({
                          ...formData,
                          ratings: { ...formData.ratings, [key]: v },
                        })
                      }
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">Review Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Great academics but intense workload"
                  className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-brand"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Your Review{" "}
                  <span className="text-muted-foreground">
                    ({formData.body.length} / 30 min)
                    {formData.body.trim().length >= 30 && (
                      <Check className="ml-1 inline h-3 w-3 text-brand" />
                    )}
                  </span>
                </label>
                <textarea
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  rows={5}
                  placeholder={'Share specifics \u2014 what worked, what didn\u2019t, who you\u2019d recommend it to. For example: \u201cThe science program prepared me well for entrance exams. Teachers were supportive and labs were well-equipped, though the schedule was demanding.\u201d'}
                  className="w-full resize-none rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-brand"
                  required
                />
              </div>

              <DialogFooter className="pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full"
                  onClick={() => setShowReviewModal(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="rounded-full bg-foreground hover:bg-foreground/90 disabled:opacity-40 disabled:cursor-not-allowed min-w-[150px]"
                  disabled={!isFormValid || isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting...
                    </span>
                  ) : (
                    "Submit Review"
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Card({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
      <h2 className="mb-3 flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        {icon} {title}
      </h2>
      {children}
    </section>
  );
}

function BreakdownRow({ label, value }: { label: string; value: number }) {
  const pct = (value / 5) * 100;
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold">{value.toFixed(1)}</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-brand" style={{ width: `${pct}%` }} />
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

// Avoid unused import warning
void COLLEGES;