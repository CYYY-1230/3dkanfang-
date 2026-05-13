import { useEffect, useMemo, useState } from "react";

const FAVORITES_KEY = "3d-house-viewer:favorites";

function readStoredFavorites() {
  try {
    const rawValue = window.localStorage.getItem(FAVORITES_KEY);
    const parsed = rawValue ? JSON.parse(rawValue) : [];
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
}

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    return readStoredFavorites();
  });

  useEffect(() => {
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === FAVORITES_KEY) {
        setFavoriteIds(readStoredFavorites());
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const favoriteSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);

  const isFavorite = (layoutId: string) => favoriteSet.has(layoutId);

  const toggleFavorite = (layoutId: string) => {
    setFavoriteIds((current) =>
      current.includes(layoutId)
        ? current.filter((id) => id !== layoutId)
        : [...current, layoutId],
    );
  };

  const removeFavorite = (layoutId: string) => {
    setFavoriteIds((current) => current.filter((id) => id !== layoutId));
  };

  return {
    favoriteIds,
    favoriteCount: favoriteIds.length,
    isFavorite,
    toggleFavorite,
    removeFavorite,
  };
}
