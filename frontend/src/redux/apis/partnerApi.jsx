import { baseApi } from '../../app/baseApi';

export const partnerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getServiceProfile: builder.query({
      query: () => '/partner/service',
      providesTags: ['Partner'],
    }),
    upsertServiceProfile: builder.mutation({
      query: (body) => ({ url: '/partner/service', method: 'PUT', body }),
      invalidatesTags: ['Partner'],
    }),
    toggleAvailability: builder.mutation({
      query: (active) => ({ url: '/partner/service/toggle', method: 'PATCH', body: { active } }),
      invalidatesTags: ['Partner'],
    }),
    getBookings: builder.query({
      query: () => '/partner/bookings',
      providesTags: ['Partner'],
    }),
  }),
});

export const { useGetServiceProfileQuery, useUpsertServiceProfileMutation, useToggleAvailabilityMutation, useGetBookingsQuery } = partnerApi;