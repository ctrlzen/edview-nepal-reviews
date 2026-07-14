import { useSavedColleges } from "@/hooks/useSavedColleges";
import { Heart } from "lucide-react";

export function SaveCollegeButton({ collegeSlug }: { collegeSlug: string }) {
  const { savedSlugs, toggleSaved, isSubmitting } = useSavedColleges();
  const saved = savedSlugs.has(collegeSlug);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        toggleSaved(collegeSlug);
      }}
      disabled={isSubmitting}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
        saved
          ? "border-red-200 bg-red-50 text-red-600 hover:border-red-300"
          : "border-border hover:border-red-200 hover:text-red-500"
      }`}
      aria-label={saved ? "Unsave college" : "Save college"}
    >
      <Heart className={`h-3.5 w-3.5 ${saved ? "fill-current" : ""}`} />
      {saved ? "Saved" : "Save"}
    </button>
  );
}