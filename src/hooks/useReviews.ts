"use client";

import { useState, useEffect, useCallback } from "react";

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  content: string;
  likes: number;
  createdAt: string;
}

export function useReviews(toolId: string, toolType: string = "resource") {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState({ avg: 0, count: 0 });
  const [loading, setLoading] = useState(false);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reviews?toolId=${toolId}&toolType=${toolType}`);
      const data = await res.json();
      setReviews(data.reviews || []);
      setRating(data.rating || { avg: 0, count: 0 });
    } catch {}
    setLoading(false);
  }, [toolId, toolType]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const submit = useCallback(async (userId: string, userName: string, rating: number, content: string) => {
    try {
      await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, userName, toolId, toolType, rating, content }),
      });
      await fetchReviews();
      return true;
    } catch {
      return false;
    }
  }, [toolId, toolType, fetchReviews]);

  return { reviews, rating, loading, submit, refresh: fetchReviews };
}
