
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null, // { id, name, email, role, avatar }
  status: 'idle', // 'idle' | 'loading' | 'authenticated'
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setMe: (state, { payload }) => {
      state.user = payload || null;
      state.status = payload ? 'authenticated' : 'idle';
    },
    logout: (state) => {
      state.user = null;
      state.status = 'idle';
    },
  },
});

export const { setMe, logout } = authSlice.actions;
export default authSlice.reducer;
