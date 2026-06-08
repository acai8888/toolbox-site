"use client";

import { useState, useEffect, useCallback } from "react";

export function useFavorites(userId?: string) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    fetch(`/api/favorites?userId=${userId}`)
      .then((r) => r.json())
      .then((data) => setFavorites(data.map((f: { toolId: string }) => f.toolId)))
      .catch(() => {});
  }, [userId]);

  const toggle = useCallback(async (toolId: string, toolType: string) => {
    if (!userId) return false;
    const isFav = favorites.includes(toolId);
    try {
      await fetch("/api/favorites", {
        method: isFav ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, toolId, toolType }),
      });
      setFavorites((prev) => isFav ? prev.filter((id) => id !== toolId) : [...prev, toolId]);
      return true;
    } catch {
      return false;
    }
  }, [userId, favorites]);

  return { favorites, toggle, loading };
}
