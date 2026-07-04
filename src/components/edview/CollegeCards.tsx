import { Link } from "@tanstack/react-router";
import { MapPin, ArrowUpRight, Eye } from "lucide-react";
import type { College } from "@/lib/edview-data";
import { RatingPill, Stars } from "@/components/edview/Stars";

export function CollegeLogo({ college, size = 48 }: { college: College; size?: number }) {
  return (
    <div
      className="grid place-items-center rounded-2xl bg-brand-soft font-semibold text-brand"
      style={{ width: size, height: size, fontSize: size * 0.32 }}
    >
      {college.name.split(" ").slice(0, 2).map((w) => w[0]).join("")}
    </div>
  );
}

export function TrendingCard({
  college,
  avg,
  recPct,
  reviewCount,
}: {
  college: College;
  avg: number;
  recPct: number;
  reviewCount: number;
}) {
  return (
    <Link
      to="/colleges/$slug"
      params={{ slug: college.slug }}
      className="group flex w-72 flex-none flex-col rounded-2xl border border-border bg-card p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-elevated"
    >
      <div className="flex items-start justify-between">
        <CollegeLogo college={college} />
        <RatingPill value={avg} />
      </div>
      <h3 className="mt-4 truncate text-base font-semibold">{college.name}</h3>
      <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{college.tagline}</p>
      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{college.location}</span>
        <span>{reviewCount} reviews</span>
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Recommend</div>
          <div className="font-display text-lg text-brand">{recPct}%</div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1.5 text-xs font-medium transition group-hover:bg-brand-soft group-hover:text-brand">
          <Eye className="h-3.5 w-3.5" /> Quick view
        </span>
      </div>
    </Link>
  );
}

export function CollegeCard({
  college,
  avg,
  recPct,
  reviewCount,
  verified,
}: {
  college: College;
  avg: number;
  recPct: number;
  reviewCount: number;
  verified?: boolean;
}) {
  return (
    <Link
      to="/colleges/$slug"
      params={{ slug: college.slug }}
      className="group flex flex-col rounded-2xl border border-border bg-card p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-elevated"
    >
      <div className="flex items-start justify-between">
        <CollegeLogo college={college} />
        <div className="flex flex-col items-end gap-1.5">
          <RatingPill value={avg} />
          {verified && (
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-semibold text-brand">
              <Stars value={5} size={9} /> Verified
            </span>
          )}
        </div>
      </div>
      <h3 className="mt-5 text-lg font-semibold leading-tight">{college.name}</h3>
      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{college.tagline}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {college.programs.slice(0, 3).map((p) => (
          <span key={p} className="rounded-full border border-border bg-background px-2.5 py-0.5 text-xs text-muted-foreground">
            {p}
          </span>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{college.location}</span>
        <span className="inline-flex items-center gap-1">
          {recPct}% recommend <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
}
