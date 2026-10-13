import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';
import { calcCartTotals, formatPrice, SHIPPING_RATES, TAX_RATE } from '../utils/helpers';

export default function CartPage() {
  const { cart, itemCount } = useCart();
  const { subtotal, shipping, tax, total } = calcCartTotals(cart, 'standard');

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md">
          <ShoppingBag className="w-20 h-20 text-gray-300 mx-auto mb-6" aria-hidden="true" />
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Your cart is empty</h1>
          <p className="text-gray-500 mb-8">
            Start adding sustainable materials to your cart to see them here.
          </p>
          <Link to="/products" className="btn-primary text-base py-3 px-8">
            Shop Now <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-500 mt-1">{itemCount} item{itemCount !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-2">
              {cart.map(item => <CartItem key={item.id} item={item} />)}
            </div>

            <Link
              to="/products"
              className="btn-secondary mt-4 inline-flex"
            >
              <ArrowRight className="w-4 h-4 rotate-180" /> Continue Shopping
            </Link>
          </div>

          {/* Summary */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
              <h2 className="font-bold text-gray-900 text-lg">Order Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal ({itemCount} item{itemCount !== 1 ? 's' : ''})</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping (Standard)</span>
                  <span className="font-medium">{formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>GST ({Math.round(TAX_RATE * 100)}%)</span>
                  <span className="font-medium">{formatPrice(tax)}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                <span className="font-bold text-gray-900">Estimated Total</span>
                <span className="font-bold text-xl text-primary-600">{formatPrice(total)}</span>
              </div>

              <p className="text-xs text-gray-400">
                Final shipping and tax calculated at checkout. Shipping shown is for Standard delivery.
              </p>

              <Link
                to="/checkout"
                className="btn-primary w-full justify-center text-base py-3.5"
              >
                Proceed to Checkout <ArrowRight className="w-5 h-5" />
              </Link>

              <p className="text-xs text-center text-gray-400">
                🔒 Demo checkout — no real payment processed
              </p>
            </div>

            {/* Shipping note */}
            <div className="bg-primary-50 border border-primary-100 rounded-2xl p-4">
              <h3 className="font-semibold text-primary-800 text-sm mb-2">Delivery Options</h3>
              <div className="space-y-1.5">
                {Object.entries(SHIPPING_RATES).map(([key, rate]) => (
                  <div key={key} className="flex justify-between text-xs text-primary-700">
                    <span>{rate.label}</span>
                    <span className="font-semibold">{formatPrice(rate.charge)}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-primary-600 mt-2 italic">Select at checkout</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
