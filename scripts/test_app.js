import fs from 'fs';
import path from 'path';
import { products } from '../src/data/products.js';
import {
  generateOrderId,
  formatDateTime,
  calcCartTotals,
  estimateDelivery,
  ORDER_STATUS_STEPS,
  ORDERS_STORAGE_KEY,
} from '../src/utils/helpers.js';

console.log('=============================================');
console.log('🧪 RUNNING ECOCONSTRUCT PRO VALIDATION SUITE');
console.log('=============================================\n');

let pass = 0;
let fail = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✅ PASS: ${message}`);
    pass++;
  } else {
    console.error(`❌ FAIL: ${message}`);
    fail++;
  }
}

// 1. Validate Product Count
assert(products.length === 11, `Product catalog has exactly 11 products (found ${products.length})`);

// 2. Validate Every Product Has 4 Distinct Gallery Images that Exist Locally
products.forEach(p => {
  assert(Array.isArray(p.images) && p.images.length === 4, `${p.name} (${p.id}) has a 4-image gallery`);

  const expectedViews = ['Front View', 'Side View', 'Top View', 'Detail View'];
  const viewLabels = p.images.map(img => img.label);
  const viewsMatch = expectedViews.every(v => viewLabels.includes(v));
  assert(viewsMatch, `${p.name} contains all 4 standard views: ${viewLabels.join(', ')}`);

  p.images.forEach(img => {
    // Check local file existence in public/
    const relPath = img.url.replace(/^\//, '');
    const absPath = path.resolve('public', relPath);
    const exists = fs.existsSync(absPath);
    const size = exists ? fs.statSync(absPath).size : 0;
    assert(exists && size > 5000, `Image asset exists: ${img.url} (${Math.round(size / 1024)} KB)`);
    assert(Boolean(img.alt && img.alt.length > 10), `Alt text is descriptive: "${img.alt}"`);
  });
});

// 3. Validate Fallback SVG exists
const fallbackSvg = path.resolve('public/images/fallback-product.svg');
assert(fs.existsSync(fallbackSvg), 'Fallback product SVG exists at public/images/fallback-product.svg');

// 4. Validate Order ID Generation
const orderId1 = generateOrderId();
const orderId2 = generateOrderId();
assert(orderId1.startsWith('ECO-'), `Generated order ID has prefix ECO-: ${orderId1}`);
assert(orderId1 !== orderId2, `Sequential order IDs are unique: ${orderId1} vs ${orderId2}`);

// 5. Validate Date Formatting
const testISO = '2026-10-13T17:30:00.000Z';
const formatted = formatDateTime(testISO);
assert(formatted.includes('October 2026') || formatted.includes('Oct 2026'), `Formatted date includes month & year: ${formatted}`);

// 6. Validate Totals and Delivery
const sampleCart = [
  { id: 'p001', price: 4200, qty: 2 },
  { id: 'p002', price: 1850, qty: 1 },
];
const totals = calcCartTotals(sampleCart, 'express');
assert(totals.subtotal === 4200 * 2 + 1850, `Subtotal calculation is exact: ₹${totals.subtotal}`);
assert(totals.shipping === 599, `Express delivery rate matches ₹599: ₹${totals.shipping}`);
assert(totals.total > totals.subtotal, `Total includes shipping and tax: ₹${totals.total}`);

const estStd = estimateDelivery('standard');
const estExp = estimateDelivery('express');
assert(Boolean(estStd && estStd !== 'Unknown'), `Standard delivery estimated arrival generated: "${estStd}"`);
assert(Boolean(estExp && estExp !== 'Unknown'), `Express delivery estimated arrival generated: "${estExp}"`);

// 7. Validate Order Status Steps
assert(ORDER_STATUS_STEPS.length === 5, `Order status steps has 5 phases (found ${ORDER_STATUS_STEPS.length})`);
assert(ORDER_STATUS_STEPS[0].label === 'Order Placed', 'First order step is "Order Placed"');
assert(ORDERS_STORAGE_KEY === 'ecoconstruct_orders', `Storage key is ${ORDERS_STORAGE_KEY}`);

console.log('\n=============================================');
console.log(`🏁 TEST RESULTS: ${pass} PASSED, ${fail} FAILED`);
console.log('=============================================\n');

if (fail > 0) process.exit(1);
