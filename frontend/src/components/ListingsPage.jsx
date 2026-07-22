// src/components/ListingsPage.jsx
import React, { useState, useEffect } from 'react';
import { fetchProperties } from '../api/client';
import { PropertyCard } from './PropertyCard';

export function ListingsPage() {
  const [properties, setProperties] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadProperties() {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchProperties();

        setProperties(data.results || []);
        setTotalCount(data.total || 0);

      } catch (err) {
        setError(err.message);
      }

      setLoading(false);
    }

    loadProperties();
  }, []); //to run once when the page loads initially, not all the time


  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  //iterate over properties and render each property card 
  return (
    <div>
      <h2 class = "listings-heading">Showing {properties.length} properties of {totalCount}</h2>
      <div className="property-grid">
        {properties.map((prop) => (
          <PropertyCard key={prop.id} property={prop} />
        ))}
      </div>
    </div>
  );
}