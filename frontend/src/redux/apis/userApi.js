
import { baseApi } from '../../app/baseApi';

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateProfile: builder.mutation({
      query: (formData) => ({
        url: '/users/me',
        method: 'PATCH',
        body: formData, // multipart/form-data
      }),
      invalidatesTags: ['User', 'Auth'],
    }),
    getAddresses: builder.query({
      query: () => '/users/addresses',
      providesTags: (res) =>
        res
          ? [
              ...res.map((a) => ({ type: 'Address', id: a.id })),
              { type: 'Address', id: 'LIST' },
            ]
          : [{ type: 'Address', id: 'LIST' }],
    }),
    addAddress: builder.mutation({
      query: (body) => ({ url: '/users/addresses', method: 'POST', body }),
      invalidatesTags: [{ type: 'Address', id: 'LIST' }],
    }),
    updateAddress: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/users/addresses/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (res, err, arg) => [{ type: 'Address', id: arg.id }, { type: 'Address', id: 'LIST' }],
    }),
    deleteAddress: builder.mutation({
      query: (id) => ({ url: `/users/addresses/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'Address', id: 'LIST' }],
    }),
    setDefaultAddress: builder.mutation({
      query: (id) => ({ url: `/users/addresses/${id}/default`, method: 'PATCH' }),
      invalidatesTags: [{ type: 'Address', id: 'LIST' }],
    }),
  }),
});

export const {
  useUpdateProfileMutation,
  useGetAddressesQuery,
  useAddAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useSetDefaultAddressMutation,
} = userApi;
