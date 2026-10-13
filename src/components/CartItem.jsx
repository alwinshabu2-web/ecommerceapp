import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/helpers';

export default function CartItem({ item }) {
  const { updateQty, removeFromCart } = useCart();

  return (
    <div className="flex items-start gap-4 py-4 border-b border-gray-100 last:border-0 animate-fade-in">
      {/* Thumbnail */}
      <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
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

      {/* Details */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-primary-600 mb-0.5">{item.category}</p>
        <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1">{item.name}</h3>
        <p className="text-sm text-gray-500">{formatPrice(item.price)} each</p>

        {/* Mobile: price bottom */}
        <p className="text-base font-bold text-gray-900 mt-1 sm:hidden">
          {formatPrice(item.price * item.qty)}
        </p>

        {/* Quantity controls */}
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => updateQty(item.id, item.qty - 1)}
              aria-label={`Decrease quantity of ${item.name}`}
              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:text-primary-600 transition-colors focus-visible:ring-2 focus-visible:ring-primary-500 disabled:opacity-40"
              disabled={item.qty <= 1}
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span
              className="w-10 text-center text-sm font-semibold text-gray-900 border-x border-gray-200 py-1.5"
              aria-label={`Quantity: ${item.qty}`}
            >
              {item.qty}
            </span>
            <button
              type="button"
              onClick={() => updateQty(item.id, item.qty + 1)}
              aria-label={`Increase quantity of ${item.name}`}
              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:text-primary-600 transition-colors focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => removeFromCart(item.id)}
            aria-label={`Remove ${item.name} from cart`}
            className="flex items-center gap-1 text-red-500 hover:text-red-700 text-xs font-medium hover:bg-red-50 px-2 py-1.5 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-red-400 ml-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Remove</span>
          </button>
        </div>
      </div>

      {/* Line total - desktop */}
      <div className="hidden sm:block text-right flex-shrink-0">
        <p className="font-bold text-gray-900 text-base">{formatPrice(item.price * item.qty)}</p>
        <p className="text-xs text-gray-400 mt-0.5">× {item.qty}</p>
      </div>
    </div>
  );
}
