import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'property-favorites';
const FavoritesContext = createContext(null);

function readStoredFavorites() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function FavoritesProvider({ children }) {
  const [favoriteIds, setFavoriteIds] = useState(readStoredFavorites);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  const value = useMemo(() => ({
    favoriteIds,
    isFavorite: (propertyId) => favoriteIds.includes(String(propertyId)),
    toggleFavorite: (propertyId) => {
      const id = String(propertyId);
      setFavoriteIds((current) => (
        current.includes(id)
          ? current.filter((favoriteId) => favoriteId !== id)
          : [...current, id]
      ));
    },
  }), [favoriteIds]);

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (!context) {
    return {
      favoriteIds: [],
      isFavorite: () => false,
      toggleFavorite: () => {},
    };
  }

  return context;
}
