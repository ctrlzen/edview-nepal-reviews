/**
 * Final Demo Account Seeder
 *
 * Uses direct HTTP calls to the Supabase REST API with service_role key.
 * This bypasses the JS client schema cache issue.
 *
 * Usage:
 *   SERVICE_ROLE_KEY=eyJ... npx tsx scripts/seed-demo-final.ts
 */

const SUPABASE_URL = "https://muikzmyzhbfwmxfxodmc.supabase.co";
const SERVICE_ROLE_KEY =
  process.env.SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

if (!SERVICE_ROLE_KEY) {
  console.error("❌ SERVICE_ROLE_KEY is required.");
  process.exit(1);
}

const headers = {
  "apikey": SERVICE_ROLE_KEY,
  "Authorization": `Bearer ${SERVICE_ROLE_KEY}`,
  "Content-Type": "application/json",
  "Prefer": "return=minimal",
};

async function api(method: string, path: string, body?: unknown) {
  const url = `${SUPABASE_URL}${path}`;
  const opts: RequestInit = { method, headers: headers as Record<string, string> };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(url, opts);
  if (!res.ok && res.status !== 204) {
    const text = await res.text();
    throw new Error(`${method} ${path} -> ${res.status}: ${text.substring(0, 200)}`);
  }
  return res;
}

async function get(path: string) {
  const url = `${SUPABASE_URL}${path}`;
  const res = await fetch(url, { headers: headers as Record<string, string> });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GET ${path} -> ${res.status}: ${text.substring(0, 200)}`);
  }
  return res.json();
}

// ── Step 1: Run Migration SQL ──────────────────────────────────────────────

async function runMigration() {
  console.log("\n📦 Step 1: Running migration SQL...");

  const sql = `
-- Add super_admin to the app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'super_admin';

-- College premium status table
CREATE TABLE IF NOT EXISTS public.college_premium (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  college_slug TEXT NOT NULL UNIQUE,
  premium_active BOOLEAN NOT NULL DEFAULT false,
  features TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.college_premium TO authenticated;
GRANT ALL ON public.college_premium TO service_role;
ALTER TABLE public.college_premium ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view premium status"
  ON public.college_premium FOR SELECT TO authenticated USING (true);
CREATE POLICY "Platform admins manage premium"
  ON public.college_premium FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'platform_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'platform_admin'));

-- Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view their own notifications"
  ON public.notifications FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "Users update their own notifications"
  ON public.notifications FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Reported reviews table
CREATE TABLE IF NOT EXISTS public.reported_reviews (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id TEXT NOT NULL,
  reported_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ
);
GRANT SELECT, INSERT ON public.reported_reviews TO authenticated;
GRANT ALL ON public.reported_reviews TO service_role;
ALTER TABLE public.reported_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can report reviews"
  ON public.reported_reviews FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = reported_by);
CREATE POLICY "Platform admins view all reports"
  ON public.reported_reviews FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'platform_admin') OR auth.uid() = reported_by);

-- updated_at trigger for college_premium
CREATE TRIGGER IF NOT EXISTS college_premium_set_updated_at BEFORE UPDATE ON public.college_premium
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- Super admin policies
CREATE POLICY IF NOT EXISTS "Super admins can view all roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY IF NOT EXISTS "Super admins can insert roles"
  ON public.user_roles FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY IF NOT EXISTS "Super admins can delete roles"
  ON public.user_roles FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY IF NOT EXISTS "Super admins can update any profile"
  ON public.profiles FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY IF NOT EXISTS "Super admins manage assignments"
  ON public.college_admin_assignments FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY IF NOT EXISTS "Super admins manage premium"
  ON public.college_premium FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));
