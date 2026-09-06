import React, { useEffect, useState } from 'react';
import { fetchProperties } from '../api/client';
import { PropertyCard } from '../components/PropertyCard';
import { useFavorites } from '../hooks/useFavorites';

export function FavoritesPage() {
  const { favoriteIds, isFavorite, toggleFavorite } = useFavorites();
  const [favoriteProperties, setFavoriteProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isCancelled = false;

    async function loadFavorites() {
      if (favoriteIds.length === 0) {
        setFavoriteProperties([]);
        setLoading(false);
        return;
      }

      try {
        const data = await fetchProperties({ limit: 200 });
        if (isCancelled) return;

        const filtered = (data.results || []).filter((property) =>
          favoriteIds.includes(String(property.id || property.L_ListingID))
        );
        setFavoriteProperties(filtered);
      } catch (loadError) {
        if (!isCancelled) {
          setError(loadError.message);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    loadFavorites();

    return () => {
      isCancelled = true;
    };
  }, [favoriteIds]);

  if (loading) {
    return <div className="loading-state">Loading favorites...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="favorites-page">
      <h2>Favorite properties</h2>
      {favoriteProperties.length === 0 ? (
        <div className="no-results">
          <p>You do not have any saved favorites yet.</p>
        </div>
      ) : (
        <div className="property-grid">
          {favoriteProperties.map((property) => (
            <PropertyCard
              key={property.id || property.L_ListingID}
              property={property}
              isFavorite={isFavorite(property.id || property.L_ListingID)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}
