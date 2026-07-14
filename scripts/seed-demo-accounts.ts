/**
 * Seed Demo Accounts Script
 *
 * Creates all demo accounts for development and investor demonstrations.
 * Uses the Supabase Admin API (service_role key) to create users.
 *
 * Usage:
 *   SERVICE_ROLE_KEY=eyJ... bun run scripts/seed-demo-accounts.ts
 *
 * Or set SUPABASE_SERVICE_ROLE_KEY in your environment.
 *
 * IMPORTANT: Never commit the service_role key to the repository.
 */

import { createClient } from "@supabase/supabase-js";

// ── Configuration ──────────────────────────────────────────────────────────

const SUPABASE_URL =
  process.env.VITE_SUPABASE_URL ?? "https://muikzmyzhbfwmxfxodmc.supabase.co";

const SERVICE_ROLE_KEY =
  process.env.SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

if (!SERVICE_ROLE_KEY) {
  console.error(
    "❌ SERVICE_ROLE_KEY is required. Set it via environment variable."
  );
  console.error(
    "   SERVICE_ROLE_KEY=eyJ... bun run scripts/seed-demo-accounts.ts"
  );
  process.exit(1);
}

// Create admin client (bypasses RLS)
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// ── Demo Account Definitions ───────────────────────────────────────────────

type DemoAccount = {
  email: string;
  password: string;
  role: "student" | "college_admin" | "platform_admin" | "super_admin";
  fullName: string;
  studentVerified?: boolean;
  collegeSlug?: string;
  premium?: boolean;
  program?: string;
  admissionYear?: string;
  graduationYear?: string;
};

const DEMO_ACCOUNTS: DemoAccount[] = [
  // ── Verified Students ──
  {
    email: "student1@edview.demo",
    password: "Student@123",
    role: "student",
    fullName: "Aarav Sharma",
    studentVerified: true,
    collegeSlug: "texas-international-college",
    program: "BCA",
    admissionYear: "2023",
    graduationYear: "2027",
  },
  {
    email: "student2@edview.demo",
    password: "Student@123",
    role: "student",
    fullName: "Priya Karki",
    studentVerified: true,
    collegeSlug: "islington-college",
    program: "BSc Computing",
    admissionYear: "2022",
    graduationYear: "2026",
  },
  {
    email: "student3@edview.demo",
    password: "Student@123",
    role: "student",
    fullName: "Suman Rai",
    studentVerified: true,
    collegeSlug: "herald-college-kathmandu",
    program: "BIT",
    admissionYear: "2024",
    graduationYear: "2028",
  },
  // ── Unverified Student ──
  {
    email: "unverified@edview.demo",
    password: "Student@123",
    role: "student",
    fullName: "Rohan Shrestha",
    studentVerified: false,
  },
  // ── Premium College Admins ──
  {
    email: "texas@edview.demo",
    password: "College@123",
    role: "college_admin",
    fullName: "Texas International College Admin",
    collegeSlug: "texas-international-college",
    premium: true,
  },
  {
    email: "islington@edview.demo",
    password: "College@123",
    role: "college_admin",
    fullName: "Islington College Admin",
    collegeSlug: "islington-college",
    premium: true,
  },
  {
    email: "herald@edview.demo",
    password: "College@123",
    role: "college_admin",
    fullName: "Herald College Kathmandu Admin",
    collegeSlug: "herald-college-kathmandu",
    premium: true,
  },
  // ── Free College Admin ──
  {
    email: "basiccollege@edview.demo",
    password: "College@123",
    role: "college_admin",
    fullName: "Basic College Admin",
    collegeSlug: "trinity-international-college",
    premium: false,
  },
  // ── Platform Admin ──
  {
    email: "admin@edview.demo",
    password: "Admin@123",
    role: "platform_admin",
    fullName: "EdView Administrator",
  },
  // ── Super Admin ──
  {
    email: "owner@edview.demo",
    password: "Owner@123",
    role: "super_admin",
    fullName: "EdView Owner",
  },
];

// ── Helper Functions ───────────────────────────────────────────────────────

async function findExistingUser(email: string) {
  const { data: users, error } = await supabase.auth.admin.listUsers();
  if (error) {
    console.error(`  ⚠️  Could not list users: ${error.message}`);
    return null;
  }
  return users.users.find((u) => u.email === email) ?? null;
}

