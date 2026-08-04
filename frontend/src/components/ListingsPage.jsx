import React, { useState, useEffect } from 'react';
import { fetchProperties } from '../api/client';
import { PropertyCard } from './PropertyCard';
import { PropertyFilters } from './PropertyFilters';

export function ListingsPage() {
  const [properties, setProperties] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState({}); //state for filters
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCancelled = false;

    async function loadProperties() {
      try {
        setLoading(true);
        setError(null);
        setProperties([]);

        
        const data = await fetchProperties(filters);

        if (!isCancelled) {
          setProperties(data.results || []);
          setTotalCount(data.total || 0);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err.message);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    loadProperties();

    return () => {
      isCancelled = true;
    };
  }, [filters]);

  const handleSearch = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClear = () => {
    setFilters({});
  };

  return (
    <div className="listings-page">
      <PropertyFilters onSearch={handleSearch} onClear={handleClear} />

      {error && <div className="error-message">Error: {error}</div>}

      {loading ? (
        <div className="loading-state">Loading properties...</div>
      ) : (
        <>
          <h2 className="listings-heading">
            Showing {properties.length} properties of {totalCount}
          </h2>

          {properties.length === 0 ? (
            <div className="no-results">
              <p>No properties match your current search filters.</p>
              <button type="button" onClick={handleClear}>
                Clear filters
              </button>
            </div>
          ) : (
            <div className="property-grid">
              {properties.map((prop) => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}