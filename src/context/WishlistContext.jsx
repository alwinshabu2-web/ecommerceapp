import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { safeRead, safeWrite } from '../utils/helpers';

const WishlistContext = createContext(null);

const STORAGE_KEY = 'ecoconstruct_wishlist';

function wishlistReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE': {
      const exists = state.some(item => item.id === action.product.id);
      if (exists) {
        return state.filter(item => item.id !== action.product.id);
      }
      return [action.product, ...state];
    }
    case 'ADD': {
      if (state.some(item => item.id === action.product.id)) return state;
      return [action.product, ...state];
    }
    case 'REMOVE': {
      return state.filter(item => item.id !== action.id);
    }
    case 'CLEAR': {
      return [];
    }
    default:
      return state;
  }
}

function init() {
  return safeRead(STORAGE_KEY, []);
}

export function WishlistProvider({ children }) {
  const [wishlist, dispatch] = useReducer(wishlistReducer, undefined, init);

  useEffect(() => {
    safeWrite(STORAGE_KEY, wishlist);
  }, [wishlist]);

  const toggleWishlist = useCallback((product) => {
    dispatch({ type: 'TOGGLE', product });
  }, []);

  const addToWishlist = useCallback((product) => {
    dispatch({ type: 'ADD', product });
  }, []);

  const removeFromWishlist = useCallback((id) => {
    dispatch({ type: 'REMOVE', id });
  }, []);

  const clearWishlist = useCallback(() => {
    dispatch({ type: 'CLEAR' });
  }, []);

  const isInWishlist = useCallback((id) => {
    return wishlist.some(item => item.id === id);
  }, [wishlist]);

  const wishlistCount = wishlist.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        toggleWishlist,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        isInWishlist,
        wishlistCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return ctx;
}
