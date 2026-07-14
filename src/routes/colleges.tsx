import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, MapPin, ArrowUpRight } from "lucide-react";
import { COLLEGES, avgOverall } from "@/lib/edview-data";
import { useReviews } from "@/lib/edview-store";
import { RatingPill } from "@/components/edview/Stars";
import { SaveCollegeButton } from "@/components/edview/SaveCollegeButton";

export const Route = createFileRoute("/colleges")({
  head: () => ({
    meta: [
      { title: "Colleges in Kathmandu — EdView" },
      {
        name: "description",
        content: "Browse and compare colleges across Kathmandu with real student ratings.",
      },
    ],
  }),
  component: Directory,
});

function Directory() {
  const { reviews } = useReviews();
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"rating" | "name" | "reviews">("rating");

  const items = useMemo(() => {
    const enriched = COLLEGES.map((c) => {
      const rs = reviews.filter((r) => r.collegeSlug === c.slug);
      const avg = rs.length ? rs.reduce((s, r) => s + avgOverall(r.ratings), 0) / rs.length : 0;
      return { college: c, avg, count: rs.length };
    });
    const filtered = enriched.filter(({ college }) => {
      const t = `${college.name} ${college.location} ${college.programs.join(" ")}`.toLowerCase();
      return t.includes(q.toLowerCase());
    });
    filtered.sort((a, b) => {
      if (sort === "name") return a.college.name.localeCompare(b.college.name);
      if (sort === "reviews") return b.count - a.count;
      return b.avg - a.avg;
    });
    return filtered;
  }, [reviews, q, sort]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-14">
      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand">Directory</p>
        <h1 className="text-4xl tracking-tight md:text-5xl">
          Every college in Kathmandu, <span className="font-display italic">rated honestly.</span>
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Search by name, program or area. Sort by rating to see what students say.
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-border bg-card p-3 shadow-soft md:flex-row md:items-center">
        <div className="flex flex-1 items-center gap-2 rounded-xl bg-muted px-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search colleges, programs, locations…"
            className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex items-center gap-1 rounded-xl bg-muted p-1 text-xs font-medium">
          {(["rating", "reviews", "name"] as const).map((k) => (
            <button
              key={k}
              onClick={() => setSort(k)}
              className={`rounded-lg px-3 py-2 capitalize transition ${
                sort === k
                  ? "bg-background text-foreground shadow-soft"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {items.map(({ college, avg, count }) => (
          <Link
            key={college.slug}
            to="/colleges/$slug"
            params={{ slug: college.slug }}
            className="group flex items-start gap-5 rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-0.5 hover:shadow-elevated"
          >
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-brand-soft text-lg font-semibold text-brand">
              {college.name
                .split(" ")
                .slice(0, 2)
                .map((w) => w[0])
                .join("")}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <h3 className="truncate text-base font-semibold">{college.name}</h3>
                <SaveCollegeButton collegeSlug={college.slug} />
              </div>
              <div className="mt-2 flex items-center gap-3">
                {count > 0 ? (
                  <>
                    <RatingPill value={avg} />
                    <span className="text-xs text-muted-foreground">{count} reviews</span>
                  </>
                ) : (
                  <span className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                    No reviews yet
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
        {items.length === 0 && (
          <div className="md:col-span-2 rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            No colleges match "{q}".
          </div>
        )}
      </div>
    </div>
  );
}
