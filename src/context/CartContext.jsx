import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { safeRead, safeWrite } from '../utils/helpers';

const CartContext = createContext(null);

const STORAGE_KEY = 'ecp_cart';

// ── Reducer ──────────────────────────────────────────────────────────────────

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const existing = state.find(i => i.id === action.product.id);
      if (existing) {
        return state.map(i =>
          i.id === action.product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [
        ...state,
        {
          id: action.product.id,
          name: action.product.name,
          price: action.product.price,
          unit: action.product.unit,
          category: action.product.category,
          image: action.product.images[0]?.url ?? '',
          imageAlt: action.product.images[0]?.alt ?? action.product.name,
          qty: 1,
        },
      ];
    }
    case 'REMOVE':
      return state.filter(i => i.id !== action.id);
    case 'UPDATE_QTY':
      if (action.qty <= 0) return state.filter(i => i.id !== action.id);
      return state.map(i =>
        i.id === action.id ? { ...i, qty: action.qty } : i
      );
    case 'CLEAR':
      return [];
    default:
      return state;
  }
}

// Lazy initializer — reads from localStorage once on first render
function init() {
  return safeRead(STORAGE_KEY, []);
}

// ── Provider ─────────────────────────────────────────────────────────────────

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, undefined, init);

  // Persist every time cart changes
  useEffect(() => {
    safeWrite(STORAGE_KEY, cart);
  }, [cart]);

  const addToCart = useCallback((product) => {
    dispatch({ type: 'ADD', product });
  }, []);

  const removeFromCart = useCallback((id) => {
    dispatch({ type: 'REMOVE', id });
  }, []);

  const updateQty = useCallback((id, qty) => {
    dispatch({ type: 'UPDATE_QTY', id, qty });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR' });
  }, []);

  const itemCount = cart.reduce((acc, i) => acc + i.qty, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
