import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: []
};

export const recentlyViewedSlice = createSlice({
  name: 'recentlyViewed',
  initialState,
  reducers: {
    addToRecentlyViewed: (state, action) => {
      const product = action.payload;
      const now = Date.now();
      // Check if product already exists in the list
      const existingIndex = state.products.findIndex(item => item.id === product.id);
      
      // If it exists, remove it (to add it back at the front)
      if (existingIndex !== -1) {
        state.products.splice(existingIndex, 1);
      }
      
        // Add with timestamp
  state.products.unshift({ ...product, viewedAt: now });
  
      // Keep only the last 6 items
      if (state.products.length > 6) {
        state.products = state.products.slice(0, 6);
      }
    },
    clearRecentlyViewed: (state) => {
      state.products = [];
    },
    removeExpiredRecentlyViewed: (state) => {
  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000; // 24 hours in ms
  state.products = state.products.filter(item => item.viewedAt > oneDayAgo);
}

  }
});

export const { addToRecentlyViewed, clearRecentlyViewed,removeExpiredRecentlyViewed } = recentlyViewedSlice.actions;

export default recentlyViewedSlice.reducer; 
