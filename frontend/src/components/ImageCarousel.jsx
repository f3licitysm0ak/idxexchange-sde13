import React, { useState, useEffect, useCallback } from 'react';
import './ImageCarousel.css';

export function ImageCarousel({ slides = [], autoPlay = false, autoPlayInterval = 5000 }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    if (!autoPlay || slides.length <= 1) return;
    const timer = setInterval(handleNext, autoPlayInterval);
    return () => clearInterval(timer);
  }, [autoPlay, autoPlayInterval, handleNext, slides.length]);

  if (!slides || slides.length === 0) return null;

  return (
    <div className="carousel-container">
      <div className="carousel-wrapper">
        <button
          type="button"
          className="carousel-btn prev-btn"
          onClick={handlePrev}
          aria-label="Previous slide"
        >
          &#10094;
        </button>

        <div className="carousel-slide">
          <img
            src={slides[currentIndex].src}
            alt={slides[currentIndex].title || `Slide ${currentIndex + 1}`}
            className="carousel-image"
          />
          {(slides[currentIndex].title || slides[currentIndex].price) && (
            <div className="carousel-caption">
              {slides[currentIndex].title && <h3>{slides[currentIndex].title}</h3>}
              {slides[currentIndex].price && <p>${slides[currentIndex].price.toLocaleString()}</p>}
            </div>
          )}
        </div>

        <button
          type="button"
          className="carousel-btn next-btn"
          onClick={handleNext}
          aria-label="Next slide"
        >
          &#10095;
        </button>
      </div>

      {/* Slide Indicators */}
      {slides.length > 1 && (
        <div className="carousel-dots">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={`dot ${idx === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}