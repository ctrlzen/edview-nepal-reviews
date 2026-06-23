import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo } from "react";
import { ArrowLeft, MapPin, Calendar, GraduationCap, Wallet, ThumbsUp, ThumbsDown, PenLine } from "lucide-react";
import { COLLEGES, CATEGORIES, avgOverall, collegeAverages, getCollege, type Category } from "@/lib/edview-data";
import { useReviews, applyVotes } from "@/lib/edview-store";
import { RatingPill, Stars } from "@/components/edview/Stars";

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
      <Link to="/colleges" className="mt-4 inline-block text-brand hover:underline">← Back to directory</Link>
    </div>
  ),
});

function Profile() {
  const { college } = Route.useLoaderData();
  const { reviews, votes, vote } = useReviews();

  const collegeReviews = useMemo(
    () => reviews.filter((r) => r.collegeSlug === college.slug).map((r) => applyVotes(r, votes))
      .sort((a, b) => b.date.localeCompare(a.date)),
    [reviews, votes, college.slug],
  );

  const averages = collegeAverages(collegeReviews);
  const overall = collegeReviews.length
    ? collegeReviews.reduce((s, r) => s + avgOverall(r.ratings), 0) / collegeReviews.length
    : 0;

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <Link to="/colleges" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> All colleges
      </Link>

      {/* Header */}
      <header className="mt-6 overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card to-muted/60 p-8 shadow-soft md:p-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-5">
            <div className="grid h-20 w-20 place-items-center rounded-2xl bg-brand text-2xl font-semibold text-brand-foreground shadow-elevated">
              {college.name.split(" ").slice(0, 2).map((w) => w[0]).join("")}
            </div>
            <div>
              <h1 className="text-3xl tracking-tight md:text-4xl">{college.name}</h1>
              <p className="mt-2 max-w-xl text-muted-foreground">{college.tagline}</p>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" />{college.location}</span>
                <span className="inline-flex items-center gap-1.5"><Calendar className="h-4 w-4" />Est. {college.established}</span>
                <span className="inline-flex items-center gap-1.5"><Wallet className="h-4 w-4" />{college.tuitionRange}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-background p-5 text-center md:min-w-56">
            <div className="font-display text-6xl text-brand leading-none">{overall.toFixed(1)}</div>
            <div className="mt-2 flex justify-center"><Stars value={overall} size={18} /></div>
            <div className="mt-1 text-xs text-muted-foreground">{collegeReviews.length} student reviews</div>
            <Link
              to="/submit"
              search={{ college: college.slug }}
              className="mt-4 inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-full bg-foreground text-xs font-medium text-background hover:bg-foreground/90"
            >
              <PenLine className="h-3.5 w-3.5" /> Write a review
            </Link>
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
                <span key={p} className="rounded-full bg-muted px-3 py-1 text-xs">{p}</span>
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

          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Student reviews ({collegeReviews.length})</h2>
              <RatingPill value={overall || 0} />
            </div>
            <div className="space-y-4">
              {collegeReviews.map((r) => (
                <article key={r.id} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-full bg-brand-soft text-sm font-semibold text-brand">
                        {r.author.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <div className="text-sm font-semibold">{r.author}</div>
                        <div className="text-xs text-muted-foreground">{r.program} · Class of {r.year}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <RatingPill value={avgOverall(r.ratings)} />
                      <div className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                        {new Date(r.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                      </div>
                    </div>
                  </div>

                  <h3 className="mt-4 text-base font-semibold leading-snug">{r.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.body}</p>

                  <div className="mt-4 grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                    {CATEGORIES.map(({ key, label }) => (
                      <div key={key} className="flex items-center justify-between rounded-lg bg-muted px-2.5 py-1.5 text-xs">
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
                  No reviews yet. <Link to="/submit" search={{ college: college.slug }} className="text-brand hover:underline">Be the first to write one.</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
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

// Avoid unused import warning
void COLLEGES;
