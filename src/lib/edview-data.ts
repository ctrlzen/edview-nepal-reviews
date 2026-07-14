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
    about: "Reliance is praised for facilities, design-forward classrooms and supportive faculty.",
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
    about: "Kathmandu Model is known for strong management and IT programs at accessible tuition.",
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
    about: "DAV is a familiar name in Kathmandu with a wide range of programs and a calm campus.",
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
  {
    slug: "islington-college",
    name: "Islington College",
    tagline: "UK-accredited IT and business degrees in Kamalpokhari.",
    location: "Kamalpokhari, Kathmandu",
    established: 2011,
    affiliations: ["London Metropolitan University", "TU"],
    programs: ["BSc (Hons) Computing", "BBA (Hons)", "BCA", "BIM"],
    tuitionRange: "NPR 250k – 500k / yr",
    about:
      "Islington offers UK-accredited degrees in partnership with London Metropolitan University, with a strong focus on computing and business education in a modern campus environment.",
  },
  {
    slug: "herald-college-kathmandu",
    name: "Herald College Kathmandu",
    tagline: "UK degrees, global perspective in Naxal.",
    location: "Naxal, Kathmandu",
    established: 2013,
    affiliations: ["University of Wolverhampton", "TU"],
    programs: ["BSc (Hons) Computing", "BBA (Hons)", "BCA", "BIM"],
    tuitionRange: "NPR 280k – 520k / yr",
    about:
      "Herald College delivers UK-accredited programs with a global outlook, modern teaching methods, and strong industry connections for internships and placements.",
  },
  {
    slug: "kathmandu-university-school-of-management",
    name: "Kathmandu University School of Management",
    tagline: "Premier management education in Balkumari.",
    location: "Balkumari, Lalitpur",
    established: 1993,
    affiliations: ["KU"],
    programs: ["BBA", "BBA-Finance", "MBA", "Executive MBA", "BSc CSIT"],
    tuitionRange: "NPR 200k – 450k / yr",
    about:
      "KUSOM is the management arm of Kathmandu University, widely regarded as one of Nepal's best business schools with a rigorous curriculum and strong corporate network.",
  },
  {
    slug: "kathmandu-engineering-college",
    name: "Kathmandu Engineering College",
    tagline: "Leading engineering college in Kalimati.",
    location: "Kalimati, Kathmandu",
    established: 1998,
    affiliations: ["TU"],
    programs: ["BE Civil", "BE Electrical", "BE Electronics", "BE Computer", "BE Architecture"],
    tuitionRange: "NPR 120k – 300k / yr",
    about:
      "KEC is one of the top engineering colleges in Nepal, known for its experienced faculty, well-equipped labs, and strong track record in professional licensing exams.",
  },
  {
    slug: "apex-college",
    name: "Apex College",
    tagline: "Management excellence in Mid-Baneshwor.",
    location: "Mid-Baneshwor, Kathmandu",
    established: 2000,
    affiliations: ["PU", "TU"],
    programs: ["BBA", "BBA-BI", "MBA", "BBS"],
    tuitionRange: "NPR 180k – 400k / yr",
    about:
      "Apex College is recognized for its quality management programs, experienced faculty from the corporate sector, and strong placement support in banking and finance.",
  },
  {
    slug: "british-college",
    name: "British College",
    tagline: "UK qualifications, studied in Kathmandu.",
    location: "Thapathali, Kathmandu",
    established: 2012,
    affiliations: ["University of the West of England", "University of Sunderland", "TU"],
    programs: ["BSc (Hons) Computing", "BBA (Hons)", "MBA", "LLB (Hons)"],
    tuitionRange: "NPR 300k – 600k / yr",
    about:
      "British College offers UK degree programs in partnership with multiple British universities, providing international qualifications without leaving Kathmandu.",
  },
  {
    slug: "nepal-law-campus",
    name: "Nepal Law Campus",
    tagline: "Premier legal education in the heart of Kathmandu.",
    location: "Exhibition Road, Kathmandu",
    established: 1954,
    affiliations: ["TU"],
    programs: ["LLB", "BA LLB", "LLM", "BBS"],
    tuitionRange: "NPR 40k – 120k / yr",
    about:
      "Nepal Law Campus is the oldest and most prestigious law college in Nepal, producing generations of judges, attorneys, and legal scholars since its establishment.",
  },
  {
    slug: "kantipur-engineering-college",
    name: "Kantipur Engineering College",
    tagline: "Practical engineering education in Dhapakhel.",
    location: "Dhapakhel, Lalitpur",
    established: 2001,
    affiliations: ["TU"],
    programs: ["BE Civil", "BE Computer", "BE Electrical", "BE Electronics"],
    tuitionRange: "NPR 100k – 250k / yr",
    about:
      "Kantipur Engineering College emphasizes practical learning with modern labs, industry projects, and a sprawling campus environment conducive to technical education.",
  },
  {
    slug: "padma-kanya-college",
    name: "Padma Kanya College",
    tagline: "Empowering women through education since 1951.",
    location: "Bagbazar, Kathmandu",
    established: 1951,
    affiliations: ["TU"],
    programs: ["BSc", "BA", "BBS", "BCA", "+2 Science", "+2 Management"],
    tuitionRange: "NPR 30k – 100k / yr",
    about:
      "Padma Kanya is Nepal's oldest women's college, offering affordable education across sciences, humanities, and management with a strong focus on women's empowerment.",
  },
  {
    slug: "kathmandu-college-of-management",
    name: "Kathmandu College of Management",
    tagline: "Innovative management programs in Gwarko.",
    location: "Gwarko, Lalitpur",
    established: 2005,
    affiliations: ["TU", "PU"],
    programs: ["BBA", "BBA-BI", "BHM", "BCA"],
    tuitionRange: "NPR 150k – 350k / yr",
    about:
      "KCM offers modern management and IT programs with a focus on innovation, entrepreneurship, and holistic student development in a collaborative campus environment.",
  },
];

