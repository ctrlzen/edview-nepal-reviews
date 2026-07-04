import {
  SEED_REVIEWS,
  CATEGORIES,
  avgOverall,
  collegeAverages,
  recommendationPct,
  type Review,
  type Category,
  type Ratings,
} from "./edview-data";

export type KpiData = {
  overallRating: number;
  reputationScore: number;
  recommendationPct: number;
  totalReviews: number;
  verifiedReviews: number;
  monthlyGrowth: number;
  studentSatisfaction: number;
  activeStudents: number;
};

export type Sentiment = "positive" | "neutral" | "negative";

export type TopicAnalysis = {
  topic: string;
  emoji: string;
  mentions: number;
  positivePct: number;
  negativePct: number;
};

export type RatingTrendPoint = {
  month: string;
  rating: number;
  reviews: number;
};

export type SentimentTrendPoint = {
  month: string;
  positive: number;
  neutral: number;
  negative: number;
};

export type AiInsight = {
  summary: string;
  strengths: string[];
  concerns: string[];
  improvements: string[];
};

const TOPIC_MAP: { keywords: string[]; topic: string; emoji: string }[] = [
  { keywords: ["faculty", "teacher", "professor", "teaching"], topic: "Faculty", emoji: "📚" },
  { keywords: ["infrastructure", "campus", "building", "classroom", "facility", "facilities"], topic: "Infrastructure", emoji: "🏢" },
  { keywords: ["wifi", "internet", "network", "connection"], topic: "WiFi", emoji: "📶" },
  { keywords: ["parking", "park", "vehicle", "bike"], topic: "Parking", emoji: "🚗" },
  { keywords: ["cafeteria", "canteen", "food", "lunch", "meal"], topic: "Cafeteria", emoji: "🍽" },
  { keywords: ["library", "books", "study material", "reference"], topic: "Library", emoji: "📖" },
  { keywords: ["lab", "laboratory", "equipment", "practical"], topic: "Labs", emoji: "🔬" },
  { keywords: ["placement", "career", "job", "internship", "company"], topic: "Placements", emoji: "💼" },
  { keywords: ["administration", "admin", "office", "staff", "delay", "process"], topic: "Administration", emoji: "📋" },
  { keywords: ["club", "activity", "event", "extracurricular", "sports"], topic: "Student Life", emoji: "🎯" },
  { keywords: ["fee", "tuition", "cost", "expensive", "affordable", "scholarship"], topic: "Fees", emoji: "💰" },
  { keywords: ["exam", "test", "assessment", "evaluation"], topic: "Exams", emoji: "📝" },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function monthLabel(dateStr: string): string {
  const d = new Date(dateStr);
  return `${MONTHS[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`;
}

function getReviewText(r: Review): string {
  return `${r.title} ${r.body} ${(r.pros ?? []).join(" ")} ${(r.cons ?? []).join(" ")} ${r.advice ?? ""}`.toLowerCase();
}

function classifySentiment(r: Review): Sentiment {
  const avg = avgOverall(r.ratings);
  if (avg >= 4) return "positive";
  if (avg >= 3) return "neutral";
  return "negative";
}

export function computeKpis(reviews: Review[]): KpiData {
  const overall = reviews.length
    ? reviews.reduce((s, r) => s + avgOverall(r.ratings), 0) / reviews.length
    : 0;
  const averages = collegeAverages(reviews);
  const recommend = recommendationPct(reviews);
  const verified = reviews.filter((r) => r.studentType && !r.studentType.includes("visitor")).length;

  const now = new Date();
  const thisMonth = reviews.filter((r) => {
    const d = new Date(r.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;
  const lastMonth = reviews.filter((r) => {
    const d = new Date(r.date);
    const lm = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    return d.getMonth() === lm.getMonth() && d.getFullYear() === lm.getFullYear();
  }).length;
  const growth = lastMonth === 0 ? (thisMonth > 0 ? 100 : 0) : Math.round(((thisMonth - lastMonth) / lastMonth) * 100);

  const satisfaction = averages.studentLife > 0
    ? Math.round(((averages.academics + averages.teachers + averages.studentLife) / 15) * 100)
    : 0;

  const reputation = Math.round(
    overall * 16 + recommend * 0.3 + (verified / Math.max(reviews.length, 1)) * 10,
  );

  return {
    overallRating: +overall.toFixed(2),
    reputationScore: Math.min(100, reputation),
    recommendationPct: recommend,
    totalReviews: reviews.length,
    verifiedReviews: verified,
    monthlyGrowth: growth,
    studentSatisfaction: satisfaction,
    activeStudents: reviews.length * 47 + 312,
  };
}

export function ratingTrend(reviews: Review[]): RatingTrendPoint[] {
  const byMonth = new Map<string, Review[]>();
  for (const r of reviews) {
    const label = monthLabel(r.date);
    if (!byMonth.has(label)) byMonth.set(label, []);
    byMonth.get(label)!.push(r);
  }
  const sorted = [...byMonth.entries()].sort((a, b) => {
    const [am, ay] = a[0].split(" ");
    const [bm, by] = b[0].split(" ");
    const aIdx = MONTHS.indexOf(am) + parseInt(ay) * 12;
    const bIdx = MONTHS.indexOf(bm) + parseInt(by) * 12;
    return aIdx - bIdx;
  });
  return sorted.map(([month, revs]) => ({
    month,
    rating: +(revs.reduce((s, r) => s + avgOverall(r.ratings), 0) / revs.length).toFixed(2),
    reviews: revs.length,
  }));
}

export function sentimentTrend(reviews: Review[]): SentimentTrendPoint[] {
  const byMonth = new Map<string, Review[]>();
  for (const r of reviews) {
    const label = monthLabel(r.date);
    if (!byMonth.has(label)) byMonth.set(label, []);
    byMonth.get(label)!.push(r);
  }
  const sorted = [...byMonth.entries()].sort((a, b) => {
    const [am, ay] = a[0].split(" ");
    const [bm, by] = b[0].split(" ");
    const aIdx = MONTHS.indexOf(am) + parseInt(ay) * 12;
    const bIdx = MONTHS.indexOf(bm) + parseInt(by) * 12;
    return aIdx - bIdx;
  });
  return sorted.map(([month, revs]) => {
    const pos = revs.filter((r) => classifySentiment(r) === "positive").length;
    const neg = revs.filter((r) => classifySentiment(r) === "negative").length;
    const neu = revs.length - pos - neg;
    return {
      month,
      positive: Math.round((pos / revs.length) * 100),
      neutral: Math.round((neu / revs.length) * 100),
      negative: Math.round((neg / revs.length) * 100),
    };
  });
}

export function reviewGrowth(reviews: Review[]): { month: string; cumulative: number; newReviews: number }[] {
  const byMonth = new Map<string, number>();
  for (const r of reviews) {
    const label = monthLabel(r.date);
    byMonth.set(label, (byMonth.get(label) ?? 0) + 1);
  }
  const sorted = [...byMonth.entries()].sort((a, b) => {
    const [am, ay] = a[0].split(" ");
    const [bm, by] = b[0].split(" ");
    const aIdx = MONTHS.indexOf(am) + parseInt(ay) * 12;
    const bIdx = MONTHS.indexOf(bm) + parseInt(by) * 12;
    return aIdx - bIdx;
  });
  let cumulative = 0;
  return sorted.map(([month, newReviews]) => {
    cumulative += newReviews;
    return { month, cumulative, newReviews };
  });
}

export function categoryRatings(reviews: Review[]): { category: string; rating: number }[] {
  const avgs = collegeAverages(reviews);
  return CATEGORIES.map(({ key, label }) => ({
    category: label,
    rating: avgs[key as Category],
  }));
}

export function analyzeTopics(reviews: Review[]): TopicAnalysis[] {
  const topicData = new Map<string, { mentions: number; positive: number; negative: number }>();

  for (const r of reviews) {
    const text = getReviewText(r);
    const sentiment = classifySentiment(r);
    for (const { keywords, topic } of TOPIC_MAP) {
      const matched = keywords.some((kw) => text.includes(kw));
      if (matched) {
        if (!topicData.has(topic)) topicData.set(topic, { mentions: 0, positive: 0, negative: 0 });
        const d = topicData.get(topic)!;
        d.mentions++;
        if (sentiment === "positive") d.positive++;
        if (sentiment === "negative") d.negative++;
      }
    }
  }

  return [...topicData.entries()]
    .map(([topic, d]) => {
      const emoji = TOPIC_MAP.find((t) => t.topic === topic)?.emoji ?? "📌";
      return {
        topic,
        emoji,
        mentions: d.mentions,
        positivePct: d.mentions ? Math.round((d.positive / d.mentions) * 100) : 0,
        negativePct: d.mentions ? Math.round((d.negative / d.mentions) * 100) : 0,
      };
    })
    .sort((a, b) => b.mentions - a.mentions);
}

export function generateAiInsights(reviews: Review[]): AiInsight {
  if (!reviews.length) {
    return {
      summary: "No reviews yet. Once students start reviewing, AI-generated insights will appear here automatically.",
      strengths: [],
      concerns: [],
      improvements: ["Encourage verified students to leave reviews to unlock AI insights."],
    };
  }

  const averages = collegeAverages(reviews);
  const sorted = CATEGORIES.map(({ key, label }) => ({
    label,
    key: key as Category,
    value: averages[key as Category],
  })).sort((a, b) => b.value - a.value);

  const strengths = sorted.filter((s) => s.value >= 4).slice(0, 3).map((s) => s.label);
  const concerns = [...sorted].reverse().filter((s) => s.value <= 3.5).slice(0, 3).map((s) => s.label);

  const topics = analyzeTopics(reviews);
  const topConcernTopics = topics.filter((t) => t.negativePct > 30).slice(0, 2).map((t) => t.topic.toLowerCase());

  const improvements: string[] = [];
  if (concerns.length) {
    improvements.push(`Focus on improving ${concerns[0].toLowerCase()} — it's your lowest-rated category.`);
  }
  if (topConcernTopics.length) {
    improvements.push(`Address student concerns about ${topConcernTopics.join(" and ")} based on review sentiment.`);
  }
  const recommend = recommendationPct(reviews);
  if (recommend < 70) {
    improvements.push("Work on converting neutral reviewers into promoters by addressing their specific feedback.");
  }
  if (improvements.length < 2) {
    improvements.push("Maintain your strengths while gathering more reviews to identify emerging trends.");
  }

  const topStrengthText = strengths.length ? strengths.join(", ") : "balanced performance";
  const topConcernText = concerns.length ? concerns.join(", ") : "no major concerns";
  const summary = `Students highly appreciate ${topStrengthText}. The most common concerns are ${topConcernText}. ${recommend >= 75 ? "Overall sentiment is strongly positive." : "There's room for improvement in key areas."}`;

  return { summary, strengths, concerns, improvements };
}

export function getReviewSentiment(r: Review): Sentiment {
  return classifySentiment(r);
}

export function searchReviews(reviews: Review[], query: string): Review[] {
  if (!query.trim()) return reviews;
  const q = query.toLowerCase();
  return reviews.filter((r) => {
    const text = `${r.title} ${r.body} ${r.author} ${r.program} ${(r.pros ?? []).join(" ")} ${(r.cons ?? []).join(" ")}`.toLowerCase();
    return text.includes(q);
  });
}

export function filterReviews(
  reviews: Review[],
  filters: { rating?: number; program?: string; batch?: string; sentiment?: Sentiment },
): Review[] {
  return reviews.filter((r) => {
    if (filters.rating && Math.round(avgOverall(r.ratings)) !== filters.rating) return false;
    if (filters.program && filters.program !== "all" && r.program !== filters.program) return false;
    if (filters.batch && filters.batch !== "all" && r.year !== filters.batch) return false;
    if (filters.sentiment && classifySentiment(r) !== filters.sentiment) return false;
    return true;
  });
}

export type SortOption = "newest" | "most_helpful" | "lowest" | "highest";

export function sortReviews(reviews: Review[], sort: SortOption): Review[] {
  const sorted = [...reviews];
  switch (sort) {
    case "newest":
      return sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    case "most_helpful":
      return sorted.sort((a, b) => b.helpful - a.helpful);
    case "lowest":
      return sorted.sort((a, b) => avgOverall(a.ratings) - avgOverall(b.ratings));
    case "highest":
      return sorted.sort((a, b) => avgOverall(b.ratings) - avgOverall(a.ratings));
  }
}

export function getPrograms(reviews: Review[]): string[] {
  return [...new Set(reviews.map((r) => r.program))].sort();
}

export function getBatches(reviews: Review[]): string[] {
  return [...new Set(reviews.map((r) => r.year))].sort().reverse();
}

export function topCompliments(reviews: Review[]): string[] {
  const pros = reviews.flatMap((r) => r.pros ?? []);
  const counts = new Map<string, number>();
  for (const p of pros) counts.set(p, (counts.get(p) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([p]) => p);
}

export function topComplaints(reviews: Review[]): string[] {
  const cons = reviews.flatMap((r) => r.cons ?? []);
  const counts = new Map<string, number>();
  for (const c of cons) counts.set(c, (counts.get(c) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([c]) => c);
}

export type Notification = {
  id: string;
  type: "new_review" | "rating_up" | "rating_down" | "report_ready" | "renewal";
  title: string;
  message: string;
  date: string;
  read: boolean;
};

export function generateNotifications(reviews: Review[], collegeName: string): Notification[] {
  const notifs: Notification[] = [];
  const sorted = [...reviews].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (sorted[0]) {
    notifs.push({
      id: "n1",
      type: "new_review",
      title: "New review posted",
      message: `${sorted[0].author} left a ${Math.round(avgOverall(sorted[0].ratings))}-star review for ${collegeName}.`,
      date: sorted[0].date,
      read: false,
    });
  }

  const trend = ratingTrend(reviews);
  if (trend.length >= 2) {
    const last = trend[trend.length - 1];
    const prev = trend[trend.length - 2];
    if (last.rating > prev.rating) {
      notifs.push({
        id: "n2",
        type: "rating_up",
        title: "Rating increased",
        message: `Your overall rating went up from ${prev.rating} to ${last.rating} this month.`,
        date: last.month,
        read: false,
      });
    } else if (last.rating < prev.rating) {
      notifs.push({
        id: "n2",
        type: "rating_down",
        title: "Rating dropped",
        message: `Your overall rating dropped from ${prev.rating} to ${last.rating} this month.`,
        date: last.month,
        read: false,
      });
    }
  }

  notifs.push({
    id: "n3",
    type: "report_ready",
    title: "Monthly report ready",
    message: `Your monthly analytics report for ${collegeName} is ready to download.`,
    date: new Date().toISOString().slice(0, 10),
    read: true,
  });

  notifs.push({
    id: "n4",
    type: "renewal",
    title: "Premium renewal reminder",
    message: "Your Premium subscription renews in 14 days. Update your payment method to avoid interruption.",
    date: new Date().toISOString().slice(0, 10),
    read: true,
  });

  return notifs;
}
