import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Trash2, Tag, X, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import CartItem from '../components/CartItem';
import { calcCartTotals, formatPrice, SHIPPING_RATES, TAX_RATE, PROMO_CODES, safeRead, safeWrite } from '../utils/helpers';

const COUPON_STORAGE_KEY = 'ecp_coupon';

export default function CartPage() {
  const { cart, itemCount, clearCart } = useCart();
  const { addToast } = useToast();
  const [couponCode, setCouponCode] = useState(() => safeRead(COUPON_STORAGE_KEY, ''));
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  const { subtotal, shipping, discount, promo, tax, total } = calcCartTotals(cart, 'standard', couponCode);

  useEffect(() => {
    safeWrite(COUPON_STORAGE_KEY, couponCode);
  }, [couponCode]);

  function handleApplyCoupon(codeToApply) {
    const code = (codeToApply || couponInput).trim().toUpperCase();
    if (!code) return;
    if (PROMO_CODES[code]) {
      setCouponCode(code);
      setCouponInput('');
      setCouponError('');
      addToast({ message: `Coupon "${code}" applied successfully!`, type: 'success' });
    } else {
      setCouponError('Invalid coupon code. Try ECO10 or GREENBUILD.');
      addToast({ message: 'Invalid promo code', type: 'error' });
    }
  }

  function handleRemoveCoupon() {
    setCouponCode('');
    setCouponError('');
    addToast({ message: 'Coupon removed', type: 'info' });
  }

  function handleClearCart() {
    if (window.confirm('Are you sure you want to clear all items from your cart?')) {
      clearCart();
      addToast({ message: 'Cart cleared', type: 'info' });
    }
  }

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-16">
        <div className="text-center max-w-md bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-sm">
          <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6 text-primary-600">
            <ShoppingBag className="w-10 h-10" aria-hidden="true" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Your cart is empty</h1>
          <p className="text-gray-500 mb-8 text-sm sm:text-base leading-relaxed">
            Discover India's certified sustainable materials and start adding them to your project build.
          </p>
          <Link to="/products" className="btn-primary text-base py-3 px-8 w-full sm:w-auto justify-center">
            Explore Materials <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-500 text-sm mt-1">{itemCount} material item{itemCount !== 1 ? 's' : ''} in your cart</p>
          </div>
          <button
            type="button"
            onClick={handleClearCart}
            className="text-xs sm:text-sm font-semibold text-gray-500 hover:text-red-600 self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear Cart
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-2 divide-y divide-gray-100">
              {cart.map(item => <CartItem key={item.id} item={item} />)}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <Link
                to="/products"
                className="btn-secondary w-full sm:w-auto justify-center text-sm py-2.5"
              >
                <ArrowRight className="w-4 h-4 rotate-180" /> Continue Shopping
              </Link>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verified sustainable & carbon audited specs</span>
              </div>
            </div>
          </div>

          {/* Summary & Coupons */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
              <h2 className="font-bold text-gray-900 text-lg">Order Summary</h2>

              {/* Promo Code Box */}
              <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200/80 space-y-2.5">
                <label htmlFor="coupon-input" className="block text-xs font-bold uppercase tracking-wider text-gray-600">
                  Promo / Coupon Code
                </label>
                {couponCode ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-emerald-600" />
                      <div>
                        <p className="text-xs font-bold text-emerald-800">{couponCode}</p>
                        <p className="text-[11px] text-emerald-600">{promo?.label}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      aria-label="Remove coupon"
                      className="p-1 text-emerald-600 hover:text-red-600 rounded-full hover:bg-emerald-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-2">
                      <input
                        id="coupon-input"
                        type="text"
                        value={couponInput}
                        onChange={e => {
                          setCouponInput(e.target.value.toUpperCase());
                          setCouponError('');
                        }}
                        placeholder="e.g. ECO10"
                        className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-xs uppercase font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleApplyCoupon()}
                        className="bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                    {couponError && <p className="text-red-500 text-[11px] mt-1">{couponError}</p>}

                    {/* Quick Available Coupons */}
                    <div className="mt-2.5 pt-2 border-t border-gray-200/60">
                      <p className="text-[11px] text-gray-500 mb-1.5">Available project coupons:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {Object.values(PROMO_CODES).map(p => (
                          <button
                            key={p.code}
                            type="button"
                            onClick={() => handleApplyCoupon(p.code)}
                            className="bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-md transition-colors"
                          >
                            + {p.code} ({p.label.split(' ')[0]})
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Price Details */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal ({itemCount} item{itemCount !== 1 ? 's' : ''})</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5" />
                      Discount ({couponCode})
                    </span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-700">
                  <span>Shipping (Standard)</span>
                  <span className="font-medium">
                    {shipping === 0 ? <span className="text-primary-600 font-bold">Free</span> : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>GST ({Math.round(TAX_RATE * 100)}%)</span>
                  <span className="font-medium">{formatPrice(tax)}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                <span className="font-bold text-gray-900">Estimated Total</span>
                <span className="font-bold text-2xl text-primary-600">{formatPrice(total)}</span>
              </div>

              <p className="text-xs text-gray-400">
                Final shipping and delivery preferences can be customized on the checkout screen.
              </p>

              <Link
                to="/checkout"
                className="btn-primary w-full justify-center text-base py-3.5 shadow-md shadow-primary-900/10"
              >
                Proceed to Checkout <ArrowRight className="w-5 h-5" />
              </Link>

              <p className="text-xs text-center text-gray-400">
                🔒 Safe demo checkout — zero credit card information stored
              </p>
            </div>

            {/* Shipping tiers info */}
            <div className="bg-primary-50/80 border border-primary-100 rounded-2xl p-4">
              <h3 className="font-semibold text-primary-900 text-sm mb-2">Pan-India Delivery Speeds</h3>
              <div className="space-y-1.5">
                {Object.entries(SHIPPING_RATES).map(([key, rate]) => (
                  <div key={key} className="flex justify-between text-xs text-primary-800">
                    <span>{rate.label} ({rate.days[0]}–{rate.days[1]} days)</span>
                    <span className="font-bold">{formatPrice(rate.charge)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
