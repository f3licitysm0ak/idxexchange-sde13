import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getOpenHouses, getPropertyById } from '../api/client';
import { PropertyImageGallery } from '../components/PropertyImageGallery';
import { PropertyMap } from '../components/PropertyMap';
import './PropertyDetailPage.css';

function formatCurrency(value) {
  return value == null ? 'Price unavailable' : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}

function formatTime(value) {
  if (!value) return 'TBD';
  const date = new Date(`1970-01-01T${value}`);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function getRemarks(openHouse) {
  if (!openHouse?.all_data) return '';
  try {
    return JSON.parse(openHouse.all_data)?.OpenHouseRemarks || '';
  } catch {
    return '';
  }
}

export function PropertyDetailPage() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [openHouses, setOpenHouses] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    Promise.all([getPropertyById(id), getOpenHouses(id)])
      .then(([propertyData, openHouseData]) => {
        if (cancelled) return;
        setProperty(propertyData);
        setOpenHouses(Array.isArray(openHouseData) ? openHouseData : openHouseData ? [openHouseData] : []);
      })
      .catch((requestError) => {
        if (!cancelled) setError(requestError.message);
      });
    return () => { cancelled = true; };
  }, [id]);

  if (error) return <div className="detail-error"><p>Unable to load property: {error}</p><Link to="/">Back to listings</Link></div>;
  if (!property) return <div className="loading-state">Loading property...</div>;

  const address = property.L_Address || property.UnparsedAddress || property.address;
  const cityState = [property.L_City || property.city, property.L_State || property.state].filter(Boolean).join(', ');
  const yearBuilt = property.L_YearBuilt || property.YearBuilt;

  return (
    <article className="property-detail">
      <Link to="/" className="back-link">Back to listings</Link>
      <PropertyImageGallery photos={property.L_Photos} alt={address || 'Property'} />
      <h1>{formatCurrency(property.L_SystemPrice || property.price)}</h1>
      <p className="detail-address">{address || 'Address unavailable'}{cityState ? `, ${cityState}` : ''}</p>
      <div className="detail-stats">
        <span><strong>{property.L_Keyword2 || property.beds || 0}</strong> beds</span>
        <span><strong>{property.LM_Dec_3 || property.baths || 0}</strong> baths</span>
        <span><strong>{property.L_SquareFeet || property.sqft || 'N/A'}</strong> sqft</span>
        <span><strong>{yearBuilt || 'N/A'}</strong> year built</span>
      </div>
      <section className="detail-section">
        <h2>Description</h2>
        <p>{property.PublicRemarks || property.L_PublicRemarks || 'No description available.'}</p>
      </section>
      <section className="detail-section">
        <h2>Property details</h2>
        <p>Listing ID: {property.L_ListingID || property.id}</p>
        <p>Property type: {property.L_Type || property.PropertyType || 'Not specified'}</p>
      </section>
      <section className="detail-section">
        <h2>Open houses</h2>
        {openHouses.length === 0 ? <p>No open houses scheduled</p> : openHouses.map((openHouse, index) => (
          <div className="open-house" key={`${openHouse.OpenHouseDate}-${openHouse.OH_StartTime}-${index}`}>
            <strong>{openHouse.OpenHouseDate || 'Date unavailable'}</strong>
            <span>{formatTime(openHouse.OH_StartTime)} - {formatTime(openHouse.OH_EndTime)}</span>
            {getRemarks(openHouse) && <p>{getRemarks(openHouse)}</p>}
          </div>
        ))}
      </section>
      <PropertyMap latitude={property.LMD_MP_Latitude} longitude={property.LMD_MP_Longitude} />
    </article>
  );
}
