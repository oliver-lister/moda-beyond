import { apiSlice } from "../api/apiSlice";
import Product from "../../types/ProductProps";

// Updated initial state to include both products and totalCount
interface ProductsState {
  products: Product[];
  totalCount: number;
}

export const initialState: ProductsState = {
  products: [],
  totalCount: 0,
};

export const productsApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getProducts: build.query<ProductsState, string | undefined>({
      query: (searchParams) => ({
        url: `/products/?${searchParams ? searchParams : ""}`,
      }),
      transformResponse: (responseData: {
        products: Product[];
        totalCount: number;
      }) => ({
        products: responseData.products,
        totalCount: responseData.totalCount,
      }),
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
