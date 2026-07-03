'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface Photo {
  url: string;
  alt: string;
}

interface DetailClientProps {
  photos: Photo[];
}

export default function DetailClient({ photos }: DetailClientProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const heroPhoto = photos[currentIndex] || photos[0];

  // Open lightbox
  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  // Close lightbox
  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    document.body.style.overflow = '';
  }, []);

  // Navigate lightbox
  const showPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  }, [photos.length]);

  const showNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  }, [photos.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, closeLightbox, showPrev, showNext]);

  if (photos.length === 0) {
    return (
      <div className="rounded-2xl overflow-hidden aspect-[16/9] md:aspect-[21/9] bg-stone-200 flex items-center justify-center">
        <span className="text-stone-400">No photos available</span>
      </div>
    );
  }

  return (
    <>
      {/* Hero Image */}
      <div
        className="rounded-2xl overflow-hidden aspect-[16/9] md:aspect-[21/9] shadow-xl ring-1 ring-black/5 cursor-pointer relative"
        onClick={() => openLightbox(currentIndex)}
      >
        <Image
          src={heroPhoto.url}
          alt={heroPhoto.alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 1400px"
          priority
        />
      </div>

      {/* Thumbnail Strip */}
      <div className="flex gap-3 mt-3 overflow-x-auto no-scrollbar">
        {photos.map((photo, index) => (
          <div
            key={index}
            className={`thumb ${index === currentIndex ? 'active' : ''} w-24 h-16 rounded-lg overflow-hidden shrink-0 relative`}
            onClick={() => setCurrentIndex(index)}
          >
            <Image
              src={photo.url}
              alt={photo.alt}
              fill
              className="object-cover"
              sizes="96px"
            />
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="lightbox open"
          role="dialog"
          aria-modal="true"
          aria-label="Galeri foto properti"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeLightbox();
          }}
        >
          {/* Close Button */}
          <button
            type="button"
            aria-label="Tutup galeri"
            onClick={closeLightbox}
            className="lightbox-btn absolute top-6 right-6 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-orange transition-colors z-10"
          >
            ✕
          </button>

          {/* Prev Button */}
          <button
            type="button"
            aria-label="Foto sebelumnya"
            onClick={showPrev}
            className="lightbox-btn absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-orange transition-colors z-10"
          >
            ←
          </button>

          {/* Image */}
          <div className="relative max-h-[85vh] max-w-[88vw] w-[88vw] h-[85vh]">
            <Image
              src={photos[currentIndex]?.url}
              alt={photos[currentIndex]?.alt || 'Foto properti diperbesar'}
              fill
              className="object-contain rounded-xl"
              sizes="88vw"
              priority
            />
          </div>

          {/* Next Button */}
          <button
            type="button"
            aria-label="Foto berikutnya"
            onClick={showNext}
            className="lightbox-btn absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-orange transition-colors z-10"
          >
            →
          </button>

          {/* Counter */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-sm font-mono z-10">
            {currentIndex + 1} / {photos.length}
          </div>
        </div>
      )}

      <style jsx>{`
        .thumb {
          cursor: pointer;
          transition: box-shadow 0.2s ease, transform 0.2s ease;
        }
        .thumb:hover {
          transform: translateY(-2px);
        }
        .thumb.active {
          box-shadow: 0 0 0 2px #f97316;
        }

        .lightbox {
          position: fixed;
          inset: 0;
          z-index: 200;
          background: rgba(28, 25, 23, 0.96);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </>
  );
}
