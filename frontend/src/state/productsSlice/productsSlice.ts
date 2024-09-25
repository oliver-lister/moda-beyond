import { apiSlice } from "../api/apiSlice";
import Product from "../../types/ProductProps";

// Initial state without EntityAdapter
export const initialState: Product[] = [];

export const productsApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getProducts: build.query<Product[], string | undefined>({
      query: (searchParams) => ({
        url: `/products/?${searchParams ? searchParams : ""}`,
      }),
      transformResponse: (responseData: { products: Product[] }) =>
        responseData.products,
      providesTags: [{ type: "Product", id: "LIST" }],
    }),
    getProduct: build.query<Product, string | undefined>({
      query: (productId) => ({
        url: `/products/${productId}`,
      }),
      transformResponse: (responseData: { product: Product }) =>
        responseData.product,
      providesTags: (result, error, arg) => [{ type: "Product", id: arg }],
    }),
  }),
});

export const { useGetProductsQuery, useGetProductQuery } = productsApi;
