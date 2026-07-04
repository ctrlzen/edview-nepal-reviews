import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";
import { GitCompareArrows, X, Plus, Check, Minus } from "lucide-react";
import {
  COLLEGES, SEED_REVIEWS, CATEGORIES, SCHOLARSHIPS,
  collegeAverages, avgOverall, recommendationPct, type Category, type College,
} from "@/lib/edview-data";
import { CollegeLogo } from "@/components/edview/CollegeCards";
import { RatingPill } from "@/components/edview/Stars";

const searchSchema = z.object({ slugs: z.string().optional() });

export const Route = createFileRoute("/_authenticated/compare")({
  validateSearch: searchSchema,
  head: () => ({ meta: [{ title: "Compare colleges — EdView" }] }),
  component: ComparePage,
});

function ComparePage() {
  const { slugs } = Route.useSearch();
  const initial: College[] = (slugs?.split(",").filter(Boolean) ?? [])
    .map((s: string): College | undefined => COLLEGES.find((c) => c.slug === s))
    .filter((c: College | undefined): c is College => !!c);

  const [list, setList] = useState<College[]>(initial);
  const [picker, setPicker] = useState(false);

  const remaining = COLLEGES.filter((c) => !list.find((x) => x.slug === c.slug));

  function add(c: College) {
    setList((prev) => (prev.length >= 4 ? prev : [...prev, c]));
    setPicker(false);
  }
  function remove(slug: string) {
    setList((prev) => prev.filter((c) => c.slug !== slug));
  }

  const rows = useMemo(() => buildRows(list), [list]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-brand">
        <GitCompareArrows className="h-3.5 w-3.5" /> Side by side
      </div>
      <h1 className="mt-3 text-4xl tracking-tight">
        Compare <span className="font-display italic">colleges.</span>
      </h1>
      <p className="mt-2 max-w-xl text-muted-foreground">
        Stack up to four colleges across ratings, fees, scholarships and student life.
      </p>

      {list.length < 2 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-border bg-card p-10 text-center">
          <p className="text-sm text-muted-foreground">Pick at least two colleges to compare.</p>
          <button
            onClick={() => setPicker(true)}
            className="mt-4 inline-flex h-10 items-center gap-2 rounded-full bg-brand px-5 text-sm font-medium text-brand-foreground"
          >
            <Plus className="h-4 w-4" /> Add colleges
          </button>
          <Link to="/saved" className="ml-3 inline-flex h-10 items-center rounded-full border border-border px-5 text-sm font-medium hover:bg-muted">
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
                  <th key={c.slug} className="p-4 text-left align-top">
                    <div className="flex items-start justify-between gap-2">
                      <Link to="/colleges/$slug" params={{ slug: c.slug }} className="flex items-center gap-3 hover:underline">
                        <CollegeLogo college={c} size={40} />
                        <div>
                          <div className="font-semibold leading-tight">{c.name}</div>
                          <div className="text-xs font-normal text-muted-foreground">{c.location}</div>
                        </div>
                      </Link>
                      <button onClick={() => remove(c.slug)} className="grid h-7 w-7 flex-none place-items-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive" aria-label="Remove">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </th>
                ))}
                {list.length < 4 && (
                  <th className="p-4 align-top">
                    <button onClick={() => setPicker(true)} className="inline-flex h-10 items-center gap-1.5 rounded-full border border-dashed border-border px-4 text-xs font-medium text-muted-foreground hover:bg-muted">
                      <Plus className="h-3.5 w-3.5" /> Add
                    </button>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="border-b border-border last:border-0">
                  <td className="p-4 text-muted-foreground">{row.label}</td>
                  {row.cells.map((cell, i) => (
                    <td key={i} className="p-4 align-middle">
                      {cell.type === "bar" ? (
                        <BarCell value={cell.value ?? 0} max={5} suffix={cell.suffix} />
                      ) : cell.type === "best" ? (
                        <BestCell cells={row.cells} index={i} text={cell.text ?? ""} />
                      ) : (
                        <span className={row.bold ? "font-semibold" : ""}>{cell.text}</span>
                      )}
                    </td>
                  ))}
                  {list.length < 4 && <td />}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {picker && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={() => setPicker(false)}>
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-5 shadow-elevated" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-sm font-semibold">Add a college to compare</h3>
            <div className="mt-4 max-h-80 space-y-2 overflow-y-auto">
              {remaining.map((c) => (
                <button key={c.slug} onClick={() => add(c)} className="flex w-full items-center gap-3 rounded-xl border border-border p-3 text-left transition hover:bg-muted">
                  <CollegeLogo college={c} size={36} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{c.name}</div>
                    <div className="text-xs text-muted-foreground">{c.location}</div>
                  </div>
                  <Plus className="h-4 w-4 text-brand" />
                </button>
              ))}
              {remaining.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">All colleges added.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

type Cell =
  | { type: "text"; text: string }
  | { type: "bar"; value: number; suffix?: string }
  | { type: "best"; text: string };

type Row = { label: string; bold?: boolean; cells: Cell[] };

function buildRows(list: College[]): Row[] {
  const data = list.map((c) => {
    const rs = SEED_REVIEWS.filter((r) => r.collegeSlug === c.slug);
    const avgs = collegeAverages(rs);
    return { college: c, avgs, overall: avgOverall(avgs), recPct: recommendationPct(rs), reviews: rs };
  });

  const rows: Row[] = [
    {
      label: "Overall Rating",
      bold: true,
      cells: data.map((d) => ({ type: "bar", value: d.overall, suffix: `/ 5` })),
    },
    {
      label: "Recommendation %",
      bold: true,
      cells: data.map((d) => ({ type: "bar", value: d.recPct, suffix: "%" })),
    },
    ...CATEGORIES.map(({ key, label }): Row => ({
      label,
      cells: data.map((d) => ({ type: "bar", value: d.avgs[key as Category], suffix: `/ 5` })),
    })),
    {
      label: "Fees",
      cells: data.map((d) => ({ type: "text", text: d.college.tuitionRange })),
    },
    {
      label: "Scholarships",
      cells: data.map((d) => {
        const count = SCHOLARSHIPS.filter((s) => s.collegeSlug === d.college.slug).length;
        return { type: "text", text: count ? `${count} available` : "—" } as Cell;
      }),
    },
    {
      label: "Established",
      cells: data.map((d) => ({ type: "text", text: String(d.college.established) })),
    },
    {
      label: "Affiliations",
      cells: data.map((d) => ({ type: "text", text: d.college.affiliations.join(", ") })),
    },
    {
      label: "Programs",
      cells: data.map((d) => ({ type: "text", text: d.college.programs.join(", ") })),
    },
  ];

  return rows;
}

function BarCell({ value, max, suffix }: { value: number; max: number; suffix?: string }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="w-40">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold">{value.toFixed(1)}{suffix}</span>
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-brand transition-all duration-700" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function BestCell({ cells, index, text }: { cells: Cell[]; index: number; text: string }) {
  const values = cells.filter((c): c is Extract<Cell, { type: "bar" }> => c.type === "bar").map((c) => c.value);
  const max = Math.max(...values);
  const isBest = (cells[index] as Extract<Cell, { type: "bar" }>)?.value === max && max > 0;
  return (
    <span className="inline-flex items-center gap-1">
      {text}
      {isBest && <Check className="h-3.5 w-3.5 text-brand" />}
    </span>
  );
}

void RatingPill;
void Minus;