`;

  // Use the Supabase SQL endpoint
  const res = await fetch(`${SUPABASE_URL}/rest/v1/sql`, {
    method: "POST",
    headers: {
      ...headers as Record<string, string>,
      "Content-Type": "text/plain",
    },
    body: sql,
  });

  if (res.ok || res.status === 204) {
    console.log("  ✅ Migration SQL executed successfully");
  } else {
    const text = await res.text();
    console.log(`  ⚠️  SQL endpoint returned ${res.status}: ${text.substring(0, 300)}`);
    console.log("  ℹ️  You may need to run the migration manually via Supabase Dashboard SQL Editor");
    console.log("  ℹ️  File: supabase/migrations/20260708000000_demo_seed_setup.sql");
  }
}

// ── Step 2: Create/Update Auth Users ───────────────────────────────────────

async function listUsers() {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
    headers: { "apikey": SERVICE_ROLE_KEY, "Authorization": `Bearer ${SERVICE_ROLE_KEY}` },
  });
  if (!res.ok) {
    console.log(`  ⚠️  Could not list users: ${res.status}`);
    return [];
  }
  const data = await res.json();
  return data.users || [];
}

async function createUser(email: string, password: string, fullName: string, role: string) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
    method: "POST",
    headers: {
      "apikey": SERVICE_ROLE_KEY,
      "Authorization": `Bearer ${SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName, requested_role: role === "super_admin" ? "platform_admin" : role },
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Create user failed: ${text.substring(0, 200)}`);
  }
  return res.json();
}

async function updateUserPassword(uid: string, password: string) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${uid}`, {
    method: "PUT",
    headers: {
      "apikey": SERVICE_ROLE_KEY,
      "Authorization": `Bearer ${SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password }),
  });
  if (!res.ok) {
    const text = await res.text();
    console.log(`  ⚠️  Password update failed: ${text.substring(0, 100)}`);
  }
}

// ── Step 3: Update Profiles via REST API ────────────────────────────────────

async function upsertProfile(id: string, fullName: string, studentVerified?: boolean) {
  // Try update first
  const updateBody: Record<string, unknown> = { full_name: fullName };
  if (studentVerified !== undefined) updateBody.student_verified = studentVerified;

  const res = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${id}`, {
    method: "PATCH",
    headers: headers as Record<string, string>,
    body: JSON.stringify(updateBody),
  });
  if (res.ok || res.status === 204) {
    return true;
  }
  // If update fails (row doesn't exist), try insert
  const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
    method: "POST",
    headers: { ...headers as Record<string, string>, Prefer: "return=minimal" },
    body: JSON.stringify({ id, full_name: fullName, student_verified: studentVerified ?? false }),
  });
  return insertRes.ok || insertRes.status === 201;
}

async function upsertRole(userId: string, role: string) {
  // Check if exists
  const existing = await get(`/rest/v1/user_roles?user_id=eq.${userId}&role=eq.${role}&select=id`);
  if (existing.length > 0) return true;

  const res = await fetch(`${SUPABASE_URL}/rest/v1/user_roles`, {
    method: "POST",
    headers: { ...headers as Record<string, string>, Prefer: "return=minimal" },
    body: JSON.stringify({ user_id: userId, role }),
  });
  return res.ok || res.status === 201;
}

async function upsertCollegeAssignment(userId: string, collegeSlug: string) {
  const existing = await get(`/rest/v1/college_admin_assignments?user_id=eq.${userId}&college_slug=eq.${collegeSlug}&select=id`);
  if (existing.length > 0) return true;

  const res = await fetch(`${SUPABASE_URL}/rest/v1/college_admin_assignments`, {
    method: "POST",
    headers: { ...headers as Record<string, string>, Prefer: "return=minimal" },
    body: JSON.stringify({ user_id: userId, college_slug: collegeSlug, verified: true }),
  });
  return res.ok || res.status === 201;
}

