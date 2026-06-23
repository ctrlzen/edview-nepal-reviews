import { useEffect, useState, useCallback } from "react";
import { SEED_REVIEWS, type Review } from "./edview-data";

const REVIEWS_KEY = "edview.reviews.v1";
const VOTES_KEY = "edview.votes.v1";

type Votes = Record<string, "up" | "down" | undefined>;

function readReviews(): Review[] {
  if (typeof window === "undefined") return SEED_REVIEWS;
  try {
    const raw = localStorage.getItem(REVIEWS_KEY);
    if (!raw) return SEED_REVIEWS;
    const parsed = JSON.parse(raw) as Review[];
    return [...SEED_REVIEWS, ...parsed.filter((r) => !r.id.startsWith("seed-"))];
  } catch {
    return SEED_REVIEWS;
  }
}

function readVotes(): Votes {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(VOTES_KEY) || "{}") as Votes;
  } catch {
    return {};
  }
}

export function useReviews() {
  const [reviews, setReviews] = useState<Review[]>(SEED_REVIEWS);
  const [votes, setVotes] = useState<Votes>({});

  useEffect(() => {
    setReviews(readReviews());
    setVotes(readVotes());
  }, []);

  const addReview = useCallback((review: Review) => {
    setReviews((prev) => {
      const next = [review, ...prev];
      const userOnly = next.filter((r) => !r.id.startsWith("seed-"));
      localStorage.setItem(REVIEWS_KEY, JSON.stringify(userOnly));
      return next;
    });
  }, []);

  const vote = useCallback((reviewId: string, dir: "up" | "down") => {
    setVotes((prev) => {
      const current = prev[reviewId];
      const next = { ...prev, [reviewId]: current === dir ? undefined : dir };
      localStorage.setItem(VOTES_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { reviews, votes, addReview, vote };
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
