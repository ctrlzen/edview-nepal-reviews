// One-time seed script: inserts seed review data into Supabase.
// Usage: node scripts/seed-supabase.cjs

const { createClient } = require("@supabase/supabase-js");

const supabaseUrl =
  process.env.VITE_SUPABASE_URL || "https://muikzmyzhbfwmxfxodmc.supabase.co";
const supabaseAnonKey =
  process.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11aWt6bXl6aGJmd214ZnhvZG1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzMTA1ODksImV4cCI6MjA5Nzg4NjU4OX0.p1V6tZ99dTG1kdbB6LS_2TV3wwsqjv9zbSpIb-LsKsc";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const SEED = [
  // Trinity International College
  { college_name: "trinity-international-college", student_name: "Aayush K.", program: "+2 Science", graduation_year: "2024", academics: 5, teachers: 5, facilities: 4, student_life: 4, career_support: 4, value_for_money: 4, review_title: "Strong sciences, intense pace", review_text: "Coursework is genuinely demanding but teachers really know the syllabus. Labs are well stocked. The schedule is packed but that's what you need for Cambridge exams. Cafeteria could be better but overall the academic environment is excellent." },
  { college_name: "trinity-international-college", student_name: "Sneha R.", program: "BBA", graduation_year: "2023", academics: 4, teachers: 4, facilities: 4, student_life: 4, career_support: 3, value_for_money: 4, review_title: "Great for self-driven students", review_text: "If you put in the effort, Trinity gives you the structure and resources. The library is well-stocked for business references. Career support is improving each year with more company tie-ups. Not a place to coast but rewards those who engage." },
  { college_name: "trinity-international-college", student_name: "Rajesh M.", program: "+2 Science", graduation_year: "2023", academics: 5, teachers: 5, facilities: 3, student_life: 3, career_support: 4, value_for_money: 5, review_title: "Prepared me well for entrance exams", review_text: "The science program here is intense but exactly what I needed for medical entrance prep. Teachers assign extra practice and stay after class for doubts. Campus is compact but functional. You're here to study, not for fancy amenities." },
  { college_name: "trinity-international-college", student_name: "Priya T.", program: "BCA", graduation_year: "2024", academics: 4, teachers: 4, facilities: 4, student_life: 4, career_support: 4, value_for_money: 4, review_title: "Up and coming IT program", review_text: "The BCA program is newer but the investment in computer labs shows. Some professors still adjusting to the curriculum but very supportive. Hackathons and coding events are becoming regular. Good choice if you want a balance of theory and practice." },
  { college_name: "trinity-international-college", student_name: "Bikash S.", program: "+2 Management", graduation_year: "2022", academics: 4, teachers: 4, facilities: 3, student_life: 3, career_support: 3, value_for_money: 5, review_title: "Practical business foundation", review_text: "The management stream gave me practical skills I actually use now. Case studies, presentations, and group projects prepared me for undergrad. Not the most glamorous campus but the education is solid and affordable compared to options." },
  // Global College International
  { college_name: "global-college-international", student_name: "Riya M.", program: "IB Diploma", graduation_year: "2024", academics: 5, teachers: 5, facilities: 5, student_life: 5, career_support: 5, value_for_money: 3, review_title: "Truly international experience", review_text: "The IB program is no joke but the faculty actually mentor you through it. Campus is beautiful and the community is diverse. The extended essay and TOK push you to think critically. Expensive but you get what you pay for in terms of preparation for universities abroad." },
  { college_name: "global-college-international", student_name: "Bibek T.", program: "A-Levels", graduation_year: "2022", academics: 5, teachers: 4, facilities: 5, student_life: 4, career_support: 5, value_for_money: 2, review_title: "Worth it if you can afford it", review_text: "Excellent prep for foreign universities. The college counselor helped with UK and US applications extensively. Labs and classrooms are top-notch. Tuition is high though, so weigh your options. If you're aiming abroad, this is one of the best choices in Nepal." },
  { college_name: "global-college-international", student_name: "Anisha G.", program: "IB Diploma", graduation_year: "2023", academics: 5, teachers: 5, facilities: 5, student_life: 4, career_support: 5, value_for_money: 3, review_title: "Pushed me to grow", review_text: "IB here challenged me in ways +2 wouldn't have. CAS activities, research papers, and the Theory of Knowledge course develop you as a thinker rather than just a test-taker. The workload is heavy but manageable if you stay organized. I got into my top choice in Canada." },
  { college_name: "global-college-international", student_name: "Kabir S.", program: "A-Levels", graduation_year: "2024", academics: 5, teachers: 5, facilities: 4, student_life: 4, career_support: 4, value_for_money: 3, review_title: "Rigorous but fair expectations", review_text: "A-Levels here are taught by subject specialists who really know their fields. Small class sizes mean individual attention. The science labs rival what you'd find at university. Sports facilities could be bigger but everything else is excellent. Perfect for serious students aiming overseas." },
  { college_name: "global-college-international", student_name: "Malvika R.", program: "+2 Science", graduation_year: "2023", academics: 5, teachers: 5, facilities: 5, student_life: 4, career_support: 4, value_for_money: 3, review_title: "Modern approach to science education", review_text: "The +2 Science program benefits from the same facilities as IB and A-Levels. Teachers use multimedia, practicals, and current examples rather than just lecturing. More expensive than other +2 options but the teaching quality justifies it for me." },
  // Texas International College
  { college_name: "texas-international-college", student_name: "Nischal P.", program: "BSc CSIT", graduation_year: "2023", academics: 4, teachers: 4, facilities: 4, student_life: 3, career_support: 3, value_for_money: 5, review_title: "Solid CSIT program", review_text: "Faculty for core CS subjects is strong. Lab infrastructure has improved a lot in recent semesters. The coding clubs and events are active. Not the fanciest campus but you learn practical skills. Several seniors have landed good tech jobs from here." },
  { college_name: "texas-international-college", student_name: "Anu S.", program: "+2 Science", graduation_year: "2024", academics: 4, teachers: 4, facilities: 3, student_life: 3, career_support: 3, value_for_money: 5, review_title: "Good value, busy schedule", review_text: "Classes are well organized. Teachers are accessible and exams are fair based on what you're taught. Library could use more seating during exams. For the tuition, you get solid preparation without breaking the bank." },
  { college_name: "texas-international-college", student_name: "Roshan K.", program: "BCA", graduation_year: "2024", academics: 4, teachers: 3, facilities: 4, student_life: 3, career_support: 4, value_for_money: 5, review_title: "Practical IT education at fair price", review_text: "BCA here focuses on practical skills. We do real projects, not just theory. Some subjects could have better teaching but overall it prepares you for industry. Fee is reasonable compared to private colleges offering similar programs. Good ROI for the investment." },
  { college_name: "texas-international-college", student_name: "Sharmila D.", program: "BBS", graduation_year: "2023", academics: 4, teachers: 4, facilities: 3, student_life: 3, career_support: 3, value_for_money: 5, review_title: "No-nonsense business education", review_text: "BBS here is straightforward. You learn accounting, finance, and management fundamentals. Teachers have industry experience and share real examples. Not a lot of fancy extracurriculars but if you're focused on accounting or banking, this is reliable and affordable." },
  { college_name: "texas-international-college", student_name: "Binod T.", program: "BSc CSIT", graduation_year: "2022", academics: 4, teachers: 4, facilities: 4, student_life: 3, career_support: 3, value_for_money: 5, review_title: "Launched my dev career", review_text: "CSIT from Texas gave me the foundation to become a software developer. The early semesters build strong basics. Later semesters let you specialize. Placement cell isn't aggressive about jobs but alumni network helps. Got my first dev job through a senior's referral." },
  // Reliance
  { college_name: "reliance-international-academy", student_name: "Manish G.", program: "A-Levels", graduation_year: "2024", academics: 4, teachers: 5, facilities: 5, student_life: 3, career_support: 4, value_for_money: 3, review_title: "Modern campus, supportive teachers", review_text: "Teachers are approachable and the labs feel new. Could use more clubs. Overall a great place to study for A-Levels." },
  { college_name: "reliance-international-academy", student_name: "Pratima L.", program: "+2 Management", graduation_year: "2023", academics: 4, teachers: 4, facilities: 5, student_life: 4, career_support: 4, value_for_money: 3, review_title: "Comfortable, organized place to study", review_text: "Admin is responsive. Counseling for university applications is genuinely helpful. The campus environment is conducive to learning." },
  // KMC
  { college_name: "kathmandu-model-college", student_name: "Sujan B.", program: "BBS", graduation_year: "2022", academics: 4, teachers: 4, facilities: 3, student_life: 4, career_support: 3, value_for_money: 5, review_title: "Practical learning, friendly faculty", review_text: "Great for management. Not the fanciest building but learning is solid. The faculty is friendly and always available to help." },
  { college_name: "kathmandu-model-college", student_name: "Kritika D.", program: "BSc CSIT", graduation_year: "2024", academics: 4, teachers: 4, facilities: 3, student_life: 4, career_support: 3, value_for_money: 5, review_title: "Good CSIT at a fair price", review_text: "Strong peer group. Course delivery is mostly traditional but professors care about student understanding. Good value for the tuition fee." },
  // St. Xavier's
  { college_name: "st-xaviers-college", student_name: "Rohan A.", program: "BSc Physics", graduation_year: "2023", academics: 5, teachers: 5, facilities: 4, student_life: 4, career_support: 4, value_for_money: 5, review_title: "Academically world-class", review_text: "The discipline and depth of teaching here are unmatched in Kathmandu. Tough to get in for a reason. The standard is consistently high." },
  { college_name: "st-xaviers-college", student_name: "Ishani M.", program: "BCA", graduation_year: "2024", academics: 5, teachers: 5, facilities: 4, student_life: 3, career_support: 4, value_for_money: 5, review_title: "Strict but rewarding", review_text: "Expect a lot of work. Faculty is excellent and the alumni network opens doors for career opportunities after graduation." },
  // Prime
  { college_name: "prime-college", student_name: "Saugat P.", program: "BSc CSIT", graduation_year: "2023", academics: 4, teachers: 4, facilities: 4, student_life: 5, career_support: 5, value_for_money: 4, review_title: "Active tech scene", review_text: "Hackathons, tech talks and decent placement help. Class sizes can be large but the community is strong and collaborative." },
  { college_name: "prime-college", student_name: "Niraj S.", program: "BBA", graduation_year: "2024", academics: 4, teachers: 4, facilities: 4, student_life: 4, career_support: 5, value_for_money: 4, review_title: "Industry-aligned BBA", review_text: "Lots of guest sessions from real companies. Coursework is current and relevant to today's business environment. Placement support is strong." },
  // Little Angels'
  { college_name: "little-angels-college", student_name: "Aastha K.", program: "BBA", graduation_year: "2023", academics: 4, teachers: 4, facilities: 5, student_life: 5, career_support: 5, value_for_money: 3, review_title: "Beautiful campus, strong network", review_text: "Facilities are top-tier and the BBA program connects you with the corporate world early. The alumni network is very active." },
  { college_name: "little-angels-college", student_name: "Sandesh T.", program: "BHM", graduation_year: "2024", academics: 4, teachers: 4, facilities: 5, student_life: 4, career_support: 4, value_for_money: 3, review_title: "Great for hospitality", review_text: "Practical labs and internships are well organized. Tuition is on the higher side but the facilities and training are excellent." },
  // DAV
  { college_name: "dav-college", student_name: "Prashant J.", program: "+2 Science", graduation_year: "2022", academics: 4, teachers: 4, facilities: 3, student_life: 3, career_support: 3, value_for_money: 4, review_title: "Solid, no-nonsense college", review_text: "Teachers stick to fundamentals. Not very flashy but you learn what you need to for the board exams and further studies." },
  { college_name: "dav-college", student_name: "Mina R.", program: "BBS", graduation_year: "2023", academics: 3, teachers: 4, facilities: 3, student_life: 3, career_support: 3, value_for_money: 4, review_title: "Calm campus to study in", review_text: "Less competitive vibe than some bigger colleges. Good if you want to focus on your studies without distractions." },
  // Ace
  { college_name: "ace-institute-of-management", student_name: "Ujjwal M.", program: "MBA", graduation_year: "2023", academics: 5, teachers: 5, facilities: 5, student_life: 4, career_support: 5, value_for_money: 4, review_title: "Best B-school experience in Nepal", review_text: "Rigorous curriculum, real-world projects, and a powerful alumni network. Costly but you see the ROI through placements and career growth." },
  { college_name: "ace-institute-of-management", student_name: "Pooja N.", program: "BBA-BI", graduation_year: "2024", academics: 5, teachers: 4, facilities: 5, student_life: 4, career_support: 5, value_for_money: 3, review_title: "Demanding undergrad, great prep", review_text: "BBA-BI keeps you on your toes. Career office actually places students in good companies. Intensive but worth it." },
];