// Sample reviews — realistic mix per college.
const reviewSeeds: Array<Omit<Review, "id">> = [
  // Trinity International College (5 reviews)
  {
    collegeSlug: "trinity-international-college",
    author: "Aayush K.",
    program: "+2 Science",
    year: "2024",
    date: "2025-01-12",
    title: "Strong sciences, intense pace",
    body: "Coursework is genuinely demanding but teachers really know the syllabus. Labs are well stocked. The schedule is packed but that's what you need for Cambridge exams. Cafeteria could be better but overall the academic environment is excellent.",
    ratings: {
      academics: 5,
      teachers: 5,
      facilities: 4,
      studentLife: 4,
      careerSupport: 4,
      valueForMoney: 4,
    },
    helpful: 32,
    notHelpful: 3,
    pros: [
      "Rigorous Cambridge curriculum",
      "Excellent science labs",
      "Teachers know the syllabus inside out",
    ],
    cons: ["Cafeteria food quality", "Schedule can feel overwhelming"],
    advice: "Stay on top of assignments from week one. The pace doesn't slow down.",
  },
  {
    collegeSlug: "trinity-international-college",
    author: "Sneha R.",
    program: "BBA",
    year: "2023",
    date: "2024-09-02",
    title: "Great for self-driven students",
    body: "If you put in the effort, Trinity gives you the structure and resources. The library is well-stocked for business references. Career support is improving each year with more company tie-ups. Not a place to coast but rewards those who engage.",
    ratings: {
      academics: 4,
      teachers: 4,
      facilities: 4,
      studentLife: 4,
      careerSupport: 3,
      valueForMoney: 4,
    },
    helpful: 19,
    notHelpful: 2,
    pros: [
      "Good library resources",
      "Structure supports focused students",
      "Improving industry connections",
    ],
    cons: ["Career counseling could be better", "Less hand-holding than some expect"],
    advice: "Build relationships with professors early. They're approachable but busy.",
  },
  {
    collegeSlug: "trinity-international-college",
    author: "Rajesh M.",
    program: "+2 Science",
    year: "2023",
    date: "2024-07-15",
    title: "Prepared me well for entrance exams",
    body: "The science program here is intense but exactly what I needed for medical entrance prep. Teachers assign extra practice and stay after class for doubts. Campus is compact but functional. You're here to study, not for fancy amenities.",
    ratings: {
      academics: 5,
      teachers: 5,
      facilities: 3,
      studentLife: 3,
      careerSupport: 4,
      valueForMoney: 5,
    },
    helpful: 27,
    notHelpful: 2,
    pros: ["Great entrance exam prep", "Teachers give extra time", "Strong peer competition"],
    cons: ["Campus feels small", "Limited extracurriculars"],
    advice: "Form study groups early. Your classmates are your biggest resource.",
  },
  {
    collegeSlug: "trinity-international-college",
    author: "Priya T.",
    program: "BCA",
    year: "2024",
    date: "2025-02-28",
    title: "Up and coming IT program",
    body: "The BCA program is newer but the investment in computer labs shows. Some professors still adjusting to the curriculum but very supportive. Hackathons and coding events are becoming regular. Good choice if you want a balance of theory and practice.",
    ratings: {
      academics: 4,
      teachers: 4,
      facilities: 4,
      studentLife: 4,
      careerSupport: 4,
      valueForMoney: 4,
    },
    helpful: 15,
    notHelpful: 1,
    pros: ["New computer labs", "Growing tech community", "Supportive faculty"],
    cons: ["Program still maturing", "Limited elective options"],
    advice:
      "Take initiative on projects outside class. The opportunities are there if you seek them.",
  },
  {
    collegeSlug: "trinity-international-college",
    author: "Bikash S.",
    program: "+2 Management",
    year: "2022",
    date: "2024-04-20",
    title: "Practical business foundation",
    body: "The management stream gave me practical skills I actually use now. Case studies, presentations, and group projects prepared me for undergrad. Not the most glamorous campus but the education is solid and affordable compared to options.",
    ratings: {
      academics: 4,
      teachers: 4,
      facilities: 3,
      studentLife: 3,
      careerSupport: 3,
      valueForMoney: 5,
    },
    helpful: 18,
    notHelpful: 3,
    pros: ["Real-world case studies", "Affordable tuition", "Good presentation practice"],
    cons: ["Campus facilities average", "Career guidance limited"],
    advice: "Participate actively in group projects. That's where you learn the most.",
  },

  // Global College International (5 reviews)
  {
    collegeSlug: "global-college-international",
    author: "Riya M.",
    program: "IB Diploma",
    year: "2024",
    date: "2025-02-04",
    title: "Truly international experience",
    body: "The IB program is no joke but the faculty actually mentor you through it. Campus is beautiful and the community is diverse. The extended essay and TOK push you to think critically. Expensive but you get what you pay for in terms of preparation for universities abroad.",
    ratings: {
      academics: 5,
      teachers: 5,
      facilities: 5,
      studentLife: 5,
      careerSupport: 5,
      valueForMoney: 3,
    },
    helpful: 41,
    notHelpful: 4,
    pros: ["World-class IB program", "Diverse international community", "Beautiful modern campus"],
    cons: ["Tuition is high", "Workload can be overwhelming"],
    advice:
      "Start your extended essay early. Use the resources Global provides for university applications.",
  },
  {
    collegeSlug: "global-college-international",
    author: "Bibek T.",
    program: "A-Levels",
    year: "2022",
    date: "2024-06-18",
    title: "Worth it if you can afford it",
    body: "Excellent prep for foreign universities. The college counselor helped with UK and US applications extensively. Labs and classrooms are top-notch. Tuition is high though, so weigh your options. If you're aiming abroad, this is one of the best choices in Nepal.",
    ratings: {
      academics: 5,
      teachers: 4,
      facilities: 5,
      studentLife: 4,
      careerSupport: 5,
      valueForMoney: 2,
    },
    helpful: 28,
    notHelpful: 6,
    pros: [
      "Strong university placement",
      "Excellent facilities",
      "Experienced counselors for abroad applications",
    ],
    cons: ["Most expensive in Kathmandu", "Pressure to perform"],
    advice:
      "Make full use of the college counseling office. They're genuinely helpful for overseas applications.",
  },
  {
    collegeSlug: "global-college-international",
    author: "Anisha G.",
    program: "IB Diploma",
    year: "2023",
    date: "2024-11-08",
    title: "Pushed me to grow",
    body: "IB here challenged me in ways +2 wouldn't have. CAS activities, research papers, and the Theory of Knowledge course develop you as a thinker rather than just a test-taker. The workload is heavy but manageable if you stay organized. I got into my top choice in Canada.",
    ratings: {
      academics: 5,
      teachers: 5,
      facilities: 5,
      studentLife: 4,
      careerSupport: 5,
      valueForMoney: 3,
    },
    helpful: 33,
    notHelpful: 2,
    pros: [
      "Develops critical thinking",
      "CAS builds real experience",
      "Strong track record abroad",
    ],
    cons: ["Very demanding schedule", "Little time for outside activities"],
    advice: "Learn to manage time before you start. Use a planner religiously.",
  },
  {
    collegeSlug: "global-college-international",
    author: "Kabir S.",
    program: "A-Levels",
    year: "2024",
    date: "2025-03-15",
    title: "Rigorous but fair expectations",
    body: "A-Levels here are taught by subject specialists who really know their fields. Small class sizes mean individual attention. The science labs rival what you'd find at university. Sports facilities could be bigger but everything else is excellent. Perfect for serious students aiming overseas.",
    ratings: {
      academics: 5,
      teachers: 5,
      facilities: 4,
      studentLife: 4,
      careerSupport: 4,
      valueForMoney: 3,
    },
    helpful: 19,
    notHelpful: 1,
    pros: ["Subject specialist teachers", "Small class sizes", "University-level labs"],
    cons: ["Sports facilities limited", "Fee increases annually"],
    advice:
      "Pick subjects you're genuinely interested in. The depth required means loving what you study helps.",
  },
  {
    collegeSlug: "global-college-international",
    author: "Malvika R.",
    program: "+2 Science",
    year: "2023",
    date: "2024-08-22",
    title: "Modern approach to science education",
    body: "The +2 Science program benefits from the same facilities as IB and A-Levels. Teachers use multimedia, practicals, and current examples rather than just lecturing. More expensive than other +2 options but the teaching quality justifies it for me.",
    ratings: {
      academics: 5,
      teachers: 5,
      facilities: 5,
      studentLife: 4,
      careerSupport: 4,
      valueForMoney: 3,
    },
    helpful: 22,
    notHelpful: 3,
    pros: ["Modern teaching methods", "Excellent lab facilities", "Well-qualified teachers"],
    cons: ["Higher fees than typical +2", "Competitive atmosphere"],
    advice: "Don't let the price tag scare you. The quality difference is real.",
  },

  // Texas International College (5 reviews)
  {
    collegeSlug: "texas-international-college",
    author: "Nischal P.",
    program: "BSc CSIT",
    year: "2023",
    date: "2024-11-20",
    title: "Solid CSIT program",
    body: "Faculty for core CS subjects is strong. Lab infrastructure has improved a lot in recent semesters. The coding clubs and events are active. Not the fanciest campus but you learn practical skills. Several seniors have landed good tech jobs from here.",
    ratings: {
      academics: 4,
      teachers: 4,
      facilities: 4,
      studentLife: 3,
      careerSupport: 3,
      valueForMoney: 5,
    },
    helpful: 22,
    notHelpful: 1,
    pros: ["Strong CS fundamentals", "Active coding community", "Great value for tuition"],
    cons: ["Campus looks dated", "Career services average"],
    advice: "Join the coding club. Practical projects matter as much as coursework for jobs.",
  },
  {
    collegeSlug: "texas-international-college",
    author: "Anu S.",
    program: "+2 Science",
    year: "2024",
    date: "2025-03-09",
    title: "Good value, busy schedule",
    body: "Classes are well organized. Teachers are accessible and exams are fair based on what you're taught. Library could use more seating during exams. For the tuition, you get solid preparation without breaking the bank.",
    ratings: {
      academics: 4,
      teachers: 4,
      facilities: 3,
      studentLife: 3,
      careerSupport: 3,
      valueForMoney: 5,
    },
    helpful: 14,
    notHelpful: 2,
    pros: ["Affordable tuition", "Fair exam practices", "Accessible teachers"],
    cons: ["Library needs more space", "Campus facilities basic"],
    advice: "Study in groups to maximize learning. The peer quality here is good.",
  },
  {
    collegeSlug: "texas-international-college",
    author: "Roshan K.",
    program: "BCA",
    year: "2024",
    date: "2025-01-25",
    title: "Practical IT education at fair price",
    body: "BCA here focuses on practical skills. We do real projects, not just theory. Some subjects could have better teaching but overall it prepares you for industry. Fee is reasonable compared to private colleges offering similar programs. Good ROI for the investment.",
    ratings: {
      academics: 4,
      teachers: 3,
      facilities: 4,
      studentLife: 3,
      careerSupport: 4,
      valueForMoney: 5,
    },
    helpful: 16,
    notHelpful: 2,
    pros: ["Project-based learning", "Reasonable fees", "Decent job placement"],
    cons: ["Some weak instructors", "Campus needs updating"],
    advice: "Build a portfolio alongside coursework. Employers look for practical work.",
  },
  {
    collegeSlug: "texas-international-college",
    author: "Sharmila D.",
    program: "BBS",
    year: "2023",
    date: "2024-10-12",
    title: "No-nonsense business education",
    body: "BBS here is straightforward. You learn accounting, finance, and management fundamentals. Teachers have industry experience and share real examples. Not a lot of fancy extracurriculars but if you're focused on accounting or banking, this is reliable and affordable.",
    ratings: {
      academics: 4,
      teachers: 4,
      facilities: 3,
      studentLife: 3,
      careerSupport: 3,
      valueForMoney: 5,
    },
    helpful: 13,
    notHelpful: 1,
    pros: ["Teachers with real experience", "Solid fundamentals", "Very affordable"],
    cons: ["Limited networking events", "Basic facilities"],
    advice:
      "Focus on getting your CA or banking certifications alongside. The degree is just the foundation.",
  },
  {
    collegeSlug: "texas-international-college",
    author: "Binod T.",
    program: "BSc CSIT",
    year: "2022",
    date: "2024-05-30",
    title: "Launched my dev career",
    body: "CSIT from Texas gave me the foundation to become a software developer. The early semesters build strong basics. Later semesters let you specialize. Placement cell isn't aggressive about jobs but alumni network helps. Got my first dev job through a senior's referral.",
    ratings: {
      academics: 4,
      teachers: 4,
      facilities: 4,
      studentLife: 3,
      careerSupport: 3,
      valueForMoney: 5,
    },
    helpful: 25,
    notHelpful: 3,
    pros: ["Strong fundamentals", "Helpful alumni network", "Affordable path to tech career"],
    cons: ["Placement support passive", "Need self-directed effort"],
    advice: "Connect with seniors early. The alumni network is your best career resource.",
  },
  // Reliance
  {
    collegeSlug: "reliance-international-academy",
    author: "Manish G.",
    program: "A-Levels",
    year: "2024",
    date: "2025-01-29",
    title: "Modern campus, supportive teachers",
    body: "Teachers are approachable and the labs feel new. Could use more clubs.",
    ratings: {
      academics: 4,
      teachers: 5,
      facilities: 5,
      studentLife: 3,
      careerSupport: 4,
      valueForMoney: 3,
    },
    helpful: 18,
    notHelpful: 2,
  },
  {
    collegeSlug: "reliance-international-academy",
    author: "Pratima L.",
    program: "+2 Management",
    year: "2023",
    date: "2024-08-14",
    title: "Comfortable, organized place to study",
    body: "Admin is responsive. Counseling for university applications is genuinely helpful.",
    ratings: {
      academics: 4,
      teachers: 4,
      facilities: 5,
      studentLife: 4,
      careerSupport: 4,
      valueForMoney: 3,
    },
    helpful: 11,
    notHelpful: 1,
  },
  // KMC
  {
    collegeSlug: "kathmandu-model-college",
    author: "Sujan B.",
    program: "BBS",
    year: "2022",
    date: "2024-05-22",
    title: "Practical learning, friendly faculty",
    body: "Great for management. Not the fanciest building but learning is solid.",
    ratings: {
      academics: 4,
      teachers: 4,
      facilities: 3,
      studentLife: 4,
      careerSupport: 3,
      valueForMoney: 5,
    },
    helpful: 26,
    notHelpful: 3,
  },
  {
    collegeSlug: "kathmandu-model-college",
    author: "Kritika D.",
    program: "BSc CSIT",
    year: "2024",
    date: "2025-02-12",
    title: "Good CSIT at a fair price",
    body: "Strong peer group. Course delivery is mostly traditional but professors care.",
    ratings: {
      academics: 4,
      teachers: 4,
      facilities: 3,
      studentLife: 4,
      careerSupport: 3,
      valueForMoney: 5,
    },
    helpful: 17,
    notHelpful: 2,
  },
  // St. Xavier's
  {
    collegeSlug: "st-xaviers-college",
    author: "Rohan A.",
    program: "BSc Physics",
    year: "2023",
    date: "2024-10-05",
    title: "Academically world-class",
    body: "The discipline and depth of teaching here are unmatched in Kathmandu. Tough to get in for a reason.",
    ratings: {
      academics: 5,
      teachers: 5,
      facilities: 4,
      studentLife: 4,
      careerSupport: 4,
      valueForMoney: 5,
    },
    helpful: 54,
    notHelpful: 4,
  },
  {
    collegeSlug: "st-xaviers-college",
    author: "Ishani M.",
    program: "BCA",
    year: "2024",
    date: "2025-03-22",
    title: "Strict but rewarding",
    body: "Expect a lot of work. Faculty is excellent and the alumni network opens doors.",
    ratings: {
      academics: 5,
      teachers: 5,
      facilities: 4,
      studentLife: 3,
      careerSupport: 4,
      valueForMoney: 5,
    },
    helpful: 33,
    notHelpful: 2,
  },
  // Prime
  {
    collegeSlug: "prime-college",
    author: "Saugat P.",
    program: "BSc CSIT",
    year: "2023",
    date: "2024-12-01",
    title: "Active tech scene",
    body: "Hackathons, tech talks and decent placement help. Class sizes can be large.",
    ratings: {
      academics: 4,
      teachers: 4,
      facilities: 4,
      studentLife: 5,
      careerSupport: 5,
      valueForMoney: 4,
    },
    helpful: 29,
    notHelpful: 3,
  },
  {
    collegeSlug: "prime-college",
    author: "Niraj S.",
    program: "BBA",
    year: "2024",
    date: "2025-02-26",
    title: "Industry-aligned BBA",
    body: "Lots of guest sessions from real companies. Coursework is current.",
    ratings: {
      academics: 4,
      teachers: 4,
      facilities: 4,
      studentLife: 4,
      careerSupport: 5,
      valueForMoney: 4,
    },
    helpful: 15,
    notHelpful: 1,
  },
  // Little Angels'
  {
    collegeSlug: "little-angels-college",
    author: "Aastha K.",
    program: "BBA",
    year: "2023",
    date: "2024-09-19",
    title: "Beautiful campus, strong network",
    body: "Facilities are top-tier and the BBA program connects you with the corporate world early.",
    ratings: {
      academics: 4,
      teachers: 4,
      facilities: 5,
      studentLife: 5,
      careerSupport: 5,
      valueForMoney: 3,
    },
    helpful: 24,
    notHelpful: 2,
  },
  {
    collegeSlug: "little-angels-college",
    author: "Sandesh T.",
    program: "BHM",
    year: "2024",
    date: "2025-01-08",
    title: "Great for hospitality",
    body: "Practical labs and internships are well organized. Tuition is on the higher side.",
    ratings: {
      academics: 4,
      teachers: 4,
      facilities: 5,
      studentLife: 4,
      careerSupport: 4,
      valueForMoney: 3,
    },
    helpful: 12,
    notHelpful: 2,
  },
  // DAV
  {
    collegeSlug: "dav-college",
    author: "Prashant J.",
    program: "+2 Science",
    year: "2022",
    date: "2024-04-10",
    title: "Solid, no-nonsense college",
    body: "Teachers stick to fundamentals. Not very flashy but you learn what you need to.",
    ratings: {
      academics: 4,
      teachers: 4,
      facilities: 3,
      studentLife: 3,
      careerSupport: 3,
      valueForMoney: 4,
    },
    helpful: 20,
    notHelpful: 3,
  },
  {
    collegeSlug: "dav-college",
    author: "Mina R.",
    program: "BBS",
    year: "2023",
    date: "2024-11-11",
    title: "Calm campus to study in",
    body: "Less competitive vibe than some bigger colleges. Good if you want to focus.",
    ratings: {
      academics: 3,
      teachers: 4,
      facilities: 3,
      studentLife: 3,
      careerSupport: 3,
      valueForMoney: 4,
    },
    helpful: 9,
    notHelpful: 1,
  },
  // Ace
  {
    collegeSlug: "ace-institute-of-management",
    author: "Ujjwal M.",
    program: "MBA",
    year: "2023",
    date: "2024-12-15",
    title: "Best B-school experience in Nepal",
    body: "Rigorous curriculum, real-world projects, and a powerful alumni network. Costly but you see the ROI.",
    ratings: {
      academics: 5,
      teachers: 5,
      facilities: 5,
      studentLife: 4,
      careerSupport: 5,
      valueForMoney: 4,
    },
    helpful: 47,
    notHelpful: 3,
  },
  {
    collegeSlug: "ace-institute-of-management",
    author: "Pooja N.",
    program: "BBA-BI",
    year: "2024",
    date: "2025-02-18",
    title: "Demanding undergrad, great prep",
    body: "BBA-BI keeps you on your toes. Career office actually places students.",
    ratings: {
      academics: 5,
      teachers: 4,
      facilities: 5,
      studentLife: 4,
      careerSupport: 5,
      valueForMoney: 3,
    },
    helpful: 21,
    notHelpful: 2,
  },
];

