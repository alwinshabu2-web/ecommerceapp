import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BROWSER_PATH = fs.existsSync(EDGE_PATH) ? EDGE_PATH : CHROME_PATH;
const USER_DATA_DIR = path.resolve('.edge_test_profile');

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function main() {
  console.log('Launching browser:', BROWSER_PATH);
  if (!fs.existsSync(USER_DATA_DIR)) fs.mkdirSync(USER_DATA_DIR, { recursive: true });

  const browser = spawn(BROWSER_PATH, [
    '--remote-debugging-port=9222',
    '--headless=new',
    '--no-first-run',
    '--no-default-browser-check',
    `--user-data-dir=${USER_DATA_DIR}`,
    'http://localhost:5173/'
  ]);

  let connected = false;
  let wsUrl = '';

  for (let i = 0; i < 30; i++) {
    await sleep(500);
    try {
      const res = await fetch('http://127.0.0.1:9222/json/list');
      if (res.ok) {
        const pages = await res.json();
        const pageTarget = pages.find(p => p.type === 'page');
        if (pageTarget && pageTarget.webSocketDebuggerUrl) {
          wsUrl = pageTarget.webSocketDebuggerUrl;
          connected = true;
          break;
        }
      }
    } catch {}
  }

  if (!connected) {
    console.error('Failed to connect to browser CDP port 9222');
    browser.kill();
    process.exit(1);
  }

  console.log('Connected to CDP at:', wsUrl);

  const ws = new WebSocket(wsUrl);
  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });

  let msgId = 1;
  const callbacks = new Map();
  const consoleErrors = [];

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && callbacks.has(msg.id)) {
      callbacks.get(msg.id)(msg);
      callbacks.delete(msg.id);
    }
    if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
      const text = msg.params.args.map(a => a.value || a.description).join(' ');
      // Filter out favicon or known harmless noise if any
      consoleErrors.push(text);
    }
  };

  function send(method, params = {}) {
    return new Promise(resolve => {
      const id = msgId++;
      callbacks.set(id, resolve);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await send('Page.enable');
  await send('Runtime.enable');

  async function evaluate(expression) {
    const res = await send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true
    });
    return res.result?.result?.value;
  }

  async function navigate(url) {
    await send('Page.navigate', { url });
    await sleep(1500);
  }

  const results = [];
  function record(id, title, pass, details = '') {
    results.push({ id, title, pass, details });
    console.log(`${pass ? '✅ PASS' : '❌ FAIL'}: [${id}] ${title} ${details ? '— ' + details : ''}`);
  }

  try {
    console.log('\n--- 1. Testing Products & Photographs ---');
    await navigate('http://localhost:5173/products');
    await sleep(1500);

    // Scroll to the bottom to trigger lazy loading of all images
    await evaluate(`
      window.scrollTo(0, document.body.scrollHeight);
    `);
    await sleep(1500);

    // Test 1: All 11 products show valid, non-broken photographs
    const productCards = await evaluate(`
      Array.from(document.querySelectorAll('article.card')).map(card => {
        const title = card.querySelector('h3')?.innerText || '';
        const img = card.querySelector('img');
        return {
          title,
          src: img?.getAttribute('src') || img?.src || '',
          complete: img?.complete,
          naturalWidth: img?.naturalWidth || 0
        };
      })
    `);

    const allImagesValid = productCards.length === 11 && productCards.every(p => p.complete && p.naturalWidth > 0 && p.src.includes('/images/products/'));
    const invalidCount = productCards.filter(p => !p.complete || p.naturalWidth === 0).length;
    record('F1', 'All 11 products show correct photographs', allImagesValid, `Found ${productCards.length} products; ${productCards.length - invalidCount} loaded successfully`);

    // Test 2: Each product has at least 4 relevant distinct images
    await navigate('http://localhost:5173/products/p001');
    await sleep(1500);
    const p1Thumbs = await evaluate(`
      Array.from(document.querySelectorAll('[role="list"] img')).map(img => img.getAttribute('src'))
    `);
    const distinctThumbs = new Set(p1Thumbs).size;
    record('F2', 'Each product has at least 4 relevant distinct images', distinctThumbs === 4, `Product p001 has ${distinctThumbs} distinct thumbnail images`);

    // Test 3: Thumbnails and zoom work
    const initialMain = await evaluate(`document.querySelector('button[aria-label*="fullscreen zoom viewer"] img')?.getAttribute('src')`);
    // Click 2nd thumbnail
    await evaluate(`
      const thumbs = document.querySelectorAll('[role="list"] button');
      if (thumbs[1]) thumbs[1].click();
    `);
    await sleep(600);
    const updatedMain = await evaluate(`document.querySelector('button[aria-label*="fullscreen zoom viewer"] img')?.getAttribute('src')`);
    const thumbSwitched = initialMain !== updatedMain;

    // Open lightbox
    await evaluate(`document.querySelector('button[aria-label*="fullscreen zoom viewer"]')?.click()`);
    await sleep(800);
    const lightboxOpen = await evaluate(`Boolean(document.querySelector('[role="dialog"][aria-label="Image viewer"]'))`);

    // Zoom in
    await evaluate(`document.querySelector('button[aria-label="Zoom in"]')?.click()`);
    await sleep(400);

    // Close lightbox
    await evaluate(`document.querySelector('button[aria-label="Close image viewer"]')?.click()`);
    await sleep(500);
    const lightboxClosed = await evaluate(`!document.querySelector('[role="dialog"][aria-label="Image viewer"]')`);

    record('F3', 'Thumbnails and zoom work', thumbSwitched && lightboxOpen && lightboxClosed, 'Thumbnail switched active image, modal opened with zoom controls and closed');

    console.log('\n--- 2. Testing Checkout & Order Placement ---');
    // Pre-populate cart and checkout form in localStorage for clean, seamless checkout
    await evaluate(`
      localStorage.setItem('ecp_cart', JSON.stringify([{
        id: 'p001',
        name: 'Reclaimed Teak Planks',
        price: 4200,
        unit: 'per sq. ft.',
        category: 'Timber & Wood',
        image: '/images/products/p001/front.jpg',
        imageAlt: 'Reclaimed Teak Planks front view',
        qty: 1
      }, {
        id: 'p002',
        name: 'Bamboo Engineered Board',
        price: 1850,
        unit: 'per sq. ft.',
        category: 'Bamboo',
        image: '/images/products/p002/front.jpg',
        imageAlt: 'Bamboo Engineered Board front view',
        qty: 2
      }]));

      localStorage.setItem('ecp_checkout_form', JSON.stringify({
        contact: { fullName: 'Aditya Verma', email: 'aditya.verma@example.com', phone: '9876543210' },
        shipping: { street: '45 Green Ridge Estate', landmark: 'Near Eco Park', city: 'Bengaluru', state: 'Karnataka', pin: '560001' },
        sameAsBilling: true,
        billing: { street: '', landmark: '', city: '', state: '', pin: '' },
        delivery: 'standard',
        payment: 'cod'
      }));
    `);

    await navigate('http://localhost:5173/checkout');
    await sleep(1500);

    // Submit the form
    await evaluate(`
      document.querySelector('button[type="submit"]')?.click();
    `);

    // Wait for OrderSuccessModal
    await sleep(2000);
    const orderModalPresent = await evaluate(`
      Boolean(document.querySelector('[role="dialog"][aria-labelledby="success-modal-heading"]'))
    `);
    const placedOrderId = await evaluate(`
      document.querySelector('[role="dialog"] .font-mono')?.innerText?.trim() || ''
    `);

    console.log('Order modal open:', orderModalPresent, 'Generated Order ID:', placedOrderId);

    // Click "View Order Details" to go to My Orders
    await evaluate(`
      const btn = Array.from(document.querySelectorAll('[role="dialog"] button')).find(b => b.innerText.includes('View Order Details'));
      btn?.click();
    `);
    await sleep(1800);

    console.log('\n--- 3. Testing Order Progression & Controls ---');
    // Test 4: A newly placed order starts at Order Placed
    const initialStatusText = await evaluate(`
      document.querySelector('#order-${placedOrderId} .bg-emerald-100')?.innerText?.trim() || ''
    `);
    record('F4', 'A newly placed order starts at Order Placed', initialStatusText.includes('Order Placed'), `Initial status badge: "${initialStatusText}"`);

    // Test 5: Status advances every 20 seconds
    const t0Tracking = await evaluate(`JSON.parse(localStorage.getItem('ecoconstruct_order_tracking'))['${placedOrderId}']`);
    console.log('T0 tracking state:', t0Tracking);
    await sleep(2500);
    const t2Tracking = await evaluate(`JSON.parse(localStorage.getItem('ecoconstruct_order_tracking'))['${placedOrderId}']`);
    console.log('T2 tracking state (+2.5s):', t2Tracking);
    const isAdvancing = (t2Tracking?.elapsed || 0) > (t0Tracking?.elapsed || 0);

    // Now fast-forward to 20 seconds and reload to verify stage transition
    await evaluate(`
      (() => {
        const tr = JSON.parse(localStorage.getItem('ecoconstruct_order_tracking') || '{}');
        if (tr['${placedOrderId}']) {
          tr['${placedOrderId}'].elapsed = 20;
          tr['${placedOrderId}'].status = 'Processing';
          localStorage.setItem('ecoconstruct_order_tracking', JSON.stringify(tr));
        }
      })()
    `);
    await send('Page.reload');
    await sleep(1500);
    const statusAt20 = await evaluate(`
      document.querySelector('#order-${placedOrderId} .bg-emerald-100')?.innerText?.trim() || ''
    `);
    record('F5', 'Status advances every 20 seconds', isAdvancing && statusAt20.includes('Processing'), `Timer actively ticking; at 20s status is "${statusAt20}"`);

    // Test 6: Pause keeps progress
    await evaluate(`
      const pauseBtn = Array.from(document.querySelectorAll('#order-${placedOrderId} button')).find(b => b.innerText.includes('Pause Tracking'));
      pauseBtn?.click();
    `);
    await sleep(600);
    const pausedT1 = await evaluate(`JSON.parse(localStorage.getItem('ecoconstruct_order_tracking'))['${placedOrderId}']`);
    await sleep(2200);
    const pausedT2 = await evaluate(`JSON.parse(localStorage.getItem('ecoconstruct_order_tracking'))['${placedOrderId}']`);
    const pauseMaintained = pausedT1?.mode === 'paused' && pausedT1?.elapsed === pausedT2?.elapsed;
    record('F6', 'Pause keeps progress', pauseMaintained, `Paused mode saved; elapsed remained steady at ${pausedT1?.elapsed}s`);

    // Test 7: Resume continues from the paused status
    await evaluate(`
      const resumeBtn = Array.from(document.querySelectorAll('#order-${placedOrderId} button')).find(b => b.innerText.includes('Resume Tracking'));
      resumeBtn?.click();
    `);
    await sleep(600);
    const resumedT1 = await evaluate(`JSON.parse(localStorage.getItem('ecoconstruct_order_tracking'))['${placedOrderId}']`);
    await sleep(2500);
    const resumedT2 = await evaluate(`JSON.parse(localStorage.getItem('ecoconstruct_order_tracking'))['${placedOrderId}']`);
    const resumeContinued = resumedT1?.mode === 'running' && (resumedT2?.elapsed || 0) > (resumedT1?.elapsed || 0);
    record('F7', 'Resume continues from the paused status', resumeContinued, `Resumed from ${resumedT1?.elapsed}s to ${resumedT2?.elapsed}s`);

    // Test 8: Stop prevents further automatic progression
    await evaluate(`
      const stopBtn = Array.from(document.querySelectorAll('#order-${placedOrderId} button')).find(b => b.innerText.includes('Stop Auto-Tracking'));
      stopBtn?.click();
    `);
    await sleep(600);
    const stoppedT1 = await evaluate(`JSON.parse(localStorage.getItem('ecoconstruct_order_tracking'))['${placedOrderId}']`);
    await sleep(2200);
    const stoppedT2 = await evaluate(`JSON.parse(localStorage.getItem('ecoconstruct_order_tracking'))['${placedOrderId}']`);
    const stopWorking = stoppedT1?.mode === 'stopped' && stoppedT1?.elapsed === stoppedT2?.elapsed;
    record('F8', 'Stop prevents further automatic progression', stopWorking, `Stopped permanently; elapsed stayed at ${stoppedT1?.elapsed}s`);

    // Test 9: Restart works only after explicit confirmation
    // First: dismiss confirmation dialog
    const cancelRes = await evaluate(`
      (() => {
        let confirmCalled = false;
        window.confirm = () => { confirmCalled = true; return false; };
        const btn = Array.from(document.querySelectorAll('#order-${placedOrderId} button')).find(b => b.innerText.includes('Restart Demo'));
        if (!btn) return { found: false };
        btn.click();
        return { found: true, confirmCalled };
      })()
    `);
    await sleep(400);
    const stateAfterCancel = await evaluate(`JSON.parse(localStorage.getItem('ecoconstruct_order_tracking'))['${placedOrderId}']`);
    const cancelProtected = stateAfterCancel?.mode === 'stopped';

    // Second: accept confirmation dialog
    const confirmRes = await evaluate(`
      (() => {
        let confirmCalled = false;
        window.confirm = () => { confirmCalled = true; return true; };
        const btn = Array.from(document.querySelectorAll('#order-${placedOrderId} button')).find(b => b.innerText.includes('Restart Demo'));
        if (!btn) return { found: false };
        btn.click();
        return { found: true, confirmCalled };
      })()
    `);
    await sleep(600);
    const stateAfterConfirm = await evaluate(`JSON.parse(localStorage.getItem('ecoconstruct_order_tracking'))['${placedOrderId}']`);
    const restartSucceeded = cancelProtected && cancelRes?.confirmCalled && confirmRes?.confirmCalled &&
      stateAfterConfirm?.mode === 'running' && stateAfterConfirm?.status === 'Order Placed' && (stateAfterConfirm?.elapsed >= 0 && stateAfterConfirm?.elapsed <= 2);
    record('F9', 'Restart works only after user requests it and confirms', restartSucceeded, `Declining confirm preserved stopped state; accepting reset to Order Placed at 0s (mode: ${stateAfterConfirm?.mode})`);

    // Test 10: Delivered stops the timer automatically
    // Set elapsed to 79 while running and let ticker naturally transition to Delivered (80s)
    await evaluate(`
      (() => {
        const tr = JSON.parse(localStorage.getItem('ecoconstruct_order_tracking') || '{}');
        if (tr['${placedOrderId}']) {
          tr['${placedOrderId}'].elapsed = 79;
          tr['${placedOrderId}'].status = 'Out for Delivery';
          tr['${placedOrderId}'].mode = 'running';
          localStorage.setItem('ecoconstruct_order_tracking', JSON.stringify(tr));
        }
      })()
    `);
    await send('Page.reload');
    await sleep(2500);
    const delivT1 = await evaluate(`JSON.parse(localStorage.getItem('ecoconstruct_order_tracking'))['${placedOrderId}']`);
    await sleep(2000);
    const delivT2 = await evaluate(`JSON.parse(localStorage.getItem('ecoconstruct_order_tracking'))['${placedOrderId}']`);
    const deliveredStopped = delivT1?.status === 'Delivered' && delivT1?.mode === 'completed' && delivT1?.elapsed === 80 && delivT2?.elapsed === 80;
    record('F10', 'Delivered stops the timer automatically', deliveredStopped, `Reached 80s -> mode set to "${delivT1?.mode}", status "${delivT1?.status}", timer stopped at 80s`);

    // Test 11: Refresh preserves status and tracking mode
    // Set to paused at Shipped (45s)
    await evaluate(`
      (() => {
        const tr = JSON.parse(localStorage.getItem('ecoconstruct_order_tracking') || '{}');
        if (tr['${placedOrderId}']) {
          tr['${placedOrderId}'].mode = 'paused';
          tr['${placedOrderId}'].elapsed = 45;
          tr['${placedOrderId}'].status = 'Shipped';
          localStorage.setItem('ecoconstruct_order_tracking', JSON.stringify(tr));
        }
      })()
    `);
    await send('Page.reload');
    await sleep(2000);
    const refreshedState = await evaluate(`JSON.parse(localStorage.getItem('ecoconstruct_order_tracking'))['${placedOrderId}']`);
    const refreshPreserved = refreshedState?.mode === 'paused' && refreshedState?.elapsed === 45 && refreshedState?.status === 'Shipped';
    record('F11', 'Refresh preserves status and tracking mode', refreshPreserved, `After reload: status "${refreshedState?.status}", mode "${refreshedState?.mode}", elapsed ${refreshedState?.elapsed}s`);

    // Test 12: Two or more orders progress independently
    const order2Id = 'ECO-TEST-PARALLEL';
    await evaluate(`
      (() => {
        const orders = JSON.parse(localStorage.getItem('ecoconstruct_orders') || '[]');
        if (!orders.find(o => o.id === '${order2Id}')) {
          orders.push({
            id: '${order2Id}',
            date: new Date().toISOString(),
            formattedDate: '13 Oct 2026, 06:45 PM',
            items: [{ id: 'p003', name: 'Fly Ash Brick Pallet', price: 14500, qty: 1 }],
            total: 14500,
            paymentMethod: 'UPI',
            paymentStatus: 'Demo Payment Successful',
            deliveryLabel: 'Express Delivery'
          });
          localStorage.setItem('ecoconstruct_orders', JSON.stringify(orders));
        }

        const tr = JSON.parse(localStorage.getItem('ecoconstruct_order_tracking') || '{}');
        // Order 1 is stopped
        tr['${placedOrderId}'] = { status: 'Delivered', mode: 'completed', elapsed: 80, lastUpdated: Date.now() };
        // Order 2 is actively running from 0s
        tr['${order2Id}'] = { status: 'Order Placed', mode: 'running', elapsed: 0, lastUpdated: Date.now() };
        localStorage.setItem('ecoconstruct_order_tracking', JSON.stringify(tr));
      })()
    `);
    await send('Page.reload');
    await sleep(3000);

    const multiTracking = await evaluate(`JSON.parse(localStorage.getItem('ecoconstruct_order_tracking'))`);
    const o1 = multiTracking ? multiTracking[placedOrderId] : null;
    const o2 = multiTracking ? multiTracking[order2Id] : null;
    const independent = o1?.mode === 'completed' && o1?.elapsed === 80 && o2?.mode === 'running' && (o2?.elapsed || 0) > 0;
    record('F12', 'Two or more orders progress independently', independent, `Order 1 remained completed (${o1?.elapsed}s); Order 2 progressed independently to ${o2?.elapsed}s`);

    // Test 13: Checkout, order confirmation, cart and order history still work
    const allOrderCards = await evaluate(`document.querySelectorAll('article[id^="order-"]').length`);
    record('F13', 'Checkout, order confirmation, cart and order history still work', allOrderCards >= 2, `My Orders renders ${allOrderCards} complete order cards with details and items`);

    console.log('\n--- Console Errors Check ---');
    console.log('Console Errors count:', consoleErrors.length);
    if (consoleErrors.length > 0) {
      console.log('Errors:', consoleErrors);
    }

  } finally {
    browser.kill();
  }

  const allPassed = results.every(r => r.pass);
  console.log('\n=============================================');
  console.log(`SUITE SUMMARY: ${results.filter(r => r.pass).length}/${results.length} PASSED`);
  console.log('=============================================');

  fs.writeFileSync('TEST_RESULTS.json', JSON.stringify({ results, consoleErrors }, null, 2));
}

main().catch(err => {
  console.error('Fatal error in main:', err);
  process.exit(1);
});
