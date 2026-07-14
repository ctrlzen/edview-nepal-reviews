import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";

type SavedCollege = {
  college_slug: string;
  created_at: string;
};

export function useSavedColleges() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const { data: saved = [], isLoading, refetch } = useQuery({
    queryKey: ["saved", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<SavedCollege[]> => {
      const { data, error } = await supabase
        .from("saved_colleges")
        .select("college_slug, created_at")
        .order("created_at", { ascending: false });

      if (error) {
        // Table may not exist yet; return empty instead of throwing
        if (error.code === "42P01") return [];
        throw error;
      }
      return (data as SavedCollege[]) ?? [];
    },
  });

  const isSaved = useMutation({
    mutationFn: async (collegeSlug: string) => {
      if (!user) throw new Error("Must be signed in to save colleges");
      const { error } = await supabase.from("saved_colleges").insert({
        user_id: user.id,
        college_slug: collegeSlug,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["saved", user?.id] });
    },
  });

  const unsave = useMutation({
    mutationFn: async (collegeSlug: string) => {
      if (!user) throw new Error("Must be signed in to unsave colleges");
      const { error } = await supabase.from("saved_colleges").delete().eq("user_id", user.id).eq("college_slug", collegeSlug);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["saved", user?.id] });
    },
  });

  const save = useMutation({
    mutationFn: async (collegeSlug: string) => {
      if (!user) throw new Error("Must be signed in to save colleges");
      const { error } = await supabase.from("saved_colleges").insert({
        user_id: user.id,
        college_slug: collegeSlug,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["saved", user?.id] });
    },
  });

  const toggleSaved = useCallback(
    (collegeSlug: string) => {
      const slugs = new Set(saved.map((s) => s.college_slug));
      if (slugs.has(collegeSlug)) {
        unsave.mutate(collegeSlug);
      } else {
        save.mutate(collegeSlug);
      }
    },
    [saved, save, unsave],
  );

  return {
    saved,
    isLoading,
    isSubmitting: save.isPending || isSaved.isPending || unsave.isPending,
    savedSlugs: new Set(saved.map((s) => s.college_slug)),
    save,
    unsave,
    toggleSaved,
    refetch,
  };
}
