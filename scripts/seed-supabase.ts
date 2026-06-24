/**
 * One-time seed script: inserts all SEED_REVIEWS from edview-data into Supabase.
 *
 * Usage:
 *   bun run scripts/seed-supabase.ts
 *
 * Or with environment variables:
 *   VITE_SUPABASE_URL=... VITE_SUPABASE_ANON_KEY=... bun run scripts/seed-supabase.ts
 *
 * IMPORTANT: Run this ONLY after the `reviews` table has been created in Supabase.
 * This script will skip inserts for any `college_name + student_name + review_title`
 * combinations that already exist (idempotent).
 */

import { createClient } from "@supabase/supabase-js";
import type { ReviewRow } from "../src/lib/supabase/types";

// Allow overriding env from CLI
const supabaseUrl =
  process.env.VITE_SUPABASE_URL ?? "https://muikzmyzhbfwmxfxodmc.supabase.co";
const supabaseAnonKey =
  process.env.VITE_SUPABASE_ANON_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11aWt6bXl6aGJmd214ZnhvZG1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzMTA1ODksImV4cCI6MjA5Nzg4NjU4OX0.p1V6tZ99dTG1kdbB6LS_2TV3wwsqjv9zbSpIb-LsKsc";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ---- Inline seed data (copy of SEED_REVIEWS relevant fields) ----
// We can't import from src/ since this runs outside Vite's module resolution.
// Instead, define the data shape inline.

type SeedReview = {
  collegeSlug: string;
  author: string;
  program: string;
  year: string;
  date: string;
  title: string;
  body: string;
  ratings: {
    academics: number;
    teachers: number;
    facilities: number;
    studentLife: number;
    careerSupport: number;
    valueForMoney: number;
  };
};

