import { useEffect, useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "./supabase/client";
import type { ReviewRow } from "./supabase/types";
import { type Review } from "./edview-data";

const VOTES_KEY = "edview.votes.v1";

type Votes = Record<string, "up" | "down" | undefined>;

function readVotes(): Votes {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(VOTES_KEY) || "{}") as Votes;
  } catch {
    return {};
  }
}

function writeVotes(votes: Votes) {
  if (typeof window === "undefined") return;
  localStorage.setItem(VOTES_KEY, JSON.stringify(votes));
}

/** Map a Supabase row to the app's Review type. */
function rowToReview(row: ReviewRow): Review {
  return {
    id: row.id,
    collegeSlug: row.college_name,
    author: row.student_name,
    program: row.program,
    year: row.graduation_year,
    date: row.created_at.slice(0, 10),
    title: row.review_title,
    body: row.review_text,
    ratings: {
      academics: row.academics,
      teachers: row.teachers,
      facilities: row.facilities,
      studentLife: row.student_life,
      careerSupport: row.career_support,
      valueForMoney: row.value_for_money,
    },
    helpful: 0,
    notHelpful: 0,
  };
}

/** Map a Review into the shape Supabase expects for INSERT. */
function reviewToRow(review: Review): Omit<ReviewRow, "id" | "created_at"> {
  return {
    college_name: review.collegeSlug,
    student_name: review.author,
    program: review.program,
    graduation_year: review.year,
    academics: review.ratings.academics,
    teachers: review.ratings.teachers,
    facilities: review.ratings.facilities,
    student_life: review.ratings.studentLife,
    career_support: review.ratings.careerSupport,
    value_for_money: review.ratings.valueForMoney,
    review_title: review.title,
    review_text: review.body,
  };
}

const REVIEWS_QUERY_KEY = ["reviews"] as const;

/**
 * React Query hook that fetches all reviews from Supabase
 * and merges them with seed data for fallback.
 */
export function useReviews() {
  const queryClient = useQueryClient();

  // --- Fetch reviews from Supabase ---
  const { data: supabaseReviews = [], isLoading } = useQuery({
    queryKey: REVIEWS_QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        // If the reviews table doesn't exist yet, return empty
        if (error.code === "42P01") {
          console.warn("Supabase 'reviews' table not found. Returning empty.");
          return [];
        }
        throw error;
      }

      return (data ?? []).map(rowToReview);
    },
    staleTime: 30_000, // 30s before re-fetch
  });

  const allReviews = supabaseReviews;

  // --- Local votes ---
  const [votes, setVotes] = useState<Votes>({});

  useEffect(() => {
    setVotes(readVotes());
  }, []);

  const vote = useCallback((reviewId: string, dir: "up" | "down") => {
    setVotes((prev) => {
      const current = prev[reviewId];
      const next = { ...prev, [reviewId]: current === dir ? undefined : dir };
      writeVotes(next);
      return next;
    });
  }, []);

  // --- Add review mutation ---
  const addReviewMutation = useMutation({
    mutationFn: async (review: Review) => {
      const row = reviewToRow(review);
      const { data, error } = await supabase.from("reviews").insert(row).select().single();

      if (error) throw error;
      return rowToReview(data);
    },
    onSuccess: () => {
      // Invalidate the reviews query so the list refreshes
      queryClient.invalidateQueries({ queryKey: REVIEWS_QUERY_KEY });
    },
  });

  const addReview = useCallback(
    (review: Review) => {
      addReviewMutation.mutate(review);
    },
    [addReviewMutation],
  );

  const addReviewAsync = useCallback(
    async (review: Review): Promise<Review> => {
      return addReviewMutation.mutateAsync(review);
    },
    [addReviewMutation],
  );

  // --- Remove review ---
  const removeReviewMutation = useMutation({
    mutationFn: async (reviewId: string) => {
      const { error } = await supabase.from("reviews").delete().eq("id", reviewId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REVIEWS_QUERY_KEY });
    },
  });

  const removeReview = useCallback(
    (reviewId: string) => {
      removeReviewMutation.mutate(reviewId);
    },
    [removeReviewMutation],
  );

  return {
    reviews: allReviews,
    votes,
    vote,
    addReview,
    addReviewAsync,
    removeReview,
    isLoading,
    isSubmitting: addReviewMutation.isPending,
    isSuccess: addReviewMutation.isSuccess,
  };
}

export function applyVotes(review: Review, votes: Votes) {
  const v = votes[review.id];
  return {
    ...review,
    helpful: review.helpful + (v === "up" ? 1 : 0),
    notHelpful: review.notHelpful + (v === "down" ? 1 : 0),
    myVote: v,
  };
}