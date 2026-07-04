import { createFileRoute } from "@tanstack/react-router";
import { PremiumLayout } from "@/components/edview/PremiumLayout";

export const Route = createFileRoute("/_authenticated/premium")({
  ssr: false,
  head: () => ({ meta: [{ title: "Premium Dashboard — EdView" }] }),
  component: PremiumLayout,
});
