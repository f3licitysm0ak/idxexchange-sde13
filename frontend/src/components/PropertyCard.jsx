import React from 'react';

export function PropertyCard({ property }) {
  // 1. Extract values from property (price, address, beds, baths, sqft, L_Photos)
  // 2. Safely parse L_Photos here (or via a helper function)

  return (
    <div className="property-card">
      {/* Render photo, price, address, etc. here */}
      <h3>{property.address}</h3>
    </div>
  );
}