// Quick test for the AI search system
// Run with: node test-search.js

// We need to test the aiSearch function from edview-data.ts
// Since it's TypeScript, we'll use tsx or just test the built output

const queries = [
  "cheap",
  "clubs",
  "placements",
  "engineering",
  "management",
  "scholarship",
  "hostel",
  "wifi",
  "canteen",
  "library",
  "academics",
  "sports",
  "coding",
  "law",
  "research",
  "practical",
  "affordable",
  "BCA",
  "Texas",
  "medical",
  "international",
  "friendly",
  "strict",
];

async function test() {
  // Try to import from the built SSR output
  try {
    const mod = await import('./.output/server/_ssr/edview-data-C1mkimPy.mjs');
    const { aiSearch, COLLEGES } = mod;
    
    let allPassed = true;
    for (const q of queries) {
      const result = aiSearch(q);
      const hasResults = result.colleges.length > 0;
      const status = hasResults ? "✅" : "❌";
      if (!hasResults) allPassed = false;
      const names = result.colleges.map(c => c.college.name).join(", ");
      const reasons = result.colleges.slice(0, 2).flatMap(c => c.reasons || []).slice(0, 3).join(", ");
      console.log(`${status} "${q}" → ${result.colleges.length} colleges: ${names.slice(0, 80)}`);
      if (reasons) console.log(`   Reasons: ${reasons}`);
    }
    console.log(`\n${allPassed ? "✅ ALL PASSED" : "❌ SOME FAILED"}`);
  } catch (e) {
    console.error("Could not load module:", e.message);
    console.log("Trying alternative approach...");
    
    // Fallback: use the built server index
    try {
      const server = await import('./.output/server/index.mjs');
      console.log("Server loaded, but aiSearch may not be directly accessible");
    } catch (e2) {
      console.error("Also failed:", e2.message);
    }
  }
}

test();