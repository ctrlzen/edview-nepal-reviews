export type Category =
  | "academics"
  | "teachers"
  | "facilities"
  | "studentLife"
  | "careerSupport"
  | "valueForMoney";

export const CATEGORIES: { key: Category; label: string }[] = [
  { key: "academics", label: "Academics" },
  { key: "teachers", label: "Teachers" },
  { key: "facilities", label: "Facilities" },
  { key: "studentLife", label: "Student Life" },
  { key: "careerSupport", label: "Career Support" },
  { key: "valueForMoney", label: "Value for Money" },
];

export type Ratings = Record<Category, number>;

export type Review = {
  id: string;
  collegeSlug: string;
  author: string;
  program: string;
  year: string;
  date: string; // ISO
  title: string;
  body: string;
  ratings: Ratings;
  helpful: number;
  notHelpful: number;
  studentType?: string;
  pros?: string[];
  cons?: string[];
  advice?: string;
  recommend?: boolean;
};

export type College = {
  slug: string;
  name: string;
  tagline: string;
  location: string;
  established: number;
  affiliations: string[];
  programs: string[];
  tuitionRange: string;
  about: string;
};

export const COLLEGES: College[] = [
  {
    slug: "trinity-international-college",
    name: "Trinity International College",
    tagline: "Cambridge-affiliated, holistic learning in Dillibazar.",
    location: "Dillibazar, Kathmandu",
    established: 2001,
    affiliations: ["TU", "Cambridge International"],
    programs: ["+2 Science", "+2 Management", "BBA", "BCA"],
    tuitionRange: "NPR 90k – 220k / yr",
    about:
      "Trinity blends a rigorous Cambridge curriculum with strong extracurricular programs. Known for its sciences and competitive admissions.",
  },
  {
    slug: "global-college-international",
    name: "Global College International",
    tagline: "Innovation-led IB and A-Levels school.",
    location: "Baluwatar, Kathmandu",
    established: 2008,
    affiliations: ["IB", "Cambridge"],
    programs: ["IB Diploma", "A-Levels", "+2 Science"],
    tuitionRange: "NPR 180k – 420k / yr",
    about:
      "Global is one of the few IB-authorized schools in Nepal with a modern campus and a global outlook.",
  },
  {
    slug: "texas-international-college",
    name: "Texas International College",
    tagline: "STEM-strong campus in Mid-Baneshwor.",
    location: "Mid-Baneshwor, Kathmandu",
    established: 1997,
    affiliations: ["TU", "NEB"],
    programs: ["+2 Science", "BSc CSIT", "BCA", "BBS"],
    tuitionRange: "NPR 60k – 180k / yr",
    about:
      "A long-running institution recognized for IT and engineering preparation with active student clubs.",
  },
  {
    slug: "reliance-international-academy",
    name: "Reliance International Academy",
    tagline: "Modern campus with a creative streak.",
    location: "Lazimpat, Kathmandu",
    established: 2010,
    affiliations: ["Cambridge", "NEB"],
    programs: ["+2 Science", "+2 Management", "A-Levels"],
    tuitionRange: "NPR 120k – 300k / yr",
    about:
      "Reliance is praised for facilities, design-forward classrooms and supportive faculty.",
  },
  {
    slug: "kathmandu-model-college",
    name: "Kathmandu Model College",
    tagline: "Affordable, well-regarded undergrad programs.",
    location: "Bagbazar, Kathmandu",
    established: 1997,
    affiliations: ["TU"],
    programs: ["BBS", "BBA", "BSc CSIT", "BA"],
    tuitionRange: "NPR 40k – 140k / yr",
    about:
      "Kathmandu Model is known for strong management and IT programs at accessible tuition.",
  },
  {
    slug: "st-xaviers-college",
    name: "St. Xavier's College",
    tagline: "Heritage Jesuit college, academically intense.",
    location: "Maitighar, Kathmandu",
    established: 1988,
    affiliations: ["TU"],
    programs: ["BSc", "BCA", "BBS", "+2 Science", "+2 Management"],
    tuitionRange: "NPR 50k – 160k / yr",
    about:
      "St. Xavier's is one of the most respected colleges in Nepal, with a competitive admission process and strong alumni network.",
  },
  {
    slug: "prime-college",
    name: "Prime College",
    tagline: "Industry-linked IT and management programs.",
    location: "Khusibu, Kathmandu",
    established: 2000,
    affiliations: ["TU", "PU"],
    programs: ["BSc CSIT", "BCA", "BBA", "MBA"],
    tuitionRange: "NPR 70k – 260k / yr",
    about:
      "Prime is well known for placement-oriented IT and business courses and an active tech community.",
  },
  {
    slug: "little-angels-college",
    name: "Little Angels' College",
    tagline: "Management & humanities with a polished campus.",
    location: "Hattiban, Lalitpur",
    established: 2000,
    affiliations: ["TU", "PU"],
    programs: ["BBA", "BBA-BI", "BHM", "+2"],
    tuitionRange: "NPR 110k – 320k / yr",
    about:
      "Little Angels' offers a spacious campus and a strong management focus with international exposure.",
  },
  {
    slug: "dav-college",
    name: "DAV College",
    tagline: "Long-standing, balanced academic culture.",
    location: "Jawalakhel, Lalitpur",
    established: 1992,
    affiliations: ["TU"],
    programs: ["+2 Science", "+2 Management", "BBS", "BSc"],
    tuitionRange: "NPR 50k – 150k / yr",
    about:
      "DAV is a familiar name in Kathmandu with a wide range of programs and a calm campus.",
  },
  {
    slug: "ace-institute-of-management",
    name: "Ace Institute of Management",
    tagline: "Premier business school in Nepal.",
    location: "Naxal, Kathmandu",
    established: 1999,
    affiliations: ["PU"],
    programs: ["BBA", "BBA-BI", "MBA", "EMBA"],
    tuitionRange: "NPR 250k – 600k / yr",
    about:
      "Ace is consistently ranked among the top business schools, with a strong placement record and corporate ties.",
  },
];

