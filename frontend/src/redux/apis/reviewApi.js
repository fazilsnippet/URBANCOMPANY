import { baseApi } from '../../app/baseApi';

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReviews: builder.query({
      query: (productId) => `/products/${productId}/reviews`,
      providesTags: (res, err, productId) => [{ type: 'Review', id: productId }],
    }),
    addReview: builder.mutation({
      query: ({ productId, rating, comment }) => ({
        url: `/products/${productId}/reviews`,
        method: 'POST',
        body: { rating, comment },
      }),
      invalidatesTags: (res, err, { productId }) => [{ type: 'Review', id: productId }],
    }),
    updateReview: builder.mutation({
      query: ({ productId, reviewId, rating, comment }) => ({
        url: `/products/${productId}/reviews/${reviewId}`,
        method: 'PUT',
        body: { rating, comment },
      }),
      invalidatesTags: (res, err, { productId }) => [{ type: 'Review', id: productId }],
    }),
    deleteReview: builder.mutation({
      query: ({ productId, reviewId }) => ({
        url: `/products/${productId}/reviews/${reviewId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (res, err, { productId }) => [{ type: 'Review', id: productId }],
    }),
  }),
});

export const { useGetReviewsQuery, useAddReviewMutation, useUpdateReviewMutation, useDeleteReviewMutation } = reviewApi;