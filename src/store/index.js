import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import recentlyViewedReducer from './slices/recentlyViewedSlice';

// Middleware to persist cart and recently viewed to localStorage
const persistenceMiddleware = store => next => action => {
  const result = next(action);
  
  if (action.type.startsWith('cart/')) {
    localStorage.setItem('cart', JSON.stringify(store.getState().cart));
  }
  
  if (action.type.startsWith('recentlyViewed/')) {
    localStorage.setItem('recentlyViewed', JSON.stringify(store.getState().recentlyViewed));
  }
  
  return result;
};

// Load initial cart state from localStorage
const loadCartState = () => {
  try {
    const serializedState = localStorage.getItem('cart');
    if (serializedState === null) {
      return {
        items: [],
        total: 0,
        itemCount: 0
      };
    }
    const parsedState = JSON.parse(serializedState);
    return {
      items: parsedState.items || [],
      total: parsedState.total || 0,
      itemCount: parsedState.itemCount || 0
    };
  } catch (err) {
    console.error('Error loading cart state:', err);
    return {
      items: [],
      total: 0,
      itemCount: 0
    };
  }
};

// Load initial recently viewed state from localStorage
const loadRecentlyViewedState = () => {
  try {
    const serializedState = localStorage.getItem('recentlyViewed');
    if (serializedState === null) {
      return {
        products: []
      };
    }
    const parsedState = JSON.parse(serializedState);
    return {
      products: parsedState.products || []
    };
  } catch (err) {
    console.error('Error loading recently viewed state:', err);
    return {
      products: []
    };
  }
};

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    recentlyViewed: recentlyViewedReducer
  },
  preloadedState: {
    cart: loadCartState(),
    recentlyViewed: loadRecentlyViewedState()
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(persistenceMiddleware)
}); 