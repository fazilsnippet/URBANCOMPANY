import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { toast } from 'react-hot-toast';
import { logout } from '../features/auth/authSlice';

const getCookie = (name) =>
  document.cookie.split('; ').find((r) => r.startsWith(name + '='))?.split('=')[1];

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  credentials: 'include', // send HTTP-only cookie
  prepareHeaders: (headers) => {
    const csrf = getCookie('XSRF-TOKEN'); // if your backend sets it
    if (csrf) headers.set('X-CSRF-Token', csrf);
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error) {
    const status = result.error.status;

    // Auto refresh on 401 if backend supports /auth/refresh
    if (status === 401) {
      const refresh = await rawBaseQuery('/auth/refresh', api, extraOptions);
      if (refresh?.data) {
        result = await rawBaseQuery(args, api, extraOptions);
      } else {
        api.dispatch(logout());
      }
    }

    // Global error toast (skip 404 to avoid noise)
    if (status && status !== 404) {
      const msg =
        result.error?.data?.message ||
        result.error?.error ||
        'Something went wrong';
      toast.error(msg);
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'Auth',
    'User',
    'Address',
    'Product',
    'Category',
    'Cart',
    'Wishlist',
    'Order',
    'Review',
    'Partner',
    'Admin',
  ],
  endpoints: () => ({}),
});