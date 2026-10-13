import { useParams, Link } from 'react-router-dom';
import { CheckCircle, ShoppingBag, MapPin, CreditCard, Truck, Package, ArrowRight } from 'lucide-react';
import { getOrder, formatPrice } from '../utils/helpers';

export default function OrderConfirmationPage() {
  const { orderId } = useParams();
  const order = getOrder(orderId);

  if (!order) {
    return (
      <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <Package className="w-20 h-20 text-gray-300 mx-auto mb-6" aria-hidden="true" />
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Order not found</h1>
        <p className="text-gray-500 mb-2">
          The order ID <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">{orderId}</code> could not be found.
        </p>
        <p className="text-gray-400 text-sm mb-6">
          This can happen if the order was placed in a different browser session.
        </p>
        <Link to="/" className="btn-primary">Go to Homepage</Link>
      </main>
    );
  }

  const orderDate = new Date(order.date).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  const addr = order.shippingAddress;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Success header */}
      <div className="bg-primary-600">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <CheckCircle className="w-10 h-10 text-primary-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
            Order Placed Successfully!
          </h1>
          <p className="text-primary-100 text-lg mb-4">
            Thank you, {order.contact.fullName}! Your demo order has been received.
          </p>
          <div className="inline-block bg-white/15 rounded-xl px-6 py-3">
            <p className="text-xs text-primary-200 uppercase tracking-wide">Order Number</p>
            <p className="text-xl font-bold text-white mt-1">{order.id}</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        {/* Demo notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <Package className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">
            <strong>College Project Demo:</strong> This is a simulated order. No real product has been purchased,
            no real payment has been processed, and no real delivery will occur.
          </p>
        </div>

        {/* Order meta */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-900 text-lg mb-4">Order Details</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wide">Order Date</p>
              <p className="font-semibold text-gray-900 mt-1">{orderDate}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wide">Payment</p>
              <p className="font-semibold text-gray-900 mt-1">{order.paymentMethod}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wide">Delivery</p>
              <p className="font-semibold text-gray-900 mt-1">{order.deliveryLabel}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wide">Est. Arrival</p>
              <p className="font-semibold text-gray-900 mt-1">{order.estimatedDelivery}</p>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary-600" />
            Items Ordered ({order.items.reduce((a, i) => a + i.qty, 0)})
          </h2>
          <div className="space-y-4">
            {order.items.map(item => (
              <div key={item.id} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
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
                  <p className="text-xs text-primary-600 font-medium">{item.category}</p>
                  <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{formatPrice(item.price)} × {item.qty}</p>
                </div>
                <p className="font-bold text-gray-900 text-sm">{formatPrice(item.price * item.qty)}</p>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="mt-5 pt-4 border-t border-gray-200 space-y-2 text-sm">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal</span>
              <span className="font-medium">{formatPrice(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Discount {order.couponCode ? `(${order.couponCode})` : ''}</span>
                <span>-{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-700">
              <span>Shipping ({order.deliveryLabel})</span>
              <span className="font-medium">{formatPrice(order.deliveryCharge)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>GST (18%)</span>
              <span className="font-medium">{formatPrice(order.tax)}</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-gray-200">
              <span className="font-bold text-gray-900 text-base">Total Paid</span>
              <span className="font-bold text-xl text-primary-600">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Shipping address */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary-600" />
            Shipping Address
          </h2>
          <div className="text-sm text-gray-700 space-y-1">
            <p className="font-semibold text-gray-900">{order.contact.fullName}</p>
            <p>{addr.street}{addr.landmark ? `, ${addr.landmark}` : ''}</p>
            <p>{addr.city} — {addr.pin}</p>
            <p>{addr.state}</p>
            <p className="text-gray-500 mt-2">
              📞 {order.contact.phone} &nbsp;·&nbsp; ✉ {order.contact.email}
            </p>
          </div>
        </div>

        {/* Delivery & payment recap */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-3">
            <Truck className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Delivery Method</p>
              <p className="font-semibold text-gray-900 mt-0.5">{order.deliveryLabel}</p>
              <p className="text-sm text-gray-500">Est. {order.estimatedDelivery}</p>
              <p className="text-xs text-gray-400 italic mt-1">Sample estimate only</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-3">
            <CreditCard className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Payment Method</p>
              <p className="font-semibold text-gray-900 mt-0.5">{order.paymentMethod}</p>
              <p className="text-xs text-amber-600 mt-1 font-medium">Demo — no real charge made</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link to={`/orders?id=${order.id}`} className="btn-secondary text-base py-3 px-8 w-full sm:w-auto justify-center">
            <Package className="w-5 h-5" /> View in My Orders
          </Link>
          <Link to="/products" className="btn-primary text-base py-3 px-8 w-full sm:w-auto justify-center">
            Continue Shopping <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
        <p className="text-xs text-gray-400 text-center mt-3">
          Order reference: <strong>{order.id}</strong> · Saved to your browser history
        </p>
      </div>
    </main>
  );
}
