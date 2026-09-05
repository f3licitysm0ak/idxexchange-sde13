import React, { useState } from 'react';
import { parsePhotos } from '../api/client';

export function PropertyImageCarousel({ photos, alt }) {
  const imageUrls = parsePhotos(photos) || [];
  const [currentIndex, setCurrentIndex] = useState(0);

  if (imageUrls.length === 0) {
    imageUrls.push('https://via.placeholder.com/400x300?text=No+Image+Available');
  }

  const move = (event, direction) => {
    event.stopPropagation();
    setCurrentIndex((index) => (index + direction + imageUrls.length) % imageUrls.length);
  };

  return (
    <div className="card-image-container">
      <img src={imageUrls[currentIndex]} alt={alt} />
      {imageUrls.length > 1 && (
        <>
          <button type="button" className="card-carousel-button card-carousel-prev" aria-label="Previous photo" onClick={(event) => move(event, -1)}>&lsaquo;</button>
          <button type="button" className="card-carousel-button card-carousel-next" aria-label="Next photo" onClick={(event) => move(event, 1)}>&rsaquo;</button>
          <span className="card-photo-counter">{currentIndex + 1} / {imageUrls.length}</span>
        </>
      )}
    </div>
  );
}
