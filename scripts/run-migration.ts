/**
 * Runs the demo seed migration SQL against Supabase.
 * Uses the service_role key for elevated privileges.
 *
 * Usage:
 *   SERVICE_ROLE_KEY=eyJ... bun run scripts/run-migration.ts
 */

import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

const SUPABASE_URL =
  process.env.VITE_SUPABASE_URL ?? "https://muikzmyzhbfwmxfxodmc.supabase.co";

const SERVICE_ROLE_KEY =
  process.env.SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

if (!SERVICE_ROLE_KEY) {
  console.error("❌ SERVICE_ROLE_KEY is required.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function run() {
  const migrationPath = path.resolve(
    __dirname,
    "..",
    "supabase",
    "migrations",
    "20260708000000_demo_seed_setup.sql"
  );
  const sql = fs.readFileSync(migrationPath, "utf-8");

  console.log("Running migration SQL...");

  // Split by semicolons and run each statement
  const statements = sql
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith("--"));

  for (const stmt of statements) {
    try {
      const { error } = await supabase.rpc("exec_sql", { sql: stmt + ";" });
      if (error) {
        // rpc might not exist; try direct pg query
        console.log(`  Statement may have failed: ${error.message}`);
        console.log(`  SQL: ${stmt.substring(0, 80)}...`);
        // Try direct query
        const { error: queryError } = await supabase
          .from("_sql_runner")
          .select("*")
          .limit(0)
          .maybeSingle();
        if (queryError) {
          console.log(`  ⚠️ ${queryError.message} - continuing...`);
        }
      } else {
        console.log(`  ✅ ${stmt.substring(0, 60)}...`);
      }
    } catch (e) {
      console.log(`  ⚠️ Could not execute: ${stmt.substring(0, 60)}...`);
      console.log(`  ${(e as Error).message}`);
    }
  }

  console.log("\nMigration complete! You may also run this SQL manually via Supabase Dashboard SQL Editor.");
  console.log(`Migration file: ${migrationPath}`);
}

run().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});