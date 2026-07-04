import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { GraduationCap, Building2, ShieldCheck, Loader as Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, type AppRole } from "@/lib/auth-context";

const searchSchema = z.object({ redirect: z.string().optional(), mode: z.enum(["signin", "signup"]).optional() });

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Sign in — EdView" },
      { name: "description", content: "Sign in or create an EdView account to review, save and compare Kathmandu colleges." },
    ],
  }),
  component: AuthPage,
});

type SignupRole = Extract<AppRole, "student" | "college_admin">;

function AuthPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">(search.mode ?? "signin");
  const [role, setRole] = useState<SignupRole>("student");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate({ to: search.redirect ?? "/dashboard", replace: true });
    }
  }, [loading, isAuthenticated, navigate, search.redirect]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: fullName.trim(), requested_role: role },
          },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto grid min-h-[calc(100vh-8rem)] max-w-6xl grid-cols-1 gap-10 px-6 py-14 md:grid-cols-2 md:items-center">
      <div className="hidden md:block">
        <div className="text-xs font-semibold uppercase tracking-widest text-brand">Welcome to EdView</div>
        <h1 className="mt-3 text-5xl leading-[1.05] tracking-tight">
          Honest, student-first <span className="font-display italic">college reviews.</span>
        </h1>
        <p className="mt-4 max-w-md text-muted-foreground">
          Sign in to save colleges, compare shortlists, and share your experience with the next generation of students.
        </p>
        <ul className="mt-8 space-y-3 text-sm">
          <PerkRow icon={<GraduationCap className="h-4 w-4" />} title="Student" desc="Save colleges, compare and write reviews." />
          <PerkRow icon={<Building2 className="h-4 w-4" />} title="College Admin" desc="Access a premium analytics dashboard." />
          <PerkRow icon={<ShieldCheck className="h-4 w-4" />} title="Platform Admin" desc="Verify accounts and moderate reviews." />
        </ul>
      </div>

      <div className="rounded-3xl border border-border bg-card p-8 shadow-soft">
        <div className="flex gap-1 rounded-full bg-muted p-1 text-sm">
          <button
            type="button"
            onClick={() => setMode("signin")}
            className={`flex-1 rounded-full px-4 py-2 font-medium transition ${mode === "signin" ? "bg-background text-foreground shadow-soft" : "text-muted-foreground"}`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`flex-1 rounded-full px-4 py-2 font-medium transition ${mode === "signup" ? "bg-background text-foreground shadow-soft" : "text-muted-foreground"}`}
          >
            Create account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {mode === "signup" && (
            <>
              <div>
                <div className="mb-2 text-sm font-medium">I am a…</div>
                <div className="grid grid-cols-2 gap-2">
                  <RoleCard
                    active={role === "student"}
                    onClick={() => setRole("student")}
                    icon={<GraduationCap className="h-4 w-4" />}
                    title="Student"
                    desc="Save, compare, review"
                  />
                  <RoleCard
                    active={role === "college_admin"}
                    onClick={() => setRole("college_admin")}
                    icon={<Building2 className="h-4 w-4" />}
                    title="College Admin"
                    desc="Premium dashboard"
                  />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Platform Admin roles are granted manually by the EdView team.
                </p>
              </div>
              <Labelled label="Full name">
                <TextInput value={fullName} onChange={setFullName} placeholder="Riya Maharjan" required />
              </Labelled>
            </>
          )}
          <Labelled label="Email">
            <TextInput value={email} onChange={setEmail} type="email" placeholder="you@example.com" required />
          </Labelled>
          <Labelled label="Password">
            <TextInput value={password} onChange={setPassword} type="password" placeholder="At least 8 characters" minLength={8} required />
          </Labelled>

          {error && (
            <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-foreground text-sm font-medium text-background transition hover:bg-foreground/90 disabled:opacity-50"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === "signup" ? "Create account" : "Sign in"}
          </button>

          <p className="text-center text-xs text-muted-foreground">
            {mode === "signup" ? "Already have an account? " : "Don't have an account? "}
            <button
              type="button"
              onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              {mode === "signup" ? "Sign in" : "Create one"}
            </button>
          </p>
          <p className="text-center text-xs text-muted-foreground">
            <Link to="/" className="hover:text-foreground">← Back to home</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

function PerkRow({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <li className="flex items-start gap-3 rounded-2xl border border-border bg-card/40 p-3">
      <span className="mt-0.5 grid h-7 w-7 place-items-center rounded-lg bg-brand/10 text-brand">{icon}</span>
      <div>
        <div className="text-sm font-semibold">{title}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
    </li>
  );
}

function RoleCard({ active, onClick, icon, title, desc }: { active: boolean; onClick: () => void; icon: React.ReactNode; title: string; desc: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-start gap-1 rounded-2xl border p-3 text-left transition ${
        active ? "border-brand bg-brand/5" : "border-border hover:bg-muted/60"
      }`}
    >
      <span className={`grid h-7 w-7 place-items-center rounded-lg ${active ? "bg-brand text-brand-foreground" : "bg-muted"}`}>{icon}</span>
      <span className="mt-1 text-sm font-semibold">{title}</span>
      <span className="text-xs text-muted-foreground">{desc}</span>
    </button>
  );
}

function Labelled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1.5 text-sm font-medium">{label}</div>
      {children}
    </label>
  );
}

function TextInput(props: {
  value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; required?: boolean; minLength?: number;
}) {
  return (
    <input
      value={props.value}
      onChange={(e) => props.onChange(e.target.value)}
      type={props.type ?? "text"}
      placeholder={props.placeholder}
      required={props.required}
      minLength={props.minLength}
      className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-brand"
    />
  );
}
