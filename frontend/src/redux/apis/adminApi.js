
import { baseApi } from '../../app/baseApi';

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({ query: () => '/admin/users', providesTags: ['Admin'] }),
    toggleUser: builder.mutation({
      query: ({ id, banned }) => ({ url: `/admin/users/${id}/ban`, method: 'PATCH', body: { banned } }),
      invalidatesTags: ['Admin'],
    }),
    getAdminOrders: builder.query({ query: () => '/admin/orders', providesTags: ['Admin'] }),
    getCategoriesAdmin: builder.query({ query: () => '/admin/categories' }),
    upsertCategory: builder.mutation({
      query: (body) => ({ url: '/admin/categories', method: 'POST', body }),
      invalidatesTags: ['Category', 'Admin'],
    }),
    getProductsAdmin: builder.query({ query: () => '/admin/products' }),
    upsertProduct: builder.mutation({
      query: (formData) => ({ url: '/admin/products', method: 'POST', body: formData }),
      invalidatesTags: ['Product', 'Admin'],
    }),
    toggleProduct: builder.mutation({
      query: ({ id, active }) => ({ url: `/admin/products/${id}/toggle`, method: 'PATCH', body: { active } }),
      invalidatesTags: ['Product', 'Admin'],
    }),
    getRevenue: builder.query({ query: () => '/admin/analytics/revenue' }),
  }),
});

export const {
  useGetUsersQuery,
  useToggleUserMutation,
  useGetAdminOrdersQuery,
  useGetCategoriesAdminQuery,
  useUpsertCategoryMutation,
  useGetProductsAdminQuery,
  useUpsertProductMutation,
  useToggleProductMutation,
  useGetRevenueQuery,
} = adminApi;
