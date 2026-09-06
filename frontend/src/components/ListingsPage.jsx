import React, { useState, useEffect } from 'react';
import { fetchProperties } from '../api/client';
import { useFavorites } from '../hooks/useFavorites';
import { PropertyCard } from './PropertyCard';
import { PropertyFilters } from './PropertyFilters';
import { Pagination } from './Pagination';

export function ListingsPage() {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [properties, setProperties] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState({}); //state for filters
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('ASC');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const endIndex = startIndex + properties.length;
  const visibleProperties = properties;
  const summaryStart = totalCount === 0 ? 0 : startIndex + 1;
  const summaryEnd = Math.min(endIndex, totalCount);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    let isCancelled = false;

    async function loadProperties() {
      try {
        setLoading(true);
        setError(null);
        setProperties([]);

        const requestParams = {
          ...filters,
          limit: itemsPerPage,
          offset: (safeCurrentPage - 1) * itemsPerPage,
          ...(sortBy ? { sortBy } : {}),
          ...(sortBy ? { sortOrder } : {}),
        };

        const data = await fetchProperties(requestParams);

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
  }, [filters, sortBy, sortOrder, safeCurrentPage, itemsPerPage]);

  const handleSearch = (newFilters) => {
    setCurrentPage(1);
    setFilters(newFilters);
    setSortBy('');
    setSortOrder('ASC');
  };

  const handleClear = () => {
    setCurrentPage(1);
    setFilters({});
    setSortBy('');
    setSortOrder('ASC');
  };

  const handleSortChange = (event) => {
    const nextSortBy = event.target.value;
    setSortBy(nextSortBy);
    setCurrentPage(1);
  };

  const handleSortOrderChange = (event) => {
    setSortOrder(event.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (nextPage) => {
    const normalizedPage = Math.min(Math.max(1, nextPage), totalPages);
    setCurrentPage(normalizedPage);
    window.scrollTo(0, 0);
  };

  return (
    <div className="listings-page">
      <PropertyFilters onSearch={handleSearch} onClear={handleClear} />

      <div className="sort-controls">
        <label htmlFor="sortBy">Sort by</label>
        <select id="sortBy" value={sortBy} onChange={handleSortChange}>
          <option value="">Default</option>
          <option value="L_SystemPrice">Price</option>
          <option value="L_ListingDate">Date listed</option>
          <option value="L_SquareFeet">Square footage</option>
          <option value="L_Keyword2">Beds</option>
        </select>

        <label htmlFor="sortOrder">Order</label>
        <select id="sortOrder" value={sortOrder} onChange={handleSortOrderChange} disabled={!sortBy}>
          <option value="ASC">Ascending</option>
          <option value="DESC">Descending</option>
        </select>
      </div>

      {error && <div className="error-message">Error: {error}</div>}

      {loading ? (
        <div className="loading-state">Loading properties...</div>
      ) : (
        <>
          <h2 className="listings-heading">
            Showing {summaryStart}-{summaryEnd} of {totalCount} properties
          </h2>

          {properties.length === 0 ? (
            <div className="no-results">
              <p>No properties match your current search filters.</p>
              <button type="button" onClick={handleClear}>
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <div className="property-grid">
                {visibleProperties.map((prop) => (
                  <PropertyCard
                    key={prop.id}
                    property={prop}
                    isFavorite={isFavorite(prop.id || prop.L_ListingID)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>

              <Pagination
                currentPage={safeCurrentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}