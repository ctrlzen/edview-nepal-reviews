import { Link, useNavigate } from "@tanstack/react-router";
import { GraduationCap, LogOut, Bookmark, ShieldCheck, Building2, User as UserIcon } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";

export function Navbar() {
  const { isAuthenticated, profile, primaryRole, hasRole, signOut, user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, []);

  async function handleSignOut() {
    await signOut();
    setOpen(false);
    navigate({ to: "/", replace: true });
  }

  const displayName = profile?.full_name ?? user?.email ?? "Account";
  const initials = (displayName ?? "?").slice(0, 1).toUpperCase();

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-brand-foreground shadow-soft">
            <GraduationCap className="h-5 w-5" />
          </span>
          <span className="text-lg font-semibold tracking-tight">
            Ed<span className="font-display italic text-brand">View</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          <NavLink to="/colleges">Colleges</NavLink>
          <NavLink to="/analytics">Analytics</NavLink>
          {isAuthenticated && hasRole("student") && <NavLink to="/saved">Saved</NavLink>}
          {isAuthenticated && hasRole("college_admin") && <NavLink to="/college-admin">Dashboard</NavLink>}
          {isAuthenticated && hasRole("platform_admin") && <NavLink to="/admin">Admin</NavLink>}
          <NavLink to="/submit">Write a review</NavLink>
        </nav>

        {isAuthenticated ? (
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setOpen((o) => !o)}
              className="flex items-center gap-2 rounded-full border border-border bg-background px-2 py-1.5 pr-3 text-sm hover:bg-muted"
            >
              <span className="grid h-7 w-7 place-items-center rounded-full bg-brand text-brand-foreground text-xs font-semibold">{initials}</span>
              <span className="hidden max-w-[10rem] truncate text-xs font-medium sm:inline">{displayName}</span>
            </button>
            {open && (
              <div className="absolute right-0 mt-2 w-60 rounded-2xl border border-border bg-background p-2 shadow-soft">
                <div className="border-b border-border px-3 py-2">
                  <div className="truncate text-sm font-semibold">{displayName}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground capitalize">{primaryRole?.replace("_", " ") ?? "Guest"}</div>
                </div>
                {hasRole("student") && (
                  <MenuLink to="/saved" onClick={() => setOpen(false)} icon={<Bookmark className="h-4 w-4" />}>Saved colleges</MenuLink>
                )}
                {hasRole("college_admin") && (
                  <MenuLink to="/college-admin" onClick={() => setOpen(false)} icon={<Building2 className="h-4 w-4" />}>College dashboard</MenuLink>
                )}
                {hasRole("platform_admin") && (
                  <MenuLink to="/admin" onClick={() => setOpen(false)} icon={<ShieldCheck className="h-4 w-4" />}>Admin console</MenuLink>
                )}
                <button
                  onClick={handleSignOut}
                  className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/auth"
              search={{ mode: "signin" }}
              className="inline-flex h-9 items-center gap-1 rounded-full border border-border px-4 text-sm font-medium hover:bg-muted"
            >
              <UserIcon className="h-4 w-4" /> Sign in
            </Link>
            <Link
              to="/auth"
              search={{ mode: "signup" }}
              className="inline-flex h-9 items-center rounded-full bg-foreground px-4 text-sm font-medium text-background transition hover:bg-foreground/90"
            >
              Get started
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
      activeProps={{ className: "rounded-full px-3.5 py-2 text-sm font-medium bg-muted text-foreground" }}
    >
      {children}
    </Link>
  );
}

function MenuLink({ to, onClick, icon, children }: { to: string; onClick: () => void; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <Link to={to} onClick={onClick} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted">
      {icon}{children}
    </Link>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-muted/40">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-10 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand text-brand-foreground">
            <GraduationCap className="h-4 w-4" />
          </span>
          <span className="font-medium text-foreground">EdView</span>
          <span>— Honest college reviews for Kathmandu.</span>
        </div>
        <span>© {new Date().getFullYear()} EdView. Built by students, for students.</span>
      </div>
    </footer>
  );
}
