import { createEntityAdapter, EntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";
import { CartItem } from "../../types/UserProps";

const cartAdapter: EntityAdapter<CartItem, string> = createEntityAdapter({
  selectId: (item) => item._id,
  sortComparer: (a: CartItem, b: CartItem) =>
    b.createdAt.localeCompare(a.createdAt),
});

// Initial state
export const initialState = cartAdapter.getInitialState();
type CartState = typeof initialState;

interface CartQuery {
  userId: string;
}

interface NewCartItem {
  productId: string;
  color: string;
  quantity: number;
  size: string;
}

interface NonTimestampedCartItem {
  _id: string;
  productId: string;
  color: string;
  quantity: number;
  size: string;
}

interface AddCartItemQuery extends CartQuery {
  newItem: NewCartItem;
}

interface UpdateCartItemQuery extends CartQuery {
  updatedItem: NonTimestampedCartItem;
}

interface DeleteCartItemQuery extends CartQuery {
  itemId: string;
}

export const cartApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getCart: build.query<CartState, CartQuery>({
      query: ({ userId }) => ({
        url: `/user/${userId}/cart`,
        headers: {
          Authorization: localStorage.getItem("accessToken") ?? undefined,
        },
      }),
      transformResponse: (responseData: { cart: CartItem[] }) =>
        cartAdapter.setAll(initialState, responseData.cart),
      providesTags: (result) =>
        result
          ? [
              ...result.ids.map((id: string) => ({
                type: "CartItem" as const,
                id,
              })),
              { type: "CartItem", id: "LIST" },
            ]
          : [{ type: "CartItem", id: "LIST" }],
    }),
    AddCartItem: build.mutation<CartState, AddCartItemQuery>({
      query: ({ userId, newItem }) => ({
        url: `/user/${userId}/cart`,
        method: "POST",
        headers: {
          Authorization: localStorage.getItem("accessToken") ?? undefined,
          "Content-Type": "application/json",
        },
        body: newItem,
      }),
      invalidatesTags: [{ type: "CartItem", id: "LIST" }],
    }),
    updateCartItem: build.mutation<CartState, UpdateCartItemQuery>({
      query: ({ userId, updatedItem }) => ({
        url: `/user/${userId}/cart/${updatedItem._id}`,
        method: "PATCH",
        headers: {
          Authorization: localStorage.getItem("accessToken") ?? undefined,
          "Content-Type": "application/json",
        },
        body: updatedItem,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "CartItem", id: arg.updatedItem._id },
      ],
    }),
    deleteCartItem: build.mutation<CartState, DeleteCartItemQuery>({
      query: ({ userId, itemId }) => ({
        url: `/user/${userId}/cart/${itemId}`,
        method: "DELETE",
        headers: {
          Authorization: localStorage.getItem("accessToken") ?? undefined,
        },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "CartItem", id: arg.itemId },
      ],
    }),
    clearCart: build.mutation<CartState, CartQuery>({
      query: ({ userId }) => ({
        url: `/user/${userId}/cart`,
        method: "DELETE",
        headers: {
          Authorization: localStorage.getItem("accessToken") ?? undefined,
        },
      }),
      invalidatesTags: [{ type: "CartItem", id: "LIST" }],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddCartItemMutation,
  useUpdateCartItemMutation,
  useDeleteCartItemMutation,
  useClearCartMutation,
} = cartApi;

export const {
  selectAll: selectAllItems,
  selectById: selectItemById,
  selectIds: selectItemIds,
} = cartAdapter.getSelectors((state) => state.cart);
