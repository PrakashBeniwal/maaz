import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  total: 0,
  itemCount: 0
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
   addToCart: (state, action) => {
  const { id, quantity } = action.payload;
  const existingItem = state.items.find(item => item.id === id);

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;

    // Clamp to stock
    existingItem.quantity = Math.min(newQuantity, existingItem.stock);
  } else {
    // Clamp to stock when adding new item
    state.items.push({
      ...action.payload,
      quantity: Math.min(quantity, action.payload.stock)
    });
  }

  // Update totals
  state.itemCount = state.items.reduce((total, item) => total + item.quantity, 0);
  state.total = state.items.reduce(
    (total, item) => total + (parseFloat(item.netPrice) * item.quantity),
    0
  );
},

    
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      state.itemCount = state.items.reduce((total, item) => total + item.quantity, 0);
      state.total = state.items.reduce((total, item) => total + (item.netPrice * item.quantity), 0);
    },
    
  updateQuantity: (state, action) => {
  const { id, quantity } = action.payload;
  const item = state.items.find(item => item.id === id);

  if (item) {
    item.quantity = Math.min(quantity, item.stock);

    state.itemCount = state.items.reduce((total, item) => total + item.quantity, 0);
    state.total = state.items.reduce((total, item) => total + (item.netPrice * item.quantity), 0);
  }
}
,
    
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.itemCount = 0;
    },

    // Add a new reducer to initialize cart from localStorage
    initializeCart: (state, action) => {
      if (action.payload) {
        state.items = action.payload.items || [];
        state.total = action.payload.total || 0;
        state.itemCount = action.payload.itemCount || 0;
      }
    }
  }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, initializeCart } = cartSlice.actions;
export default cartSlice.reducer; 
