import { useState, useRef, useEffect, useCallback } from 'react';
import { X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Fullscreen zoomable lightbox.
 * Props:
 *   images    — array of { url, alt, label }
 *   startIndex — initial image index
 *   onClose   — called to close
 */
export default function ImageZoomViewer({ images, startIndex = 0, onClose }) {
  const [idx, setIdx] = useState(startIndex);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef(null);
  const lastOffset = useRef({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const current = images[idx];
  const MIN_SCALE = 1;
  const MAX_SCALE = 5;
  const STEP = 0.5;

  const prev = useCallback(() => {
    setIdx(i => (i - 1 + images.length) % images.length);
  }, [images.length]);

  const next = useCallback(() => {
    setIdx(i => (i + 1) % images.length);
  }, [images.length]);

  const zoomIn = useCallback(() => {
    setScale(s => Math.min(s + STEP, MAX_SCALE));
  }, []);

  const zoomOut = useCallback(() => {
    setScale(s => {
      const ns = Math.max(s - STEP, MIN_SCALE);
      if (ns === MIN_SCALE) setOffset({ x: 0, y: 0 });
      return ns;
    });
  }, []);

  // Reset zoom when image changes
  useEffect(() => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  }, [idx]);

  // Keyboard handler
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === '+' || e.key === '=') zoomIn();
      if (e.key === '-') zoomOut();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose, prev, next, zoomIn, zoomOut]);

  // Trap focus inside lightbox
  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Mouse wheel zoom
  function handleWheel(e) {
    e.preventDefault();
    if (e.deltaY < 0) zoomIn();
    else zoomOut();
  }

  // Drag pan
  function handleMouseDown(e) {
    if (scale <= 1) return;
    setDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    lastOffset.current = offset;
  }

  function handleMouseMove(e) {
    if (!dragging || !dragStart.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setOffset({ x: lastOffset.current.x + dx, y: lastOffset.current.y + dy });
  }

  function handleMouseUp() {
    setDragging(false);
  }

  // Touch zoom (pinch)
  const lastDist = useRef(null);
  const lastTouchOffset = useRef(null);

  function handleTouchStart(e) {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastDist.current = Math.sqrt(dx * dx + dy * dy);
    } else if (e.touches.length === 1 && scale > 1) {
      dragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      lastTouchOffset.current = offset;
    }
  }

  function handleTouchMove(e) {
    e.preventDefault();
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (lastDist.current) {
        const delta = dist - lastDist.current;
        setScale(s => Math.max(MIN_SCALE, Math.min(MAX_SCALE, s + delta * 0.01)));
      }
      lastDist.current = dist;
    } else if (e.touches.length === 1 && scale > 1 && dragStart.current) {
      const ddx = e.touches[0].clientX - dragStart.current.x;
      const ddy = e.touches[0].clientY - dragStart.current.y;
      setOffset({ x: lastTouchOffset.current.x + ddx, y: lastTouchOffset.current.y + ddy });
    }
  }

  function handleTouchEnd(e) {
    if (e.touches.length < 2) lastDist.current = null;
  }

  // Double-tap to zoom
  const lastTap = useRef(0);
  function handleDoubleTap() {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      setScale(s => s > 1 ? 1 : 2.5);
      setOffset({ x: 0, y: 0 });
    }
    lastTap.current = now;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      className="fixed inset-0 z-[10000] bg-black/95 flex flex-col"
      ref={containerRef}
      tabIndex={-1}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 text-white flex-shrink-0">
        <div>
          <p className="text-sm font-semibold">{current.label || `Image ${idx + 1}`}</p>
          <p className="text-xs text-gray-400">{idx + 1} / {images.length}</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <button
            onClick={zoomOut}
            disabled={scale <= MIN_SCALE}
            aria-label="Zoom out"
            className="p-2 bg-white/10 hover:bg-white/20 disabled:opacity-30 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-white"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <span className="text-xs text-gray-300 min-w-[3rem] text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={zoomIn}
            disabled={scale >= MAX_SCALE}
            aria-label="Zoom in"
            className="p-2 bg-white/10 hover:bg-white/20 disabled:opacity-30 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-white"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <button
            onClick={onClose}
            aria-label="Close image viewer"
            className="ml-2 p-2 bg-white/10 hover:bg-red-500/70 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Image area */}
      <div
        className="flex-1 relative overflow-hidden flex items-center justify-center select-none"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleDoubleTap}
        style={{ cursor: scale > 1 ? (dragging ? 'grabbing' : 'grab') : 'zoom-in' }}
      >
        <img
          src={current.url || '/images/fallback-product.svg'}
          alt={current.alt || current.label}
          draggable={false}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = '/images/fallback-product.svg';
          }}
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
            transition: dragging ? 'none' : 'transform 0.15s ease',
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            userSelect: 'none',
            WebkitUserSelect: 'none',
          }}
        />
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-4 py-4 flex-shrink-0">
        <button
          onClick={(e) => { e.stopPropagation(); prev(); }}
          aria-label="Previous image"
          className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-white"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Thumbnail dots */}
        <div className="flex gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setIdx(i); }}
              aria-label={`View ${img.label || `image ${i + 1}`}`}
              aria-current={i === idx ? 'true' : undefined}
              className={`transition-all duration-200 rounded-full ${
                i === idx
                  ? 'w-8 h-2.5 bg-white'
                  : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); next(); }}
          aria-label="Next image"
          className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-white"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Hint text */}
      <p className="text-center text-xs text-gray-500 pb-3">
        Scroll to zoom · Drag to pan when zoomed · Esc or tap outside to close · Double-tap to toggle zoom
      </p>
    </div>
  );
}
