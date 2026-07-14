import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bookmark, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { COLLEGES, SEED_REVIEWS, collegeAverages, avgOverall } from "@/lib/edview-data";

export const Route = createFileRoute("/_authenticated/saved")({
  head: () => ({ meta: [{ title: "Saved colleges — EdView" }] }),
  component: SavedPage,
});

function SavedPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const { data: saved = [], isLoading } = useQuery({
    queryKey: ["saved", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("saved_colleges")
        .select("college_slug, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as { college_slug: string; created_at: string }[];
    },
  });

  const remove = useMutation({
    mutationFn: async (slug: string) => {
      if (!user) throw new Error("Must be signed in");
      const { error } = await supabase
        .from("saved_colleges")
        .delete()
        .eq("user_id", user.id)
        .eq("college_slug", slug);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["saved", user?.id] }),
  });

  const items = saved
    .map((s) => COLLEGES.find((c) => c.slug === s.college_slug))
    .filter((c): c is (typeof COLLEGES)[number] => !!c);

  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-brand">
        <Bookmark className="h-3.5 w-3.5" /> Your shortlist
      </div>
      <h1 className="mt-3 text-4xl tracking-tight">
        Saved <span className="font-display italic">colleges.</span>
      </h1>
      <p className="mt-2 text-muted-foreground">
        Colleges you're keeping an eye on. Compare them side by side anytime.
      </p>

      {items.length > 1 && (
        <Link
          to="/compare"
          search={{ slugs: items.map((c) => c.slug).join(",") }}
          className="mt-6 inline-flex h-10 items-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition hover:bg-foreground/90"
        >
          Compare all saved
        </Link>
      )}

      {isLoading ? (
        <div className="mt-8 text-sm text-muted-foreground">Loading…</div>
      ) : items.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-border bg-card p-10 text-center">
          <p className="text-sm text-muted-foreground">No saved colleges yet.</p>
          <Link
            to="/colleges"
            className="mt-4 inline-flex h-10 items-center rounded-full bg-brand px-5 text-sm font-medium text-brand-foreground"
          >
            Browse colleges
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {items.map((c) => {
            const reviews = SEED_REVIEWS.filter((r) => r.collegeSlug === c.slug);
            const overall = avgOverall(collegeAverages(reviews));
            return (
              <div
                key={c.slug}
                className="flex flex-col rounded-3xl border border-border bg-card p-5 shadow-soft"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs text-muted-foreground">{c.location}</div>
                    <Link
                      to="/colleges/$slug"
                      params={{ slug: c.slug }}
                      className="text-lg font-semibold hover:underline"
                    >
                      {c.name}
                    </Link>
                  </div>
                  <button
                    onClick={() => remove.mutate(c.slug)}
                    className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-destructive"
                    aria-label="Remove"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{c.tagline}</p>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Overall</span>
                  <span className="font-semibold">{overall.toFixed(2)} / 5</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