export const SEED_REVIEWS: Review[] = reviewSeeds.map((r, i) => {
  const enriched: Review = { ...r, id: `seed-${i + 1}` };
  // Attach realistic pros/cons/advice/student-type/recommend defaults.
  const avg = avgOverall(enriched.ratings);
  if (enriched.recommend === undefined) enriched.recommend = avg >= 3.8;
  if (!enriched.studentType) {
    enriched.studentType = enriched.program.startsWith("+2")
      ? "+2 graduate"
      : enriched.program.includes("A-Level") || enriched.program.includes("IB")
        ? "A-Level / IB graduate"
        : "Undergraduate student";
  }
  if (!enriched.pros) {
    enriched.pros = pickThemes(enriched.ratings, true);
  }
  if (!enriched.cons) {
    enriched.cons = pickThemes(enriched.ratings, false);
  }
  if (!enriched.advice) {
    enriched.advice =
      avg >= 4
        ? "Get involved early — clubs, projects and faculty office hours pay off."
        : "Visit the campus, talk to current students and weigh tuition against outcomes.";
  }
  return enriched;
});

function pickThemes(r: Ratings, positive: boolean): string[] {
  const POS: Record<Category, string> = {
    academics: "Strong academic rigor",
    teachers: "Supportive, knowledgeable teachers",
    facilities: "Modern, well-kept facilities",
    studentLife: "Active clubs and student life",
    careerSupport: "Real career and placement support",
    valueForMoney: "Great value for the tuition",
  };
  const NEG: Record<Category, string> = {
    academics: "Coursework pace can feel uneven",
    teachers: "Teaching quality varies by subject",
    facilities: "Cafeteria and seating need work",
    studentLife: "Few extracurricular options",
    careerSupport: "Career counseling could improve",
    valueForMoney: "Tuition feels high for what you get",
  };
  const items = (Object.keys(r) as Category[])
    .map((k) => ({ k, v: r[k] }))
    .sort((a, b) => (positive ? b.v - a.v : a.v - b.v))
    .slice(0, positive ? 3 : 2)
    .filter((x) => (positive ? x.v >= 4 : x.v <= 3))
    .map((x) => (positive ? POS[x.k] : NEG[x.k]));
  return items.length
    ? items
    : positive
      ? ["Solid overall experience"]
      : ["No major concerns reported"];
}

