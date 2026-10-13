import { formatPrice, calcCartTotals, SHIPPING_RATES, TAX_RATE } from '../utils/helpers';
import { Info, Tag } from 'lucide-react';

/**
 * Reusable order summary panel.
 * Props: cart, deliveryKey, promoCode, showItems (bool)
 */
export default function OrderSummary({ cart, deliveryKey = 'standard', promoCode = '', showItems = true }) {
  const { subtotal, shipping, discount, promo, tax, total, itemCount } = calcCartTotals(cart, deliveryKey, promoCode);
  const rate = SHIPPING_RATES[deliveryKey];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
      <h2 className="font-bold text-gray-900 text-lg">Order Summary</h2>

      {/* Items list */}
      {showItems && cart.length > 0 && (
        <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
          {cart.map(item => (
            <div key={item.id} className="flex gap-3">
              <div className="w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={item.image || '/images/fallback-product.svg'}
                  alt={item.imageAlt || item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/images/fallback-product.svg';
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 leading-tight line-clamp-2">{item.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">Qty: {item.qty}</p>
              </div>
              <p className="text-sm font-semibold text-gray-900 flex-shrink-0">{formatPrice(item.price * item.qty)}</p>
            </div>
          ))}
        </div>
      )}

      {showItems && cart.length > 0 && <div className="border-t border-gray-100" />}

      {/* Totals */}
      <div className="space-y-2.5 text-sm">
        <div className="flex justify-between text-gray-700">
          <span>Subtotal ({itemCount} item{itemCount !== 1 ? 's' : ''})</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-emerald-600 font-medium">
            <span className="flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              Promo ({promo?.code})
            </span>
            <span>-{formatPrice(discount)}</span>
          </div>
        )}

        <div className="flex justify-between text-gray-700">
          <div className="flex items-center gap-1">
            <span>Shipping</span>
            {rate && <span className="text-xs text-gray-400">({rate.label})</span>}
          </div>
          <span className="font-medium">
            {shipping === 0 ? <span className="text-primary-600 font-semibold">Free</span> : formatPrice(shipping)}
          </span>
        </div>

        <div className="flex justify-between text-gray-700">
          <div className="flex items-center gap-1.5">
            <span>GST ({Math.round(TAX_RATE * 100)}%)</span>
            <span title="Goods and Services Tax applied">
              <Info className="w-3.5 h-3.5 text-gray-400" />
            </span>
          </div>
          <span className="font-medium">{formatPrice(tax)}</span>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-3">
        <div className="flex justify-between items-center">
          <span className="font-bold text-gray-900">Total Payable</span>
          <span className="font-bold text-xl text-primary-600">{formatPrice(total)}</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">Inclusive of all taxes</p>
      </div>

      <p className="text-xs text-gray-400 italic">
        * This is a demo order. No real payment is processed.
      </p>
    </div>
  );
}
