import { defineMcp } from "@lovable.dev/mcp-js";
import listCollegesTool from "./tools/list-colleges";
import getCollegeTool from "./tools/get-college";
import listReviewsTool from "./tools/list-reviews";

export default defineMcp({
  name: "edview-mcp",
  title: "EdView MCP",
  version: "0.1.0",
  instructions:
    "Tools for EdView, a college review platform for Kathmandu, Nepal. Use `list_colleges` to browse, `get_college` for a profile with category ratings, and `list_reviews` to read student reviews.",
  tools: [listCollegesTool, getCollegeTool, listReviewsTool],
});
