
import { baseApi } from '../../app/baseApi';

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => '/categories',
      providesTags: ['Category'],
    }),
    getProducts: builder.query({
      query: (params) => ({
        url: '/products',
        params, // { page, limit, category, brand, q, minPrice, maxPrice, sort }
      }),
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        // stable key ignoring page to allow merging
        const { page, ...rest } = queryArgs || {};
        return endpointName + JSON.stringify(rest);
      },
      merge: (currentCache, newItems, { arg }) => {
        if (arg?.page === 1) return newItems;
        currentCache.items = [...(currentCache.items || []), ...(newItems.items || [])];
        currentCache.hasMore = newItems.hasMore;
      },
      forceRefetch({ currentArg, previousArg }) {
        // refetch when filters change
        return JSON.stringify(currentArg) !== JSON.stringify(previousArg);
      },
      providesTags: ['Product'],
    }),
    getProductById: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: (res, err, id) => [{ type: 'Product', id }],
    }),
  }),
});

export const { useGetCategoriesQuery, useGetProductsQuery, useGetProductByIdQuery } = productApi;