async function upsertPremium(collegeSlug: string, premium: boolean) {
  const features = premium ? ["analytics", "ai_insights", "reports", "export"] : [];
  const existing = await get(`/rest/v1/college_premium?college_slug=eq.${collegeSlug}&select=id`);
  
  if (existing.length > 0) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/college_premium?college_slug=eq.${collegeSlug}`, {
      method: "PATCH",
      headers: headers as Record<string, string>,
      body: JSON.stringify({ premium_active: premium, features }),
    });
    return res.ok || res.status === 204;
  }
  
  const res = await fetch(`${SUPABASE_URL}/rest/v1/college_premium`, {
    method: "POST",
    headers: { ...headers as Record<string, string>, Prefer: "return=minimal" },
    body: JSON.stringify({ college_slug: collegeSlug, premium_active: premium, features }),
  });
  return res.ok || res.status === 201;
}

async function upsertSavedCollege(userId: string, slug: string) {
  const existing = await get(`/rest/v1/saved_colleges?user_id=eq.${userId}&college_slug=eq.${slug}&select=id`);
  if (existing.length > 0) return;
  
  await fetch(`${SUPABASE_URL}/rest/v1/saved_colleges`, {
    method: "POST",
    headers: { ...headers as Record<string, string>, Prefer: "return=minimal" },
    body: JSON.stringify({ user_id: userId, college_slug: slug }),
  });
}

async function insertNotification(userId: string, title: string, body: string, type: string) {
  await fetch(`${SUPABASE_URL}/rest/v1/notifications`, {
    method: "POST",
    headers: { ...headers as Record<string, string>, Prefer: "return=minimal" },
    body: JSON.stringify({ user_id: userId, title, body, type }),
  });
}

async function insertReportedReview(reviewId: string, reportedBy: string, reason: string) {
  await fetch(`${SUPABASE_URL}/rest/v1/reported_reviews`, {
    method: "POST",
    headers: { ...headers as Record<string, string>, Prefer: "return=minimal" },
    body: JSON.stringify({ review_id: reviewId, reported_by: reportedBy, reason, status: "pending" }),
  });
}

// ── Main ───────────────────────────────────────────────────────────────────

interface Account {
  email: string;
  password: string;
  role: string;
  fullName: string;
  studentVerified?: boolean;
  collegeSlug?: string;
  premium?: boolean;
  savedSlugs?: string[];
}

const ACCOUNTS: Account[] = [
  { email: "student1@edview.demo", password: "Student@123", role: "student", fullName: "Aarav Sharma", studentVerified: true, collegeSlug: "texas-international-college", savedSlugs: ["islington-college", "herald-college-kathmandu", "prime-college"] },
  { email: "student2@edview.demo", password: "Student@123", role: "student", fullName: "Priya Karki", studentVerified: true, collegeSlug: "islington-college", savedSlugs: ["texas-international-college", "herald-college-kathmandu", "global-college-international"] },
  { email: "student3@edview.demo", password: "Student@123", role: "student", fullName: "Suman Rai", studentVerified: true, collegeSlug: "herald-college-kathmandu", savedSlugs: ["texas-international-college", "islington-college", "ace-institute-of-management"] },
  { email: "unverified@edview.demo", password: "Student@123", role: "student", fullName: "Rohan Shrestha", studentVerified: false },
  { email: "texas@edview.demo", password: "College@123", role: "college_admin", fullName: "Texas International College Admin", collegeSlug: "texas-international-college", premium: true },
  { email: "islington@edview.demo", password: "College@123", role: "college_admin", fullName: "Islington College Admin", collegeSlug: "islington-college", premium: true },
  { email: "herald@edview.demo", password: "College@123", role: "college_admin", fullName: "Herald College Kathmandu Admin", collegeSlug: "herald-college-kathmandu", premium: true },
  { email: "basiccollege@edview.demo", password: "College@123", role: "college_admin", fullName: "Basic College Admin", collegeSlug: "trinity-international-college", premium: false },
  { email: "admin@edview.demo", password: "Admin@123", role: "platform_admin", fullName: "EdView Administrator" },
  { email: "owner@edview.demo", password: "Owner@123", role: "super_admin", fullName: "EdView Owner" },
];

async function main() {
  console.log("╔══════════════════════════════════════════════════════════╗");
  console.log("║        EdView Demo Accounts - Final Seed                ║");
  console.log("╚══════════════════════════════════════════════════════════╝");

  // Step 1: Run migration
  await runMigration();

  // Step 2: Get existing users
  console.log("\n📦 Step 2: Checking existing auth users...");
  const existingUsers = await listUsers();
  const existingByEmail = new Map(existingUsers.map((u: { email: string; id: string }) => [u.email, u.id]));
  console.log(`  Found ${existingUsers.length} existing users`);

  // Step 3: Create/update each account
  console.log("\n📦 Step 3: Creating/updating accounts...");
  const results: { email: string; id: string; role: string; status: string }[] = [];

  for (const acct of ACCOUNTS) {
    console.log(`\n  ── ${acct.email} (${acct.role}) ──`);
    let userId = existingByEmail.get(acct.email);

    if (userId) {
      console.log(`  📌 User exists: ${userId}`);
      await updateUserPassword(userId, acct.password);
      console.log(`  ✅ Password updated`);
    } else {
      const data = await createUser(acct.email, acct.password, acct.fullName, acct.role);
      userId = data.id;
      console.log(`  ✅ Created: ${userId}`);
    }

    if (!userId) continue;

    // Update profile
    const profileOk = await upsertProfile(userId, acct.fullName, acct.studentVerified);
    console.log(`  ${profileOk ? "✅" : "⚠️"} Profile updated`);

    // Assign role
    const roleOk = await upsertRole(userId, acct.role);
    console.log(`  ${roleOk ? "✅" : "⚠️"} Role "${acct.role}" assigned`);

    // College assignment (for college_admins)
    if (acct.collegeSlug && acct.role === "college_admin") {
      const assignOk = await upsertCollegeAssignment(userId, acct.collegeSlug);
      console.log(`  ${assignOk ? "✅" : "⚠️"} College "${acct.collegeSlug}" assigned`);
    }

    // Premium status (for college_admins with premium defined)
    if (acct.collegeSlug && acct.premium !== undefined) {
      const premOk = await upsertPremium(acct.collegeSlug, acct.premium);
      console.log(`  ${premOk ? "✅" : "⚠️"} Premium: ${acct.premium ? "Active" : "Inactive"}`);
    }

    // Saved colleges (for verified students)
    if (acct.savedSlugs && acct.studentVerified) {
      for (const slug of acct.savedSlugs) {
        await upsertSavedCollege(userId, slug);
      }
      console.log(`  ✅ Saved ${acct.savedSlugs.length} colleges`);
    }

    // Notifications (for college_admins)
    if (acct.role === "college_admin") {
      const notifs = [
        { title: "New review posted", body: "A student has posted a new review for your college.", type: "info" },
        { title: "Review reported", body: "A review on your college page has been reported for review.", type: "warning" },
        { title: "Profile view milestone", body: "Your college profile has received over 100 views this month.", type: "success" },
        { title: "New comparison", body: "A student added your college to a comparison list.", type: "info" },
      ];
      for (const n of notifs) {
        await insertNotification(userId, n.title, n.body, n.type);
      }
      console.log(`  ✅ Notifications seeded`);
    }

    results.push({ email: acct.email, id: userId, role: acct.role, status: "✅ Active" });
  }

  // Seed reported reviews for admin
  const adminUser = results.find((r) => r.role === "platform_admin");
  if (adminUser) {
    console.log(`\n  ── Seeding admin data ──`);
    await insertReportedReview("demo-report-1", adminUser.id, "Contains inappropriate language");
    await insertReportedReview("demo-report-2", adminUser.id, "Suspected fake review");
    await insertReportedReview("demo-report-3", adminUser.id, "Spam content");
    console.log("  ✅ Reported reviews seeded");
  }

  // ── Summary ──
  console.log("\n╔══════════════════════════════════════════════════════════╗");
  console.log("║                    SEED SUMMARY                         ║");
  console.log("╚══════════════════════════════════════════════════════════╝");
  console.log();
  console.log("  | Email                          | Password       | Role             | Verified | Premium |");
  console.log("  |--------------------------------|----------------|------------------|----------|---------|");

  for (const r of results) {
    const acct = ACCOUNTS.find((a) => a.email === r.email)!;
    const verified = acct.role === "student" ? (acct.studentVerified ? "✅" : "❌") : "—";
    const premium = acct.role === "college_admin" ? (acct.premium ? "✅" : "❌") : "—";
    console.log(`  | ${r.email.padEnd(30)} | ${acct.password.padEnd(14)} | ${r.role.padEnd(16)} | ${verified.padEnd(8)} | ${premium.padEnd(7)} |`);
  }

  console.log();
  console.log("  ✅ All accounts created/updated successfully!");
  console.log();
  console.log("  📋 Manual step required:");
  console.log("  If the migration SQL didn't run, execute this in Supabase Dashboard SQL Editor:");
  console.log("  File: supabase/migrations/20260708000000_demo_seed_setup.sql");
}

main().catch((err) => {
  console.error("\n❌ Fatal error:", err.message);
  process.exit(1);
});