// Sample reviews — realistic mix per college.
const reviewSeeds: Array<Omit<Review, "id">> = [
  // Trinity
  { collegeSlug: "trinity-international-college", author: "Aayush K.", program: "+2 Science", year: "2024", date: "2025-01-12", title: "Strong sciences, intense pace", body: "Coursework is genuinely demanding but teachers really know the syllabus. Labs are well stocked. Cafeteria could be better.", ratings: { academics: 5, teachers: 5, facilities: 4, studentLife: 4, careerSupport: 4, valueForMoney: 4 }, helpful: 32, notHelpful: 3 },
  { collegeSlug: "trinity-international-college", author: "Sneha R.", program: "BBA", year: "2023", date: "2024-09-02", title: "Great for self-driven students", body: "If you put in the effort, Trinity gives you the structure and resources. Career support is improving each year.", ratings: { academics: 4, teachers: 4, facilities: 4, studentLife: 4, careerSupport: 3, valueForMoney: 4 }, helpful: 19, notHelpful: 2 },
  // Global
  { collegeSlug: "global-college-international", author: "Riya M.", program: "IB Diploma", year: "2024", date: "2025-02-04", title: "Truly international experience", body: "The IB program is no joke but the faculty actually mentor you through it. Campus is beautiful and the community is diverse.", ratings: { academics: 5, teachers: 5, facilities: 5, studentLife: 5, careerSupport: 5, valueForMoney: 3 }, helpful: 41, notHelpful: 4 },
  { collegeSlug: "global-college-international", author: "Bibek T.", program: "A-Levels", year: "2022", date: "2024-06-18", title: "Worth it if you can afford it", body: "Excellent prep for foreign universities. Tuition is high though, so weigh your options.", ratings: { academics: 5, teachers: 4, facilities: 5, studentLife: 4, careerSupport: 5, valueForMoney: 2 }, helpful: 28, notHelpful: 6 },
  // Texas
  { collegeSlug: "texas-international-college", author: "Nischal P.", program: "BSc CSIT", year: "2023", date: "2024-11-20", title: "Solid CSIT program", body: "Faculty for core CS subjects is strong. Lab infrastructure has improved a lot in recent semesters.", ratings: { academics: 4, teachers: 4, facilities: 4, studentLife: 3, careerSupport: 3, valueForMoney: 5 }, helpful: 22, notHelpful: 1 },
  { collegeSlug: "texas-international-college", author: "Anu S.", program: "+2 Science", year: "2024", date: "2025-03-09", title: "Good value, busy schedule", body: "Classes are well organized. Library could use more seating during exams.", ratings: { academics: 4, teachers: 4, facilities: 3, studentLife: 3, careerSupport: 3, valueForMoney: 5 }, helpful: 14, notHelpful: 2 },
  // Reliance
  { collegeSlug: "reliance-international-academy", author: "Manish G.", program: "A-Levels", year: "2024", date: "2025-01-29", title: "Modern campus, supportive teachers", body: "Teachers are approachable and the labs feel new. Could use more clubs.", ratings: { academics: 4, teachers: 5, facilities: 5, studentLife: 3, careerSupport: 4, valueForMoney: 3 }, helpful: 18, notHelpful: 2 },
  { collegeSlug: "reliance-international-academy", author: "Pratima L.", program: "+2 Management", year: "2023", date: "2024-08-14", title: "Comfortable, organized place to study", body: "Admin is responsive. Counseling for university applications is genuinely helpful.", ratings: { academics: 4, teachers: 4, facilities: 5, studentLife: 4, careerSupport: 4, valueForMoney: 3 }, helpful: 11, notHelpful: 1 },
  // KMC
  { collegeSlug: "kathmandu-model-college", author: "Sujan B.", program: "BBS", year: "2022", date: "2024-05-22", title: "Practical learning, friendly faculty", body: "Great for management. Not the fanciest building but learning is solid.", ratings: { academics: 4, teachers: 4, facilities: 3, studentLife: 4, careerSupport: 3, valueForMoney: 5 }, helpful: 26, notHelpful: 3 },
  { collegeSlug: "kathmandu-model-college", author: "Kritika D.", program: "BSc CSIT", year: "2024", date: "2025-02-12", title: "Good CSIT at a fair price", body: "Strong peer group. Course delivery is mostly traditional but professors care.", ratings: { academics: 4, teachers: 4, facilities: 3, studentLife: 4, careerSupport: 3, valueForMoney: 5 }, helpful: 17, notHelpful: 2 },
  // St. Xavier's
  { collegeSlug: "st-xaviers-college", author: "Rohan A.", program: "BSc Physics", year: "2023", date: "2024-10-05", title: "Academically world-class", body: "The discipline and depth of teaching here are unmatched in Kathmandu. Tough to get in for a reason.", ratings: { academics: 5, teachers: 5, facilities: 4, studentLife: 4, careerSupport: 4, valueForMoney: 5 }, helpful: 54, notHelpful: 4 },
  { collegeSlug: "st-xaviers-college", author: "Ishani M.", program: "BCA", year: "2024", date: "2025-03-22", title: "Strict but rewarding", body: "Expect a lot of work. Faculty is excellent and the alumni network opens doors.", ratings: { academics: 5, teachers: 5, facilities: 4, studentLife: 3, careerSupport: 4, valueForMoney: 5 }, helpful: 33, notHelpful: 2 },
  // Prime
  { collegeSlug: "prime-college", author: "Saugat P.", program: "BSc CSIT", year: "2023", date: "2024-12-01", title: "Active tech scene", body: "Hackathons, tech talks and decent placement help. Class sizes can be large.", ratings: { academics: 4, teachers: 4, facilities: 4, studentLife: 5, careerSupport: 5, valueForMoney: 4 }, helpful: 29, notHelpful: 3 },
  { collegeSlug: "prime-college", author: "Niraj S.", program: "BBA", year: "2024", date: "2025-02-26", title: "Industry-aligned BBA", body: "Lots of guest sessions from real companies. Coursework is current.", ratings: { academics: 4, teachers: 4, facilities: 4, studentLife: 4, careerSupport: 5, valueForMoney: 4 }, helpful: 15, notHelpful: 1 },
  // Little Angels'
  { collegeSlug: "little-angels-college", author: "Aastha K.", program: "BBA", year: "2023", date: "2024-09-19", title: "Beautiful campus, strong network", body: "Facilities are top-tier and the BBA program connects you with the corporate world early.", ratings: { academics: 4, teachers: 4, facilities: 5, studentLife: 5, careerSupport: 5, valueForMoney: 3 }, helpful: 24, notHelpful: 2 },
  { collegeSlug: "little-angels-college", author: "Sandesh T.", program: "BHM", year: "2024", date: "2025-01-08", title: "Great for hospitality", body: "Practical labs and internships are well organized. Tuition is on the higher side.", ratings: { academics: 4, teachers: 4, facilities: 5, studentLife: 4, careerSupport: 4, valueForMoney: 3 }, helpful: 12, notHelpful: 2 },
  // DAV
  { collegeSlug: "dav-college", author: "Prashant J.", program: "+2 Science", year: "2022", date: "2024-04-10", title: "Solid, no-nonsense college", body: "Teachers stick to fundamentals. Not very flashy but you learn what you need to.", ratings: { academics: 4, teachers: 4, facilities: 3, studentLife: 3, careerSupport: 3, valueForMoney: 4 }, helpful: 20, notHelpful: 3 },
  { collegeSlug: "dav-college", author: "Mina R.", program: "BBS", year: "2023", date: "2024-11-11", title: "Calm campus to study in", body: "Less competitive vibe than some bigger colleges. Good if you want to focus.", ratings: { academics: 3, teachers: 4, facilities: 3, studentLife: 3, careerSupport: 3, valueForMoney: 4 }, helpful: 9, notHelpful: 1 },
  // Ace
  { collegeSlug: "ace-institute-of-management", author: "Ujjwal M.", program: "MBA", year: "2023", date: "2024-12-15", title: "Best B-school experience in Nepal", body: "Rigorous curriculum, real-world projects, and a powerful alumni network. Costly but you see the ROI.", ratings: { academics: 5, teachers: 5, facilities: 5, studentLife: 4, careerSupport: 5, valueForMoney: 4 }, helpful: 47, notHelpful: 3 },
  { collegeSlug: "ace-institute-of-management", author: "Pooja N.", program: "BBA-BI", year: "2024", date: "2025-02-18", title: "Demanding undergrad, great prep", body: "BBA-BI keeps you on your toes. Career office actually places students.", ratings: { academics: 5, teachers: 4, facilities: 5, studentLife: 4, careerSupport: 5, valueForMoney: 3 }, helpful: 21, notHelpful: 2 },
];

export const SEED_REVIEWS: Review[] = reviewSeeds.map((r, i) => ({ ...r, id: `seed-${i + 1}` }));

export function avgOverall(r: Ratings): number {
  const vals = Object.values(r);
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

export function collegeAverages(reviews: Review[]): Ratings {
  const acc: Ratings = { academics: 0, teachers: 0, facilities: 0, studentLife: 0, careerSupport: 0, valueForMoney: 0 };
  if (reviews.length === 0) return acc;
  for (const r of reviews) {
    (Object.keys(acc) as Category[]).forEach((k) => (acc[k] += r.ratings[k]));
  }
  (Object.keys(acc) as Category[]).forEach((k) => (acc[k] = +(acc[k] / reviews.length).toFixed(2)));
  return acc;
}

export function getCollege(slug: string) {
  return COLLEGES.find((c) => c.slug === slug);
}
