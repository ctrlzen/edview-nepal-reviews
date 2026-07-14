import { useState } from "react";
import { Link, Outlet, useRouterState, redirect } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { LayoutDashboard, ChartBar as BarChart3, MessageSquare, Sparkles, FileText, Settings, Bell, Crown, Building2, Menu, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { COLLEGES, SEED_REVIEWS } from "@/lib/edview-data";
import { generateNotifications } from "@/lib/premium-analytics";
import { cn } from "@/lib/utils";

export const PREMIUM_NAV = [
  { to: "/premium", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/premium/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/premium/reviews", label: "Reviews", icon: MessageSquare },
  { to: "/premium/topics", label: "AI Topics", icon: Sparkles },
  { to: "/premium/report", label: "Monthly Report", icon: FileText },
  { to: "/premium/profile", label: "Profile", icon: Settings },
];

export function usePremiumCollege() {
  const { user, hasRole } = useAuth();

  const { data: assignments = [], isLoading } = useQuery({
    queryKey: ["premium-college-assignments", user?.id],
    enabled: !!user && hasRole("college_admin"),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("college_admin_assignments")
        .select("college_slug, verified")
        .eq("user_id", user!.id);
      if (error) throw error;
      return data as { college_slug: string; verified: boolean }[];
    },
  });

  const collegeSlug = assignments[0]?.college_slug;
  const college = COLLEGES.find((c) => c.slug === collegeSlug);
  const reviews = SEED_REVIEWS.filter((r) => r.collegeSlug === collegeSlug);
  const isPremium = assignments[0]?.verified ?? false;

  return { college, reviews, isLoading, isPremium, assignments };
}

export function PremiumLayout() {
  const { loading, hasRole } = useAuth();
  const { college, reviews, isLoading: assignmentsLoading, isPremium } = usePremiumCollege();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (loading || assignmentsLoading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="skeleton h-8 w-64 rounded-lg" />
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="skeleton h-28 rounded-3xl" />
          <div className="skeleton h-28 rounded-3xl" />
          <div className="skeleton h-28 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!hasRole("college_admin")) {
    return <UpgradePage reason="role" />;
  }

  if (!isPremium) {
    return <UpgradePage reason="premium" />;
  }

  if (!college) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand/10 text-brand">
          <Building2 className="h-6 w-6" />
        </div>
        <h2 className="mt-4 text-2xl">Awaiting college assignment</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Your account is being verified. Once a Platform Admin links you to a college, its analytics will appear here.
        </p>
      </div>
    );
  }

  const notifications = generateNotifications(reviews, college.name);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
      <div className="flex gap-6">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 shrink-0 overflow-y-auto border-r border-border bg-card p-4 transition-transform md:sticky md:top-20 md:z-0 md:h-[calc(100vh-6rem)] md:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand/10 text-brand">
                <Crown className="h-4.5 w-4.5" />
              </div>
              <div>
                <div className="text-sm font-semibold">Premium</div>
                <div className="text-xs text-muted-foreground">College Dashboard</div>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden">
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>

          <nav className="space-y-1">
            {PREMIUM_NAV.map((item) => {
              const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-brand text-brand-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-6 rounded-2xl border border-border bg-muted/40 p-4">
            <div className="text-xs font-semibold text-foreground">{college.name}</div>
            <div className="mt-1 text-xs text-muted-foreground">{college.location}</div>
            <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-brand/10 px-2 py-0.5 text-xs font-medium text-brand">
              <Crown className="h-3 w-3" /> Premium Active
            </div>
          </div>
        </aside>

        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <div className="min-w-0 flex-1">
          {/* Mobile header */}
          <div className="mb-4 flex items-center justify-between md:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-card"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">Premium</span>
            </div>
            <div className="relative">
              <button
                onClick={() => setNotOpen(!notifOpen)}
                className="relative grid h-10 w-10 place-items-center rounded-xl border border-border bg-card"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-destructive text-[10px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>
              {notifOpen && <NotifDropdown notifications={notifications} onClose={() => setNotOpen(false)} />}
            </div>
          </div>

          {/* Desktop notifications */}
          <div className="mb-4 hidden justify-end md:flex">
            <div className="relative">
              <button
                onClick={() => setNotOpen(!notifOpen)}
                className="relative grid h-10 w-10 place-items-center rounded-xl border border-border bg-card transition-colors hover:bg-muted"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-destructive text-[10px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>
              {notifOpen && <NotifDropdown notifications={notifications} onClose={() => setNotOpen(false)} />}
            </div>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  );
}

function NotifDropdown({
  notifications,
  onClose,
}: {
  notifications: ReturnType<typeof generateNotifications>;
  onClose: () => void;
}) {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 top-12 z-50 w-80 rounded-2xl border border-border bg-card p-2 shadow-elevated">
        <div className="px-3 py-2 text-sm font-semibold">Notifications</div>
        <div className="max-h-80 space-y-1 overflow-y-auto">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={cn(
                "rounded-xl p-3 transition-colors hover:bg-muted",
                !n.read && "bg-brand/5",
              )}
            >
              <div className="flex items-start gap-2">
                <NotifIcon type={n.type} />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium">{n.title}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{n.message}</div>
                </div>
                {!n.read && <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function NotifIcon({ type }: { type: string }) {
  const cls = "h-4 w-4 shrink-0 mt-0.5";
  if (type === "new_review") return <MessageSquare className={cn(cls, "text-blue-500")} />;
  if (type === "rating_up") return <BarChart3 className={cn(cls, "text-green-500")} />;
  if (type === "rating_down") return <BarChart3 className={cn(cls, "text-destructive")} />;
  if (type === "report_ready") return <FileText className={cn(cls, "text-brand")} />;
  if (type === "renewal") return <Crown className={cn(cls, "text-amber-500")} />;
  return <Bell className={cls} />;
}

export function UpgradePage({ reason }: { reason: "role" | "premium" }) {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <div className="rounded-3xl border border-border bg-card p-10 text-center shadow-soft">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand/10 text-brand">
          <Crown className="h-7 w-7" />
        </div>
        <h2 className="mt-5 text-3xl tracking-tight">
          Premium <span className="font-display italic text-brand">College Dashboard</span>
        </h2>
        {reason === "role" ? (
          <p className="mt-3 max-w-md mx-auto text-sm text-muted-foreground">
            This dashboard is reserved for verified College Admin accounts. If you represent a college,
            create an account with the College Admin role and our team will verify you shortly.
          </p>
        ) : (
          <p className="mt-3 max-w-md mx-auto text-sm text-muted-foreground">
            Your college isn't on a Premium plan yet. Upgrade to unlock AI insights, advanced analytics,
            review management, topic analysis, and downloadable monthly reports.
          </p>
        )}

        <div className="mt-8 grid gap-3 text-left sm:grid-cols-2">
          {[
            { icon: BarChart3, title: "Advanced Analytics", desc: "Rating trends, sentiment analysis, review growth charts" },
            { icon: Sparkles, title: "AI Insights", desc: "Auto-generated summaries, strengths, concerns, improvements" },
            { icon: MessageSquare, title: "Review Management", desc: "Search, filter, sort and monitor all student reviews" },
            { icon: FileText, title: "Monthly Reports", desc: "Downloadable PDF and CSV reports with full metrics" },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border border-border bg-muted/30 p-4">
              <f.icon className="h-5 w-5 text-brand" />
              <div className="mt-2 text-sm font-semibold">{f.title}</div>
              <div className="mt-1 text-xs text-muted-foreground">{f.desc}</div>
            </div>
          ))}
        </div>

        <button className="mt-8 inline-flex h-12 items-center rounded-full bg-brand px-8 text-sm font-semibold text-brand-foreground transition-transform hover:scale-105">
          {reason === "role" ? "Apply for College Admin" : "Upgrade to Premium"}
        </button>
      </div>
    </div>
  );
}

export function PremiumPageShell({ children }: { children: React.ReactNode }) {
  return <div className="animate-fade-in-up">{children}</div>;
}

export function PremiumKpi({
  label,
  value,
  suffix,
  icon,
  delay = 0,
  children,
}: {
  label: string;
  value: number;
  suffix?: string;
  icon: React.ReactNode;
  delay?: number;
  children?: React.ReactNode;
}) {
  return (
    <div
      className="rounded-3xl border border-border bg-card p-5 shadow-soft transition-transform hover:-translate-y-0.5"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span className="grid h-7 w-7 place-items-center rounded-full bg-brand/10 text-brand">{icon}</span>
      </div>
      {children ?? (
        <div className="mt-2 text-3xl font-semibold tracking-tight">
          {value.toLocaleString()}{suffix}
        </div>
      )}
    </div>
  );
}

export function PremiumCard({
  title,
  children,
  className,
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-3xl border border-border bg-card p-6 shadow-soft", className)}>
      {title && <h3 className="text-sm font-semibold">{title}</h3>}
      <div className={title ? "mt-4" : ""}>{children}</div>
    </div>
  );
}

export function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-card p-10 text-center">
      <p className="text-sm font-medium">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground">{message}</p>
    </div>
  );
}

// Re-export redirect for route files
export { redirect };
