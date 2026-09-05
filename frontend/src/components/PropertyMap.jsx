import React from 'react';

export function PropertyMap({ latitude, longitude }) {
  if (latitude == null || longitude == null || latitude === '' || longitude === '') {
    return null;
  }

  const key = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const location = `${latitude},${longitude}`;
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(key || '')}&q=${encodeURIComponent(location)}&zoom=15`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location)}`;

  return (
    <section className="property-map">
      <h2>Location</h2>
      <iframe title="Property location map" src={mapUrl} loading="lazy" allowFullScreen />
      <a href={directionsUrl} target="_blank" rel="noreferrer">Get Directions</a>
    </section>
  );
}
