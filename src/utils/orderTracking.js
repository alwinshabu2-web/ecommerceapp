import { safeRead, safeWrite } from './helpers';

export const TRACKING_STORAGE_KEY = 'ecoconstruct_order_tracking';
export const STAGE_DURATION_SECONDS = 20;

export const SIMULATION_STAGES = [
  {
    key: 'placed',
    label: 'Order Placed',
    simulatedLabel: 'Simulated: Order Placed',
    threshold: 0,
    desc: 'Order received and logged in demo system',
  },
  {
    key: 'processing',
    label: 'Processing',
    simulatedLabel: 'Simulated: Processing',
    threshold: 20,
    desc: 'Material quality check & packaging at demo depot',
  },
  {
    key: 'shipped',
    label: 'Shipped',
    simulatedLabel: 'Simulated: Shipped',
    threshold: 40,
    desc: 'Dispatched from central eco-materials warehouse',
  },
  {
    key: 'out_for_delivery',
    label: 'Out for Delivery',
    simulatedLabel: 'Simulated: Out for Delivery',
    threshold: 60,
    desc: 'With simulated delivery vehicle en route to your site',
  },
  {
    key: 'delivered',
    label: 'Delivered',
    simulatedLabel: 'Simulated: Delivered',
    threshold: 80,
    desc: 'Materials safely delivered to site location',
  },
];

export const MAX_SIMULATION_SECONDS = 80;

/**
 * Calculates current stage index (0 to 4) and status based on elapsed seconds.
 */
export function getStageIndex(elapsed) {
  if (elapsed >= 80) return 4;
  if (elapsed >= 60) return 3;
  if (elapsed >= 40) return 2;
  if (elapsed >= 20) return 1;
  return 0;
}

export function getStageData(elapsed) {
  const idx = getStageIndex(elapsed);
  return {
    stageIndex: idx,
    ...SIMULATION_STAGES[idx],
    stageElapsed: elapsed >= 80 ? 20 : elapsed % STAGE_DURATION_SECONDS,
    stageRemaining: elapsed >= 80 ? 0 : STAGE_DURATION_SECONDS - (elapsed % STAGE_DURATION_SECONDS),
  };
}

export function loadAllTracking() {
  return safeRead(TRACKING_STORAGE_KEY, {});
}

export function saveAllTracking(map) {
  safeWrite(TRACKING_STORAGE_KEY, map);
}

/**
 * Initialize or retrieve tracking for a specific order.
 * - Newly placed orders start as 'running' at 0s.
 * - Existing legacy orders without tracking safely initialize as 'paused' at 0s.
 */
export function getInitialTrackingState(order, existingTracking) {
  if (existingTracking && existingTracking[order.id]) {
    return existingTracking[order.id];
  }

  // Check if order was placed within the last 15 seconds (newly placed checkout)
  const isFresh = order.date && Date.now() - new Date(order.date).getTime() < 15000;

  return {
    status: isFresh ? 'Order Placed' : 'Order Placed',
    mode: isFresh ? 'running' : 'paused', // legacy orders start paused
    elapsed: 0,
    lastUpdated: Date.now(),
  };
}
