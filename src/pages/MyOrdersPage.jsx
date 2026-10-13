import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Package,
  Calendar,
  CreditCard,
  Truck,
  MapPin,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  ArrowRight,
  ExternalLink,
  Clock,
  CheckCircle2,
  Play,
  Pause,
  Square,
  RotateCcw,
  Radio,
} from 'lucide-react';
import { getOrders, formatPrice, formatDateTime } from '../utils/helpers';
import {
  SIMULATION_STAGES,
  MAX_SIMULATION_SECONDS,
  getStageData,
  loadAllTracking,
  saveAllTracking,
  getInitialTrackingState,
} from '../utils/orderTracking';

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [trackingMap, setTrackingMap] = useState({});
  const [searchParams] = useSearchParams();

  // 1. Initial Load of Orders and Tracking Map
  useEffect(() => {
    function load() {
      const allOrders = getOrders();
      setOrders(allOrders);

      const savedTracking = loadAllTracking();
      const initializedMap = { ...savedTracking };

      // Ensure every order has an initialized tracking entry
      allOrders.forEach(order => {
        if (!initializedMap[order.id]) {
          initializedMap[order.id] = getInitialTrackingState(order, savedTracking);
        }
      });

      saveAllTracking(initializedMap);
      setTrackingMap(initializedMap);

      // Expand order if requested via URL
      const targetId = searchParams.get('id');
      if (targetId && allOrders.some(o => o.id === targetId)) {
        setExpandedOrderId(targetId);
      } else if (allOrders.length > 0) {
        setExpandedOrderId(curr => curr || allOrders[0].id);
      }
    }

    load();
    window.addEventListener('storage', load);
    return () => window.removeEventListener('storage', load);
  }, [searchParams]);

  // 2. Centralized Safe 1-Second Interval Ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setTrackingMap(prevMap => {
        let hasChanges = false;
        const nextMap = { ...prevMap };

        for (const orderId of Object.keys(nextMap)) {
          const t = nextMap[orderId];
          if (t && t.mode === 'running') {
            const nextElapsed = (t.elapsed || 0) + 1;

            if (nextElapsed >= MAX_SIMULATION_SECONDS) {
              nextMap[orderId] = {
                ...t,
                elapsed: MAX_SIMULATION_SECONDS,
                status: 'Delivered',
                mode: 'completed',
                lastUpdated: Date.now(),
              };
            } else {
              const stageData = getStageData(nextElapsed);
              nextMap[orderId] = {
                ...t,
                elapsed: nextElapsed,
                status: stageData.label,
                lastUpdated: Date.now(),
              };
            }
            hasChanges = true;
          }
        }

        if (hasChanges) {
          saveAllTracking(nextMap);
          return nextMap;
        }
        return prevMap;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Sync state if localStorage is updated externally or across browser tabs
  useEffect(() => {
    function handleStorage(e) {
      if (!e.key || e.key === 'ecoconstruct_order_tracking') {
        setTrackingMap(loadAllTracking());
      }
    }
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  function toggleExpand(id) {
    setExpandedOrderId(curr => (curr === id ? null : id));
  }

  // ── Tracking Control Handlers ──────────────────────────────────────────────

  function handlePause(orderId) {
    setTrackingMap(prev => {
      const curr = prev[orderId] || { status: 'Order Placed', mode: 'running', elapsed: 0 };
      const updated = {
        ...prev,
        [orderId]: { ...curr, mode: 'paused', lastUpdated: Date.now() },
      };
      saveAllTracking(updated);
      return updated;
    });
  }

  function handleResume(orderId) {
    setTrackingMap(prev => {
      const curr = prev[orderId] || { status: 'Order Placed', mode: 'paused', elapsed: 0 };
      const updated = {
        ...prev,
        [orderId]: { ...curr, mode: 'running', lastUpdated: Date.now() },
      };
      saveAllTracking(updated);
      return updated;
    });
  }

  function handleStop(orderId) {
    setTrackingMap(prev => {
      const curr = prev[orderId] || { status: 'Order Placed', mode: 'running', elapsed: 0 };
      const updated = {
        ...prev,
        [orderId]: { ...curr, mode: 'stopped', lastUpdated: Date.now() },
      };
      saveAllTracking(updated);
      return updated;
    });
  }

  function handleRestart(orderId) {
    const confirmed = window.confirm(
      `Restart simulated delivery demo for Order #${orderId}?\n\nThis will reset progress back to "Order Placed" (0s) and restart the 20-second automatic progression.`
    );
    if (!confirmed) return;

    setTrackingMap(prev => {
      const updated = {
        ...prev,
        [orderId]: {
          status: 'Order Placed',
          mode: 'running',
          elapsed: 0,
          lastUpdated: Date.now(),
        },
      };
      saveAllTracking(updated);
      return updated;
    });
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Orders</h1>
            <p className="text-gray-500 text-sm mt-1">
              Track and review all your EcoConstruct Pro material purchases with simulated progress
            </p>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 bg-white border border-gray-200 px-4 py-2.5 rounded-xl shadow-sm hover:border-primary-300 transition-colors self-start sm:self-auto"
          >
            <ShoppingBag className="w-4 h-4" /> Browse Catalogue
          </Link>
        </div>

        {/* Empty State */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-200/80 shadow-sm p-8 sm:p-14 text-center max-w-lg mx-auto">
            <div className="w-20 h-20 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-5 text-primary-600">
              <Package className="w-10 h-10 stroke-[1.75]" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">You haven't placed any orders yet</h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Explore our curated selection of verified sustainable materials — from reclaimed teak to eco-friendly insulation — and place your first demo order.
            </p>
            <Link
              to="/"
              className="btn-primary text-sm sm:text-base py-3 px-8 inline-flex items-center gap-2 shadow-md shadow-primary-700/20"
            >
              Shop Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => {
              const isExpanded = expandedOrderId === order.id;
              const totalItems = (order.items || []).reduce((sum, item) => sum + (item.qty || 1), 0);
              const orderDate = order.formattedDate || formatDateTime(order.date);

              // Get current independent tracking state for this order
              const tracking = trackingMap[order.id] || {
                status: 'Order Placed',
                mode: 'paused',
                elapsed: 0,
              };
              const stageInfo = getStageData(tracking.elapsed || 0);

              // Mode badge styling
              const modeBadge = {
                running: { bg: 'bg-emerald-50 text-emerald-800 border-emerald-200', text: 'Live Auto-Tracking' },
                paused: { bg: 'bg-amber-50 text-amber-800 border-amber-200', text: 'Tracking Paused' },
                stopped: { bg: 'bg-gray-100 text-gray-700 border-gray-200', text: 'Tracking Stopped' },
                completed: { bg: 'bg-blue-50 text-blue-800 border-blue-200', text: 'Delivered (Completed)' },
              }[tracking.mode] || { bg: 'bg-gray-100 text-gray-700 border-gray-200', text: 'Simulated' };

              return (
                <article
                  key={order.id}
                  id={`order-${order.id}`}
                  className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md"
                >
                  {/* Order Card Top Bar */}
                  <div className="bg-gray-50/80 border-b border-gray-200 px-5 sm:px-7 py-4.5">
                    <div className="flex flex-wrap items-center justify-between gap-y-3 gap-x-6 text-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary-100/70 text-primary-700 flex items-center justify-center flex-shrink-0">
                          <Package className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</span>
                            <span className="font-mono font-bold text-gray-900 text-sm sm:text-base">{order.id}</span>
                          </div>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" /> Ordered on {orderDate}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 sm:gap-6 ml-auto">
                        <div className="text-right">
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Order Total</p>
                          <p className="text-lg font-extrabold text-primary-700">{formatPrice(order.total)}</p>
                        </div>

                        {/* Dynamic Simulated Status Badge */}
                        <div className="flex flex-col items-end gap-1">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            {tracking.mode === 'running' && (
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            )}
                            Simulated: {stageInfo.label}
                          </span>
                          <span className={`text-[10px] font-medium px-2 py-0.5 rounded border ${modeBadge.bg}`}>
                            {modeBadge.text}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Preview Content */}
                  <div className="p-5 sm:p-7">
                    {/* Products Row Preview */}
                    <div className="space-y-4">
                      {order.items?.map((item, idx) => (
                        <div
                          key={`${order.id}-${item.id}-${idx}`}
                          className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                        >
                          <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
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
                            <span className="text-xs font-semibold text-primary-600">{item.category}</span>
                            <h3 className="text-sm sm:text-base font-bold text-gray-900 truncate">{item.name}</h3>
                            <p className="text-xs text-gray-500 mt-0.5">
                              Quantity: <span className="font-semibold text-gray-800">{item.qty}</span> · Price: {formatPrice(item.price)} {item.unit || ''}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="font-bold text-gray-900 text-sm sm:text-base">{formatPrice(item.price * item.qty)}</p>
                            <Link
                              to={`/products/${item.id}`}
                              className="text-xs text-primary-600 hover:text-primary-700 hover:underline inline-flex items-center gap-0.5 mt-1"
                            >
                              View Product <ExternalLink className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Meta Highlights & Toggle Button */}
                    <div className="mt-6 pt-5 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-600">
                        <span className="inline-flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-lg text-gray-700 font-medium">
                          <CreditCard className="w-3.5 h-3.5 text-primary-600" />
                          {order.paymentMethod} ({order.paymentStatus || 'Pending'})
                        </span>
                        <span className="inline-flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-lg text-gray-700 font-medium">
                          <Truck className="w-3.5 h-3.5 text-primary-600" />
                          {order.deliveryLabel || 'Standard Delivery'} · Est: {order.estimatedDelivery}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleExpand(order.id)}
                        className="inline-flex items-center gap-1.5 text-sm font-bold text-primary-600 hover:text-primary-700 hover:bg-primary-50 px-3.5 py-2 rounded-xl transition-colors"
                      >
                        {isExpanded ? (
                          <>
                            Hide Order Details <ChevronUp className="w-4 h-4" />
                          </>
                        ) : (
                          <>
                            View Order Details <ChevronDown className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>

                    {/* Expandable Full Order Details Section */}
                    {isExpanded && (
                      <div className="mt-6 pt-6 border-t border-gray-200 space-y-6 animate-fade-in">
                        {/* ── 1. AUTOMATIC SIMULATED PROGRESS TIMELINE & CONTROLS ── */}
                        <div className="bg-gradient-to-br from-emerald-50/50 via-gray-50 to-teal-50/40 border border-primary-200/80 rounded-2xl p-5 sm:p-6 shadow-sm">
                          {/* Simulation Label Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-200">
                            <div>
                              <div className="flex items-center gap-2">
                                <Radio className="w-4 h-4 text-primary-600 animate-pulse" />
                                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                                  Demo Order Tracking – Simulated Delivery Progress
                                </h4>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                Stages advance automatically every 20s (80s total demo duration). Independent timer per order.
                              </p>
                            </div>

                            {/* Mode indicator pill */}
                            <div className="flex items-center gap-2 self-start sm:self-center">
                              <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${modeBadge.bg}`}>
                                {modeBadge.text}
                              </span>
                            </div>
                          </div>

                          {/* Progress Stepper Grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-6 pb-4">
                            {SIMULATION_STAGES.map((step, sIdx) => {
                              const isCompleted = stageInfo.stageIndex > sIdx;
                              const isCurrent = stageInfo.stageIndex === sIdx;

                              return (
                                <div key={step.key} className="flex flex-col items-center text-center">
                                  <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs mb-2 transition-all duration-300 ${
                                      isCompleted
                                        ? 'bg-primary-600 text-white shadow-sm ring-4 ring-primary-100'
                                        : isCurrent
                                        ? 'bg-primary-600 text-white shadow-md ring-4 ring-primary-200 scale-110'
                                        : 'bg-gray-200 text-gray-500'
                                    }`}
                                  >
                                    {isCompleted ? (
                                      <CheckCircle2 className="w-5 h-5 text-white" />
                                    ) : isCurrent ? (
                                      <Clock className="w-5 h-5 text-white animate-spin-slow" />
                                    ) : (
                                      sIdx + 1
                                    )}
                                  </div>
                                  <p
                                    className={`text-xs font-bold leading-tight ${
                                      isCurrent
                                        ? 'text-primary-800'
                                        : isCompleted
                                        ? 'text-primary-600'
                                        : 'text-gray-400'
                                    }`}
                                  >
                                    {step.simulatedLabel}
                                  </p>
                                  <p className="text-[10px] text-gray-500 mt-1 leading-tight line-clamp-2">
                                    {step.desc}
                                  </p>
                                </div>
                              );
                            })}
                          </div>

                          {/* Live Progress Bar & Stage Countdown */}
                          <div className="bg-white/80 border border-gray-200 rounded-xl p-3.5 my-4">
                            <div className="flex items-center justify-between text-xs font-semibold text-gray-700 mb-2">
                              <span>
                                Stage {stageInfo.stageIndex + 1} of 5: <span className="text-primary-700">{stageInfo.simulatedLabel}</span>
                              </span>
                              <span className="font-mono text-gray-500">
                                {tracking.mode === 'completed'
                                  ? '80s / 80s (Delivered)'
                                  : tracking.mode === 'running'
                                  ? `${tracking.elapsed || 0}s / 80s (Next in ${stageInfo.stageRemaining}s)`
                                  : `${tracking.elapsed || 0}s / 80s (${tracking.mode})`}
                              </span>
                            </div>

                            {/* Bar */}
                            <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-primary-600 to-emerald-500 transition-all duration-500 rounded-full"
                                style={{ width: `${Math.min(((tracking.elapsed || 0) / MAX_SIMULATION_SECONDS) * 100, 100)}%` }}
                              />
                            </div>
                          </div>

                          {/* Control Action Buttons */}
                          <div className="flex flex-wrap items-center gap-2.5 pt-2">
                            {/* Running: Pause & Stop */}
                            {tracking.mode === 'running' && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handlePause(order.id)}
                                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-colors"
                                >
                                  <Pause className="w-3.5 h-3.5" /> Pause Tracking
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleStop(order.id)}
                                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-gray-700 hover:bg-gray-800 text-white shadow-sm transition-colors"
                                >
                                  <Square className="w-3.5 h-3.5" /> Stop Auto-Tracking
                                </button>
                              </>
                            )}

                            {/* Paused: Resume, Stop, Restart */}
                            {tracking.mode === 'paused' && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleResume(order.id)}
                                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-primary-600 hover:bg-primary-700 text-white shadow-sm transition-colors"
                                >
                                  <Play className="w-3.5 h-3.5" /> Resume Tracking
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleStop(order.id)}
                                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-gray-700 hover:bg-gray-800 text-white shadow-sm transition-colors"
                                >
                                  <Square className="w-3.5 h-3.5" /> Stop Auto-Tracking
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRestart(order.id)}
                                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 shadow-sm transition-colors"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" /> Restart Demo
                                </button>
                              </>
                            )}

                            {/* Stopped: Resume & Restart */}
                            {tracking.mode === 'stopped' && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleResume(order.id)}
                                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-primary-600 hover:bg-primary-700 text-white shadow-sm transition-colors"
                                >
                                  <Play className="w-3.5 h-3.5" /> Resume Tracking
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRestart(order.id)}
                                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 shadow-sm transition-colors"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" /> Restart Demo
                                </button>
                              </>
                            )}

                            {/* Completed (Delivered): Restart Demo */}
                            {tracking.mode === 'completed' && (
                              <button
                                type="button"
                                onClick={() => handleRestart(order.id)}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-primary-600 hover:bg-primary-700 text-white shadow-sm transition-colors"
                              >
                                <RotateCcw className="w-3.5 h-3.5" /> Restart Demo
                              </button>
                            )}

                            <span className="text-[11px] text-gray-500 ml-auto italic">
                              Persisted in browser localStorage per order ID
                            </span>
                          </div>
                        </div>

                        {/* ── 2. ADDRESSES & DELIVERY / PAYMENT GRID ── */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          {/* Shipping Address */}
                          <div className="bg-gray-50/70 border border-gray-200/80 rounded-2xl p-5 text-sm">
                            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-primary-600" />
                              Shipping Address
                            </h4>
                            <div className="text-gray-700 space-y-1">
                              <p className="font-semibold text-gray-900">{order.contact?.fullName}</p>
                              <p>
                                {order.shippingAddress?.street}
                                {order.shippingAddress?.landmark ? `, ${order.shippingAddress.landmark}` : ''}
                              </p>
                              <p>
                                {order.shippingAddress?.city} — {order.shippingAddress?.pin}
                              </p>
                              <p>{order.shippingAddress?.state}</p>
                              <p className="text-xs text-gray-500 pt-2 border-t border-gray-200 mt-2">
                                📞 {order.contact?.phone} &nbsp;·&nbsp; ✉ {order.contact?.email}
                              </p>
                            </div>
                          </div>

                          {/* Billing & Payment Details */}
                          <div className="bg-gray-50/70 border border-gray-200/80 rounded-2xl p-5 text-sm">
                            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                              <CreditCard className="w-4 h-4 text-primary-600" />
                              Billing & Payment
                            </h4>
                            <div className="text-gray-700 space-y-2">
                              <div>
                                <span className="text-xs text-gray-500 block">Payment Method</span>
                                <span className="font-semibold text-gray-900">{order.paymentMethod}</span>
                              </div>
                              <div>
                                <span className="text-xs text-gray-500 block">Payment Status</span>
                                <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                                  {order.paymentStatus || 'Payment Pending'}
                                </span>
                              </div>
                              <div className="pt-2 border-t border-gray-200 text-xs text-gray-500">
                                <span className="font-medium text-gray-700">Billing Address:</span>{' '}
                                {order.sameAsBilling
                                  ? 'Same as Shipping Address'
                                  : `${order.billingAddress?.street || ''}, ${order.billingAddress?.city || ''} — ${order.billingAddress?.pin || ''}`}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* ── 3. DETAILED FINANCIAL BREAKDOWN ── */}
                        <div className="bg-gray-50/70 border border-gray-200/80 rounded-2xl p-5">
                          <h4 className="font-bold text-gray-900 mb-3 text-sm">Price Breakdown</h4>
                          <div className="space-y-2 text-sm max-w-sm ml-auto">
                            <div className="flex justify-between text-gray-600">
                              <span>Subtotal ({totalItems} item{totalItems !== 1 ? 's' : ''}):</span>
                              <span className="font-medium text-gray-900">{formatPrice(order.subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                              <span>Shipping ({order.deliveryLabel}):</span>
                              <span className="font-medium text-gray-900">{formatPrice(order.deliveryCharge || 0)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                              <span>GST (18%):</span>
                              <span className="font-medium text-gray-900">{formatPrice(order.tax || 0)}</span>
                            </div>
                            <div className="pt-2 border-t border-gray-200 flex justify-between items-center text-base">
                              <span className="font-extrabold text-gray-900">Final Order Total:</span>
                              <span className="font-extrabold text-primary-700 text-lg">
                                {formatPrice(order.total)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="text-xs text-gray-400 text-center italic">
                          🔒 This is a simulated student demonstration order. No actual charge has been made.
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
