// ── Price / Cart Utilities ───────────────────────────────────────────────────

export const SHIPPING_RATES = {
  standard: { label: 'Standard Delivery', days: [5, 7], charge: 299 },
  express: { label: 'Express Delivery', days: [2, 3], charge: 599 },
  overnight: { label: 'Overnight Delivery', days: [1, 1], charge: 999 },
};

export const TAX_RATE = 0.18; // 18% GST (illustrative)

/**
 * Calculate cart totals.
 * Returns { subtotal, shipping, tax, total, itemCount }
 */
export function calcCartTotals(items, deliveryKey = 'standard') {
  const itemCount = items.reduce((acc, i) => acc + i.qty, 0);
  const subtotal = items.reduce((acc, i) => acc + i.price * i.qty, 0);
  const shipping = itemCount === 0 ? 0 : (SHIPPING_RATES[deliveryKey]?.charge ?? 299);
  const tax = Math.round((subtotal + shipping) * TAX_RATE);
  const total = subtotal + shipping + tax;
  return { subtotal, shipping, tax, total, itemCount };
}

export const formatPrice = (n) =>
  '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 });

// ── Delivery Date Utilities ──────────────────────────────────────────────────

/** Add business days (skip weekends) */
function addBusinessDays(date, days) {
  const d = new Date(date);
  let added = 0;
  while (added < days) {
    d.setDate(d.getDate() + 1);
    const dow = d.getDay();
    if (dow !== 0 && dow !== 6) added++;
  }
  return d;
}

const MONTHS = [
  'Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec',
];

function fmtDate(d) {
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/**
 * Returns human-readable estimated delivery range string.
 * NOTE: These are sample estimates, not guaranteed delivery dates or services.
 */
export function estimateDelivery(deliveryKey) {
  const rate = SHIPPING_RATES[deliveryKey];
  if (!rate) return 'Unknown';
  const today = new Date();
  const from = addBusinessDays(today, rate.days[0]);
  if (rate.days[0] === rate.days[1]) return fmtDate(from);
  const to = addBusinessDays(today, rate.days[1]);
  return `${fmtDate(from)} – ${fmtDate(to)}`;
}

// ── Form Validation ──────────────────────────────────────────────────────────

export function validateContact(fields) {
  const errors = {};
  if (!fields.fullName?.trim()) errors.fullName = 'Full name is required.';
  else if (fields.fullName.trim().length < 2) errors.fullName = 'Name must be at least 2 characters.';

  if (!fields.email?.trim()) errors.email = 'Email is required.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim()))
    errors.email = 'Please enter a valid email address.';

  if (!fields.phone?.trim()) errors.phone = 'Phone number is required.';
  else if (!/^[6-9]\d{9}$/.test(fields.phone.trim()))
    errors.phone = 'Enter a valid 10-digit Indian mobile number starting with 6-9.';

  return errors;
}

export function validateAddress(fields, prefix = '') {
  const errors = {};
  const k = (f) => `${prefix}${f}`;

  if (!fields[k('street')]?.trim()) errors[k('street')] = 'Street address is required.';
  if (!fields[k('city')]?.trim()) errors[k('city')] = 'City is required.';
  if (!fields[k('state')]?.trim()) errors[k('state')] = 'State is required.';
  if (!fields[k('pin')]?.trim()) errors[k('pin')] = 'PIN code is required.';
  else if (!/^\d{6}$/.test(fields[k('pin')].trim()))
    errors[k('pin')] = 'Enter a valid 6-digit PIN code.';

  return errors;
}

// ── localStorage Helpers ─────────────────────────────────────────────────────

export function safeRead(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function safeWrite(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Quota exceeded or private mode — silently fail
  }
}

export function safeRemove(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

// ── Order Utilities ──────────────────────────────────────────────────────────

export const ORDERS_STORAGE_KEY = 'ecoconstruct_orders';

export const ORDER_STATUS_STEPS = [
  { key: 'placed', label: 'Order Placed', desc: 'Order received and confirmed' },
  { key: 'processing', label: 'Processing', desc: 'Material inspection & packing' },
  { key: 'shipped', label: 'Shipped', desc: 'Dispatched from eco-warehouse' },
  { key: 'out_for_delivery', label: 'Out for Delivery', desc: 'With local courier partner' },
  { key: 'delivered', label: 'Delivered', desc: 'Delivered to your job site' },
];

export function generateOrderId() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ECO-${yyyy}${mm}${dd}-${random}`;
}

export function formatDateTime(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return isoString;
  const datePart = d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const timePart = d.toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  return `${datePart}, ${timePart}`;
}

export function getOrders() {
  const primary = safeRead(ORDERS_STORAGE_KEY, null);
  if (Array.isArray(primary)) return primary;
  const legacy = safeRead('ecp_orders', []);
  if (Array.isArray(legacy) && legacy.length > 0) {
    safeWrite(ORDERS_STORAGE_KEY, legacy);
    return legacy;
  }
  return [];
}

export function getOrder(orderId) {
  const orders = getOrders();
  return orders.find(o => o.id === orderId) || null;
}

export function saveOrder(order) {
  const orders = getOrders();
  // Prevent duplicate insertion if order already saved
  const existingIdx = orders.findIndex(o => o.id === order.id);
  let updated;
  if (existingIdx >= 0) {
    updated = [...orders];
    updated[existingIdx] = order;
  } else {
    // Newest order first
    updated = [order, ...orders];
  }
  safeWrite(ORDERS_STORAGE_KEY, updated);
  safeWrite('ecp_orders', updated); // keep in sync
  return updated;
}

// ── Indian States ────────────────────────────────────────────────────────────
export const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh',
  'Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka',
  'Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram',
  'Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana',
  'Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
  'Andaman and Nicobar Islands','Chandigarh','Dadra and Nagar Haveli and Daman and Diu',
  'Delhi','Jammu & Kashmir','Ladakh','Lakshadweep','Puducherry',
];
