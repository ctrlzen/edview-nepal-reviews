import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { COLLEGES, SEED_REVIEWS, collegeAverages, avgOverall, recommendationPct } from "@/lib/edview-data";

export default defineTool({
  name: "list_colleges",
  title: "List colleges",
  description: "List all colleges on EdView with overall rating, review count, and recommendation percentage.",
  inputSchema: {
    search: z.string().optional().describe("Optional case-insensitive name/location filter."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ search }) => {
    const q = search?.trim().toLowerCase() ?? "";
    const items = COLLEGES.filter(
      (c) => !q || c.name.toLowerCase().includes(q) || c.location.toLowerCase().includes(q),
    ).map((c) => {
      const reviews = SEED_REVIEWS.filter((r) => r.collegeSlug === c.slug);
      const averages = collegeAverages(reviews);
      return {
        slug: c.slug,
        name: c.name,
        location: c.location,
        tagline: c.tagline,
        reviewCount: reviews.length,
        overallRating: +avgOverall(averages).toFixed(2),
        recommendPct: recommendationPct(reviews),
      };
    });
    return {
      content: [{ type: "text", text: JSON.stringify(items, null, 2) }],
      structuredContent: { colleges: items },
    };
  },
});
