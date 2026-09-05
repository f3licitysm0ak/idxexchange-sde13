import React, { useEffect, useState } from 'react';
import { parsePhotos } from '../api/client';

export function PropertyImageGallery({ photos, alt = 'Property photo' }) {
  const imageUrls = parsePhotos(photos) || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    if (!lightboxOpen) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setLightboxOpen(false);
      if (event.key === 'ArrowLeft') setCurrentIndex((index) => (index - 1 + imageUrls.length) % imageUrls.length);
      if (event.key === 'ArrowRight') setCurrentIndex((index) => (index + 1) % imageUrls.length);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [imageUrls.length, lightboxOpen]);

  if (imageUrls.length === 0) {
    return <div className="gallery-empty">No photos available</div>;
  }

  return (
    <div className="property-gallery">
      <button type="button" className="gallery-main-button" onClick={() => setLightboxOpen(true)}>
        <img src={imageUrls[currentIndex]} alt={`${alt} ${currentIndex + 1}`} />
      </button>
      <div className="gallery-thumbnails" aria-label="Property photos">
        {imageUrls.map((url, index) => (
          <button type="button" key={url} className={index === currentIndex ? 'gallery-thumbnail active' : 'gallery-thumbnail'} onClick={() => setCurrentIndex(index)}>
            <img src={url} alt={`Thumbnail ${index + 1}`} />
          </button>
        ))}
      </div>
      {lightboxOpen && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Photo viewer" onClick={() => setLightboxOpen(false)}>
          <button type="button" className="lightbox-close" aria-label="Close photo viewer" onClick={() => setLightboxOpen(false)}>&times;</button>
          <button type="button" className="lightbox-arrow lightbox-prev" aria-label="Previous photo" onClick={(event) => { event.stopPropagation(); setCurrentIndex((index) => (index - 1 + imageUrls.length) % imageUrls.length); }}>&lsaquo;</button>
          <img src={imageUrls[currentIndex]} alt={`${alt} ${currentIndex + 1}`} onClick={(event) => event.stopPropagation()} />
          <button type="button" className="lightbox-arrow lightbox-next" aria-label="Next photo" onClick={(event) => { event.stopPropagation(); setCurrentIndex((index) => (index + 1) % imageUrls.length); }}>&rsaquo;</button>
        </div>
      )}
    </div>
  );
}