export function avgOverall(r: Ratings): number {
  const vals = Object.values(r);
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

export function collegeAverages(reviews: Review[]): Ratings {
  const acc: Ratings = {
    academics: 0,
    teachers: 0,
    facilities: 0,
    studentLife: 0,
    careerSupport: 0,
    valueForMoney: 0,
  };
  if (reviews.length === 0) return acc;
  for (const r of reviews) {
    (Object.keys(acc) as Category[]).forEach((k) => (acc[k] += r.ratings[k]));
  }
  (Object.keys(acc) as Category[]).forEach((k) => (acc[k] = +(acc[k] / reviews.length).toFixed(2)));
  return acc;
}

export function recommendationPct(reviews: Review[]): number {
  if (!reviews.length) return 0;
  const rec = reviews.filter((r) => r.recommend ?? avgOverall(r.ratings) >= 3.8).length;
  return Math.round((rec / reviews.length) * 100);
}

export function getCollege(slug: string) {
  return COLLEGES.find((c) => c.slug === slug);
}

// --- Admissions deadlines (relative to "today" so the dashboard always feels live) ---

export type Admission = {
  collegeSlug: string;
  program: string;
  deadline: string; // ISO date
  rounds: string;
};

function dateOffset(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export const ADMISSIONS: Admission[] = [
  {
    collegeSlug: "trinity-international-college",
    program: "+2 Science",
    deadline: dateOffset(9),
    rounds: "Main round",
  },
  {
    collegeSlug: "global-college-international",
    program: "IB Diploma",
    deadline: dateOffset(16),
    rounds: "Early + main",
  },
  {
    collegeSlug: "texas-international-college",
    program: "BSc CSIT",
    deadline: dateOffset(5),
    rounds: "Rolling",
  },
  {
    collegeSlug: "st-xaviers-college",
    program: "BSc Physics",
    deadline: dateOffset(21),
    rounds: "Main round",
  },
  {
    collegeSlug: "prime-college",
    program: "BSc CSIT",
    deadline: dateOffset(12),
    rounds: "Rolling",
  },
  {
    collegeSlug: "little-angels-college",
    program: "BBA",
    deadline: dateOffset(28),
    rounds: "Early + main",
  },
  {
    collegeSlug: "ace-institute-of-management",
    program: "BBA-BI",
    deadline: dateOffset(34),
    rounds: "Main round",
  },
  {
    collegeSlug: "reliance-international-academy",
    program: "A-Levels",
    deadline: dateOffset(7),
    rounds: "Early round",
  },
];

// --- Scholarships ---

export type Scholarship = {
  id: string;
  collegeSlug: string;
  name: string;
  deadline: string; // ISO date
  eligibility: string;
  amount: string;
};

export const SCHOLARSHIPS: Scholarship[] = [
  {
    id: "sch-1",
    collegeSlug: "st-xaviers-college",
    name: "Merit Excellence Award",
    deadline: dateOffset(18),
    eligibility: "Top 5% in entrance exam",
    amount: "Up to 100% tuition",
  },
  {
    id: "sch-2",
    collegeSlug: "global-college-international",
    name: "Global Thinkers Grant",
    deadline: dateOffset(25),
    eligibility: "IB Diploma applicants with 38+ predicted",
    amount: "NPR 200,000",
  },
  {
    id: "sch-3",
    collegeSlug: "trinity-international-college",
    name: "Science Achiever Scholarship",
    deadline: dateOffset(11),
    eligibility: "SEE GPA 3.8+ applying to +2 Science",
    amount: "50% tuition",
  },
  {
    id: "sch-4",
    collegeSlug: "prime-college",
    name: "Tech Innovators Scholarship",
    deadline: dateOffset(14),
    eligibility: "BSc CSIT applicants with coding portfolio",
    amount: "NPR 150,000",
  },
  {
    id: "sch-5",
    collegeSlug: "ace-institute-of-management",
    name: "Future Leaders Award",
    deadline: dateOffset(30),
    eligibility: "BBA applicants with leadership record",
    amount: "Up to 40% tuition",
  },
  {
    id: "sch-6",
    collegeSlug: "texas-international-college",
    name: "Access Scholarship",
    deadline: dateOffset(6),
    eligibility: "Need-based, all programs",
    amount: "NPR 80,000",
  },
  {
    id: "sch-7",
    collegeSlug: "little-angels-college",
    name: "Hospitality Excellence Grant",
    deadline: dateOffset(22),
    eligibility: "BHM applicants with industry interest",
    amount: "30% tuition",
  },
  {
    id: "sch-8",
    collegeSlug: "kathmandu-model-college",
    name: "Community Scholarship",
    deadline: dateOffset(19),
    eligibility: "First-generation college students",
    amount: "NPR 60,000",
  },
];

export function daysUntil(iso: string): number {
  const target = new Date(iso + "T23:59:59");
  const now = new Date();
  return Math.max(0, Math.ceil((target.getTime() - now.getTime()) / 86400000));
}

// --- AI semantic search ---

/** Map common student words to canonical search intents */
const SYNONYM_MAP: Record<string, string[]> = {
  cheap: ["affordable", "low fees", "budget", "value for money", "economical"],
  hostel: ["accommodation", "residence", "dormitory", "housing", "living"],
  sports: ["football", "basketball", "gym", "grounds", "fitness", "athletics", "cricket"],
  coding: [
    "programming",
    "software",
    "computer science",
    "it",
    "hackathons",
    "development",
    "bca",
    "csit",
  ],
  scholarship: ["financial aid", "discount", "merit", "need based", "grant", "fee waiver"],
  clubs: [
    "extracurricular",
    "activities",
    "societies",
    "events",
    "student life",
    "campus life",
    "fun",
  ],
  placements: [
    "career support",
    "jobs",
    "employment",
    "internships",
    "companies",
    "career",
    "job",
    "placement",
  ],
  academics: [
    "teaching quality",
    "faculty",
    "education",
    "coursework",
    "syllabus",
    "curriculum",
    "study",
    "learning",
  ],
  wifi: ["internet", "connectivity", "online", "network", "digital"],
  canteen: ["food", "cafeteria", "mess", "dining", "meals"],
  library: ["books", "reading", "study space", "resources", "reference"],
  research: ["lab work", "projects", "innovation", "discovery", "experiments"],
  practical: [
    "hands on",
    "lab work",
    "real world",
    "projects",
    "practical learning",
    "industry exposure",
  ],
  friendly: ["welcoming", "supportive", "helpful", "approachable", "kind"],
  environment: ["atmosphere", "vibe", "culture", "surroundings", "campus environment"],
  strict: ["discipline", "rules", "rigorous", "demanding", "serious"],
  attendance: ["present", "mandatory", "classes", "regular"],
  nightlife: ["evening", "social", "parties", "events", "activities after class"],
  international: ["global", "abroad", "foreign", "overseas", "uk degree", "us degree", "worldwide"],
  medical: ["mbbs", "nursing", "health", "medicine", "entrance", "pre-med"],
  engineering: ["be", "civil", "computer", "electrical", "electronics", "mechanical"],
  law: ["llb", "legal", "attorney", "lawyer", "justice", "court"],
  affordable: ["cheap", "budget", "low fees", "value", "economical", "reasonable"],
  uk: ["british", "london", "england", "uk degree", "uk accreditation", "united kingdom"],
  us: ["america", "usa", "united states", "american degree"],
  "uk degree": ["british", "london", "england", "uk", "uk accreditation", "international degree"],
  "us degree": ["america", "usa", "united states", "american", "international degree"],
};

const INTENTS: {
  match: string[];
  colleges?: string[];
  categories?: Category[];
  tags?: string[];
}[] = [
  // --- Category intents ---
  {
    match: [
      "academics",
      "academic",
      "rigorous",
      "tough",
      "studious",
      "teaching quality",
      "faculty",
      "education",
      "coursework",
      "syllabus",
      "curriculum",
      "study",
      "learning",
    ],
    categories: ["academics"],
  },
  {
    match: [
      "teachers",
      "faculty",
      "professor",
      "supportive teachers",
      "teaching",
      "instructor",
      "mentor",
    ],
    categories: ["teachers"],
  },
  {
    match: [
      "facilities",
      "campus",
      "infrastructure",
      "labs",
      "library",
      "wifi",
      "internet",
      "canteen",
      "food",
      "modern campus",
      "grounds",
      "classroom",
    ],
    categories: ["facilities"],
  },
  {
    match: [
      "student life",
      "campus life",
      "clubs",
      "extracurricular",
      "activities",
      "fun",
      "sports",
      "football",
      "basketball",
      "gym",
      "fitness",
      "societies",
      "events",
      "nightlife",
    ],
    categories: ["studentLife"],
  },
  {
    match: [
      "placements",
      "career support",
      "career",
      "job",
      "jobs",
      "internship",
      "internships",
      "placement",
      "employment",
      "companies",
      "corporate",
    ],
    categories: ["careerSupport"],
  },
  {
    match: [
      "affordable",
      "cheap",
      "value",
      "low fees",
      "budget",
      "value for money",
      "cheapest",
      "economical",
      "reasonable fees",
    ],
    categories: ["valueForMoney"],
  },
  {
    match: [
      "practical",
      "hands on",
      "projects",
      "lab work",
      "real world",
      "practical learning",
      "industry exposure",
    ],
    categories: ["academics", "facilities"],
  },
  // --- Program intents ---
  {
    match: ["bca", "computer application", "bachelor of computer application"],
    colleges: [
      "texas-international-college",
      "st-xaviers-college",
      "trinity-international-college",
      "islington-college",
      "herald-college-kathmandu",
      "padma-kanya-college",
      "kathmandu-college-of-management",
    ],
    tags: ["BCA"],
  },
  {
    match: ["bba", "bachelor of business administration"],
    colleges: [
      "ace-institute-of-management",
      "little-angels-college",
      "trinity-international-college",
      "kathmandu-model-college",
      "kathmandu-university-school-of-management",
      "apex-college",
      "prime-college",
      "kathmandu-college-of-management",
    ],
    tags: ["BBA"],
  },
  {
    match: ["csit", "bsc csit", "computer science", "software", "coding", "programming", "it"],
    colleges: [
      "texas-international-college",
      "prime-college",
      "kathmandu-model-college",
      "kathmandu-university-school-of-management",
    ],
    tags: ["BSc CSIT"],
  },
  {
    match: ["science", "+2 science", "physics", "biology", "chemistry", "medical", "entrance"],
    colleges: [
      "st-xaviers-college",
      "trinity-international-college",
      "texas-international-college",
    ],
    tags: ["+2 Science"],
  },
  {
    match: ["ib", "a-levels", "cambridge", "international baccalaureate", "alevel"],
    colleges: [
      "global-college-international",
      "reliance-international-academy",
      "islington-college",
      "herald-college-kathmandu",
      "british-college",
    ],
    tags: ["IB", "A-Levels"],
  },
  {
    match: ["management", "+2 management", "business"],
    colleges: ["trinity-international-college", "kathmandu-model-college", "dav-college"],
    tags: ["+2 Management"],
  },
  {
    match: ["hospitality", "bhm", "hotel", "hotel management"],
    colleges: ["little-angels-college", "kathmandu-college-of-management"],
    tags: ["BHM"],
  },
  {
    match: ["strict", "discipline", "rules", "administration"],
    colleges: ["st-xaviers-college"],
    tags: ["Strict but rewarding"],
  },
  {
    match: [
      "engineering",
      "civil",
      "electrical",
      "computer engineering",
      "be",
      "mechanical",
      "electronics",
    ],
    colleges: ["kathmandu-engineering-college", "kantipur-engineering-college"],
    tags: ["Engineering"],
  },
  {
    match: ["law", "legal", "llb", "attorney", "lawyer", "justice"],
    colleges: ["nepal-law-campus", "british-college"],
    tags: ["Law"],
  },
  {
    match: ["uk degree", "uk accreditation", "london", "british", "international degree", "uk"],
    colleges: ["islington-college", "herald-college-kathmandu", "british-college"],
    tags: ["UK degree"],
  },
  {
    match: ["women", "girls", "female", "womens college", "padma kanya"],
    colleges: ["padma-kanya-college"],
    tags: ["Women's college"],
  },
  {
    match: ["mba", "executive", "business school", "master of business administration"],
    colleges: [
      "ace-institute-of-management",
      "kathmandu-university-school-of-management",
      "apex-college",
      "prime-college",
      "british-college",
    ],
    tags: ["MBA"],
  },
  {
    match: ["bbs", "bachelor of business studies"],
    colleges: [
      "texas-international-college",
      "kathmandu-model-college",
      "dav-college",
      "st-xaviers-college",
      "apex-college",
      "nepal-law-campus",
      "padma-kanya-college",
    ],
    tags: ["BBS"],
  },
  {
    match: ["architecture", "architect"],
    colleges: ["kathmandu-engineering-college"],
    tags: ["Architecture"],
  },
  // --- Cross-cutting themes ---
  {
    match: ["scholarship", "financial aid", "merit", "grant", "fee waiver"],
    categories: ["valueForMoney"],
  },
  {
    match: ["research", "lab", "laboratory", "experiment"],
    categories: ["academics", "facilities"],
  },
  { match: ["library", "books", "reading", "study space"], categories: ["facilities"] },
  {
    match: [
      "sports",
      "football",
      "basketball",
      "gym",
      "fitness",
      "athletics",
      "cricket",
      "grounds",
    ],
    categories: ["studentLife"],
  },
  { match: ["canteen", "food", "cafeteria", "mess", "dining"], categories: ["facilities"] },
  {
    match: ["hostel", "accommodation", "residence", "dormitory", "housing"],
    categories: ["facilities"],
  },
  { match: ["wifi", "internet", "connectivity", "network"], categories: ["facilities"] },
  { match: ["friendly", "welcoming", "supportive", "helpful"], categories: ["teachers"] },
  {
    match: ["environment", "atmosphere", "vibe", "culture"],
    categories: ["studentLife", "facilities"],
  },
  { match: ["attendance", "mandatory", "regular", "present"], categories: ["studentLife"] },
  {
    match: ["international", "abroad", "global", "overseas"],
    colleges: [
      "global-college-international",
      "islington-college",
      "herald-college-kathmandu",
      "british-college",
    ],
    categories: ["careerSupport"],
  },
  {
    match: ["medical", "mbbs", "nursing", "health", "pre-med", "medicine"],
    colleges: ["st-xaviers-college", "trinity-international-college"],
    tags: ["Medical preparation"],
  },
  {
    match: ["competitive", "entrance", "exam preparation", "entrance exam"],
    categories: ["academics"],
  },
];

function expandWord(w: string): string[] {
  const lower = w.toLowerCase();
  const expanded = [lower];
  for (const [key, vals] of Object.entries(SYNONYM_MAP)) {
    if (key === lower || vals.some((v) => v === lower || v.includes(lower))) {
      expanded.push(key, ...vals);
    }
  }
  for (const [key, vals] of Object.entries(SYNONYM_MAP)) {
    if (lower.includes(key)) {
      expanded.push(key, ...vals);
    }
    for (const v of vals) {
      if (lower.includes(v) || v.includes(lower)) {
        expanded.push(key, ...vals);
        break;
      }
    }
  }
  return [...new Set(expanded)];
}

function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s+]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function fuzzyIncludes(text: string, query: string): boolean {
  const t = text.toLowerCase();
  const q = query.toLowerCase();
  if (t.includes(q)) return true;
  // fuzzy: allow missing/extra chars for short queries
  if (q.length >= 4) {
    const tokens = tokenize(t);
    return tokens.some((tok) => tok.length >= q.length - 1 && levenshtein(tok, q) <= 1);
  }
  return false;
}

function levenshtein(a: string, b: string): number {
  const m = a.length,
    n = b.length;
  if (!m) return n;
  if (!n) return m;
  const dp = Array.from({ length: m + 1 }, (_, i) => i);
  for (let j = 1; j <= n; j++) {
    let prev = dp[0];
    dp[0] = j;
    for (let i = 1; i <= m; i++) {
      const tmp = dp[i];
      dp[i] = Math.min(dp[i] + 1, dp[i - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = tmp;
    }
  }
  return dp[m];
}

export type AiSearchResult = {
  colleges: {
    college: College;
    score: number;
    reason: string;
    reasons: string[];
    avg: number;
    recPct: number;
  }[];
  reviews: Review[];
  summary: string;
  related: string[];
};

function scoreCollege(
  college: College,
  query: string,
  tokens: string[],
  matchedIntents: typeof INTENTS,
): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];
  const q = query.toLowerCase();
  const slug = college.slug;
  const collegeReviews = SEED_REVIEWS.filter((r) => r.collegeSlug === slug);

  // 1. EXACT COLLEGE NAME MATCH (+5)
  if (college.name.toLowerCase().includes(q)) {
    score += 5;
    reasons.push("matches your search");
  }

  // 2. METADATA MATCH (tagline, about, location, affiliations, tuition) (+1 to +3)
  const metadata =
    `${college.name} ${college.location} ${college.tagline} ${college.about} ${college.affiliations.join(" ")} ${college.tuitionRange} ${college.programs.join(" ")}`.toLowerCase();
  for (const tok of tokens) {
    if (tok.length < 2) continue;
    if (metadata.includes(tok)) {
      score += 2;
      if (!reasons.some((r) => r.includes(tok))) reasons.push(`offers ${tok}`);
    }
    const synonyms = expandWord(tok);
    for (const syn of synonyms) {
      if (syn !== tok && metadata.includes(syn)) {
        score += 1;
        if (!reasons.some((r) => r.includes(syn))) reasons.push(`related to "${syn}"`);
      }
    }
  }

  // 3. PROGRAM MATCH (+4 for each matching program)
  for (const p of college.programs) {
    const pLow = p.toLowerCase();
    if (q.includes(pLow) || pLow.includes(q) || tokens.some((t) => pLow.includes(t))) {
      score += 4;
      reasons.push(`offers ${p}`);
      break;
    }
  }

  // 4. INTENT MATCH (+4 for direct college match, +2 for strong category)
  for (const intent of matchedIntents) {
    if (intent.colleges?.includes(slug)) {
      score += 4;
      if (!reasons.some((r) => r.includes("matches your interest"))) {
        reasons.push("matches your interest");
      }
    }
    if (intent.categories?.length) {
      const avgs = collegeAverages(collegeReviews);
      for (const cat of intent.categories) {
        const val = avgs[cat];
        const catLabel = CATEGORIES.find((x) => x.key === cat)?.label.toLowerCase() ?? "";
        if (val >= 4) {
          score += 2;
          reasons.push(`strong ${catLabel}`);
        } else if (val >= 3.5) {
          score += 1;
          if (!reasons.some((r) => r.includes(catLabel))) reasons.push(`good ${catLabel}`);
        }
      }
    }
    if (intent.tags) {
      const allPros = collegeReviews.flatMap((r) => r.pros ?? []);
      for (const tag of intent.tags) {
        if (allPros.some((p) => p.toLowerCase().includes(tag.toLowerCase()))) {
          score += 2;
          if (!reasons.some((r) => r.includes(tag.toLowerCase())))
            reasons.push(`students mention "${tag.toLowerCase()}"`);
          break;
        }
      }
    }
  }

  // 5. REVIEW PROS/CONS MATCH
  const reviewText = collegeReviews
    .flatMap((r) => [...(r.pros ?? []), ...(r.cons ?? []), r.advice ?? "", r.body, r.title])
    .join(" ")
    .toLowerCase();
  for (const tok of tokens) {
    if (tok.length < 3) continue;
    if (reviewText.includes(tok)) {
      score += 1;
      const synonyms = expandWord(tok);
      for (const syn of synonyms) {
        if (syn !== tok && reviewText.includes(syn)) {
          score += 0.5;
        }
      }
    }
  }

  // 6. SPECIFIC REVIEW PHRASE MATCHING
  for (const r of collegeReviews) {
    const rText =
      `${r.title} ${r.body} ${(r.pros ?? []).join(" ")} ${(r.cons ?? []).join(" ")} ${r.advice ?? ""}`.toLowerCase();
    for (const tok of tokens) {
      if (tok.length < 3) continue;
      if (rText.includes(tok)) {
        score += 1.5;
        break;
      }
    }
  }

  // 7. RATING BOOST
  const avg = collegeReviews.length
    ? collegeReviews.reduce((s, r) => s + avgOverall(r.ratings), 0) / collegeReviews.length
    : 0;
  if (avg >= 4.5) score += 2;
  else if (avg >= 4.0) score += 1.5;
  else if (avg >= 3.5) score += 1;

  // 8. POPULARITY BOOST
  if (collegeReviews.length >= 20) score += 1;
  else if (collegeReviews.length >= 16) score += 0.5;

  return { score, reasons };
}

export function aiSearch(query: string): AiSearchResult {
  const q = query.trim().toLowerCase();
  if (!q) {
    return { colleges: [], reviews: [], summary: "", related: [] };
  }

  const tokens = tokenize(q);

  // Expand each token into its synonym set
  const expandedTokens = new Set<string>();
  for (const tok of tokens) {
    expandWord(tok).forEach((s) => expandedTokens.add(s));
  }
  const allTokens = [...new Set([...tokens, ...expandedTokens])];

  // Match intents using original tokens + expanded ones
  const matchedIntents = INTENTS.filter((intent) =>
    intent.match.some(
      (m) => q.includes(m) || allTokens.some((t) => t.includes(m) || m.includes(t)),
    ),
  );

  // Score each college
  const scored = COLLEGES.map((c) => {
    const { score, reasons } = scoreCollege(c, q, allTokens, matchedIntents);
    const reviews = SEED_REVIEWS.filter((r) => r.collegeSlug === c.slug);
    const avg = reviews.length
      ? reviews.reduce((s, r) => s + avgOverall(r.ratings), 0) / reviews.length
      : 0;
    return {
      college: c,
      score,
      reasons,
      reason: reasons[0] ?? "relevant result",
      avg,
      recPct: recommendationPct(reviews),
    };
  })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  // If no colleges matched via scoring, do a last-resort fallback on any token substring match in metadata
  if (scored.length === 0) {
    const fallback = COLLEGES.map((c) => {
      const haystack =
        `${c.name} ${c.location} ${c.programs.join(" ")} ${c.tagline} ${c.about}`.toLowerCase();
      let matchScore = 0;
      const matchReasons: string[] = [];
      for (const tok of tokens) {
        if (tok.length < 2) continue;
        if (haystack.includes(tok)) {
          matchScore += 1;
          matchReasons.push(`offers ${tok}`);
        }
      }
      if (matchScore > 0) {
        const reviews = SEED_REVIEWS.filter((r) => r.collegeSlug === c.slug);
        const avg = reviews.length
          ? reviews.reduce((s, r) => s + avgOverall(r.ratings), 0) / reviews.length
          : 0;
        return {
          college: c,
          score: matchScore,
          reasons: matchReasons,
          reason: matchReasons[0] ?? "matches",
          avg,
          recPct: recommendationPct(reviews),
        };
      }
      return null;
    })
      .filter(Boolean)
      .sort((a, b) => (b?.score ?? 0) - (a?.score ?? 0))
      .slice(0, 6) as NonNullable<(typeof scored)[0]>[];
    if (fallback.length === 0) {
      const topRated = [...COLLEGES]
        .map((c) => {
          const reviews = SEED_REVIEWS.filter((r) => r.collegeSlug === c.slug);
          const avg = reviews.length
            ? reviews.reduce((s, r) => s + avgOverall(r.ratings), 0) / reviews.length
            : 0;
          return {
            college: c,
            score: avg,
            reasons: ["popular choice"],
            reason: "popular choice",
            avg,
            recPct: recommendationPct(reviews),
          };
        })
        .sort((a, b) => b.avg - a.avg)
        .slice(0, 3);
      scored.push(...topRated);
    } else {
      scored.push(...fallback);
    }
  }

  // Reviews: match by body/title/pros/cons/program using expanded tokens
  const matchedReviews = SEED_REVIEWS.filter((r) => {
    const text =
      `${r.title} ${r.body} ${(r.pros ?? []).join(" ")} ${(r.cons ?? []).join(" ")} ${r.advice ?? ""} ${r.program}`.toLowerCase();
    if (fuzzyIncludes(text, q)) return true;
    return allTokens.some((tok) => tok.length >= 3 && text.includes(tok));
  })
    .sort((a, b) => b.helpful - a.helpful)
    .slice(0, 4);

  // AI summary with better phrase highlighting
  let summary = "";
  if (scored.length === 0 && matchedReviews.length === 0) {
    summary = `I couldn't find exact matches for "${query}". Try searching by program (BCA, BBA, +2 Science), a quality (academics, placements), or a college name.`;
  } else {
    const top2 = scored.slice(0, 2).map((s) => s.college.name);
    const topReasons = scored.slice(0, 3).flatMap((s) => s.reasons.slice(0, 2));
    const uniqueReasons = [...new Set(topReasons)].slice(0, 3);
    const reasonPhrase = uniqueReasons.length ? ` — ${uniqueReasons.join(", ")}` : "";
    summary = `Based on student reviews, ${top2.join(" and ")}${reasonPhrase}. ${
      matchedReviews.length
        ? `${matchedReviews.length} review${matchedReviews.length > 1 ? "s" : ""} matched what you're looking for.`
        : "Visit each profile to read more."
    }`;
  }

  // Related searches
  const relatedPool = [
    "Best academics",
    "Good BCA college",
    "Affordable colleges",
    "Friendly teachers",
    "Good campus life",
    "Best placements",
    "Strict administration",
    "Colleges for BBA",
    "Science colleges",
    "Colleges with great facilities",
    "Best engineering college",
    "Law colleges in Kathmandu",
    "UK degree programs",
    "Affordable BCA",
    "Best management college",
    "Women's colleges",
    "Cheap colleges",
    "Sports facilities",
    "Good for coding",
    "Scholarship available",
    "Hostel facilities",
    "Practical learning",
    "International degree",
  ];
  const related = relatedPool
    .filter((r) => r.toLowerCase() !== q && !r.toLowerCase().includes(q))
    .slice(0, 5);

  return { colleges: scored, reviews: matchedReviews, summary, related };
}

export const SEARCH_PLACEHOLDERS = [
  "Search colleges...",
  "Best college for BCA",
  "Best academics",
  "Affordable engineering colleges",
  "Colleges with great placements",
  "Best student life",
  "Good BBA college",
  "Friendly teachers",
  "Colleges for +2 Science",
];
