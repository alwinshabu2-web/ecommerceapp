import { useState } from 'react';
import { ZoomIn } from 'lucide-react';
import ImageZoomViewer from './ImageZoomViewer';

/**
 * Product gallery with main image + thumbnails. Clicking main image opens lightbox.
 */
export default function ProductGallery({ images, productName }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="bg-gray-100 rounded-2xl aspect-square flex items-center justify-center">
        <p className="text-gray-400">No images available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div className="relative group">
        <button
          type="button"
          className="w-full rounded-2xl overflow-hidden bg-gray-100 aspect-[4/3] block focus-visible:ring-4 focus-visible:ring-primary-500"
          onClick={() => setLightboxOpen(true)}
          aria-label={`View ${images[activeIdx]?.label || 'image'} in fullscreen zoom viewer`}
        >
          <img
            src={images[activeIdx]?.url || '/images/fallback-product.svg'}
            alt={images[activeIdx]?.alt || productName}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/images/fallback-product.svg';
            }}
          />
          {/* Zoom hint overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 bg-white/90 text-gray-800 rounded-full px-4 py-2 flex items-center gap-2 text-sm font-medium transition-opacity duration-200 shadow">
              <ZoomIn className="w-4 h-4" />
              Click to zoom
            </div>
          </div>
        </button>

        {/* View label badge */}
        <div className="absolute top-3 right-3 bg-black/60 text-white text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm shadow">
          {images[activeIdx]?.label || `${activeIdx + 1} / ${images.length}`}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-2.5" role="list" aria-label="Product image thumbnails">
        {images.map((img, i) => (
          <div key={i} role="listitem">
            <button
              type="button"
              onClick={() => setActiveIdx(i)}
              aria-label={`View ${img.label || `image ${i + 1}`}`}
              aria-pressed={i === activeIdx}
              className={`w-full rounded-xl overflow-hidden aspect-square transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary-500 ${
                i === activeIdx
                  ? 'ring-2 ring-primary-600 ring-offset-2 shadow-md'
                  : 'ring-1 ring-gray-200 hover:ring-primary-300 opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={img.url || '/images/fallback-product.svg'}
                alt={img.alt || img.label}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/images/fallback-product.svg';
                }}
              />
            </button>
            <p className="text-center text-[11px] font-medium text-gray-600 mt-1 truncate">{img.label}</p>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <ImageZoomViewer
          images={images}
          startIndex={activeIdx}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
}
