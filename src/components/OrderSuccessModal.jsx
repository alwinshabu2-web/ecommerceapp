import { useEffect, useRef } from 'react';
import { ArrowRight, ShoppingBag, Calendar, CreditCard, Truck, Hash, MapPin } from 'lucide-react';
import { formatPrice, formatDateTime } from '../utils/helpers';

/* ─── Success chime (base-64 encoded tiny WAV tone) ─────────────────────────
   A brief pleasant two-note ascending "ding-ding" chime (~0.6 s, 44 kHz, mono).
   Generated from a pure sine wave; no external dependency required.           */
const SUCCESS_CHIME_B64 =
  'UklGRlQFAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YTAFAAD' +
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
  'AAAAAAAAAAAAAAAAAAAAAAAA';

// Generate a simple ascending chime via Web Audio API — no external assets needed
function playSuccessChime() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();

    const notes = [523.25, 783.99]; // C5 → G5 pleasant ascending fifth
    let startTime = ctx.currentTime;

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.35, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.55);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.55);

      startTime += 0.28;
    });

    // Close context after chime finishes to free resources
    setTimeout(() => ctx.close(), 1500);
  } catch {
    // Silently ignore if AudioContext is unavailable or blocked
  }
}

/* ─── Animated SVG checkmark ────────────────────────────────────────────── */
function AnimatedCheck() {
  return (
    <svg
      viewBox="0 0 52 52"
      className="w-full h-full"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Circle */}
      <circle
        cx="26"
        cy="26"
        r="24"
        className="check-circle"
        stroke="#059669"
        strokeWidth="2.5"
        fill="none"
      />
      {/* Tick */}
      <polyline
        points="14,26 22,34 38,17"
        className="check-tick"
        stroke="#059669"
        strokeWidth="3"
        fill="none"
      />

      <style>{`
        .check-circle {
          stroke-dasharray: 166;
          stroke-dashoffset: 166;
          animation: checkCircle 0.55s cubic-bezier(0.65, 0, 0.45, 1) 0.15s forwards;
        }
        .check-tick {
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
          animation: checkTick 0.35s cubic-bezier(0.65, 0, 0.45, 1) 0.65s forwards;
        }
        @keyframes checkCircle {
          to { stroke-dashoffset: 0; }
        }
        @keyframes checkTick {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </svg>
  );
}

/* ─── Confetti particle ──────────────────────────────────────────────────── */
const CONFETTI_COLORS = ['#059669', '#10b981', '#34d399', '#fbbf24', '#f59e0b', '#3b82f6', '#8b5cf6'];

function ConfettiPiece({ index }) {
  const left = `${5 + (index * 11.3) % 90}%`;
  const color = CONFETTI_COLORS[index % CONFETTI_COLORS.length];
  const delay = `${(index * 80) % 600}ms`;
  const size = 6 + (index % 4) * 2;
  const rotation = index % 2 === 0 ? 'rotate(45deg)' : 'rotate(0deg)';
  const shape = index % 3 === 0 ? '50%' : '2px';

  return (
    <span
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: '-10px',
        left,
        width: size,
        height: size,
        backgroundColor: color,
        borderRadius: shape,
        transform: rotation,
        animation: `confettiFall 1.1s ease-out ${delay} forwards`,
      }}
    />
  );
}

/* ─── Main Modal ─────────────────────────────────────────────────────────── */
export default function OrderSuccessModal({ order, isOpen, onViewDetails, onContinueShopping }) {
  const chimePlayedRef = useRef(false);

  // Lock body scroll + play chime once per open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';

      if (!chimePlayedRef.current) {
        chimePlayedRef.current = true;
        // Slight delay so the animation is visible first
        const timer = setTimeout(playSuccessChime, 300);
        return () => {
          clearTimeout(timer);
          document.body.style.overflow = '';
        };
      }

      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  // Reset the chime flag when modal closes so next order also gets chime
  useEffect(() => {
    if (!isOpen) chimePlayedRef.current = false;
  }, [isOpen]);

  if (!isOpen || !order) return null;

  const totalItems = (order.items || []).reduce((acc, item) => acc + (item.qty || 1), 0);
  const formattedDate = order.formattedDate || formatDateTime(order.date);

  return (
    <>
      {/* Keyframe styles injected once into <head> */}
      <style>{`
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(40px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0)     scale(1);    }
        }
        @keyframes overlayFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes checkPop {
          0%   { transform: scale(0.5); opacity: 0; }
          60%  { transform: scale(1.15); }
          100% { transform: scale(1);   opacity: 1; }
        }
        @keyframes badgePop {
          0%   { transform: scale(0); opacity: 0; }
          70%  { transform: scale(1.1); }
          100% { transform: scale(1);  opacity: 1; }
        }
        @keyframes confettiFall {
          0%   { transform: translateY(0) rotate(0deg);     opacity: 1; }
          80%  { opacity: 1; }
          100% { transform: translateY(220px) rotate(360deg); opacity: 0; }
        }
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .success-overlay {
          animation: overlayFadeIn 0.25s ease forwards;
        }
        .success-modal {
          animation: modalSlideUp 0.45s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .check-wrapper {
          animation: checkPop 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both;
        }
        .order-badge {
          animation: badgePop 0.4s cubic-bezier(0.22, 1, 0.36, 1) 0.9s both;
        }
        .shimmer-btn {
          background: linear-gradient(90deg, #059669 30%, #10b981 50%, #059669 70%);
          background-size: 200% 100%;
          animation: shimmer 2s linear 1.2s infinite;
        }
      `}</style>

      {/* Backdrop */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="success-modal-heading"
        className="success-overlay fixed inset-0 z-[10000] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      >
        {/* Modal Card */}
        <div className="success-modal relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden my-6">

          {/* Confetti burst — 12 particles from the top */}
          <div aria-hidden="true" className="absolute top-0 inset-x-0 h-1 overflow-visible pointer-events-none z-10">
            {Array.from({ length: 12 }, (_, i) => (
              <ConfettiPiece key={i} index={i} />
            ))}
          </div>

          {/* Green gradient header strip */}
          <div className="h-2 bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500" />

          {/* Body */}
          <div className="px-6 pt-7 pb-6 sm:px-8 sm:pt-8 text-center">

            {/* Animated check icon */}
            <div className="check-wrapper w-20 h-20 mx-auto mb-4">
              <AnimatedCheck />
            </div>

            <h2
              id="success-modal-heading"
              className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight"
            >
              Order Placed Successfully!
            </h2>
            <p className="text-gray-500 text-sm mt-1.5 mb-5">
              Thank you for shopping with{' '}
              <span className="font-semibold text-emerald-700">EcoConstruct Pro</span> 🌿
            </p>

            {/* Order ID badge */}
            <div className="order-badge inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5 mb-5">
              <Hash className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-widest text-emerald-600 font-semibold leading-none mb-0.5">Order ID</p>
                <p className="font-mono font-bold text-sm text-gray-900 leading-none">{order.id}</p>
              </div>
            </div>

            {/* Snapshot grid */}
            <div className="bg-gray-50 border border-gray-200/80 rounded-2xl p-4 sm:p-5 text-left mb-5 space-y-3">

              {/* Date + Items row */}
              <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-400 text-[10px] uppercase tracking-wide font-medium">Date</p>
                    <p className="font-semibold text-gray-800 leading-snug">{formattedDate}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <ShoppingBag className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-400 text-[10px] uppercase tracking-wide font-medium">Items</p>
                    <p className="font-semibold text-gray-800 leading-snug">
                      {totalItems} item{totalItems !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment + Delivery row */}
              <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                <div className="flex items-start gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-400 text-[10px] uppercase tracking-wide font-medium">Payment</p>
                    <p className="font-semibold text-gray-800 leading-snug">{order.paymentMethod}</p>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-md">
                      {order.paymentStatus || 'Confirmed'}
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Truck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-400 text-[10px] uppercase tracking-wide font-medium">Est. Delivery</p>
                    <p className="font-semibold text-gray-800 leading-snug">{order.estimatedDelivery}</p>
                    <p className="text-[10px] text-gray-400">{order.deliveryLabel}</p>
                  </div>
                </div>
              </div>

              {/* Shipping address (if present) */}
              {order.shippingAddress?.address && (
                <div className="flex items-start gap-2 text-xs pt-2 border-t border-gray-200">
                  <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-400 text-[10px] uppercase tracking-wide font-medium">Shipping To</p>
                    <p className="font-medium text-gray-700 leading-snug">
                      {order.shippingAddress.name} · {order.shippingAddress.address}
                      {order.shippingAddress.city ? `, ${order.shippingAddress.city}` : ''}
                    </p>
                  </div>
                </div>
              )}

              {/* Total */}
              <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-600">Total Amount</span>
                <span className="text-2xl font-extrabold text-emerald-600">{formatPrice(order.total)}</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Primary — shimmer animation */}
              <button
                type="button"
                onClick={() => onViewDetails(order.id)}
                className="shimmer-btn flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-white font-bold text-sm shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/50 transition-shadow"
              >
                Track Order <ArrowRight className="w-4 h-4" />
              </button>

              {/* Secondary */}
              <button
                type="button"
                onClick={onContinueShopping}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold text-sm hover:border-emerald-400 hover:text-emerald-700 transition-colors"
              >
                <ShoppingBag className="w-4 h-4" /> Continue Shopping
              </button>
            </div>

            <p className="text-[11px] text-gray-400 mt-4 leading-relaxed">
              Order details saved to <strong>My Orders</strong>. You can track delivery status anytime.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