const seedReviews: SeedReview[] = [
  // Trinity International College
  { collegeSlug: "trinity-international-college", author: "Aayush K.", program: "+2 Science", year: "2024", date: "2025-01-12", title: "Strong sciences, intense pace", body: "Coursework is genuinely demanding but teachers really know the syllabus. Labs are well stocked. The schedule is packed but that's what you need for Cambridge exams. Cafeteria could be better but overall the academic environment is excellent.", ratings: { academics: 5, teachers: 5, facilities: 4, studentLife: 4, careerSupport: 4, valueForMoney: 4 } },
  { collegeSlug: "trinity-international-college", author: "Sneha R.", program: "BBA", year: "2023", date: "2024-09-02", title: "Great for self-driven students", body: "If you put in the effort, Trinity gives you the structure and resources. The library is well-stocked for business references. Career support is improving each year with more company tie-ups. Not a place to coast but rewards those who engage.", ratings: { academics: 4, teachers: 4, facilities: 4, studentLife: 4, careerSupport: 3, valueForMoney: 4 } },
  { collegeSlug: "trinity-international-college", author: "Rajesh M.", program: "+2 Science", year: "2023", date: "2024-07-15", title: "Prepared me well for entrance exams", body: "The science program here is intense but exactly what I needed for medical entrance prep. Teachers assign extra practice and stay after class for doubts. Campus is compact but functional. You're here to study, not for fancy amenities.", ratings: { academics: 5, teachers: 5, facilities: 3, studentLife: 3, careerSupport: 4, valueForMoney: 5 } },
  { collegeSlug: "trinity-international-college", author: "Priya T.", program: "BCA", year: "2024", date: "2025-02-28", title: "Up and coming IT program", body: "The BCA program is newer but the investment in computer labs shows. Some professors still adjusting to the curriculum but very supportive. Hackathons and coding events are becoming regular. Good choice if you want a balance of theory and practice.", ratings: { academics: 4, teachers: 4, facilities: 4, studentLife: 4, careerSupport: 4, valueForMoney: 4 } },
  { collegeSlug: "trinity-international-college", author: "Bikash S.", program: "+2 Management", year: "2022", date: "2024-04-20", title: "Practical business foundation", body: "The management stream gave me practical skills I actually use now. Case studies, presentations, and group projects prepared me for undergrad. Not the most glamorous campus but the education is solid and affordable compared to options.", ratings: { academics: 4, teachers: 4, facilities: 3, studentLife: 3, careerSupport: 3, valueForMoney: 5 } },
  // Global College International
  { collegeSlug: "global-college-international", author: "Riya M.", program: "IB Diploma", year: "2024", date: "2025-02-04", title: "Truly international experience", body: "The IB program is no joke but the faculty actually mentor you through it. Campus is beautiful and the community is diverse. The extended essay and TOK push you to think critically. Expensive but you get what you pay for in terms of preparation for universities abroad.", ratings: { academics: 5, teachers: 5, facilities: 5, studentLife: 5, careerSupport: 5, valueForMoney: 3 } },
  { collegeSlug: "global-college-international", author: "Bibek T.", program: "A-Levels", year: "2022", date: "2024-06-18", title: "Worth it if you can afford it", body: "Excellent prep for foreign universities. The college counselor helped with UK and US applications extensively. Labs and classrooms are top-notch. Tuition is high though, so weigh your options. If you're aiming abroad, this is one of the best choices in Nepal.", ratings: { academics: 5, teachers: 4, facilities: 5, studentLife: 4, careerSupport: 5, valueForMoney: 2 } },
  { collegeSlug: "global-college-international", author: "Anisha G.", program: "IB Diploma", year: "2023", date: "2024-11-08", title: "Pushed me to grow", body: "IB here challenged me in ways +2 wouldn't have. CAS activities, research papers, and the Theory of Knowledge course develop you as a thinker rather than just a test-taker. The workload is heavy but manageable if you stay organized. I got into my top choice in Canada.", ratings: { academics: 5, teachers: 5, facilities: 5, studentLife: 4, careerSupport: 5, valueForMoney: 3 } },
  { collegeSlug: "global-college-international", author: "Kabir S.", program: "A-Levels", year: "2024", date: "2025-03-15", title: "Rigorous but fair expectations", body: "A-Levels here are taught by subject specialists who really know their fields. Small class sizes mean individual attention. The science labs rival what you'd find at university. Sports facilities could be bigger but everything else is excellent. Perfect for serious students aiming overseas.", ratings: { academics: 5, teachers: 5, facilities: 4, studentLife: 4, careerSupport: 4, valueForMoney: 3 } },
  { collegeSlug: "global-college-international", author: "Malvika R.", program: "+2 Science", year: "2023", date: "2024-08-22", title: "Modern approach to science education", body: "The +2 Science program benefits from the same facilities as IB and A-Levels. Teachers use multimedia, practicals, and current examples rather than just lecturing. More expensive than other +2 options but the teaching quality justifies it for me.", ratings: { academics: 5, teachers: 5, facilities: 5, studentLife: 4, careerSupport: 4, valueForMoney: 3 } },
  // Texas International College
  { collegeSlug: "texas-international-college", author: "Nischal P.", program: "BSc CSIT", year: "2023", date: "2024-11-20", title: "Solid CSIT program", body: "Faculty for core CS subjects is strong. Lab infrastructure has improved a lot in recent semesters. The coding clubs and events are active. Not the fanciest campus but you learn practical skills. Several seniors have landed good tech jobs from here.", ratings: { academics: 4, teachers: 4, facilities: 4, studentLife: 3, careerSupport: 3, valueForMoney: 5 } },
  { collegeSlug: "texas-international-college", author: "Anu S.", program: "+2 Science", year: "2024", date: "2025-03-09", title: "Good value, busy schedule", body: "Classes are well organized. Teachers are accessible and exams are fair based on what you're taught. Library could use more seating during exams. For the tuition, you get solid preparation without breaking the bank.", ratings: { academics: 4, teachers: 4, facilities: 3, studentLife: 3, careerSupport: 3, valueForMoney: 5 } },
  { collegeSlug: "texas-international-college", author: "Roshan K.", program: "BCA", year: "2024", date: "2025-01-25", title: "Practical IT education at fair price", body: "BCA here focuses on practical skills. We do real projects, not just theory. Some subjects could have better teaching but overall it prepares you for industry. Fee is reasonable compared to private colleges offering similar programs. Good ROI for the investment.", ratings: { academics: 4, teachers: 3, facilities: 4, studentLife: 3, careerSupport: 4, valueForMoney: 5 } },
  { collegeSlug: "texas-international-college", author: "Sharmila D.", program: "BBS", year: "2023", date: "2024-10-12", title: "No-nonsense business education", body: "BBS here is straightforward. You learn accounting, finance, and management fundamentals. Teachers have industry experience and share real examples. Not a lot of fancy extracurriculars but if you're focused on accounting or banking, this is reliable and affordable.", ratings: { academics: 4, teachers: 4, facilities: 3, studentLife: 3, careerSupport: 3, valueForMoney: 5 } },
  { collegeSlug: "texas-international-college", author: "Binod T.", program: "BSc CSIT", year: "2022", date: "2024-05-30", title: "Launched my dev career", body: "CSIT from Texas gave me the foundation to become a software developer. The early semesters build strong basics. Later semesters let you specialize. Placement cell isn't aggressive about jobs but alumni network helps. Got my first dev job through a senior's referral.", ratings: { academics: 4, teachers: 4, facilities: 4, studentLife: 3, careerSupport: 3, valueForMoney: 5 } },
  // Reliance
  { collegeSlug: "reliance-international-academy", author: "Manish G.", program: "A-Levels", year: "2024", date: "2025-01-29", title: "Modern campus, supportive teachers", body: "Teachers are approachable and the labs feel new. Could use more clubs. Overall a great place to study for A-Levels.", ratings: { academics: 4, teachers: 5, facilities: 5, studentLife: 3, careerSupport: 4, valueForMoney: 3 } },
  { collegeSlug: "reliance-international-academy", author: "Pratima L.", program: "+2 Management", year: "2023", date: "2024-08-14", title: "Comfortable, organized place to study", body: "Admin is responsive. Counseling for university applications is genuinely helpful. The campus environment is conducive to learning.", ratings: { academics: 4, teachers: 4, facilities: 5, studentLife: 4, careerSupport: 4, valueForMoney: 3 } },
  // KMC
  { collegeSlug: "kathmandu-model-college", author: "Sujan B.", program: "BBS", year: "2022", date: "2024-05-22", title: "Practical learning, friendly faculty", body: "Great for management. Not the fanciest building but learning is solid. The faculty is friendly and always available to help.", ratings: { academics: 4, teachers: 4, facilities: 3, studentLife: 4, careerSupport: 3, valueForMoney: 5 } },
  { collegeSlug: "kathmandu-model-college", author: "Kritika D.", program: "BSc CSIT", year: "2024", date: "2025-02-12", title: "Good CSIT at a fair price", body: "Strong peer group. Course delivery is mostly traditional but professors care about student understanding. Good value for the tuition fee.", ratings: { academics: 4, teachers: 4, facilities: 3, studentLife: 4, careerSupport: 3, valueForMoney: 5 } },
  // St. Xavier's
  { collegeSlug: "st-xaviers-college", author: "Rohan A.", program: "BSc Physics", year: "2023", date: "2024-10-05", title: "Academically world-class", body: "The discipline and depth of teaching here are unmatched in Kathmandu. Tough to get in for a reason. The standard is consistently high.", ratings: { academics: 5, teachers: 5, facilities: 4, studentLife: 4, careerSupport: 4, valueForMoney: 5 } },
  { collegeSlug: "st-xaviers-college", author: "Ishani M.", program: "BCA", year: "2024", date: "2025-03-22", title: "Strict but rewarding", body: "Expect a lot of work. Faculty is excellent and the alumni network opens doors for career opportunities after graduation.", ratings: { academics: 5, teachers: 5, facilities: 4, studentLife: 3, careerSupport: 4, valueForMoney: 5 } },
  // Prime
  { collegeSlug: "prime-college", author: "Saugat P.", program: "BSc CSIT", year: "2023", date: "2024-12-01", title: "Active tech scene", body: "Hackathons, tech talks and decent placement help. Class sizes can be large but the community is strong and collaborative.", ratings: { academics: 4, teachers: 4, facilities: 4, studentLife: 5, careerSupport: 5, valueForMoney: 4 } },
  { collegeSlug: "prime-college", author: "Niraj S.", program: "BBA", year: "2024", date: "2025-02-26", title: "Industry-aligned BBA", body: "Lots of guest sessions from real companies. Coursework is current and relevant to today's business environment. Placement support is strong.", ratings: { academics: 4, teachers: 4, facilities: 4, studentLife: 4, careerSupport: 5, valueForMoney: 4 } },
  // Little Angels'
  { collegeSlug: "little-angels-college", author: "Aastha K.", program: "BBA", year: "2023", date: "2024-09-19", title: "Beautiful campus, strong network", body: "Facilities are top-tier and the BBA program connects you with the corporate world early. The alumni network is very active.", ratings: { academics: 4, teachers: 4, facilities: 5, studentLife: 5, careerSupport: 5, valueForMoney: 3 } },
  { collegeSlug: "little-angels-college", author: "Sandesh T.", program: "BHM", year: "2024", date: "2025-01-08", title: "Great for hospitality", body: "Practical labs and internships are well organized. Tuition is on the higher side but the facilities and training are excellent.", ratings: { academics: 4, teachers: 4, facilities: 5, studentLife: 4, careerSupport: 4, valueForMoney: 3 } },
  // DAV
  { collegeSlug: "dav-college", author: "Prashant J.", program: "+2 Science", year: "2022", date: "2024-04-10", title: "Solid, no-nonsense college", body: "Teachers stick to fundamentals. Not very flashy but you learn what you need to for the board exams and further studies.", ratings: { academics: 4, teachers: 4, facilities: 3, studentLife: 3, careerSupport: 3, valueForMoney: 4 } },
  { collegeSlug: "dav-college", author: "Mina R.", program: "BBS", year: "2023", date: "2024-11-11", title: "Calm campus to study in", body: "Less competitive vibe than some bigger colleges. Good if you want to focus on your studies without distractions.", ratings: { academics: 3, teachers: 4, facilities: 3, studentLife: 3, careerSupport: 3, valueForMoney: 4 } },
  // Ace
  { collegeSlug: "ace-institute-of-management", author: "Ujjwal M.", program: "MBA", year: "2023", date: "2024-12-15", title: "Best B-school experience in Nepal", body: "Rigorous curriculum, real-world projects, and a powerful alumni network. Costly but you see the ROI through placements and career growth.", ratings: { academics: 5, teachers: 5, facilities: 5, studentLife: 4, careerSupport: 5, valueForMoney: 4 } },
  { collegeSlug: "ace-institute-of-management", author: "Pooja N.", program: "BBA-BI", year: "2024", date: "2025-02-18", title: "Demanding undergrad, great prep", body: "BBA-BI keeps you on your toes. Career office actually places students in good companies. Intensive but worth it.", ratings: { academics: 5, teachers: 4, facilities: 5, studentLife: 4, careerSupport: 5, valueForMoney: 3 } },
];

