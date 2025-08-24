import { createSlice } from '@reduxjs/toolkit';

const persisted = JSON.parse(localStorage.getItem('cart') || '[]');

const slice = createSlice({
  name: 'cart',
  initialState: { items: persisted }, // [{productId, name, price, quantity, thumbnail}]
  reducers: {
    addItem: (state, { payload }) => {
      const idx = state.items.findIndex((i) => i.productId === payload.productId);
      if (idx >= 0) state.items[idx].quantity += 1;
      else state.items.push({ ...payload, quantity: 1 });
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    removeItem: (state, { payload }) => {
      state.items = state.items.filter((i) => i.productId !== payload);
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    updateQty: (state, { payload }) => {
      const it = state.items.find((i) => i.productId === payload.productId);
      if (it) it.quantity = Math.max(1, payload.quantity);
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.setItem('cart', '[]');
    },
  },
});

export const { addItem, removeItem, updateQty, clearCart } = slice.actions;