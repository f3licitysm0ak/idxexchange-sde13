import React from 'react';
import { getPrimaryPhotoUrl } from '../api/client'; //import for safely parsing photos

export function PropertyCard({ property }) {
  const photoUrl = getPrimaryPhotoUrl(property?.L_Photos);

  //price and sqft formatting
  const priceFormatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(property.price || 0);

  const formattedSqFt = property.sqft? property.sqft.toLocaleString() : 'N/A';
  
  return (
    <div className="property-card">
      <div className = "card-image-container">
        <img src={photoUrl} alt={property.address || 'Property Image'}/> 
      </div>
      <div className="card-body">
        <h3 className="card-price">{priceFormatted}</h3>
        <p className="card-address">{property.address || 'Address Unavailable'}</p>
        <p className="card-location">{property.city}{property.city && property.state ? ', ' : ''}{property.state}</p>
      </div>
      <div className="card-stats">
        <span>{property?.beds ?? 0} bds</span> | 
        <span>{property?.baths ?? 0} ba</span> | 
        <span>{formattedSqFt} sqft</span>
      </div>
    </div>
  );
}