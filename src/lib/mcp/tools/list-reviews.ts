import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { SEED_REVIEWS } from "@/lib/edview-data";

export default defineTool({
  name: "list_reviews",
  title: "List reviews",
  description: "List student reviews for a college, most recent first.",
  inputSchema: {
    slug: z.string().min(1).describe("College slug."),
    limit: z.number().int().min(1).max(50).optional().describe("Max reviews to return (default 10)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ slug, limit }) => {
    const reviews = SEED_REVIEWS.filter((r) => r.collegeSlug === slug)
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, limit ?? 10);
    return {
      content: [{ type: "text", text: JSON.stringify(reviews, null, 2) }],
      structuredContent: { reviews },
    };
  },
});
