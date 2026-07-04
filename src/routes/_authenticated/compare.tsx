import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { GitCompareArrows } from "lucide-react";
import { COLLEGES, SEED_REVIEWS, CATEGORIES, collegeAverages, avgOverall, recommendationPct, type Category, type College } from "@/lib/edview-data";

const searchSchema = z.object({ slugs: z.string().optional() });

export const Route = createFileRoute("/_authenticated/compare")({
  validateSearch: searchSchema,
  head: () => ({ meta: [{ title: "Compare colleges — EdView" }] }),
  component: ComparePage,
});

function ComparePage() {
  const { slugs } = Route.useSearch();
  const list: College[] = (slugs?.split(",").filter(Boolean) ?? [])
    .map((s: string): College | undefined => COLLEGES.find((c) => c.slug === s))
    .filter((c: College | undefined): c is College => !!c);

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-brand">
        <GitCompareArrows className="h-3.5 w-3.5" /> Side by side
      </div>
      <h1 className="mt-3 text-4xl tracking-tight">
        Compare <span className="font-display italic">colleges.</span>
      </h1>

      {list.length < 2 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-border bg-card p-10 text-center">
          <p className="text-sm text-muted-foreground">Pick at least two colleges from your saved list to compare.</p>
          <Link to="/saved" className="mt-4 inline-flex h-10 items-center rounded-full bg-brand px-5 text-sm font-medium text-brand-foreground">
            Open saved
          </Link>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-3xl border border-border bg-card shadow-soft">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="p-4 text-left font-medium text-muted-foreground">Metric</th>
                {list.map((c) => (
                  <th key={c.slug} className="p-4 text-left font-semibold">
                    <Link to="/colleges/$slug" params={{ slug: c.slug }} className="hover:underline">{c.name}</Link>
                    <div className="mt-0.5 text-xs font-normal text-muted-foreground">{c.location}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <Row label="Established" cells={list.map((c) => String(c.established))} />
              <Row label="Tuition" cells={list.map((c) => c.tuitionRange)} />
              <Row label="Affiliations" cells={list.map((c) => c.affiliations.join(", "))} />
              <Row label="Overall rating" cells={list.map((c) => `${avgOverall(collegeAverages(SEED_REVIEWS.filter((r) => r.collegeSlug === c.slug))).toFixed(2)} / 5`)} bold />
              <Row label="Would recommend" cells={list.map((c) => `${recommendationPct(SEED_REVIEWS.filter((r) => r.collegeSlug === c.slug))}%`)} bold />
              {CATEGORIES.map(({ key, label }) => (
                <Row
                  key={key}
                  label={label}
                  cells={list.map((c) => {
                    const avg = collegeAverages(SEED_REVIEWS.filter((r) => r.collegeSlug === c.slug));
                    return `${avg[key as Category].toFixed(2)} / 5`;
                  })}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Row({ label, cells, bold }: { label: string; cells: string[]; bold?: boolean }) {
  return (
    <tr className="border-b border-border last:border-0">
      <td className="p-4 text-muted-foreground">{label}</td>
      {cells.map((v, i) => (
        <td key={i} className={`p-4 ${bold ? "font-semibold" : ""}`}>{v}</td>
      ))}
    </tr>
  );
}
