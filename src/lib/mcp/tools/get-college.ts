import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { getCollege, SEED_REVIEWS, collegeAverages, avgOverall, recommendationPct } from "@/lib/edview-data";

export default defineTool({
  name: "get_college",
  title: "Get college profile",
  description: "Get full profile for a college including category averages and recommendation rate.",
  inputSchema: {
    slug: z.string().min(1).describe("College slug, e.g. 'st-xaviers-college'."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ slug }) => {
    const college = getCollege(slug);
    if (!college) {
      return { content: [{ type: "text", text: `No college found with slug '${slug}'.` }], isError: true };
    }
    const reviews = SEED_REVIEWS.filter((r) => r.collegeSlug === slug);
    const averages = collegeAverages(reviews);
    const payload = {
      ...college,
      reviewCount: reviews.length,
      overallRating: +avgOverall(averages).toFixed(2),
      recommendPct: recommendationPct(reviews),
      categoryAverages: averages,
    };
    return {
      content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
      structuredContent: { college: payload },
    };
  },
});
