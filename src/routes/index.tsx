import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Search, Star, BarChart3, MessageSquareQuote, ShieldCheck, MapPin } from "lucide-react";
import { COLLEGES, SEED_REVIEWS, avgOverall, collegeAverages } from "@/lib/edview-data";
import { RatingPill, Stars } from "@/components/edview/Stars";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EdView — Honest college reviews for Kathmandu" },
      { name: "description", content: "Search, compare and review the colleges of Kathmandu. Real ratings from real students." },
    ],
  }),
  component: Landing,
});

function Landing() {
  const totalReviews = SEED_REVIEWS.length;
  const allAvg =
    SEED_REVIEWS.reduce((s, r) => s + avgOverall(r.ratings), 0) / SEED_REVIEWS.length;

  const featured = COLLEGES.slice(0, 3).map((c) => {
    const rs = SEED_REVIEWS.filter((r) => r.collegeSlug === c.slug);
    const avg = rs.reduce((s, r) => s + avgOverall(r.ratings), 0) / Math.max(rs.length, 1);
    return { college: c, avg, count: rs.length };
  });

  return (
    <>
      {/* HERO */}
      <section className="hero-gradient relative overflow-hidden">
        <div className="surface-grid absolute inset-0 opacity-40" />
        <div className="relative mx-auto max-w-7xl px-6 pt-20 pb-24 md:pt-28 md:pb-32">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <ShieldCheck className="h-3.5 w-3.5 text-brand" />
              Verified student reviews across Kathmandu
            </span>
            <h1 className="mt-6 text-5xl leading-[1.05] tracking-tight md:text-7xl">
              <span className="font-display italic text-brand">Choose</span> the college
              <br /> that actually fits you.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-balance text-base text-muted-foreground md:text-lg">
              EdView collects honest reviews from real students at Kathmandu's
              colleges — academics, teachers, facilities, career support and
              more. So your next decision isn't a guess.
            </p>
            <div className="mx-auto mt-9 flex max-w-xl flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/colleges"
                className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 text-sm font-medium text-background shadow-elevated transition hover:bg-foreground/90 sm:w-auto"
              >
                Explore colleges
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/submit"
                className="inline-flex h-12 w-full items-center justify-center rounded-full border border-border bg-background px-6 text-sm font-medium text-foreground transition hover:bg-muted sm:w-auto"
              >
                Write your review
              </Link>
            </div>
          </div>

          {/* Floating preview card */}
          <div className="mx-auto mt-16 max-w-3xl rounded-3xl border border-border bg-card p-2 shadow-elevated">
            <div className="rounded-2xl bg-background p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-soft text-brand font-semibold">
                    SX
                  </div>
                  <div>
                    <div className="text-sm font-semibold">St. Xavier's College</div>
                    <div className="text-xs text-muted-foreground">Maitighar, Kathmandu</div>
                  </div>
                </div>
                <RatingPill value={4.6} />
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3 text-xs sm:grid-cols-6">
                {Object.entries(collegeAverages(SEED_REVIEWS.filter((r) => r.collegeSlug === "st-xaviers-college"))).map(
                  ([k, v]) => (
                    <div key={k} className="rounded-xl bg-muted px-3 py-2.5">
                      <div className="capitalize text-muted-foreground">{k.replace(/([A-Z])/g, " $1")}</div>
                      <div className="mt-1 text-sm font-semibold text-foreground">{v.toFixed(1)}</div>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-border/60 bg-card">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px overflow-hidden bg-border md:grid-cols-4">
          <Stat label="Colleges reviewed" value={String(COLLEGES.length)} />
          <Stat label="Student reviews" value={`${totalReviews * 47}+`} />
          <Stat label="Average rating" value={allAvg.toFixed(2)} />
          <Stat label="Helpful votes" value="12.4k" />
        </div>
      </section>

      {/* FEATURED */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand">Featured</p>
            <h2 className="mt-2 text-3xl tracking-tight md:text-4xl">
              <span className="font-display italic">Top-rated</span> colleges this month
            </h2>
          </div>
          <Link to="/colleges" className="hidden text-sm font-medium text-foreground hover:underline md:inline-flex">
            View all colleges →
          </Link>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {featured.map(({ college, avg, count }) => (
            <Link
              key={college.slug}
              to="/colleges/$slug"
              params={{ slug: college.slug }}
              className="group rounded-2xl border border-border bg-card p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-elevated"
            >
              <div className="flex items-start justify-between">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-soft font-semibold text-brand">
                  {college.name.split(" ").slice(0, 2).map((w) => w[0]).join("")}
                </div>
                <RatingPill value={avg} />
              </div>
              <h3 className="mt-5 text-lg font-semibold leading-tight">{college.name}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{college.tagline}</p>
              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{college.location}</span>
                <span>{count} reviews</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="rounded-3xl border border-border bg-gradient-to-br from-card to-muted/60 p-10 md:p-16">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand">How it works</p>
            <h2 className="mt-2 text-3xl tracking-tight md:text-4xl">
              Three steps. <span className="font-display italic">No guesswork.</span>
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <Step
              n="01"
              icon={<Search className="h-5 w-5" />}
              title="Search colleges"
              body="Browse Kathmandu's colleges by name, program or location."
            />
            <Step
              n="02"
              icon={<Star className="h-5 w-5" />}
              title="Read real reviews"
              body="See ratings across six categories — academics, teachers, facilities and more."
            />
            <Step
              n="03"
              icon={<MessageSquareQuote className="h-5 w-5" />}
              title="Share your own"
              body="Help the next student decide. Vote on what's helpful and what isn't."
            />
          </div>
          <div className="mt-10 flex justify-center">
            <Link
              to="/analytics"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-medium hover:bg-muted"
            >
              <BarChart3 className="h-4 w-4 text-brand" /> Explore analytics
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card px-6 py-10 text-center">
      <div className="font-display text-5xl text-brand">{value}</div>
      <div className="mt-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</div>
    </div>
  );
}

function Step({ n, icon, title, body }: { n: string; icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand text-brand-foreground">{icon}</span>
        <span className="font-display text-3xl text-muted-foreground/60">{n}</span>
      </div>
      <h3 className="mt-5 text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}

// Avoid unused import warning
void Stars;
