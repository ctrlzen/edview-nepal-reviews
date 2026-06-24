import { Link } from "@tanstack/react-router";
import { GraduationCap, BarChart3 } from "lucide-react";

export function Navbar() {
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
          <Link
            to="/analytics"
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
            activeProps={{ className: "text-brand" }}
          >
            <BarChart3 className="h-4 w-4" />
            Analytics
          </Link>
          <NavLink to="/submit">Write a review</NavLink>
        </nav>
        <Link
          to="/submit"
          className="inline-flex h-9 items-center rounded-full bg-foreground px-4 text-sm font-medium text-background transition hover:bg-foreground/90"
        >
          Submit review
        </Link>
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