async function createOrUpdateAuthUser(account: DemoAccount) {
  const existing = await findExistingUser(account.email);

  if (existing) {
    console.log(`  📌 User already exists: ${account.email} (${existing.id})`);

    // Update password to ensure it's correct
    const { error: pwdError } = await supabase.auth.admin.updateUserById(
      existing.id,
      { password: account.password }
    );
    if (pwdError) {
      console.error(`  ⚠️  Could not update password: ${pwdError.message}`);
    } else {
      console.log(`  ✅ Password updated for ${account.email}`);
    }

    return existing;
  }

  // Create new user
  console.log(`  👤 Creating user: ${account.email}`);
  const { data, error } = await supabase.auth.admin.createUser({
    email: account.email,
    password: account.password,
    email_confirm: true,
    user_metadata: {
      full_name: account.fullName,
      requested_role: account.role === "super_admin" ? "platform_admin" : account.role,
    },
  });

  if (error) {
    console.error(`  ❌ Failed to create user ${account.email}: ${error.message}`);
    return null;
  }

  console.log(`  ✅ Created user: ${account.email} (${data.user.id})`);
  return data.user;
}

async function updateProfile(userId: string, account: DemoAccount) {
  const updates: Record<string, unknown> = {
    full_name: account.fullName,
  };

  if (account.role === "student") {
    updates.student_verified = account.studentVerified ?? false;
  }

  const { error } = await supabase.from("profiles").update(updates).eq("id", userId);

  if (error) {
    console.error(`  ⚠️  Could not update profile for ${account.email}: ${error.message}`);
  } else {
    console.log(`  ✅ Profile updated for ${account.email}`);
  }
}

async function ensureRole(userId: string, account: DemoAccount) {
  // Check if role already exists
  const { data: existingRoles } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);

  const roles = (existingRoles ?? []).map((r: { role: string }) => r.role);

  if (roles.includes(account.role)) {
    console.log(`  📌 Role "${account.role}" already exists for ${account.email}`);
    return;
  }

  // For super_admin, we need to insert directly since the trigger only handles student/college_admin
  const { error } = await supabase.from("user_roles").insert({
    user_id: userId,
    role: account.role,
  });

  if (error) {
    console.error(`  ⚠️  Could not assign role for ${account.email}: ${error.message}`);
  } else {
    console.log(`  ✅ Role "${account.role}" assigned to ${account.email}`);
  }
}

async function ensureCollegeAssignment(userId: string, account: DemoAccount) {
  if (!account.collegeSlug) return;

  // Check if assignment exists
  const { data: existing } = await supabase
    .from("college_admin_assignments")
    .select("id")
    .eq("user_id", userId)
    .eq("college_slug", account.collegeSlug)
    .maybeSingle();

  if (existing) {
    console.log(`  📌 College assignment already exists for ${account.email}`);
    return;
  }

  const { error } = await supabase.from("college_admin_assignments").insert({
    user_id: userId,
    college_slug: account.collegeSlug,
    verified: true,
  });

  if (error) {
    console.error(`  ⚠️  Could not assign college for ${account.email}: ${error.message}`);
  } else {
    console.log(`  ✅ College "${account.collegeSlug}" assigned to ${account.email}`);
  }
}

async function ensurePremiumStatus(account: DemoAccount) {
  if (!account.collegeSlug || account.premium === undefined) return;

  const features = account.premium
    ? ["analytics", "ai_insights", "reports", "export"]
    : [];

  // Check if premium record exists
  const { data: existing } = await supabase
    .from("college_premium")
    .select("id")
    .eq("college_slug", account.collegeSlug)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("college_premium")
      .update({ premium_active: account.premium, features })
      .eq("college_slug", account.collegeSlug);

    if (error) {
      console.error(`  ⚠️  Could not update premium for ${account.collegeSlug}: ${error.message}`);
    } else {
      console.log(`  ✅ Premium status updated for ${account.collegeSlug}: ${account.premium ? "Active" : "Inactive"}`);
    }
  } else {
    const { error } = await supabase.from("college_premium").insert({
      college_slug: account.collegeSlug,
      premium_active: account.premium,
      features,
    });

    if (error) {
      console.error(`  ⚠️  Could not insert premium for ${account.collegeSlug}: ${error.message}`);
    } else {
      console.log(`  ✅ Premium status created for ${account.collegeSlug}: ${account.premium ? "Active" : "Inactive"}`);
    }
  }
}

// ── Seed Additional Data ────────────────────────────────────────────────────

