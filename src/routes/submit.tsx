import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Check, PenLine, ShieldCheck, LogIn } from "lucide-react";
import { COLLEGES, CATEGORIES, type Category, type Review } from "@/lib/edview-data";
import { useReviews } from "@/lib/edview-store";
import { useAuth } from "@/lib/auth-context";

const searchSchema = z.object({ college: z.string().optional() });

export const Route = createFileRoute("/submit")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Write a review — EdView" },
      { name: "description", content: "Share your honest experience to help future students." },
    ],
  }),
  component: SubmitPage,
});

const emptyRatings: Record<Category, number> = {
  academics: 0, teachers: 0, facilities: 0, studentLife: 0, careerSupport: 0, valueForMoney: 0,
};

function SubmitPage() {
  const { college: preset } = Route.useSearch();
  const navigate = useNavigate();
  const { addReview } = useReviews();
  const { isAuthenticated, profile, loading, primaryRole } = useAuth();

  const [slug, setSlug] = useState(preset ?? COLLEGES[0].slug);
  const [author, setAuthor] = useState("");
  const [program, setProgram] = useState("");
  const [year, setYear] = useState("2024");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [ratings, setRatings] = useState({ ...emptyRatings });
  const [submitted, setSubmitted] = useState(false);

  if (loading) return <div className="mx-auto max-w-md px-6 py-32 text-center text-sm text-muted-foreground">Loading…</div>;

  if (!isAuthenticated) {
    return (
      <Gate
        title="Sign in to write a review"
        desc="Reviews on EdView are tied to verified student accounts so future students can trust what they read."
        cta={<Link to="/auth" search={{ mode: "signin", redirect: "/submit" }} className="inline-flex h-11 items-center gap-2 rounded-full bg-foreground px-6 text-sm font-medium text-background"><LogIn className="h-4 w-4" /> Sign in to continue</Link>}
      />
    );
  }

  if (primaryRole !== "student" && primaryRole !== "platform_admin") {
    return <Gate title="Only students can write reviews" desc="Your account is registered as a college admin. Switch to a student account to submit a review." />;
  }

  if (!profile?.student_verified && primaryRole !== "platform_admin") {
    return (
      <Gate
        title="Your account is pending verification"
        desc="A platform admin needs to verify your student status before you can post reviews. This usually takes a day."
        cta={<div className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-4 py-2 text-sm font-medium text-brand"><ShieldCheck className="h-4 w-4" /> Verification pending</div>}
      />
    );
  }


  const valid =
    author.trim() && program.trim() && title.trim() && body.trim().length >= 30 &&
    Object.values(ratings).every((v) => v > 0);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) return;
    const review: Review = {
      id: `r-${Date.now()}`,
      collegeSlug: slug,
      author: author.trim(),
      program: program.trim(),
      year,
      title: title.trim(),
      body: body.trim(),
      date: new Date().toISOString().slice(0, 10),
      ratings,
      helpful: 0,
      notHelpful: 0,
    };
    addReview(review);
    setSubmitted(true);
    setTimeout(() => navigate({ to: "/colleges/$slug", params: { slug } }), 900);
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-md px-6 py-32 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand text-brand-foreground">
          <Check className="h-7 w-7" />
        </div>
        <h1 className="mt-6 text-2xl font-semibold">Review submitted</h1>
        <p className="mt-2 text-sm text-muted-foreground">Thanks for helping the next student decide.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-brand">
        <PenLine className="h-3.5 w-3.5" /> New review
      </div>
      <h1 className="mt-3 text-4xl tracking-tight">
        Tell us about your <span className="font-display italic">college experience.</span>
      </h1>
      <p className="mt-2 max-w-xl text-muted-foreground">
        Be specific. The most useful reviews mention courses, professors and real examples.
      </p>

      <form onSubmit={submit} className="mt-10 space-y-6 rounded-3xl border border-border bg-card p-8 shadow-soft">
        <Field label="College">
          <select
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-brand"
          >
            {COLLEGES.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Your name"><Input value={author} onChange={setAuthor} placeholder="e.g. Riya M." /></Field>
          <Field label="Program"><Input value={program} onChange={setProgram} placeholder="e.g. BBA, +2 Science" /></Field>
        </div>

        <Field label="Graduation year">
          <select
            value={year} onChange={(e) => setYear(e.target.value)}
            className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-brand"
          >
            {["2020","2021","2022","2023","2024","2025","2026","2027"].map((y) => <option key={y}>{y}</option>)}
          </select>
        </Field>

        <div>
          <h3 className="mb-3 text-sm font-semibold">Rate by category</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {CATEGORIES.map(({ key, label }) => (
              <RatingPicker
                key={key}
                label={label}
                value={ratings[key as Category]}
                onChange={(v) => setRatings({ ...ratings, [key]: v })}
              />
            ))}
          </div>
        </div>

        <Field label="Review title"><Input value={title} onChange={setTitle} placeholder="Sum it up in one line" /></Field>

        <Field label="Your review" hint={`${body.length} / 30 min`}>
          <textarea
            value={body} onChange={(e) => setBody(e.target.value)} rows={6}
            placeholder="Share specifics — what worked, what didn't, who you'd recommend it to."
            className="w-full resize-none rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-brand"
          />
        </Field>

        <div className="flex items-center justify-between border-t border-border pt-6">
          <p className="text-xs text-muted-foreground">By submitting you agree to keep it honest and respectful.</p>
          <button
            type="submit" disabled={!valid}
            className="inline-flex h-11 items-center rounded-full bg-foreground px-6 text-sm font-medium text-background transition hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Submit review
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </label>
  );
}

function Input({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-brand"
    />
  );
}

function RatingPicker({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="rounded-xl border border-border bg-background p-3">
      <div className="flex items-center justify-between">
        <span className="text-sm">{label}</span>
        <span className="text-xs font-semibold text-muted-foreground">{value || "—"}/5</span>
      </div>
      <div className="mt-2 flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n} type="button" onClick={() => onChange(n)}
            className={`h-8 flex-1 rounded-lg text-xs font-semibold transition ${
              n <= value ? "bg-brand text-brand-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70"
            }`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}
