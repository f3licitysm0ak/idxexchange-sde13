import React, { useState } from 'react';

const INITIAL_FILTERS = {
  city: '',
  zipCode: '',
  minPrice: '',
  maxPrice: '',
  beds: '',
  baths: '',
};

export function PropertyFilters({ onSearch, onClear }) {
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    //dont send empty values to the a
    const activeFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value.trim() !== '') {
        acc[key] = value.trim();
      }
      return acc;
    }, {});

    onSearch(activeFilters);
  };

  const handleReset = () => {
    setFilters(INITIAL_FILTERS);
    onClear();
  };

  return (
    <form onSubmit={handleSubmit} className="property-filters-form">
      <div className="filter-group">
        <label htmlFor="city">City</label>
        <input
          id="city"
          type="text"
          name="city"
          value={filters.city}
          onChange={handleChange}
          placeholder="e.g. Austin"
        />
      </div>

      <div className="filter-group">
        <label htmlFor="zipCode">ZIP Code</label>
        <input
          id="zipCode"
          type="text"
          name="zipCode"
          value={filters.zipCode}
          onChange={handleChange}
          placeholder="e.g. 78701"
        />
      </div>

      <div className="filter-group">
        <label htmlFor="minPrice">Min Price</label>
        <input
          id="minPrice"
          type="number"
          name="minPrice"
          value={filters.minPrice}
          onChange={handleChange}
          placeholder="Min $"
        />
      </div>

      <div className="filter-group">
        <label htmlFor="maxPrice">Max Price</label>
        <input
          id="maxPrice"
          type="number"
          name="maxPrice"
          value={filters.maxPrice}
          onChange={handleChange}
          placeholder="Max $"
        />
      </div>

      <div className="filter-group">
        <label htmlFor="beds">Beds</label>
        <select id="beds" name="beds" value={filters.beds} onChange={handleChange}>
          <option value="">Any</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="baths">Baths</label>
        <select id="baths" name="baths" value={filters.baths} onChange={handleChange}>
          <option value="">Any</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
        </select>
      </div>

      <div className="filter-actions">
        <button type="submit">Search</button>
        <button type="button" onClick={handleReset}>
          Clear Filters
        </button>
      </div>
    </form>
  );
}