async function main() {
  console.log("Checking existing reviews in Supabase...");

  const { data: existing, error: fetchError } = await supabase
    .from("reviews")
    .select("college_name, student_name, review_title");

  if (fetchError) {
    // If table doesn't exist, show a helpful error
    if (fetchError.code === "42P01") {
      console.error("ERROR: The 'reviews' table does not exist in Supabase.");
      console.error("Please create it first using the SQL from the setup guide.");
      process.exit(1);
    }
    console.error("Error checking existing reviews:", fetchError.message);
    process.exit(1);
  }

  const existingSet = new Set(
    (existing || []).map(
      (r) => `${r.college_name}::${r.student_name}::${r.review_title}`
    )
  );

  const toInsert = SEED.filter((r) => {
    const key = `${r.college_name}::${r.student_name}::${r.review_title}`;
    return !existingSet.has(key);
  });

  if (toInsert.length === 0) {
    console.log("All seed reviews already exist in Supabase. Nothing to insert.");
    return;
  }

  console.log(`Inserting ${toInsert.length} new seed reviews...`);

  const { data, error } = await supabase.from("reviews").insert(toInsert).select();

  if (error) {
    console.error("Failed to insert seed reviews:", error.message);
    process.exit(1);
  }

  console.log(`Successfully inserted ${data?.length || 0} reviews into Supabase.`);
  console.log("You can now remove SEED_REVIEWS from edview-data.ts.");
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});