function toRow(s: SeedReview): Omit<ReviewRow, "id" | "created_at"> {
  return {
    college_name: s.collegeSlug,
    student_name: s.author,
    program: s.program,
    graduation_year: s.year,
    academics: s.ratings.academics,
    teachers: s.ratings.teachers,
    facilities: s.ratings.facilities,
    student_life: s.ratings.studentLife,
    career_support: s.ratings.careerSupport,
    value_for_money: s.ratings.valueForMoney,
    review_title: s.title,
    review_text: s.body,
  };
}

async function main() {
  console.log("🔍 Checking existing reviews in Supabase...");

  // Check which seed reviews already exist (by college + author + title)
  const { data: existing } = await supabase
    .from("reviews")
    .select("college_name, student_name, review_title");

  const existingSet = new Set(
    (existing ?? []).map(
      (r) => `${r.college_name}::${r.student_name}::${r.review_title}`,
    ),
  );

  const toInsert = seedReviews.filter((s) => {
    const key = `${s.collegeSlug}::${s.author}::${s.title}`;
    return !existingSet.has(key);
  });

  if (toInsert.length === 0) {
    console.log("✅ All seed reviews already exist in Supabase. Nothing to insert.");
    return;
  }

  console.log(`📝 Inserting ${toInsert.length} new seed reviews...`);

  const rows = toInsert.map(toRow);

  const { data, error } = await supabase.from("reviews").insert(rows).select();

  if (error) {
    console.error("❌ Failed to insert seed reviews:", error.message);
    process.exit(1);
  }

  console.log(`✅ Successfully inserted ${data?.length ?? 0} reviews into Supabase.`);
  console.log("   You can now remove SEED_REVIEWS from edview-data.ts if desired.");
}

main().catch((err) => {
  console.error("❌ Unexpected error:", err);
  process.exit(1);
});