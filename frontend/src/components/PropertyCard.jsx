import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PropertyImageCarousel } from './PropertyImageCarousel';
import './PropertyCard.css'; //styling

export function PropertyCard({ property }) {
  const navigate = useNavigate();

  //price and sqft formatting
  const priceFormatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(property.price || 0);

  const formattedSqFt = property.sqft? property.sqft.toLocaleString() : 'N/A';
  
  return (
    <div
      className="property-card"
      role="link"
      tabIndex={0}
      onClick={() => navigate(`/property/${property.id}`)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          navigate(`/property/${property.id}`);
        }
      }}
    >
      <PropertyImageCarousel photos={property?.L_Photos} alt={property.address || 'Property Image'} />
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