async function seedSavedColleges(userId: string, account: DemoAccount) {
  if (account.role !== "student" || !account.studentVerified) return;

  // Each verified student saves a few colleges
  const savedSlugs: string[] = [];

  if (account.collegeSlug === "texas-international-college") {
    savedSlugs.push("islington-college", "herald-college-kathmandu", "prime-college");
  } else if (account.collegeSlug === "islington-college") {
    savedSlugs.push("texas-international-college", "herald-college-kathmandu", "global-college-international");
  } else if (account.collegeSlug === "herald-college-kathmandu") {
    savedSlugs.push("texas-international-college", "islington-college", "ace-institute-of-management");
  }

  for (const slug of savedSlugs) {
    const { data: existing } = await supabase
      .from("saved_colleges")
      .select("id")
      .eq("user_id", userId)
      .eq("college_slug", slug)
      .maybeSingle();

    if (!existing) {
      await supabase.from("saved_colleges").insert({
        user_id: userId,
        college_slug: slug,
      });
      console.log(`  ✅ Saved college "${slug}" for ${account.email}`);
    }
  }
}

async function seedNotifications(userId: string, account: DemoAccount) {
  if (account.role !== "college_admin") return;

  const notifications = [
    {
      user_id: userId,
      title: "New review posted",
      body: "A student has posted a new review for your college.",
      type: "info",
    },
    {
      user_id: userId,
      title: "Review reported",
      body: "A review on your college page has been reported for review.",
      type: "warning",
    },
    {
      user_id: userId,
      title: "Profile view milestone",
      body: "Your college profile has received over 100 views this month.",
      type: "success",
    },
    {
      user_id: userId,
      title: "New comparison",
      body: "A student added your college to a comparison list.",
      type: "info",
    },
  ];

  for (const notif of notifications) {
    const { error } = await supabase.from("notifications").insert(notif);
    if (error) {
      console.error(`  ⚠️  Could not insert notification for ${account.email}: ${error.message}`);
    }
  }
  console.log(`  ✅ Notifications seeded for ${account.email}`);
}

async function seedReportedReviews(adminUserId: string) {
  // Seed some reported reviews for the platform admin to see
  const reports = [
    {
      review_id: "demo-report-1",
      reported_by: adminUserId,
      reason: "Contains inappropriate language",
      status: "pending",
    },
    {
      review_id: "demo-report-2",
      reported_by: adminUserId,
      reason: "Suspected fake review",
      status: "pending",
    },
    {
      review_id: "demo-report-3",
      reported_by: adminUserId,
      reason: "Spam content",
      status: "pending",
    },
  ];

  for (const report of reports) {
    const { error } = await supabase.from("reported_reviews").insert(report);
    if (error) {
      console.error(`  ⚠️  Could not insert reported review: ${error.message}`);
    }
  }
  console.log("  ✅ Reported reviews seeded for admin");
}

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log("╔══════════════════════════════════════════════════════════╗");
  console.log("║        EdView Demo Accounts Seed Script                 ║");
  console.log("╚══════════════════════════════════════════════════════════╝");
  console.log();

  const createdUsers: { email: string; id: string; role: string }[] = [];

  for (const account of DEMO_ACCOUNTS) {
    console.log(`\n── ${account.email} (${account.role}) ──`);

    const user = await createOrUpdateAuthUser(account);
    if (!user) continue;

    await updateProfile(user.id, account);
    await ensureRole(user.id, account);
    await ensureCollegeAssignment(user.id, account);
    await ensurePremiumStatus(account);
    await seedSavedColleges(user.id, account);
    await seedNotifications(user.id, account);

    createdUsers.push({ email: account.email, id: user.id, role: account.role });
  }

  // Seed admin-specific data
  const adminUser = createdUsers.find((u) => u.role === "platform_admin");
  if (adminUser) {
    console.log("\n── Seeding admin data ──");
    await seedReportedReviews(adminUser.id);
  }

  // ── Summary ──
  console.log("\n╔══════════════════════════════════════════════════════════╗");
  console.log("║                    SEED SUMMARY                         ║");
  console.log("╚══════════════════════════════════════════════════════════╝");
  console.log();
  console.log("  Accounts created/updated:");
  console.log();

  for (const u of createdUsers) {
    const account = DEMO_ACCOUNTS.find((a) => a.email === u.email)!;
    const verified = account.role === "student"
      ? account.studentVerified ? "✅ Verified" : "❌ Unverified"
      : "—";
    const premium = account.role === "college_admin"
      ? account.premium ? "✅ Premium" : "❌ Free"
      : "—";
    console.log(`  ${u.email.padEnd(30)} ${u.role.padEnd(16)} ${verified.padEnd(14)} ${premium}`);
  }

  console.log();
  console.log("  ── Login Credentials ──");
  console.log();
  for (const u of createdUsers) {
    const account = DEMO_ACCOUNTS.find((a) => a.email === u.email)!;
    console.log(`  ${u.email.padEnd(30)} ${account.password}`);
  }

  console.log();
  console.log("  ✅ Seed complete!");
}

main().catch((err) => {
  console.error("❌ Fatal error:", err);
  process.exit(1);
});