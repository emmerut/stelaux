import { apiSlice } from "../apiSlice";

export const shopApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => "products",
    }),
    getProduct: builder.query({
      query: (id) => `/products/${id}`,
    }),
  }),
});
export const { useGetProductsQuery, useGetProductQuery } = shopApi;
