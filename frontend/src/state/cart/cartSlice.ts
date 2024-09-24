import { createEntityAdapter, EntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";
import { CartItem } from "../../types/UserProps";

const cartAdapter: EntityAdapter<CartItem, string> = createEntityAdapter({
  selectId: (item) => item.cartItemId,
  // Uncomment next two lines for sorting based on createdAt
  // sortComparer: (a: CartItem, b: CartItem) =>
  //   b.createdAt.localeCompare(a.createdAt),
});

// Initial state
export const initialState = cartAdapter.getInitialState();

type CartState = typeof initialState;

interface CartQuery {
  userId: string | undefined;
}

interface AddCartItemQuery extends CartQuery {
  newItem: CartItem;
}

interface UpdateCartItemQuery extends CartQuery {
  updatedItem: CartItem;
}

interface DeleteCartItemQuery extends CartQuery {
  itemId: string;
}

export const cartApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getCart: build.query<CartState, CartQuery>({
      query: ({ userId }) => ({
        url: `/user/${userId}/cart`,
        credentials: "include",
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
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: newItem,
      }),
      invalidatesTags: [{ type: "CartItem", id: "LIST" }],
    }),
    updateCartItem: build.mutation<CartState, UpdateCartItemQuery>({
      query: ({ userId, updatedItem }) => ({
        url: `/user/${userId}/cart/${updatedItem._id}`,
        method: "PATCH",
        credentials: "include",
        body: updatedItem,
      }),
      invalidatesTags: () => [{ type: "CartItem", id: "LIST" }],
    }),
    deleteCartItem: build.mutation<CartState, DeleteCartItemQuery>({
      query: ({ userId, itemId }) => ({
        url: `/user/${userId}/cart/${itemId}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "CartItem", id: arg.itemId },
      ],
    }),
    clearCart: build.mutation<CartState, CartQuery>({
      query: ({ userId }) => ({
        url: `/user/${userId}/cart`,
        method: "DELETE",
        credentials: "include",
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
