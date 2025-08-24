import { baseApi } from '../../app/baseApi';

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (body) => ({ url: '/orders', method: 'POST', body }), // { items, addressId, paymentMethod, paymentMeta }
      invalidatesTags: ['Order'],
    }),
    getOrders: builder.query({
      query: () => '/orders',
      providesTags: ['Order'],
    }),
    createRazorpayOrder: builder.mutation({
      query: (amount) => ({ url: '/payments/razorpay/order', method: 'POST', body: { amount } }),
    }),
    verifyRazorpay: builder.mutation({
      query: (body) => ({ url: '/payments/razorpay/verify', method: 'POST', body }),
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrdersQuery,
  useCreateRazorpayOrderMutation,
  useVerifyRazorpayMutation,
} = orderApi;